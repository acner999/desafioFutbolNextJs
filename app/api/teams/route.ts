import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { query } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const res = await query('SELECT id, name, short_name as "shortName", city, country, founded_year as "foundedYear", president_name as "presidentName", colors, stats FROM teams')
    return NextResponse.json({ teams: res.rows })
  } catch (err) {
    return NextResponse.json({ teams: [] })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { name, shortName, city, country } = body
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  try {
    // create team
    const res = await query(
      `INSERT INTO teams (name, short_name, city, country, president_name, stats)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, name, short_name as "shortName", city, country, founded_year as "foundedYear", president_name as "presidentName", colors, stats`,
      [name, shortName || null, city || null, country || null, session.user.name || null, JSON.stringify({})],
    )
    const team = res.rows[0]

    // assign to current user
    await query('UPDATE users SET team_id = $1, role = $2 WHERE email = $3', [team.id, 'president', session.user.email])

    return NextResponse.json({ team })
  } catch (err: any) {
    if (err?.code === '23505') {
      return NextResponse.json({ error: 'Team name already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'failed to create team' }, { status: 500 })
  }
}
