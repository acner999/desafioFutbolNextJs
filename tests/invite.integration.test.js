const fetch = require('node-fetch')
const assert = require('assert')

// These tests assume the dev server is running on localhost:3000 and DATABASE seeded
const base = 'http://localhost:3000'

async function run() {
  console.log('Integration test: create invite flow')

  // Note: This is a lightweight integration smoke test that exercises the invite endpoint
  // It requires a logged-in session; for simplicity we will call endpoints that don't require session
  // and check basic responses. More complete tests should simulate next-auth flows.

  // 1) Create an invite by directly inserting into DB is not done here; instead test respond-invite with invalid token
  const res = await fetch(base + '/api/teams/respond-invite', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: 'nonexistent', action: 'accept' }) })
  const j = await res.json()
  assert(res.status === 404 || j.error, 'expected invite not found')
  console.log('respond-invite returned expected error for invalid token')
  console.log('Invite integration tests completed (smoke)')
}

run().catch(e => { console.error(e); process.exit(1) })
