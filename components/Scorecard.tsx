import type { Round } from "@/data/types"
import type { ReactNode } from "react"
import { PLAYERS } from "@/data/players"
import { HOLE_PARS, FRONT_9_PAR, BACK_9_PAR } from "@/data/course"
import { ScoreCell } from "./ScoreCell"
import { ExpandableProse } from "./ExpandableProse"

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

export function Scorecard({ round, tabs }: { round: Round; tabs?: ReactNode }) {
  const totalCellStyle = { border: "1px solid var(--border)", color: "var(--text-primary)" }
  const headerCellStyle = { color: "var(--text-muted)", border: "1px solid var(--border)" }

  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4 sm:mx-6 sm:p-6"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      {tabs}
      <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        Scorecard
      </h3>
      <div className="overflow-x-auto">
        <table className="border-collapse tabular text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 px-2 py-1 text-left font-medium" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                Hole
              </th>
              {Array.from({ length: 9 }, (_, i) => (
                <th key={i} className="h-10 min-w-[10px] sm:w-16 text-center font-medium" style={headerCellStyle}>{i + 1}</th>
              ))}
              <th className="h-10 min-w-[10px] sm:w-20 text-center font-semibold" style={headerCellStyle}>OUT</th>
              {Array.from({ length: 9 }, (_, i) => (
                <th key={i + 9} className="h-10 min-w-[10px] sm:w-16 text-center font-medium" style={headerCellStyle}>{i + 10}</th>
              ))}
              <th className="h-10 min-w-[10px] sm:w-20 text-center font-semibold" style={headerCellStyle}>IN</th>
              <th className="h-10 min-w-[10px] sm:w-20 text-center font-semibold" style={headerCellStyle}>TOT</th>
            </tr>
            <tr>
              <td className="sticky left-0 px-2 py-1 text-left" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                Par
              </td>
              {HOLE_PARS.slice(0, 9).map((p, i) => (
                <td key={i} className="h-10 min-w-[10px] sm:w-16 text-center" style={headerCellStyle}>{p}</td>
              ))}
              <td className="h-10 min-w-[10px] sm:w-20 text-center font-semibold" style={headerCellStyle}>{FRONT_9_PAR}</td>
              {HOLE_PARS.slice(9).map((p, i) => (
                <td key={i + 9} className="h-10 min-w-[10px] sm:w-16 text-center" style={headerCellStyle}>{p}</td>
              ))}
              <td className="h-10 min-w-[10px] sm:w-20 text-center font-semibold" style={headerCellStyle}>{BACK_9_PAR}</td>
              <td className="h-10 min-w-[10px] sm:w-20 text-center font-semibold" style={headerCellStyle}>{FRONT_9_PAR + BACK_9_PAR}</td>
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
                  <td className="sticky left-0 pl-1 pr-3 py-1 text-left whitespace-nowrap text-sm font-semibold" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                    <span className="mr-1.5" aria-hidden="true">{player.flag}</span>
                    <span>{player.displayName.split(" ")[0]}</span>
                  </td>
                  {sc.holes.slice(0, 9).map(hole => (
                    <ScoreCell key={hole.holeNumber} strokes={hole.strokes} />
                  ))}
                  <td className="h-10 min-w-[10px] sm:w-20 text-center font-semibold tabular" style={totalCellStyle}>
                    {out === null ? "—" : out}
                  </td>
                  {sc.holes.slice(9).map(hole => (
                    <ScoreCell key={hole.holeNumber} strokes={hole.strokes} />
                  ))}
                  <td className="h-10 min-w-[10px] sm:w-20 text-center font-semibold tabular" style={totalCellStyle}>
                    {inn === null ? "—" : inn}
                  </td>
                  <td className="h-10 min-w-[10px] sm:w-20 text-center font-semibold tabular" style={totalCellStyle}>
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
          <h4 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            The Take
          </h4>
          <ExpandableProse paragraphs={round.commentary.summary.split("\n\n")} />
        </div>
      ) : null}
    </section>
  )
}
