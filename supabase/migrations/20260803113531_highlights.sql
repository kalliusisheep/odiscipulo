-- Bloco 1 (marcação/"marca-texto") do spec de Minhas Notas. Guarda o
-- destaque por CAMPO de texto específico (ex.: "intro-0", "deepDive",
-- "verso-texto-1") em vez de um offset flat na página inteira — mais
-- robusto contra a estrutura de DOM variável entre trilha/estudo/plano.
-- highlighted_text é guardado junto pra permitir realinhamento/validação
-- se o conteúdo fonte mudar.
CREATE TABLE public.highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('trilha', 'estudo', 'plano_leitura')),
  field_key TEXT NOT NULL,
  start_offset INT NOT NULL,
  end_offset INT NOT NULL,
  highlighted_text TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'amarelo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX highlights_lookup_idx ON public.highlights (user_id, content_id, content_type);

ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "highlights_select_own" ON public.highlights
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "highlights_insert_own" ON public.highlights
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "highlights_delete_own" ON public.highlights
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.highlights TO authenticated;
