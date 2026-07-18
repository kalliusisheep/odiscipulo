// Utilitário para calcular streak simples com base em last_activity_date.
import { differenceInCalendarDays, format } from "date-fns";

export function computeStreak(currentStreak: number, lastDate: string | null): { streak: number; today: boolean } {
  const today = format(new Date(), "yyyy-MM-dd");
  if (!lastDate) return { streak: 1, today: false };
  const diff = differenceInCalendarDays(new Date(today), new Date(lastDate));
  if (diff === 0) return { streak: currentStreak, today: true };
  if (diff === 1) return { streak: currentStreak + 1, today: false };
  return { streak: 1, today: false };
}

export const todayStr = () => format(new Date(), "yyyy-MM-dd");
