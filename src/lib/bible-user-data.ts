// Dados pessoais do módulo Bíblia: destaques, anotações, favoritos,
// marcadores e progresso de leitura (tabelas bible_* no backend).

import { supabase } from "@/integrations/supabase/client";

export type HighlightColor = "white" | "yellow" | "blue" | "green" | "pink" | "gray";

const HIGHLIGHT_ALIASES: Record<string, HighlightColor> = {
  amber: "yellow",
  purple: "gray",
};

export const HIGHLIGHT_COLORS: { id: HighlightColor; label: string; className: string }[] = [
  { id: "white", label: "Branco", className: "bible-highlight bible-highlight-white" },
  { id: "yellow", label: "Amarelo", className: "bible-highlight bible-highlight-yellow" },
  { id: "blue", label: "Azul", className: "bible-highlight bible-highlight-blue" },
  { id: "green", label: "Verde", className: "bible-highlight bible-highlight-green" },
  { id: "pink", label: "Rosa", className: "bible-highlight bible-highlight-pink" },
  { id: "gray", label: "Cinza", className: "bible-highlight bible-highlight-gray" },
];

export function normalizeHighlightColor(color: string | undefined): HighlightColor | undefined {
  if (!color) return undefined;
  if (HIGHLIGHT_COLORS.some((item) => item.id === color)) return color as HighlightColor;
  return HIGHLIGHT_ALIASES[color];
}

export function highlightClass(color: string): string {
  return HIGHLIGHT_COLORS.find((c) => c.id === normalizeHighlightColor(color))?.className
    ?? HIGHLIGHT_COLORS[0].className;
}

export type VerseRef = { book: number; chapter: number; verse: number };

export type BibleHighlight = VerseRef & { id: string; color: string };
export type BibleNote = VerseRef & { id: string; content: string; created_at: string };
export type BibleFavorite = VerseRef & { id: string; created_at: string };
export type BibleBookmark = VerseRef & { id: string; label: string | null; created_at: string };

async function uid(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function listChapterMarks(book: number, chapter: number) {
  const userId = await uid();
  if (!userId) {
    return { highlights: [], notes: [], favorites: [] };
  }

  const [h, n, f] = await Promise.all([
    supabase
      .from("bible_highlights")
      .select("id, book, chapter, verse, color")
      .eq("user_id", userId)
      .eq("book", book)
      .eq("chapter", chapter),
    supabase
      .from("bible_notes")
      .select("id, book, chapter, verse, content, created_at")
      .eq("user_id", userId)
      .eq("book", book)
      .eq("chapter", chapter),
    supabase
      .from("bible_favorites")
      .select("id, book, chapter, verse, created_at")
      .eq("user_id", userId)
      .eq("book", book)
      .eq("chapter", chapter),
  ]);

  return {
    highlights: (h.data ?? []) as BibleHighlight[],
    notes: (n.data ?? []) as BibleNote[],
    favorites: (f.data ?? []) as BibleFavorite[],
  };
}

export async function toggleHighlight(ref: VerseRef, color: HighlightColor) {
  const userId = await uid();
  if (!userId) return null;
  const { data: existing } = await supabase
    .from("bible_highlights")
    .select("id, color")
    .eq("user_id", userId)
    .eq("book", ref.book)
    .eq("chapter", ref.chapter)
    .eq("verse", ref.verse)
    .maybeSingle();
  if (existing && existing.color === color) {
    await supabase.from("bible_highlights").delete().eq("id", existing.id).eq("user_id", userId);
    return null;
  }
  const { data } = await supabase
    .from("bible_highlights")
    .upsert({ user_id: userId, ...ref, color }, { onConflict: "user_id,book,chapter,verse" })
    .select("id, book, chapter, verse, color")
    .single();
  return (data ?? null) as BibleHighlight | null;
}


export async function clearHighlight(ref: VerseRef) {
  const userId = await uid();
  if (!userId) return;
  await supabase
    .from("bible_highlights")
    .delete()
    .eq("user_id", userId)
    .eq("book", ref.book)
    .eq("chapter", ref.chapter)
    .eq("verse", ref.verse);
}

export async function toggleFavorite(ref: VerseRef) {
  const userId = await uid();
  if (!userId) return false;
  const { data: existing } = await supabase
    .from("bible_favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("book", ref.book)
    .eq("chapter", ref.chapter)
    .eq("verse", ref.verse)
    .maybeSingle();
  if (existing) {
    await supabase.from("bible_favorites").delete().eq("id", existing.id).eq("user_id", userId);
    return false;
  }
  await supabase.from("bible_favorites").insert({ user_id: userId, ...ref });
  return true;
}

export async function addNote(ref: VerseRef, content: string) {
  const userId = await uid();
  if (!userId) return null;
  const { data } = await supabase
    .from("bible_notes")
    .insert({ user_id: userId, ...ref, content })
    .select("id, book, chapter, verse, content, created_at")
    .single();
  return (data ?? null) as BibleNote | null;
}

export async function deleteNote(id: string) {
  const userId = await uid();
  if (!userId) return;
  await supabase.from("bible_notes").delete().eq("id", id).eq("user_id", userId);
}

export async function toggleBookmark(ref: VerseRef, label?: string) {
  const userId = await uid();
  if (!userId) return false;
  const { data: existing } = await supabase
    .from("bible_bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("book", ref.book)
    .eq("chapter", ref.chapter)
    .eq("verse", ref.verse)
    .maybeSingle();
  if (existing) {
    await supabase.from("bible_bookmarks").delete().eq("id", existing.id).eq("user_id", userId);
    return false;
  }
  await supabase.from("bible_bookmarks").insert({ user_id: userId, ...ref, label: label ?? null });
  return true;
}

export async function markChapterRead(book: number, chapter: number) {
  const userId = await uid();
  if (!userId) return;
  await supabase
    .from("bible_reading_progress")
    .upsert({ user_id: userId, book, chapter }, { onConflict: "user_id,book,chapter" });
}

export async function listReadChapters(): Promise<{ book: number; chapter: number }[]> {
  const userId = await uid();
  if (!userId) return [];

  const { data } = await supabase
    .from("bible_reading_progress")
    .select("book, chapter")
    .eq("user_id", userId);

  return (data ?? []) as { book: number; chapter: number }[];
}

export async function listAllMarks() {
  const userId = await uid();
  if (!userId) {
    return { highlights: [], notes: [], favorites: [], bookmarks: [] };
  }

  const [h, n, f, b] = await Promise.all([
    supabase
      .from("bible_highlights")
      .select("id, book, chapter, verse, color")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("bible_notes")
      .select("id, book, chapter, verse, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("bible_favorites")
      .select("id, book, chapter, verse, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("bible_bookmarks")
      .select("id, book, chapter, verse, label, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);
  return {
    highlights: (h.data ?? []) as BibleHighlight[],
    notes: (n.data ?? []) as BibleNote[],
    favorites: (f.data ?? []) as BibleFavorite[],
    bookmarks: (b.data ?? []) as BibleBookmark[],
  };
}
