-- Feed: comentários passam a guardar o avatar de quem comentou (mesmo
-- espírito de "foto" usado em feed_items, para não mudar retroativamente),
-- podem carregar um GIF, e passam a ser curtíveis.

ALTER TABLE public.feed_comments ADD COLUMN IF NOT EXISTS author_avatar_url text;
ALTER TABLE public.feed_comments ADD COLUMN IF NOT EXISTS gif_url text;

-- Um comentário agora pode ser só texto, só GIF, ou os dois — mas não vazio.
ALTER TABLE public.feed_comments ALTER COLUMN body DROP NOT NULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'feed_comments_body_or_gif_chk'
  ) THEN
    ALTER TABLE public.feed_comments
      ADD CONSTRAINT feed_comments_body_or_gif_chk
      CHECK (coalesce(body, '') <> '' OR gif_url IS NOT NULL);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.feed_comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.feed_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
CREATE INDEX IF NOT EXISTS feed_comment_likes_comment_idx ON public.feed_comment_likes (comment_id);

GRANT SELECT, INSERT, DELETE ON public.feed_comment_likes TO authenticated;
GRANT ALL ON public.feed_comment_likes TO service_role;

ALTER TABLE public.feed_comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feed_comment_likes_select_all" ON public.feed_comment_likes;
CREATE POLICY "feed_comment_likes_select_all" ON public.feed_comment_likes
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "feed_comment_likes_insert_own" ON public.feed_comment_likes;
CREATE POLICY "feed_comment_likes_insert_own" ON public.feed_comment_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "feed_comment_likes_delete_own" ON public.feed_comment_likes;
CREATE POLICY "feed_comment_likes_delete_own" ON public.feed_comment_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.feed_comment_likes;
