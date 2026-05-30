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
  title: string;
  subtitle: string;
  stats: StatItem[];
  blurbs: ThemeBlurb[];
};

export type Quadrant = { label: string; tone: QuadrantTone; items: string[] };
export type Situation = { title: string; subtitle: string; quadrants: Quadrant[] };

export type Player = {
  name: string;
  x: number; // 0..1
  y: number; // 0..1
  size: number;
  self?: boolean;
};
export type MarketStat = { count: CountSpec; label: string; body: string };
export type Market = {
  title: string;
  subtitle: string;
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
  title: string;
  titleAccent?: string;
  subtitle: string;
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
export type OKRs = { title: string; subtitle: string; objectives: Objective[] };

export type Lane = { roman: string; name: string };
export type RoadmapBar = {
  laneRoman: string;
  label: string;
  start: number;
  span: number;
  tone: BarTone;
};
export type Roadmap = {
  title: string;
  subtitle: string;
  lanes: Lane[];
  bars: RoadmapBar[];
};

export type PLRow = { label: string; fy25: string; fy26: string; delta: string };
export type Financials = {
  title: string;
  titleAccent?: string;
  subtitle: string;
  quarters: string[];
  revenue: number[];
  costs: number[];
  gmSeries: number[];
  fcfSeries: number[];
  planStart: number;
  plRows: PLRow[];
};

export type HeadcountRow = { fn: string; current: number; add: number };
export type BudgetSegment = { label: string; pct: number; color: string };
export type Resources = {
  title: string;
  subtitle: string;
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
export type Risks = { title: string; subtitle: string; items: RiskItem[] };

export type KPIItem = {
  label: string;
  value: string;
  target: string;
  count: CountSpec;
  series: number[];
  tone: Tone;
};
export type KPIs = { title: string; subtitle: string; items: KPIItem[] };

export type AskItem = { n: string; title: string; body: string };
export type Asks = { asks: AskItem[]; closingNote: string };

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
  },
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
