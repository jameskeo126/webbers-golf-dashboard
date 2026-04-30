import { Header } from "@/components/Header"

export default function HomePage() {
  return (
    <main>
      <Header />
      <div className="p-4 sm:p-6">
        <p style={{ color: "var(--text-muted)" }}>Dashboard coming online…</p>
      </div>
    </main>
  )
}
