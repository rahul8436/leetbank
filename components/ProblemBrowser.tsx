"use client";

import { useMemo, useState } from "react";
import type { ProblemMeta } from "@/lib/types";
import { useApp } from "@/lib/store";
import ProblemList from "./ProblemList";

const DIFFS = ["All", "Easy", "Medium", "Hard"] as const;
type Diff = (typeof DIFFS)[number];
const STATUSES = ["All", "Unsolved", "Solved", "Starred"] as const;
type StatusFilter = (typeof STATUSES)[number];

export default function ProblemBrowser({
  problems,
  companies,
  topics,
}: {
  problems: ProblemMeta[];
  companies: string[];
  topics: string[];
}) {
  const { progress, username, ready } = useApp();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Diff>("All");
  const [company, setCompany] = useState("All");
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState<StatusFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return problems.filter((p) => {
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;
      if (company !== "All" && !p.companies.includes(company) && p.company !== company) return false;
      if (topic !== "All" && !p.topics.includes(topic)) return false;
      if (status !== "All") {
        const e = progress[p.slug];
        if (status === "Solved" && e?.status !== "solved") return false;
        if (status === "Unsolved" && e?.status === "solved") return false;
        if (status === "Starred" && !e?.starred) return false;
      }
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        String(p.number) === q ||
        p.company.toLowerCase().includes(q) ||
        p.companies.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [problems, query, difficulty, company, topic, status, progress]);

  const active =
    difficulty !== "All" || company !== "All" || topic !== "All" || status !== "All" || query.trim() !== "";

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 border-b border-border/60 bg-bg/85 px-4 py-3 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:border sm:border-border/60 sm:bg-surface/40">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              id="problem-search"
              type="text"
              inputMode="search"
              placeholder="Search problems…  (press / )"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-elevated py-2.5 pl-10 pr-10 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition hover:bg-border hover:text-fg"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-border bg-elevated p-1 text-sm">
              {DIFFS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-lg px-2.5 py-1.5 font-medium transition sm:px-3 ${
                    difficulty === d ? "bg-accent text-white shadow-sm" : "text-muted hover:text-fg"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl border border-border bg-elevated px-3 py-2 text-sm text-fg outline-none transition focus:border-accent/60"
            >
              <option value="All">All topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="rounded-xl border border-border bg-elevated px-3 py-2 text-sm text-fg outline-none transition focus:border-accent/60"
            >
              <option value="All">All companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              disabled={!ready}
              className="rounded-xl border border-border bg-elevated px-3 py-2 text-sm text-fg outline-none transition focus:border-accent/60 disabled:opacity-50"
              title={username ? "Filter by your progress" : "Sign in to track progress"}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {active && (
              <button
                onClick={() => {
                  setQuery("");
                  setDifficulty("All");
                  setCompany("All");
                  setTopic("All");
                  setStatus("All");
                }}
                className="rounded-xl border border-border px-3 py-2 text-sm text-muted transition hover:border-accent/50 hover:text-fg"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="px-1 pb-3 pt-4 text-sm text-muted">
        <span className="font-medium text-fg-soft">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "problem" : "problems"}
        {active && <span> matched</span>}
      </p>

      <ProblemList items={filtered} />
    </div>
  );
}
