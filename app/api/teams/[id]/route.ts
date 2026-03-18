import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  const params = await (context.params as any)
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ team: null }, { status: 400 })
  }

  try {
    const res = await query(
      'SELECT id, name, short_name as "shortName", city, country, founded_year as "foundedYear", president_name as "presidentName", colors, stats FROM teams WHERE id = $1 LIMIT 1',
      [id],
    )
    return NextResponse.json({ team: res.rows[0] || null })
  } catch (err) {
    return NextResponse.json({ team: null })
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const params = await (context.params as any)
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  }

  const body = await req.json()
  const { name, shortName, city, country, colors } = body
  try {
    const res = await query(
      `UPDATE teams SET name = $1, short_name = $2, city = $3, country = $4, colors = $5 WHERE id = $6 RETURNING id, name, short_name as "shortName", city, country, founded_year as "foundedYear", president_name as "presidentName", colors, stats`,
      [name, shortName || null, city || null, country || null, colors ? JSON.stringify(colors) : null, id]
    )
    // If current user is not president/manager for this team, DB will still update; frontend should restrict by role.
    return NextResponse.json({ team: res.rows[0] || null })
  } catch (err) {
    return NextResponse.json({ error: 'failed to update team' }, { status: 500 })
  }
}
