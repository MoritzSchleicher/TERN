import { ButtonType } from "@/types/general_data_types";
import { BaseButton } from "./BaseButton";

type SecondaryButtonProps = {
  text: string;
  type: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
};

export function SecondaryButton({ text, type, onClick, disabled }: SecondaryButtonProps) {
  return (
    <BaseButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        w-full
        h-[5.3dvh]
        bg-[var(--col-secondary_30)]
        text-[var(--col-light)]

        hover:bg-[var(--col-secondary_10)]
      "
    >
      <span className="[font-size:var(--font-size-button)]">
        {text}
      </span>
    </BaseButton>
  );
}
