import { metaList, companies, stats } from "@/lib/problems";
import ProblemBrowser from "@/components/ProblemBrowser";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <section className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Interview problems that <span className="text-accent-soft">actually</span> get asked.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">
          {stats.total} company-tagged coding questions — each with a strategy,
          worked examples, complexity analysis, and full solutions in multiple
          languages.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Stat label="Total" value={stats.total} tone="accent" />
          <Stat label="Easy" value={stats.easy} tone="easy" />
          <Stat label="Medium" value={stats.medium} tone="medium" />
          <Stat label="Hard" value={stats.hard} tone="hard" />
        </div>
      </section>

      <ProblemBrowser problems={metaList} companies={companies} />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "accent" | "easy" | "medium" | "hard";
}) {
  const tones: Record<string, string> = {
    accent: "text-accent-soft border-accent/30 bg-accent/5",
    easy: "text-easy border-easy/30 bg-easy/5",
    medium: "text-medium border-medium/30 bg-medium/5",
    hard: "text-hard border-hard/30 bg-hard/5",
  };
  return (
    <div
      className={`flex items-baseline gap-2 rounded-xl border px-3.5 py-2 ${tones[tone]}`}
    >
      <span className="text-lg font-semibold tabular-nums">{value}</span>
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}
