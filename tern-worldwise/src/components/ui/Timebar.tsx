// Timebar.tsx
"use client";

import { useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { TimeController } from "@/service/time_controller";

type TimebarProps = {
  controller: TimeController;
  className?: string;
};

export function Timebar({ controller, className = "" }: TimebarProps) {
  const remainingMV = useMotionValue(1);

  useEffect(() => {
    controller.subscribe((remainingFraction) => {
      remainingMV.set(remainingFraction);
    });
  }, [controller, remainingMV]);

  return (
    <div
      className={`
        w-full h-[0.54dvh]
        bg-[var(--col-dark)]
        rounded-t-[8px]
        shadow-[inset_0_2px_2px_0_#00000040]
        overflow-hidden
        ${className}
      `}
    >
      <motion.div
        className="
          h-full
          bg-[var(--col-light)]
          rounded-t-[8px]
          origin-left
          transform-gpu
          will-change-transform
        "
        
        style={{ scaleX: remainingMV }}
        transition={{ type: "tween", duration: 0.1, ease: "linear" }}
      />
    </div>
  );
}
