"use client";

import { useCustomize } from "@/components/customize/CustomizeProvider";
import { cn } from "@/lib/cn";

const LABEL = {
  idle: "Up to date",
  pending: "Editing…",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
} as const;

export function SaveIndicator() {
  const { serverBacked, saveStatus, saveError } = useCustomize();

  const tone =
    saveStatus === "error"
      ? "text-red-700"
      : saveStatus === "saved"
      ? "text-terracotta-300"
      : "text-ink/55";

  const dotTone =
    saveStatus === "error"
      ? "bg-red-700"
      : saveStatus === "saving" || saveStatus === "pending"
      ? "bg-terracotta-300 animate-pulse"
      : saveStatus === "saved"
      ? "bg-terracotta-300"
      : "bg-ink/35";

  return (
    <div className="flex items-center gap-2.5" title={saveError ?? undefined}>
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", dotTone)} />
      <span className={cn("text-[10.5px] uppercase tracking-[0.22em]", tone)}>
        {LABEL[saveStatus]}
      </span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink/35">
        · {serverBacked ? "Cloud" : "Local"}
      </span>
    </div>
  );
}
