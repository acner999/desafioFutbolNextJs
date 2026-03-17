import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[db] DATABASE_URL is not set — DB disabled in dev')
  } else {
    throw new Error('DATABASE_URL is not defined')
  }
}

let pool: Pool | null = null

export function getPool() {
  if (!connectionString) return null
  if (!pool) {
    pool = new Pool({ connectionString })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const p = getPool()
  if (!p) throw new Error('Database not configured')
  const res = await p.query(text, params)
  return res
}

export default { getPool, query }
