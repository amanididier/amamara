import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Check, Play, X, Sparkles, MessageSquareText, Download,
  Store, Wallet, UserRound, Receipt, Film, Image as ImageIcon, PanelTop,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AdCard } from "@/components/ad-card";
import { DuoHero } from "@/components/duo-hero";
import { categories, images, sampleAds, type Category, type Format } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amamaza | AI Advertising & Design for Rwanda" },
      { name: "description", content: "Create business adverts in Rwanda with AI. Make social media posts, promotional flyers, short video ads and shop banners in Kinyarwanda or English." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Amamaza | AI Advertising for Rwandan Businesses" },
      { property: "og:description", content: "Kora amatangazo y'ubucuruzi ukoresheje AI: posts, flyers, video zamamaza n'ibyapa by'amaduka. Create ads in Kinyarwanda or English." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://amamaza.vercel.app/" }],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <DuoHero />
      <ProblemSolution />
      <Trending />
      <WhatWeDo />
      <PricingPreview />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

/* ───────────────────────── PROBLEM & SOLUTION ───────────────────────── */
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
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <h2 className="text-center text-3xl font-bold sm:text-5xl">
        {t("Ikibazo n'igisubizo", "The problem, solved")}
      </h2>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("Mbere", "Before")}</p>
          <ul className="mt-6 space-y-4">
            {problems.map((p) => (
              <li key={p} className="flex items-center gap-3 text-lg">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted">
                  <X className="size-4 text-muted-foreground" />
                </span>
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
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-foreground/20">
                  <Check className="size-4" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── TRENDING GALLERY ───────────────────────── */
function Trending() {
  const { t, lang } = usePrefs();
  const tabs: { id: Format | "all"; rw: string; en: string }[] = [
    { id: "all", rw: "Byose", en: "All" },
    { id: "video", rw: "Video", en: "Videos" },
    { id: "flyer", rw: "Amaposti", en: "Posts" },
    { id: "banner", rw: "Ibyapa", en: "Banners" },
  ];
  const [tab, setTab] = useState<Format | "all">("all");
  const list = sampleAds.filter((a) => tab === "all" || a.format === tab);

  return (
    <section id="trending" className="border-y bg-[#090909] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
              {t("Byamamaye", "Trending")}
            </span>
            <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
              {t("Reba ibyo abandi bakora.", "See what others are creating.")}
            </h2>
          </div>
          <Link to="/examples" className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-primary">
            {t("Reba zose", "View all")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={cn(
                "shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                tab === tb.id ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white",
              )}
            >
              {lang === "rw" ? tb.rw : tb.en}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((ad) => (
            <AdCard key={ad.id} ad={ad} tall className="[&_h3]:text-white [&_p]:text-white/50" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── WHAT WE DO ───────────────────────── */
function WhatWeDo() {
  const { t } = usePrefs();

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-28">
        <h2 className="text-center text-3xl font-bold sm:text-5xl">{t("Ibyo dukora", "What we do")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          {t(
            "Hitamo ubwoko bw'itangazo ushaka — video, post cyangwa icyapa.",
            "Choose the kind of ad you need — video, post or banner.",
          )}
        </p>
      </div>

      {/* 1. Video ads */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-400">
              <Film className="size-3.5" /> {t("Video zamamaza", "Video ads")}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t("Video ngufi z'ubucuruzi bwawe.", "Short videos for your business.")}
            </h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t(
                "Kora video za 10–30s ziteguye kuri TikTok, Instagram Reels, WhatsApp Status na Facebook. Nta bumenyi bwo gukora video busabwa.",
                "Create 10–30s videos ready for TikTok, Instagram Reels, WhatsApp Status and Facebook. No video-editing skills needed.",
              )}
            </p>
            <Link
              to="/app/create"
              search={{ type: "video" }}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
            >
              {t("Kora video", "Create a video")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="order-1 grid grid-cols-2 gap-3 lg:order-2">
            <img src={images.hotel} alt="Hotel video ad" className="aspect-[4/5] rounded-2xl object-cover" />
            <img src={images.juice} alt="Product video ad" className="mt-8 aspect-[4/5] rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* 2. Posts / Flyers */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <img src={images.fashion} alt="Fashion flyer" className="aspect-[4/5] rounded-2xl object-cover" />
            <img src={images.salon} alt="Salon flyer" className="mt-8 aspect-[4/5] rounded-2xl object-cover" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-400">
              <ImageIcon className="size-3.5" /> {t("Amaposti n'ama flyer", "Posts & flyers")}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t("Post nziza zo gusangiza.", "Beautiful posts ready to share.")}
            </h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t(
                "Flyer na post za promosiyo, ibicuruzwa n'ubucuruzi bwawe — biteguye kuri Instagram, Facebook na WhatsApp.",
                "Promo flyers and posts for your products and business — ready for Instagram, Facebook and WhatsApp.",
              )}
            </p>
            <Link
              to="/app/create"
              search={{ type: "flyer" }}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
            >
              {t("Kora post", "Create a post")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Banners */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-creative px-3 py-1 text-xs font-bold text-creative-foreground">
              <Store className="size-3.5" /> {t("Ibyapa by'amaduka", "Shop banners")}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t("Banner iri hejuru y'iduka ryawe.", "The banner above your shop.")}
            </h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t(
                "Kora banner nziza yo kumanika ku iduka, isomeka kure, ifite izina, nimero ya telefoni n'ibyo ucuruza. Tuyitegura mu bipimo byo gucapisha.",
                "Create a clear storefront banner with your name, phone number and products — sized ready for printing.",
              )}
            </p>
            <Link
              to="/app/create"
              search={{ type: "banner" }}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
            >
              {t("Kora banner", "Create a banner")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            <img src={images.shopBanner} alt="Shop banner" className="rounded-3xl object-cover" />
            <img src={images.techBanner} alt="Tech banner" className="rounded-3xl object-cover" />
          </div>
        </div>
      </section>

      {/* 4. Talk to pros — full collage */}
      <section className="bg-[#0a0a0a] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  <UserRound className="size-3.5" /> {t("Serivisi z'abahanga", "Pro services services")}
                </span>
                <h3 className="mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
                  {t("Tuzamurira ubucuruzi bwawe.", "We will launch your brand.")}
                </h3>
                <p className="mt-4 max-w-md text-white/60">
                  {t(
                    "Ushaka itangazo ryihariye ryakozwe n'umuhanga? Tanga brief, tuhire abahanga bakora video, flyer cyangwa banner yihariye ku giciro giteganyijwe.",
                    "Need a custom ad crafted by a real creative? Share a brief and our pros will produce a tailored video, flyer or banner at a clear price.",
                  )}
                </p>
                <Link
                  to="/app/pro"
                  className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground"
                >
                  {t("Vugana n'abahanga", "Talk to a pro")} <ArrowRight className="size-4" />
                </Link>
              </div>

              {/* full pro-collage image, object-contain so nothing is cropped */}
              <div className="relative flex min-h-[320px] items-center justify-center bg-[#111] p-4 sm:min-h-[400px] sm:p-6">
                <img
                  src="/pro-collage.png"
                  alt="Creative professionals"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── PRICING PREVIEW ───────────────────────── */
function PricingPreview() {
  const { t } = usePrefs();
  const opts = [
    { Icon: Receipt, title: t("Wishyura icyo ukoze", "Pay per creation"), body: t("Ubona igiciro mbere yo gukora.", "See the price before you create.") },
    { Icon: Wallet, title: t("Shyira amafaranga kuri konti", "Prepaid balance"), body: t("Ukoresheje MoMo cyangwa Airtel Money.", "Top up with MoMo or Airtel Money.") },
    { Icon: UserRound, title: t("Serivisi y'abahanga", "Pro editing"), body: t("Umuhanga agukorera itangazo ryihariye.", "An expert crafts a custom ad.") },
  ];
  return (
    <section className="border-y bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-5xl">{t("Ibyo ukoze ni byo wishyura.", "Pay for what you make.")}</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          {t("Nta kwiyandikisha kwa buri kwezi. Nta mafaranga yihishe.", "No monthly subscription. No hidden fees.")}
        </p>
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

/* ───────────────────────── FINAL CTA ───────────────────────── */
function FinalCta() {
  const { t } = usePrefs();
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center text-primary-foreground sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <h2 className="relative mx-auto max-w-2xl text-4xl font-extrabold sm:text-6xl">
          {t("Ubucuruzi bwawe bukwiye kugaragara neza.", "Your business deserves to look great.")}
        </h2>
        <Link
          to="/app/create"
          className="relative mt-10 inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 font-semibold text-foreground transition-transform hover:scale-[1.03]"
        >
          {t("Tangira ubu", "Start now")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
