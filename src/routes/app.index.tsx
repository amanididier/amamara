import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, FileImage, PanelTop, Sparkles, Plus, Clock3 } from "lucide-react";
import { AdCard } from "@/components/ad-card";
import { images, sampleAds, type Format } from "@/data/ads";
import { useLibrary } from "@/lib/library";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({ head: () => ({ meta: [{ title: "Home — Amamara Studio" }, { name: "description", content: "Create beautiful advertising with Amamara Studio." }, { name: "robots", content: "noindex, nofollow" }] }), component: Dashboard });

function Dashboard() {
  const { t } = usePrefs();
  const { all } = useLibrary();
  const [tab, setTab] = useState<Format>("video");
  const templates = useMemo(() => sampleAds.filter((ad) => ad.format === tab), [tab]);
  const actions = [
    { type: "video", title: t("Kwamamaza kuri video", "Video advertisement"), detail: t("Amashusho agenda n'inkuru", "Motion, storytelling and product films"), Icon: Clapperboard, img: images.hotel },
    { type: "flyer", title: t("Post ya social media", "Social media post"), detail: t("Igishushanyo gikurura abantu", "Scroll-stopping campaign artwork"), Icon: FileImage, img: images.fashion },
    { type: "banner", title: t("Banner n'icyapa", "Banner & signage"), detail: t("Digital no gucapisha", "Digital and print layouts"), Icon: PanelTop, img: images.shopBanner },
  ];
  const tabs = [{ id: "video" as const, label: t("Video", "Videos") }, { id: "flyer" as const, label: t("Amaposti", "Posts") }, { id: "banner" as const, label: t("Ibyapa", "Banners") }];
  return <main className="amamara-dashboard mx-auto max-w-[1440px] px-4 pb-16 pt-7 sm:px-7 lg:px-10 lg:pt-10">
    <section className="amamara-welcome">
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground"><Sparkles className="size-3.5 text-primary"/> Amamara creative studio</span>
        <h1 className="mt-5 max-w-[700px] text-4xl leading-[1.04] tracking-[-.045em] sm:text-5xl lg:text-[64px]">{t("Ibitekerezo byawe. Byahinduwe amatangazo.", "Big ideas. Beautifully advertised.")}</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">{t("Kora video, ama-poster n'ibyapa by'umwuga. Tangira ku gitekerezo, urangize ufite igihangano.", "Create polished videos, social campaigns and banners. Start with an idea and leave with work worth sharing.")}</p>
      </div>
      <div className="amamara-showcase" aria-label="Amamara creative work">
        <div className="amamara-showcase__card amamara-showcase__poster"><img src={images.juice} alt="Product social media poster"/></div>
        <div className="amamara-showcase__card amamara-showcase__banner"><img src={images.shopBanner} alt="Retail advertising banner"/></div>
        <div className="amamara-showcase__card amamara-showcase__video"><video src="/ads/amamaza-showreel-placeholder.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="Amamara video advertisement preview"/><span className="amamara-showcase__play"><span/></span></div>
      </div>
    </section>
    <section className="mt-12 sm:mt-16">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">{t("Tangira hano", "Make something")}</p><h2 className="mt-2 text-2xl tracking-[-.035em] sm:text-3xl">{t("Hitamo icyo ushaka gukora", "Create an advertisement")}</h2></div><span className="hidden text-xs text-muted-foreground sm:block">{t("Hitamo uburyo bwo gutangira", "Choose a format to get started")}</span></div>
      <div className="grid gap-4 md:grid-cols-3">{actions.map(({type,title,detail,Icon,img})=><Link key={type} to="/app/create" search={{type}} className="amamara-create-card group"><img src={img} alt="" loading="lazy"/><div className="amamara-create-card__scrim"/><div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 sm:p-6"><div className="min-w-0 text-white"><span className="mb-4 grid size-10 place-items-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur"><Icon className="size-5"/></span><h3 className="text-xl font-semibold tracking-[-.025em] sm:text-2xl">{title}</h3><p className="mt-1 text-xs text-white/75 sm:text-sm">{detail}</p></div><span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-black transition-transform group-hover:translate-x-1"><ArrowRight className="size-4"/></span></div></Link>)}</div>
    </section>
    <section className="mt-14 sm:mt-20">
      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">{t("Isomero ryawe", "Your workspace")}</p><h2 className="mt-2 text-2xl tracking-[-.035em] sm:text-3xl">{t("Amatangazo uheruka", "Recent ads")}</h2></div><Link to="/app/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">{t("Reba yose", "View all")} <ArrowRight className="size-4"/></Link></div>
      {all.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{all.slice(0,3).map(item=><article key={item.id} className="group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"><div className="aspect-[16/9] overflow-hidden bg-muted"><img src={item.image} alt={item.name} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"/></div><div className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.type} · {item.date}{item.demo ? ` · ${t("Urugero","Sample")}` : ""}</p></div><span className="grid size-9 place-items-center rounded-full border text-muted-foreground"><Clock3 className="size-4"/></span></div></article>)}</div> : <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-12 text-center"><span className="grid size-12 place-items-center rounded-2xl bg-muted"><Plus className="size-5 text-muted-foreground"/></span><h3 className="mt-4 font-semibold">{t("Nta matangazo urakora kugeza ubu","Your creative library is waiting")}</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">{t("Amatangazo uzakora azajya agaragara hano.","The ads you create will appear here.")}</p><Link to="/app/create" className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">{t("Kora itangazo rya mbere","Create your first ad")} <ArrowRight className="size-4"/></Link></div>}
    </section>
    <section className="mt-14 sm:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">{t("Hitamo aho uhera","A little inspiration")}</p><h2 className="mt-2 text-2xl tracking-[-.035em] sm:text-3xl">{t("Popular templates","Popular templates")}</h2></div><Link to="/app/templates" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">{t("Reba zose","Explore templates")} <ArrowRight className="size-4"/></Link></div>
      <div className="mt-5 flex items-center gap-2 border-b" role="tablist" aria-label={t("Ubwoko bwa template","Template categories")}>{tabs.map(item=><button key={item.id} role="tab" aria-selected={tab===item.id} onClick={()=>setTab(item.id)} className={cn("relative -mb-px min-h-11 border-b-2 px-4 text-sm font-semibold transition-colors",tab===item.id?"border-foreground text-foreground":"border-transparent text-muted-foreground hover:text-foreground")}>{item.label}</button>)}</div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{templates.slice(0,3).map(ad=><AdCard key={ad.id} ad={ad}/>)}</div>
    </section>
  </main>;
}
