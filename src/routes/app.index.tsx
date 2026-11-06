import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Film, FileImage, PanelTop, LayoutGrid } from "lucide-react";
import { AdCard } from "@/components/ad-card";
import { images, sampleAds } from "@/data/ads";
import { useLibrary } from "@/lib/library";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Ahabanza — Amamaza Studio" },
      { name: "description", content: "Twamamaze iki uyu munsi? Tangira gukora itangazo." },
      { property: "og:title", content: "Amamaza Studio" },
      { property: "og:description", content: "Ahabanza ha studio ya Amamaza." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = usePrefs();
  const { all } = useLibrary();
  const actions = [
    { type: "video", title: t("Video yamamaza", "Video ad"), Icon: Film, img: images.hotel },
    { type: "flyer", title: "Flyer", Icon: FileImage, img: images.fashion },
    { type: "banner", title: "Banner", Icon: PanelTop, img: images.shopBanner },
    { type: "template", title: t("Koresha template", "Use a template"), Icon: LayoutGrid, img: images.juice },
  ];
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t("Murakaza neza! Twamamaze iki uyu munsi?", "Welcome! What shall we advertise today?")}</h1>
      <p className="mt-2 text-muted-foreground">{t("Kora itangazo ryiza ry'ubucuruzi bwawe mu buryo bworoshye.", "Create a great ad for your business, simply.")}</p>

      <h2 className="mt-10 text-lg font-bold">{t("Ni iki wifuza gukora?", "What would you like to make?")}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.type}
            to={a.type === "template" ? "/app/templates" : "/app/create"}
            search={a.type === "template" ? {} : { type: a.type }}
            className="group relative aspect-[4/5] overflow-hidden rounded-lg sm:aspect-[4/3]"
          >
            <img src={a.img} alt={a.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 scrim" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-on-overlay">
              <div>
                <a.Icon className="size-5" />
                <p className="mt-2 font-display text-lg font-bold leading-tight">{a.title}</p>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{t("Ingero zikunzwe", "Popular templates")}</h2>
            <Link to="/app/templates" className="text-sm font-semibold text-primary">{t("Reba zose", "View all")}</Link>
          </div>
          <div className="no-scrollbar -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {sampleAds.slice(0, 5).map((ad) => <AdCard key={ad.id} ad={ad} tall className="w-56 shrink-0" />)}
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <p className="font-bold">{t("Uko bikora", "How it works")}</p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. {t("Hitamo ubwoko bw'itangazo", "Choose ad type")}</li>
              <li>2. {t("Sobanura ubucuruzi bwawe", "Describe your business")}</li>
              <li>3. {t("Emeza igiciro, ukuremo", "Confirm price, download")}</li>
            </ol>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t("Ibyo uheruka gukora", "Recent ads")}</h2>
          <Link to="/app/projects" className="text-sm font-semibold text-primary">{t("Byose", "All")}</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {all.slice(0, 3).map((i) => (
            <div key={i.id} className="overflow-hidden rounded-lg border bg-card">
              <img src={i.image} alt={i.name} loading="lazy" className="aspect-video w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-sm font-semibold">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.type} · {i.date}{i.demo ? ` · ${t("Urugero", "Sample")}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
