import { RoundState } from "@/types/main_game_types";
import { UIMainCard } from "./UIMainCard";

type QuestionCardProps = {
    indicator: string,
    question_text: string,
    category: string,
    round_state: RoundState
}

export function QuestionCard({indicator, question_text, category, round_state}: QuestionCardProps) {
    const position_changed = round_state === RoundState.FLIGHT || RoundState.NUGGET
  return (
    <UIMainCard state={round_state}>
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
        <span className="
            text-center
            text-[38px]
            h-full
            content-center
            pb-6
            font-main
        ">
            {question_text}
        </span>
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