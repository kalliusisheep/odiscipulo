import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lessonById } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { ArrowLeft, Check, X, Sparkles, PartyPopper, Share2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/licao/$id")({
  component: LicaoPage,
});

type Step = "intro" | "quiz" | "reflection" | "done";

function LicaoPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { bibleVersion } = useApp();
  const found = useMemo(() => lessonById(id), [id]);
  const [step, setStep] = useState<Step>("intro");
  const [answer, setAnswer] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (!found) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Lição não encontrada.</p>
        <Link to="/home" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  const { lesson } = found;

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("lesson_progress").upsert(
        { user_id: u.user.id, lesson_id: lesson.id, xp_gained: lesson.xp },
        { onConflict: "user_id,lesson_id" },
      );
      if (reflection.trim()) {
        await supabase.from("diary_entries").insert({
          user_id: u.user.id,
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          question: lesson.reflection.question,
          answer: reflection.trim(),
        });
      }
      // atualizar xp e streak
      const { data: p } = await supabase.from("profiles").select("xp, streak, last_activity_date").eq("id", u.user.id).maybeSingle();
      const today = new Date().toISOString().slice(0, 10);
      const last = p?.last_activity_date ?? null;
      const diff = last ? Math.floor((new Date(today).getTime() - new Date(last).getTime()) / 86400000) : null;
      const newStreak = diff === null ? 1 : diff === 0 ? (p?.streak ?? 1) : diff === 1 ? (p?.streak ?? 0) + 1 : 1;
      await supabase.from("profiles").update({
        xp: (p?.xp ?? 0) + lesson.xp,
        streak: newStreak,
        last_activity_date: today,
      }).eq("id", u.user.id);
    }
    setStep("done");
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-8 animate-slide-up">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => nav({ to: "/home" })} className="rounded-full p-2 text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: step === "intro" ? "33%" : step === "quiz" ? "66%" : "100%" }}
            />
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">+{lesson.xp} XP</span>
      </div>

      {step === "intro" && (
        <div className="space-y-5">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.intro}</p>

          {lesson.verses.map((v) => (
            <div key={v.ref} className="card-elevated p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{v.ref} · {bibleVersion}</p>
              <p className="mt-2 scripture text-lg text-foreground/90">"{v.text}"</p>
              {v.originals && v.originals.length > 0 && (
                <div className="mt-4 rounded-2xl border border-ancient/30 bg-ancient/10 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">Línguas originais</p>
                  <ul className="mt-2 space-y-2">
                    {v.originals.map((o, i) => (
                      <li key={i} className="text-sm">
                        <span className="ancient-text text-lg">{o.word}</span>
                        <span className="ml-2 text-xs text-ancient/80">({o.translit}, {o.lang})</span>
                        <p className="text-xs text-muted-foreground">{o.meaning}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Explicação</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.explanation}</p>
          </div>

          <blockquote className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="scripture text-base leading-relaxed text-ancient">"{lesson.theologianQuote.text}"</p>
            <footer className="mt-2 text-xs font-semibold text-ancient/80">— {lesson.theologianQuote.author}</footer>
          </blockquote>

          <button
            onClick={() => setStep("quiz")}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow"
          >
            Prosseguir para o Quiz
          </button>
        </div>
      )}

      {step === "quiz" && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Quiz da lição</h2>
          <p className="text-sm">{lesson.quiz.question}</p>
          <div className="space-y-2">
            {lesson.quiz.options.map((opt, i) => {
              const isCorrect = i === lesson.quiz.correctIndex;
              const chosen = answer === i;
              const state =
                answer === null ? "idle" : chosen ? (isCorrect ? "right" : "wrong") : isCorrect && answer !== null ? "hint" : "dim";
              return (
                <button
                  key={i}
                  disabled={answer !== null && answer === lesson.quiz.correctIndex}
                  onClick={() => setAnswer(i)}
                  className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition-all ${
                    state === "right"
                      ? "border-success bg-success/15 text-success"
                      : state === "wrong"
                      ? "border-destructive bg-destructive/15 text-destructive"
                      : state === "hint"
                      ? "border-success/40 bg-success/5"
                      : "border-border bg-surface hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {state === "right" && <Check className="h-4 w-4" />}
                    {state === "wrong" && <X className="h-4 w-4" />}
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {answer !== null && answer !== lesson.quiz.correctIndex && (
            <p className="text-sm text-destructive">Não é essa. Tente novamente.</p>
          )}
          {answer === lesson.quiz.correctIndex && lesson.quiz.explanation && (
            <p className="rounded-xl bg-success/10 p-3 text-sm text-success">{lesson.quiz.explanation}</p>
          )}
          <button
            onClick={() => setStep("reflection")}
            disabled={answer !== lesson.quiz.correctIndex}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Prosseguir para Reflexão
          </button>
        </div>
      )}

      {step === "reflection" && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Reflexão</h2>
          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Resumo</p>
            <p className="mt-2 text-sm">{lesson.reflection.summary}</p>
          </div>
          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Oração sugerida</p>
            <p className="mt-2 scripture text-sm leading-relaxed">{lesson.reflection.prayer}</p>
          </div>
          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Pergunta de reflexão</p>
            <p className="mt-2 text-sm font-medium">{lesson.reflection.question}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              placeholder="Escreva livremente… (será salvo no seu Diário)"
              className="mt-3 w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => void finish()}
            disabled={saving}
            className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            {saving ? "Salvando…" : "Concluir lição"}
          </button>
        </div>
      )}

      {step === "done" && <DoneScreen title={lesson.title} xp={lesson.xp} />}
    </div>
  );
}

function DoneScreen({ title, xp }: { title: string; xp: number }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-2xl shadow-primary/40">
          <PartyPopper className="h-12 w-12 text-primary-foreground" />
        </div>
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-ancient"
            style={{
              animation: `confetti-pop 1.2s ease-out ${i * 0.1}s forwards`,
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-50px)`,
            }}
          />
        ))}
      </div>
      <h2 className="mt-6 text-2xl font-bold">Lição concluída!</h2>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      <p className="mt-4 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary">+{xp} XP</p>

      <div className="mt-8 w-full max-w-xs rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
        <Sparkles className="mx-auto h-8 w-8 text-ancient" />
        <p className="mt-4 scripture text-center text-lg leading-snug">"{title}"</p>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">The Disciple</p>
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
          <Share2 className="h-4 w-4" /> Compartilhar
        </button>
        <Link to="/home" className="rounded-2xl border border-border py-3 text-sm font-medium text-muted-foreground">
          Voltar às trilhas
        </Link>
      </div>
    </div>
  );
}
