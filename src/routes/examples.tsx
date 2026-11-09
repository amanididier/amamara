import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ReelGallery } from "@/components/reel-gallery";
import { categories, sampleAds, type Category, type Format } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Ad Examples & Design Inspiration in Rwanda | Amamara" },
      { name: "description", content: "Browse advertising examples for Rwandan businesses, including promotional videos, social media posts, flyers and shop banners for restaurants, hotels, salons and more." },
      { property: "og:title", content: "Advertising Examples & Inspiration | Amamara" },
      { property: "og:description", content: "Explore sample ads and creative ideas for businesses in Rwanda. Reba ingero za video, flyers, posts n'ibyapa." },
    ],
    links: [{"rel":"canonical","href":"https://amamaza.vercel.app/examples"}],
  }),
  component: Examples,
});

function Examples() {
  const { t, lang } = usePrefs();
  const [cat, setCat] = useState<Category | "all">("all");
  const [fmt, setFmt] = useState<Format | "all">("all");
  const list = sampleAds.filter((a) => (cat === "all" || a.category === cat) && (fmt === "all" || a.format === fmt));
  const fmts: { id: Format | "all"; l: string }[] = [
    { id: "all", l: t("Byose", "All") },
    { id: "video", l: "Video" },
    { id: "flyer", l: "Flyer" },
    { id: "banner", l: "Banner" },
  ];
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-extrabold sm:text-6xl">{t("Ingero z'amatangazo", "Ad examples")}</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {t("Izi ni ingero zakozwe ngo zikwereke ibishoboka. Hitamo imwe, uyihindure ibe iyawe.", "These samples show what's possible. Pick one and make it yours.")}
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {fmts.map((f) => (
            <button key={f.id} onClick={() => setFmt(f.id)} className={cn("rounded-full px-4 py-2 text-sm font-semibold", fmt === f.id ? "bg-foreground text-background" : "border text-muted-foreground")}>
              {f.l}
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
        <div className="mt-8 rounded-lg border border-white/10 bg-black p-3 shadow-2xl sm:p-5">
          {list.length > 0 && <ReelGallery ads={list} />}
        {list.length === 0 && <p className="py-20 text-center text-white/55">{t("Nta rugero ruhari ubu.", "No samples here yet.")}</p>}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
