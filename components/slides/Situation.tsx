"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import type { QuadrantTone } from "@/lib/customize";

const TONE_DOT: Record<QuadrantTone, string> = {
  sage: "inline-block h-2 w-2 rounded-full bg-sage",
  terracotta: "inline-block h-2 w-2 rounded-full bg-terracotta-300",
  ink: "inline-block h-2 w-2 rounded-full bg-ink/40",
};

export function SituationSlide() {
  return (
    <Slide label="Where We Stand">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.situation;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="03"
            kicker={data.kicker}
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8">
          {data.quadrants.map((q) => (
            <div key={q.label} className="pt-5">
              <div data-draw className="mb-5 h-px w-full bg-ink/15" />
              <div className="flex items-baseline gap-3">
                <span data-pop className={TONE_DOT[q.tone]} />
                <h3 data-anim className="display text-[30px] text-ink">{q.label}</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {q.items.map((item) => (
                  <li
                    key={item}
                    data-anim
                    className="flex gap-3 text-[19px] leading-snug text-ink/75"
                  >
                    <span className="mt-2 inline-block h-px w-4 shrink-0 bg-ink/30" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SlideFit>
  );
}
