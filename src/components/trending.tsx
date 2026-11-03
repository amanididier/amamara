import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ReelGallery } from "@/components/reel-gallery";
import { sampleAds, type Format } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export function TrendingSection() {
  const { t, lang } = usePrefs();
  const [tab, setTab] = useState<Format>("video");
  const list = useMemo(() => sampleAds.filter((ad) => ad.format === tab), [tab]);
  const tabs: { id: Format; rw: string; en: string; style: string; active: string }[] = [
    { id: "video", rw: "Video", en: "Videos", style: "bg-primary/10 text-primary hover:bg-primary/15", active: "bg-primary text-white" },
    { id: "flyer", rw: "Amaposti", en: "Posts", style: "bg-sky-100 text-sky-800 hover:bg-sky-200", active: "bg-sky-500 text-white" },
    { id: "banner", rw: "Ibyapa", en: "Banners", style: "bg-lime-100 text-lime-900 hover:bg-lime-200", active: "bg-lime-500 text-white" },
  ];

  return (
    <section id="trending" className="border-y bg-background py-14 text-foreground sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{t("Byamamaye", "Trending")}</span>
            <h2 className="mt-2 text-3xl font-bold sm:text-5xl">{t("Reba ibyo abandi bakora.", "See what others are creating.")}</h2>
          </div>
          <Link to="/examples" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            {t("Reba byinshi", "See more")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5" role="tablist" aria-label={t("Ubwoko bw'amatangazo", "Ad formats")}>
          {tabs.map((item) => (
            <button key={item.id} role="tab" aria-selected={tab === item.id} onClick={() => setTab(item.id)}
              className={cn("rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200", tab === item.id ? item.active : item.style)}>
              {lang === "rw" ? item.rw : item.en}
            </button>
          ))}
        </div>

        <div className="mt-7" role="tabpanel">
          {tab === "banner" ? (
            <div className="grid gap-5 md:grid-cols-2">
              {list.map((ad) => (
                <Link key={ad.id} to="/examples" className="group grid overflow-hidden border bg-card transition-shadow hover:shadow-xl sm:grid-cols-[1.5fr_1fr]">
                  <div className="aspect-[16/8] overflow-hidden bg-muted sm:aspect-auto">
                    <img src={ad.image} alt={ad.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-col justify-center p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("Urugero rw'icyapa", "Banner example")}</span>
                    <h3 className="mt-2 text-lg font-bold">{ad.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{lang === "rw" ? ad.descRw : ad.descEn}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">{t("Reba ingero", "Explore examples")} <ArrowRight className="size-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : <ReelGallery ads={list.slice(0, 8)} />}
        </div>
      </div>
    </section>
  );
}
