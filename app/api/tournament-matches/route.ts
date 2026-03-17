import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamId = url.searchParams.get('teamId')
    const tournamentId = url.searchParams.get('tournamentId')
    if (teamId) {
      const res = await query(
        'SELECT * FROM tournament_matches WHERE home_team_id = $1 OR away_team_id = $1 ORDER BY date',
        [teamId]
      )
      return NextResponse.json({ matches: res.rows })
    }
    if (tournamentId) {
      const res = await query(
        'SELECT * FROM tournament_matches WHERE tournament_id = $1 ORDER BY round, date',
        [tournamentId]
      )
      return NextResponse.json({ matches: res.rows })
    }
    const res = await query('SELECT * FROM tournament_matches ORDER BY date')
    return NextResponse.json({ matches: res.rows })
  } catch (err) {
    return NextResponse.json({ matches: [] })
  }
}
