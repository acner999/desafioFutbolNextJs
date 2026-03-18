import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const teamId = url.searchParams.get('teamId');
  if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 });

  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const client = await pool.connect();
  try {
    // verify user is part of team or has manager/president role
    const u = await client.query('SELECT id, role, team_id FROM users WHERE email = $1 LIMIT 1', [session.user.email]);
    if (u.rowCount === 0) return NextResponse.json({ error: 'user not found' }, { status: 404 });
    const user = u.rows[0];
    if (Number(user.team_id) !== Number(teamId) && !['president','manager'].includes(user.role)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const res = await client.query('SELECT id, invitee_email, role, status, created_at, expires_at FROM team_invites WHERE team_id = $1 ORDER BY created_at DESC', [teamId]);
    return NextResponse.json({ invites: res.rows });
  } finally {
    client.release();
  }
}
