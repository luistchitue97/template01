export function MobileGate() {
  return (
    <div
      role="dialog"
      aria-label="Best viewed on a larger screen"
      className="md:hidden fixed inset-0 z-[100] flex flex-col bg-cream px-6 py-10 text-ink"
    >
      <header className="flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">
          Template 01
        </span>
        <span className="rounded-full border border-terracotta-300/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-terracotta-300">
          Desktop only
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center">
        <span className="display text-terracotta-300 text-[14px] tnum">No. 01</span>
        <h1 className="mt-3 display text-[40px] leading-[0.95] tracking-tightest-display">
          Best viewed on a
          <br />
          <span className="text-terracotta-300">bigger screen.</span>
        </h1>
        <p className="mt-6 max-w-[34ch] text-[14.5px] leading-relaxed text-ink/70">
          This template is a board-room presentation deck — typography, charts and
          slide composition are tuned for a 13&rdquo;+ display. Phone screens can&rsquo;t
          do it justice.
        </p>

        <div className="mt-10 rounded-2xl border border-ink/12 bg-cream-50/60 p-5">
          <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">
            What to do
          </div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">
            Email yourself this link and open it on your laptop. Customizations sync
            across devices once you&rsquo;re signed in.
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-ink/15 pt-6">
        <a
          href="https://luistchitue.com"
          className="text-[11px] uppercase tracking-[0.22em] text-ink/60 underline-offset-4 hover:text-terracotta-300 hover:underline"
        >
          ← Back to gallery
        </a>
        <span className="text-[10.5px] uppercase tracking-[0.22em] text-ink/40">
          luistchitue.com
        </span>
      </footer>
    </div>
  );
}
