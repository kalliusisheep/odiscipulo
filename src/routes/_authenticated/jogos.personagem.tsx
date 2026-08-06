import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Flame, Lightbulb, RotateCcw, Sparkles, Trophy, X, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameModeChooser } from "@/components/games/GameModeChooser";
import { SharedQuestionGame } from "@/components/games/SharedQuestionGame";
import { BIBLICAL_CHARACTERS, CHARACTER_DIFFICULTY, isCorrectCharacterAnswer, type BiblicalCharacter, type GameDifficulty } from "@/data/biblical-characters";
import { playGameSfx, startGameMusic } from "@/lib/game-audio";
import { shuffleWithSeed } from "@/lib/seeded-random";
import { recordGameResult } from "@/lib/game-leaderboard";

export const Route = createFileRoute("/_authenticated/jogos/personagem")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "multi" ? "multi" : "single",
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
    seed: typeof search.seed === "string" && Number.isFinite(Number(search.seed)) ? Number(search.seed) : undefined,
    difficulty: ["facil", "medio", "dificil", "bereano"].includes(String(search.difficulty)) ? String(search.difficulty) : "medio",
    rounds: typeof search.rounds === "string" && Number.isFinite(Number(search.rounds)) ? Number(search.rounds) : 10,
  }),
  component: PersonagemPage,
});

type Phase = "setup" | "playing" | "round-result" | "finished";

const roundOptions = [5, 10, 20, 30];
const difficultyOptions: GameDifficulty[] = ["facil", "medio", "dificil", "bereano"];
const difficultyIcons = { facil: Zap, medio: Sparkles, dificil: Flame, bereano: Trophy } satisfies Record<GameDifficulty, typeof Zap>;

const formatFirstHint = (hint: string) => {
  const text = hint.trim();
  if (/^esse personagem/i.test(text)) return text;
  if (/^(quem|qual|na |com |antes |depois |era |trabalhava |recebeu |foi |se tornou )/i.test(text)) return text;
  return `Esse personagem... ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
};

function PersonagemPage() {
  const { mode, roomId, seed, difficulty: initialDifficulty, rounds: initialRounds } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>("setup");
  const [modeSelected, setModeSelected] = useState(mode === "multi");
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initialDifficulty as GameDifficulty);
  const [rounds, setRounds] = useState(initialRounds);
  const [queue, setQueue] = useState<BiblicalCharacter[]>([]);
  const [round, setRound] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const sessionSeenRef = useRef<Set<string>>(new Set());
  const character = queue[round];
  const difficultyData = CHARACTER_DIFFICULTY[difficulty];
  const orderedHints = useMemo(() => {
    if (!character) return [] as string[];
    const order = difficulty === "bereano" ? [2, 3, 1, 0] : difficulty === "dificil" ? [1, 2, 3, 0] : [0, 1, 2, 3];
    return order.map((index) => character.hints[index]);
  }, [character, difficulty]);
  const firstHint = orderedHints[0] ? formatFirstHint(orderedHints[0]) : "";

  const filteredCharacters = useMemo(
    () => BIBLICAL_CHARACTERS.filter((item) => item.difficulty === difficulty),
    [difficulty],
  );

  const start = () => {
    startGameMusic("character");
    playGameSfx("start");
    const shuffled = seed ? shuffleWithSeed(filteredCharacters, seed) : [...filteredCharacters].sort(() => Math.random() - 0.5);
    const recentKey = `character_recent_questions_${difficulty}`;
    const recentIds = JSON.parse(window.localStorage.getItem(recentKey) ?? "[]") as string[];
    const sessionCandidates = shuffled.filter((item) => !sessionSeenRef.current.has(item.id));
    const fresh = sessionCandidates.filter((item) => !recentIds.includes(item.id));
    const selected = [...fresh, ...sessionCandidates]
      .filter((item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index)
      .slice(0, rounds);
    selected.forEach((item) => sessionSeenRef.current.add(item.id));
    window.localStorage.setItem(recentKey, JSON.stringify([...new Set([...recentIds, ...selected.map((item) => item.id)])].slice(-Math.max(rounds * 5, 40))));
    setQueue(selected);
    setRound(0);
    setScore(0);
    setStreak(0);
    setRevealed([0]);
    setAnswer("");
    setCorrect(null);
    setPhase("playing");
  };

  const revealHint = (hintIndex: number) => {
    if (revealed.includes(hintIndex)) return;
    playGameSfx("reveal");
    setRevealed((items) => [...items, hintIndex]);
  };

  const submit = () => {
    if (!character || !answer.trim() || correct !== null) return;
    const isCorrect = isCorrectCharacterAnswer(character, answer);
    playGameSfx(isCorrect ? "success" : "error");
    const extraHints = Math.max(0, revealed.length - 1);
    const base = Math.max(0, 100 - extraHints * 40);
    const earned = isCorrect ? Math.round(base * difficultyData.multiplier) : 0;
    setRoundScore(earned);
    setScore((value) => value + earned);
    setStreak((value) => (isCorrect ? value + 1 : 0));
    setCorrect(isCorrect);
    setPhase("round-result");
  };

  const next = () => {
    if (round + 1 >= rounds) {
      playGameSfx("complete");
      setPhase("finished");
      return;
    }
    setRound((value) => value + 1);
    playGameSfx("tap");
    setRevealed([0]);
    setAnswer("");
    setCorrect(null);
    setRoundScore(0);
    setPhase("playing");
  };

  const scoreSaved = useRef(false);
  useEffect(() => {
    if (phase !== "finished" || scoreSaved.current) return;
    scoreSaved.current = true;
    void recordGameResult({ gameKey: "personagem", score, rounds });
  }, [phase, rounds, score]);

  if (phase === "setup" && !modeSelected) {
    return <GameModeChooser title="Quem é o personagem?" heroImage="/game-quem-e-o-personagem.jpeg" heroImageAlt="Ovelha apresentando o jogo Quem é o personagem?" description="Escolha uma experiência rápida para testar sua memória bíblica ou reúna seus amigos para uma disputa em sala." onBack={() => window.history.back()} onSinglePlayer={() => setModeSelected(true)} onMultiplayer={() => { window.location.href = "/jogos/multiplayer?game=personagem"; }} />;
  }

  if (mode === "multi" && roomId) {
    return <SharedQuestionGame gameType="personagem" roomId={roomId} seed={seed} difficulty={difficulty} rounds={rounds} />;
  }

  if (phase === "setup") {
    return <Setup difficulty={difficulty} setDifficulty={setDifficulty} rounds={rounds} setRounds={setRounds} onStart={start} />;
  }

  if (phase === "finished") {
    return <Finished score={score} rounds={rounds} onRestart={() => { setModeSelected(false); setPhase("setup"); }} />;
  }

  if (!character) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <header className="flex items-center justify-between">
          <Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link>
          <div className="flex items-center gap-2">
            {streak > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-ancient/10 px-3 py-1 text-xs font-extrabold text-ancient"><Flame className="h-3.5 w-3.5" /> {streak}x combo</span>}
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Rodada {round + 1}/{rounds}</span>
          </div>
        </header>

        <div className="mt-6 flex items-end justify-between">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Quem é o personagem?</p><h1 className="mt-1 text-2xl font-extrabold">Descubra pela pista :)</h1></div>
          <div className="text-right"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pontuação</p><p className="text-2xl font-black text-ancient">{score}</p></div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-ancient transition-all" style={{ width: `${((round + (phase === "round-result" ? 1 : 0)) / rounds) * 100}%` }} /></div>

        <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-primary/30 bg-gradient-to-br from-primary/20 via-surface to-surface p-5 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/15"><Lightbulb className="h-4 w-4" /></span> Pista inicial</span><span className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-extrabold uppercase text-success">Grátis</span></div>
          <p className="mt-4 text-base font-semibold leading-relaxed text-foreground">{firstHint}</p>
          <p className="mt-3 text-[11px] font-medium text-muted-foreground">Comece pelo que você já sabe. As pistas extras reduzem a pontuação.</p>
        </section>

        <section className="mt-4 rounded-[1.75rem] border border-border bg-surface p-5 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Desbloqueie mais pistas</p><p className="mt-1 text-xs text-muted-foreground">Quanto menos ajuda, maior o desafio.</p></div><span className={`rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-extrabold uppercase ${difficultyData.tone}`}>{difficultyData.label} · {difficultyData.multiplier}x</span></div>
          <div className="mt-4 space-y-3">{orderedHints.slice(1).map((hint, offset) => { const index = offset + 1; const isRevealed = revealed.includes(index); return <div key={hint} className={`rounded-2xl border p-4 transition-colors ${isRevealed ? "border-primary/30 bg-primary/5" : "border-border/70 bg-background/50"}`}>{isRevealed ? <div className="flex gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Check className="h-4 w-4" /></span><p className="text-sm leading-relaxed">{hint}</p></div> : <button type="button" onClick={() => revealHint(index)} className="flex w-full items-center gap-3 text-left text-sm font-bold text-muted-foreground hover:text-foreground"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Lightbulb className="h-4 w-4" /></span><span>Pista {index + 1}</span><span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-primary">Revelar <ArrowRight className="h-3.5 w-3.5" /></span></button>}</div>; })}</div>
        </section>

        <section className="mt-4 rounded-[1.5rem] border border-border bg-surface/70 p-4"><label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground" htmlFor="answer">Sua resposta</label><div className="mt-2 flex gap-2"><input id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} disabled={phase !== "playing"} placeholder="Digite o nome do personagem" className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" /><button type="button" onClick={submit} disabled={!answer.trim()} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50"><Check className="h-5 w-5" /></button></div><p className="mt-3 text-[11px] text-muted-foreground">Digite e confirme. A resposta certa encerra a rodada.</p></section>

        {phase === "round-result" && <section className={`mt-4 rounded-3xl border p-5 shadow-lg ${correct ? "border-success/40 bg-success/10 shadow-success/5" : "border-ancient/40 bg-ancient/10 shadow-ancient/5"}`}><div className="flex items-start gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${correct ? "bg-success/15 text-success" : "bg-ancient/15 text-ancient"}`}>{correct ? <Check /> : <X />}</span><div className="min-w-0 flex-1"><p className="font-extrabold">{correct ? `Acertou! +${roundScore} pontos` : `A resposta era ${character.name}`}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{character.summary}</p><p className="mt-3 text-[11px] font-bold text-muted-foreground">Referências: {character.references.join(" · ")}</p></div></div><button type="button" onClick={next} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground">{round + 1 >= rounds ? "Ver resultado" : "Próxima rodada"}<ArrowRight className="h-4 w-4" /></button></section>}
      </div>

    </main>
  );
}

function Setup({ difficulty, setDifficulty, rounds, setRounds, onStart }: { difficulty: GameDifficulty; setDifficulty: (value: GameDifficulty) => void; rounds: number; setRounds: (value: number) => void; onStart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><section className="relative mt-6 overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/25 via-surface to-surface p-6 shadow-xl shadow-primary/10"><div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" /><div className="relative"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"><Sparkles className="h-6 w-6" /></span><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Novo desafio</p><p className="mt-1 text-xs font-semibold text-muted-foreground">Arena da memória bíblica</p></div></div><h1 className="mt-6 text-3xl font-black tracking-tight">Quem é o personagem?</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Leia as pistas, arrisque sua resposta e suba no placar a cada acerto.</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-background/60 px-3 py-1.5 text-xs font-bold text-muted-foreground">4 pistas por rodada</span><span className="rounded-full bg-background/60 px-3 py-1.5 text-xs font-bold text-muted-foreground">Até 2x pontos</span></div></div></section><section className="mt-4 space-y-6 rounded-[1.75rem] border border-border bg-surface p-5 shadow-lg shadow-black/10"><div><div className="flex items-end justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Escolha sua intensidade</p><p className="mt-1 text-xs text-muted-foreground">Mais difícil, mais pontos.</p></div><Trophy className="h-5 w-5 text-ancient" /></div><div className="mt-3 grid grid-cols-2 gap-2">{difficultyOptions.map((option) => { const Icon = difficultyIcons[option]; return <button key={option} type="button" onClick={() => setDifficulty(option)} className={`group rounded-2xl border px-3 py-3 text-left transition ${difficulty === option ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10" : "border-border text-muted-foreground hover:border-primary/40"}`}><span className="flex items-center justify-between"><Icon className="h-5 w-5" /><span className="text-[10px] font-bold opacity-70">{CHARACTER_DIFFICULTY[option].multiplier}x</span></span><span className="mt-2 block text-sm font-extrabold">{CHARACTER_DIFFICULTY[option].label}</span><span className="mt-1 block text-[10px] font-medium opacity-70">pontos por acerto</span></button>; })}</div></div><div><div className="flex items-end justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Tamanho da partida</p><p className="mt-1 text-xs text-muted-foreground">Escolha o ritmo da sua jornada.</p></div><span className="text-xs font-bold text-primary">{rounds} rodadas</span></div><div className="mt-3 grid grid-cols-4 gap-2">{roundOptions.map((option) => <button key={option} type="button" onClick={() => setRounds(option)} className={`rounded-2xl border py-3 text-sm font-extrabold transition ${rounds === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>{option}<span className="mt-1 block text-[9px] font-medium opacity-70">{option === 5 ? "rápida" : option === 30 ? "épica" : "rodadas"}</span></button>)}</div></div><button type="button" onClick={onStart} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-4 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"><Sparkles className="h-4 w-4" /> Entrar na arena <ArrowRight className="h-4 w-4" /></button></section></div></main>;
}

function Finished({ score, rounds, onRestart }: { score: number; rounds: number; onRestart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-12 text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ancient/15 text-ancient"><Trophy className="h-10 w-10" /></span><p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Desafio concluído</p><h1 className="mt-2 text-3xl font-extrabold">Boa caminhada!</h1><p className="mt-3 text-sm text-muted-foreground">Você completou {rounds} rodadas.</p><div className="mt-8 rounded-[1.75rem] border border-border bg-surface p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Pontuação final</p><p className="mt-2 text-5xl font-black text-ancient">{score}</p><p className="mt-2 text-xs text-muted-foreground">Continue estudando e tente superar sua marca.</p></div><div className="mt-6 flex gap-3"><Link to="/jogos/personagem" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Tela inicial</Link><button type="button" onClick={onRestart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Jogar de novo</button></div></div></main>;
}
