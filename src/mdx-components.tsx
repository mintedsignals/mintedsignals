import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { OddsCalculator } from "@/components/tools/OddsCalculator";

/**
 * Styles for every MDX file (guides, reviews, analysis) plus components the content can use.
 * Next.js requires this file for MDX in the App Router.
 */

/** A fact that must be checked before publishing. Shown highlighted so it can't slip through. */
export function Check({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-[#FFF4D6] px-1 font-mono text-[0.85em] text-[#7A4A00]">
      [CHECK: {children}]
    </mark>
  );
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="my-6 rounded-card border border-line bg-surface px-5 py-4 text-[15px] leading-[1.6] text-body">
      {title && <p className="mb-1 font-semibold text-ink">{title}</p>}
      {children}
    </aside>
  );
}

function MdxLink({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  // External links in content are references, not affiliate links (those use components).
  return (
    <a href={href} rel="noopener" {...rest}>
      {children}
    </a>
  );
}

const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-12 mb-4 scroll-mt-6 font-display text-[28px] leading-[1.2] font-bold tracking-[-0.02em]" {...props} />
  ),
  h3: (props) => <h3 className="mt-8 mb-3 scroll-mt-6 font-display text-xl font-bold" {...props} />,
  p: (props) => <p className="my-4 text-[17px] leading-[1.7] text-body" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 text-[17px] leading-[1.6] text-body marker:text-muted" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 text-[17px] leading-[1.6] text-body marker:text-muted" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: MdxLink,
  blockquote: (props) => <blockquote className="my-6 border-l-4 border-line pl-4 text-body italic" {...props} />,
  hr: () => <hr className="my-10 border-line" />,
  code: (props) => <code className="rounded bg-chip px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-card border border-line">
      <table className="w-full border-collapse text-left text-[15px]" {...props} />
    </div>
  ),
  th: (props) => <th className="border-b border-line bg-subtle px-4 py-3 font-semibold" {...props} />,
  td: (props) => <td className="border-b border-line-soft px-4 py-3 align-top text-body" {...props} />,
  Check,
  Callout,
  OddsCalculator,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
