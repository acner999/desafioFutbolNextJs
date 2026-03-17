import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ challenge: null }, { status: 400 })
  }

  try {
    const res = await query('SELECT * FROM challenges WHERE id = $1 LIMIT 1', [id])
    return NextResponse.json({ challenge: res.rows[0] || null })
  } catch (err) {
    return NextResponse.json({ challenge: null })
  }
}
