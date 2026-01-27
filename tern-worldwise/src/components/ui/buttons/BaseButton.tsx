import { ButtonType } from "@/types/general_data_types";
import { ReactNode } from "react";

type BaseButtonProps = {
  children: ReactNode;
  type?: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  [key: string]: any; // für data-*, aria-*, etc.
};

export function BaseButton({
  children,
  type = ButtonType.BUTTON,
  onClick,
  disabled,
  className = "",
  ...rest
}: BaseButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        pointer-events-auto
        cursor-pointer
        rounded-[var(--border-radius-main)]
        focus-visible:outline-[var(--col-light)]
        disabled:cursor-not-allowed
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
