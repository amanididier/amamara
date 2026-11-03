import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Slide =
  | { id: string; kind: "video"; src: string; label: string }
  | { id: string; kind: "posts"; left: string; right: string; label: string }
  | { id: string; kind: "image"; src: string; label: string };

const slides: Slide[] = [
  { id: "video", kind: "video", src: "/ads/amamaza-showreel-placeholder.mp4", label: "Video" },
  { id: "posts", kind: "posts", left: "/ads/amamaza-product-post-01.jpg", right: "/ads/amamaza-product-post-02.jpg", label: "Social posts" },
  { id: "banner", kind: "image", src: "/ads/amamaza-print-banner.jpg", label: "Print banner" },
];

type Phase = "intro" | "unfold" | "slide" | "play";

export function DuoHero() {
  const { lang, t } = usePrefs();
  const [phase, setPhase] = useState<Phase>("intro");
  const [active, setActive] = useState(0);
  const [word, setWord] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const words = lang === "rw"
    ? ["video zamamaza", "amapost yo kwamamaza", "ibyapa byamamaza"]
    : ["video ads", "social media posts", "promotional shop banners"];
  const current = slides[active]!;
  const playing = phase === "play";
  const open = phase !== "intro";

  useEffect(() => {
    const id = window.setInterval(() => setWord((w) => (w + 1) % words.length), 2800);
    return () => window.clearInterval(id);
  }, [lang, words.length]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setPhase("play"); return; }
    setPhase("intro");
    const timers = [
      window.setTimeout(() => setPhase("unfold"), 1100),
      window.setTimeout(() => setPhase("slide"), 2200),
      window.setTimeout(() => setPhase("play"), 3300),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (!playing || current.kind === "video") return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), 6500);
    return () => window.clearTimeout(id);
  }, [playing, active, current.kind]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && current.kind === "video") video.play().catch(() => setActive(1));
    else video.pause();
  }, [playing, active, current.kind]);

  return (
    <section className={cn("duo2 relative isolate overflow-hidden", `is-${phase}`)}>
      <div className="duo2__blur" aria-hidden />
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-7 px-6 pb-12 pt-7 sm:gap-8 sm:px-10 sm:pb-14 sm:pt-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:px-12">
        <div className="duo2__copy relative z-10 order-2 mx-auto max-w-[540px] text-center lg:order-1 lg:mx-0 lg:text-left">
          <h1 className="text-[2rem] font-bold leading-[1.08] tracking-[-0.045em] sm:text-[2.5rem] lg:text-[3rem]">
            <span className="text-primary">{t("Kwamamaza ibikorwa byawe", "Advertise your business")}</span>
            <br />
            {t("ubu Byoroshye!", "the easy way!")}
          </h1>
          <p className="mt-4 text-[15px] font-medium leading-[1.7] text-muted-foreground sm:text-base">
            {t("Ubu ushobora kwikorera", "Now you can create your own")}
            {" "}
            <span key={word} className="inline-block font-semibold text-primary animate-word">{words[word]}</span>
            {" "}
            {t("ibicuruzwa na serivisi utanga byihuse kandi mu buryo ushaka.", "for your products and services, quickly and your way.")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
            <a href="/app/create" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto">
              {t("Tangira gukora", "Start creating")} <ArrowRight className="size-4" />
            </a>
            <a href="/app" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent sm:w-auto">
              <Download className="size-4" /> {t("Downloadinga application", "Download the app")}
            </a>
          </div>
        </div>

        <div className="duo2__stage order-1 flex w-full justify-center lg:order-2">
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
                    <video ref={videoRef} src={current.src} muted playsInline autoPlay
                      onEnded={() => setActive(1)} onError={() => setActive(1)} />
                  )}
                  {current.kind === "posts" && (
                    <div className="grid h-full grid-cols-2">
                      <img src={current.left} alt="Amamaza social media product post" />
                      <img src={current.right} alt="Amamaza promotional product post" />
                    </div>
                  )}
                  {current.kind === "image" && <img src={current.src} alt="Printed shop banner created with Amamaza" style={{ objectFit: "contain", backgroundColor: "#111" }} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
