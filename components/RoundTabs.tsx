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
      className="mx-4 my-4 flex gap-2 overflow-x-auto sm:mx-6"
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
              backgroundColor: isSelected ? "var(--accent)" : "var(--bg-surface)",
              color: isSelected ? "#1a2a1a" : "var(--text-primary)",
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
