export type PlayerId = "sam" | "josh" | "jamie" | "keo"

export type ResultClass =
  | "eagle_or_better"
  | "birdie"
  | "par"
  | "bogey"
  | "double_bogey_plus"

export type Player = {
  id: PlayerId
  displayName: string
  username: string
  /** Path to a circular avatar image, e.g. "/avatars/sam.jpg". Null until provided. */
  avatar: string | null
}

export type Hole = {
  holeNumber: number
  par: number
  strokes: number | null
}

export type Scorecard = {
  holes: Hole[]
  front9Strokes: number | null
  front9ToPar: number | null
  back9Strokes: number | null
  back9ToPar: number | null
  totalStrokes: number | null
  totalToPar: number | null
}

export type RoundCommentary = {
  players: Partial<Record<PlayerId, string>>
  summary: string | null
}

export type Round = {
  id: string
  roundNumber: 1 | 2 | 3 | 4
  label: string
  status: "in_progress" | "complete"
  scorecards: Record<PlayerId, Scorecard>
  commentary: RoundCommentary
}

export type HoleWinner = PlayerId | "tie" | null

export type LeaderboardRow = {
  playerId: PlayerId
  position: number
  positionDisplay: string  // "1", "T2", "4"
  r1ToPar: number | null
  r2ToPar: number | null
  r3ToPar: number | null
  r4ToPar: number | null
  totalToPar: number
}

export type PlayerStats = {
  eagles: number
  birdies: number
  pars: number
  bogeys: number
  doubleBogeyPlus: number
  holesWon: number
  holesLost: number
  holesTied: number
  bestRound: number | null
  scoringAverage: number | null
}
