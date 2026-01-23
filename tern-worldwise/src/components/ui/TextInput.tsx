import { input } from "framer-motion/client";

type TextInputProps = {
  onInput: (input: string) => void;
  headline: string,
};

export function TextInput({ onInput, headline }: TextInputProps){
    return (
        <div
            className="
                w-full
                h-[7.5dvh]
                flex
                flex-col
                justify-between
                items-start
            "
        >
            <span
                className="    
                    w-full                
                    text-[2.18dvh]
                    text-[var(--font-col-dark)]
                    px-2
                "
            >
                {headline}:
            </span>
            <input
                type="text"
                maxLength={75}
                onInput={(e) => 
                    onInput((e.target as HTMLInputElement).value)
                }
                autoComplete="off"
                className="   
                    w-full  
                    h-[3.92dvh]
                    bg-[var(--col-light)]
                    border-[var(--col-border)]
                    border-[2px]
                    rounded-[var(--border-radius-second)]
                    px-2       
                    text-[2.18dvh]
                "
            >            
            </input>
        </div>
    )
}