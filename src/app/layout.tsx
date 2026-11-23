import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { LeaderboardBand } from "@/components/layout/LeaderboardBand";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Ticker, TickerFrame } from "@/components/layout/Ticker";
import { site } from "@/config/site";
import "./globals.css";

// Self-hosted at build time by next/font: no requests to Google from the browser.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: prediction market odds, guides and analysis`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<TickerFrame />}>
          <Ticker />
        </Suspense>
        <SiteHeader />
        <LeaderboardBand />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
