import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AdCard } from "@/components/ad-card";
import { sampleAds, type Format } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export function TrendingSection() {
  const { t, lang } = usePrefs();
  const tabs: { id: Format | "all"; rw: string; en: string }[] = [
    { id: "all", rw: "Byose", en: "All" },
    { id: "video", rw: "Video", en: "Videos" },
    { id: "flyer", rw: "Amaposti", en: "Posts" },
    { id: "banner", rw: "Ibyapa", en: "Banners" },
  ];
  const [tab, setTab] = useState<Format | "all">("all");
  const list = sampleAds.filter((a) => tab === "all" || a.format === tab);

  return (
    <section id="trending" className="border-y bg-[#090909] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
              {t("Byamamaye", "Trending")}
            </span>
            <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
              {t("Reba ibyo abandi bakora.", "See what others are creating.")}
            </h2>
          </div>
          <Link to="/examples" className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-primary">
            {t("Reba zose", "View all")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                tab === tb.id ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white",
              )}
            >
              {lang === "rw" ? tb.rw : tb.en}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((ad) => (
            <AdCard key={ad.id} ad={ad} tall className="[&_h3]:text-white [&_p]:text-white/50" />
          ))}
        </div>
      </div>
    </section>
  );
}
