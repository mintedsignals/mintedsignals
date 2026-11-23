import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import type { ContentStatus } from "@/content";
import { formatDate } from "@/lib/format";

/** Shared layout for guides, reviews and articles: breadcrumb, header, body, optional sidebar. */
export function ArticleLayout({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  updated,
  byline,
  status,
  aside,
  children,
}: {
  breadcrumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  updated: string;
  byline?: string;
  status: ContentStatus;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex flex-wrap items-start gap-12">
        <article className="min-w-0 flex-[999_1_560px]">
          <header className="flex max-w-3xl flex-col gap-4 border-b border-line pb-8">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[48px]">{title}</h1>
            {intro && <p className="text-lg leading-[1.55] text-body">{intro}</p>}
            <p className="text-[13px] text-muted">
              {byline && <>{byline} · </>}Updated <time dateTime={updated}>{formatDate(`${updated}T00:00:00Z`)}</time>
            </p>
          </header>
          {status === "draft" && (
            <p className="mt-6 rounded-control border border-dashed border-[#E2B35C] bg-[#FFF8E6] px-4 py-3 text-sm text-[#7A4A00]">
              <strong>Draft.</strong> This page hasn’t been reviewed yet and isn’t indexed by search engines. Highlighted
              items need checking before it’s published.
            </p>
          )}
          <div className="max-w-3xl">{children}</div>
        </article>
        {aside && (
          <aside className="flex w-full min-w-0 flex-[1_1_300px] flex-col gap-6 lg:sticky lg:top-6 lg:max-w-[340px]">
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}
