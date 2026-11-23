import Link from "next/link";

/** Short disclosure shown next to every block of affiliate links. */
export function AffiliateNote({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <p className={`text-xs leading-normal ${dark ? "text-dark-text" : "text-muted"} ${className}`}>
      Some links on this page are affiliate links: we may earn a commission at no cost to you.{" "}
      <Link href="/disclosure" className={dark ? "text-white" : undefined}>
        How we make money
      </Link>
      .
    </p>
  );
}
