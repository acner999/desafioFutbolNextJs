import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: Request) {
  const { token, action } = await req.json(); // action = 'accept' | 'reject'
  if (!token || !action) return NextResponse.json({ error: 'token and action required' }, { status: 400 });

  const client = await pool.connect();
  try {
    const now = new Date();
    const res = await client.query('SELECT id, team_id, invitee_email, invitee_name, invitee_number, invitee_position, role, status, expires_at FROM team_invites WHERE token = $1', [token]);
    if (res.rowCount === 0) return NextResponse.json({ error: 'invite not found' }, { status: 404 });

    const invite = res.rows[0];
    if (invite.status !== 'pending') return NextResponse.json({ error: 'invite not pending' }, { status: 400 });
    if (invite.expires_at && new Date(invite.expires_at) < now) return NextResponse.json({ error: 'invite expired' }, { status: 400 });

    if (action === 'reject') {
      await client.query('UPDATE team_invites SET status = $1 WHERE id = $2', ['rejected', invite.id]);
      return NextResponse.json({ ok: true, status: 'rejected' });
    }

    if (action === 'accept') {
      // If user exists with email, add them to team by updating users.team_id and role; otherwise keep invite pending
      const userRes = await client.query('SELECT id FROM users WHERE email = $1', [invite.invitee_email]);
      if (userRes.rowCount === 0) {
        await client.query('UPDATE team_invites SET status = $1 WHERE id = $2', ['pending', invite.id]);
        return NextResponse.json({ ok: true, message: 'user not registered', status: 'pending' });
      }

      const userId = userRes.rows[0].id;
      // assign team and role from invite (if provided)
      if (invite.role) {
        await client.query('UPDATE users SET team_id = $1, role = $2 WHERE id = $3', [invite.team_id, invite.role, userId]);
      } else {
        await client.query('UPDATE users SET team_id = $1 WHERE id = $2', [invite.team_id, userId]);
      }
      // If invite included player data, create player record for the team and attempt to link to the user
      try {
        if (invite.invitee_name || invite.invitee_position || invite.invitee_number) {
          // insert player if not exists for that team
          const exist = await client.query('SELECT id FROM players WHERE name = $1 AND team_id = $2 LIMIT 1', [invite.invitee_name, invite.team_id]);
          if (exist.rowCount === 0) {
            await client.query('INSERT INTO players (name, number, position, team_id, stats) VALUES ($1,$2,$3,$4,$5)', [invite.invitee_name, invite.invitee_number || null, invite.invitee_position || null, invite.team_id, JSON.stringify({})])
          }
        }
      } catch (e) {
        console.warn('failed to create player on invite accept', e)
      }

      await client.query('UPDATE team_invites SET status = $1 WHERE id = $2', ['accepted', invite.id]);

      return NextResponse.json({ ok: true, status: 'accepted' });
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  } finally {
    client.release();
  }
}
