import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Film,
  FileImage,
  PanelTop,
  LayoutGrid,
  Upload,
  Check,
  ArrowUp,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { sampleAds } from "@/data/ads";
import { estimatePrice, formatRWF, type AdType, type Quality } from "@/lib/pricing";
import { useLibrary } from "@/lib/library";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type Search = { type?: string | undefined; ref?: string | undefined };

export const Route = createFileRoute("/app/create")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    type: typeof s["type"] === "string" ? s["type"] : undefined,
    ref: typeof s["ref"] === "string" ? s["ref"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Kurema itangazo — Amamaza" },
      { name: "description", content: "Kora itangazo ryawe intambwe ku yindi." },
      { property: "og:title", content: "Kurema itangazo — Amamaza" },
      { property: "og:description", content: "Studio yoroshye yo gukora amatangazo." },
    ],
  }),
  component: Studio,
});

const styles = [
  { id: "premium", rw: "Igezweho & Ihenze", en: "Modern & Premium" },
  { id: "cinematic", rw: "Nka filime", en: "Cinematic" },
  { id: "energetic", rw: "Amabara & Imbaraga", en: "Colorful & Energetic" },
  { id: "minimal", rw: "Yoroheje & Nziza", en: "Minimal & Elegant" },
  { id: "luxury", rw: "Iy'akataraboneka", en: "Luxury" },
  { id: "cultural", rw: "Gakondo", en: "Traditional & Cultural" },
];

function Studio() {
  const { t, lang, setLang } = usePrefs();
  const search = Route.useSearch();
  const refAd = sampleAds.find((a) => a.id === search.ref);
  const initialType = (refAd?.format ?? search.type) as AdType | undefined;
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [type, setType] = useState<AdType>(
    initialType && ["video", "flyer", "banner", "template"].includes(initialType)
      ? initialType
      : "video",
  );
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [style, setStyle] = useState(refAd?.style ?? "premium");
  const [duration, setDuration] = useState(15);
  const [ratio, setRatio] = useState("9:16");
  const [quality, setQuality] = useState<Quality>("standard");
  const [files, setFiles] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const { add } = useLibrary();
  const est = estimatePrice({ type, durationSec: duration, quality });
  const steps = [
    t("Ubwoko", "Type"),
    t("Sobanura", "Describe"),
    t("Isura", "Style"),
    t("Igiciro", "Price"),
    t("Ibisubizo", "Result"),
  ];

  const opt = (on: boolean) =>
    cn("rounded-xl border px-4 py-2.5 text-sm font-semibold", on && "border-primary bg-primary/10 text-primary");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={cn("h-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
            <p className={cn("mt-2 hidden text-xs sm:block", i === step ? "font-semibold" : "text-muted-foreground")}>
              {s}
            </p>
          </div>
        ))}
      </div>

      {refAd && step < 4 && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-card p-3">
          <img src={refAd.image} alt="" className="size-14 rounded-lg object-cover" />
          <div className="text-sm">
            <p className="font-semibold">{refAd.title}</p>
            <p className="text-muted-foreground">{t("Urugero wahisemo", "Selected reference")}</p>
          </div>
        </div>
      )}

      {step === 0 && (
        <section className="mt-8">
          <h1 className="text-center text-3xl font-extrabold sm:text-4xl">
            {t("Urashaka gukora iki?", "What do you want to make?")}
          </h1>
          <div className="mx-auto mt-4 max-w-xl rounded-3xl border bg-card p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder={t(
                "Andika icyo ushaka... urugero: video yamamaza resitora yanjye i Kigali",
                "Describe it... e.g. a video ad for my restaurant in Kigali",
              )}
              className="w-full resize-none bg-transparent p-2 outline-none"
            />
            <div className="flex items-center justify-between">
              <span className="px-2 text-xs text-muted-foreground">
                {t("Andika mu Kinyarwanda cyangwa Icyongereza", "Write in Kinyarwanda or English")}
              </span>
              <button
                disabled={!prompt.trim()}
                onClick={() => setStep(1)}
                aria-label="Send"
                className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
              >
                <ArrowUp className="size-5" />
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                id: "flyer",
                l: "Post",
                d: t("Flyer y'imbuga nkoranyambaga", "Social media flyer"),
                Icon: FileImage,
                c: "bg-[#FF3038] text-white",
              },
              {
                id: "video",
                l: "Video",
                d: t("Video ngufi yamamaza", "Short promo video"),
                Icon: Film,
                c: "bg-[#6B2BFF] text-white",
              },
              {
                id: "banner",
                l: "Icyapa",
                d: t("Banner y'iduka", "Shop banner / signage"),
                Icon: PanelTop,
                c: "bg-[#FFCF40] text-black",
              },
              {
                id: "pro",
                l: t("Vugana n'umuhanga", "Talk to a professional"),
                d: t("Umuhanga agukorere", "Get an expert to do it"),
                Icon: UserRound,
                c: "bg-[#00B37A] text-white",
              },
            ].map((x) =>
              x.id === "pro" ? (
                <Link
                  key={x.id}
                  to="/app/pro"
                  className={cn(
                    "flex aspect-square flex-col justify-between rounded-3xl p-5 text-left transition-transform hover:-translate-y-1",
                    x.c,
                  )}
                >
                  <x.Icon className="size-8" />
                  <span>
                    <span className="block font-display text-lg font-extrabold leading-tight">{x.l}</span>
                    <span className="text-xs opacity-80">{x.d}</span>
                  </span>
                </Link>
              ) : (
                <button
                  key={x.id}
                  onClick={() => {
                    setType(x.id as AdType);
                    setStep(1);
                  }}
                  className={cn(
                    "flex aspect-square flex-col justify-between rounded-3xl p-5 text-left transition-transform hover:-translate-y-1",
                    x.c,
                  )}
                >
                  <x.Icon className="size-8" />
                  <span>
                    <span className="block font-display text-xl font-extrabold">{x.l}</span>
                    <span className="text-xs opacity-80">{x.d}</span>
                  </span>
                </button>
              ),
            )}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl font-extrabold">
              {t("Tubwire ibijyanye n'ubucuruzi bwawe.", "Tell us about your business.")}
            </h1>
            <button
              onClick={() => setLang(lang === "rw" ? "en" : "rw")}
              className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase"
            >
              {lang === "rw" ? "EN" : "RW"}
            </button>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("Izina ry'ubucuruzi bwawe", "Business name")}
            className="mt-6 w-full rounded-xl border bg-card px-4 py-3 outline-none focus:border-primary"
          />
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder={t(
              "Urugero: Mfite resitora i Kigali igurisha ibiryo byiza. Ndashaka video yamamaza ifunguro ryacu rishya...",
              "Example: I run a restaurant in Kigali. I want a video ad for our new dish...",
            )}
            className="mt-3 w-full rounded-2xl border bg-card p-4 outline-none focus:border-primary"
          />
          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            <Upload className="size-4" />
            {files.length
              ? `${files.length} ${t("amafoto", "photos")}`
              : t("Ongeramo logo n'amafoto y'ibicuruzwa", "Add logo & product photos")}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
            />
          </label>
        </section>
      )}

      {step === 2 && (
        <section className="mt-8">
          <h1 className="text-3xl font-extrabold">{t("Hitamo isura", "Choose a style")}</h1>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {styles.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={cn(
                  "overflow-hidden rounded-2xl border-2 text-left",
                  style === s.id ? "border-primary" : "border-transparent",
                )}
              >
                <img
                  src={sampleAds[i % sampleAds.length]!.image}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <p className="bg-card p-2.5 text-sm font-semibold">{lang === "rw" ? s.rw : s.en}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-8 space-y-6">
          <h1 className="text-3xl font-extrabold">{t("Igenamiterere n'igiciro", "Settings & price")}</h1>
          {type === "video" && (
            <div>
              <p className="mb-2 text-sm font-semibold">{t("Igihe", "Duration")}</p>
              <div className="flex gap-2">
                {[10, 15, 30].map((d) => (
                  <button key={d} onClick={() => setDuration(d)} className={opt(duration === d)}>
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="mb-2 text-sm font-semibold">{t("Ibipimo", "Format")}</p>
            <div className="flex gap-2">
              {["9:16", "16:9", "1:1"].map((r) => (
                <button key={r} onClick={() => setRatio(r)} className={opt(ratio === r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">{t("Ubwiza", "Quality")}</p>
            <div className="flex gap-2">
              {(["standard", "hd", "premium"] as const).map((q) => (
                <button key={q} onClick={() => setQuality(q)} className={opt(quality === q)}>
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{t("Igiciro giteganyijwe", "Estimated price")}</p>
            <p className="font-display text-5xl font-extrabold text-primary">{formatRWF(est.total)}</p>
            <ul className="mt-4 space-y-1 text-sm">
              {est.lines.map((l) => (
                <li key={l.labelEn} className="flex justify-between">
                  <span className="text-muted-foreground">{lang === "rw" ? l.labelRw : l.labelEn}</span>
                  <span>{formatRWF(l.amount)}</span>
                </li>
              ))}
            </ul>
            <label className="mt-4 flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="size-4 accent-primary"
              />
              {t("Nemeye iki giciro", "I accept this price")}
            </label>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="mt-8">
          <h1 className="text-3xl font-extrabold">{t("Ishusho y'itangazo ryawe", "Your ad preview")}</h1>
          <p className="mt-2 rounded-xl bg-creative/15 p-3 text-sm text-creative">
            {t(
              "Demo: AI ntirahuzwa. Iyi ni ishusho y'urugero, si itangazo ryawe nyaryo.",
              "Demo: AI isn't connected yet. This is a sample preview, not your real ad.",
            )}
          </p>
          <img
            src={(refAd ?? sampleAds[0]!).image}
            alt="Preview"
            className="mt-4 w-full rounded-3xl object-cover"
          />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                add({
                  id: crypto.randomUUID(),
                  name: name || t("Itangazo rishya", "New ad"),
                  type: type === "template" ? "flyer" : type,
                  date: new Date().toISOString().slice(0, 10),
                  status: "progress",
                  image: (refAd ?? sampleAds[0]!).image,
                });
                toast.success(t("Byabitswe", "Saved"));
              }}
              className="rounded-full bg-primary py-3 font-semibold text-primary-foreground"
            >
              {t("Bika", "Save")}
            </button>
            <button onClick={() => setStep(1)} className="rounded-full border py-3 font-semibold">
              {t("Indi verisiyo", "Another version")}
            </button>
            <Link to="/app/pro" className="col-span-2 rounded-full border py-3 text-center font-semibold">
              {t("Saba guhindurirwa", "Request an edit")}
            </Link>
          </div>
        </section>
      )}

      {step < 4 && (
        <div className="mt-10 flex justify-between">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1 rounded-full border px-5 py-3 font-semibold disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            {t("Subira", "Back")}
          </button>
          {step > 0 && (
            <button
              disabled={(step === 1 && !prompt.trim()) || (step === 3 && !confirmed)}
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-40"
            >
              {step === 3 ? (
                <>
                  <Check className="size-4" />
                  {t("Emeza & Kora", "Confirm & create")}
                </>
              ) : (
                <>
                  {t("Komeza", "Continue")}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
