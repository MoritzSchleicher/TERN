// components/ScreenMenu.tsx
import React from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { UIMainCard } from "../ui/UIMainCard";

type ScreenMenuProps = {
  onStart: () => void;
};

export default function ScreenMenu({ onStart }: ScreenMenuProps) {
  return (
    <UIOverlay>
      <UIMainCard>
        <div className="
          grid
          grid-rows-[auto_auto]
          grid-cols-[100%]
          place-items-center
          gap-4
        ">
          <div>
            <h1>
                Willkommen bei TERN
            </h1>
            <h2>
                Teste dein Weltwissen auf der 3D-Globe. Klicke auf „Spiel starten“, um loszulegen.
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
              <button
                  className="
                    w-full
                    h-[5vh]
                    cursor-pointer
                    rounded-xl
                    bg-[var(--col-secondary)]
                    px-5
                    py-2
                    font-medium
                    text-white 
                    cursor-pointer
                    "
                  onClick={onStart}
              >
                  Spiel starten
              </button>
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
