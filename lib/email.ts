/**
 * Transactional email service using Resend API.
 */

interface SendOtpOptions {
  to: string;
  code: string;
  storeName?: string;
}

export async function sendOtpEmail({
  to,
  code,
  storeName = 'The Likem Perfumery',
}: SendOtpOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured; email dispatch skipped.');
    return { success: false, error: 'Email service is not configured' };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || `${storeName} <onboarding@resend.dev>`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code - ${storeName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050508; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #050508; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background: #0c0e18; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px; padding: 40px 30px; text-align: center;">
          
          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="font-size: 22px; font-weight: 700; letter-spacing: 0.15em; color: #d4af37; text-transform: uppercase;">
                ✦ ${storeName} ✦
              </div>
              <div style="font-size: 11px; letter-spacing: 0.25em; color: #94a3b8; text-transform: uppercase; margin-top: 4px;">
                Haute Parfumerie · Ghana
              </div>
            </td>
          </tr>

          <!-- Main Notice -->
          <tr>
            <td style="padding-bottom: 20px;">
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 12px 0;">Verify Your Email Address</h1>
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">
                Thank you for creating an account with ${storeName}. Use the verification security code below to activate your account:
              </p>
            </td>
          </tr>

          <!-- OTP Code Box -->
          <tr>
            <td align="center" style="padding: 24px 0;">
              <div style="display: inline-block; background: #050508; border: 1px solid rgba(212, 175, 55, 0.5); border-radius: 14px; padding: 16px 36px;">
                <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.35em; color: #d4af37;">
                  ${code}
                </span>
              </div>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td style="padding-top: 10px; padding-bottom: 24px;">
              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0;">
                This code is valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid rgba(212, 175, 55, 0.15); padding-top: 20px; color: #475569; font-size: 11px;">
              <p style="margin: 0;">Authentic luxury perfumes with nationwide delivery across Ghana.</p>
              <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} ${storeName}. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject: `${code} is your verification code for ${storeName}`,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: data.message || 'Failed to dispatch email' };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Email dispatch network error:', err);
    return { success: false, error: err.message };
  }
}
