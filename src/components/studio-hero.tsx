import { useEffect, useRef, useState } from "react";
import { Clapperboard, Pause, Play } from "lucide-react";
import { images } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";

/**
 * Workspace home hero only.
 * Do not use on the marketing landing page (keep DuoHero / phone there).
 */
export function StudioHero() {
  const { t } = usePrefs();
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    video.current?.play().catch(() => setPlaying(false));
  }, []);

  function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (player.paused) {
      player.play().catch(() => setPlaying(false));
    } else {
      player.pause();
    }
  }

  return (
    <section
      className="studio-hero"
      aria-label={t("Ibikorwa bya Amamara", "Amamara creative work")}
    >
      <style>{`
        .studio-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: oklch(0 0 0);
          color: oklch(0.98 0 0);
        }
        .studio-hero__background {
          position: absolute;
          inset: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .studio-hero::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 88px;
          z-index: -1;
          background: linear-gradient(transparent, var(--background));
          pointer-events: none;
        }
        .studio-hero__inner {
          max-width: 1100px;
          margin-inline: auto;
          padding: 48px 24px 40px;
          text-align: center;
        }
        .studio-hero__badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid oklch(1 0 0 / 48%);
          border-radius: 8px;
          padding: 6px 12px;
          font-family: "Barlow Condensed", "Arial Narrow", var(--font-display, system-ui);
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .studio-hero__badge span {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: oklch(0.88 0.2 125);
        }
        .studio-hero__title {
          margin: 16px 0 0;
          font-family: "Barlow Condensed", "Arial Narrow", var(--font-display, system-ui);
          font-size: 44px;
          font-weight: 800;
          line-height: 1.08;
          text-transform: uppercase;
          letter-spacing: 0;
        }
        .studio-hero__subtitle {
          margin: 12px auto 0;
          max-width: 520px;
          font-size: 15px;
          line-height: 1.6;
          color: oklch(0.74 0 0);
        }
        /* Medium cards — tighter than Lovable ZIP defaults */
        .studio-hero__arc {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr) minmax(0, 1fr);
          align-items: start;
          gap: 20px;
          max-width: 820px;
          margin: 40px auto 0;
        }
        .studio-hero__card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          border: 1px solid oklch(1 0 0 / 14%);
          border-radius: 12px;
          background: oklch(0.13 0 0);
          box-shadow: 0 20px 44px -24px oklch(0 0 0 / 80%);
        }
        .studio-hero__card--side {
          aspect-ratio: 1 / 1.08;
          margin-top: 24px;
        }
        .studio-hero__card--video {
          aspect-ratio: 1 / 1.06;
        }
        .studio-hero__card > img,
        .studio-hero__card > video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .studio-hero__play {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: oklch(0.98 0 0);
          background: oklch(0 0 0 / 48%);
          border: 1px solid oklch(1 0 0 / 48%);
          backdrop-filter: blur(12px);
          cursor: pointer;
        }
        .studio-hero__play:hover {
          background: oklch(0 0 0 / 65%);
        }
        .studio-hero__video-label {
          position: absolute;
          left: 12px;
          bottom: 14px;
          width: 16px;
          height: 16px;
          color: oklch(0.98 0 0);
          pointer-events: none;
        }
        .studio-hero__note {
          margin: 28px 0 0;
          font-size: 13px;
          line-height: 1.6;
          color: oklch(0.74 0 0);
        }
        .dashboard-main > .studio-hero {
          margin: -40px -40px 0;
        }
        @media (max-width: 1023px) {
          .dashboard-main > .studio-hero { margin: -28px -28px 0; }
          .studio-hero__inner { padding-top: 40px; }
          .studio-hero__arc { gap: 14px; max-width: 640px; }
          .studio-hero__title { font-size: 36px; }
        }
        @media (max-width: 639px) {
          .dashboard-main > .studio-hero { margin: -28px -16px 0; }
          .studio-hero__inner { padding: 32px 16px 28px; }
          .studio-hero__title { font-size: 28px; margin-top: 14px; }
          .studio-hero__subtitle { font-size: 13px; max-width: 300px; margin-top: 10px; }
          .studio-hero__arc { gap: 8px; margin-top: 28px; }
          .studio-hero__card--side { margin-top: 18px; }
          .studio-hero__note { margin-top: 22px; font-size: 12px; }
          .studio-hero__play { width: 30px; height: 30px; right: 6px; bottom: 6px; }
          .studio-hero__video-label { display: none; }
        }
        @media (max-width: 359px) {
          .studio-hero__title { font-size: 24px; }
          .studio-hero__arc { gap: 6px; }
        }
      `}</style>

      {/* Background: upload to public/images/studio-halftone.png */}
      <img
        src="/images/studio-halftone.png"
        alt=""
        className="studio-hero__background"
        aria-hidden="true"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      <div className="studio-hero__inner">
        <div className="studio-hero__badge">
          <span aria-hidden="true" />
          Amamara Studio
        </div>

        <h1 className="studio-hero__title">
          {t("Reka tubikore nonaha", "Let’s make it now")}
        </h1>

        <p className="studio-hero__subtitle">
          {t(
            "Igitekerezo cyawe. Ubuhanga bwacu. Reka tubikore.",
            "Your idea. Our creative spark. Let’s make it happen.",
          )}
        </p>

        <div className="studio-hero__arc">
          <div className="studio-hero__card studio-hero__card--side" data-format="image">
            <img src={images.juice} alt="Amamara product advertisement" />
          </div>

          <div className="studio-hero__card studio-hero__card--video" data-format="video">
            <video
              ref={video}
              src="/ads/amamaza-showreel-placeholder.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Amamara video advertisement preview"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <button
              type="button"
              className="studio-hero__play"
              onClick={togglePlayback}
              aria-label={playing ? "Pause video" : "Play video"}
              title={playing ? "Pause video" : "Play video"}
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>
            <Clapperboard className="studio-hero__video-label" aria-hidden="true" />
          </div>

          <div className="studio-hero__card studio-hero__card--side" data-format="banner">
            <img src={images.shopBanner} alt="Amamara shop banner advertisement" />
          </div>
        </div>

        <p className="studio-hero__note">
          {t(
            "Ibitekerezo byiza ntibitegereza. Icyawe gikurikire.",
            "Good ideas don’t wait. Yours is next.",
          )}
        </p>
      </div>
    </section>
  );
}
