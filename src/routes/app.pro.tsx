import { createFileRoute } from "@tanstack/react-router";
import { UserRound, Upload } from "lucide-react";
import { toast } from "sonner";
import { images } from "@/data/ads";
import { pricing } from "@/config/site";
import { formatRWF } from "@/lib/pricing";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/app/pro")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Serivisi z'abahanga — Amamaza" },
      { name: "description", content: "Saba abahanga nyabo bagukorere itangazo ryihariye." },
      { property: "og:title", content: "Serivisi z'abahanga — Amamaza" },
      { property: "og:description", content: "Amatangazo akozwe n'abantu nyabo." },
    ],
  }),
  component: Pro,
});

function Pro() {
  const { t } = usePrefs();
  const packs = [
    { name: t("Ibanze", "Basic"), price: pricing.proServiceFrom, days: t("Iminsi 3", "3 days") },
    { name: t("Byuzuye", "Complete"), price: pricing.proServiceFrom * 2, days: t("Iminsi 5", "5 days") },
    { name: t("Ubukangurambaga", "Campaign"), price: pricing.proServiceFrom * 4, days: t("Iminsi 7", "7 days") },
  ];
  const field = "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-creative px-3 py-1 text-xs font-bold text-creative-foreground"><UserRound className="size-3.5" />{t("Bikozwe n'abantu", "Made by humans")}</span>
      <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{t("Serivisi z'abahanga", "Professional services")}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{t("Iyi si AI — ni abahanga nyabo bagukorera itangazo ryihariye.", "This isn't AI — real editors create a custom ad for you.")}</p>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[images.hotel, images.realestate, images.restaurant].map((s, i) => <img key={i} src={s} alt="" loading="lazy" className="aspect-[4/3] rounded-lg object-cover" />)}
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {packs.map((p) => (
          <div key={p.name} className="rounded-lg border bg-card p-5">
            <p className="font-bold">{p.name}</p>
            <p className="mt-2 font-display text-2xl font-extrabold">{formatRWF(p.price)}</p>
            <p className="text-xs text-muted-foreground">{p.days}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success(t("Twakiriye ubusabe bwawe (demo). Tuzaguhamagara.", "Request received (demo). We'll call you."));
        }}
        className="mt-10 grid gap-4 rounded-lg border bg-card p-6 md:grid-cols-2"
      >
        <label className="space-y-1.5 text-sm font-medium">{t("Izina ry'ubucuruzi", "Business name")}<input required className={field} /></label>
        <label className="space-y-1.5 text-sm font-medium">{t("Telefoni", "Phone")}<input required type="tel" className={field} placeholder="07..." /></label>
        <label className="space-y-1.5 text-sm font-medium md:col-span-2">{t("Sobanura icyo ushaka", "Describe what you need")}<textarea required rows={4} className={field} /></label>
        <label className="space-y-1.5 text-sm font-medium">{t("Ingengo y'imari (RWF)", "Budget (RWF)")}<input type="number" className={field} /></label>
        <label className="space-y-1.5 text-sm font-medium">{t("Igihe ukeneye", "Needed by")}<input type="date" className={field} /></label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-sm text-muted-foreground md:col-span-2">
          <Upload className="size-4" />{t("Ohereza logo n'amafoto", "Upload logo & photos")}<input type="file" multiple accept="image/*" className="hidden" />
        </label>
        <button className="rounded-full bg-primary py-3 font-semibold text-primary-foreground md:col-span-2">{t("Ohereza ubusabe", "Submit request")}</button>
      </form>
    </main>
  );
}
