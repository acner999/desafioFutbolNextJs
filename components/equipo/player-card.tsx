'use client'

import { Player } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PlayerCardProps {
  player: Player
}

export function PlayerCard({ player }: PlayerCardProps) {
  const positionColors: Record<string, string> = {
    'Portero': 'bg-blue-100 text-blue-800',
    'Defensa': 'bg-green-100 text-green-800',
    'Centrocampista': 'bg-yellow-100 text-yellow-800',
    'Delantero': 'bg-red-100 text-red-800',
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-torneo-green to-torneo-navy flex items-center justify-center text-white font-bold">
              {player.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{player.name}</h3>
              <p className="text-sm text-muted-foreground">#{player.number}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className={`${positionColors[player.position] || 'bg-gray-100 text-gray-800'}`}>
              {player.position}
            </Badge>
            {player.isActive && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Activo
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
