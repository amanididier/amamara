import { useState } from "react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Home, Sparkles, FolderOpen, Wallet, LifeBuoy, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LangSwitch, Logo, ThemeSwitch } from "@/components/brand";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Amamaza Studio" },
      { name: "description", content: "Create and manage your advertising projects in Amamaza Studio." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Amamaza Studio" },
      { property: "og:description", content: "Kora video, flyer na banner mu buryo bworoshye." },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const { t } = usePrefs();
  const [collapsed, setCollapsed] = useState(false);
  const nav = [
    { to: "/app", label: t("Ahabanza", "Home"), Icon: Home, exact: true },
    { to: "/app/create", label: t("Kurema itangazo", "Create ad"), Icon: Sparkles },
    { to: "/app/projects", label: t("Ibikorwa byanjye", "My ads"), Icon: FolderOpen },
    { to: "/app/wallet", label: t("Amafaranga", "Wallet"), Icon: Wallet },
  ] as const;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-sidebar p-3 transition-[width] md:flex", collapsed ? "w-[72px]" : "w-64")}>
        <div className="flex h-12 items-center justify-between px-2">
          {!collapsed && <Logo />}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="size-8 text-muted-foreground" aria-label={collapsed ? "Expand menu" : "Collapse menu"} title={collapsed ? "Expand menu" : "Collapse menu"}>
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>
        <nav className="mt-6 flex-1 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: "exact" in n }}
              className="relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground data-[status=active]:[&_svg]:text-primary"
              title={n.label}
            >
              <n.Icon className="size-5 shrink-0" />
              {!collapsed && n.label}
            </Link>
          ))}
        </nav>
        <div className={cn("flex items-center gap-2 px-1", collapsed && "flex-col")}>
          <Link to="/app" className="grid size-9 place-items-center rounded-full text-muted-foreground hover:text-foreground" title={t("Ubufasha", "Help")}>
            <LifeBuoy className="size-4" />
          </Link>
          <ThemeSwitch />
          {!collapsed && <LangSwitch />}
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:hidden">
          <Logo />
          <div className="flex items-center gap-2"><LangSwitch /><ThemeSwitch /></div>
        </header>
        <Outlet />
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {nav.map((n, i) =>
          i === 1 ? (
            <Link key={n.to} to={n.to} className="flex flex-col items-center justify-center py-2" aria-label={n.label}>
              <span className="-mt-6 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg glow-primary">
                <n.Icon className="size-6" />
              </span>
            </Link>
          ) : (
            <Link key={n.to} to={n.to} activeOptions={{ exact: "exact" in n }} className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground data-[status=active]:text-primary">
              <n.Icon className="size-5" />
              <span className="truncate">{n.label.split(" ")[0]}</span>
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
