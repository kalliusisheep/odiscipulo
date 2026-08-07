import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import type { BibleVersion } from "@/data/content";
import { startTranslationRuntime } from "@/lib/translation-runtime";
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
  if (value === "default" || value === "white" || value === "gray" || value === "blue" || value === "black" || value === "pink") {
    return value;
  }
  return "default";
}

function applyTheme(theme: AppTheme, language: AppLanguage) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.lang = language;
  root.classList.remove("light", "dark", "theme-default", "theme-white", "theme-gray", "theme-blue", "theme-black", "theme-pink");
  root.classList.add(`theme-${theme}`);
  root.classList.add(theme === "default" || theme === "black" || theme === "blue" || theme === "pink" ? "dark" : "light");
  root.style.colorScheme = theme === "default" || theme === "black" || theme === "blue" || theme === "pink" ? "dark" : "light";
  const pageCopy = {
    "pt-BR": { title: "Disciple — Discipulado cristão gamificado", description: "Trilhas de estudo, quizzes e um Mentor IA para crescer na fé um dia por vez." },
    en: { title: "Disciple — Gamified Christian discipleship", description: "Study paths, quizzes, and an AI Mentor to grow in faith one day at a time." },
    es: { title: "Disciple — Discipulado cristiano gamificado", description: "Rutas de estudio, cuestionarios y un Mentor IA para crecer en la fe cada día." },
  }[language];
  document.title = pageCopy.title;
  document.querySelector("meta[name=description]")?.setAttribute("content", pageCopy.description);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("aluno");
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>("NVI");
  const [mentorOpen, setMentorOpen] = useState(false);
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window === "undefined") return "pt-BR";
    const stored = window.localStorage.getItem("disciple.language");
    return isLanguage(stored) ? stored : "pt-BR";
  });
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "default";
    const storedTheme = normalizeTheme(window.localStorage.getItem("disciple.theme"));
    const explicitlySelected = window.localStorage.getItem("disciple.themeSelected") === "true";
    return storedTheme === "black" && !explicitlySelected ? "default" : storedTheme;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = window.localStorage.getItem("disciple.bibleVersion");
    if (v) setBibleVersion(v as BibleVersion);
    const m = window.localStorage.getItem("disciple.viewMode");
    if (m === "lider" || m === "aluno") setViewMode(m);
    // Idioma e tema já são restaurados nos inicializadores para evitar flash
    // e impedir que a navegação volte ao padrão visual.
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

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("disciple.language", language);
      window.localStorage.setItem("disciple.theme", theme);
    }
    applyTheme(theme, language);
  }, [language, theme]);

  useEffect(() => startTranslationRuntime(language), [language]);

  const setLanguage = (nextLanguage: AppLanguage) => setLanguageState(nextLanguage);
  const markThemeSelected = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("disciple.themeSelected", "true");
    }
  };

  const setTheme = (nextTheme: AppTheme) => {
    markThemeSelected();
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    markThemeSelected();
    setThemeState((current) =>
      current === "black" || current === "blue" || current === "pink" ? "white" : "black",
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
