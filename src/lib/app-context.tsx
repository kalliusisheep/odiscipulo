import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { BibleVersion } from "@/data/content";
import {
  type AppLanguage,
  type AppTheme,
  type I18nKey,
  translate,
} from "@/lib/i18n";

type ViewMode = "aluno" | "lider";

type AppCtx = {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  bibleVersion: BibleVersion;
  setBibleVersion: (v: BibleVersion) => void;
  mentorOpen: boolean;
  setMentorOpen: (b: boolean) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  t: (key: I18nKey) => string;
};

const Ctx = createContext<AppCtx | null>(null);

function isLanguage(value: string | null): value is AppLanguage {
  return value === "pt-BR" || value === "en" || value === "es";
}

function normalizeTheme(value: string | null): AppTheme {
  if (value === "light") return "white";
  if (value === "dark") return "black";
  if (value === "white" || value === "gray" || value === "black" || value === "pink") {
    return value;
  }
  return "black";
}

function applyTheme(theme: AppTheme, language: AppLanguage) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.lang = language;
  root.classList.remove("light", "dark", "theme-white", "theme-gray", "theme-black", "theme-pink");
  root.classList.add(`theme-${theme}`);
  root.classList.add(theme === "black" || theme === "pink" ? "dark" : "light");
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("aluno");
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>("NVI");
  const [mentorOpen, setMentorOpen] = useState(false);
  const [language, setLanguageState] = useState<AppLanguage>("pt-BR");
  const [theme, setThemeState] = useState<AppTheme>("black");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = window.localStorage.getItem("disciple.bibleVersion");
    if (v) setBibleVersion(v as BibleVersion);
    const m = window.localStorage.getItem("disciple.viewMode");
    if (m === "lider" || m === "aluno") setViewMode(m);
    const storedLanguage = window.localStorage.getItem("disciple.language");
    if (isLanguage(storedLanguage)) setLanguageState(storedLanguage);
    setThemeState(normalizeTheme(window.localStorage.getItem("disciple.theme")));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("disciple.bibleVersion", bibleVersion);
    }
  }, [bibleVersion]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("disciple.viewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("disciple.language", language);
    }
    applyTheme(theme, language);
  }, [language, theme]);

  const setLanguage = (nextLanguage: AppLanguage) => setLanguageState(nextLanguage);
  const setTheme = (nextTheme: AppTheme) => setThemeState(nextTheme);
  const toggleTheme = () => {
    setThemeState((current) =>
      current === "black" || current === "pink" ? "white" : "black",
    );
  };
  const t = (key: I18nKey) => translate(language, key);

  return (
    <Ctx.Provider
      value={{
        viewMode,
        setViewMode,
        bibleVersion,
        setBibleVersion,
        mentorOpen,
        setMentorOpen,
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};
