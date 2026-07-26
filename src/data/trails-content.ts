// Conteúdo pastoral completo das trilhas restantes.
// Turno 1: Como Estudar a Bíblia (9 lições, 4 módulos) + Oração (5 lições).
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
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 119:89",
                textByVersion: {
                  NVI: "A tua palavra, Senhor, é eterna; permanece firme nos céus.",
                },
              },
              {
                ref: "Mateus 5:18",
                textByVersion: {
                  NVI: "Digo a verdade: enquanto existirem céus e terra, nem uma letra ou um til jamais desaparecerá da Lei, até que tudo se cumpra.",
                },
              },
            ],
            additionalKeywords: [
              { word: "ἰῶτα", translit: "iōta", meaning: "'jota'. A menor letra do alfabeto grego, usada por Jesus em Mateus 5:18 para afirmar que nem o menor detalhe da Palavra de Deus perderá sua validade.", lang: "grego" },
              { word: "νόμος", translit: "nomos", meaning: "'lei, instrução'. Usada tanto para a Torá inteira quanto para mandamentos específicos; sempre carrega o peso de revelação divina, não de convenção humana.", lang: "grego" },
            ],
            historicalContext:
              "O cânon bíblico não foi 'inventado' por um concílio em algum momento tardio da história — ele foi reconhecido progressivamente pela igreja, à medida que as comunidades cristãs identificavam quais escritos já circulavam com autoridade apostólica e eram lidos nos cultos desde o primeiro século. Critérios como origem apostólica, ortodoxia doutrinária e aceitação ampla pelas igrejas ajudaram a confirmar o que já era reconhecido na prática. Os concílios regionais de Hipona (393 d.C.) e Cartago (397 d.C.) apenas formalizaram por escrito uma lista que, na essência, já era amplamente aceita havia gerações. Isso é diferente dos livros apócrifos, que, mesmo tendo valor histórico, nunca alcançaram esse reconhecimento unânime como Escritura inspirada pelas igrejas de língua grega do Novo Testamento.",
            exegeticalNotes:
              "A palavra 'theopneustos' (2 Timóteo 3:16) é rara — aparece uma única vez em todo o Novo Testamento — e parece ter sido cunhada ou popularizada pelo próprio Paulo para comunicar algo preciso: não que a Escritura 'contém' a respiração de Deus, mas que ela é, na sua origem, o próprio sopro divino colocado em palavras humanas. Note também a estrutura da frase: a Escritura é 'útil' para quatro coisas — ensino (o que é certo), repreensão (o que é errado), correção (como consertar) e instrução na justiça (como permanecer certo). Não é um livro de teoria abstrata; é uma ferramenta completa para formar o caráter cristão.",
            theologicalDebate:
              "A doutrina da inspiração verbal e plenária (de que as próprias palavras da Escritura, e não apenas as ideias gerais, foram inspiradas por Deus) é a posição histórica evangélica e constitui doutrina essencial da fé cristã. Já a formulação precisa da inerrância — como ela lida, por exemplo, com números arredondados, citações livres do Antigo Testamento no Novo, ou linguagem fenomenológica ('o sol nasceu') — é uma questão importante onde cristãos fiéis e comprometidos com a autoridade da Escritura usam formulações um pouco diferentes, sem que isso comprometa o compromisso comum com a Palavra de Deus como verdadeira e confiável em tudo o que afirma.",
            secondQuote: {
              author: "Wayne Grudem",
              text: "A Escritura é a única regra suprema pela qual toda controvérsia religiosa deve ser resolvida, e todo julgamento humano, por mais respeitável que seja, deve se curvar diante dela.",
            },
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
          deepen: {
            additionalVerses: [
              {
                ref: "Lucas 1:3-4",
                textByVersion: {
                  NVI: "Pareceu-me bem também, depois de cuidadosa investigação de tudo desde o princípio, escrever um relato ordenado para ti, ó excelentíssimo Teófilo, para que tenhas certeza das coisas que te foram ensinadas.",
                },
              },
              {
                ref: "Atos 8:30-31",
                textByVersion: {
                  NVI: "Filipe correu para o carro e ouviu o homem lendo o profeta Isaías. 'Você entende o que está lendo?', perguntou. 'Como poderei entender se alguém não me ensinar?', respondeu ele.",
                },
              },
            ],
            additionalKeywords: [
              { word: "ἀκριβῶς", translit: "akribōs", meaning: "'com exatidão, cuidadosamente'. Lucas usa esse advérbio para descrever seu próprio método de investigação histórica antes de escrever o Evangelho — um modelo de seriedade no manejo dos fatos.", lang: "grego" },
              { word: "בִּין", translit: "bin", meaning: "'discernir, compreender com profundidade'. Vai além de simplesmente ouvir palavras; implica captar o sentido real por trás delas.", lang: "hebraico" },
            ],
            historicalContext:
              "Já nos primeiros séculos da Igreja existiam duas grandes escolas de interpretação bíblica: a escola de Alexandria, que tendia a buscar sentidos alegóricos e espirituais escondidos por trás do texto, e a escola de Antioquia, que insistia no sentido histórico-gramatical — o que o autor original quis dizer, no seu contexto real. A Reforma Protestante, séculos depois, recuperou com força essa ênfase antioquena: Lutero e Calvino insistiam que a Escritura tem um sentido claro (a doutrina da 'perspicuidade da Escritura') e que esse sentido deve ser buscado no texto e no contexto, não em alegorias inventadas pelo intérprete.",
            exegeticalNotes:
              "No grego do Novo Testamento, pequenas partículas de ligação carregam grande peso lógico: 'gar' (pois, porque) introduz uma explicação; 'oun' (portanto, logo) introduz uma conclusão; 'de' (mas, e) pode marcar contraste ou continuidade. Aprender a notar essas palavras de conexão — mesmo lendo em português, prestando atenção às conjunções — já ajuda a acompanhar o raciocínio do autor de frase em frase, em vez de tratar cada versículo como uma sentença isolada.",
            theologicalDebate:
              "Existe uma diferença de ênfase, não de contradição, entre a leitura histórico-gramatical (que fixa o olhar no significado original de cada texto, no seu contexto imediato) e a leitura da teologia bíblica ou 'história da redenção' (que busca ver como cada texto se encaixa no grande enredo da Bíblia, do Éden à Nova Jerusalém). As duas abordagens são complementares e amplamente aceitas entre evangélicos fiéis: a primeira evita que a interpretação flutue livre do texto; a segunda evita que o estudo fique fragmentado, sem ver o todo. É uma questão de método, não de doutrina essencial.",
            secondQuote: {
              author: "D. A. Carson",
              text: "O contexto é rei. Um versículo arrancado do seu contexto se torna, na maioria das vezes, um pretexto para dizer qualquer coisa que o intérprete já queria dizer.",
            },
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
            "Já usei algum versículo fora do contexto para justificar o que eu já queria fazer? O que isso revela sobre como eu leio a Bíblia?",
          xp: 20,
        },
      ],
    },
    {
      id: "ceb-mod-2",
      title: "Módulo II: O Método Indutivo",
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
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Um homem que só ora e não estuda a Bíblia se torna emocionalmente devoto e teologicamente cego; um homem que só estuda e não ora se torna orgulhoso. Estudar e orar precisam andar de mãos dadas.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 19:14",
                textByVersion: {
                  NVI: "Sejam agradáveis as palavras da minha boca e a meditação do meu coração diante de ti, Senhor, minha Rocha e meu Redentor.",
                },
              },
              {
                ref: "Josué 1:8",
                textByVersion: {
                  NVI: "Não deixe de falar e meditar dia e noite neste Livro da Lei, para que você seja cuidadoso em agir de acordo com tudo o que nele está escrito. Só assim você prosperará e será bem-sucedido em tudo o que fizer.",
                },
              },
            ],
            additionalKeywords: [
              { word: "שָׁמַר", translit: "shamar", meaning: "'guardar, observar com cuidado, vigiar'. Usado tanto para observar mandamentos quanto para vigiar com atenção — a mesma raiz de 'observação' cuidadosa de um texto.", lang: "hebraico" },
              { word: "παρατηρέω", translit: "paratēreō", meaning: "'observar atentamente, vigiar de perto'. Descreve o tipo de atenção minuciosa que o método indutivo exige do leitor da Escritura.", lang: "grego" },
            ],
            historicalContext:
              "O método indutivo de estudo bíblico, embora tenha sido sistematizado e popularizado por professores e movimentos evangélicos do século XX (como escolas de discipulado e ministérios universitários que ensinavam gerações inteiras a estudar a Bíblia por conta própria), tem sua raiz muito mais antiga na própria prática dos crentes de Bereia, em Atos 17. A ideia de que qualquer cristão comum — não apenas o clero — pode e deve examinar as Escrituras diretamente também foi um dos grandes resgates da Reforma Protestante, que colocou a Bíblia em língua vernácula nas mãos do povo.",
            exegeticalNotes:
              "Um bom exercício de observação em Efésios 4:4-6 é notar a repetição deliberada da palavra 'um': 'um só corpo e um só Espírito... um só Senhor, uma só fé, um só batismo, um só Deus e Pai de todos'. Essa repetição não é acidental — é um recurso retórico que reforça a unidade da igreja como reflexo da unidade de Deus. Observar repetições como essa, antes de interpretar ou aplicar, é o tipo de disciplina que o método indutivo ensina.",
            theologicalDebate:
              "Não há divergência doutrinária relevante aqui — é uma questão de método de estudo, não de doutrina. O único cuidado pastoral importante é evitar dois extremos: transformar o estudo indutivo em exercício puramente acadêmico e frio, esquecendo a oração e a dependência do Espírito Santo para iluminar o entendimento; ou, no extremo oposto, rejeitar qualquer disciplina de estudo em nome de uma suposta espontaneidade espiritual. As duas coisas — estudo cuidadoso e dependência do Espírito — devem coexistir.",
            secondQuote: {
              author: "Charles Swindoll",
              text: "Não existe atalho para o conhecimento profundo das Escrituras. É o tempo investido, versículo por versículo, que forma no crente a mente de Cristo.",
            },
          },
          quizzes: [
            {
              question: "Qual é a ordem correta do método indutivo?",
              options: [
                "Aplicar, interpretar, observar",
                "Observar, interpretar, aplicar",
                "Interpretar, aplicar, observar",
                "Observar, aplicar, interpretar",
              ],
              correctIndex: 1,
            },
            {
              question: "Por que os bereanos foram elogiados?",
              options: [
                "Porque aceitaram tudo o que Paulo ensinou sem questionar",
                "Porque examinavam as Escrituras diariamente para confirmar o ensino",
                "Porque tinham uma teologia superior à dos tessalonicenses",
                "Porque possuíam pergaminhos mais antigos",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Escolha um parágrafo bíblico curto (ex.: Efésios 4:1-6) e faça as três colunas em um caderno: OBSERVAR, INTERPRETAR, APLICAR. Preencha cada uma com pelo menos três anotações.",
          prayer:
            "Pai, dá-me olhos que veem, mente que pensa e coração que obedece. Que eu não fuja da tua Palavra pela pressa, nem me contente com uma leitura rasa. Em Cristo, amém.",
          weeklyChallenge:
            "Aplique o método OIA a um capítulo por dia esta semana (7 capítulos). Ao final, escreva o que Deus mais te falou.",
          reflectionQuestion:
            "Costumo pular direto para a aplicação? O que perco quando não observo com calma antes?",
          xp: 25,
        },
        {
          id: "ceb-2-2",
          title: "Gêneros Literários: Lendo Cada Texto Como Ele Pede",
          intro: [
            "A Bíblia não é um livro só — é uma biblioteca. Dentro dela há narrativa histórica, poesia, lei, sabedoria, profecia, evangelho, carta e literatura apocalíptica. Ler todos esses gêneros exatamente da mesma forma é como ler uma bula de remédio como se fosse um poema de amor: tecnicamente você está lendo palavras, mas está perdendo o sentido.",
            "Jesus mesmo ensinava por parábolas propositalmente veladas, para que o coração aberto entendesse e o coração endurecido não conseguisse manipular a verdade a seu favor. Isso mostra que a forma como um texto foi escrito já carrega parte do seu significado.",
            "Antes de perguntar 'o que este texto significa?', pergunte primeiro 'que tipo de texto é este?'. A resposta muda completamente as regras do jogo interpretativo.",
          ],
          verses: [
            {
              ref: "Marcos 4:33-34",
              textByVersion: {
                NVI: "Com muitas parábolas semelhantes a essas, Jesus lhes falava a palavra, tanto quanto podiam compreender. Não lhes dizia nada sem usar parábolas. Mas, quando estava a sós com os seus discípulos, explicava tudo.",
              },
            },
            {
              ref: "Provérbios 1:5-6",
              textByVersion: {
                NVI: "O sábio, ouvindo-os, aumentará o seu conhecimento, e o discernidor obterá orientação, para entender provérbios e parábolas, ditos e enigmas dos sábios.",
              },
            },
          ],
          keywords: [
            { word: "מָשָׁל", translit: "mashal", meaning: "provérbio, comparação, ditado figurado", lang: "hebraico" },
            { word: "παραβολή", translit: "parabolē", meaning: "parábola, comparação lançada ao lado para ensinar", lang: "grego" },
          ],
          deepDive:
            "Narrativa histórica (Gênesis, Atos) normalmente descreve o que aconteceu — não necessariamente prescreve o que deve acontecer sempre; é preciso checar se o texto ensina explicitamente um princípio ou apenas relata um fato. Poesia (Salmos) usa paralelismo, hipérbole e imagem — 'os meus olhos se consomem de tanto chorar' não é diagnóstico médico, é linguagem de lamento. Lei (Êxodo, Levítico) precisa ser lida dentro da aliança mosaica, discernindo o que é moral permanente e o que é civil/cerimonial cumprido em Cristo. Sabedoria (Provérbios) ensina padrões gerais prováveis, não promessas garantidas. Profecia mistura denúncia do presente e anúncio do futuro. Cartas ensinam doutrina de forma direta, mas endereçada a situações históricas específicas. Ignorar essas diferenças produz interpretações estranhas e, muitas vezes, dolorosas para quem confiou nelas.",
          theologianQuote: {
            author: "Gordon Fee",
            text: "Um texto não pode significar o que nunca significou. A tarefa da boa exegese é primeiro ouvir o texto no seu próprio gênero, antes de perguntar o que ele exige de nós hoje.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Juízes 5:1-3",
                textByVersion: {
                  NVI: "Naquele dia Débora e Baraque, filho de Abinoão, cantaram este cântico: 'Quando os líderes lideram em Israel, quando o povo se dispõe para a batalha, louvem o Senhor!'",
                },
              },
              {
                ref: "Apocalipse 1:1",
                textByVersion: {
                  NVI: "Revelação de Jesus Cristo, a qual Deus lhe deu para mostrar aos seus servos o que em breve há de acontecer. Ele enviou o seu anjo para dá-la a conhecer ao seu servo João, tornando-a conhecida por sinais.",
                },
              },
            ],
            additionalKeywords: [
              { word: "σημαίνω", translit: "sēmainō", meaning: "'comunicar por meio de sinais, simbolizar'. A própria palavra usada em Apocalipse 1:1 avisa o leitor: o que segue será comunicado por símbolos, não por descrição literal direta.", lang: "grego" },
              { word: "מִזְמוֹר", translit: "mizmor", meaning: "'salmo, cântico'. Termo técnico hebraico para poesia composta para ser cantada com acompanhamento musical — um lembrete de que os Salmos foram escritos para serem sentidos, não apenas analisados.", lang: "hebraico" },
            ],
            historicalContext:
              "Um exemplo histórico de como ignorar o gênero literário pode distorcer a interpretação é o Cântico dos Cânticos: por séculos, muitos intérpretes o leram quase exclusivamente como alegoria do amor de Cristo pela Igreja, sem reconhecer seu sentido primário como poesia inspirada celebrando o amor e a intimidade conjugal dentro do casamento. Hoje a maioria dos estudiosos evangélicos reconhece ambas as camadas — o sentido literal poético como base, com ecos tipológicos legítimos que apontam para o amor de Cristo, sem substituir o sentido original.",
            exegeticalNotes:
              "A poesia hebraica raramente rima como a poesia ocidental; em vez disso, ela usa paralelismo. No paralelismo sinônimo, a segunda linha repete a ideia da primeira com outras palavras (Salmos 19:1). No paralelismo antitético, a segunda linha contrasta com a primeira (Provérbios 10:1). No paralelismo sintético, a segunda linha desenvolve ou completa a primeira (Salmos 1:3). Reconhecer esse padrão evita ler cada linha de um salmo como uma afirmação isolada e nova.",
            theologicalDebate:
              "O gênero literário de Gênesis 1-11 é um tema onde cristãos evangélicos fiéis, todos comprometidos com a inspiração e autoridade da Escritura, sustentam posições diferentes — alguns leem os capítulos iniciais com ênfase mais literal-cronológica, outros reconhecem elementos literários e teológicos mais acentuados na narrativa sem negar a historicidade dos eventos centrais (a criação por Deus, a queda, o dilúvio). Essa é uma questão secundária, e não uma doutrina essencial; o núcleo inegociável — que Deus é o Criador soberano e que o pecado entrou no mundo pela desobediência humana — é compartilhado por todas essas posições. Vale a pena estudar o tema com seu pastor com calma.",
            secondQuote: {
              author: "John Goldingay",
              text: "Ler o Antigo Testamento exige ouvir suas muitas vozes — lei, narrativa, poesia, profecia — cada uma com seu próprio jeito de comunicar a verdade de Deus.",
            },
          },
          quizzes: [
            {
              question: "Por que é importante identificar o gênero literário antes de interpretar um texto?",
              options: [
                "Porque cada gênero tem regras próprias de leitura e aplicação",
                "Porque só a poesia é inspirada por Deus",
                "Porque narrativas históricas não têm valor teológico",
                "Porque o gênero determina se o texto é verdadeiro ou não",
              ],
              correctIndex: 0,
            },
            {
              question: "O que geralmente caracteriza a linguagem dos Salmos?",
              options: [
                "Precisão histórica factual",
                "Paralelismo, hipérbole e imagens poéticas",
                "Instruções legais detalhadas",
                "Argumentação teológica sistemática",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Escolha três textos bíblicos de gêneros diferentes (um salmo, uma narrativa e uma carta) e escreva, para cada um, uma frase identificando o gênero e como isso muda a forma de lê-lo.",
          prayer:
            "Senhor, dá-me sabedoria para ouvir cada parte da tua Palavra do jeito que ela foi escrita, sem forçá-la a caber nos meus moldes. Ensina-me a ler com atenção ao gênero e ao coração. Amém.",
          weeklyChallenge:
            "Leia o livro de Rute (narrativa) e o Salmo 23 (poesia) na mesma semana. Anote as diferenças de estilo, ritmo e forma de ensinar entre os dois.",
          reflectionQuestion:
            "Já tratei uma imagem poética da Bíblia como se fosse uma afirmação literal? O que isso pode ter distorcido no meu entendimento de Deus?",
          xp: 25,
        },
      ],
    },
    {
      id: "ceb-mod-3",
      title: "Módulo III: Cristo e as Línguas Originais",
      lessons: [
        {
          id: "ceb-3-1",
          title: "Cristo, a Chave de Toda a Escritura",
          intro: [
            "Existe um segredo que os discípulos de Emaús aprenderam com o próprio Jesus na tarde de domingo de Páscoa: toda a Bíblia fala dele. Não apenas os quatro evangelhos, mas Moisés, os Salmos, os Profetas — todos. Cristo é o fio que costura a Escritura inteira.",
            "Isso não significa forçar Jesus em cada versículo alegoricamente. Significa reconhecer que o Antigo Testamento prepara a chegada do Messias, e o Novo Testamento revela seu cumprimento e retorno. Ler a Bíblia sem esse eixo é ler cartas sem destinatário.",
            "Por isso, todo bom estudo bíblico termina fazendo uma pergunta cristológica: como este texto aponta para Cristo, e como Cristo cumpre este texto?",
          ],
          verses: [
            {
              ref: "Lucas 24:27",
              textByVersion: {
                NVI: "E, começando por Moisés e todos os profetas, explicou-lhes o que constava a respeito dele em todas as Escrituras.",
              },
            },
            {
              ref: "João 5:39",
              textByVersion: {
                NVI: "Vocês estudam cuidadosamente as Escrituras, porque pensam que nelas vocês têm a vida eterna. E são as Escrituras que testemunham a meu respeito.",
              },
            },
          ],
          keywords: [
            { word: "ἐρευνάω", translit: "ereunaō", meaning: "esquadrinhar, investigar minuciosamente", lang: "grego" },
            { word: "διερμηνεύω", translit: "diermēneuō", meaning: "explicar totalmente, interpretar completamente", lang: "grego" },
          ],
          deepDive:
            "Uma leitura da Bíblia sem Cristo produz duas doenças: moralismo (a Bíblia como manual de bom comportamento) e legalismo (a Bíblia como código de regras para conquistar Deus). A leitura cristocêntrica cura ambas: entendemos que a Lei aponta para nossa incapacidade e nos leva a Cristo, e que a Graça em Cristo nos dá poder para viver a vida que a Lei descrevia. Cada personagem, cada instituição, cada sombra do Antigo Testamento encontra sentido pleno em Jesus.",
          theologianQuote: {
            author: "C. S. Lewis",
            text: "Se você não ver Cristo no coração das Escrituras, você ainda não as entendeu. A Bíblia inteira é uma tapeçaria, e a figura ao centro tem sempre o rosto do Cordeiro.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "1 Coríntios 10:3-4",
                textByVersion: {
                  NVI: "Todos comeram do mesmo alimento espiritual e beberam da mesma bebida espiritual; pois todos bebiam da rocha espiritual que os acompanhava, e essa rocha era Cristo.",
                },
              },
              {
                ref: "Colossenses 2:16-17",
                textByVersion: {
                  NVI: "Portanto, não deixem que ninguém os julgue pelo que vocês comem ou bebem, ou com relação a alguma festividade religiosa... Essas coisas são sombra dos fatos vindouros; a realidade, porém, encontra-se em Cristo.",
                },
              },
            ],
            additionalKeywords: [
              { word: "τύπος", translit: "typos", meaning: "'tipo, molde, padrão'. Usado por Paulo para descrever eventos e figuras do Antigo Testamento que prefiguram, de forma histórica e real, algo maior que se cumpre em Cristo.", lang: "grego" },
              { word: "σκιά", translit: "skia", meaning: "'sombra'. Paulo usa essa imagem para descrever instituições do Antigo Testamento (festas, sacrifícios, sacerdócio): elas são sombra real de algo, mas a substância plena é Cristo.", lang: "grego" },
            ],
            historicalContext:
              "A leitura cristocêntrica do Antigo Testamento não é invenção moderna — começa com os próprios apóstolos, que constantemente citam o Antigo Testamento para mostrar seu cumprimento em Jesus. Ao longo da história da Igreja, esse impulso às vezes foi longe demais, encontrando 'Cristo escondido' em detalhes que o Novo Testamento nunca identifica dessa forma. A Reforma trouxe um equilíbrio importante: Lutero resumiu o princípio dizendo que devemos interpretar toda a Escritura 'was Christum treibet' — aquilo que revela e conduz a Cristo —, mas sempre ancorado no sentido histórico do texto, não em especulação livre.",
            exegeticalNotes:
              "A diferença entre tipologia legítima e alegoria arbitrária está em um teste simples: a tipologia tem uma base histórica real (a rocha no deserto realmente existiu; o sacrifício no templo realmente acontecia) e, na maior parte das vezes, é o próprio Novo Testamento que identifica a conexão com Cristo. A alegoria arbitrária, por outro lado, atribui significados simbólicos a detalhes do texto sem esse controle — por exemplo, tratando cada objeto de uma narrativa como um símbolo escondido, sem qualquer indicação do próprio texto bíblico de que essa era a intenção.",
            theologicalDebate:
              "Existe divergência legítima entre cristãos fiéis sobre até onde a tipologia deve ser estendida: alguns intérpretes preferem uma abordagem mais restrita, reconhecendo como 'tipo' apenas o que o próprio Novo Testamento identifica explicitamente; outros adotam uma abordagem um pouco mais ampla, buscando padrões cristológicos consistentes ao longo da narrativa bíblica mesmo sem citação direta do Novo Testamento. Ambas as abordagens honram a autoridade da Escritura; a diferença é de método interpretativo, uma questão secundária. Na dúvida diante de um texto difícil, é sempre sábio conversar com seu pastor ou líder de estudo.",
            secondQuote: {
              author: "Tim Keller",
              text: "Toda a Bíblia é, em última análise, sobre Jesus. Se você prega qualquer texto sem chegar a Cristo, pregou apenas moralismo — não o Evangelho.",
            },
          },
          quizzes: [
            {
              question: "Segundo Lucas 24:27, o que Jesus mostrou aos discípulos de Emaús?",
              options: [
                "Que o Antigo Testamento não era mais necessário",
                "Que toda a Escritura fala a respeito dele",
                "Que apenas os Salmos falam do Messias",
                "Que os profetas se contradiziam",
              ],
              correctIndex: 1,
            },
            {
              question: "Por que ler a Bíblia sem Cristo produz moralismo?",
              options: [
                "Porque a Bíblia só ensina regras",
                "Porque sem o evangelho a Bíblia vira manual de bom comportamento",
                "Porque a moral não importa para o cristão",
                "Porque Jesus revogou a moral",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Ao terminar cada leitura esta semana, pergunte-se: 'Como este texto aponta para Cristo?' Anote a resposta.",
          prayer:
            "Senhor Jesus, abre meus olhos como abriste os dos discípulos de Emaús. Que meu coração arda dentro de mim ao ver-te em cada página. Amém.",
          weeklyChallenge:
            "Leia Isaías 53 e escreva, versículo a versículo, como cada frase se cumpre em Cristo nos Evangelhos.",
          reflectionQuestion:
            "Quando leio a Bíblia, costumo procurar princípios para minha vida ou procurar o rosto de Cristo? O que muda quando invertemos essa prioridade?",
          xp: 25,
        },
        {
          id: "ceb-3-2",
          title: "Hebraico e Grego: Ferramentas, Não Atalhos",
          intro: [
            "Saber que uma palavra grega ou hebraica está por trás do seu texto em português pode iluminar muito — mas também pode virar um truque perigoso quando usado sem cuidado. Muita gente já ouviu um pregador dizer 'no grego original isso significa...' para justificar quase qualquer coisa. As línguas originais são uma ferramenta poderosa, não um atalho para provar o que já queríamos dizer.",
            "O bom uso das línguas originais sempre serve ao contexto — nunca o substitui. Uma palavra tem um leque de sentidos possíveis (campo semântico), e é a frase, o parágrafo e o propósito do autor que decidem qual sentido está em jogo ali, não o dicionário sozinho.",
            "Você não precisa saber hebraico ou grego para estudar a Bíblia com seriedade. Mas aprender a usar essas ferramentas com humildade evita tanto o extremo de ignorá-las quanto o de abusar delas.",
          ],
          verses: [
            {
              ref: "2 Timóteo 2:15",
              textByVersion: {
                NVI: "Procure apresentar-se a Deus aprovado, como obreiro que não tem do que se envergonhar e que maneja com precisão a palavra da verdade.",
              },
              originals: [
                { word: "ὀρθοτομοῦντα", translit: "orthotomounta", meaning: "cortando reto, manejando com precisão", lang: "grego" },
              ],
            },
            {
              ref: "Esdras 7:10",
              textByVersion: {
                NVI: "Pois Esdras tinha dedicado o coração ao estudo e à prática da Lei do Senhor, e ao ensino de seus decretos e ordenanças em Israel.",
              },
            },
          ],
          keywords: [
            { word: "אָהַב", translit: "ahav", meaning: "amar (verbo hebraico amplo, usado tanto para Deus quanto para coisas comuns)", lang: "hebraico" },
            { word: "ἀγαπάω / φιλέω", translit: "agapaō / phileō", meaning: "dois verbos gregos para 'amar', com campos de sentido que se sobrepõem parcialmente", lang: "grego" },
          ],
          deepDive:
            "Um exemplo clássico é João 21, onde Jesus pergunta a Pedro 'você me ama?' usando ora agapaō, ora phileō. Alguns pregadores constroem sermões inteiros sobre uma suposta diferença dramática entre os dois verbos ali. O estudo cuidadoso do vocabulário de João, porém, mostra que o evangelista costuma alternar sinônimos livremente em outras passagens sem intenção de contraste (como faz com 'ovelhas' e 'cordeiros' no mesmo capítulo). Isso não anula o valor de estudar palavras originais — anula apenas o abuso de tirar conclusões grandes de detalhes pequenos sem checar o uso do autor em outros lugares. A regra é: o significado de uma palavra é controlado pelo contexto em que ela aparece, não por todos os sentidos que ela poderia ter em outros lugares da Bíblia.",
          theologianQuote: {
            author: "D. A. Carson",
            text: "A maior parte dos abusos exegéticos nasce não da ignorância das línguas originais, mas do mau uso do pouco que se sabe delas. Humildade lexical é tão necessária quanto conhecimento lexical.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 12:6",
                textByVersion: {
                  NVI: "As palavras do Senhor são palavras imaculadas, como prata refinada numa fornalha de argila, purificada sete vezes.",
                },
              },
              {
                ref: "Provérbios 30:5-6",
                textByVersion: {
                  NVI: "Toda palavra de Deus é comprovadamente verdadeira... Não acrescente nada às suas palavras, do contrário ele o repreenderá e você será considerado mentiroso.",
                },
              },
            ],
            additionalKeywords: [
              { word: "צָרַף", translit: "tsaraph", meaning: "'refinar, purificar metais no fogo'. Imagem usada para descrever a pureza absoluta das palavras de Deus — cada palavra pesada, testada, sem escória.", lang: "hebraico" },
              { word: "ἑρμηνεύω", translit: "hermēneuō", meaning: "'traduzir, interpretar, dar sentido a'. Raiz da palavra 'hermenêutica' — a ciência e a arte de interpretar corretamente um texto.", lang: "grego" },
            ],
            historicalContext:
              "A Reforma Protestante teve como um de seus lemas o princípio 'ad fontes' — voltar às fontes originais. Erasmo de Roterdã publicou o primeiro Novo Testamento grego impresso em 1516, dando aos reformadores acesso direto ao texto grego, em vez de depender apenas da tradução latina (Vulgata). No Brasil e em Portugal, João Ferreira de Almeida, no século XVII, trabalhou diretamente com os textos originais para produzir a primeira tradução completa da Bíblia em português — um esforço que se repete hoje em ferramentas como interlineares, léxicos (BDAG para o grego, HALOT para o hebraico) e concordâncias, todas construídas para servir ao estudo sério, não substituí-lo.",
            exegeticalNotes:
              "A Concordância de Strong é uma ferramenta útil, mas limitada: ela apenas numera as palavras originais e dá um sentido básico, sem detalhar como o significado varia conforme o contexto. O erro clássico, apontado pelo linguista James Barr, é a 'transferência ilegítima de totalidade' — importar todos os possíveis sentidos que uma palavra pode ter em diferentes lugares da Bíblia para dentro de uma única ocorrência específica, como se toda palavra carregasse sempre seu leque completo de significados de uma vez. O bom uso de um léxico é perguntar: qual desses sentidos possíveis se encaixa neste contexto específico?",
            theologicalDebate:
              "Não há aqui uma questão doutrinária, mas sim metodológica: alguns professores de Bíblia preferem enfatizar fortemente o estudo de palavras originais em cada lição; outros preferem manter o foco quase todo no argumento e no contexto do texto em português, recorrendo às línguas originais apenas quando estritamente necessário. Ambas as ênfases são legítimas — o essencial é que o estudo de palavras nunca substitua a atenção ao contexto e à intenção do autor.",
            secondQuote: {
              author: "Craig Blomberg",
              text: "As ferramentas linguísticas devem servir à mensagem do texto, nunca dominá-la. Um estudo de palavra que ignora a frase ao redor já perdeu o rumo antes de começar.",
            },
          },
          quizzes: [
            {
              question: "Qual é o maior risco ao usar palavras gregas ou hebraicas em um estudo bíblico?",
              options: [
                "Que elas nunca ajudam a entender o texto",
                "Que sejam usadas fora do contexto para provar ideias que o autor não tinha em mente",
                "Que só teólogos possam usá-las",
                "Que substituam a necessidade de orar",
              ],
              correctIndex: 1,
            },
            {
              question: "O que decide qual sentido de uma palavra está em jogo em um versículo específico?",
              options: [
                "O dicionário sozinho, sem outras considerações",
                "A opinião do leitor",
                "O contexto da frase, do parágrafo e do propósito do autor",
                "A tradição da igreja local",
              ],
              correctIndex: 2,
            },
          ],
          application:
            "Escolha uma palavra-chave de um versículo que você ama. Usando uma Bíblia de estudo ou um recurso confiável, veja o sentido original — mas confirme sua conclusão observando como a mesma palavra aparece em outras passagens do mesmo autor.",
          prayer:
            "Senhor, dá-me fome de conhecer tua Palavra a fundo, e ao mesmo tempo humildade para não usar meu conhecimento como arma para provar o que eu já queria dizer. Que eu maneje bem a palavra da verdade. Amém.",
          weeklyChallenge:
            "Pesquise o sentido original de uma palavra bíblica comum (como 'graça', 'paz' ou 'justiça') e escreva um parágrafo resumindo o que aprendeu, citando pelo menos duas passagens onde a palavra aparece.",
          reflectionQuestion:
            "Já ouvi ou repeti uma explicação de 'palavra original' sem checar se ela realmente se sustentava no contexto? Como posso ser mais criterioso daqui em diante?",
          xp: 25,
        },
      ],
    },
    {
      id: "ceb-mod-4",
      title: "Módulo IV: Da Interpretação à Vida",
      lessons: [
        {
          id: "ceb-4-1",
          title: "Do Texto à Aplicação: Evitando os Erros Comuns",
          intro: [
            "Depois de entender o que o texto significou para o público original, resta a pergunta mais prática: o que ele significa para mim, hoje? Essa travessia — da Antiguidade para a sua sala — é onde a maioria dos erros de interpretação acontece.",
            "O primeiro erro é o presentismo: começar pela minha vida ('o que este texto tem a ver comigo?') em vez de começar pelo texto ('o que este texto realmente diz?'). O segundo é o proof-texting: usar um versículo isolado, fora do argumento do autor, para apoiar uma ideia que já tínhamos. O terceiro é confundir descrição com prescrição: achar que tudo que a Bíblia narra ela está recomendando.",
            "A boa aplicação nasce de uma ponte bem construída: primeiro descobrir o princípio atemporal por trás do mandamento específico, e só então perguntar como esse princípio se encarna na minha cultura, no meu tempo e na minha situação.",
          ],
          verses: [
            {
              ref: "Tiago 1:22",
              textByVersion: {
                NVI: "Não se limitem a ouvir a palavra, iludindo a vocês mesmos. Pratiquem o que ela diz.",
              },
              originals: [
                { word: "ποιητής", translit: "poiētēs", meaning: "praticante, fazedor, aquele que efetivamente realiza", lang: "grego" },
              ],
            },
            {
              ref: "Salmos 19:7-8",
              textByVersion: {
                NVI: "A lei do Senhor é perfeita e revigora a alma. Os testemunhos do Senhor são dignos de confiança, tornam sábios os inexperientes. Os preceitos do Senhor são justos e dão alegria ao coração.",
              },
            },
          ],
          keywords: [
            { word: "ποιέω", translit: "poieō", meaning: "fazer, praticar, realizar de fato", lang: "grego" },
            { word: "תּוֹרָה", translit: "torah", meaning: "instrução, ensino, lei — mais amplo que 'regra'", lang: "hebraico" },
          ],
          deepDive:
            "Pense na aplicação como uma ponte com duas margens. De um lado está o mundo antigo do texto (com sua cultura, língua e costumes); do outro, o seu mundo hoje. A ponte só é segura quando primeiro identificamos o princípio teológico que atravessa as duas margens — algo que não muda com a cultura — e só depois formulamos como obedecer esse princípio no seu contexto específico. Um mandamento cultural (como o ósculo santo, ou o uso de véu em Corinto) carrega um princípio permanente (saudação afetuosa e pura entre irmãos; ordem e respeito no culto) que pode se expressar de formas diferentes hoje. Ignorar essa distinção produz tanto legalismo cultural quanto relativismo doutrinário.",
          theologianQuote: {
            author: "John Stott",
            text: "A tarefa do intérprete fiel é uma escuta dupla: ouvir com atenção a Palavra antiga, e ouvir com atenção o mundo presente, para então construir a ponte entre os dois sem trair nenhum dos lados.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "1 Coríntios 9:22-23",
                textByVersion: {
                  NVI: "Tornei-me tudo para todos os homens, para que de alguma forma eu possa salvar alguns. Faço tudo isso por causa do evangelho, para ser copartícipe dele.",
                },
              },
              {
                ref: "Atos 15:28-29",
                textByVersion: {
                  NVI: "Pareceu bem ao Espírito Santo e a nós não impor a vocês maiores encargos além destes requisitos essenciais: abster-se de comida sacrificada aos ídolos, do sangue, da carne de animais estrangulados e da imoralidade sexual.",
                },
              },
            ],
            additionalKeywords: [
              { word: "ἀδιάφορα", translit: "adiaphora", meaning: "'coisas indiferentes'. Termo usado historicamente pela teologia cristã para questões que a Escritura não regula de forma explícita e detalhada, deixadas à sabedoria e à liberdade de consciência do crente.", lang: "grego" },
              { word: "παράδοσις", translit: "paradosis", meaning: "'tradição, ensino transmitido'. Pode ser positiva (o ensino apostólico fielmente repassado) ou negativa (tradição humana que se sobrepõe à Palavra) — o contexto sempre decide qual sentido está em jogo.", lang: "grego" },
            ],
            historicalContext:
              "O Concílio de Jerusalém (Atos 15) é o modelo bíblico mais claro de como a igreja primitiva distinguiu entre o que era essencial ao Evangelho (a salvação pela graça, mediante a fé, sem exigir circuncisão ou observância completa da Lei mosaica dos gentios convertidos) e o que era prudência pastoral temporária para não escandalizar comunidades judaicas locais. Esse mesmo princípio de discernimento — entre o núcleo do Evangelho e a aplicação sábia em cada cultura — orientou a igreja em cada geração, da patrística até os movimentos missionários modernos que buscaram contextualizar o Evangelho sem distorcê-lo.",
            exegeticalNotes:
              "Um sinal útil para identificar se um mandamento é transcultural (vale sempre e em qualquer lugar) é observar se o texto o ancora na ordem da criação ou no caráter de Deus (algo que não muda com a cultura). Já mandamentos ancorados explicitamente em costumes locais, em símbolos de honra e vergonha de uma cultura específica, ou em situações históricas pontuais tendem a carregar um princípio permanente que pode se expressar de formas diferentes hoje. Esse discernimento exige cuidado e, muitas vezes, humildade diante de textos difíceis.",
            theologicalDebate:
              "Esta é uma área onde existe divergência legítima e histórica entre cristãos evangélicos fiéis — por exemplo, em debates sobre o uso de véu (1 Coríntios 11), os papéis de homens e mulheres na igreja e no lar, ou práticas específicas de adoração. Cristãos comprometidos com a mesma autoridade da Escritura chegam a conclusões diferentes sobre onde termina o princípio permanente e onde começa a expressão cultural. Este material não pretende resolver essas divergências, mas apresentar o processo interpretativo com honestidade; para essas questões específicas, busque orientação da liderança da sua igreja local.",
            secondQuote: {
              author: "Kevin Vanhoozer",
              text: "Interpretar bem a Escritura é um ato de discipulado, não apenas de análise: exige que sejamos formados pelo texto enquanto tentamos compreendê-lo.",
            },
          },
          quizzes: [
            {
              question: "O que é 'proof-texting'?",
              options: [
                "Um método científico de datação de manuscritos",
                "Usar um versículo isolado, fora do argumento do autor, para provar uma ideia pré-concebida",
                "Comparar diferentes traduções da Bíblia",
                "Estudar o contexto histórico de um texto",
              ],
              correctIndex: 1,
            },
            {
              question: "Qual é o passo intermediário essencial entre o significado original de um texto e sua aplicação hoje?",
              options: [
                "Pular direto para a aplicação pessoal",
                "Identificar o princípio teológico atemporal por trás do mandamento",
                "Perguntar o que a maioria das pessoas acha do texto",
                "Ignorar o contexto cultural original",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Escolha um mandamento do Novo Testamento com forte marca cultural (ex.: 1 Coríntios 16:20, 'saudai-vos com ósculo santo'). Escreva o princípio atemporal por trás dele e como ele pode ser vivido hoje, na sua igreja.",
          prayer:
            "Senhor, guarda-me de usar tua Palavra apenas para confirmar o que eu já pensava. Ensina-me a construir pontes fiéis entre o que o texto disse e o que ele exige de mim hoje. Amém.",
          weeklyChallenge:
            "Escolha três mandamentos bíblicos diferentes e classifique cada um como transcultural (vale igual em qualquer época) ou culturalmente expresso (o princípio permanece, a forma muda). Justifique cada escolha em uma frase.",
          reflectionQuestion:
            "Existe algum ensino bíblico que eu simplesmente ignoro por parecer 'antigo demais'? Já parei para separar o princípio permanente da forma cultural nele?",
          xp: 30,
        },
        {
          id: "ceb-4-2",
          title: "Interpretando Parábolas e Símbolos",
          intro: [
            "Jesus contou dezenas de parábolas, e a igreja gastou séculos aprendendo a lidar bem com elas. O erro histórico mais comum é a alegorização selvagem: transformar cada detalhe da história em um símbolo separado, mesmo quando o próprio texto não sugere isso. O resultado costuma ser criativo, mas infiel ao que Jesus realmente quis ensinar.",
            "A regra de ouro é simples: toda parábola tem, em geral, um ponto central — não um código secreto cheio de significados escondidos em cada detalhe. Na parábola do Bom Samaritano, o ponto é 'quem é o meu próximo, e como devo amá-lo', não uma alegoria em que cada elemento (o óleo, o vinho, a estalagem) representa um mistério teológico separado.",
            "O mesmo cuidado vale para a linguagem simbólica da profecia e da literatura apocalíptica (como partes de Daniel e Apocalipse): os símbolos ali quase sempre têm raízes no próprio Antigo Testamento, e o texto costuma dar pistas de sua própria interpretação — a tarefa do intérprete é seguir essas pistas, não inventar novas.",
          ],
          verses: [
            {
              ref: "Marcos 4:11-12",
              textByVersion: {
                NVI: "A vocês foi confiado o mistério do Reino de Deus; mas aos que estão de fora tudo é dito por parábolas, para que 'ainda que vejam, não percebam; e ainda que ouçam, não entendam; para que não se convertam e sejam perdoados'.",
              },
            },
            {
              ref: "Lucas 10:36-37",
              textByVersion: {
                NVI: "'Qual desses três parece a você ter sido o próximo do homem que caiu nas mãos dos assaltantes?' O perito na lei respondeu: 'Aquele que teve misericórdia dele.' Jesus disse: 'Vá e faça o mesmo.'",
              },
            },
          ],
          keywords: [
            { word: "רָז", translit: "raz", meaning: "mistério, segredo revelado apenas a quem Deus escolhe (usado em Daniel)", lang: "hebraico" },
            { word: "μυστήριον", translit: "mystērion", meaning: "mistério, verdade antes oculta agora revelada", lang: "grego" },
          ],
          deepDive:
            "Historicamente, alguns intérpretes da igreja antiga levaram a alegorização a extremos, encontrando significados ocultos em quase cada palavra do texto — uma prática bem-intencionada, mas que abriu espaço para interpretações desconectadas do que o autor original quis comunicar. A correção saudável, redescoberta com força a partir da Reforma, foi voltar a perguntar: qual é o ponto que esta parábola, no seu contexto original de pregação, estava fazendo? Da mesma forma, os símbolos apocalípticos (bestas, chifres, números) quase sempre ecoam imagens já usadas em Daniel, Ezequiel ou Isaías — a Bíblia costuma interpretar a si mesma, e esse é o primeiro lugar onde buscar resposta antes de recorrer à especulação.",
          theologianQuote: {
            author: "G. K. Beale",
            text: "Os símbolos do Apocalipse não nasceram do nada: são um mosaico tecido com as imagens do Antigo Testamento. Quem conhece bem Daniel e Ezequiel já tem metade das chaves para entender o Apocalipse.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Mateus 13:34-35",
                textByVersion: {
                  NVI: "Jesus falou tudo isso à multidão por parábolas; sem usar parábolas nada lhes dizia. Assim se cumpriu o que fora dito pelo profeta: 'Abrirei a minha boca em parábolas, contarei coisas escondidas desde a criação do mundo.'",
                },
              },
              {
                ref: "Daniel 2:44-45",
                textByVersion: {
                  NVI: "Nos dias daqueles reis, o Deus dos céus estabelecerá um reino que jamais será destruído... Foi assim que o rei viu uma pedra sendo cortada de um monte, sem auxílio de mãos.",
                },
              },
            ],
            additionalKeywords: [
              { word: "אוֹת", translit: "ot", meaning: "'sinal, marca, símbolo profético'. Usado no Antigo Testamento para eventos ou objetos que carregam significado além do literal, apontando para uma verdade maior que Deus quer comunicar.", lang: "hebraico" },
              { word: "σημεῖον", translit: "sēmeion", meaning: "'sinal'. Termo usado tanto para os milagres de Jesus quanto para imagens simbólicas proféticas — sempre algo que aponta para além de si mesmo.", lang: "grego" },
            ],
            historicalContext:
              "Orígenes, um dos primeiros grandes eruditos cristãos (século III), é conhecido por levar a interpretação alegórica a extremos, encontrando significados espirituais ocultos em quase cada detalhe do texto bíblico — um esforço bem-intencionado de honrar a Escritura, mas que muitas vezes se afastava do que o autor original quis comunicar. Ao longo da história da Igreja, teólogos mais atentos ao sentido histórico-gramatical, e mais tarde os Reformadores, corrigiram esse excesso, sem descartar o valor legítimo da tipologia e do simbolismo bíblico quando ancorados no próprio texto.",
            exegeticalNotes:
              "Uma chave prática para interpretar parábolas é sempre perguntar: para quem Jesus estava contando esta história, e o que os provocou a contá-la? Em Lucas 15, por exemplo, o contexto imediato (fariseus reclamando que Jesus recebe pecadores) é a chave para entender as três parábolas seguintes — da ovelha perdida, da moeda perdida e do filho pródigo. O ponto central das três é o mesmo: a alegria do Pai ao receber de volta quem estava perdido, e o convite implícito aos fariseus para compartilharem dessa alegria em vez de reclamarem dela.",
            theologicalDebate:
              "A interpretação de símbolos apocalípticos frequentemente se conecta a diferentes visões escatológicas sobre o milênio e a volta de Cristo (pré-milenismo, amilenismo, pós-milenismo). Essas posições são sustentadas por cristãos evangélicos fiéis e comprometidos com a autoridade da Escritura, e constituem uma questão secundária — importante para o estudo profético, mas não essencial para a salvação ou para a comunhão entre irmãos. Vale a pena estudar essas visões com calma, preferencialmente ao lado de um pastor ou líder que possa apresentar os textos e os argumentos de cada posição.",
            secondQuote: {
              author: "Grant Osborne",
              text: "Uma parábola normalmente tem um ponto central que a história inteira serve para comunicar; os detalhes ao redor são cenário, não um código separado à espera de decifração.",
            },
          },
          quizzes: [
            {
              question: "Qual é o principal cuidado ao interpretar uma parábola de Jesus?",
              options: [
                "Buscar um significado espiritual escondido em cada detalhe da história",
                "Identificar o ponto central que a parábola comunica no seu contexto",
                "Ignorar o contexto e aplicar a parábola livremente",
                "Comparar a parábola com mitos de outras religiões",
              ],
              correctIndex: 1,
            },
            {
              question: "De onde geralmente vêm os símbolos usados na literatura apocalíptica bíblica?",
              options: [
                "São inventados livremente por cada autor sem relação com outros textos",
                "Da cultura grega antiga",
                "De imagens já usadas em outras partes do Antigo Testamento",
                "De sonhos que não têm relação com o texto bíblico",
              ],
              correctIndex: 2,
            },
          ],
          application:
            "Leia a parábola do Filho Pródigo (Lucas 15:11-32) e escreva, em uma frase, qual é o ponto central da história — sem tentar transformar cada personagem em um símbolo separado.",
          prayer:
            "Senhor, ensina-me a ouvir tuas parábolas com simplicidade, buscando o coração da mensagem antes de me perder em detalhes. Que eu compreenda teus mistérios com humildade, não com especulação. Amém.",
          weeklyChallenge:
            "Escolha uma imagem simbólica do Apocalipse (ex.: o cordeiro, a besta, as sete estrelas) e pesquise onde essa mesma imagem já aparece no Antigo Testamento. Anote a conexão que encontrar.",
          reflectionQuestion:
            "Já tentei extrair um significado escondido de cada detalhe de uma história bíblica? O que muda quando busco primeiro o ponto central que o autor quis comunicar?",
          xp: 30,
        },
        {
          id: "ceb-4-3",
          title: "Montando um Plano de Estudo Bíblico Pessoal",
          intro: [
            "Conhecer o método não basta; é preciso transformá-lo em hábito. A vida espiritual sadia nasce menos de picos de intensidade e mais de uma rotina simples, sustentável e constante — como a árvore do Salmo 1, plantada junto a ribeiros de águas, que dá fruto no seu tempo porque está enraizada, não porque corre atrás de resultados rápidos.",
            "Um bom plano pessoal de estudo bíblico tem poucos elementos: um horário fixo (mesmo que pequeno), uma Bíblia de leitura confortável, um caderno para anotar observações, e um ritmo de leitura (por livro, por tema ou cronológico). O que importa não é a intensidade de uma semana, mas a fidelidade de um ano.",
            "E há um elemento final, essencial e muitas vezes esquecido: nenhum estudo bíblico pessoal deve permanecer isolado. Leve suas dúvidas, descobertas e interpretações difíceis para conversar com seu pastor, líder ou grupo pequeno na igreja local — é ali que Deus colocou proteção, correção e comunhão para o seu crescimento.",
          ],
          verses: [
            {
              ref: "Salmos 1:2-3",
              textByVersion: {
                NVI: "Nele, porém, está o seu prazer, na lei do Senhor, e nessa lei medita de dia e de noite. É como árvore plantada à beira de águas correntes que dá fruto no tempo certo, e as suas folhas não murcham. Tudo o que ele faz prospera.",
              },
            },
            {
              ref: "Provérbios 11:14",
              textByVersion: {
                NVI: "Sem uma direção acertada a nação cai; a vitória depende dos muitos conselheiros.",
              },
            },
          ],
          keywords: [
            { word: "שִׂיחַ", translit: "siach", meaning: "meditar, ponderar profundamente, ruminar um assunto", lang: "hebraico" },
            { word: "μελετάω", translit: "meletaō", meaning: "meditar, praticar com cuidado e constância (1 Tm 4:15)", lang: "grego" },
          ],
          deepDive:
            "A palavra hebraica por trás de 'meditar' no Salmo 1 evoca a imagem de um animal ruminando o alimento — mastigando devagar, repetidas vezes, até extrair todo o proveito. Esse é o retrato de um estudo bíblico saudável: não é consumo rápido de informação, é rumina lenta da verdade até que ela alimente a alma inteira. Ao mesmo tempo, a sabedoria bíblica nunca elogia o estudo solitário e desconectado da comunidade: 'a vitória depende dos muitos conselheiros'. Um plano de estudo pessoal maduro sempre deságua de volta na igreja local — nas perguntas feitas ao pastor, nas trocas no pequeno grupo, na correção fraterna que impede que uma leitura equivocada vire convicção isolada e perigosa.",
          theologianQuote: {
            author: "Richard Foster",
            text: "A disciplina espiritual não é sobre intensidade ocasional, mas sobre constância silenciosa. Um pouco de estudo bíblico fiel, repetido por anos, forma mais o caráter do que uma maratona de leitura feita uma única vez.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Deuteronômio 6:6-7",
                textByVersion: {
                  NVI: "Estas palavras que hoje ordeno a vocês estarão em seu coração. Vocês as ensinarão com persistência a seus filhos, e delas falarão quando estiverem sentados em casa, quando andarem pelo caminho, quando se deitarem e quando se levantarem.",
                },
              },
              {
                ref: "2 Timóteo 2:2",
                textByVersion: {
                  NVI: "E o que você ouviu de mim na presença de muitas testemunhas, confie a homens fiéis que sejam capazes de ensinar a outros.",
                },
              },
            ],
            additionalKeywords: [
              { word: "שָׁנַן", translit: "shanan", meaning: "'ensinar diligentemente, repetir e incutir com afinco'. A imagem por trás da palavra é a de afiar uma lâmina — o ensino repetido da Palavra 'afia' o coração e a mente para a obediência.", lang: "hebraico" },
              { word: "παρατίθημι", translit: "paratithēmi", meaning: "'confiar, entregar algo a alguém para que guarde e repasse'. Usada por Paulo para descrever a cadeia de discipulado: o que ele recebeu, ensinou a Timóteo, que deveria ensinar a outros fiéis.", lang: "grego" },
            ],
            historicalContext:
              "A prática de dedicar tempo estruturado e regular às Escrituras tem raízes antigas na igreja: monges e comunidades cristãs desde os primeiros séculos desenvolveram ritmos como a 'lectio divina' (leitura devota), que envolvia ler, meditar, orar e responder ao texto de forma pausada. A tradição evangélica, especialmente após a Reforma, manteve essa ênfase na leitura estruturada e constante, mas com um cuidado importante: rejeitando qualquer prática que buscasse experiências místicas separadas do sentido claro do texto, mantendo sempre a Palavra escrita como âncora e critério de toda experiência espiritual.",
            exegeticalNotes:
              "Existem diferentes formas legítimas de organizar um plano de leitura: cronológico (seguindo a ordem dos eventos históricos), canônico (seguindo a ordem dos livros na Bíblia), temático (estudando um assunto por vez) ou por livro completo (aprofundando um único livro de cada vez, como esta trilha ensina a fazer). Nenhuma dessas formas é 'mais espiritual' que a outra — a escolha deve considerar a fase de maturidade do leitor e o objetivo do estudo naquele momento.",
            theologicalDebate:
              "Não há aqui uma questão doutrinária, mas de sabedoria prática: métodos específicos de 'tempo devocional' (horário, formato de anotações, uso de aplicativos ou cadernos) são convenções úteis desenvolvidas pela tradição evangélica, não mandamentos bíblicos explícitos. O que a Escritura de fato exige é constância, atenção e disposição para obedecer — a forma exata de organizar isso é uma questão de opinião teológica prática, que cada crente pode ajustar à sua própria realidade e fase de vida.",
            secondQuote: {
              author: "John Mark Comer",
              text: "Um ritmo de vida com Deus não nasce de motivação passageira, mas de práticas simples repetidas com fidelidade, até que se tornem o solo onde a alma cresce.",
            },
          },
          quizzes: [
            {
              question: "Segundo o Salmo 1, o que caracteriza a pessoa 'bem-aventurada'?",
              options: [
                "Ler a Bíblia inteira em um único mês",
                "Meditar constantemente na lei do Senhor, como uma árvore enraizada",
                "Evitar qualquer contato com pessoas ímpias",
                "Memorizar todos os livros da Bíblia de cor",
              ],
              correctIndex: 1,
            },
            {
              question: "Por que o estudo bíblico pessoal não deve ficar isolado da igreja local?",
              options: [
                "Porque a Bíblia proíbe o estudo individual",
                "Porque a comunidade oferece correção, conselho e proteção contra interpretações equivocadas",
                "Porque só pastores podem interpretar a Bíblia corretamente",
                "Porque estudar sozinho é sempre pecado",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Defina, ainda hoje, um horário fixo e realista para seu estudo bíblico (mesmo que sejam apenas 10 minutos) e escolha um livro da Bíblia para começar a ler nas próximas semanas.",
          prayer:
            "Senhor, ajuda-me a construir um hábito simples e constante de estar na tua Palavra. Guarda-me da preguiça e também do orgulho de estudar sozinho, sem correção. Coloca ao meu lado pessoas fiéis que me ajudem a crescer. Amém.",
          weeklyChallenge:
            "Escreva um plano pessoal de leitura bíblica para os próximos 30 dias (livro, tempo diário e um espaço para anotações) e compartilhe esse plano com seu pastor, líder de célula ou discipulador, pedindo que ele te acompanhe.",
          reflectionQuestion:
            "Meu estudo bíblico até hoje tem sido constante ou apenas ocasional? Tenho compartilhado o que aprendo com alguém que possa me ajudar a crescer e me corrigir quando necessário?",
          xp: 30,
        },
      ],
    },
  ],
};


const oracao: Trail = {
  id: "oracao",
  title: "Oração",
  description: "Aprofunde sua vida de oração pessoal.",
  icon: "Flame",
  color: "from-orange-500 to-rose-500",
  order: 4,
  modules: [
    {
      id: "or-mod-1",
      title: "Módulo I: Fundamentos da Oração",
      lessons: [
        {
          id: "or-teo-1",
          title: "O que Realmente Acontece Quando Oramos?",
          intro: [
            "Antes de aprender técnicas ou fórmulas de oração, é preciso entender o que, teologicamente, está acontecendo quando um cristão ora. Muita gente ora anos a fio sem nunca ter parado para pensar nisso — e acaba tratando a oração como um telefone mágico para pedidos, ou como um ritual de bom comportamento religioso.",
            "A Bíblia descreve a oração como algo muito mais profundo: um ato de aliança. Quando você ora, você não está apenas 'mandando uma mensagem' para um Deus distante — você está exercendo um privilégio que só existe porque Cristo abriu caminho entre você e o Pai. Oração pressupõe relacionamento, não transação.",
            "Teologicamente, a oração envolve as três Pessoas da Trindade ao mesmo tempo: oramos ao Pai, por meio do Filho, no poder do Espírito. Isso não é jargão religioso — é a estrutura real de toda oração cristã genuína, mesmo quando o orante não tem plena consciência disso.",
            "Entender essa base muda tudo na prática: você deixa de orar como quem implora a um estranho, e começa a orar como filho que fala com o Pai, sabendo que o Filho intercede e o Espírito o ajuda a orar.",
          ],
          verses: [
            {
              ref: "Efésios 2:18",
              textByVersion: {
                NVI: "Pois por meio dele [Cristo] tanto nós como vocês temos acesso ao Pai, por um só Espírito.",
                NAA: "Porque é por meio dele que nós, tanto quanto vocês, temos acesso ao Pai, em um só Espírito.",
                ACF: "Porque por ele ambos temos acesso ao Pai em um mesmo Espírito.",
                KJV: "Porque por ele ambos temos acesso ao Pai em um mesmo Espírito.",
                NVT: "Agora, por meio de Cristo, todos nós, judeus e gentios, podemos ser recebidos na presença de Deus Pai, por meio do mesmo Espírito Santo.",
              },
              originals: [
                { word: "προσαγωγή", translit: "prosagōgē", meaning: "acesso, introdução formal à presença de alguém importante", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:34",
              textByVersion: {
                NVI: "Quem os condenará? Cristo Jesus, que morreu e, mais do que isso, ressuscitou, está à direita de Deus e também intercede por nós.",
                NAA: "Quem os condenará? Cristo Jesus é quem morreu, ou antes, quem ressuscitou, o qual está à direita de Deus e também intercede por nós.",
                ACF: "Quem é que condenará? Christo é o que morreu, ou antes, o que também resuscitou, o que está à direita de Deus, o que também intercede por nós.",
                KJV: "Quem é o que condenará? Cristo é quem morreu, e, mais do que isso, quem também ressuscitou dentre os mortos, o qual está à mão direita de Deus, e também intercede por nós.",
                NVT: "Quem, então, poderá nos condenar? Não Cristo Jesus, pois ele morreu por nós e ressuscitou por nós e está sentado no lugar de honra, junto a Deus, intercedendo por nós.",
              },
            },
          ],
          keywords: [
            { word: "προσαγωγή", translit: "prosagōgē", meaning: "'acesso, introdução'. Termo usado para descrever alguém sendo formalmente apresentado à corte de um rei. Cristo é quem nos apresenta ao Pai.", lang: "grego" },
            { word: "ἐντυγχάνω", translit: "entynchanō", meaning: "'interceder, intervir em favor de'. É o que Cristo faz agora mesmo, à direita do Pai, enquanto você ora.", lang: "grego" },
            { word: "Ἀββά", translit: "Abbá", meaning: "'Papai' — palavra aramaica de intimidade familiar que Paulo diz que o Espírito coloca em nossa boca (Rm 8:15).", lang: "grego" },
          ],
          deepDive:
            "O que a Bíblia ensina: a oração cristã tem uma arquitetura trinitária. Oramos ao Pai (é a Ele que nos dirigimos), por meio do Filho (é Ele quem nos dá 'prosagōgē' — acesso formal, como alguém apresentado à corte de um rei), e no poder do Espírito (é Ele quem nos ajuda a orar e coloca em nossa boca o grito de 'Abbá', Papai). Contexto e exegese: Paulo escreve Efésios 2:18 para judeus e gentios reunidos numa só família — o acesso ao Pai não depende de mérito étnico ou religioso, mas da obra de Cristo. Em Romanos 8:34, o apóstolo descreve Cristo ressuscitado, vivo, intercedendo agora. Aplicação: isso significa que, mesmo numa oração simples e desajeitada, um cristão genuíno participa de algo estruturado pela própria Trindade — o Filho intercede no céu enquanto o Espírito intercede em você (Rm 8:26). Erro comum: tratar a oração como técnica de persuasão ou fórmula mágica, esquecendo que ela nasce de um relacionamento de aliança, não de uma transação.",
          theologianQuote: {
            author: "John Stott",
            text: "A oração cristã não é um monólogo religioso; é uma conversa trinitária na qual somos convidados a participar — falamos ao Pai, pelo Filho, no Espírito.",
          },
          quizzes: [
            {
              question: "Segundo Efésios 2:18, quem nos dá acesso ao Pai?",
              options: [
                "Nosso próprio esforço espiritual",
                "Cristo, por um só Espírito",
                "Apenas os sacerdotes ordenados",
                "Boas obras acumuladas",
              ],
              correctIndex: 1,
              explanation: "'Prosagōgē' descreve a introdução formal que Cristo nos concede à presença do Pai, pelo Espírito.",
            },
            {
              question: "O que Romanos 8:34 revela sobre o que Cristo faz agora?",
              options: [
                "Ele já concluiu toda sua obra e está inativo",
                "Ele intercede por nós à direita do Pai",
                "Ele julga os que oram errado",
                "Ele apenas observa as orações de longe",
              ],
              correctIndex: 1,
              explanation: "Cristo ressuscitado continua ativamente intercedendo por você — a oração cristã tem mediação constante.",
            },
            {
              question: "Qual a estrutura trinitária da oração cristã descrita na lição?",
              options: [
                "Oramos apenas ao Espírito Santo",
                "Oramos ao Pai, pelo Filho, no poder do Espírito",
                "Oramos igualmente às três Pessoas sem distinção de papel",
                "A Trindade não tem relação com a oração",
              ],
              correctIndex: 1,
              explanation: "Cada Pessoa da Trindade tem um papel: o Pai é o destinatário, o Filho é o mediador, o Espírito é o auxiliador.",
            },
          ],
          application:
            "Na próxima vez que for orar, faça conscientemente as três etapas: dirija-se ao Pai nomeando-o assim; agradeça a Cristo por lhe dar acesso; peça ao Espírito que o ajude a orar bem. Perceba como isso muda a textura da sua oração.",
          prayer:
            "Pai, obrigado por me receberes não como estranho, mas como filho. Obrigado, Jesus, por teres aberto o caminho até o Pai e por intercederes por mim agora mesmo, à direita dele. Espírito Santo, ajuda-me a orar quando não sei as palavras, e coloca em minha boca o grito de 'Abbá, Pai'. Que eu nunca mais ore como quem fala sozinho, mas como quem participa da comunhão eterna da Trindade. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Durante 7 dias, antes de cada oração, diga em voz alta: 'Pai, venho a ti pelo Filho, no poder do Espírito.' Observe, ao final da semana, se isso mudou sua percepção sobre o que acontece quando você ora.",
          reflectionQuestion:
            "Como muda a sua confiança ao orar, sabendo que Cristo está, neste exato momento, intercedendo por você diante do Pai?",
          xp: 20,
        },
        {
          id: "or-1-1",
          title: "A Oração Ensinada por Jesus",
          intro: [
            "Os discípulos passaram três anos com Jesus. Viram-no acalmar tempestades, ressuscitar mortos, andar sobre as águas. Nenhuma dessas cenas produziu neles o pedido que Lucas 11:1 registra: 'Senhor, ensina-nos a orar'. Foi a vida de oração de Jesus — e não seus milagres — que fez os discípulos perceber que oravam de forma primária, quase infantil, comparada a Ele.",
            "A oração do Pai Nosso não é uma fórmula para repetir; é um mapa para orar. Ela nos ensina por onde começar (adoração), o que priorizar (o Reino de Deus antes das nossas necessidades), o que pedir (pão, perdão, livramento) e em quem confiar (o Pai que está nos céus).",
            "Aprender a orar é aprender a estar com Deus como filho, não como pedinte.",
          ],
          verses: [
            {
              ref: "Mateus 6:9-13",
              textByVersion: {
                NVI: "Vocês, orem assim: Pai nosso, que estás nos céus! Santificado seja o teu nome. Venha o teu Reino; seja feita a tua vontade, assim na terra como no céu. Dá-nos hoje o nosso pão de cada dia. Perdoa as nossas dívidas, assim como perdoamos aos nossos devedores. E não nos deixes cair em tentação, mas livra-nos do mal, porque teu é o Reino, o poder e a glória para sempre. Amém.",
              },
            },
            {
              ref: "Lucas 11:1",
              textByVersion: {
                NVI: "Certo dia Jesus estava orando em determinado lugar. Tendo terminado, um dos seus discípulos lhe disse: 'Senhor, ensina-nos a orar, como também João ensinou aos seus discípulos'.",
              },
              originals: [
                { word: "προσεύχεσθε", translit: "proseuchesthe", meaning: "orem (imperativo plural)", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "προσεύχομαι", translit: "proseuchomai", meaning: "orar, dirigir-se a Deus", lang: "grego" },
            { word: "πάτερ", translit: "pater", meaning: "Pai — endereçamento familiar e íntimo", lang: "grego" },
          ],
          deepDive:
            "Chamar Deus de 'Pai' era revolucionário. No judaísmo, o Nome era tão sagrado que nem se pronunciava; Jesus ensina os discípulos a começarem cada oração no colo de Deus. Ao mesmo tempo, 'Pai nosso' — não 'meu' — coloca o orante dentro de uma família. Não há oração cristã puramente individualista. E 'santificado seja o teu nome' precede 'dá-nos o pão': primeiro Deus, depois nós. Essa ordem inverte a maioria das nossas orações.",
          theologianQuote: {
            author: "John Wesley",
            text: "Deus não faz nada senão em resposta à oração. É por isso que Ele nos ensinou a orar antes de nos ensinar qualquer outra coisa a respeito da vida cristã.",
          },
          quizzes: [
            {
              question: "O que fez os discípulos pedirem 'ensina-nos a orar'?",
              options: [
                "Os milagres de Jesus",
                "A vida de oração do próprio Jesus",
                "A pregação do Sermão do Monte",
                "A crítica dos fariseus",
              ],
              correctIndex: 1,
            },
            {
              question: "Qual é a primeira ênfase do Pai Nosso?",
              options: [
                "Nossas necessidades diárias",
                "Perdão dos nossos pecados",
                "A santidade do nome de Deus e a vinda de seu Reino",
                "A libertação da tentação",
              ],
              correctIndex: 2,
            },
          ],
          application:
            "Reserve 10 minutos por dia esta semana para orar o Pai Nosso lentamente, expandindo cada frase com suas próprias palavras.",
          prayer:
            "Pai nosso que estás nos céus, ensina-me a orar como Jesus me ensinou. Que meu coração aprenda a começar por ti, antes de começar por mim. Amém.",
          weeklyChallenge:
            "Todo dia, antes de qualquer outro pedido, adore a Deus por uma característica dele (santidade, fidelidade, misericórdia, poder, bondade). Anote no diário.",
          reflectionQuestion:
            "Minhas orações começam por Deus ou por mim? O que essa ordem revela sobre meu coração?",
          xp: 20,
        },
        {
          id: "or-1-2",
          title: "Ousadia Diante do Trono da Graça",
          intro: [
            "Um dos maiores paradoxos da fé cristã é este: nós nos aproximamos de um Deus infinitamente santo com uma confiança que nenhuma religião humana ousaria ter. Essa ousadia não é atrevimento — é fruto da cruz. Porque Jesus rasgou o véu do templo, temos acesso direto ao Pai.",
            "Hebreus 4:16 nos convida a nos 'aproximarmos com confiança' (parrēsia — franqueza, liberdade de falar tudo) do trono da graça. Nem é 'trono do juízo', nem é 'balcão de atendimento': é o trono de um Rei que se tornou pai por causa de Cristo.",
            "Orar com ousadia é diferente de orar com arrogância. A ousadia se ajoelha; a arrogância exige. A ousadia crê que Deus quer nos ouvir; a arrogância crê que Deus nos deve algo.",
          ],
          verses: [
            {
              ref: "Hebreus 4:16",
              textByVersion: {
                NVI: "Assim, aproximemo-nos do trono da graça com toda a confiança, a fim de recebermos misericórdia e encontrarmos graça que nos ajude no momento da necessidade.",
              },
              originals: [
                { word: "παρρησία", translit: "parrēsia", meaning: "franqueza, liberdade de falar, ousadia sem medo", lang: "grego" },
              ],
            },
            {
              ref: "1 João 5:14",
              textByVersion: {
                NVI: "Esta é a confiança que temos ao nos aproximarmos de Deus: se pedirmos alguma coisa de acordo com a sua vontade, ele nos ouve.",
              },
            },
          ],
          keywords: [
            { word: "παρρησία", translit: "parrēsia", meaning: "confiança livre, liberdade de expressão", lang: "grego" },
            { word: "χάρις", translit: "charis", meaning: "graça, favor imerecido", lang: "grego" },
          ],
          deepDive:
            "A ousadia cristã na oração não repousa em nossa performance espiritual — se assim fosse, seria arrogância. Ela repousa no sangue de Cristo. Ele é nosso Sumo Sacerdote (Hb 4:14), e é o mérito dele que abre a porta. Por isso oramos 'em nome de Jesus' — não como fórmula final, mas como confissão de que só entramos na sala de Deus por causa de Cristo. E é por isso que a oração cristã não hesita em pedir coisas grandes: pedimos apoiados em um mérito grande.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Orar pequenas orações a um grande Deus é uma espécie de insulto. Peça grandes coisas ao Rei, pois o custo já foi pago pelo sangue de seu Filho.",
          },
          quizzes: [
            {
              question: "O que significa 'parrēsia' no contexto da oração?",
              options: [
                "Silêncio reverente diante de Deus",
                "Liberdade e confiança de falar tudo com Deus",
                "Uso obrigatório de fórmulas litúrgicas",
                "Ausência de emoção na oração",
              ],
              correctIndex: 1,
            },
            {
              question: "Em que se apoia nossa ousadia diante de Deus?",
              options: [
                "Na nossa devoção pessoal",
                "Nas horas de oração acumuladas",
                "No sangue e no sacerdócio de Cristo",
                "Nas boas obras que fizemos",
              ],
              correctIndex: 2,
            },
          ],
          application:
            "Escreva um pedido 'grande' que você tem medo de fazer a Deus. Traga-o em oração esta semana, apoiado no mérito de Cristo, não no seu.",
          prayer:
            "Pai, obrigado porque o véu foi rasgado. Entro no teu trono não porque eu mereça, mas porque Jesus me abriu a porta. Recebe minha confiança como um filho recebe o abraço do pai. Amém.",
          weeklyChallenge:
            "Todos os dias, ore por uma coisa 'impossível' — algo que só Deus pode fazer. Registre no diário como sua fé cresce ao longo da semana.",
          reflectionQuestion:
            "Minhas orações têm sido tímidas por medo ou por descrença? Como o mérito de Cristo muda a ousadia dos meus pedidos?",
          xp: 25,
        },
      ],
    },
    {
      id: "or-mod-2",
      title: "Módulo II: Vida de Oração Diária",
      lessons: [
        {
          id: "or-2-1",
          title: "A Oração Perseverante",
          intro: [
            "Jesus contou uma parábola inteira 'para mostrar aos seus discípulos que eles deviam orar sempre e nunca desanimar' (Lc 18:1). Se Ele achou necessário ensinar isso, é porque o desânimo na oração é a experiência universal do crente. Ninguém escapa de orar durante meses por algo que parece ficar cada vez mais distante.",
            "Perseverança não é sinônimo de repetição vazia. É a fé que continua batendo à porta mesmo quando a resposta demora, porque conhece o coração de quem está do outro lado.",
            "Paulo resume isso em três palavras impossíveis se lidas de forma literalista: 'orai sem cessar' (1 Ts 5:17). Não como monólogo constante em voz alta, mas como consciência permanente da presença de Deus — vivendo em conversa contínua com o Pai.",
          ],
          verses: [
            {
              ref: "Lucas 18:1",
              textByVersion: {
                NVI: "Jesus contou aos seus discípulos uma parábola, para mostrar-lhes que eles deviam orar sempre e nunca desanimar.",
              },
            },
            {
              ref: "1 Tessalonicenses 5:17",
              textByVersion: {
                NVI: "Orem continuamente.",
              },
              originals: [
                { word: "ἀδιαλείπτως", translit: "adialeiptōs", meaning: "sem interrupção, constantemente", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἀδιαλείπτως", translit: "adialeiptōs", meaning: "sem cessar, constantemente", lang: "grego" },
            { word: "προσκαρτερέω", translit: "proskartereō", meaning: "perseverar firmemente, aplicar-se com constância", lang: "grego" },
          ],
          deepDive:
            "A oração perseverante é escola de caráter. Deus poderia responder tudo no primeiro pedido — e às vezes responde —, mas frequentemente demora não porque não queira, mas porque a espera está formando em nós algo mais precioso que a resposta. Aprendemos dependência, humildade e discernimento. Enquanto oramos, Deus não está apenas ouvindo o pedido: está moldando o pedinte. Por isso, muitas vezes, quando a resposta finalmente chega, já não somos os mesmos que a pediram — e podemos recebê-la sem que ela nos destrua.",
          theologianQuote: {
            author: "Paul Washer",
            text: "Deus não atrasa suas respostas por indiferença; atrasa porque o processo de esperar em oração é, muitas vezes, mais transformador do que a resposta em si.",
          },
          quizzes: [
            {
              question: "Por que Jesus contou a parábola de Lucas 18?",
              options: [
                "Para ensinar sobre juízes injustos",
                "Para mostrar que os discípulos deviam orar sempre e não desanimar",
                "Para condenar viúvas insistentes",
                "Para provar que Deus é indiferente",
              ],
              correctIndex: 1,
            },
            {
              question: "O que significa 'orai sem cessar' (1 Ts 5:17)?",
              options: [
                "Falar em voz alta 24 horas por dia",
                "Cumprir horários fixos de oração",
                "Viver em consciência contínua da presença de Deus",
                "Repetir sempre a mesma oração",
              ],
              correctIndex: 2,
            },
          ],
          application:
            "Escolha um pedido pelo qual você orará todos os dias durante 40 dias. Marque no calendário e não desista, mesmo sem resposta.",
          prayer:
            "Pai, quando eu quiser desistir de orar, lembra-me que o silêncio não é ausência — é escola. Fortalece minha fé para bater à tua porta com constância. Amém.",
          weeklyChallenge:
            "Comece um caderno de oração com três colunas: pedido, data em que começou, data em que foi respondido. Preencha as duas primeiras esta semana.",
          reflectionQuestion:
            "O que costumo fazer quando uma oração demora a ser respondida? Desisto ou persevero?",
          xp: 25,
        },
        {
          id: "or-2-2",
          title: "Intercessão pelos Outros",
          intro: [
            "A oração cristã amadurece quando deixa de ser lista de pedidos pessoais e passa a incluir os outros. Paulo pede a Timóteo que 'súplicas, orações, intercessões e ações de graças sejam feitas em favor de todos os homens' (1 Tm 2:1). Interceder é ficar diante de Deus em nome de outra pessoa — é um ministério silencioso, quase invisível, mas de altíssimo peso espiritual.",
            "Interceder por alguém muda o interceptor. É quase impossível continuar odiando quem você tem orado com sinceridade. É por isso que Jesus manda orar pelos inimigos: não porque eles precisem — precisam sim — mas porque nós precisamos.",
            "A intercessão é o modo mais concreto de amar quem está longe de você.",
          ],
          verses: [
            {
              ref: "1 Timóteo 2:1",
              textByVersion: {
                NVI: "Antes de tudo, recomendo que se façam súplicas, orações, intercessões e ações de graças por todos os homens.",
              },
              originals: [
                { word: "ἐντεύξεις", translit: "enteuxeis", meaning: "intercessões, aproximações em favor de outro", lang: "grego" },
              ],
            },
            {
              ref: "Efésios 6:18",
              textByVersion: {
                NVI: "Orem no Espírito em todas as ocasiões, com toda oração e súplica; tendo isso em mente, estejam atentos e perseverem na oração por todos os santos.",
              },
            },
          ],
          keywords: [
            { word: "ἔντευξις", translit: "enteuxis", meaning: "intercessão, apelo em favor de outrem", lang: "grego" },
            { word: "פָּגַע", translit: "paga", meaning: "encontrar, intervir, interceder", lang: "hebraico" },
          ],
          deepDive:
            "A intercessão tem raízes profundas na Bíblia: Abraão intercede por Sodoma, Moisés intercede por Israel, Jó intercede pelos amigos, Jesus intercede pelos discípulos em João 17 — e continua intercedendo por nós agora (Rm 8:34; Hb 7:25). Quando você intercede, participa do próprio ministério celestial de Cristo. Não é exagero: é a Escritura. Isso muda o peso das nossas orações intercessórias: não estamos falando sozinhos com Deus a respeito de alguém — estamos nos juntando à voz de Jesus.",
          theologianQuote: {
            author: "John Lennox",
            text: "Interceder é assumir diante de Deus a responsabilidade espiritual por alguém que talvez nem saiba que estamos orando por ele. É o ato de amor mais escondido — e um dos mais poderosos.",
          },
          quizzes: [
            {
              question: "O que a palavra grega 'enteuxis' descreve?",
              options: [
                "Uma oração apenas pessoal",
                "Uma aproximação a Deus em favor de outra pessoa",
                "Uma reclamação contra alguém",
                "Uma bênção sacerdotal",
              ],
              correctIndex: 1,
            },
            {
              question: "Por que orar pelos inimigos é tão importante?",
              options: [
                "Porque eles precisam mudar de vida",
                "Porque nós também precisamos que Deus mude nosso coração em relação a eles",
                "Porque é uma exigência religiosa vazia",
                "Porque garante nossa salvação",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Faça uma lista de 5 pessoas por quem você intercederá diariamente esta semana. Inclua pelo menos uma pessoa que te feriu.",
          prayer:
            "Senhor, ensina-me a interceder. Que meus olhos vejam os outros como tu vês, e que minha oração se torne uma ponte entre a tua graça e a vida deles. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Envie uma mensagem esta semana a cada uma das 5 pessoas da sua lista dizendo apenas: 'Estou orando por você'. Não explique motivos.",
          reflectionQuestion:
            "Quem tem me faltado orar por, e por quê? O que Deus quer fazer em mim ao me colocar a orar por essa pessoa?",
          xp: 25,
        },
      ],
    },
  ],
};

export const additionalTrails: Trail[] = [comoEstudarBiblia, oracao];
