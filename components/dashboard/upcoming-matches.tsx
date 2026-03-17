"use client"

import Link from 'next/link'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'

export function UpcomingMatches() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [allUpcoming, setAllUpcoming] = useState<any[]>([])
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({})

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const [mRes, chRes, tRes] = await Promise.all([
          fetch(`/api/tournament-matches?teamId=${user.teamId}`),
          fetch(`/api/challenges?teamId=${user.teamId}`),
          fetch('/api/teams'),
        ])
        const mJson = await mRes.json()
        const chJson = await chRes.json()
        const tJson = await tRes.json()
        const matches = mJson.matches || []
        const challenges = chJson.challenges || []
        const teams = tJson.teams || []
        const map = Object.fromEntries(teams.map((t: any) => [t.id, t]))

        const tournamentMatches = matches.map((match: any) => ({
          id: match.id,
          type: 'tournament' as const,
          date: match.date,
          time: match.time,
          venue: match.venue,
          opponentId: match.home_team_id === user.teamId ? match.away_team_id : match.home_team_id,
          isHome: match.home_team_id === user.teamId,
        }))

        const acceptedChallenges = (challenges.filter((c: any) => c.status === 'accepted') || []).map((challenge: any) => ({
          id: challenge.id,
          type: 'challenge' as const,
          date: challenge.proposed_date,
          time: challenge.proposed_time,
          venue: challenge.venue,
          opponentId: challenge.challenger_team_id === user.teamId ? challenge.challenged_team_id : challenge.challenger_team_id,
          isHome: challenge.challenger_team_id === user.teamId,
        }))

        const combined = [...tournamentMatches, ...acceptedChallenges]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4)

        setTeamsMap(map)
        setAllUpcoming(combined)
      } catch (err) {
        console.warn('[UpcomingMatches] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          {t('dashboard.upcomingMatches')}
        </CardTitle>
        <Link href="/dashboard/torneos">
          <Button variant="ghost" size="sm" className="gap-1">
            {t('common.view')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {allUpcoming.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t('dashboard.noUpcoming')}
          </p>
        ) : (
          <div className="space-y-3">
            {allUpcoming.map((match) => {
              const opponent = teamsMap[match.opponentId]
              
              return (
                <div 
                  key={match.id} 
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg"
                      style={{ backgroundColor: opponent?.colors?.primary || '#ccc' }}
                    />
                    <div>
                      <p className="font-medium text-foreground">
                        {match.isHome ? 'vs' : '@'} {opponent?.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {match.date} {match.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {match.type === 'tournament' ? 'Torneo' : 'Desafio'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
