import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-display text-lg font-bold", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M8 5.5v13l10-6.5z" />
        </svg>
      </span>
      amamaza
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
