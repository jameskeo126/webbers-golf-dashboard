import type { Round, PlayerId, Scorecard } from "@/data/types"
import { HOLE_PARS, FRONT_9_PAR, BACK_9_PAR, TOTAL_PAR } from "@/data/course"

function holes(strokes: (number | null)[]) {
  if (strokes.length !== 18) throw new Error("expected 18 strokes")
  return HOLE_PARS.map((par, i) => ({ holeNumber: i + 1, par, strokes: strokes[i] }))
}

function sumRange(arr: (number | null)[], from: number, to: number): number | null {
  let sum = 0, any = false
  for (let i = from; i < to; i++) {
    const v = arr[i]
    if (v === null || v === undefined) continue
    sum += v
    any = true
  }
  return any ? sum : null
}

// Build a Scorecard from a strokes array; totals are computed from the strokes.
// For Josh-style cases where per-hole front 9 is null but a section total is known,
// pass the totals via `overrides`.
export function makeScorecard(
  strokes: (number | null)[],
  overrides: Partial<Scorecard> = {}
): Scorecard {
  const f = sumRange(strokes, 0, 9)
  const b = sumRange(strokes, 9, 18)
  const t = (f !== null && b !== null) ? f + b : null
  return {
    holes: holes(strokes),
    front9Strokes: f,
    front9ToPar: f === null ? null : f - FRONT_9_PAR,
    back9Strokes: b,
    back9ToPar: b === null ? null : b - BACK_9_PAR,
    totalStrokes: t,
    totalToPar: t === null ? null : t - TOTAL_PAR,
    ...overrides,
  }
}

export function makeRound(
  roundNumber: 1 | 2 | 3 | 4,
  status: "in_progress" | "complete",
  scorecards: Record<PlayerId, Scorecard>,
): Round {
  return {
    id: `round_${roundNumber}`,
    roundNumber,
    label: `Day ${roundNumber}`,
    status,
    scorecards,
    commentary: { players: {}, summary: null },
  }
}

export function emptyScorecard(): Scorecard {
  return makeScorecard(Array(18).fill(null))
}

export function emptyRound(roundNumber: 1 | 2 | 3 | 4): Round {
  return makeRound(roundNumber, "in_progress", {
    sam: emptyScorecard(),
    josh: emptyScorecard(),
    jamie: emptyScorecard(),
    keo: emptyScorecard(),
  })
}
