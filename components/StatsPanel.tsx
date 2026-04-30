"use client"

import { useState } from "react"
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

export function StatsPanel() {
  const [open, setOpen] = useState(false)
  return (
    <section className="mx-4 my-4 sm:mx-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full rounded-2xl px-4 py-3 text-left font-medium transition hover:opacity-90"
        style={{
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          minHeight: "44px",
        }}
        aria-expanded={open}
      >
        {open ? "Hide stats" : "Show stats"}
      </button>
      {open && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLAYERS.map(player => {
            const s = computePlayerStats(player.id, ROUNDS)
            return (
              <article
                key={player.id}
                className="rounded-2xl p-4"
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
              >
                <header className="mb-3 flex items-center gap-2">
                  <span aria-hidden="true">{player.flag}</span>
                  <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {player.displayName}
                  </h4>
                </header>
                <div className="space-y-1.5">
                  <StatRow label="Eagles" value={s.eagles} />
                  <StatRow label="Birdies" value={s.birdies} />
                  <StatRow label="Pars" value={s.pars} />
                  <StatRow label="Bogeys" value={s.bogeys} />
                  <StatRow label="Double bogey+" value={s.doubleBogeyPlus} />
                  <StatRow label="Holes won" value={s.holesWon} />
                  <StatRow label="Holes lost" value={s.holesLost} />
                  <StatRow label="Holes tied" value={s.holesTied} />
                  <StatRow label="Best round" value={s.bestRound === null ? "—" : formatToPar(s.bestRound)} />
                  <StatRow label="Scoring avg" value={s.scoringAverage === null ? "—" : s.scoringAverage.toFixed(2)} />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
