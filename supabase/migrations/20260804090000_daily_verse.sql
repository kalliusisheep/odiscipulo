-- Versículo do dia: pool de referências curadas (evangelísticas, cristocêntricas)
-- + curtidas/comentários/compartilhamentos públicos, no mesmo espírito do Feed
-- (feed_likes / feed_comments / feed_comment_likes), mas escopados por DIA
-- (verse_date) em vez de por item — assim, quando uma referência volta a
-- aparecer meses depois no ciclo, ela começa com um mural de comentários
-- novo, e não herda o histórico da vez anterior.
--
-- O TEXTO do versículo nunca é armazenado aqui: só a referência (livro,
-- capítulo, versículo). O texto é buscado ao vivo via src/lib/bible.ts
-- (fetchPassage), já na versão da Bíblia escolhida pelo usuário no Perfil
-- (profiles.bible_version) — mesmo padrão usado em lições e planos de leitura.

CREATE TABLE public.daily_verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ord INT NOT NULL UNIQUE,
  book INT NOT NULL,
  chapter INT NOT NULL,
  verse_start INT NOT NULL,
  verse_end INT,
  ref_label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.daily_verses TO authenticated, anon;
GRANT ALL ON public.daily_verses TO service_role;
ALTER TABLE public.daily_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_verses_read_all" ON public.daily_verses FOR SELECT USING (true);

-- CURTIDAS no versículo do dia (uma por usuário por dia)
CREATE TABLE public.daily_verse_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (verse_date, user_id)
);
CREATE INDEX daily_verse_likes_date_idx ON public.daily_verse_likes (verse_date);
GRANT SELECT, INSERT, DELETE ON public.daily_verse_likes TO authenticated;
GRANT ALL ON public.daily_verse_likes TO service_role;
ALTER TABLE public.daily_verse_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dv_likes_select_all" ON public.daily_verse_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "dv_likes_insert_own" ON public.daily_verse_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dv_likes_delete_own" ON public.daily_verse_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COMPARTILHAMENTOS — um registro por toque em "compartilhar" (contagem
-- pública, não é um toggle como a curtida).
CREATE TABLE public.daily_verse_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX daily_verse_shares_date_idx ON public.daily_verse_shares (verse_date);
GRANT SELECT, INSERT ON public.daily_verse_shares TO authenticated;
GRANT ALL ON public.daily_verse_shares TO service_role;
ALTER TABLE public.daily_verse_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dv_shares_select_all" ON public.daily_verse_shares FOR SELECT TO authenticated USING (true);
CREATE POLICY "dv_shares_insert_own" ON public.daily_verse_shares FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- COMENTÁRIOS — públicos (qualquer discípulo vê e comenta), com o mesmo
-- suporte a texto + GIF do Feed (EmojiPicker insere emoji no texto).
CREATE TABLE public.daily_verse_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  body TEXT,
  gif_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT daily_verse_comments_body_or_gif_chk CHECK (coalesce(body, '') <> '' OR gif_url IS NOT NULL)
);
CREATE INDEX daily_verse_comments_date_idx ON public.daily_verse_comments (verse_date);
GRANT SELECT, INSERT, DELETE ON public.daily_verse_comments TO authenticated;
GRANT ALL ON public.daily_verse_comments TO service_role;
ALTER TABLE public.daily_verse_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dv_comments_select_all" ON public.daily_verse_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "dv_comments_insert_own" ON public.daily_verse_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dv_comments_delete_own" ON public.daily_verse_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- CURTIDAS EM COMENTÁRIOS — qualquer discípulo pode curtir o comentário de
-- qualquer outro, independente de serem contatos/amigos.
CREATE TABLE public.daily_verse_comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.daily_verse_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
CREATE INDEX daily_verse_comment_likes_comment_idx ON public.daily_verse_comment_likes (comment_id);
GRANT SELECT, INSERT, DELETE ON public.daily_verse_comment_likes TO authenticated;
GRANT ALL ON public.daily_verse_comment_likes TO service_role;
ALTER TABLE public.daily_verse_comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dv_comment_likes_select_all" ON public.daily_verse_comment_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "dv_comment_likes_insert_own" ON public.daily_verse_comment_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dv_comment_likes_delete_own" ON public.daily_verse_comment_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Realtime, para que curtidas/comentários de outros discípulos apareçam sem
-- precisar dar F5 (mesmo padrão do feed_* em 20260731214507).
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_verse_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_verse_shares;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_verse_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_verse_comment_likes;

-- ------------------------------------------------------------------------
-- POOL DE REFERÊNCIAS — todas cristocêntricas, devocionais e evangelísticas
-- (ver src/lib/daily-verse.ts para como o dia de hoje é escolhido a partir
-- daqui — troca automaticamente à meia-noite, fuso America/Sao_Paulo).
-- Livro/capítulo/versículo usam a numeração de src/data/bible-books.ts.
-- ------------------------------------------------------------------------
INSERT INTO public.daily_verses (ord, book, chapter, verse_start, verse_end, ref_label) VALUES
  (1, 43, 3, 16, NULL, 'João 3:16'),
  (2, 45, 5, 8, NULL, 'Romanos 5:8'),
  (3, 45, 6, 23, NULL, 'Romanos 6:23'),
  (4, 45, 10, 9, NULL, 'Romanos 10:9'),
  (5, 49, 2, 8, 9, 'Efésios 2:8-9'),
  (6, 43, 14, 6, NULL, 'João 14:6'),
  (7, 44, 4, 12, NULL, 'Atos 4:12'),
  (8, 46, 15, 3, 4, '1 Coríntios 15:3-4'),
  (9, 47, 5, 17, NULL, '2 Coríntios 5:17'),
  (10, 48, 2, 20, NULL, 'Gálatas 2:20'),
  (11, 50, 4, 13, NULL, 'Filipenses 4:13'),
  (12, 51, 1, 17, NULL, 'Colossenses 1:17'),
  (13, 58, 4, 12, NULL, 'Hebreus 4:12'),
  (14, 58, 12, 2, NULL, 'Hebreus 12:2'),
  (15, 59, 4, 8, NULL, 'Tiago 4:8'),
  (16, 60, 2, 24, NULL, '1 Pedro 2:24'),
  (17, 62, 1, 9, NULL, '1 João 1:9'),
  (18, 62, 4, 9, 10, '1 João 4:9-10'),
  (19, 66, 3, 20, NULL, 'Apocalipse 3:20'),
  (20, 19, 23, 1, NULL, 'Salmos 23:1'),
  (21, 19, 27, 1, NULL, 'Salmos 27:1'),
  (22, 19, 34, 8, NULL, 'Salmos 34:8'),
  (23, 19, 46, 1, NULL, 'Salmos 46:1'),
  (24, 19, 51, 10, NULL, 'Salmos 51:10'),
  (25, 19, 91, 1, 2, 'Salmos 91:1-2'),
  (26, 19, 119, 105, NULL, 'Salmos 119:105'),
  (27, 20, 3, 5, 6, 'Provérbios 3:5-6'),
  (28, 23, 9, 6, NULL, 'Isaías 9:6'),
  (29, 23, 53, 5, NULL, 'Isaías 53:5'),
  (30, 23, 55, 6, NULL, 'Isaías 55:6'),
  (31, 24, 29, 11, NULL, 'Jeremias 29:11'),
  (32, 40, 5, 14, 16, 'Mateus 5:14-16'),
  (33, 40, 6, 33, NULL, 'Mateus 6:33'),
  (34, 40, 11, 28, NULL, 'Mateus 11:28'),
  (35, 40, 28, 19, 20, 'Mateus 28:19-20'),
  (36, 41, 16, 15, NULL, 'Marcos 16:15'),
  (37, 42, 19, 10, NULL, 'Lucas 19:10'),
  (38, 43, 1, 1, NULL, 'João 1:1'),
  (39, 43, 1, 12, NULL, 'João 1:12'),
  (40, 43, 8, 12, NULL, 'João 8:12'),
  (41, 43, 10, 10, NULL, 'João 10:10'),
  (42, 43, 10, 27, 28, 'João 10:27-28'),
  (43, 43, 11, 25, NULL, 'João 11:25'),
  (44, 43, 13, 34, 35, 'João 13:34-35'),
  (45, 43, 15, 5, NULL, 'João 15:5'),
  (46, 43, 15, 13, NULL, 'João 15:13'),
  (47, 43, 20, 31, NULL, 'João 20:31'),
  (48, 44, 1, 8, NULL, 'Atos 1:8'),
  (49, 44, 16, 31, NULL, 'Atos 16:31'),
  (50, 45, 1, 16, NULL, 'Romanos 1:16'),
  (51, 45, 8, 1, NULL, 'Romanos 8:1'),
  (52, 45, 8, 28, NULL, 'Romanos 8:28'),
  (53, 45, 8, 38, 39, 'Romanos 8:38-39'),
  (54, 45, 12, 1, 2, 'Romanos 12:1-2'),
  (55, 46, 13, 4, 7, '1 Coríntios 13:4-7'),
  (56, 47, 12, 9, NULL, '2 Coríntios 12:9'),
  (57, 48, 5, 22, 23, 'Gálatas 5:22-23'),
  (58, 49, 2, 10, NULL, 'Efésios 2:10'),
  (59, 49, 6, 10, 11, 'Efésios 6:10-11'),
  (60, 50, 2, 9, 11, 'Filipenses 2:9-11'),
  (61, 50, 4, 6, 7, 'Filipenses 4:6-7'),
  (62, 51, 3, 23, NULL, 'Colossenses 3:23'),
  (63, 52, 5, 16, 18, '1 Tessalonicenses 5:16-18'),
  (64, 55, 1, 7, NULL, '2 Timóteo 1:7'),
  (65, 56, 3, 5, NULL, 'Tito 3:5'),
  (66, 58, 11, 1, NULL, 'Hebreus 11:1'),
  (67, 58, 13, 8, NULL, 'Hebreus 13:8'),
  (68, 59, 1, 22, NULL, 'Tiago 1:22'),
  (69, 60, 5, 7, NULL, '1 Pedro 5:7'),
  (70, 61, 3, 9, NULL, '2 Pedro 3:9'),
  (71, 62, 3, 1, NULL, '1 João 3:1'),
  (72, 62, 4, 19, NULL, '1 João 4:19'),
  (73, 65, 1, 24, 25, 'Judas 1:24-25'),
  (74, 66, 21, 4, NULL, 'Apocalipse 21:4'),
  (75, 1, 1, 1, NULL, 'Gênesis 1:1'),
  (76, 5, 31, 6, NULL, 'Deuteronômio 31:6'),
  (77, 6, 1, 9, NULL, 'Josué 1:9');
