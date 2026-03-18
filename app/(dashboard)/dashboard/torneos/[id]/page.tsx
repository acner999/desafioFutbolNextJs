"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'
import { cn, formatDateISO } from '@/lib/utils'

const statusColors: Record<string, string> = {
  active: 'bg-accent/10 text-accent border-accent/20',
  upcoming: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  finished: 'bg-muted text-muted-foreground border-border',
}

export default function TournamentDetailPage() {
  const params = useParams()
  const id = params?.id
  const { t } = useLanguage()
  const { user } = useAuth()
  const [tournament, setTournament] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({})

  useEffect(() => {
    async function load() {
      try {
        const [trRes, mRes, tRes] = await Promise.all([
          fetch(`/api/tournaments/${id}`),
          fetch(`/api/tournament-matches?tournamentId=${id}`),
          fetch('/api/teams'),
        ])
        const trJson = await trRes.json()
        const mJson = await mRes.json()
        const tJson = await tRes.json()
        const tr = trJson.tournament
        setTournament(tr)
        setMatches(mJson.matches || [])
        const teams = tJson.teams || []
        setTeamsMap(Object.fromEntries(teams.map((x:any)=>[x.id,x])))
      } catch (err) {
        console.warn('[TournamentDetail] load failed', err)
      }
    }
    load()
  }, [id])

  if (!tournament) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Torneo no encontrado</p>
      </div>
    )
  }

  const standings = tournament.standings || tournament.standings || []
  const myMatches = matches.filter((m:any) => m.home_team_id === user?.teamId || m.away_team_id === user?.teamId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/torneos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{tournament.name}</h1>
            <Badge variant="outline" className={cn('capitalize', statusColors[tournament.status])}>{t(`tournaments.${tournament.status}`)}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{formatDateISO(tournament.startDate)} - {formatDateISO(tournament.endDate)}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="standings">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standings"><Trophy className="mr-2 h-4 w-4" />{t('tournaments.standings')}</TabsTrigger>
          <TabsTrigger value="fixtures"><Calendar className="mr-2 h-4 w-4" />{t('tournaments.fixtures')}</TabsTrigger>
          <TabsTrigger value="mymatches">{t('tournaments.myMatches')}</TabsTrigger>
        </TabsList>

        <TabsContent value="standings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tournaments.standings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">{t('tournaments.table.position')}</TableHead>
                      <TableHead>{t('tournaments.table.team')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.played')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.won')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.drawn')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.lost')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.goalsFor')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.goalsAgainst')}</TableHead>
                      <TableHead className="text-center">{t('tournaments.table.goalDiff')}</TableHead>
                      <TableHead className="text-center font-bold">{t('tournaments.table.points')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standings.map((standing:any) => {
                      const team = teamsMap[standing.teamId]
                      const isCurrentTeam = standing.teamId === user?.teamId
                      return (
                        <TableRow key={standing.teamId} className={isCurrentTeam ? 'bg-accent/5' : ''}>
                          <TableCell className="font-bold">{standing.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded" style={{ backgroundColor: team?.colors?.primary || '#ccc' }} />
                              <span className={isCurrentTeam ? 'font-semibold' : ''}>{team?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{standing.played}</TableCell>
                          <TableCell className="text-center">{standing.won}</TableCell>
                          <TableCell className="text-center">{standing.drawn}</TableCell>
                          <TableCell className="text-center">{standing.lost}</TableCell>
                          <TableCell className="text-center">{standing.goalsFor}</TableCell>
                          <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
                          <TableCell className="text-center">{standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}</TableCell>
                          <TableCell className="text-center font-bold">{standing.points}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fixtures" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tournaments.fixtures')}</CardTitle>
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No hay partidos programados</p>
              ) : (
                <div className="space-y-4">
                  {matches.map((match:any) => {
                    const home = teamsMap[match.home_team_id]
                    const away = teamsMap[match.away_team_id]
                    const isMyMatch = match.home_team_id === user?.teamId || match.away_team_id === user?.teamId
                    return (
                      <div key={match.id} className={cn("flex items-center justify-between rounded-lg border border-border p-4", isMyMatch && "border-accent/50 bg-accent/5")}> 
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Jornada {match.round}</p>
                            <p className="text-sm font-medium">{match.date}</p>
                            <p className="text-xs text-muted-foreground">{match.time}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-right">
                            <span className={cn("font-medium", match.home_team_id === user?.teamId && "text-accent")}>{home?.shortName}</span>
                            <div className="h-8 w-8 rounded" style={{ backgroundColor: home?.colors?.primary || '#ccc' }} />
                          </div>

                          <div className="w-16 text-center">
                            {match.status === 'finished' ? (
                              <span className="text-lg font-bold">{match.home_score} - {match.away_score}</span>
                            ) : (
                              <span className="text-muted-foreground">vs</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded" style={{ backgroundColor: away?.colors?.primary || '#ccc' }} />
                            <span className={cn("font-medium", match.away_team_id === user?.teamId && "text-accent")}>
                              {away?.shortName}
                            </span>
                          </div>
                        </div>

                        <Badge variant="outline" className={cn(match.status === 'finished' && 'bg-muted', match.status === 'scheduled' && 'bg-chart-3/10 text-chart-3')}>
                          {match.status === 'finished' ? 'Jugado' : 'Programado'}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mymatches" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('tournaments.myMatches')}</CardTitle>
            </CardHeader>
            <CardContent>
              {myMatches.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No hay partidos para tu equipo</p>
              ) : (
                <div className="space-y-4">
                  {myMatches.map((match:any) => {
                    const isHome = match.home_team_id === user?.teamId
                    const opponentId = isHome ? match.away_team_id : match.home_team_id
                    const opponent = teamsMap[opponentId]
                    let result = ''
                    if (match.status === 'finished' && match.home_score !== undefined && match.away_score !== undefined) {
                      const myScore = isHome ? match.home_score : match.away_score
                      const theirScore = isHome ? match.away_score : match.home_score
                      if (myScore > theirScore) result = 'V'
                      else if (myScore < theirScore) result = 'D'
                      else result = 'E'
                    }
                    return (
                      <div key={match.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg" style={{ backgroundColor: opponent?.colors?.primary || '#ccc' }} />
                          <div>
                            <p className="font-semibold text-foreground">{isHome ? 'vs' : '@'} {opponent?.name}</p>
                            <p className="text-sm text-muted-foreground">{match.date} - {match.time}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {match.status === 'finished' ? (
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold">{isHome ? `${match.home_score} - ${match.away_score}` : `${match.away_score} - ${match.home_score}`}</span>
                              <Badge className={cn(result === 'V' && 'bg-accent text-accent-foreground', result === 'D' && 'bg-destructive text-destructive-foreground', result === 'E' && 'bg-muted text-muted-foreground')}>{result}</Badge>
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-chart-3/10 text-chart-3">Programado</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
