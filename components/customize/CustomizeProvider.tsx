"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  update: (patch: ConfigPatch) => void;
  reset: () => void;
  hydrated: boolean;
  /** True when configs are persisted server-side for this signed-in user. */
  serverBacked: boolean;
};

const CustomizeContext = createContext<Ctx | null>(null);

export function useCustomize(): Ctx {
  const ctx = useContext(CustomizeContext);
  if (!ctx) throw new Error("useCustomize must be used inside <CustomizeProvider>");
  return ctx;
}

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

const SAVE_DEBOUNCE_MS = 700;

export function CustomizeProvider({
  children,
  initialServerConfig,
}: {
  children: ReactNode;
  /**
   * When passed (set by the root layout for authenticated, paid users), the
   * provider uses this as the canonical initial state and persists changes
   * server-side instead of to localStorage.
   */
  initialServerConfig?: CustomizeConfig | null;
}) {
  const serverBacked = initialServerConfig != null;

  const [config, setConfig] = useState<CustomizeConfig>(
    initialServerConfig ?? DEFAULT_CONFIG,
  );
  const [hydrated, setHydrated] = useState(serverBacked);

  // Hydrate from localStorage when not server-backed. When server-backed,
  // the initial config already matches both SSR and first client paint.
  useEffect(() => {
    if (serverBacked) {
      applyThemeToDOM(initialServerConfig as CustomizeConfig);
      return;
    }
    const loaded = loadConfig();
    setConfig(loaded);
    applyThemeToDOM(loaded);
    setHydrated(true);
  }, [serverBacked, initialServerConfig]);

  // Debounced server PUT, only when server-backed.
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistServer = useCallback((next: CustomizeConfig) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      fetch("/api/customize", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      }).catch(() => {
        // Surface failures via a toast later; swallow for now so the UI
        // doesn't break on transient network errors.
      });
    }, SAVE_DEBOUNCE_MS);
  }, []);

  // Flush any pending save on unmount.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const update = useCallback((patch: ConfigPatch) => {
    setConfig((prev) => {
      const next: CustomizeConfig = {
        theme: { ...prev.theme, ...(patch.theme ?? {}) },
        identity: { ...prev.identity, ...(patch.identity ?? {}) },
        slides: { ...prev.slides, ...(patch.slides ?? {}) },
      };
      applyThemeToDOM(next);
      if (serverBacked) persistServer(next);
      else saveConfig(next);
      return next;
    });
  }, [serverBacked, persistServer]);

  const reset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    applyThemeToDOM(DEFAULT_CONFIG);
    if (serverBacked) persistServer(DEFAULT_CONFIG);
    else saveConfig(DEFAULT_CONFIG);
  }, [serverBacked, persistServer]);

  const value = useMemo<Ctx>(
    () => ({ config, update, reset, hydrated, serverBacked }),
    [config, update, reset, hydrated, serverBacked],
  );

  return <CustomizeContext.Provider value={value}>{children}</CustomizeContext.Provider>;
}
