export function ScoreCell({ strokes }: { strokes: number | null }) {
  return (
    <td
      className="h-10 w-10 text-center tabular text-sm font-medium"
      style={{
        color: strokes === null ? "var(--text-muted)" : "var(--text-primary)",
        border: "1px solid var(--border)",
      }}
    >
      {strokes === null ? "—" : strokes}
    </td>
  )
}
