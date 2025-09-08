"use client";
import { useEffect, useLayoutEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  min?: number; // in dvh
  max?: number; // in dvh
  className?: string;
};

export default function AutoFitText({
  children,
  min = 3,   // z.B. 3dvh
  max = 8,   // z.B. 8dvh
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const dvhToPx = (val: number) =>
    (window.innerHeight * val) / 100; // 1dvh = 1% der innerHeight

  const fit = () => {
    const wrap = wrapRef.current;
    const el = textRef.current;
    if (!wrap || !el) return;

    /* el.style.lineHeight = "1.1"; */
    el.style.wordBreak = "break-word";
    el.style.hyphens = "auto";

    let lo = dvhToPx(min);
    let hi = dvhToPx(max);
    let best = lo;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;

      const fits =
        el.scrollHeight <= wrap.clientHeight &&
        el.scrollWidth <= wrap.clientWidth;

      if (fits) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    el.style.fontSize = `${best}px`;

    // Fallback unter harte Grenze (ABS_MIN = 1dvh)
    const absMinPx = dvhToPx(1);
    const stillOverflows =
      el.scrollHeight > wrap.clientHeight || el.scrollWidth > wrap.clientWidth;

    if (stillOverflows) {
      const ratioW = wrap.clientWidth / el.scrollWidth;
      const ratioH = wrap.clientHeight / el.scrollHeight;
      const factor = Math.max(0, Math.min(ratioW, ratioH));
      let target = Math.max(absMinPx, Math.floor(best * factor));
      el.style.fontSize = `${target}px`;

      // safety loop
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;
      while (
        target > absMinPx &&
        (el.scrollHeight > wrap.clientHeight ||
          el.scrollWidth > wrap.clientWidth)
      ) {
        target = Math.max(absMinPx, target - 1);
        el.style.fontSize = `${target}px`;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        el.offsetHeight;
      }
    }
  };

  useLayoutEffect(() => {
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, min, max]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(wrapRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    (document as any)?.fonts?.ready?.then?.(() => fit());
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <span ref={textRef}>{children}</span>
    </div>
  );
}
