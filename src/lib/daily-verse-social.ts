// Curtidas, comentários e compartilhamentos do Versículo do dia — tudo
// público (visível e curtível por qualquer discípulo, sem precisar ser
// contato/amigo), escopado por `verse_date` para que cada dia tenha seu
// próprio mural. Mesmo padrão de dados do Feed (feed_likes/feed_comments/
// feed_comment_likes em src/routes/_authenticated/mural.tsx).

import { supabase } from "@/integrations/supabase/client";

export type DailyVerseComment = {
  id: string;
  verse_date: string;
  user_id: string;
  author_name: string;
  author_avatar_url: string | null;
  body: string | null;
  gif_url: string | null;
  created_at: string;
};

export async function getCounts(verseDate: string, userId: string | null) {
  const [{ data: likes }, { data: comments }, { data: shares }] = await Promise.all([
    supabase.from("daily_verse_likes").select("user_id").eq("verse_date", verseDate),
    supabase.from("daily_verse_comments").select("id").eq("verse_date", verseDate),
    supabase.from("daily_verse_shares").select("id").eq("verse_date", verseDate),
  ]);
  return {
    likeCount: likes?.length ?? 0,
    liked: !!userId && (likes ?? []).some((l) => l.user_id === userId),
    commentCount: comments?.length ?? 0,
    shareCount: shares?.length ?? 0,
  };
}

export async function toggleVerseLike(verseDate: string, userId: string, currentlyLiked: boolean) {
  if (currentlyLiked) {
    await supabase
      .from("daily_verse_likes")
      .delete()
      .eq("verse_date", verseDate)
      .eq("user_id", userId);
  } else {
    await supabase.from("daily_verse_likes").insert({ verse_date: verseDate, user_id: userId });
  }
}

export async function recordVerseShare(verseDate: string, userId: string) {
  await supabase.from("daily_verse_shares").insert({ verse_date: verseDate, user_id: userId });
}

export async function listComments(verseDate: string): Promise<DailyVerseComment[]> {
  const { data } = await supabase
    .from("daily_verse_comments")
    .select("*")
    .eq("verse_date", verseDate)
    .order("created_at", { ascending: true });
  return (data ?? []) as DailyVerseComment[];
}

export async function addComment(params: {
  verseDate: string;
  userId: string;
  authorName: string;
  authorAvatarUrl: string | null;
  body: string;
  gifUrl: string | null;
}) {
  const { error } = await supabase.from("daily_verse_comments").insert({
    verse_date: params.verseDate,
    user_id: params.userId,
    author_name: params.authorName,
    author_avatar_url: params.authorAvatarUrl,
    body: params.body,
    gif_url: params.gifUrl,
  });
  return !error;
}

export async function deleteComment(commentId: string) {
  await supabase.from("daily_verse_comments").delete().eq("id", commentId);
}

export async function loadCommentLikes(commentIds: string[], userId: string | null) {
  if (commentIds.length === 0) return { counts: {}, mine: new Set<string>() };
  const { data } = await supabase
    .from("daily_verse_comment_likes")
    .select("comment_id, user_id")
    .in("comment_id", commentIds);
  const counts: Record<string, number> = {};
  const mine = new Set<string>();
  for (const l of data ?? []) {
    counts[l.comment_id] = (counts[l.comment_id] ?? 0) + 1;
    if (userId && l.user_id === userId) mine.add(l.comment_id);
  }
  return { counts, mine };
}

export async function toggleCommentLike(
  commentId: string,
  userId: string,
  currentlyLiked: boolean,
) {
  if (currentlyLiked) {
    await supabase
      .from("daily_verse_comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", userId);
  } else {
    await supabase
      .from("daily_verse_comment_likes")
      .insert({ comment_id: commentId, user_id: userId });
  }
}
