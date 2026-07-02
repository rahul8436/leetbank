"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardNav({
  prevKey,
  nextKey,
}: {
  prevKey: string | null;
  nextKey: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft" && prevKey) router.push(`/problems/${prevKey}`);
      else if (e.key === "ArrowRight" && nextKey) router.push(`/problems/${nextKey}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevKey, nextKey, router]);

  return null;
}
