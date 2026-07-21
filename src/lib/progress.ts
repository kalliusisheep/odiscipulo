import { supabase } from "@/integrations/supabase/client";

const STREAK_BONUS_XP = 10;

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
  const today = new Date().toISOString().slice(0, 10);
  const last = p?.last_activity_date ?? null;
  const diff = last
    ? Math.floor((new Date(today).getTime() - new Date(last).getTime()) / 86400000)
    : null;
  const prevStreak = p?.streak ?? 0;
  const prevXp = p?.xp ?? 0;

  const newStreak =
    diff === null ? 1 : diff === 0 ? (prevStreak || 1) : diff === 1 ? prevStreak + 1 : 1;
  const streakAdvanced = diff === null || diff >= 1;
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
  return { prevStreak, newStreak, prevXp, newXp, streakBonus: bonus };
}
