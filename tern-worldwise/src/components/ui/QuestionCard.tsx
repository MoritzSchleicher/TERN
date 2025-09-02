import { UIMainCard } from "./UIMainCard";

type QuestionCardProps = {
    indicator: string,
    question_text: string,
    category: string
}

export function QuestionCard({indicator, question_text, category}: QuestionCardProps) {
  return (
    <UIMainCard>
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