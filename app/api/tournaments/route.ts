import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamId = url.searchParams.get('teamId')
    if (teamId) {
      const res = await query('SELECT * FROM tournaments WHERE teams @> $1::jsonb', [JSON.stringify([teamId])])
      const rows = (res.rows || []).map((r: any) => ({
        ...r,
        startDate: r.start_date || r.startDate,
        endDate: r.end_date || r.endDate,
      }))
      return NextResponse.json({ tournaments: rows })
    }
    const res = await query('SELECT * FROM tournaments')
    const rows = (res.rows || []).map((r: any) => ({
      ...r,
      startDate: r.start_date || r.startDate,
      endDate: r.end_date || r.endDate,
    }))
    return NextResponse.json({ tournaments: rows })
  } catch (err) {
    return NextResponse.json({ tournaments: [] })
  }
}
