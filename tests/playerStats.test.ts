import { describe, it, expect } from "vitest"
import { computePlayerStats } from "@/lib/playerStats"
import { ROUNDS } from "@/data/rounds"

describe("computePlayerStats with seed Day 1 front 9", () => {
  it("Sam: 1 eagle, 3 birdies, 4 pars, 1 bogey, 0 dbogey+", () => {
    const s = computePlayerStats("sam", ROUNDS)
    expect(s.eagles).toBe(1)
    expect(s.birdies).toBe(3)
    expect(s.pars).toBe(4)
    expect(s.bogeys).toBe(1)
    expect(s.doubleBogeyPlus).toBe(0)
  })

  it("Sam: scoringAverage = 32/9", () => {
    const s = computePlayerStats("sam", ROUNDS)
    expect(s.scoringAverage).toBeCloseTo(32 / 9, 5)
  })

  it("Sam: bestRound is null (no round complete)", () => {
    const s = computePlayerStats("sam", ROUNDS)
    expect(s.bestRound).toBe(null)
  })

  it("Sam: holesWon/Lost/Tied all 0 because Josh's data missing", () => {
    const s = computePlayerStats("sam", ROUNDS)
    expect(s.holesWon).toBe(0)
    expect(s.holesLost).toBe(0)
    expect(s.holesTied).toBe(0)
  })

  it("Josh: all counts zero, scoringAverage null (no non-null holes)", () => {
    const s = computePlayerStats("josh", ROUNDS)
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
    const s = computePlayerStats("keo", ROUNDS)
    expect(s.eagles).toBe(1)
    expect(s.birdies).toBe(4)
    expect(s.pars).toBe(1)
    expect(s.bogeys).toBe(2)
    expect(s.doubleBogeyPlus).toBe(1)
  })

  it("Jamie: 1 birdie, 8 pars, 0 bogeys", () => {
    const s = computePlayerStats("jamie", ROUNDS)
    expect(s.birdies).toBe(1)
    expect(s.pars).toBe(8)
    expect(s.bogeys).toBe(0)
  })
})
