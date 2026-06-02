import { SLIDE_DEFAULTS } from "./slides-defaults";

export const STORAGE_KEY = "template-04.customize.v2";

// ── THEME ─────────────────────────────────────────────────────────────────

export type DisplayFontId = "fraunces" | "playfair" | "ebgaramond";
export type SansFontId = "inter" | "manrope" | "plex";
export type BackgroundToneId = "cream" | "ivory" | "ash" | "graphite";

export type ThemeConfig = {
  accentRgb: string;
  backgroundTone: BackgroundToneId;
  displayFont: DisplayFontId;
  sansFont: SansFontId;
};

// ── TYPOGRAPHY (per-category text scale multipliers) ──────────────────────

export type TypographyConfig = {
  /** Hero / cover-page headlines (60+ px baseline). */
  scaleDisplay: number;
  /** Slide titles and h2-style headings. */
  scaleTitle: number;
  /** Lead paragraphs, slide subtitles. */
  scaleSubtitle: number;
  /** Body copy, paragraphs, list items. */
  scaleBody: number;
  /** Small uppercase eyebrows, tags, micro-labels. */
  scaleLabel: number;
};

export const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  scaleDisplay: 1,
  scaleTitle: 1,
  scaleSubtitle: 1,
  scaleBody: 1,
  scaleLabel: 1,
};

export const TYPOGRAPHY_BOUNDS = { min: 0.7, max: 1.6, step: 0.05 } as const;

// ── IDENTITY (Cover + Asks callback) ──────────────────────────────────────

export type IdentityConfig = {
  companyName: string;
  planTitle: string;
  planPeriod: string;
  presenter: string;
  presenterRole: string;
  boardName: string;
  date: string;
  heroLineA: string;
  heroLineB: string;
  heroLede: string;
  /** Suffix after companyName on the cover ("· Board Review"). */
  coverContextLabel: string;
  /** Bottom-grid labels on the cover. */
  metaPresentedByLabel: string;
  metaForLabel: string;
  metaDateLabel: string;
};

// ── SHARED PRIMITIVES ─────────────────────────────────────────────────────

export type CountSpec = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export type Tone = "up" | "down" | "neutral";
export type Severity = "Low" | "Med" | "High";
export type QuadrantTone = "sage" | "terracotta" | "ink";
export type BarTone = "committed" | "in-flight" | "exploratory";

// ── PER-SLIDE TYPES ───────────────────────────────────────────────────────

export type StatItem = {
  label: string;
  value: string;
  count: CountSpec;
  delta?: string;
  deltaTone?: Tone;
};
export type ThemeBlurb = { heading: string; body: string };
export type ExecutiveSummary = {
  kicker: string;
  title: string;
  subtitle: string;
  stats: StatItem[];
  blurbs: ThemeBlurb[];
};

export type Quadrant = { label: string; tone: QuadrantTone; items: string[] };
export type Situation = {
  kicker: string;
  title: string;
  subtitle: string;
  quadrants: Quadrant[];
};

export type Player = {
  name: string;
  x: number; // 0..1
  y: number; // 0..1
  size: number;
  self?: boolean;
};
export type MarketStat = { count: CountSpec; label: string; body: string };
export type MarketAxisLabels = {
  /** Chart-frame quadrant labels — top, bottom, right, left. */
  top: string;
  bottom: string;
  right: string;
  left: string;
};
export type Market = {
  kicker: string;
  title: string;
  subtitle: string;
  axisLabels: MarketAxisLabels;
  players: Player[];
  tam: MarketStat;
  growth: MarketStat;
  opening: string;
};

export type Pillar = {
  roman: string;
  name: string;
  promise: string;
  body: string;
  metrics: string[];
};
export type Priorities = {
  kicker: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  /** Per-card tag shown top-right of each pillar (defaults to "Pillar"). */
  pillarTag: string;
  pillars: Pillar[];
};

export type KR = { text: string; target: string };
export type Objective = {
  pillar: string;
  pillarRoman: string;
  objective: string;
  owner: string;
  krs: KR[];
};
export type OKRs = {
  kicker: string;
  title: string;
  subtitle: string;
  objectives: Objective[];
};

export type Lane = { roman: string; name: string };
export type RoadmapBar = {
  laneRoman: string;
  label: string;
  start: number;
  span: number;
  tone: BarTone;
};
export type RoadmapLegend = {
  committed: string;
  inFlight: string;
  exploratory: string;
};
export type Roadmap = {
  kicker: string;
  title: string;
  subtitle: string;
  /** Header for the leftmost column ("Pillar"). */
  pillarHeader: string;
  /** Headers for the four timeline columns ("Q1"…"Q4"). */
  quarterHeaders: string[];
  legend: RoadmapLegend;
  lanes: Lane[];
  bars: RoadmapBar[];
};

export type PLRow = { label: string; fy25: string; fy26: string; delta: string };
export type FinancialsBarCard = {
  title: string;
  unit: string;
  legendActual: string;
  legendPlan: string;
  legendCost: string;
};
export type FinancialsLineCard = {
  title: string;
  unit: string;
  legendGm: string;
  legendFcf: string;
  /** Label that appears on the plan-start divider line ("PLAN →"). */
  planDivider: string;
};
export type Financials = {
  kicker: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  quarters: string[];
  revenue: number[];
  costs: number[];
  gmSeries: number[];
  fcfSeries: number[];
  planStart: number;
  barCard: FinancialsBarCard;
  lineCard: FinancialsLineCard;
  plRows: PLRow[];
};

export type HeadcountRow = { fn: string; current: number; add: number };
export type BudgetSegment = { label: string; pct: number; color: string };
export type Resources = {
  kicker: string;
  title: string;
  subtitle: string;
  /** Header above the headcount bars ("Headcount by function"). */
  headcountHeader: string;
  /** Prefix on the budget header ("FY26 budget — " before the total). */
  budgetHeader: string;
  budgetTotal: string;
  headcount: HeadcountRow[];
  budget: BudgetSegment[];
  note: string;
};

export type RiskItem = {
  risk: string;
  likelihood: Severity;
  impact: Severity;
  mitigation: string;
  owner: string;
};
export type RisksColumnHeaders = {
  risk: string;
  likelihood: string;
  impact: string;
  mitigation: string;
  owner: string;
};
export type Risks = {
  kicker: string;
  title: string;
  subtitle: string;
  columnHeaders: RisksColumnHeaders;
  items: RiskItem[];
};

export type KPIItem = {
  label: string;
  value: string;
  target: string;
  count: CountSpec;
  series: number[];
  tone: Tone;
};
export type KPIs = {
  kicker: string;
  title: string;
  subtitle: string;
  items: KPIItem[];
};

export type AskItem = { n: string; title: string; body: string };
export type Asks = {
  /** Top-right eyebrow ("What we need from you"). */
  eyebrow: string;
  /** Accent phrase in the headline ("No surprises."). */
  headlineAccent: string;
  /** Suffix after the cover-hero callback quote ("— see slide 01."). */
  callbackSuffix: string;
  asks: AskItem[];
  closingNote: string;
};

export type SlidesConfig = {
  executiveSummary: ExecutiveSummary;
  situation: Situation;
  market: Market;
  priorities: Priorities;
  okrs: OKRs;
  roadmap: Roadmap;
  financials: Financials;
  resources: Resources;
  risks: Risks;
  kpis: KPIs;
  asks: Asks;
};

export type CustomizeConfig = {
  theme: ThemeConfig;
  identity: IdentityConfig;
  typography: TypographyConfig;
  slides: SlidesConfig;
};

// ── DEFAULTS ──────────────────────────────────────────────────────────────

export const DEFAULT_CONFIG: CustomizeConfig = {
  theme: {
    accentRgb: "199 93 62",
    backgroundTone: "cream",
    displayFont: "fraunces",
    sansFont: "inter",
  },
  identity: {
    companyName: "Acme Analytics",
    planTitle: "Strategic Plan",
    planPeriod: "Q4 FY25 Review",
    presenter: "Maya Okafor",
    presenterRole: "CEO",
    boardName: "Acme Board",
    date: "May 28, 2026",
    heroLineA: "A quiet year",
    heroLineB: "of compounding.",
    heroLede:
      "FY26 is a year for getting boring things right — keeping the customers we have, widening every gap between revenue and cost, and earning the right to expand into one new segment.",
    coverContextLabel: "Board Review",
    metaPresentedByLabel: "Presented by",
    metaForLabel: "For",
    metaDateLabel: "Date",
  },
  typography: DEFAULT_TYPOGRAPHY,
  slides: SLIDE_DEFAULTS,
};

// Background tone presets
export const BACKGROUND_TONES: Record<
  BackgroundToneId,
  { label: string; bg: string; bg50: string; ink: string }
> = {
  cream:    { label: "Cream",    bg: "245 240 232", bg50: "251 248 242", ink: "26 22 18" },
  ivory:    { label: "Ivory",    bg: "251 248 242", bg50: "255 253 247", ink: "26 22 18" },
  ash:      { label: "Ash",      bg: "232 229 222", bg50: "240 237 230", ink: "26 22 18" },
  graphite: { label: "Graphite", bg: "20 16 12",    bg50: "30 25 20",    ink: "245 240 232" },
};

export const ACCENT_PRESETS: { id: string; label: string; rgb: string }[] = [
  { id: "terracotta", label: "Terracotta", rgb: "199 93 62" },
  { id: "oxblood",    label: "Oxblood",    rgb: "138 36 36" },
  { id: "forest",     label: "Forest",     rgb: "60 100 70" },
  { id: "ink",        label: "Ink",        rgb: "26 22 18" },
  { id: "cobalt",     label: "Cobalt",     rgb: "38 70 142" },
  { id: "amber",      label: "Amber",      rgb: "201 142 49" },
];

export const DISPLAY_FONTS: Record<DisplayFontId, { label: string; cssVar: string; preview: string }> = {
  fraunces:   { label: "Fraunces",        cssVar: "var(--font-fraunces)",   preview: "Editorial · warm" },
  playfair:   { label: "Playfair Display", cssVar: "var(--font-playfair)",   preview: "Classic · refined" },
  ebgaramond: { label: "EB Garamond",      cssVar: "var(--font-ebgaramond)", preview: "Literary · old-style" },
};

export const SANS_FONTS: Record<SansFontId, { label: string; cssVar: string; preview: string }> = {
  inter:   { label: "Inter",         cssVar: "var(--font-inter)",   preview: "Modern · neutral" },
  manrope: { label: "Manrope",       cssVar: "var(--font-manrope)", preview: "Geometric · friendly" },
  plex:    { label: "IBM Plex Sans", cssVar: "var(--font-plex)",    preview: "Technical · square" },
};

// ── STORAGE ───────────────────────────────────────────────────────────────

export function hexToRgbTriplet(hex: string): string | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function rgbTripletToHex(triplet: string): string {
  const parts = triplet.trim().split(/\s+/).map((n) => Number.parseInt(n, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return "#000000";
  return "#" + parts.map((n) => n.toString(16).padStart(2, "0")).join("");
}

export function loadConfig(): CustomizeConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<CustomizeConfig>;
    // Deep-merge defaults so new schema fields don't crash older saved configs.
    return {
      theme: { ...DEFAULT_CONFIG.theme, ...(parsed.theme ?? {}) },
      identity: { ...DEFAULT_CONFIG.identity, ...(parsed.identity ?? {}) },
      typography: { ...DEFAULT_CONFIG.typography, ...(parsed.typography ?? {}) },
      slides: mergeSlides(parsed.slides),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function mergeSlides(saved: Partial<SlidesConfig> | undefined): SlidesConfig {
  const d = DEFAULT_CONFIG.slides;
  if (!saved) return d;
  return {
    executiveSummary: { ...d.executiveSummary, ...(saved.executiveSummary ?? {}) },
    situation:        { ...d.situation,        ...(saved.situation ?? {}) },
    market:           { ...d.market,           ...(saved.market ?? {}) },
    priorities:       { ...d.priorities,       ...(saved.priorities ?? {}) },
    okrs:             { ...d.okrs,             ...(saved.okrs ?? {}) },
    roadmap:          { ...d.roadmap,          ...(saved.roadmap ?? {}) },
    financials:       { ...d.financials,       ...(saved.financials ?? {}) },
    resources:        { ...d.resources,        ...(saved.resources ?? {}) },
    risks:            { ...d.risks,            ...(saved.risks ?? {}) },
    kpis:             { ...d.kpis,             ...(saved.kpis ?? {}) },
    asks:             { ...d.asks,             ...(saved.asks ?? {}) },
  };
}

export function saveConfig(cfg: CustomizeConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    // ignore quota / privacy mode failures
  }
}
