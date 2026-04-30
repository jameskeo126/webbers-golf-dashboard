import { Header } from "@/components/Header"
import { Leaderboard } from "@/components/Leaderboard"
import { Scorecard } from "@/components/Scorecard"
import { ROUNDS } from "@/data/rounds"

export default function HomePage() {
  const round1 = ROUNDS.find(r => r.roundNumber === 1)!
  return (
    <main>
      <Header />
      <Leaderboard />
      <Scorecard round={round1} />
    </main>
  )
}
