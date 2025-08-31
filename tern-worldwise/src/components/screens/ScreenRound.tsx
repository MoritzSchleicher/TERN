// components/ScreenMenu.tsx
import React from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { QuestionCard } from "../ui/QuestionCard";
import { AnswerButton } from "../ui/AnswerButton";

type ScreenRoundProps = {
  onAnswer: () => void;
};

export default function ScreenRound({ onAnswer }: ScreenRoundProps) {
  return (
    <UIOverlay>
        <QuestionCard />
        <div className="
          absolute
          bottom-0
          pointer-events-auto
          left-1/2
          -translate-x-1/2
          w-[43.45dvw]
          flex
          flex-row
          gap-[1.61dvw]
          align-center
          justify-center
        ">
          <AnswerButton />
          <AnswerButton />
          <AnswerButton />
        </div>
    </UIOverlay>
  );
}
