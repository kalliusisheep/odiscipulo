import { createFileRoute, Link } from "@tanstack/react-router";
import { Crown, Gamepad2, Medal, RefreshCw, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchGameLeaderboard, type GameKey, type GameLeaderboardRow } from "@/lib/game-leaderboard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/ranking")({ component: RankingPage });

const GAME_TABS: { key: GameKey; label: string; shortLabel: string; color: string }[] = [
  { key: "milhao", label: "Quiz do Milhão", shortLabel: "Milhão", color: "text-amber-300" },
  { key: "personagem", label: "Quem é o personagem?", shortLabel: "Personagem", color: "text-violet-300" },
  { key: "versiculo", label: "Qual é o versículo?", shortLabel: "Versículo", color: "text-emerald-300" },
  { key: "cruzadas", label: "Palavras cruzadas", shortLabel: "Cruzadas", color: "text-sky-300" },
];

function RankingPage() {
  const [selectedGame, setSelectedGame] = useState<GameKey>("milhao");
  const [rows, setRows] = useState<GameLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const loadRanking = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setLoadError("");
    const result = await fetchGameLeaderboard(selectedGame, 100);
    setRows(result.data);
    if (result.error) setLoadError("Não foi possível sincronizar este ranking agora. Tente atualizar novamente.");
    setLoading(false);
    setRefreshing(false);
  }, [selectedGame]);

  useEffect(() => {
    void loadRanking();
  }, [loadRanking]);

  useEffect(() => {
    const channel = supabase
      .channel(`game-ranking-${selectedGame}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "game_scores", filter: `game_key=eq.${selectedGame}` }, () => void loadRanking(true))
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadRanking, selectedGame]);

  const selectedTab = GAME_TABS.find((tab) => tab.key === selectedGame) ?? GAME_TABS[0];
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const totalPoints = useMemo(() => rows.reduce((sum, row) => sum + row.total_score, 0), [rows]);
  const totalGames = useMemo(() => rows.reduce((sum, row) => sum + row.games_played, 0), [rows]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg space-y-5 px-4 pb-28 pt-6">
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Arena global</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">Ranking dos jogos</h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Todos os jogadores do app competindo pela melhor pontuação.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/25 via-surface to-ancient/10 p-5 shadow-xl shadow-primary/10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Gamepad2 className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ancient">Temporada em andamento</p>
              <h2 className="mt-1 text-xl font-black">{selectedTab.label}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Pontuação real acumulada nas partidas.</p>
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-3 gap-2">
            <Stat icon={<Users />} value={rows.length} label="jogadores" />
            <Stat icon={<Trophy />} value={totalGames} label="partidas" />
            <Stat icon={<Zap />} value={totalPoints} label="pontos" />
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface p-1.5 sm:grid-cols-4">
          {GAME_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedGame(tab.key)}
              className={["rounded-xl px-2 py-3 text-[11px] font-extrabold transition-all", selectedGame === tab.key ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"].join(" ")}
            >
              {tab.shortLabel}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Top jogadores</p>
            <p className={["mt-1 text-sm font-black", selectedTab.color].join(" ")}>Quem está dominando a arena</p>
          </div>
          <button type="button" onClick={() => void loadRanking(true)} disabled={refreshing} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-50" aria-label="Atualizar ranking">
            <RefreshCw className={["h-4 w-4", refreshing ? "animate-spin" : ""].join(" ")} />
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-border bg-surface p-12 text-center text-sm text-muted-foreground">Carregando a arena…</div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-8 text-center">
            <Trophy className="mx-auto h-10 w-10 text-red-300" />
            <h2 className="mt-4 text-lg font-black">Ranking temporariamente indisponível</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A pontuação continua protegida e será sincronizada quando a conexão voltar.</p>
            <button type="button" onClick={() => void loadRanking(true)} className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground">Tentar novamente</button>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-surface p-10 text-center">
            <Trophy className="mx-auto h-10 w-10 text-ancient" />
            <h2 className="mt-4 text-lg font-black">A arena está esperando você</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Jogue uma partida para inaugurar sua pontuação neste ranking.</p>
            <Link to="/jogos" className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground">Entrar nos jogos</Link>
          </div>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-b from-primary/15 via-surface to-surface p-4">
              <div className="relative flex items-end justify-center gap-2 pt-3">
                {podium[1] && <PodiumCard row={podium[1]} place={2} />}
                {podium[0] && <PodiumCard row={podium[0]} place={1} />}
                {podium[2] && <PodiumCard row={podium[2]} place={3} />}
              </div>
            </section>
            <section className="space-y-2">
              {rest.map((row) => <LeaderboardRow key={row.user_id} row={row} color={selectedTab.color} />)}
            </section>
          </>
        )}

        <div className="flex items-center justify-center gap-2 pb-2 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Ranking global atualizado com as pontuações dos jogos.
        </div>
      </div>
    </main>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/45 px-2 py-3 text-center">
      <span className="mx-auto flex h-5 w-5 items-center justify-center text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <p className="mt-1 text-sm font-black">{value.toLocaleString("pt-BR")}</p>
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function PodiumCard({ row, place }: { row: GameLeaderboardRow; place: 1 | 2 | 3 }) {
  const isFirst = place === 1;
  const accent = place === 1 ? "text-amber-300 ring-amber-300/70" : place === 2 ? "text-slate-300 ring-slate-300/70" : "text-orange-300 ring-orange-300/70";
  const medal = place === 1 ? <Crown /> : place === 2 ? <Medal /> : <Trophy />;
  return (
    <div className={["flex w-1/3 flex-col items-center", isFirst ? "pb-1" : "pb-4"].join(" ")}>
      <span className={["mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 [&>svg]:h-4 [&>svg]:w-4", accent].join(" ")}>{medal}</span>
      <div className={isFirst ? "relative h-24 w-24" : "relative h-20 w-20"}>
        <div className={["h-full w-full overflow-hidden rounded-full bg-surface ring-4", accent].join(" ")}>
          {row.avatar_url ? <img src={row.avatar_url} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-3xl">{row.avatar_char?.slice(0, 1).toUpperCase() ?? "?"}</span>}
        </div>
        <span className="absolute -bottom-1 -right-1 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[11px] font-black text-primary-foreground">{row.position}</span>
      </div>
      <p className="mt-2 max-w-full truncate text-center text-xs font-black">{row.display_name}</p>
      <p className="mt-1 flex items-center gap-1 text-[11px] font-black text-ancient"><Zap className="h-3 w-3" /> {row.best_score.toLocaleString("pt-BR")}</p>
      <div className={["mt-2 flex h-12 w-full items-center justify-center rounded-t-2xl text-xl font-black", place === 1 ? "bg-amber-300 text-amber-950" : place === 2 ? "bg-slate-300 text-slate-900" : "bg-orange-400 text-orange-950"].join(" ")}>{place}º</div>
    </div>
  );
}

function LeaderboardRow({ row, color }: { row: GameLeaderboardRow; color: string }) {
  const inner = (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition hover:-translate-y-0.5 hover:border-primary/40">
      <span className={["w-8 text-center text-sm font-black", row.position <= 10 ? color : "text-muted-foreground"].join(" ")}>{row.position}</span>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-lg font-black text-primary ring-1 ring-primary/20">
        {row.avatar_url ? <img src={row.avatar_url} alt="" className="h-full w-full object-cover" /> : row.avatar_char?.slice(0, 1).toUpperCase() ?? "?"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{row.display_name}</p>
        <p className="text-[10px] text-muted-foreground">{row.games_played} partidas · melhor combo {row.best_streak}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-ancient">{row.best_score.toLocaleString("pt-BR")}</p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">pontos</p>
      </div>
    </div>
  );
  return row.username ? <Link to="/perfil/$username" params={{ username: row.username }}>{inner}</Link> : inner;
}
