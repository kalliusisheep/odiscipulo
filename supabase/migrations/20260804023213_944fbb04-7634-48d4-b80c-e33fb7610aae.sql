CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.bible_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'amber',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book, chapter, verse)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_highlights TO authenticated;
GRANT ALL ON public.bible_highlights TO service_role;
ALTER TABLE public.bible_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bible highlights" ON public.bible_highlights FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bible_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_notes TO authenticated;
GRANT ALL ON public.bible_notes TO service_role;
ALTER TABLE public.bible_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bible notes" ON public.bible_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bible_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book, chapter, verse)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_favorites TO authenticated;
GRANT ALL ON public.bible_favorites TO service_role;
ALTER TABLE public.bible_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bible favorites" ON public.bible_favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bible_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL DEFAULT 1,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book, chapter, verse)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_bookmarks TO authenticated;
GRANT ALL ON public.bible_bookmarks TO service_role;
ALTER TABLE public.bible_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bible bookmarks" ON public.bible_bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.bible_reading_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, book, chapter)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bible_reading_progress TO authenticated;
GRANT ALL ON public.bible_reading_progress TO service_role;
ALTER TABLE public.bible_reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bible reading progress" ON public.bible_reading_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_bible_highlights_updated_at BEFORE UPDATE ON public.bible_highlights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bible_notes_updated_at BEFORE UPDATE ON public.bible_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bible_favorites_updated_at BEFORE UPDATE ON public.bible_favorites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bible_bookmarks_updated_at BEFORE UPDATE ON public.bible_bookmarks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bible_reading_progress_updated_at BEFORE UPDATE ON public.bible_reading_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();