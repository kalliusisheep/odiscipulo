// Versículo do dia: escolhe uma referência do pool `daily_verses` de forma
// determinística a partir da data — todo mundo vê o MESMO versículo no
// mesmo dia, e ele troca sozinho à meia-noite (fuso America/Sao_Paulo),
// sem precisar de nenhum job/cron. `verseDateKey()` também é a chave usada
// para escopar curtidas/comentários/compartilhamentos por dia.

import { supabase } from "@/integrations/supabase/client";

export type DailyVerseRow = {
  id: string;
  ord: number;
  book: number;
  chapter: number;
  verse_start: number;
  verse_end: number | null;
  ref_label: string;
};

const TIMEZONE = "America/Sao_Paulo";

/** Data de hoje no fuso do app, como "YYYY-MM-DD" — muda exatamente à meia-noite local. */
export function verseDateKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

/** Dias corridos desde uma data-âncora fixa, a partir da chave "YYYY-MM-DD". */
function daysSinceEpoch(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  const utcMidnight = Date.UTC(y, m - 1, d);
  const epoch = Date.UTC(2024, 0, 1); // âncora arbitrária, só precisa ser fixa
  return Math.floor((utcMidnight - epoch) / 86_400_000);
}

/** Escolhe o versículo do dia dentro da lista (ordenada por `ord`), ciclando. */
export function pickTodayVerse(
  list: DailyVerseRow[],
  dateKey: string = verseDateKey(),
): DailyVerseRow | null {
  if (list.length === 0) return null;
  const sorted = [...list].sort((a, b) => a.ord - b.ord);
  const idx = ((daysSinceEpoch(dateKey) % sorted.length) + sorted.length) % sorted.length;
  return sorted[idx];
}

export async function fetchDailyVersePool(): Promise<DailyVerseRow[]> {
  const { data, error } = await supabase
    .from("daily_verses")
    .select("id, ord, book, chapter, verse_start, verse_end, ref_label")
    .order("ord", { ascending: true });
  if (error || !data) return [];
  return data as DailyVerseRow[];
}

/** Referência a passar para `fetchPassage` (src/lib/bible.ts) — `ref_label`
 * já vem no formato exato esperado ("João 3:16", "Romanos 8:38-39" etc.). */
export function apiRefFor(verse: DailyVerseRow): string {
  return verse.ref_label;
}
