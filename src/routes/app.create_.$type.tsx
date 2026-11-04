import { createFileRoute, Link } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/app/create_/$type")({
  head: () => ({
    meta: [
      { title: "Tegura itangazo — Amamaza" },
      { name: "description", content: "Intambwe zo gutegura itangazo ryawe." },
      { property: "og:title", content: "Tegura itangazo — Amamaza" },
      { property: "og:description", content: "Intambwe zo gutegura itangazo ryawe." },
    ],
  }),
  component: Intro,
});

function Intro() {
  const { t } = usePrefs();
  const { type } = Route.useParams();
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold">{t("Tugiye gutegura", "Let's prepare your")} {type}</h1>
      <p className="mt-3 text-muted-foreground">{t("Bizatwara iminota 2 kugira ngo twumve neza icyo ushaka.", "This takes about 2 minutes so we understand exactly what you want.")}</p>
      <Link to="/app/create" className="mt-8 inline-block rounded-lg border px-5 py-3 font-semibold">{t("Subira", "Back")}</Link>
    </main>
  );
}
