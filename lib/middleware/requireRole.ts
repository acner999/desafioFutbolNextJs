import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authOptions from '../api/auth/[...nextauth]/options';

export default async function requireRole(req: NextRequest, role: string) {
  const session = await getServerSession(authOptions as any);
  if (!session) return NextResponse.redirect(new URL('/auth/login', req.url));
  if (!session.user || session.user.role !== role) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  return null;
}
