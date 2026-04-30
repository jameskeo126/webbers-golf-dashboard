"use client"

import { ROUNDS } from "@/data/rounds"

export function RoundTabs({
  selected,
  onSelect,
}: {
  selected: 1 | 2 | 3 | 4
  onSelect: (n: 1 | 2 | 3 | 4) => void
}) {
  return (
    <nav
      role="tablist"
      aria-label="Round selector"
      className="mb-4 flex gap-2 overflow-x-auto"
    >
      {ROUNDS.map(round => {
        const isSelected = round.roundNumber === selected
        return (
          <button
            key={round.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(round.roundNumber)}
            className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: isSelected ? "var(--text-primary)" : "var(--bg-surface)",
              color: isSelected ? "var(--bg-surface)" : "var(--text-primary)",
              border: "1px solid var(--border)",
              minHeight: "44px",
              minWidth: "44px",
            }}
          >
            {round.label}
          </button>
        )
      })}
    </nav>
  )
}
