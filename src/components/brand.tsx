import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "white";

/**
 * Amamaza logo — viral radial mark.
 * - variant="primary" (default): red mark — use inside the app / on light surfaces
 * - variant="white": white mark — use on red brand areas, dark headers, or app icons
 */
export function Logo({
  className,
  variant = "primary",
  showWordmark = true,
}: {
  className?: string;
  variant?: LogoVariant;
  showWordmark?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label="Amamaza home"
      className={cn(
        "flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "size-9 shrink-0",
          variant === "white" ? "text-white" : "text-primary",
        )}
        role="img"
        aria-label="Amamaza mark"
      >
        <path d="M48.9,41.1 Q43.9,22.7 50.0,6.0 Q56.1,22.7 51.1,41.1 Z" fill="currentColor" />
        <path d="M53.5,41.7 Q58.4,23.3 72.0,11.9 Q69.0,29.4 55.4,42.8 Z" fill="currentColor" />
        <path d="M57.2,44.6 Q70.6,31.0 88.1,28.0 Q76.7,41.6 58.3,46.5 Z" fill="currentColor" />
        <path d="M58.9,48.9 Q77.3,43.9 94.0,50.0 Q77.3,56.1 58.9,51.1 Z" fill="currentColor" />
        <path d="M58.3,53.5 Q76.7,58.4 88.1,72.0 Q70.6,69.0 57.2,55.4 Z" fill="currentColor" />
        <path d="M55.4,57.2 Q69.0,70.6 72.0,88.1 Q58.4,76.7 53.5,58.3 Z" fill="currentColor" />
        <path d="M51.1,58.9 Q56.1,77.3 50.0,94.0 Q43.9,77.3 48.9,58.9 Z" fill="currentColor" />
        <path d="M46.5,58.3 Q41.6,76.7 28.0,88.1 Q31.0,70.6 44.6,57.2 Z" fill="currentColor" />
        <path d="M42.8,55.4 Q29.4,69.0 11.9,72.0 Q23.3,58.4 41.7,53.5 Z" fill="currentColor" />
        <path d="M41.1,51.1 Q22.7,56.1 6.0,50.0 Q22.7,43.9 41.1,48.9 Z" fill="currentColor" />
        <path d="M41.7,46.5 Q23.3,41.6 11.9,28.0 Q29.4,31.0 42.8,44.6 Z" fill="currentColor" />
        <path d="M44.6,42.8 Q31.0,29.4 28.0,11.9 Q41.6,23.3 46.5,41.7 Z" fill="currentColor" />
      </svg>
      {showWordmark && <span>amamaza</span>}
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
