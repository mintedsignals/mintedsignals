import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  // Placeholder page: kept out of search results until it's written.
  robots: { index: false, follow: true },
  title: "Contact",
  description: "How to get in touch with the team.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="COMPANY" title="Contact" intro="How to get in touch with the team." phase={5} />;
}
