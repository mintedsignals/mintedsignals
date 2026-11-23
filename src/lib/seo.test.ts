import { describe, expect, it } from "vitest";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, serializeJsonLd } from "./seo";

describe("breadcrumbJsonLd", () => {
  it("starts at Home, numbers items and leaves the current page without a URL", () => {
    const data = breadcrumbJsonLd([{ label: "Guides", href: "/guides" }, { label: "What is a prediction market?" }]);
    expect(data.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: "http://localhost:3000/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "http://localhost:3000/guides" },
      { "@type": "ListItem", position: 3, name: "What is a prediction market?" },
    ]);
  });
});

describe("articleJsonLd", () => {
  it("credits the site when the author is a placeholder", () => {
    const data = articleJsonLd({ path: "/analysis/x", title: "T", description: "D", updated: "2026-11-17", author: "[AUTHOR]" });
    expect(data.author).toEqual({ "@type": "Organization", name: "Minted Signals", url: "http://localhost:3000" });
    expect(data.dateModified).toBe("2026-11-17");
    expect(data.url).toBe("http://localhost:3000/analysis/x");
  });

  it("credits a named author", () => {
    expect(articleJsonLd({ path: "/a", title: "T", description: "D", updated: "2026-11-17", author: "Ana Pop" }).author).toEqual({
      "@type": "Person",
      name: "Ana Pop",
    });
  });
});

describe("faqJsonLd", () => {
  it("maps questions and answers", () => {
    expect(faqJsonLd([{ q: "Q?", a: "A." }]).mainEntity).toEqual([
      { "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } },
    ]);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so the data can't close the script tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});
