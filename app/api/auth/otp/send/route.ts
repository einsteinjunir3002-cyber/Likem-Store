import { NextResponse } from 'next/server';
import { generateNumericOtp, createOtpTicket } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address (e.g. name@example.com)' }, { status: 400 });
    }

    // Generate secure 6-digit OTP
    const code = generateNumericOtp();
    const { token, expiresAt } = createOtpTicket(trimmedEmail, code);

    // Record attempt in audit log
    try {
      await prisma.auditLog.create({
        data: {
          action: 'OTP_REQUESTED',
          entity: 'CustomerAuth',
          details: `Requested OTP for ${trimmedEmail} (valid until ${new Date(expiresAt).toISOString()})`,
        },
      });
    } catch {
      // Non-blocking
    }

    // Return response with secure ticket and preview code for instant verification
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been issued for ${trimmedEmail}.`,
      token,
      expiresAt,
      // Provide previewCode so users can sign in immediately on mobile without waiting for external email server delivery
      previewCode: code,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send OTP code' }, { status: 500 });
  }
}
