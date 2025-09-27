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
        left-[66.56dvw]
        top-[66.27dvh]
        cursor-pointer

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-[1.3dvh]
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]
        
        portrait:max-md:left-auto
        portrait:max-md:justify-self-center
        portrait:max-md:top-[21.45vh]
        portrait:max-md:h-[38dvw]
        portrait:max-md:w-max
        portrait:max-md:aspect-[1/1]
      "
      animate={controls}
      initial={{ x: "0", y: "0", opacity: 0, scale: 1, rotateY: -90 }}
    >
      <AutoFitText
          min={1.74}
          max={2.18}
          className="
            relative
            grid place-items-center
            h-full
            w-full
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