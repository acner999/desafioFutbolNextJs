require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('[test-db] DATABASE_URL not set. Create .env.local from .env.example')
  process.exit(1)
}

const pool = new Pool({ connectionString })

;(async () => {
  try {
    const res = await pool.query('SELECT NOW() as now')
    console.log('[test-db] connected — DB time:', res.rows[0].now)
  } catch (err) {
    console.error('[test-db] connection failed:', err.message || err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
})()
