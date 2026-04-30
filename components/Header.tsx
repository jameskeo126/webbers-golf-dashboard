import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header
      className="flex items-center justify-between px-4 py-4 sm:px-6"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <h1 className="font-serif text-2xl tracking-tight" style={{ color: "var(--accent)" }}>
        The Augusta Four
      </h1>
      <ThemeToggle />
    </header>
  )
}
