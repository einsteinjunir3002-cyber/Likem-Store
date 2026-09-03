import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifyOtpTicket, signCustomerToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { fullName, phone, email, password, otpCode, otpToken } = await req.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { error: 'Full name, phone number, and password are required' },
        { status: 400 }
      );
    }

    const trimmedPhone = phone.trim();
    const trimmedEmail = email ? email.trim().toLowerCase() : null;

    // Check if phone or email already registered
    const existing = await prisma.customer.findFirst({
      where: {
        OR: [
          { phone: trimmedPhone },
          ...(trimmedEmail ? [{ email: trimmedEmail }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this phone number or email address already exists' },
        { status: 400 }
      );
    }

    // If email is provided, verify OTP
    if (trimmedEmail) {
      if (!otpCode || !otpToken) {
        return NextResponse.json(
          { error: 'Email verification code (OTP) is required to verify email ownership' },
          { status: 400 }
        );
      }

      const isOtpValid = verifyOtpTicket(trimmedEmail, otpCode.trim(), otpToken);
      if (!isOtpValid) {
        return NextResponse.json(
          { error: 'Invalid or expired 6-digit email verification code. Please check the code or request a new one.' },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        fullName: fullName.trim(),
        phone: trimmedPhone,
        email: trimmedEmail,
        passwordHash,
      },
    });

    // Sign in user immediately
    const customerToken = signCustomerToken({
      customerId: customer.id,
      email: customer.email || '',
      fullName: customer.fullName,
      role: 'CUSTOMER',
    });

    const response = NextResponse.json({
      success: true,
      user: { id: customer.id, fullName: customer.fullName, phone: customer.phone, email: customer.email },
      message: 'Account successfully registered and verified!',
    });

    response.cookies.set('likem_customer_token', customerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
