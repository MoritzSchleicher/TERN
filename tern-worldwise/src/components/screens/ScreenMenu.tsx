// components/ScreenMenu.tsx
import React, { useEffect } from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { UIMainCard } from "../ui/UIMainCard";
import { GameState } from "@/types/main_game_types";
import { MainButton } from "../ui/buttons/MainButton";
import { ButtonType } from "@/types/general_data_types";

type ScreenMenuProps = {
  onStart: () => void;
  game_state: GameState;
  controls: any
};

export default function ScreenMenu({ onStart, game_state, controls }: ScreenMenuProps) {
  useEffect(() => {
    if(game_state !== GameState.MENU) return;

    controls.set({
      x: "0",
      y: "0",
      opacity: 0,
      scale: 0,
    });

    // Intro-Animation
    controls.start({
      x: "0",
      y: "0",
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeIn" },
    });
  }, [game_state, controls]);
    
  return (
    <UIOverlay>
      <UIMainCard controls={controls}>
        <div className="
          flex
          flex-col
          justify-between
          place-items-center
          min-h-0
        ">
          <div>
            <h1>
                Willkommen bei TERN
            </h1>
            <h2>
                Teste dein Weltwissen auf dem interaktiven 3D-Globus! Beantworte 10 Fragen in jeweils 30 Sekunden – nach jeder Frage zeigt der Globus die richtige Position. Klicke auf „Spiel starten“, um loszulegen.
            </h2>
          </div>
          <div className="
                  flex
                  flex-col
                  items-center
                  justify-end
                  gap-3
                  w-full
                  h-full
              ">
              <MainButton text="Spiel starten" type={ButtonType.BUTTON} onClick={onStart}></MainButton>
          </div>
        </div>
      </UIMainCard>
    </UIOverlay>
  );
}

/* <div className="pointer-events-none absolute inset-0 z-10">
      <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--col-light)] p-6 text-center shadow-xl">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Willkommen bei TERN 🌍</h1>
        <p className="mb-5 text-slate-700">
          Teste dein Weltwissen auf der 3D-Globe. Klicke auf „Spiel starten“, um loszulegen.
        </p>
        <button
          className="rounded-xl bg-[var(--col-secondary)] px-5 py-2 font-medium text-white"
          onClick={onStart}
        >
          Spiel starten
        </button>

        <button
          className="rounded-xl bg-[var(--col-secondary)] px-5 py-2 font-medium text-white"
          onClick={onEnd}
        >
          Spiel beenden
        </button>
      </div>
    </div> */
