ALTER TABLE public.feed_comments ADD COLUMN IF NOT EXISTS gif_url text;
ALTER TABLE public.feed_comments ALTER COLUMN body SET DEFAULT '';

CREATE TABLE IF NOT EXISTS public.feed_comment_likes (
  comment_id uuid NOT NULL REFERENCES public.feed_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.feed_comment_likes TO authenticated;
GRANT ALL ON public.feed_comment_likes TO service_role;

ALTER TABLE public.feed_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feed_comment_likes_read_all" ON public.feed_comment_likes
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "feed_comment_likes_insert_own" ON public.feed_comment_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_comment_likes_delete_own" ON public.feed_comment_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);