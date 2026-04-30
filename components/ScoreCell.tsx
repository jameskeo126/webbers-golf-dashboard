import type { ResultClass } from "@/data/types"
import { computeResult } from "@/lib/scoreUtils"

function bgColor(result: ResultClass | null): string {
  switch (result) {
    case "eagle_or_better":   return "var(--score-eagle)"
    case "birdie":            return "var(--score-under)"
    case "bogey":             return "var(--score-bogey)"
    case "double_bogey_plus": return "var(--score-double)"
    default:                  return "transparent"
  }
}

function textColor(result: ResultClass | null): string {
  if (result === "eagle_or_better" || result === "birdie") return "#ffffff"
  return "var(--text-primary)"
}

function Icon({ result }: { result: ResultClass | null }) {
  if (result === "eagle_or_better") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-6 h-6 rounded-full border" style={{ borderColor: "currentColor" }} />
        <span className="absolute block w-7 h-7 rounded-full border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  if (result === "birdie") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-6 h-6 rounded-full border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  if (result === "bogey") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-6 h-6 border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  if (result === "double_bogey_plus") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-6 h-6 border" style={{ borderColor: "currentColor" }} />
        <span className="absolute block w-7 h-7 border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  return null
}

export function ScoreCell({
  strokes,
  par,
  isHoleWinner = false,
  isTie = false,
}: {
  strokes: number | null
  par: number
  isHoleWinner?: boolean
  isTie?: boolean
}) {
  const result = computeResult(strokes, par)
  const bg = bgColor(result)
  const fg = textColor(result)

  return (
    <td
      className="relative h-10 w-10 text-center tabular text-sm"
      style={{
        backgroundColor: isHoleWinner ? "var(--hole-winner)" : bg,
        color: fg,
        border: "1px solid var(--border)",
      }}
    >
      <Icon result={result} />
      <span className="relative z-10 font-medium">
        {strokes === null ? "—" : strokes}
        {isTie ? <sup className="ml-0.5">T</sup> : null}
      </span>
    </td>
  )
}
