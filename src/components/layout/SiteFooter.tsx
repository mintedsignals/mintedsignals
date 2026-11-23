import Link from "next/link";
import { complianceNotice, footerNav, site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="page-container flex flex-col gap-8 pt-12 pb-10">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex max-w-[360px] flex-[1_1_280px] flex-col gap-2.5">
            <span className="font-display text-xl font-bold">{site.name}</span>
            <p className="text-sm leading-[1.55] text-body">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-12 text-sm">
            {footerNav.map((column) => (
              <div key={column.heading} className="flex flex-col gap-2.5">
                <span className="font-semibold">{column.heading}</span>
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <p className="border-t border-footer-rule pt-6 text-[13px] leading-[1.6] text-footer-text">
          {complianceNotice}
        </p>
      </div>
    </footer>
  );
}
