import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock3, Flame, HelpCircle, Lightbulb, RotateCcw, Sparkles, Trophy, UsersRound, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameModeChooser } from "@/components/games/GameModeChooser";
import { SharedQuestionGame } from "@/components/games/SharedQuestionGame";
import { MILLION_DIFFICULTY, MILLION_LEVELS, MILLION_QUESTIONS, randomMillionQuestions, randomMillionQuestionsWithSeed, type MillionDifficulty, type MillionQuestion } from "@/data/biblical-million";
import { playGameSfx, startGameMusic } from "@/lib/game-audio";
import { recordGameResult } from "@/lib/game-leaderboard";
import { normalizeGameContentKey, readRecentGameKeys, selectFreshGameVariants, uniqueGameContent } from "@/lib/game-content";

export const Route = createFileRoute("/_authenticated/jogos/milhao")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "multi" ? "multi" : "single",
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
    seed: typeof search.seed === "string" && Number.isFinite(Number(search.seed)) ? Number(search.seed) : undefined,
    difficulty: ["facil", "medio", "dificil", "bereano"].includes(String(search.difficulty)) ? String(search.difficulty) : "medio",
    rounds: normalizeRounds(search.rounds, 8),
  }),
  component: MillionPage,
});

type Phase = "setup" | "playing" | "answered" | "finished";
type Lifeline = "eliminar" | "contexto" | "consultar";
type Consultation = { name: string; role: string; answer: string; confidence: string; tone: string };
const roundOptions = [5, 8, 10, 15, 20] as const;
function normalizeRounds(value: unknown, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return roundOptions.reduce((closest, option) => Math.abs(option - numeric) < Math.abs(closest - numeric) ? option : closest, fallback);
}

const consultants = [
  { name: "Pedro", role: "testemunha dos Evangelhos", tone: "text-sky-300" },
  { name: "Paulo", role: "estudioso das Escrituras", tone: "text-amber-300" },
  { name: "Barnabé", role: "encorajador da igreja", tone: "text-emerald-300" },
] as const;

function consultCharacters(question: MillionQuestion): Consultation[] {
  const answerIndex = Math.max(0, question.options.indexOf(question.answer));
  const wrongAnswer = question.options.find((option) => option !== question.answer) ?? question.answer;
  return consultants.map((consultant, index) => {
    const guessIndex = index === 0 ? answerIndex : (answerIndex + index + question.id.length) % question.options.length;
    const proposedAnswer = question.options[guessIndex] ?? question.answer;
    const answer = index > 0 && proposedAnswer === question.answer ? wrongAnswer : proposedAnswer;
    return { ...consultant, answer, confidence: answer === question.answer ? (index === 0 ? "Muito provável" : "Acho que sim") : index === 1 ? "Não tenho certeza" : "Posso estar enganado" };
  });
}

function MillionPage() {
  const { mode, roomId, seed, difficulty: initialDifficulty, rounds: initialRounds } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>("setup");
  const [modeSelected, setModeSelected] = useState(mode === "multi");
  const [difficulty, setDifficulty] = useState<MillionDifficulty>(initialDifficulty as MillionDifficulty);
  const [rounds, setRounds] = useState(initialRounds);
  const [questions, setQuestions] = useState<MillionQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [contextOpen, setContextOpen] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[] | null>(null);
  const [timeLeft, setTimeLeft] = useState(MILLION_DIFFICULTY[initialDifficulty as MillionDifficulty].timeLimit);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [usedLifelines, setUsedLifelines] = useState<Lifeline[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [weakness, setWeakness] = useState<Record<string, { correct: number; total: number }>>({});
  const startedAt = useRef(0);
  const question = questions[index];
  const level = useMemo(() => [...MILLION_LEVELS].reverse().find((item) => score >= item.points) ?? MILLION_LEVELS[0], [score]);

  useEffect(() => {
    if (phase !== "answered") return;
    window.requestAnimationFrame(() => {
      document.querySelector(".game-answer-feedback")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [phase]);

  const prepare = useCallback((nextIndex: number, list: MillionQuestion[]) => {
    setIndex(nextIndex); setSelected(null); setHidden([]); setContextOpen(false); setConsultations(null); setTimeLeft(MILLION_DIFFICULTY[difficulty].timeLimit); startedAt.current = Date.now(); setPhase("playing");
  }, [difficulty]);

  const start = () => {
    scoreSaved.current = false;
    startGameMusic("million");
    playGameSfx("start");
    const recentKey = `million_recent_questions_${difficulty}`;
    const recentIds = readRecentGameKeys(recentKey);
    const preferred = seed
      ? randomMillionQuestionsWithSeed(difficulty, 999, seed)
      : randomMillionQuestions(difficulty, 999);
    const fallback = MILLION_QUESTIONS.filter((item) => item.difficulty !== difficulty);
    // Question-type variants from the same fact are not separate knowledge
    // cards for a single match. Start with one card per biblical fact.
    const pool = uniqueGameContent([...preferred, ...fallback], (item) => item.id);
    const recentKeys = new Set(recentIds.map(normalizeGameContentKey));
    const recentFirst = [...pool].sort((first, second) => {
      const firstRecent = recentKeys.has(normalizeGameContentKey(first.id)) ? 1 : 0;
      const secondRecent = recentKeys.has(normalizeGameContentKey(second.id)) ? 1 : 0;
      return firstRecent - secondRecent;
    });
    const selectedQuestions = selectFreshGameVariants({
      gameKey: "milhao",
      items: recentFirst,
      amount: rounds,
      getKey: (item) => item.id,
    });
    const storedKeys = selectedQuestions.map((item) => normalizeGameContentKey(item.id));
    window.localStorage.setItem(recentKey, JSON.stringify([...new Set([...recentIds.map(normalizeGameContentKey), ...storedKeys])].slice(-Math.max(rounds * 5, 80))));
    setQuestions(selectedQuestions);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setUsedLifelines([]);
    setCorrectAnswers(0);
    setWeakness({});
    setTimeLeft(MILLION_DIFFICULTY[difficulty].timeLimit);
    setConsultations(null);
    startedAt.current = Date.now();
    setPhase(selectedQuestions.length ? "playing" : "finished");
  };
  const answer = useCallback((value: string | null) => {
    if (phase !== "playing" || !question) return;
    const isCorrect = value === question.answer;
    playGameSfx(isCorrect ? "success" : "error");
    const nextStreak = isCorrect ? streak + 1 : 0;
    const speed = isCorrect ? timeLeft * 4 : 0;
    const combo = isCorrect ? Math.min(120, streak * 25) : 0;
    const earned = isCorrect ? 100 + speed + combo : 0;
    setSelected(value); setScore((current) => current + earned); setStreak(nextStreak); setBestStreak((current) => Math.max(current, nextStreak)); setCorrectAnswers((current) => current + (isCorrect ? 1 : 0)); setWeakness((current) => { const previous = current[question.category] ?? { correct: 0, total: 0 }; return { ...current, [question.category]: { correct: previous.correct + (isCorrect ? 1 : 0), total: previous.total + 1 } }; }); setPhase("answered");
  }, [phase, question, streak, timeLeft]);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => setTimeLeft((value) => { if (value <= 1) { window.clearInterval(timer); answer(null); return 0; } return value - 1; }), 1000);
    return () => window.clearInterval(timer);
  }, [answer, phase]);

  const next = () => { playGameSfx(index + 1 >= questions.length ? "complete" : "tap"); if (index + 1 >= questions.length) setPhase("finished"); else prepare(index + 1, questions); };

  const handleLifeline = (lifeline: Lifeline) => {
    if (!question || usedLifelines.includes(lifeline) || phase !== "playing") return;
    playGameSfx("reveal");
    if (lifeline === "eliminar") setHidden(question.options.filter((option) => option !== question.answer).slice(0, 2));
    if (lifeline === "contexto") setContextOpen(true);
    if (lifeline === "consultar") setConsultations(consultCharacters(question));
    setUsedLifelines((current) => [...current, lifeline]);
  };

  const scoreSaved = useRef(false);
  useEffect(() => {
    if (phase !== "finished" || scoreSaved.current) return;
    scoreSaved.current = true;
    void recordGameResult({ gameKey: "milhao", score, correctAnswers, rounds, bestStreak });
  }, [bestStreak, correctAnswers, phase, rounds, score]);
  if (phase === "setup" && !modeSelected) return <GameModeChooser title="Quiz do Milhão" heroImage="/game-quiz-do-milhao.jpeg" heroImageAlt="Ovelha apresentando o Quiz do Milhão em uma arena bíblica" description="Suba pelos níveis do conhecimento bíblico sozinho ou desafie outros jogadores em uma sala competitiva." onBack={() => { window.location.href = "/jogos"; }} onSinglePlayer={() => setModeSelected(true)} onMultiplayer={() => { window.location.href = "/jogos/multiplayer?game=milhao"; }} />;
  if (mode === "multi" && roomId) return <SharedQuestionGame gameType="milhao" roomId={roomId} seed={seed} difficulty={difficulty} rounds={rounds} />;
  if (phase === "setup") return <Setup difficulty={difficulty} onDifficultyChange={setDifficulty} rounds={rounds} onRoundsChange={setRounds} onStart={start} />;


  if (phase === "finished") return <Results score={score} correct={correctAnswers} rounds={rounds} bestStreak={bestStreak} weakness={weakness} onRestart={() => setPhase("setup")} />;
  if (!question) return null;
  const isCorrect = selected === question.answer;

  return <main className="game-play-page min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><header className="flex items-center justify-between"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><span className="rounded-full bg-ancient/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ancient">{level.title}</span></header><div className="mt-6 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Quiz do Milhão</p><h1 className="mt-1 text-2xl font-extrabold">Desafio {index + 1}</h1></div><div className="text-right"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Conhecimento</p><p className="text-xl font-black text-ancient">{score}</p></div></div><div className="mt-4 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary to-ancient transition-all" style={{ width: `${((index + (phase === "answered" ? 1 : 0)) / questions.length) * 100}%` }} /></div><span className={`inline-flex items-center gap-1 text-sm font-black ${timeLeft <= 6 ? "text-red-300" : "text-foreground"}`}><Clock3 className="h-4 w-4" /><span role="timer" aria-live="polite" aria-atomic="true">{timeLeft}</span></span></div><div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"><span>{question.category}</span><span className="inline-flex items-center gap-1 text-ancient"><Flame className="h-3.5 w-3.5" /> {streak} combo</span></div><section className="mt-5 rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-xl shadow-primary/5"><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">{question.type === "complete" ? "Complete a passagem" : question.type === "true-false" ? "Verdadeiro ou falso" : "Escolha a resposta"}</p><p className="mt-5 text-xl font-extrabold leading-relaxed">{question.prompt}</p></section><section className="mt-4 space-y-2.5">{question.options.map((option, optionIndex) => { const isHidden = hidden.includes(option); const chosen = selected === option; const right = phase === "answered" && option === question.answer; const wrong = phase === "answered" && chosen && !isCorrect; return <button type="button" key={option} onClick={() => answer(option)} disabled={phase !== "playing" || isHidden} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-extrabold transition-all ${isHidden ? "invisible" : right ? "border-success bg-success/10 text-success" : wrong ? "border-red-400/50 bg-red-400/10 text-red-300" : chosen ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface hover:-translate-y-0.5 hover:border-primary/50"}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/70 text-xs font-black text-muted-foreground">{String.fromCharCode(65 + optionIndex)}</span><span className="flex-1">{option}</span>{right && <Check className="h-5 w-5" />}{wrong && <X className="h-5 w-5" />}</button>; })}</section><section className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => handleLifeline("eliminar")} disabled={usedLifelines.includes("eliminar") || phase !== "playing"} className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface px-2 py-3 text-[10px] font-extrabold disabled:opacity-40"><Sparkles className="h-4 w-4 text-primary" /> 50/50</button><button type="button" onClick={() => handleLifeline("contexto")} disabled={usedLifelines.includes("contexto") || phase !== "playing"} className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface px-2 py-3 text-[10px] font-extrabold disabled:opacity-40"><Lightbulb className="h-4 w-4 text-ancient" /> Contexto</button><button type="button" onClick={() => handleLifeline("consultar")} disabled={usedLifelines.includes("consultar") || phase !== "playing"} className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface px-2 py-3 text-[10px] font-extrabold disabled:opacity-40"><UsersRound className="h-4 w-4 text-sky-300" /> Consultar</button></section>{contextOpen && <p className="mt-3 rounded-2xl border border-ancient/25 bg-ancient/10 p-3 text-xs leading-relaxed text-muted-foreground">{question.explanation}</p>}{consultations && <section className="mt-4 rounded-3xl border border-sky-300/25 bg-gradient-to-br from-sky-400/10 via-surface to-surface p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300"><UsersRound className="h-5 w-5" /></span><div><p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-300">Conselho dos personagens</p><p className="mt-1 text-xs text-muted-foreground">Eles podem se enganar. Compare as opiniões.</p></div></div><div className="mt-4 space-y-2">{consultations.map((consultant) => <div key={consultant.name} className="rounded-2xl border border-border/70 bg-background/60 p-3"><div className="flex items-start gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-sm font-black ${consultant.tone}`}>{consultant.name.charAt(0)}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-sm font-extrabold">{consultant.name}</p><span className="text-[10px] font-bold text-muted-foreground">{consultant.confidence}</span></div><p className="text-[10px] text-muted-foreground">{consultant.role}</p><p className="mt-2 text-xs font-bold text-foreground">“Eu escolheria: {consultant.answer}”</p></div></div></div>)}</div><p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">Use a consulta como apoio, mas confira a resposta no texto bíblico e no contexto.</p></section>}{phase === "answered" && <section className={`game-answer-feedback mt-4 rounded-3xl border p-5 ${isCorrect ? "border-success/40 bg-success/10" : "border-red-400/40 bg-red-400/10"}`}><p className="font-extrabold">{isCorrect ? "Resposta correta!" : "A resposta correta era: " + question.answer}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{question.explanation}</p><p className="mt-3 text-[11px] font-bold text-primary">{question.reference}</p><div className="mt-4 flex gap-2"><Link to="/biblia" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-3 py-3 text-xs font-bold"><HelpCircle className="h-4 w-4" /> Ler contexto</Link><button type="button" onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-3 text-xs font-extrabold text-primary-foreground">{index + 1 >= questions.length ? "Resultado" : "Próxima"}<ArrowRight className="h-4 w-4" /></button></div></section>}</div></main>;
}

function Setup({ difficulty, onDifficultyChange, rounds, onRoundsChange, onStart }: { difficulty: MillionDifficulty; onDifficultyChange: (value: MillionDifficulty) => void; rounds: number; onRoundsChange: (value: number) => void; onStart: () => void }) { return <main className="game-play-page min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><header className="mt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Conhecimento em progressão</p><h1 className="mt-1 text-3xl font-extrabold">Quiz do Milhão</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Suba pelos títulos do conhecimento bíblico, preserve seu combo e enfrente o Desafio Bereano.</p></header><section className="mt-8 rounded-[1.75rem] border border-border bg-surface p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Escolha seu nível</p><div className="mt-3 grid grid-cols-2 gap-2">{(Object.entries(MILLION_DIFFICULTY) as [MillionDifficulty, { label: string; description: string }][]).map(([key, item]) => <button type="button" key={key} onClick={() => onDifficultyChange(key)} className={`rounded-2xl border p-3 text-left transition-all ${difficulty === key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background/40"}`}><span className="block text-sm font-extrabold">{item.label}</span><span className="mt-1 block text-[10px] leading-relaxed text-muted-foreground">{item.description}</span></button>)}</div><div className="mt-6 space-y-3">{MILLION_LEVELS.map((item, index) => <div key={item.title} className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${index === MILLION_LEVELS.length - 1 ? "bg-ancient/15 text-ancient" : "bg-primary/10 text-primary"}`}><Trophy className="h-4 w-4" /></span><span className="flex-1 text-sm font-extrabold">{item.title}</span><span className="text-[10px] font-bold text-muted-foreground">{item.points} pts</span></div>)}</div><div className="mt-6"><div className="flex items-center justify-between"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Número de rodadas</p><span className="text-xs font-bold text-primary">{rounds} rodadas</span></div><div className="mt-3 grid grid-cols-5 gap-2">{roundOptions.map((option) => <button type="button" key={option} onClick={() => onRoundsChange(option)} className={`rounded-2xl border py-3 text-sm font-extrabold ${rounds === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-background/40 text-muted-foreground"}`}>{option}</button>)}</div></div><button type="button" onClick={onStart} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">Começar desafio <ArrowRight className="h-4 w-4" /></button></section></div></main>; }

function Results({ score, correct, rounds, bestStreak, weakness, onRestart }: { score: number; correct: number; rounds: number; bestStreak: number; weakness: Record<string, { correct: number; total: number }>; onRestart: () => void }) { const weakCategory = Object.entries(weakness).sort(([, first], [, second]) => first.correct / first.total - second.correct / second.total)[0]?.[0]; return <main className="game-play-page min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-10 text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ancient/15 text-ancient"><Trophy className="h-10 w-10" /></span><p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Desafio concluído</p><h1 className="mt-2 text-3xl font-extrabold">Conhecimento acumulado</h1><div className="mt-7 rounded-[1.75rem] border border-border bg-surface p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Pontuação final</p><p className="mt-2 text-5xl font-black text-ancient">{score}</p><div className="mt-6 grid grid-cols-2 gap-3"><div><p className="text-xl font-black">{correct}/{rounds}</p><p className="text-[10px] text-muted-foreground">acertos</p></div><div><p className="text-xl font-black">{bestStreak}</p><p className="text-[10px] text-muted-foreground">maior combo</p></div></div></div>{weakCategory && <p className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-left text-xs leading-relaxed text-muted-foreground">Seu próximo desafio vai reforçar <span className="font-bold text-foreground">{weakCategory}</span> sem deixar de testar seus pontos fortes.</p>}<div className="mt-6 flex gap-3"><a href="/jogos/milhao" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Tela inicial</a><button type="button" onClick={onRestart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Jogar de novo</button></div></div></main>; }
