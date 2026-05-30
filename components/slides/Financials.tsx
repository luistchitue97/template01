"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import type { Financials } from "@/lib/customize";

export function FinancialsSlide() {
  return (
    <Slide label="Financial Plan">
      <SlideContent />
    </Slide>
  );
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.financials;
  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="08"
            kicker="Financial Plan"
            title={data.title}
            titleAccent={data.titleAccent}
            subtitle={data.subtitle}
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6">
          <BarChartCard data={data} />
          <LineChartCard data={data} />
        </div>

        <CompactPL data={data} />
      </div>
    </SlideFit>
  );
}

function BarChartCard({ data }: { data: Financials }) {
  const max = Math.max(...data.revenue, 1);
  return (
    <div data-anim className="relative border border-ink/15 bg-cream-50/60 p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55">Quarterly revenue &amp; cost</span>
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/45 tnum">$M</span>
      </div>

      <div className="relative mt-5 flex h-[220px] items-end gap-2">
        <div
          data-grow-y
          className="pointer-events-none absolute bottom-0 top-0 w-px bg-ink/20"
          style={{ left: `calc(${(data.planStart / data.quarters.length) * 100}% - 0.5px)`, transformOrigin: "bottom center" }}
          aria-hidden
        />
        {data.quarters.map((q, i) => {
          const rev = data.revenue[i] ?? 0;
          const cost = data.costs[i] ?? 0;
          const isPlan = i >= data.planStart;
          return (
            <div key={`${q}-${i}`} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative flex h-full w-full items-end justify-center gap-1">
                <div
                  data-grow-y
                  className={isPlan ? "w-[42%] bg-terracotta-300" : "w-[42%] bg-ink/75"}
                  style={{ height: `${(rev / max) * 100}%`, transformOrigin: "bottom center" }}
                />
                <div
                  data-grow-y
                  className="w-[42%] bg-ink/15"
                  style={{ height: `${(cost / max) * 100}%`, transformOrigin: "bottom center" }}
                />
              </div>
              <span className="text-[9.5px] tnum text-ink/55">{q}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-ink/55">
        <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 bg-ink/75" /> Actual rev.</span>
        <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 bg-terracotta-300" /> Plan rev.</span>
        <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 bg-ink/15" /> Cost</span>
      </div>
    </div>
  );
}

function LineChartCard({ data }: { data: Financials }) {
  const W = 480;
  const H = 220;
  const padL = 32;
  const padR = 14;
  const padT = 14;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const yMin = -15;
  const yMax = 85;

  const xAt = (i: number) =>
    data.quarters.length <= 1 ? padL : padL + (i / (data.quarters.length - 1)) * innerW;
  const yAt = (v: number) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  const pathFor = (vals: number[]) =>
    vals
      .map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`)
      .join(" ");

  const gridYs = [0, 25, 50, 75];
  const planDividerX = xAt(Math.max(0, data.planStart - 0.5));
  const lastGm = data.gmSeries[data.gmSeries.length - 1] ?? 0;
  const lastFcf = data.fcfSeries[data.fcfSeries.length - 1] ?? 0;

  return (
    <div data-anim className="relative border border-ink/15 bg-cream-50/60 p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/55">Margin trajectory</span>
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink/45 tnum">%</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-5 w-full overflow-visible text-ink"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        {gridYs.map((v) => (
          <line key={v} x1={padL} x2={W - padR} y1={yAt(v)} y2={yAt(v)} stroke="currentColor" strokeOpacity="0.08" />
        ))}
        <line x1={padL} x2={W - padR} y1={yAt(0)} y2={yAt(0)} stroke="currentColor" strokeOpacity="0.28" />
        <line x1={planDividerX} x2={planDividerX} y1={padT} y2={H - padB} stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 4" />
        <text x={planDividerX + 4} y={padT + 10} fontSize="9" fill="currentColor" fillOpacity="0.45" style={{ letterSpacing: "0.18em" }}>
          PLAN →
        </text>

        <path data-path d={pathFor(data.gmSeries)}  fill="none" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "rgb(var(--accent-rgb))" }} />
        <path data-path d={pathFor(data.fcfSeries)} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "rgb(var(--ink-rgb) / 0.85)" }} />

        <circle cx={xAt(data.quarters.length - 1)} cy={yAt(lastGm)}  r="3" style={{ fill: "rgb(var(--accent-rgb))" }} />
        <circle cx={xAt(data.quarters.length - 1)} cy={yAt(lastFcf)} r="3" style={{ fill: "rgb(var(--ink-rgb))" }} />

        {data.quarters.map((q, i) => (
          <text key={`${q}-${i}`} x={xAt(i)} y={H - 8} fontSize="9.5" textAnchor="middle" fill="currentColor" fillOpacity="0.55" className="tnum">
            {q}
          </text>
        ))}
        {gridYs.map((v) => (
          <text key={v} x={padL - 6} y={yAt(v) + 3} fontSize="9.5" textAnchor="end" fill="currentColor" fillOpacity="0.55" className="tnum">
            {v}
          </text>
        ))}
      </svg>

      <div className="mt-1 flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-ink/55">
        <span className="flex items-center gap-2"><span className="inline-block h-[2px] w-4 bg-terracotta-300" /> Gross margin</span>
        <span className="flex items-center gap-2"><span className="inline-block h-[2px] w-4 bg-ink/85" /> FCF margin</span>
      </div>
    </div>
  );
}

function CompactPL({ data }: { data: Financials }) {
  return (
    <div className="mt-8">
      <div data-draw className="mb-4 h-px w-full bg-ink/15" />
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, data.plRows.length)}, minmax(0, 1fr))` }}
      >
        {data.plRows.map((r) => (
          <div key={r.label} data-anim className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink/55">{r.label}</span>
            <div className="flex items-baseline gap-2 tnum">
              <span className="text-[11px] text-ink/45">{r.fy25}</span>
              <span className="text-[12px] text-ink/30">→</span>
              <span className="display text-[20px] leading-none text-ink">{r.fy26}</span>
            </div>
            <span className="text-[10.5px] tnum text-terracotta-300">{r.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
