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
      AND state IN ('connected', 'ready')
  );
$$;

DROP POLICY IF EXISTS "members can read answers" ON public.character_game_answers;
DROP POLICY IF EXISTS "users submit own answers" ON public.character_game_answers;

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

  IF room_row.status <> 'playing' THEN
    RAISE EXCEPTION 'room_not_playing';
  END IF;

  IF _round_number < 1 OR _round_number > room_row.rounds THEN
    RAISE EXCEPTION 'invalid_round';
  END IF;

  IF NULLIF(trim(COALESCE(_character_id, '')), '') IS NULL THEN
    RAISE EXCEPTION 'invalid_question';
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

DROP POLICY IF EXISTS "game_scores_insert_own" ON public.game_scores;

GRANT EXECUTE ON FUNCTION public.is_character_game_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_character_game_round(uuid, smallint, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_game_result(text, integer, integer, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.finish_character_game_room(_room_id uuid)
RETURNS public.character_game_rooms
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_row public.character_game_rooms;
  closed_rounds integer;
BEGIN
  IF NOT public.is_character_game_member(_room_id) THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  SELECT * INTO room_row
  FROM public.character_game_rooms
  WHERE id = _room_id
  FOR UPDATE;

  IF room_row.id IS NULL THEN
    RAISE EXCEPTION 'room_not_found';
  END IF;

  IF room_row.status IN ('cancelled', 'finished') THEN
    RETURN room_row;
  END IF;

  SELECT count(*)::integer INTO closed_rounds
  FROM public.character_game_rounds
  WHERE room_id = _room_id
    AND round_number BETWEEN 1 AND room_row.rounds
    AND status <> 'active';

  IF closed_rounds < room_row.rounds THEN
    RAISE EXCEPTION 'rounds_not_complete';
  END IF;

  UPDATE public.character_game_rooms
  SET status = 'finished',
      finished_at = COALESCE(finished_at, now())
  WHERE id = _room_id
    AND status = 'playing'
  RETURNING * INTO room_row;

  RETURN room_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.finish_character_game_room(uuid) TO authenticated;
