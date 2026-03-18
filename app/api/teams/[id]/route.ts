import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

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
