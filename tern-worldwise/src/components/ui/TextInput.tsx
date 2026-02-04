import { PortalTooltip } from "./PortalTooltip";

type TextInputProps = {
    name: string,
    headline: string,
    placeholder?: string
    required?: boolean
    info?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function TextInput({ name, headline, placeholder, required, info, onChange }: TextInputProps){
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

                    flex
                    flex-row
                    gap-1
                    items-center
                    relative
                "
            >
                {headline}:
                {info && (
                <span 
                    className="
                        relative
                        h-full
                        items-center
                        grid
                        group
                    ">
                    {/* ICON */}
                    <PortalTooltip content={info} side="bottom" offset={10}>
                        <button
                        type="button"
                        aria-label="Info"
                        className="
                            cursor-pointer
                            flex items-center justify-center
                            h-[2.6dvh] w-[2.6dvh]
                            rounded-full
                            bg-[var(--col-light)]
                            shadow-[4px_4px_10px_rgba(0,0,0,0.25)]
                            text-[1.8dvh] leading-none
                            opacity-80 hover:opacity-100
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[var(--col-secondary)]
                        "
                        >
                        ?
                        </button>
                    </PortalTooltip>
                </span>
                )}
            </span>
            <input
                type="text"
                name={name}
                maxLength={75}
                placeholder={placeholder}
                required={required}
                autoComplete="off"
                onChange={onChange}
                className="   
                    w-full  
                    h-[3.92dvh]
                    bg-[var(--col-light)]
                    border-[var(--col-border)]
                    border-[2px]
                    rounded-[var(--border-radius-second)]
                    px-2       
                    text-[2.18dvh]
                    outline-none
                    focus-visible:border-[var(--col-secondary)]

                    user-invalid:border-[var(--col-wrong)]
                    focus-visible:invalid:border-[var(--col-wrong)]
                "
            >            
            </input>
        </div>
    )
}