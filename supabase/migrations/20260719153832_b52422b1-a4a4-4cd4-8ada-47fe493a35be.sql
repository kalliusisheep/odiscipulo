CREATE TABLE IF NOT EXISTS public.reading_plans (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  intro text NOT NULL,
  total_days int NOT NULL,
  minutes_per_day int NOT NULL,
  icon text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reading_plan_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  day int NOT NULL,
  refs text[] NOT NULL,
  passage_api_refs text[] NOT NULL,
  focus text NOT NULL,
  context text NOT NULL,
  reflection text NOT NULL,
  application text NOT NULL,
  prayer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id, day)
);

GRANT SELECT ON public.reading_plans TO anon, authenticated;
GRANT ALL ON public.reading_plans TO service_role;
GRANT SELECT ON public.reading_plan_days TO anon, authenticated;
GRANT ALL ON public.reading_plan_days TO service_role;

ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_plan_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY plans_read_all ON public.reading_plans FOR SELECT USING (true);
CREATE POLICY plan_days_read_all ON public.reading_plan_days FOR SELECT USING (true);