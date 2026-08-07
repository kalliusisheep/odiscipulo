const APP_TIME_ZONE = "America/Sao_Paulo";

function getDatePart(parts: Intl.DateTimeFormatPart[], type: string) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

/**
 * Retorna a data civil do app. O banco guarda apenas a data, então ela deve
 * ser calculada no mesmo fuso em todos os dispositivos.
 */
export function todayStr(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return [
    getDatePart(parts, "year"),
    getDatePart(parts, "month"),
    getDatePart(parts, "day"),
  ].join("-");
}

function dayNumber(dateKey: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);

  if (
    Number.isNaN(timestamp)
    || new Date(timestamp).getUTCFullYear() !== year
    || new Date(timestamp).getUTCMonth() !== month - 1
    || new Date(timestamp).getUTCDate() !== day
  ) {
    return null;
  }

  return timestamp / 86_400_000;
}

export function calendarDayDifference(currentDate: string, previousDate: string): number | null {
  const currentDay = dayNumber(currentDate);
  const previousDay = dayNumber(previousDate);
  if (currentDay === null || previousDay === null) return null;
  return currentDay - previousDay;
}

export function computeStreak(
  currentStreak: number,
  lastDate: string | null,
): { streak: number; today: boolean } {
  const today = todayStr();
  if (!lastDate) return { streak: 1, today: false };

  const diff = calendarDayDifference(today, lastDate);
  if (diff === 0) return { streak: Math.max(currentStreak, 1), today: true };
  if (diff === 1) return { streak: Math.max(currentStreak, 0) + 1, today: false };
  return { streak: 1, today: false };
}
