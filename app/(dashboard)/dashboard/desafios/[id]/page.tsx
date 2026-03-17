"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Check,
  X,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useLanguage } from '@/lib/i18n'
import { useAuth } from '@/lib/contexts/auth-context'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  negotiating: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  accepted: 'bg-accent/10 text-accent border-accent/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  // In client components use `useParams()` to read dynamic route params
  const routeParams = useParams()
  const id = (routeParams && (routeParams as any).id) || (params as any)?.id
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showCounterDialog, setShowCounterDialog] = useState(false)
  const [counterProposal, setCounterProposal] = useState({ date: '', time: '', message: '' })

  const [challenge, setChallenge] = useState<any>(null)
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({})

  useEffect(() => {
    async function load() {
      try {
        const [chRes, tRes] = await Promise.all([
          fetch(`/api/challenges/${id}`),
          fetch('/api/teams'),
        ])
        const chJson = await chRes.json()
        const tJson = await tRes.json()
        const ch = chJson.challenge
        const teams = tJson.teams || []
        const map = Object.fromEntries(teams.map((t: any) => [t.id, t]))
        setChallenge(ch)
        setTeamsMap(map)
      } catch (err) {
        console.warn('[ChallengeDetail] load failed', err)
      }
    }
    load()
  }, [id])

  if (!challenge) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Desafio no encontrado</p>
      </div>
    )
  }

  const challengedId = challenge.challenged_team_id ?? challenge.challengedTeamId
  const challengerId = challenge.challenger_team_id ?? challenge.challengerTeamId
  const isReceived = challengedId === user?.teamId
  const otherId = isReceived ? challengerId : challengedId
  const otherTeam = teamsMap[otherId]
  const myTeam = teamsMap[user?.teamId]
  const canRespond = isReceived && challenge.status === 'pending'
  const canNegotiate = challenge.status === 'negotiating'

  const handleAccept = async () => {
    setIsLoading(true)
    // TODO: call API to accept
    await new Promise((r) => setTimeout(r, 800))
    router.push('/dashboard/desafios')
  }

  const handleReject = async () => {
    setIsLoading(true)
    // TODO: call API to reject
    await new Promise((r) => setTimeout(r, 800))
    router.push('/dashboard/desafios')
  }

  const handleCounterProposal = async () => {
    setIsLoading(true)
    // TODO: call API to submit counter
    await new Promise((r) => setTimeout(r, 800))
    setShowCounterDialog(false)
    router.push('/dashboard/desafios')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/desafios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Desafio vs {otherTeam?.name}</h1>
            <Badge variant="outline" className={cn('capitalize', statusColors[challenge.status])}>
              {t(`challenges.status.${challenge.status}`)}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">
            {isReceived ? 'Recibido' : 'Enviado'} el {new Date(challenge.created_at ?? challenge.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Match Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informacion del Partido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Teams */}
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-xl" style={{ backgroundColor: myTeam?.colors?.primary || '#ccc' }} />
                  <p className="font-semibold text-foreground">{myTeam?.shortName}</p>
                  <p className="text-xs text-muted-foreground">{isReceived ? 'Local' : 'Visitante'}</p>
                </div>

                <div className="text-center">
                  {challenge.result ? (
                    <div className="text-3xl font-bold text-foreground">
                      {isReceived ? `${challenge.result.challengedScore} - ${challenge.result.challengerScore}` : `${challenge.result.challengerScore} - ${challenge.result.challengedScore}`}
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">VS</span>
                  )}
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-2 h-16 w-16 rounded-xl" style={{ backgroundColor: otherTeam?.colors?.primary || '#ccc' }} />
                  <p className="font-semibold text-foreground">{otherTeam?.shortName}</p>
                  <p className="text-xs text-muted-foreground">{isReceived ? 'Visitante' : 'Local'}</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="font-medium text-foreground">{challenge.proposed_date ?? challenge.proposedDate} - {challenge.proposed_time ?? challenge.proposedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lugar</p>
                    <p className="font-medium text-foreground">{challenge.venue}</p>
                  </div>
                </div>
                {(challenge.bet_amount ?? challenge.betAmount) && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Apuesta</p>
                      <p className="font-medium text-foreground">{(challenge.bet_amount ?? challenge.betAmount).toLocaleString()} Gs</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              {challenge.message && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Mensaje del {isReceived ? 'retador' : 'rival'}:</p>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="italic text-foreground">&quot;{challenge.message}&quot;</p>
                  </div>
                </div>
              )}

              {/* Counter Proposal */}
              {(challenge.counter_proposal ?? challenge.counterProposal) && (
                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                  <p className="mb-2 flex items-center gap-2 font-medium text-purple-500"><MessageSquare className="h-4 w-4" />Contrapropuesta</p>
                  <p className="text-sm text-foreground">Nueva fecha: {(challenge.counter_proposal ?? challenge.counterProposal).date} - {(challenge.counter_proposal ?? challenge.counterProposal).time}</p>
                  {(challenge.counter_proposal ?? challenge.counterProposal).message && (
                    <p className="mt-2 text-sm italic text-muted-foreground">&quot;{(challenge.counter_proposal ?? challenge.counterProposal).message}&quot;</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {(canRespond || canNegotiate) && (
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleAccept} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} {t('challenges.actions.accept')}
                  </Button>

                  <Dialog open={showCounterDialog} onOpenChange={setShowCounterDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" />{t('challenges.actions.counterPropose')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contrapropuesta</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Nueva Fecha</Label>
                            <Input type="date" value={counterProposal.date} onChange={(e)=>setCounterProposal(prev=>({...prev,date:e.target.value}))} />
                          </div>
                          <div className="space-y-2">
                            <Label>Nueva Hora</Label>
                            <Input type="time" value={counterProposal.time} onChange={(e)=>setCounterProposal(prev=>({...prev,time:e.target.value}))} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Mensaje</Label>
                          <Textarea placeholder="Explica tu propuesta..." value={counterProposal.message} onChange={(e)=>setCounterProposal(prev=>({...prev,message:e.target.value}))} rows={3} />
                        </div>
                        <Button onClick={handleCounterProposal} disabled={!counterProposal.date || isLoading} className="w-full">{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Enviar Contrapropuesta</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="destructive" onClick={handleReject} disabled={isLoading}><X className="mr-2 h-4 w-4" />{t('challenges.actions.reject')}</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Opponent Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informacion del Rival</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl" style={{ backgroundColor: otherTeam?.colors?.primary || '#ccc' }} />
                  <div>
                    <p className="font-semibold text-foreground">{otherTeam?.name}</p>
                    <p className="text-xs text-muted-foreground">{otherTeam?.city}, {otherTeam?.country === 'PY' ? 'Paraguay' : 'Brasil'}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <p className="mb-2 text-sm font-medium">Estadisticas</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Partidos</p>
                      <p className="font-semibold">{otherTeam?.stats?.matchesPlayed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Victorias</p>
                      <p className="font-semibold">{otherTeam?.stats?.wins}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Goles</p>
                      <p className="font-semibold">{otherTeam?.stats?.goalsFor}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Puntos</p>
                      <p className="font-semibold">{otherTeam?.stats?.points}</p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">Presidente: {otherTeam?.presidentName}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
