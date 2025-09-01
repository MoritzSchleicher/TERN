// components/ScreenMenu.tsx
import React from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { QuestionCard } from "../ui/QuestionCard";
import { AnswerButton } from "../ui/AnswerButton";
import { BottomUI } from "../ui/BottomUI";
import { Archive } from "../ui/Archive";
import { Nugget } from "../ui/Nugget";


type ScreenRoundProps = {
  onAnswer: () => void;
};

export default function ScreenRound({ onAnswer }: ScreenRoundProps) {
  return (
    <UIOverlay>
        <div className="
          absolute
          top-[2dvh]
          left-[1.46dvw]
        ">
          <Archive />
        </div>
        <QuestionCard />
        <Nugget />
        <BottomUI>
          <div className="
            absolute
            bottom-[2.35dvh]
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
        </BottomUI>
    </UIOverlay>
  );
}
