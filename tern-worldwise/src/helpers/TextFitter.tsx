"use client";
import { useEffect, useLayoutEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  min?: number; // px
  max?: number; // px
  className?: string;
};

export default function AutoFitText({ children, min = 24, max = 38, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const fit = () => {
    const wrap = wrapRef.current;
    const el = textRef.current;
    if (!wrap || !el) return;

    el.style.lineHeight = "1.1";
    el.style.wordBreak = "break-word";
    el.style.hyphens = "auto";

    let lo = min, hi = max, best = min;

    // 1) Binäre Suche im Bereich [min, max]
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = `${mid}px`;
        // Reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        el.offsetHeight;

        const fits =
        el.scrollHeight <= wrap.clientHeight &&
        el.scrollWidth  <= wrap.clientWidth;

        if (fits) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
    }

    el.style.fontSize = `${best}px`;

    // 2) Wenn selbst "best" NICHT passt → unter min schrumpfen (harte Untergrenze)
    const ABS_MIN = 8; // setz' dir hier deine harte Untergrenze
    const stillOverflows =
        el.scrollHeight > wrap.clientHeight || el.scrollWidth > wrap.clientWidth;

    if (stillOverflows) {
        // Skaliere proportional runter (breite/höhe), dann clamp auf ABS_MIN
        const ratioW = wrap.clientWidth  / el.scrollWidth;
        const ratioH = wrap.clientHeight / el.scrollHeight;
        const factor = Math.max(0, Math.min(ratioW, ratioH)); // <= 1

        const target = Math.max(ABS_MIN, Math.floor(best * factor));
        el.style.fontSize = `${target}px`;

        // Safety: falls immer noch zu groß, iterativ schrumpfen
        // (selten nötig, aber robust)
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        el.offsetHeight;
        let s = target;
        while (
        s > ABS_MIN &&
        (el.scrollHeight > wrap.clientHeight || el.scrollWidth > wrap.clientWidth)
        ) {
        s = Math.max(ABS_MIN, s - 1);
        el.style.fontSize = `${s}px`;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        el.offsetHeight;
        }
    }
    };


  // vor dem ersten Paint, damit kein „Flackern“
  useLayoutEffect(() => { fit(); }, [children]);

  // bei Resize neu anpassen
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // wenn Webfonts laden, danach nochmal fitten
  useEffect(() => {
    (document as any)?.fonts?.ready?.then?.(() => fit());
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      <span ref={textRef}>{children}</span>
    </div>
  );
}
