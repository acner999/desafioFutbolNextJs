require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf8')
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL not set in .env.local')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function run() {
  try {
    console.log('[migrations] running schema.sql')
    await pool.query(sql)
    console.log('[migrations] done')
  } catch (err) {
    console.error('[migrations] failed', err)
  } finally {
    await pool.end()
  }
}

run()
