"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";

export default function UsernameModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { signIn } = useApp();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = () => {
    if (!name.trim()) return;
    signIn(name);
    setName("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-scale-in rounded-2xl border border-border bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent to-indigo-500 text-lg font-bold text-white">
          LB
        </div>
        <h2 className="mt-3 text-lg font-semibold text-fg">Pick a username</h2>
        <p className="mt-1 text-sm text-muted">
          No password, no email — it just tags your progress so it&apos;s saved on this
          device. You can change it anytime.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          maxLength={24}
          placeholder="e.g. rahul"
          className="mt-4 w-full rounded-xl border border-border bg-elevated px-3.5 py-2.5 text-sm text-fg outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-fg-soft transition hover:bg-elevated"
          >
            Not now
          </button>
          <button
            onClick={submit}
            disabled={!name.trim()}
            className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-soft disabled:opacity-40"
          >
            Start tracking
          </button>
        </div>
      </div>
    </div>
  );
}
