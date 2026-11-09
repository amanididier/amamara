import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Film, FileImage, PanelTop } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Search = { type?: string | undefined; ref?: string | undefined };

export const Route = createFileRoute("/app/create")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s["type"] === "string" ? s["type"] : undefined,
    ref: typeof s["ref"] === "string" ? s["ref"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (search.type && ["video", "flyer", "banner"].includes(search.type)) {
      throw redirect({ to: "/app/create/$type", params: { type: search.type } });
    }
  },
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Kurema itangazo — Amamara" },
      { name: "description", content: "Hitamo icyo ushaka gukora: post, video cyangwa icyapa." },
      { property: "og:title", content: "Kurema itangazo — Amamara" },
      { property: "og:description", content: "Studio yoroshye yo gukora amatangazo." },
    ],
  }),
  component: Chooser,
});

function Chooser() {
  const { t } = usePrefs();
  const cards = [
    {
      id: "flyer",
      l: "Post",
      d: t("Ifoto yo kuri social media", "Social media post"),
      Icon: FileImage,
      c: "bg-post text-post-foreground",
      position: "creation-card--left",
    },
    {
      id: "video",
      l: "Video",
      d: t("Video ngufi yamamaza", "Short promo video"),
      Icon: Film,
      c: "bg-vid text-vid-foreground",
      position: "creation-card--center",
    },
    {
      id: "banner",
      l: "Icyapa",
      d: t("Icyapa cy'iduka", "Shop banner"),
      Icon: PanelTop,
      c: "bg-ban text-ban-foreground",
      position: "creation-card--right",
    },
  ];
  const cls =
    "creation-card group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-xl p-5 text-left shadow-sm transition duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:shadow-xl sm:min-h-[250px] sm:p-6";
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-12 text-center sm:mb-16">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary sm:mb-6">
          {t("Reka tubishyire mu bikorwa", "Let’s make it happen")}
        </p>
        <h1 className="text-center text-3xl font-extrabold sm:text-5xl">
          {t("Urashaka gukora iki?", "What would you like to create?")}
        </h1>
        <p className="mt-3 text-center text-muted-foreground">
          {t("Hitamo kimwe. Tuzakuyobora intambwe ku yindi.", "Pick one. We'll guide you step by step.")}
        </p>
      </div>
      <div className="creation-card-arc mx-auto grid max-w-4xl items-center gap-5 sm:grid-cols-[1fr_1.2fr_1fr] sm:gap-3">
        {cards.map((x) => {
          const inner = (
            <>
              <x.Icon className="size-8 transition-transform duration-300 group-hover:scale-110 sm:size-9" />
              <span>
                <span className="block font-display text-xl font-extrabold sm:text-2xl">{x.l}</span>
                <span className="mt-1 block text-xs opacity-80 sm:text-sm">{x.d}</span>
              </span>
            </>
          );
          return (
            <Link
              key={x.id}
              to="/app/create/$type"
              params={{ type: x.id }}
              className={cn(cls, x.c, x.position)}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
