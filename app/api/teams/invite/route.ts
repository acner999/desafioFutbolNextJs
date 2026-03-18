import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const transporter = nodemailer.createTransport({ sendmail: true, newline: 'unix', path: process.env.SENDMAIL_PATH || '/usr/sbin/sendmail' });

export async function POST(req: Request) {
  const body = await req.json();
  const { teamId, inviteeEmail, role = 'player', inviteeName, inviteeNumber, inviteePosition } = body;
  if (!teamId || !inviteeEmail) return NextResponse.json({ error: 'missing fields' }, { status: 400 });

  // Validate session and inviter permissions
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const client = await pool.connect();
  try {
    // find inviter user (case-insensitive email match)
    const inviterEmail = (session.user.email || '').toLowerCase().trim();
    let inviterRes = await client.query('SELECT id, role, team_id, email FROM users WHERE LOWER(email) = $1 LIMIT 1', [inviterEmail]);
    if (inviterRes.rowCount === 0) {
      // create a minimal user record for the authenticated session so invites can be created
      const up = await client.query(
        `INSERT INTO users (email, name, role, team_id) VALUES ($1,$2,$3,$4)
         ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
         RETURNING id, role, team_id, email`,
        [inviterEmail, session.user.name || null, (session.user.role || 'normal'), session.user.teamId || null]
      )
      inviterRes = up
    }
    const inviter = inviterRes.rows[0];

    // check inviter is president or manager of the team (case-insensitive role)
    if (!['president', 'manager'].includes((inviter.role || '').toLowerCase()) || Number(inviter.team_id) !== Number(teamId)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    // check team exists
    const t = await client.query('SELECT id, name FROM teams WHERE id = $1', [teamId]);
    if (t.rowCount === 0) return NextResponse.json({ error: 'team not found' }, { status: 404 });

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const res = await client.query(
      `INSERT INTO team_invites (team_id, inviter_user_id, invitee_email, invitee_name, invitee_number, invitee_position, role, token, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [teamId, inviter.id, inviteeEmail, inviteeName || null, inviteeNumber || null, inviteePosition || null, role, token, expiresAt]
    );

    const inviteId = res.rows[0].id;
    const from = process.env.EMAIL_FROM || 'no-reply@localhost';
    const acceptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/accept-invite?token=${token}`;

    await transporter.sendMail({
      from,
      to: inviteeEmail,
      subject: `Invitación a unirte al equipo ${t.rows[0].name}`,
      text: `Has sido invitado al equipo ${t.rows[0].name}. Acepta: ${acceptUrl}`,
      html: `<p>Has sido invitado al equipo <strong>${t.rows[0].name}</strong>. Haz click <a href="${acceptUrl}">aquí</a> para aceptar.</p>`,
    });

    const response: any = { ok: true, inviteId };
    if (process.env.DEV_SHOW_TOKENS === 'true') response.token = token;
    return NextResponse.json(response);
  } finally {
    client.release();
  }
}
