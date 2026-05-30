import { Eyebrow } from "./Eyebrow";

export function SlideHeader({
  number,
  kicker,
  title,
  titleAccent,
  subtitle,
}: {
  number: string;
  kicker: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-baseline gap-4">
        <span className="display text-terracotta-300 text-[calc(18px*var(--scale-label))] leading-none tnum">{number}</span>
        <Eyebrow>{kicker}</Eyebrow>
      </div>
      <h2 className="display whitespace-pre-line text-[calc(88px*var(--scale-display))] leading-[0.95] tracking-tightest-display text-ink">
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span className="text-terracotta-300">{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {subtitle ? (
        <p className="max-w-[60ch] text-[calc(22px*var(--scale-subtitle))] leading-snug text-ink/70">{subtitle}</p>
      ) : null}
    </header>
  );
}
