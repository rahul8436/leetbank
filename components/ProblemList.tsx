"use client";

import Link from "next/link";
import type { ProblemMeta } from "@/lib/types";
import { useApp } from "@/lib/store";
import { formatAskedShort } from "@/lib/utils";
import DifficultyBadge from "./DifficultyBadge";

export default function ProblemList({ items }: { items: ProblemMeta[] }) {
  const { progress, ready } = useApp();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted">
        No problems match your filters.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((p) => {
        const entry = ready ? progress[p.slug] : undefined;
        const solved = entry?.status === "solved";
        const attempted = entry?.status === "attempted";
        return (
          <li key={p.slug} className="animate-fade-in">
            <Link
              href={`/problems/${p.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-3 transition hover:border-accent/50 hover:bg-elevated sm:gap-4 sm:px-4"
            >
              <span className="flex w-8 shrink-0 items-center justify-end gap-1.5 font-mono text-xs text-muted sm:w-12 sm:text-sm">
                {solved ? (
                  <svg className="h-4 w-4 text-easy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : attempted ? (
                  <span className="h-2 w-2 rounded-full bg-medium" title="Attempted" />
                ) : null}
                {p.number}
              </span>
              <div className="min-w-0 flex-1">
                <div className={`truncate font-medium ${solved ? "text-muted" : "text-fg"} group-hover:text-fg`}>
                  {p.title}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  {p.company && (
                    <span className="rounded-md bg-elevated px-1.5 py-0.5 text-fg-soft">{p.company}</span>
                  )}
                  {p.askedDate && (
                    <span className="inline-flex items-center gap-1" title={`Asked ${formatAskedShort(p.askedDate)}`}>
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      {formatAskedShort(p.askedDate)}
                    </span>
                  )}
                  {p.round && <span className="hidden sm:inline">· {p.round}</span>}
                </div>
              </div>
              {entry?.starred && (
                <svg className="h-4 w-4 shrink-0 text-medium" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 17.3-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z" />
                </svg>
              )}
              <DifficultyBadge difficulty={p.difficulty} />
              <svg
                className="hidden h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-soft sm:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
