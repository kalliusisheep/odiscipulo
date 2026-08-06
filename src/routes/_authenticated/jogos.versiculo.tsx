import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock3, Flame, RotateCcw, Sparkles, Trophy, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BIBLICAL_VERSES, VERSE_DIFFICULTY, versesForDifficulty } from "@/data/biblical-verses";
import type { GameDifficulty } from "@/data/biblical-characters";

export const Route = createFileRoute("/_authenticated/jogos/versiculo")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "multi" ? "multi" : "single",
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
  }),
  component: VersiculoPage,
});

type Phase = "setup" | "answering" | "answered" | "finished";
type RoundResult = { correct: boolean; points: number; elapsed: number };
const difficultyOptions: GameDifficulty[] = ["facil", "medio", "dificil", "bereano"];
const roundOptions = [5, 10, 20, 30];
const ROUND_SECONDS = 18;

function playTone(success: boolean) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const AudioContextConstructor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = success ? 660 : 220;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.24);
  } catch { /* áudio é um aprimoramento, não bloqueia a partida */ }
}

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }

function VersiculoPage() {
  const { mode, roomId } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<GameDifficulty>("medio");
  const [rounds, setRounds] = useState(10);
  const [questions, setQuestions] = useState<typeof BIBLICAL_VERSES>([]);
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [lastPoints, setLastPoints] = useState(0);
  const startedAtRef = useRef(0);
  const question = questions[round];
  const meta = VERSE_DIFFICULTY[difficulty];

  const prepareRound = useCallback((index: number, list = questions) => {
    const current = list[index];
    if (!current) return;
    setOptions(shuffle([current.reference, ...current.alternatives]));
    setSelected(null); setTimeLeft(ROUND_SECONDS); startedAtRef.current = Date.now(); setPhase("answering");
  }, [questions]);

  const start = () => {
    const pool = versesForDifficulty(difficulty);
    const fallbackPool = pool.length >= rounds ? pool : [...pool, ...BIBLICAL_VERSES.filter((item) => item.difficulty !== "bereano")];
    const list = Array.from({ length: rounds }, (_, index) => shuffle(fallbackPool)[index % fallbackPool.length]);
    setQuestions(list); setRound(0); setScore(0); setStreak(0); setBestStreak(0); setResults([]); setLastPoints(0);
    setOptions(shuffle([list[0].reference, ...list[0].alternatives])); setSelected(null); setTimeLeft(ROUND_SECONDS); startedAtRef.current = Date.now(); setPhase("answering");
  };

  const answer = useCallback((value: string | null) => {
    if (phase !== "answering" || !question) return;
    const correct = value === question.reference;
    const elapsed = Math.min(ROUND_SECONDS, Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)));
    const nextStreak = correct ? streak + 1 : 0;
    const speedBonus = correct ? Math.max(0, timeLeft * 6) : 0;
    const comboBonus = correct ? Math.min(100, streak * 20) : 0;
    const points = correct ? Math.round(100 * meta.multiplier + speedBonus + comboBonus) : 0;
    setSelected(value); setLastPoints(points); setScore((valueScore) => valueScore + points); setStreak(nextStreak); setBestStreak((valueBest) => Math.max(valueBest, nextStreak)); setResults((items) => [...items, { correct, points, elapsed }]); setPhase("answered"); playTone(correct); navigator.vibrate?.(correct ? [18, 35, 18] : 60);
  }, [meta.multiplier, phase, question, streak, timeLeft]);

  useEffect(() => {
    if (phase !== "answering") return;
    const timer = window.setInterval(() => setTimeLeft((value) => {
      if (value <= 1) { window.clearInterval(timer); answer(null); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [answer, phase]);

  const next = () => {
    if (round + 1 >= rounds) { setPhase("finished"); return; }
    const nextRound = round + 1; setRound(nextRound); prepareRound(nextRound); 
  };

  if (phase === "setup") return <Setup mode={mode} difficulty={difficulty} setDifficulty={setDifficulty} rounds={rounds} setRounds={setRounds} onStart={start} />;
  if (phase === "finished") return <Results score={score} rounds={rounds} bestStreak={bestStreak} results={results} onRestart={() => setPhase("setup")} />;
  if (!question) return null;
  const correct = selected === question.reference;
  const progress = ((round + (phase === "answered" ? 1 : 0)) / rounds) * 100;

  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5">
    <header className="flex items-center justify-between"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><div className="flex items-center gap-2"><span className="rounded-full bg-ancient/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ancient">{mode === "multi" ? "Sala" : "Solo"}</span><div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-extrabold"><Trophy className="h-3.5 w-3.5 text-ancient" /> {score}</div></div></header>
    <div className="mt-6 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Qual é o versículo?</p><h1 className="mt-1 text-2xl font-extrabold">Encontre a referência</h1></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${meta.multiplier > 1.5 ? "bg-purple-500/15 text-purple-300" : "bg-primary/10 text-primary"}`}>{meta.label}</span></div>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary to-ancient transition-all" style={{ width: `${progress}%` }} /></div>
    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-muted-foreground"><span>Rodada {round + 1} de {rounds}</span><span className="inline-flex items-center gap-1 text-ancient"><Flame className="h-3.5 w-3.5" /> {streak} combo</span></div>
    <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-xl shadow-primary/5"><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">Passagem sem referência</span><span className={`inline-flex items-center gap-1.5 text-sm font-black ${timeLeft <= 5 ? "text-red-400" : "text-foreground"}`}><Clock3 className="h-4 w-4" /> {timeLeft}s</span></div><p className="mt-6 font-serif text-xl leading-[1.75] text-foreground">“{question.text}”</p><div className="mt-5 flex items-center gap-2 text-[10px] text-muted-foreground"><Volume2 className="h-3.5 w-3.5" /> Escolha rapidamente a referência correta</div></section>
    <section className="mt-4 space-y-2.5">{options.map((option, index) => { const isSelected = selected === option; const isCorrect = phase === "answered" && option === question.reference; const isWrong = phase === "answered" && isSelected && !correct; return <button key={option} type="button" onClick={() => answer(option)} disabled={phase !== "answering"} aria-pressed={isSelected} className={`group flex w-full items-center gap-3 rounded-2xl border p-4 text-left text-sm font-extrabold transition-all ${isCorrect ? "border-success bg-success/10 text-success" : isWrong ? "border-red-400/50 bg-red-400/10 text-red-300" : isSelected ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface hover:-translate-y-0.5 hover:border-primary/50"}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/70 text-xs font-black text-muted-foreground">{String.fromCharCode(65 + index)}</span><span className="flex-1">{option}</span>{isCorrect && <Check className="h-5 w-5" />}{isWrong && <X className="h-5 w-5" />}</button>; })}</section>
    {phase === "answered" && <section className={`mt-4 animate-slide-up rounded-3xl border p-5 ${correct ? "border-success/40 bg-success/10" : "border-red-400/40 bg-red-400/10"}`}><div className="flex items-start gap-3"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${correct ? "bg-success/15 text-success" : "bg-red-400/15 text-red-300"}`}>{correct ? <Check /> : <X />}</span><div className="min-w-0 flex-1"><p className="font-extrabold">{correct ? `Excelente! +${lastPoints} pontos` : "Quase! Continue estudando"}</p><p className="mt-1 text-sm font-bold">{question.reference}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{question.context}</p></div></div><div className="mt-4 flex gap-2"><Link to="/biblia" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-background/50 px-3 py-3 text-xs font-bold"><Sparkles className="h-4 w-4 text-primary" /> Ler contexto</Link><button type="button" onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-3 py-3 text-xs font-extrabold text-primary-foreground">{round + 1 >= rounds ? "Resultado" : "Próxima"}<ArrowRight className="h-4 w-4" /></button></div></section>}
  </div></main>;
}

function Setup({ difficulty, setDifficulty, rounds, setRounds, onStart }: { difficulty: GameDifficulty; setDifficulty: (value: GameDifficulty) => void; rounds: number; setRounds: (value: number) => void; onStart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><header className="mt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">{mode === "multi" ? "Partida em sala" : "Novo desafio"}</p><h1 className="mt-1 text-3xl font-extrabold">Qual é o versículo?</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">A referência desapareceu. Você tem poucos segundos para reconhecer a passagem e manter seu combo.</p></header><section className="mt-8 space-y-6 rounded-[1.75rem] border border-border bg-surface p-5"><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Escolha a dificuldade</p><div className="mt-3 grid grid-cols-2 gap-2">{difficultyOptions.map((option) => <button key={option} type="button" onClick={() => setDifficulty(option)} className={`rounded-2xl border px-3 py-3 text-left transition ${difficulty === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}><span className="block text-sm font-extrabold">{VERSE_DIFFICULTY[option].label}</span><span className="mt-1 block text-[10px] leading-snug opacity-75">{VERSE_DIFFICULTY[option].description}</span></button>)}</div></div><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Número de rodadas</p><div className="mt-3 grid grid-cols-4 gap-2">{roundOptions.map((option) => <button key={option} type="button" onClick={() => setRounds(option)} className={`rounded-2xl border py-3 text-sm font-extrabold ${rounds === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{option}</button>)}</div></div>{mode === "multi" && <div className="rounded-2xl border border-ancient/25 bg-ancient/10 p-3 text-xs leading-relaxed text-muted-foreground">Todos os jogadores da sala receberão a mesma passagem e o mesmo cronômetro. Sala: <span className="font-mono text-foreground">{roomId?.slice(0, 8) ?? "—"}</span></div>}<button type="button" onClick={onStart} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">Começar partida <ArrowRight className="h-4 w-4" /></button></section></div></main>;
}

function Results({ score, rounds, bestStreak, results, onRestart }: { score: number; rounds: number; bestStreak: number; results: RoundResult[]; onRestart: () => void }) {
  const correct = results.filter((item) => item.correct).length;
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-10 text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ancient/15 text-ancient"><Trophy className="h-10 w-10" /></span><p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Partida encerrada</p><h1 className="mt-2 text-3xl font-extrabold">Seu placar</h1><p className="mt-2 text-sm text-muted-foreground">Você manteve a Palavra no centro da competição.</p><section className="mt-7 rounded-[1.75rem] border border-border bg-surface p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Pontuação final</p><p className="mt-2 text-5xl font-black text-ancient">{score}</p><div className="mt-6 grid grid-cols-3 gap-2 text-center"><div><p className="text-xl font-black">{correct}/{rounds}</p><p className="text-[10px] text-muted-foreground">acertos</p></div><div><p className="text-xl font-black">{bestStreak}</p><p className="text-[10px] text-muted-foreground">maior combo</p></div><div><p className="text-xl font-black">{Math.round(results.reduce((sum, item) => sum + item.elapsed, 0) / Math.max(1, results.length))}s</p><p className="text-[10px] text-muted-foreground">média</p></div></div></section><div className="mt-6 flex gap-3"><Link to="/jogos" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Jogos</Link><button type="button" onClick={onRestart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Jogar de novo</button></div></div></main>;
}
