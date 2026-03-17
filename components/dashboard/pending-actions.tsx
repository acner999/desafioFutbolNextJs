"use client"

import Link from 'next/link'
import { AlertCircle, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'

export function PendingActions() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [actions, setActions] = useState<any[]>([])
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

        const received = challenges.filter((c: any) => c.challenged_team_id === user.teamId)
        const pending = challenges.filter((c: any) => (
          (c.challenged_team_id === user.teamId && c.status === 'pending') ||
          (c.challenger_team_id === user.teamId && c.status === 'negotiating')
        ))

        const needsResponse = received.filter((c: any) => c.status === 'pending')
        const needsNegotiation = pending.filter((c: any) => c.status === 'negotiating')

        const act = [
          ...needsResponse.map((challenge: any) => ({
            id: challenge.id,
            type: 'respond' as const,
            teamId: challenge.challenger_team_id,
            date: challenge.proposed_date,
            icon: AlertCircle,
            iconClass: 'text-chart-3',
          })),
          ...needsNegotiation.map((challenge: any) => ({
            id: challenge.id,
            type: 'negotiate' as const,
            teamId: challenge.challenged_team_id,
            date: challenge.counter_proposal?.date || challenge.proposed_date,
            icon: Clock,
            iconClass: 'text-purple-500',
          })),
        ]

        setTeamsMap(map)
        setActions(act)
      } catch (err) {
        console.warn('[PendingActions] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          {t('dashboard.pendingActions')}
        </CardTitle>
        <Link href="/dashboard/desafios">
          <Button variant="ghost" size="sm" className="gap-1">
            {t('common.view')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="mb-2 h-10 w-10 text-accent" />
            <p className="text-sm text-muted-foreground">
              {t('dashboard.noPending')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => {
              const team = teamsMap[action.teamId]
              const Icon = action.icon
              
              return (
                <Link 
                  key={action.id} 
                  href={`/dashboard/desafios/${action.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className={`rounded-full bg-muted p-2 ${action.iconClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {action.type === 'respond' ? 'Responder desafio de' : 'Negociar con'} {team?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fecha propuesta: {action.date}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
