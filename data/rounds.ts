import type { Round, Scorecard, Hole, PlayerId } from "./types"
import { HOLE_PARS } from "./course"

// Helpers for building scorecards. Used here, not exported.
function emptyHoles(): Hole[] {
  return HOLE_PARS.map((par, i) => ({ holeNumber: i + 1, par, strokes: null }))
}
function holesFromStrokes(strokes: (number | null)[]): Hole[] {
  if (strokes.length !== 18) throw new Error("expected 18 holes")
  return HOLE_PARS.map((par, i) => ({ holeNumber: i + 1, par, strokes: strokes[i] }))
}
function emptyScorecard(): Scorecard {
  return {
    holes: emptyHoles(),
    front9Strokes: null, front9ToPar: null,
    back9Strokes:  null, back9ToPar:  null,
    totalStrokes:  null, totalToPar:  null,
  }
}

// Day 1 — front 9 played, back 9 not played.
// Sam: 4,3,3,2,3,3,4,5,5 → 32 strokes, -4
const sam_r1 = holesFromStrokes([4,3,3,2,3,3,4,5,5,  null,null,null,null,null,null,null,null,null])
// Keo: 6,3,3,4,3,3,5,4,3 → 34 strokes, -2
const keo_r1 = holesFromStrokes([6,3,3,4,3,3,5,4,3,  null,null,null,null,null,null,null,null,null])
// Jamie: 4,4,4,3,4,3,4,5,4 → 35 strokes, -1
const jamie_r1 = holesFromStrokes([4,4,4,3,4,3,4,5,4, null,null,null,null,null,null,null,null,null])
// Josh: per-hole unknown but front9ToPar = -2 (so front9Strokes = 34)
const josh_r1 = holesFromStrokes(Array(18).fill(null))

const r1Scorecards: Record<PlayerId, Scorecard> = {
  sam:   { holes: sam_r1,   front9Strokes: 32, front9ToPar: -4, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  josh:  { holes: josh_r1,  front9Strokes: 34, front9ToPar: -2, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  jamie: { holes: jamie_r1, front9Strokes: 35, front9ToPar: -1, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
  keo:   { holes: keo_r1,   front9Strokes: 34, front9ToPar: -2, back9Strokes: null, back9ToPar: null, totalStrokes: null, totalToPar: null },
}

function emptyRound(roundNumber: 1 | 2 | 3 | 4, label: string): Round {
  return {
    id: `round_${roundNumber}`,
    roundNumber,
    label,
    status: "in_progress",
    scorecards: { sam: emptyScorecard(), josh: emptyScorecard(), jamie: emptyScorecard(), keo: emptyScorecard() },
    commentary: { players: {}, summary: null },
  }
}

export const ROUNDS: Round[] = [
  {
    id: "round_1",
    roundNumber: 1,
    label: "Day 1",
    status: "in_progress",
    scorecards: r1Scorecards,
    commentary: { players: {}, summary: null },
  },
  emptyRound(2, "Day 2"),
  emptyRound(3, "Day 3"),
  emptyRound(4, "Day 4"),
]

export const SEASON_COMMENTARY: string | null = null
