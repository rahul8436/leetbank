import raw from "@/data/problems.json";
import type { Problem, ProblemWithKey, ProblemMeta } from "./types";
import { DIFFICULTY_ORDER } from "./utils";

function num(p: Problem): number {
  return parseInt(String(p.problem_number), 10) || 0;
}

const all: Problem[] = (raw as unknown as Problem[])
  .slice()
  .sort((a, b) => num(a) - num(b));

// Slugs are mostly unique; disambiguate the few collisions with the number.
const slugCounts: Record<string, number> = {};
for (const p of all) slugCounts[p.slug] = (slugCounts[p.slug] ?? 0) + 1;

export const problems: ProblemWithKey[] = all.map((p) => ({
  ...p,
  key: slugCounts[p.slug] > 1 ? `${p.slug}-${num(p)}` : p.slug,
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
}));

export const stats = {
  total: problems.length,
  easy: metaList.filter((m) => m.difficulty === "Easy").length,
  medium: metaList.filter((m) => m.difficulty === "Medium").length,
  hard: metaList.filter((m) => m.difficulty === "Hard").length,
};

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

export { DIFFICULTY_ORDER };
