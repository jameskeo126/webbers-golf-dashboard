import { describe, it, expect } from "vitest"
import { computeLeaderboard } from "@/lib/leaderboard"
import { makeRound, makeScorecard, emptyRound } from "./fixtures"

// Synthetic Day 1 front 9 fixture — same shape as the original launch state.
// Sam -4, Josh -2 (no per-hole), Keo -2, Jamie -1.
const sam_front9   = [4,3,3,2,3,3,4,5,5,  null,null,null,null,null,null,null,null,null]
const josh_nofront = [null,null,null,null,null,null,null,null,null,  null,null,null,null,null,null,null,null,null]
const jamie_front9 = [4,4,4,3,4,3,4,5,4,  null,null,null,null,null,null,null,null,null]
const keo_front9   = [6,3,3,4,3,3,5,4,3,  null,null,null,null,null,null,null,null,null]

const FRONT9_FIXTURE = [
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

describe("computeLeaderboard — synthetic Day 1 front 9 only", () => {
  const rows = computeLeaderboard(FRONT9_FIXTURE)

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

  it("Josh's R1 uses stored front9ToPar fallback when per-hole strokes are null", () => {
    const josh = rows.find(r => r.playerId === "josh")!
    expect(josh.r1ToPar).toBe(-2)
    expect(josh.totalToPar).toBe(-2)
  })
})

describe("computeLeaderboard — round status complete uses totalToPar directly", () => {
  it("ranks players by completed round totalToPar", () => {
    const r1 = makeRound(1, "complete", {
      // Sam: 18 fours = 72 strokes, par (totalToPar 0)
      sam:   makeScorecard([4,4,4,4,4,4,4,4,4,  4,4,4,4,4,4,4,4,4]),
      // Josh: 18 threes = 54 strokes, totalToPar -18
      josh:  makeScorecard([3,3,3,3,3,3,3,3,3,  3,3,3,3,3,3,3,3,3]),
      // Jamie: 18 fives = 90 strokes, totalToPar +18
      jamie: makeScorecard([5,5,5,5,5,5,5,5,5,  5,5,5,5,5,5,5,5,5]),
      // Keo: same as Sam, even par
      keo:   makeScorecard([4,4,4,4,4,4,4,4,4,  4,4,4,4,4,4,4,4,4]),
    })
    const rows = computeLeaderboard([r1, emptyRound(2), emptyRound(3), emptyRound(4)])

    // Order: Josh -18, Sam 0 (T2), Keo 0 (T2), Jamie +18
    expect(rows.map(r => r.playerId)).toEqual(["josh", "sam", "keo", "jamie"])
    expect(rows[0].positionDisplay).toBe("1")
    expect(rows[1].positionDisplay).toBe("T2")
    expect(rows[2].positionDisplay).toBe("T2")
    expect(rows[3].positionDisplay).toBe("4")
  })
})
