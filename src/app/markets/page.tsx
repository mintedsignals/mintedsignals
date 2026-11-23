import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarketRow, MarketRowHeader } from "@/components/markets/MarketRow";
import { categories } from "@/config/site";
import { listMarkets, venueNames, venues } from "@/lib/markets";
import { filtersCopy, filtersHref, MARKETS_PAGE_SIZE, parseFilters, type MarketFilters } from "@/lib/markets/filters";

/** Waits for the filtered list before responding, so out-of-range pages get a real 404. */
export const instant = false;

async function load(searchParams: PageProps<"/markets">["searchParams"]) {
  const filters = parseFilters(await searchParams);
  const all = await listMarkets(filters);
  const pages = Math.max(1, Math.ceil(all.length / MARKETS_PAGE_SIZE));
  const start = (filters.page - 1) * MARKETS_PAGE_SIZE;
  return { filters, all, pages, markets: all.slice(start, start + MARKETS_PAGE_SIZE) };
}

export async function generateMetadata({ searchParams }: PageProps<"/markets">): Promise<Metadata> {
  const { filters, all } = await load(searchParams);
  const { title, description } = filtersCopy(filters, all.length);
  return { title, description, alternates: { canonical: filtersHref(filters) } };
}

export default async function MarketsPage({ searchParams }: PageProps<"/markets">) {
  const { filters, all, pages, markets } = await load(searchParams);
  if (filters.page > pages) notFound();
  const { heading, description } = filtersCopy(filters, all.length);

  return (
    <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Markets", href: filters.category || filters.venue ? "/markets" : undefined },
          ...(filters.category || filters.venue ? [{ label: heading }] : []),
        ]}
      />
      <header className="flex max-w-3xl flex-col gap-3">
        <span className="eyebrow">MARKETS</span>
        <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">{heading}</h1>
        <p className="text-lg leading-[1.55] text-body">{description}</p>
      </header>

      <div className="flex flex-col gap-3">
        <FilterLinks
          label="Category"
          options={[undefined, ...categories].map((c) => ({
            label: c ?? "All",
            href: filtersHref({ ...filters, category: c, page: 1 }),
            active: filters.category === c,
          }))}
        />
        <FilterLinks
          label="Venue"
          options={[undefined, ...venues].map((v) => ({
            label: v ? venueNames[v] : "All venues",
            href: filtersHref({ ...filters, venue: v, page: 1 }),
            active: filters.venue === v,
          }))}
        />
      </div>

      <div className="overflow-hidden rounded-panel border border-line">
        <MarketRowHeader />
        {markets.length > 0 ? (
          <ul>
            {markets.map((m) => (
              <li key={m.id}>
                <MarketRow market={m} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted">
            No open markets match these filters right now. <Link href="/markets">See all markets</Link>.
          </p>
        )}
      </div>

      {pages > 1 && <Pagination filters={filters} pages={pages} />}

      <p className="text-xs text-muted">
        Prices are the cost of a YES share in cents, shown as implied chance. Kalshi volume is contracts traded,
        counted at $1 each.
      </p>
    </div>
  );
}

function FilterLinks({ label, options }: { label: string; options: { label: string; href: string; active: boolean }[] }) {
  return (
    <nav aria-label={`Filter by ${label.toLowerCase()}`} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-20 text-[13px] font-medium text-muted">{label}</span>
      {options.map((o) => (
        <Link
          key={o.href}
          href={o.href}
          aria-current={o.active ? "page" : undefined}
          className={`min-h-9 rounded-full border px-3.5 py-[7px] text-[13px] font-medium no-underline ${
            o.active ? "border-ink bg-ink text-white hover:text-white" : "border-[#D5D8DE] bg-white text-ink hover:border-ink"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </nav>
  );
}

function Pagination({ filters, pages }: { filters: MarketFilters; pages: number }) {
  const { page } = filters;
  const link = "rounded-control border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink no-underline hover:border-ink";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={filtersHref({ ...filters, page: page - 1 })} rel="prev" className={link}>
          ← Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted">
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link href={filtersHref({ ...filters, page: page + 1 })} rel="next" className={link}>
          Next →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
