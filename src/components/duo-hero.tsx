import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Slide =
  | { id: string; kind: "video"; src: string; label: string; rw: string; en: string }
  | { id: string; kind: "posts"; left: string; right: string; label: string; rw: string; en: string }
  | { id: string; kind: "image"; src: string; label: string; rw: string; en: string };

const slides: Slide[] = [
  { id: "video", kind: "video", src: "/ads/amamaza-showreel-placeholder.mp4", label: "Video", rw: "Kora video yamamaza business yawe byoroshye.", en: "Bring your business to life with video ads." },
  { id: "posts", kind: "posts", left: "/ads/amamaza-product-post-01.jpg", right: "/ads/amamaza-product-post-02.jpg", label: "Social posts", rw: "Kora amafoto yo Postinga business yawe byoroshye.", en: "Create professional product posts with ease." },
  { id: "banner", kind: "image", src: "/ads/amamaza-print-banner.jpg", label: "Print banner", rw: "Ikorere icyapa cyamamaza business yawe byoroshye.", en: "Make a banner that gets your business noticed." },
];

// intro: blurred, folded, logo -> unfold: opens from centre -> slide: moves right -> play
type Phase = "intro" | "unfold" | "slide" | "play";

export function DuoHero() {
  const { lang } = usePrefs();
  const t = (rw: string, en: string) => (lang === "rw" ? rw : en);
  const [phase, setPhase] = useState<Phase>("intro");
  const [run, setRun] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = slides[active]!;

  useEffect(() => {
    setPhase("intro");
    setActive(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps: [Phase, number][] = reduce
      ? [["play", 50]]
      : [["unfold", 1300], ["slide", 2500], ["play", 3500]];
    const timers = steps.map(([p, ms]) => window.setTimeout(() => setPhase(p), ms));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  const playing = phase === "play";
  useEffect(() => {
    if (!playing || paused || current.kind === "video") return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), 4500);
    return () => clearTimeout(id);
  }, [playing, paused, active, current.kind]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing && !paused) v.play().catch(() => {});
    else v.pause();
  }, [playing, paused, active]);

  const open = phase !== "intro";

  return (
    <section className={cn("duo2 relative isolate overflow-hidden", `is-${phase}`)}>
      <div className="duo2__blur" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <div className="duo2__copy relative z-10 order-2 max-w-xl lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-creative" />
            {t("Byakozwe ku bucuruzi bwo mu Rwanda", "Built for Rwandan businesses")}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            {t("Amamaza yawe,", "Your ads,")} <span className="text-primary">{t("mu buryo bworoshye.", "made simple.")}</span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            {t("Kora post, video n'ibyapa by'ubucuruzi bwawe ukoresheje AI. Nta bumenyi bwihariye bwo gushushanya busabwa.", "Create social posts, video ads and storefront banners with AI. No design skills needed.")}
          </p>
          <div className="mt-6 min-h-[84px]" aria-live="polite">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{current.label} · {active + 1} / {slides.length}</p>
            <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{lang === "rw" ? current.rw : current.en}</h2>
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

        <div className="duo2__stage order-1 flex flex-col items-center lg:order-2">
          <div className={cn("duo2__device", open && "is-open")}>
            <span className="duo2__btn duo2__btn--a" aria-hidden />
            <span className="duo2__btn duo2__btn--b" aria-hidden />
            <div className="duo2__screen">
              <span className="duo2__cam" aria-hidden />
              <div className={cn("duo2__logo", playing && "is-hidden")}>
                <img src="/amamaza-mark-red.png" alt="Amamaza" />
              </div>
              {playing && (
                <div key={current.id} className="duo2__media">
                  {current.kind === "video" && (
                    <video ref={videoRef} src={current.src} muted playsInline autoPlay onEnded={() => setActive(1)} onError={() => setActive(1)} />
                  )}
                  {current.kind === "posts" && (
                    <div className="grid h-full grid-cols-2">
                      <img src={current.left} alt="" />
                      <img src={current.right} alt="" />
                    </div>
                  )}
                  {current.kind === "image" && <img src={current.src} alt="" />}
                </div>
              )}
            </div>
          </div>

          <div className={cn("duo2__controls mt-6 flex items-center gap-2", playing ? "opacity-100" : "pointer-events-none opacity-0")}>
            {slides.map((s, i) => (
              <button key={s.id} type="button" aria-label={s.label} onClick={() => setActive(i)} className={cn("h-2 rounded-full bg-muted-foreground/40 transition-all", i === active ? "w-8 bg-primary" : "w-2")} />
            ))}
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"} className="ml-3 grid size-9 place-items-center rounded-full border bg-card">
              {paused ? <Play className="size-4 fill-current" /> : <Pause className="size-4" />}
            </button>
            <button type="button" onClick={() => setRun((r) => r + 1)} aria-label={t("Subiramo", "Replay")} className="grid size-9 place-items-center rounded-full border bg-card">
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
