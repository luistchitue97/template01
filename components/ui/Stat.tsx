import { cn } from "@/lib/cn";

export type CountSpec = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

function formatCount({ to, prefix = "", suffix = "", decimals = 0 }: CountSpec) {
  return `${prefix}${to.toFixed(decimals)}${suffix}`;
}

export function Stat({
  label,
  value,
  count,
  delta,
  deltaTone = "neutral",
  className,
}: {
  label: string;
  value?: string;
  count?: CountSpec;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
  className?: string;
}) {
  const toneClass =
    deltaTone === "up"
      ? "text-sage"
      : deltaTone === "down"
      ? "text-terracotta-400"
      : "text-ink/50";

  const toneGlyph =
    deltaTone === "up" ? "▲" : deltaTone === "down" ? "▼" : "";

  // Strip any leading direction glyph the user (or a default) typed into the
  // caption, so the indicator stays in sync with `deltaTone` instead of
  // showing two arrows or a mismatched one.
  const deltaText = delta ? delta.replace(/^[\s▲▼△▽↑↓⬆⬇]+/, "") : "";

  const initialText = count ? formatCount(count) : (value ?? "");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[calc(13px*var(--scale-label))] uppercase tracking-[0.2em] text-ink/55">{label}</span>
      {count ? (
        <span
          className="display text-[calc(44px*var(--scale-title))] leading-none text-ink tnum"
          data-count={String(count.to)}
          data-prefix={count.prefix ?? ""}
          data-suffix={count.suffix ?? ""}
          data-decimals={String(count.decimals ?? 0)}
        >
          {initialText}
        </span>
      ) : (
        <span className="display text-[calc(44px*var(--scale-title))] leading-none text-ink tnum">{value}</span>
      )}
      {delta ? (
        <span className={cn("inline-flex items-baseline gap-1.5 text-[calc(14px*var(--scale-label))] tnum", toneClass)}>
          {toneGlyph ? <span aria-hidden>{toneGlyph}</span> : null}
          <span>{deltaText}</span>
        </span>
      ) : null}
    </div>
  );
}
