"use client";
import { useRef, useState } from "react"
import GlobeView from "@/components/GlobeView"
import { Questions } from "@/data/questions"

type GlobeAPI = { flyTo: (lat: number, lng: number, altitude?: number, ms?: number) => void }

export default function Game() {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle")
  const q = Questions[idx]
  const globeRef = useRef<GlobeAPI | null>(null)

  const confirm = () => {
    if (selected === null) return
    const isCorrect = selected === q.correctIndex
    setState(isCorrect ? "correct" : "wrong")
    // Globus fliegt hin, zeigt Pin (nur flyTo im Proto)
    globeRef.current?.flyTo(q.location.lat, q.location.lng, 1.4, 1200)
  }

  const next = () => {
    setSelected(null)
    setState("idle")
    setIdx((i) => (i + 1) % Questions.length)
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", height: "100dvh" }}>
      {/* Left: Question Panel */}
      <aside style={{ padding: 16, borderRight: "1px solid #1F2A44", background: "#0B1020", color: "#E6EDF3" }}>
        <header style={{ marginBottom: 12 }}>
          <div style={{ opacity: 0.8, fontSize: 12 }}>TERN · Weltwissen 🌍</div>
          <h1 style={{ marginTop: 8, fontSize: 22, fontWeight: 600 }}>Schnellrunde</h1>
        </header>

        <article style={{ background: "#121832", border: "1px solid #1F2A44", borderRadius: 16, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>{q.question}</h2>
          <ul style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {q.answers.map((opt, i) => {
              const isSel = selected === i
              const bg =
                state === "idle"
                  ? isSel
                    ? "#1F2A44"
                    : "transparent"
                  : i === q.correctIndex
                  ? "rgba(49,208,170,.15)" // grünlich
                  : isSel
                  ? "rgba(255,107,107,.15)" // rötlich
                  : "transparent"
              const border =
                state === "idle"
                  ? "#1F2A44"
                  : i === q.correctIndex
                  ? "rgba(49,208,170,.5)"
                  : isSel
                  ? "rgba(255,107,107,.5)"
                  : "#1F2A44"

              return (
                <li key={opt}>
                  <button
                    onClick={() => state === "idle" && setSelected(i)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: bg,
                      color: "#E6EDF3",
                      border: `1px solid ${border}`,
                      borderRadius: 12,
                      padding: "10px 12px",
                      cursor: "pointer"
                    }}
                  >
                    {opt}
                  </button>
                </li>
              )
            })}
          </ul>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Frage {idx + 1} / {Questions.length}</span>
            {state === "idle" ? (
              <button
                onClick={confirm}
                disabled={selected === null}
                style={{
                  background: "#6FE7E7",
                  color: "#0B1020",
                  border: "none",
                  borderRadius: 12,
                  padding: "10px 14px",
                  cursor: selected === null ? "not-allowed" : "pointer",
                  opacity: selected === null ? 0.5 : 1
                }}
              >
                Bestätigen
              </button>
            ) : (
              <button
                onClick={next}
                style={{
                  background: "transparent",
                  color: "#E6EDF3",
                  border: "1px solid #1F2A44",
                  borderRadius: 12,
                  padding: "10px 14px",
                  cursor: "pointer"
                }}
              >
                Weiter ➡️
              </button>
            )}
          </div>
        </article>

        {state !== "idle" && (
          <div style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>
            🧠 {q.fact}
          </div>
        )}
      </aside>

      {/* Right: Globe */}
      <main style={{ position: "relative" }}>
        <GlobeView
          onReady={(api) => (globeRef.current = api)}
        />
        {/* Overlay-Card (Fact) könntest du hier optional noch einblenden */}
      </main>
    </div>
  )
}
