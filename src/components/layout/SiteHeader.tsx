import Link from "next/link";
import { headerCta, mainNav } from "@/config/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="relative border-b border-line">
      <div className="page-container flex min-h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden gap-1 text-[15px] font-medium lg:flex">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-3 text-ink no-underline hover:text-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={headerCta.href}
            className="hidden rounded-control bg-ink px-[18px] py-[13px] text-sm font-semibold text-white no-underline hover:bg-body hover:text-white sm:inline-block"
          >
            {headerCta.label}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
