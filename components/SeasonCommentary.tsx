import { SEASON_COMMENTARY } from "@/data/rounds"

export function SeasonCommentary() {
  if (!SEASON_COMMENTARY) return null
  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4 sm:mx-6 sm:p-6"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        Season so far
      </h2>
      <div className="leading-relaxed space-y-3" style={{ color: "var(--text-muted)" }}>
        {SEASON_COMMENTARY.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </section>
  )
}
