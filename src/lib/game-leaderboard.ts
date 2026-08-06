import { supabase } from "@/integrations/supabase/client";

export type GameKey = "milhao" | "personagem" | "versiculo" | "cruzadas";

export type GameLeaderboardRow = {
  position: number;
  user_id: string;
  display_name: string;
  username: string | null;
  avatar_char: string;
  avatar_url: string | null;
  best_score: number;
  total_score: number;
  games_played: number;
  best_streak: number;
};

export type GameResult = {
  gameKey: GameKey;
  score: number;
  correctAnswers?: number;
  rounds?: number;
  bestStreak?: number;
};

export async function recordGameResult(result: GameResult) {
  const payload = {
    game_key: result.gameKey,
    score: Math.max(0, Math.round(result.score)),
    correct_answers: Math.max(0, Math.round(result.correctAnswers ?? 0)),
    rounds: Math.max(0, Math.round(result.rounds ?? 0)),
    best_streak: Math.max(0, Math.round(result.bestStreak ?? 0)),
  };
  const { error } = await (supabase as any).rpc("record_game_result", {
    _game_key: payload.game_key,
    _score: payload.score,
    _correct_answers: payload.correct_answers,
    _rounds: payload.rounds,
    _best_streak: payload.best_streak,
  });
  if (!error) return null;

  // Mantém o registro funcionando mesmo quando a função RPC ainda não foi
  // publicada no projeto Supabase, desde que a tabela já exista.
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return error;
  const fallback = await (supabase as any).from("game_scores").insert({
    user_id: auth.user.id,
    ...payload,
  });
  return fallback.error ?? null;
}

export async function fetchGameLeaderboard(gameKey: GameKey, limit = 100) {
  const { data, error } = await (supabase as any).rpc("get_game_leaderboard", {
    _game_key: gameKey,
    _limit: limit,
  });
  return {
    data: (data ?? []) as GameLeaderboardRow[],
    error,
  };
}
