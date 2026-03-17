import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamId = url.searchParams.get('teamId')
    if (teamId) {
      const res = await query('SELECT * FROM tournaments WHERE teams @> $1::jsonb', [JSON.stringify([teamId])])
      return NextResponse.json({ tournaments: res.rows })
    }
    const res = await query('SELECT * FROM tournaments')
    return NextResponse.json({ tournaments: res.rows })
  } catch (err) {
    return NextResponse.json({ tournaments: [] })
  }
}
