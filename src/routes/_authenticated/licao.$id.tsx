import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lessonById, verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { useCelebration } from "@/lib/celebration";
import { awardXpAndStreak } from "@/lib/progress";
import { useReadingFontScale } from "@/hooks/use-reading-font-scale";
import { FontSizeControls } from "@/components/font-size-controls";
import { ArrowLeft, Check, X, Sparkles, Share2, ArrowRight, BookOpen, Brain, Target, ChevronRight, Layers } from "lucide-react";

export const Route = createFileRoute("/_authenticated/licao/$id")({
  component: LicaoPage,
});

type Step = "estudo" | "fixar" | "aplicar" | "done";

function hasDeepenContent(
  deepen: NonNullable<ReturnType<typeof lessonById>>["lesson"]["deepen"],
): boolean {
  if (!deepen) return false;
  return !!(
    deepen.historicalContext ||
    deepen.exegeticalNotes ||
    deepen.theologicalDebate ||
    deepen.secondQuote ||
    (deepen.additionalVerses && deepen.additionalVerses.length > 0) ||
    (deepen.additionalKeywords && deepen.additionalKeywords.length > 0)
  );
}

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
  const fontControlsProps = {
    scaleIndex,
    onIncrease: increase,
    onDecrease: decrease,
  };

  useEffect(() => {
    if (step === "estudo") {
      const key = `licao-scroll-${id}`;
      const raw = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      if (raw !== null) {
        try {
          const { y, t } = JSON.parse(raw) as { y: number; t: number };
          // Only honor a saved scroll position if it was set moments ago
          // (i.e. we really did just come back from "Aprofundar"). This
          // prevents a stale/leftover value from an earlier, unrelated
          // visit from ever hijacking a fresh page load.
          const isFresh = Date.now() - t < 15000;
          if (isFresh && Number.isFinite(y)) {
            requestAnimationFrame(() => window.scrollTo(0, y));
            return;
          }
        } catch {
          // Malformed or legacy value — ignore and fall through to top.
        }
      }
    }
    window.scrollTo(0, 0);
  }, [step, id]);

  if (!found) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <p>Lição não encontrada.</p>
        <Link to="/home" className="mt-4 inline-block text-primary underline">Voltar</Link>
      </div>
    );
  }

  const { lesson, module } = found;

  const goBack = () => {
    void nav({ to: "/modulo/$id", params: { id: module.id } });
  };

  const openDeepen = () => {
    sessionStorage.setItem(
      `licao-scroll-${id}`,
      JSON.stringify({ y: window.scrollY, t: Date.now() }),
    );
    void nav({ to: "/licao/$id/aprofundar", params: { id } });
  };
  const totalQuiz = lesson.quizzes.length;
  const correctCount = Object.entries(answers).filter(
    ([i, v]) => v === lesson.quizzes[Number(i)].correctIndex,
  ).length;
  const allAnswered = Object.keys(answers).length === totalQuiz;
  const allCorrect = correctCount === totalQuiz;
  const canAdvanceFixar = allAnswered && allCorrect;

  const progressPct =
    step === "estudo" ? 33 : step === "fixar" ? 66 : 100;

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const baseXp = 100;
    const perfectBonus = allCorrect ? 20 : 0;
    const xpGained = baseXp + perfectBonus;
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("lesson_progress").upsert(
        { user_id: u.user.id, lesson_id: lesson.id, xp_gained: xpGained },
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
      const { prevXp, newXp } = await awardXpAndStreak(u.user.id, xpGained);
      celebrateActivity({ prevXp, newXp, xp: xpGained });
    }
    setStep("done");
    setSaving(false);
  };


  return (
    <div className="mx-auto max-w-lg px-4 pt-4 pb-24 animate-slide-up">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={goBack} className="rounded-full p-2 text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className={step === "estudo" ? "font-bold text-primary" : ""}>Estudo</span>
            <span className={step === "fixar" ? "font-bold text-primary" : ""}>Fixar</span>
            <span className={step === "aplicar" ? "font-bold text-primary" : ""}>Aplicar</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">+{lesson.xp} XP</span>
      </div>

      {step === "estudo" && (
        <div style={contentZoomStyle} className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <BookOpen className="h-5 w-5 shrink-0 text-primary" />
              <h1 className="truncate text-2xl font-bold">{lesson.title}</h1>
            </div>
            <FontSizeControls {...fontControlsProps} />
          </div>

          {/* 1. Introdução (núcleo) */}
          <section className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Introdução ao tópico</p>
            <div className="mt-2 space-y-3 text-sm leading-relaxed">
              {lesson.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* 2. Passagens bíblicas (núcleo) */}
          <section className="space-y-3">
            <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Passagens bíblicas ({bibleVersion})
            </p>
            {lesson.verses.map((v) => (
              <div key={v.ref} className="card-elevated p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {v.ref} · {bibleVersion}
                </p>
                <p className="mt-2 scripture text-lg text-foreground/90">"{verseText(v, bibleVersion)}"</p>
              </div>
            ))}
          </section>

          {/* 3. Palavra(s)-chave no idioma original (núcleo) */}
          <section className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
              Palavra-chave no idioma original
            </p>
            <ul className="mt-3 space-y-3">
              {lesson.keywords.map((o, i) => (
                <li key={i} className="rounded-2xl border border-ancient/20 bg-ancient/5 p-3">
                  <div className="flex items-baseline gap-2">
                    <span className="ancient-text text-xl text-ancient">{o.word}</span>
                    <span className="text-xs text-ancient/80">({o.translit}, {o.lang})</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/80">{o.meaning}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Ensino central (núcleo) */}
          <section className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Aprofundamento e reflexão</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.deepDive}</p>
          </section>

          <blockquote className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="scripture text-base leading-relaxed text-ancient">"{lesson.theologianQuote.text}"</p>
            <footer className="mt-2 text-xs font-semibold text-ancient/80">— {lesson.theologianQuote.author}</footer>
            {lesson.theologianQuote.source && (
              <p className="mt-1 text-[10px] text-muted-foreground">{lesson.theologianQuote.source}</p>
            )}
          </blockquote>

          {/* 5. Aprofundar (opcional — abre em tela própria) */}
          {hasDeepenContent(lesson.deepen) && (
            <button
              type="button"
              onClick={openDeepen}
              className="flex w-full items-center justify-between gap-2 rounded-2xl border border-ancient/30 bg-ancient/5 p-4 text-left transition-colors hover:bg-ancient/10"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-ancient" />
                <span className="text-sm font-bold text-ancient">Aprofundar</span>
                <span className="text-[10px] uppercase tracking-wider text-ancient/70">
                  contexto, exegese e mais
                </span>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-ancient" />
            </button>
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
            <FontSizeControls {...fontControlsProps} />
          </div>
          <p className="text-sm text-muted-foreground">
            Responda as perguntas abaixo. Você pode tentar novamente até acertar.
          </p>

          {lesson.quizzes.map((q, qi) => {
            const chosen = answers[qi];
            const isAnswered = chosen !== undefined;
            const isCorrect = isAnswered && chosen === q.correctIndex;
            return (
              <div key={qi} className="card-elevated p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pergunta {qi + 1} de {totalQuiz}
                </p>
                <p className="mt-1 text-sm font-medium">{q.question}</p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt, i) => {
                    const isThisChosen = chosen === i;
                    const optIsCorrect = i === q.correctIndex;
                    let cls = "border-border bg-surface hover:border-primary/40";
                    if (isAnswered) {
                      if (isThisChosen && optIsCorrect) cls = "border-success bg-success/15 text-success";
                      else if (isThisChosen && !optIsCorrect) cls = "border-destructive bg-destructive/15 text-destructive";
                      else if (optIsCorrect && !isCorrect) cls = "border-success/40 bg-success/5";
                      else cls = "border-border bg-surface opacity-60";
                    }
                    return (
                      <button
                        key={i}
                        disabled={isCorrect}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [qi]: i }))
                        }
                        className={`w-full rounded-2xl border p-3 text-left text-sm font-medium transition-all ${cls}`}
                      >
                        <div className="flex items-center gap-2">
                          {isAnswered && isThisChosen && optIsCorrect && <Check className="h-4 w-4" />}
                          {isAnswered && isThisChosen && !optIsCorrect && <X className="h-4 w-4" />}
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {isAnswered && q.explanation && (
                  <p
                    className={`mt-3 rounded-xl p-3 text-xs ${
                      isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {isCorrect ? "Correto — " : "Não é essa. "} {q.explanation}
                  </p>
                )}
              </div>
            );
          })}

          <div className="text-center text-xs text-muted-foreground">
            {correctCount} de {totalQuiz} acertos
          </div>

          <button
            onClick={() => setStep("aplicar")}
            disabled={!canAdvanceFixar}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Continuar para Aplicar <ArrowRight className="h-4 w-4" />
          </button>
          {!canAdvanceFixar && (
            <p className="text-center text-[11px] text-muted-foreground">
              Responda todas as perguntas corretamente para prosseguir.
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
            <FontSizeControls {...fontControlsProps} />
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Aplicação prática</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.application}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Oração sugerida</p>
            <p className="mt-2 scripture text-base leading-relaxed">{lesson.prayer}</p>
          </div>

          <div className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">Desafio da semana</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.weeklyChallenge}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Pergunta de reflexão</p>
            <p className="mt-2 text-sm font-medium">{lesson.reflectionQuestion}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              placeholder="Escreva livremente… (sua resposta será salva no Mural → Meu Diário)"
              className="mt-3 w-full resize-none rounded-xl border border-border bg-input p-3 text-sm outline-none focus:border-primary"
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              Ao concluir, esta resposta será registrada no seu Diário com o título da lição e a data.
            </p>
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

      {step === "done" && <DoneScreen title={lesson.title} xp={lesson.xp} moduleId={module.id} />}
    </div>
  );
}

function DoneScreen({ title, xp, moduleId }: { title: string; xp: number; moduleId: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full shadow-2xl shadow-primary/40">
          <img src="/sheep-party.jpeg" alt="Ovelha comemorando" className="h-full w-full object-cover" />
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

      <div className="mt-8 w-full max-w-xs mx-auto rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
        <Sparkles className="mx-auto h-8 w-8 text-ancient" />
        <p className="mt-4 scripture text-center text-lg leading-snug">"{title}"</p>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">O Discípulo</p>
      </div>

      <div className="mt-6 flex w-full max-w-xs mx-auto flex-col gap-2">
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground">
          <Share2 className="h-4 w-4" /> Compartilhar
        </button>
        <Link
          to="/modulo/$id"
          params={{ id: moduleId }}
          className="rounded-2xl border border-border py-3 text-sm font-medium text-muted-foreground"
        >
          Voltar às trilhas
        </Link>
      </div>
    </div>
  );
}
