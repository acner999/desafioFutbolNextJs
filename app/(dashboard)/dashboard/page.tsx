"use client"

import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentChallenges } from '@/components/dashboard/recent-challenges'
import { UpcomingMatches } from '@/components/dashboard/upcoming-matches'
import { PendingActions } from '@/components/dashboard/pending-actions'

import { useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const shownRef = useRef(false)

  useEffect(() => {
    if (user && !shownRef.current) {
      toast({ title: `Bienvenido, ${user.name.split(' ')[0]}!` })
      shownRef.current = true
    }
  }, [user, toast])

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {t('dashboard.welcome')}, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t('dashboard.overview')}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Challenges */}
        <RecentChallenges />
        
        {/* Upcoming Matches */}
        <UpcomingMatches />
      </div>

      {/* Pending Actions */}
      <PendingActions />
    </div>
  )
}
