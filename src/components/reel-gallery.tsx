import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Play, Send, Sparkles, X } from "lucide-react";
import type { SampleAd } from "@/data/ads";
import { formatLabel } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { formatCount, useComments, useLike } from "@/lib/likes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ReelGallery({ ads }: { ads: SampleAd[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-x-3 gap-y-5 max-sm:[&>article:nth-child(n+5)]:hidden sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6 lg:grid-cols-4">
        {ads.map((ad, i) => (
          <ReelCard key={`${ad.id}-tile-${i}`} ad={ad} onOpen={() => setOpen(i)} />
        ))}
      </div>
      {open !== null && ads[open] && (
        <ReelViewer ads={ads} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function ReelCard({ ad, onOpen }: { ad: SampleAd; onOpen: () => void }) {
  const { lang, t } = usePrefs();
  const { liked, count, toggle } = useLike(ad.id);
  const isVideo = ad.format === "video";
  return (
    <article className="group min-w-0">
      <button
        onClick={onOpen}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-none bg-muted text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <img
          src={ad.image}
          alt={ad.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
        />
        {isVideo && (
          <span className="absolute inset-x-3 top-3 h-[2px] bg-white/35">
            <span className="block h-full w-2/5 bg-white" />
          </span>
        )}
        <span className="absolute right-3 top-5 text-[11px] font-semibold text-white drop-shadow">
          {isVideo ? ad.duration : formatLabel[ad.format][lang]}
        </span>
        {isVideo && (
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-12 text-white">
          <span className="block text-sm font-bold leading-snug">{ad.title}</span>
          <span className="mt-0.5 block text-[11px] text-white/70">{ad.business}</span>
        </span>
      </button>
      <div className="flex items-center justify-between gap-2 py-2">
        <button
          onClick={toggle}
          aria-label={liked ? t("Kuraho umutima", "Unlike") : t("Kunda", "Like")}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-semibold",
            liked ? "text-primary" : "text-muted-foreground hover:text-primary",
          )}
        >
          <Heart className={cn("size-4", liked && "fill-current")} /> {formatCount(count)}
        </button>
        <button
          onClick={onOpen}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          {t("Reba", "View")}
        </button>
      </div>
    </article>
  );
}

function ReelViewer({
  ads,
  index,
  onIndex,
  onClose,
}: {
  ads: SampleAd[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { t, lang } = usePrefs();
  const ad = ads[index] ?? ads[0];
  if (!ad) return null;
  const { liked, count, toggle } = useLike(ad.id);
  const { comments, add, loading, error, sending } = useComments(ad.id, []);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [heartBurst, setHeartBurst] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const go = useCallback(
    (dir: number) => onIndex((index + dir + ads.length) % ads.length),
    [index, ads.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const likeFromDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 320) {
      if (!liked) toggle();
      setHeartBurst(true);
      window.setTimeout(() => setHeartBurst(false), 900);
    }
    setLastTap(now);
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (await add(name, comment)) setComment("");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ad.title}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <div
        key={ad.id}
        onClick={(e) => e.stopPropagation()}
        className="grid max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-background text-foreground shadow-2xl md:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]"
      >
        <div
          className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-black md:min-h-[620px]"
          onClick={likeFromDoubleTap}
        >
          <img src={ad.image} alt={ad.title} className="max-h-[88vh] w-full object-contain" />
          {heartBurst && (
            <Heart className="pointer-events-none absolute size-24 animate-heart-pop fill-white text-white drop-shadow-xl" />
          )}
          <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
            {formatLabel[ad.format][lang]} · {t("Urugero", "Sample")}
          </span>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-sm font-semibold">{ad.business}</span>
            <span className="text-xs text-white/70">
              {index + 1} / {ads.length}
            </span>
          </div>
        </div>
        <aside className="flex min-h-0 flex-col bg-card">
          <div className="border-b p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {ad.business}
                </p>
                <h2 className="mt-1 text-xl font-bold">{ad.title}</h2>
              </div>
              <button
                onClick={toggle}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-1 text-xs",
                  liked ? "text-primary" : "text-muted-foreground",
                )}
                aria-label="Like"
              >
                <Heart className={cn("size-6", liked && "fill-current")} />
                <span>{formatCount(count)}</span>
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {lang === "rw" ? ad.descRw : ad.descEn}
            </p>
            <Link
              to="/app/create"
              search={{ ref: ad.id }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              <Sparkles className="size-4" /> {t("Kora ibisa nk'ibi", "Make similar")}
            </Link>
          </div>
          <div className="flex items-center gap-2 border-b px-5 py-3 text-sm font-semibold">
            <MessageCircle className="size-4" /> {t("Ibitekerezo", "Comments")} ({comments.length})
          </div>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {loading && (
              <p className="text-sm text-muted-foreground">
                {t("Turimo kuzana ibitekerezo…", "Loading comments…")}
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {!loading && !error && comments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t("Ba uwa mbere gutanga igitekerezo.", "Be the first to comment.")}
              </p>
            )}
            {comments.map((c, i) => (
              <div key={i}>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => void submit(e)}
            className="sticky bottom-0 space-y-2 border-t bg-card p-4"
          >
            <input
              aria-label="Name (optional)"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Izina (si ngombwa)", "Name (optional)")}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex items-end gap-2 rounded-md border bg-background p-2 focus-within:border-primary">
              <textarea
                aria-label="Add a comment"
                maxLength={500}
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("Andika igitekerezo...", "Add a comment...")}
                className="min-w-0 flex-1 resize-none bg-background px-1 py-1 text-sm outline-none"
              />
              <Button
                type="submit"
                disabled={!comment.trim() || sending}
                aria-label="Post comment"
                title="Post comment"
                size="icon"
                className="shrink-0"
              >
                <Send />
              </Button>
            </div>
          </form>
          <div className="flex justify-between border-t px-4 py-3">
            <button
              onClick={() => go(-1)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              {t("Ibibanziriza", "Previous")}
            </button>
            <button
              onClick={() => go(1)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              {t("Ibikurikira", "Next")}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
