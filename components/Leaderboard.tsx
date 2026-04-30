import { ROUNDS } from "@/data/rounds"
import { PLAYERS } from "@/data/players"
import { computeLeaderboard } from "@/lib/leaderboard"
import { formatToPar } from "@/lib/scoreUtils"
import type { LeaderboardRow } from "@/data/types"

function scoreColor(toPar: number | null): string {
  if (toPar === null) return "var(--text-muted)"
  if (toPar < 0) return "var(--score-under)"
  if (toPar > 0) return "var(--score-over)"
  return "var(--text-primary)"
}

function PlayerCell({ row }: { row: LeaderboardRow }) {
  const player = PLAYERS.find(p => p.id === row.playerId)!
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true">{player.flag}</span>
      <span>{player.displayName}</span>
    </span>
  )
}

export function Leaderboard() {
  const rows = computeLeaderboard(ROUNDS)
  const leaderTotal = rows[0]?.totalToPar

  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4 sm:mx-6 sm:p-6"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="font-serif text-xl mb-3" style={{ color: "var(--accent)" }}>
        Leaderboard
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left tabular text-sm sm:text-base">
          <thead style={{ color: "var(--text-muted)" }}>
            <tr>
              <th className="py-2 pr-3 font-medium">POS</th>
              <th className="py-2 pr-3 font-medium">PLAYER</th>
              <th className="py-2 px-2 text-right font-medium">R1</th>
              <th className="py-2 px-2 text-right font-medium">R2</th>
              <th className="py-2 px-2 text-right font-medium">R3</th>
              <th className="py-2 px-2 text-right font-medium">R4</th>
              <th className="py-2 pl-3 text-right font-medium">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isLeader = row.totalToPar === leaderTotal
              return (
                <tr
                  key={row.playerId}
                  style={{
                    borderTop: "1px solid var(--border)",
                    backgroundColor: isLeader ? "var(--bg-elevated)" : "transparent",
                  }}
                >
                  <td className="py-3 pr-3 font-semibold" style={{ color: isLeader ? "var(--accent)" : "var(--text-primary)" }}>
                    {row.positionDisplay}
                  </td>
                  <td className="py-3 pr-3"><PlayerCell row={row} /></td>
                  <td className="py-3 px-2 text-right" style={{ color: scoreColor(row.r1ToPar) }}>
                    {formatToPar(row.r1ToPar)}
                  </td>
                  <td className="py-3 px-2 text-right" style={{ color: scoreColor(row.r2ToPar) }}>
                    {formatToPar(row.r2ToPar)}
                  </td>
                  <td className="py-3 px-2 text-right" style={{ color: scoreColor(row.r3ToPar) }}>
                    {formatToPar(row.r3ToPar)}
                  </td>
                  <td className="py-3 px-2 text-right" style={{ color: scoreColor(row.r4ToPar) }}>
                    {formatToPar(row.r4ToPar)}
                  </td>
                  <td className="py-3 pl-3 text-right font-semibold" style={{ color: scoreColor(row.totalToPar) }}>
                    {formatToPar(row.totalToPar)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
