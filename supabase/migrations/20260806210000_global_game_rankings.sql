-- Rankings globais por jogo, independentes da lista de amigos.

CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_key TEXT NOT NULL CHECK (game_key IN ('milhao', 'personagem', 'versiculo', 'cruzadas')),
  score INT NOT NULL CHECK (score >= 0),
  correct_answers INT NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  rounds INT NOT NULL DEFAULT 0 CHECK (rounds >= 0),
  best_streak INT NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS game_scores_game_score_idx
  ON public.game_scores (game_key, score DESC, played_at ASC);

CREATE INDEX IF NOT EXISTS game_scores_user_game_idx
  ON public.game_scores (user_id, game_key, played_at DESC);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_scores_select_all_authenticated" ON public.game_scores;
CREATE POLICY "game_scores_select_all_authenticated"
  ON public.game_scores FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "game_scores_insert_own" ON public.game_scores;
CREATE POLICY "game_scores_insert_own"
  ON public.game_scores FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.record_game_result(
  _game_key TEXT,
  _score INT,
  _correct_answers INT DEFAULT 0,
  _rounds INT DEFAULT 0,
  _best_streak INT DEFAULT 0
)
RETURNS public.game_scores
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result_row public.game_scores;
BEGIN
  IF _game_key NOT IN ('milhao', 'personagem', 'versiculo', 'cruzadas') THEN
    RAISE EXCEPTION 'invalid_game_key';
  END IF;

  INSERT INTO public.game_scores (user_id, game_key, score, correct_answers, rounds, best_streak)
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
  _game_key TEXT,
  _limit INT DEFAULT 100
)
RETURNS TABLE (
  position BIGINT,
  user_id UUID,
  display_name TEXT,
  username TEXT,
  avatar_char TEXT,
  avatar_url TEXT,
  best_score BIGINT,
  total_score BIGINT,
  games_played BIGINT,
  best_streak INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH totals AS (
    SELECT
      gs.user_id,
      MAX(gs.score)::BIGINT AS best_score,
      SUM(gs.score)::BIGINT AS total_score,
      COUNT(*)::BIGINT AS games_played,
      MAX(gs.best_streak)::INT AS best_streak
    FROM public.game_scores gs
    WHERE gs.game_key = _game_key
    GROUP BY gs.user_id
  ),
  ranked AS (
    SELECT
      ROW_NUMBER() OVER (ORDER BY t.best_score DESC, t.total_score DESC, t.best_streak DESC, t.user_id)::BIGINT AS position,
      t.*
    FROM totals t
  )
  SELECT
    r.position,
    r.user_id,
    p.display_name,
    p.username,
    p.avatar_char,
    p.avatar_url,
    r.best_score,
    r.total_score,
    r.games_played,
    r.best_streak
  FROM ranked r
  JOIN public.profiles p ON p.id = r.user_id
  ORDER BY r.position
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 100), 100));
$$;

GRANT SELECT ON public.game_scores TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_game_result(TEXT, INT, INT, INT, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_game_leaderboard(TEXT, INT) TO authenticated;
