-- Garante que a conclusão de uma sala registre o placar de todos os participantes.
-- Aplicar depois das migrations de rankings e partidas compartilhadas.

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
  caller_result public.game_scores;
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

  IF NOT EXISTS (
    SELECT 1
    FROM public.character_game_room_players
    WHERE room_id = _room_id
      AND user_id = auth.uid()
      AND state IN ('connected', 'ready')
  ) THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  FOR player_row IN
    SELECT *
    FROM public.character_game_room_players
    WHERE room_id = _room_id
      AND state IN ('connected', 'ready')
  LOOP
    result_row := NULL;

    UPDATE public.game_scores
    SET score = GREATEST(0, player_row.score),
        correct_answers = GREATEST(0, player_row.correct_answers),
        rounds = room_row.rounds,
        best_streak = GREATEST(0, player_row.best_streak),
        played_at = now()
    WHERE room_id = _room_id
      AND user_id = player_row.user_id
    RETURNING * INTO result_row;

    IF result_row.id IS NULL THEN
      result_row := NULL;

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
        player_row.user_id,
        _room_id,
        room_row.game_type,
        GREATEST(0, player_row.score),
        GREATEST(0, player_row.correct_answers),
        room_row.rounds,
        GREATEST(0, player_row.best_streak)
      )
      ON CONFLICT DO NOTHING
      RETURNING * INTO result_row;
    END IF;

    IF player_row.user_id = auth.uid() THEN
      caller_result := result_row;
    END IF;
  END LOOP;

  RETURN caller_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_shared_game_result(uuid) TO authenticated;
