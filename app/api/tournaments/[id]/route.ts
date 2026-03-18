import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  const params = await (context.params as any)
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ tournament: null }, { status: 400 })
  }

  try {
    const res = await query('SELECT * FROM tournaments WHERE id = $1 LIMIT 1', [id])
    const row = res.rows[0]
    if (!row) return NextResponse.json({ tournament: null })
    const tournament = {
      ...row,
      startDate: row.start_date || row.startDate,
      endDate: row.end_date || row.endDate,
    }
    return NextResponse.json({ tournament })
  } catch (err) {
    return NextResponse.json({ tournament: null })
  }
}
