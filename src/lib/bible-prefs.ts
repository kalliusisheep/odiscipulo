import { useEffect, useState } from "react";

const TRANSLATION_KEY = "disciple.bible.translation";
const FONT_KEY = "disciple.bible.fontScale";

export const BIBLE_FONT_SCALES = [15, 17, 19, 21, 24];

export function useBiblePrefs() {
  const [translation, setTranslationState] = useState("ARC09");
  const [fontIndex, setFontIndex] = useState(1);

  useEffect(() => {
    const t = window.localStorage.getItem(TRANSLATION_KEY);
    if (t) setTranslationState(t);
    const f = Number(window.localStorage.getItem(FONT_KEY));
    if (!Number.isNaN(f) && f >= 0 && f < BIBLE_FONT_SCALES.length) setFontIndex(f);
  }, []);

  const setTranslation = (code: string) => {
    setTranslationState(code);
    window.localStorage.setItem(TRANSLATION_KEY, code);
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
  };
}
