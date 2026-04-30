import type { Round } from "@/data/types"
import { PLAYERS } from "@/data/players"

export function PlayerCommentaryCards({ round }: { round: Round }) {
  const cards = PLAYERS
    .map(p => ({ player: p, text: round.commentary.players[p.id] }))
    .filter((c): c is { player: typeof PLAYERS[number]; text: string } => Boolean(c.text))

  if (cards.length === 0) return null

  return (
    <section className="mx-4 my-4 grid gap-3 sm:mx-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ player, text }) => (
        <article
          key={player.id}
          className="rounded-2xl p-4 sm:p-5"
          style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <header className="mb-2 flex items-center gap-2">
            <span aria-hidden="true">{player.flag}</span>
            <h4 className="font-serif text-base font-semibold" style={{ color: "var(--accent)" }}>
              {player.displayName}
            </h4>
          </header>
          <div className="italic leading-relaxed space-y-3" style={{ color: "var(--text-muted)" }}>
            {text.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
