import AutoFitText from "@/helpers/TextFitter";
import { BaseButton } from "./BaseButton";

type AnswerButtonProps = {
  onAnswerClicked: () => void;
  text: string;
  disabled?: boolean;
  selected?: boolean;
  result?: boolean | null;
};

export function AnswerButton({
  onAnswerClicked,
  text,
  disabled,
  selected = false,
  result,
}: AnswerButtonProps) {
  return (
    <BaseButton
      onClick={onAnswerClicked}
      disabled={disabled}
      aria-pressed={selected}
      data-selected={selected}
      data-result={result}
      className="
        w-[70.44dvw]
        h-[5.33dvh]
        bg-[var(--col-light)]
        py-[0.65dvh]
        px-[0.65dvw]
        portrait:max-md:px-[2dvw]
        text-left
        text-[var(--font-col-dark)]
        flex
        gap-[0.1dvw]
        justify-start
        shadow-[5px_5px_5px_5px_#00000040]
        relative
        z-0

        hover:bg-[var(--col-light-darker)]
        disabled:hover:bg-[var(--col-light)]

        /* Result */
        data-[result=true]:bg-[var(--col-correct)]
        data-[result=false]:bg-[var(--col-wrong)]
        data-[result=false]:text-[var(--col-light)]

        data-[result=true]:disabled:hover:bg-[var(--col-correct)]
        data-[result=false]:disabled:hover:bg-[var(--col-wrong)]
      "
    >
      <AutoFitText
        min={2.18}
        max={2.72}
        className="
          grid
          content-center
          font-bold
        "
      >
        {text}
      </AutoFitText>
    </BaseButton>
  );
}
