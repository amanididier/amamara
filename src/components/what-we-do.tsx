import { Link } from "@tanstack/react-router";
import { ArrowRight, Film, Image as ImageIcon, Store } from "lucide-react";
import { images } from "@/data/ads";
import { usePrefs } from "@/lib/prefs";

export function WhatWeDo() {
  const { t } = usePrefs();
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <h2 className="text-center text-3xl font-bold sm:text-5xl">{t("Ibyo dukora", "What we do")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          {t(
            "Hitamo ubwoko bw'itangazo ushaka — video, post cyangwa icyapa.",
            "Choose the kind of ad you need — video, post or banner.",
          )}
        </p>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-vid/15 px-3 py-1 text-xs font-bold text-vid">
              <Film className="size-3.5" /> {t("Video zamamaza", "Video ads")}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t("Video ngufi z'ubucuruzi bwawe.", "Short videos for your business.")}
            </h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t(
                "Kora video za 10–30s ziteguye kuri TikTok, Instagram Reels, WhatsApp Status na Facebook.",
                "Create 10–30s videos ready for TikTok, Instagram Reels, WhatsApp Status and Facebook.",
              )}
            </p>
            <Link to="/app/create" search={{ type: "video" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground">
              {t("Kora video", "Create a video")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={images.hotel} alt="" className="aspect-[4/5] rounded-2xl object-cover" />
            <img src={images.juice} alt="" className="mt-8 aspect-[4/5] rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            <img src={images.fashion} alt="" className="aspect-[4/5] rounded-2xl object-cover" />
            <img src={images.salon} alt="" className="mt-8 aspect-[4/5] rounded-2xl object-cover" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-post/15 px-3 py-1 text-xs font-bold text-post">
              <ImageIcon className="size-3.5" /> {t("Amaposti n'ama flyer", "Posts & flyers")}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t("Post nziza zo gusangiza.", "Beautiful posts ready to share.")}
            </h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t(
                "Flyer na post za promosiyo biteguye kuri Instagram, Facebook na WhatsApp.",
                "Promo flyers and posts ready for Instagram, Facebook and WhatsApp.",
              )}
            </p>
            <Link to="/app/create" search={{ type: "flyer" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground">
              {t("Kora post", "Create a post")} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ban/15 px-3 py-1 text-xs font-bold text-ban">
              <Store className="size-3.5" /> {t("Ibyapa by'amaduka", "Shop banners")}
            </span>
            <h3 className="mt-4 text-3xl font-bold sm:text-4xl">
              {t("Banner iri hejuru y'iduka ryawe.", "The banner above your shop.")}
            </h3>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t(
                "Kora banner nziza yo kumanika ku iduka, isomeka kure, ifite izina n'ibyo ucuruza.",
                "Create a clear storefront banner with your name and products — ready for printing.",
              )}
            </p>
            <Link to="/app/create" search={{ type: "banner" }} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground">
              {t("Kora banner", "Create a banner")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            <img src={images.shopBanner} alt="" className="rounded-3xl object-cover" />
            <img src={images.techBanner} alt="" className="rounded-3xl object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
