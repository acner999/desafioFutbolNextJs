import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.json()
  let { email, password } = body
  if (typeof email === 'string') email = email.trim().toLowerCase()

  try {
    const res = await query('SELECT id, email, name, team_id as "teamId", role FROM users WHERE LOWER(email) = $1 LIMIT 1', [email])
    const user = res.rows[0]
    // Accept demo password for any existing user (for local dev), but require email exists
    if (user && password === 'demo') {
      return NextResponse.json({ user })
    }
    // If user not found or password not 'demo', reject
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
