// components/ScreenMenu.tsx
import React, { useEffect, useMemo } from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { UIMainCard } from "../ui/UIMainCard";
import { GameState } from "@/types/main_game_types";

type ScreenResultProps = {
  onPlayAgain: () => void;
  onBack: () => void;
  score: number,
  total: number,
  game_state: GameState,
  controls: any
};

function getResultHeadline(score: number, total: number): string {
  if (total <= 0) return "Geschafft!";
  if (score === total) return "Perfekt!";
  if (score === 0) return "Oh je!";
  const ratio = score / total;

  if (ratio >= 0.9) return "Großartig!";
  if (ratio >= 0.7) return "Stark!";
  if (ratio >= 0.5) return "Stabil!";
  if (ratio >= 0.3) return "Das geht besser!";
  return "Versuch es nochmal!";
}

export default function ScreenResult({ onPlayAgain, onBack, score, total, game_state, controls }: ScreenResultProps) {
  useEffect(() => {
    if(game_state !== GameState.RESULT) return;

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


  // *────────────────────────────────
  // * LEARN: useMemo → merkt sich Werte.
  // * useCallback → merkt sich Funktionen (eigentlich useMemo(fn, deps), nur bequemer).
  // *────────────────────────────────
  const headline = useMemo(() => getResultHeadline(score, total), [score, total]);
  
  return (
    <UIOverlay>
      <UIMainCard controls={controls}>
        <div className="
          grid
          grid-rows-[auto_auto]
          grid-cols-[100%]
          place-items-center
          gap-4
        ">
          <div>
            <h1>
                {headline}
            </h1>
            <h2>
                {`Du hast ${score.toString()} von ${total.toString()} richtig!`}
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
                    h-[5dvh]
                    cursor-pointer
                    rounded-xl
                    bg-[var(--col-secondary)]
                    px-[0.26dvw]
                    py-[0.22dvh]
                    font-medium
                    text-[1.74dvh]
                    font-medium
                    text-white 
                    cursor-pointer
                    "
                  onClick={onPlayAgain}
              >
                  Nochmal
              </button>
              <button
                  className="
                    w-full
                    h-[5dvh]
                    cursor-pointer
                    rounded-xl
                    bg-[var(--col-secondary)]
                    px-[0.26dvw]
                    py-[0.22dvh]
                    font-medium
                    text-[1.74dvh]
                    font-medium
                    text-white 
                    cursor-pointer
                    "
                  onClick={onBack}
              >
                  Zurück
              </button>
          </div>
        </div>
      </UIMainCard>
    </UIOverlay>
  );
}
