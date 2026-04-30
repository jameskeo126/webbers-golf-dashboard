import { describe, it, expect } from "vitest"
import { computeHoleWinner } from "@/lib/holeWinners"
import { makeRound, makeScorecard, emptyRound } from "./fixtures"

// Synthetic fixture: Josh's hole 1 is null, others have strokes — verifies
// the "any null → null" rule. Other holes are populated for tie/unique-winner cases.
const FIXTURE = [
  makeRound(1, "in_progress", {
    sam:   makeScorecard([4, 4, 4, 4, 4, 4, 4, 4, 4,  3, 4, 3, 3, 3, 4, 2, 3, 4]),
    josh:  makeScorecard([null, 4, 4, 4, 4, 4, 4, 4, 4,  4, 3, 3, 4, 3, 4, 3, 3, 4]),
    jamie: makeScorecard([4, 4, 4, 4, 4, 4, 4, 4, 4,  4, 3, 4, 3, 3, 4, 3, 4, 5]),
    keo:   makeScorecard([4, 4, 4, 4, 4, 4, 4, 4, 4,  4, 3, 3, 5, 3, 4, 2, 4, 3]),
  }),
  emptyRound(2),
  emptyRound(3),
  emptyRound(4),
]

describe("computeHoleWinner", () => {
  it("returns null when any player has null strokes for that hole", () => {
    expect(computeHoleWinner(FIXTURE, "round_1", 1)).toBe(null)
  })

  it("returns the unique lowest scorer when one player has the minimum", () => {
    // Hole 10: sam 3, josh 4, jamie 4, keo 4 → sam wins
    expect(computeHoleWinner(FIXTURE, "round_1", 10)).toBe("sam")
  })

  it("returns 'tie' when multiple players share the lowest", () => {
    // Hole 11: sam 4, josh 3, jamie 3, keo 3 → tie (3-way at 3)
    expect(computeHoleWinner(FIXTURE, "round_1", 11)).toBe("tie")
  })

  it("returns null for an unknown roundId", () => {
    expect(computeHoleWinner(FIXTURE, "round_99", 1)).toBe(null)
  })

  it("identifies a unique winner when one player edges the others", () => {
    // Hole 13: sam 3, josh 4, jamie 3, keo 5 → tie between sam and jamie
    expect(computeHoleWinner(FIXTURE, "round_1", 13)).toBe("tie")
    // Hole 16: sam 2, josh 3, jamie 3, keo 2 → tie between sam and keo
    expect(computeHoleWinner(FIXTURE, "round_1", 16)).toBe("tie")
    // Hole 18: sam 4, josh 4, jamie 5, keo 3 → keo wins outright
    expect(computeHoleWinner(FIXTURE, "round_1", 18)).toBe("keo")
  })
})
