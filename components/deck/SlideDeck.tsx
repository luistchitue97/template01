"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { DeckChrome } from "./DeckChrome";
import { DeckNavContext, SlideContext, type DeckNavContextValue } from "./contexts";
import type { SlideProps } from "./Slide";

type SlideDeckProps = {
  children: ReactNode;
  customizeHref?: string;
};

export function SlideDeck({ children, customizeHref }: SlideDeckProps) {
  const slides = useMemo(() => {
    return Children.toArray(children).filter((c): c is ReactElement<SlideProps> =>
      isValidElement(c),
    );
  }, [children]);
  const total = slides.length;
  const labels = useMemo(() => slides.map((s, i) => s.props.label ?? `Slide ${i + 1}`), [slides]);

  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const go = useCallback(
    (n: number) => {
      setCurrent((c) => {
        const next = Math.max(0, Math.min(total - 1, n));
        return next === c ? c : next;
      });
    },
    [total],
  );
  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case " ":
          e.preventDefault();
          if (e.shiftKey) prev();
          else next();
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(total - 1);
          break;
        case "f":
        case "F":
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // toggleFullscreen is defined below and stable enough through closure;
    // listing deps explicitly:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, prev, go, total]);

  // Wheel — debounced so one gesture = one slide.
  const wheelLock = useRef(false);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 12) return;
      if (wheelLock.current) return;
      wheelLock.current = true;
      if (delta > 0) next();
      else prev();
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 650);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Touch swipe
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      if (!start) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const dt = Date.now() - start.t;
      touchStart.current = null;
      if (dt > 800) return;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const navValue: DeckNavContextValue = useMemo(
    () => ({ current, total, labels, go, next, prev, isFullscreen, toggleFullscreen }),
    [current, total, labels, go, next, prev, isFullscreen, toggleFullscreen],
  );

  return (
    <DeckNavContext.Provider value={navValue}>
      <div className="relative w-screen h-[100svh] overflow-hidden bg-cream text-ink">
        <div
          className="flex h-full will-change-transform"
          style={{
            transform: `translate3d(${-current * 100}vw, 0, 0)`,
            transition: "transform 720ms cubic-bezier(0.22, 1, 0.36, 1)",
            width: `${total * 100}vw`,
          }}
        >
          {slides.map((child, i) => (
            <SlideContext.Provider
              key={i}
              value={{ index: i, total, isActive: i === current }}
            >
              {child}
            </SlideContext.Provider>
          ))}
        </div>
        <DeckChrome customizeHref={customizeHref} />
      </div>
    </DeckNavContext.Provider>
  );
}
