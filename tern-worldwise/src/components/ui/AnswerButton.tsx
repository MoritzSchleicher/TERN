export function AnswerButton() {
  return (
    <div className="
        pointer-events-auto
        w-[13.44dvw]
        h-[5.33dvh]

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        py-[6px]
        px-[12px]
        text-left
        text-[var(--font-col-dark)]
        flex
        flex-row
        gap-2
        justify-start
        cursor-pointer
        shadow-[5px_5px_5px_5px_#00000040]
        relative       
        hover:bg-[var(--col-light-darker)]        
    ">
        <span className="
            text-left
            grid
            content-center
            text-[2.7dvh]
        ">
            A:
        </span>
        <span className="
            text-left
            grid
            content-center
            text-[2.7dvh]
            font-bold
        ">
            Mailand
        </span>
        
    </div>
  );
}