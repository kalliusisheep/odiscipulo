import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock3, Eye, Flame, Lightbulb, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { GameDifficulty } from "@/data/biblical-characters";
import { CROSSWORD_DIFFICULTY, CROSSWORD_THEMES, crosswordWordsFor, type CrosswordTheme, type CrosswordWord } from "@/data/biblical-crosswords";
import { GameModeChooser } from "@/components/games/GameModeChooser";
import { playGameSfx, startGameMusic } from "@/lib/game-audio";

export const Route = createFileRoute("/_authenticated/jogos/cruzadas")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "multi" ? "multi" : "single",
    roomId: typeof search.roomId === "string" ? search.roomId : undefined,
  }),
  component: CrosswordPage,
});

type Direction = "across" | "down";
type Cell = { row: number; col: number; letter: string; wordIds: string[] };
type Placement = { word: CrosswordWord; row: number; col: number; direction: Direction };
type Phase = "setup" | "playing" | "finished";
const difficulties: GameDifficulty[] = ["facil", "medio", "dificil", "bereano"];

function key(row: number, col: number) { return `${row}-${col}`; }

function canPlace(grid: string[][], word: string, row: number, col: number, direction: Direction) {
  const size = grid.length;
  for (let index = 0; index < word.length; index += 1) {
    const currentRow = row + (direction === "down" ? index : 0);
    const currentCol = col + (direction === "across" ? index : 0);
    if (currentRow < 0 || currentCol < 0 || currentRow >= size || currentCol >= size) return false;
    const existing = grid[currentRow][currentCol];
    if (existing && existing !== word[index]) return false;
    if (!existing) {
      const beforeRow = currentRow + (direction === "across" ? -1 : 0);
      const beforeCol = currentCol + (direction === "down" ? -1 : 0);
      const afterRow = currentRow + (direction === "across" ? 1 : 0);
      const afterCol = currentCol + (direction === "down" ? 1 : 0);
      if ((grid[beforeRow]?.[beforeCol] ?? "") || (grid[afterRow]?.[afterCol] ?? "")) return false;
    }
  }
  const beforeRow = row + (direction === "down" ? -1 : 0);
  const beforeCol = col + (direction === "across" ? -1 : 0);
  const afterRow = row + (direction === "down" ? word.length : 0);
  const afterCol = col + (direction === "across" ? word.length : 0);
  return !(grid[beforeRow]?.[beforeCol] || grid[afterRow]?.[afterCol]);
}

function generatePuzzle(difficulty: GameDifficulty, theme: CrosswordTheme | "todos") {
  const config = CROSSWORD_DIFFICULTY[difficulty];
  const pool = crosswordWordsFor(difficulty, theme).length >= config.words ? crosswordWordsFor(difficulty, theme) : crosswordWordsFor(difficulty, "todos");
  const words = [...pool].sort(() => Math.random() - 0.5).sort((a, b) => b.word.length - a.word.length).slice(0, config.words);
  const grid = Array.from({ length: config.size }, () => Array<string>(config.size).fill(""));
  const placements: Placement[] = [];
  const first = words[0];
  if (!first) return { size: config.size, cells: [] as Cell[], placements: [] as Placement[] };
  const firstRow = Math.floor(config.size / 2);
  const firstCol = Math.floor((config.size - first.word.length) / 2);
  for (let index = 0; index < first.word.length; index += 1) grid[firstRow][firstCol + index] = first.word[index];
  placements.push({ word: first, row: firstRow, col: firstCol, direction: "across" });
  for (const word of words.slice(1)) {
    let placed = false;
    for (const existing of [...placements]) {
      for (let existingIndex = 0; existingIndex < existing.word.word.length && !placed; existingIndex += 1) {
        const existingRow = existing.row + (existing.direction === "down" ? existingIndex : 0);
        const existingCol = existing.col + (existing.direction === "across" ? existingIndex : 0);
        for (let wordIndex = 0; wordIndex < word.word.length && !placed; wordIndex += 1) {
          if (word.word[wordIndex] !== grid[existingRow][existingCol]) continue;
          const direction: Direction = existing.direction === "across" ? "down" : "across";
          const row = existingRow - (direction === "down" ? wordIndex : 0);
          const col = existingCol - (direction === "across" ? wordIndex : 0);
          if (!canPlace(grid, word.word, row, col, direction)) continue;
          for (let index = 0; index < word.word.length; index += 1) grid[row + (direction === "down" ? index : 0)][col + (direction === "across" ? index : 0)] = word.word[index];
          placements.push({ word, row, col, direction }); placed = true;
        }
      }
    }
    if (!placed) {
      for (const direction of ["across", "down"] as Direction[]) {
        for (let row = 0; row < config.size && !placed; row += 1) {
          for (let col = 0; col < config.size && !placed; col += 1) {
            if (!canPlace(grid, word.word, row, col, direction)) continue;
            for (let index = 0; index < word.word.length; index += 1) {
              grid[row + (direction === "down" ? index : 0)][col + (direction === "across" ? index : 0)] = word.word[index];
            }
            placements.push({ word, row, col, direction });
            placed = true;
          }
        }
      }
    }
  }
  const placedCells = new Map<string, Cell>();
  placements.forEach((placement) => placement.word.word.split("").forEach((letter, index) => {
    const row = placement.row + (placement.direction === "down" ? index : 0);
    const col = placement.col + (placement.direction === "across" ? index : 0);
    const cellKey = key(row, col);
    const cell = placedCells.get(cellKey) ?? { row, col, letter, wordIds: [] };
    cell.wordIds.push(placement.word.id); placedCells.set(cellKey, cell);
  }));
  return { size: config.size, cells: [...placedCells.values()], placements };
}

function tone(success: boolean) {
  playGameSfx(success ? "success" : "error");
  return;
  try { const Context = window.AudioContext; if (!Context) return; const context = new Context(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = success ? 620 : 180; gain.gain.setValueAtTime(0.04, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.15); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.16); } catch { /* áudio opcional */ }
}

function CrosswordPage() {
  const { mode, roomId } = Route.useSearch();
  const [phase, setPhase] = useState<Phase>("setup");
  const [modeSelected, setModeSelected] = useState(mode === "multi");
  const [difficulty, setDifficulty] = useState<GameDifficulty>("medio");
  const [theme, setTheme] = useState<CrosswordTheme | "todos">("todos");
  const [puzzle, setPuzzle] = useState(() => generatePuzzle("medio", "todos"));
  const [letters, setLetters] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [hints, setHints] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [errorCell, setErrorCell] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoStarted = useRef(false);
  const config = CROSSWORD_DIFFICULTY[difficulty];
  const cellMap = useMemo(() => new Map(puzzle.cells.map((cell) => [key(cell.row, cell.col), cell])), [puzzle.cells]);
  const activePlacement = puzzle.placements.find((placement) => placement.word.id === activeWordId);
  const activeWord = activePlacement?.word;

  const start = () => { startGameMusic(); playGameSfx("start"); setPuzzle(generatePuzzle(difficulty, theme)); setLetters({}); setSelectedCell(null); setActiveWordId(null); setCompleted([]); setErrors(0); setHints(0); setSeconds(0); setScore(0); setPhase("playing"); };

  useEffect(() => {
    if (mode === "multi" && roomId && !autoStarted.current) {
      autoStarted.current = true;
      start();
    }
  }, [mode, roomId]);
  useEffect(() => { if (phase !== "playing") return; const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer); }, [phase]);

  const selectCell = (cell: Cell) => { setSelectedCell(key(cell.row, cell.col)); setActiveWordId((current) => current && cell.wordIds.includes(current) ? current : cell.wordIds[0]); inputRef.current?.focus(); };
  const moveToNext = (placement: Placement, row: number, col: number) => {
    const cells = placement.word.word.split("").map((_, index) => key(placement.row + (placement.direction === "down" ? index : 0), placement.col + (placement.direction === "across" ? index : 0)));
    const currentIndex = cells.indexOf(key(row, col));
    if (currentIndex >= 0 && currentIndex < cells.length - 1) setSelectedCell(cells[currentIndex + 1]);
  };
  const updateCompleted = (nextLetters: Record<string, string>) => {
    puzzle.placements.forEach((placement) => {
      const cells = placement.word.word.split("").map((_, index) => key(placement.row + (placement.direction === "down" ? index : 0), placement.col + (placement.direction === "across" ? index : 0)));
      if (cells.every((cellKey, index) => nextLetters[cellKey] === placement.word.word[index]) && !completed.includes(placement.word.id)) {
        setCompleted((items) => [...items, placement.word.id]); setScore((value) => value + Math.round(placement.word.word.length * 14 * config.multiplier + Math.max(0, 100 - seconds))); tone(true); navigator.vibrate?.([20, 30, 20]);
      }
    });
  };
  const handleKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!selectedCell || !activeWord) return;
    const cell = cellMap.get(selectedCell); if (!cell) return;
    const placement = puzzle.placements.find((item) => item.word.id === activeWord.id); if (!placement) return;
    if (event.key === "Backspace") { event.preventDefault(); setLetters((current) => { const next = { ...current }; delete next[selectedCell]; return next; }); return; }
    if (!/^[a-zA-Z]$/.test(event.key)) return;
    event.preventDefault(); const letter = event.key.toUpperCase(); const expected = cell.letter;
    if (letter !== expected) { setErrors((value) => value + 1); setErrorCell(selectedCell); tone(false); navigator.vibrate?.(50); window.setTimeout(() => setErrorCell(null), 350); return; }
    const nextLetters = { ...letters, [selectedCell]: letter }; setLetters(nextLetters); updateCompleted(nextLetters); moveToNext(placement, cell.row, cell.col);
  };
  const revealHint = () => {
    const placement = puzzle.placements.find((item) => item.word.id === activeWordId); if (!placement) return;
    const cells = placement.word.word.split("").map((_, index) => key(placement.row + (placement.direction === "down" ? index : 0), placement.col + (placement.direction === "across" ? index : 0)));
    const empty = cells.find((cellKey) => !letters[cellKey]); if (!empty) return;
    const cell = cellMap.get(empty); if (!cell) return;
    const nextLetters = { ...letters, [empty]: cell.letter };
    setLetters(nextLetters); updateCompleted(nextLetters); setHints((value) => value + 1); setScore((value) => Math.max(0, value - 25)); setSelectedCell(empty); tone(true); navigator.vibrate?.(20);
  };
  const finish = completed.length === puzzle.placements.length && puzzle.placements.length > 0;
  useEffect(() => { if (finish) setPhase("finished"); }, [finish]);

  if (phase === "setup" && !modeSelected) return <GameModeChooser title="Palavras Cruzadas" description="Escolha uma grade para resolver sozinho ou reúna seus amigos para um desafio bíblico em sala." onBack={() => window.history.back()} onSinglePlayer={() => setModeSelected(true)} onMultiplayer={() => { window.location.href = "/jogos/multiplayer?game=cruzadas"; }} />;
  if (phase === "setup") return <Setup difficulty={difficulty} setDifficulty={setDifficulty} theme={theme} setTheme={setTheme} onStart={start} />;
  if (phase === "finished") return <Results score={score} seconds={seconds} errors={errors} hints={hints} placements={puzzle.placements} onRestart={() => setPhase("setup")} />;
  const gridCells = Array.from({ length: puzzle.size * puzzle.size }, (_, index) => cellMap.get(key(Math.floor(index / puzzle.size), index % puzzle.size)));

  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-3 pb-28 pt-5"><header className="flex items-center justify-between"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><span className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-extrabold"><Clock3 className="h-3.5 w-3.5 text-primary" /> {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span></header><div className="mt-6 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Palavras Cruzadas</p><h1 className="mt-1 text-2xl font-extrabold">Descubra a Palavra</h1></div><div className="text-right"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pontos</p><p className="text-xl font-black text-ancient">{score}</p></div></div><div className="mt-4 flex items-center justify-between text-[11px] font-bold text-muted-foreground"><span>{completed.length}/{puzzle.placements.length} palavras completas</span><span className="inline-flex items-center gap-1 text-ancient"><Flame className="h-3.5 w-3.5" /> {config.label}</span></div><section className="mt-4 rounded-[1.75rem] border border-primary/20 bg-surface p-3 shadow-xl shadow-primary/5"><div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}>{gridCells.map((cell, index) => { if (!cell) return <span key={index} className="aspect-square" />; const cellKey = key(cell.row, cell.col); const isActive = activeWordId ? cell.wordIds.includes(activeWordId) : false; const isSelected = cellKey === selectedCell; return <button key={cellKey} type="button" onClick={() => selectCell(cell)} aria-label={`Célula ${cell.row + 1}, ${cell.col + 1}`} className={`relative aspect-square rounded-[4px] border text-[clamp(0.58rem,3.4vw,1rem)] font-black transition-all ${isSelected ? "z-10 border-primary bg-primary text-primary-foreground shadow-[0_0_0_3px_hsl(var(--primary)/0.3)]" : isActive ? "border-primary/40 bg-primary/15 text-primary" : "border-border/60 bg-background/80 text-foreground"} ${errorCell === cellKey ? "animate-pulse border-red-400 bg-red-400/20 text-red-300" : ""}`}>{letters[cellKey] ?? ""}</button>; })}</div></section><input ref={inputRef} onKeyDown={handleKey} className="sr-only" aria-label="Digite a letra da célula selecionada" autoCapitalize="characters" autoComplete="off" /><section className="mt-4 rounded-3xl border border-primary/20 bg-primary/5 p-4"><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">{activeWord?.category ?? "Selecione uma palavra"}</p><p className="mt-1 text-sm font-extrabold leading-relaxed">{activeWord?.clue ?? "Toque em uma célula para começar."}</p><p className="mt-1 text-[11px] text-muted-foreground">{activeWord ? `${activeWord.word.length} letras · ${activePlacement?.direction === "down" ? "vertical" : "horizontal"}` : ""}</p></div><button type="button" onClick={revealHint} disabled={!activeWord} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-ancient/30 bg-ancient/10 text-ancient disabled:opacity-40" aria-label="Usar dica"><Lightbulb className="h-4 w-4" /></button></div>{activeWord && <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">Dica: revela uma letra e custa 25 pontos. Referência: <span className="font-bold text-foreground">{activeWord.reference}</span></p>}</section><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-2xl border border-border bg-surface p-3"><p className="text-[10px] text-muted-foreground">Erros</p><p className="mt-1 text-lg font-black text-red-300">{errors}</p></div><div className="rounded-2xl border border-border bg-surface p-3"><p className="text-[10px] text-muted-foreground">Dicas usadas</p><p className="mt-1 text-lg font-black text-ancient">{hints}</p></div></div></div></main>;
}

function Setup({ difficulty, setDifficulty, theme, setTheme, onStart }: { difficulty: GameDifficulty; setDifficulty: (value: GameDifficulty) => void; theme: CrosswordTheme | "todos"; setTheme: (value: CrosswordTheme | "todos") => void; onStart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-5"><Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Jogos</Link><header className="mt-8"><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Desafio de descoberta</p><h1 className="mt-1 text-3xl font-extrabold">Palavras Cruzadas</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Preencha a grade com palavras da Bíblia. Toque, digite e deixe cada cruzamento ensinar algo novo.</p></header><section className="mt-8 space-y-6 rounded-[1.75rem] border border-border bg-surface p-5"><div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Personalidade da grade</p><div className="mt-3 grid grid-cols-2 gap-2">{difficulties.map((option) => <button key={option} type="button" onClick={() => setDifficulty(option)} className={`rounded-2xl border px-3 py-3 text-left ${difficulty === option ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}><span className="block text-sm font-extrabold">{CROSSWORD_DIFFICULTY[option].label}</span><span className="mt-1 block text-[10px] leading-snug opacity-75">{CROSSWORD_DIFFICULTY[option].description}</span></button>)}</div></div><label className="block text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Tema<select value={theme} onChange={(event) => setTheme(event.target.value as CrosswordTheme | "todos")} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm font-bold text-foreground"><option value="todos">Todos os temas</option>{CROSSWORD_THEMES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><button type="button" onClick={onStart} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">Montar minha grade <ArrowRight className="h-4 w-4" /></button></section></div></main>;
}

function Results({ score, seconds, errors, hints, placements, onRestart }: { score: number; seconds: number; errors: number; hints: number; placements: Placement[]; onRestart: () => void }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-lg px-4 pb-28 pt-10 text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ancient/15 text-ancient"><Trophy className="h-10 w-10" /></span><p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Grade concluída</p><h1 className="mt-2 text-3xl font-extrabold">Você examinou bem!</h1><section className="mt-7 rounded-[1.75rem] border border-border bg-surface p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Pontuação final</p><p className="mt-2 text-5xl font-black text-ancient">{score}</p><div className="mt-6 grid grid-cols-3 gap-2"><div><p className="text-xl font-black">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</p><p className="text-[10px] text-muted-foreground">tempo</p></div><div><p className="text-xl font-black">{errors}</p><p className="text-[10px] text-muted-foreground">erros</p></div><div><p className="text-xl font-black">{hints}</p><p className="text-[10px] text-muted-foreground">dicas</p></div></div></section><section className="mt-4 space-y-2 text-left"><p className="px-1 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Continue estudando</p>{placements.map((placement) => <div key={placement.word.id} className="rounded-2xl border border-border bg-surface p-3"><p className="text-sm font-extrabold">{placement.word.word}</p><p className="mt-1 text-xs text-muted-foreground">{placement.word.curiosity}</p><p className="mt-2 text-[10px] font-bold text-primary">{placement.word.reference}</p></div>)}</section><div className="mt-6 flex gap-3"><Link to="/jogos" className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-bold"><ArrowLeft className="h-4 w-4" /> Jogos</Link><button type="button" onClick={onRestart} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"><RotateCcw className="h-4 w-4" /> Jogar de novo</button></div></div></main>;
}
