import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CookieSettingsLink } from "@/components/analytics/CookieSettingsLink";
import { GA_MEASUREMENT_ID } from "@/config/analytics";
import { site } from "@/config/site";

/**
 * DRAFT for review. Bracketed items need real details before this is published; until then
 * the page stays noindex and out of the sitemap. Not legal advice: have it checked.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Privacy policy",
  description: `What data ${site.name} collects, why, and the choices you have.`,
  alternates: { canonical: "/privacy" },
};

/** Last time this page was reviewed. Update when the content or the data practices change. */
const UPDATED = "2026-11-23";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">{title}</h2>
      <div className="flex flex-col gap-3 text-[17px] leading-[1.7] text-body">{children}</div>
    </section>
  );
}

const list = "list-disc space-y-2 pl-6 marker:text-muted";

export default function PrivacyPage() {
  return (
    <div className="page-container flex max-w-3xl flex-col gap-10 py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Privacy policy" }]} />
      <header className="flex flex-col gap-3">
        <span className="eyebrow">COMPANY</span>
        <h1 className="font-display text-[36px] leading-[1.08] font-bold tracking-[-0.03em] sm:text-5xl">Privacy policy</h1>
        <p className="text-lg leading-[1.55] text-body">
          {site.name} is a free website with prediction market odds, guides and analysis. You can use all of it without
          an account. This page explains what data is collected when you visit, why, and the choices you have.
        </p>
        <p className="text-[13px] text-muted">Last updated {UPDATED}</p>
      </header>

      <Section title="Who we are">
        <p>
          This website is run by [OPERATOR NAME OR COMPANY], [COUNTRY], which is responsible for the data described
          here. You can contact us about privacy at [CONTACT EMAIL].
        </p>
      </Section>

      <Section title="Analytics (only with your consent)">
        <p>
          We use Google Analytics 4 to understand how the site is used: which pages are read, how visitors arrive, and
          which links they click. When you first visit, we ask whether you accept analytics cookies.
        </p>
        <ul className={list}>
          <li>
            <strong className="text-ink">If you accept,</strong> Google Analytics sets cookies (named <code>_ga</code> and{" "}
            <code>_ga_…</code>) that recognise your browser on later visits, and records the pages you view, the time
            and length of your visit, the site that referred you, your browser and device type, and your approximate
            location (country or city).
          </li>
          <li>
            <strong className="text-ink">If you reject,</strong> no analytics cookies are set. Google may still receive
            basic, cookieless signals (for example that a page was viewed, with consent denied), which it uses only to
            estimate overall traffic. These can&apos;t be used to recognise you on later visits.
          </li>
          <li>
            We also record a few events, such as clicks on links to Polymarket or Kalshi (which platform and which
            market) and newsletter signups (without your email address).
          </li>
          <li>
            We don&apos;t use Google Analytics for advertising: Google signals and ad personalisation are turned off.
          </li>
          <li>Google Analytics data is kept for [CHECK: retention period, e.g. 14 months].</li>
        </ul>
        <p>
          Google processes this data as our service provider and may process it outside your country, including in the
          United States. See{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">
            how Google uses information from sites that use its services
          </a>
          .
        </p>
        {GA_MEASUREMENT_ID && (
          <p>
            You can change your choice at any time: <CookieSettingsLink />.
          </p>
        )}
        <p>
          Your choice itself is saved in your browser&apos;s local storage (under <code>ms-analytics-consent</code>), not
          in a cookie, so we don&apos;t ask again on every visit. Clearing your browser&apos;s site data removes it.
        </p>
      </Section>

      <Section title="Hosting and security">
        <p>
          The site is hosted on Cloudflare. To deliver pages and protect the site from abuse, Cloudflare processes
          technical data such as your IP address, browser details and the pages requested, as described in{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">
            Cloudflare&apos;s privacy policy
          </a>
          . [CHECK: confirm which Cloudflare security features are enabled and whether any set cookies]
        </p>
        <p>
          Our fonts are hosted on our own site, so loading a page doesn&apos;t contact Google Fonts or other font
          services. Market odds are fetched from Polymarket and Kalshi when the site is built, not from your browser.
        </p>
      </Section>

      <Section title="Links to Polymarket, Kalshi and other platforms">
        <p>
          Some links go through an address starting with <code>/go/</code> before taking you to a platform. When you
          click one, we record which platform and market it was, the page you clicked from, and the time. We
          don&apos;t record your IP address or any other personal details in this log.
        </p>
        <p>
          Some of these are affiliate links (see our <Link href="/disclosure">affiliate disclosure</Link>). The
          link may include a referral code so the platform can tell that you came from us. Once you&apos;re on another
          website, its own privacy policy applies, including any cookies it sets.
        </p>
      </Section>

      <Section title="Newsletter">
        <p>
          Newsletter signups aren&apos;t open yet. When they are, we&apos;ll collect your email address only to send
          you the newsletter, through [CHECK: newsletter provider], and every email will include an unsubscribe link.
          This section will be updated before signups open.
        </p>
      </Section>

      <Section title="Advertising">
        <p>
          The site doesn&apos;t show third-party ads at the moment. If we add ads (for example from crypto ad networks),
          we&apos;ll update this policy and ask for your consent first where the law requires it.
        </p>
      </Section>

      <Section title="Why we may use your data (legal basis)">
        <ul className={list}>
          <li>
            <strong className="text-ink">Analytics cookies:</strong> your consent, which you can withdraw at any time.
          </li>
          <li>
            <strong className="text-ink">Hosting, security and the click log:</strong> our legitimate interest in running
            a secure website and understanding which links are used, without identifying you.
          </li>
        </ul>
        <p>[CHECK: confirm the legal bases that apply where you operate.]</p>
      </Section>

      <Section title="Your rights">
        <p>
          Depending on where you live (for example in the EU, UK or some US states), you may have the right to access,
          correct or delete personal data about you, to object to or restrict its use, and to withdraw consent. To
          make a request, contact us at [CONTACT EMAIL]. You can also complain to your local data protection
          authority.
        </p>
        <p>
          Because we don&apos;t run accounts and analytics data isn&apos;t linked to your name or email, we may not be
          able to identify data about you. Clearing your cookies or rejecting analytics stops new data being linked
          to your browser.
        </p>
      </Section>

      <Section title="Children">
        <p>
          This site is meant for adults (18+), because trading on prediction markets is restricted to adults. We
          don&apos;t knowingly collect data from children.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We&apos;ll update this page when our data practices change and show the date at the top. Questions:{" "}
          [CONTACT EMAIL].
        </p>
      </Section>
    </div>
  );
}
