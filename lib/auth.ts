import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const AUTH_SECRET = process.env.AUTH_SECRET || 'likem_secret_perfume_store_ghana_jwt_2026_super_secure_key';

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
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

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('likem_admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
