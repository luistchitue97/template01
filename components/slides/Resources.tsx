"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";

export function ResourcesSlide() {
  return (
    <Slide label="Resourcing">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.resources;
  const maxHc = Math.max(...data.headcount.map((h) => h.current + h.add), 1);
  const totalCurrent = data.headcount.reduce((s, h) => s + h.current, 0);
  const totalNew = data.headcount.reduce((s, h) => s + h.current + h.add, 0);

  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="09"
            kicker="Resourcing the Plan"
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div className="mt-12 grid grid-cols-[1.2fr_0.8fr] gap-12">
          {/* Headcount */}
          <div>
            <div data-anim className="flex items-baseline justify-between">
              <span className="text-[14px] uppercase tracking-[0.22em] text-ink/55">Headcount by function</span>
              <span className="text-[14px] uppercase tracking-[0.22em] text-ink/45 tnum">{totalCurrent} → {totalNew}</span>
            </div>

            <div className="mt-6 space-y-4">
              {data.headcount.map((h) => {
                const total = h.current + h.add;
                return (
                  <div key={h.fn}>
                    <div data-anim className="flex items-baseline justify-between text-[17px]">
                      <span className="text-ink/85">{h.fn}</span>
                      <span className="tnum text-ink/55">
                        {h.current} <span className="text-terracotta-300">+{h.add}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-ink/8">
                      <div
                        data-grow-x
                        className="relative h-2 rounded-full"
                        style={{ width: `${(total / maxHc) * 100}%`, transformOrigin: "left center" }}
                      >
                        <div className="absolute inset-y-0 left-0 rounded-full bg-ink/80"
                          style={{ width: `${total > 0 ? (h.current / total) * 100 : 0}%` }} />
                        <div className="absolute inset-y-0 right-0 rounded-full bg-terracotta-300"
                          style={{ width: `${total > 0 ? (h.add / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div data-anim className="flex items-baseline justify-between">
              <span className="text-[14px] uppercase tracking-[0.22em] text-ink/55">FY26 budget — {data.budgetTotal}</span>
            </div>

            <div className="mt-6 flex h-10 w-full overflow-hidden rounded-full border border-ink/10">
              {data.budget.map((b) => (
                <div
                  key={b.label}
                  data-grow-x
                  className={b.color}
                  style={{ width: `${b.pct}%`, transformOrigin: "left center" }}
                  title={`${b.label} · ${b.pct}%`}
                />
              ))}
            </div>

            <ul className="mt-5 space-y-2.5 text-[17px]">
              {data.budget.map((b) => (
                <li key={b.label} data-anim className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-ink/85">
                    <span data-pop className={`inline-block h-2 w-3 rounded-sm ${b.color}`} />
                    {b.label}
                  </span>
                  <span className="tnum text-ink/55">{b.pct}%</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4">
              <div data-draw className="mb-4 h-px w-full bg-ink/10" />
              <p data-anim className="text-[17px] leading-relaxed text-ink/65">{data.note}</p>
            </div>
          </div>
        </div>
      </div>
    </SlideFit>
  );
}
