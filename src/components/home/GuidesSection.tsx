import Link from "next/link";
import { guides } from "@/config/site";

export function GuidesSection() {
  return (
    <section id="guides" className="page-container flex flex-col gap-8 py-[72px]">
      <div className="flex max-w-[640px] flex-col gap-2.5">
        <span className="eyebrow">LEARN</span>
        <h2 className="font-display text-[32px] font-bold tracking-[-0.03em] sm:text-[38px]">Prediction markets 101</h2>
        <p className="text-[17px] leading-[1.55] text-body">
          Evergreen guides built to rank: one clear question per page, answered in the first paragraph.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="flex min-h-[168px] flex-col gap-3 rounded-card border border-line p-6 text-ink no-underline hover:border-ink hover:text-ink"
          >
            <span className="font-mono text-[13px] font-semibold text-link">
              {g.number} · {g.topic}
            </span>
            <span className="font-display text-[21px] leading-[1.2] font-bold">{g.title}</span>
            <span className="text-sm leading-normal text-muted">{g.summary}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
