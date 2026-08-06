-- Estado compartilhado e autoritativo para partidas de perguntas.
-- Palavras cruzadas continuam usando o fluxo local existente.

ALTER TABLE public.character_game_room_players
  ADD COLUMN IF NOT EXISTS score integer NOT NULL DEFAULT 0 CHECK (score >= 0),
  ADD COLUMN IF NOT EXISTS correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  ADD COLUMN IF NOT EXISTS best_streak integer NOT NULL DEFAULT 0 CHECK (best_streak >= 0),
  ADD COLUMN IF NOT EXISTS last_answer_at timestamptz;

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
  WHERE room_id = _room_id AND round_number = _round_number;

  IF round_row.id IS NOT NULL THEN
    RETURN round_row;
  END IF;

  INSERT INTO public.character_game_rounds (
    room_id, round_number, character_id, hints, points_available
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
    WHERE room_id = _room_id AND round_number = _round_number;
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
  SELECT r.* INTO round_row
  FROM public.character_game_rounds r
  JOIN public.character_game_room_players p ON p.room_id = r.room_id
  WHERE r.id = _round_id
    AND p.user_id = auth.uid()
    AND p.state IN ('connected', 'ready')
  FOR UPDATE OF r;

  IF round_row.id IS NULL THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  INSERT INTO public.character_game_answers (
    round_id, user_id, answer_hash, is_correct, is_locked
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
    SELECT * INTO round_row FROM public.character_game_rounds WHERE id = _round_id;
    RETURN round_row;
  END IF;

  UPDATE public.character_game_room_players
  SET last_answer_at = now(), last_seen_at = now()
  WHERE room_id = round_row.room_id AND user_id = auth.uid();

  IF COALESCE(_is_correct, false) AND round_row.status = 'active' THEN
    accepted_points := GREATEST(
      0,
      LEAST(COALESCE(_points, 0), round_row.points_available)
    );

    UPDATE public.character_game_rounds
    SET status = 'won', winner_id = auth.uid(), closed_at = now()
    WHERE id = _round_id AND status = 'active';

    IF FOUND THEN
      UPDATE public.character_game_room_players
      SET score = score + accepted_points,
          correct_answers = correct_answers + 1,
          best_streak = GREATEST(best_streak, GREATEST(0, COALESCE(_streak, 0)))
      WHERE room_id = round_row.room_id AND user_id = auth.uid();
    END IF;
  ELSIF NOT COALESCE(_is_correct, false) AND round_row.status = 'active' THEN
    SELECT count(*) INTO active_players
    FROM public.character_game_room_players
    WHERE room_id = round_row.room_id
      AND state IN ('connected', 'ready');

    SELECT count(*) INTO locked_answers
    FROM public.character_game_answers
    WHERE round_id = _round_id AND is_locked;

    IF active_players > 0 AND locked_answers >= active_players THEN
      UPDATE public.character_game_rounds
      SET status = 'all_wrong', closed_at = now()
      WHERE id = _round_id AND status = 'active';
    END IF;
  END IF;

  SELECT * INTO round_row FROM public.character_game_rounds WHERE id = _round_id;
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
  SET status = 'finished', finished_at = COALESCE(finished_at, now())
  WHERE id = _room_id AND status <> 'cancelled'
  RETURNING * INTO room_row;

  IF room_row.id IS NULL THEN
    SELECT * INTO room_row FROM public.character_game_rooms WHERE id = _room_id;
  END IF;

  RETURN room_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_character_game_round(uuid, smallint, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_character_game_response(uuid, text, boolean, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.finish_character_game_room(uuid) TO authenticated;
