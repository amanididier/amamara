import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Facebook, Heart, Image as ImageIcon, MessageCircle, Play, Share2, Store, Film } from "lucide-react";
import { images } from "@/data/ads";
import shopEntranceBanner from "@/assets/ads/shop-entrance-banner.jpg";
import furniturePost from "@/assets/ads/post-furniture.jpg";
import { usePrefs } from "@/lib/prefs";

export function WhatWeDo() {
  const { t } = usePrefs();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const node = videoSectionRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVideoVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setVideoVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (videoVisible) video.play().catch(() => {});
    else video.pause();
  }, [videoVisible]);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h2 className="text-center text-3xl font-bold sm:text-5xl">{t("Ibyo dukora", "What we do")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          {t("Hitamo ubwoko bw'itangazo ushaka — video, post cyangwa icyapa.", "Choose the kind of ad you need — video, social post or banner.")}
        </p>
      </div>

      <section ref={videoSectionRef} className="mt-10 bg-vid-soft/70 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold sm:text-4xl">{t("Video ngufi z'ubucuruzi bwawe.", "Short videos for your business.")}</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t("Kora video za 10–30s ziteguye kuri TikTok, Instagram Reels, WhatsApp Status na Facebook.", "Create 10–30s videos ready for TikTok, Instagram Reels, WhatsApp Status and Facebook.")}
            </p>
            <Link to="/app/create" search={{ type: "video" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-vid px-6 font-semibold text-white transition-transform hover:scale-[1.02]">
              {t("Kora video", "Create a video")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-5">
            <div className="phone-frame">
              <div className="phone-frame__screen">
                <span className="phone-frame__notch" />
                <video ref={videoRef} src="/ads/amamaza-video-section-ad.mp4" muted playsInline loop preload="metadata" aria-label="Amamaza promotional video preview" />
                <div className="absolute inset-x-3 bottom-4 z-[4] flex items-center justify-between text-white drop-shadow">
                  <span className="text-xs font-bold">Amamaza</span><Play className="size-4 fill-current" />
                </div>
              </div>
            </div>
            <span className="sticker -left-1 top-[18%] bg-white text-[#E1306C] sm:left-2"><Heart className="size-5 fill-current" /></span>
            <span className="sticker -right-1 top-[31%] bg-[#25D366] text-white sm:right-1"><MessageCircle className="size-5" /></span>
            <span className="sticker -left-2 bottom-[17%] bg-white text-[#1877F2] sm:left-0"><Facebook className="size-5 fill-current" /></span>
            <span className="sticker -right-2 bottom-[12%] bg-white text-foreground sm:right-0"><Share2 className="size-5" /></span>
          </div>
        </div>
      </section>

      <section className="bg-post-soft/70 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative mx-auto flex min-h-[330px] w-full max-w-lg items-center justify-center">
            <img src={images.fashion} alt="Fashion shop social media advertisement" className="absolute left-[2%] top-[12%] z-[1] w-[42%] rotate-[-8deg] border-[7px] border-background object-cover shadow-xl" />
            <img src={images.juice} alt="Local drink product social media advertisement" className="relative z-[3] w-[46%] border-[7px] border-background object-cover shadow-2xl" />
            <img src={furniturePost} alt="Furniture shop social media advertisement" className="absolute right-[2%] top-[12%] z-[2] w-[42%] rotate-[8deg] border-[7px] border-background object-cover shadow-xl" />
            <span className="sticker bottom-[9%] right-[4%] z-[5] rotate-[-5deg] bg-[#DDF5FF] text-sky-900">{t("Gura ubu", "Buy now")}</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold sm:text-4xl">{t("Amafoto yo kuri social media", "Social media posts")}</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t("Kora amafoto yamamaza ajyanye n'ubucuruzi bwawe, asangizwa kuri WhatsApp, TikTok, Instagram na Facebook.", "Create product and business posts ready to share on WhatsApp, TikTok, Instagram and Facebook.")}
            </p>
            <Link to="/app/create" search={{ type: "flyer" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-sky-500 px-6 font-semibold text-white transition-transform hover:scale-[1.02]">
              {t("Kora post", "Create a post")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-ban-soft/70 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h3 className="text-3xl font-bold sm:text-4xl">{t("Icyapa cyo hejuru y'iduka ryawe", "A banner above your shop")}</h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t("Kora icyapa kinini, gisomeka neza kiri hejuru y'iduka ryawe kandi kigaragaza ibyo ucuruza.", "Create a clear, professional storefront banner that shows customers what your business offers.")}
            </p>
            <Link to="/app/create" search={{ type: "banner" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ban px-6 font-semibold text-ban-foreground transition-transform hover:scale-[1.02]">
              {t("Kora icyapa", "Create a banner")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="wall-clip">
              <div className="wall-clip__back" />
              <img src={shopEntranceBanner} alt="Printed Amamaza banner displayed above a Rwandan shop entrance" className="wall-clip__front" />
              <span className="wall-clip__clip" aria-hidden />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
