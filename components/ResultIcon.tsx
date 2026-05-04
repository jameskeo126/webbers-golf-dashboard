import type { ResultClass } from "@/data/types"

// Renders the shape outline that sits behind a score number.
// Birdie: 1 circle. Eagle or better: 2 concentric circles.
// Bogey: 1 square. Double bogey+: 2 concentric squares.
// Par: nothing.
// Mirrors the EA Sports PGA Road to the Masters scorecard convention.
//
// Parent must have `position: relative`; the icon spans `inset-0` and
// centers the shape over the cell.
export function ResultIcon({ result }: { result: ResultClass | null }) {
  if (result === "birdie") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-5 h-5 sm:w-6 sm:h-6 rounded-full border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  if (result === "eagle_or_better") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-5 h-5 sm:w-6 sm:h-6 rounded-full border" style={{ borderColor: "currentColor" }} />
        <span className="absolute block w-6 h-6 sm:w-7 sm:h-7 rounded-full border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  if (result === "bogey") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-5 h-5 sm:w-6 sm:h-6 border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  if (result === "double_bogey_plus") {
    return (
      <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
        <span className="block w-5 h-5 sm:w-6 sm:h-6 border" style={{ borderColor: "currentColor" }} />
        <span className="absolute block w-6 h-6 sm:w-7 sm:h-7 border" style={{ borderColor: "currentColor" }} />
      </span>
    )
  }
  return null
}
