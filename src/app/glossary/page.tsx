import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  // Placeholder page: kept out of search results until it's written.
  robots: { index: false, follow: true },
  title: "Prediction market glossary",
  description: "Definitions of the terms used across prediction markets.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="LEARN" title="Prediction market glossary" intro="Definitions of the terms used across prediction markets." phase={5} />;
}
