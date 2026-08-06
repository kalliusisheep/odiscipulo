import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Eye, Lightbulb, RotateCcw, Trophy, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BIBLICAL_CHARACTERS, CHARACTER_DIFFICULTY, isCorrectCharacterAnswer, type BiblicalCharacter, type GameDifficulty } from "@/data/biblical-characters";

export const Route = createFileRoute("/_authenticated/jogos/personagem")({ component: PersonagemPage });

type Phase = "setup" | "playing" | "round-result" | "finished";
const roundOptions = [5, 10, 20, 30];
const difficultyOptions: GameDifficulty[] = ["facil", "medio", "dificil", "bereano"];

function PersonagemPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<GameDifficulty>("medio");
  const [rounds, setRounds] = useState(10);
  const [queue, setQueue] = useState<BiblicalCharacter[]>([]);
  const [round, setRound] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [pendingHint, setPendingHint] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const character = queue[round];
  const difficultyData = CHARACTER_DIFFICULTY[difficulty];

  const filteredCharacters = useMemo(() => BIBLICAL_CHARACTERS.filter((item) => item.difficulty === difficulty || difficulty === "bereano" || item.difficulty !== "bereano"), [difficulty]);

  const start = () => {
    const shuffled = [...filteredCharacters].sort(() => Math.random() - 0.5);
    const selected = Array.from({ length: rounds }, (_, index) => shuffled[index % shuffled.length]);
    setQueue(selected); setRound(0); setScore(0); setRevealed([]); setAnswer(""); setCorrect(null); setPhase("playing");
  };

  const revealHint = () => {
    if (pendingHint === null || revealed.includes(pendingHint)) return;
    setRevealed((items) => [...items, pendingHint]); setPendingHint(null);
  };

  const submit = () => {
    if (!character || !answer.trim() || correct !== null) return;
    const isCorrect = isCorrectCharacterAnswer(character, answer);
    const base = Math.max(0, 100 - revealed.length * 40);
    const earned = isCorrect ? Math.round(base * difficultyData.multiplier) : 0;
    setRoundScore(earned); setScore((value) => value + earned); setCorrect(isCorrect); setPhase("round-result");
  };

  const next = () => {
    if (round + 1 >= rounds) { setPhase("finished"); return; }
    setRound((value) => value + 1); setRevealed([]); setAnswer(""); setCorrect(null); setRoundScore(0); setPhase("playing");
  };

  if (phase === "setup") return <Setup difficulty={difficulty} setDifficulty={setDifficulty} rounds={rounds} setRounds={setRounds} onStart={start} />;
  if (phase === "finished") return <Finished score={score} rounds={rounds} onRestart={() => setPhase("setup")} />;
  if (!character) return null;

  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5">
    <header className="flex items-center justify-between"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Rodada {round + 1}/{rounds}</span></header>
    <div className="mt-6 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Quem é o personagem?</p><h1 className="mt-1 text-2xl font-extrabold">Descubra pela pista</h1></div><div className="text-right"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pontuação</p><p className="text-xl font-black text-ancient">{score}</p></div></div>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary to-ancient transition-all" style={{ width: `${((round + (phase === "round-result" ? 1 : 0)) / rounds) * 100}%` }} /></div>
    <section className="mt-6 rounded-[1.75rem] border border-border bg-surface p-5 shadow-lg shadow-black/10"><div className="flex items-center justify-between"><span className={`rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${difficultyData.tone}`}>{difficultyData.label}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground"><Trophy className="h-3.5 w-3.5 text-ancient" /> {difficultyData.multiplier}x</span></div><div className="mt-5 space-y-3">{character.hints.map((hint, index) => { const isRevealed = revealed.includes(index); return <div key={hint} className={`rounded-2xl border p-4 transition-colors ${isRevealed ? "border-primary/30 bg-primary/5" : "border-border/70 bg-background/50"}`}>{isRevealed ? <p className="text-sm leading-relaxed">{hint}</p> : <button type="button" onClick={() => setPendingHint(index)} className="flex w-full items-center gap-3 text-left text-sm font-bold text-muted-foreground hover:text-foreground"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Lightbulb className="h-4 w-4" /></span>Pista {index + 1}<span className="ml-auto text-xs font-medium">Revelar</span></button>}</div>; })}</div></section>
    <section className="mt-4 rounded-[1.5rem] border border-border bg-surface/70 p-4"><label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground" htmlFor="answer">Sua resposta</label><div className="mt-2 flex gap-2"><input id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} disabled={phase !== "playing"} placeholder="Digite o nome do personagem" className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /><button type="button" onClick={submit} disabled={!answer.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"><Check className="h-5 w-5" /></button></div><p className="mt-3 text-[11px] text-muted-foreground">Use uma pista por vez. Quanto menos pistas, maior a pontuação.</p></section>
    {phase === "round-result" && <section className={`mt-4 rounded-3xl border p-5 ${correct ? "border-success/40 bg-success/10" : "border-ancient/40 bg-ancient/10"}`}><div className="flex items-start gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${correct ? "bg-success/15 text-success" : "bg-ancient/15 text-ancient"}`}>{correct ? <Check /> : <X />}</span><div className="min-w-0 flex-1"><p className="font-extrabold">{correct ? `Acertou! +${roundScore} pontos` : `A resposta era ${character.name}`}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{character.summary}</p><p className="mt-3 text-[11px] font-bold text-muted-foreground">Referências: {character.references.join(" · ")}</p></div></div><button type="button" onClick={next} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground">{round + 1 >= rounds ? "Ver resultado" : "Próxima rodada"}<ArrowRight className="h-4 w-4" /></button></section>}
  </div>{pendingHint !== null && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"><div className="w-full max-w-md rounded-[1.75rem] border border-border bg-surface p-6 shadow-2xl"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Eye className="h-5 w-5" /></span><div><h2 className="font-extrabold">Revelar esta pista?</h2><p className="text-xs text-muted-foreground">A pontuação máxima desta rodada vai diminuir.</p></div></div><div className="mt-5 flex gap-3"><button type="button" onClick={() => setPendingHint(null)} className="flex-1 rounded-2xl border border-border px-4 py-3 text-sm font-bold">Agora não</button><button type="button" onClick={revealHint} className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground">Revelar pista</button></div></div></div>}</main>;
}

function Setup({ difficulty, setDifficulty, rounds, setRounds, onStart }: { difficulty: GameDifficulty; setDifficulty: (value: GameDifficulty) => void; rounds: number; setRounds: (value: number) => void; onStart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><div className="mt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Novo desafio</p><h1 className="mt-1 text-3xl font-extrabold">Quem é o personagem?</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Leia as pistas, escreva sua resposta e descubra quanto você sabe da Bíblia.</p></div><section className="mt-8 space-y-6 rounded-[1.75rem] border border-border bg-surface p-5"><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Dificuldade</p><div className="mt-3 grid grid-cols-2 gap-2">{difficultyOptions.map((option) => <button key={option} type="button" onClick={() => setDifficulty(option)} className={`rounded-2xl border px-3 py-3 text-sm font-extrabold transition ${difficulty === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{CHARACTER_DIFFICULTY[option].label}<span className="mt-1 block text-[10px] font-medium opacity-70">{CHARACTER_DIFFICULTY[option].multiplier}x pontos</span></button>)}</div></div><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Rodadas</p><div className="mt-3 grid grid-cols-4 gap-2">{roundOptions.map((option) => <button key={option} type="button" onClick={() => setRounds(option)} className={`rounded-2xl border py-3 text-sm font-extrabold ${rounds === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{option}</button>)}</div></div><button type="button" onClick={onStart} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">Começar desafio <ArrowRight className="h-4 w-4" /></button></section></div></main>;
}

function Finished({ score, rounds, onRestart }: { score: number; rounds: number; onRestart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-12 text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ancient/15 text-ancient"><Trophy className="h-10 w-10" /></span><p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Desafio concluído</p><h1 className="mt-2 text-3xl font-extrabold">Boa caminhada!</h1><p className="mt-3 text-sm text-muted-foreground">Você completou {rounds} rodadas.</p><div className="mt-8 rounded-[1.75rem] border border-border bg-surface p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Pontuação final</p><p className="mt-2 text-5xl font-black text-ancient">{score}</p><p className="mt-2 text-xs text-muted-foreground">Continue estudando e tente superar sua marca.</p></div><div className="mt-6 flex gap-3"><Link to="/jogos" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Jogos</Link><button type="button" onClick={onRestart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Jogar de novo</button></div></div></main>;
}
