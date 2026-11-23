import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="page-container flex flex-col gap-5 py-24">
      <span className="eyebrow">404</span>
      <h1 className="font-display text-[40px] leading-[1.08] font-bold tracking-[-0.03em]">
        We couldn&apos;t find that page.
      </h1>
      <p className="max-w-xl text-lg leading-[1.55] text-body">
        It may have moved, or the market may have closed.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/markets"
          className="rounded-control bg-accent px-5 py-3.5 text-[15px] font-semibold text-white hover:text-white"
        >
          Browse markets
        </Link>
        <Link
          href="/"
          className="rounded-control border border-line-strong px-5 py-[13px] text-[15px] font-semibold text-ink"
        >
          Go to the homepage
        </Link>
      </div>
    </div>
  );
}
