"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import UsernameModal from "./UsernameModal";

const NAV = [
  { href: "/", label: "Problems", match: (p: string) => p === "/" || p.startsWith("/problems") },
  { href: "/companies", label: "Companies", match: (p: string) => p.startsWith("/companies") },
  { href: "/dashboard", label: "Dashboard", match: (p: string) => p.startsWith("/dashboard") },
];

export default function SiteHeader({ problemKeys }: { problemKeys: string[] }) {
  const { theme, toggleTheme, username, signOut, ready } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const goRandom = () => {
    const key = problemKeys[Math.floor(Math.random() * problemKeys.length)];
    if (key) router.push(`/problems/${key}`);
  };

  // Global shortcuts + external "open sign in" events
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        const search = document.getElementById("problem-search") as HTMLInputElement | null;
        if (search) {
          e.preventDefault();
          search.focus();
        } else {
          router.push("/");
        }
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        goRandom();
      }
    };
    const onSignin = () => setModalOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("leetbank:signin", onSignin as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("leetbank:signin", onSignin as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemKeys]);

  // close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-content items-center gap-2 px-4 sm:gap-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-indigo-500 text-xs font-bold text-white">
              LB
            </span>
            <span className="text-fg">
              Leet<span className="text-accent-soft">Bank</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 text-sm sm:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-1.5 transition ${
                  n.match(pathname)
                    ? "bg-elevated text-fg"
                    : "text-muted hover:bg-elevated hover:text-fg"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <IconButton label="Random problem (r)" onClick={goRandom}>
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
                <circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" stroke="none" />
              </svg>
            </IconButton>

            <IconButton label="Toggle theme" onClick={toggleTheme}>
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.5-6.5-1.4 1.4M6.9 17.1l-1.4 1.4m0-12.9 1.4 1.4m10.2 10.2 1.4 1.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
              )}
            </IconButton>

            {ready && username ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-elevated"
                  aria-label="Account menu"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent to-indigo-500 text-xs font-bold uppercase text-white">
                    {username.slice(0, 1)}
                  </span>
                  <span className="hidden max-w-[8rem] truncate text-sm text-fg-soft sm:block">
                    {username}
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 animate-scale-in overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                    <div className="border-b border-border px-3 py-2 text-xs text-muted">
                      Signed in as <span className="text-fg-soft">{username}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-fg-soft transition hover:bg-elevated"
                    >
                      My dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-hard transition hover:bg-elevated"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="ml-1 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-accent-soft"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-bg/90 backdrop-blur-lg sm:hidden">
        <div className="flex items-stretch">
          {NAV.map((n) => {
            const active = n.match(pathname);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-accent-soft" : "text-muted"
                }`}
              >
                <BottomIcon label={n.label} active={active} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <UsernameModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-elevated hover:text-fg"
    >
      {children}
    </button>
  );
}

function BottomIcon({ label, active }: { label: string; active: boolean }) {
  const cls = `h-5 w-5 ${active ? "text-accent-soft" : "text-muted"}`;
  if (label === "Problems")
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    );
  if (label === "Companies")
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z" />
    </svg>
  );
}
