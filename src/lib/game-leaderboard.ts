import { supabase } from "@/integrations/supabase/client";

const PENDING_RESULTS_KEY = "disciple.pending-game-results";

export type GameKey = "milhao" | "personagem" | "versiculo" | "cruzadas";

export type GameResult = {
  gameKey: GameKey;
  score: number;
  correctAnswers?: number;
  rounds?: number;
  bestStreak?: number;
};

type StoredGameResult = GameResult & { createdAt: number };

function readPendingResults(): StoredGameResult[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PENDING_RESULTS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePendingResult(result: GameResult) {
  if (typeof window === "undefined") return;
  const pending = readPendingResults();
  const duplicate = pending.some((item) => item.gameKey === result.gameKey && item.score === result.score && item.rounds === result.rounds && item.correctAnswers === result.correctAnswers && item.bestStreak === result.bestStreak);
  if (duplicate) return;
  pending.push({ ...result, createdAt: Date.now() });
  window.localStorage.setItem(PENDING_RESULTS_KEY, JSON.stringify(pending.slice(-20)));
}

function gameResultPayload(result: GameResult) {
  return {
    game_key: result.gameKey,
    score: Math.max(0, Math.round(result.score)),
    correct_answers: Math.max(0, Math.round(result.correctAnswers ?? 0)),
    rounds: Math.max(0, Math.round(result.rounds ?? 0)),
    best_streak: Math.max(0, Math.round(result.bestStreak ?? 0)),
  };
}

async function submitGameResult(result: GameResult) {
  const payload = gameResultPayload(result);
  const { error } = await (supabase as any).rpc("record_game_result", {
    _game_key: payload.game_key,
    _score: payload.score,
    _correct_answers: payload.correct_answers,
    _rounds: payload.rounds,
    _best_streak: payload.best_streak,
  });
  return error ?? null;
}

export async function flushPendingGameResults() {
  const pending = readPendingResults();
  if (!pending.length) return;
  const remaining: StoredGameResult[] = [];
  for (const result of pending) {
    const error = await submitGameResult(result);
    if (error) remaining.push(result);
  }
  if (typeof window !== "undefined") {
    if (remaining.length) window.localStorage.setItem(PENDING_RESULTS_KEY, JSON.stringify(remaining.slice(-20)));
    else window.localStorage.removeItem(PENDING_RESULTS_KEY);
  }
}

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

export async function recordGameResult(result: GameResult) {
  await flushPendingGameResults();
  const error = await submitGameResult(result);
  if (error) savePendingResult(result);
  return error;
}

export async function recordSharedGameResult(roomId: string, fallback?: GameResult) {
  await flushPendingGameResults();
  const { error } = await (supabase as any).rpc("record_shared_game_result", {
    _room_id: roomId,
  });
  if (!error) return null;

  if (fallback) {
    const fallbackError = await recordGameResult(fallback);
    if (!fallbackError) return null;
  }
  return error;
}

export async function fetchGameLeaderboard(gameKey: GameKey, limit = 100) {
  await flushPendingGameResults();
  const { data, error } = await (supabase as any).rpc("get_game_leaderboard", {
    _game_key: gameKey,
    _limit: limit,
  });
  if (!error) {
    return {
      data: (data ?? []) as GameLeaderboardRow[],
      error: null,
    };
  }

  const scoresResult = await (supabase as any)
    .from("game_scores")
    .select("user_id,score,best_streak,played_at")
    .eq("game_key", gameKey);
  if (scoresResult.error) return { data: [], error };

  const scoreRows = (scoresResult.data ?? []) as Array<{ user_id: string; score: number; best_streak: number; played_at: string }>;
  const profileIds = [...new Set(scoreRows.map((row) => row.user_id))];
  const profilesResult = profileIds.length
    ? await (supabase as any).from("profiles").select("id,display_name,username,avatar_char,avatar_url").in("id", profileIds)
    : { data: [], error: null };
  if (profilesResult.error) return { data: [], error: profilesResult.error };

  const profiles = new Map(
    ((profilesResult.data ?? []) as Array<{ id: string; display_name: string; username: string | null; avatar_char: string; avatar_url: string | null }>)
      .map((profile) => [profile.id, profile] as const),
  );
  const totals = new Map<string, { best_score: number; total_score: number; games_played: number; best_streak: number }>();
  for (const row of scoreRows) {
    const current = totals.get(row.user_id) ?? { best_score: 0, total_score: 0, games_played: 0, best_streak: 0 };
    totals.set(row.user_id, {
      best_score: Math.max(current.best_score, Number(row.score) || 0),
      total_score: current.total_score + (Number(row.score) || 0),
      games_played: current.games_played + 1,
      best_streak: Math.max(current.best_streak, Number(row.best_streak) || 0),
    });
  }

  const fallbackData = [...totals.entries()]
    .map(([user_id, total]) => ({ user_id, ...total, profile: profiles.get(user_id) }))
    .filter((row) => row.profile)
    .sort((first, second) => second.best_score - first.best_score || second.total_score - first.total_score || second.best_streak - first.best_streak || first.user_id.localeCompare(second.user_id))
    .slice(0, Math.max(1, Math.min(limit, 100)))
    .map((row, index) => ({
      position: index + 1,
      user_id: row.user_id,
      display_name: row.profile!.display_name,
      username: row.profile!.username,
      avatar_char: row.profile!.avatar_char,
      avatar_url: row.profile!.avatar_url,
      best_score: row.best_score,
      total_score: row.total_score,
      games_played: row.games_played,
      best_streak: row.best_streak,
    }));

  return { data: fallbackData, error: null };
}
