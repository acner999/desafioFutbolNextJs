'use client'

import { Tournament } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

interface TournamentCardProps {
  tournament: Tournament
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const { t } = useLanguage()

  const statusColors: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'completed': 'bg-blue-100 text-blue-800',
    'upcoming': 'bg-yellow-100 text-yellow-800',
  }

  return (
    <Link href={`/dashboard/torneos/${tournament.id}`}>
      <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-lg flex-1">{tournament.name}</h3>
            <Badge className={statusColors[tournament.status] || 'bg-gray-100 text-gray-800'}>
              {tournament.status === 'active' && t('En progreso')}
              {tournament.status === 'completed' && t('Completado')}
              {tournament.status === 'upcoming' && t('Próximamente')}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{tournament.location}</p>
          
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">{t('Equipos')}</p>
              <p className="font-semibold text-foreground">{tournament.teams.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('Jornada')}</p>
              <p className="font-semibold text-foreground">{tournament.currentRound}/{tournament.totalRounds}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t('Premio')}</p>
              <p className="font-semibold text-accent">${tournament.prizePool}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
