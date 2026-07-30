-- Textos de compartilhamento do Módulo 3 (Como Estudar a Bíblia).
-- Mesmo padrão já usado nos Módulos 1 (Novo Convertido) e 2 (Fundamentos da Fé):
--   1. Sem frases repetidas ou redundantes dentro do mesmo texto.
--   2. Linha em branco real (não apenas quebra de linha) entre o corpo do
--      texto e a pergunta final, para a imagem gerada mostrar um espaço
--      visível antes da pergunta.
--   3. Texto evangelístico, pensado para ser compartilhado: resume a lição,
--      responde ou complementa a pergunta do tema, e cita uma referência
--      bíblica no formato "De acordo com <referência>...".
--   4. Até 750 caracteres por texto.
-- Persona: mentor de discipulado cristão (batista, evangélico, cristocêntrico,
-- fiel à Sola Scriptura), conforme definido para a produção de conteúdo do app.

INSERT INTO public.lesson_share_texts (lesson_id, lesson_title, share_text) VALUES
  ('ceb-1-1', 'Autoridade e Inspiração das Escrituras', 'Terminei a lição "Autoridade e Inspiração das Escrituras" e entendi que a Bíblia não é apenas um livro inspirador — ela é "soprada por Deus", palavra dele e dos autores humanos ao mesmo tempo, sem perder nada do que Ele quis comunicar. Isso muda a pergunta que faço diante do texto: não mais "eu concordo com isso?", mas "o que Deus está me dizendo, e o que farei a respeito?". Ler as Escrituras assim é sentar-se aos pés do próprio Deus. De acordo com 2 Timóteo 3:16-17, toda a Escritura é inspirada por Deus e útil para ensinar, corrigir e instruir na justiça.

Se você realmente cresse que cada versículo é soprado por Deus, o que mudaria na forma como o lê?'),
  ('ceb-1-2', 'Contexto Histórico e Literário', 'Concluí a lição "Contexto Histórico e Literário" e vi como um texto sem contexto vira pretexto: citar "tudo posso" sem o versículo anterior, sobre viver contente em qualquer situação, transforma uma lição de contentamento numa fórmula de conquistas pessoais. A Bíblia é uma biblioteca de 66 livros, escrita em três línguas ao longo de 1.500 anos — por isso ler cada texto no seu lugar, autor e propósito original evita distorcer a própria Palavra de Deus. De acordo com Neemias 8:8, os levitas liam a Lei interpretando-a, para que o povo entendesse o que estava sendo lido.

Você já usou algum versículo fora do contexto para justificar o que já queria fazer?'),
  ('ceb-2-1', 'O Método Indutivo: Observar, Interpretar, Aplicar', 'Terminei a lição "O Método Indutivo" e aprendi as três etapas de um estudo bíblico sério: observar com calma — notar repetições, conectores, contrastes; interpretar — cruzar com outros textos e considerar o gênero; e aplicar — obedecer com a vida, não só dizer "amém". Pular direto para a aplicação sem observar é ler rápido demais para realmente ouvir o que Deus está dizendo. De acordo com Atos 17:11, os bereanos examinavam diariamente as Escrituras para ver se o que ouviam era mesmo assim.

Você costuma pular direto para a aplicação? O que perde quando não observa o texto com calma antes?'),
  ('ceb-2-2', 'Gêneros Literários: Lendo Cada Texto Como Ele Pede', 'Concluí a lição "Gêneros Literários" e entendi por que ler cada texto bíblico como ele pede muda tudo: narrativa histórica normalmente descreve o que aconteceu, não necessariamente prescreve o que deve sempre acontecer; poesia usa imagens e hipérboles que não são diagnóstico literal; lei exige discernir o que era cerimonial, civil ou moral. Tratar um gênero como outro distorce o que o próprio autor bíblico quis comunicar. De acordo com Marcos 4:33-34, Jesus falava por parábolas e, a sós com os discípulos, explicava tudo.

Você já tratou uma imagem poética da Bíblia como afirmação literal? O que isso pode ter distorcido no seu entendimento de Deus?'),
  ('ceb-3-1', 'Cristo, a Chave de Toda a Escritura', 'Terminei a lição "Cristo, a Chave de Toda a Escritura" e reaprendi que ler a Bíblia sem enxergar Cristo produz duas doenças: moralismo, que a trata como manual de bom comportamento, e legalismo, que a trata como código de regras para conquistar a Deus. A leitura cristocêntrica cura as duas — a Lei aponta para a nossa incapacidade e nos leva a Cristo, e a graça nele nos dá poder para viver o que a Lei descrevia. Toda a Bíblia, de um jeito ou de outro, aponta para Jesus. De acordo com Lucas 24:27, Jesus explicou, começando por Moisés e os profetas, o que as Escrituras diziam a respeito dele.

Ao ler a Bíblia, você busca principalmente princípios para sua vida, ou o rosto de Cristo?'),
  ('ceb-3-2', 'Hebraico e Grego: Ferramentas, Não Atalhos', 'Concluí a lição "Hebraico e Grego: Ferramentas, Não Atalhos" e aprendi que conhecer as línguas originais serve para aprofundar o estudo, não para forçar significados que o texto não sustenta. Em João 21, por exemplo, alguns constroem sermões inteiros sobre uma suposta diferença dramática entre dois verbos gregos para "amar" ali usados — mas o próprio João costuma alternar sinônimos sem intenção de contraste em outras passagens. Palavra original sem contexto vira armadilha, não ferramenta. De acordo com 2 Timóteo 2:15, devemos nos apresentar a Deus aprovados, manejando com precisão a palavra da verdade.

Você já repetiu uma explicação de "palavra original" sem checar se ela se sustentava no contexto?'),
  ('ceb-4-1', 'Do Texto à Aplicação: Evitando os Erros Comuns', 'Terminei a lição "Do Texto à Aplicação" e entendi a aplicação bíblica como uma ponte com duas margens: de um lado, o mundo antigo do texto, com sua cultura e costumes; do outro, o meu mundo hoje. Essa ponte só é segura quando primeiro identifico o princípio teológico permanente que atravessa as duas margens, e só depois formulo como obedecê-lo no meu contexto — sem confundir mandamento cultural com verdade eterna, nem descartar como "antigo demais" o que Deus ainda exige. De acordo com Tiago 1:22, não devemos apenas ouvir a palavra, mas praticar o que ela diz.

Existe algum ensino bíblico que você ignora por parecer antigo demais?'),
  ('ceb-4-2', 'Interpretando Parábolas e Símbolos', 'Concluí a lição "Interpretando Parábolas e Símbolos" e vi que buscar um significado escondido em cada detalhe de uma parábola não é o caminho mais seguro — foi um exagero que marcou parte da igreja antiga. A pergunta certa, redescoberta com força na Reforma, é mais simples: qual é o ponto central que Jesus quis comunicar com essa história? As parábolas revelam o Reino a quem tem coração aberto, e escondem de quem só busca curiosidade religiosa sem disposição de se render. De acordo com Marcos 4:11-12, a vocês foi confiado o mistério do Reino de Deus.

Você já tentou extrair um significado escondido de cada detalhe de uma história bíblica?'),
  ('ceb-4-3', 'Montando um Plano de Estudo Bíblico Pessoal', 'Terminei a lição "Montando um Plano de Estudo Bíblico Pessoal" e aprendi que a palavra hebraica por trás de "meditar", no Salmo 1, evoca um animal ruminando o alimento — mastigando devagar, repetidas vezes, até extrair todo o proveito. Esse é o retrato de um estudo bíblico saudável: não é consumo rápido de informação, é rumina lenta da verdade até alimentar a alma inteira. E a sabedoria bíblica nunca elogia o estudo solitário — crescemos lendo em comunhão com quem nos ajuda e corrige. De acordo com Salmos 1:2-3, quem medita na lei do Senhor de dia e de noite é como árvore plantada junto a águas, que dá fruto no tempo certo.

Seu estudo bíblico até hoje tem sido constante ou apenas ocasional?'),
  ('ceb-5-1', 'A Metanarrativa Bíblica: Uma História, Um Herói', 'Concluí a lição "A Metanarrativa Bíblica" e vi a Bíblia como um só drama em atos: Criação, com Deus fazendo um mundo bom e o ser humano à sua imagem; Queda, quando o pecado quebra a comunhão perfeita — mas já em Gênesis 3:15 Deus promete um descendente que esmagará a cabeça da serpente; e Redenção, a longa história que caminha até Cristo e aponta para a restauração final de todas as coisas. Ler qualquer texto bíblico fora desse mapa maior é como entrar no meio de um filme. De acordo com Lucas 24:27, Jesus explicou, começando por Moisés e os profetas, o que as Escrituras diziam a respeito dele.

Como a sua própria história de fé se encaixa nessa história maior de Deus resgatando um povo para si?'),
  ('ceb-5-2', 'Perguntas ao Texto: Aprendendo a Interrogar as Escrituras', 'Terminei a lição "Perguntas ao Texto" e aprendi que um bom leitor da Bíblia não apenas lê — interroga o texto. Primeiro pergunta o que ele realmente diz: quem fala, para quem, o quê, quando, onde, sem pular para conclusões. Depois pergunta pelo contexto: quem escreveu, para qual comunidade, em qual momento da história, o que vem antes e depois. Um versículo isolado do parágrafo costuma dizer algo que o autor nunca quis dizer. De acordo com Atos 8:30-31, Filipe perguntou ao eunuco se ele entendia o que lia, e ele respondeu que precisava de alguém para ajudá-lo.

O que mais impede você de fazer perguntas sinceras ao texto: pressa, medo de não ter resposta, ou o orgulho de achar que já entende?')
ON CONFLICT (lesson_id) DO UPDATE SET
  lesson_title = EXCLUDED.lesson_title,
  share_text = EXCLUDED.share_text,
  updated_at = now();
