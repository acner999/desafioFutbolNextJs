import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, teamName, city, country, cedula } = body

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const role = cedula ? 'player' : 'normal'
    const passwordHash = await bcrypt.hash(password, 10)

    // Create a team only when the user provides a team name (useful for presidents/managers)
    let teamId: number | null = null
    if (teamName) {
      const t = await query(
        `INSERT INTO teams (name, city, country, president_name)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [teamName, city || null, country || null, name],
      )
      teamId = t.rows[0]?.id ?? null
    }

    // create user record
    const userRes = await query(
      `INSERT INTO users (email, name, team_id, role, password_hash, cedula, email_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [email, name, teamId, role, passwordHash, cedula || null, false],
    )
    const userId = userRes.rows[0]?.id

    // If user provided cedula, also create a player record for them
    if (cedula && teamId) {
      await query(
        `INSERT INTO players (name, number, position, team_id, stats)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (name, team_id) DO NOTHING`,
        [
          name,
          null,
          null,
          teamId,
          JSON.stringify({ goals: 0, assists: 0, yellowCards: 0, redCards: 0, matchesPlayed: 0 }),
        ],
      )
    }

    const res = await query('SELECT id, email, name, team_id as "teamId", role, cedula FROM users WHERE id = $1', [userId])
    // Auto-accept pending invite if exists
    try {
      const inviteRes = await query(
        `SELECT id, team_id FROM team_invites WHERE invitee_email = $1 AND status = 'pending' AND (expires_at IS NULL OR expires_at > now()) ORDER BY created_at DESC LIMIT 1`,
        [email],
      )
      if (inviteRes.rowCount) {
        const invite = inviteRes.rows[0]
        // assign team and role
        await query('UPDATE users SET team_id = $1 WHERE id = $2', [invite.team_id, userId])

        // create player from invite data if available (team_invites may contain invitee_* fields)
        try {
          const invFull = await query('SELECT invitee_name, invitee_number, invitee_position, role FROM team_invites WHERE id = $1', [invite.id])
          const row = invFull.rows[0]
          if (row) {
            // set role on user if invite specified
            if (row.role) {
              await query('UPDATE users SET role = $1 WHERE id = $2', [row.role, userId])
            }
            if (row.invitee_name || row.invitee_position || row.invitee_number) {
              const exists = await query('SELECT id FROM players WHERE name = $1 AND team_id = $2 LIMIT 1', [row.invitee_name, invite.team_id])
              if (exists.rowCount === 0) {
                await query('INSERT INTO players (name, number, position, team_id, stats) VALUES ($1,$2,$3,$4,$5)', [row.invitee_name, row.invitee_number || null, row.invitee_position || null, invite.team_id, JSON.stringify({})])
              }
            }
          }
        } catch (e) {
          console.warn('[register] failed to create player from invite', e)
        }

        await query('UPDATE team_invites SET status = $1 WHERE id = $2', ['accepted', invite.id])
      }
    } catch (e) {
      console.warn('[register] invite accept failed', e)
    }
    return NextResponse.json({ user: res.rows[0] })
  } catch (err: any) {
    // Check for unique constraint violation on email
    if (err?.code === '23505' && err?.constraint === 'users_email_key') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    console.error('[register] error', err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
