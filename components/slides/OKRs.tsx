"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";

export function OKRsSlide() {
  return (
    <Slide label="OKRs">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.okrs;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="06"
            kicker="Objectives & Key Results"
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div
          className="mt-14 grid gap-8"
          style={{ gridTemplateColumns: `repeat(${Math.max(1, data.objectives.length)}, minmax(0, 1fr))` }}
        >
          {data.objectives.map((o) => (
            <article
              key={o.pillar}
              data-anim
              className="flex flex-col border border-ink/12 bg-cream-50/60 p-6"
            >
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-ink/55">
                <span>
                  <span className="text-terracotta-300">{o.pillarRoman}</span> · {o.pillar}
                </span>
                <span className="text-ink/45 normal-case tracking-normal text-[11px]">{o.owner}</span>
              </div>
              <h3 className="mt-5 display text-[24px] leading-tight text-ink">{o.objective}</h3>

              <div className="relative mt-6 pt-5">
                <span data-draw className="absolute left-0 right-0 top-0 h-px bg-ink/10" />
                <dl className="space-y-4">
                  {o.krs.map((kr, i) => (
                    <div key={kr.text} className="flex items-baseline gap-4">
                      <dt data-pop className="display text-terracotta-300 text-[15px] tnum w-6">
                        KR{i + 1}
                      </dt>
                      <div className="flex-1">
                        <div className="text-[13.5px] leading-snug text-ink/85">{kr.text}</div>
                        <div className="mt-1 text-[12px] tnum text-ink/55">{kr.target}</div>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SlideFit>
  );
}
