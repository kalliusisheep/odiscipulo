import { useState, useEffect } from "react";

export const FONT_SCALES = [87.5, 100, 112.5, 125, 137.5];
const FONT_SCALE_KEY = "disciple-font-scale-index";

export function useReadingFontScale() {
  const [scaleIndex, setScaleIndex] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem(FONT_SCALE_KEY);
    if (saved !== null) {
      const idx = Number(saved);
      if (!Number.isNaN(idx) && idx >= 0 && idx < FONT_SCALES.length) {
        setScaleIndex(idx);
      }
    }
  }, []);

  const increase = () => {
    setScaleIndex((i) => {
      const next = Math.min(i + 1, FONT_SCALES.length - 1);
      localStorage.setItem(FONT_SCALE_KEY, String(next));
      return next;
    });
  };

  const decrease = () => {
    setScaleIndex((i) => {
      const next = Math.max(i - 1, 0);
      localStorage.setItem(FONT_SCALE_KEY, String(next));
      return next;
    });
  };

  const contentZoomStyle = { zoom: `${FONT_SCALES[scaleIndex]}%` } as React.CSSProperties;

  return { scaleIndex, increase, decrease, contentZoomStyle };
}
