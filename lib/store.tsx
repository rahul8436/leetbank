"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Status = "solved" | "attempted";
export interface ProgressEntry {
  status?: Status;
  starred?: boolean;
  ts: number;
}
export type Progress = Record<string, ProgressEntry>;
export type Theme = "light" | "dark";

const THEME_KEY = "leetbank:theme";
const USER_KEY = "leetbank:user";
const progressKey = (user: string | null) => `leetbank:progress:${user ?? "guest"}`;

interface AppState {
  ready: boolean;
  theme: Theme;
  toggleTheme: () => void;
  username: string | null;
  signIn: (name: string) => void;
  signOut: () => void;
  progress: Progress;
  setStatus: (key: string, status: Status | null) => void;
  toggleStar: (key: string) => void;
  exportData: () => string;
  importData: (text: string, mode: "merge" | "replace") => { ok: boolean; count: number; error?: string };
  resetProgress: () => void;
}

function mergeProgress(a: Progress, b: Progress): Progress {
  const out: Progress = { ...a };
  for (const [k, e] of Object.entries(b)) {
    const cur = out[k];
    if (!cur) {
      out[k] = e;
      continue;
    }
    const status: Status | undefined =
      cur.status === "solved" || e.status === "solved" ? "solved" : cur.status ?? e.status;
    out[k] = {
      status,
      starred: cur.starred || e.starred,
      ts: Math.max(cur.ts ?? 0, e.ts ?? 0),
    };
  }
  return out;
}

function sanitize(incoming: unknown): Progress {
  const src =
    incoming && typeof incoming === "object" && "progress" in (incoming as object)
      ? (incoming as { progress: unknown }).progress
      : incoming;
  const clean: Progress = {};
  if (src && typeof src === "object") {
    for (const [k, v] of Object.entries(src as Record<string, unknown>)) {
      if (!v || typeof v !== "object") continue;
      const e = v as { status?: unknown; starred?: unknown; ts?: unknown };
      const entry: ProgressEntry = { ts: typeof e.ts === "number" ? e.ts : Date.now() };
      if (e.status === "solved" || e.status === "attempted") entry.status = e.status;
      if (e.starred) entry.starred = true;
      if (entry.status || entry.starred) clean[k] = entry;
    }
  }
  return clean;
}

const AppContext = createContext<AppState | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [username, setUsername] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress>({});

  // hydrate from localStorage after mount
  useEffect(() => {
    const t: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const u = read<string | null>(USER_KEY, null);
    setTheme(t);
    setUsername(u);
    setProgress(read<Progress>(progressKey(u), {}));
    setReady(true);
  }, []);

  const persistProgress = useCallback(
    (user: string | null, next: Progress) => {
      try {
        localStorage.setItem(progressKey(user), JSON.stringify(next));
      } catch {}
    },
    []
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  const signIn = useCallback(
    (name: string) => {
      const clean = name.trim().slice(0, 24);
      if (!clean) return;
      // migrate guest progress into a fresh account
      const existing = read<Progress>(progressKey(clean), {});
      const guest = read<Progress>(progressKey(null), {});
      const merged =
        Object.keys(existing).length === 0 && Object.keys(guest).length > 0
          ? guest
          : existing;
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(clean));
      } catch {}
      persistProgress(clean, merged);
      setUsername(clean);
      setProgress(merged);
    },
    [persistProgress]
  );

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
    setUsername(null);
    setProgress(read<Progress>(progressKey(null), {}));
  }, []);

  const setStatus = useCallback(
    (key: string, status: Status | null) => {
      setProgress((prev) => {
        const cur = prev[key] ?? { ts: 0 };
        const next: Progress = { ...prev };
        if (status === null) {
          if (cur.starred) next[key] = { starred: true, ts: Date.now() };
          else delete next[key];
        } else {
          next[key] = { ...cur, status, ts: Date.now() };
        }
        persistProgress(username, next);
        return next;
      });
    },
    [username, persistProgress]
  );

  const toggleStar = useCallback(
    (key: string) => {
      setProgress((prev) => {
        const cur = prev[key] ?? { ts: 0 };
        const starred = !cur.starred;
        const next: Progress = { ...prev };
        if (!starred && !cur.status) delete next[key];
        else next[key] = { ...cur, starred, ts: Date.now() };
        persistProgress(username, next);
        return next;
      });
    },
    [username, persistProgress]
  );

  const exportData = useCallback(
    () =>
      JSON.stringify(
        { app: "leetbank", version: 1, username, exportedAt: new Date().toISOString(), progress },
        null,
        2
      ),
    [username, progress]
  );

  const importData = useCallback(
    (text: string, mode: "merge" | "replace") => {
      try {
        const clean = sanitize(JSON.parse(text));
        setProgress((prev) => {
          const next = mode === "replace" ? clean : mergeProgress(prev, clean);
          persistProgress(username, next);
          return next;
        });
        return { ok: true, count: Object.keys(clean).length };
      } catch {
        return { ok: false, count: 0, error: "Could not read that file" };
      }
    },
    [username, persistProgress]
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    persistProgress(username, {});
  }, [username, persistProgress]);

  const value = useMemo<AppState>(
    () => ({
      ready,
      theme,
      toggleTheme,
      username,
      signIn,
      signOut,
      progress,
      setStatus,
      toggleStar,
      exportData,
      importData,
      resetProgress,
    }),
    [
      ready,
      theme,
      toggleTheme,
      username,
      signIn,
      signOut,
      progress,
      setStatus,
      toggleStar,
      exportData,
      importData,
      resetProgress,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
