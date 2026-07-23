import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { bibleStudies } from "@/data/estudos";
import { verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Minus,
  PartyPopper,
  Plus,
  Share2,
  Sparkles,
  Target,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/estudos/biblico/$id")({
  component: EstudoBiblicoPage,
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

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.fontSize;
    root.style.fontSize = `${FONT_SCALES[scaleIndex]}%`;
    return () => {
      root.style.fontSize = previous;
    };
  }, [scaleIndex]);

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

function EstudoBiblicoPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { bibleVersion } = useApp();
  const { celebrateActivity } = useCelebration();
  const study = useMemo(() => bibleStudies.find((s) => s.id === id), [id]);
  const [step, setStep] = useState<Step>("estudo");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const { scaleIndex, increase, decrease } = useReadingFontScale();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (!study) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Estudo não encontrado.</p>
        <Link to="/estudos" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  const total = study.quiz.length;
  const correctCount = Object.entries(answers).filter(
    ([i, v]) => v === study.quiz[Number(i)].correctIndex,
  ).length;
  const canAdvance = Object.keys(answers).length === total && correctCount === total;
  const pct = step === "estudo" ? 33 : step === "fixar" ? 66 : 100;
  const lessonId = `bible:${study.id}`;

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("lesson_progress").upsert(
        { user_id: u.user.id, lesson_id: lessonId, xp_gained: study.xp },
        { onConflict: "user_id,lesson_id" },
      );
      if (reflection.trim()) {
        await supabase.from("diary_entries").insert({
          user_id: u.user.id,
          lesson_id: lessonId,
          lesson_title: `Estudo Bíblico: ${study.title}`,
          question: study.reflectionQuestion,
          answer: reflection.trim(),
        });
      }
      const xpGained = 80;
      const { prevXp, newXp } = await awardXpAndStreak(u.user.id, xpGained);
      celebrateActivity({ prevXp, newXp, xp: xpGained });
    }
    setStep("done");
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-24 animate-slide-up">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => nav({ to: "/estudos" })} className="rounded-full p-2 text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className={step === "estudo" ? "font-bold text-primary" : ""}>Estudo</span>
            <span className={step === "fixar" ? "font-bold text-primary" : ""}>Fixar</span>
            <span className={step === "aplicar" ? "font-bold text-primary" : ""}>Aplicar</span>
          </div>
        </div>
        <FontSizeControls
          onIncrease={increase}
          onDecrease={decrease}
          disabled={{ min: scaleIndex === 0, max:
