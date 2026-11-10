import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Film, FileImage, UserRound } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Search = { type?: string | undefined; ref?: string | undefined };

export const Route = createFileRoute("/app/create")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s["type"] === "string" ? s["type"] : undefined,
    ref: typeof s["ref"] === "string" ? s["ref"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (search.type && ["video", "flyer"].includes(search.type)) {
      throw redirect({ to: "/app/create/$type", params: { type: search.type } });
    }
  },
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Kurema itangazo — Amamara" },
      { name: "description", content: "Hitamo icyo ushaka gukora: post cyangwa video." },
      { property: "og:title", content: "Kurema itangazo — Amamara" },
      { property: "og:description", content: "Studio yoroshye yo gukora amatangazo." },
    ],
  }),
  component: Chooser,
});

function Chooser() {
  const { t } = usePrefs();
  const cards = [
    { id: "flyer", l: "Post", d: t("Ifoto yo kuri social media", "Social media post"), Icon: FileImage, c: "bg-post text-post-foreground" },
    { id: "video", l: "Video", d: t("Video ngufi yamamaza", "Short promo video"), Icon: Film, c: "bg-vid text-vid-foreground" },
    { id: "pro", l: t("Umuhanga", "Professional"), d: t("Vugana n'umuhanga", "Talk to a professional"), Icon: UserRound, c: "bg-success text-success-foreground" },
  ];
  const cls = "flex aspect-[4/5] flex-col justify-between rounded-lg p-5 text-left transition-transform hover:-translate-y-1";
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <h1 className="text-center text-3xl font-extrabold sm:text-5xl">{t("Urashaka gukora iki?", "What do you want to make?")}</h1>
      <p className="mt-3 text-center text-muted-foreground">{t("Hitamo kimwe. Tuzakuyobora intambwe ku yindi.", "Pick one. We'll guide you step by step.")}</p>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((x) => {
          const inner = (
            <>
              <x.Icon className="size-8" />
              <span>
                <span className="block font-display text-xl font-extrabold">{x.l}</span>
                <span className="text-xs opacity-80">{x.d}</span>
              </span>
            </>
          );
          return x.id === "pro" ? (
            <Link key={x.id} to="/app/pro" className={cn(cls, x.c)}>{inner}</Link>
          ) : (
            <Link key={x.id} to="/app/create/$type" params={{ type: x.id }} className={cn(cls, x.c)}>{inner}</Link>
          );
        })}
      </div>
    </main>
  );
}
