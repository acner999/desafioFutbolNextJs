// TorneoApp Types

export type Language = 'es' | 'pt'

export type ChallengeStatus = 
  | 'pending'      // Esperando respuesta
  | 'negotiating'  // En negociacion de fecha
  | 'accepted'     // Aceptado, partido agendado
  | 'rejected'     // Rechazado
  | 'completed'    // Partido jugado
  | 'cancelled'    // Cancelado

export type PlayerPosition = 
  | 'goalkeeper' 
  | 'defender' 
  | 'midfielder' 
  | 'forward'

export interface User {
  id: number
  email: string
  name: string
  teamId: number | null
  role: 'president' | 'manager' | 'player' | 'normal'
  avatar?: string
  cedula?: string
}

export interface Player {
  id: number
  name: string
  number: number
  position: PlayerPosition
  teamId: number
  avatar?: string
  stats: {
    goals: number
    assists: number
    yellowCards: number
    redCards: number
    matchesPlayed: number
  }
}

export interface Team {
  id: number
  name: string
  shortName: string
  logo?: string
  city: string
  country: 'PY' | 'BR'
  foundedYear: number
  presidentName: string
  colors: {
    primary: string
    secondary: string
  }
  stats: {
    matchesPlayed: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    points: number
  }
}

export interface Challenge {
  id: number
  challengerTeamId: number
  challengedTeamId: number
  status: ChallengeStatus
  proposedDate: string
  proposedTime: string
  venue: string
  betAmount?: number
  message?: string
  createdAt: string
  updatedAt: string
  result?: {
    challengerScore: number
    challengedScore: number
    confirmedByChallenger: boolean
    confirmedByChallenged: boolean
  }
  counterProposal?: {
    date: string
    time: string
    venue?: string
    message?: string
  }
}

export interface ChallengeMessage {
  id: string
  challengeId: string
  teamId: string
  message: string
  createdAt: string
}

export interface Tournament {
  id: number
  name: string
  type: 'league' | 'cup' | 'groups'
  status: 'upcoming' | 'active' | 'finished'
  startDate: string
  endDate: string
  teams: number[]
  matches: TournamentMatch[]
  standings: TournamentStanding[]
}

export interface TournamentMatch {
  id: number
  tournamentId: number
  homeTeamId: number
  awayTeamId: number
  date: string
  time: string
  venue: string
  status: 'scheduled' | 'live' | 'finished'
  homeScore?: number
  awayScore?: number
  round: number
}

export interface TournamentStanding {
  teamId: string
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Notification {
  id: number
  type: 'challenge_received' | 'challenge_accepted' | 'challenge_rejected' | 'match_reminder' | 'result_pending'
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: Record<string, unknown>
}

// i18n
export interface Translations {
  [key: string]: string | Translations
}
