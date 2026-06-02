import { z } from "zod";
import { DEFAULT_CONFIG, mergeSlides, type CustomizeConfig } from "./customize";

// Tolerant top-level schema. We require the three top-level slices to be
// objects, but accept unknown shapes within them — `normalizeConfig` then
// deep-merges with DEFAULT_CONFIG so missing or unexpected fields can't
// break the renderer. All payload content ends up as React text children
// (escaped) or numeric values, so the XSS surface is minimal.
const SliceSchema = z.record(z.string(), z.unknown());

export const CustomizeConfigInputSchema = z
  .object({
    theme:      SliceSchema.optional(),
    identity:   SliceSchema.optional(),
    typography: SliceSchema.optional(),
    slices:     SliceSchema.optional(),  // tolerated typo guard, ignored
    slides:     SliceSchema.optional(),
  })
  .passthrough();

export const MAX_CONFIG_BYTES = 200_000; // 200 KB cap on a single config blob

export function normalizeConfig(parsed: unknown): CustomizeConfig {
  const p = (parsed ?? {}) as Partial<CustomizeConfig>;
  // Note: theme/identity/typography are flat enough that a shallow merge is
  // still safe; only `slides` has nested objects (lineCard, axisLabels,
  // legend, columnHeaders, headlineNoun, etc.) that need deep-merge so
  // newer fields fall through to defaults. `mergeSlides` handles that.
  return {
    theme:      { ...DEFAULT_CONFIG.theme,      ...(p.theme ?? {}) },
    identity:   { ...DEFAULT_CONFIG.identity,   ...(p.identity ?? {}) },
    typography: { ...DEFAULT_CONFIG.typography, ...(p.typography ?? {}) },
    slides:     mergeSlides(p.slides),
  };
}
