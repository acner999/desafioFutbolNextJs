import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const transporter = nodemailer.createTransport({ sendmail: true, newline: 'unix', path: process.env.SENDMAIL_PATH || '/usr/sbin/sendmail' });

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

    const from = process.env.EMAIL_FROM || 'no-reply@localhost';
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Restablecer contraseña — TorneoApp',
      text: `Sigue este enlace para restablecer tu contraseña: ${resetUrl}`,
      html: `<p>Sigue este enlace para restablecer tu contraseña: <a href="${resetUrl}">restablecer contraseña</a></p>`,
    });

    const response: any = { ok: true };
    if (process.env.DEV_SHOW_TOKENS === 'true') response.token = token;
    return NextResponse.json(response);
  } finally {
    client.release();
  }
}
