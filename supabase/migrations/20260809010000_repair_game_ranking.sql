-- Repara o backend do ranking global dos jogos de forma idempotente.
-- Pode ser aplicada mesmo quando migrations anteriores foram parcialmente executadas.

CREATE TABLE IF NOT EXISTS public.game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_key text NOT NULL CHECK (game_key IN ('milhao', 'personagem', 'versiculo', 'cruzadas')),
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  rounds integer NOT NULL DEFAULT 0 CHECK (rounds >= 0),
  best_streak integer NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  played_at timestamptz NOT NULL DEFAULT now(),
  room_id uuid
);

ALTER TABLE public.game_scores
  ADD COLUMN IF NOT EXISTS correct_answers integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rounds integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS best_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS played_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS room_id uuid;

CREATE INDEX IF NOT EXISTS game_scores_game_score_idx
  ON public.game_scores (game_key, score DESC, played_at ASC);

CREATE INDEX IF NOT EXISTS game_scores_user_game_idx
  ON public.game_scores (user_id, game_key, played_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS game_scores_room_user_unique
  ON public.game_scores (room_id, user_id)
  WHERE room_id IS NOT NULL;

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_scores_select_all_authenticated" ON public.game_scores;
CREATE POLICY "game_scores_select_all_authenticated"
  ON public.game_scores FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "game_scores_insert_own" ON public.game_scores;
CREATE POLICY "game_scores_insert_own"
  ON public.game_scores FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP FUNCTION IF EXISTS public.get_game_leaderboard(text, integer);

CREATE OR REPLACE FUNCTION public.get_game_leaderboard(
  _game_key text,
  _limit integer DEFAULT 100
)
RETURNS TABLE (
  "position" bigint,
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
    FROM public.game_scores AS gs
    WHERE gs.game_key = _game_key
    GROUP BY gs.user_id
  ),
  ranked AS (
    SELECT
      ROW_NUMBER() OVER (
        ORDER BY totals.best_score DESC,
                 totals.total_score DESC,
                 totals.best_streak DESC,
                 totals.user_id
      )::bigint AS rank_position,
      totals.*
    FROM totals
  )
  SELECT
    ranked.rank_position AS "position",
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
  JOIN public.profiles
    ON profiles.id = ranked.user_id
  ORDER BY ranked.rank_position
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 100), 100));
$$;

DROP FUNCTION IF EXISTS public.record_game_result(text, integer, integer, integer, integer);

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
  safe_score integer := GREATEST(0, COALESCE(_score, 0));
  safe_correct integer := GREATEST(0, COALESCE(_correct_answers, 0));
  safe_rounds integer := GREATEST(0, COALESCE(_rounds, 0));
  safe_streak integer := GREATEST(0, COALESCE(_best_streak, 0));
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'session_required';
  END IF;

  IF _game_key NOT IN ('milhao', 'personagem', 'versiculo', 'cruzadas') THEN
    RAISE EXCEPTION 'invalid_game_key';
  END IF;

  IF safe_rounds < 1 OR safe_rounds > 30 THEN
    RAISE EXCEPTION 'invalid_rounds';
  END IF;

  IF safe_correct > safe_rounds * 20 OR safe_streak > safe_correct THEN
    RAISE EXCEPTION 'invalid_game_result';
  END IF;

  IF safe_score > safe_rounds * 1000 THEN
    RAISE EXCEPTION 'score_out_of_range';
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
    safe_score,
    safe_correct,
    safe_rounds,
    safe_streak
  )
  RETURNING * INTO result_row;

  RETURN result_row;
END;
$$;

GRANT SELECT ON public.game_scores TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_game_leaderboard(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_game_result(text, integer, integer, integer, integer) TO authenticated;
