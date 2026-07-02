"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ProblemMeta } from "@/lib/types";
import { useApp } from "@/lib/store";
import ProblemList from "./ProblemList";

export default function Dashboard({ problems }: { problems: ProblemMeta[] }) {
  const { username, progress, ready } = useApp();

  const bySlug = useMemo(() => {
    const m = new Map<string, ProblemMeta>();
    for (const p of problems) m.set(p.slug, p);
    return m;
  }, [problems]);

  const data = useMemo(() => {
    const entries = Object.entries(progress);
    const pick = (fn: (e: (typeof entries)[number][1]) => boolean) =>
      entries
        .filter(([, e]) => fn(e))
        .sort((a, b) => (b[1].ts ?? 0) - (a[1].ts ?? 0))
        .map(([k]) => bySlug.get(k))
        .filter(Boolean) as ProblemMeta[];

    const solved = pick((e) => e.status === "solved");
    const attempted = pick((e) => e.status === "attempted");
    const starred = pick((e) => !!e.starred);

    const totals = { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>;
    const solvedByDiff = { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>;
    for (const p of problems) totals[p.difficulty] = (totals[p.difficulty] ?? 0) + 1;
    for (const p of solved) solvedByDiff[p.difficulty] = (solvedByDiff[p.difficulty] ?? 0) + 1;

    return { solved, attempted, starred, totals, solvedByDiff };
  }, [progress, bySlug, problems]);

  const total = problems.length;
  const pct = total ? Math.round((data.solved.length / total) * 100) : 0;
  const nothing = ready && data.solved.length === 0 && data.attempted.length === 0 && data.starred.length === 0;

  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {username ? (
              <>
                Hey <span className="text-accent-soft">{username}</span> 👋
              </>
            ) : (
              "Your progress"
            )}
          </h1>
          <p className="mt-1 text-muted">
            {username
              ? "Everything here is saved on this device under your username."
              : "Tracking as guest on this device."}
          </p>
        </div>
        {ready && !username && (
          <button
            onClick={() => window.dispatchEvent(new Event("leetbank:signin"))}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-soft"
          >
            Sign in to name your progress
          </button>
        )}
      </header>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard value={data.solved.length} label="Solved" tone="easy" />
        <StatCard value={data.attempted.length} label="In progress" tone="medium" />
        <StatCard value={data.starred.length} label="Saved" tone="accent" />
        <StatCard value={`${pct}%`} label={`of ${total} done`} tone="fg" />
      </div>

      {/* Difficulty progress */}
      <div className="mt-6 rounded-2xl border border-border bg-surface/40 p-5">
        <div className="mb-4 text-sm font-semibold text-fg">Completion by difficulty</div>
        <div className="space-y-4">
          {(["Easy", "Medium", "Hard"] as const).map((d) => (
            <Bar
              key={d}
              label={d}
              done={data.solvedByDiff[d] ?? 0}
              total={data.totals[d] ?? 0}
              tone={d === "Easy" ? "easy" : d === "Medium" ? "medium" : "hard"}
            />
          ))}
        </div>
      </div>

      {nothing ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="text-4xl">🚀</div>
          <p className="mt-3 text-fg-soft">You haven&apos;t tracked anything yet.</p>
          <p className="text-sm text-muted">Open a problem and mark it solved, attempted, or saved.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-soft"
          >
            Browse problems
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {data.starred.length > 0 && <ListSection title="⭐ Saved" items={data.starred} />}
          {data.attempted.length > 0 && <ListSection title="⏳ In progress" items={data.attempted} />}
          {data.solved.length > 0 && <ListSection title="✅ Solved" items={data.solved} />}
        </div>
      )}
    </div>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: number | string;
  label: string;
  tone: "easy" | "medium" | "hard" | "accent" | "fg";
}) {
  const tones: Record<string, string> = {
    easy: "text-easy",
    medium: "text-medium",
    hard: "text-hard",
    accent: "text-accent-soft",
    fg: "text-fg",
  };
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-4">
      <div className={`text-3xl font-bold tabular-nums ${tones[tone]}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

function Bar({
  label,
  done,
  total,
  tone,
}: {
  label: string;
  done: number;
  total: number;
  tone: "easy" | "medium" | "hard";
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const bg: Record<string, string> = { easy: "bg-easy", medium: "bg-medium", hard: "bg-hard" };
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-fg-soft">{label}</span>
        <span className="tabular-nums text-muted">
          {done} / {total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-elevated">
        <div className={`h-full rounded-full ${bg[tone]} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: ProblemMeta[] }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-fg">
        {title} <span className="text-sm font-normal text-muted">({items.length})</span>
      </h2>
      <ProblemList items={items} />
    </section>
  );
}
