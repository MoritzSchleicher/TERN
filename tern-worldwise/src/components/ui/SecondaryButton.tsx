import { ButtonType, CSSVar } from "@/types/general_data_types"

type SecondaryButtonProps = {
    text: string,
    type: ButtonType
    onClick?: () => void,
    disabled?: boolean
}

export function SecondaryButton({text, type, onClick, disabled}: SecondaryButtonProps){
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="
                w-full
                h-[5.3dvh]
                rounded-[var(--border-radius-main)]
                bg-[var(--col-secondary_30)]
                pointer-events-auto
                cursor-pointer
                text-[var(--col-light)]

                hover:bg-[var(--col-secondary_10)]
                hover:text-[var(--col-light)]

                focus-visible:outline-[var(--col-light)]
            "
        >
            <span
                className="
                    [font-size:var(--font-size-button)]
                "
            >
                {text}
            </span>
        </button>
    )
}