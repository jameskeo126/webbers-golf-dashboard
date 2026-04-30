"use client"

import { useState } from "react"

// Multi-paragraph prose that collapses to ~5 lines on mobile.
// On desktop (sm: and up) it always renders fully and the toggle button hides.
export function ExpandableProse({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false)
  if (paragraphs.length === 0) return null

  return (
    <>
      {!open ? (
        <p
          className="leading-relaxed line-clamp-5 sm:hidden"
          style={{ color: "var(--text-muted)" }}
        >
          {paragraphs.join(" ")}
        </p>
      ) : null}
      <div
        className={`leading-relaxed space-y-3 ${open ? "" : "hidden sm:block"}`}
        style={{ color: "var(--text-muted)" }}
      >
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="sm:hidden mt-2 text-sm font-medium transition hover:opacity-80"
        style={{ color: "var(--text-primary)" }}
      >
        {open ? "Show Less ▴" : "Read More ▾"}
      </button>
    </>
  )
}
