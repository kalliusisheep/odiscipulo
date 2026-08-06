import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Crown, Medal, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchGameLeaderboard, type GameKey, type GameLeaderboardRow } from "@/lib/game-leaderboard";

export const Route = createFileRoute("/_authenticated/jogos/ranking")({
  component: GameRankingsPage,
});

const gameTabs: { key: GameKey; label: string; tone: string }[] = [
  { key: "milhao", label: "Quiz do milhão", tone: "text-fuchsia-200" },
  { key: "personagem", label: "Personagem", tone: "text-violet-200" },
  { key: "versiculo", label: "Versículo", tone: "text-emerald-200" },
  { key: "cruzadas", label: "Cruzadas", tone: "text-amber-200" },
];

function GameRankingsPage() {
  const [selectedGame, setSelectedGame] = useState<GameKey>("milhao");
  const [rows, setRows] = useState<GameLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setMessage("");
    const result = await fetchGameLeaderboard(selectedGame);
    if (result.error) setMessage("Não foi possível carregar o ranking agora.");
    setRows(result.data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [selectedGame]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <header className="flex items-center justify-between">
          <Link to="/jogos" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Jogos
          </Link>
          <button type="button" onClick={() => void load()} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-muted-foreground" aria-label="Atualizar ranking">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

        <div className="mt-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Arena global</p>
          <h1 className="mt-1 text-3xl font-black">Rankings dos jogos</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Compare seu desempenho com toda a comunidade, não apenas com seus amigos.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 rounded-3xl border border-border bg-surface p-2">
          {gameTabs.map((tab) => (
            <button key={tab.key} type="button" onClick={() => setSelectedGame(tab.key)} className={`rounded-2xl px-3 py-3 text-left text-xs font-extrabold transition ${selectedGame === tab.key ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-background"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {rows.length >= 3 && (
          <section className="mt-6 grid grid-cols-3 items-end gap-2">
            <Podium row={rows[1]} place={2} />
            <Podium row={rows[0]} place={1} />
            <Podium row={rows[2]} place={3} />
          </section>
        )}

        <section className="mt-6 rounded-[1.75rem] border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Todos os jogadores</p><p className="mt-1 text-[11px] text-muted-foreground">Melhor pontuação por jogo</p></div>
            <Trophy className="h-5 w-5 text-ancient" />
          </div>
          {loading ? <p className="py-12 text-center text-sm text-muted-foreground">Carregando placar...</p> : message ? <p className="py-12 text-center text-sm text-red-300">{message}</p> : rows.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">Ainda não há partidas registradas neste jogo.</p> : <div className="mt-4 space-y-2">{rows.map((row) => <LeaderboardRow key={row.user_id} row={row} />)}</div>}
        </section>
      </div>
    </main>
  );
}

function LeaderboardRow({ row }: { row: GameLeaderboardRow }) {
  const body = <><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary">{row.avatar_url ? <img src={row.avatar_url} alt="" className="h-full w-full rounded-xl object-cover" /> : row.avatar_char?.slice(0, 1).toUpperCase() ?? "?"}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-extrabold">{row.display_name}</span><span className="mt-0.5 block text-[10px] text-muted-foreground">{row.games_played} partidas · {row.best_streak} melhor combo</span></span><span className="text-right"><span className="block text-sm font-black text-ancient">{row.best_score}</span><span className="text-[9px] uppercase tracking-wider text-muted-foreground">pontos</span></span></>;
  return row.username ? <Link to="/perfil/$username" params={{ username: row.username }} className="flex items-center gap-3 rounded-2xl border border-border bg-background/50 p-3 transition hover:border-primary/40">{body}</Link> : <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/50 p-3">{body}</div>;
}

function Podium({ row, place }: { row: GameLeaderboardRow; place: number }) {
  const Icon = place === 1 ? Crown : place === 2 ? Medal : Trophy;
  return <div className={`rounded-3xl border p-3 text-center ${place === 1 ? "border-ancient/50 bg-ancient/10 py-6" : "border-border bg-surface py-4"}`}><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><p className="mt-2 truncate text-xs font-extrabold">{row.display_name}</p><p className="mt-1 text-lg font-black text-ancient">{row.best_score}</p><p className="text-[9px] font-bold text-muted-foreground">{place}º lugar</p></div>;
}
