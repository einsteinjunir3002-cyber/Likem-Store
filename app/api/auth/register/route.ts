import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { fullName, phone, email, password } = await req.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json({ error: 'Full name, phone number, and password are required' }, { status: 400 });
    }

    const existing = await prisma.customer.findFirst({
      where: {
        OR: [
          { phone: phone.trim() },
          ...(email ? [{ email: email.trim() }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this phone number or email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: customer.id, fullName: customer.fullName, phone: customer.phone },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
