import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, Image as ImageIcon } from "lucide-react";
import { ReelGallery } from "@/components/reel-gallery";
import { sampleAds } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const mixedCardOrder: Record<"video" | "flyer", number[]> = {
  video: [0, 2, 1, 0, 1, 2, 0, 2],
  flyer: [1, 0, 1, 0, 0, 1, 0, 1],
};

export function TrendingSection() {
  const { t, lang } = usePrefs();
  const [tab, setTab] = useState<"video" | "flyer">("video");
  const list = useMemo(() => {
    const source = sampleAds.filter((ad) => ad.format === tab);
    if (source.length === 0) return source;
    // Phase 1: video + social posts only (banners deferred)
    return mixedCardOrder[tab as "video" | "flyer"].map((index) => source[index % source.length]!);
  }, [tab]);
  const tabs = [
    { id: "video" as const, rw: "Video", en: "Videos", Icon: Clapperboard },
    { id: "flyer" as const, rw: "Amaposti", en: "Posts", Icon: ImageIcon },
  ];

  return (
    <section id="trending" className="border-y bg-background py-12 text-foreground sm:py-16">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t("Byamamaye", "Trending")}</span>
            <h2 className="mt-2 max-w-2xl text-[1.65rem] font-bold leading-tight tracking-[-0.04em] sm:text-3xl">{t("Reba ibyo abandi bakora.", "See what others are creating.")}</h2>
          </div>
          <Link to="/examples" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-75">
            {t("Reba byinshi", "See more")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="sticky top-16 z-40 -mx-6 mt-7 flex w-full items-center justify-center gap-6 border-b bg-background px-6 sm:-mx-10 sm:w-auto sm:justify-start sm:gap-10 sm:px-10 lg:-mx-12 lg:px-12" role="tablist" aria-label={t("Ubwoko bw'amatangazo", "Ad formats")}>
          {tabs.map(({ id, rw, en, Icon }) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={cn("relative inline-flex min-h-12 items-center gap-2 border-b-2 px-1 text-[13px] font-semibold transition-colors sm:text-sm",
                tab === id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="size-4" />
              {lang === "rw" ? rw : en}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel">
          <ReelGallery ads={list} />
        </div>
      </div>
    </section>
  );
}
