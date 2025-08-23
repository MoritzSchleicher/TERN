"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

// Globe nur im Browser laden
const GlobeView = dynamic(() => import("@/components/GlobeView"), { ssr: false });

type GlobeAPI = { flyTo: (lat: number, lng: number, altitude?: number, ms?: number) => void };

// Fragen aus der externen Datei laden
import { Questions, type Question } from "../data/questions";

type Phase = "loading" | "intro" | "game" | "result";
type AnswerState = "idle" | "confirmed"; 
// idle: Auswahl möglich
// confirmed: Antwort bestätigt, Fact sichtbar, „Weiter“-Button erscheint

const FLY_ALTITUDE = 1.4;
const FLY_MS = 1200;

export default function Home() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [globeReady, setGlobeReady] = useState(false);
  const apiRef = useRef<GlobeAPI | null>(null);

  // Quiz-State
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<AnswerState>("idle");
  const [correctCount, setCorrectCount] = useState(0);

  const total = Questions.length;
  const current: Question = Questions[qIndex];

  const resetToIntro = useCallback(() => {
    setPhase("intro");
    setQIndex(0);
    setSelected(null);
    setState("idle");
    setCorrectCount(0);
  }, []);

  const handleReady = useCallback((api: GlobeAPI) => {
    apiRef.current = api;
    setGlobeReady(true);
    // kurze Micro-Delay nur für sanfteren Loader-Exit
    setTimeout(() => {
      setPhase((p) => (p === "loading" ? "intro" : p));
    }, 250);
  }, []);

  const onConfirm = useCallback(() => {
    if (selected === null || state !== "idle") return;

    // Score aktualisieren
    const isCorrect = selected === current.correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);

    // Flug starten
    apiRef.current?.flyTo(current.location.lat, current.location.lng, FLY_ALTITUDE, FLY_MS);

    // UI-Status: Antworten sperren, Fact anzeigen
    setState("confirmed");
  }, [current, selected, state]);

  const onNext = useCallback(() => {
    // Wenn letzte Frage: Ergebnis anzeigen
    if (qIndex + 1 >= total) {
      setPhase("result");
      return;
    }
    // Sonst nächste Frage
    setQIndex((i) => i + 1);
    setSelected(null);
    setState("idle");
  }, [qIndex, total]);

  return (
    <main className="relative h-[100dvh] w-full bg-black">
      {/* 3D-Layer */}
      <GlobeView onReady={handleReady} />

      {/* Phase 1: Loader */}
      {phase === "loading" && <Loader isReady={globeReady} />}

      {/* Phase 2: Intro-Overlay */}
      {phase === "intro" && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--col-light)] p-6 text-center shadow-xl">
            <h1 className="mb-2 text-2xl font-semibold text-slate-900">Willkommen bei TERN 🌍</h1>
            <p className="mb-5 text-slate-700">
              Teste dein Weltwissen auf der 3D-Globe. Klicke auf „Spiel starten“, um loszulegen.
            </p>
            <button
              className="rounded-xl bg-[var(--col-secondary)] px-5 py-2 font-medium text-white"
              onClick={() => {
                // vollständiger Reset beim Start
                setPhase("game");
                setQIndex(0);
                setSelected(null);
                setState("idle");
                setCorrectCount(0);
              }}
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
            <div className="mb-1 text-xs uppercase tracking-wide text-slate-500">
              Frage {qIndex + 1} / {total}
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              {current.question}
            </h2>
          </div>

          {/* Antworten & Controls unten */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-4 mx-auto grid w-[min(900px,95vw)] gap-2">
            {current.answers.map((opt, i) => {
              const isSel = selected === i;
              const isCorrect = state === "confirmed" && i === current.correctIndex;
              const isWrong = state === "confirmed" && isSel && i !== current.correctIndex;

              let classes =
                "rounded-xl border-10 border-[var(--col-light)] px-4 py-3 text-left text-slate-900 bg-[var(--col-light)] shadow transition-colors";
              if (state === "idle") classes += isSel ? " border-[var(--col-secondary)]" : " border-[var(--col-light)]";
              if (isCorrect) classes += " border-emerald-400 bg-emerald-50";
              if (isWrong) classes += " border-rose-400 bg-rose-50";

              return (
                <button
                  key={`${opt}-${i}`}
                  className={classes}
                  disabled={state !== "idle"}
                  onClick={() => state === "idle" && setSelected(i)}
                >
                  {opt}
                </button>
              );
            })}

            <div className="mt-2 flex gap-2">
              {state === "idle" ? (
                <>
                  <button
                    className="rounded-xl bg-cyan-500 px-4 py-2 font-medium text-white disabled:opacity-50"
                    disabled={selected === null}
                    onClick={onConfirm}
                  >
                    Bestätigen
                  </button>
                  <button
                    className="rounded-xl border border-slate-400 px-4 py-2 font-medium text-slate-900"
                    onClick={resetToIntro}
                  >
                    Zurück
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-white"
                    onClick={onNext}
                  >
                    Weiter
                  </button>
                  <button
                    className="rounded-xl border border-slate-400 px-4 py-2 font-medium text-slate-900"
                    onClick={resetToIntro}
                  >
                    Startscreen
                  </button>
                </>
              )}
            </div>

            {/* Fact-Box: erscheint nach Bestätigen */}
            {state === "confirmed" && current.fact && (
              <div className="mt-2 rounded-lg bg-white/90 p-3 text-sm text-slate-700 border border-slate-200">
                {current.fact}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase 4: Result-Screen */}
      {phase === "result" && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/90 p-6 text-center shadow-xl">
            <h2 className="mb-2 text-2xl font-semibold text-slate-900">Ergebnis</h2>
            <p className="mb-1 text-slate-800">
              Du hast <span className="font-semibold">{correctCount}</span> von{" "}
              <span className="font-semibold">{total}</span> Fragen richtig beantwortet.
            </p>
            <p className="mb-5 text-slate-600">
              ({Math.round((correctCount / Math.max(1, total)) * 100)}%)
            </p>
            <button
              className="rounded-xl bg-cyan-500 px-5 py-2 font-medium text-white"
              onClick={resetToIntro}
            >
              Nochmal spielen!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
