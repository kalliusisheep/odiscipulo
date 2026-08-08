import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Crown,
  Loader2,
  Send,
  Shuffle,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { verseText } from "@/data/content";
import { SUPPORT_MODULES, type SupportLesson, type SupportModule } from "@/data/leader-support-content";
import { useApp } from "@/lib/app-context";

const TOTAL_SUPPORT_LESSONS = SUPPORT_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

type Step = "estudo" | "fixar" | "aplicar";

type AssignmentTarget = {
  id: string;
  type: "disciple" | "group";
  name: string;
  subtitle: string;
  memberIds: string[];
};

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
  const [activeModule, setActiveModule] = useState<SupportModule | null>(null);
  const [selected, setSelected] = useState<SupportLesson | null>(null);
  const [assigningLesson, setAssigningLesson] = useState<SupportLesson | null>(null);
  const [targets, setTargets] = useState<AssignmentTarget[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [loadingTargets, setLoadingTargets] = useState(false);
  const [savingAssignment, setSavingAssignment] = useState(false);

  const openLesson = (lesson: SupportLesson) => setSelected(lesson);
  const closeDialog = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelected(null);
      setActiveModule(null);
    }
  };

  useEffect(() => {
    if (!assigningLesson) return;

    void (async () => {
      setLoadingTargets(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setLoadingTargets(false);
        return;
      }

      const [{ data: links }, { data: groups }] = await Promise.all([
        supabase
          .from("leader_disciples")
          .select("disciple_id")
          .eq("leader_id", user.user.id),
        supabase
          .from("groups")
          .select("id, name, topic")
          .eq("leader_id", user.user.id)
          .order("created_at", { ascending: false }),
      ]);

      const discipleIds = (links ?? []).map((row) => row.disciple_id);
      const groupIds = (groups ?? []).map((group) => group.id);
      const [{ data: profiles }, { data: members }] = await Promise.all([
        discipleIds.length
          ? supabase
              .from("profiles")
              .select("id, display_name, username")
              .in("id", discipleIds)
          : Promise.resolve({ data: [] }),
        groupIds.length
          ? supabase
              .from("group_members")
              .select("group_id, disciple_id")
              .in("group_id", groupIds)
          : Promise.resolve({ data: [] }),
      ]);

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [profile.id, profile]),
      );
      const nextTargets: AssignmentTarget[] = (profiles ?? []).map((profile) => ({
        id: `disciple:${profile.id}`,
        type: "disciple",
        name: profile.display_name,
        subtitle: profile.username ? `@${profile.username}` : "Discípulo",
        memberIds: [profile.id],
      }));

      for (const group of groups ?? []) {
        const memberIds = (members ?? [])
          .filter((member) => member.group_id === group.id)
          .map((member) => member.disciple_id)
          .filter((id) => profileMap.has(id));

        if (memberIds.length > 0) {
          nextTargets.push({
            id: `group:${group.id}`,
            type: "group",
            name: group.name,
            subtitle: `${memberIds.length} membro${memberIds.length === 1 ? "" : "s"}`,
            memberIds,
          });
        }
      }

      setTargets(nextTargets);
      setSelectedTargetId(nextTargets[0]?.id ?? "");
      setLoadingTargets(false);
    })();
  }, [assigningLesson]);

  const applyLesson = async () => {
    if (!assigningLesson || !selectedTargetId) {
      toast.error("Escolha um discípulo ou grupo.");
      return;
    }

    const target = targets.find((item) => item.id === selectedTargetId);
    const { data: user } = await supabase.auth.getUser();
    if (!target || !user.user) return;

    setSavingAssignment(true);
    const rows = target.memberIds.map((discipleId) => ({
      leader_id: user.user.id,
      disciple_id: discipleId,
      group_id: target.type === "group" ? target.id.replace("group:", "") : null,
      content_type: "support_lesson",
      content_id: assigningLesson.id,
      status: "active",
    }));
    const { error } = await supabase
      .from("discipleship_assignments")
      .upsert(rows, {
        onConflict: "leader_id,disciple_id,content_type,content_id",
        ignoreDuplicates: true,
      });

    setSavingAssignment(false);
    if (error) {
      toast.error("Não foi possível aplicar este conteúdo.");
      return;
    }

    toast.success(
      target.type === "group"
        ? `Conteúdo aplicado ao grupo "${target.name}".`
        : `Conteúdo aplicado a ${target.name}.`,
    );
    setAssigningLesson(null);
    setSelectedTargetId("");
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
              <p className="truncate text-xs text-white/60">
                {SUPPORT_MODULES.length} módulos · {TOTAL_SUPPORT_LESSONS} trilhas para conversas e acompanhamento
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-white/60" />
          </div>
        </button>
        <p className="px-1 text-xs text-muted-foreground">Esses serão os módulos e trilhas que seus discipulados seguirão.</p>
      </section>

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          {selected ? (
            <LessonFlow
              lesson={selected}
              onBack={() => setSelected(null)}
              onApply={(lesson) => setAssigningLesson(lesson)}
            />
          ) : activeModule ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModule(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-surface"
                    aria-label="Voltar para os módulos"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <DialogTitle>{activeModule.title}</DialogTitle>
                </div>
                <DialogDescription>
                  Escolha uma das {activeModule.lessons.length} trilhas deste módulo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                {activeModule.lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-2 rounded-xl border border-border p-2 transition-colors hover:border-primary/50"
                  >
                    <button
                      type="button"
                      onClick={() => openLesson(lesson)}
                      className="flex min-w-0 flex-1 items-center gap-3 p-1.5 text-left"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{lesson.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">{lesson.verses[0]?.ref}</span>
                      </span>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssigningLesson(lesson)}
                      className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/20"
                      aria-label={`Aplicar ${lesson.title}`}
                    >
                      <Send className="h-3.5 w-3.5" /> Aplicar
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Conteúdos para discípulos</DialogTitle>
                <DialogDescription>
                  Material de apoio bíblico que complementa a comunhão e o cuidado da igreja local.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                {SUPPORT_MODULES.map((mod) => (
                  <button
                    type="button"
                    key={mod.id}
                    onClick={() => setActiveModule(mod)}
                    className="flex items-center justify-between rounded-xl border border-border p-3 text-left hover:border-primary/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{mod.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{mod.lessons.length} trilhas</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(assigningLesson)}
        onOpenChange={(open) => {
          if (!open) {
            setAssigningLesson(null);
            setSelectedTargetId("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aplicar conteúdo</DialogTitle>
            <DialogDescription>
              Escolha quem receberá esta trilha. O discípulo verá o módulo como Meu Discipulado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {loadingTargets ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando discípulos...
              </div>
            ) : targets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Adicione discípulos ou crie um grupo antes de aplicar conteúdos.
              </div>
            ) : (
              targets.map((target) => {
                const selectedTarget = selectedTargetId === target.id;
                const Icon = target.type === "group" ? UsersRound : UserRound;
                return (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => setSelectedTargetId(target.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                      selectedTarget
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{target.name}</span>
                      <span className="block text-xs text-muted-foreground">{target.subtitle}</span>
                    </span>
                    <span className={`h-4 w-4 rounded-full border-2 ${
                      selectedTarget ? "border-primary bg-primary ring-2 ring-primary/20" : "border-border"
                    }`} />
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => void applyLesson()}
            disabled={savingAssignment || loadingTargets || targets.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {savingAssignment && <Loader2 className="h-4 w-4 animate-spin" />}
            Aplicar agora
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SupportLessonFlow({
  lesson,
  onBack,
  onComplete,
  onApply,
}: {
  lesson: SupportLesson;
  onBack: () => void;
  onComplete?: () => Promise<void> | void;
  onApply?: (lesson: SupportLesson) => void;
}) {
  return <LessonFlow lesson={lesson} onBack={onBack} onComplete={onComplete} onApply={onApply} />;
}

function LessonFlow({
  lesson,
  onBack,
  onComplete,
  onApply,
}: {
  lesson: SupportLesson;
  onBack: () => void;
  onComplete?: () => Promise<void> | void;
  onApply?: (lesson: SupportLesson) => void;
}) {
  const { bibleVersion } = useApp();
  const [step, setStep] = useState<Step>("estudo");
  const [completionSaved, setCompletionSaved] = useState(false);
  const reflectionStorageKey = `support-lesson-reflection:${lesson.id}`;
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(reflectionStorageKey) ?? "";
      setReflectionAnswer(saved);
      setReflectionSaved(Boolean(saved.trim()));
    } catch {
      setReflectionAnswer("");
      setReflectionSaved(false);
    }
  }, [reflectionStorageKey]);

  const completeLesson = async () => {
    if (!onComplete || completionSaved) return;
    await onComplete();
    setCompletionSaved(true);
  };

  const saveReflection = () => {
    const answer = reflectionAnswer.trim();
    if (!answer) {
      toast.error("Escreva sua resposta antes de salvar.");
      return;
    }

    try {
      window.localStorage.setItem(reflectionStorageKey, answer);
      setReflectionAnswer(answer);
      setReflectionSaved(true);
      toast.success("Reflexão salva.");
    } catch {
      toast.error("Não foi possível salvar sua reflexão neste dispositivo.");
    }
  };

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const allQuizzesCorrect = lesson.quizzes.every(
    (quiz, quizIndex) => quizAnswers[quizIndex] === quiz.correctIndex,
  );

  const meaningOptions = useMemo(
    () => shuffled(lesson.keywords.map((_, index) => index)),
    [lesson.id],
  );
  const [armedTerm, setArmedTerm] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [wrongPulse, setWrongPulse] = useState<number | null>(null);
  const allMatched = Object.keys(matches).length === lesson.keywords.length;
  const canAdvanceFixar = allQuizzesCorrect && allMatched;

  const tryMatch = (termIndex: number, meaningIndex: number) => {
    if (termIndex === meaningIndex) {
      setMatches((previous) => ({ ...previous, [termIndex]: meaningIndex }));
      setArmedTerm(null);
    } else {
      setWrongPulse(meaningIndex);
      setTimeout(() => setWrongPulse(null), 500);
      setArmedTerm(null);
    }
  };

  const resetAndBack = () => {
    setStep("estudo");
    setQuizAnswers({});
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
              style={{
                width:
                  step === "estudo" ? "33%" : step === "fixar" ? "66%" : "100%",
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className={step === "estudo" ? "font-bold text-primary" : ""}>
              Estudo
            </span>
            <span className={step === "fixar" ? "font-bold text-primary" : ""}>
              Fixar
            </span>
            <span className={step === "aplicar" ? "font-bold text-primary" : ""}>
              Aplicar
            </span>
          </div>
        </div>
      </div>

      {step === "estudo" && (
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tema
            </p>
            <h3 className="text-2xl font-extrabold tracking-tight">{lesson.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Conteúdo {lesson.difficulty ? `· nível ${lesson.difficulty}` : ""} · {lesson.xp} XP
            </p>
          </div>

          <section className="rounded-[1.75rem] border border-border bg-surface/70 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                A ideia central
              </span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-4">
              {lesson.intro.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-7 text-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <div className="flex items-end justify-between gap-3 px-1 pt-1">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                Base bíblica
              </p>
              <h2 className="mt-1 text-xl font-extrabold">O que a Bíblia diz</h2>
            </div>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
              {lesson.verses.length}{" "}
              {lesson.verses.length === 1 ? "versículo" : "versículos"}
            </span>
          </div>

          {lesson.verses.map((verse, verseIndex) => (
            <div
              key={`${verse.ref}-${verseIndex}`}
              className="rounded-[1.75rem] border border-ancient/30 bg-gradient-to-br from-ancient/10 to-surface p-5 shadow-sm shadow-ancient/5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                {verse.ref} · {bibleVersion}
              </p>
              <p className="mt-2 block scripture text-base leading-relaxed">
                “{verseText(verse, bibleVersion)}”
              </p>
              {verse.originals && verse.originals.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-ancient/20 pt-3">
                  {verse.originals.map((original, originalIndex) => (
                    <div key={originalIndex} className="text-xs">
                      <span className="font-semibold text-ancient">{original.word}</span>
                      <span className="text-muted-foreground">
                        {" "}
                        ({original.translit}, {original.lang}) —{" "}
                      </span>
                      <span className="text-foreground/80">{original.meaning}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <section className="rounded-[1.75rem] border border-border bg-surface/70 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                Leitura guiada
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Explicação
            </p>
            <p className="mt-2 text-[15px] leading-7 text-foreground/90">
              {lesson.deepDive}
            </p>
          </section>

          {lesson.deepen && (
            <section className="space-y-3">
              <div className="px-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
                  Aprofundamento
                </p>
                <h2 className="mt-1 text-xl font-extrabold">Olhar mais atento</h2>
              </div>
              {lesson.deepen.historicalContext && (
                <div className="card-elevated p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                    Contexto
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/90">
                    {lesson.deepen.historicalContext}
                  </p>
                </div>
              )}
              {lesson.deepen.exegeticalNotes && (
                <div className="card-elevated p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                    Leitura do texto
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/90">
                    {lesson.deepen.exegeticalNotes}
                  </p>
                </div>
              )}
              {lesson.deepen.theologicalDebate && (
                <div className="card-elevated p-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                    Discernimento
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/90">
                    {lesson.deepen.theologicalDebate}
                  </p>
                </div>
              )}
              {lesson.deepen.additionalVerses?.map((verse, verseIndex) => (
                <div
                  key={`additional-${verse.ref}-${verseIndex}`}
                  className="rounded-[1.75rem] border border-ancient/30 bg-ancient/5 p-5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ancient">
                    {verse.ref} · {bibleVersion}
                  </p>
                  <p className="mt-2 scripture text-base leading-relaxed">
                    “{verseText(verse, bibleVersion)}”
                  </p>
                </div>
              ))}
            </section>
          )}

          <blockquote className="rounded-[1.75rem] border border-ancient/25 bg-ancient/5 p-5 shadow-sm">
            <p className="scripture text-base leading-relaxed text-ancient">
              “{lesson.theologianQuote.text}”
            </p>
            <p className="mt-2 text-xs font-semibold text-ancient/80">
              — {lesson.theologianQuote.author}
              {lesson.theologianQuote.source ? `, ${lesson.theologianQuote.source}` : ""}
            </p>
          </blockquote>

          <button
            type="button"
            onClick={() => setStep("fixar")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-glow"
          >
            Continuar para Fixar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === "fixar" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Fixar o aprendizado</h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {Object.keys(quizAnswers).filter(
                (index) => quizAnswers[Number(index)] !== undefined,
              ).length}/{lesson.quizzes.length} perguntas
            </span>
          </div>

          <div className="rounded-[1.75rem] border border-primary/20 bg-primary/10 p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
              Agora, reflita
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              Responda às perguntas para transformar a leitura em memória. Você pode tentar novamente até acertar.
            </p>
          </div>

          {lesson.quizzes.map((quiz, quizIndex) => {
            const chosen = quizAnswers[quizIndex];
            const answered = chosen !== undefined;
            const isCorrect = answered && chosen === quiz.correctIndex;
            return (
              <div key={quizIndex} className="card-elevated p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pergunta {quizIndex + 1} de {lesson.quizzes.length}
                </p>
                <p className="mt-1 text-sm font-medium">{quiz.question}</p>
                <div className="mt-3 space-y-2">
                  {quiz.options.map((option, optionIndex) => {
                    const isChosen = chosen === optionIndex;
                    const isCorrectOption = optionIndex === quiz.correctIndex;
                    let className = "border-border bg-surface hover:border-primary/40";
                    if (answered) {
                      if (isChosen && isCorrectOption) {
                        className = "border-success bg-success/15 text-success";
                      } else if (isChosen) {
                        className = "border-destructive bg-destructive/15 text-destructive";
                      } else if (isCorrectOption && !isCorrect) {
                        className = "border-success/40 bg-success/5";
                      } else {
                        className = "border-border bg-surface opacity-60";
                      }
                    }
                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={isCorrect}
                        onClick={() =>
                          setQuizAnswers((previous) => ({
                            ...previous,
                            [quizIndex]: optionIndex,
                          }))
                        }
                        className={`w-full rounded-2xl border p-3 text-left text-sm font-medium transition-all ${className}`}
                      >
                        <div className="flex items-center gap-2">
                          {answered && isChosen && isCorrectOption && (
                            <Check className="h-4 w-4" />
                          )}
                          {answered && isChosen && !isCorrectOption && (
                            <X className="h-4 w-4" />
                          )}
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {answered && quiz.explanation && (
                  <p
                    className={`mt-3 rounded-xl p-3 text-xs ${
                      isCorrect
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {isCorrect ? "Correto — " : "Não é essa. "} {quiz.explanation}
                  </p>
                )}
              </div>
            );
          })}

          <div className="card-elevated p-5">
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                Relacione os termos
              </p>
            </div>
            <p className="mt-1 text-sm font-medium">
              Toque em um termo original e depois no significado correspondente.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                {lesson.keywords.map((keyword, termIndex) => {
                  const isMatched = matches[termIndex] !== undefined;
                  const isArmed = armedTerm === termIndex;
                  return (
                    <button
                      key={termIndex}
                      type="button"
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
                      {keyword.word}
                      <span className="block font-normal italic text-muted-foreground">
                        ({keyword.translit})
                      </span>
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
                      type="button"
                      disabled={alreadyUsed || armedTerm === null}
                      onClick={() =>
                        armedTerm !== null && tryMatch(armedTerm, meaningIndex)
                      }
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
            type="button"
            onClick={() => setStep("aplicar")}
            disabled={!canAdvanceFixar}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-glow disabled:opacity-50"
          >
            Continuar para Aplicar <ArrowRight className="h-4 w-4" />
          </button>
          {!canAdvanceFixar && (
            <p className="text-center text-[11px] text-muted-foreground">
              Acerte as perguntas e relacione todos os termos para prosseguir.
            </p>
          )}
        </div>
      )}

      {step === "aplicar" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Levar para a vida</h3>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
              Aplicação prática
            </p>
            <p className="mt-2 text-[15px] leading-7">{lesson.application}</p>
          </div>

          <div className="card-elevated border-l-4 border-l-ancient p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ancient">
              Desafio da semana
            </p>
            <p className="mt-2 text-[15px] leading-7">{lesson.weeklyChallenge}</p>
          </div>

          <div className="card-elevated p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
              Oração sugerida
            </p>
            <p className="mt-2 scripture text-base leading-relaxed">{lesson.prayer}</p>
          </div>

          <div className="card-elevated space-y-3 p-5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary">
                Pergunta de reflexão
              </p>
              <p className="mt-2 text-[15px] leading-7">{lesson.reflectionQuestion}</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor={`reflection-${lesson.id}`}
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
              >
                Sua resposta
              </label>
              <textarea
                id={`reflection-${lesson.id}`}
                value={reflectionAnswer}
                onChange={(event) => {
                  setReflectionAnswer(event.target.value);
                  setReflectionSaved(false);
                }}
                rows={4}
                maxLength={1200}
                placeholder="Escreva com suas próprias palavras..."
                className="w-full resize-none rounded-2xl border border-border bg-background/70 p-3 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Esta resposta fica salva para você continuar sua reflexão.
                </p>
                <button
                  type="button"
                  onClick={saveReflection}
                  className="shrink-0 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                >
                  {reflectionSaved ? "Salva" : "Salvar"}
                </button>
              </div>
            </div>
          </div>

          {onComplete ? (
            <button
              type="button"
              onClick={() => void completeLesson()}
              disabled={completionSaved}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              <Check className="h-4 w-4" />
              {completionSaved ? "Conteúdo concluído" : `Concluir conteúdo · ${lesson.xp} XP`}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-primary/10 py-3 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> Lição concluída — {lesson.title}
            </div>
          )}

          {onApply && (
            <button
              type="button"
              onClick={() => onApply(lesson)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            >
              <Send className="h-4 w-4" /> Aplicar aos discípulos
            </button>
          )}

          <button
            type="button"
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

