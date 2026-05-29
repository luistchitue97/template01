"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type SlideFitProps = {
  children: ReactNode;
  /** Bottom reserve (px) for deck chrome. Defaults to 96px. */
  chromeReserve?: number;
  /** Side padding (px) inside the fit box. Defaults to 64px. */
  sidePad?: number;
  /** Top padding (px) inside the fit box. Defaults to 64px. */
  topPad?: number;
  className?: string;
  innerClassName?: string;
};

/**
 * Fills the slide and scales its single child so it always fits the viewport.
 * Outer uses absolute top/right/bottom/left (NOT inset-0 + padding) so that
 * clientHeight reflects the true content box, not box + 2 * padding.
 */
export function SlideFit({
  children,
  chromeReserve = 96,
  sidePad = 64,
  topPad = 64,
  className,
  innerClassName,
}: SlideFitProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useIsoLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const ow = outer.clientWidth;
        const oh = outer.clientHeight;
        // Measure inner at scale 1 to avoid feedback loops.
        const prevTransform = inner.style.transform;
        inner.style.transform = "none";
        const iw = inner.scrollWidth;
        const ih = inner.scrollHeight;
        inner.style.transform = prevTransform;
        if (!iw || !ih || !ow || !oh) return;
        const s = Math.min(1, ow / iw, oh / ih);
        setScale(s);
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(inner);

    let fontsHandler: (() => void) | null = null;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(measure).catch(() => {});
      fontsHandler = () => measure();
      document.fonts.addEventListener("loadingdone", fontsHandler);
    }

    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      if (fontsHandler) {
        document.fonts.removeEventListener("loadingdone", fontsHandler);
      }
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className={cn("absolute grid place-items-center overflow-hidden", className)}
      style={{
        top: topPad,
        right: sidePad,
        bottom: chromeReserve,
        left: sidePad,
      }}
    >
      <div
        ref={innerRef}
        className={cn("origin-center", innerClassName)}
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
