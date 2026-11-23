import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  // Placeholder page: kept out of search results until it's written.
  robots: { index: false, follow: true },
  title: "About and editorial policy",
  description: "Who we are and how we research, write and update our content.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="COMPANY" title="About and editorial policy" intro="Who we are and how we research, write and update our content." phase={5} />;
}
