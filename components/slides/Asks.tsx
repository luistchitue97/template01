"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedWord } from "@/components/ui/MaskedWord";

export function AsksSlide() {
  return (
    <Slide label="Asks & Next Steps">
      <SlideContent />
    </Slide>
  );
}

function Words({ text, accent }: { text: string; accent?: boolean }) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    <span className="flex flex-wrap gap-x-[0.25em]">
      {words.map((w, i) => (
        <MaskedWord key={`${w}-${i}`} innerClassName={accent ? "text-ink/45" : undefined}>
          {w}
        </MaskedWord>
      ))}
    </span>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const { config } = useCustomize();
  const data = config.slides.asks;
  const callback = [config.identity.heroLineA, config.identity.heroLineB]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div className="flex items-baseline justify-between">
          <span data-anim className="display text-terracotta-300 text-[18px] tnum">No. 12</span>
          <Eyebrow accent>
            <span data-anim>What we need from you</span>
          </Eyebrow>
        </div>

        <h2 className="mt-14 display text-[112px] leading-[0.92] tracking-tightest-display text-ink">
          <Words text={`${data.asks.length === 1 ? "One ask." : `${spellOut(data.asks.length)} asks.`}`} />
          <Words text="No surprises." accent />
        </h2>

        <div
          className="mt-16 grid gap-10"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, data.asks.length)}, minmax(0, 1fr))` }}
        >
          {data.asks.map((a) => (
            <article key={a.n} className="pt-6">
              <div data-grow-x className="mb-6 h-[2px] w-full bg-terracotta-300" />
              <div data-pop className="display text-terracotta-300 text-[36px] leading-none tnum">{a.n}</div>
              <h3 data-anim className="mt-4 display text-[24px] leading-tight text-ink">{a.title}</h3>
              <p data-anim className="mt-4 text-[14.5px] leading-relaxed text-ink/70">{a.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 pt-6">
          <div data-draw className="mb-6 h-px w-full bg-ink/15" />
          <div className="flex items-center justify-between">
            <p data-anim className="display text-[20px] text-ink/65">
              <em>&ldquo;{callback}&rdquo;</em> — see slide 01.
            </p>
            <span data-anim className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
              {data.closingNote}
            </span>
          </div>
        </div>
      </div>
    </SlideFit>
  );
}

const SPELL: Record<number, string> = { 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight" };
function spellOut(n: number) {
  return SPELL[n] ?? String(n);
}
