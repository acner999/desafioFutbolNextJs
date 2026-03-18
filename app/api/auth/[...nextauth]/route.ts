import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'
import bcrypt from 'bcrypt'

import { getPool } from '@/lib/db'

const pool = getPool()
if (!pool) {
  throw new Error('DATABASE_URL is not configured')
}

async function upsertSocialUser(profile: any, provider: string) {
  const email = profile.email?.toLowerCase()
  if (!email) return null

  const id = profile.id || `social-${Date.now()}`
  const name = profile.name || profile?.given_name || profile?.family_name || email

  // Upsert user record
  await pool.query(
    `INSERT INTO users (id, email, name, role, email_verified, image)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image`,
    [id, email, name, 'normal', new Date(), profile.picture || null],
  )

  const res = await pool.query(
    'SELECT id, email, name, role, team_id AS "teamId", cedula FROM users WHERE email = $1 LIMIT 1',
    [email],
  )
  return res.rows[0]
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password
        if (!email || !password) return null

        const res = await pool.query(
          'SELECT id, email, name, role, team_id as "teamId", cedula, password_hash FROM users WHERE LOWER(email) = $1 LIMIT 1',
          [email],
        )
        const user = res.rows[0]
        if (!user) return null

        if (!user.password_hash) return null
        const isValid = await bcrypt.compare(password, user.password_hash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          teamId: user.teamId,
          cedula: user.cedula,
        }
      },
    }),
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
      : null,
    process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET
      ? TwitterProvider({
          clientId: process.env.TWITTER_CLIENT_ID,
          clientSecret: process.env.TWITTER_CLIENT_SECRET,
        })
      : null,
  ].filter(Boolean),
  callbacks: {
    async jwt({ token, user, profile, account }) {
      try {
        if (user) {
          token.role = (user as any).role
          token.teamId = (user as any).teamId
          token.cedula = (user as any).cedula
        }
        if (profile && account) {
          try {
            const socialUser = await upsertSocialUser(profile, account.provider)
            if (socialUser) {
              token.role = socialUser.role
              token.teamId = socialUser.teamId
              token.cedula = socialUser.cedula
            }
          } catch (e) {
            console.error('[nextauth][jwt] upsertSocialUser error', e)
          }
        }
        return token
      } catch (err) {
        console.error('[nextauth][jwt] error', err)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          ;(session.user as any).role = (token as any).role
          ;(session.user as any).teamId = (token as any).teamId
          ;(session.user as any).cedula = (token as any).cedula
        }
        return session
      } catch (err) {
        console.error('[nextauth][session] error', err)
        return session
      }
    },
  },
}

// Create NextAuth handler and export method-specific handlers for App Router
const _nextAuthHandler = NextAuth(authOptions)

async function handlerWrapper(req: Request) {
  try {
    // Build a RouteHandlerContext-like object with the dynamic `nextauth` segments
    // so NextAuth's route handler can read `context.params.nextauth`.
    const url = new URL(req.url)
    const pathname = url.pathname || ''
    const base = '/api/auth/'
    const nextauth = pathname.startsWith(base)
      ? pathname.slice(base.length).split('/').filter(Boolean)
      : []

    // Delegate to NextAuth handler with a fake `res` that contains `params`.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await _nextAuthHandler(req, { params: { nextauth } })
    return result
  } catch (err) {
    console.error('[nextauth][handler] unexpected error', err)
    return new Response(JSON.stringify({ error: 'internal_server_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export { handlerWrapper as GET, handlerWrapper as POST }
