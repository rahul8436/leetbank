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
    }),
    [ready, theme, toggleTheme, username, signIn, signOut, progress, setStatus, toggleStar]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
