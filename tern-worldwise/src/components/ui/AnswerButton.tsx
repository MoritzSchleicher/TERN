type AnswerButtonProps = {
  onAnswerClicked: () => void;
  text: string,
  label: string,
  disabled?: boolean
  selected?: boolean
  result?: boolean | null
};

export function AnswerButton({ onAnswerClicked, text, label, disabled, selected = false, result }: AnswerButtonProps) {
  return (
    <button
        type="button"
        onClick={onAnswerClicked}
        disabled={disabled}
        aria-pressed={selected} 
        data-selected={selected}
        data-result={result} 
        className="
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
            z-0

            hover:bg-[var(--col-light-darker)]
                
            
            disabled:cursor-not-allowed
            disabled:hover:bg-[var(--col-light)]

            /* Selected Zustand */
            data-[selected=true]:after:z-[-1]
            data-[selected=true]:after:bg-[var(--col-light-darker)]
            data-[selected=true]:after:w-[100%]
            data-[selected=true]:after:h-[10px]
            data-[selected=true]:after:absolute
            data-[selected=true]:after:bottom-0
            data-[selected=true]:after:left-0
            data-[selected=true]:after:rounded-bl-[var(--border-radius-main)]
            data-[selected=true]:after:rounded-br-[var(--border-radius-main)]

            /* Ergebnis-Einfärbung */
            data-[result=true]:bg-[var(--col-correct)]

            data-[result=false]:bg-[var(--col-wrong)]
            data-[result=false]:text-[var(--col-light)]
            
            data-[result=true]:disabled:hover:bg-[var(--col-correct)]
            data-[result=false]:disabled:hover:bg-[var(--col-wrong)]

            data-[result=true]:data-[selected=true]:after:bg-[var(--col-correct))]
            data-[result=false]:data-[selected=true]:after:bg-[var(--col-wrong))]
        "
    >
        <span className="
            text-left
            grid
            content-center
            text-[2.7dvh]
            z-1
        ">
            {label}:
        </span>
        <span className="
            text-left
            grid
            content-center
            text-[2.7dvh]
            font-bold
        ">
            {text}
        </span>
        
    </button>
  );
}