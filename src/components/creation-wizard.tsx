import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  FileCheck,
  Film,
  ImagePlus,
  MapPin,
  Save,
  Smartphone,
  Sparkles,
  Store,
  Tag,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AccountAccess, useAccount } from "@/components/account-access";
import {
  buildPrompt,
  categories,
  goals,
  imageStyles,
  suggestStyle,
  videoStyles,
  type Brief,
} from "@/lib/ad-skills";
import { BRIEF_STEPS, isBriefStepValid } from "@/lib/creation-brief";
import { estimatePrice, formatRWF, type Quality } from "@/lib/pricing";
import { checkMomoPayment, createMomoAdOrder, loadMomoWallet } from "@/lib/momo.functions";
import { usePrefs } from "@/lib/prefs";
import { images } from "@/data/ads";
import { cn } from "@/lib/utils";

type CreationType = "flyer" | "banner" | "video";
export function CreationWizard({ type }: { type: CreationType }) {
  const { t, lang } = usePrefs();
  const { signedIn } = useAccount();
  const key = `amamaza-brief-${type}`;
  const [brief, setBrief] = useState<Brief>({
    type,
    description: "",
    businessName: "",
    category: "",
    area: "",
    goal: "",
    contact: "",
    headline: "",
    cta: "",
    adLanguage: "Kinyarwanda",
    style: "",
    videoStyle: "",
    duration: 15,
    ratio: type === "banner" ? "3:1" : type === "video" ? "9:16" : "4:5",
    period: "",
  });
  const [stage, setStage] = useState<"intro" | "questions" | "preparing" | "payment">("intro");
  const [step, setStep] = useState(0);
  const [quality, setQuality] = useState<Quality>("standard");
  const [method, setMethod] = useState<"momo" | "wallet" | "card">("momo");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");
  const [word, setWord] = useState(0);
  const [draftReady, setDraftReady] = useState(false);
  const [attemptKey, setAttemptKey] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (saved?.type === type) setBrief(saved);
    } catch {
      /* keep empty brief */
    }
    setDraftReady(true);
  }, [key, type]);
  useEffect(() => {
    if (draftReady) localStorage.setItem(key, JSON.stringify(brief));
  }, [brief, draftReady, key]);
  useEffect(() => {
    if (stage !== "preparing") return;
    const timer = window.setInterval(
      () => setWord((w) => (w + 1) % 3),
      type === "video" ? 1200 : 850,
    );
    const done = window.setTimeout(() => setStage("payment"), type === "video" ? 3600 : 2400);
    return () => {
      clearInterval(timer);
      clearTimeout(done);
    };
  }, [stage, type]);
  const update = (patch: Partial<Brief>) => {
    setBrief((b) => ({ ...b, ...patch }));
    setAttemptKey("");
  };
  const price = estimatePrice({ type, durationSec: brief.duration ?? 15, quality });
  const recommended = suggestStyle(brief.category, type);
  const titles = [
    t("Sobanura icyo ushaka", "What would you like to advertise?"),
    t("Intego y'itangazo", "What is the occasion?"),
    t("Ubucuruzi bwawe", "Your business"),
    t("Inyandiko z'itangazo", "What should the ad say?"),
    t("Hitamo isura", "Choose a look"),
    t("Ibipimo n'ubwiza", "Format & quality"),
    t("Igihe n'ibisobanuro bya nyuma", "Timing & final details"),
  ];
  const icons = [ImagePlus, Tag, Store, FileCheck, Sparkles, Film, MapPin];
  const Icon = icons[step] ?? FileCheck;
  const fieldClass =
    "mt-2 w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  const field = (label: string, name: keyof Brief, placeholder = "", required = false) => (
    <label className="block text-sm font-medium">
      {label}
      {required && " *"}
      <input
        className={fieldClass}
        value={String(brief[name] ?? "")}
        placeholder={placeholder}
        onChange={(e) => update({ [name]: e.target.value })}
      />
    </label>
  );
  const options = (
    items: readonly { id: string; rw: string; en: string }[],
    selected: string,
    onSelect: (id: string) => void,
  ) => (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((x) => (
        <Button
          key={x.id}
          variant="outline"
          aria-pressed={selected === x.id}
          onClick={() => onSelect(x.id)}
          className={cn(
            "h-auto min-h-14 justify-between whitespace-normal text-left",
            selected === x.id && "border-primary bg-primary/10 text-primary",
          )}
        >
          {x[lang]}
          {selected === x.id && <Check />}
        </Button>
      ))}
    </div>
  );
  async function pay() {
    if (!signedIn || method === "card") return;
    setBusy(true);
    const idempotency = attemptKey || crypto.randomUUID();
    setAttemptKey(idempotency);
    try {
      const wallet = await loadMomoWallet();
      if (wallet.environment !== "sandbox")
        throw new Error("Ad production is not connected. Live order payments are disabled.");
      const result = await createMomoAdOrder({
        service_type: type,
        duration_seconds: brief.duration ?? 15,
        quality,
        payment_method: method,
        phone,
        idempotency_key: idempotency,
      });
      if (!result.ok) throw new Error(result.error || "Payment request failed.");
      setReference(result.reference_id || "");
      setStatus(result.status);
      if (result.is_test)
        toast.info(
          t(
            "Igerageza gusa. Nta tangazo ririmo gukorwa.",
            "Test payment only. No ad is being generated.",
          ),
        );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment could not start.");
    } finally {
      setBusy(false);
    }
  }
  async function check() {
    setBusy(true);
    try {
      const result = await checkMomoPayment(reference);
      setStatus(result.status);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not check payment.");
    } finally {
      setBusy(false);
    }
  }
  function save() {
    localStorage.setItem(key, JSON.stringify(brief));
    toast.success(
      t("Ibisobanuro byawe byabitswe kuri iki gikoresho.", "Your brief is saved on this device."),
    );
  }
  if (stage === "intro")
    return (
      <main className="mx-auto max-w-3xl px-5 py-12 sm:py-20">
        <span className="text-sm font-semibold text-primary">
          {type === "flyer" ? "Post" : type === "banner" ? "Icyapa" : "Video"}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
          {t("Tubanze twumve icyo ushaka.", "Let’s get your ad right.")}
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          {t(
            "Subiza ibibazo 7 byoroshye. Bifata iminota igera kuri 2, hanyuma urebe ibisobanuro n'igiciro mbere yo kwishyura.",
            "Seven simple questions, about two minutes. Then review your brief and estimated price before payment.",
          )}
        </p>
        <img
          src={
            type === "banner" ? images.shopBanner : type === "video" ? images.juice : images.fashion
          }
          alt={t("Urugero rw'itangazo", "Sample ad")}
          className="mt-8 aspect-[2/1] w-full rounded-lg object-cover"
        />
        <div className="mt-8 flex gap-3">
          <Button size="lg" onClick={() => setStage("questions")}>
            {t("Tangira", "Start")}
            <ArrowRight />
          </Button>
          <Button asChild variant="ghost">
            <Link to="/app/create">{t("Subira", "Back")}</Link>
          </Button>
        </div>
      </main>
    );
  if (stage === "preparing")
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <Sparkles className="size-10 text-primary motion-safe:animate-pulse" />
        <h1 key={word} className="mt-6 min-h-16 text-2xl font-bold motion-safe:animate-word">
          {
            [
              t("Turimo gutegura ibisobanuro…", "Organizing your brief…"),
              t("Turimo guhuza amahitamo…", "Matching your selections…"),
              t("Turimo kubara igiciro…", "Calculating your estimate…"),
            ][word]
          }
        </h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "Nta mafaranga arishyurwa. Itangazo ntiriratangira gukorwa.",
            "No payment taken. Ad generation has not started.",
          )}
        </p>
      </main>
    );
  if (stage === "payment")
    return (
      <main className="mx-auto max-w-4xl px-5 py-10">
        <Button
          variant="ghost"
          onClick={() => {
            setStage("questions");
            setStep(6);
          }}
          disabled={Boolean(reference)}
        >
          <ArrowLeft />
          {t("Hindura ibisobanuro", "Edit brief")}
        </Button>
        <h1 className="mt-5 text-3xl font-extrabold">
          {t("Reba ibisobanuro n'igiciro", "Review & payment")}
        </h1>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-bold">{brief.businessName}</h2>
            <dl className="mt-4 divide-y text-sm">
              {[
                [t("Intego", "Goal"), goals.find((g) => g.id === brief.goal)?.[lang]],
                [t("Aho ukorera", "Location"), brief.area],
                [t("Umutwe", "Headline"), brief.headline],
                [t("Ubutumwa", "Call to action"), brief.cta],
                [
                  t("Isura", "Style"),
                  (type === "video" ? videoStyles : imageStyles).find(
                    (s) => s.id === (type === "video" ? brief.videoStyle : brief.style),
                  )?.[lang],
                ],
                [t("Igihe", "Period"), brief.period],
                [
                  t("Ibipimo", "Format"),
                  `${brief.ratio}${type === "video" ? ` · ${brief.duration}s` : ""}`,
                ],
                [t("Igabanuka", "Offer"), brief.discount],
                [t("Aho mwimukiye", "New location"), brief.newLocation],
                [t("Telefoni", "Contact"), brief.contact],
              ]
                .filter(([, v]) => v)
                .map(([l, v]) => (
                  <div key={l} className="flex justify-between gap-4 py-3">
                    <dt className="text-muted-foreground">{l}</dt>
                    <dd className="max-w-[65%] break-words text-right font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
            <Button variant="outline" className="mt-5" onClick={save}>
              <Save />
              {t("Bika ibisobanuro", "Save brief")}
            </Button>
            <details className="mt-5 text-sm">
              <summary className="cursor-pointer text-muted-foreground">
                {t("Ibisobanuro byose", "Full creative brief")}
              </summary>
              <p className="mt-3 whitespace-pre-wrap break-words">{buildPrompt(brief)}</p>
            </details>
          </section>
          <section>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "momo", name: "MTN MoMo", Icon: Smartphone },
                { id: "wallet", name: t("Konti", "Wallet"), Icon: Wallet },
                { id: "card", name: t("Ikarita", "Card"), Icon: CreditCard },
              ].map((m) => (
                <Button
                  key={m.id}
                  variant="outline"
                  aria-pressed={method === m.id}
                  disabled={Boolean(reference)}
                  onClick={() => {
                    setMethod(m.id as typeof method);
                    setAttemptKey("");
                  }}
                  className={cn(
                    "h-auto min-h-20 flex-col whitespace-normal px-2",
                    method === m.id && "border-primary bg-primary/10",
                  )}
                >
                  <m.Icon />
                  {m.name}
                </Button>
              ))}
            </div>
            <div className="mt-5 divide-y border-y text-sm">
              {price.lines.map((l) => (
                <div key={l.labelEn} className="flex justify-between gap-3 py-3">
                  <span>{lang === "rw" ? l.labelRw : l.labelEn}</span>
                  <span>{formatRWF(l.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-4 text-lg font-bold">
                <span>{t("Igiteranyo", "Estimated total")}</span>
                <span>{formatRWF(price.total)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t(
                "Ibiciro ni iby'icyitegererezo. Nta nyongera ya MTN ishyirwaho muri iyi kode.",
                "Placeholder prices. Your current payment setup adds no MTN surcharge.",
              )}
            </p>
            <p className="mt-5 border-l-2 border-creative pl-4 text-sm leading-relaxed">
              {t(
                "Gukora itangazo ntibirahuzwa. Bika ibisobanuro byawe; ntukishyure amafaranga nyayo. MTN ikoreshwa mu igerageza rya EUR 1 gusa, ritandukanye n'amafaranga nyayo.",
                "Ad production is not connected yet. Save your brief; do not pay real money. MTN is test-only: a 1 EUR request, separate from real funds.",
              )}
            </p>
            {!signedIn ? (
              <div className="mt-5">
                <AccountAccess />
              </div>
            ) : (
              <>
                {method === "momo" && (
                  <label className="mt-5 block text-sm">
                    {t("Nimero ya MTN MoMo", "MTN MoMo number")}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={fieldClass}
                      placeholder="078 000 0000"
                    />
                  </label>
                )}
                {method === "card" ? (
                  <p className="mt-5 text-sm text-muted-foreground">
                    {t("Kwishyura ikarita ntibirahuzwa.", "Card payments are not connected yet.")}
                  </p>
                ) : (
                  <Button
                    className="mt-5 w-full"
                    disabled={
                      busy ||
                      Boolean(reference) ||
                      (method === "momo" &&
                        !/^2507\d{8}$/.test(phone.replace(/\D/g, "").replace(/^07/, "2507")))
                    }
                    onClick={() => void pay()}
                  >
                    {busy
                      ? t("Tegereza…", "Please wait…")
                      : t("Gerageza kwishyura gusa", "Test payment only")}
                  </Button>
                )}
              </>
            )}
            {reference && (
              <div role="status" className="mt-5 space-y-3">
                <p className="text-sm font-semibold">MTN: {status}</p>
                <p className="break-all font-mono text-xs text-muted-foreground">{reference}</p>
                <Button
                  variant="outline"
                  disabled={
                    busy || ["successful", "failed", "rejected", "expired"].includes(status)
                  }
                  onClick={() => void check()}
                >
                  {t("Reba uko byagenze", "Check payment")}
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:py-12">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="icon" title={t("Subira", "Back")}>
          <Link to="/app/create">
            <ArrowLeft />
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          {step + 1} / {BRIEF_STEPS}
        </span>
        <Button variant="ghost" size="icon" title={t("Bika", "Save")} onClick={save}>
          <Save />
        </Button>
      </div>
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={cn("h-1 rounded-sm", i <= step ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <div className="mt-10 flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-creative text-creative-foreground">
          <Icon className="size-7" />
        </span>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{titles[step]}</h1>
      </div>
      <div className="mt-8 min-h-64 space-y-5">
        {step === 0 && (
          <>
            <label className="block text-sm font-medium">
              {t(
                "Tubwire ibicuruzwa cyangwa serivisi ushaka kwamamaza.",
                "Tell us about the product or service you want to promote.",
              )}
              <textarea
                rows={6}
                value={brief.description}
                onChange={(e) => update({ description: e.target.value })}
                className={fieldClass}
                placeholder={t(
                  "Urugero: Mfite iduka ry'inkweto i Remera…",
                  "For example: I sell handmade shoes in Remera…",
                )}
              />
            </label>
          </>
        )}
        {step === 1 && (
          <>
            {options(goals, brief.goal, (goal) => update({ goal, discount: "", newLocation: "" }))}
            {brief.goal === "promo" &&
              field(
                t("Igabanuka cyangwa igiciro cyihariye", "Discount or special offer"),
                "discount",
                "20%",
                true,
              )}
            {brief.goal === "moved" &&
              field(t("Aho mwimukiye", "New address"), "newLocation", "", true)}
          </>
        )}
        {step === 2 && (
          <>
            {field(t("Izina ry'ubucuruzi", "Business name"), "businessName", "", true)}
            {options(categories, brief.category, (category) =>
              update({
                category,
                style: suggestStyle(category, "flyer"),
                videoStyle: suggestStyle(category, "video"),
              }),
            )}
            {field(
              t("Aho ukorera", "Where do you work?"),
              "area",
              t("Umujyi, akarere, umuhanda", "City, district, street"),
              true,
            )}
          </>
        )}
        {step === 3 && (
          <>
            {field(t("Umutwe munini", "Main headline"), "headline", "", true)}
            {field(
              t("Icyo ushaka ko abakiriya bakora", "What should customers do?"),
              "cta",
              t("Dusure uyu munsi", "Visit us today"),
              true,
            )}
            {field(
              t("Telefoni cyangwa urubuga (si ngombwa)", "Phone or website (optional)"),
              "contact",
            )}
            {options(
              [
                { id: "Kinyarwanda", rw: "Kinyarwanda", en: "Kinyarwanda" },
                { id: "English", rw: "English", en: "English" },
                { id: "French", rw: "Français", en: "French" },
              ],
              brief.adLanguage,
              (adLanguage) => update({ adLanguage }),
            )}
          </>
        )}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {(type === "video" ? videoStyles : imageStyles).map((s, i) => (
              <Button
                key={s.id}
                variant="outline"
                aria-pressed={(type === "video" ? brief.videoStyle : brief.style) === s.id}
                onClick={() => update(type === "video" ? { videoStyle: s.id } : { style: s.id })}
                className={cn(
                  "h-auto flex-col items-stretch overflow-hidden whitespace-normal p-0 text-left",
                  (type === "video" ? brief.videoStyle : brief.style) === s.id &&
                    "border-primary ring-1 ring-primary",
                )}
              >
                <img
                  src={
                    [
                      images.fashion,
                      images.juice,
                      images.salon,
                      images.hotel,
                      images.shopBanner,
                      images.techBanner,
                    ][i % 6]
                  }
                  alt={s[lang]}
                  className="aspect-[3/2] w-full object-cover"
                />
                <span className="p-3">
                  <span className="block font-semibold">{s[lang]}</span>
                  {s.id === recommended && (
                    <span className="mt-1 block text-xs text-primary">
                      {t("Ijyanye n'ubucuruzi bwawe", "Suggested for your business")}
                    </span>
                  )}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {t("Urugero", "Sample")}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        )}
        {step === 5 && (
          <>
            {options(
              (type === "banner" ? ["3:1", "2:1", "3:2"] : ["9:16", "4:5", "1:1", "16:9"]).map(
                (id) => ({ id, rw: id, en: id }),
              ),
              brief.ratio,
              (ratio) => update({ ratio }),
            )}
            {type === "video" && (
              <div>
                <p className="mb-3 text-sm font-medium">{t("Igihe cya video", "Video length")}</p>
                {options(
                  [10, 15, 20, 30].map((s) => ({ id: String(s), rw: `${s}s`, en: `${s}s` })),
                  String(brief.duration),
                  (s) => update({ duration: Number(s) }),
                )}
              </div>
            )}
            {options(
              [
                { id: "standard", rw: "Ibanze", en: "Standard" },
                { id: "hd", rw: "HD", en: "HD" },
                { id: "premium", rw: "Premium", en: "Premium" },
              ],
              quality,
              (q) => {
                setQuality(q as Quality);
                setAttemptKey("");
              },
            )}
            <p className="text-lg font-bold">
              {t("Igiciro giteganyijwe", "Estimate")}: {formatRWF(price.total)}
            </p>
          </>
        )}
        {step === 6 && (
          <>
            {field(
              t(
                "Igihe promosiyo cyangwa itangazo bizamara",
                "When is the offer or campaign running?",
              ),
              "period",
              t("Urugero: 10–17 Ugushyingo", "For example: November 10–17"),
              true,
            )}
            <p className="text-sm text-muted-foreground">
              {t(
                "Reba niba amazina, telefoni n'igabanuka byanditse neza.",
                "Check your business name, contact and offer before continuing.",
              )}
            </p>
            <div className="divide-y border-y text-sm">
              <p className="py-3 font-semibold">
                {brief.businessName} · {brief.area}
              </p>
              <p className="py-3">
                {brief.headline} — {brief.cta}
              </p>
              <p className="py-3 font-bold">{formatRWF(price.total)}</p>
            </div>
          </>
        )}
      </div>
      <div className="mt-10 flex justify-between gap-3 border-t pt-6">
        <Button
          variant="ghost"
          onClick={() => (step === 0 ? setStage("intro") : setStep(step - 1))}
        >
          <ArrowLeft />
          {t("Subira", "Back")}
        </Button>
        <Button
          disabled={!isBriefStepValid(step, brief)}
          onClick={() => (step === 6 ? setStage("preparing") : setStep(step + 1))}
        >
          {step === 6 ? t("Reba igiciro", "Review price") : t("Komeza", "Continue")}
          <ArrowRight />
        </Button>
      </div>
    </main>
  );
}
