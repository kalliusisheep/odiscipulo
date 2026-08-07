ALTER TABLE public.character_game_rooms
  ADD COLUMN IF NOT EXISTS game_type text NOT NULL DEFAULT 'personagem',
  ADD COLUMN IF NOT EXISTS round_seed bigint NOT NULL DEFAULT floor(random() * 2147483647)::bigint;

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

CREATE TABLE IF NOT EXISTS public.app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('message', 'challenge', 'daily_reminder')),
  title text NOT NULL,
  body text NOT NULL,
  url text NOT NULL DEFAULT '/home',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);

ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'app_notifications'
      AND policyname = 'notifications_select_own'
  ) THEN
    CREATE POLICY "notifications_select_own"
      ON public.app_notifications FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END
$$;

GRANT SELECT ON public.app_notifications TO authenticated;

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
      AND state IN ('invited', 'waiting', 'connected', 'ready', 'disconnected')
  );
$$;

CREATE OR REPLACE FUNCTION public.create_character_game_room(
  _max_players smallint,
  _difficulty text,
  _rounds smallint,
  _game_type text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_room_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'session_required';
  END IF;

  IF _max_players NOT BETWEEN 2 AND 4 THEN
    RAISE EXCEPTION 'invalid_max_players';
  END IF;

  IF _difficulty NOT IN ('facil', 'medio', 'dificil', 'bereano') THEN
    RAISE EXCEPTION 'invalid_difficulty';
  END IF;

  IF _rounds NOT BETWEEN 5 AND 30 THEN
    RAISE EXCEPTION 'invalid_rounds';
  END IF;

  IF _game_type NOT IN ('personagem', 'versiculo', 'cruzadas', 'milhao') THEN
    RAISE EXCEPTION 'invalid_game_type';
  END IF;

  INSERT INTO public.character_game_rooms (
    host_id,
    max_players,
    difficulty,
    rounds,
    game_type,
    round_seed
  )
  VALUES (
    auth.uid(),
    _max_players,
    _difficulty,
    _rounds,
    _game_type,
    floor(random() * 2147483647)::bigint
  )
  RETURNING id INTO new_room_id;

  INSERT INTO public.character_game_room_players (room_id, user_id, role, state)
  VALUES (new_room_id, auth.uid(), 'host', 'connected');

  RETURN new_room_id;
END;
$$;

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
  SELECT *
  INTO room_row
  FROM public.character_game_rooms
  WHERE id = _room_id
    AND host_id = auth.uid()
    AND status = 'lobby';

  IF room_row.id IS NULL OR _user_id = auth.uid() THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  IF NOT public.are_friends(auth.uid(), _user_id) THEN
    RAISE EXCEPTION 'not_friends';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.character_game_room_players
    WHERE room_id = _room_id
      AND user_id = _user_id
      AND state NOT IN ('declined', 'left')
  ) THEN
    RAISE EXCEPTION 'already_invited';
  END IF;

  IF (
    SELECT count(*)
    FROM public.character_game_room_players
    WHERE room_id = _room_id
      AND state NOT IN ('declined', 'left')
  ) >= room_row.max_players THEN
    RAISE EXCEPTION 'room_full';
  END IF;

  INSERT INTO public.character_game_room_players (
    room_id,
    user_id,
    role,
    state,
    joined_at,
    last_seen_at
  )
  VALUES (
    _room_id,
    _user_id,
    'player',
    'invited',
    now(),
    now()
  )
  ON CONFLICT (room_id, user_id)
  DO UPDATE SET
    state = 'invited',
    joined_at = now(),
    last_seen_at = now()
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
    COALESCE(inviter_name, 'Um amigo') || ' convidou você para uma partida bíblica.',
    '/jogos/multiplayer?roomId=' || _room_id::text,
    jsonb_build_object(
      'game_invite', COALESCE(room_row.game_type, 'personagem'),
      'room_id', _room_id,
      'inviter_id', auth.uid(),
      'inviter_name', COALESCE(inviter_name, 'Um amigo'),
      'difficulty', room_row.difficulty,
      'rounds', room_row.rounds,
      'seed', room_row.round_seed
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
  room_status text;
  room_limit smallint;
  connected_count integer;
BEGIN
  SELECT status, max_players
  INTO room_status, room_limit
  FROM public.character_game_rooms
  WHERE id = _room_id;

  IF room_status IS NULL THEN
    RAISE EXCEPTION 'room_not_found';
  END IF;

  IF room_status <> 'lobby' THEN
    RAISE EXCEPTION 'room_not_lobby';
  END IF;

  IF _accept THEN
    SELECT count(*)::integer
    INTO connected_count
    FROM public.character_game_room_players
    WHERE room_id = _room_id
      AND state IN ('connected', 'ready', 'disconnected');

    IF connected_count >= room_limit THEN
      RAISE EXCEPTION 'room_full';
    END IF;
  END IF;

  UPDATE public.character_game_room_players
  SET state = CASE WHEN _accept THEN 'connected' ELSE 'declined' END,
      last_seen_at = now()
  WHERE room_id = _room_id
    AND user_id = auth.uid()
    AND state = 'invited'
  RETURNING * INTO updated_row;

  IF updated_row.room_id IS NULL THEN
    RAISE EXCEPTION 'invite_not_found';
  END IF;

  RETURN updated_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_character_game_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_character_game_room(smallint, text, smallint, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.invite_character_game_player(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_character_game_invite(uuid, boolean) TO authenticated;

DO $$
DECLARE
  realtime_table text;
BEGIN
  FOREACH realtime_table IN ARRAY ARRAY[
    'character_game_rooms',
    'character_game_room_players',
    'app_notifications'
  ]
  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = realtime_table
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', realtime_table);
    END IF;
  END LOOP;
END
$$;

ALTER TABLE public.character_game_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.character_game_room_players REPLICA IDENTITY FULL;
ALTER TABLE public.app_notifications REPLICA IDENTITY FULL;
