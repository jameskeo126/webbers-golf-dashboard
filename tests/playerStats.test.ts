import { describe, it, expect } from "vitest"
import { computePlayerStats } from "@/lib/playerStats"
import { makeRound, makeScorecard, emptyRound } from "./fixtures"

// Synthetic Day 1 front-9-only fixture. Verifies computePlayerStats against
// known inputs — does not depend on live data/rounds.ts, so score updates
// don't keep breaking tests.
const sam_front9   = [4,3,3,2,3,3,4,5,5,  null,null,null,null,null,null,null,null,null]
const josh_nofront = [null,null,null,null,null,null,null,null,null,  null,null,null,null,null,null,null,null,null]
const jamie_front9 = [4,4,4,3,4,3,4,5,4,  null,null,null,null,null,null,null,null,null]
const keo_front9   = [6,3,3,4,3,3,5,4,3,  null,null,null,null,null,null,null,null,null]

const FIXTURE = [
  makeRound(1, "in_progress", {
    sam:   makeScorecard(sam_front9),
    josh:  makeScorecard(josh_nofront, { front9Strokes: 34, front9ToPar: -2 }),
    jamie: makeScorecard(jamie_front9),
    keo:   makeScorecard(keo_front9),
  }),
  emptyRound(2),
  emptyRound(3),
  emptyRound(4),
]

describe("computePlayerStats — synthetic Day 1 front 9", () => {
  it("Sam: 1 eagle, 3 birdies, 4 pars, 1 bogey, 0 dbogey+", () => {
    const s = computePlayerStats("sam", FIXTURE)
    expect(s.eagles).toBe(1)
    expect(s.birdies).toBe(3)
    expect(s.pars).toBe(4)
    expect(s.bogeys).toBe(1)
    expect(s.doubleBogeyPlus).toBe(0)
  })

  it("Sam: scoringAverage = 32/9", () => {
    const s = computePlayerStats("sam", FIXTURE)
    expect(s.scoringAverage).toBeCloseTo(32 / 9, 5)
  })

  it("Sam: bestRound is null (no round complete)", () => {
    const s = computePlayerStats("sam", FIXTURE)
    expect(s.bestRound).toBe(null)
  })

  it("Sam: holesWon/Lost/Tied all 0 because Josh's data missing", () => {
    const s = computePlayerStats("sam", FIXTURE)
    expect(s.holesWon).toBe(0)
    expect(s.holesLost).toBe(0)
    expect(s.holesTied).toBe(0)
  })

  it("Josh: all counts zero, scoringAverage null (no non-null holes)", () => {
    const s = computePlayerStats("josh", FIXTURE)
    expect(s.eagles).toBe(0)
    expect(s.birdies).toBe(0)
    expect(s.pars).toBe(0)
    expect(s.bogeys).toBe(0)
    expect(s.doubleBogeyPlus).toBe(0)
    expect(s.holesWon).toBe(0)
    expect(s.holesLost).toBe(0)
    expect(s.holesTied).toBe(0)
    expect(s.bestRound).toBe(null)
    expect(s.scoringAverage).toBe(null)
  })

  it("Keo: 1 eagle, 4 birdies, 1 par, 2 bogeys, 1 dbogey+", () => {
    const s = computePlayerStats("keo", FIXTURE)
    expect(s.eagles).toBe(1)
    expect(s.birdies).toBe(4)
    expect(s.pars).toBe(1)
    expect(s.bogeys).toBe(2)
    expect(s.doubleBogeyPlus).toBe(1)
  })

  it("Jamie: 1 birdie, 8 pars, 0 bogeys", () => {
    const s = computePlayerStats("jamie", FIXTURE)
    expect(s.birdies).toBe(1)
    expect(s.pars).toBe(8)
    expect(s.bogeys).toBe(0)
  })
})

describe("computePlayerStats — bestRound when a round is complete", () => {
  it("returns lowest totalToPar across complete rounds", () => {
    const completeRound = makeRound(1, "complete", {
      sam:   makeScorecard([4,4,4,4,4,4,4,4,4,  4,4,4,4,4,4,4,4,4]),
      josh:  makeScorecard([3,3,3,3,3,3,3,3,3,  3,3,3,3,3,3,3,3,3]), // 54 strokes, -18
      jamie: makeScorecard([5,5,5,5,5,5,5,5,5,  5,5,5,5,5,5,5,5,5]),
      keo:   makeScorecard([4,4,4,4,4,4,4,4,4,  4,4,4,4,4,4,4,4,4]),
    })
    const s = computePlayerStats("josh", [completeRound, emptyRound(2), emptyRound(3), emptyRound(4)])
    expect(s.bestRound).toBe(-18)
  })
})
