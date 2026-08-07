-- Consolidação de ranking global e partidas compartilhadas.
-- Idempotente para projetos que já aplicaram parte das migrations anteriores.

CREATE TABLE IF NOT EXISTS public.game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_key text NOT NULL CHECK (game_key IN ('milhao', 'personagem', 'versiculo', 'cruzadas')),
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  rounds integer NOT NULL DEFAULT 0 CHECK (rounds >= 0),
  best_streak integer NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  played_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS game_scores_game_score_idx
  ON public.game_scores (game_key, score DESC, played_at ASC);

CREATE INDEX IF NOT EXISTS game_scores_user_game_idx
  ON public.game_scores (user_id, game_key, played_at DESC);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'game_scores'
      AND policyname = 'game_scores_select_all_authenticated'
  ) THEN
    CREATE POLICY "game_scores_select_all_authenticated"
      ON public.game_scores FOR SELECT TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'game_scores'
      AND policyname = 'game_scores_insert_own'
  ) THEN
    CREATE POLICY "game_scores_insert_own"
      ON public.game_scores FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.record_game_result(
  _game_key text,
  _score integer,
  _correct_answers integer DEFAULT 0,
  _rounds integer DEFAULT 0,
  _best_streak integer DEFAULT 0
)
RETURNS public.game_scores
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_row public.game_scores;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'session_required';
  END IF;

  IF _game_key NOT IN ('milhao', 'personagem', 'versiculo', 'cruzadas') THEN
    RAISE EXCEPTION 'invalid_game_key';
  END IF;

  INSERT INTO public.game_scores (
    user_id,
    game_key,
    score,
    correct_answers,
    rounds,
    best_streak
  )
  VALUES (
    auth.uid(),
    _game_key,
    GREATEST(0, COALESCE(_score, 0)),
    GREATEST(0, COALESCE(_correct_answers, 0)),
    GREATEST(0, COALESCE(_rounds, 0)),
    GREATEST(0, COALESCE(_best_streak, 0))
  )
  RETURNING * INTO result_row;

  RETURN result_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_game_leaderboard(
  _game_key text,
  _limit integer DEFAULT 100
)
RETURNS TABLE (
  position bigint,
  user_id uuid,
  display_name text,
  username text,
  avatar_char text,
  avatar_url text,
  best_score bigint,
  total_score bigint,
  games_played bigint,
  best_streak integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH totals AS (
    SELECT
      gs.user_id,
      MAX(gs.score)::bigint AS best_score,
      SUM(gs.score)::bigint AS total_score,
      COUNT(*)::bigint AS games_played,
      MAX(gs.best_streak)::integer AS best_streak
    FROM public.game_scores gs
    WHERE gs.game_key = _game_key
    GROUP BY gs.user_id
  ),
  ranked AS (
    SELECT
      ROW_NUMBER() OVER (
        ORDER BY best_score DESC, total_score DESC, best_streak DESC, user_id
      )::bigint AS position,
      totals.*
    FROM totals
  )
  SELECT
    ranked.position,
    ranked.user_id,
    profiles.display_name,
    profiles.username,
    profiles.avatar_char,
    profiles.avatar_url,
    ranked.best_score,
    ranked.total_score,
    ranked.games_played,
    ranked.best_streak
  FROM ranked
  JOIN public.profiles profiles ON profiles.id = ranked.user_id
  ORDER BY ranked.position
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 100), 100));
$$;

GRANT SELECT ON public.game_scores TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_game_result(text, integer, integer, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_game_leaderboard(text, integer) TO authenticated;

ALTER TABLE public.character_game_rooms
  ADD COLUMN IF NOT EXISTS game_type text NOT NULL DEFAULT 'personagem';

ALTER TABLE public.character_game_rooms
  DROP CONSTRAINT IF EXISTS character_game_rooms_game_type_check;

ALTER TABLE public.character_game_rooms
  ADD CONSTRAINT character_game_rooms_game_type_check
  CHECK (game_type IN ('personagem', 'versiculo', 'cruzadas', 'milhao'));

ALTER TABLE public.character_game_room_players
  DROP CONSTRAINT IF EXISTS character_game_room_players_state_check;

ALTER TABLE public.character_game_room_players
  ADD CONSTRAINT character_game_room_players_state_check
  CHECK (state IN ('invited', 'waiting', 'connected', 'ready', 'disconnected', 'left', 'declined'));

ALTER TABLE public.character_game_room_players
  ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  ADD COLUMN IF NOT EXISTS correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  ADD COLUMN IF NOT EXISTS best_streak integer NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  ADD COLUMN IF NOT EXISTS last_answer_at timestamptz;

CREATE TABLE IF NOT EXISTS public.character_game_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.character_game_rooms(id) ON DELETE CASCADE,
  round_number smallint NOT NULL,
  character_id text NOT NULL,
  hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  revealed_hint_indexes smallint[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'won', 'all_wrong', 'expired')),
  winner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  points_available integer NOT NULL DEFAULT 100,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  UNIQUE (room_id, round_number)
);

CREATE TABLE IF NOT EXISTS public.character_game_answers (
  round_id uuid NOT NULL REFERENCES public.character_game_rounds(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_hash text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (round_id, user_id)
);

ALTER TABLE public.character_game_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_game_answers ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_character_game_member(_room_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.character_game_room_players
    WHERE room_id = _room_id
      AND user_id = auth.uid()
      AND state <> 'left'
  );
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'character_game_rounds'
      AND policyname = 'members can read rounds'
  ) THEN
    CREATE POLICY "members can read rounds"
      ON public.character_game_rounds FOR SELECT
      USING (public.is_character_game_member(room_id));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'character_game_answers'
      AND policyname = 'members can read answers'
  ) THEN
    CREATE POLICY "members can read answers"
      ON public.character_game_answers FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.character_game_rounds rounds
          WHERE rounds.id = round_id
            AND public.is_character_game_member(rounds.room_id)
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'character_game_answers'
      AND policyname = 'users submit own answers'
  ) THEN
    CREATE POLICY "users submit own answers"
      ON public.character_game_answers FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.ensure_character_game_round(
  _room_id uuid,
  _round_number smallint,
  _character_id text,
  _hints jsonb DEFAULT '[]'::jsonb
)
RETURNS public.character_game_rounds
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  round_row public.character_game_rounds;
  room_row public.character_game_rooms;
BEGIN
  SELECT * INTO room_row
  FROM public.character_game_rooms
  WHERE id = _room_id;

  IF room_row.id IS NULL OR NOT public.is_character_game_member(_room_id) THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  IF room_row.status NOT IN ('playing', 'finished') THEN
    RAISE EXCEPTION 'room_not_playing';
  END IF;

  SELECT * INTO round_row
  FROM public.character_game_rounds
  WHERE room_id = _room_id
    AND round_number = _round_number;

  IF round_row.id IS NOT NULL THEN
    RETURN round_row;
  END IF;

  INSERT INTO public.character_game_rounds (
    room_id,
    round_number,
    character_id,
    hints,
    points_available
  )
  VALUES (
    _room_id,
    _round_number,
    _character_id,
    COALESCE(_hints, '[]'::jsonb),
    100
  )
  ON CONFLICT (room_id, round_number) DO NOTHING
  RETURNING * INTO round_row;

  IF round_row.id IS NULL THEN
    SELECT * INTO round_row
    FROM public.character_game_rounds
    WHERE room_id = _room_id
      AND round_number = _round_number;
  END IF;

  RETURN round_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_character_game_response(
  _round_id uuid,
  _answer_hash text,
  _is_correct boolean,
  _points integer DEFAULT 0,
  _streak integer DEFAULT 0
)
RETURNS public.character_game_rounds
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  round_row public.character_game_rounds;
  active_players integer;
  locked_answers integer;
  accepted_points integer;
BEGIN
  SELECT rounds.* INTO round_row
  FROM public.character_game_rounds rounds
  JOIN public.character_game_room_players players
    ON players.room_id = rounds.room_id
  WHERE rounds.id = _round_id
    AND players.user_id = auth.uid()
    AND players.state IN ('connected', 'ready')
  FOR UPDATE OF rounds;

  IF round_row.id IS NULL THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  INSERT INTO public.character_game_answers (
    round_id,
    user_id,
    answer_hash,
    is_correct,
    is_locked
  )
  VALUES (
    _round_id,
    auth.uid(),
    COALESCE(NULLIF(_answer_hash, ''), 'empty'),
    COALESCE(_is_correct, false),
    NOT COALESCE(_is_correct, false)
  )
  ON CONFLICT (round_id, user_id) DO NOTHING;

  IF NOT FOUND THEN
    SELECT * INTO round_row
    FROM public.character_game_rounds
    WHERE id = _round_id;
    RETURN round_row;
  END IF;

  UPDATE public.character_game_room_players
  SET last_answer_at = now(),
      last_seen_at = now()
  WHERE room_id = round_row.room_id
    AND user_id = auth.uid();

  IF COALESCE(_is_correct, false) AND round_row.status = 'active' THEN
    accepted_points := GREATEST(
      0,
      LEAST(COALESCE(_points, 0), round_row.points_available)
    );

    UPDATE public.character_game_rounds
    SET status = 'won',
        winner_id = auth.uid(),
        closed_at = now()
    WHERE id = _round_id
      AND status = 'active';

    IF FOUND THEN
      UPDATE public.character_game_room_players
      SET score = score + accepted_points,
          correct_answers = correct_answers + 1,
          best_streak = GREATEST(
            best_streak,
            GREATEST(0, COALESCE(_streak, 0))
          )
      WHERE room_id = round_row.room_id
        AND user_id = auth.uid();
    END IF;
  ELSIF NOT COALESCE(_is_correct, false) AND round_row.status = 'active' THEN
    SELECT count(*) INTO active_players
    FROM public.character_game_room_players
    WHERE room_id = round_row.room_id
      AND state IN ('connected', 'ready');

    SELECT count(*) INTO locked_answers
    FROM public.character_game_answers
    WHERE round_id = _round_id
      AND is_locked;

    IF active_players > 0 AND locked_answers >= active_players THEN
      UPDATE public.character_game_rounds
      SET status = 'all_wrong',
          closed_at = now()
      WHERE id = _round_id
        AND status = 'active';
    END IF;
  END IF;

  SELECT * INTO round_row
  FROM public.character_game_rounds
  WHERE id = _round_id;

  RETURN round_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.finish_character_game_room(_room_id uuid)
RETURNS public.character_game_rooms
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_row public.character_game_rooms;
BEGIN
  IF NOT public.is_character_game_member(_room_id) THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  UPDATE public.character_game_rooms
  SET status = 'finished',
      finished_at = COALESCE(finished_at, now())
  WHERE id = _room_id
    AND status <> 'cancelled'
  RETURNING * INTO room_row;

  IF room_row.id IS NULL THEN
    SELECT * INTO room_row
    FROM public.character_game_rooms
    WHERE id = _room_id;
  END IF;

  RETURN room_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_character_game_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_character_game_round(uuid, smallint, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_character_game_response(uuid, text, boolean, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finish_character_game_room(uuid) TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'character_game_rounds'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.character_game_rounds';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'character_game_answers'
    ) THEN
      EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.character_game_answers';
    END IF;
  END IF;
END
$$;

ALTER TABLE public.character_game_rounds REPLICA IDENTITY FULL;
ALTER TABLE public.character_game_answers REPLICA IDENTITY FULL;
