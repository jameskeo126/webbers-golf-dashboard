import { ThemeToggle } from "./ThemeToggle"

export function Header() {
  return (
    <header
      className="flex items-center justify-between px-4 py-4 sm:px-6"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        Webber&apos;s Golf Dashboard
      </h1>
      <ThemeToggle />
    </header>
  )
}
