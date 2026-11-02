import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "white";

/**
 * Amamaza logo.
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
  const markSrc = variant === "white" ? "/amamaza-mark-white.png" : "/amamaza-mark-red.png";

  return (
    <Link
      to="/"
      aria-label="Amamaza home"
      className={cn(
        "flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight",
        className,
      )}
    >
      <img
        src={markSrc}
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0 object-contain"
        aria-hidden
      />
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
