import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { adsEmail, advertiseStats } from "@/config/home";

export const metadata: Metadata = {
  title: "Advertise with us",
  description:
    "Reach prediction market traders: display ads, sponsored market widgets, newsletter placements and featured platform listings.",
  alternates: { canonical: "/advertise" },
};

const placements = [
  {
    name: "Display",
    detail: "728 × 90 leaderboard under the menu, 300 × 250 and sticky 300 × 600 in the sidebar. Available through Coinzilla and Blockchain-Ads, or booked directly.",
  },
  {
    name: "Native in-feed",
    detail: "A sponsored unit in the analysis list, labelled as sponsored and styled like the articles around it.",
  },
  {
    name: "Sponsored market widgets",
    detail: "A branded odds widget on a category or market page. [CHECK: formats and pricing]",
  },
  {
    name: "Newsletter placements",
    detail: "A slot in The daily brief, our morning email on the markets that moved most overnight. [CHECK: format and schedule]",
  },
  {
    name: "Featured platform listings",
    detail: "A featured card in the platform comparison, shown with a clear “Featured partner” label.",
  },
];

export default function AdvertisePage() {
  return (
    <div className="flex flex-col">
      <section className="bg-ink text-white">
        <div className="page-container flex flex-col gap-6 py-14 sm:py-[72px]">
          <Breadcrumbs items={[{ label: "Advertise" }]} />
          <span className="font-mono text-xs font-semibold tracking-[0.1em] text-dark-positive">FOR BRANDS AND NETWORKS</span>
          <h1 className="max-w-3xl font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">
            Reach people who already trade on outcomes.
          </h1>
          <p className="max-w-2xl text-lg leading-[1.55] text-dark-text">
            Display, sponsored market widgets, newsletter placements and featured platform listings.
          </p>
          <dl className="grid max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4">
            {advertiseStats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1.5 rounded-xl border border-dark-border p-5">
                <dt className="text-sm text-dark-text">{s.label}</dt>
                <dd className="font-display text-[22px] font-bold break-words">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="page-container flex flex-col gap-12 py-14">
        <section className="flex max-w-3xl flex-col gap-5">
          <h2 className="font-display text-[28px] font-bold tracking-[-0.02em]">Placements</h2>
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {placements.map((p) => (
              <li key={p.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                <span className="font-semibold sm:w-56 sm:shrink-0">{p.name}</span>
                <span className="text-[15px] leading-[1.6] text-body">{p.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex max-w-3xl flex-col gap-4">
          <h2 className="font-display text-[28px] font-bold tracking-[-0.02em]">Our standards</h2>
          <p className="text-[17px] leading-[1.6] text-body">
            Every ad and sponsored placement is clearly labelled, and ads never appear in the hero of a page.
            Sponsorship doesn’t change our odds data, guides or reviews. [CHECK: categories of advertiser accepted or
            refused, and any regional restrictions]
          </p>
        </section>

        <section className="flex max-w-3xl flex-col gap-4 rounded-card border border-line p-6">
          <h2 className="font-display text-[28px] font-bold tracking-[-0.02em]">Get the media kit</h2>
          <p className="text-[17px] leading-[1.6] text-body">
            Rates, audience data and placement specs are in the media kit. [MEDIA KIT PDF]
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${adsEmail}`}
              className="rounded-control bg-ink px-5 py-3.5 text-[15px] font-semibold text-white no-underline hover:bg-body hover:text-white"
            >
              Contact sales
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
