import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, Play, Sparkles } from "lucide-react";
import type { SampleAd } from "@/data/ads";
import { categories, formatLabel } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

/** Visual ad card. "Video" samples play a motion preview (demo). */
export function AdCard({ ad, className, tall }: { ad: SampleAd; className?: string; tall?: boolean }) {
  const { t, lang } = usePrefs();
  const [playing, setPlaying] = useState(false);
  const isVideo = ad.format === "video";
  const cat = categories.find((c) => c.id === ad.category);

  return (
    <article className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-muted",
          tall ? "aspect-[4/5]" : ad.format === "banner" ? "aspect-[3/2]" : "aspect-[4/5]",
        )}
        onMouseEnter={() => isVideo && setPlaying(true)}
        onMouseLeave={() => isVideo && setPlaying(false)}
      >
        <img
          src={ad.image}
          alt={`${ad.title} — ${ad.business}`}
          loading="lazy"
          className={cn(
            "size-full object-cover transition-transform duration-700",
            playing ? "animate-kenburns" : "group-hover:scale-[1.03]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 scrim opacity-70" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-overlay px-2.5 py-1 text-[11px] font-semibold text-on-overlay backdrop-blur">
            {formatLabel[ad.format][lang]}
          </span>
          <span className="rounded-full bg-overlay px-2.5 py-1 text-[11px] font-medium text-on-overlay/80 backdrop-blur">
            {t("Urugero", "Sample")}
          </span>
        </div>
        {isVideo && (
          <>
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
            </button>
            <span className="absolute bottom-4 left-3 rounded bg-overlay px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-on-overlay">
              {ad.duration}
            </span>
            {playing && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-on-overlay/20">
                <div className="h-full animate-progress bg-primary" />
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[15px] font-semibold">{ad.title}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {ad.business} · {cat?.[lang]} · {ad.ratio}
          </p>
        </div>
        <Link
          to="/app/create"
          search={{ ref: ad.id }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
        >
          <Sparkles className="size-3.5" />
          {t("Kora ibisa n'ibi", "Make similar")}
        </Link>
      </div>
    </article>
  );
}
