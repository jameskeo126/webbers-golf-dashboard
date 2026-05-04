import { computeResult } from "@/lib/scoreUtils"
import { ResultIcon } from "./ResultIcon"

export function ScoreCell({ strokes, par }: { strokes: number | null; par: number }) {
  const result = computeResult(strokes, par)
  return (
    <td
      className="relative h-10 min-w-[24px] sm:w-16 text-center tabular text-sm font-medium"
      style={{
        color: strokes === null ? "var(--text-muted)" : "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
    >
      <ResultIcon result={result} />
      <span className="relative z-10">{strokes === null ? "—" : strokes}</span>
    </td>
  )
}
