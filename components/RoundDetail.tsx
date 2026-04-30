import type { Round } from "@/data/types"
import { Scorecard } from "./Scorecard"
import { PlayerCommentaryCards } from "./PlayerCommentaryCards"

export function RoundDetail({ round }: { round: Round }) {
  return (
    <div>
      <Scorecard round={round} />
      <PlayerCommentaryCards round={round} />
    </div>
  )
}
