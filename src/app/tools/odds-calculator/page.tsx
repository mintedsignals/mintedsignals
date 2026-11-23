import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OddsCalculator } from "@/components/tools/OddsCalculator";
import { JsonLd } from "@/components/JsonLd";
import { calculatorFaq } from "@/config/faq";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Prediction market odds calculator",
  description:
    "Turn a prediction market share price into implied chance, shares per $100, payout and profit. Free calculator for Polymarket and Kalshi prices.",
  alternates: { canonical: "/tools/odds-calculator" },
};

export default function OddsCalculatorPage() {
  return (
    <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Tools" }, { label: "Odds calculator" }]} />
      <JsonLd data={faqJsonLd(calculatorFaq)} />
      <div className="flex flex-wrap items-start gap-12">
        <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-6">
          <header className="flex max-w-3xl flex-col gap-3">
            <span className="eyebrow">TOOLS</span>
            <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">
              Prediction market odds calculator
            </h1>
            <p className="text-lg leading-[1.55] text-body">
              Move the slider to a YES share price to see the implied chance, how many shares $100 buys, what they pay if
              you’re right, and your profit. Each share pays $1 if the outcome happens.
            </p>
          </header>

          <section className="flex max-w-3xl flex-col gap-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">How it’s calculated</h2>
            <ul className="list-disc space-y-2 pl-6 text-[17px] leading-[1.6] text-body">
              <li>
                <strong className="text-ink">Implied chance</strong> = price in cents, as a percent.
              </li>
              <li>
                <strong className="text-ink">Shares</strong> = $100 ÷ price. At 62¢: 100 ÷ 0.62 = 161.3 shares.
              </li>
              <li>
                <strong className="text-ink">Payout if YES</strong> = shares × $1 = $161.29.
              </li>
              <li>
                <strong className="text-ink">Profit</strong> = payout − $100 = $61.29.
              </li>
            </ul>
            <p className="text-[17px] leading-[1.6] text-body">
              For odds formats, expected value and worked examples, read{" "}
              <Link href="/guides/how-to-read-prediction-market-odds">reading odds: cents, percentages and payouts</Link>.
            </p>
          </section>

          <section className="flex max-w-3xl flex-col gap-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">Questions</h2>
            <dl className="flex flex-col gap-5">
              {calculatorFaq.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-1 text-[16px] leading-[1.6] text-body">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="w-full min-w-0 flex-[1_1_300px] lg:sticky lg:top-6 lg:max-w-[360px]">
          <OddsCalculator headingLevel={2} />
        </aside>
      </div>
    </div>
  );
}
