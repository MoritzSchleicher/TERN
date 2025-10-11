import { Constants } from "@/constants/general_constants";
import AutoFitText from "@/helpers/TextFitter";
import { RoundState } from "@/types/main_game_types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { rotate } from "three/tsl";

type NuggetProps = {
  onNuggetClicked: () => void;
  text: string,
  state?: RoundState;
  controls: any
};

const ringAnim = {
  idle: { opacity: 0, scale: 1 },
  pulse: {
    opacity: [0.35, 0],
    scale: [1, 1.2],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 1,
      ease: [0.42, 0, 0.58, 1], // cubic-bezier "easeInOut"
    },
  },
} as const;

export function Nugget({onNuggetClicked, text, state, controls}: NuggetProps) {
  const [pulseActive, setPulseActive] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (state !== RoundState.NUGGET) {
      setPulseActive(false);
      return;
    }
    const t = setTimeout(() => setPulseActive(true), Constants.UI.NUGGET_REMINDER);
    return () => clearTimeout(t);
  }, [state]);

  const showPulse = pulseActive;
  const animKey = showPulse && !hover ? "pulse" : "idle";
  
  return (
    <motion.div 
      onClick={onNuggetClicked}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="button"
      aria-label="Weiter"
      className="
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
        portrait:max-md:w-auto
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

        {/* Ripple-Layer (klick-transparent) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        // gleiche Rundung wie das Nugget, damit der Ring die Form übernimmt
        style={{ borderRadius: "var(--border-radius-main)" }}
      >
        {/* Ring */}
        <motion.span
          variants={ringAnim as any}
          animate={animKey}
          className="absolute inset-[-6px] rounded-[inherit] border"
          style={{
            borderColor: "var(--col-light)",      // nimm die helle Kartenfarbe oder eine Akzentfarbe
            boxShadow: "0 0 0 0 rgba(0,0,0,0.0)",  // optional: sanfter Glow
          }}
        />
      </div>
    </motion.div>
  );
}