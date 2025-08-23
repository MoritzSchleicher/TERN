"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

// Globe nur im Browser laden
const GlobeView = dynamic(() => import("@/components/GlobeView"), { ssr: false });

type GlobeAPI = { flyTo: (lat: number, lng: number, altitude?: number, ms?: number) => void };

const QUESTIONS = [
  {
    question: "Wo liegt Berlin?",
    answers: ["52.52°N, 13.40°E", "48.86°N, 2.35°E", "40.71°N, 74.01°W"],
    correctIndex: 0,
    location: { lat: 52, lng: 13 }
  }
];

type Phase = "loading" | "intro" | "game";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [globeReady, setGlobeReady] = useState(false);
  const apiRef = useRef<GlobeAPI | null>(null);

  // Simple Quiz-State
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "correct" | "wrong">("idle");
  const current_question = QUESTIONS[0];

  const handleReady = useCallback((api: GlobeAPI) => {
    apiRef.current = api;
    setGlobeReady(true);

    // nur aus "loading" nach "intro" wechseln (nicht, wenn wir schon im Spiel sind)
    setTimeout(() => {
      setPhase((p) => (p === "loading" ? "intro" : p));
    }, 250);
  }, []);

  return (
    <main className="relative h-[100dvh] w-full bg-black">
      {/* 3D-Layer */}
      <GlobeView onReady={handleReady} />

      {/* Phase 1: Loader */}
      {phase === "loading" && <Loader isReady={globeReady} />}

      {/* Phase 2: Intro-Overlay */}
      {phase === "intro" && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/90 p-6 text-center shadow-xl">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900">Willkommen bei TERN 🌍</h1>
            <p className="mb-5 text-slate-700">
              Teste dein Weltwissen auf der 3D-Globe. Klicke auf „Spiel starten“, um loszulegen.
            </p>
            <button
              className="rounded-xl bg-cyan-500 px-5 py-2 font-medium text-white"
              onClick={() => setPhase("game")}
            >
              Spiel starten
            </button>
          </div>
        </div>
      )}

      {/* Phase 3: Game-HUD */}
      {phase === "game" && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Frage oben */}
          <div className="pointer-events-auto mx-auto mt-4 w-[min(900px,95vw)] rounded-2xl bg-white/90 p-5 shadow-lg">
            <div className="mb-1 text-xs uppercase tracking-wide text-slate-500">Frage 1 / 1</div>
            <h2 className="text-lg font-semibold text-slate-900">{current_question.question}</h2>
          </div>

          {/* Antworten unten */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-4 mx-auto grid w-[min(900px,95vw)] gap-2">
            {current_question.answers.map((opt, i) => {
              const isSel = selected === i;
              const isCorrect = state !== "idle" && i === current_question.correctIndex;
              const isWrong = state !== "idle" && isSel && i !== current_question.correctIndex;

              let classes =
                "rounded-xl border px-4 py-3 text-left text-slate-900 bg-white/90 shadow";
              if (state === "idle") classes += isSel ? " border-cyan-400" : " border-slate-300";
              if (isCorrect) classes += " border-emerald-400 bg-emerald-50";
              if (isWrong) classes += " border-rose-400 bg-rose-50";

              return (
                <button
                  key={opt}
                  className={classes}
                  onClick={() => state === "idle" && setSelected(i)}
                >
                  {opt}
                </button>
              );
            })}

            <div className="mt-2 flex gap-2">
              {state === "idle" ? (
                <button
                  className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-white disabled:opacity-50"
                  disabled={selected === null}
                  onClick={() => {
                    if (selected === null) return;
                    const ok = selected === current_question.correctIndex;
                    setState(ok ? "correct" : "wrong");
                    apiRef.current?.flyTo(current_question.location.lat, current_question.location.lng, 1.4, 1000);
                  }}
                >
                  Bestätigen
                </button>
              ) : (
                <button
                  className="rounded-xl border border-slate-400 px-4 py-2 font-medium text-slate-900"
                  onClick={() => {
                    // (nur eine Frage im Demo)
                    setSelected(null);
                    setState("idle");
                    setPhase("intro");
                  }}
                >
                  Zurück
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
