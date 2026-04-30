import { describe, it, expect } from "vitest"
import { computeHoleWinner } from "@/lib/holeWinners"
import { ROUNDS } from "@/data/rounds"

describe("computeHoleWinner", () => {
  it("returns null when any player has null strokes for that hole (Day 1 hole 1 — Josh missing)", () => {
    expect(computeHoleWinner(ROUNDS, "round_1", 1)).toBe(null)
  })
  it("returns null for any Day 1 front 9 hole because Josh's data is missing", () => {
    for (let h = 1; h <= 9; h++) {
      expect(computeHoleWinner(ROUNDS, "round_1", h)).toBe(null)
    }
  })
  it("returns the lowest scorer when all 4 have data and one is uniquely lowest", () => {
    const fake = JSON.parse(JSON.stringify(ROUNDS)) as typeof ROUNDS
    for (const pid of ["sam","josh","jamie","keo"] as const) {
      const strokes = pid === "sam" ? 3 : 4
      fake[0].scorecards[pid].holes[9].strokes = strokes
    }
    expect(computeHoleWinner(fake, "round_1", 10)).toBe("sam")
  })
  it("returns 'tie' when two or more players share the lowest", () => {
    const fake = JSON.parse(JSON.stringify(ROUNDS)) as typeof ROUNDS
    fake[0].scorecards.sam.holes[10].strokes = 3
    fake[0].scorecards.josh.holes[10].strokes = 3
    fake[0].scorecards.jamie.holes[10].strokes = 4
    fake[0].scorecards.keo.holes[10].strokes = 4
    expect(computeHoleWinner(fake, "round_1", 11)).toBe("tie")
  })
  it("returns null for an unknown roundId", () => {
    expect(computeHoleWinner(ROUNDS, "round_99", 1)).toBe(null)
  })
})
