import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { topicList, topicBySlug, problemsForTopic } from "@/lib/problems";
import ProblemList from "@/components/ProblemList";

export function generateStaticParams() {
  return topicList.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = topicBySlug(params.slug);
  if (!t) return { title: "Topic not found" };
  return {
    title: `${t.name} problems`,
    description: `${t.count} ${t.name} interview problems with strategies and full solutions.`,
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const t = topicBySlug(params.slug);
  if (!t) notFound();
  const items = problemsForTopic(t.name).sort((a, b) => a.number - b.number);
  const counts = {
    Easy: items.filter((i) => i.difficulty === "Easy").length,
    Medium: items.filter((i) => i.difficulty === "Medium").length,
    Hard: items.filter((i) => i.difficulty === "Hard").length,
  };

  return (
    <div className="mx-auto max-w-content px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/topics"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        All topics
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{t.name}</h1>
          <p className="mt-1 text-muted">
            {t.count} {t.count === 1 ? "problem" : "problems"}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-easy/10 px-2.5 py-1 font-medium text-easy ring-1 ring-inset ring-easy/30">
            {counts.Easy} Easy
          </span>
          <span className="rounded-full bg-medium/10 px-2.5 py-1 font-medium text-medium ring-1 ring-inset ring-medium/30">
            {counts.Medium} Medium
          </span>
          <span className="rounded-full bg-hard/10 px-2.5 py-1 font-medium text-hard ring-1 ring-inset ring-hard/30">
            {counts.Hard} Hard
          </span>
        </div>
      </header>

      <div className="mt-8">
        <ProblemList items={items} />
      </div>
    </div>
  );
}
