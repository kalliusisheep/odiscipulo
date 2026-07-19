import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { BibleVersion } from "@/data/content";

type ViewMode = "aluno" | "lider";
type Theme = "dark" | "light";

type AppCtx = {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  bibleVersion: BibleVersion;
  setBibleVersion: (v: BibleVersion) => void;
  mentorOpen: boolean;
  setMentorOpen: (b: boolean) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("aluno");
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>("NVI");
  const [mentorOpen, setMentorOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = window.localStorage.getItem("disciple.bibleVersion");
    if (v) setBibleVersion(v as BibleVersion);
    const m = window.localStorage.getItem("disciple.viewMode");
    if (m === "lider" || m === "aluno") setViewMode(m);
    const t = window.localStorage.getItem("disciple.theme");
    if (t === "light" || t === "dark") setTheme(t);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("disciple.bibleVersion", bibleVersion);
  }, [bibleVersion]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("disciple.viewMode", viewMode);
  }, [viewMode]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("disciple.theme", theme);
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Ctx.Provider
      value={{
        viewMode,
        setViewMode,
        bibleVersion,
        setBibleVersion,
        mentorOpen,
        setMentorOpen,
        theme,
        setTheme,
        toggleTheme,
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
