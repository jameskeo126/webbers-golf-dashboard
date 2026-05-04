"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Leaderboard } from "@/components/Leaderboard"
import { RoundTabs } from "@/components/RoundTabs"
import { Scorecard } from "@/components/Scorecard"
import { PlayerCards } from "@/components/PlayerCards"
import { ROUNDS } from "@/data/rounds"

// Default to the most recent round that has any score data, so the page opens
// on the live action rather than always Day 1.
function defaultSelectedRound(): 1 | 2 | 3 | 4 {
  for (let i = ROUNDS.length - 1; i >= 0; i--) {
    const r = ROUNDS[i]
    const hasData = (["sam", "josh", "jamie", "keo"] as const).some(pid => {
      const sc = r.scorecards[pid]
      return sc.front9Strokes !== null
        || sc.back9Strokes !== null
        || sc.totalStrokes !== null
        || sc.holes.some(h => h.strokes !== null)
    })
    if (hasData) return r.roundNumber
  }
  return 1
}

export default function HomePage() {
  const [selectedRound, setSelectedRound] = useState<1 | 2 | 3 | 4>(defaultSelectedRound)
  const round = ROUNDS.find(r => r.roundNumber === selectedRound)!

  return (
    <main className="min-h-screen pb-12">
      <Header />
      <Leaderboard />
      <Scorecard
        round={round}
        tabs={<RoundTabs selected={selectedRound} onSelect={setSelectedRound} />}
      />
      <PlayerCards round={round} />
    </main>
  )
}
