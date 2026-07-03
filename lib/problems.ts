import raw from "@/data/problems.json";
import type { Problem, ProblemWithKey, ProblemMeta } from "./types";
import { DIFFICULTY_ORDER, askedMonthKey, formatMonthLong } from "./utils";

function num(p: Problem): number {
  return parseInt(String(p.problem_number), 10) || 0;
}

const all: Problem[] = (raw as unknown as Problem[])
  .slice()
  .sort((a, b) => num(a) - num(b));

// Raw slugs can contain URL-unsafe characters (? ( ) ' ) and stray/double
// hyphens that break routing, so sanitize into a safe slug. Already-clean slugs
// are unchanged. Then disambiguate the few collisions with the problem number.
function safeSlug(s: string): string {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const safeSlugs = all.map((p) => safeSlug(p.slug));
const slugCounts: Record<string, number> = {};
for (const s of safeSlugs) slugCounts[s] = (slugCounts[s] ?? 0) + 1;

export const problems: ProblemWithKey[] = all.map((p, i) => ({
  ...p,
  key: slugCounts[safeSlugs[i]] > 1 ? `${safeSlugs[i]}-${num(p)}` : safeSlugs[i],
}));

const byKey = new Map(problems.map((p) => [p.key, p]));

export function getProblem(key: string): ProblemWithKey | undefined {
  return byKey.get(key);
}

export function allKeys(): string[] {
  return problems.map((p) => p.key);
}

export function neighbors(key: string): {
  prev: ProblemWithKey | null;
  next: ProblemWithKey | null;
} {
  const i = problems.findIndex((p) => p.key === key);
  return {
    prev: i > 0 ? problems[i - 1] : null,
    next: i >= 0 && i < problems.length - 1 ? problems[i + 1] : null,
  };
}

// Canonical algorithm topics, matched from each problem's noisy key_concepts by
// substring. A concept can map to several topics; unmatched concepts are ignored.
const TOPIC_DEFS: { name: string; aliases: string[] }[] = [
  { name: "Dynamic Programming", aliases: ["dynamic programming", "memoization", "tabulation"] },
  { name: "Hash Table", aliases: ["hash"] },
  { name: "Array", aliases: ["array"] },
  { name: "String", aliases: ["string"] },
  { name: "Two Pointers", aliases: ["two pointer"] },
  { name: "Sliding Window", aliases: ["sliding window"] },
  { name: "Binary Search", aliases: ["binary search"] },
  { name: "DFS", aliases: ["dfs", "depth-first", "depth first"] },
  { name: "BFS", aliases: ["bfs", "breadth-first", "breadth first"] },
  { name: "Graph", aliases: ["graph"] },
  { name: "Tree", aliases: ["tree"] },
  { name: "Heap", aliases: ["heap", "priority queue"] },
  { name: "Stack", aliases: ["stack"] },
  { name: "Queue", aliases: ["queue"] },
  { name: "Greedy", aliases: ["greedy"] },
  { name: "Backtracking", aliases: ["backtrack"] },
  { name: "Recursion", aliases: ["recursion", "recursive"] },
  { name: "Sorting", aliases: ["sort"] },
  { name: "Math", aliases: ["math", "arithmetic", "number theory"] },
  { name: "Bit Manipulation", aliases: ["bit manipulation", "bitwise", "bitmask"] },
  { name: "Linked List", aliases: ["linked list"] },
  { name: "Matrix", aliases: ["matrix", "grid"] },
  { name: "Simulation", aliases: ["simulation"] },
  { name: "Design", aliases: ["design"] },
  { name: "Trie", aliases: ["trie"] },
  { name: "Union Find", aliases: ["union find", "disjoint set"] },
  { name: "Prefix Sum", aliases: ["prefix sum"] },
  { name: "Intervals", aliases: ["interval"] },
];

function canonicalTopics(concepts: string[]): string[] {
  const lc = concepts.map((c) => c.toLowerCase());
  const out: string[] = [];
  for (const t of TOPIC_DEFS) {
    if (t.aliases.some((a) => lc.some((c) => c.includes(a)))) out.push(t.name);
  }
  return out;
}

/** Small metadata list for the searchable browser (keeps client payload light). */
export const metaList: ProblemMeta[] = problems.map((p) => ({
  number: num(p),
  title: p.title,
  slug: p.key,
  difficulty: p.difficulty,
  company: p.primary_company ?? "",
  companies: p.companies ?? [],
  role: p._list?.role_display ?? p._list?.role ?? "",
  round: p._list?.round_display ?? p._list?.round ?? "",
  topics: canonicalTopics(p.explanation?.key_concepts ?? []),
  askedDate: p._list?.asked_date ?? "",
}));

export const stats = {
  total: problems.length,
  easy: metaList.filter((m) => m.difficulty === "Easy").length,
  medium: metaList.filter((m) => m.difficulty === "Medium").length,
  hard: metaList.filter((m) => m.difficulty === "Hard").length,
};

export interface MonthInfo {
  key: string; // "2025-11"
  label: string; // "November 2025"
  count: number;
}

/** Months that appear in asked_date, newest first, with problem counts. */
export const monthList: MonthInfo[] = (() => {
  const counts: Record<string, number> = {};
  for (const m of metaList) {
    const k = askedMonthKey(m.askedDate);
    if (k) counts[k] = (counts[k] ?? 0) + 1;
  }
  return Object.keys(counts)
    .sort()
    .reverse()
    .map((key) => ({ key, label: formatMonthLong(key), count: counts[key] }));
})();

/** Earliest / latest asked_date across the bank (both "YYYY-MM-DD"). */
export const askedRange: { earliest: string; latest: string } = (() => {
  const dates = metaList.map((m) => m.askedDate).filter(Boolean).sort();
  return { earliest: dates[0] ?? "", latest: dates[dates.length - 1] ?? "" };
})();

function memberOf(m: ProblemMeta, name: string): boolean {
  return m.company === name || m.companies.includes(name);
}

export function slugifyCompany(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export interface CompanyInfo {
  name: string;
  slug: string;
  count: number;
}

/** Every company that appears (primary or tagged), sorted by frequency. */
export const companyList: CompanyInfo[] = (() => {
  const names = new Set<string>();
  for (const m of metaList) {
    if (m.company) names.add(m.company);
    for (const c of m.companies) if (c) names.add(c);
  }
  return [...names]
    .map((name) => ({
      name,
      slug: slugifyCompany(name),
      count: metaList.filter((m) => memberOf(m, name)).length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
})();

/** Names only — used by the home filter dropdown. */
export const companies: string[] = companyList.map((c) => c.name);

export function companyBySlug(slug: string): CompanyInfo | undefined {
  return companyList.find((c) => c.slug === slug);
}

export function problemsForCompany(name: string): ProblemMeta[] {
  return metaList.filter((m) => memberOf(m, name));
}

export interface TopicInfo {
  name: string;
  slug: string;
  count: number;
}

export const topicList: TopicInfo[] = (() => {
  const counts: Record<string, number> = {};
  for (const m of metaList) for (const t of m.topics) counts[t] = (counts[t] ?? 0) + 1;
  return TOPIC_DEFS.map((t) => t.name)
    .filter((n) => counts[n])
    .map((name) => ({ name, slug: slugifyCompany(name), count: counts[name] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
})();

export const topics: string[] = topicList.map((t) => t.name);

export function topicBySlug(slug: string): TopicInfo | undefined {
  return topicList.find((t) => t.slug === slug);
}

export function problemsForTopic(name: string): ProblemMeta[] {
  return metaList.filter((m) => m.topics.includes(name));
}

export function topicsFor(key: string): string[] {
  return metaList.find((m) => m.slug === key)?.topics ?? [];
}

export { DIFFICULTY_ORDER };
