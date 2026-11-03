import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { LogoMark } from "@/components/brand";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: "video",
    kind: "video",
    src: "/ads/amamaza-showreel-placeholder.mp4",
    title: "Video yamamaza",
    business: "Video",
    headline: "Kora video yamamaza business yawe byoroshye.",
    english: "Bring your business to life with video ads.",
    description: "Video plays across both displays until it ends.",
  },
  {
    id: "posts",
    kind: "posts",
    left: "/ads/amamaza-product-post-01.jpg",
    right: "/ads/amamaza-product-post-02.jpg",
    title: "Amafoto yo kwamamaza",
    business: "Social posts",
    headline: "Kora amafoto yo Postinga business yawe byoroshye.",
    english: "Create professional product posts with ease.",
    description: "Two product posts appear together, one on each display.",
  },
  {
    id: "banner",
    kind: "banner",
    src: "/ads/amamaza-print-banner.jpg",
    title: "Icyapa cyamamaza",
    business: "Print banner",
    headline: "Ikorere icyapa cyamamaza business yawe byoroshye.",
    english: "Make a banner that gets your business noticed.",
    description: "A full-bleed banner spans both displays.",
  },
] as const;

export function DuoHero() {
  const { t, lang } = usePrefs();
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = slides[active]!;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPaused || current.kind === "video") return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), current.kind === "banner" ? 5000 : 3500);
    return () => window.clearTimeout(timer);
  }, [active, current.kind, isPaused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || current.kind !== "video") return;
    if (isPaused) video.pause();
    else void video.play().catch(() => {});
  }, [active, current.kind, isPaused]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setIsPaused(true);
        videoRef.current?.pause();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const move = (direction: number) => setActive((i) => (i + direction + slides.length) % slides.length);
  const headline = lang === "rw" ? current.headline : current.english;

  return (
    <section className="duo-hero relative isolate overflow-hidden pb-16 sm:pb-20">
      <div className="duo-hero__inner relative mx-auto grid max-w-7xl items-center gap-8 px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="duo-hero__copy relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold">
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
          <div className="duo-hero__story mt-7 min-h-[116px]" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{current.business} · {active + 1} / {slides.length}</p>
            <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{headline}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{current.description}</p>
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

        <div className="duo-hero__visual relative flex items-center justify-center">
          <div className={cn("amamaza-foldable", isOpen && "amamaza-foldable--open")} aria-label="Original Amamaza Duo foldable phone advertisement showcase">
            <div className="amamaza-foldable__shadow" />
            <div className="amamaza-foldable__device">
              <div className="amamaza-foldable__left">
                <div className="amamaza-foldable__screen">
                  {current.kind === "posts" ? <img src={current.left} alt="First product advertisement" /> : current.kind === "video" ? <video ref={videoRef} key={current.id} src={current.src} muted playsInline preload="none" onEnded={() => setActive(1)} onError={() => setActive(1)} /> : <img src={current.src} alt={current.title} />}
                </div>
                <div className="amamaza-foldable__camera-cutout" />
              </div>
              <div className="amamaza-foldable__right">
                <div className="amamaza-foldable__screen">
                  {current.kind === "posts" ? <img src={current.right} alt="Second product advertisement" /> : current.kind === "video" ? <div className="amamaza-foldable__video-continuation" /> : <img src={current.src} alt={current.title} />}
                </div>
                <div className="amamaza-foldable__camera-cutout" />
              </div>
              <div className="amamaza-foldable__hinge"><i /><i /><i /></div>
              <div className="amamaza-foldable__outer-cover">
                <div className="amamaza-foldable__camera-island"><i /><i /><i /></div>
                <div className="amamaza-foldable__brand"><LogoMark variant="white" className="size-10" /><span>amamaza</span></div>
                <span className="amamaza-foldable__edition">DUO · RWANDA</span>
              </div>
              <div className="amamaza-foldable__rail" />
            </div>
          </div>

          <div className="duo-controls" aria-label="Advertisement showcase controls">
            <button type="button" onClick={() => move(-1)} aria-label={t("Ibanze", "Previous ad")}><ArrowLeft className="size-4" /></button>
            <button type="button" onClick={() => { setIsPaused((p) => !p); if (isPaused) void videoRef.current?.play().catch(() => {}); else videoRef.current?.pause(); }} aria-label={isPaused ? t("Komeza", "Play showcase") : t("Hagarika", "Pause showcase")}>{isPaused ? <Play className="size-4 fill-current" /> : <Pause className="size-4" />}</button>
            <button type="button" onClick={() => move(1)} aria-label={t("Ikurikira", "Next ad")}><ArrowRight className="size-4" /></button>
            <button type="button" onClick={() => { setIsOpen(false); window.setTimeout(() => setIsOpen(true), 180); }} aria-label={t("Subiramo gufunguka", "Replay fold animation")}><RotateCcw className="size-4" /></button>
          </div>
          <div className="duo-dots">{slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => setActive(index)} aria-label={slide.title} aria-current={index === active ? "true" : undefined} className={cn(index === active && "is-active")} />)}</div>
          <span className="duo-counter">{String(active + 1).padStart(2, "0")} / 03</span>
        </div>
      </div>
    </section>
  );
}
