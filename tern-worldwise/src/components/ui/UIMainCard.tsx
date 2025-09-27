import { motion } from "framer-motion";
import { RoundState } from "@/types/main_game_types";

type UIMainCardProps = {
  children: React.ReactNode;
  state?: RoundState; 
  controls: any;
};

export function UIMainCard({ children, state, controls }: UIMainCardProps) {
  return (
    <motion.div
      data-state={state}
      className="
        absolute
        pointer-events-auto
        left-1/2
        -translate-x-1/2
        top-[21.45dvh]
        h-[38dvh]
        w-auto
        aspect-[1/1]

        portrait:max-md:data-[state=nugget]:invisible

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-6
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]
        will-change-transform
        transform-gpu
        ease-out
        motion-reduce:transition-none
      "
      animate={controls}
      initial={{ x: "0", y: "0", opacity: 0, scale: 0, rotate: 0 }}
    >
      {children}
    </motion.div>
  );
}