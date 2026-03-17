"use client"

import { Target, Trophy, Award, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'

export function StatsCards() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [stats, setStats] = useState<any>({ matchesPlayed: 0, wins: 0, points: 0 })

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const res = await fetch(`/api/teams/${user.teamId}`)
        const json = await res.json()
        const team = json.team || {}
        setStats(team.stats || { matchesPlayed: 0, wins: 0, points: 0 })
      } catch (err) {
        console.warn('[StatsCards] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  const cards = [
    {
      title: t('dashboard.stats.matchesPlayed'),
      value: stats.matchesPlayed,
      icon: Target,
      trend: '+5',
      color: 'bg-primary/10 text-primary',
    },
    {
      title: t('dashboard.stats.wins'),
      value: stats.wins,
      icon: Trophy,
      trend: `${stats.matchesPlayed ? Math.round((stats.wins / stats.matchesPlayed) * 100) : 0}%`,
      color: 'bg-accent/10 text-accent',
    },
    {
      title: t('dashboard.stats.points'),
      value: stats.points,
      icon: Award,
      trend: '+12',
      color: 'bg-chart-3/10 text-chart-3',
    },
    {
      title: t('dashboard.stats.ranking'),
      value: '#3',
      icon: TrendingUp,
      trend: 'Zona',
      color: 'bg-chart-1/10 text-chart-1',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{card.trend}</p>
              </div>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
