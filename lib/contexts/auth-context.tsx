"use client"

import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react'
import type { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  teamName?: string
  city?: string
  country?: 'PY' | 'BR'
  cedula?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user = (session?.user ?? null) as User | null
  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user

  const login = useCallback(async (email: string, password: string) => {
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    return !!res?.ok
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json()
      return { success: false, error: json.error || 'Registration failed' }
    }

    // Sign in automatically after registration
    const json = await res.json()
    const signedIn = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    })
    return { success: !!signedIn?.ok }
  }, [])

  const logout = useCallback(async () => {
    await signOut({ redirect: false })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
