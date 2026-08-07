import { ArrowLeft, ArrowRight, Check, Clock3, Crown, Flame, Lightbulb, RotateCcw, Sparkles, Trophy, Users, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BIBLICAL_CHARACTER_ROUNDS, CHARACTER_DIFFICULTY, isCorrectCharacterAnswer, type BiblicalCharacter, type GameDifficulty } from "@/data/biblical-characters";
import { VERSE_DIFFICULTY, versesForDifficulty } from "@/data/biblical-verses";
import { MILLION_DIFFICULTY, randomMillionQuestions, randomMillionQuestionsWithSeed, type MillionDifficulty, type MillionQuestion } from "@/data/biblical-million";
import { playGameSfx, startGameMusic } from "@/lib/game-audio";
import { recordSharedGameResult } from "@/lib/game-leaderboard";
import { shuffleWithSeed } from "@/lib/seeded-random";
import { supabase } from "@/integrations/supabase/client";

type SharedGameType = "personagem" | "versiculo" | "milhao";
type SharedPhase = "loading" | "playing" | "answered" | "finished";

type SharedQuestion = {
  id: string;
  prompt: string;
  answer: string;
  options: string[];
  hints: string[];
  explanation: string;
  reference: string;
  category: string;
  isCharacter: boolean;
  character?: BiblicalCharacter;
};

type RoomRound = {
  id: string;
  room_id: string;
  round_number: number;
  character_id: string;
  hints: string[];
  revealed_hint_indexes: number[];
  status: "active" | "won" | "all_wrong" | "expired";
  winner_id: string | null;
  points_available: number;
  opened_at: string;
  closed_at: string | null;
};

type RoomPlayer = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
  state: string;
  score: number;
  correct_answers: number;
  best_streak: number;
  last_seen_at: string;
};

const gameLabels: Record<SharedGameType, string> = {
  personagem: "Quem é o personagem?",
  versiculo: "Qual é o versículo?",
  milhao: "Quiz do Milhão",
};

const gameDb = supabase as any;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function answerHash(value: string | null) {
  let hash = 2166136261;
  for (const char of normalize(value ?? "")) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash).toString(16);
}

function firstCharacterHint(value: string) {
  const text = value.trim();
  if (/^esse personagem/i.test(text)) return text;
  if (/^essa personagem/i.test(text)) return text.replace(/^essa personagem/i, "Esse personagem");
  if (/^a personagem/i.test(text)) return text.replace(/^a personagem/i, "Esse personagem");
  return "Esse personagem... " + text.charAt(0).toLowerCase() + text.slice(1);
}

function buildQuestions(gameType: SharedGameType, difficulty: GameDifficulty, seed: number) {
  if (gameType === "personagem") {
    const characters = BIBLICAL_CHARACTER_ROUNDS.filter((item) => item.difficulty === difficulty);
    const source = characters.length > 0 ? characters : BIBLICAL_CHARACTER_ROUNDS;
    const shuffled = seed ? shuffleWithSeed(source, seed) : [...source];
    return shuffled.map((item: BiblicalCharacter): SharedQuestion => {
      const order = difficulty === "bereano" ? [2, 3, 1, 0] : difficulty === "dificil" ? [1, 2, 3, 0] : [0, 1, 2, 3];
      const hints = order.map((index) => item.hints[index]);
      return {
        id: item.id,
        prompt: "Descubra o personagem pelas pistas.",
        answer: item.name,
        options: [],
        hints: [firstCharacterHint(hints[0]), ...hints.slice(1)],
        explanation: item.summary,
        reference: item.references.join(" · "),
        category: "Personagem bíblico",
        isCharacter: true,
        character: item,
      };
    });
  }

  if (gameType === "versiculo") {
    const verses = versesForDifficulty(difficulty);
    const shuffled = seed ? shuffleWithSeed(verses, seed) : [...verses];
    return shuffled.map((item): SharedQuestion => ({
      id: item.id,
      prompt: item.text,
      answer: item.reference,
      options: seed ? shuffleWithSeed([item.reference, ...item.alternatives], seed + item.id.length) : [item.reference, ...item.alternatives],
      hints: [],
      explanation: item.context,
      reference: item.reference,
      category: "Referência bíblica",
      isCharacter: false,
    }));
  }

  const millionDifficulty = difficulty as MillionDifficulty;
  const questions: MillionQuestion[] = seed
    ? randomMillionQuestionsWithSeed(millionDifficulty, 999, seed)
    : randomMillionQuestions(millionDifficulty, 999);
  return questions.map((item): SharedQuestion => ({
    id: item.id,
    prompt: item.prompt,
    answer: item.answer,
    options: seed ? shuffleWithSeed(item.options, seed + item.id.length) : item.options,
    hints: [],
    explanation: item.explanation,
    reference: item.reference,
    category: item.category,
    isCharacter: false,
  }));
}

function timeLimitFor(gameType: SharedGameType, difficulty: GameDifficulty) {
  if (gameType === "versiculo") return VERSE_DIFFICULTY[difficulty].timeLimit;
  if (gameType === "milhao") return MILLION_DIFFICULTY[difficulty].timeLimit;
  return 60;
}

function multiplierFor(gameType: SharedGameType, difficulty: GameDifficulty) {
  if (gameType === "versiculo") return VERSE_DIFFICULTY[difficulty].multiplier;
  if (gameType === "milhao") return MILLION_DIFFICULTY[difficulty].multiplier;
  return CHARACTER_DIFFICULTY[difficulty].multiplier;
}

function scoreFor(gameType: SharedGameType, difficulty: GameDifficulty, pointsAvailable: number, timeLeft: number, streak: number) {
  if (gameType === "personagem") return Math.round(pointsAvailable * multiplierFor(gameType, difficulty));
  return Math.round((100 + Math.max(0, timeLeft) * 6 + Math.min(100, streak * 20)) * multiplierFor(gameType, difficulty));
}

export function SharedQuestionGame({
  gameType,
  roomId,
  seed = 0,
  difficulty,
  rounds,
}: {
  gameType: SharedGameType;
  roomId: string;
  seed?: number;
  difficulty: GameDifficulty;
  rounds: number;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [remoteRound, setRemoteRound] = useState<RoomRound | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [phase, setPhase] = useState<SharedPhase>("loading");
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimitFor(gameType, difficulty));
  const [error, setError] = useState("");
  const resultSaved = useRef(false);
  const finishSoundPlayed = useRef(false);
  const questions = useMemo(() => buildQuestions(gameType, difficulty, seed), [difficulty, gameType, seed]);
  const question = questions[(roundNumber - 1) % Math.max(1, questions.length)];
  const timeLimit = timeLimitFor(gameType, difficulty);

  const loadPlayers = useCallback(async (currentUserId = userId) => {
    const { data } = await gameDb
      .from("character_game_room_players")
      .select("user_id,role,state,score,correct_answers,best_streak,last_seen_at")
      .eq("room_id", roomId)
      .not("state", "in", "(left,declined)");
    const rows = data ?? [];
    const ids = rows.map((row: { user_id: string }) => row.user_id);
    const profiles = ids.length
      ? (await gameDb.from("profiles").select("id,display_name,avatar_url").in("id", ids)).data ?? []
      : [];
    const profileMap = new Map<string, { id: string; display_name: string; avatar_url: string | null }>(
      profiles.map((profile: { id: string; display_name: string; avatar_url: string | null }) => [profile.id, profile] as const),
    );
    const nextPlayers = rows.map((row: RoomPlayer) => ({
      ...row,
      score: Number(row.score ?? 0),
      correct_answers: Number(row.correct_answers ?? 0),
      best_streak: Number(row.best_streak ?? 0),
      display_name: profileMap.get(row.user_id)?.display_name ?? "Jogador",
      avatar_url: profileMap.get(row.user_id)?.avatar_url ?? null,
    }));
    setPlayers(nextPlayers);
    const me = nextPlayers.find((player: { user_id: string }) => player.user_id === currentUserId);
    if (me) {
      setError("");
    }
    return nextPlayers;
  }, [roomId, userId]);

  const loadRound = useCallback(async () => {
    const { data, error: roundError } = await gameDb
      .from("character_game_rounds")
      .select("*")
      .eq("room_id", roomId)
      .eq("round_number", roundNumber)
      .maybeSingle();
    if (roundError) {
      setError("A sala ainda não está pronta. Tente entrar novamente.");
      return;
    }
    if (data) {
      const row = data as RoomRound;
      setRemoteRound(row);
      setPhase(row.status === "active" ? "playing" : "answered");
      setTimeLeft(Math.max(0, timeLimit - Math.floor((Date.now() - new Date(row.opened_at).getTime()) / 1000)));
      setAnswered(false);
      setSelected("");
    }
  }, [roomId, roundNumber, timeLimit]);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || cancelled) return;
      setUserId(auth.user.id);
      const { data: room } = await gameDb.from("character_game_rooms").select("status").eq("id", roomId).maybeSingle();
      if (!room || room.status === "cancelled") {
        setError("Esta sala não está disponível.");
        return;
      }
      await loadPlayers(auth.user.id);
      await loadRound();
      channel = supabase
        .channel("shared-round-" + roomId)
        .on("postgres_changes", { event: "*", schema: "public", table: "character_game_rounds", filter: "room_id=eq." + roomId }, (payload) => {
          const row = payload.new as RoomRound;
          if (row.round_number === roundNumber) {
            setRemoteRound(row);
            setPhase(row.status === "active" ? "playing" : "answered");
          }
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "character_game_room_players", filter: "room_id=eq." + roomId }, () => void loadPlayers())
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "character_game_rooms", filter: "id=eq." + roomId }, (payload) => {
          const row = payload.new as { status?: string };
          if (row.status === "finished") setPhase("finished");
        })
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setError("A conexão da sala foi interrompida. Tentando sincronizar novamente…");
          }
          if (status === "SUBSCRIBED") setError("");
        });
    })();
    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [loadPlayers, loadRound, roomId, roundNumber]);

  useEffect(() => {
    if (!userId || !question || phase === "finished") return;
    void (async () => {
      const { data, error: roundError } = await gameDb.rpc("ensure_character_game_round", {
        _room_id: roomId,
        _round_number: roundNumber,
        _character_id: question.id,
        _hints: question.hints,
        _answer_hash: answerHash(question.answer),
      });
      if (roundError || !data) {
        setError("Não foi possível preparar esta rodada. Aguarde a sincronização e tente novamente.");
        return;
      }
      setError("");
      setRemoteRound(data as RoomRound);
      setPhase(data.status === "active" ? "playing" : "answered");
      setTimeLeft(Math.max(0, timeLimit - Math.floor((Date.now() - new Date(data.opened_at).getTime()) / 1000)));
    })();
  }, [phase, question, roomId, roundNumber, timeLimit, userId]);

  const submitAnswer = useCallback(async (value: string) => {
    if (!remoteRound || answered || !question || phase !== "playing") return;
    setAnswered(true);
    setSelected(value);
    const correct = gameType === "personagem"
      ? Boolean(question.character && isCorrectCharacterAnswer(question.character, value))
      : normalize(value) === normalize(question.answer);
    const points = correct ? scoreFor(gameType, difficulty, remoteRound.points_available, timeLeft, players.find((player) => player.user_id === userId)?.best_streak ?? 0) : 0;
    playGameSfx(correct ? "success" : "error");
    const { data, error: submitError } = await gameDb.rpc("submit_character_game_response", {
      _round_id: remoteRound.id,
      _answer_hash: answerHash(correct ? question.answer : value),
      _is_correct: correct,
      _points: points,
      _streak: (players.find((player) => player.user_id === userId)?.best_streak ?? 0) + (correct ? 1 : 0),
    });
    if (submitError) {
      setAnswered(false);
      setError("Não foi possível registrar sua resposta. Tente novamente.");
      return;
    }
    setError("");
    setRemoteRound(data as RoomRound);
    setPhase("answered");
    await loadPlayers();
  }, [answered, difficulty, gameType, loadPlayers, phase, players, question, remoteRound, timeLeft, userId]);

  useEffect(() => {
    if (phase !== "playing" || answered) return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          void submitAnswer("");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [answered, phase, submitAnswer]);

  const revealHint = async (index: number) => {
    if (!remoteRound || !question?.isCharacter || remoteRound.revealed_hint_indexes.includes(index)) return;
    playGameSfx("reveal");
    const { data, error: hintError } = await gameDb.rpc("reveal_character_game_hint", { _round_id: remoteRound.id, _hint_index: index });
    if (hintError) {
      setError("Não foi possível revelar essa pista. A sala pode ter avançado.");
      return;
    }
    setError("");
    if (data) setRemoteRound(data as RoomRound);
  };

  const advance = useCallback(async () => {
    if (!remoteRound || remoteRound.status === "active") return;
    if (roundNumber >= rounds) {
      const { error: finishError } = await gameDb.rpc("finish_character_game_room", { _room_id: roomId });
      if (finishError) {
        setError("A partida ainda está encerrando a última rodada. Aguarde um instante.");
        return;
      }
      setPhase("finished");
      return;
    }
    setRoundNumber((value) => value + 1);
    setRemoteRound(null);
    setSelected("");
    setAnswered(false);
    setPhase("loading");
    playGameSfx("tap");
  }, [remoteRound, roomId, roundNumber, rounds]);

  useEffect(() => {
    if (phase !== "answered" || !remoteRound || remoteRound.status === "active") return;
    const timer = window.setTimeout(() => {
      void advance();
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [advance, phase, remoteRound, roundNumber]);

  useEffect(() => {
    if (phase !== "finished" || !userId || resultSaved.current) return;
    resultSaved.current = true;
    void (async () => {
      const finalPlayers = await loadPlayers(userId);
      const finalMe = finalPlayers.find((player: { user_id: string }) => player.user_id === userId);
      const resultError = await recordSharedGameResult(roomId, finalMe ? {
        gameKey: gameType,
        score: finalMe.score,
        correctAnswers: finalMe.correct_answers,
        rounds,
        bestStreak: finalMe.best_streak,
      } : undefined);
      if (resultError) {
        setError("O placar foi concluído, mas ainda não foi sincronizado com o ranking.");
      }
      if (!finishSoundPlayed.current) {
        finishSoundPlayed.current = true;
        const finalWinner = [...finalPlayers].sort((first, second) => second.score - first.score || second.correct_answers - first.correct_answers)[0];
        const tied = finalWinner && finalPlayers.filter((player: { score: number }) => player.score === finalWinner.score).length > 1;
        playGameSfx(tied ? "complete" : finalWinner?.user_id === finalMe?.user_id ? "victory" : "defeat");
      }
    })();
  }, [loadPlayers, phase, roomId, userId]);

  const me = players.find((player) => player.user_id === userId);
  const sortedPlayers = [...players].sort((first, second) => second.score - first.score || second.correct_answers - first.correct_answers);
  const winner = sortedPlayers[0];
  const isDraw = Boolean(winner && sortedPlayers.filter((player) => player.score === winner.score).length > 1);
  const won = Boolean(me && winner && me.user_id === winner.user_id && !isDraw);
  const currentQuestion = question;

  if (phase === "finished") {
    return (
      <main className="game-play-page min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 pb-28 pt-10 text-center">
          <span className={"mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] " + (won ? "bg-success/15 text-success" : "bg-ancient/15 text-ancient")}>
            {won ? <Trophy className="h-12 w-12" /> : isDraw ? <Users className="h-12 w-12" /> : <X className="h-12 w-12" />}
          </span>
          <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">{gameLabels[gameType]}</p>
          <h1 className="mt-2 text-3xl font-black">{won ? "Você venceu!" : isDraw ? "Empate de arena" : "Você perdeu desta vez"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{won ? "Resposta rápida, boa leitura e uma bela pontuação." : "A Palavra continua valendo outra rodada."}</p>
          <section className="mt-7 rounded-[1.75rem] border border-border bg-surface p-5 text-left">
            <div className="flex items-center justify-between"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Placar final</p><Trophy className="h-4 w-4 text-ancient" /></div>
            <div className="mt-4 space-y-2">
              {sortedPlayers.map((player, index) => (
                <div key={player.user_id} className={"flex items-center gap-3 rounded-2xl border px-3 py-3 " + (player.user_id === userId ? "border-primary/40 bg-primary/5" : "border-border bg-background/50")}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">{index + 1}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-extrabold">{player.display_name}</span><span className="text-[10px] text-muted-foreground">{player.correct_answers} acertos · melhor combo {player.best_streak}</span></span>
                  <span className="text-lg font-black text-ancient">{player.score}</span>
                </div>
              ))}
            </div>
          </section>
          <div className="mt-6 flex gap-3">
            <a href={"/jogos/" + gameType} className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Tela inicial</a>
            <a href={"/jogos/" + gameType} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Jogar de novo</a>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "loading" || !remoteRound || !currentQuestion) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6"><div className="w-full max-w-sm rounded-3xl border border-primary/25 bg-surface p-6 text-center"><Sparkles className="mx-auto h-8 w-8 animate-pulse text-primary" /><p className="mt-3 text-sm font-extrabold">Sincronizando a próxima rodada…</p>{error && <p className="mt-3 text-xs text-red-300">{error}</p>}</div></main>;
  }

  const roundClosed = remoteRound.status !== "active";
  const revealed = new Set([0, ...(remoteRound.revealed_hint_indexes ?? [])]);
  const roundWinner = players.find((player) => player.user_id === remoteRound.winner_id);
  const winningName = roundWinner?.display_name ?? "Um jogador";
  const showWaiting = answered && !roundClosed;

  return (
    <main className="game-play-page min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <header className="flex items-center justify-between"><a href={"/jogos/" + gameType} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</a><div className="flex items-center gap-2"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Rodada {roundNumber}/{rounds}</span><span className="rounded-full bg-ancient/10 px-3 py-1 text-xs font-black text-ancient">{me?.score ?? 0} pts</span></div></header>
        <div className="mt-6 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">{gameLabels[gameType]}</p><h1 className="mt-1 text-2xl font-black">{gameType === "personagem" ? "Descubra pela pista :)" : gameType === "versiculo" ? "Reconheça a passagem" : "Desafio compartilhado"}</h1></div><div className="text-right"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Na sala</p><p className="text-xl font-black text-ancient">{players.length}</p></div></div>
        <div className="mt-4 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full bg-gradient-to-r from-primary to-ancient" style={{ width: String(Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100))) + "%" }} /></div><span className={"inline-flex items-center gap-1 text-sm font-black " + (timeLeft <= 5 ? "text-red-300" : "text-foreground")}><Clock3 className="h-4 w-4" /><span role="timer" aria-live="polite" aria-atomic="true">{timeLeft}</span></span></div>
        <section className="mt-5 rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-xl shadow-primary/5">
          <div className="flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">{currentQuestion.category}</span><span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-ancient"><Flame className="h-3.5 w-3.5" /> {me?.best_streak ?? 0} combo</span></div>
          <p className="mt-5 text-lg font-extrabold leading-relaxed">{currentQuestion.prompt}</p>
          {currentQuestion.isCharacter ? <div className="mt-4 space-y-2">{currentQuestion.hints.slice(0, 4).map((hint, index) => { const open = revealed.has(index); return <div key={hint} className={"rounded-2xl border p-3 " + (open ? "border-primary/30 bg-primary/5" : "border-border bg-background/50")}>{open ? <div className="flex gap-2 text-sm leading-relaxed"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{hint}</div> : <button type="button" onClick={() => void revealHint(index)} className="flex w-full items-center gap-2 text-left text-sm font-bold text-muted-foreground"><Lightbulb className="h-4 w-4 text-primary" /> Pista {index + 1}<span className="ml-auto text-xs text-primary">Revelar</span></button>}</div>; })}</div> : <div className="mt-4 grid gap-2">{currentQuestion.options.map((option, index) => { const chosen = selected === option; const right = roundClosed && normalize(option) === normalize(currentQuestion.answer); const wrong = roundClosed && chosen && !right; return <button type="button" key={option} onClick={() => void submitAnswer(option)} disabled={answered || roundClosed} className={"flex items-center gap-3 rounded-2xl border p-4 text-left text-sm font-extrabold transition " + (right ? "border-success bg-success/10 text-success" : wrong ? "border-red-400/50 bg-red-400/10 text-red-300" : chosen ? "border-primary bg-primary/10 text-primary" : "border-border bg-background/50 hover:border-primary/50")}><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-background/70 text-xs font-black text-muted-foreground">{String.fromCharCode(65 + index)}</span><span className="flex-1">{option}</span>{right && <Check className="h-5 w-5" />}{wrong && <X className="h-5 w-5" />}</button>; })}</div>}
          {currentQuestion.isCharacter && <div className="mt-4 flex gap-2"><input value={selected} onChange={(event) => setSelected(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submitAnswer(selected); }} disabled={answered || roundClosed} placeholder="Digite sua resposta" className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" /><button type="button" onClick={() => void submitAnswer(selected)} disabled={!selected.trim() || answered || roundClosed} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-40"><Check className="h-5 w-5" /></button></div>}
        </section>
        {roundClosed && <section className={"mt-4 rounded-3xl border p-5 " + (remoteRound.winner_id === userId ? "border-success/40 bg-success/10" : "border-ancient/35 bg-ancient/10")}><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-background/60 text-ancient">{remoteRound.winner_id === userId ? <Trophy className="h-5 w-5" /> : <Crown className="h-5 w-5" />}</span><div><p className="font-extrabold">{remoteRound.status === "all_wrong" ? "Ninguém acertou desta vez." : winningName + " respondeu primeiro!"}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{currentQuestion.explanation}</p><p className="mt-3 text-[11px] font-bold text-primary">{currentQuestion.reference}</p></div></div><button type="button" onClick={() => void advance()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground">{roundNumber >= rounds ? "Ver resultado" : "Próxima rodada"}<ArrowRight className="h-4 w-4" /></button></section>}
        {showWaiting && <p className="mt-4 rounded-2xl border border-ancient/25 bg-ancient/10 p-4 text-center text-xs font-bold text-muted-foreground">Resposta enviada. Aguarde os outros jogadores.</p>}
        {error && <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-xs font-semibold text-red-200">{error}</p>}
      </div>
    </main>
  );
}
