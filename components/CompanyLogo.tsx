import { LOGOS } from "@/lib/company-logos";
import { EXTRA_LOGOS } from "@/lib/company-logos-extra";

// Local slug — intentionally NOT imported from lib/problems.ts so this stays
// out of the heavy dataset module and safe to use in client bundles.
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// A few extra brand SVGs were captured without a viewBox; they live in a 0–64
// coordinate space, so inject one to make downscaling behave.
function withViewBox(svg: string): string {
  return /viewBox=/.test(svg) ? svg : svg.replace(/<svg\b/, '<svg viewBox="0 0 64 64"');
}

// Deterministic monogram palette (no Math.random — must be stable per name).
const MONO = ["#6366f1", "#0ea5e9", "#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444", "#10b981", "#f97316", "#3b82f6"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name: string): string {
  const words = name
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase e.g. ServiceNow
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
}

export default function CompanyLogo({
  name,
  size = 40,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const slug = toSlug(name);
  const radius = Math.max(4, Math.round(size * 0.22)); // scales: ~4px small, ~12px large

  // 1) Full-color inline SVGs for brands missing from simple-icons.
  const extra = EXTRA_LOGOS[slug];
  if (extra) {
    const inner = Math.round(size * 0.64);
    return (
      <span
        aria-hidden
        className={`inline-grid shrink-0 place-items-center bg-white ring-1 ring-black/5 ${className}`}
        style={{ width: size, height: size, borderRadius: radius }}
      >
        <span
          className="block"
          style={{ width: inner, height: inner, lineHeight: 0 }}
          dangerouslySetInnerHTML={{ __html: withViewBox(extra) }}
        />
      </span>
    );
  }

  // 2) simple-icons monochrome brand glyph on a white chip.
  const logo = LOGOS[slug];
  if (logo) {
    return (
      <span
        aria-hidden
        className={`inline-grid shrink-0 place-items-center bg-white ring-1 ring-black/5 ${className}`}
        style={{ width: size, height: size, borderRadius: radius }}
      >
        <svg
          viewBox="0 0 24 24"
          width={Math.round(size * 0.56)}
          height={Math.round(size * 0.56)}
          fill={`#${logo.c}`}
          role="img"
        >
          <path d={logo.p} />
        </svg>
      </span>
    );
  }

  const bg = MONO[hash(name) % MONO.length];
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center font-semibold text-white ${className}`}
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: bg, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}
