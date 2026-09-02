import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signAdminToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Username/email and password required' }, { status: 400 });
    }

    const trimmedInput = email.trim();

    // 1. Check if matching Admin / Owner User (case-insensitive for username/email)
    let admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: { equals: trimmedInput, mode: 'insensitive' } },
          { name: { equals: trimmedInput, mode: 'insensitive' } },
        ],
      },
    });

    if (admin) {
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (valid) {
        const token = signAdminToken({
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

        response.cookies.set('likem_admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return response;
      }
    }

    // 2. Check if matching Customer Account
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: { equals: trimmedInput, mode: 'insensitive' } },
          { phone: { equals: trimmedInput } },
        ],
      },
    });

    if (customer && customer.passwordHash) {
      const valid = await bcrypt.compare(password, customer.passwordHash);
      if (valid) {
        return NextResponse.json({
          success: true,
          role: 'CUSTOMER',
          redirectUrl: '/',
          user: { id: customer.id, fullName: customer.fullName, phone: customer.phone },
        });
      }
    }

    return NextResponse.json({ error: 'Invalid credentials. Please check your username/email and password.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
