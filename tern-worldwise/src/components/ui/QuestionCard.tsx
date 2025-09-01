import { UIMainCard } from "./UIMainCard";


export function QuestionCard() {
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
            1/10
        </span>
        <span className="
            text-center
            text-[38px]
            h-full
            content-center
            pb-6
            font-main
        ">
            Wie heißt die Hauptstadt von Deutschland?
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
            Geschichte
        </span>
    </UIMainCard>
  );
}