"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CompanyInfo } from "@/lib/problems";
import CompanyLogo from "./CompanyLogo";

export default function CompaniesBrowser({ companies }: { companies: CompanyInfo[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? companies.filter((c) => c.name.toLowerCase().includes(q)) : companies;
  }, [companies, query]);

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
          placeholder="Filter companies…"
          className="w-full rounded-xl border border-border bg-elevated py-2.5 pl-10 pr-3 text-sm text-fg placeholder:text-muted/70 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/companies/${c.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-3 py-3 transition hover:border-accent/50 hover:bg-elevated"
          >
            <CompanyLogo name={c.name} size={38} />
            <div className="min-w-0">
              <div className="truncate font-medium text-fg group-hover:text-accent-soft">{c.name}</div>
              <div className="text-xs text-muted">
                {c.count} {c.count === 1 ? "problem" : "problems"}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted">
          No companies match “{query}”.
        </div>
      )}
    </div>
  );
}
