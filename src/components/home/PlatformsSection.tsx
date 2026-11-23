import Link from "next/link";
import { AffiliateNote } from "@/components/AffiliateNote";
import { platformCards } from "@/config/home";

const button = "rounded-control text-center text-sm font-semibold no-underline";
const primary = `${button} flex-auto px-4 py-[13px] text-white hover:text-white`;
const outline = `${button} border border-line-strong px-4 py-3 text-ink hover:border-ink`;

export function PlatformsSection() {
  return (
    <section id="platforms" className="border-y border-line bg-surface">
      <div className="page-container flex flex-col gap-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2.5">
            <span className="eyebrow">WHERE TO TRADE</span>
            <h2 className="font-display text-[32px] font-bold tracking-[-0.03em] sm:text-[38px]">
              Prediction market platforms compared
            </h2>
          </div>
          <Link href="/platforms" className="py-2 text-[15px] font-semibold">
            Full reviews and methodology →
          </Link>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {platformCards.map((p) => (
            <article
              key={p.name}
              className={`flex flex-col gap-[18px] rounded-card border bg-white p-6 ${
                p.placeholder ? "border-dashed border-line-dashed" : "border-line"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${p.badgeClass}`}>{p.badge}</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
                {p.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="mb-1 text-xs text-muted">{f.label}</dt>
                    <dd className="font-semibold">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto flex flex-wrap gap-2.5">
                {p.cta.href ? (
                  <a
                    href={p.cta.href}
                    rel="sponsored noopener"
                    className={`${primary} ${p.cta.primary ? "bg-accent hover:bg-link" : "bg-ink hover:bg-body"}`}
                  >
                    {p.cta.label}
                  </a>
                ) : (
                  <span aria-disabled="true" className={`${primary} cursor-not-allowed bg-accent opacity-60`}>
                    {p.cta.label}
                  </span>
                )}
                {p.reviewHref ? (
                  <Link href={p.reviewHref} className={outline}>
                    Review
                  </Link>
                ) : (
                  <span aria-disabled="true" className={`${outline} cursor-not-allowed opacity-60`}>
                    Review
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <AffiliateNote />
      </div>
    </section>
  );
}
