import { describe, it, expect } from "vitest"
import { computeResult, formatToPar } from "@/lib/scoreUtils"

describe("computeResult", () => {
  it("returns null when strokes is null", () => {
    expect(computeResult(null, 4)).toBe(null)
  })
  it("classifies eagle or better (par - 2)", () => {
    expect(computeResult(2, 4)).toBe("eagle_or_better")
    expect(computeResult(3, 5)).toBe("eagle_or_better")
    expect(computeResult(1, 4)).toBe("eagle_or_better")
  })
  it("classifies birdie (par - 1)", () => {
    expect(computeResult(3, 4)).toBe("birdie")
    expect(computeResult(2, 3)).toBe("birdie")
  })
  it("classifies par", () => {
    expect(computeResult(4, 4)).toBe("par")
    expect(computeResult(3, 3)).toBe("par")
  })
  it("classifies bogey (par + 1)", () => {
    expect(computeResult(5, 4)).toBe("bogey")
  })
  it("classifies double bogey or worse (par + 2)", () => {
    expect(computeResult(6, 4)).toBe("double_bogey_plus")
    expect(computeResult(8, 4)).toBe("double_bogey_plus")
  })
})

describe("formatToPar", () => {
  it("formats null as em-dash", () => {
    expect(formatToPar(null)).toBe("—")
  })
  it("formats zero as E", () => {
    expect(formatToPar(0)).toBe("E")
  })
  it("formats negative numbers with minus sign", () => {
    expect(formatToPar(-4)).toBe("-4")
  })
  it("formats positive numbers with plus sign", () => {
    expect(formatToPar(2)).toBe("+2")
  })
})
