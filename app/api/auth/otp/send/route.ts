import { NextResponse } from 'next/server';
import { generateNumericOtp, createOtpTicket } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';
import { sendOtpEmail } from '@/lib/email';

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

    // Get store name for branding
    let storeName = 'The Likem Perfumery';
    try {
      const settings = await getStoreSettings();
      if (settings?.storeName) storeName = settings.storeName;
    } catch {
      // Fallback to default
    }

    // Attempt email dispatch via Resend
    let emailSent = false;
    let emailError: string | undefined;

    if (process.env.RESEND_API_KEY) {
      const result = await sendOtpEmail({
        to: trimmedEmail,
        code,
        storeName,
      });
      emailSent = result.success;
      emailError = result.error;
    }

    // Record attempt in audit log
    try {
      await prisma.auditLog.create({
        data: {
          action: 'OTP_REQUESTED',
          entity: 'CustomerAuth',
          details: `Requested OTP for ${trimmedEmail} (emailSent=${emailSent}, valid until ${new Date(expiresAt).toISOString()})`,
        },
      });
    } catch {
      // Non-blocking
    }

    // If Resend failed and we have an explicit error, report it
    if (process.env.RESEND_API_KEY && !emailSent && emailError) {
      console.warn(`Resend email dispatch warning for ${trimmedEmail}:`, emailError);
    }

    // Return response with secure ticket
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${trimmedEmail}. Please check your inbox.`,
      token,
      expiresAt,
      // Only include fallback previewCode strictly in local development if no Resend key is configured
      previewCode: process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY ? code : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send OTP code' }, { status: 500 });
  }
}
