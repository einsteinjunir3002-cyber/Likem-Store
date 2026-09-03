import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'likem_secret_perfume_store_ghana_jwt_2026_super_secure_key';

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface CustomerSession {
  customerId: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER';
}

export function signAdminToken(payload: AdminSession): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export function signCustomerToken(payload: CustomerSession): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '30d' });
}

export function verifyCustomerToken(token: string): CustomerSession | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as CustomerSession;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('likem_admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// ==========================================
// SECURE OTP GENERATION & VERIFICATION
// ==========================================

export function generateNumericOtp(): string {
  // Generate cryptographically secure 6-digit numeric OTP (100000 - 999999)
  const buffer = crypto.randomBytes(4);
  const num = (buffer.readUInt32BE(0) % 900000) + 100000;
  return num.toString();
}

export function createOtpTicket(email: string, code: string): { token: string; expiresAt: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Hash code + email + secret
  const hash = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${normalizedEmail}:${code}:${expiresAt}`)
    .digest('hex');

  const payload = {
    email: normalizedEmail,
    hash,
    expiresAt,
  };

  const token = jwt.sign(payload, AUTH_SECRET, { expiresIn: '10m' });
  return { token, expiresAt };
}

export function verifyOtpTicket(email: string, code: string, token: string): boolean {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const payload = jwt.verify(token, AUTH_SECRET) as { email: string; hash: string; expiresAt: number };

    if (payload.email !== normalizedEmail) return false;
    if (Date.now() > payload.expiresAt) return false;

    const expectedHash = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(`${normalizedEmail}:${code.trim()}:${payload.expiresAt}`)
      .digest('hex');

    // Constant-time buffer compare
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    const actualBuf = Buffer.from(payload.hash, 'hex');

    if (expectedBuf.length !== actualBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}
