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
            text-[20px]
            font-second
            content-center
            w-full
            pr-[10px]
        ">
            {indicator}
        </span>
        <AutoFitText
            min={24}
            max={38}
            className="
            grid place-items-center
            text-center
            h-full
            px-4
            pb-6
            font-main
            "
        >
            {question_text}
        </AutoFitText>
        <span className="
            absolute
            bottom-0
            text-center
            text-[20px]
            !font-second
            content-center
            w-full
            pb-[5px]
        ">
            {category}
        </span>
    </UIMainCard>
  );
}