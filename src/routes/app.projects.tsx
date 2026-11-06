import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Plus } from "lucide-react";
import { SocialPostLinks } from "@/components/social-post-links";
import { useLibrary } from "@/lib/library";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/projects")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Ibikorwa byanjye — Amamaza" },
      { name: "description", content: "Amatangazo yawe yose ahantu hamwe." },
      { property: "og:title", content: "Ibikorwa byanjye — Amamaza" },
      { property: "og:description", content: "Isomero ry'amatangazo yawe." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { t } = usePrefs();
  const { all } = useLibrary();
  const [f, setF] = useState("all");
  const filters = [
    { id: "all", l: t("Byose", "All") },
    { id: "video", l: "Videos" },
    { id: "flyer", l: "Flyers" },
    { id: "banner", l: "Banners" },
    { id: "progress", l: t("Biri gukorwa", "In progress") },
    { id: "done", l: t("Byarangiye", "Completed") },
  ];
  const list = all.filter((i) => f === "all" || i.type === f || i.status === f);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{t("Ibikorwa byanjye", "My ads")}</h1>
        <Link to="/app/create" className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />{t("Gishya", "New")}</Link>
      </div>
      <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4">
        {filters.map((x) => (
          <button key={x.id} onClick={() => setF(x.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold", f === x.id ? "bg-foreground text-background" : "border text-muted-foreground")}>{x.l}</button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map((i) => (
          <div key={i.id} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative">
              <img src={i.image} alt={i.name} loading="lazy" className="aspect-square w-full object-cover" />
              {i.demo && <span className="absolute left-2 top-2 rounded-full bg-overlay px-2 py-0.5 text-[11px] font-semibold text-on-overlay">{t("Urugero", "Sample")}</span>}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-semibold">{i.name}</p>
              <p className="text-xs capitalize text-muted-foreground">{i.type} · {i.date}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", i.status === "done" ? "bg-success/15 text-success" : "bg-creative/20 text-creative")}>
                  {i.status === "done" ? t("Byarangiye", "Completed") : t("Biri gukorwa", "In progress")}
                </span>
                <a href={i.image} download className="grid size-8 place-items-center rounded-full border hover:text-primary" aria-label="Download"><Download className="size-4" /></a>
              </div>
              {!i.demo && i.status === "done" && <SocialPostLinks />}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
