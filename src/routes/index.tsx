import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Play, X, Sparkles, MessageSquareText, Download, Store, Wallet, UserRound, Receipt } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AdCard } from "@/components/ad-card";
import { categories, images, sampleAds, type Category } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amamaza — Amamaza yawe, mu buryo bworoshye" },
      { name: "description", content: "Kora video, flyer na banner by'ubucuruzi bwawe mu Rwanda ukoresheje AI. Nta bumenyi bwo gushushanya busabwa." },
      { property: "og:title", content: "Amamaza — Amatangazo meza, byoroshye" },
      { property: "og:description", content: "AI ikora amatangazo y'ubucuruzi bwawe: video, flyer, banner z'amaduka." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <ProblemSolution />
      <Showcase />
      <HowItWorks />
      <ShopBanners />
      <Services />
      <PricingPreview />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const { t } = usePrefs();
  const serviceCards = [
    {
      title: t("Post", "Post"),
      detail: t("Flyer na post byiteguye gusangizwa", "Scroll-stopping posts and flyers"),
      image: images.fashion,
      type: "flyer" as const,
      tag: t("Flyer", "Social post"),
      accent: "from-rose-500/80",
    },
    {
      title: t("Video Ad", "Video ad"),
      detail: t("Video ngufi zamamaza ubucuruzi", "Short-form video ads for your business"),
      image: images.juice,
      type: "video" as const,
      tag: "9:16 · 0:15",
      accent: "from-black/80",
    },
    {
      title: t("Ibyapa", "Shop banners"),
      detail: t("Ibyapa by'amaduka biteguye gucapwa", "Print-ready storefront banners"),
      image: images.shopBanner,
      type: "banner" as const,
      tag: t("Byiteguye gucapwa", "Print ready"),
      accent: "from-amber-600/80",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-grid pb-20">
      <div className="pointer-events-none absolute left-1/2 top-24 size-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-creative" />
            {t("Byakozwe ku bucuruzi bwo mu Rwanda", "Built for Rwandan businesses")}
          </span>
          <h1 className="mx-auto mt-6 text-5xl font-extrabold leading-[1.02] sm:text-7xl">
            {t("Amamaza yawe,", "Your ads,")}{" "}
            <span className="text-primary">{t("mu buryo bworoshye.", "made simple.")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t(
              "Kora post, video n'ibyapa by'ubucuruzi bwawe ukoresheje AI. Nta bumenyi bwihariye bwo gushushanya busabwa.",
              "Create social posts, video ads and storefront banners with AI. No design skills needed.",
            )}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/app/create" className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground glow-primary transition-transform hover:scale-[1.03]">
              {t("Tangira gukora", "Start creating")} <ArrowRight className="size-4" />
            </Link>
            <Link to="/examples" className="inline-flex h-12 items-center gap-2 rounded-full border bg-card px-7 font-semibold hover:bg-accent">
              <Play className="size-4 fill-current" /> {t("Reba ingero", "See examples")}
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-4 md:grid-cols-3 md:gap-3">
          {serviceCards.map((card, i) => (
            <Link
              key={card.type}
              to="/app/create"
              search={{ type: card.type }}
              className={cn(
                "group relative isolate block aspect-[4/5] overflow-hidden rounded-[1.6rem] border-4 border-card bg-card shadow-2xl transition duration-500 hover:z-10 hover:-translate-y-2 hover:shadow-primary/10",
                i === 1 ? "md:-mt-8 md:scale-[1.04]" : i === 0 ? "md:mt-5 md:-rotate-2" : "md:mt-5 md:rotate-2",
              )}
            >
              <img src={card.image} alt={card.title} loading="eager" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className={cn("absolute inset-0 bg-gradient-to-t", card.accent, "via-black/10 to-transparent")} />
              <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                {card.tag}
              </span>
              <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/40 bg-white/95 p-4 text-left text-neutral-950 shadow-lg backdrop-blur">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">{card.title}</h2>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600">{card.detail}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
function ProblemSolution() {
  const { t } = usePrefs();
  const problems = [
    t("Kwishyura designer birahenze", "Hiring a designer is expensive"),
    t("Porogaramu za video ziragoye", "Video editing apps are hard"),
    t("Bifata iminsi myinshi", "It takes days to get an ad"),
  ];
  const solutions = [
    t("Wishyura ibyo ukoze gusa", "Pay only for what you make"),
    t("Uvuga icyo ushaka mu Kinyarwanda", "Just say what you want in Kinyarwanda"),
    t("Itangazo ryawe riboneka mu minota", "Your ad is ready in minutes"),
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h2 className="text-center text-3xl font-bold sm:text-5xl">
        {t("Ikibazo n'igisubizo", "The problem, solved")}
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("Mbere", "Before")}</p>
          <ul className="mt-6 space-y-4">
            {problems.map((p) => (
              <li key={p} className="flex items-center gap-3 text-lg">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted"><X className="size-4 text-muted-foreground" /></span>
                <span className="text-muted-foreground line-through decoration-1">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-primary p-8 text-primary-foreground">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80">{t("Na Amamaza", "With Amamaza")}</p>
          <ul className="mt-6 space-y-4">
            {solutions.map((p) => (
              <li key={p} className="flex items-center gap-3 text-lg font-semibold">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/20"><Check className="size-4" /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const { t, lang } = usePrefs();
  const [cat, setCat] = useState<Category | "all">("all");
  const list = sampleAds.filter((a) => cat === "all" || a.category === cat);
  return (
    <section id="showcase" className="border-y bg-[#090909] py-20 text-white sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">{t("Ibikorwa byacu", "Made with Amamaza")}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{t("Reba ibyo ushobora gukora.", "See what you can create.")}</h2>
            <p className="mt-3 max-w-xl text-sm text-white/55 sm:text-base">{t("Ingero z'amatangazo y'ubucuruzi — hitamo imwe uyihindure iyawe.", "A library of business creatives. Choose one and make it yours.")}</p>
          </div>
          <Link to="/examples" className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:text-primary">
            {t("Reba zose", "Explore gallery")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-black text-white">A</span>
              <span className="text-sm font-bold tracking-tight">amamaza</span>
              <span className="ml-2 hidden text-xs text-white/35 sm:inline">{t("Ingero", "Creative library")}</span>
            </div>
            <div className="hidden items-center gap-5 text-[11px] font-medium text-white/45 lg:flex">
              <span className="text-white">{t("Kuri wowe", "For you")}</span>
              <span>{t("Ibyamamare", "Popular")}</span>
              <span>{t("Video", "Videos")}</span>
              <span>{t("Flyer", "Posts")}</span>
              <span>{t("Ibyapa", "Banners")}</span>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/45">{list.length} {t("ingero", "samples")}</span>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 sm:px-6">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  cat === c.id ? "bg-white text-black" : "bg-white/[0.06] text-white/55 hover:bg-white/10 hover:text-white",
                )}
              >
                {c[lang]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-4">
            {list.map((ad) => <AdCard key={ad.id} ad={ad} tall className="[&_h3]:text-white [&_p]:text-white/45" />)}
          </div>
        </div>
      </div>
    </section>
  );
}
function HowItWorks() {
  const { t } = usePrefs();
  const steps = [
    { Icon: Sparkles, title: t("Hitamo icyo ushaka gukora", "Choose what to make"), body: t("Video, flyer cyangwa banner.", "Video, flyer or banner.") },
    { Icon: MessageSquareText, title: t("Sobanura ubucuruzi bwawe", "Describe your business"), body: t("Andika nk'uko uvuga — mu Kinyarwanda.", "Write like you talk — in Kinyarwanda.") },
    { Icon: Download, title: t("Kora kandi ukuremo", "Create & download"), body: t("Reba igiciro, emeza, ukuremo itangazo.", "See the price, confirm, download.") },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <h2 className="text-center text-3xl font-bold sm:text-5xl">{t("Intambwe 3 gusa", "Just 3 steps")}</h2>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={i} className="relative rounded-3xl border bg-card p-8">
            <span className="font-display text-7xl font-extrabold text-primary/15">{i + 1}</span>
            <s.Icon className="absolute right-8 top-8 size-6 text-primary" />
            <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ShopBanners() {
  const { t } = usePrefs();
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-creative px-3 py-1 text-xs font-bold text-creative-foreground">
            <Store className="size-3.5" /> {t("Banner z'amaduka", "Shop banners")}
          </span>
          <h2 className="mt-5 text-3xl font-bold sm:text-5xl">{t("Banner iri hejuru y'iduka ryawe.", "The banner above your shop.")}</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            {t(
              "Kora banner nziza yo kumanika ku iduka, isomeka kure, ifite izina, nimero ya telefoni n'ibyo ucuruza. Tuyitegura mu bipimo byo gucapisha.",
              "Create a clear storefront banner with your name, phone number and products — sized ready for printing.",
            )}
          </p>
          <Link to="/app/create" search={{ type: "banner" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground">
            {t("Kora banner", "Create a banner")} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4">
          <img src={images.shopBanner} alt="Mama Keza supermarket storefront banner" loading="lazy" width={1536} height={1024} className="rounded-3xl object-cover" />
          <img src={images.techBanner} alt="Tech Zone phone shop banner" loading="lazy" width={1536} height={768} className="rounded-3xl object-cover" />
        </div>
      </div>
    </section>
  );
}

function Services() {
  const { t } = usePrefs();
  const items = [
    { img: images.hotel, title: t("Video zamamaza", "Video ads"), body: t("Video ngufi za TikTok, Instagram na WhatsApp.", "Short videos for TikTok, Instagram & WhatsApp."), type: "video" },
    { img: images.fashion, title: "Flyers", body: t("Flyer nziza za promosiyo.", "Eye-catching promo flyers."), type: "flyer" },
    { img: images.realestate, title: "Banners", body: t("Banner z'amaduka n'iz'urubuga.", "Shop and web banners."), type: "banner" },
    { img: images.salon, title: t("Abahanga bagukorera", "Pro editors"), body: t("Abantu nyabo bagukorera itangazo.", "Real editors craft your ad."), type: "pro" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <h2 className="text-3xl font-bold sm:text-5xl">{t("Ibyo dukora", "What we make")}</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <Link
            key={s.title}
            to={s.type === "pro" ? "/app/pro" : "/app/create"}
            search={s.type === "pro" ? {} : { type: s.type }}
            className="group overflow-hidden rounded-3xl border bg-card"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={s.img} alt={s.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {t("Tangira", "Start")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PricingPreview() {
  const { t } = usePrefs();
  const opts = [
    { Icon: Receipt, title: t("Wishyura kuri buri tangazo", "Pay per ad"), body: t("Ubona igiciro mbere yo gukora.", "See the price before you create.") },
    { Icon: Wallet, title: t("Shyira amafaranga kuri konti", "Prepaid balance"), body: t("Ukoresheje MoMo cyangwa Airtel Money.", "Top up with MoMo or Airtel Money.") },
    { Icon: UserRound, title: t("Serivisi y'abahanga", "Pro editing"), body: t("Umuhanga agukorera itangazo ryihariye.", "An expert crafts a custom ad.") },
  ];
  return (
    <section className="border-y bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-5xl">{t("Ibyo ukoze ni byo wishyura.", "Pay for what you make.")}</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("Nta kwiyandikisha kwa buri kwezi. Nta mafaranga yihishe.", "No monthly subscription. No hidden fees.")}</p>
        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          {opts.map((o) => (
            <div key={o.title} className="rounded-3xl border bg-card p-7">
              <o.Icon className="size-6 text-primary" />
              <h3 className="mt-5 text-lg font-bold">{o.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{o.body}</p>
            </div>
          ))}
        </div>
        <Link to="/pricing" className="mt-10 inline-flex items-center gap-1 font-semibold text-primary">
          {t("Reba ibiciro", "See pricing")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = usePrefs();
  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary px-6 py-20 text-center text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <h2 className="relative mx-auto max-w-2xl text-4xl font-extrabold sm:text-6xl">
          {t("Ubucuruzi bwawe bukwiye kugaragara neza.", "Your business deserves to look great.")}
        </h2>
        <Link to="/app/create" className="relative mt-10 inline-flex h-13 items-center gap-2 rounded-full bg-background px-8 py-4 font-semibold text-foreground transition-transform hover:scale-[1.03]">
          {t("Tangira ubu", "Start now")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
