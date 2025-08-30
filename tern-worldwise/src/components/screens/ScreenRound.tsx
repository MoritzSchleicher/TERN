// components/ScreenMenu.tsx
import React from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { QuestionCard } from "../ui/QuestionCard";

type ScreenRoundProps = {
  onAnswer: () => void;
};

export default function ScreenRound({ onAnswer }: ScreenRoundProps) {
  return (
    <UIOverlay>
        <QuestionCard />
    </UIOverlay>
  );
}
