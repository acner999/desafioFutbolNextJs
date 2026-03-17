import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamId = url.searchParams.get('teamId')
    if (teamId) {
      const res = await query('SELECT * FROM players WHERE team_id = $1', [teamId])
      return NextResponse.json({ players: res.rows })
    }
    const res = await query('SELECT * FROM players')
    return NextResponse.json({ players: res.rows })
  } catch (err) {
    return NextResponse.json({ players: [] })
  }
}
