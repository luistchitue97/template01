"use client";

import { useDeckNav } from "./contexts";
import { cn } from "@/lib/cn";

type DeckChromeProps = {
  customizeHref?: string;
};

const pad2 = (n: number) => n.toString().padStart(2, "0");

export function DeckChrome({ customizeHref }: DeckChromeProps) {
  const { current, total, labels, go, next, prev, isFullscreen, toggleFullscreen } = useDeckNav();
  const progress = total <= 1 ? 1 : current / (total - 1);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 select-none">
      {/* Progress bar */}
      <div className="relative h-px w-full bg-ink/10">
        <div
          className="absolute left-0 top-0 h-px bg-terracotta-300 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="pointer-events-auto flex h-[80px] items-center justify-between px-8 text-ink">
        {/* Left: counter */}
        <div className="flex items-baseline gap-3 tnum text-[11px] uppercase tracking-[0.18em] text-ink/60">
          <span className="text-ink display text-[22px] leading-none tnum">
            {pad2(current + 1)}
          </span>
          <span className="text-ink/40">/</span>
          <span className="tnum">{pad2(total)}</span>
          <span className="ml-4 hidden md:inline text-ink/50 normal-case tracking-normal">
            {labels[current]}
          </span>
        </div>

        {/* Center: dot navigator */}
        <nav aria-label="Slides" className="flex items-center gap-2">
          {labels.map((label, i) => {
            const active = i === current;
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${label}`}
                aria-current={active ? "true" : undefined}
                className="group relative grid h-6 w-6 place-items-center"
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    active
                      ? "h-2 w-6 bg-terracotta-300"
                      : "h-1.5 w-1.5 bg-ink/25 group-hover:bg-ink/55",
                  )}
                />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: prev/next, customize, fullscreen */}
        <div className="flex items-center gap-2">
          {customizeHref ? (
            <a
              href={customizeHref}
              className="mr-2 hidden text-[11px] uppercase tracking-[0.18em] text-ink/55 underline-offset-4 hover:text-terracotta-300 hover:underline md:inline"
            >
              Customize
            </a>
          ) : null}
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous slide"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink transition hover:border-ink/45 disabled:opacity-30"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current === total - 1}
            aria-label="Next slide"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink transition hover:border-ink/45 disabled:opacity-30"
          >
            <Arrow dir="right" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="ml-1 grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink transition hover:border-ink/45"
          >
            <FullscreenGlyph active={isFullscreen} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
      aria-hidden
    >
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FullscreenGlyph({ active }: { active: boolean }) {
  return active ? (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M4.5 0.5V4.5H0.5M7.5 0.5V4.5H11.5M0.5 7.5H4.5V11.5M11.5 7.5H7.5V11.5"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M0.5 4V0.5H4M8 0.5H11.5V4M11.5 8V11.5H8M4 11.5H0.5V8"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
