"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'

const statusColors: Record<string, string> = {
  pending: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  negotiating: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  accepted: 'bg-accent/10 text-accent border-accent/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export function RecentChallenges() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [recentChallenges, setRecentChallenges] = useState<any[]>([])
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({})

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const [chRes, tRes] = await Promise.all([
          fetch(`/api/challenges?teamId=${user.teamId}`),
          fetch('/api/teams'),
        ])
        const chJson = await chRes.json()
        const tJson = await tRes.json()
        const challenges = chJson.challenges || []
        const teams = tJson.teams || []
        const map = Object.fromEntries(teams.map((t: any) => [t.id, t]))

        const pending = challenges.filter((c: any) => (
          (c.challenged_team_id === user.teamId && c.status === 'pending') ||
          (c.challenger_team_id === user.teamId && c.status === 'negotiating')
        ))
        const sent = challenges.filter((c: any) => c.challenger_team_id === user.teamId)

        const recent = [...pending, ...sent.filter((c: any) => c.status !== 'pending')]
          .slice(0, 5)

        setTeamsMap(map)
        setRecentChallenges(recent)
      } catch (err) {
        console.warn('[RecentChallenges] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          {t('dashboard.recentChallenges')}
        </CardTitle>
        <Link href="/dashboard/desafios">
          <Button variant="ghost" size="sm" className="gap-1">
            {t('common.view')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentChallenges.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t('challenges.empty.sent')}
          </p>
        ) : (
          <div className="space-y-3">
            {recentChallenges.map((challenge, idx) => {
              const isReceived = challenge.challenged_team_id === user?.teamId
              const otherTeamId = isReceived ? challenge.challenger_team_id : challenge.challenged_team_id
              const otherTeam = teamsMap[otherTeamId]
              const status = challenge.status
              
              return (
                <Link 
                  key={`${challenge.id}-${idx}`} 
                  href={`/dashboard/desafios/${challenge.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg"
                      style={{ backgroundColor: otherTeam?.colors?.primary || '#ccc' }}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {isReceived ? 'vs ' : ''}{otherTeam?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {challenge.proposed_date} - {challenge.venue}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={cn("capitalize", statusColors[status])}
                  >
                    {t(`challenges.status.${status}`)}
                  </Badge>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
