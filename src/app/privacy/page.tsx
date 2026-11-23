import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  // Placeholder page: kept out of search results until it's written.
  robots: { index: false, follow: true },
  title: "Privacy policy",
  description: "What data this site collects and how it is used.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="COMPANY" title="Privacy policy" intro="What data this site collects and how it is used." phase={5} />;
}
