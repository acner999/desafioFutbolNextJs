import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 });

  const client = await pool.connect();
  try {
    const now = new Date();
    const res = await client.query('SELECT user_id FROM email_verifications WHERE token = $1 AND expires_at > $2', [token, now]);
    if (res.rowCount === 0) return NextResponse.json({ error: 'invalid or expired token' }, { status: 400 });

    const userId = res.rows[0].user_id;
    await client.query('UPDATE users SET email_verified = TRUE WHERE id = $1', [userId]);
    await client.query('DELETE FROM email_verifications WHERE user_id = $1', [userId]);

    return NextResponse.json({ ok: true });
  } finally {
    client.release();
  }
}
