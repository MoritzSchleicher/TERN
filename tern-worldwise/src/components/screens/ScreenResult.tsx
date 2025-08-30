// components/ScreenMenu.tsx
import React from "react";

type ScreenResultProps = {
  onPlayAgain: () => void;
  onBack: () => void;
};

export default function ScreenResult({ onPlayAgain, onBack }: ScreenResultProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--col-light)] p-6 text-center shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Willkommen bei TERN 🌍</h1>
        <p className="mb-5 text-slate-700">
          Teste dein Weltwissen auf der 3D-Globe. Klicke auf „Spiel starten“, um loszulegen.
        </p>
        
        <button
          className="rounded-xl bg-[var(--col-secondary)] px-5 py-2 font-medium text-white"
          onClick={onPlayAgain}
        >
          Spiel starten
        </button>

        <button
          className="rounded-xl bg-[var(--col-secondary)] px-5 py-2 font-medium text-white"
          onClick={onBack}
        >
          Spiel starten
        </button>
      </div>
    </div>
  );
}
