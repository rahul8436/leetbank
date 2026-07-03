import type { Metadata } from "next";
import { topicList } from "@/lib/problems";
import TopicsBrowser from "@/components/TopicsBrowser";

export const metadata: Metadata = {
  title: "Topics",
  description: "Study interview problems by algorithm pattern — DP, graphs, two pointers, and more.",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">Study by pattern</h1>
      <p className="mt-2 text-muted">
        {topicList.length} algorithm patterns across the problem bank. Drill the ones you&apos;re weak on.
      </p>

      <div className="mt-8">
        <TopicsBrowser topics={topicList} />
      </div>
    </div>
  );
}
