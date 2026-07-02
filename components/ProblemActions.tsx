"use client";

import { useApp } from "@/lib/store";

export default function ProblemActions({ problemKey }: { problemKey: string }) {
  const { progress, setStatus, toggleStar, ready, username } = useApp();
  const entry = ready ? progress[problemKey] : undefined;
  const solved = entry?.status === "solved";
  const attempted = entry?.status === "attempted";
  const starred = !!entry?.starred;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setStatus(problemKey, solved ? null : "solved")}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
          solved
            ? "border-easy/40 bg-easy/15 text-easy"
            : "border-border bg-surface text-fg-soft hover:border-easy/40 hover:text-easy"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {solved ? "Solved" : "Mark solved"}
      </button>

      <button
        onClick={() => setStatus(problemKey, attempted ? null : "attempted")}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
          attempted
            ? "border-medium/40 bg-medium/15 text-medium"
            : "border-border bg-surface text-fg-soft hover:border-medium/40 hover:text-medium"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
        {attempted ? "Attempted" : "Attempting"}
      </button>

      <button
        onClick={() => toggleStar(problemKey)}
        aria-label="Bookmark"
        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
          starred
            ? "border-medium/40 bg-medium/15 text-medium"
            : "border-border bg-surface text-fg-soft hover:border-medium/40 hover:text-medium"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill={starred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="m12 17.3-6.2 3.7 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.8 1.6 7z" />
        </svg>
        {starred ? "Saved" : "Save"}
      </button>

      {ready && !username && (entry?.status || entry?.starred) && (
        <button
          onClick={() => window.dispatchEvent(new Event("leetbank:signin"))}
          className="text-xs text-muted underline decoration-dotted underline-offset-2 transition hover:text-accent-soft"
        >
          Sign in to save under your name
        </button>
      )}
    </div>
  );
}
