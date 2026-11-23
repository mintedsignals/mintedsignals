/**
 * Shared layout for Open Graph images (rendered by next/og's ImageResponse, which supports a
 * subset of CSS via inline styles: flexbox, no grid, no Tailwind).
 */
import { site } from "@/config/site";

const ink = "#0E1116";
const accent = "#2F5BFF";

export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", padding: "64px 72px", fontFamily: "sans-serif", color: ink }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="56" height="56" viewBox="0 0 28 28">
          <rect x="1" y="1" width="26" height="26" rx="7" fill={ink} />
          <rect x="7" y="15" width="4" height="7" rx="1" fill={accent} />
          <rect x="12" y="10" width="4" height="12" rx="1" fill="#FFFFFF" />
          <rect x="17" y="6" width="4" height="16" rx="1" fill={accent} />
        </svg>
        <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>{site.name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.1em", color: "#1F3FD1" }}>{eyebrow}</span>
        <span style={{ fontSize: title.length > 90 ? 52 : 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em" }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: "2px solid #E4E6EB", paddingTop: 28, fontSize: 26, color: "#5A6170" }}>
        {footer ?? <span>Live odds from Polymarket and Kalshi</span>}
      </div>
    </div>
  );
}
