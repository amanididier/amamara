import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { formatLabel, sampleAds } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type ShowcaseAd = (typeof sampleAds)[number] & { videoSrc?: string };

const showcaseAds = sampleAds as ShowcaseAd[];

/**
 * Lightweight CSS-3D foldable hero. Screen content remains real DOM media,
 * so images/video stay accessible and do not need WebGL texture conversion.
 */
export function DuoHero() {
  const { t, lang } = usePrefs();
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const current = showcaseAds[active]!;

  useEffect(() => {
    const openTimer = window.setTimeout(() => setIsOpen(true), 650);
    const settleTimer = window.setTimeout(() => setIsSettled(true), 2050);
    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(settleTimer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || isPaused) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % showcaseAds.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [isOpen, isPaused]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.visibilityState === "hidden") setIsPaused(true);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  const move = (direction: number) => {
    setActive((index) => (index + direction + showcaseAds.length) % showcaseAds.length);
  };

  const headline = lang === "rw"
    ? current.title
    : current.format === "video"
      ? "Bring your business to life."
      : current.format === "banner"
        ? "Make your business impossible to miss."
        : "Give every post a professional look.";
  const description = lang === "rw" ? current.descRw : current.descEn;

  return (
    <section className="duo-hero relative isolate overflow-hidden pb-16 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70" style={{ backgroundImage: "url('/hero-social-dark.png')" }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-background/65 to-background" />

      <div className={cn("duo-hero__inner relative mx-auto grid max-w-7xl items-center gap-8 px-4 pt-12 sm:px-6 sm:pt-16", isSettled && "duo-hero__inner--settled")}>
        <div className="duo-hero__copy relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/90 px-3 py-1 text-xs font-semibold backdrop-blur">
            <span className="size-1.5 rounded-full bg-creative" />
            {t("Byakozwe ku bucuruzi bwo mu Rwanda", "Built for Rwandan businesses")}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            {t("Amamaza yawe,", "Your ads,")}{" "}
            <span className="text-primary">{t("mu buryo bworoshye.", "made simple.")}</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            {t(
              "Kora post, video n'ibyapa by'ubucuruzi bwawe ukoresheje AI. Nta bumenyi bwihariye bwo gushushanya busabwa.",
              "Create social posts, video ads and storefront banners with AI. No design skills needed.",
            )}
          </p>

          <div className="duo-hero__story mt-6 min-h-[104px]" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {formatLabel[current.format][lang]} · {current.business}
            </p>
            <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{headline}</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a href="/app/create" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground glow-primary transition-transform hover:scale-[1.03]">
              {t("Tangira gukora", "Start creating")} <ArrowRight className="size-4" />
            </a>
            <a href="#trending" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border bg-card px-7 font-semibold hover:bg-accent">
              <Play className="size-4 fill-current" /> {t("Reba ingero", "See examples")}
            </a>
          </div>
        </div>

        <div className={cn("duo-hero__visual relative flex items-center justify-center", isOpen && "duo-hero__visual--open")}>
          <div className={cn("duo-device", isOpen && "duo-device--open", isSettled && "duo-device--settled")} aria-label="Animated Amamaza foldable phone showcasing sample advertisements">
            <div className="duo-device__body">
              <div className="duo-device__panel duo-device__panel--left">
                <div className="duo-device__screen">
                  {current.videoSrc ? (
                    <video key={current.videoSrc} src={current.videoSrc} autoPlay muted loop playsInline poster={current.image} />
                  ) : (
                    <img src={current.image} alt={current.title} />
                  )}
                </div>
              </div>
              <div className="duo-device__panel duo-device__panel--right">
                <div className="duo-device__screen">
                  {current.videoSrc ? (
                    <video key={current.videoSrc + "-right"} src={current.videoSrc} autoPlay muted loop playsInline poster={current.image} />
                  ) : (
                    <img src={current.image} alt="" />
                  )}
                </div>
              </div>
              <div className="duo-device__hinge" />
              <div className="duo-device__cover">
                <div className="duo-device__camera"><i /><i /><i /></div>
                <div className="duo-device__cover-brand"><LogoMark variant="white" className="size-12" /><span>amamaza</span></div>
                <span className="duo-device__cover-caption">YOUR BUSINESS, IN MOTION</span>
              </div>
              <div className="duo-device__bezel" />
            </div>
          </div>

          <div className="duo-controls" aria-label="Advertisement showcase controls">
            <button type="button" onClick={() => move(-1)} aria-label={t("Ibanze", "Previous ad")}><ArrowLeft className="size-4" /></button>
            <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? t("Komeza", "Play showcase") : t("Hagarika", "Pause showcase")}>
              {isPaused ? <Play className="size-4 fill-current" /> : <Pause className="size-4" />}
            </button>
            <button type="button" onClick={() => move(1)} aria-label={t("Ikurikira", "Next ad")}><ArrowRight className="size-4" /></button>
            <button type="button" onClick={() => { setIsOpen(false); setIsSettled(false); window.setTimeout(() => setIsOpen(true), 350); window.setTimeout(() => setIsSettled(true), 1750); }} aria-label={t("Subiramo gufunguka", "Replay fold animation")}><RotateCcw className="size-4" /></button>
          </div>
          <div className="duo-dots">
            {showcaseAds.map((ad, index) => (
              <button key={ad.id} type="button" onClick={() => setActive(index)} aria-label={ad.title} aria-current={index === active ? "true" : undefined} className={cn(index === active && "is-active")} />
            ))}
          </div>
          <span className="duo-counter">{String(active + 1).padStart(2, "0")} / {String(showcaseAds.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
