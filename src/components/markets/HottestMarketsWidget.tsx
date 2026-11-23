"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/config/site";
import { selectHottest, type HottestOptions } from "@/lib/markets/hottest";
import { venueNames, venues, type MarketSummary, type Venue, type VenueStatus } from "@/lib/markets/types";
import { MarketRow, MarketRowHeader } from "./MarketRow";
import { WIDGET_CATEGORIES } from "./widgetConfig";

export function HottestMarketsWidget({
  pool,
  options,
  venueStatus,
}: {
  pool: MarketSummary[];
  options: Pick<HottestOptions, "limit" | "onePerEvent" | "pinned">;
  venueStatus: Record<Venue, VenueStatus>;
}) {
  const [category, setCategory] = useState<Category | undefined>();
  const [venue, setVenue] = useState<Venue | undefined>();
  const markets = selectHottest(pool, { ...options, category, venue });

  const delayed = venues.filter((v) => venueStatus[v].status !== "ok" && (!venue || venue === v));

  return (
    <div className="min-w-0 flex-[1.35_1_560px] overflow-hidden rounded-panel border border-line bg-white shadow-[0_1px_2px_rgba(14,17,22,0.04),0_12px_32px_rgba(14,17,22,0.06)]">
      <div className="flex flex-col gap-3.5 border-b border-line px-5 pt-5 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-[22px] font-bold tracking-[-0.02em]">Hottest markets</h2>
          <div role="group" aria-label="Venue" className="flex gap-0.5 rounded-control bg-chip p-[3px]">
            {[undefined, ...venues].map((v) => (
              <button
                key={v ?? "all"}
                type="button"
                aria-pressed={venue === v}
                onClick={() => setVenue(v)}
                className={`min-h-9 cursor-pointer rounded-lg px-3 py-[9px] text-[13px] font-semibold ${
                  venue === v ? "bg-white text-ink shadow-[0_1px_2px_rgba(14,17,22,0.08)]" : "bg-transparent text-footer-text"
                }`}
              >
                {v ? venueNames[v] : "All venues"}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
          {[undefined, ...WIDGET_CATEGORIES].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`min-h-9 cursor-pointer rounded-full border px-3.5 py-[9px] text-[13px] font-medium ${
                category === c ? "border-ink bg-ink text-white" : "border-[#D5D8DE] bg-white text-ink"
              }`}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>
      </div>

      <MarketRowHeader />

      <ul>
        {markets.map((m) => (
          <li key={m.id}>
            <MarketRow market={m} />
          </li>
        ))}
      </ul>
      {markets.length === 0 && (
        <p className="px-5 py-8 text-center text-sm text-muted">No hot markets in this category on this venue right now.</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 text-xs text-muted">
        <span>
          Prices are the cost of a YES share in cents, shown as implied chance.
          {delayed.length > 0 && (
            <> {delayed.map((v) => venueNames[v]).join(" and ")} odds may be delayed.</>
          )}
        </span>
        <Link href="/markets" className="py-2 text-sm font-semibold">
          All markets →
        </Link>
      </div>
    </div>
  );
}
