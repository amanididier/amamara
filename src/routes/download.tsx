import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Smartphone, Share } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAndroidDownloadUrl, isAndroid, isIOS, PLAY_STORE_URL } from "@/lib/native";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download Amamara — Android app" },
      {
        name: "description",
        content: "Install Amamara Studio on your Android phone. Create video ads and social posts.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { t } = usePrefs();
  const android = typeof window !== "undefined" && isAndroid();
  const ios = typeof window !== "undefined" && isIOS();
  const href = getAndroidDownloadUrl();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-14 text-center sm:px-6">
        <div className="mx-auto grid size-24 place-items-center overflow-hidden rounded-3xl bg-[#C4102E] shadow-lg">
          <img src="/icons/amamara-app-icon.png" alt="Amamara" className="size-full object-cover" />
        </div>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t("Kuramo Amamara", "Get Amamara")}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t(
            "Studio ikorera kuri telefoni yawe — video n'amapost y'ubucuruzi.",
            "The studio on your phone — video ads and social posts for your business.",
          )}
        </p>

        {(android || (!android && !ios)) && (
          <a
            href={href}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground"
            download={!PLAY_STORE_URL ? "amamara.apk" : undefined}
          >
            <Download className="size-5" />
            {PLAY_STORE_URL
              ? t("Kuramo kuri Play Store", "Get it on Play Store")
              : t("Kuramo APK ya Android", "Download Android APK")}
          </a>
        )}

        {ios && (
          <p className="mt-8 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
            {t(
              "App ya iPhone irategerejwe. Kugeza ubu koresha Safari → Share → Add to Home Screen.",
              "iPhone app is coming. For now use Safari → Share → Add to Home Screen.",
            )}
          </p>
        )}

        <div className="mt-10 rounded-2xl border bg-card p-6 text-left">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone className="size-4 text-primary" />
            {t("Cyangwa shyira kuri Home Screen", "Or install from the browser")}
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>{t("Fungura amamaza.vercel.app/app muri Chrome", "Open amamaza.vercel.app/app in Chrome")}</li>
            <li className="flex flex-wrap items-center gap-1">
              {t("Kanda menu (⋮) → Install app / Add to Home screen", "Tap menu (⋮) → Install app / Add to Home screen")}
              <Share className="inline size-3.5" />
            </li>
            <li>{t("Amamara izagaragara nka app ku mugaragaro", "Amamara appears as an app on your home screen")}</li>
          </ol>
        </div>

        <Link to="/app" className="mt-8 inline-flex text-sm font-semibold text-primary">
          {t("Komeza muri browser", "Continue in the browser")} →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
