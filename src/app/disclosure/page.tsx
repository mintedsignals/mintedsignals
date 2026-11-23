import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { partners } from "@/config/partners";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: `How ${site.name} makes money: affiliate links to prediction market platforms, display ads and clearly labelled sponsorships.`,
  alternates: { canonical: "/disclosure" },
};

/** Last time this page was reviewed. Update when the content or partners change. */
const UPDATED = "2026-11-17";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</h2>
      <div className="flex flex-col gap-3 text-[17px] leading-[1.7] text-body">{children}</div>
    </section>
  );
}

export default function DisclosurePage() {
  const partnerNames = Object.values(partners).map((p) => p.name);

  return (
    <div className="page-container flex max-w-3xl flex-col gap-10 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Affiliate disclosure" }]} />
      <header className="flex flex-col gap-3">
        <span className="eyebrow">COMPANY</span>
        <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">Affiliate disclosure</h1>
        <p className="text-lg leading-[1.55] text-body">
          {site.name} is free to read. We make money in three ways, explained below. None of them changes the odds we show,
          and you never pay more because you used one of our links.
        </p>
        <p className="text-[13px] text-muted">Last updated {UPDATED}</p>
      </header>

      <Section title="1. Affiliate links">
        <p>
          Some links to prediction market platforms are affiliate links. If you sign up or trade after clicking one, the
          platform may pay us a commission. This costs you nothing extra.
        </p>
        <p>
          Platforms we link to with affiliate links: {partnerNames.join(" and ")}. [CHECK: list only partners with a signed
          affiliate agreement, and describe the type of commission if you choose to]
        </p>
        <p>
          You can recognise affiliate links in three ways: they go through an address starting with{" "}
          <code className="rounded bg-chip px-1.5 py-0.5 font-mono text-[0.9em]">/go/</code>, they’re marked as sponsored
          for search engines, and there is a short note next to every group of them linking to this page.
        </p>
      </Section>

      <Section title="2. Advertising">
        <p>
          We show display ads from crypto advertising networks such as Coinzilla and Blockchain-Ads. Ads are always labelled
          “Advertisement” or “Sponsored”, and we don’t place them in the main heading area of a page. We don’t choose
          individual ads shown by a network, and showing an ad doesn’t mean we recommend the advertiser.
        </p>
      </Section>

      <Section title="3. Sponsorships">
        <p>
          Brands can pay for sponsored market widgets, newsletter placements or a featured listing on our platform
          comparison. These are always labelled, for example “Featured partner” or “Sponsored”. See{" "}
          <Link href="/advertise">advertise with us</Link>.
        </p>
      </Section>

      <Section title="Our editorial independence">
        <p>
          Odds on this site come directly from the platforms’ public data and aren’t changed for any partner. Commercial
          relationships don’t decide what our guides say, how we review platforms, or which markets we cover. [CHECK:
          link to the full editorial policy on the About page once written]
        </p>
      </Section>

      <Section title="Not financial advice">
        <p>
          Everything on {site.name} is for information only and isn’t financial, investment or legal advice. Trading on
          prediction markets involves risk of loss and isn’t available in every country. You must be 18 or over. Check
          your local rules: <Link href="/guides/are-prediction-markets-legal">are prediction markets legal where you live?</Link>
        </p>
      </Section>

      <Section title="Questions">
        <p>
          If you have a question about how we make money, <Link href="/contact">contact us</Link>.
        </p>
      </Section>
    </div>
  );
}
