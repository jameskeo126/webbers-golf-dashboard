"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Leaderboard } from "@/components/Leaderboard"
import { SeasonCommentary } from "@/components/SeasonCommentary"
import { RoundTabs } from "@/components/RoundTabs"
import { Scorecard } from "@/components/Scorecard"
import { PlayerCards } from "@/components/PlayerCards"
import { ROUNDS } from "@/data/rounds"

export default function HomePage() {
  const [selectedRound, setSelectedRound] = useState<1 | 2 | 3 | 4>(1)
  const round = ROUNDS.find(r => r.roundNumber === selectedRound)!

  return (
    <main className="min-h-screen pb-12">
      <Header />
      <Leaderboard />
      <SeasonCommentary />
      <Scorecard
        round={round}
        tabs={<RoundTabs selected={selectedRound} onSelect={setSelectedRound} />}
      />
      <PlayerCards round={round} />
    </main>
  )
}
