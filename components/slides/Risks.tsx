"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import type { Severity } from "@/lib/customize";

function sevDot(s: Severity) {
  if (s === "High") return "bg-terracotta-300";
  if (s === "Med") return "bg-ink/45";
  return "bg-sage";
}

export function RisksSlide() {
  return (
    <Slide label="Risks">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.risks;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="10"
            kicker={data.kicker}
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div data-anim className="mt-12 border border-ink/15 bg-cream-50/60">
          <div className="grid grid-cols-[1.6fr_120px_120px_1.6fr_140px] border-b border-ink/12 text-[14px] uppercase tracking-[0.22em] text-ink/55">
            <div className="px-5 py-3">{data.columnHeaders.risk}</div>
            <div className="border-l border-ink/10 px-5 py-3">{data.columnHeaders.likelihood}</div>
            <div className="border-l border-ink/10 px-5 py-3">{data.columnHeaders.impact}</div>
            <div className="border-l border-ink/10 px-5 py-3">{data.columnHeaders.mitigation}</div>
            <div className="border-l border-ink/10 px-5 py-3">{data.columnHeaders.owner}</div>
          </div>

          {data.items.map((r) => (
            <div
              key={r.risk}
              data-anim
              className="grid grid-cols-[1.6fr_120px_120px_1.6fr_140px] border-b border-ink/8 last:border-b-0"
            >
              <div className="px-5 py-4 text-[18px] text-ink">{r.risk}</div>
              <div className="flex items-center gap-2 border-l border-ink/8 px-5 py-4 text-[17px] text-ink/75">
                <span data-pop className={`inline-block h-2 w-2 rounded-full ${sevDot(r.likelihood)}`} />
                {r.likelihood}
              </div>
              <div className="flex items-center gap-2 border-l border-ink/8 px-5 py-4 text-[17px] text-ink/75">
                <span data-pop className={`inline-block h-2 w-2 rounded-full ${sevDot(r.impact)}`} />
                {r.impact}
              </div>
              <div className="border-l border-ink/8 px-5 py-4 text-[17px] leading-snug text-ink/75">{r.mitigation}</div>
              <div className="border-l border-ink/8 px-5 py-4 text-[17px] text-ink/65">{r.owner}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideFit>
  );
}
