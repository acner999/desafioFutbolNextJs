"use client"

import Link from 'next/link'
import { Users, Trophy, Target, TrendingUp, Plus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLanguage } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/contexts/auth-context'

export default function EquipoPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const InvitesModal = dynamic(() => import('@/components/team/InvitesModal'), { ssr: false })
  const [team, setTeam] = useState<any | null>(null)
  const [players, setPlayers] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      if (!user?.teamId) return
      try {
        const [teamRes, playersRes] = await Promise.all([
          fetch(`/api/teams/${user.teamId}`),
          fetch(`/api/players?teamId=${user.teamId}`),
        ])
        if (teamRes.ok) {
          const teamJson = await teamRes.json()
          setTeam(teamJson.team || null)
        }
        if (playersRes.ok) {
          const playersJson = await playersRes.json()
          setPlayers(playersJson.players || [])
        }
      } catch (err) {
        console.warn('[Equipo] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  const positionLabels: Record<string, string> = {
    goalkeeper: t('team.playerForm.positions.goalkeeper'),
    defender: t('team.playerForm.positions.defender'),
    midfielder: t('team.playerForm.positions.midfielder'),
    forward: t('team.playerForm.positions.forward'),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t('team.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra la informacion de tu equipo
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('team.invite')}
          </Button>
          {/* Invites modal */}
          <div>
            {/* Will lazy-load modal component */}
            <InvitesModal />
          </div>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            {t('team.editTeam')}
          </Button>
        </div>
      </div>

      {/* Team Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Team Logo */}
            <div 
              className="flex h-24 w-24 items-center justify-center rounded-2xl text-2xl font-bold text-white"
              style={{ backgroundColor: team?.colors?.primary || '#999' }}
            >
              {team?.shortName}
            </div>

            {/* Team Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{team?.name}</h2>
              <p className="text-muted-foreground">
                {team?.city ? `${team.city}, ${team.country === 'PY' ? 'Paraguay' : 'Brasil'}` : ''}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t('team.details.founded')}: </span>
                  <span className="font-medium">{team?.foundedYear}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('team.details.founded')}: </span>
                  <span className="font-medium">{team?.foundedYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t('team.details.colors')}: </span>
                  <span className="font-medium">{team?.presidentName}</span>
                  <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: team?.colors?.primary }}
                  />
                  <div 
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: team?.colors?.primary }}
                  />
                  <div 
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: team?.colors?.secondary }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-2xl font-bold">{team?.stats?.matchesPlayed ?? 0}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.matchesPlayed')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-accent/10 p-3">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{team?.stats?.wins ?? 0}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.wins')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-chart-3/10 p-3">
              <Users className="h-5 w-5 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold">{team?.stats?.goalsFor ?? 0}</p>
              <p className="text-xs text-muted-foreground">Goles a favor</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-chart-1/10 p-3">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold">{team?.stats?.points ?? 0}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.points')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Players List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('team.players')}</CardTitle>
          <Button size="sm" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" />
            {t('team.addPlayer')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('team.playerForm.name')}</TableHead>
                  <TableHead>{t('team.playerForm.position')}</TableHead>
                  <TableHead className="text-center">{t('team.playerStats.goals')}</TableHead>
                  <TableHead className="text-center">{t('team.playerStats.assists')}</TableHead>
                  <TableHead className="text-center">{t('team.playerStats.matches')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {player.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {positionLabels[player.position]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{player.stats.goals}</TableCell>
                    <TableCell className="text-center">{player.stats.assists}</TableCell>
                    <TableCell className="text-center">{player.stats.matchesPlayed}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
