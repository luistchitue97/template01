"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import { Stat } from "@/components/ui/Stat";

export function ExecutiveSummarySlide() {
  return (
    <Slide label="Executive Summary">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.executiveSummary;

  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="02"
            kicker="Executive Summary"
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div className="mt-16">
          <div data-draw className="h-px w-full bg-ink/15" />
          <div
            className="grid gap-10 pt-10"
            style={{ gridTemplateColumns: `repeat(${Math.max(1, data.stats.length)}, minmax(0, 1fr))` }}
          >
            {data.stats.map((s) => (
              <Stat
                key={s.label}
                label={s.label}
                value={s.value}
                count={s.count}
                delta={s.delta}
                deltaTone={s.deltaTone}
              />
            ))}
          </div>
        </div>

        <div
          className="mt-12 grid gap-10"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, data.blurbs.length)}, minmax(0, 1fr))` }}
        >
          {data.blurbs.map((b) => (
            <div key={b.heading} className="relative pl-5">
              <span data-grow-y className="absolute left-0 top-0 h-full w-px bg-ink/15" />
              <div data-anim className="display text-[22px] text-ink">{b.heading}</div>
              <p data-anim className="mt-2 text-[18px] leading-relaxed text-ink/65">{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFit>
  );
}
