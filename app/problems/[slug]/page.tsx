import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProblem, neighbors, allKeys } from "@/lib/problems";
import DifficultyBadge from "@/components/DifficultyBadge";
import Markdown from "@/components/Markdown";
import Examples from "@/components/Examples";
import Solutions from "@/components/Solutions";
import ProblemActions from "@/components/ProblemActions";
import KeyboardNav from "@/components/KeyboardNav";

export function generateStaticParams() {
  return allKeys().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProblem(params.slug);
  if (!p) return { title: "Not found" };
  const desc = (p.description ?? "")
    .replace(/[`*#>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
  return {
    title: `${p.problem_number}. ${p.title}`,
    description: desc || `${p.difficulty} interview problem: ${p.title}.`,
  };
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const p = getProblem(params.slug);
  if (!p) notFound();

  const { prev, next } = neighbors(p.key);
  const ex = p.explanation;
  const meta = p._list;
  const companies = p.companies ?? [];

  const sections: { id: string; label: string }[] = [
    p.description && { id: "description", label: "Description" },
    p.constraints?.length && { id: "constraints", label: "Constraints" },
    p.examples?.length && { id: "examples", label: "Examples" },
    ex && { id: "strategy", label: "Strategy" },
    p.solutions && Object.keys(p.solutions).length && { id: "solutions", label: "Solutions" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-8">
      <KeyboardNav prevKey={prev?.key ?? null} nextKey={next?.key ?? null} />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        All problems
      </Link>

      <header className="mt-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 font-mono text-sm text-muted">#{p.problem_number}</span>
          <h1 className="flex-1 text-2xl font-bold tracking-tight text-fg sm:text-3xl">{p.title}</h1>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <DifficultyBadge difficulty={p.difficulty} />
          {companies.map((c) => (
            <Link
              key={c}
              href={`/companies/${c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
              className="rounded-full bg-elevated px-2.5 py-0.5 text-fg-soft ring-1 ring-inset ring-border transition hover:text-accent-soft"
            >
              {c}
            </Link>
          ))}
        </div>
        {(meta?.role || meta?.round || meta?.asked_date) && (
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {meta?.role && <span>{meta.role_display ?? meta.role}</span>}
            {meta?.round && <span>{meta.round_display ?? meta.round}</span>}
            {meta?.asked_date && <span>Asked {meta.asked_date}</span>}
          </div>
        )}
        <div className="mt-4">
          <ProblemActions problemKey={p.key} />
        </div>
      </header>

      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10">
        <article className="min-w-0 space-y-10">
          {p.description && (
            <Section id="description" title="Description">
              <Markdown>{p.description}</Markdown>
            </Section>
          )}

          {p.constraints?.length ? (
            <Section id="constraints" title="Constraints">
              <ul className="space-y-1.5">
                {p.constraints.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-fg-soft">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="font-mono">{c}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {p.examples?.length ? (
            <Section id="examples" title="Examples">
              <Examples examples={p.examples} />
            </Section>
          ) : null}

          {p.notes && (
            <Section id="notes" title="Notes">
              <div className="whitespace-pre-wrap break-words rounded-xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-fg-soft">
                {p.notes}
              </div>
            </Section>
          )}

          {ex && (
            <Section id="strategy" title="Strategy & Explanation">
              <div className="space-y-6">
                {ex.problem_statement && (
                  <Block label="Problem statement">
                    <Markdown>{ex.problem_statement}</Markdown>
                  </Block>
                )}
                {ex.key_considerations && ex.key_considerations !== ex.problem_statement && (
                  <Block label="Key considerations">
                    <Markdown>{ex.key_considerations}</Markdown>
                  </Block>
                )}
                {ex.conceptual_approach && (
                  <Block label="Conceptual approach">
                    <Markdown>{ex.conceptual_approach}</Markdown>
                  </Block>
                )}

                {ex.strategy?.length ? (
                  <Block label="Step by step">
                    <ol className="space-y-3">
                      {ex.strategy.map((s, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-xs font-semibold text-accent-soft">
                            {s.step_number ?? i + 1}
                          </span>
                          <div className="min-w-0">
                            {s.step_title && (
                              <div className="text-sm font-medium text-fg">{s.step_title}</div>
                            )}
                            {s.step_description && (
                              <div className="mt-1 text-sm text-fg-soft">
                                <Markdown>{s.step_description}</Markdown>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </Block>
                ) : null}

                {ex.sample_execution?.content && (
                  <Block label="Sample execution">
                    <pre className="overflow-x-auto rounded-xl border border-border bg-[#0d0d14] p-4 font-mono text-[0.82rem] leading-relaxed text-gray-300">
                      {ex.sample_execution.content}
                    </pre>
                  </Block>
                )}

                {(ex.time_complexity || ex.space_complexity || ex.time_taken) && (
                  <div className="flex flex-wrap gap-2">
                    {ex.time_complexity && <Metric label="Time" value={ex.time_complexity} />}
                    {ex.space_complexity && <Metric label="Space" value={ex.space_complexity} />}
                    {ex.time_taken && <Metric label="Est. time" value={ex.time_taken} />}
                  </div>
                )}

                {ex.performance_analysis && (
                  <Block label="Performance analysis">
                    <Markdown>{ex.performance_analysis}</Markdown>
                  </Block>
                )}

                {ex.key_concepts?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {ex.key_concepts.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-border bg-surface/60 px-2.5 py-1 text-xs text-fg-soft"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Section>
          )}

          {p.solutions && Object.keys(p.solutions).length > 0 && (
            <Section id="solutions" title="Solutions">
              <Solutions solutions={p.solutions} />
            </Section>
          )}

          <nav className="flex items-stretch gap-3 border-t border-border pt-6">
            {prev ? (
              <Link
                href={`/problems/${prev.key}`}
                className="group flex flex-1 flex-col rounded-xl border border-border bg-surface/50 p-3 transition hover:border-accent/50 hover:bg-elevated"
              >
                <span className="text-xs text-muted">← Previous</span>
                <span className="truncate text-sm font-medium text-fg-soft group-hover:text-fg">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/problems/${next.key}`}
                className="group flex flex-1 flex-col items-end rounded-xl border border-border bg-surface/50 p-3 text-right transition hover:border-accent/50 hover:bg-elevated"
              >
                <span className="text-xs text-muted">Next →</span>
                <span className="w-full truncate text-sm font-medium text-fg-soft group-hover:text-fg">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </nav>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-5">
            {sections.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface/40 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  On this page
                </div>
                <ul className="space-y-1 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-md px-2 py-1 text-muted transition hover:bg-elevated hover:text-fg"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface/40 p-4 text-sm">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Details</div>
              <dl className="space-y-2.5">
                <Row label="Difficulty">
                  <DifficultyBadge difficulty={p.difficulty} />
                </Row>
                {p.primary_company && <Row label="Company">{p.primary_company}</Row>}
                {meta?.role && <Row label="Role">{meta.role_display ?? meta.role}</Row>}
                {meta?.round && <Row label="Round">{meta.round_display ?? meta.round}</Row>}
                {ex?.time_complexity && <Row label="Time">{ex.time_complexity}</Row>}
                {ex?.space_complexity && <Row label="Space">{ex.space_complexity}</Row>}
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-4 text-lg font-semibold text-fg">{title}</h2>
      {children}
    </section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-accent-soft">{label}</div>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-elevated px-3 py-1.5 text-sm">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <span className="font-mono text-fg">{value}</span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-fg-soft">{children}</dd>
    </div>
  );
}
