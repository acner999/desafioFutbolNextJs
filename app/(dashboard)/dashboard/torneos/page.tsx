"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  active: 'bg-accent/10 text-accent border-accent/20',
  upcoming: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  finished: 'bg-muted text-muted-foreground border-border',
}

const typeLabels: Record<string, string> = {
  league: 'Liga',
  cup: 'Copa',
  groups: 'Grupos',
}

export default function TorneosPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('active')
  const { user } = useAuth()
  const [myTournaments, setMyTournaments] = useState<any[]>([])
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({})

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const [trRes, tRes] = await Promise.all([
          fetch(`/api/tournaments?teamId=${user.teamId}`),
          fetch('/api/teams'),
        ])
        const trJson = await trRes.json()
        const tJson = await tRes.json()
        setMyTournaments(trJson.tournaments || [])
        setTeamsMap(Object.fromEntries((tJson.teams || []).map((x:any)=>[x.id,x])))
      } catch (err) {
        console.warn('[Torneos] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  const activeTournaments = myTournaments.filter((t: any) => t.status === 'active')
  const upcomingTournaments = myTournaments.filter((t: any) => t.status === 'upcoming')
  const finishedTournaments = myTournaments.filter((t: any) => t.status === 'finished')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          {t('tournaments.title')}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tus torneos y competiciones
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tournaments.active')}</span>
            {activeTournaments.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                {activeTournaments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tournaments.upcoming')}</span>
          </TabsTrigger>
          <TabsTrigger value="finished" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('tournaments.finished')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeTournaments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {activeTournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} t={t} teamsMap={teamsMap} userTeamId={user?.teamId} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingTournaments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {upcomingTournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} t={t} teamsMap={teamsMap} userTeamId={user?.teamId} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="finished" className="mt-6">
          {finishedTournaments.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {finishedTournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} t={t} teamsMap={teamsMap} userTeamId={user?.teamId} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TournamentCard({ tournament, t, teamsMap, userTeamId }: { tournament: any; t: (key: string) => string; teamsMap: Record<string, any>; userTeamId?: string }) {
  // Find current team's position
  const teamStanding = (tournament.standings || []).find((s:any) => s.teamId === userTeamId)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Main Info */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{tournament.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={cn("capitalize", statusColors[tournament.status])}
                  >
                    {t(`tournaments.${tournament.status}`)}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {typeLabels[tournament.type]} - {(tournament.teams || []).length} equipos
                </p>
              </div>
              <Link href={`/dashboard/torneos/${tournament.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  Ver
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Dates */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{t('tournaments.details.startDate')}: {tournament.startDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{t('tournaments.details.endDate')}: {tournament.endDate}</span>
              </div>
            </div>
          </div>

          {/* Position Badge */}
                  {teamStanding && (
            <div className="flex items-center justify-center border-t border-border bg-muted/30 p-4 md:border-l md:border-t-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  #{teamStanding.position}
                </div>
                <p className="text-xs text-muted-foreground">
                  {teamStanding.points} pts
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
      <Trophy className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="text-muted-foreground">{t('tournaments.empty')}</p>
    </div>
  )
}
