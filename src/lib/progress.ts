import { supabase } from "@/integrations/supabase/client";

/**
 * Award XP and update daily streak for the current user.
 * Returns the previous and new streak so callers can trigger a level-up celebration.
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
  const newStreak =
    diff === null ? 1 : diff === 0 ? (prevStreak || 1) : diff === 1 ? prevStreak + 1 : 1;
  await supabase
    .from("profiles")
    .update({
      xp: (p?.xp ?? 0) + xp,
      streak: newStreak,
      last_activity_date: today,
    })
    .eq("id", userId);
  return { prevStreak, newStreak };
}
