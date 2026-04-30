import type { Round, PlayerId, HoleWinner } from "@/data/types"

const PLAYER_IDS: PlayerId[] = ["sam", "josh", "jamie", "keo"]

export function computeHoleWinner(rounds: Round[], roundId: string, holeNumber: number): HoleWinner {
  const round = rounds.find(r => r.id === roundId)
  if (!round) return null

  const strokesByPlayer: { id: PlayerId; strokes: number }[] = []
  for (const pid of PLAYER_IDS) {
    const hole = round.scorecards[pid].holes.find(h => h.holeNumber === holeNumber)
    if (!hole || hole.strokes === null) return null
    strokesByPlayer.push({ id: pid, strokes: hole.strokes })
  }

  const min = Math.min(...strokesByPlayer.map(p => p.strokes))
  const winners = strokesByPlayer.filter(p => p.strokes === min)
  if (winners.length === 1) return winners[0].id
  return "tie"
}
