import { RoundState } from "@/types/main_game_types";

type UIMainCardProps = {
  children: React.ReactNode;
  state?: RoundState; // optional
};

export function UIMainCard({ children, state = RoundState.QUESTION }: UIMainCardProps) {
  let target = { x: "0", y: "0", scale: 1, opacity: 1 };
  switch (state) {
    case RoundState.FLIGHT:
    case RoundState.NUGGET:
      target = { x: "calc(-50% - 16dvw)", y: "23dvh", scale: 1, opacity: 1 }
      break;
    default:
      break;
  }

  return (
    <div
      data-state={state}
      className="
        absolute
        pointer-events-auto
        left-1/2
        -translate-x-1/2
        top-[21.45vh]
        w-max
        h-[38vh]
        aspect-[1/1]

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-6
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]
        will-change-transform
        transform-gpu
        transition-[transform,opacity, scale]
        duration-700
        ease-out
        motion-reduce:transition-none
    "
    style={{
        transform: `translate(${target.x}, ${target.y}) scale(${target.scale})`,
        opacity: target.opacity,
    }}>
        {children}
    </div>
  );
}