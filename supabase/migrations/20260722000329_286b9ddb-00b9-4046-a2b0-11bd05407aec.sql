
CREATE TABLE public.disciple_modules (
  id TEXT PRIMARY KEY,
  ord INT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.disciple_modules TO authenticated, anon;
GRANT ALL ON public.disciple_modules TO service_role;
ALTER TABLE public.disciple_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules readable by all" ON public.disciple_modules FOR SELECT USING (true);

CREATE TABLE public.disciple_trails (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES public.disciple_modules(id) ON DELETE CASCADE,
  ord INT NOT NULL,
  title TEXT NOT NULL,
  lesson_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, ord)
);
GRANT SELECT ON public.disciple_trails TO authenticated, anon;
GRANT ALL ON public.disciple_trails TO service_role;
ALTER TABLE public.disciple_trails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trails readable by all" ON public.disciple_trails FOR SELECT USING (true);

INSERT INTO public.disciple_modules (id, ord, title, description, icon, color) VALUES
  ('m1',  1,  'Novo Convertido',       'Primeiros passos na fé cristã.',                     'Sprout',    'from-violet-500 to-indigo-500'),
  ('m2',  2,  'Fundamentos da Fé',     'As doutrinas essenciais da fé cristã.',              'BookOpen',  'from-sky-500 to-blue-600'),
  ('m3',  3,  'Como Estudar a Bíblia', 'Ferramentas simples de interpretação bíblica.',      'Search',    'from-emerald-500 to-teal-600'),
  ('m4',  4,  'Oração',                'A vida de oração do discípulo.',                     'HandHeart', 'from-amber-500 to-orange-600'),
  ('m5',  5,  'Santificação',          'Crescimento em Cristo pelo Espírito.',               'Flame',     'from-rose-500 to-red-600'),
  ('m6',  6,  'Evangelismo',           'Boas novas para quem ainda não creu.',               'Megaphone', 'from-lime-500 to-green-600'),
  ('m7',  7,  'Igreja Local',          'Corpo, membresia e vida em comunidade.',             'Church',    'from-fuchsia-500 to-purple-600'),
  ('m8',  8,  'Vida Cristã',           'Discipulado no cotidiano do mundo.',                 'Compass',   'from-cyan-500 to-sky-600'),
  ('m9',  9,  'Família Cristã',        'Casamento, filhos e o altar doméstico.',             'Home',      'from-pink-500 to-rose-600'),
  ('m10', 10, 'Liderança',             'Servir liderando à maneira de Cristo.',              'Crown',     'from-yellow-500 to-amber-600'),
  ('m11', 11, 'Missões',               'A missão de Deus até os confins da terra.',          'Globe',     'from-indigo-500 to-violet-600');

INSERT INTO public.disciple_trails (id, module_id, ord, title, lesson_id) VALUES
  -- Módulo 1
  ('m1-t1',  'm1', 1, 'Quem é Jesus',            'db-1-2'),
  ('m1-t2',  'm1', 2, 'O Evangelho',             NULL),
  ('m1-t3',  'm1', 3, 'Arrependimento e Fé',     'nc-1-1'),
  ('m1-t4',  'm1', 4, 'Graça e Adoção',          'db-2-1'),
  ('m1-t5',  'm1', 5, 'A Palavra',               'nc-2-1'),
  ('m1-t6',  'm1', 6, 'A Oração',                'nc-2-2'),
  ('m1-t7',  'm1', 7, 'Igreja e Comunhão',       NULL),
  ('m1-t8',  'm1', 8, 'Batismo',                 NULL),
  ('m1-t9',  'm1', 9, 'Primeiros Tropeços',      'nc-1-2'),
  ('m1-t10', 'm1', 10,'Missão Inicial',          NULL),
  -- Módulo 2
  ('m2-t1',  'm2', 1, 'Autoridade das Escrituras','ceb-1-1'),
  ('m2-t2',  'm2', 2, 'Deus e a Trindade',       'db-1-1'),
  ('m2-t3',  'm2', 3, 'Criação e Queda',         NULL),
  ('m2-t4',  'm2', 4, 'História da Redenção',    NULL),
  ('m2-t5',  'm2', 5, 'A Pessoa de Cristo',      NULL),
  ('m2-t6',  'm2', 6, 'A Obra de Cristo',        NULL),
  ('m2-t7',  'm2', 7, 'O Espírito Santo',        NULL),
  ('m2-t8',  'm2', 8, 'A Salvação',              NULL),
  ('m2-t9',  'm2', 9, 'A Igreja',                NULL),
  ('m2-t10', 'm2', 10,'Escatologia Básica',      NULL),
  -- Módulo 3
  ('m3-t1',  'm3', 1, 'A Metanarrativa Bíblica', 'ceb-2-2'),
  ('m3-t2',  'm3', 2, 'Gêneros Literários',      NULL),
  ('m3-t3',  'm3', 3, 'O Método Indutivo',       'ceb-2-1'),
  ('m3-t4',  'm3', 4, 'Contexto Histórico',      'ceb-1-2'),
  ('m3-t5',  'm3', 5, 'Ferramentas de Estudo',   NULL),
  ('m3-t6',  'm3', 6, 'Perguntas ao Texto',      NULL),
  ('m3-t7',  'm3', 7, 'Hermenêutica Cristocêntrica', NULL),
  ('m3-t8',  'm3', 8, 'Evitando Heresias',       NULL),
  ('m3-t9',  'm3', 9, 'Exegese e Aplicação',     NULL),
  ('m3-t10', 'm3', 10,'Hábito de Leitura',       NULL),
  -- Módulo 4
  ('m4-t1',  'm4', 1, 'Teologia da Oração',      NULL),
  ('m4-t2',  'm4', 2, 'O Jesus Orante',          'or-1-1'),
  ('m4-t3',  'm4', 3, 'O Pai Nosso',             NULL),
  ('m4-t4',  'm4', 4, 'Tipos de Oração',         'or-1-2'),
  ('m4-t5',  'm4', 5, 'Inimigos da Oração',      NULL),
  ('m4-t6',  'm4', 6, 'Oração e Soberania',      NULL),
  ('m4-t7',  'm4', 7, 'Oração e Jejum',          NULL),
  ('m4-t8',  'm4', 8, 'Oração Corporativa',      'or-2-2'),
  ('m4-t9',  'm4', 9, 'Oração no Deserto',       'or-2-1'),
  ('m4-t10', 'm4', 10,'Vida Devocional',         NULL),
  -- Módulo 5 Santificação
  ('m5-t1',  'm5', 1, 'O que é Santificação',    NULL),
  ('m5-t2',  'm5', 2, 'Justificação vs. Santificação', NULL),
  ('m5-t3',  'm5', 3, 'A Batalha Tripla',        NULL),
  ('m5-t4',  'm5', 4, 'O Papel do Espírito',     NULL),
  ('m5-t5',  'm5', 5, 'Disciplinas Espirituais', NULL),
  ('m5-t6',  'm5', 6, 'Mortificação do Pecado',  NULL),
  ('m5-t7',  'm5', 7, 'O Fruto do Espírito',     NULL),
  ('m5-t8',  'm5', 8, 'Propósito do Sofrimento', NULL),
  ('m5-t9',  'm5', 9, 'Perseverança na Fé',      NULL),
  ('m5-t10', 'm5', 10,'Maturidade Cristã',       NULL),
  -- Módulo 6 Evangelismo
  ('m6-t1',  'm6', 1, 'O Coração de Deus',       NULL),
  ('m6-t2',  'm6', 2, 'Teologia da Evangelização', NULL),
  ('m6-t3',  'm6', 3, 'Superando o Medo',        NULL),
  ('m6-t4',  'm6', 4, 'Testemunho Pessoal',      NULL),
  ('m6-t5',  'm6', 5, 'Explicando o Evangelho',  NULL),
  ('m6-t6',  'm6', 6, 'Evangelismo Relacional',  NULL),
  ('m6-t7',  'm6', 7, 'Apologética Básica',      NULL),
  ('m6-t8',  'm6', 8, 'Testemunho Digital',      NULL),
  ('m6-t9',  'm6', 9, 'Discipulado Inicial',     NULL),
  ('m6-t10', 'm6', 10,'Multiplicação',           NULL),
  -- Módulo 7 Igreja Local
  ('m7-t1',  'm7', 1, 'A Importância da Igreja', NULL),
  ('m7-t2',  'm7', 2, 'Figuras da Igreja',       NULL),
  ('m7-t3',  'm7', 3, 'Membresia Bíblica',       NULL),
  ('m7-t4',  'm7', 4, 'Dons Espirituais',        NULL),
  ('m7-t5',  'm7', 5, 'Ofícios Bíblicos',        NULL),
  ('m7-t6',  'm7', 6, 'Batismo e Ceia',          NULL),
  ('m7-t7',  'm7', 7, 'Pequenos Grupos',         NULL),
  ('m7-t8',  'm7', 8, 'Disciplina Eclesiástica', NULL),
  ('m7-t9',  'm7', 9, 'Pacificação',             NULL),
  ('m7-t10', 'm7', 10,'Missão Corporativa',      NULL),
  -- Módulo 8 Vida Cristã
  ('m8-t1',  'm8', 1, 'Cosmovisão Cristã',       NULL),
  ('m8-t2',  'm8', 2, 'Identidade em Cristo',    NULL),
  ('m8-t3',  'm8', 3, 'Senhorio de Jesus',       NULL),
  ('m8-t4',  'm8', 4, 'Teologia do Trabalho',    NULL),
  ('m8-t5',  'm8', 5, 'Finanças e Mordomia',     NULL),
  ('m8-t6',  'm8', 6, 'Teologia do Descanso',    NULL),
  ('m8-t7',  'm8', 7, 'Discernimento Cultural',  NULL),
  ('m8-t8',  'm8', 8, 'Ética e Cidadania',       NULL),
  ('m8-t9',  'm8', 9, 'Relacionamentos Saudáveis', NULL),
  ('m8-t10', 'm8', 10,'Sofrimento e Confiança',  NULL),
  -- Módulo 9 Família
  ('m9-t1',  'm9', 1, 'O Design do Casamento',   NULL),
  ('m9-t2',  'm9', 2, 'Dádiva da Solteirice',    NULL),
  ('m9-t3',  'm9', 3, 'Namoro e Noivado',        NULL),
  ('m9-t4',  'm9', 4, 'Papéis no Lar',           NULL),
  ('m9-t5',  'm9', 5, 'Comunicação Conjugal',    NULL),
  ('m9-t6',  'm9', 6, 'Criação de Filhos',       NULL),
  ('m9-t7',  'm9', 7, 'O Altar Doméstico',       NULL),
  ('m9-t8',  'm9', 8, 'Finanças Familiares',     NULL),
  ('m9-t9',  'm9', 9, 'Família e Igreja',        NULL),
  ('m9-t10', 'm9', 10,'Graça Restauradora',      NULL),
  -- Módulo 10 Liderança
  ('m10-t1',  'm10', 1, 'Liderança Bíblica',        NULL),
  ('m10-t2',  'm10', 2, 'Liderança Servidora',      NULL),
  ('m10-t3',  'm10', 3, 'O Primado do Caráter',     NULL),
  ('m10-t4',  'm10', 4, 'Vitalidade Espiritual',    NULL),
  ('m10-t5',  'm10', 5, 'Discernimento e Decisão',  NULL),
  ('m10-t6',  'm10', 6, 'A Arte de Delegar',        NULL),
  ('m10-t7',  'm10', 7, 'Liderança sob Pressão',    NULL),
  ('m10-t8',  'm10', 8, 'Cuidado Pastoral',         NULL),
  ('m10-t9',  'm10', 9, 'Lidando com Fracassos',    NULL),
  ('m10-t10', 'm10', 10,'Deixando um Legado',       NULL),
  -- Módulo 11 Missões
  ('m11-t1',  'm11', 1, 'A Missão de Deus',         NULL),
  ('m11-t2',  'm11', 2, 'A Grande Comissão',        NULL),
  ('m11-t3',  'm11', 3, 'Missões e Culturas',       NULL),
  ('m11-t4',  'm11', 4, 'Contextualização',         NULL),
  ('m11-t5',  'm11', 5, 'A Igreja como Agência',    NULL),
  ('m11-t6',  'm11', 6, 'O Papel de Quem Fica',     NULL),
  ('m11-t7',  'm11', 7, 'Missão Integral',          NULL),
  ('m11-t8',  'm11', 8, 'Missões e Fronteiras',     NULL),
  ('m11-t9',  'm11', 9, 'Teologia do Martírio',     NULL),
  ('m11-t10', 'm11', 10,'Maranata',                 NULL);
