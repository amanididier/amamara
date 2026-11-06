import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pricing } from "@/config/site";
import { formatRWF } from "@/lib/pricing";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "AI Ad Design Prices in Rwanda | Amamaza" },
      { name: "description", content: "See Amamaza's sample pricing for AI video ads, promotional flyers and shop banners in Rwanda. Compare ad formats and understand pay-per-ad pricing in RWF." },
      { property: "og:title", content: "AI Advertising Prices in Rwanda | Amamaza" },
      { property: "og:description", content: "Explore sample prices for video ads, flyers and banners. Ibiciro by'amatangazo mu mafaranga y'u Rwanda." },
    ],
    links: [{"rel":"canonical","href":"https://amamaza.vercel.app/pricing"}],
  }),
  component: Pricing,
});

function Pricing() {
  const { t } = usePrefs();
  const plans = [
    { name: "Flyer", from: pricing.base.flyer, items: [t("Ifoto imwe nziza", "One polished image"), t("Ibipimo 3", "3 sizes"), t("Gukuramo PNG/PDF", "PNG/PDF download")] },
    { name: "Banner", from: pricing.base.banner, items: [t("Iyo gucapisha", "Print-ready"), t("Iy'iduka cyangwa urubuga", "Shop or web"), t("PDF y'ubwiza bwo hejuru", "High-res PDF")], hot: true },
    { name: "Video", from: pricing.base.video, items: [t("Amasegonda 10–30", "10–30 seconds"), "9:16 · 16:9 · 1:1", t("Umuziki n'inyandiko", "Music & captions")] },
  ];
  const faqs = [
    { q: t("Nkeneye kumenya gushushanya?", "Do I need design skills?"), a: t("Oya. Usobanura gusa icyo ushaka, AI ikagukorera.", "No. Just describe what you want and AI does the rest.") },
    { q: t("Nishyura nte?", "How do I pay?"), a: t("MTN MoMo na Airtel Money bizaboneka vuba.", "MTN MoMo and Airtel Money are coming soon.") },
    { q: t("Igiciro ni ntakuka?", "Is the price final?"), a: t("Ubona igiciro giteganyijwe mbere, ukemeza mbere y'uko gukora bitangira.", "You see an estimate first and confirm before production starts.") },
  ];
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-6xl">{t("Ibyo ukoze ni byo wishyura.", "Pay for what you make.")}</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("Ibiciro biri hano ni iby'icyitegererezo, bishobora guhinduka.", "Prices shown are placeholders and may change.")}</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={p.hot ? "rounded-lg bg-primary p-8 text-primary-foreground" : "rounded-lg border bg-card p-8"}>
              <h2 className="text-2xl font-bold">{p.name}</h2>
              <p className="mt-6 text-sm opacity-80">{t("Guhera kuri", "From")}</p>
              <p className="font-display text-4xl font-extrabold">{formatRWF(p.from)}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.items.map((i) => <li key={i} className="flex gap-2"><Check className="size-4 shrink-0" />{i}</li>)}
              </ul>
              <Link to="/app/create" search={{ type: p.name.toLowerCase() }} className={p.hot ? "mt-8 block rounded-full bg-background py-3 text-center font-semibold text-foreground" : "mt-8 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground"}>
                {t("Tangira", "Start")}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border bg-card p-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">{t("Serivisi y'abahanga", "Professional editing")}</h2>
            <p className="text-sm text-muted-foreground">{t("Abantu nyabo bagukorera itangazo ryihariye.", "Real editors craft a custom ad for you.")} {t("Guhera kuri", "From")} {formatRWF(pricing.proServiceFrom)}</p>
          </div>
          <Link to="/app/pro" className="mt-4 inline-block rounded-full border px-6 py-3 font-semibold md:mt-0">{t("Saba serivisi", "Request service")}</Link>
        </div>
        <h2 className="mt-20 text-3xl font-bold">{t("Ibibazo bikunze kubazwa", "FAQ")}</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <SiteFooter />
    </div>
  );
}
