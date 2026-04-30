import type { Round } from "@/data/types"

export function RoundSummaryCard({ round }: { round: Round }) {
  if (!round.commentary.summary) return null
  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4 sm:mx-6 sm:p-6"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h4 className="font-serif text-lg mb-2" style={{ color: "var(--accent)" }}>
        {round.label} — the take
      </h4>
      <p className="italic leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {round.commentary.summary}
      </p>
    </section>
  )
}
