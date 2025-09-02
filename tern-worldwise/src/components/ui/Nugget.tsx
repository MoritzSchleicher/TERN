type NuggetProps = {
  onNuggetClicked: () => void;
  text: string,
  show: boolean
};

export function Nugget({onNuggetClicked, text, show = false}: NuggetProps) {
  if (!show) return null;

  return (
    <div onClick={onNuggetClicked} className="
        absolute
        pointer-events-auto
        w-[13.44dvw]
        h-[16.2dvh]
        aspect-[1/1]
        left-[66.56dvw]
        top-[66.27dvh]
        cursor-pointer

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-[12px]
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]
    ">
        <span className="
            text-center
            text-[2.18dvh]
            h-full
            content-center
            font-main
            leading-tight
        ">
            Info: {text}
        </span>
    </div>
  );
}