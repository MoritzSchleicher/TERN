export function QuestionCard() {
  return (
    <div className="
        absolute
        pointer-events-auto
        left-1/2
        -translate-x-1/2
        top-[21.45vh]
        w-[min(400px,20.8vw)]
        h-[38vh]

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-6
        text-center
        shadow-xl
        text-[var(--font-col-dark)]
        grid
    ">
        <span className="
            absolute
            top-[10px]
            text-end
            text-[20px]
            font-[var(--font-second)]
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
            font-[var(--font-main)]
        ">
            Wie heißt die Hauptstadt von Deutschland?
        </span>
        <span className="
            absolute
            bottom-0
            text-center
            text-[20px]
            font-[var(--font-second)]
            content-center
            w-full
            pb-[10px]
        ">
            Geschichte
        </span>
    </div>
  );
}