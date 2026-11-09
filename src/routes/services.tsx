import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { images } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "AI Ad Design Services in Rwanda | Amamara" },
      { name: "description", content: "Explore Amamara services for Rwandan businesses: AI video ads, promotional flyers, social media posts, print-ready shop banners and professional ad design." },
      { property: "og:title", content: "AI Advertising & Design Services | Amamara" },
      { property: "og:description", content: "Video ads, flyers, social posts and shop banners for businesses in Rwanda. Kora amatangazo meza y'ubucuruzi bwawe." },
    ],
    links: [{"rel":"canonical","href":"https://amamaza.vercel.app/services"}],
  }),
  component: Services,
});

function Services() {
  const { t } = usePrefs();
  const rows = [
    { img: images.hotel, title: t("Video zamamaza", "Video ads"), body: t("Video ngufi z'imbuga nkoranyambaga — TikTok, Instagram, WhatsApp Status. Uhitamo igihe n'ibipimo.", "Short social videos for TikTok, Instagram and WhatsApp Status. Choose length and format."), type: "video" },
    { img: images.fashion, title: "Flyers", body: t("Flyer za promosiyo, ibirori n'ibicuruzwa bishya — byiteguye gusangizwa cyangwa gucapishwa.", "Flyers for promos, events and new products — ready to share or print."), type: "flyer" },
    { img: images.shopBanner, title: t("Banner z'amaduka", "Shop banners"), body: t("Banner nini zo kumanika ku iduka, zifite izina, telefoni n'ibyo ucuruza, mu bipimo byo gucapisha.", "Large storefront banners with name, phone and products, in print-ready sizes."), type: "banner" },
    { img: images.salon, title: t("Abahanga bagukorera", "Professional editors"), body: t("Ukeneye ikintu cyihariye? Abahanga nyabo bagukorera itangazo.", "Need something special? Real editors make it for you."), type: "pro" },
  ];
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-extrabold sm:text-6xl">{t("Ibyo dukora", "What we do")}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          {t("Amatangazo meza akwiye kuba ay'abantu bose — si ay'ibigo binini gusa.", "Great advertising should be for everyone — not just big companies.")}
        </p>
        <div className="mt-14 space-y-6">
          {rows.map((r, i) => (
            <div key={r.title} className="grid items-center gap-6 overflow-hidden rounded-lg border bg-card md:grid-cols-2">
              <img src={r.img} alt={r.title} loading="lazy" className={`aspect-[4/3] size-full object-cover ${i % 2 ? "md:order-2" : ""}`} />
              <div className="p-8">
                <h2 className="text-3xl font-bold">{r.title}</h2>
                <p className="mt-3 text-muted-foreground">{r.body}</p>
                <Link to={r.type === "pro" ? "/app/pro" : "/app/create"} search={r.type === "pro" ? {} : { type: r.type }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
                  {t("Tangira", "Start")} <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
