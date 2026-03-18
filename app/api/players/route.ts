import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import crypto from 'crypto'
import { sendMail } from '../../../lib/mailtrap'
import { renderTemplate } from '../../../lib/emailTemplates'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamId = url.searchParams.get('teamId')
    if (teamId) {
      const res = await query('SELECT * FROM players WHERE team_id = $1 ORDER BY number NULLS LAST', [teamId])
      return NextResponse.json({ players: res.rows })
    }
    const res = await query('SELECT * FROM players')
    return NextResponse.json({ players: res.rows })
  } catch (err) {
    return NextResponse.json({ players: [] })
  }
}

export async function POST(req: Request) {
  // create a new player for the current user's team
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json()
  const { name, number, position, teamId, inviteeEmail } = body
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  try {
    // if teamId not provided, try to infer from user
    let tId = teamId
    if (!tId) {
      const inviterEmail = (session.user.email || '').toLowerCase().trim()
      const u = await query('SELECT team_id FROM users WHERE LOWER(email) = $1 LIMIT 1', [inviterEmail])
      tId = u.rows[0]?.team_id
    }
    if (!tId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })

    // If inviteeEmail provided, check if a user already exists
    if (inviteeEmail) {
      const u = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [inviteeEmail])
      if (u.rowCount > 0) {
        // existing user -> create player and optionally attach to team
        const res = await query('INSERT INTO players (name, number, position, team_id, stats) VALUES ($1,$2,$3,$4,$5) RETURNING *', [name, number || null, position || null, tId, JSON.stringify({})])
        // also update user's team_id if not set
        await query('UPDATE users SET team_id = $1 WHERE id = $2', [tId, u.rows[0].id])
        return NextResponse.json({ player: res.rows[0], assignedExistingUser: true })
      } else {
        // No existing user: create player immediately (accepted by default)
        // verify inviter permissions: only president/manager can add players
        const inviterEmail = (session.user.email || '').toLowerCase().trim()
        let inviter = await query('SELECT id, role, team_id, email FROM users WHERE LOWER(email) = $1 LIMIT 1', [inviterEmail])
        if (inviter.rowCount === 0) {
          const up = await query(
            `INSERT INTO users (email, name, role, team_id) VALUES ($1,$2,$3,$4)
             ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
             RETURNING id, role, team_id, email`,
            [inviterEmail, session.user.name || null, (session.user.role || 'normal'), session.user.teamId || null]
          )
          inviter = up
        }
        const inv = inviter.rows[0]
        if (!['president', 'manager'].includes((inv.role || '').toLowerCase()) || Number(inv.team_id) !== Number(tId)) {
          return NextResponse.json({ error: 'forbidden' }, { status: 403 })
        }

        // create player record immediately
        const res = await query('INSERT INTO players (name, number, position, team_id, stats) VALUES ($1,$2,$3,$4,$5) RETURNING *', [name, number || null, position || null, tId, JSON.stringify({})])

        // create or update a minimal users record for the invitee so they are associated to the team
        try {
          await query(
            `INSERT INTO users (email, name, team_id, role) VALUES ($1,$2,$3,$4)
             ON CONFLICT (email) DO UPDATE SET team_id = EXCLUDED.team_id RETURNING id`,
            [inviteeEmail.toLowerCase().trim(), name || null, tId, 'player']
          )
        } catch (e) {
          console.warn('failed to upsert invitee user record', e)
        }

        // send registration email (best-effort)
        try {
          const acceptUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/register?email=${encodeURIComponent(inviteeEmail)}`
          const html = renderTemplate('invite', { inviterName: session.user.email, teamName: (await query('SELECT name FROM teams WHERE id = $1', [tId])).rows[0]?.name, acceptUrl })
          await sendMail({
            from: { name: 'TorneoApp', email: process.env.EMAIL_FROM || 'no-reply@localhost' },
            to: [{ email: inviteeEmail }],
            subject: `Has sido agregado al equipo ${ (await query('SELECT name FROM teams WHERE id = $1', [tId])).rows[0]?.name }`,
            text: `Has sido agregado al equipo. Regístrate: ${acceptUrl}`,
            html,
          })
        } catch (e) {
          console.warn('failed to send registration email', e)
        }

        return NextResponse.json({ player: res.rows[0], assignedExistingUser: false, createdUser: true })
      }
    }

    const res = await query('INSERT INTO players (name, number, position, team_id, stats) VALUES ($1,$2,$3,$4,$5) RETURNING *', [name, number || null, position || null, tId, JSON.stringify({})])
    return NextResponse.json({ player: res.rows[0] })
  } catch (err: any) {
    return NextResponse.json({ error: 'failed to create player' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json()
  const { id, name, number, position } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    const res = await query('UPDATE players SET name = $1, number = $2, position = $3 WHERE id = $4 RETURNING *', [name, number, position, id])
    return NextResponse.json({ player: res.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: 'failed to update player' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const body = await req.json()
  const { id } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    await query('DELETE FROM players WHERE id = $1', [id])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'failed to delete player' }, { status: 500 })
  }
}
