// components/ScreenMenu.tsx
import React, { useCallback, useRef, useState } from "react";
import { UIOverlay } from "../ui/UIOverlay";
import { QuestionCard } from "../ui/QuestionCard";
import { AnswerButton } from "../ui/AnswerButton";
import { BottomUI } from "../ui/BottomUI";
import { Archive } from "../ui/Archive";
import { Nugget } from "../ui/Nugget";
import { RoundState } from "@/types/main_game_types";
import { Question, QuestionPool } from "@/data/questions";
import { GlobeAPI } from "../GlobeView";
import { Constants } from "@/constants/general_constants";


type ScreenRoundProps = {
  question: Question;
  index: number;
  total: number;
  round_state: RoundState;
  selected_answer_id: number | null;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export enum AnswerState {
  IDLE,
  CONFIRMED
};

export default function ScreenRound({
  question,
  index,
  total,
  round_state,
  selected_answer_id,
  onAnswer,
  onNext,
  onBack,
}: ScreenRoundProps) {
  return (
    <UIOverlay>
        <Archive />
        <QuestionCard
          indicator = {`${index+1}/${total}`}
          question_text = {question.question}
          category = {question.category as string} 
          round_state={round_state}
        />
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
            {question.answers.map((answer, index) => {
              const isSelected = selected_answer_id === index;
              const isCorrect = index === question.correctIndex;

              let is_correct: boolean | null = null;
              if (round_state !== RoundState.QUESTION) {
                if (isCorrect) is_correct = true;
                else if (isSelected) is_correct = false;
              }
              return (
                <AnswerButton 
                  key={`${answer}-${index}`}
                  onAnswerClicked = {() => {
                    onAnswer(index);
                  }}
                  text = {answer}
                  label = {String.fromCharCode(65 + index)}
                  disabled = {round_state !== RoundState.QUESTION}
                  selected = {isSelected}
                  result = {is_correct}
                />
              );
            })}
          </div>
        </BottomUI>
        <Nugget 
          onNuggetClicked={onNext}
          show = {round_state === RoundState.NUGGET}
          text = {question.fact}
        />
    </UIOverlay>
  );
}
