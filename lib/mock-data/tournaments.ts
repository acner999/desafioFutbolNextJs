import type { Tournament, TournamentMatch, TournamentStanding } from '@/lib/types'

export const tournaments: Tournament[] = [
  {
    id: 'tournament-1',
    name: 'Copa Frontera 2026',
    type: 'league',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-05-30',
    teams: ['team-1', 'team-2', 'team-3', 'team-4', 'team-5', 'team-6'],
    matches: [
      {
        id: 'match-1',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-1',
        awayTeamId: 'team-2',
        date: '2026-02-08',
        time: '16:00',
        venue: 'Cancha Deportivo Encarnacion',
        status: 'finished',
        homeScore: 2,
        awayScore: 1,
        round: 1,
      },
      {
        id: 'match-2',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-3',
        awayTeamId: 'team-4',
        date: '2026-02-08',
        time: '18:00',
        venue: 'Complejo Deportivo CDE',
        status: 'finished',
        homeScore: 1,
        awayScore: 1,
        round: 1,
      },
      {
        id: 'match-3',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-5',
        awayTeamId: 'team-6',
        date: '2026-02-09',
        time: '16:00',
        venue: 'Estadio Real Itapua',
        status: 'finished',
        homeScore: 3,
        awayScore: 0,
        round: 1,
      },
      {
        id: 'match-4',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-2',
        awayTeamId: 'team-3',
        date: '2026-02-15',
        time: '16:00',
        venue: 'Cancha Municipal Posadas',
        status: 'finished',
        homeScore: 2,
        awayScore: 2,
        round: 2,
      },
      {
        id: 'match-5',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-4',
        awayTeamId: 'team-5',
        date: '2026-02-15',
        time: '18:00',
        venue: 'Estadio Tres Fronteras',
        status: 'finished',
        homeScore: 0,
        awayScore: 2,
        round: 2,
      },
      {
        id: 'match-6',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-6',
        awayTeamId: 'team-1',
        date: '2026-02-16',
        time: '16:00',
        venue: 'Campo Missiones',
        status: 'finished',
        homeScore: 1,
        awayScore: 4,
        round: 2,
      },
      {
        id: 'match-7',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-1',
        awayTeamId: 'team-3',
        date: '2026-03-22',
        time: '16:00',
        venue: 'Cancha Deportivo Encarnacion',
        status: 'scheduled',
        round: 3,
      },
      {
        id: 'match-8',
        tournamentId: 'tournament-1',
        homeTeamId: 'team-2',
        awayTeamId: 'team-5',
        date: '2026-03-22',
        time: '18:00',
        venue: 'Cancha Municipal Posadas',
        status: 'scheduled',
        round: 3,
      },
    ],
    standings: [
      { teamId: 'team-1', position: 1, played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 6 },
      { teamId: 'team-5', position: 2, played: 2, won: 2, drawn: 0, lost: 0, goalsFor: 5, goalsAgainst: 0, goalDifference: 5, points: 6 },
      { teamId: 'team-2', position: 3, played: 2, won: 0, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 4, goalDifference: -1, points: 1 },
      { teamId: 'team-3', position: 4, played: 2, won: 0, drawn: 2, lost: 0, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 2 },
      { teamId: 'team-4', position: 5, played: 2, won: 0, drawn: 1, lost: 1, goalsFor: 1, goalsAgainst: 3, goalDifference: -2, points: 1 },
      { teamId: 'team-6', position: 6, played: 2, won: 0, drawn: 0, lost: 2, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 },
    ],
  },
  {
    id: 'tournament-2',
    name: 'Torneo Clausura Encarnacion',
    type: 'cup',
    status: 'upcoming',
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    teams: ['team-1', 'team-3', 'team-5'],
    matches: [],
    standings: [],
  },
  {
    id: 'tournament-3',
    name: 'Liga Amateur Brasil-PY 2025',
    type: 'league',
    status: 'finished',
    startDate: '2025-08-01',
    endDate: '2025-12-15',
    teams: ['team-1', 'team-2', 'team-4', 'team-6'],
    matches: [],
    standings: [
      { teamId: 'team-1', position: 1, played: 6, won: 5, drawn: 1, lost: 0, goalsFor: 15, goalsAgainst: 4, goalDifference: 11, points: 16 },
      { teamId: 'team-2', position: 2, played: 6, won: 3, drawn: 2, lost: 1, goalsFor: 10, goalsAgainst: 6, goalDifference: 4, points: 11 },
      { teamId: 'team-4', position: 3, played: 6, won: 2, drawn: 1, lost: 3, goalsFor: 8, goalsAgainst: 10, goalDifference: -2, points: 7 },
      { teamId: 'team-6', position: 4, played: 6, won: 0, drawn: 0, lost: 6, goalsFor: 3, goalsAgainst: 16, goalDifference: -13, points: 0 },
    ],
  },
]

export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find(t => t.id === id)
}

export function getTournamentsForTeam(teamId: string): Tournament[] {
  return tournaments.filter(t => t.teams.includes(teamId))
}

export function getUpcomingMatchesForTeam(teamId: string): TournamentMatch[] {
  const allMatches: TournamentMatch[] = []
  
  tournaments.forEach(tournament => {
    tournament.matches.forEach(match => {
      if ((match.homeTeamId === teamId || match.awayTeamId === teamId) && match.status === 'scheduled') {
        allMatches.push(match)
      }
    })
  })
  
  return allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
