-- Minhas Notas (Bloco 3): tabela de anotações do usuário e histórico de
-- ações de IA sobre cada nota. Segue o mesmo padrão de RLS já usado em
-- public.highlights.

CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nova anotação',
  content JSONB NOT NULL DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
  source_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('selecao_texto', 'manual', 'scan_pdf', 'scan_word', 'scan_foto')),
  source_content_id UUID,
  source_content_type TEXT CHECK (source_content_type IN ('trilha', 'estudo', 'plano_leitura')),
  source_content_title TEXT,
  exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notes_user_id_idx ON public.notes (user_id);
CREATE INDEX notes_source_content_idx ON public.notes (source_content_id, source_content_type);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select_own" ON public.notes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "notes_insert_own" ON public.notes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update_own" ON public.notes
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_delete_own" ON public.notes
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;

-- Mantém updated_at em dia automaticamente a cada UPDATE.
CREATE OR REPLACE FUNCTION public.set_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notes_set_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.set_notes_updated_at();

-- Histórico de ações de IA (reescrever / estruturar / título) sobre notas.
CREATE TABLE public.note_ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL
    CHECK (action_type IN ('reescrever', 'estruturar', 'titulo', 'scan_transcricao', 'scan_reescrita', 'scan_estrutura')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX note_ai_actions_note_id_idx ON public.note_ai_actions (note_id);

ALTER TABLE public.note_ai_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "note_ai_actions_select_own" ON public.note_ai_actions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "note_ai_actions_insert_own" ON public.note_ai_actions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON public.note_ai_actions TO authenticated;
