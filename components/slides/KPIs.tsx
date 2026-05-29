"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import type { Tone } from "@/lib/customize";

function Spark({ series, tone }: { series: number[]; tone: Tone }) {
  const w = 110;
  const h = 32;
  if (series.length < 2) {
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} />;
  }
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const pts = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const stroke = tone === "up" ? "#C75D3E" : tone === "down" ? "#5B524A" : "#1A1612";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        data-path
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

export function KPIsSlide() {
  return (
    <Slide label="KPIs">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.kpis;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="11"
            kicker="KPIs"
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div className="mt-12 grid grid-cols-4 gap-px bg-ink/12">
          {data.items.map((k) => (
            <div
              key={k.label}
              data-anim
              className="flex flex-col gap-3 bg-cream-50 p-6"
            >
              <span className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">{k.label}</span>
              <div className="flex items-baseline justify-between">
                <span
                  className="display text-[40px] leading-none text-ink tnum"
                  data-count={String(k.count.to)}
                  data-prefix={k.count.prefix ?? ""}
                  data-suffix={k.count.suffix ?? ""}
                  data-decimals={String(k.count.decimals ?? 0)}
                >
                  {k.value}
                </span>
                <span className="text-[11px] tnum text-terracotta-300">{k.target}</span>
              </div>
              <Spark series={k.series} tone={k.tone} />
            </div>
          ))}
        </div>
      </div>
    </SlideFit>
  );
}
