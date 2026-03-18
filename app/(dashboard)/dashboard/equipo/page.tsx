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
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EquipoPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const InvitesModal = dynamic(() => import('@/components/team/InvitesModal'), { ssr: false })
  const { toast } = useToast()
  const [team, setTeam] = useState<any | null>(null)
  const [players, setPlayers] = useState<any[]>([])

  const [creatingTeam, setCreatingTeam] = useState(false)
  const [createTeamError, setCreateTeamError] = useState('')
  const [createTeamLoading, setCreateTeamLoading] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', shortName: '', city: '', country: 'PY' as 'PY' | 'BR' })

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
      } else {
        const j = await teamRes.json().catch(() => ({}))
        toast({ variant: 'destructive', title: 'Error', description: j.error || 'No se pudo cargar el equipo' })
      }
      if (playersRes.ok) {
        const playersJson = await playersRes.json()
        setPlayers(playersJson.players || [])
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los jugadores' })
      }
    } catch (err) {
      console.warn('[Equipo] load failed', err)
      toast({ variant: 'destructive', title: 'Error', description: 'Error de red al cargar datos' })
    }
  }

  useEffect(() => { load() }, [user?.teamId])

  // UI states for edit/add
  const [editingTeam, setEditingTeam] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', shortName: '', city: '', country: 'PY' as 'PY' | 'BR' })
  const [addPlayerOpen, setAddPlayerOpen] = useState(false)
  const [playerForm, setPlayerForm] = useState({ name: '', number: '', position: 'forward' })
  const [playerEmail, setPlayerEmail] = useState('')

  const positionLabels: Record<string, string> = {
    goalkeeper: t('team.playerForm.positions.goalkeeper'),
    defender: t('team.playerForm.positions.defender'),
    midfielder: t('team.playerForm.positions.midfielder'),
    forward: t('team.playerForm.positions.forward'),
  }

  return (
    <div className="space-y-6">
      {/* If user has no team, show create team UI */}
      {!user?.teamId && (
        <Card>
          <CardContent>
            <h3 className="text-lg font-bold">{t('team.create.title') || 'Crear equipo'}</h3>
            <p className="text-sm text-muted-foreground">{t('team.create.subtitle') || 'Crea el equipo y comienza a invitar jugadores.'}</p>

            {!creatingTeam ? (
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setCreatingTeam(true)}>{t('team.create.cta') || 'Crear equipo'}</Button>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <input className="input" placeholder={t('team.form.name') || 'Nombre del equipo'} value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} />
                <input className="input" placeholder={t('team.form.shortName') || 'Abrev.'} value={newTeam.shortName} onChange={e => setNewTeam({ ...newTeam, shortName: e.target.value })} />
                <input className="input" placeholder={t('team.form.city') || 'Ciudad'} value={newTeam.city} onChange={e => setNewTeam({ ...newTeam, city: e.target.value })} />
                <select className="input" value={newTeam.country} onChange={e => setNewTeam({ ...newTeam, country: e.target.value as any })}>
                  <option value="PY">Paraguay</option>
                  <option value="BR">Brasil</option>
                </select>

                <div className="col-span-2 mt-2 flex gap-2">
                  <Button disabled={createTeamLoading} onClick={async () => {
                    setCreateTeamLoading(true)
                    setCreateTeamError('')
                    try {
                      const res = await fetch('/api/teams', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newTeam) })
                      const json = await res.json()
                      if (!res.ok) {
                        setCreateTeamError(json.error || 'Error al crear equipo')
                      } else {
                        setTeam(json.team || null)
                        setCreatingTeam(false)
                      }
                    } catch (err) {
                      setCreateTeamError('Error de red')
                    } finally {
                      setCreateTeamLoading(false)
                    }
                  }}>{createTeamLoading ? t('common.loading') || 'Creando...' : t('team.create.create') || 'Crear'}</Button>
                  <Button variant="outline" onClick={() => setCreatingTeam(false)}>{t('common.cancel') || 'Cancelar'}</Button>
                </div>
                {createTeamError && <div className="col-span-2 text-sm text-red-500">{createTeamError}</div>}
              </div>
            )}
          </CardContent>
        </Card>
      )}
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
            {t('team.invitePlayer')}
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
          <Dialog open={addPlayerOpen} onOpenChange={setAddPlayerOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4" />
                {t('team.addPlayer')}
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{t('team.addPlayer') || 'Agregar jugador'}</DialogTitle>
              </DialogHeader>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col">
                  <Label className="mb-1">{t('team.playerForm.name') || 'Nombre'}</Label>
                  <Input placeholder={t('team.playerForm.name') || 'Nombre'} value={playerForm.name} onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })} autoFocus />
                </div>
                <div className="flex flex-col">
                  <Label className="mb-1">{t('team.playerForm.number') || 'Número'}</Label>
                  <Input placeholder={t('team.playerForm.number') || 'Número'} value={playerForm.number} onChange={e => setPlayerForm({ ...playerForm, number: e.target.value })} />
                </div>
                <div className="flex flex-col">
                  <Label className="mb-1">{t('team.playerForm.position') || 'Posición'}</Label>
                  <select className="input" value={playerForm.position} onChange={e => setPlayerForm({ ...playerForm, position: e.target.value })}>
                    <option value="goalkeeper">Portero</option>
                    <option value="defender">Defensa</option>
                    <option value="midfielder">Mediocampista</option>
                    <option value="forward">Delantero</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <Label className="mb-1">Email (opcional)</Label>
                  <Input className="w-full" placeholder="correo@ejemplo.com" value={playerEmail} onChange={e => setPlayerEmail(e.target.value)} />
                  <p className="text-xs text-muted-foreground mt-1">Si ingresas un email se enviará una invitación para que se registre como jugador.</p>
                </div>

                <div className="col-span-3 mt-3 flex justify-end gap-2">
                  <Button onClick={async () => {
                    if (!playerForm.name) { toast({ variant: 'destructive', title: 'Error', description: 'El nombre es requerido' }); return }
                    try {
                      // Validate optional email
                      if (playerEmail) {
                        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(playerEmail)
                        if (!emailOk) { toast({ variant: 'destructive', title: 'Email inválido', description: 'Ingresa un email válido o déjalo vacío' }); return }
                      }

                      // Create player or send invite depending on email
                      const bodyPayload: any = { name: playerForm.name, number: Number(playerForm.number) || null, position: playerForm.position, teamId: team?.id }
                      if (playerEmail) bodyPayload.inviteeEmail = playerEmail
                      const res = await fetch('/api/players', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(bodyPayload) })
                      const j = await res.json()
                      if (!res.ok) {
                        toast({ variant: 'destructive', title: 'Error', description: j.error || 'No se pudo crear jugador' })
                      } else {
                        if (j.invited || j.invited === true) {
                          toast({ title: 'Invitación enviada', description: playerEmail })
                        } else if (j.assignedExistingUser) {
                          toast({ title: 'Jugador agregado y asignado' })
                        } else {
                          toast({ title: 'Jugador agregado' })
                        }
                        setAddPlayerOpen(false)
                        setPlayerForm({ name: '', number: '', position: 'forward' })
                        setPlayerEmail('')
                        load()
                      }
                    } catch (err) {
                      toast({ variant: 'destructive', title: 'Error', description: 'Error de red' })
                    }
                  }}>{t('team.addPlayer') || 'Agregar'}</Button>
                  <Button variant="outline" onClick={() => { setAddPlayerOpen(false); setPlayerEmail('') }}>{t('common.cancel') || 'Cancelar'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
