import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const showcaseAds = [
  {
    id: "showreel",
    kind: "video",
    src: "/ads/amamaza-showreel-placeholder.mp4",
    title: "Amamaza showreel",
    business: "Video showcase",
    headline: "Bring your business to life.",
    description: "A short video introduction to the possibilities of Amamaza.",
  },
  {
    id: "product-post-01",
    kind: "post",
    src: "/ads/amamaza-product-post-01.jpg",
    title: "Product post 01",
    business: "Social post",
    headline: "Give every post a professional look.",
    description: "Product advertisements presented in a clean, share-ready social format.",
  },
  {
    id: "product-post-02",
    kind: "post",
    src: "/ads/amamaza-product-post-02.jpg",
    title: "Product post 02",
    business: "Social post",
    headline: "Make every product stand out.",
    description: "A second product showcase, framed with a soft, quiet visual background.",
  },
  {
    id: "print-banner",
    kind: "banner",
    src: "/ads/amamaza-print-banner.jpg",
    title: "Printable banner",
    business: "Print banner",
    headline: "Make your business impossible to miss.",
    description: "A full-bleed banner presentation, edge to edge.",
  },
] as const;

/**
 * Lightweight CSS foldable hero. The display uses one real media element,
 * so the video is decoded only once and remains a normal accessible HTML video.
 */
export function DuoHero() {
  const { t, lang } = usePrefs();
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = showcaseAds[active]!;

  useEffect(() => {
    const openTimer = window.setTimeout(() => setIsOpen(true), 650);
    const settleTimer = window.setTimeout(() => setIsSettled(true), 2050);
    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(settleTimer);
    };
  }, []);

  // Still-image timing is sequential: 3s, 3s, then 5s before returning to video.
  useEffect(() => {
    if (isPaused || current.kind === "video") return;
    const duration = current.kind === "banner" ? 5000 : 3000;
    const timer = window.setTimeout(() => {
      setActive((index) => (index + 1) % showcaseAds.length);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [active, current.kind, isPaused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || current.kind !== "video") return;
    if (isPaused) {
      video.pause();
    } else {
      void video.play().catch(() => {
        // Browsers may block autoplay until the visitor interacts with the page.
      });
    }
  }, [active, current.kind, isPaused]);

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

  const togglePlayback = () => {
    setIsPaused((paused) => !paused);
  };

  const headline = lang === "rw"
    ? current.title
    : current.headline;
  const description = lang === "rw"
    ? "Reba uko Amamaza ifasha ubucuruzi kugaragara neza."
    : current.description;

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
              {current.business} · {active + 1} / {showcaseAds.length}
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
          <div className={cn("duo-device", isOpen && "duo-device--open", isSettled && "duo-device--settled")} aria-label="Animated Amamaza foldable phone showcasing advertisements">
            <div className="duo-device__body">
              <div
                className="duo-device__media absolute z-[1] overflow-hidden rounded-[21px]"
                style={{ inset: 5, background: current.kind === "post"
                  ? "radial-gradient(circle at 15% 20%, rgba(255,255,255,.9), transparent 28%), radial-gradient(circle at 85% 78%, rgba(255,255,255,.7), transparent 25%), linear-gradient(135deg, #e9e2d7, #dce7e8 55%, #e8e1ee)"
                  : "#090a0d" }}
              >
                {current.kind === "video" ? (
                  <video
                    ref={videoRef}
                    key={current.id}
                    src={current.src}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    onEnded={() => setActive(1)}
                    onError={() => setActive(1)}
                    className="h-full w-full object-cover"
                  />
                ) : current.kind === "post" ? (
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-5 sm:p-8">
                    <span className="pointer-events-none absolute left-[8%] top-[12%] size-9 rounded-full border border-white/70 bg-white/25" />
                    <span className="pointer-events-none absolute right-[9%] top-[22%] rotate-12 rounded-full bg-white/35 px-3 py-1 text-[9px] font-bold tracking-widest text-black/35">NEW</span>
                    <span className="pointer-events-none absolute bottom-[13%] left-[13%] h-5 w-5 rotate-45 rounded-md bg-white/35" />
                    <span className="pointer-events-none absolute bottom-[17%] right-[12%] size-7 rounded-full border-2 border-white/50" />
                    <img
                      key={current.id}
                      src={current.src}
                      alt={current.title}
                      className="relative z-[1] max-h-full max-w-[78%] rounded-xl object-contain shadow-[0_18px_45px_rgba(0,0,0,.16)]"
                    />
                  </div>
                ) : (
                  <img
                    key={current.id}
                    src={current.src}
                    alt={current.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="duo-device__panel duo-device__panel--left" style={{ background: "transparent", overflow: "visible" }} />
              <div className="duo-device__panel duo-device__panel--right" style={{ background: "transparent" }} />
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
            <button type="button" onClick={togglePlayback} aria-label={isPaused ? t("Komeza", "Play showcase") : t("Hagarika", "Pause showcase")}>
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
