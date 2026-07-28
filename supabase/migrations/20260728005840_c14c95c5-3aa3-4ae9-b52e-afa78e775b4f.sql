-- Challenges table
CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id uuid NOT NULL,
  challenged_id uuid NOT NULL,
  scope_type text NOT NULL CHECK (scope_type IN ('module','trail')),
  scope_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','completed','canceled')),
  first_finisher_id uuid,
  first_finished_at timestamptz,
  second_finished_at timestamptz,
  winner_bonus_awarded boolean NOT NULL DEFAULT false,
  completion_bonus_awarded boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  CHECK (challenger_id <> challenged_id)
);

CREATE INDEX challenges_challenger_idx ON public.challenges(challenger_id, status);
CREATE INDEX challenges_challenged_idx ON public.challenges(challenged_id, status);

GRANT SELECT, INSERT, UPDATE ON public.challenges TO authenticated;
GRANT ALL ON public.challenges TO service_role;

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges_select_involved"
  ON public.challenges FOR SELECT TO authenticated
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

CREATE POLICY "challenges_insert_challenger"
  ON public.challenges FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "challenges_update_involved"
  ON public.challenges FOR UPDATE TO authenticated
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id)
  WITH CHECK (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- Return lesson ids for a challenge scope
CREATE OR REPLACE FUNCTION public.challenge_lesson_ids(_scope_type text, _scope_id text)
RETURNS SETOF text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT t.lesson_id
  FROM public.disciple_trails t
  WHERE t.lesson_id IS NOT NULL
    AND (
      (_scope_type = 'trail'  AND t.id = _scope_id) OR
      (_scope_type = 'module' AND t.module_id = _scope_id)
    );
$$;

-- Compute progress (0..100)
CREATE OR REPLACE FUNCTION public.challenge_progress(_user uuid, _challenge_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  c public.challenges%ROWTYPE;
  total int;
  done int;
BEGIN
  SELECT * INTO c FROM public.challenges WHERE id = _challenge_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  SELECT count(*) INTO total FROM public.challenge_lesson_ids(c.scope_type, c.scope_id);
  IF total = 0 THEN RETURN 0; END IF;

  SELECT count(*) INTO done
  FROM public.lesson_progress lp
  WHERE lp.user_id = _user
    AND lp.lesson_id IN (SELECT public.challenge_lesson_ids(c.scope_type, c.scope_id));

  RETURN round((done::numeric / total::numeric) * 100, 1);
END;
$$;

-- Check completion and award XP (idempotent)
CREATE OR REPLACE FUNCTION public.finish_challenge_step(_challenge_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.challenges%ROWTYPE;
  me uuid := auth.uid();
  peer uuid;
  my_pct numeric;
  peer_pct numeric;
BEGIN
  IF me IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT * INTO c FROM public.challenges WHERE id = _challenge_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF c.status NOT IN ('accepted') THEN RETURN; END IF;
  IF me <> c.challenger_id AND me <> c.challenged_id THEN RETURN; END IF;

  peer := CASE WHEN me = c.challenger_id THEN c.challenged_id ELSE c.challenger_id END;

  my_pct := public.challenge_progress(me, _challenge_id);
  IF my_pct < 100 THEN RETURN; END IF;

  -- I finished 100%
  IF c.first_finisher_id IS NULL THEN
    -- I'm the winner
    UPDATE public.challenges
       SET first_finisher_id = me,
           first_finished_at = now(),
           winner_bonus_awarded = true
     WHERE id = _challenge_id;
    UPDATE public.profiles SET xp = xp + 150 WHERE id = me;
  ELSIF c.first_finisher_id <> me AND c.second_finished_at IS NULL THEN
    -- I'm the second finisher: participation + dual completion bonuses
    UPDATE public.challenges
       SET second_finished_at = now(),
           completion_bonus_awarded = true,
           status = 'completed'
     WHERE id = _challenge_id;
    -- Loser (me) gets participation + dual completion
    UPDATE public.profiles SET xp = xp + 50 + 75 WHERE id = me;
    -- Winner gets dual completion bonus
    UPDATE public.profiles SET xp = xp + 75 WHERE id = c.first_finisher_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.finish_challenge_step(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.finish_challenge_step(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.challenge_lesson_ids(text, text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.challenge_progress(uuid, uuid) TO authenticated;