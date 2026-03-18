/**
 * Simple script to exercise register -> login -> forgot-password flow against local dev server.
 * Requires: DATABASE_URL and server running on localhost:3000
 */
const fetch = require('node-fetch');

async function run() {
  const base = 'http://localhost:3000';
  const email = `test+${Date.now()}@example.com`;
  console.log('Registering', email);
  await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!', name: 'Test' })
  }).then(r => r.json()).then(console.log);

  console.log('Requesting forgot-password token');
  const tokenRes = await fetch(`${base}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email })
  }).then(r => r.json());
  console.log('Token response:', tokenRes);
}

run().catch(err => { console.error(err); process.exit(1); });
