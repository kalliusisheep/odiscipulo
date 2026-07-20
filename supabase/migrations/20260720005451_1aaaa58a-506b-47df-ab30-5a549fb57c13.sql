
-- 1. Username on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_key ON public.profiles (lower(username));

-- 2. Friendships (bidirectional; store as two rows for simple queries)
CREATE TABLE IF NOT EXISTS public.friendships (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id <> friend_id)
);
GRANT SELECT, INSERT, DELETE ON public.friendships TO authenticated;
GRANT ALL ON public.friendships TO service_role;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friendships_select_involved" ON public.friendships
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "friendships_insert_own" ON public.friendships
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "friendships_delete_own" ON public.friendships
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. are_friends helper
CREATE OR REPLACE FUNCTION public.are_friends(_a uuid, _b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.friendships
    WHERE user_id = _a AND friend_id = _b
  );
$$;

-- 4. Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_pair_idx ON public.messages (sender_id, recipient_id, created_at);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select_involved" ON public.messages
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_insert_sender" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 5. Update mural_posts SELECT policy: seed (user_id null), own, or friends
DROP POLICY IF EXISTS "mural_read_all" ON public.mural_posts;
CREATE POLICY "mural_read_friends_or_own" ON public.mural_posts
  FOR SELECT USING (
    user_id IS NULL
    OR auth.uid() = user_id
    OR public.are_friends(auth.uid(), user_id)
  );
