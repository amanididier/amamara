import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    let active = true;
    setMine([]);
    setLoading(true);
    setError("");
    void supabase
      .from("ad_comments")
      .select("name,body,created_at")
      .eq("ad_id", id)
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data, error }) => {
        if (!active) return;
        setLoading(false);
        if (error) setError("Comments could not load.");
        else
          setMine(
            (data ?? []).map((c) => ({
              name: c.name,
              text: c.body,
              at: new Date(c.created_at).getTime(),
            })),
          );
      });
    return () => {
      active = false;
    };
  }, [id]);

  const add = useCallback(
    async (name: string, text: string) => {
      if (!text.trim() || text.trim().length > 500 || name.trim().length > 60) return false;
      setSending(true);
      setError("");
      const { data, error } = await supabase
        .from("ad_comments")
        .insert({ ad_id: id, name: name.trim() || "Umushyitsi", body: text.trim() })
        .select("name,body,created_at")
        .single();
      setSending(false);
      if (error || !data) {
        setError("Your comment could not be saved. Please retry.");
        return false;
      }
      setMine((all) => [
        ...all,
        { name: data.name, text: data.body, at: new Date(data.created_at).getTime() },
      ]);
      return true;
    },
    [id],
  );

  return { comments: [...seed, ...mine], add, loading, error, sending };
}
