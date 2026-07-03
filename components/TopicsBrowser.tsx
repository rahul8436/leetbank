"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TopicInfo } from "@/lib/problems";

export default function TopicsBrowser({ topics }: { topics: TopicInfo[] }) {
  const [query, setQuery] = useState("");
  const max = useMemo(() => Math.max(...topics.map((t) => t.count), 1), [topics]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? topics.filter((t) => t.name.toLowerCase().includes(q)) : topics;
  }, [topics, query]);

  return (
    <div>
      <div className="relative mb-5 max-w-md">
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter patterns…"
          className="w-full rounded-xl border border-border bg-elevated py-2.5 pl-10 pr-3 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted">
          No patterns match “{query}”.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="group rounded-xl border border-border bg-surface/60 p-4 transition hover:border-accent/50 hover:bg-elevated"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-fg group-hover:text-accent-soft">{t.name}</span>
                <span className="shrink-0 text-sm tabular-nums text-muted">{t.count}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-indigo-500"
                  style={{ width: `${Math.round((t.count / max) * 100)}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
