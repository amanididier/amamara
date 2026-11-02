import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "rw" | "en";
export type Theme = "dark" | "light";

interface Prefs {
  lang: Lang;
  theme: Theme;
  setLang: (l: Lang) => void;
  toggleTheme: () => void;
  /** t("Kinyarwanda", "English") — Kinyarwanda first. */
  t: (rw: string, en: string) => string;
}

const Ctx = createContext<Prefs | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("rw");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const l = localStorage.getItem("amamaza-lang") as Lang | null;
    const th = localStorage.getItem("amamaza-theme") as Theme | null;
    if (l) setLangState(l);
    if (th) setTheme(th);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.lang = lang;
  }, [theme, lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("amamaza-lang", l);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((p) => {
      const n = p === "dark" ? "light" : "dark";
      localStorage.setItem("amamaza-theme", n);
      return n;
    });
  }, []);
  const t = useCallback((rw: string, en: string) => (lang === "rw" ? rw : en), [lang]);

  return <Ctx.Provider value={{ lang, theme, setLang, toggleTheme, t }}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePrefs must be inside PrefsProvider");
  return c;
}
