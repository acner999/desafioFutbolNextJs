import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const res = await query('SELECT id, email, name, team_id as "teamId", role FROM users LIMIT 1')
    const user = res.rows[0] || null
    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ user: null })
  }
}
