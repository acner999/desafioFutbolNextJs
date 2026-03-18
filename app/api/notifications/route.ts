import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const teamIdStr = url.searchParams.get('teamId')
    if (!teamIdStr) return NextResponse.json({ notifications: [] })

    const teamId = Number(teamIdStr)
    if (Number.isNaN(teamId)) return NextResponse.json({ notifications: [] }, { status: 400 })

    const res = await query(
      `SELECT n.id, n.user_id as "userId", n.type, n.title, n.message, n.read, n.created_at as "createdAt", n.data
       FROM notifications n
       JOIN users u ON u.id = n.user_id
       WHERE u.team_id = $1
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [teamId],
    )

    return NextResponse.json({ notifications: res.rows || [] })
  } catch (err) {
    console.error('[api/notifications] error', err)
    return NextResponse.json({ notifications: [] }, { status: 500 })
  }
}
