import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, formatLabel, sampleAds, type Category, type Format } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/templates")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Ingero (Templates) — Amamara" },
      { name: "description", content: "Hitamo template y'itangazo uyihindure ibe iyawe." },
      { property: "og:title", content: "Templates — Amamara" },
      { property: "og:description", content: "Templates z'amatangazo y'ubucuruzi." },
    ],
  }),
  component: Templates,
});

function Templates() {
  const { t, lang } = usePrefs();
  const [cat, setCat] = useState<Category | "all">("all");
  const [fmt, setFmt] = useState<Format | "all">("all");
  const list = sampleAds.filter((a) => (cat === "all" || a.category === cat) && (fmt === "all" || a.format === fmt));
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{t("Ingero (Templates)", "Templates")}</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "video", "flyer", "banner"] as const).map((f) => (
          <button key={f} onClick={() => setFmt(f)} className={cn("rounded-full px-4 py-2 text-sm font-semibold", fmt === f ? "bg-foreground text-background" : "border text-muted-foreground")}>
            {f === "all" ? t("Byose", "All") : formatLabel[f][lang]}
          </button>
        ))}
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {categories.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold", cat === c.id ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground")}>
            {c[lang]}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ad) => (
          <div key={ad.id} className="overflow-hidden rounded-lg border bg-card">
            <img src={ad.image} alt={ad.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="rounded-full bg-muted px-2 py-0.5">{formatLabel[ad.format][lang]}</span>
                <span>{categories.find((c) => c.id === ad.category)?.[lang]}</span>
                <span>· {ad.ratio}</span>
              </div>
              <h2 className="mt-3 text-lg font-bold">{ad.title}</h2>
              <p className="text-sm text-muted-foreground">{lang === "rw" ? ad.descRw : ad.descEn}</p>
              <Link to="/app/create" search={{ ref: ad.id }} className="mt-4 block rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">
                {t("Koresha iyi template", "Use this template")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
