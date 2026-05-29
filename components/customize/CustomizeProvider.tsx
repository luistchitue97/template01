"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BACKGROUND_TONES,
  DEFAULT_CONFIG,
  DISPLAY_FONTS,
  SANS_FONTS,
  type CustomizeConfig,
  type IdentityConfig,
  type SlidesConfig,
  type ThemeConfig,
  loadConfig,
  saveConfig,
} from "@/lib/customize";

type ConfigPatch = {
  theme?: Partial<ThemeConfig>;
  identity?: Partial<IdentityConfig>;
  slides?: Partial<SlidesConfig>;
};

type Ctx = {
  config: CustomizeConfig;
  /** Patch (shallow) the top-level theme/identity slices. */
  update: (patch: ConfigPatch) => void;
  reset: () => void;
  hydrated: boolean;
};

const CustomizeContext = createContext<Ctx | null>(null);

export function useCustomize(): Ctx {
  const ctx = useContext(CustomizeContext);
  if (!ctx) throw new Error("useCustomize must be used inside <CustomizeProvider>");
  return ctx;
}

/** Apply the config's theme to `document.documentElement` via CSS variables. */
function applyThemeToDOM(cfg: CustomizeConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const { theme } = cfg;

  const tone = BACKGROUND_TONES[theme.backgroundTone] ?? BACKGROUND_TONES.cream;
  root.style.setProperty("--accent-rgb", theme.accentRgb);
  root.style.setProperty("--bg-rgb", tone.bg);
  root.style.setProperty("--bg-50-rgb", tone.bg50);
  root.style.setProperty("--ink-rgb", tone.ink);

  const displayVar = DISPLAY_FONTS[theme.displayFont]?.cssVar ?? "var(--font-fraunces)";
  const sansVar    = SANS_FONTS[theme.sansFont]?.cssVar       ?? "var(--font-inter)";
  root.style.setProperty("--font-display", displayVar);
  root.style.setProperty("--font-sans", sansVar);
}

export function CustomizeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<CustomizeConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on first client paint.
  useEffect(() => {
    const loaded = loadConfig();
    setConfig(loaded);
    applyThemeToDOM(loaded);
    setHydrated(true);
  }, []);

  const update = useCallback((patch: ConfigPatch) => {
    setConfig((prev) => {
      const next: CustomizeConfig = {
        theme: { ...prev.theme, ...(patch.theme ?? {}) },
        identity: { ...prev.identity, ...(patch.identity ?? {}) },
        slides: { ...prev.slides, ...(patch.slides ?? {}) },
      };
      applyThemeToDOM(next);
      saveConfig(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    applyThemeToDOM(DEFAULT_CONFIG);
    saveConfig(DEFAULT_CONFIG);
  }, []);

  const value = useMemo<Ctx>(() => ({ config, update, reset, hydrated }), [config, update, reset, hydrated]);

  return <CustomizeContext.Provider value={value}>{children}</CustomizeContext.Provider>;
}
