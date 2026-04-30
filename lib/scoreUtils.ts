import type { ResultClass } from "@/data/types"

export function computeResult(strokes: number | null, par: number): ResultClass | null {
  if (strokes === null) return null
  const diff = strokes - par
  if (diff <= -2) return "eagle_or_better"
  if (diff === -1) return "birdie"
  if (diff === 0) return "par"
  if (diff === 1) return "bogey"
  return "double_bogey_plus"
}

export function formatToPar(n: number | null): string {
  if (n === null) return "—"
  if (n === 0) return "E"
  if (n > 0) return `+${n}`
  return String(n)
}
