import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { BibleVersion } from "@/data/content";

type ViewMode = "aluno" | "lider";

type AppCtx = {
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  bibleVersion: BibleVersion;
  setBibleVersion: (v: BibleVersion) => void;
  mentorOpen: boolean;
  setMentorOpen: (b: boolean) => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("aluno");
  const [bibleVersion, setBibleVersion] = useState<BibleVersion>("NVI");
  const [mentorOpen, setMentorOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = window.localStorage.getItem("disciple.bibleVersion");
    if (v) setBibleVersion(v as BibleVersion);
    const m = window.localStorage.getItem("disciple.viewMode");
    if (m === "lider" || m === "aluno") setViewMode(m);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("disciple.bibleVersion", bibleVersion);
  }, [bibleVersion]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("disciple.viewMode", viewMode);
  }, [viewMode]);

  return (
    <Ctx.Provider value={{ viewMode, setViewMode, bibleVersion, setBibleVersion, mentorOpen, setMentorOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};
