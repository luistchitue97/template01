import type { SlidesConfig } from "./customize";

export const SLIDE_DEFAULTS: SlidesConfig = {
  executiveSummary: {
    title: "Where we stand,\nin five numbers.",
    subtitle:
      "A snapshot at the close of FY25. The fundamentals are healthy; the curve is bending the right way; the next twelve months are about deliberate compounding, not heroics.",
    stats: [
      { label: "ARR",                  value: "$42.1M", count: { to: 42.1, prefix: "$", suffix: "M", decimals: 1 }, delta: "▲ 18.4% YoY", deltaTone: "up" },
      { label: "Net Revenue Retention",value: "118%",   count: { to: 118, suffix: "%" },                            delta: "▲ 3.2 pt",    deltaTone: "up" },
      { label: "Gross Margin",         value: "74%",    count: { to: 74,  suffix: "%" },                            delta: "▼ 0.8 pt",    deltaTone: "down" },
      { label: "Magic Number",         value: "1.3",    count: { to: 1.3, decimals: 1 },                             delta: "▲ 0.2",       deltaTone: "up" },
      { label: "Headcount",            value: "186",    count: { to: 186 },                                           delta: "+24 hires",   deltaTone: "neutral" },
    ],
    blurbs: [
      { heading: "Strong base",        body: "Gross retention is at an all-time high; the product is sticky in the segments we've picked." },
      { heading: "Margin pressure",    body: "Cloud costs and a maturing AE org compressed GM by ~80 bps. Reversible." },
      { heading: "Expansion appetite", body: "Mid-market is asking for adjacencies we don't yet build. One bet for FY26." },
    ],
  },

  situation: {
    title: "An honest read of the room.",
    subtitle: "Four quadrants. No varnish. This is the picture the FY26 plan is built on.",
    quadrants: [
      { label: "What's working", tone: "sage", items: [
        "Gross retention up 4 pts year-over-year",
        "Sales cycle in mid-market shortened by 11 days",
        "Two flagship integrations now drive 38% of inbound",
      ]},
      { label: "What's not", tone: "terracotta", items: [
        "Cloud cost growth (+34%) outran usage growth (+22%)",
        "Onboarding still loses ~9% of new logos before 60 days",
        "Enterprise pipeline coverage thin in EMEA",
      ]},
      { label: "Open questions", tone: "ink", items: [
        "Is the analytics adjacency a feature or a second product?",
        "Do we re-org GTM by segment or stay vertical-led?",
        "When does AI cost curve flatten enough to ship the agent tier?",
      ]},
      { label: "Quiet bets", tone: "ink", items: [
        "Self-serve PLG motion seeded under the radar — early ARR $0.9M",
        "Two strategic design partners on the data-warehouse path",
        "Internal AI tooling cut support ticket time by 28%",
      ]},
    ],
  },

  market: {
    title: "A market that finally rewards focus.",
    subtitle: "The legacy vendors are slow; the new entrants are narrow. There is a real opening for the company that does the boring half well.",
    players: [
      { name: "Acme",       x: 0.72, y: 0.62, size: 24, self: true },
      { name: "Northwind",  x: 0.30, y: 0.78, size: 30 },
      { name: "Pylon",      x: 0.55, y: 0.30, size: 14 },
      { name: "Mira",       x: 0.85, y: 0.36, size: 12 },
      { name: "Lattice OS", x: 0.18, y: 0.45, size: 22 },
      { name: "Pico",       x: 0.92, y: 0.78, size: 10 },
    ],
    tam: {
      count: { to: 4.8, prefix: "$", suffix: "B", decimals: 1 },
      label: "Serviceable Available Market (FY26)",
      body: "Growing 19% CAGR. Top-3 legacy vendors hold 58% share but lost two enterprise marquee accounts to modern challengers in Q4.",
    },
    growth: {
      count: { to: 3.1, suffix: "×", decimals: 1 },
      label: "Our growth vs. category average",
      body: "We are taking share in the mid-market band where the legacy cohort is most exposed and the modern entrants are too thin to win procurement.",
    },
    opening:
      "The opening: a credible breadth player that ships modern UX without abandoning the workflows the legacy buyers have built around.",
  },

  priorities: {
    title: "Three bets",
    titleAccent: "for the year.",
    subtitle: "Everything else is service to these. If a thing isn't on this slide, it doesn't get a roadmap line.",
    pillars: [
      {
        roman: "I", name: "Retention",
        promise: "Earn the right to next year's revenue.",
        body: "Push gross retention to 94%+ by closing the onboarding gap and re-platforming the support layer. The cheapest dollar is the one we already won.",
        metrics: ["GRR ≥ 94%", "Onboarding completion ≥ 85%", "CSAT ≥ 4.6"],
      },
      {
        roman: "II", name: "Margin",
        promise: "Buy ourselves time and optionality.",
        body: "Reverse the 80bps GM slide. Cloud, support automation, and sales productivity each contribute a third. We exit FY26 with 76% GM and a clean cost narrative.",
        metrics: ["GM ≥ 76%", "Cloud cost / ARR ↓ 22%", "AE productivity ↑ 18%"],
      },
      {
        roman: "III", name: "Expansion",
        promise: "One bet, executed properly.",
        body: "Ship the data-warehouse adjacency to the design-partner cohort by end of Q2. No platform play; no second product. One narrow, ownable wedge.",
        metrics: ["8 paid design partners", "$3M new-product ARR", "NRR floor 115%"],
      },
    ],
  },

  okrs: {
    title: "The promises behind each bet.",
    subtitle: "One objective per pillar. Three measurable results. A single accountable owner.",
    objectives: [
      {
        pillar: "Retention", pillarRoman: "I",
        objective: "New customers cross the activation line in half the time.",
        owner: "S. Patel · CX",
        krs: [
          { text: "Time-to-first-value",    target: "21 → 10 days" },
          { text: "Onboarding completion",  target: "72% → 85%" },
          { text: "60-day logo churn",      target: "9.0% → 4.5%" },
        ],
      },
      {
        pillar: "Margin", pillarRoman: "II",
        objective: "We stop renting headroom we don't need.",
        owner: "J. Lin · CFO",
        krs: [
          { text: "Cloud spend / ARR",      target: "13.2% → 10.3%" },
          { text: "Support cost / ticket",  target: "$11.40 → $7.80" },
          { text: "Gross margin",           target: "74.0% → 76.0%" },
        ],
      },
      {
        pillar: "Expansion", pillarRoman: "III",
        objective: "Warehouse adjacency ships to paying design partners.",
        owner: "R. Mehra · Product",
        krs: [
          { text: "GA design partners",     target: "0 → 8" },
          { text: "New-product ARR",        target: "$0 → $3.0M" },
          { text: "NRR among adopters",     target: "≥ 130%" },
        ],
      },
    ],
  },

  roadmap: {
    title: "What ships, and when.",
    subtitle: "Three swimlanes, one per pillar. No initiative on this chart that doesn't tie to an OKR on the previous slide.",
    lanes: [
      { roman: "I",   name: "Retention" },
      { roman: "II",  name: "Margin" },
      { roman: "III", name: "Expansion" },
    ],
    bars: [
      { laneRoman: "I",   label: "Onboarding rebuild",                start: 0,   span: 2,   tone: "committed" },
      { laneRoman: "I",   label: "Support tier consolidation",        start: 1.5, span: 1.5, tone: "in-flight" },
      { laneRoman: "I",   label: "Health-score v2",                   start: 2.5, span: 1.5, tone: "exploratory" },
      { laneRoman: "II",  label: "Cloud right-sizing",                start: 0,   span: 1.5, tone: "committed" },
      { laneRoman: "II",  label: "Support automation",                start: 1,   span: 2.5, tone: "in-flight" },
      { laneRoman: "II",  label: "AE enablement",                     start: 0.5, span: 3.5, tone: "exploratory" },
      { laneRoman: "III", label: "Warehouse alpha (design partners)", start: 0,   span: 2,   tone: "committed" },
      { laneRoman: "III", label: "Beta + pricing",                    start: 2,   span: 1.5, tone: "in-flight" },
      { laneRoman: "III", label: "GA + first 8 paying",               start: 3,   span: 1,   tone: "exploratory" },
    ],
  },

  financials: {
    title: "$57.8M ARR.",
    titleAccent: "Positive FCF.",
    subtitle: "Free-cash-flow positive in Q4 without slowing growth. Margin discipline funds the expansion bet — not new dilution.",
    quarters:   ["Q1·25", "Q2·25", "Q3·25", "Q4·25", "Q1·26", "Q2·26", "Q3·26", "Q4·26"],
    revenue:    [8.6, 9.4, 10.4, 11.8, 12.6, 13.7, 15.0, 16.5],
    costs:      [7.4, 7.9, 8.6,  9.5,  9.9,  10.4, 11.1, 11.9],
    gmSeries:   [76, 75, 75, 75, 74, 74, 75, 76],
    fcfSeries:  [-8, -6, -5, -6, -3, -1, 2, 4],
    planStart: 4,
    plRows: [
      { label: "ARR (exit)",      fy25: "$42.1M", fy26: "$57.8M", delta: "+37%" },
      { label: "Revenue",         fy25: "$40.2M", fy26: "$57.8M", delta: "+44%" },
      { label: "Gross margin",    fy25: "74.0%",  fy26: "76.0%",  delta: "+2.0 pt" },
      { label: "S&M / Revenue",   fy25: "41%",    fy26: "37%",    delta: "−4 pt" },
      { label: "R&D / Revenue",   fy25: "27%",    fy26: "26%",    delta: "−1 pt" },
      { label: "FCF margin",      fy25: "−6%",    fy26: "+4%",    delta: "+10 pt" },
    ],
  },

  resources: {
    title: "What it costs to mean it.",
    subtitle: "38 net new hires. Budget weight shifts toward the warehouse bet without starving the core. The Q4 FCF figure already prices this in.",
    budgetTotal: "$46.2M",
    headcount: [
      { fn: "Engineering",         current: 68, add: 14 },
      { fn: "Product & Design",    current: 18, add: 4 },
      { fn: "Go-to-Market",        current: 54, add: 12 },
      { fn: "Customer Experience", current: 26, add: 6 },
      { fn: "G&A",                 current: 20, add: 2 },
    ],
    budget: [
      { label: "People",          pct: 62, color: "bg-terracotta-300" },
      { label: "Cloud & infra",   pct: 13, color: "bg-ink/80" },
      { label: "GTM programs",    pct: 14, color: "bg-ink/40" },
      { label: "Tools & vendors", pct: 7,  color: "bg-ink/20" },
      { label: "Other",           pct: 4,  color: "bg-ink/10" },
    ],
    note: "~$3.4M shifts from G&A and tools into product/engineering for the warehouse bet. Cloud spend grows in absolute dollars but shrinks as a share of revenue.",
  },

  risks: {
    title: "What could derail this.",
    subtitle: "Five real risks. Each has a named owner and a way out. Reviewed in board cadence; tracked on the same dashboard as the OKRs.",
    items: [
      { risk: "Warehouse build slips past Q2",                          likelihood: "Med",  impact: "High", mitigation: "Two-track plan: design-partner alpha de-risked against GA. Cut scope before slipping date.", owner: "R. Mehra" },
      { risk: "Cloud cost-down underdelivers",                          likelihood: "Med",  impact: "Med",  mitigation: "Three independent bets (right-sizing, tiered storage, regional consolidation). Any two hit the number.", owner: "T. Owusu" },
      { risk: "Enterprise EMEA coverage thin",                          likelihood: "High", impact: "Med",  mitigation: "Frankfurt SE hub stood up by Q2. London partner-led pipeline as bridge.", owner: "D. Carvalho" },
      { risk: "Onboarding rebuild adds churn before reducing it",       likelihood: "Low",  impact: "High", mitigation: "Phased rollout (20% / 50% / 100%) with explicit kill criteria at each gate.", owner: "S. Patel" },
      { risk: "Key-person concentration in platform team",              likelihood: "Med",  impact: "High", mitigation: "Two senior backfills committed in H1 + documented runbooks for top-5 systems.", owner: "M. Okafor" },
    ],
  },

  kpis: {
    title: "How we'll know it's working.",
    subtitle: "The board dashboard, distilled. Eight numbers. Reviewed monthly. Nothing else gets the same airtime.",
    items: [
      { label: "ARR ($M)",            value: "42.1",  target: "→ 57.8",  count: { to: 42.1, decimals: 1 },                                    series: [29, 31, 33, 35, 37, 39, 40, 42],          tone: "up" },
      { label: "Gross retention",     value: "91%",   target: "→ 94%",   count: { to: 91, suffix: "%" },                                       series: [86, 87, 87, 88, 89, 90, 91, 91],          tone: "up" },
      { label: "Net revenue ret.",    value: "118%",  target: "≥ 120%",  count: { to: 118, suffix: "%" },                                      series: [110, 112, 113, 115, 116, 117, 118, 118],  tone: "up" },
      { label: "Gross margin",        value: "74%",   target: "→ 76%",   count: { to: 74, suffix: "%" },                                       series: [76, 75, 75, 75, 74, 74, 74, 74],          tone: "down" },
      { label: "Cloud / ARR",         value: "13.2%", target: "→ 10.3%", count: { to: 13.2, suffix: "%", decimals: 1 },                        series: [9, 10, 11, 12, 12, 13, 13, 13],           tone: "down" },
      { label: "AE productivity",     value: "$1.4M", target: "→ $1.7M", count: { to: 1.4, prefix: "$", suffix: "M", decimals: 1 },            series: [1.1, 1.15, 1.2, 1.2, 1.3, 1.35, 1.4, 1.4], tone: "up" },
      { label: "Time-to-value (days)",value: "21",    target: "→ 10",    count: { to: 21 },                                                    series: [28, 26, 25, 24, 23, 22, 22, 21],          tone: "up" },
      { label: "Magic number",        value: "1.3",   target: "≥ 1.3",   count: { to: 1.3, decimals: 1 },                                      series: [0.9, 1.0, 1.0, 1.1, 1.2, 1.2, 1.3, 1.3], tone: "up" },
    ],
  },

  asks: {
    asks: [
      { n: "01", title: "Approve the FY26 budget envelope.",                     body: "$46.2M operating, with the people/cloud/GTM split shown on slide 09. No new dilution required." },
      { n: "02", title: "Confirm the warehouse adjacency as the one expansion bet.", body: "Endorse a single product wedge for FY26 — and the discipline of not opening a second." },
      { n: "03", title: "Bless the EMEA enterprise hub in Frankfurt.",           body: "Lease commit + first three hires. Pays back inside FY26 on the coverage gap noted in slide 10." },
    ],
    closingNote: "Thank you · Q&A",
  },
};
