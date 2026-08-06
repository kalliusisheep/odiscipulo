import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lessonById, verseText } from "@/data/content";
import { useApp } from "@/lib/app-context";
import { useCelebration } from "@/lib/celebration";
import { useMascot, trailCompletionLine } from "@/lib/mascot";
import { HighlightsProvider, HighlightedText } from "@/components/notes/HighlightsProvider";
import { awardProgressXp } from "@/lib/progress";
import { logLessonCompletionToFeed } from "@/lib/feed";
import { useReadingFontScale } from "@/hooks/use-reading-font-scale";
import { FontSizeControls } from "@/components/font-size-controls";
import { NarrationButton } from "@/components/NarrationButton";
import { ShareLessonButton } from "@/components/ShareLessonButton";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Layers,
  Quote,
  Sparkles,
  Target,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/licao/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    modulo: typeof search.modulo === "string" ? search.modulo : undefined,
  }),
  component: LicaoPage,
});

type Step = "estudo" | "fixar" | "aplicar" | "done";

function LicaoPage() {
  const { id } = Route.useParams();
  const { modulo } = Route.useSearch();
  const nav = useNavigate();
  const { bibleVersion } = useApp();
  const { celebrateActivity } = useCelebration();
  const { trigger } = useMascot();
  const found = useMemo(() => lessonById(id), [id]);
  const [step, setStep] = useState<Step>("estudo");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const { scaleIndex, increase, decrease, contentZoomStyle } = useReadingFontScale();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const goBack = () => {
    if (modulo) {
      void nav({ to: "/modulo/$id", params: { id: modulo } });
    } else {
      void nav({ to: "/home" });
    }
  };

  const shareContext = useMemo(() => {
    if (!found) return "";
    const { lesson } = found;
    return [
      lesson.intro.join(" "),
      lesson.verses.map((v) => `${v.ref}: ${verseText(v, bibleVersion)}`).join(" "),
      lesson.deepDive,
      lesson.application,
    ]
      .filter(Boolean)
      .join(" ")
      .slice(0, 2000);
  }, [found, bibleVersion]);

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
  const correctCount = Object.entries(answers).filter(
    ([i, v]) => v === lesson.quizzes[Number(i)].correctIndex,
  ).length;
  const canAdvance = Object.keys(answers).length === total && correctCount === total;
  const pct = step === "estudo" ? 33 : step === "fixar" ? 66 : 100;

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      if (reflection.trim()) {
        // upsert em vez de insert: se o usuário já tinha respondido essa
        // mesma lição antes, atualiza a resposta em vez de criar duplicata
        // (há uma constraint única (user_id, lesson_id) no banco).
        await supabase.from("diary_entries").upsert(
          {
            user_id: u.user.id,
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            question: lesson.reflectionQuestion,
            answer: reflection.trim(),
          },
          { onConflict: "user_id,lesson_id" },
        );
      }
      const progressReward = await awardProgressXp(u.user.id, lesson.id, lesson.xp);
      setEarnedXp(progressReward.xp);
      celebrateActivity({
        prevXp: progressReward.prevXp,
        newXp: progressReward.newXp,
        xp: progressReward.xp,
      });
      void logLessonCompletionToFeed(u.user.id, lesson.id, lesson.title);

      // Reflexão do mentor sobre a trilha concluída — usa o título exato
      // salvo em disciple_trails (pode diferir levemente do título estático
      // do conteúdo, ex.: com/sem "?"), pra bater com o dicionário de
      // comentários específicos em trailCompletionLine.
      const { data: trail } = await supabase
        .from("disciple_trails")
        .select("title")
        .eq("lesson_id", lesson.id)
        .maybeSingle();
      const trailTitle = (trail?.title as string | null) ?? lesson.title;
      setTimeout(() => trigger("jump", trailCompletionLine(trailTitle), 2600), 900);
    }
    setStep("done");
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-5 animate-slide-up">
      <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
                Sua lição
              </span>
              <span className="rounded-full bg-ancient/15 px-2.5 py-1 text-[10px] font-extrabold text-ancient">
                +{lesson.xp} XP
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-surface/70 p-1">
          {(["estudo", "fixar", "aplicar"] as const).map((item, index) => (
            <span
              key={item}
              className={`rounded-xl px-2 py-2 text-center text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                step === item ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {index + 1}. {item}
            </span>
          ))}
        </div>
      </header>

      {step === "estudo" && (
        <HighlightsProvider contentId={lesson.id} contentType="trilha" contentTitle={lesson.title}>
          <div style={contentZoomStyle} className="space-y-5" data-tts-scope="licao">
            <section className="overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-lg shadow-primary/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <NarrationButton containerSelector='[data-tts-scope="licao"]' />
                  <FontSizeControls
                    scaleIndex={scaleIndex}
                    onIncrease={increase}
                    onDecrease={decrease}
                  />
                </div>
              </div>
              <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                Estudo bíblico
              </p>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight" data-narrate>
                {lesson.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Leia com calma, destaque o que falar ao seu coração e continue quando estiver pronto.
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-border bg-surface/70 p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                  A ideia central
                </span>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-4">
                {lesson.intro.map((p, i) => (
                  <HighlightedText
                    key={i}
                    fieldKey={`intro-${i}`}
                    text={p}
                    narrate
                    className="text-[15px] leading-7 text-foreground/90"
                  />
                ))}
              </div>
            </section>

            <div className="flex items-end justify-between gap-3 px-1 pt-1">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Base bíblica</p>
                <h2 className="mt-1 text-xl font-extrabold">O que a Bíblia diz</h2>
              </div>
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                {lesson.verses.length} {lesson.verses.length === 1 ? "versículo" : "versículos"}
              </span>
            </div>

            {lesson.verses.map((v, vi) => (
              <div key={v.ref} className="rounded-[1.75rem] border border-ancient/30 bg-gradient-to-br from-ancient/10 to-surface p-5 shadow-sm shadow-ancient/5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                  <span data-narrate>{v.ref}</span> · {bibleVersion}
                </p>
                <HighlightedText
                  fieldKey={`verso-texto-${vi}`}
                  text={`"${verseText(v, bibleVersion)}"`}
                  narrate
                  className="mt-2 block scripture text-base leading-relaxed"
                />
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

            <section className="rounded-[1.75rem] border border-border bg-surface/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">Leitura guiada</span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Explicação
              </p>
              <HighlightedText
                fieldKey="explicacao"
                text={lesson.deepDive}
                narrate
                className="mt-2 block text-sm leading-relaxed text-foreground/90"
              />
            </section>

            <blockquote className="rounded-[1.75rem] border border-ancient/25 bg-ancient/5 p-5 shadow-sm">
              <Quote className="h-4 w-4 text-ancient" />
              <HighlightedText
                fieldKey="citacao"
                text={`"${lesson.theologianQuote.text}"`}
                narrate
                className="mt-2 block scripture text-base leading-relaxed text-ancient"
              />
              <footer className="mt-2 text-xs font-semibold text-ancient/80">
                — {lesson.theologianQuote.author}
                {lesson.theologianQuote.source ? `, ${lesson.theologianQuote.source}` : ""}
              </footer>
            </blockquote>

            {lesson.deepen && (
              <Link
                to="/licao/$id/aprofundar"
                params={{ id: lesson.id }}
                search={{ modulo }}
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
        </HighlightsProvider>
      )}

      {step === "fixar" && (
        <div style={contentZoomStyle} className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-extrabold tracking-tight">Fixar o aprendizado</h2>
            </div>
            <FontSizeControls scaleIndex={scaleIndex} onIncrease={increase} onDecrease={decrease} />
          </div>
          <div className="rounded-[1.75rem] border border-primary/20 bg-primary/10 p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Agora, reflita</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Responda as perguntas para transformar a leitura em memória. Você pode tentar novamente até acertar.
            </p>
          </div>

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
                      if (isThisChosen && optCorrect)
                        cls = "border-success bg-success/15 text-success";
                      else if (isThisChosen)
                        cls = "border-destructive bg-destructive/15 text-destructive";
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
              <h2 className="text-3xl font-extrabold tracking-tight">Levar para a vida</h2>
            </div>
            <FontSizeControls scaleIndex={scaleIndex} onIncrease={increase} onDecrease={decrease} />
          </div>

          <div className="rounded-[1.75rem] border border-primary/25 bg-gradient-to-br from-primary/15 to-surface p-5 shadow-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
              Aplicação prática
            </p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.application}</p>
          </div>

          <div className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
              Desafio da semana
            </p>
            <p className="mt-2 text-sm leading-relaxed">{lesson.weeklyChallenge}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Oração sugerida
            </p>
            <p className="mt-2 scripture text-base leading-relaxed">{lesson.prayer}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Pergunta de reflexão
            </p>
            <p className="mt-2 text-sm font-medium">{lesson.reflectionQuestion}</p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              placeholder="Escreva livremente… (sua resposta vai para o Feed → Meu Diário)"
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
          <p className="mt-4 rounded-full bg-primary/20 px-4 py-1.5 text-sm font-bold text-primary">
            +{earnedXp ?? lesson.xp} XP
          </p>
          <div className="mt-8 w-full max-w-xs rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
            <Sparkles className="mx-auto h-8 w-8 text-ancient" />
            <p className="mt-4 scripture text-center text-lg leading-snug">"{lesson.title}"</p>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-slate-400">
              The Disciple
            </p>
          </div>
          <div className="mt-6 flex w-full flex-col gap-2">
            <ShareLessonButton
              lessonId={lesson.id}
              title={lesson.title}
              shareContext={shareContext}
            />
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
