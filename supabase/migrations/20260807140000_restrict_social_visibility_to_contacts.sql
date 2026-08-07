-- Restringe o conteúdo social a contatos aceitos.
-- O usuário continua vendo as próprias publicações; usuários sem vínculo
-- não aparecem no Feed nem no mural de oração.

DO $$
DECLARE
  policy_row record;
BEGIN
  IF to_regclass('public.feed_items') IS NOT NULL THEN
    ALTER TABLE public.feed_items ENABLE ROW LEVEL SECURITY;

    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'feed_items'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.feed_items', policy_row.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "feed_items_read_contacts"
      ON public.feed_items
      FOR SELECT TO authenticated
      USING (
        auth.uid() = user_id
        OR (
          public.are_friends(auth.uid(), user_id)
          OR public.are_friends(user_id, auth.uid())
        )
      )';
  END IF;

  IF to_regclass('public.feed_comments') IS NOT NULL
     AND to_regclass('public.feed_items') IS NOT NULL THEN
    ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'feed_comments'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.feed_comments', policy_row.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "feed_comments_read_visible_items"
      ON public.feed_comments
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.feed_items
          WHERE feed_items.id = feed_comments.item_id
            AND (
              auth.uid() = feed_items.user_id
              OR (
                public.are_friends(auth.uid(), feed_items.user_id)
                OR public.are_friends(feed_items.user_id, auth.uid())
              )
            )
        )
      )';
  END IF;

  IF to_regclass('public.feed_likes') IS NOT NULL
     AND to_regclass('public.feed_items') IS NOT NULL THEN
    ALTER TABLE public.feed_likes ENABLE ROW LEVEL SECURITY;

    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'feed_likes'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.feed_likes', policy_row.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "feed_likes_read_visible_items"
      ON public.feed_likes
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.feed_items
          WHERE feed_items.id = feed_likes.item_id
            AND (
              auth.uid() = feed_items.user_id
              OR (
                public.are_friends(auth.uid(), feed_items.user_id)
                OR public.are_friends(feed_items.user_id, auth.uid())
              )
            )
        )
      )';
  END IF;

  IF to_regclass('public.mural_posts') IS NOT NULL THEN
    ALTER TABLE public.mural_posts ENABLE ROW LEVEL SECURITY;

    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'mural_posts'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.mural_posts', policy_row.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "mural_posts_read_contacts"
      ON public.mural_posts
      FOR SELECT
      USING (
        auth.uid() = user_id
        OR (
          user_id IS NOT NULL
          AND public.are_friends(auth.uid(), user_id)
        )
      )';
  END IF;

  IF to_regclass('public.mural_amens') IS NOT NULL
     AND to_regclass('public.mural_posts') IS NOT NULL THEN
    ALTER TABLE public.mural_amens ENABLE ROW LEVEL SECURITY;

    FOR policy_row IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'mural_amens'
        AND cmd = 'SELECT'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.mural_amens', policy_row.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY "mural_amens_read_visible_posts"
      ON public.mural_amens
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.mural_posts
          WHERE mural_posts.id = mural_amens.post_id
            AND (
              auth.uid() = mural_posts.user_id
              OR (
                mural_posts.user_id IS NOT NULL
                AND public.are_friends(auth.uid(), mural_posts.user_id)
              )
            )
        )
      )';
  END IF;
END
$$;
