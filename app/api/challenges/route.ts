import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamId = url.searchParams.get('teamId')
    if (teamId) {
      const res = await query(`SELECT * FROM challenges WHERE challenger_team_id = $1 OR challenged_team_id = $1 ORDER BY created_at DESC`, [teamId])
      return NextResponse.json({ challenges: res.rows })
    }
    const res = await query('SELECT * FROM challenges ORDER BY created_at DESC')
    return NextResponse.json({ challenges: res.rows })
  } catch (err) {
    return NextResponse.json({ challenges: [] })
  }
}
