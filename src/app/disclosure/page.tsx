import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: "How we make money and how affiliate links work on this site.",
};

export default function Page() {
  return <PagePlaceholder eyebrow="COMPANY" title="Affiliate disclosure" intro="How we make money and how affiliate links work on this site." phase={5} />;
}
