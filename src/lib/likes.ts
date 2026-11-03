import { useCallback, useEffect, useState } from "react";

/**
 * Anonymous likes & comments (no account needed). Stored in the visitor's
 * browser; each sample also has a base count so cards never show zero.
 */
const LIKE_KEY = "amamaza-likes";
const COMMENT_KEY = "amamaza-comments";
const EVT = "amamaza-social";

export interface Comment {
  name: string;
  text: string;
  at: number;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return (JSON.parse(localStorage.getItem(key) ?? "null") as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVT));
}

/** Stable pseudo-random base like count per id (so numbers look real). */
export function baseLikes(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 120 + (h % 2400);
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function useLike(id: string) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const sync = () => setLiked(read<string[]>(LIKE_KEY, []).includes(id));
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, [id]);

  const set = useCallback(
    (on: boolean) => {
      const list = read<string[]>(LIKE_KEY, []).filter((x) => x !== id);
      if (on) list.push(id);
      write(LIKE_KEY, list);
    },
    [id],
  );

  return {
    liked,
    count: baseLikes(id) + (liked ? 1 : 0),
    like: () => set(true),
    toggle: () => set(!liked),
  };
}

export function useComments(id: string, seed: Comment[]) {
  const [mine, setMine] = useState<Comment[]>([]);
  useEffect(() => {
    const sync = () => setMine(read<Record<string, Comment[]>>(COMMENT_KEY, {})[id] ?? []);
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, [id]);

  const add = useCallback(
    (name: string, text: string) => {
      const all = read<Record<string, Comment[]>>(COMMENT_KEY, {});
      all[id] = [
        ...(all[id] ?? []),
        { name: name.trim() || "Umushyitsi", text: text.trim(), at: Date.now() },
      ];
      write(COMMENT_KEY, all);
    },
    [id],
  );

  return { comments: [...seed, ...mine], add };
}
