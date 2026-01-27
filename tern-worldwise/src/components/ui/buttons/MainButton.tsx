import { ButtonType } from "@/types/general_data_types";
import { BaseButton } from "./BaseButton";

type MainButtonProps = {
  text: string;
  type: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
};

export function MainButton({ text, type, onClick, disabled }: MainButtonProps) {
  return (
    <BaseButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        h-[5.3dvh]
        bg-[var(--col-secondary)]
        text-[var(--col-light)]

        hover:bg-[var(--col-secondary_70)]
        hover:text-[var(--col-light)]
      "
    >
      <span className="[font-size:var(--font-size-button)]">
        {text}
      </span>
    </BaseButton>
  );
}
