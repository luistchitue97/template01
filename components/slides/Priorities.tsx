"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";

export function PrioritiesSlide() {
  return (
    <Slide label="Strategic Priorities">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.priorities;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="05"
            kicker={data.kicker}
            title={data.title}
            titleAccent={data.titleAccent}
            subtitle={data.subtitle}
          />
        </div>

        <div
          className="mt-14 grid gap-10"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, data.pillars.length)}, minmax(0, 1fr))` }}
        >
          {data.pillars.map((p) => (
            <article key={p.name} className="pt-6">
              <div data-draw className="mb-6 h-px w-full bg-ink/15" />
              <div className="flex items-baseline justify-between">
                <span data-pop className="display text-terracotta-300 text-[64px] leading-none">{p.roman}</span>
                <span data-anim className="text-[14px] uppercase tracking-[0.22em] text-ink/45">{data.pillarTag}</span>
              </div>
              <h3 data-anim className="mt-4 display text-[34px] leading-none text-ink">{p.name}.</h3>
              <p data-anim className="mt-3 text-[20px] leading-snug text-ink/65">{p.promise}</p>
              <p data-anim className="mt-5 text-[18px] leading-relaxed text-ink/70">{p.body}</p>
              <ul className="mt-6 space-y-1.5 text-[20px] tnum text-ink/75">
                {p.metrics.map((m) => (
                  <li key={m} className="flex items-center gap-3">
                    <span data-grow-x className="inline-block h-px w-3 bg-terracotta-300" />
                    <span data-anim>{m}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </SlideFit>
  );
}
