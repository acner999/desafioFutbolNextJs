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
    const userRes = await client.query('SELECT id, email_verified FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) return NextResponse.json({ ok: true });

    const user = userRes.rows[0];
    if (user.email_verified) return NextResponse.json({ ok: true, message: 'already verified' });

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    await client.query('INSERT INTO email_verifications (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id, token, expiresAt]);

    const from = process.env.EMAIL_FROM || 'no-reply@localhost';
    const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    // Send mail via local sendmail
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Verifica tu correo — TorneoApp',
      text: `Para verificar tu correo, visita: ${verifyUrl}`,
      html: `<p>Para verificar tu correo, haz click <a href="${verifyUrl}">aquí</a>.</p>`,
    });

    // Return ok (do not return token in production). For local debug, include token when DEV_SHOW_TOKENS=true
    const response: any = { ok: true };
    if (process.env.DEV_SHOW_TOKENS === 'true') response.token = token;
    return NextResponse.json(response);
  } finally {
    client.release();
  }
}
