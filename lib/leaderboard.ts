import type { Round, PlayerId, LeaderboardRow } from "@/data/types"
import { PLAYERS } from "@/data/players"

// Fallback chain for a single round's contribution to a player's score.
// See spec §"computeLeaderboard rules".
function roundContribution(round: Round, playerId: PlayerId): number | null {
  const sc = round.scorecards[playerId]

  if (round.status === "complete" && sc.totalToPar !== null) return sc.totalToPar
  if (sc.totalToPar !== null) return sc.totalToPar
  if (sc.front9ToPar !== null && sc.back9ToPar !== null) return sc.front9ToPar + sc.back9ToPar
  if (sc.front9ToPar !== null) return sc.front9ToPar
  if (sc.back9ToPar !== null) return sc.back9ToPar

  let strokes = 0
  let par = 0
  let count = 0
  for (const h of sc.holes) {
    if (h.strokes === null) continue
    strokes += h.strokes
    par += h.par
    count += 1
  }
  if (count === 0) return null
  return strokes - par
}

export function computeLeaderboard(rounds: Round[]): LeaderboardRow[] {
  const raw = PLAYERS.map(p => {
    const r1 = rounds.find(r => r.roundNumber === 1)
    const r2 = rounds.find(r => r.roundNumber === 2)
    const r3 = rounds.find(r => r.roundNumber === 3)
    const r4 = rounds.find(r => r.roundNumber === 4)

    const r1ToPar = r1 ? roundContribution(r1, p.id) : null
    const r2ToPar = r2 ? roundContribution(r2, p.id) : null
    const r3ToPar = r3 ? roundContribution(r3, p.id) : null
    const r4ToPar = r4 ? roundContribution(r4, p.id) : null

    const totalToPar =
      (r1ToPar ?? 0) + (r2ToPar ?? 0) + (r3ToPar ?? 0) + (r4ToPar ?? 0)

    return { playerId: p.id, r1ToPar, r2ToPar, r3ToPar, r4ToPar, totalToPar }
  })

  // Stable sort by totalToPar ascending. ES2019+ Array.prototype.sort is stable.
  const sorted = [...raw].sort((a, b) => a.totalToPar - b.totalToPar)

  const rows: LeaderboardRow[] = []
  let i = 0
  while (i < sorted.length) {
    let j = i + 1
    while (j < sorted.length && sorted[j].totalToPar === sorted[i].totalToPar) j++
    const groupSize = j - i
    const position = i + 1
    const positionDisplay = groupSize > 1 ? `T${position}` : `${position}`
    for (let k = i; k < j; k++) {
      rows.push({ ...sorted[k], position, positionDisplay })
    }
    i = j
  }

  return rows
}
