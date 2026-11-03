import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Slide =
  | { id: string; kind: "video"; src: string; label: string; rw: string; en: string }
  | {
      id: string;
      kind: "posts";
      left: string;
      right: string;
      label: string;
      rw: string;
      en: string;
    }
  | { id: string; kind: "image"; src: string; label: string; rw: string; en: string };

const slides: Slide[] = [
  {
    id: "video",
    kind: "video",
    src: "/ads/amamaza-showreel-placeholder.mp4",
    label: "Video",
    rw: "Kora video yamamaza business yawe byoroshye.",
    en: "Bring your business to life with video ads.",
  },
  {
    id: "posts",
    kind: "posts",
    left: "/ads/amamaza-product-post-01.jpg",
    right: "/ads/amamaza-product-post-02.jpg",
    label: "Social posts",
    rw: "Kora amafoto yo Postinga business yawe byoroshye.",
    en: "Create professional product posts with ease.",
  },
  {
    id: "banner",
    kind: "image",
    src: "/ads/amamaza-print-banner.jpg",
    label: "Print banner",
    rw: "Ikorere icyapa cyamamaza business yawe byoroshye.",
    en: "Make a banner that gets your business noticed.",
  },
];

// intro: blurred, folded, logo -> unfold: opens from centre -> slide: moves right -> play
type Phase = "intro" | "unfold" | "slide" | "play";

export function DuoHero() {
  const { lang } = usePrefs();
  const t = (rw: string, en: string) => (lang === "rw" ? rw : en);
  const [phase, setPhase] = useState<Phase>("intro");
  const run = 0;
  const [active, setActive] = useState(0);
  const paused = false;
  const [word, setWord] = useState(0);
  const words =
    lang === "rw"
      ? ["video", "social media post", "ibyapa"]
      : ["video ads", "social media posts", "shop banners"];
  useEffect(() => {
    const id = window.setInterval(() => setWord((w) => (w + 1) % 3), 2600);
    return () => clearInterval(id);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = slides[active]!;

  useEffect(() => {
    setPhase("intro");
    setActive(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps: [Phase, number][] = reduce
      ? [["play", 50]]
      : [
          ["unfold", 1300],
          ["slide", 2500],
          ["play", 3500],
        ];
    const timers = steps.map(([p, ms]) => window.setTimeout(() => setPhase(p), ms));
    return () => timers.forEach(clearTimeout);
  }, [run]);

  const playing = phase === "play";
  useEffect(() => {
    if (!playing || paused || current.kind === "video") return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), 6000);
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
        <div className="duo2__copy relative z-10 order-2 max-w-xl text-center lg:order-1 lg:text-left">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {t("Kwamamaza ibikorwa byawe,", "Advertise your business,")}
            <br />
            <span className="text-primary">{t("ubu Byoroshye!", "now easy!")}</span>
          </h1>
          <p className="mt-4 text-lg font-semibold sm:text-xl">
            {t("Hitamo", "Choose")}{" "}
            <span key={word} className="inline-block text-primary animate-word">
              {words[word]}
            </span>{" "}
            {t("uyamamaza ubu.", "and promote now.")}
          </p>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {t(
              "Kora video, post n'ibyapa by'ubucuruzi bwawe ukoresheje AI — mu buryo wifuza.",
              "Create videos, posts and banners for your business with AI — exactly the way you want.",
            )}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="/app/create"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              {t("Tangira gukora", "Start creating")} <ArrowRight className="size-4" />
            </a>
            <a
              href="/app"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border bg-background px-7 font-semibold transition-colors hover:bg-accent sm:w-auto"
            >
              <Download className="size-4" /> {t("Downloadinga application", "Download now")}
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
                <div>
                  <img src="/amamaza-mark-red.png" alt="" />
                  <span>amamaza</span>
                </div>
              </div>
              {playing && (
                <div key={current.id} className="duo2__media">
                  {current.kind === "video" && (
                    <video
                      ref={videoRef}
                      src={current.src}
                      muted
                      playsInline
                      autoPlay
                      onEnded={() => setActive(1)}
                      onError={() => setActive(1)}
                    />
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
        </div>
      </div>
    </section>
  );
}
