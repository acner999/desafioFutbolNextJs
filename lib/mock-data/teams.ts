import type { Team } from '@/lib/types'

export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Deportivo Encarnacion',
    shortName: 'DEP',
    city: 'Encarnacion',
    country: 'PY',
    foundedYear: 2015,
    presidentName: 'Carlos Rodriguez',
    colors: {
      primary: '#1E3A5F',
      secondary: '#FFFFFF',
    },
    stats: {
      matchesPlayed: 45,
      wins: 28,
      draws: 10,
      losses: 7,
      goalsFor: 85,
      goalsAgainst: 35,
      points: 94,
    },
  },
  {
    id: 'team-2',
    name: 'FC Posadas',
    shortName: 'POS',
    city: 'Posadas',
    country: 'BR',
    foundedYear: 2012,
    presidentName: 'Lucas Silva',
    colors: {
      primary: '#00C896',
      secondary: '#1E3A5F',
    },
    stats: {
      matchesPlayed: 42,
      wins: 22,
      draws: 12,
      losses: 8,
      goalsFor: 68,
      goalsAgainst: 38,
      points: 78,
    },
  },
  {
    id: 'team-3',
    name: 'Atletico Frontera',
    shortName: 'ATF',
    city: 'Ciudad del Este',
    country: 'PY',
    foundedYear: 2018,
    presidentName: 'Miguel Gonzalez',
    colors: {
      primary: '#F5A623',
      secondary: '#000000',
    },
    stats: {
      matchesPlayed: 38,
      wins: 18,
      draws: 10,
      losses: 10,
      goalsFor: 55,
      goalsAgainst: 42,
      points: 64,
    },
  },
  {
    id: 'team-4',
    name: 'Foz United',
    shortName: 'FOZ',
    city: 'Foz do Iguacu',
    country: 'BR',
    foundedYear: 2016,
    presidentName: 'Pedro Santos',
    colors: {
      primary: '#DC2626',
      secondary: '#FFFFFF',
    },
    stats: {
      matchesPlayed: 40,
      wins: 20,
      draws: 8,
      losses: 12,
      goalsFor: 62,
      goalsAgainst: 48,
      points: 68,
    },
  },
  {
    id: 'team-5',
    name: 'Real Itapua',
    shortName: 'RIT',
    city: 'Encarnacion',
    country: 'PY',
    foundedYear: 2014,
    presidentName: 'Roberto Benitez',
    colors: {
      primary: '#7C3AED',
      secondary: '#FFFFFF',
    },
    stats: {
      matchesPlayed: 35,
      wins: 15,
      draws: 8,
      losses: 12,
      goalsFor: 48,
      goalsAgainst: 45,
      points: 53,
    },
  },
  {
    id: 'team-6',
    name: 'Missiones FC',
    shortName: 'MFC',
    city: 'Posadas',
    country: 'BR',
    foundedYear: 2019,
    presidentName: 'Fernando Costa',
    colors: {
      primary: '#059669',
      secondary: '#FBBF24',
    },
    stats: {
      matchesPlayed: 30,
      wins: 12,
      draws: 6,
      losses: 12,
      goalsFor: 40,
      goalsAgainst: 42,
      points: 42,
    },
  },
]

export function getTeamById(id: string): Team | undefined {
  return teams.find(team => team.id === id)
}

export function getTeamsByCountry(country: 'PY' | 'BR'): Team[] {
  return teams.filter(team => team.country === country)
}

// Current user's team (for mock purposes)
export const currentUserTeam = teams[0]
