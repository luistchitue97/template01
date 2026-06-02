"use client";

import { useCustomize } from "./CustomizeProvider";
import { cn } from "@/lib/cn";
import {
  CountSpecEditor,
  FieldLabel,
  ListEditor,
  NumberField,
  Row,
  Section,
  SelectField,
  TextArea,
  TextField,
} from "./widgets";
import type {
  AskItem,
  Asks,
  BarTone,
  BudgetSegment,
  ExecutiveSummary,
  Financials,
  HeadcountRow,
  KPIItem,
  KPIs,
  KR,
  Lane,
  Market,
  OKRs,
  Objective,
  PLRow,
  Pillar,
  Player,
  Priorities,
  Quadrant,
  QuadrantTone,
  Resources,
  RiskItem,
  Risks,
  Roadmap,
  RoadmapBar,
  Severity,
  Situation,
  SlidesConfig,
  StatItem,
  ThemeBlurb,
  Tone,
} from "@/lib/customize";

// ── helper hook so each editor is a one-liner ────────────────────────────

function useSliceUpdater<K extends keyof SlidesConfig>(key: K) {
  const { config, update } = useCustomize();
  const value = config.slides[key];
  const set = (patch: Partial<SlidesConfig[K]>) => {
    update({ slides: { [key]: { ...(value as object), ...patch } } as Partial<SlidesConfig> });
  };
  return [value, set] as const;
}

// ── visibility toggle (one row at the top of every per-slide editor) ─────

/**
 * Drives `hiddenSlideIndexes` on the slides config. Refuses to hide the
 * last visible slide — the deck has to render something.
 */
function SlideVisibilityToggle({ slideIndex }: { slideIndex: number }) {
  const { config, update } = useCustomize();
  const hidden = config.slides.hiddenSlideIndexes ?? [];
  const isHidden = hidden.includes(slideIndex);
  const visibleCount = config.slides.navLabels.length - hidden.length;
  const wouldEmptyDeck = !isHidden && visibleCount <= 1;

  const onToggle = () => {
    if (wouldEmptyDeck) return;
    const next = isHidden
      ? hidden.filter((i) => i !== slideIndex)
      : [...hidden, slideIndex].sort((a, b) => a - b);
    update({ slides: { hiddenSlideIndexes: next } });
  };

  return (
    <Row
      label="Show in deck"
      hint={
        wouldEmptyDeck
          ? "Can't hide — at least one slide must stay visible."
          : "Toggle off to drop this slide from the rendered presentation."
      }
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={!isHidden}
          disabled={wouldEmptyDeck}
          onClick={onToggle}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition",
            isHidden ? "bg-ink/15" : "bg-terracotta-300",
            wouldEmptyDeck && "cursor-not-allowed opacity-60",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-cream-50 shadow transition-transform",
              isHidden ? "translate-x-1" : "translate-x-6",
            )}
          />
        </button>
        <span
          className={cn(
            "text-[12px] uppercase tracking-[0.22em]",
            isHidden ? "text-ink/45" : "text-ink/75",
          )}
        >
          {isHidden ? "Hidden" : "Visible"}
        </span>
      </div>
    </Row>
  );
}

// Convert an array of numbers to a comma-separated string for editing, and
// back. Filters out NaN.
function numArrToStr(arr: number[]): string {
  return arr.join(", ");
}
function strToNumArr(s: string): number[] {
  return s
    .split(/[,\s]+/)
    .map((p) => Number.parseFloat(p))
    .filter((n) => Number.isFinite(n));
}

const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "up",      label: "▲ Up" },
  { value: "down",    label: "▼ Down" },
  { value: "neutral", label: "— Neutral" },
];

/** Strip any leading direction glyph + whitespace from a caption string. */
function stripLeadingArrow(s: string): string {
  return s.replace(/^[\s▲▼△▽↑↓⬆⬇]+/, "");
}
const SEV_OPTIONS: { value: Severity; label: string }[] = [
  { value: "Low",  label: "Low" },
  { value: "Med",  label: "Med" },
  { value: "High", label: "High" },
];
const QUAD_TONE_OPTIONS: { value: QuadrantTone; label: string }[] = [
  { value: "sage",       label: "Sage" },
  { value: "terracotta", label: "Accent" },
  { value: "ink",        label: "Ink" },
];
const BAR_TONE_OPTIONS: { value: BarTone; label: string }[] = [
  { value: "committed",   label: "Committed" },
  { value: "in-flight",   label: "In-flight" },
  { value: "exploratory", label: "Exploratory" },
];

// ════════════════════════════════════════════════════════════════════════
// 02 · Executive summary
// ════════════════════════════════════════════════════════════════════════

export function ExecutiveSummaryEditor() {
  const [data, set] = useSliceUpdater("executiveSummary");
  const d = data as ExecutiveSummary;
  return (
    <Section id="exec" number="04" title="Slide 02 — Executive summary">
      <SlideVisibilityToggle slideIndex={1} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Executive Summary" />
      </Row>
      <Row label="Title" hint="Use \n for line break">
        <TextArea value={d.title} onChange={(v) => set({ title: v })} rows={2} />
      </Row>
      <Row label="Subtitle">
        <TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
      </Row>
      <Row label="Stat tiles">
        <ListEditor
          items={d.stats}
          onChange={(stats) => set({ stats })}
          newItem={(): StatItem => ({ label: "New metric", value: "0", count: { to: 0 }, delta: "", deltaTone: "neutral" })}
          itemLabel={(it) => it.label || "New metric"}
          renderItem={(s, upd) => (
            <>
              <div className="grid grid-cols-2 gap-3">
                <FieldLabel label="Label">
                  <TextField value={s.label} onChange={(v) => upd({ label: v })} />
                </FieldLabel>
                <FieldLabel label="Static text (fallback)">
                  <TextField value={s.value} onChange={(v) => upd({ value: v })} placeholder="$42.1M" />
                </FieldLabel>
              </div>
              <FieldLabel label="Animated count">
                <CountSpecEditor value={s.count} onChange={(c) => upd({ count: c })} />
              </FieldLabel>
              <div className="grid grid-cols-[1fr_180px] gap-3">
                <FieldLabel label="Delta caption">
                  <TextField
                    value={stripLeadingArrow(s.delta ?? "")}
                    onChange={(v) => upd({ delta: stripLeadingArrow(v) })}
                    placeholder="18.4% YoY"
                  />
                </FieldLabel>
                <FieldLabel label="Tone">
                  <SelectField
                    value={s.deltaTone ?? "neutral"}
                    onChange={(v) => upd({ deltaTone: v, delta: stripLeadingArrow(s.delta ?? "") })}
                    options={TONE_OPTIONS}
                  />
                </FieldLabel>
              </div>
              <p className="text-[10.5px] leading-snug text-ink/45">
                The ▲ / ▼ growth indicator is drawn from the tone above — leave it out of the caption text.
              </p>
            </>
          )}
        />
      </Row>
      <Row label="Themes (3 columns)">
        <ListEditor
          items={d.blurbs}
          onChange={(blurbs) => set({ blurbs })}
          newItem={(): ThemeBlurb => ({ heading: "Heading", body: "Body" })}
          itemLabel={(it) => it.heading}
          renderItem={(b, upd) => (
            <>
              <TextField value={b.heading} onChange={(v) => upd({ heading: v })} placeholder="Heading" />
              <TextArea  value={b.body}    onChange={(v) => upd({ body: v })}    placeholder="Body" />
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 03 · Situation
// ════════════════════════════════════════════════════════════════════════

export function SituationEditor() {
  const [data, set] = useSliceUpdater("situation");
  const d = data as Situation;
  return (
    <Section id="situation" number="05" title="Slide 03 — Where we stand">
      <SlideVisibilityToggle slideIndex={2} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Situation Analysis" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>
      <Row label="Quadrants">
        <ListEditor
          items={d.quadrants}
          onChange={(quadrants) => set({ quadrants })}
          newItem={(): Quadrant => ({ label: "New quadrant", tone: "ink", items: [] })}
          itemLabel={(q) => q.label}
          minItems={1}
          renderItem={(q, upd) => (
            <>
              <div className="grid grid-cols-[1fr_220px] gap-3">
                <FieldLabel label="Label"><TextField value={q.label} onChange={(v) => upd({ label: v })} /></FieldLabel>
                <FieldLabel label="Dot color">
                  <SelectField value={q.tone} onChange={(v) => upd({ tone: v })} options={QUAD_TONE_OPTIONS} />
                </FieldLabel>
              </div>
              <FieldLabel label="Items">
                <StringList items={q.items} onChange={(items) => upd({ items })} placeholder="Bullet item" />
              </FieldLabel>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 04 · Market
// ════════════════════════════════════════════════════════════════════════

export function MarketEditor() {
  const [data, set] = useSliceUpdater("market");
  const d = data as Market;
  return (
    <Section id="market" number="06" title="Slide 04 — Market & landscape">
      <SlideVisibilityToggle slideIndex={3} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Market & Landscape" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>

      <Row label="Chart axis labels" hint="Labels around the 2×2 scatter — top/bottom for the y-axis, left/right for the x-axis.">
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="Top (y+)"><TextField value={d.axisLabels.top} onChange={(v) => set({ axisLabels: { ...d.axisLabels, top: v } })} /></FieldLabel>
          <FieldLabel label="Bottom (y−)"><TextField value={d.axisLabels.bottom} onChange={(v) => set({ axisLabels: { ...d.axisLabels, bottom: v } })} /></FieldLabel>
          <FieldLabel label="Right (x+)"><TextField value={d.axisLabels.right} onChange={(v) => set({ axisLabels: { ...d.axisLabels, right: v } })} /></FieldLabel>
          <FieldLabel label="Left (x−)"><TextField value={d.axisLabels.left} onChange={(v) => set({ axisLabels: { ...d.axisLabels, left: v } })} /></FieldLabel>
        </div>
      </Row>

      <Row label="Chart players" hint="x, y are 0..1 (0 = left/bottom, 1 = right/top). One player can be marked 'self'.">
        <ListEditor
          items={d.players}
          onChange={(players) => set({ players })}
          newItem={(): Player => ({ name: "New", x: 0.5, y: 0.5, size: 16, self: false })}
          itemLabel={(p) => p.name + (p.self ? " (self)" : "")}
          renderItem={(p, upd) => (
            <>
              <TextField value={p.name} onChange={(v) => upd({ name: v })} placeholder="Name" />
              <div className="grid grid-cols-4 gap-3">
                <FieldLabel label="x (0–1)"><NumberField value={p.x} step={0.05} min={0} max={1} onChange={(n) => upd({ x: n })} /></FieldLabel>
                <FieldLabel label="y (0–1)"><NumberField value={p.y} step={0.05} min={0} max={1} onChange={(n) => upd({ y: n })} /></FieldLabel>
                <FieldLabel label="Size (px)"><NumberField value={p.size} step={1} min={4} max={60} onChange={(n) => upd({ size: n })} /></FieldLabel>
                <FieldLabel label="Self?">
                  <SelectField
                    value={p.self ? "yes" : "no"}
                    onChange={(v) => upd({ self: v === "yes" })}
                    options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
                  />
                </FieldLabel>
              </div>
            </>
          )}
        />
      </Row>

      <Row label="TAM tile">
        <div className="space-y-3 rounded-2xl border border-ink/12 bg-cream-50/60 p-5">
          <CountSpecEditor value={d.tam.count} onChange={(c) => set({ tam: { ...d.tam, count: c } })} />
          <TextField value={d.tam.label} onChange={(v) => set({ tam: { ...d.tam, label: v } })} placeholder="Caption label" />
          <TextArea  value={d.tam.body}  onChange={(v) => set({ tam: { ...d.tam, body: v } })} />
        </div>
      </Row>

      <Row label="Growth tile">
        <div className="space-y-3 rounded-2xl border border-ink/12 bg-cream-50/60 p-5">
          <CountSpecEditor value={d.growth.count} onChange={(c) => set({ growth: { ...d.growth, count: c } })} />
          <TextField value={d.growth.label} onChange={(v) => set({ growth: { ...d.growth, label: v } })} placeholder="Caption label" />
          <TextArea  value={d.growth.body}  onChange={(v) => set({ growth: { ...d.growth, body: v } })} />
        </div>
      </Row>

      <Row label="Opening line"><TextArea value={d.opening} onChange={(v) => set({ opening: v })} /></Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 05 · Priorities
// ════════════════════════════════════════════════════════════════════════

export function PrioritiesEditor() {
  const [data, set] = useSliceUpdater("priorities");
  const d = data as Priorities;
  return (
    <Section id="priorities" number="07" title="Slide 05 — Strategic priorities">
      <SlideVisibilityToggle slideIndex={4} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Strategic Priorities" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Title (accent part)" hint="Rendered in the accent color after the title."><TextField value={d.titleAccent ?? ""} onChange={(v) => set({ titleAccent: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>
      <Row label="Pillar tag" hint="Per-card label shown top-right of each pillar.">
        <TextField value={d.pillarTag} onChange={(v) => set({ pillarTag: v })} placeholder="Pillar" />
      </Row>
      <Row label="Name punctuation" hint="Appended after each pillar's name (e.g. '.', '!', or '').">
        <TextField value={d.namePunctuation} onChange={(v) => set({ namePunctuation: v })} placeholder="." />
      </Row>
      <Row label="Pillars">
        <ListEditor
          items={d.pillars}
          onChange={(pillars) => set({ pillars })}
          newItem={(): Pillar => ({ roman: "IV", name: "New", promise: "", body: "", metrics: [] })}
          itemLabel={(p) => `${p.roman}. ${p.name}`}
          minItems={1}
          renderItem={(p, upd) => (
            <>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <FieldLabel label="Roman"><TextField value={p.roman} onChange={(v) => upd({ roman: v })} /></FieldLabel>
                <FieldLabel label="Name"><TextField value={p.name} onChange={(v) => upd({ name: v })} /></FieldLabel>
              </div>
              <FieldLabel label="One-line promise"><TextField value={p.promise} onChange={(v) => upd({ promise: v })} /></FieldLabel>
              <FieldLabel label="Body"><TextArea value={p.body} onChange={(v) => upd({ body: v })} /></FieldLabel>
              <FieldLabel label="Metrics">
                <StringList items={p.metrics} onChange={(metrics) => upd({ metrics })} placeholder="Metric" />
              </FieldLabel>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 06 · OKRs
// ════════════════════════════════════════════════════════════════════════

export function OKRsEditor() {
  const [data, set] = useSliceUpdater("okrs");
  const d = data as OKRs;
  return (
    <Section id="okrs" number="08" title="Slide 06 — OKRs">
      <SlideVisibilityToggle slideIndex={5} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Objectives & Key Results" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>
      <Row label="KR prefix" hint="Prefix on each key-result badge (KR1, KR2…).">
        <TextField value={d.krPrefix} onChange={(v) => set({ krPrefix: v })} placeholder="KR" />
      </Row>
      <Row label="Objectives">
        <ListEditor
          items={d.objectives}
          onChange={(objectives) => set({ objectives })}
          newItem={(): Objective => ({ pillar: "New", pillarRoman: "IV", objective: "", owner: "", krs: [{ text: "", target: "" }] })}
          itemLabel={(o) => `${o.pillarRoman}. ${o.pillar}`}
          minItems={1}
          renderItem={(o, upd) => (
            <>
              <div className="grid grid-cols-[100px_1fr_1fr] gap-3">
                <FieldLabel label="Roman"><TextField value={o.pillarRoman} onChange={(v) => upd({ pillarRoman: v })} /></FieldLabel>
                <FieldLabel label="Pillar"><TextField value={o.pillar} onChange={(v) => upd({ pillar: v })} /></FieldLabel>
                <FieldLabel label="Owner"><TextField value={o.owner} onChange={(v) => upd({ owner: v })} /></FieldLabel>
              </div>
              <FieldLabel label="Objective"><TextArea value={o.objective} onChange={(v) => upd({ objective: v })} /></FieldLabel>
              <FieldLabel label="Key results">
                <ListEditor
                  items={o.krs}
                  onChange={(krs) => upd({ krs })}
                  newItem={(): KR => ({ text: "", target: "" })}
                  itemLabel={(_kr, i) => `KR${i + 1}`}
                  renderItem={(kr, krUpd) => (
                    <>
                      <TextField value={kr.text}   onChange={(v) => krUpd({ text: v })}   placeholder="Description" />
                      <TextField value={kr.target} onChange={(v) => krUpd({ target: v })} placeholder="Target (21 → 10 days)" />
                    </>
                  )}
                  addLabel="Add KR"
                />
              </FieldLabel>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 07 · Roadmap
// ════════════════════════════════════════════════════════════════════════

export function RoadmapEditor() {
  const [data, set] = useSliceUpdater("roadmap");
  const d = data as Roadmap;
  return (
    <Section id="roadmap" number="09" title="Slide 07 — Roadmap">
      <SlideVisibilityToggle slideIndex={6} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="FY26 Roadmap" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>

      <Row label="Table headers" hint="Top-row labels of the roadmap grid.">
        <div className="grid grid-cols-[1fr_repeat(4,1fr)] gap-3">
          <FieldLabel small label="Pillar col"><TextField value={d.pillarHeader} onChange={(v) => set({ pillarHeader: v })} /></FieldLabel>
          {[0, 1, 2, 3].map((i) => (
            <FieldLabel key={i} small label={`Q${i + 1}`}>
              <TextField
                value={d.quarterHeaders[i] ?? ""}
                onChange={(v) => {
                  const next = [...d.quarterHeaders];
                  while (next.length < 4) next.push("");
                  next[i] = v;
                  set({ quarterHeaders: next.slice(0, 4) });
                }}
              />
            </FieldLabel>
          ))}
        </div>
      </Row>

      <Row label="Legend labels" hint="Tone labels shown beneath the timeline.">
        <div className="grid grid-cols-3 gap-3">
          <FieldLabel small label="Committed"><TextField value={d.legend.committed} onChange={(v) => set({ legend: { ...d.legend, committed: v } })} /></FieldLabel>
          <FieldLabel small label="In-flight"><TextField value={d.legend.inFlight} onChange={(v) => set({ legend: { ...d.legend, inFlight: v } })} /></FieldLabel>
          <FieldLabel small label="Exploratory"><TextField value={d.legend.exploratory} onChange={(v) => set({ legend: { ...d.legend, exploratory: v } })} /></FieldLabel>
        </div>
      </Row>

      <Row label="Lanes" hint="Roman is used to link bars to lanes (case-sensitive).">
        <ListEditor
          items={d.lanes}
          onChange={(lanes) => set({ lanes })}
          newItem={(): Lane => ({ roman: "IV", name: "New lane" })}
          itemLabel={(l) => `${l.roman}. ${l.name}`}
          minItems={1}
          renderItem={(l, upd) => (
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <FieldLabel label="Roman"><TextField value={l.roman} onChange={(v) => upd({ roman: v })} /></FieldLabel>
              <FieldLabel label="Name"><TextField value={l.name} onChange={(v) => upd({ name: v })} /></FieldLabel>
            </div>
          )}
        />
      </Row>

      <Row label="Bars" hint="start and span are in quarters (0..4). tone picks color.">
        <ListEditor
          items={d.bars}
          onChange={(bars) => set({ bars })}
          newItem={(): RoadmapBar => ({ laneRoman: d.lanes[0]?.roman ?? "I", label: "Initiative", start: 0, span: 1, tone: "committed" })}
          itemLabel={(b) => `${b.laneRoman} · ${b.label}`}
          renderItem={(b, upd) => (
            <>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <FieldLabel label="Lane">
                  <SelectField
                    value={b.laneRoman}
                    onChange={(v) => upd({ laneRoman: v })}
                    options={d.lanes.map((l) => ({ value: l.roman, label: l.roman }))}
                  />
                </FieldLabel>
                <FieldLabel label="Label"><TextField value={b.label} onChange={(v) => upd({ label: v })} /></FieldLabel>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FieldLabel label="Start (Q)"><NumberField value={b.start} step={0.5} min={0} max={4} onChange={(n) => upd({ start: n })} /></FieldLabel>
                <FieldLabel label="Span (Q)"><NumberField value={b.span} step={0.5} min={0.5} max={4} onChange={(n) => upd({ span: n })} /></FieldLabel>
                <FieldLabel label="Tone">
                  <SelectField value={b.tone} onChange={(v) => upd({ tone: v })} options={BAR_TONE_OPTIONS} />
                </FieldLabel>
              </div>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 08 · Financials
// ════════════════════════════════════════════════════════════════════════

export function FinancialsEditor() {
  const [data, set] = useSliceUpdater("financials");
  const d = data as Financials;
  return (
    <Section id="financials" number="10" title="Slide 08 — Financial plan">
      <SlideVisibilityToggle slideIndex={7} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Financial Plan" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Title (accent)"><TextField value={d.titleAccent ?? ""} onChange={(v) => set({ titleAccent: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>

      <Row label="Bar chart labels" hint="Title, unit, and legend on the quarterly bar chart.">
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel small label="Title"><TextField value={d.barCard.title} onChange={(v) => set({ barCard: { ...d.barCard, title: v } })} /></FieldLabel>
          <FieldLabel small label="Unit"><TextField value={d.barCard.unit} onChange={(v) => set({ barCard: { ...d.barCard, unit: v } })} /></FieldLabel>
          <FieldLabel small label="Legend · actual rev."><TextField value={d.barCard.legendActual} onChange={(v) => set({ barCard: { ...d.barCard, legendActual: v } })} /></FieldLabel>
          <FieldLabel small label="Legend · plan rev."><TextField value={d.barCard.legendPlan} onChange={(v) => set({ barCard: { ...d.barCard, legendPlan: v } })} /></FieldLabel>
          <FieldLabel small label="Legend · cost"><TextField value={d.barCard.legendCost} onChange={(v) => set({ barCard: { ...d.barCard, legendCost: v } })} /></FieldLabel>
        </div>
      </Row>

      <Row label="Line chart labels" hint="Title, unit, legend, and plan-divider label on the margin trajectory chart.">
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel small label="Title"><TextField value={d.lineCard.title} onChange={(v) => set({ lineCard: { ...d.lineCard, title: v } })} /></FieldLabel>
          <FieldLabel small label="Unit"><TextField value={d.lineCard.unit} onChange={(v) => set({ lineCard: { ...d.lineCard, unit: v } })} /></FieldLabel>
          <FieldLabel small label="Legend · gross margin"><TextField value={d.lineCard.legendGm} onChange={(v) => set({ lineCard: { ...d.lineCard, legendGm: v } })} /></FieldLabel>
          <FieldLabel small label="Legend · FCF margin"><TextField value={d.lineCard.legendFcf} onChange={(v) => set({ lineCard: { ...d.lineCard, legendFcf: v } })} /></FieldLabel>
          <FieldLabel small label="Plan divider label"><TextField value={d.lineCard.planDivider} onChange={(v) => set({ lineCard: { ...d.lineCard, planDivider: v } })} /></FieldLabel>
        </div>
      </Row>

      <Row label="Line chart Y axis" hint="Bounds + grid tick values for the margin trajectory chart.">
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel small label="Y min"><NumberField value={d.lineCard.yMin} step={1} onChange={(n) => set({ lineCard: { ...d.lineCard, yMin: n } })} /></FieldLabel>
          <FieldLabel small label="Y max"><NumberField value={d.lineCard.yMax} step={1} onChange={(n) => set({ lineCard: { ...d.lineCard, yMax: n } })} /></FieldLabel>
        </div>
        <FieldLabel small label="Y grid ticks (comma-separated)">
          <TextField
            value={d.lineCard.yGridTicks.join(", ")}
            onChange={(v) =>
              set({
                lineCard: {
                  ...d.lineCard,
                  yGridTicks: v
                    .split(/[,\s]+/)
                    .map((s) => Number.parseFloat(s))
                    .filter((n) => Number.isFinite(n)),
                },
              })
            }
            placeholder="0, 25, 50, 75"
          />
        </FieldLabel>
      </Row>

      <Row label="Quarters" hint="Comma-separated labels (e.g. Q1·25, Q2·25, …).">
        <TextField
          value={d.quarters.join(", ")}
          onChange={(v) => set({ quarters: v.split(",").map((s) => s.trim()).filter(Boolean) })}
        />
      </Row>
      <Row label="Plan starts at index" hint="0-based index where the accent (plan) bars take over.">
        <NumberField value={d.planStart} step={1} min={0} max={Math.max(0, d.quarters.length)} onChange={(n) => set({ planStart: n })} />
      </Row>

      <NumberSeriesRow label="Revenue ($M)"      values={d.revenue}   onChange={(revenue)   => set({ revenue })} />
      <NumberSeriesRow label="Costs ($M)"        values={d.costs}     onChange={(costs)     => set({ costs })} />
      <NumberSeriesRow label="Gross margin (%)"  values={d.gmSeries}  onChange={(gmSeries)  => set({ gmSeries })} />
      <NumberSeriesRow label="FCF margin (%)"    values={d.fcfSeries} onChange={(fcfSeries) => set({ fcfSeries })} />

      <Row label="P&amp;L rows">
        <ListEditor
          items={d.plRows}
          onChange={(plRows) => set({ plRows })}
          newItem={(): PLRow => ({ label: "Line", fy25: "—", fy26: "—", delta: "—" })}
          itemLabel={(r) => r.label}
          renderItem={(r, upd) => (
            <div className="grid grid-cols-4 gap-3">
              <FieldLabel label="Label"><TextField value={r.label} onChange={(v) => upd({ label: v })} /></FieldLabel>
              <FieldLabel label="FY25"><TextField value={r.fy25}  onChange={(v) => upd({ fy25: v })} /></FieldLabel>
              <FieldLabel label="FY26"><TextField value={r.fy26}  onChange={(v) => upd({ fy26: v })} /></FieldLabel>
              <FieldLabel label="Δ">    <TextField value={r.delta} onChange={(v) => upd({ delta: v })} /></FieldLabel>
            </div>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 09 · Resources
// ════════════════════════════════════════════════════════════════════════

export function ResourcesEditor() {
  const [data, set] = useSliceUpdater("resources");
  const d = data as Resources;
  return (
    <Section id="resources" number="11" title="Slide 09 — Resourcing">
      <SlideVisibilityToggle slideIndex={8} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Resourcing the Plan" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>
      <Row label="Headcount header" hint="Header above the headcount bars.">
        <TextField value={d.headcountHeader} onChange={(v) => set({ headcountHeader: v })} placeholder="Headcount by function" />
      </Row>
      <Row label="Budget header" hint="Prefix shown before the budget total (e.g. 'FY26 budget —').">
        <TextField value={d.budgetHeader} onChange={(v) => set({ budgetHeader: v })} placeholder="FY26 budget —" />
      </Row>
      <Row label="Budget total"><TextField value={d.budgetTotal} onChange={(v) => set({ budgetTotal: v })} /></Row>

      <Row label="Headcount">
        <ListEditor
          items={d.headcount}
          onChange={(headcount) => set({ headcount })}
          newItem={(): HeadcountRow => ({ fn: "New function", current: 0, add: 0 })}
          itemLabel={(h) => h.fn}
          renderItem={(h, upd) => (
            <div className="grid grid-cols-[1fr_120px_120px] gap-3">
              <FieldLabel label="Function"><TextField value={h.fn} onChange={(v) => upd({ fn: v })} /></FieldLabel>
              <FieldLabel label="Current"><NumberField value={h.current} step={1} min={0} onChange={(n) => upd({ current: Math.round(n) })} /></FieldLabel>
              <FieldLabel label="To add"><NumberField value={h.add} step={1} min={0} onChange={(n) => upd({ add: Math.round(n) })} /></FieldLabel>
            </div>
          )}
        />
      </Row>

      <Row label="Budget segments" hint="Percent shares; should sum to 100.">
        <ListEditor
          items={d.budget}
          onChange={(budget) => set({ budget })}
          newItem={(): BudgetSegment => ({ label: "New", pct: 0, color: "bg-ink/40" })}
          itemLabel={(b) => `${b.label} · ${b.pct}%`}
          renderItem={(b, upd) => (
            <div className="grid grid-cols-[1fr_120px_1fr] gap-3">
              <FieldLabel label="Label"><TextField value={b.label} onChange={(v) => upd({ label: v })} /></FieldLabel>
              <FieldLabel label="Percent"><NumberField value={b.pct} step={1} min={0} max={100} onChange={(n) => upd({ pct: n })} /></FieldLabel>
              <FieldLabel label="Color (Tailwind class)" >
                <TextField value={b.color} onChange={(v) => upd({ color: v })} placeholder="bg-terracotta-300" />
              </FieldLabel>
            </div>
          )}
        />
      </Row>

      <Row label="Footnote"><TextArea value={d.note} onChange={(v) => set({ note: v })} /></Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 10 · Risks
// ════════════════════════════════════════════════════════════════════════

export function RisksEditor() {
  const [data, set] = useSliceUpdater("risks");
  const d = data as Risks;
  return (
    <Section id="risks" number="12" title="Slide 10 — Risks">
      <SlideVisibilityToggle slideIndex={9} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="Risks & Mitigations" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>

      <Row label="Column headers" hint="Top-row headers of the risks table.">
        <div className="grid grid-cols-3 gap-3">
          <FieldLabel small label="Risk"><TextField value={d.columnHeaders.risk} onChange={(v) => set({ columnHeaders: { ...d.columnHeaders, risk: v } })} /></FieldLabel>
          <FieldLabel small label="Likelihood"><TextField value={d.columnHeaders.likelihood} onChange={(v) => set({ columnHeaders: { ...d.columnHeaders, likelihood: v } })} /></FieldLabel>
          <FieldLabel small label="Impact"><TextField value={d.columnHeaders.impact} onChange={(v) => set({ columnHeaders: { ...d.columnHeaders, impact: v } })} /></FieldLabel>
          <FieldLabel small label="Mitigation"><TextField value={d.columnHeaders.mitigation} onChange={(v) => set({ columnHeaders: { ...d.columnHeaders, mitigation: v } })} /></FieldLabel>
          <FieldLabel small label="Owner"><TextField value={d.columnHeaders.owner} onChange={(v) => set({ columnHeaders: { ...d.columnHeaders, owner: v } })} /></FieldLabel>
        </div>
      </Row>
      <Row label="Risks">
        <ListEditor
          items={d.items}
          onChange={(items) => set({ items })}
          newItem={(): RiskItem => ({ risk: "New risk", likelihood: "Med", impact: "Med", mitigation: "", owner: "" })}
          itemLabel={(r) => r.risk}
          renderItem={(r, upd) => (
            <>
              <FieldLabel label="Risk"><TextField value={r.risk} onChange={(v) => upd({ risk: v })} /></FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <FieldLabel label="Likelihood"><SelectField value={r.likelihood} onChange={(v) => upd({ likelihood: v })} options={SEV_OPTIONS} /></FieldLabel>
                <FieldLabel label="Impact"><SelectField value={r.impact} onChange={(v) => upd({ impact: v })} options={SEV_OPTIONS} /></FieldLabel>
              </div>
              <FieldLabel label="Mitigation"><TextArea value={r.mitigation} onChange={(v) => upd({ mitigation: v })} /></FieldLabel>
              <FieldLabel label="Owner"><TextField value={r.owner} onChange={(v) => upd({ owner: v })} /></FieldLabel>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 11 · KPIs
// ════════════════════════════════════════════════════════════════════════

export function KPIsEditor() {
  const [data, set] = useSliceUpdater("kpis");
  const d = data as KPIs;
  return (
    <Section id="kpis" number="13" title="Slide 11 — KPIs">
      <SlideVisibilityToggle slideIndex={10} />
      <Row label="Kicker" hint="Section eyebrow above the title.">
        <TextField value={d.kicker} onChange={(v) => set({ kicker: v })} placeholder="KPIs" />
      </Row>
      <Row label="Title"><TextField value={d.title} onChange={(v) => set({ title: v })} /></Row>
      <Row label="Subtitle"><TextArea value={d.subtitle} onChange={(v) => set({ subtitle: v })} /></Row>
      <Row label="KPI tiles" hint="Sparkline values are comma-separated numbers.">
        <ListEditor
          items={d.items}
          onChange={(items) => set({ items })}
          newItem={(): KPIItem => ({ label: "New KPI", value: "0", target: "→ 0", count: { to: 0 }, series: [0, 0], tone: "neutral" })}
          itemLabel={(k) => k.label}
          renderItem={(k, upd) => (
            <>
              <div className="grid grid-cols-[1fr_140px_140px] gap-3">
                <FieldLabel label="Label"><TextField value={k.label} onChange={(v) => upd({ label: v })} /></FieldLabel>
                <FieldLabel label="Static"><TextField value={k.value}  onChange={(v) => upd({ value: v })} /></FieldLabel>
                <FieldLabel label="Target"><TextField value={k.target} onChange={(v) => upd({ target: v })} /></FieldLabel>
              </div>
              <FieldLabel label="Animated count"><CountSpecEditor value={k.count} onChange={(c) => upd({ count: c })} /></FieldLabel>
              <div className="grid grid-cols-[1fr_180px] gap-3">
                <FieldLabel label="Sparkline series">
                  <TextField
                    value={numArrToStr(k.series)}
                    onChange={(v) => upd({ series: strToNumArr(v) })}
                    placeholder="29, 31, 33, 35, 37, 39, 40, 42"
                  />
                </FieldLabel>
                <FieldLabel label="Tone"><SelectField value={k.tone} onChange={(v) => upd({ tone: v })} options={TONE_OPTIONS} /></FieldLabel>
              </div>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 12 · Asks
// ════════════════════════════════════════════════════════════════════════

export function AsksEditor() {
  const [data, set] = useSliceUpdater("asks");
  const d = data as Asks;
  return (
    <Section id="asks" number="14" title="Slide 12 — Asks">
      <SlideVisibilityToggle slideIndex={11} />
      <Row label="Eyebrow" hint="Top-right tag above the headline.">
        <TextField value={d.eyebrow} onChange={(v) => set({ eyebrow: v })} placeholder="What we need from you" />
      </Row>
      <Row label="Headline noun" hint="Word used in the auto-counted headline. Singular: 'One {noun}.'; plural: '{N} {noun}s.'">
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel small label="Singular"><TextField value={d.headlineNoun.singular} onChange={(v) => set({ headlineNoun: { ...d.headlineNoun, singular: v } })} placeholder="ask" /></FieldLabel>
          <FieldLabel small label="Plural"><TextField value={d.headlineNoun.plural} onChange={(v) => set({ headlineNoun: { ...d.headlineNoun, plural: v } })} placeholder="asks" /></FieldLabel>
        </div>
      </Row>
      <Row label="Headline accent" hint="Accent phrase joined to the auto-counted headline ('Three asks. No surprises.').">
        <TextField value={d.headlineAccent} onChange={(v) => set({ headlineAccent: v })} placeholder="No surprises." />
      </Row>
      <Row label="Callback suffix" hint="Text after the bottom-left quoted callback to the cover hero.">
        <TextField value={d.callbackSuffix} onChange={(v) => set({ callbackSuffix: v })} placeholder="— see slide 01." />
      </Row>
      <Row label="Closing note" hint="Right-aligned beside the cover callback."><TextField value={d.closingNote} onChange={(v) => set({ closingNote: v })} /></Row>
      <Row label="Asks">
        <ListEditor
          items={d.asks}
          onChange={(asks) => set({ asks })}
          newItem={(): AskItem => ({ n: String(d.asks.length + 1).padStart(2, "0"), title: "", body: "" })}
          itemLabel={(a) => `${a.n} · ${a.title || "Untitled"}`}
          minItems={1}
          renderItem={(a, upd) => (
            <>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <FieldLabel label="Number"><TextField value={a.n} onChange={(v) => upd({ n: v })} /></FieldLabel>
                <FieldLabel label="Title"><TextField value={a.title} onChange={(v) => upd({ title: v })} /></FieldLabel>
              </div>
              <FieldLabel label="Body"><TextArea value={a.body} onChange={(v) => upd({ body: v })} /></FieldLabel>
            </>
          )}
        />
      </Row>
    </Section>
  );
}

// ── small shared helpers ─────────────────────────────────────────────────

function StringList({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const setAt = (i: number, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? v : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextField value={item} onChange={(v) => setAt(i, v)} placeholder={placeholder} />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove"
            className="grid h-7 w-7 place-items-center rounded-full border border-ink/15 text-[14px] text-ink/65 transition hover:border-terracotta-300 hover:text-terracotta-300"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-3 py-1 text-[10.5px] uppercase tracking-[0.18em] text-ink/65 transition hover:border-terracotta-300 hover:text-terracotta-300"
      >
        + Add
      </button>
    </div>
  );
}

function NumberSeriesRow({
  label,
  values,
  onChange,
}: {
  label: string;
  values: number[];
  onChange: (next: number[]) => void;
}) {
  const setAt = (i: number, n: number) =>
    onChange(values.map((v, idx) => (idx === i ? n : v)));
  const removeAt = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => {
    const last = values[values.length - 1];
    onChange([...values, Number.isFinite(last) ? last : 0]);
  };
  return (
    <Row label={label} hint="One value per quarter. Use ± to add or remove entries.">
      <div className="flex flex-wrap items-end gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 rounded-md border border-ink/15 px-2 py-1 focus-within:border-terracotta-300">
              <input
                type="number"
                value={Number.isFinite(v) ? v : 0}
                step={0.1}
                onChange={(e) => {
                  const n = e.target.valueAsNumber;
                  setAt(i, Number.isFinite(n) ? n : 0);
                }}
                className="w-16 bg-transparent text-[13px] tnum text-ink outline-none"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label={`Remove entry ${i + 1}`}
                className="grid h-5 w-5 place-items-center rounded-full text-[12px] text-ink/45 transition hover:text-terracotta-300"
              >
                ×
              </button>
            </div>
            <span className="text-[9px] uppercase tracking-[0.18em] text-ink/35 tnum">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex h-[34px] items-center gap-1.5 rounded-md border border-dashed border-ink/30 px-3 text-[10.5px] uppercase tracking-[0.18em] text-ink/65 transition hover:border-terracotta-300 hover:text-terracotta-300"
        >
          + Add
        </button>
      </div>
    </Row>
  );
}
