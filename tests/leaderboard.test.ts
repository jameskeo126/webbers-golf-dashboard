import { describe, it, expect } from "vitest"
import { computeLeaderboard } from "@/lib/leaderboard"
import { ROUNDS } from "@/data/rounds"

describe("computeLeaderboard with seed Day 1 front 9 only", () => {
  const rows = computeLeaderboard(ROUNDS)

  it("returns 4 rows", () => {
    expect(rows).toHaveLength(4)
  })

  it("orders Sam first at -4", () => {
    expect(rows[0].playerId).toBe("sam")
    expect(rows[0].r1ToPar).toBe(-4)
    expect(rows[0].totalToPar).toBe(-4)
    expect(rows[0].positionDisplay).toBe("1")
  })

  it("places Josh and Keo tied at T2 with Josh first per PLAYERS array order", () => {
    expect(rows[1].playerId).toBe("josh")
    expect(rows[1].r1ToPar).toBe(-2)
    expect(rows[1].positionDisplay).toBe("T2")

    expect(rows[2].playerId).toBe("keo")
    expect(rows[2].r1ToPar).toBe(-2)
    expect(rows[2].positionDisplay).toBe("T2")
  })

  it("places Jamie 4th at -1 (positions skip past tied slot)", () => {
    expect(rows[3].playerId).toBe("jamie")
    expect(rows[3].r1ToPar).toBe(-1)
    expect(rows[3].positionDisplay).toBe("4")
  })

  it("R2/R3/R4 are null for all players", () => {
    for (const row of rows) {
      expect(row.r2ToPar).toBe(null)
      expect(row.r3ToPar).toBe(null)
      expect(row.r4ToPar).toBe(null)
    }
  })

  it("Josh's R1 uses stored front9ToPar fallback (per-hole strokes are null)", () => {
    const josh = rows.find(r => r.playerId === "josh")!
    expect(josh.r1ToPar).toBe(-2)
    expect(josh.totalToPar).toBe(-2)
  })
})
