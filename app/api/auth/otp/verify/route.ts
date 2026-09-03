import { NextResponse } from 'next/server';
import { verifyOtpTicket, signAdminToken, signCustomerToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, code, token } = await req.json();

    if (!email || !code || !token) {
      return NextResponse.json({ error: 'Email, verification code, and token are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCode = code.trim();

    // Verify cryptographic OTP ticket
    const isValid = verifyOtpTicket(trimmedEmail, trimmedCode, token);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please check the code or request a new one.' },
        { status: 400 }
      );
    }

    // 1. Check if matching AdminUser
    const admin = await prisma.adminUser.findFirst({
      where: {
        email: { equals: trimmedEmail, mode: 'insensitive' },
      },
    });

    if (admin) {
      const adminToken = signAdminToken({
        userId: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });

      const response = NextResponse.json({
        success: true,
        role: 'ADMIN',
        redirectUrl: '/admin',
        user: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      });

      response.cookies.set('likem_admin_token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // 2. Check or provision Customer account
    let customer = await prisma.customer.findFirst({
      where: {
        email: { equals: trimmedEmail, mode: 'insensitive' },
      },
    });

    if (!customer) {
      // Auto-provision secure customer account with email prefix as name
      const namePart = trimmedEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const tempPhone = `otp_${Date.now()}`;

      try {
        customer = await prisma.customer.create({
          data: {
            email: trimmedEmail,
            fullName: formattedName,
            phone: tempPhone,
          },
        });
      } catch {
        // Fallback in case of unique constraints
        customer = await prisma.customer.findFirst({
          where: { email: { equals: trimmedEmail, mode: 'insensitive' } },
        });
      }
    }

    const customerName = customer?.fullName || 'Valued Client';
    const customerId = customer?.id || 'customer-verified';

    const customerToken = signCustomerToken({
      customerId,
      email: trimmedEmail,
      fullName: customerName,
      role: 'CUSTOMER',
    });

    const response = NextResponse.json({
      success: true,
      role: 'CUSTOMER',
      redirectUrl: '/',
      user: { id: customerId, email: trimmedEmail, fullName: customerName },
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
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
