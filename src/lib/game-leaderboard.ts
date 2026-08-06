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

type GameResult = {
  gameKey: GameKey;
  score: number;
  correctAnswers?: number;
  rounds?: number;
  bestStreak?: number;
};

export async function recordGameResult(result: GameResult) {
  const { error } = await (supabase as any).rpc("record_game_result", {
    _game_key: result.gameKey,
    _score: result.score,
    _correct_answers: result.correctAnswers ?? 0,
    _rounds: result.rounds ?? 0,
    _best_streak: result.bestStreak ?? 0,
  });
  return error;
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
