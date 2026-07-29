import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lessonById, verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import { useReadingFontScale } from "@/hooks/use-reading-font-scale";
import { FontSizeControls } from "@/components/font-size-controls";
import { NarrationButton } from "@/components/NarrationButton";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Layers,
  Quote,
  Share2,
  Sparkles,
  Target,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/licao/$id")({
  component: LicaoPage,
});

type Step = "estudo" | "fixar" | "aplicar" | "done";

function LicaoPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { bibleVersion } = useApp();
  const { celebrateActivity } = useCelebration();
  const found = useMemo(() => lessonById(id), [id]);
  const [step, setStep] = useState<Step>("estudo");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const { scaleIndex, increase, decrease, contentZoomStyle } = useReadingFontScale();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const goBack = () => {
    void nav({ to: "/home" });
  };

  if (!found) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Lição não encontrada.</p>
        <Link to="/home" className="mt-4 inline-block text-primary underline">
          Voltar
        </Link>
      </div>
    );
  }

  const { lesson } = found;
  const total = lesson.quizzes.length;
  const correctCount = Object.entries(answers).filter(([i, v]) => v === lesson.quizzes[Number(i)].correctIndex).length;
  const canAdvance = Object.keys(answers).length === total && correctCount === total;
  const pct = step === "estudo" ? 33 : step === "fixar" ? 66 : 100;

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase
        .from("lesson_progress")
        .upsert(
          { user_id: u.user.id, lesson_id: lesson.id, xp_gained: lesson.xp },
          { onConflict: "user_id,lesson_id" },
        );
      if (reflection.trim()) {
        await supabase.from("diary_entries").insert({
          user_id: u.user.id,
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          question: lesson.reflectionQuestion,
          answer: reflection.trim(),
        });
      }
      const { prevXp, newXp } = await awardXpAndStreak(u.user.id, lesson.xp);
      celebrateActivity({ prevXp, newXp, xp: lesson.xp });
    }
    setStep("done");
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-24 animate-slide-up">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="rounded-full p-2 text-muted-foreground hover:bg-surface"
          aria-label="Voltar"
        >
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
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          +{lesson.xp} XP
        </span>
      </div>

      {step === "estudo" && (
        <div style={contentZoomStyle} className="space-y-5" data-tts-scope="licao">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <BookOpen className="h-5 w-5 shrink-0 text-primary" />
                <h1 className="truncate text-2xl font-bold" data-narrate>
                  {lesson.title}
                </h1>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <NarrationButton containerSelector='[data-tts-scope="licao"]' />
                <FontSizeControls scaleIndex={scaleIndex} onIncrease={increase} onDecrease={decrease} />
              </div>
            </div>
          </div>

          <div className="card-elevated space-y-3 p-5">
            {lesson.intro.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90" data-narrate>
                {p}
              </p>
            ))}
          </div>

          {lesson.verses.map((v) => (
            <div key={v.ref} className="rounded-2xl border border-ancient/30 bg-ancient/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                {v.ref} · {bibleVersion}
              </p>
              <p className="mt-2 scripture text-base leading-relaxed" data-narrate>
                {`"${verseText(v, bibleVersion)}"`}
              </p>
              {v.originals && v.originals.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-ancient/20 pt-3">
                  {v.originals.map((o, oi) => (
                    <div key={oi} className="text-xs">
                      <span className="ancient-text text-ancient">{o.word}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        ({o.translit}, {o.lang}) —{" "}
                      </span>
                      <span className="text-foreground/80">{o.meaning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {lesson.keywords.length > 0 && (
            <div className="rounded-2xl border border-ancient/30 bg-ancient/5 p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ancient">
                Palavras no idioma original
              </p>
              <div className="space-y-2">
                {lesson.keywords.map((o, oi) => (
                  <div key={oi} className="text-xs">
                    <span className="ancient-text text-sm text-ancient">{o.word}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      ({o.translit}, {o.lang}) —{" "}
                    </span>
                    <span className="text-foreground/80">{o.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Explicação</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90" data-narrate>
              {lesson.deepDive}
            </p>
          </div>

          <blockquote className="card-elevated border-l-4 border-l-ancient p-5">
            <Quote className="h-4 w-4 text-ancient" />
            <p className="mt-2 scripture text-base leading-relaxed text-ancient" data-narrate>
              {`"${lesson.theologianQuote.text}"`}
            </p>
            <footer className="mt-2 text-xs font-semibold text-ancient/80">
              — {lesson.theologianQuote.author}
              {lesson.theologianQuote.source ? `, ${lesson.theologianQuote.source}` : ""}
            </footer>
          </blockquote>

          {lesson.deepen && (
            <Link
              to="/licao/$id/aprofundar"
              params={{ id: lesson.id }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ancient/40 bg-ancient/5 py-3.5 text-sm font-semibold text-ancient transition-all hover:bg-ancient/10"
            >
              <Layers className="h-4 w-4" /> Aprofundar
            </Link>
          )}

          <button
            onClick={() => setStep("fixar")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow"
          >
            Continuar para Fixar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "fixar" && (
        <div style={contentZoomStyle} className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Fixar</h2>
            </div>
            <FontSizeControls scaleIndex={scaleIndex} onIncrease={increase} onDecrease={decrease} />
          </div>
          <p className="text-sm text-muted-foreground">Responda as perguntas — pode tentar novamente até acertar.</p>

          {lesson.quizzes.map((q, qi) => {
            const chosen = answers[qi];
            const answered = chosen !== undefined;
            const isCorrect = answered && chosen === q.correctIndex;
            return (
              <div key={qi} className="card-elevated p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pergunta {qi + 1} de {total}
                </p>
                <p className="mt-1 text-sm font-medium">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => {
                    const isThisChosen = chosen === i;
                    const optCorrect = i === q.correctIndex;
                    let cls = "border-border bg-surface hover:border-primary/40";
                    if (answered) {
                      if (isThisChosen && optCorrect) cls = "border-success bg-success/15 text-success";
                      else if (isThisChosen) cls = "border-destructive bg-destructive/15 text-destructive";
                      else if (optCorrect && !isCorrect) cls = "border-success/40 bg-success/5";
                      else cls = "border-border bg-surface opacity-60";
                    }
                    return (
                      <button
                        key={i}
                        disabled={isCorrect}
                        onClick={() => setAnswers((prev) => ({ ...prev, [qi]: i }))}
                        className={`w-full rounded-2xl border p-3 text-left text-sm font-medium transition-all ${cls}`}
                      >
                        <div className="flex items-center gap-2">
                          {answered && isThisChosen && optCorrect && <Check className="h-4 w-4" />}
                          {answered && isThisChosen && !optCorrect && <X className="h-4 w-4" />}
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {answered && q.explanation && (
                  <p
                    className={`mt-3 rounded-xl p-3 text-xs ${isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                  >
                    {isCorrect ? "Correto — " : "Não é essa. "} {q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          <div className="text-center text-xs text-muted-foreground">
            {correctCount} de {total} acertos
          </div>

          <button
            onClick={() => setStep("aplicar")}
            disabled={!canAdvance}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Continuar para Aplicar <ArrowRight className="h-4 w-4" />
          </button>
          {!canAdvance && (
            <p className="text-center text-[11px] text-muted-foreground">
              Responda todas corretamente para prosseguir.
            </p>
          )}
        </div>
      )}

      {step === "aplicar" && (
        <div style={contentZoomStyle} className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Aplicar</h2>
            </div>
            <FontSizeControls scaleIndex={scaleIndex} onIncrease={increase} onDecrease={decrease} />
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Aplicação prática</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.application}</p>
          </div>

          <div className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">Desafio da semana</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.weeklyChallenge}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Oração sugerida</p>
            <p className="mt-2 scripture text-base leading-relaxed">{lesson.prayer}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Pergunta de reflexão</p>
            <p className="mt-2 text-sm font-medium">{lesson.reflectionQuestion}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              placeholder="Escreva livremente… (sua resposta vai para o Mural → Meu Diário)"
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

      {step === "done" && (
        <div style={contentZoomStyle} className="flex flex-col items-center text-center">
          <img
            src="/sheep-celebration.gif"
            alt="Ovelha comemorando"
            className="h-32 w-32 rounded-full object-cover shadow-2xl shadow-primary/40"
          />
          <h2 className="mt-6 text-2xl font-bold">Lição concluída!</h2>
          <p className="mt-1 text-sm text-muted-foreground">{lesson.title}</p>
          <p className="mt-4 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary">+{lesson.xp} XP</p>
          <div className="mt-8 w-full max-w-xs rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
            <Sparkles className="mx-auto h-8 w-8 text-ancient" />
            <p className="mt-4 scripture text-center text-lg leading-snug">"{lesson.title}"</p>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">The Disciple</p>
          </div>
          <div className="mt-6 flex w-full flex-col gap-2">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
              <Share2 className="h-4 w-4" /> Compartilhar
            </button>
            <Link
              to="/home"
              className="rounded-2xl border border-border py-3 text-sm font-medium text-muted-foreground"
            >
              Voltar à Inicial
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
