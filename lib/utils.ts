const TAG_TEST = /^\[\/?(?:PROVIDED|NOT PROVIDED|USER|COMMENT)\]$/;
const TAG_SPLIT = /(\[\/?(?:PROVIDED|NOT PROVIDED|USER|COMMENT)\])/;

/**
 * The platform stores solutions with editor scaffold markers:
 *   [PROVIDED]...[/PROVIDED]  scaffold code
 *   [USER]...[/USER]          the fill-in answer
 *   [COMMENT]...[/COMMENT]    inline code comments
 * Concatenating the segment contents reconstructs the full solution. We strip
 * the tag tokens (but preserve real code like `dp[N]`), and remove the dangling
 * indentation left at a seam — but only when the next segment carries its own
 * leading whitespace, otherwise that whitespace is a genuine indent.
 */
export function cleanCode(code?: string): string {
  let s = (code ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const toks = s.split(TAG_SPLIT);
  let out = "";
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i] ?? "";
    if (TAG_TEST.test(t)) {
      const nxt = toks[i + 1] ?? "";
      if (nxt === "" || nxt[0] === " " || nxt[0] === "\t" || nxt[0] === "\n") {
        out = out.replace(/[ \t]+$/, "");
      }
      continue;
    }
    out += t;
  }
  out = out.replace(/\n[ \t]+\n/g, "\n\n").replace(/\n{3,}/g, "\n\n");
  return out.replace(/^\n+|\n+$/g, "");
}

/** Map the stored language label to a highlight.js language id. */
export function hljsLang(label: string): string {
  const map: Record<string, string> = {
    "c++": "cpp",
    python: "python",
    java: "java",
    javascript: "javascript",
    typescript: "typescript",
    go: "go",
    c: "c",
  };
  return map[label.toLowerCase()] ?? "plaintext";
}

export const DIFFICULTY_ORDER: Record<string, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
};

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse a "YYYY-MM-DD" asked_date without going through Date() (no TZ day-shift). */
function parseAsked(date?: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? "");
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

/** "2025-11-15" -> "2025-11" (bucket key for month filtering/sorting). */
export function askedMonthKey(date?: string): string {
  return /^\d{4}-\d{2}/.test(date ?? "") ? (date as string).slice(0, 7) : "";
}

/** "2025-11-15" -> "Nov 2025" (compact label for lists). */
export function formatAskedShort(date?: string): string {
  const p = parseAsked(date);
  return p ? `${MONTHS_SHORT[p.m - 1]} ${p.y}` : "";
}

/** "2025-11-15" -> "Nov 15, 2025" (full label for the detail page). */
export function formatAskedLong(date?: string): string {
  const p = parseAsked(date);
  return p ? `${MONTHS_SHORT[p.m - 1]} ${p.d}, ${p.y}` : "";
}

/** "2025-11" -> "November 2025" (dropdown option label). */
export function formatMonthLong(key: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(key);
  return m ? `${MONTHS_LONG[+m[2] - 1]} ${m[1]}` : key;
}

export function difficultyClass(d: string): string {
  const key = d.toLowerCase();
  if (key === "easy") return "text-easy bg-easy/10 ring-easy/30";
  if (key === "hard") return "text-hard bg-hard/10 ring-hard/30";
  return "text-medium bg-medium/10 ring-medium/30";
}
