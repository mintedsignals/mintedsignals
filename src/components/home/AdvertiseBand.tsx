import Link from "next/link";
import { adsEmail, advertiseStats } from "@/config/home";

export function AdvertiseBand() {
  return (
    <section id="advertise" className="bg-ink text-white">
      <div className="page-container flex flex-wrap items-center gap-12 py-[72px]">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
          <span className="font-mono text-xs font-semibold tracking-[0.1em] text-dark-positive">FOR BRANDS AND NETWORKS</span>
          <h2 className="font-display text-[32px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[40px]">
            Reach people who already trade on outcomes.
          </h2>
          <p className="max-w-[520px] text-[17px] leading-[1.55] text-dark-text">
            Display, sponsored market widgets, newsletter placements and featured platform listings.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link
              href="/advertise"
              className="rounded-control bg-white px-5 py-3.5 text-[15px] font-semibold text-ink no-underline hover:bg-line hover:text-ink"
            >
              Download the media kit
            </Link>
            <a
              href={`mailto:${adsEmail}`}
              className="rounded-control border border-[#4A5160] px-5 py-[13px] text-[15px] font-semibold text-white no-underline hover:border-white hover:text-white"
            >
              Contact sales
            </a>
          </div>
        </div>
        <dl className="grid min-w-0 flex-[1_1_420px] grid-cols-2 gap-4">
          {advertiseStats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1.5 rounded-xl border border-dark-border p-5">
              <dt className="text-sm text-dark-text">{s.label}</dt>
              <dd className="font-display text-[22px] font-bold break-words sm:text-[30px]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
