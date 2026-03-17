'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { LanguageToggle } from '@/components/layout/language-toggle'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      {children}
    </div>
  )
}
