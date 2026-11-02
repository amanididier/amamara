import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Instagram, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Logo, LangSwitch, ThemeSwitch } from "@/components/brand";
import { usePrefs } from "@/lib/prefs";
import { site } from "@/config/site";

export function SiteHeader() {
  const { t } = usePrefs();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: t("Ahabanza", "Home") },
    { to: "/services", label: t("Ibyo dukora", "What we do") },
    { to: "/examples", label: t("Ingero z'amatangazo", "Ad examples") },
    { to: "/pricing", label: t("Ibiciro", "Pricing") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitch className="hidden sm:flex" />
          <ThemeSwitch />
          <Link to="/app" className="hidden px-3 text-sm font-semibold sm:block">
            {t("Injira", "Sign in")}
          </Link>
          <Link
            to="/app/create"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] sm:block"
          >
            {t("Tangira ubu", "Start now")}
          </Link>
          <button className="grid size-9 place-items-center md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t bg-background px-4 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-3 text-base font-medium">
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center justify-between">
            <LangSwitch />
            <Link to="/app" className="text-sm font-semibold">{t("Injira", "Sign in")}</Link>
          </div>
          <Link to="/app/create" className="mt-4 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground">
            {t("Tangira ubu", "Start now")}
          </Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = usePrefs();
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {t(
              "Amamaza ifasha ubucuruzi bwose mu Rwanda gukora amatangazo meza — video, flyer na banner — mu minota mike.",
              "Amamaza helps every business in Rwanda create great ads — videos, flyers and banners — in minutes.",
            )}
          </p>
          <p className="mt-3 text-sm font-semibold">{t(site.taglineRw, site.taglineEn)}</p>
          <div className="mt-5 flex gap-2">
            {[
              { href: site.social.instagram, Icon: Instagram, l: "Instagram" },
              { href: site.social.youtube, Icon: Youtube, l: "YouTube" },
            ].map(({ href, Icon, l }) => (
              <a key={l} href={href} aria-label={l} className="grid size-9 place-items-center rounded-full border hover:text-primary">
                <Icon className="size-4" />
              </a>
            ))}
            <a href={site.social.tiktok} className="grid h-9 place-items-center rounded-full border px-3 text-xs font-semibold hover:text-primary">TikTok</a>
          </div>
        </div>
        <div className="space-y-2.5 text-sm">
          <p className="font-semibold">Amamaza</p>
          <Link to="/services" className="block text-muted-foreground hover:text-foreground">{t("Ibyerekeye Amamaza", "About Amamaza")}</Link>
          <Link to="/pricing" className="block text-muted-foreground hover:text-foreground">{t("Ibibazo bikunze kubazwa", "FAQ")}</Link>
          <Link to="/examples" className="block text-muted-foreground hover:text-foreground">{t("Ingero", "Examples")}</Link>
          <span className="block text-muted-foreground">{t("Amategeko n'ibanga", "Terms & privacy")}</span>
        </div>
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">{t("Twandikire", "Contact")}</p>
          <p className="flex items-center gap-2"><Phone className="size-4" />{site.contact.phone}</p>
          <p className="flex items-center gap-2"><Mail className="size-4" />{site.contact.email}</p>
          <p className="flex items-center gap-2"><MapPin className="size-4" />{site.contact.address}</p>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Amamaza · Made in Kigali 🇷🇼
      </div>
    </footer>
  );
}
