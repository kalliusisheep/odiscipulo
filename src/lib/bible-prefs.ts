import { useEffect, useState } from "react";

const TRANSLATION_KEY = "disciple.bible.translation";
const FONT_KEY = "disciple.bible.fontScale";
const THEME_KEY = "disciple.bible.theme";

export const BIBLE_FONT_SCALES = [15, 17, 19, 21, 24];

export function useBiblePrefs() {
  const [translation, setTranslationState] = useState("NVIPT");
  const [fontIndex, setFontIndex] = useState(1);
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const t = window.localStorage.getItem(TRANSLATION_KEY);
    if (t) setTranslationState(t);
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") setThemeState(storedTheme);
    const f = Number(window.localStorage.getItem(FONT_KEY));
    if (!Number.isNaN(f) && f >= 0 && f < BIBLE_FONT_SCALES.length) setFontIndex(f);
  }, []);

  const setTranslation = (code: string) => {
    setTranslationState(code);
    window.localStorage.setItem(TRANSLATION_KEY, code);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    window.localStorage.setItem(THEME_KEY, next);
  };

  const setFont = (i: number) => {
    const next = Math.min(Math.max(i, 0), BIBLE_FONT_SCALES.length - 1);
    setFontIndex(next);
    window.localStorage.setItem(FONT_KEY, String(next));
  };

  return {
    translation,
    setTranslation,
    fontIndex,
    setFont,
    fontSize: BIBLE_FONT_SCALES[fontIndex],
    theme,
    toggleTheme,
  };
}
