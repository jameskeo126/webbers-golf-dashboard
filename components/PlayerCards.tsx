"use client"

import { useState } from "react"
import type { Round, Player, PlayerStats } from "@/data/types"
import { PLAYERS } from "@/data/players"
import { ROUNDS } from "@/data/rounds"
import { computePlayerStats } from "@/lib/playerStats"
import { formatToPar } from "@/lib/scoreUtils"

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-sm">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="tabular font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  )
}

function PlayerCard({
  player,
  stats,
  commentary,
}: {
  player: Player
  stats: PlayerStats
  commentary: string | undefined
}) {
  const [open, setOpen] = useState(false)
  const paragraphs = commentary ? commentary.split("\n\n") : []

  return (
    <article
      className="snap-start shrink-0 w-[calc(100vw-2rem)] sm:w-auto sm:shrink rounded-2xl p-4 sm:p-5 flex flex-col"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <header className="mb-3 flex items-center gap-2">
        <span aria-hidden="true">{player.flag}</span>
        <h4 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          {player.displayName}
        </h4>
      </header>
      {paragraphs.length > 0 ? (
        <div className="mb-4">
          {open ? (
            <div className="leading-relaxed space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : (
            <p
              className="leading-relaxed text-sm line-clamp-3"
              style={{ color: "var(--text-muted)" }}
            >
              {paragraphs[0]}
            </p>
          )}
          <button
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="mt-2 text-sm font-medium transition hover:opacity-80"
            style={{ color: "var(--text-primary)" }}
          >
            {open ? "Hide Commentary ▴" : "Read Commentary ▾"}
          </button>
        </div>
      ) : null}
      <div className="space-y-1.5 pt-3" style={{ borderTop: paragraphs.length > 0 ? "1px solid var(--border)" : "none" }}>
        <StatRow label="Eagles" value={stats.eagles} />
        <StatRow label="Birdies" value={stats.birdies} />
        <StatRow label="Pars" value={stats.pars} />
        <StatRow label="Bogeys" value={stats.bogeys} />
        <StatRow label="Double Bogey+" value={stats.doubleBogeyPlus} />
        <StatRow label="Holes Won" value={stats.holesWon} />
        <StatRow label="Holes Lost" value={stats.holesLost} />
        <StatRow label="Holes Tied" value={stats.holesTied} />
        <StatRow label="Best Round" value={stats.bestRound === null ? "—" : formatToPar(stats.bestRound)} />
        <StatRow label="Scoring Avg" value={stats.scoringAverage === null ? "—" : stats.scoringAverage.toFixed(2)} />
      </div>
    </article>
  )
}

export function PlayerCards({ round }: { round: Round }) {
  return (
    <section
      aria-label="Player commentary and stats"
      className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 pb-4 my-4 sm:scroll-px-6 sm:px-6 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4"
      style={{ scrollSnapType: "x mandatory", scrollPaddingInline: "1rem" }}
    >
      {PLAYERS.map(player => (
        <PlayerCard
          key={player.id}
          player={player}
          stats={computePlayerStats(player.id, ROUNDS)}
          commentary={round.commentary.players[player.id]}
        />
      ))}
    </section>
  )
}
