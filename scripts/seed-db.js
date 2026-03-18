require('dotenv').config({ path: '.env.local' })
const bcrypt = require('bcrypt')
const { Pool } = require('pg')
const teams = require('../lib/mock-data/teams')
const players = require('../lib/mock-data/players')
const challenges = require('../lib/mock-data/challenges')
const tournaments = require('../lib/mock-data/tournaments')
const user = require('../lib/mock-data/user')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL not set in .env.local')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function seed() {
  try {
    console.log('[seed] seeding teams')

    const teamIdMap = new Map()
    for (const t of teams.teams) {
      // Try to find existing team by name
      let res = await pool.query('SELECT id FROM teams WHERE name = $1 LIMIT 1', [t.name])
      let teamId
      if (res.rows.length) {
        teamId = res.rows[0].id
      } else {
        res = await pool.query(
          `INSERT INTO teams (name, short_name, city, country, founded_year, president_name, colors, stats)
           VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb)
           RETURNING id`,
          [
            t.name,
            t.shortName,
            t.city,
            t.country,
            t.foundedYear,
            t.presidentName,
            JSON.stringify(t.colors),
            JSON.stringify(t.stats),
          ],
        )
        teamId = res.rows[0].id
      }
      teamIdMap.set(t.id, teamId)
    }

    console.log('[seed] seeding players')
    for (const p of players.players) {
      const teamId = teamIdMap.get(p.teamId) ?? null
      await pool.query(
        `INSERT INTO players (name, number, position, team_id, stats)
         VALUES ($1,$2,$3,$4,$5::jsonb)
         ON CONFLICT (name, team_id) DO UPDATE SET number = EXCLUDED.number`,
        [p.name, p.number, p.position, teamId, JSON.stringify(p.stats)],
      )
    }

    console.log('[seed] seeding user')
    const u = user.currentUser
    const passwordHash = await bcrypt.hash('demo', 10)

    const userRes = await pool.query(
      `INSERT INTO users (email, name, team_id, role, password_hash, email_verified)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [u.email, u.name, teamIdMap.get(u.teamId) ?? null, u.role, passwordHash, true],
    )
    const userId = userRes.rows[0].id

    console.log('[seed] seeding notifications')
    for (const n of user.notifications) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, read, created_at, data)
         VALUES ($1,$2,$3,$4,$5,$6::timestamptz,$7::jsonb)
         ON CONFLICT (user_id, title) DO UPDATE SET read = EXCLUDED.read`,
        [userId, n.type, n.title, n.message, n.read, n.createdAt, JSON.stringify(n.data)],
      )
    }

    console.log('[seed] seeding challenges')
    for (const c of challenges.challenges) {
      const challengerTeamId = teamIdMap.get(c.challengerTeamId)
      const challengedTeamId = teamIdMap.get(c.challengedTeamId)
      if (!challengerTeamId || !challengedTeamId) continue

      await pool.query(
        `INSERT INTO challenges (challenger_team_id, challenged_team_id, status, proposed_date, proposed_time, venue, bet_amount, message, created_at, updated_at, counter_proposal, result)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::timestamptz,$10::timestamptz,$11::jsonb,$12::jsonb)`,
        [
          challengerTeamId,
          challengedTeamId,
          c.status,
          c.proposedDate || null,
          c.proposedTime || null,
          c.venue || null,
          c.betAmount || null,
          c.message || null,
          c.createdAt || null,
          c.updatedAt || null,
          JSON.stringify(c.counterProposal || null),
          JSON.stringify(c.result || null),
        ],
      )
    }

    console.log('[seed] seeding tournaments')
    for (const t of tournaments.tournaments) {
      const teamIds = (t.teams || [])
        .map((id) => teamIdMap.get(id))
        .filter(Boolean)

      await pool.query(
        `INSERT INTO tournaments (name, type, status, start_date, end_date, teams, standings)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)
         ON CONFLICT (name) DO UPDATE SET status = EXCLUDED.status`,
        [
          t.name,
          t.type,
          t.status,
          t.startDate || null,
          t.endDate || null,
          JSON.stringify(teamIds),
          JSON.stringify([]),
        ],
      )
    }

    console.log('[seed] done')
  } catch (err) {
    console.error('[seed] error', err)
  } finally {
    await pool.end()
  }
}

seed()
