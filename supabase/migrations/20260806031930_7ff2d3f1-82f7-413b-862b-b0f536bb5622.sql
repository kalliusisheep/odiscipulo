CREATE TABLE public.discipleship_assignments (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references auth.users(id) on delete cascade,
  disciple_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid,
  content_type text not null,
  content_id text not null,
  status text not null default 'active',
  assigned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (leader_id, disciple_id, content_type, content_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discipleship_assignments TO authenticated;
GRANT ALL ON public.discipleship_assignments TO service_role;
ALTER TABLE public.discipleship_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaders manage their assignments" ON public.discipleship_assignments FOR ALL TO authenticated USING (auth.uid() = leader_id) WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "Disciples can view their assignments" ON public.discipleship_assignments FOR SELECT TO authenticated USING (auth.uid() = disciple_id);
CREATE INDEX idx_discipleship_assignments_disciple ON public.discipleship_assignments (disciple_id, status);
CREATE INDEX idx_discipleship_assignments_leader ON public.discipleship_assignments (leader_id, status);