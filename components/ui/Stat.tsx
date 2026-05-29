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

  const initialText = count ? formatCount(count) : (value ?? "");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-ink/55">{label}</span>
      {count ? (
        <span
          className="display text-[44px] leading-none text-ink tnum"
          data-count={String(count.to)}
          data-prefix={count.prefix ?? ""}
          data-suffix={count.suffix ?? ""}
          data-decimals={String(count.decimals ?? 0)}
        >
          {initialText}
        </span>
      ) : (
        <span className="display text-[44px] leading-none text-ink tnum">{value}</span>
      )}
      {delta ? <span className={cn("text-[11px] tnum", toneClass)}>{delta}</span> : null}
    </div>
  );
}
