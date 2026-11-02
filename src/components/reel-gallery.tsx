import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Play, Sparkles, X } from "lucide-react";
import type { SampleAd } from "@/data/ads";
import { formatLabel } from "@/data/ads";
import { LogoMark } from "@/components/brand";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

/** Instagram/IGTV-style gallery: sharp tall cards, click opens a reels viewer. */
export function ReelGallery({ ads }: { ads: SampleAd[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4">
        {ads.map((ad, i) => (
          <ReelCard key={ad.id} ad={ad} onOpen={() => setOpen(i)} />
        ))}
      </div>
      {open !== null && ads[open] && (
        <ReelViewer ads={ads} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}

function ReelCard({ ad, onOpen }: { ad: SampleAd; onOpen: () => void }) {
  const { lang } = usePrefs();
  const isVideo = ad.format === "video";
  return (
    <button
      onClick={onOpen}
      className="group relative aspect-[9/14] overflow-hidden rounded-[3px] bg-muted text-left outline-none ring-primary focus-visible:ring-2"
    >
      <img
        src={ad.image}
        alt={`${ad.title} — ${ad.business}`}
        loading="lazy"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />
      {isVideo && (
        <div className="absolute inset-x-3 top-3 h-[2px] bg-white/25">
          <div className="h-full w-1/2 bg-white" />
        </div>
      )}
      <span className="absolute right-3 top-5 text-[11px] font-semibold tabular-nums text-white">
        {isVideo ? ad.duration : formatLabel[ad.format][lang]}
      </span>
      {isVideo && (
        <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
      )}
      <div className="absolute inset-x-3 bottom-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">{formatLabel[ad.format][lang]}</p>
        <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white">{ad.title}</p>
        <p className="mt-0.5 text-[11px] text-white/70">{ad.business}</p>
      </div>
    </button>
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
  const ad = ads[index]!;
  const go = useCallback(
    (dir: number) => onIndex((index + dir + ads.length) % ads.length),
    [index, ads.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go(1);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 30) return;
      go(e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [go, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <div
        key={ad.id}
        onClick={(e) => e.stopPropagation()}
        className="relative h-[88vh] max-h-[860px] aspect-[9/16] max-w-[94vw] overflow-hidden rounded-[4px] bg-black animate-in fade-in zoom-in-95 duration-300"
      >
        <img src={ad.image} alt={ad.title} className={cn("size-full object-cover", ad.format === "video" && "animate-kenburns")} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
        <div className="absolute inset-x-3 top-3 flex gap-1">
          {ads.map((a, i) => (
            <div key={a.id} className="h-[2px] flex-1 overflow-hidden bg-white/25">
              {i < index && <div className="h-full w-full bg-white" />}
              {i === index && <div className="h-full animate-progress bg-white" />}
            </div>
          ))}
        </div>
        <div className="absolute left-3 top-6 flex items-center gap-2">
          <LogoMark variant="icon" className="size-8" />
          <div>
            <p className="text-sm font-bold text-white">{ad.business}</p>
            <p className="text-[11px] text-white/60">{formatLabel[ad.format][lang]} · {t("Urugero", "Sample")}</p>
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-5">
          <h3 className="text-2xl font-extrabold leading-tight text-white">{ad.title}</h3>
          <p className="mt-1 text-sm text-white/75">{lang === "rw" ? ad.descRw : ad.descEn}</p>
          <Link
            to="/app/create"
            search={{ ref: ad.id }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            <Sparkles className="size-4" /> {t("Kora irisa n'iri", "Make one like this")}
          </Link>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous" className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronUp /></button>
        <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next" className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronDown /></button>
      </div>
    </div>
  );
}
