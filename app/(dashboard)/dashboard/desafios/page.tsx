"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Inbox, Send, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLanguage } from '@/lib/i18n'
import { ChallengeCard } from '@/components/desafios/challenge-card'
import { useAuth } from '@/lib/contexts/auth-context'


export default function DesafiosPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('received')
  const { user } = useAuth()
  const [challenges, setChallenges] = useState<any>({ received: [], sent: [], history: [] })
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
        const all = chJson.challenges || []
        const map = Object.fromEntries((tJson.teams || []).map((t: any) => [t.id, t]))

        const received = all.filter((c: any) => (c.challenged_team_id ?? c.challengedTeamId) === user.teamId)
        const sent = all.filter((c: any) => (c.challenger_team_id ?? c.challengerTeamId) === user.teamId)
        const history = all.filter((c: any) => ['completed','rejected','cancelled'].includes(c.status))

        setChallenges({ received, sent, history })
        setTeamsMap(map)
      } catch (err) {
        console.warn('[Desafios] load failed', err)
      }
    }
    load()
  }, [user?.teamId])

  // Filter received challenges that need action
  const receivedPending = challenges.received.filter((c: any) => ['pending','negotiating'].includes(c.status))
  // Filter sent challenges
  const sentActive = challenges.sent.filter((c: any) => ['pending','negotiating','accepted'].includes(c.status))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {t('challenges.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona tus desafios y partidos amistosos
          </p>
        </div>
        <Link href="/dashboard/desafios/nuevo">
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t('challenges.new')}
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="received" className="gap-2">
            <Inbox className="h-4 w-4" />
            <span className="hidden sm:inline">{t('challenges.received')}</span>
            {receivedPending.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                {receivedPending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{t('challenges.sent')}</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">{t('challenges.history')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Received Tab */}
        <TabsContent value="received" className="mt-6">
          {receivedPending.length === 0 ? (
            <EmptyState message={t('challenges.empty.received')} />
          ) : (
            <div className="space-y-4">
              {receivedPending.map((challenge:any) => (
                <ChallengeCard key={challenge.id} challenge={challenge} teamsMap={teamsMap} userTeamId={user?.teamId} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Sent Tab */}
        <TabsContent value="sent" className="mt-6">
          {sentActive.length === 0 ? (
            <EmptyState message={t('challenges.empty.sent')} />
          ) : (
            <div className="space-y-4">
              {sentActive.map((challenge:any) => (
                <ChallengeCard key={challenge.id} challenge={challenge} teamsMap={teamsMap} userTeamId={user?.teamId} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          {challenges.history.length === 0 ? (
            <EmptyState message={t('challenges.empty.history')} />
          ) : (
            <div className="space-y-4">
              {challenges.history.map((challenge:any) => (
                <ChallengeCard key={challenge.id} challenge={challenge} teamsMap={teamsMap} userTeamId={user?.teamId} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
      <Inbox className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
