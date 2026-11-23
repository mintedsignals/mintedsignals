/** Temporary page body for routes whose content arrives in a later phase. */
export function PagePlaceholder({
  eyebrow,
  title,
  intro,
  phase,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  phase: number;
}) {
  return (
    <div className="page-container flex flex-col gap-5 py-16">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="max-w-3xl font-display text-[40px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">
        {title}
      </h1>
      {intro && <p className="max-w-2xl text-lg leading-[1.55] text-body">{intro}</p>}
      <p className="w-fit rounded-control border border-dashed border-line-dashed bg-subtle px-4 py-3 font-mono text-xs text-muted">
        [PLACEHOLDER] This page is built in phase {phase}.
      </p>
    </div>
  );
}
