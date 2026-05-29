import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Wraps a single word in a clipped mask so a `data-rise` child can
 * animate up from below the baseline, revealing as it moves.
 */
export function MaskedWord({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <span className={cn("inline-block overflow-hidden align-top leading-[1.05]", className)}>
      <span data-rise className={cn("inline-block will-change-transform", innerClassName)}>
        {children}
      </span>
    </span>
  );
}
