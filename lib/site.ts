/**
 * Canonical site URL, resolved (in priority order):
 *  1. NEXT_PUBLIC_SITE_URL  — set this to a custom domain if you have one
 *  2. VERCEL_PROJECT_PRODUCTION_URL — auto-provided by Vercel at build time
 *  3. a sensible fallback
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "https://leetbank.vercel.app";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "LeetBank";
