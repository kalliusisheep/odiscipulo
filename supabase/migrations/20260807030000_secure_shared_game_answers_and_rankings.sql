-- Validação server-side das respostas compartilhadas e ranking de partidas em sala.
-- A resposta correta nunca deve depender do booleano enviado pelo cliente.

ALTER TABLE public.character_game_rounds
  ADD COLUMN IF NOT EXISTS answer_hash text NOT NULL DEFAULT '';

ALTER TABLE public.game_scores
  ADD COLUMN IF NOT EXISTS room_id uuid REFERENCES public.character_game_rooms(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS game_scores_room_user_unique
  ON public.game_scores (room_id, user_id)
  WHERE room_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.ensure_character_game_round(
  _room_id uuid,
  _round_number smallint,
  _character_id text,
  _hints jsonb DEFAULT '[]'::jsonb,
  _answer_hash text DEFAULT ''
)
RETURNS public.character_game_rounds
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  round_row public.character_game_rounds;
  room_row public.character_game_rooms;
  safe_answer_hash text := NULLIF(trim(COALESCE(_answer_hash, '')), '');
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

  IF NULLIF(trim(COALESCE(_character_id, '')), '') IS NULL OR safe_answer_hash IS NULL THEN
    RAISE EXCEPTION 'invalid_question';
  END IF;

  SELECT * INTO round_row
  FROM public.character_game_rounds
  WHERE room_id = _room_id
    AND round_number = _round_number
  FOR UPDATE;

  IF round_row.id IS NOT NULL THEN
    IF NULLIF(trim(COALESCE(round_row.answer_hash, '')), '') IS NULL THEN
      UPDATE public.character_game_rounds
      SET answer_hash = safe_answer_hash
      WHERE id = round_row.id
      RETURNING * INTO round_row;
    END IF;
    RETURN round_row;
  END IF;

  INSERT INTO public.character_game_rounds (
    room_id,
    round_number,
    character_id,
    hints,
    answer_hash,
    points_available
  )
  VALUES (
    _room_id,
    _round_number,
    _character_id,
    COALESCE(_hints, '[]'::jsonb),
    safe_answer_hash,
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
  answer_matches boolean;
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

  answer_matches :=
    NULLIF(trim(COALESCE(round_row.answer_hash, '')), '') IS NOT NULL
    AND NULLIF(trim(COALESCE(round_row.answer_hash, '')), '') =
        NULLIF(trim(COALESCE(_answer_hash, '')), '');

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
    COALESCE(NULLIF(trim(_answer_hash), ''), 'empty'),
    COALESCE(answer_matches, false),
    NOT COALESCE(answer_matches, false)
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

  IF COALESCE(answer_matches, false) AND round_row.status = 'active' THEN
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
  ELSIF NOT COALESCE(answer_matches, false) AND round_row.status = 'active' THEN
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

CREATE OR REPLACE FUNCTION public.record_shared_game_result(_room_id uuid)
RETURNS public.game_scores
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_row public.character_game_rooms;
  player_row public.character_game_room_players;
  result_row public.game_scores;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'session_required';
  END IF;

  SELECT * INTO room_row
  FROM public.character_game_rooms
  WHERE id = _room_id;

  IF room_row.id IS NULL THEN
    RAISE EXCEPTION 'room_not_found';
  END IF;

  IF room_row.status <> 'finished' THEN
    RAISE EXCEPTION 'room_not_finished';
  END IF;

  SELECT * INTO player_row
  FROM public.character_game_room_players
  WHERE room_id = _room_id
    AND user_id = auth.uid()
    AND state IN ('connected', 'ready');

  IF player_row.user_id IS NULL THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  INSERT INTO public.game_scores (
    user_id,
    room_id,
    game_key,
    score,
    correct_answers,
    rounds,
    best_streak
  )
  VALUES (
    auth.uid(),
    _room_id,
    room_row.game_type,
    GREATEST(0, player_row.score),
    GREATEST(0, player_row.correct_answers),
    room_row.rounds,
    GREATEST(0, player_row.best_streak)
  )
  ON CONFLICT (room_id, user_id)
  WHERE room_id IS NOT NULL
  DO UPDATE SET
    score = EXCLUDED.score,
    correct_answers = EXCLUDED.correct_answers,
    rounds = EXCLUDED.rounds,
    best_streak = EXCLUDED.best_streak,
    played_at = now()
  RETURNING * INTO result_row;

  RETURN result_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_character_game_round(uuid, smallint, text, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_character_game_response(uuid, text, boolean, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.record_shared_game_result(uuid) TO authenticated;
