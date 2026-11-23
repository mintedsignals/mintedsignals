import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Visible breadcrumb trail. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex min-w-0 items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-muted hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[48ch] truncate text-body">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
