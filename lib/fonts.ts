import {
  EB_Garamond,
  Fraunces,
  IBM_Plex_Sans,
  Inter,
  Manrope,
  Playfair_Display,
} from "next/font/google";

// ── DISPLAY (serif) ──────────────────────────────────────────────────────
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});

export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-ebgaramond",
  display: "swap",
  preload: false,
});

// ── SANS ─────────────────────────────────────────────────────────────────
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
  preload: false,
});

export const FONT_VARS = [
  fraunces.variable,
  playfair.variable,
  ebGaramond.variable,
  inter.variable,
  manrope.variable,
  plexSans.variable,
].join(" ");
