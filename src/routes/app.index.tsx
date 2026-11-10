import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, FileImage, PanelTop, UserRound, Clock3 } from "lucide-react";
import { AdCard } from "@/components/ad-card";
import { sampleAds, type Format } from "@/data/ads";
import { StudioHero } from "@/components/studio-hero";
import { useLibrary } from "@/lib/library";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Home — Amamara Studio" },
      { name: "description", content: "Create beautiful advertising with Amamara Studio." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = usePrefs();
  const { all } = useLibrary();
  const [tab, setTab] = useState<Format>("video");
  const templates = useMemo(() => sampleAds.filter((ad) => ad.format === tab), [tab]);

  const actions = [
    {
      id: "flyer",
      title: "Post",
      detail: t("Ifoto yo kuri social media", "Social media post"),
      Icon: FileImage,
      color: "bg-post text-post-foreground",
    },
    {
      id: "video",
      title: "Video",
      detail: t("Video ngufi yamamaza", "Short promo video"),
      Icon: Clapperboard,
      color: "bg-vid text-white",
    },
    {
      id: "banner",
      title: t("Icyapa", "Banner"),
      detail: t("Icyapa cy'iduka", "Shop banner"),
      Icon: PanelTop,
      color: "bg-ban text-ban-foreground",
    },
    {
      id: "pro",
      title: t("Umuhanga", "Professional"),
      detail: t("Vugana n'umuhanga", "Talk to a professional"),
      Icon: UserRound,
      color: "bg-success text-success-foreground",
    },
  ] as const;

  const chooserCard =
    "flex aspect-[4/5] flex-col justify-between rounded-lg p-5 text-left transition-transform hover:-translate-y-1";
  const tabs = [
    { id: "video" as const, label: t("Video", "Videos") },
    { id: "flyer" as const, label: t("Amaposti", "Posts") },
    { id: "banner" as const, label: t("Ibyapa", "Banners") },
  ];

  return (
    <main className="dashboard-main mx-auto w-full max-w-[1440px] px-4 pb-16 pt-7 sm:px-7 lg:px-10 lg:pt-10">
      {/* Lovable studio-hero arrangement — app home only; marketing site untouched */}
      <StudioHero />

      <section className="mx-auto mt-8 w-full max-w-[1240px] sm:mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">
              {t("Tangira hano", "Make something")}
            </p>
            <h2 className="mt-2 text-2xl tracking-[-.035em] sm:text-3xl">
              {t("Hitamo icyo ushaka gukora", "What would you like to create?")}
            </h2>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:block">
            {t("Hitamo uburyo bwo gutangira", "Choose a format to get started")}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {actions.map(({ id, title, detail, Icon, color }) => {
            const cardContent = (
              <>
                <Icon className="size-8" />
                <span>
                  <span className="block font-display text-xl font-extrabold">{title}</span>
                  <span className="text-xs opacity-80">{detail}</span>
                </span>
              </>
            );
            return id === "pro" ? (
              <Link key={id} to="/app/pro" className={cn(chooserCard, color)}>
                {cardContent}
              </Link>
            ) : (
              <Link
                key={id}
                to="/app/create/$type"
                params={{ type: id }}
                className={cn(chooserCard, color)}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">
              {t("Isomero ryawe", "Your workspace")}
            </p>
            <h2 className="mt-2 text-2xl tracking-[-.035em] sm:text-3xl">
              {t("Amatangazo uheruka", "Recent ads")}
            </h2>
          </div>
          <Link
            to="/app/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            {t("Reba yose", "View all")} <ArrowRight className="size-4" />
          </Link>
        </div>
        {all.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {all.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.type} · {item.date}
                      {item.demo ? ` · ${t("Urugero", "Sample")}` : ""}
                    </p>
                  </div>
                  <span className="grid size-9 place-items-center rounded-full border text-muted-foreground">
                    <Clock3 className="size-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-12 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-muted">
              <ArrowRight className="size-5 text-muted-foreground" />
            </span>
            <h3 className="mt-4 font-semibold">
              {t("Nta matangazo urakora kugeza ubu", "Your creative library is waiting")}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {t(
                "Amatangazo uzakora azajya agaragara hano.",
                "The ads you create will appear here.",
              )}
            </p>
            <Link
              to="/app/projects"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              {t("Reba amatangazo", "Open My Ads")} <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </section>

      <section className="mt-14 sm:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">
              {t("Hitamo aho uhera", "A little inspiration")}
            </p>
            <h2 className="mt-2 text-2xl tracking-[-.035em] sm:text-3xl">
              {t("Popular templates", "Popular templates")}
            </h2>
          </div>
          <Link
            to="/app/templates"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            {t("Reba zose", "Explore templates")} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div
          className="mt-5 flex items-center gap-2 border-b"
          role="tablist"
          aria-label={t("Ubwoko bwa template", "Template categories")}
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "relative -mb-px min-h-11 border-b-2 px-4 text-sm font-semibold transition-colors",
                tab === item.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.slice(0, 3).map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>
    </main>
  );
}
