import { supabase } from "@/integrations/supabase/client";
import { checkFinishChallenges } from "@/lib/challenges";
import { computeStreak, todayStr } from "@/lib/streak";

const STREAK_BONUS_XP = 10;

const REPEAT_XP_FLOOR = 5;
const REPEAT_XP_RATIO = 0.35;

/**
 * Persiste uma atividade e calcula XP de revisão sem permitir que repetir
 * sempre a mesma lição seja uma fonte infinita de XP cheio.
 */
export async function awardProgressXp(userId: string, progressId: string, baseXp: number) {
  const { data: previous, error: lookupError } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", userId)
    .eq("lesson_id", progressId)
    .maybeSingle();

  const repeated = !lookupError && Boolean(previous);
  const xp = repeated ? Math.max(REPEAT_XP_FLOOR, Math.round(baseXp * REPEAT_XP_RATIO)) : baseXp;

  const { error: saveError } = await supabase
    .from("lesson_progress")
    .upsert(
      { user_id: userId, lesson_id: progressId, xp_gained: xp },
      { onConflict: "user_id,lesson_id" },
    );
  if (saveError) throw saveError;

  const result = await awardXpAndStreak(userId, xp);
  return { ...result, xp, repeated };
}

/**
 * Award XP and update daily streak for the current user.
 * When the streak advances to a new day, a +10 XP bonus is added on top of `xp`.
 * Returns previous/new XP and streak so callers can trigger celebrations / level-ups.
 */
export async function awardXpAndStreak(userId: string, xp: number) {
  const { data: p } = await supabase
    .from("profiles")
    .select("xp, streak, last_activity_date")
    .eq("id", userId)
    .maybeSingle();
  const today = todayStr();
  const last = p?.last_activity_date ?? null;
  const prevStreak = p?.streak ?? 0;
  const prevXp = p?.xp ?? 0;
  const streakState = computeStreak(prevStreak, last);
  const newStreak = streakState.streak;
  const streakAdvanced = !streakState.today;
  const bonus = streakAdvanced ? STREAK_BONUS_XP : 0;
  const newXp = prevXp + xp + bonus;

  await supabase
    .from("profiles")
    .update({
      xp: newXp,
      streak: newStreak,
      last_activity_date: today,
    })
    .eq("id", userId);
  // Fire-and-forget: verifica e credita bônus de qualquer desafio ativo.
  try {
    await checkFinishChallenges(userId);
  } catch {
    /* silencioso — não deve bloquear a UX de conclusão */
  }
  return { prevStreak, newStreak, prevXp, newXp, streakBonus: bonus };
}
