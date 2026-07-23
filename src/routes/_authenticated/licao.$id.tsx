import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lessonById, verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import { ArrowLeft, Check, X, Sparkles, PartyPopper, Share2, ArrowRight, BookOpen, Brain, Target, Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/licao/$id")({
  component: LicaoPage,
});

type Step = "estudo" | "fixar" | "aplicar" | "done";

const FONT_SCALES = [87.5, 100, 112.5, 125, 137.5];
const FONT_SCALE_KEY = "disciple-font-scale-index";

function useReadingFontScale() {
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

  return { scaleIndex, increase, decrease };
}

function FontSizeControls({ onIncrease, onDecrease, disabled }: { onIncrease: () => void; onDecrease: () => void; disabled: { min: boolean; max: boolean } }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled.min}
        aria-label="Diminuir fonte"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background disabled:opacity-30"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="px-0.5 text-[11px] font-bold text-muted-foreground">A</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled.max}
        aria-label="Aumentar fonte"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background disabled:opacity-30"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function LicaoPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { bibleVersion } = useApp();
  const { celebrateActivity } = useCelebration();
  const found = useMemo(() => lessonById(id), [id]);
  const [step, setStep] =
