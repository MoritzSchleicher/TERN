"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Side = "right" | "left" | "top" | "bottom";

type PortalTooltipProps = {
  content: React.ReactNode;
  side?: Side;
  offset?: number;
  className?: string;

  // Trigger MUST be a single element that can take HTML props (button/span/div etc.)
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
};

export function PortalTooltip({
  content,
  side = "right",
  offset = 8,
  className,
  children,
}: PortalTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  useEffect(() => setMounted(true), []);

  const updatePosition = () => {
    const t = triggerRef.current;
    const tip = tooltipRef.current;
    if (!t || !tip) return;

    const r = t.getBoundingClientRect();

    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;

    let left = 0;
    let top = 0;

    if (side === "right") {
      left = r.right + offset;
      top = r.top + r.height / 2 - th / 2;
    } else if (side === "left") {
      left = r.left - offset - tw;
      top = r.top + r.height / 2 - th / 2;
    } else if (side === "top") {
      left = r.left + r.width / 2 - tw / 2;
      top = r.top - offset - th;
    } else {
      left = r.left + r.width / 2 - tw / 2;
      top = r.bottom + offset;
    }

    const pad = 8;
    left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - th - pad));

    setPos({ left, top });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side, offset]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = triggerRef.current;
      const tip = tooltipRef.current;
      const target = e.target as Node | null;
      if (!target) return;

      if (t && !t.contains(target) && tip && !tip.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // NOTE: React treats `ref` specially; cloneElement typing doesn't include it reliably.
  // We'll attach our ref via a callback and accept a small cast.
  const trigger = React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;

      const originalRef = (children as unknown as { ref?: unknown }).ref;
      if (typeof originalRef === "function") {
        (originalRef as (n: HTMLElement | null) => void)(node);
      } else if (originalRef && typeof originalRef === "object" && "current" in (originalRef as any)) {
        (originalRef as any).current = node;
      }
    },
    "aria-describedby": open ? tooltipId : undefined,

    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(e);
      setOpen(true);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(e);
      setOpen(false);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(e);
      setOpen(true);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(e);
      setOpen(false);
    },
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(e);
      setOpen((v) => !v);
    },
  } as any);

  return (
    <>
      {trigger}

      {mounted && open
        ? createPortal(
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              style={{ position: "fixed", left: pos.left, top: pos.top }}
              className={
                className ??
                `
                  z-[999999]
                  max-w-[36ch]
                  rounded-[var(--border-radius-second)]
                  bg-[var(--col-light)]
                  p-3
                  text-[2dvh]
                  text-[var(--font-col-dark)]
                  shadow-[5px_5px_15px_2px_#00000040]
                `
              }
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </>
  );
}
