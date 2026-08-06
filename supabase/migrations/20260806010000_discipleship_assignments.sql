-- Conteúdos aplicados por líderes a discípulos individuais ou grupos.
-- A aplicação em grupo é materializada por discípulo para permitir progresso individual.

CREATE TABLE IF NOT EXISTS public.discipleship_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  disciple_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id uuid REFERENCES public.groups(id) ON DELETE SET NULL,
  content_type text NOT NULL DEFAULT 'support_lesson'
    CHECK (content_type IN ('support_lesson')),
  content_id text NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'archived')),
  UNIQUE (leader_id, disciple_id, content_type, content_id)
);

CREATE INDEX IF NOT EXISTS discipleship_assignments_leader_idx
  ON public.discipleship_assignments (leader_id, status, assigned_at DESC);

CREATE INDEX IF NOT EXISTS discipleship_assignments_disciple_idx
  ON public.discipleship_assignments (disciple_id, status, assigned_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.discipleship_assignments TO authenticated;
GRANT ALL ON public.discipleship_assignments TO service_role;

ALTER TABLE public.discipleship_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "discipleship_assignments_select_involved" ON public.discipleship_assignments;
CREATE POLICY "discipleship_assignments_select_involved"
  ON public.discipleship_assignments
  FOR SELECT TO authenticated
  USING (auth.uid() = leader_id OR auth.uid() = disciple_id);

DROP POLICY IF EXISTS "discipleship_assignments_insert_leader" ON public.discipleship_assignments;
CREATE POLICY "discipleship_assignments_insert_leader"
  ON public.discipleship_assignments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = leader_id);

DROP POLICY IF EXISTS "discipleship_assignments_update_leader" ON public.discipleship_assignments;
CREATE POLICY "discipleship_assignments_update_leader"
  ON public.discipleship_assignments
  FOR UPDATE TO authenticated
  USING (auth.uid() = leader_id)
  WITH CHECK (auth.uid() = leader_id);
