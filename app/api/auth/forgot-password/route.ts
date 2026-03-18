import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const client = await pool.connect();
  try {
    const userRes = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) {
      // For security, respond 200 even if not found
      return NextResponse.json({ ok: true });
    }

    const userId = userRes.rows[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await client.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    // TODO: send email with token link. For now return token for local testing
    return NextResponse.json({ ok: true, token });
  } finally {
    client.release();
  }
}
