-- Tabela de cache dos textos evangelísticos gerados por IA para o botão de
-- compartilhar. Cada linha guarda o texto já pronto para uma lição/estudo
-- específico (lesson_id), para que ele NUNCA precise ser gerado de novo em
-- tempo real depois da primeira vez — a edge function "generate-share-text"
-- sempre consulta esta tabela antes de chamar a IA.

CREATE TABLE IF NOT EXISTS public.lesson_share_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL UNIQUE,
  lesson_title text,
  share_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_share_texts_lesson_id_idx
  ON public.lesson_share_texts (lesson_id);

-- Mantém updated_at correto em cada upsert feito pela edge function.
CREATE OR REPLACE FUNCTION public.set_lesson_share_texts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lesson_share_texts_updated_at ON public.lesson_share_texts;
CREATE TRIGGER trg_lesson_share_texts_updated_at
  BEFORE UPDATE ON public.lesson_share_texts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_lesson_share_texts_updated_at();

-- Leitura pública liberada (é só texto de divulgação, sem dado sensível);
-- escrita só acontece via service_role dentro da edge function.
GRANT SELECT ON public.lesson_share_texts TO anon, authenticated;
GRANT ALL ON public.lesson_share_texts TO service_role;

ALTER TABLE public.lesson_share_texts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lesson_share_texts_read_all ON public.lesson_share_texts;
CREATE POLICY lesson_share_texts_read_all
  ON public.lesson_share_texts
  FOR SELECT
  USING (true);
