import { ROUNDS, SEASON_COMMENTARY } from "@/data/rounds"
import { PLAYERS } from "@/data/players"
import { computeLeaderboard } from "@/lib/leaderboard"
import { formatToPar } from "@/lib/scoreUtils"
import type { LeaderboardRow } from "@/data/types"

function scoreTextColor(toPar: number | null): string {
  return toPar === null ? "var(--text-muted)" : "var(--text-primary)"
}

function PlayerCell({ row }: { row: LeaderboardRow }) {
  const player = PLAYERS.find(p => p.id === row.playerId)!
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true">{player.flag}</span>
      <span className="hidden sm:inline">{player.displayName}</span>
      <span className="sm:hidden">{player.displayName.split(" ")[0]}</span>
    </span>
  )
}

export function Leaderboard() {
  const rows = computeLeaderboard(ROUNDS)

  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4 sm:mx-6 sm:p-6"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        Leaderboard
      </h2>
      <table className="w-full text-left tabular text-sm sm:text-base">
        <thead style={{ color: "var(--text-muted)" }}>
          <tr>
            <th className="py-2 pr-2 font-medium">POS</th>
            <th className="py-2 pr-2 font-medium">PLAYER</th>
            <th className="py-2 px-1 text-right font-medium">R1</th>
            <th className="py-2 px-1 text-right font-medium">R2</th>
            <th className="py-2 px-1 text-right font-medium">R3</th>
            <th className="py-2 px-1 text-right font-medium">R4</th>
            <th className="py-2 pl-2 text-right font-medium">TOTAL</th>
          </tr>
        </thead>
        <tbody style={{ color: "var(--text-primary)" }}>
          {rows.map(row => (
            <tr
              key={row.playerId}
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <td className="py-3 pr-2 font-semibold">
                {row.positionDisplay}
              </td>
              <td className="py-3 pr-2"><PlayerCell row={row} /></td>
              <td className="py-3 px-1 text-right" style={{ color: scoreTextColor(row.r1ToPar) }}>
                {formatToPar(row.r1ToPar)}
              </td>
              <td className="py-3 px-1 text-right" style={{ color: scoreTextColor(row.r2ToPar) }}>
                {formatToPar(row.r2ToPar)}
              </td>
              <td className="py-3 px-1 text-right" style={{ color: scoreTextColor(row.r3ToPar) }}>
                {formatToPar(row.r3ToPar)}
              </td>
              <td className="py-3 px-1 text-right" style={{ color: scoreTextColor(row.r4ToPar) }}>
                {formatToPar(row.r4ToPar)}
              </td>
              <td className="py-3 pl-2 text-right font-semibold">
                {formatToPar(row.totalToPar)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {SEASON_COMMENTARY ? (
        <div
          className="mt-5 pt-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            The Story So Far
          </h3>
          <div className="leading-relaxed space-y-3" style={{ color: "var(--text-muted)" }}>
            {SEASON_COMMENTARY.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
