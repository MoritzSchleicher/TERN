import { RoundState } from "@/types/main_game_types";
import { UIMainCard } from "./UIMainCard";
import AutoFitText from "@/helpers/TextFitter";

type QuestionCardProps = {
    indicator: string,
    question_text: string,
    category: string,
    round_state: RoundState
    controls: any
}

export function QuestionCard({indicator, question_text, category, round_state, controls}: QuestionCardProps) {
  return (
    <UIMainCard state={round_state} controls={controls}>
        <span className="
            absolute
            top-[10px]
            text-end
            text-[2.18dvh]
            font-second
            content-center
            w-full
            pr-[10px]
        ">
            {indicator}
        </span>
        <AutoFitText
            min={2.66}
            max={4.13}
            className="
            relative
            grid place-items-center
            text-center
            h-full
            w-fill
            px-[0.21dvw]
            pb-[0.65dvh]
            font-main
            "
        >
            {question_text}
        </AutoFitText>
        <span className="
            absolute
            bottom-0
            text-center
            text-[2.18dvh]
            !font-second
            content-center
            w-full
            pb-[0.54dvh]
        ">
            {category}
        </span>
    </UIMainCard>
  );
}