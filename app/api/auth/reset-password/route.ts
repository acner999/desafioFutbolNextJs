import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: 'token and password required' }, { status: 400 });

  const client = await pool.connect();
  try {
    const now = new Date();
    const pr = await client.query('SELECT user_id FROM password_resets WHERE token = $1 AND expires_at > $2', [token, now]);
    if (pr.rowCount === 0) return NextResponse.json({ error: 'invalid or expired token' }, { status: 400 });

    const userId = pr.rows[0].user_id;
    const hash = await bcrypt.hash(password, 10);
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId]);
    await client.query('DELETE FROM password_resets WHERE user_id = $1', [userId]);

    return NextResponse.json({ ok: true });
  } finally {
    client.release();
  }
}
