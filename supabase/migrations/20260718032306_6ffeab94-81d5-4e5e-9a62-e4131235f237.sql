
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Novo Discípulo',
  avatar_char TEXT NOT NULL DEFAULT 'pedro',
  avatar_url TEXT,
  bible_version TEXT NOT NULL DEFAULT 'NVI',
  xp INT NOT NULL DEFAULT 0,
  streak INT NOT NULL DEFAULT 0,
  last_activity_date DATE,
  is_leader BOOLEAN NOT NULL DEFAULT false,
  church_name TEXT,
  notify_devocional BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- LESSON PROGRESS
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  xp_gained INT NOT NULL DEFAULT 10,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lp_own" ON public.lesson_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- DIARY
CREATE TABLE public.diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  lesson_title TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diary_entries TO authenticated;
GRANT ALL ON public.diary_entries TO service_role;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "diary_own" ON public.diary_entries FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MURAL
CREATE TABLE public.mural_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  body TEXT NOT NULL,
  is_answered BOOLEAN NOT NULL DEFAULT false,
  amens_seed INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.mural_posts TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.mural_posts TO authenticated;
GRANT ALL ON public.mural_posts TO service_role;
ALTER TABLE public.mural_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mural_read_all" ON public.mural_posts FOR SELECT USING (true);
CREATE POLICY "mural_insert_auth" ON public.mural_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mural_update_own" ON public.mural_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "mural_delete_own" ON public.mural_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.mural_amens (
  post_id UUID NOT NULL REFERENCES public.mural_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.mural_amens TO authenticated;
GRANT ALL ON public.mural_amens TO service_role;
ALTER TABLE public.mural_amens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "amens_read_all" ON public.mural_amens FOR SELECT TO authenticated USING (true);
CREATE POLICY "amens_insert_own" ON public.mural_amens FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "amens_delete_own" ON public.mural_amens FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- GROUPS
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups TO authenticated;
GRANT ALL ON public.groups TO service_role;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "groups_leader_all" ON public.groups FOR ALL TO authenticated
  USING (auth.uid() = leader_id) WITH CHECK (auth.uid() = leader_id);
CREATE POLICY "groups_read_all_auth" ON public.groups FOR SELECT TO authenticated USING (true);

-- DEMO USERS (para popular ranking sem precisar de auth.users reais)
CREATE TABLE public.demo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  avatar_char TEXT NOT NULL,
  title TEXT NOT NULL,
  level INT NOT NULL,
  xp INT NOT NULL,
  streak INT NOT NULL
);
GRANT SELECT ON public.demo_users TO authenticated, anon;
GRANT ALL ON public.demo_users TO service_role;
ALTER TABLE public.demo_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_read_all" ON public.demo_users FOR SELECT USING (true);

-- SEEDS
INSERT INTO public.demo_users (display_name, avatar_char, title, level, xp, streak) VALUES
  ('Mariana Alves', 'ester', 'Guerreira da Fé', 7, 1420, 42),
  ('João Pedro', 'paulo', 'Servo Fiel', 6, 1180, 28),
  ('Rebeca Souza', 'rute', 'Peregrina Devota', 5, 890, 15),
  ('Lucas Ferreira', 'timoteo', 'Novo Convertido', 3, 420, 9),
  ('Ana Clara', 'maria', 'Semeadora', 4, 610, 21),
  ('Tiago Nunes', 'daniel', 'Filho Pródigo', 2, 240, 4);

INSERT INTO public.mural_posts (author_name, body, is_answered, amens_seed, created_at) VALUES
  ('Sofia M.', 'Peço oração pela cura da minha mãe. Ela está internada e a família precisa de força nesse momento.', false, 24, now() - interval '3 hours'),
  ('Rafael T.', 'Estou lutando com ansiedade nesta semana. Que Deus me dê paz. Obrigado, irmãos.', false, 18, now() - interval '8 hours'),
  ('Beatriz L.', 'GLÓRIA A DEUS! Consegui o emprego pelo qual pedimos oração há três semanas. Ele é fiel!', true, 87, now() - interval '1 day'),
  ('Marcos V.', 'Oração pelo meu filho adolescente, que se afastou da igreja. Que o Senhor o traga de volta.', false, 45, now() - interval '2 days'),
  ('Helena D.', 'Que Deus abençoe nossa célula amanhã. Oração para que as almas sejam tocadas.', false, 12, now() - interval '5 hours');
