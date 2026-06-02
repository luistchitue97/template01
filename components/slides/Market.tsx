"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SlideHeader } from "@/components/ui/SlideHeader";
import type { CountSpec } from "@/lib/customize";

export function MarketSlide() {
  return (
    <Slide label="The Market">
      <SlideContent />
    </Slide>
  );
}

function formatCount(c: CountSpec) {
  return `${c.prefix ?? ""}${c.to.toFixed(c.decimals ?? 0)}${c.suffix ?? ""}`;
}

function SlideContent() {
  const root = useSlideIntro<HTMLDivElement>();
  const data = useCustomize().config.slides.market;

  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div data-anim>
          <SlideHeader
            number="04"
            kicker={data.kicker}
            title={data.title}
            subtitle={data.subtitle}
          />
        </div>

        <div className="mt-12 grid grid-cols-[1.1fr_0.9fr] gap-10">
          <div data-anim className="relative aspect-[4/3] border border-ink/15 bg-cream-50">
            <div className="pointer-events-none absolute inset-0">
              <div data-grow-y className="absolute left-1/2 top-0 h-full w-px bg-ink/10" style={{ transformOrigin: "top center" }} />
              <div data-grow-x className="absolute left-0 top-1/2 h-px w-full bg-ink/10" />
              <span className="absolute left-3 top-3 text-[13px] uppercase tracking-[0.22em] text-ink/45">{data.axisLabels.top}</span>
              <span className="absolute left-3 bottom-3 text-[13px] uppercase tracking-[0.22em] text-ink/45">{data.axisLabels.bottom}</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] uppercase tracking-[0.22em] text-ink/45">{data.axisLabels.right}</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] uppercase tracking-[0.22em] text-ink/45">{data.axisLabels.left}</span>
            </div>
            {data.players.map((p) => (
              <div
                key={p.name}
                className="absolute"
                style={{
                  left: `${p.x * 100}%`,
                  top: `${(1 - p.y) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  data-pop
                  className={p.self ? "rounded-full bg-terracotta-300" : "rounded-full bg-ink/15"}
                  style={{
                    width: p.size,
                    height: p.size,
                    boxShadow: p.self ? "0 0 0 8px rgba(199,93,62,0.10)" : undefined,
                  }}
                />
                {p.self ? (
                  <div
                    data-pulse
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta-300/30"
                    style={{ width: p.size * 2.2, height: p.size * 2.2 }}
                    aria-hidden
                  />
                ) : null}
                <div
                  data-anim
                  className={p.self ? "mt-2 whitespace-nowrap text-[15px] text-ink" : "mt-2 whitespace-nowrap text-[14px] text-ink/55"}
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-7">
            {([data.tam, data.growth] as const).map((s, idx) => (
              <div key={s.label} className={idx === 0 ? undefined : "pt-5"}>
                {idx > 0 ? <div data-draw className="mb-5 h-px w-full bg-ink/10" /> : null}
                <div
                  data-count={String(s.count.to)}
                  data-prefix={s.count.prefix ?? ""}
                  data-suffix={s.count.suffix ?? ""}
                  data-decimals={String(s.count.decimals ?? 0)}
                  className="display text-[44px] leading-none text-ink tnum"
                >
                  {formatCount(s.count)}
                </div>
                <div data-anim className="mt-1 text-[15px] uppercase tracking-[0.22em] text-ink/55">{s.label}</div>
                <p data-anim className="mt-3 text-[18px] leading-relaxed text-ink/70">{s.body}</p>
              </div>
            ))}
            <div className="pt-5">
              <div data-draw className="mb-5 h-px w-full bg-ink/10" />
              <p data-anim className="text-[18px] leading-relaxed text-ink/70">{data.opening}</p>
            </div>
          </div>
        </div>
      </div>
    </SlideFit>
  );
}
