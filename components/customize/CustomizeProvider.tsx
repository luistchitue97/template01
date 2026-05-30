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

export type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

type Ctx = {
  config: CustomizeConfig;
  update: (patch: ConfigPatch) => void;
  reset: () => void;
  hydrated: boolean;
  /** True when configs are persisted server-side for this signed-in user. */
  serverBacked: boolean;
  /** Save lifecycle (server-backed mode only — stays "idle" for guests). */
  saveStatus: SaveStatus;
  /** Last save error message, if any. */
  saveError: string | null;
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
const SAVED_FLASH_MS = 1500;

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistServer = useCallback((next: CustomizeConfig) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
    setSaveStatus("pending");
    setSaveError(null);

    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        const res = await fetch("/api/customize", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(next),
        });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${body || res.statusText}`);
        }
        setSaveStatus("saved");
        savedFlashRef.current = setTimeout(() => setSaveStatus("idle"), SAVED_FLASH_MS);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Save failed";
        setSaveStatus("error");
        setSaveError(message);
        // Surface in DevTools console so it's not invisible.
        console.error("[customize] save failed:", err);
      }
    }, SAVE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
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
    () => ({ config, update, reset, hydrated, serverBacked, saveStatus, saveError }),
    [config, update, reset, hydrated, serverBacked, saveStatus, saveError],
  );

  return <CustomizeContext.Provider value={value}>{children}</CustomizeContext.Provider>;
}
