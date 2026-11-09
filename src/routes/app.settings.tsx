import { createFileRoute } from "@tanstack/react-router";
import { LangSwitch, ThemeSwitch } from "@/components/brand";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });
function SettingsPage() {
  const { t, lang, theme } = usePrefs();
  return <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
    <p className="text-[11px] font-bold uppercase tracking-[.2em] text-muted-foreground">Workspace</p>
    <h1 className="mt-2 text-3xl tracking-[-.04em] sm:text-4xl">{t("Igenamiterere","Settings")}</h1>
    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{t("Tunganya uko ukoresha Amamara Studio.","Personalize how you use Amamara Studio.")}</p>
    <section className="mt-8 divide-y rounded-2xl border bg-card">
      <div className="flex items-center justify-between gap-5 p-5 sm:p-6"><div><h2 className="font-semibold">{t("Imigaragarire","Appearance")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Hitamo uburyo bw'urumuri cyangwa umwijima.","Choose light or dark mode.")}</p></div><div className="flex items-center gap-3"><span className="text-xs capitalize text-muted-foreground">{theme}</span><ThemeSwitch/></div></div>
      <div className="flex items-center justify-between gap-5 p-5 sm:p-6"><div><h2 className="font-semibold">{t("Ururimi","Language")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("Hitamo ururimi ukoresha muri studio.","Choose your preferred studio language.")}</p></div><LangSwitch/></div>
      <div className="p-5 sm:p-6"><h2 className="font-semibold">{t("Ibyerekeye studio","About this studio")}</h2><p className="mt-1 text-sm text-muted-foreground">Amamara Studio · {lang==="rw"?"Yakorewe i Kigali, u Rwanda.":"Made in Kigali, Rwanda."}</p></div>
    </section>
  </main>;
}