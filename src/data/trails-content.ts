// Conteúdo pastoral completo das trilhas restantes.
// Turno 1: Como Estudar a Bíblia + Oração (9 lições).
// Padrão idêntico ao usado em "Novo Convertido" e "Doutrina Básica".
// Base teológica: Cristão Evangélico, Batista Aberto, soteriologia arminiana
// (autores reformados usados como referência secundária, sem normatividade
// soteriológica), cristocêntrico, cessacionista moderado. Sola Scriptura.

import type { Trail } from "./content";

const comoEstudarBiblia: Trail = {
  id: "como-estudar-biblia",
  title: "Como Estudar a Bíblia",
  description: "Ferramentas simples de interpretação bíblica.",
  icon: "Search",
  color: "from-emerald-500 to-teal-600",
  order: 3,
  modules: [
    {
      id: "ceb-mod-1",
      title: "Módulo I: Fundamentos da Interpretação",
      lessons: [
        {
          id: "ceb-1-1",
          title: "Autoridade e Inspiração das Escrituras",
          intro: [
            "Antes de aprender qualquer método para estudar a Bíblia, é preciso saber o que ela é. Ler as Escrituras como se fossem um livro qualquer produz um estudo qualquer. Lê-las como o próprio Deus falando produz reverência, atenção e obediência — que são a atmosfera onde o entendimento nasce.",
            "A doutrina da inspiração ensina que Deus, sem anular a personalidade dos autores humanos, dirigiu de tal forma o que escreveram que o resultado é, ao mesmo tempo, palavra deles e palavra dele. Não é ditado mecânico e nem é intuição religiosa; é aquilo que Paulo chama de 'sopro de Deus'.",
            "Isso muda a postura do leitor. Você não se aproxima do texto como juiz; aproxima-se como discípulo. A pergunta deixa de ser 'eu concordo com isso?' e passa a ser 'o que Deus está me dizendo aqui, e o que farei a respeito?'",
          ],
          verses: [
            {
              ref: "2 Timóteo 3:16-17",
              textByVersion: {
                NVI: "Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça, para que o homem de Deus seja apto e plenamente preparado para toda boa obra.",
              },
              originals: [
                { word: "θεόπνευστος", translit: "theopneustos", meaning: "soprada por Deus, exalada pelo próprio Deus", lang: "grego" },
              ],
            },
            {
              ref: "2 Pedro 1:20-21",
              textByVersion: {
                NVI: "Antes de tudo, saibam que nenhuma profecia da Escritura provém de interpretação pessoal, pois jamais a profecia teve origem na vontade humana, mas homens falaram da parte de Deus, impelidos pelo Espírito Santo.",
              },
            },
          ],
          keywords: [
            { word: "θεόπνευστος", translit: "theopneustos", meaning: "soprada, exalada por Deus", lang: "grego" },
            { word: "γραφή", translit: "graphē", meaning: "escrito, Escritura Sagrada", lang: "grego" },
          ],
          deepDive:
            "Dizer que a Bíblia é 'inspirada' não significa que ela é inspiradora (como um poema pode ser). Significa que ela foi soprada por Deus — theopneustos. Por isso ela tem autoridade sobre a igreja e sobre você. Nenhum comentário, tradição, sentimento ou experiência pode se sobrepor ao texto sagrado. Isso protege o cristão de dois extremos: do racionalismo, que só aceita o que a mente aprova, e do misticismo, que só busca experiências e ignora o texto. Ler a Bíblia é sentar-se aos pés de Deus.",
          theologianQuote: {
            author: "Luiz Sayão",
            text: "A Bíblia não é um livro para ser estudado como se estuda literatura antiga; é a voz do Deus vivo, e o leitor honesto se dobra diante dela antes de tentar dissecá-la.",
          },
          quizzes: [
            {
              question: "O que a palavra grega 'theopneustos' comunica sobre a Bíblia?",
              options: [
                "Que ela é um livro inspirador para os fiéis",
                "Que ela foi soprada, exalada pelo próprio Deus",
                "Que ela é fruto do consenso da comunidade de fé",
                "Que ela é útil apenas para líderes religiosos",
              ],
              correctIndex: 1,
              explanation: "Theopneustos = 'soprada por Deus'. A Bíblia tem Deus como sua origem última.",
            },
            {
              question: "Segundo 2 Pedro 1:21, como os textos das Escrituras surgiram?",
              options: [
                "Da vontade e criatividade dos escritores",
                "De concílios que decidiram o que era verdade",
                "Homens falaram da parte de Deus, impelidos pelo Espírito Santo",
                "De visões místicas isoladas",
              ],
              correctIndex: 2,
            },
          ],
          application:
            "Comece cada leitura bíblica desta semana com uma oração breve: 'Senhor, esta é a tua Palavra. Fala e teu servo ouve.' Escreva na primeira página da sua Bíblia essa frase.",
          prayer:
            "Pai, obrigado por não teres ficado em silêncio. Obrigado porque tua Palavra é viva e me alcança. Ensina-me a ouvir com reverência, e não apenas com curiosidade. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha um capítulo pequeno (ex.: Salmo 1) e leia-o em três versões diferentes (NVI, NAA, ACF). Anote uma diferença de tradução e o que ela te ensinou sobre o texto original.",
          reflectionQuestion:
            "Se eu realmente cresse que cada versículo é 'soprado por Deus', o que mudaria no modo como leio a Bíblia amanhã de manhã?",
          xp: 20,
        },
        {
          id: "ceb-1-2",
          title: "Contexto Histórico e Literário",
          intro: [
            "O maior erro do intérprete iniciante é arrancar um versículo do lugar onde ele nasceu. A Bíblia não caiu do céu como uma coleção de frases isoladas para colar em quadros; ela nasceu em culturas, línguas e situações concretas. Ignorar isso é como abrir uma carta pelo meio e achar que entendeu o assunto.",
            "'Contexto' significa três coisas simples: contexto histórico (quem escreveu, para quem, quando, em que situação), contexto literário (é poesia, narrativa, carta, profecia, sabedoria?) e contexto imediato (o que vem antes e o que vem depois desse versículo?). Toda vez que você faz essas três perguntas antes de aplicar um texto, você já subiu de degrau.",
            "Neemias 8 nos dá o modelo mais antigo: os levitas leram a Lei publicamente e depois 'explicaram o sentido, para que o povo entendesse'. Ler e entender andam juntos.",
          ],
          verses: [
            {
              ref: "Neemias 8:8",
              textByVersion: {
                NVI: "Leram no Livro da Lei de Deus, interpretando-o e explicando-o, a fim de que o povo entendesse o que estava sendo lido.",
              },
            },
            {
              ref: "2 Pedro 3:16",
              textByVersion: {
                NVI: "[Paulo] fala destes assuntos em todas as suas cartas. Nelas há algumas coisas difíceis de entender, as quais os ignorantes e instáveis torcem, como também o fazem com as demais Escrituras, para a própria destruição deles.",
              },
            },
          ],
          keywords: [
            { word: "מְפֹרָשׁ", translit: "mephorash", meaning: "explicado com clareza, esmiuçado", lang: "hebraico" },
            { word: "ὀρθοτομέω", translit: "orthotomeō", meaning: "cortar reto, manejar corretamente (2 Tm 2:15)", lang: "grego" },
          ],
          deepDive:
            "Um texto sem contexto vira pretexto. Se você lê 'tudo posso' (Fp 4:13) sem enxergar o versículo anterior, 'aprendi a viver contente em qualquer situação', converte um texto sobre contentamento em fórmula mágica para conquistas pessoais. A Bíblia é uma biblioteca de 66 livros, escritos em três línguas, ao longo de 1.500 anos, em gêneros diferentes. Ler poesia como manual técnico, ou parábola como reportagem, produz teologia deformada. Antes de perguntar 'o que isso significa para mim?', pergunte 'o que isso significou para eles?'",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "Texto sem contexto vira pretexto para heresia. A humildade do bom intérprete é ouvir o que o autor quis dizer antes de dizer o que ele acha que o texto quer dizer.",
          },
          quizzes: [
            {
              question: "Qual é o primeiro passo antes de aplicar um versículo?",
              options: [
                "Perguntar como ele se aplica à minha vida hoje",
                "Investigar o contexto histórico, literário e imediato",
                "Procurar um pregador que já explicou o versículo",
                "Comparar o versículo com outros que tenham palavras parecidas",
              ],
              correctIndex: 1,
            },
            {
              question: "O que Neemias 8:8 nos ensina sobre o estudo bíblico?",
              options: [
                "Que basta ler a Bíblia em voz alta",
                "Que ler e explicar o sentido caminham juntos",
                "Que só sacerdotes podem interpretar a Bíblia",
                "Que a interpretação é sempre subjetiva",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Ao ler um versículo esta semana, sempre leia também os 5 versículos antes e os 5 versículos depois. Anote se seu entendimento mudou.",
          prayer:
            "Senhor, guarda-me da preguiça de ler tua Palavra fora do lugar. Dá-me a humildade de investigar antes de aplicar, e a coragem de aplicar depois de entender. Amém.",
          weeklyChallenge:
            "Escolha um versículo famoso (Jr 29:11, Fp 4:13, Rm 8:28) e escreva um pequeno parágrafo explicando o contexto original antes de aplicar à sua vida.",
          reflectionQuestion:
            "Que versículo eu tenho aplicado à minha vida sem nunca ter investigado o contexto em que ele foi escrito?",
          xp: 20,
        },
      ],
    },
    {
      id: "ceb-mod-2",
      title: "Módulo II: Ferramentas Práticas",
      lessons: [
        {
          id: "ceb-2-1",
          title: "O Método Indutivo: Observar, Interpretar, Aplicar",
          intro: [
            "Todo bom estudo bíblico caminha em três passos simples, na ordem certa: observar (o que o texto diz?), interpretar (o que o texto significa?) e aplicar (o que ele exige de mim?). Inverter a ordem — aplicar antes de observar — é o atalho que empobrece a maioria dos devocionais.",
            "Os cristãos de Bereia são elogiados justamente por isso: eles receberam Paulo com sede, mas 'examinavam as Escrituras todos os dias' para checar se o que ele ensinava era verdade. Discípulo maduro é aquele que ama tanto o pregador que ainda assim confere o texto.",
            "Você não precisa de doutorado. Precisa de caneta, Bíblia e o hábito de perguntar: quem, o quê, quando, onde, como, por quê.",
          ],
          verses: [
            {
              ref: "Atos 17:11",
              textByVersion: {
                NVI: "Os bereanos eram mais nobres do que os tessalonicenses, pois receberam a mensagem com grande interesse, examinando todos os dias as Escrituras, para ver se tudo era assim mesmo.",
              },
              originals: [
                { word: "ἀνακρίνοντες", translit: "anakrinontes", meaning: "examinando cuidadosamente, escrutinando", lang: "grego" },
              ],
            },
            {
              ref: "Salmos 119:15",
              textByVersion: {
                NVI: "Meditarei nos teus preceitos e darei atenção às tuas veredas.",
              },
            },
          ],
          keywords: [
            { word: "ἀνακρίνω", translit: "anakrinō", meaning: "examinar criteriosamente, investigar a fundo", lang: "grego" },
            { word: "הָגָה", translit: "hagah", meaning: "murmurar, meditar ruminando", lang: "hebraico" },
          ],
          deepDive:
            "Observar é lentidão: notar repetições, conectores ('portanto', 'porém', 'mas'), contrastes, listas, mudanças de tempo verbal. Interpretar é conectar: cruzar com outros textos, considerar o gênero, checar a intenção do autor. Aplicar é obedecer: descobrir o que Deus está pedindo e responder com a vida — não apenas com um 'amém'. O método é uma disciplina de humildade: ele te obriga a ficar diante do texto até que o texto fale.",
          theologianQuote:
