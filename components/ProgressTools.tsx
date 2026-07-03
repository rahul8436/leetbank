"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/store";

export default function ProgressTools() {
  const { exportData, importData, resetProgress, progress, username } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const tracked = Object.keys(progress).length;

  const doExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leetbank-progress${username ? "-" + username : ""}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg(`Exported ${tracked} tracked ${tracked === 1 ? "problem" : "problems"}.`);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = importData(String(reader.result), "merge");
      setMsg(res.ok ? `Imported & merged ${res.count} problems.` : res.error ?? "Import failed.");
    };
    reader.readAsText(file);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="text-sm font-semibold text-fg">Backup &amp; sync</div>
      <p className="mt-1 text-sm text-muted">
        Progress lives in this browser. Export a file to back it up or move it to another device.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={doExport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-fg-soft transition hover:border-accent/50 hover:text-fg"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
          </svg>
          Export
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-fg-soft transition hover:border-accent/50 hover:text-fg"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21V9m0 0 4 4m-4-4-4 4M4 3h16" />
          </svg>
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) doImport(f);
            e.target.value = "";
          }}
        />

        {confirmReset ? (
          <span className="inline-flex items-center gap-1.5">
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                setMsg("Progress cleared.");
              }}
              className="rounded-xl border border-hard/40 bg-hard/10 px-3 py-2 text-sm font-medium text-hard transition hover:bg-hard/20"
            >
              Confirm reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="rounded-xl px-2 py-2 text-sm text-muted transition hover:text-fg"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:text-hard"
          >
            Reset all
          </button>
        )}
      </div>

      {msg && <p className="mt-3 text-xs text-accent-soft">{msg}</p>}
    </div>
  );
}
