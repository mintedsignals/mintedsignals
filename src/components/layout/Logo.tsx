import Link from "next/link";
import { site } from "@/config/site";

/** Bar-chart mark from the design. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <rect x="1" y="1" width="26" height="26" rx="7" fill="var(--color-ink)" />
      <rect x="7" y="15" width="4" height="7" rx="1" fill="var(--color-accent)" />
      <rect x="12" y="10" width="4" height="12" rx="1" fill="#FFFFFF" />
      <rect x="17" y="6" width="4" height="16" rx="1" fill="var(--color-accent)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink no-underline hover:text-ink">
      <LogoMark />
      <span className="font-display text-[22px] font-bold tracking-[-0.02em]">{site.name}</span>
    </Link>
  );
}
