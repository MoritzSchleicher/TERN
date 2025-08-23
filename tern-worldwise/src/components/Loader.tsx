"use client";

import { useEffect, useRef, useState } from "react";

export default function Loader({ isReady }: { isReady: boolean }) {
  // *────────────────────────────────
  // * LEARN: userState()
  // * progress: State speicher,
  // * setProgress: Funktion um State zu ändern
  // *────────────────────────────────
  const [progress, setProgress] = useState(0);

  // *────────────────────────────────
  // * LEARN: useRef()
  // * kleine "Schublade" um sich etwas zu merken ohne Re-Render
  // * in dem Fall die requestAnimationRequest(raf) ID für den cleanup
  // *────────────────────────────────
  const rafRef = useRef<number | null>(null);

  // *────────────────────────────────
  // * LEARN: useEffect()
  // * zentraler Hook (wie useRef, useState)
  // * für "mach NACH dem Rendern noch was"
  // * return ist optionales cleanup
  // * [ ] steht für den "Trigger" ohne triggert einfach nach jedem Frame
  // * in dem Fall wenn isReady sich ändert
  // * funktioniert nur mit client-seitigem Render also nicht für Werte die sich auf dem Server ändern
  // * dafür dann useEffect mit fetch 
  // *────────────────────────────────
  useEffect(() => {
    if (isReady) {
      setProgress(100);          
      return;                    
    }

    const tick = () => {
      setProgress((progress) => {
        if (progress < 90) {
            // *────────────────────────────────
            // * NOTE:
            // * ternäre Operator Bedingung ? wennTrue : wennFalse
            // *────────────────────────────────
          return progress + (progress < 50 ? 1.5 : 0.8);
        }
        return progress;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    // Animation starten
    rafRef.current = requestAnimationFrame(tick);

    // Cleanup: Falls der Loader unmounted wird, laufende rAF abbrechen.
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isReady]); // Effekt reagiert auf Änderungen von `isReady`

  const clamped = Math.min(100, Math.round(progress));

  // JSX-Layout:
  // Ein Fullscreen-Overlay (absolute, inset-0) über allem (z-50) mit dunklem Hintergrund.
  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-[var(--col-dark)]">
      {/* Zentrierte Box, responsive Breite: max 520px oder 90% der Viewport-Breite */}
      <div className="w-[min(520px,90vw)]">
        {/* Obere Beschriftung mit Prozentzahl */}
        <div className="mb-3 text-center text-sm font-medium text-[var(--col-light)]">
          lädt assets … {clamped}%
        </div>

        {/* Äußere Leiste (Hintergrund), leicht transparent */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          {/* Innere Leiste (Füllung). Breite wird dynamisch über Inline-Style gesetzt.
             transition-[width] sorgt für sanftes Nachziehen bei Prozent-Änderung. */}
          <div
            className="h-full rounded-full bg-cyan-400 transition-[width] duration-150"
            style={{ width: `${clamped}%` }}
          />
        </div>
      </div>
    </div>
  );
}
