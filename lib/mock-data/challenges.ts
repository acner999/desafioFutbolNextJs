import type { Challenge } from '@/lib/types'

export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    challengerTeamId: 'team-2',
    challengedTeamId: 'team-1',
    status: 'pending',
    proposedDate: '2026-03-25',
    proposedTime: '15:00',
    venue: 'Cancha Municipal Posadas',
    betAmount: 500000,
    message: 'Les proponemos un amistoso para prepararnos para el torneo. Que dicen?',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'challenge-2',
    challengerTeamId: 'team-3',
    challengedTeamId: 'team-1',
    status: 'pending',
    proposedDate: '2026-03-28',
    proposedTime: '16:30',
    venue: 'Complejo Deportivo CDE',
    message: 'Queremos la revancha del mes pasado!',
    createdAt: '2026-03-14T14:30:00Z',
    updatedAt: '2026-03-14T14:30:00Z',
  },
  {
    id: 'challenge-3',
    challengerTeamId: 'team-1',
    challengedTeamId: 'team-4',
    status: 'accepted',
    proposedDate: '2026-03-22',
    proposedTime: '17:00',
    venue: 'Estadio Tres Fronteras',
    betAmount: 300000,
    message: 'Partido amistoso de preparacion',
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-12T11:00:00Z',
  },
  {
    id: 'challenge-4',
    challengerTeamId: 'team-1',
    challengedTeamId: 'team-5',
    status: 'negotiating',
    proposedDate: '2026-04-05',
    proposedTime: '15:30',
    venue: 'Cancha Deportivo Encarnacion',
    message: 'Partido para definir el ranking de la zona',
    createdAt: '2026-03-13T16:00:00Z',
    updatedAt: '2026-03-16T08:00:00Z',
    counterProposal: {
      date: '2026-04-06',
      time: '16:00',
      message: 'Podemos el domingo a esa hora?',
    },
  },
  {
    id: 'challenge-5',
    challengerTeamId: 'team-1',
    challengedTeamId: 'team-2',
    status: 'completed',
    proposedDate: '2026-03-08',
    proposedTime: '16:00',
    venue: 'Cancha Municipal Encarnacion',
    betAmount: 200000,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-08T19:00:00Z',
    result: {
      challengerScore: 3,
      challengedScore: 1,
      confirmedByChallenger: true,
      confirmedByChallenged: true,
    },
  },
  {
    id: 'challenge-6',
    challengerTeamId: 'team-6',
    challengedTeamId: 'team-1',
    status: 'rejected',
    proposedDate: '2026-03-20',
    proposedTime: '14:00',
    venue: 'Campo Missiones',
    message: 'Amistoso de fin de semana',
    createdAt: '2026-03-12T12:00:00Z',
    updatedAt: '2026-03-13T09:00:00Z',
  },
  {
    id: 'challenge-7',
    challengerTeamId: 'team-4',
    challengedTeamId: 'team-1',
    status: 'completed',
    proposedDate: '2026-02-28',
    proposedTime: '17:00',
    venue: 'Estadio Municipal Foz',
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-02-28T20:00:00Z',
    result: {
      challengerScore: 2,
      challengedScore: 2,
      confirmedByChallenger: true,
      confirmedByChallenged: true,
    },
  },
  {
    id: 'challenge-8',
    challengerTeamId: 'team-1',
    challengedTeamId: 'team-3',
    status: 'completed',
    proposedDate: '2026-02-15',
    proposedTime: '16:00',
    venue: 'Cancha Deportivo Encarnacion',
    betAmount: 400000,
    createdAt: '2026-02-08T11:00:00Z',
    updatedAt: '2026-02-15T19:30:00Z',
    result: {
      challengerScore: 4,
      challengedScore: 2,
      confirmedByChallenger: true,
      confirmedByChallenged: true,
    },
  },
]

export function getChallengesForTeam(teamId: string) {
  return {
    sent: challenges.filter(c => c.challengerTeamId === teamId),
    received: challenges.filter(c => c.challengedTeamId === teamId),
    pending: challenges.filter(
      c => (c.challengedTeamId === teamId && c.status === 'pending') ||
           (c.challengerTeamId === teamId && c.status === 'negotiating')
    ),
    upcoming: challenges.filter(
      c => (c.challengerTeamId === teamId || c.challengedTeamId === teamId) &&
           c.status === 'accepted'
    ),
    history: challenges.filter(
      c => (c.challengerTeamId === teamId || c.challengedTeamId === teamId) &&
           ['completed', 'rejected', 'cancelled'].includes(c.status)
    ),
  }
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find(c => c.id === id)
}
