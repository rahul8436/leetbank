"use client";

import { useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import { cleanCode, hljsLang } from "@/lib/utils";

hljs.registerLanguage("python", python);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);

const ORDER = ["Python", "Java", "C++", "JavaScript", "C", "Go", "TypeScript"];

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlight(code: string, label: string) {
  const lang = hljsLang(label);
  if (hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang }).value;
    } catch {
      /* fall through */
    }
  }
  return escapeHtml(code);
}

export default function Solutions({
  solutions,
}: {
  solutions: Record<string, string>;
}) {
  const items = useMemo(() => {
    return Object.entries(solutions)
      .map(([lang, raw]) => ({ lang, code: cleanCode(raw) }))
      .filter((x) => x.code.trim().length > 0)
      .sort((a, b) => {
        const ia = ORDER.indexOf(a.lang);
        const ib = ORDER.indexOf(b.lang);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
  }, [solutions]);

  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#0d0d14]">
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-surface/60 px-2 py-1.5">
        {items.map((it, i) => (
          <button
            key={it.lang}
            onClick={() => setActive(i)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              i === active
                ? "bg-elevated text-fg"
                : "text-muted hover:text-fg-soft"
            }`}
          >
            {it.lang}
          </button>
        ))}
        <button
          onClick={copy}
          disabled={!revealed}
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-elevated hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4 text-easy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code / reveal gate */}
      <div className="relative">
        <pre className="hljs overflow-x-auto">
          <code
            className={revealed ? "" : "select-none blur-sm"}
            dangerouslySetInnerHTML={{ __html: highlight(current.code, current.lang) }}
          />
        </pre>
        {!revealed && (
          <div className="absolute inset-0 grid place-items-center bg-[#0d0d14]/40">
            <button
              onClick={() => setRevealed(true)}
              className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent-soft backdrop-blur transition hover:bg-accent/20"
            >
              Reveal solution
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
