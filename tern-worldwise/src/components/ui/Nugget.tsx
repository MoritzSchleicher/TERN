import AutoFitText from "@/helpers/TextFitter";
import { RoundState } from "@/types/main_game_types";
import { motion } from "framer-motion";
import { rotate } from "three/tsl";

type NuggetProps = {
  onNuggetClicked: () => void;
  text: string,
  state?: RoundState;
  controls: any
};

export function Nugget({onNuggetClicked, text, state, controls}: NuggetProps) {

  return (
    <motion.div onClick={onNuggetClicked} className="
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
      "
      animate={controls}
      initial={{ x: "0", y: "0", opacity: 0, scale: 1, rotateY: -90 }}
    >
      <AutoFitText
          min={16}
          max={20}
          className="
            text-center
            h-full
            content-center
            font-main
            leading-tight
          "
      >
          {text}
      </AutoFitText>
    </motion.div>
  );
}