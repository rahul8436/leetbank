import type { Example } from "@/lib/types";

export default function Examples({ examples }: { examples: Example[] }) {
  return (
    <div className="flex flex-col gap-4">
      {examples.map((ex, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border bg-surface/50"
        >
          <div className="border-b border-border bg-elevated/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Example {i + 1}
          </div>
          <div className="space-y-3 p-4 text-sm">
            {ex.input != null && ex.input !== "" && (
              <Field label="Input" value={ex.input} />
            )}
            {ex.output != null && ex.output !== "" && (
              <Field label="Output" value={ex.output} />
            )}
            {ex.explanation && (
              <div>
                <div className="mb-1 text-xs font-medium text-muted">Explanation</div>
                <div className="whitespace-pre-wrap break-words font-mono text-[0.82rem] leading-relaxed text-fg-soft">
                  {ex.explanation}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
      <span className="w-16 shrink-0 text-xs font-medium text-muted">{label}</span>
      <code className="whitespace-pre-wrap break-words rounded-md bg-elevated px-2 py-1 font-mono text-[0.82rem] text-fg">
        {value}
      </code>
    </div>
  );
}
