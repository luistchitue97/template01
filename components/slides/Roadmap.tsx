"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import type { BarTone } from "@/lib/customize";

const BAR_CLASSES: Record<BarTone, string> = {
  committed:   "h-7 rounded-full bg-terracotta-300/90 px-3.5 py-1 text-[15px] tracking-wide text-cream-50 leading-tight",
  "in-flight": "h-7 rounded-full bg-ink/85 px-3.5 py-1 text-[15px] tracking-wide text-cream-50 leading-tight",
  exploratory: "h-7 rounded-full border border-ink/30 bg-cream-50 px-3.5 py-1 text-[15px] tracking-wide text-ink leading-tight",
};

export function RoadmapSlide() {
  return (
    <Slide label="Roadmap">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.roadmap;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="07"
            kicker="FY26 Roadmap"
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div data-anim className="mt-12 border border-ink/15 bg-cream-50/60">
          <div className="grid grid-cols-[140px_repeat(4,1fr)] border-b border-ink/12 text-[14px] uppercase tracking-[0.22em] text-ink/55">
            <div className="px-4 py-3">Pillar</div>
            {["Q1", "Q2", "Q3", "Q4"].map((q) => (
              <div key={q} className="border-l border-ink/10 px-4 py-3 tnum">{q}</div>
            ))}
          </div>

          {data.lanes.map((lane) => {
            const laneBars = data.bars.filter((b) => b.laneRoman === lane.roman);
            return (
              <div
                key={lane.roman}
                className="grid grid-cols-[140px_repeat(4,1fr)] border-b border-ink/10 last:border-b-0"
              >
                <div className="flex items-center gap-3 px-4 py-6">
                  <span data-pop className="display text-terracotta-300 text-[24px]">{lane.roman}</span>
                  <span className="text-[17px] text-ink/80">{lane.name}</span>
                </div>

                <div className="relative col-span-4 py-3">
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="border-l border-ink/8 first:border-l-0" />
                    ))}
                  </div>

                  {laneBars.map((bar) => (
                    <div
                      key={bar.label}
                      className="relative mx-2 my-1.5 h-7"
                      style={{
                        marginLeft: `calc(${(bar.start / 4) * 100}% + 8px)`,
                        width: `calc(${(bar.span / 4) * 100}% - 16px)`,
                      }}
                    >
                      <div data-grow-x className={BAR_CLASSES[bar.tone]}>
                        <div className="flex h-full items-center truncate">{bar.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div data-anim className="mt-5 flex items-center gap-6 text-[14px] uppercase tracking-[0.22em] text-ink/50">
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 rounded-full bg-terracotta-300/90" /> Committed</span>
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 rounded-full bg-ink/85" /> In-flight</span>
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 rounded-full border border-ink/30 bg-cream-50" /> Exploratory</span>
        </div>
      </div>
    </SlideFit>
  );
}
