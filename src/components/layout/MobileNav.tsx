"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { headerCta, mainNav } from "@/config/site";

/** Menu button and drop-down panel, shown below the lg breakpoint. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-control border border-line-strong text-ink"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
      </button>

      <nav
        id={panelId}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-white shadow-[0_12px_32px_rgba(14,17,22,0.08)]"
      >
        <ul className="page-container flex flex-col py-2">
          {mainNav.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                className="block border-b border-line-soft py-3.5 text-base font-medium text-ink no-underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="py-4 sm:hidden">
            <Link
              href={headerCta.href}
              onClick={close}
              className="block rounded-control bg-ink px-[18px] py-[13px] text-center text-sm font-semibold text-white no-underline hover:text-white"
            >
              {headerCta.label}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
