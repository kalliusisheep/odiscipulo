-- Repara a preparação de rodadas multiplayer.
-- O cliente atual chama ensure_character_game_round com cinco argumentos,
-- incluindo o hash da resposta correta.

CREATE TABLE IF NOT EXISTS public.character_game_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.character_game_rooms(id) ON DELETE CASCADE,
  round_number smallint NOT NULL,
  character_id text NOT NULL,
  hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  answer_hash text NOT NULL DEFAULT '',
  revealed_hint_indexes smallint[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  winner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  points_available integer NOT NULL DEFAULT 100,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  UNIQUE (room_id, round_number)
);

ALTER TABLE public.character_game_rounds
  ADD COLUMN IF NOT EXISTS answer_hash text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS revealed_hint_indexes smallint[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS points_available integer NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS opened_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS closed_at timestamptz;

ALTER TABLE public.character_game_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members can read rounds" ON public.character_game_rounds;
CREATE POLICY "members can read rounds"
  ON public.character_game_rounds FOR SELECT TO authenticated
  USING (public.is_character_game_member(room_id));

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

DROP FUNCTION IF EXISTS public.ensure_character_game_round(uuid, smallint, text, jsonb, text);

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
  safe_character_id text := NULLIF(trim(COALESCE(_character_id, '')), '');
  safe_answer_hash text := NULLIF(trim(COALESCE(_answer_hash, '')), '');
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'session_required';
  END IF;

  SELECT *
  INTO room_row
  FROM public.character_game_rooms
  WHERE id = _room_id
  FOR SHARE;

  IF room_row.id IS NULL THEN
    RAISE EXCEPTION 'room_not_found';
  END IF;

  IF NOT public.is_character_game_member(_room_id) THEN
    RAISE EXCEPTION 'not_allowed';
  END IF;

  IF room_row.status <> 'playing' THEN
    RAISE EXCEPTION 'room_not_playing';
  END IF;

  IF _round_number < 1 OR _round_number > room_row.rounds THEN
    RAISE EXCEPTION 'invalid_round';
  END IF;

  IF safe_character_id IS NULL OR safe_answer_hash IS NULL THEN
    RAISE EXCEPTION 'invalid_question';
  END IF;

  SELECT *
  INTO round_row
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
    safe_character_id,
    COALESCE(_hints, '[]'::jsonb),
    safe_answer_hash,
    100
  )
  ON CONFLICT (room_id, round_number) DO NOTHING
  RETURNING * INTO round_row;

  IF round_row.id IS NULL THEN
    SELECT *
    INTO round_row
    FROM public.character_game_rounds
    WHERE room_id = _room_id
      AND round_number = _round_number;
  END IF;

  RETURN round_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_character_game_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_character_game_round(uuid, smallint, text, jsonb, text) TO authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'character_game_rounds'
     ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.character_game_rounds';
  END IF;
END
$$;

ALTER TABLE public.character_game_rounds REPLICA IDENTITY FULL;
