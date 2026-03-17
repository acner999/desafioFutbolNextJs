import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const res = await query('SELECT id, name, short_name as "shortName", city, country, founded_year as "foundedYear", president_name as "presidentName", colors, stats FROM teams')
    return NextResponse.json({ teams: res.rows })
  } catch (err) {
    return NextResponse.json({ teams: [] })
  }
}
