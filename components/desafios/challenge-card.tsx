"use client"

import Link from 'next/link'
import { Calendar, MapPin, DollarSign, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'
import type { Challenge } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  pending: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  negotiating: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  accepted: 'bg-accent/10 text-accent border-accent/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-muted text-muted-foreground border-border',
  cancelled: 'bg-muted text-muted-foreground border-border',
}

interface ChallengeCardProps {
  challenge: any
  showActions?: boolean
  teamsMap?: Record<string, any>
  userTeamId?: string
}

export function ChallengeCard({ challenge, showActions = true, teamsMap = {}, userTeamId }: ChallengeCardProps) {
  const { t } = useLanguage()
  // support both API (snake_case) and legacy (camelCase)
  const challengedId = challenge.challenged_team_id ?? challenge.challengedTeamId
  const challengerId = challenge.challenger_team_id ?? challenge.challengerTeamId
  const status = challenge.status
  const proposedDate = challenge.proposed_date ?? challenge.proposedDate
  const proposedTime = challenge.proposed_time ?? challenge.proposedTime
  const counterProposal = challenge.counter_proposal ?? challenge.counterProposal
  const result = challenge.result
  const betAmount = challenge.bet_amount ?? challenge.betAmount

  const teamId = userTeamId
  const isReceived = challengedId === teamId
  const otherTeamId = isReceived ? challengerId : challengedId
  const otherTeam = teamsMap[otherTeamId]

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Team Info */}
          <div className="flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-xl"
              style={{ backgroundColor: otherTeam?.colors.primary || '#ccc' }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {isReceived ? t('challenges.details.challenger') : t('challenges.details.challenged')}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", statusColors[challenge.status])}
                >
                  {t(`challenges.status.${challenge.status}`)}
                </Badge>
              </div>
              <h3 className="mt-1 font-semibold text-foreground">
                {otherTeam?.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {otherTeam?.city}, {otherTeam?.country === 'PY' ? 'Paraguay' : 'Brasil'}
              </p>
            </div>
          </div>

          {/* Result if completed */}
          {result && (
            <div className="text-right">
              <span className="text-2xl font-bold text-foreground">
                {isReceived 
                  ? `${result.challengedScore} - ${result.challengerScore}`
                  : `${result.challengerScore} - ${result.challengedScore}`
                }
              </span>
            </div>
          )}
        </div>

        {/* Details */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{proposedDate} - {proposedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{challenge.venue}</span>
          </div>
          {typeof betAmount !== 'undefined' && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>{betAmount.toLocaleString()} Gs</span>
            </div>
          )}
        </div>

        {/* Message */}
        {challenge.message && (
          <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm italic text-muted-foreground">
            &quot;{challenge.message}&quot;
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex justify-end">
            <Link href={`/dashboard/desafios/${challenge.id}`}>
              <Button variant="outline" size="sm" className="gap-1">
                {t('challenges.actions.viewDetails')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
