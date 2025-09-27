// components/ScreenMenu.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { TimeController } from "@/service/time_controller";


type ScreenRoundProps = {
  question: Question;
  index: number;
  total: number;
  round_state: RoundState;
  selected_answer_id: number | null;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onBack: () => void;
  question_controls: any;
  nugget_controls: any;
  time_controller: TimeController
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
  question_controls: question_controls,
  nugget_controls: nugget_controls,
  time_controller: time_controller
}: ScreenRoundProps) {
  // 1) Antworten einmal pro Frage shufflen
  const shuffledAnswers = useMemo(() => {
    // { text, originalIndex }
    const arr = question.answers.map((text, i) => ({ text, originalIndex: i }));
    // Fisher–Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [question]);
  
  useEffect(() => {
    if(round_state !== RoundState.QUESTION) return;

    nugget_controls.set({
      x: "0",
      y: "0",
      opacity: 0,
      scale: 0,
    });

    question_controls.set({
      x: "0",
      y: "0",
      opacity: 0,
      scale: 0,
    });

    // Intro-Animation
    question_controls.start({
      x: "0",
      y: "0",
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeIn" },
    });
  }, [round_state, question_controls, nugget_controls]);

  return (
    <UIOverlay>
        <Archive />
        <QuestionCard
          indicator = {`${index+1}/${total}`}
          question_text = {question.question}
          category = {question.category as string} 
          round_state={round_state}
          controls={question_controls}
        />
        <BottomUI controller={time_controller}>
          <div className="
            relative
            pointer-events-auto
            w-[100%]
            h-[100%]
            flex
            flex-row
            gap-[1.61dvw]
            align-center
            justify-center
            items-center
            portrait:max-md:flex-col
          ">
            {shuffledAnswers.map(({ text, originalIndex }, i) => {
              const isSelected = selected_answer_id === originalIndex;          
              const isCorrect  = originalIndex === question.correctIndex;       

              let is_correct: boolean | null = null;
              if (round_state !== RoundState.QUESTION) {
                if (isCorrect) is_correct = true;
                else if (isSelected) is_correct = false;
              }

              return (
                <AnswerButton
                  key={`${text}-${originalIndex}`}
                  onAnswerClicked={() => onAnswer(originalIndex)}               
                  text={text}
                  label={String.fromCharCode(65 + i)}                           
                  disabled={round_state !== RoundState.QUESTION}
                  selected={isSelected}
                  result={is_correct}
                />
              );
            })}
          </div>
        </BottomUI>
        <Nugget 
          onNuggetClicked={onNext}
          text = {question.fact}
          state={round_state}
          controls = {nugget_controls}
        />
    </UIOverlay>
  );
}
