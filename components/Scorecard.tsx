import type { Round, PlayerId } from "@/data/types"
import { PLAYERS } from "@/data/players"
import { HOLE_PARS, FRONT_9_PAR, BACK_9_PAR } from "@/data/course"
import { computeHoleWinner } from "@/lib/holeWinners"
import { ROUNDS } from "@/data/rounds"
import { ScoreCell } from "./ScoreCell"

function sumStrokes(holes: { strokes: number | null }[], from: number, to: number): number | null {
  let sum = 0
  let any = false
  for (let i = from; i < to; i++) {
    const s = holes[i]?.strokes
    if (s === null || s === undefined) continue
    sum += s
    any = true
  }
  return any ? sum : null
}

export function Scorecard({ round }: { round: Round }) {
  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4 sm:mx-6 sm:p-6"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h3 className="font-serif text-lg mb-3" style={{ color: "var(--accent)" }}>
        {round.label} scorecard
      </h3>
      <div className="overflow-x-auto">
        <table className="border-collapse tabular text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 px-2 py-1 text-left font-medium" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                Hole
              </th>
              {Array.from({ length: 9 }, (_, i) => (
                <th key={i} className="h-10 w-10 text-center font-medium" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{i + 1}</th>
              ))}
              <th className="h-10 w-12 text-center font-semibold" style={{ color: "var(--accent)", border: "1px solid var(--border)" }}>OUT</th>
              {Array.from({ length: 9 }, (_, i) => (
                <th key={i + 9} className="h-10 w-10 text-center font-medium" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{i + 10}</th>
              ))}
              <th className="h-10 w-12 text-center font-semibold" style={{ color: "var(--accent)", border: "1px solid var(--border)" }}>IN</th>
              <th className="h-10 w-12 text-center font-semibold" style={{ color: "var(--accent)", border: "1px solid var(--border)" }}>TOT</th>
            </tr>
            <tr>
              <td className="sticky left-0 px-2 py-1 text-left" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                Par
              </td>
              {HOLE_PARS.slice(0, 9).map((p, i) => (
                <td key={i} className="h-10 w-10 text-center" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{p}</td>
              ))}
              <td className="h-10 w-12 text-center font-semibold" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{FRONT_9_PAR}</td>
              {HOLE_PARS.slice(9).map((p, i) => (
                <td key={i + 9} className="h-10 w-10 text-center" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{p}</td>
              ))}
              <td className="h-10 w-12 text-center font-semibold" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{BACK_9_PAR}</td>
              <td className="h-10 w-12 text-center font-semibold" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>{FRONT_9_PAR + BACK_9_PAR}</td>
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map(player => {
              const sc = round.scorecards[player.id]
              const out = sumStrokes(sc.holes, 0, 9)
              const inn = sumStrokes(sc.holes, 9, 18)
              const tot = (out !== null && inn !== null) ? out + inn : null
              return (
                <tr key={player.id}>
                  <td className="sticky left-0 px-2 py-1 text-left whitespace-nowrap" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                    <span className="mr-1" aria-hidden="true">{player.flag}</span>
                    <span>{player.displayName.split(" ")[0]}</span>
                  </td>
                  {sc.holes.slice(0, 9).map(hole => {
                    const winner = computeHoleWinner(ROUNDS, round.id, hole.holeNumber)
                    const isWinner = winner === player.id
                    const isTie = winner === "tie" && hole.strokes !== null
                    let tieHighlight = false
                    if (isTie) {
                      let min = Infinity
                      for (const pid of ["sam","josh","jamie","keo"] as PlayerId[]) {
                        const h = round.scorecards[pid].holes.find(x => x.holeNumber === hole.holeNumber)
                        if (h && h.strokes !== null && h.strokes < min) min = h.strokes
                      }
                      tieHighlight = hole.strokes === min
                    }
                    return (
                      <ScoreCell
                        key={hole.holeNumber}
                        strokes={hole.strokes}
                        par={hole.par}
                        isHoleWinner={isWinner || tieHighlight}
                        isTie={tieHighlight}
                      />
                    )
                  })}
                  <td className="h-10 w-12 text-center font-semibold tabular" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                    {out === null ? "—" : out}
                  </td>
                  {sc.holes.slice(9).map(hole => {
                    const winner = computeHoleWinner(ROUNDS, round.id, hole.holeNumber)
                    const isWinner = winner === player.id
                    const isTie = winner === "tie" && hole.strokes !== null
                    let tieHighlight = false
                    if (isTie) {
                      let min = Infinity
                      for (const pid of ["sam","josh","jamie","keo"] as PlayerId[]) {
                        const h = round.scorecards[pid].holes.find(x => x.holeNumber === hole.holeNumber)
                        if (h && h.strokes !== null && h.strokes < min) min = h.strokes
                      }
                      tieHighlight = hole.strokes === min
                    }
                    return (
                      <ScoreCell
                        key={hole.holeNumber}
                        strokes={hole.strokes}
                        par={hole.par}
                        isHoleWinner={isWinner || tieHighlight}
                        isTie={tieHighlight}
                      />
                    )
                  })}
                  <td className="h-10 w-12 text-center font-semibold tabular" style={{ border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                    {inn === null ? "—" : inn}
                  </td>
                  <td className="h-10 w-12 text-center font-semibold tabular" style={{ border: "1px solid var(--border)", color: "var(--accent)" }}>
                    {tot === null ? "—" : tot}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
        Scroll horizontally to see all 18 holes.
      </p>
      {round.commentary.summary ? (
        <div
          className="mt-5 pt-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <h4 className="font-serif text-base mb-2" style={{ color: "var(--accent)" }}>
            {round.label} — the take
          </h4>
          <p className="italic leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {round.commentary.summary}
          </p>
        </div>
      ) : null}
    </section>
  )
}
