"use client";

import { useId, useState } from "react";

/** Odds from a YES share price: implied chance, shares per $100, payout and profit. */
export function oddsFromPrice(cents: number, stake = 100) {
  const price = cents / 100;
  const shares = stake / price;
  return { implied: cents, shares, payout: shares, profit: shares - stake };
}

const usd = (n: number) => `$${n.toFixed(2)}`;

export function OddsCalculator({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [cents, setCents] = useState(62);
  const id = useId();
  const { implied, shares, payout, profit } = oddsFromPrice(cents);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  const results = [
    { label: "Implied chance", value: `${implied}%` },
    { label: "$100 buys", value: `${shares.toFixed(1)} sh` },
    { label: "Pays if YES", value: usd(payout) },
    { label: "Profit", value: `+${usd(profit)}`, accent: true },
  ];

  return (
    <div id="tools" className="flex flex-col gap-4 rounded-card border border-line p-[22px]">
      <Heading className="font-display text-xl font-bold">Odds calculator</Heading>
      <div className="flex flex-col gap-2.5">
        <label htmlFor={id} className="flex justify-between text-sm font-medium">
          <span>YES share price</span>
          <span className="font-mono font-semibold">{cents}¢</span>
        </label>
        <input
          id={id}
          type="range"
          min={1}
          max={99}
          step={1}
          value={cents}
          onChange={(e) => setCents(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
          className="h-7 w-full accent-accent"
        />
      </div>
      <dl className="grid grid-cols-2 gap-3" aria-live="polite">
        {results.map((r) => (
          <div key={r.label} className="rounded-control bg-surface p-3">
            <dt className="mb-1 text-xs text-muted">{r.label}</dt>
            <dd className={`font-mono text-xl font-semibold ${r.accent ? "text-link" : ""}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-normal text-muted">Before fees and slippage. Each share pays $1 if the outcome happens.</p>
    </div>
  );
}
