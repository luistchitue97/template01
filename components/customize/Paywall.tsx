import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PRODUCT_URL =
  process.env.NEXT_PUBLIC_TEMPLATE_PRODUCT_URL ??
  "https://luistchitue.com/templates/template-01";

export function Paywall({ userEmail }: { userEmail?: string | null }) {
  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-[640px] flex-col justify-center px-8 py-16">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-ink/55 transition hover:text-ink"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back to deck
        </Link>
        <Eyebrow accent>Locked</Eyebrow>
      </div>

      <header className="mt-16">
        <h1 className="display text-[64px] leading-[0.95] tracking-tightest-display text-ink">
          One unlock,{" "}
          <span className="text-terracotta-300">every template.</span>
        </h1>
        <p className="mt-6 text-[16px] leading-relaxed text-ink/70">
          The $200 lifetime pass unlocks editing for this template and every
          other one on the marketplace — forever. You{userEmail ? ` (${userEmail})` : ""} are signed in
          but don&rsquo;t have the pass yet.
        </p>
      </header>

      <div className="mt-12 rounded-2xl border border-ink/15 bg-cream-50/60 p-7">
        <div className="text-[11px] uppercase tracking-[0.22em] text-ink/55">
          What you get
        </div>
        <ul className="mt-4 space-y-2 text-[15px] text-ink/80">
          <li className="flex gap-3">
            <span className="text-terracotta-300">·</span>
            Edit every slide&rsquo;s copy, numbers, charts and theme
          </li>
          <li className="flex gap-3">
            <span className="text-terracotta-300">·</span>
            Configs sync across devices, tied to your account
          </li>
          <li className="flex gap-3">
            <span className="text-terracotta-300">·</span>
            Every future template on the marketplace, included
          </li>
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <span className="display text-[44px] leading-none text-ink tnum">
          $200
          <span className="display text-[16px] text-ink/55"> · lifetime</span>
        </span>
        <a
          href={PRODUCT_URL}
          className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-cream transition hover:bg-terracotta-300"
        >
          Unlock now
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}
