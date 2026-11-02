import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" aria-label="Amamaza home" className={cn("flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight", className)}>
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" role="img" aria-label="Amamaza mark">
        <path d="M5 33.5 17.3 6.8c1.1-2.4 4.4-2.4 5.5 0l5.1 11.1-5.5 3.1-2.4-5.1-8.2 17.6H5Z" fill="currentColor" className="text-primary" />
        <path d="M20.4 27.2 25 24.6l4.1 8.9H18.9l1.5-6.3Z" fill="currentColor" className="text-primary" />
        <path d="M27.5 13.1c2.4 1.6 3.8 4 3.8 6.9s-1.4 5.3-3.8 6.9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" className="text-primary" />
        <path d="M32.4 8.7c3.8 2.6 6 6.5 6 11.3s-2.2 8.7-6 11.3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="text-primary" />
      </svg>
      <span>amamaza</span>
    </Link>
  );
}
export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = usePrefs();
  return (
    <div className={cn("flex rounded-full border bg-card p-0.5 text-xs font-semibold", className)}>
      {(["rw", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "rounded-full px-2.5 py-1 uppercase transition-colors",
            lang === l ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={lang === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ThemeSwitch() {
  const { theme, toggleTheme, t } = usePrefs();
  return (
    <button
      onClick={toggleTheme}
      aria-label={t("Hindura ibara", "Toggle theme")}
      className="grid size-9 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
