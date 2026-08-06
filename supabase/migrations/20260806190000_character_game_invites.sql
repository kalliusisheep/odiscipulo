-- Convites reais para salas: o host convida amigos e o convidado responde
-- sem depender de estado local ou atualização manual da página.

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

CREATE OR REPLACE FUNCTION public.invite_character_game_player(
  _room_id uuid,
  _user_id uuid
)
RETURNS public.character_game_room_players
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  room_row public.character_game_rooms;
  inviter_name text;
  invited_row public.character_game_room_players;
BEGIN
  SELECT * INTO room_row
  FROM public.character_game_rooms
  WHERE id = _room_id AND host_id = auth.uid() AND status = 'lobby';

  IF room_row.id IS NULL OR _user_id = auth.uid() THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  IF NOT public.are_friends(auth.uid(), _user_id) THEN
    RAISE EXCEPTION 'not_friends';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.character_game_room_players
    WHERE room_id = _room_id AND user_id = _user_id
      AND state NOT IN ('declined', 'left')
  ) THEN
    RAISE EXCEPTION 'already_invited';
  END IF;

  IF (
    SELECT count(*) FROM public.character_game_room_players
    WHERE room_id = _room_id AND state NOT IN ('declined', 'left')
  ) >= room_row.max_players THEN
    RAISE EXCEPTION 'room_full';
  END IF;

  INSERT INTO public.character_game_room_players (room_id, user_id, role, state)
  VALUES (_room_id, _user_id, 'player', 'invited')
  RETURNING * INTO invited_row;

  SELECT COALESCE(NULLIF(trim(display_name), ''), 'Um amigo')
  INTO inviter_name
  FROM public.profiles
  WHERE id = auth.uid();

  INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
  VALUES (
    _user_id,
    'challenge',
    'Convite para uma partida',
    inviter_name || ' convidou você para uma partida bíblica.',
    '/jogos/multiplayer?roomId=' || _room_id::text,
    jsonb_build_object(
      'game_invite', COALESCE(room_row.game_type, 'personagem'),
      'room_id', _room_id,
      'inviter_id', auth.uid(),
      'inviter_name', inviter_name
    )
  );

  RETURN invited_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.respond_character_game_invite(
  _room_id uuid,
  _accept boolean
)
RETURNS public.character_game_room_players
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_row public.character_game_room_players;
BEGIN
  UPDATE public.character_game_room_players
  SET state = CASE WHEN _accept THEN 'connected' ELSE 'declined' END,
      last_seen_at = now()
  WHERE room_id = _room_id AND user_id = auth.uid() AND state = 'invited'
  RETURNING * INTO updated_row;

  IF updated_row.room_id IS NULL THEN
    RAISE EXCEPTION 'invite_not_found';
  END IF;

  RETURN updated_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.invite_character_game_player(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_character_game_invite(uuid, boolean) TO authenticated;
