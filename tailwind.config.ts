import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background tones — driven by --bg-rgb / --bg-50-rgb so the
        // customize page can swap them at runtime. Falls back to the
        // editorial-warm cream by default (see globals.css).
        cream: {
          DEFAULT: "rgb(var(--bg-rgb) / <alpha-value>)",
          50: "rgb(var(--bg-50-rgb) / <alpha-value>)",
          100: "rgb(var(--bg-rgb) / <alpha-value>)",
          200: "#ECE3D2",
          300: "#DFD1B6",
        },
        ink: {
          DEFAULT: "rgb(var(--ink-rgb) / <alpha-value>)",
          50: "rgb(var(--ink-rgb) / <alpha-value>)",
          100: "rgb(var(--ink-rgb) / <alpha-value>)",
          200: "rgb(var(--ink-rgb) / <alpha-value>)",
          300: "rgb(var(--ink-rgb) / <alpha-value>)",
        },
        // Accent — entirely CSS-var driven so the customize page rewrites
        // every accent usage (text/bg/border) by changing --accent-rgb.
        terracotta: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          50:  "rgb(var(--accent-rgb) / <alpha-value>)",
          100: "rgb(var(--accent-rgb) / <alpha-value>)",
          200: "rgb(var(--accent-rgb) / <alpha-value>)",
          300: "rgb(var(--accent-rgb) / <alpha-value>)",
          400: "rgb(var(--accent-rgb) / <alpha-value>)",
        },
        sage: "#8AA079",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        "tightest-display": "-0.035em",
      },
    },
  },
  plugins: [],
};

export default config;
