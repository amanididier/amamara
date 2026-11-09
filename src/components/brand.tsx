import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type LogoVariant = "primary" | "white" | "icon";

const markSrc: Record<LogoVariant, string> = {
  primary: "/amamaza-mark-red.png", // red mark on light surfaces
  white: "/amamaza-mark-white.png", // white mark on red / dark surfaces
  icon: "/amamaza-icon.png", // white mark on red tile (app logo / favicon)
};

/** Amamara logo — exact brand mark in three variants. */
export function LogoMark({ variant = "icon", className }: { variant?: LogoVariant; className?: string }) {
  return (
    <img
      src={markSrc[variant]}
      alt="Amamara"
      className={cn("size-9 shrink-0 object-contain", variant === "icon" && "rounded-[22%]", className)}
    />
  );
}

export function Logo({
  className,
  variant = "icon",
  showWordmark = true,
}: {
  className?: string;
  variant?: LogoVariant;
  showWordmark?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label="Amamara home"
      className={cn("flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight", className)}
    >
      <LogoMark variant={variant} />
      {showWordmark && <span>amamara</span>}
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
