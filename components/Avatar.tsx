import Image from "next/image"
import type { Player } from "@/data/types"

// Circular player avatar. Renders the photo at `player.avatar` if provided,
// otherwise an initials fallback so the layout is stable until images arrive.
export function Avatar({ player, size = 32 }: { player: Player; size?: number }) {
  if (player.avatar) {
    return (
      <Image
        src={player.avatar}
        alt={player.displayName}
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-full flex-shrink-0 font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        backgroundColor: "var(--bg-elevated)",
        color: "var(--text-muted)",
      }}
    >
      {player.displayName.charAt(0).toUpperCase()}
    </span>
  )
}
