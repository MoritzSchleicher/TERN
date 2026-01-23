// components/ScreenMenu.tsx
import React, { useEffect, useMemo } from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { UIMainCard } from "../ui/UIMainCard";
import { GameState } from "@/types/main_game_types";
import { SubmitCard } from "../ui/SubmitCard";

type ScreenSubmitProps = {
  onBack: () => void;
  game_state: GameState,
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

export default function ScreenResult({ onBack, game_state }: ScreenSubmitProps) {
  useEffect(() => {
    if(game_state !== GameState.SUBMIT) return;
  }, [game_state]);
  
  return (
    <UIOverlay>
      <SubmitCard onBack={onBack}></SubmitCard>
        
    </UIOverlay>
  );
}
