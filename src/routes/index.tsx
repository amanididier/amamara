import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Play,
  X,
  Sparkles,
  MessageSquareText,
  Download,
  Store,
  Wallet,
  UserRound,
  Receipt,
  Film,
  Image as ImageIcon,
  PanelTop,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { TrendingSection } from "@/components/trending";
import { WhatWeDo } from "@/components/what-we-do";
import { DuoHero } from "@/components/duo-hero";
import { categories, images, sampleAds, type Category, type Format } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amamaza | AI Advertising & Design for Rwanda" },
      {
        name: "description",
        content:
          "Create business adverts in Rwanda with AI. Make social media posts, promotional flyers, short video ads and shop banners in Kinyarwanda or English.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Amamaza | AI Advertising for Rwandan Businesses" },
      {
        property: "og:description",
        content:
          "Kora amatangazo y'ubucuruzi ukoresheje AI: posts, flyers, video zamamaza n'ibyapa by'amaduka. Create ads in Kinyarwanda or English.",
      },
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
      <TrendingSection />
      <WhatWeDo />
      <ProSection />
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
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
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

/* ───────────────────────── PRO SECTION ───────────────────────── */
function ProSection() {
  const { t } = usePrefs();
  return (
    <section className="bg-[#0a0a0a] py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
          <div className="grid lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:py-14 lg:pl-12 lg:pr-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <UserRound className="size-3.5" /> {t("Serivisi z'abahanga", "Pro services")}
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
            <div className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-full">
              <img
                src="/pro-collage.png"
                alt="Creative professionals"
                className="absolute inset-0 size-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── PRICING PREVIEW ───────────────────────── */
function PricingPreview() {
  const { t } = usePrefs();
  const opts = [
    {
      Icon: Receipt,
      title: t("Wishyura icyo ukoze", "Pay per creation"),
      body: t("Ubona igiciro mbere yo gukora.", "See the price before you create."),
    },
    {
      Icon: Wallet,
      title: t("Shyira amafaranga kuri konti", "Prepaid balance"),
      body: t("Ukoresheje MoMo cyangwa Airtel Money.", "Top up with MoMo or Airtel Money."),
    },
    {
      Icon: UserRound,
      title: t("Serivisi y'abahanga", "Pro editing"),
      body: t("Umuhanga agukorera itangazo ryihariye.", "An expert crafts a custom ad."),
    },
  ];
  return (
    <section className="border-y bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold sm:text-5xl">
          {t("Ibyo ukoze ni byo wishyura.", "Pay for what you make.")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          {t(
            "Nta kwiyandikisha kwa buri kwezi. Nta mafaranga yihishe.",
            "No monthly subscription. No hidden fees.",
          )}
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
        <Link
          to="/pricing"
          className="mt-10 inline-flex items-center gap-1 font-semibold text-primary"
        >
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
