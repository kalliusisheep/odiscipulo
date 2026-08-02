import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Crown,
  Shuffle,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { verseText } from "@/data/content";
import { SUPPORT_LESSONS, type SupportLesson } from "@/data/leader-support-content";
import { useApp } from "@/lib/app-context";

type Step = "estudo" | "fixar" | "aplicar";

// Embaralha um array sem alterar o original (Fisher–Yates simplificado).
function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function LeaderResources({ completedLessons }: { completedLessons?: number }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SupportLesson | null>(null);

  const openLesson = (lesson: SupportLesson) => setSelected(lesson);
  const closeDialog = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setSelected(null);
  };

  return (
    <>
      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Formação de liderança</h2>
        <Link
          to="/modulo/$id"
          params={{ id: "como-ser-lider" }}
          className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 p-4 transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <Crown className="h-5 w-5 text-white/90" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Módulo de liderança</span>
              <p className="mt-0.5 truncate font-semibold text-white/95">Como ser um líder</p>
              <p className="truncate text-xs text-white/60">10 trilhas para liderar à maneira de Cristo</p>
              {completedLessons !== undefined && (
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10 p-[2px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-300 to-indigo-200"
                      style={{ width: `${completedLessons * 10}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/70">{completedLessons}/10</span>
                </div>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </div>
        </Link>
        <p className="px-1 text-xs text-muted-foreground">Você está mesmo preparado para discipular/liderar alguém?</p>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">Apoio ao discipulado</h2>
        <button
          type="button"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="group relative block w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-black via-zinc-900 to-black p-4 text-left transition-all hover:scale-[1.01]"
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Biblioteca pastoral</span>
              <p className="mt-0.5 font-semibold text-white">Conteúdos para discípulos</p>
              <p className="truncate text-xs text-white/60">{SUPPORT_LESSONS.length} lições para conversas e acompanhamento</p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </div>
        </button>
        <p className="px-1 text-xs text-muted-foreground">Esses serão os módulos e trilhas que seus discipulados seguirão.</p>
      </section>

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {selected ? (
            <LessonFlow lesson={selected} onBack={() => setSelected(null)} />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Conteúdos para discípulos</DialogTitle>
                <DialogDescription>
                  Material de apoio bíblico que complementa a comunhão e o cuidado da igreja local.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                {SUPPORT_LESSONS.map((lesson) => (
                  <button
                    type="button"
                    key={lesson.id}
                    onClick={() => openLesson(lesson)}
                    className="flex items-center justify-between rounded-xl border border-border p-3 text-left hover:border-primary/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{lesson.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{lesson.verse.ref}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function LessonFlow({ lesson, onBack }: { lesson: SupportLesson; onBack: () => void }) {
  const { bibleVersion } = useApp();
  const [step, setStep] = useState<Step>("estudo");

  // ── Fixar: quiz ──────────────────────────────────────────────
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const quizCorrect = quizAnswer === lesson.quiz.correctIndex;

  // ── Fixar: relacione os termos (termo original ↔ significado) ─
  const meaningOptions = useMemo(() => shuffled(lesson.keywords.map((k, i) => i)), [lesson.id]);
  const [armedTerm, setArmedTerm] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [wrongPulse, setWrongPulse] = useState<number | null>(null);
  const allMatched = Object.keys(matches).length === lesson.keywords.length;

  const tryMatch = (termIndex: number, meaningIndex: number) => {
    if (termIndex === meaningIndex) {
      setMatches((prev) => ({ ...prev, [termIndex]: meaningIndex }));
      setArmedTerm(null);
    } else {
      setWrongPulse(meaningIndex);
      setTimeout(() => setWrongPulse(null), 500);
      setArmedTerm(null);
    }
  };

  const canAdvanceFixar = quizCorrect && allMatched;

  const resetAndBack = () => {
    setStep("estudo");
    setQuizAnswer(null);
    setMatches({});
    setArmedTerm(null);
    onBack();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={resetAndBack}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-surface"
          aria-label="Voltar para todos os temas"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: step === "estudo" ? "33%" : step === "fixar" ? "66%" : "100%" }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className={step === "estudo" ? "font-bold text-primary" : ""}>Estudo</span>
            <span className={step === "fixar" ? "font-bold text-primary" : ""}>Fixar</span>
            <span className={step === "aplicar" ? "font-bold text-primary" : ""}>Aplicar</span>
          </div>
        </div>
      </div>

      {step === "estudo" && (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tema</p>
            <h3 className="text-xl font-bold">{lesson.title}</h3>
          </div>

          <div className="card-elevated space-y-3 p-4">
            {lesson.intro.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{lesson.verse.ref}</p>
            <p className="scripture mt-2 text-base leading-relaxed">
              {verseText(lesson.verse, bibleVersion)}
            </p>
            {lesson.verse.originals && lesson.verse.originals.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                {lesson.verse.originals.map((o, i) => (
                  <p key={i} className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {o.word} <span className="italic">({o.translit})</span>:
                    </span>{" "}
                    {o.meaning}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="card-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Aprofundando</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{lesson.deepDive}</p>
          </div>

          <blockquote className="rounded-2xl border-l-4 border-l-ancient bg-ancient/5 p-4">
            <p className="scripture text-sm leading-relaxed">"{lesson.theologianQuote.text}"</p>
            <p className="mt-2 text-xs font-semibold text-ancient">
              — {lesson.theologianQuote.author}
              {lesson.theologianQuote.source ? `, ${lesson.theologianQuote.source}` : ""}
            </p>
          </blockquote>

          <button
            onClick={() => setStep("fixar")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow"
          >
            Continuar para Fixar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "fixar" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Fixar</h3>
          </div>

          <div className="card-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quiz</p>
            <p className="mt-1 text-sm font-medium">{lesson.quiz.question}</p>
            <div className="mt-3 space-y-2">
              {lesson.quiz.options.map((opt, i) => {
                const isChosen = quizAnswer === i;
                const isCorrectOpt = i === lesson.quiz.correctIndex;
                let cls = "border-border bg-surface hover:border-primary/40";
                if (quizAnswer !== null) {
                  if (isChosen && isCorrectOpt) cls = "border-success bg-success/15 text-success";
                  else if (isChosen) cls = "border-destructive bg-destructive/15 text-destructive";
                  else if (isCorrectOpt && !quizCorrect) cls = "border-success/40 bg-success/5";
                  else cls = "border-border bg-surface opacity-60";
                }
                return (
                  <button
                    key={i}
                    disabled={quizCorrect}
                    onClick={() => setQuizAnswer(i)}
                    className={`w-full rounded-xl border p-3 text-left text-sm font-medium transition-all ${cls}`}
                  >
                    <div className="flex items-center gap-2">
                      {quizAnswer !== null && isChosen && isCorrectOpt && <Check className="h-4 w-4" />}
                      {quizAnswer !== null && isChosen && !isCorrectOpt && <X className="h-4 w-4" />}
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && lesson.quiz.explanation && (
              <p className={`mt-3 rounded-xl p-3 text-xs ${quizCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                {quizCorrect ? "Correto — " : "Não é essa. "} {lesson.quiz.explanation}
              </p>
            )}
          </div>

          <div className="card-elevated p-4">
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Relacione os termos
              </p>
            </div>
            <p className="mt-1 text-sm font-medium">
              Toque em um termo original e depois no significado correspondente.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                {lesson.keywords.map((k, termIndex) => {
                  const isMatched = matches[termIndex] !== undefined;
                  const isArmed = armedTerm === termIndex;
                  return (
                    <button
                      key={termIndex}
                      disabled={isMatched}
                      onClick={() => setArmedTerm(termIndex)}
                      className={`w-full rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                        isMatched
                          ? "border-success bg-success/15 text-success"
                          : isArmed
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border bg-surface hover:border-primary/40"
                      }`}
                    >
                      {k.word}
                      <span className="block font-normal italic text-muted-foreground">({k.translit})</span>
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2">
                {meaningOptions.map((meaningIndex) => {
                  const alreadyUsed = Object.values(matches).includes(meaningIndex);
                  const isPulsingWrong = wrongPulse === meaningIndex;
                  return (
                    <button
                      key={meaningIndex}
                      disabled={alreadyUsed || armedTerm === null}
                      onClick={() => armedTerm !== null && tryMatch(armedTerm, meaningIndex)}
                      className={`w-full rounded-xl border p-2.5 text-left text-[11px] leading-snug transition-all ${
                        alreadyUsed
                          ? "border-success bg-success/15 text-success opacity-70"
                          : isPulsingWrong
                            ? "border-destructive bg-destructive/15 text-destructive"
                            : "border-border bg-surface hover:border-primary/40 disabled:opacity-40"
                      }`}
                    >
                      {lesson.keywords[meaningIndex].meaning}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              {Object.keys(matches).length} de {lesson.keywords.length} relacionados
            </p>
          </div>

          <button
            onClick={() => setStep("aplicar")}
            disabled={!canAdvanceFixar}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Continuar para Aplicar <ArrowRight className="h-4 w-4" />
          </button>
          {!canAdvanceFixar && (
            <p className="text-center text-[11px] text-muted-foreground">
              Acerte o quiz e relacione todos os termos para prosseguir.
            </p>
          )}
        </div>
      )}

      {step === "aplicar" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Aplicar</h3>
          </div>

          <div className="card-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Passo prático</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.application}</p>
          </div>

          <div className="card-elevated border-l-4 border-l-ancient p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">Desafio da semana</p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.weeklyChallenge}</p>
          </div>

          <div className="card-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Oração sugerida</p>
            <p className="mt-2 scripture text-base leading-relaxed">{lesson.prayer}</p>
          </div>

          <div className="card-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Pergunta de reflexão</p>
            <p className="mt-2 text-sm font-medium">{lesson.reflectionQuestion}</p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-2xl bg-primary/10 py-3 text-xs font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Lição concluída — {lesson.title}
          </div>

          <button
            onClick={resetAndBack}
            className="w-full rounded-2xl border border-border py-3 text-sm font-medium text-muted-foreground"
          >
            Voltar a todos os temas
          </button>
        </div>
      )}
    </div>
  );
}
