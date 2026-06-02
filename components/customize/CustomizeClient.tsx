"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCustomize } from "@/components/customize/CustomizeProvider";
import { SaveIndicator } from "@/components/customize/SaveIndicator";
import {
  AsksEditor,
  ExecutiveSummaryEditor,
  FinancialsEditor,
  KPIsEditor,
  MarketEditor,
  OKRsEditor,
  PrioritiesEditor,
  ResourcesEditor,
  RisksEditor,
  RoadmapEditor,
  SituationEditor,
} from "@/components/customize/SlideEditors";
import {
  Row,
  ScaleField,
  Section,
  TextArea,
  TextField,
} from "@/components/customize/widgets";
import {
  ACCENT_PRESETS,
  BACKGROUND_TONES,
  DISPLAY_FONTS,
  SANS_FONTS,
  TYPOGRAPHY_BOUNDS,
  type BackgroundToneId,
  type DisplayFontId,
  type IdentityConfig,
  type SansFontId,
  type TypographyConfig,
  hexToRgbTriplet,
  rgbTripletToHex,
} from "@/lib/customize";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";

const NAV: { id: string; label: string }[] = [
  { id: "theme",       label: "Theme" },
  { id: "typography",  label: "Typography" },
  { id: "identity",    label: "Identity" },
  { id: "hero",        label: "Cover hero" },
  { id: "nav",         label: "Deck navigation" },
  { id: "exec",        label: "02 · Exec summary" },
  { id: "situation",   label: "03 · Where we stand" },
  { id: "market",      label: "04 · Market" },
  { id: "priorities",  label: "05 · Priorities" },
  { id: "okrs",        label: "06 · OKRs" },
  { id: "roadmap",     label: "07 · Roadmap" },
  { id: "financials",  label: "08 · Financials" },
  { id: "resources",   label: "09 · Resources" },
  { id: "risks",       label: "10 · Risks" },
  { id: "kpis",        label: "11 · KPIs" },
  { id: "asks",        label: "12 · Asks" },
];

function SlideVisibilityGrid({
  labels,
  hiddenSlideIndexes,
  onChange,
}: {
  labels: string[];
  hiddenSlideIndexes: number[];
  onChange: (next: number[]) => void;
}) {
  const hiddenSet = new Set(hiddenSlideIndexes);
  const visibleCount = labels.length - hiddenSet.size;
  const toggle = (i: number) => {
    const next = new Set(hiddenSet);
    if (next.has(i)) {
      next.delete(i);
    } else {
      // Refuse to hide the last visible slide — an empty deck is a dead end.
      if (visibleCount <= 1) return;
      next.add(i);
    }
    onChange(Array.from(next).sort((a, b) => a - b));
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {labels.map((label, i) => {
          const visible = !hiddenSet.has(i);
          const disabled = visible && visibleCount <= 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              disabled={disabled}
              aria-pressed={visible}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2 text-left transition",
                visible
                  ? "border-ink/20 bg-cream-50/60 text-ink hover:border-ink/45"
                  : "border-dashed border-ink/15 bg-transparent text-ink/40 hover:border-ink/35 hover:text-ink/65",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid h-4 w-4 shrink-0 place-items-center rounded-sm border transition",
                  visible
                    ? "border-terracotta-300 bg-terracotta-300 text-cream"
                    : "border-ink/25 bg-transparent text-transparent",
                )}
              >
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                  <path d="M1.5 5.2 L4 7.5 L8.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="w-7 shrink-0 text-[10.5px] uppercase tracking-[0.22em] text-ink/45 tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-[13px]">{label}</span>
              {!visible ? (
                <span className="text-[10px] uppercase tracking-[0.22em] text-ink/35">Hidden</span>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="text-[10.5px] leading-snug text-ink/45">
        {visibleCount} of {labels.length} slides visible. At least one slide must stay visible.
      </p>
    </div>
  );
}

function NavLabelsGrid({
  labels,
  onChange,
}: {
  labels: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {labels.map((label, i) => (
        <div key={i} className="flex items-baseline gap-3">
          <span className="w-7 shrink-0 text-[10.5px] uppercase tracking-[0.22em] text-ink/45 tnum">
            {String(i + 1).padStart(2, "0")}
          </span>
          <TextField
            value={label}
            onChange={(v) => {
              const next = [...labels];
              next[i] = v;
              onChange(next);
            }}
            placeholder={`Slide ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}

export function CustomizeClient() {
  const { config, update, reset, serverBacked } = useCustomize();
  const { theme, identity, typography } = config;

  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[220px_1fr] gap-10 px-8 pb-32 pt-12">
      <SidebarNav />

      <main className="min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-ink/55 transition hover:text-ink"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            Back to deck
          </Link>
          <div className="flex items-center gap-6">
            <SaveIndicator />
            <Eyebrow accent>Customize</Eyebrow>
          </div>
        </div>

        {/* Hero */}
        <header className="mt-14 max-w-[44ch]">
          <h1 className="display text-[72px] leading-[0.95] tracking-tightest-display text-ink">
            Make this deck <span className="text-terracotta-300">yours.</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/70">
            Tune the theme, identity, and every slide. {serverBacked
              ? "Changes sync to your account and follow you across devices."
              : "Changes save to this browser only."}{" "}
            Apply immediately when you go back to the deck.
          </p>
        </header>

        <PreviewCard />

        {/* Theme */}
        <Section id="theme" number="01" title="Theme">
          <Row label="Accent color">
            <AccentPicker
              value={theme.accentRgb}
              onChange={(rgb) => update({ theme: { accentRgb: rgb } })}
            />
          </Row>
          <Row label="Background">
            <ToneGroup
              value={theme.backgroundTone}
              onChange={(tone) => update({ theme: { backgroundTone: tone } })}
            />
          </Row>
          <Row label="Display font">
            <FontGroup
              kind="display"
              value={theme.displayFont}
              onChange={(f) => update({ theme: { displayFont: f as DisplayFontId } })}
            />
          </Row>
          <Row label="Sans font">
            <FontGroup
              kind="sans"
              value={theme.sansFont}
              onChange={(f) => update({ theme: { sansFont: f as SansFontId } })}
            />
          </Row>
        </Section>

        {/* Typography */}
        <Section id="typography" number="02" title="Typography">
          <TypographyScales
            value={typography}
            onChange={(patch) => update({ typography: patch })}
          />
        </Section>

        {/* Identity */}
        <Section id="identity" number="03" title="Identity">
          <IdentityFields
            value={identity}
            onChange={(patch) => update({ identity: patch })}
          />
        </Section>

        {/* Cover hero */}
        <Section id="hero" number="04" title="Cover hero">
          <Row label="Line 1">
            <TextField
              value={identity.heroLineA}
              onChange={(v) => update({ identity: { heroLineA: v } })}
              placeholder="A quiet year"
            />
          </Row>
          <Row label="Line 2" hint="Rendered in the accent color.">
            <TextField
              value={identity.heroLineB}
              onChange={(v) => update({ identity: { heroLineB: v } })}
              placeholder="of compounding."
            />
          </Row>
          <Row label="Lede paragraph" hint="The summary paragraph beneath the hero lines.">
            <TextArea
              value={identity.heroLede}
              onChange={(v) => update({ identity: { heroLede: v } })}
              rows={4}
              placeholder="FY26 is a year for getting boring things right…"
            />
          </Row>
        </Section>

        {/* Deck navigation */}
        <Section id="nav" number="05" title="Deck navigation">
          <Row label="Visible slides" hint="Uncheck a slide to omit it from the rendered deck. The dot navigator and counter update automatically.">
            <SlideVisibilityGrid
              labels={config.slides.navLabels}
              hiddenSlideIndexes={config.slides.hiddenSlideIndexes}
              onChange={(hiddenSlideIndexes) => update({ slides: { hiddenSlideIndexes } })}
            />
          </Row>
          <Row label="Slide labels" hint="Shown in the bottom-left of every slide and as dot-navigator tooltips. One per slide, in deck order.">
            <NavLabelsGrid
              labels={config.slides.navLabels}
              onChange={(navLabels) => update({ slides: { navLabels } })}
            />
          </Row>
        </Section>

        {/* Per-slide editors */}
        <ExecutiveSummaryEditor />
        <SituationEditor />
        <MarketEditor />
        <PrioritiesEditor />
        <OKRsEditor />
        <RoadmapEditor />
        <FinancialsEditor />
        <ResourcesEditor />
        <RisksEditor />
        <KPIsEditor />
        <AsksEditor />

        {/* Footer */}
        <footer className="mt-20 flex items-center justify-between border-t border-ink/15 pt-6">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.confirm("Reset all customizations to defaults?")) {
                reset();
              }
            }}
            className="text-[12px] uppercase tracking-[0.22em] text-ink/55 underline-offset-4 transition hover:text-terracotta-300 hover:underline"
          >
            Reset to defaults
          </button>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-cream transition hover:bg-terracotta-300"
          >
            View deck
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </footer>
      </main>
    </div>
  );
}

// ── Sidebar nav ───────────────────────────────────────────────────────────

function SidebarNav() {
  return (
    <aside className="sticky top-12 self-start">
      <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Sections</div>
      <nav className="mt-4 space-y-1 border-l border-ink/15 pl-4">
        {NAV.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="block text-[12.5px] leading-snug text-ink/70 transition hover:text-terracotta-300"
          >
            {n.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

// ── Live preview card ─────────────────────────────────────────────────────

function PreviewCard() {
  const { config } = useCustomize();
  const { identity } = config;
  return (
    <div className="mt-12 rounded-2xl border border-ink/12 bg-cream-50/60 p-7">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-ink/55">
        <span>Live preview · Cover</span>
        <span className="text-terracotta-300">01 / 12</span>
      </div>
      <div className="mt-5">
        <div className="text-[11px] uppercase tracking-[0.28em] text-ink/55">
          {identity.companyName} · Board Review
        </div>
        <div className="mt-3 display text-[44px] leading-[0.95] tracking-tightest-display text-ink">
          {identity.heroLineA}{" "}
          <span className="text-terracotta-300">{identity.heroLineB}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-6 text-[11px] uppercase tracking-[0.22em] text-ink/50">
          <div>
            <div className="text-ink/35">Presented by</div>
            <div className="text-ink/85 normal-case tracking-normal text-[13px]">
              {identity.presenter}
              {identity.presenterRole ? `, ${identity.presenterRole}` : ""}
            </div>
          </div>
          <div>
            <div className="text-ink/35">For</div>
            <div className="text-ink/85 normal-case tracking-normal text-[13px]">
              {identity.boardName} · {identity.planPeriod}
            </div>
          </div>
          <div>
            <div className="text-ink/35">Date</div>
            <div className="text-ink/85 normal-case tracking-normal text-[13px]">{identity.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Theme widgets (kept in this file because they read from useCustomize) ─

function AccentPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [hex, setHex] = useState(() => rgbTripletToHex(value));
  const matchedPreset = useMemo(
    () => ACCENT_PRESETS.find((p) => p.rgb === value)?.id,
    [value],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {ACCENT_PRESETS.map((p) => {
          const active = matchedPreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange(p.rgb);
                setHex(rgbTripletToHex(p.rgb));
              }}
              aria-label={p.label}
              aria-current={active ? "true" : undefined}
              className={cn(
                "group relative grid h-10 w-10 place-items-center rounded-full transition",
                active ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "hover:scale-105",
              )}
              style={{ backgroundColor: `rgb(${p.rgb})` }}
            >
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10.5px] uppercase tracking-[0.18em] text-ink/55 opacity-0 transition-opacity group-hover:opacity-100">
                {p.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-[11px] uppercase tracking-[0.18em] text-ink/45">Custom</label>
        <div className="flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5">
          <input
            type="color"
            value={hex}
            onChange={(e) => {
              const next = e.target.value;
              setHex(next);
              const rgb = hexToRgbTriplet(next);
              if (rgb) onChange(rgb);
            }}
            className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0"
            style={{ appearance: "none" }}
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => {
              const next = e.target.value;
              setHex(next);
              const rgb = hexToRgbTriplet(next);
              if (rgb) onChange(rgb);
            }}
            spellCheck={false}
            className="w-[88px] bg-transparent text-[13px] tnum uppercase text-ink outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function ToneGroup({
  value,
  onChange,
}: {
  value: BackgroundToneId;
  onChange: (id: BackgroundToneId) => void;
}) {
  const ids = Object.keys(BACKGROUND_TONES) as BackgroundToneId[];
  return (
    <div className="flex flex-wrap gap-3">
      {ids.map((id) => {
        const t = BACKGROUND_TONES[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-full border px-4 py-2 text-[13px] transition",
              active
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 text-ink/80 hover:border-ink/40",
            )}
          >
            <span
              className="inline-block h-4 w-4 rounded-full border border-ink/20"
              style={{ backgroundColor: `rgb(${t.bg})` }}
            />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

type FontEntry = { id: string; label: string; cssVar: string; preview: string };

function FontGroup({
  kind,
  value,
  onChange,
}: {
  kind: "display" | "sans";
  value: string;
  onChange: (id: string) => void;
}) {
  const source: Record<string, { label: string; cssVar: string; preview: string }> =
    kind === "display" ? DISPLAY_FONTS : SANS_FONTS;
  const entries: FontEntry[] = Object.entries(source).map(([id, f]) => ({ id, ...f }));

  return (
    <div className="flex flex-wrap gap-2.5">
      {entries.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition",
              active ? "border-ink bg-cream-50" : "border-ink/15 hover:border-ink/40",
            )}
          >
            <span
              className={cn(
                "text-[22px] leading-none text-ink",
                kind === "display" ? "tracking-tightest-display" : "",
              )}
              style={{ fontFamily: f.cssVar }}
            >
              {f.label}
            </span>
            <span className="mt-1 text-[10.5px] uppercase tracking-[0.18em] text-ink/50">
              {f.preview}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Typography scales ─────────────────────────────────────────────────────

const SCALE_FIELDS: { key: keyof TypographyConfig; label: string; hint: string }[] = [
  { key: "scaleDisplay",  label: "Display",  hint: "Hero / cover headlines" },
  { key: "scaleTitle",    label: "Title",    hint: "Slide titles and h2-style headings" },
  { key: "scaleSubtitle", label: "Subtitle", hint: "Lead paragraphs and slide subtitles" },
  { key: "scaleBody",     label: "Body",     hint: "Paragraphs and list items" },
  { key: "scaleLabel",    label: "Label",    hint: "Small uppercase tags and eyebrows" },
];

function TypographyScales({
  value,
  onChange,
}: {
  value: TypographyConfig;
  onChange: (patch: Partial<TypographyConfig>) => void;
}) {
  return (
    <div className="space-y-5">
      {SCALE_FIELDS.map((f) => (
        <Row key={f.key} label={f.label} hint={f.hint}>
          <ScaleField
            value={value[f.key]}
            onChange={(n) => onChange({ [f.key]: n } as Partial<TypographyConfig>)}
            min={TYPOGRAPHY_BOUNDS.min}
            max={TYPOGRAPHY_BOUNDS.max}
            step={TYPOGRAPHY_BOUNDS.step}
          />
        </Row>
      ))}
    </div>
  );
}

// ── Identity grid ─────────────────────────────────────────────────────────

const IDENTITY_FIELDS: { key: keyof IdentityConfig; label: string; placeholder: string }[] = [
  { key: "companyName",           label: "Company name",      placeholder: "Acme Analytics" },
  { key: "planTitle",             label: "Plan title",        placeholder: "Strategic Plan — FY26" },
  { key: "planPeriod",            label: "Plan period",       placeholder: "Q4 FY25 Review" },
  { key: "presenter",             label: "Presenter",         placeholder: "Maya Okafor" },
  { key: "presenterRole",         label: "Presenter role",    placeholder: "CEO" },
  { key: "boardName",             label: "Audience",          placeholder: "Acme Board" },
  { key: "date",                  label: "Date",              placeholder: "May 28, 2026" },
  { key: "coverContextLabel",     label: "Cover context tag", placeholder: "Board Review" },
  { key: "metaPresentedByLabel",  label: "Cover · 'Presented by' label", placeholder: "Presented by" },
  { key: "metaForLabel",          label: "Cover · 'For' label",          placeholder: "For" },
  { key: "metaDateLabel",         label: "Cover · 'Date' label",         placeholder: "Date" },
];

function IdentityFields({
  value,
  onChange,
}: {
  value: IdentityConfig;
  onChange: (patch: Partial<IdentityConfig>) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
      {IDENTITY_FIELDS.map((f) => (
        <div key={f.key}>
          <label className="text-[11px] uppercase tracking-[0.22em] text-ink/55">{f.label}</label>
          <input
            type="text"
            value={value[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => onChange({ [f.key]: e.target.value } as Partial<IdentityConfig>)}
            className="mt-2 w-full border-b border-ink/20 bg-transparent py-2.5 text-[16px] text-ink outline-none transition placeholder:text-ink/30 focus:border-terracotta-300"
          />
        </div>
      ))}
    </div>
  );
}
