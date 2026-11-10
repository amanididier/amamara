import { useEffect, useRef, useState } from "react";
import { Clapperboard, Pause, Play } from "lucide-react";
import { images } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";

/**
 * Workspace home hero only.
 * Do not use this on the marketing landing page (keep DuoHero / phone there).
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
      {/* Background: put file at public/images/studio-halftone.png */}
      <img
        src="/images/studio-halftone.png"
        alt=""
        className="studio-hero__background"
        aria-hidden="true"
        onError={(e) => {
          // Soft fallback if asset is missing — keep solid black hero
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

        {/* Arc: side / larger center / side — medium sizes matching current home cards */}
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
