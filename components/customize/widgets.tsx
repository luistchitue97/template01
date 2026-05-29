"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

// ── LAYOUT ────────────────────────────────────────────────────────────────

export function Section({
  id,
  number,
  title,
  children,
}: {
  id?: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-16">
      <div className="flex items-baseline gap-4 border-t border-ink/15 pt-5">
        <span className="display text-terracotta-300 text-[16px] tnum">{number}</span>
        <h2 className="display text-[36px] leading-none text-ink">{title}</h2>
      </div>
      <div className="mt-8 space-y-7">{children}</div>
    </section>
  );
}

export function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] items-baseline gap-8">
      <div>
        <label className="block text-[11px] uppercase tracking-[0.22em] text-ink/55">{label}</label>
        {hint ? <p className="mt-1 text-[11px] leading-snug text-ink/45">{hint}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// ── PRIMITIVE FIELDS ──────────────────────────────────────────────────────

export function TextField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full border-b border-ink/20 bg-transparent py-2.5 text-[15px] text-ink outline-none transition placeholder:text-ink/30 focus:border-terracotta-300",
        className,
      )}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full resize-y border border-ink/15 bg-transparent px-3 py-2 text-[14.5px] leading-relaxed text-ink outline-none transition placeholder:text-ink/30 focus:border-terracotta-300",
        className,
      )}
    />
  );
}

export function NumberField({
  value,
  onChange,
  step = 1,
  min,
  max,
  className,
  suffix,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  suffix?: string;
}) {
  return (
    <div className={cn("inline-flex items-baseline gap-2 border-b border-ink/20 focus-within:border-terracotta-300", className)}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const v = e.target.valueAsNumber;
          onChange(Number.isFinite(v) ? v : 0);
        }}
        className="w-full bg-transparent py-2.5 text-[15px] tnum text-ink outline-none"
      />
      {suffix ? <span className="text-[11px] uppercase tracking-[0.18em] text-ink/45">{suffix}</span> : null}
    </div>
  );
}

export function SelectField<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] transition",
              active ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/75 hover:border-ink/40",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ── LIST EDITOR ───────────────────────────────────────────────────────────

export function ListEditor<T>({
  items,
  onChange,
  newItem,
  renderItem,
  itemLabel,
  addLabel = "Add item",
  minItems = 0,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  itemLabel?: (item: T, i: number) => string;
  addLabel?: string;
  minItems?: number;
}) {
  const updateAt = (i: number, patch: Partial<T>) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    onChange(next);
  };
  const removeAt = (i: number) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, idx) => idx !== i));
  };
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };
  const moveDown = (i: number) => {
    if (i === items.length - 1) return;
    const next = [...items];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    onChange(next);
  };
  const add = () => onChange([...items, newItem()]);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-ink/12 bg-cream-50/60 p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">
              {itemLabel ? itemLabel(item, i) : `Item ${i + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <IconBtn label="Move up"   disabled={i === 0}              onClick={() => moveUp(i)}>↑</IconBtn>
              <IconBtn label="Move down" disabled={i === items.length - 1} onClick={() => moveDown(i)}>↓</IconBtn>
              <IconBtn label="Remove"    disabled={items.length <= minItems} onClick={() => removeAt(i)} danger>×</IconBtn>
            </div>
          </div>
          <div className="space-y-3">{renderItem(item, (patch) => updateAt(i, patch), i)}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-full border border-dashed border-ink/30 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-ink/65 transition hover:border-terracotta-300 hover:text-terracotta-300"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
  danger,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-full border text-[14px] transition",
        disabled
          ? "border-ink/8 text-ink/20"
          : danger
          ? "border-ink/15 text-ink/65 hover:border-terracotta-300 hover:text-terracotta-300"
          : "border-ink/15 text-ink/65 hover:border-ink/45 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

// ── COUNT SPEC EDITOR ─────────────────────────────────────────────────────

export type CountSpecLike = {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function CountSpecEditor({
  value,
  onChange,
}: {
  value: CountSpecLike;
  onChange: (next: CountSpecLike) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <FieldLabel small label="Prefix">
        <TextField
          value={value.prefix ?? ""}
          onChange={(v) => onChange({ ...value, prefix: v })}
          placeholder="$"
        />
      </FieldLabel>
      <FieldLabel small label="Value">
        <NumberField
          value={value.to}
          onChange={(n) => onChange({ ...value, to: n })}
          step={0.1}
        />
      </FieldLabel>
      <FieldLabel small label="Suffix">
        <TextField
          value={value.suffix ?? ""}
          onChange={(v) => onChange({ ...value, suffix: v })}
          placeholder="M"
        />
      </FieldLabel>
      <FieldLabel small label="Decimals">
        <NumberField
          value={value.decimals ?? 0}
          onChange={(n) => onChange({ ...value, decimals: Math.max(0, Math.min(4, Math.round(n))) })}
          step={1}
          min={0}
          max={4}
        />
      </FieldLabel>
    </div>
  );
}

// ── FIELD LABEL (compact inline) ──────────────────────────────────────────

export function FieldLabel({
  label,
  small,
  children,
}: {
  label: string;
  small?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        className={cn(
          "block uppercase text-ink/55",
          small ? "text-[10px] tracking-[0.18em]" : "text-[11px] tracking-[0.22em]",
        )}
      >
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
