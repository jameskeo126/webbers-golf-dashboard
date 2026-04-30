import type { Round, PlayerId, PlayerStats } from "@/data/types"
import { computeResult } from "@/lib/scoreUtils"
import { computeHoleWinner } from "@/lib/holeWinners"

export function computePlayerStats(playerId: PlayerId, rounds: Round[]): PlayerStats {
  let eagles = 0, birdies = 0, pars = 0, bogeys = 0, doubleBogeyPlus = 0
  let holesWon = 0, holesLost = 0, holesTied = 0
  let strokesSum = 0, holesPlayed = 0
  let bestRound: number | null = null

  for (const round of rounds) {
    const sc = round.scorecards[playerId]

    for (const hole of sc.holes) {
      if (hole.strokes === null) continue
      const result = computeResult(hole.strokes, hole.par)
      switch (result) {
        case "eagle_or_better": eagles++; break
        case "birdie":          birdies++; break
        case "par":             pars++; break
        case "bogey":           bogeys++; break
        case "double_bogey_plus": doubleBogeyPlus++; break
      }
      strokesSum += hole.strokes
      holesPlayed++

      const winner = computeHoleWinner(rounds, round.id, hole.holeNumber)
      if (winner === null) continue
      if (winner === playerId) holesWon++
      else if (winner === "tie") {
        let min = Infinity
        for (const pid of ["sam","josh","jamie","keo"] as PlayerId[]) {
          const h = round.scorecards[pid].holes.find(x => x.holeNumber === hole.holeNumber)
          if (h && h.strokes !== null && h.strokes < min) min = h.strokes
        }
        if (hole.strokes === min) holesTied++
        else holesLost++
      } else {
        holesLost++
      }
    }

    if (round.status === "complete" && sc.totalToPar !== null) {
      if (bestRound === null || sc.totalToPar < bestRound) bestRound = sc.totalToPar
    }
  }

  const scoringAverage = holesPlayed === 0 ? null : strokesSum / holesPlayed

  return { eagles, birdies, pars, bogeys, doubleBogeyPlus, holesWon, holesLost, holesTied, bestRound, scoringAverage }
}
