import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[calc(14px*var(--scale-label))] uppercase tracking-[0.22em]",
        accent ? "text-terracotta-300" : "text-ink/55",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-[1px] w-6",
          accent ? "bg-terracotta-300" : "bg-ink/30",
        )}
      />
      {children}
    </span>
  );
}
