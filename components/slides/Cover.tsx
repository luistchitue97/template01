"use client";

import { Slide, SlideFit, useSlideIntro } from "@/components/deck";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedWord } from "@/components/ui/MaskedWord";

export function CoverSlide() {
  return (
    <Slide label="Cover">
      <SlideContent />
    </Slide>
  );
}

function Words({ text, accent }: { text: string; accent?: boolean }) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    <span className="flex flex-wrap gap-x-[0.25em]">
      {words.map((w, i) => (
        <MaskedWord key={`${w}-${i}`} innerClassName={accent ? "text-terracotta-300" : undefined}>
          {w}
        </MaskedWord>
      ))}
    </span>
  );
}

function SlideContent() {
  const { config } = useCustomize();
  const { identity } = config;
  const root = useSlideIntro<HTMLDivElement>();

  return (
    <SlideFit>
      <div ref={root} className="w-[1280px] max-w-[88vw]">
        <div className="flex items-center justify-between">
          <span data-anim className="display text-terracotta-300 text-[calc(22px*var(--scale-label))] tnum">No. 01</span>
          <Eyebrow accent>
            <span data-anim>{identity.planTitle}</span>
          </Eyebrow>
        </div>

        <div className="mt-24 flex flex-col gap-6">
          <span data-anim className="text-[calc(15px*var(--scale-label))] uppercase tracking-[0.32em] text-ink/60">
            {identity.companyName}
            {identity.coverContextLabel ? ` · ${identity.coverContextLabel}` : ""}
          </span>

          <h1 className="display text-[calc(148px*var(--scale-display))] leading-[0.88] tracking-tightest-display text-ink">
            <Words text={identity.heroLineA} />
            <span className="flex flex-wrap items-baseline gap-x-[0.25em]">
              <Words text={identity.heroLineB} accent />
              <span
                data-pulse
                className="ml-3 inline-block h-3 w-3 translate-y-[-0.4em] rounded-full bg-terracotta-300"
                aria-hidden
              />
            </span>
          </h1>

          <p
            data-anim
            className="mt-2 max-w-[58ch] text-[calc(24px*var(--scale-subtitle))] leading-snug text-ink/70"
          >
            {identity.heroLede}
          </p>
        </div>

        <div className="mt-20">
          <div data-draw className="mb-6 h-px w-full bg-ink/15" />
          <div className="grid grid-cols-3 gap-12 text-[calc(14px*var(--scale-label))] uppercase tracking-[0.22em] text-ink/50">
            <div data-anim>
              <div className="mb-1 text-ink/35">{identity.metaPresentedByLabel}</div>
              <div className="text-ink/85 normal-case tracking-normal text-[calc(18px*var(--scale-body))]">
                {identity.presenter}{identity.presenterRole ? `, ${identity.presenterRole}` : ""}
              </div>
            </div>
            <div data-anim>
              <div className="mb-1 text-ink/35">{identity.metaForLabel}</div>
              <div className="text-ink/85 normal-case tracking-normal text-[calc(18px*var(--scale-body))]">
                {identity.boardName} · {identity.planPeriod}
              </div>
            </div>
            <div data-anim>
              <div className="mb-1 text-ink/35">{identity.metaDateLabel}</div>
              <div className="text-ink/85 normal-case tracking-normal text-[calc(18px*var(--scale-body))]">
                {identity.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFit>
  );
}
