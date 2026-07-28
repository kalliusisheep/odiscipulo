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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Luiz Sayão realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Hernandes Dias Lopes realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Spurgeon realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            text: "Um texto não pode significar o que nunca poderia ter significado para seus leitores e ouvintes originais.",
            source: "How to Read the Bible for All Its Worth",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se C. S. Lewis realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se D. A. Carson realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "The Contemporary Christian: An Urgent Plea for Double Listening",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se G. K. Beale realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Richard Foster realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
          id: "or-1-1",
          title: "O Que Realmente Acontece Quando Oramos?",
          intro: [
            "Antes de aprender técnicas ou modelos de oração, é preciso entender o que, teologicamente, está acontecendo quando um cristão ora. Muita gente ora a vida inteira tratando a oração como um formulário de pedidos entregue a um Deus distante, sem nunca parar para perguntar o que realmente ocorre nesse encontro.",
            "A Bíblia descreve a oração como algo muito mais profundo do que um pedido: é participação em um relacionamento de aliança, aberto unicamente pela obra de Cristo. Você não está mandando uma mensagem para um destinatário desconhecido — está sendo recebido por um Pai, através de um Mediador, com a ajuda de um Auxiliador.",
            "Toda oração cristã genuína tem uma estrutura trinitária, mesmo quando o orante não tem plena consciência disso: oramos ao Pai, por meio do Filho, no poder do Espírito Santo. Essa não é uma curiosidade teológica de bastidores — é a razão pela qual um pecador pode se aproximar de um Deus santo com confiança.",
            "Entender essa arquitetura muda a textura da oração: você deixa de orar como quem implora a um estranho e passa a orar como filho que fala com o Pai, sabendo que o Filho intercede por você agora e o Espírito o ajuda a orar quando faltam palavras.",
          ],
          verses: [
            {
              ref: "Efésios 2:18",
              textByVersion: {
                NVI: "Pois por meio dele [Cristo] tanto nós como vocês temos acesso ao Pai, por um só Espírito.",
                NAA: "Porque é por meio dele que nós, tanto quanto vocês, temos acesso ao Pai, em um só Espírito.",
                ACF: "Porque por ele ambos temos acesso ao Pai em um mesmo Espírito.",
              },
              originals: [
                { word: "προσαγωγή", translit: "prosagōgē", meaning: "acesso, introdução formal à presença de alguém importante", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:26",
              textByVersion: {
                NVI: "Da mesma forma o Espírito nos ajuda em nossa fraqueza, pois não sabemos como orar, nem o que pedir, mas o próprio Espírito intercede por nós com gemidos inexprimíveis.",
              },
            },
          ],
          keywords: [
            { word: "προσαγωγή", translit: "prosagōgē", meaning: "'acesso, introdução formal'. Termo usado para descrever alguém sendo apresentado à corte de um rei. Cristo é quem nos apresenta ao Pai.", lang: "grego" },
            { word: "στεναγμός", translit: "stenagmos", meaning: "'gemido, suspiro profundo demais para palavras'. Descreve a intercessão do Espírito quando nem sabemos como orar (Rm 8:26).", lang: "grego" },
          ],
          deepDive:
            "A oração cristã tem uma arquitetura trinitária, e essa não é uma nota de rodapé: é a estrutura real de toda oração genuína. Oramos ao Pai — é a Ele que nos dirigimos. Oramos por meio do Filho — é Ele quem nos dá 'prosagōgē', acesso formal, como alguém apresentado à corte de um rei, e que agora intercede por nós à direita do Pai (Rm 8:34). Oramos no poder do Espírito — é Ele quem nos ajuda quando não sabemos as palavras certas, gemendo por nós de um jeito que nenhuma linguagem humana alcançaria. Isso significa que mesmo uma oração simples, desajeitada, feita por um cristão cansado ao final de um dia difícil, participa de algo sustentado pela própria Trindade. Esquecer isso reduz a oração a técnica de persuasão; lembrar disso a devolve ao lugar de relacionamento filial.",
          theologianQuote: {
            author: "John Stott",
            text: "A oração cristã não é um monólogo religioso; é uma conversa trinitária na qual somos convidados a participar — falamos ao Pai, pelo Filho, no Espírito.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Stott realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "João 14:13-14",
                textByVersion: {
                  NVI: "E eu farei o que vocês pedirem em meu nome, para que o Filho traga glória ao Pai. O que vocês pedirem em meu nome eu farei.",
                },
              },
              {
                ref: "Gálatas 4:6",
                textByVersion: {
                  NVI: "Porque vocês são filhos, Deus enviou aos nossos corações o Espírito de seu Filho, que clama: 'Aba, Pai'.",
                },
              },
            ],
            additionalKeywords: [
              { word: "Ἀββά", translit: "Abbá", meaning: "'Papai'. Palavra aramaica de intimidade familiar que Paulo diz que o próprio Espírito coloca em nossa boca ao orarmos (Gl 4:6; Rm 8:15).", lang: "grego" },
              { word: "ἐντυγχάνω", translit: "entynchanō", meaning: "'interceder, intervir em favor de alguém'. É o que Cristo faz agora, à direita do Pai, enquanto você ora (Rm 8:34).", lang: "grego" },
            ],
            historicalContext:
              "A compreensão trinitária da oração não é invenção tardia da teologia sistemática — ela nasce diretamente do modo como o Novo Testamento descreve a experiência de oração da igreja primitiva, e foi defendida com precisão nos concílios que formularam a ortodoxia trinitária (Niceia, 325 d.C.; Constantinopla, 381 d.C.) contra distorções que rebaixavam a plena divindade do Filho ou do Espírito. Se o Filho não fosse plenamente Deus, sua intercessão não teria o peso que a Escritura lhe atribui; se o Espírito não fosse plenamente Deus, sua ajuda na oração seria apenas assistência angélica, não comunhão divina real.",
            exegeticalNotes:
              "O termo grego 'prosagōgē' (Ef 2:18) era usado no mundo antigo para descrever a introdução formal de alguém à presença de um soberano — um oficial da corte conduzia o visitante até o rei. Paulo usa essa imagem para dizer que Cristo desempenha esse papel entre o crente e o Pai: não somos nós que abrimos caminho por mérito próprio; somos conduzidos por Ele.",
            theologicalDebate:
              "A maior parte das orações no Novo Testamento é dirigida ao Pai, por meio do Filho, no Espírito — esse é o padrão normativo ensinado por Jesus. Ainda assim, há registros bíblicos de oração dirigida diretamente ao Filho (como Estêvão em Atos 7:59) ou de invocação do Espírito em contextos de adoração. Isso não contradiz o padrão trinitário; mostra que ele comporta variações legítimas de expressão devocional, sem que isso seja uma questão de doutrina essencial — é mais uma questão de prática e ênfase espiritual.",
            secondQuote: {
              author: "Millard Erickson",
              text: "A doutrina da Trindade não é um quebra-cabeça abstrato para teólogos; ela molda a própria experiência devocional do crente, dando forma e sentido a cada oração que fazemos.",
            },
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
              question: "O que Romanos 8:26 ensina sobre o papel do Espírito na oração?",
              options: [
                "Ele apenas observa nossas orações à distância",
                "Ele intercede por nós quando não sabemos como orar",
                "Ele só age quando oramos em voz alta",
                "Ele substitui a necessidade de orarmos",
              ],
              correctIndex: 1,
              explanation: "O Espírito ajuda o crente em sua fraqueza, intercedendo com gemidos que vão além das palavras.",
            },
          ],
          application:
            "Na próxima vez que for orar, faça conscientemente as três etapas: dirija-se ao Pai nomeando-o assim; agradeça a Cristo por lhe dar acesso; peça ao Espírito que o ajude a orar bem. Perceba como isso muda a textura da sua oração.",
          prayer:
            "Pai, obrigado por me receberes não como estranho, mas como filho. Obrigado, Jesus, por teres aberto o caminho até o Pai e por intercederes por mim agora mesmo. Espírito Santo, ajuda-me a orar quando não sei as palavras. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Durante 7 dias, antes de cada oração, diga em voz alta: 'Pai, venho a ti pelo Filho, no poder do Espírito.' Observe, ao final da semana, se isso mudou sua percepção sobre o que acontece quando você ora.",
          reflectionQuestion:
            "Como muda a sua confiança ao orar, sabendo que Cristo está, neste exato momento, intercedendo por você diante do Pai?",
          xp: 20,
        },
        {
          id: "or-1-2",
          title: "A Oração Ensinada por Jesus",
          intro: [
            "Os discípulos passaram anos observando Jesus curar enfermos, alimentar multidões e acalmar tempestades com uma palavra. Curiosamente, nenhuma dessas cenas gerou o pedido registrado em Lucas 11:1: 'Senhor, ensina-nos a orar.' Foi a vida de oração de Jesus — não seus milagres — que os fez perceber o quanto ainda tinham a aprender.",
            "A resposta de Jesus, o Pai Nosso, não foi dada como fórmula mágica para repetir mecanicamente, mas como um mapa: por onde começar (adorando o nome de Deus), o que priorizar (o Reino antes das nossas necessidades), o que pedir (pão, perdão, livramento) e em quem confiar (o Pai que está nos céus).",
            "Chamar Deus de 'Pai' era, para ouvidos judaicos do primeiro século, algo quase chocante em sua intimidade. Jesus ensina seus discípulos a começar cada oração no colo de Deus, e não diante de um tribunal distante.",
          ],
          verses: [
            {
              ref: "Mateus 6:9-13",
              textByVersion: {
                NVI: "Vocês, orem assim: Pai nosso, que estás nos céus! Santificado seja o teu nome. Venha o teu Reino; seja feita a tua vontade, assim na terra como no céu. Dá-nos hoje o nosso pão de cada dia. Perdoa as nossas dívidas, assim como perdoamos aos nossos devedores. E não nos deixes cair em tentação, mas livra-nos do mal.",
              },
            },
            {
              ref: "Lucas 11:1",
              textByVersion: {
                NVI: "Certo dia Jesus estava orando em determinado lugar. Tendo terminado, um dos seus discípulos lhe disse: 'Senhor, ensina-nos a orar, como também João ensinou aos seus discípulos'.",
              },
            },
          ],
          keywords: [
            { word: "πάτερ", translit: "pater", meaning: "'Pai'. Forma de endereçamento familiar e íntimo, incomum na oração judaica formal da época.", lang: "grego" },
            { word: "ἁγιασθήτω", translit: "hagiasthētō", meaning: "'seja santificado'. Verbo no imperativo, primeira petição do Pai Nosso — antes de qualquer pedido pessoal.", lang: "grego" },
          ],
          deepDive:
            "A ordem das petições do Pai Nosso ensina uma teologia inteira em poucas linhas. 'Santificado seja o teu nome' e 'venha o teu Reino' vêm antes de 'dá-nos o pão de cada dia' — primeiro Deus, depois nós. Essa sequência inverte a maioria das orações espontâneas, que costumam começar direto pelas necessidades pessoais. E 'Pai nosso', não 'meu Pai', coloca imediatamente o orante dentro de uma família: não existe oração cristã genuinamente individualista, mesmo quando feita a sós no quarto.",
          theologianQuote: {
            author: "John Wesley",
            text: "Deus não faz nada a não ser em resposta à oração.",
            source: "A Plain Account of Christian Perfection",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Lucas 11:2-4",
                textByVersion: {
                  NVI: "Ele lhes disse: 'Quando orarem, digam: Pai, santificado seja o teu nome. Venha o teu Reino. Dá-nos cada dia o pão de cada dia. Perdoa-nos os nossos pecados, pois também perdoamos a todos que nos devem. E não nos deixes cair em tentação'.",
                },
              },
              {
                ref: "Mateus 6:7-8",
                textByVersion: {
                  NVI: "E, ao orar, não fiquem sempre repetindo a mesma coisa, como fazem os pagãos, pois eles pensam que serão ouvidos por causa de suas muitas palavras. Não sejam como eles, pois o Pai de vocês sabe do que vocês precisam, antes mesmo de o pedirem.",
                },
              },
            ],
            additionalKeywords: [
              { word: "βαττολογήσητε", translit: "battalogēsēte", meaning: "'fiquem repetindo, tagarelando sem sentido'. Termo raro usado por Jesus para condenar a oração vazia, mecânica, feita para impressionar (Mt 6:7).", lang: "grego" },
              { word: "מַלְכוּת", translit: "malkut", meaning: "'reino, reinado, soberania'. Conceito central por trás de 'venha o teu Reino' — não apenas um lugar, mas o governo ativo de Deus sobre tudo.", lang: "hebraico" },
            ],
            historicalContext:
              "No judaísmo do primeiro século, orações formais como a Amidá (série de dezoito bênçãos recitadas diariamente) eram estruturadas e memorizadas, mas raramente se dirigiam a Deus com a intimidade de 'Pai'. O ensino de Jesus rompe esse padrão sem abandonar a reverência. O texto cristão mais antigo fora do Novo Testamento, o Didaquê (manual de ensino da igreja do início do segundo século), já instruía os cristãos a orarem o Pai Nosso três vezes ao dia — evidência de quão rapidamente essa oração se tornou o centro da devoção cristã.",
            exegeticalNotes:
              "Mateus registra uma versão mais longa do Pai Nosso, no contexto do Sermão do Monte; Lucas registra uma versão mais breve, como resposta direta a um pedido específico dos discípulos. As duas não se contradizem — provavelmente refletem ocasiões diferentes em que Jesus ensinou o mesmo padrão essencial de oração, adaptando a extensão ao momento.",
            theologicalDebate:
              "Tradições cristãs diferem quanto ao uso litúrgico do Pai Nosso: algumas o recitam palavra por palavra em todo culto público, como oração fixa da comunidade; outras o tratam principalmente como padrão flexível, um guia para estruturar orações espontâneas com as próprias palavras. Ambas as práticas honram a intenção de Jesus; a diferença é de ênfase litúrgica, uma questão secundária de prática de adoração, não de doutrina essencial.",
            secondQuote: {
              author: "Philip Ryken",
              text: "O Pai Nosso não é apenas uma oração para recitar; é uma escola inteira de espiritualidade, ensinando o que adorar, o que pedir e em quem confiar.",
            },
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
          id: "or-1-3",
          title: "Ousadia Diante do Trono da Graça",
          intro: [
            "Um dos maiores paradoxos da fé cristã é este: nos aproximamos de um Deus infinitamente santo com uma confiança que nenhuma religião humana ousaria propor. Essa ousadia não é atrevimento — é fruto direto da cruz. Porque Jesus rasgou o véu do templo com seu próprio corpo, temos acesso direto ao Pai.",
            "Hebreus 4:16 convida o crente a se 'aproximar com confiança' — a palavra grega ali, parrēsia, significa franqueza, liberdade de falar tudo — do trono da graça. Não é trono de juízo distante, nem um balcão de atendimento: é o trono de um Rei que se tornou Pai por causa de Cristo.",
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
            { word: "παρρησία", translit: "parrēsia", meaning: "confiança livre, liberdade de expressão, ousadia sem medo", lang: "grego" },
            { word: "χάρις", translit: "charis", meaning: "graça, favor totalmente imerecido", lang: "grego" },
          ],
          deepDive:
            "A ousadia cristã na oração não repousa em nenhuma performance espiritual — se assim fosse, seria arrogância disfarçada de fé. Ela repousa inteiramente no sangue de Cristo. Ele é nosso Sumo Sacerdote (Hb 4:14), e é o mérito dele, não o nosso, que abre a porta. Por isso oramos 'em nome de Jesus': não como fórmula mágica de encerramento, mas como confissão de que só entramos na presença de Deus por causa dele. E é justamente por isso que a oração cristã não hesita em pedir coisas grandes: pedimos apoiados em um mérito grande, que já foi pago.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Orar pequenas orações a um grande Deus é uma espécie de insulto. Peça grandes coisas ao Rei, pois o custo já foi pago pelo sangue de seu Filho.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Spurgeon realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Mateus 27:51",
                textByVersion: {
                  NVI: "Nesse momento, o véu do santuário do templo foi rasgado em dois, de alto a baixo. A terra tremeu, e as rochas se partiram.",
                },
              },
              {
                ref: "Romanos 8:15",
                textByVersion: {
                  NVI: "Vocês não receberam um espírito que os escravize para novamente temer, mas receberam o Espírito que os adota como filhos, por meio do qual clamamos: 'Aba, Pai'.",
                },
              },
            ],
            additionalKeywords: [
              { word: "καταπέτασμα", translit: "katapetasma", meaning: "'véu, cortina'. A cortina que separava o Lugar Santíssimo no templo, rasgada de alto a baixo na morte de Cristo (Mt 27:51), sinalizando acesso aberto a Deus.", lang: "grego" },
              { word: "υἱοθεσία", translit: "huiothesia", meaning: "'adoção como filho'. Ato legal e afetuoso pelo qual o crente é incorporado à família de Deus como herdeiro (Rm 8:15).", lang: "grego" },
            ],
            historicalContext:
              "No judaísmo do segundo templo, o Lugar Santíssimo — separado pelo véu — era um espaço de acesso restrito: apenas o sumo sacerdote entrava ali, uma vez por ano, no Dia da Expiação, e com grande temor cerimonial. Para os primeiros leitores do Evangelho de Mateus, a notícia de que esse véu se rasgou 'de alto a baixo' (indicando ação de Deus, não humana) no momento da morte de Cristo era um sinal teológico chocante: o acesso restrito havia terminado.",
            exegeticalNotes:
              "A mesma palavra grega 'parrēsia' usada em Hebreus 4:16 para a ousadia na oração é usada em Atos 4:13 para descrever a coragem dos apóstolos ao pregarem publicamente diante do Sinédrio. É a mesma ousadia concedida pelo Espírito — expressa tanto na proclamação pública do evangelho quanto na intimidade da oração privada.",
            theologicalDebate:
              "É importante distinguir a ousadia bíblica na oração de distorções da chamada 'teologia da prosperidade', que tratam a confiança ao orar como uma fórmula que garante automaticamente qualquer pedido específico feito com fé suficiente. A ousadia bíblica é sobre a certeza de sermos ouvidos e recebidos por Deus — não uma garantia de que todo pedido será concedido exatamente como pedido (1 João 5:14 já condiciona isso a 'de acordo com a sua vontade'). Se você encontrar ensino nesse sentido, vale a pena conversar com seu pastor.",
            secondQuote: {
              author: "F. F. Bruce",
              text: "O rasgar do véu não foi apenas um evento dramático no templo; foi a declaração visível de que, em Cristo, o caminho até Deus estava, de uma vez por todas, aberto.",
            },
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
            "Escreva um pedido 'grande' que você tem receio de fazer a Deus. Traga-o em oração esta semana, apoiado no mérito de Cristo, não no seu.",
          prayer:
            "Pai, obrigado porque o véu foi rasgado. Entro no teu trono não porque eu mereça, mas porque Jesus me abriu a porta. Recebe minha confiança como um filho recebe o abraço do pai. Amém.",
          weeklyChallenge:
            "Todos os dias, ore por uma coisa que só Deus pode resolver. Registre no diário como sua confiança se transforma ao longo da semana.",
          reflectionQuestion:
            "Minhas orações têm sido tímidas por medo ou por descrença? Como o mérito de Cristo muda a ousadia dos meus pedidos?",
          xp: 20,
        },
      ],
    },
    {
      id: "or-mod-2",
      title: "Módulo II: As Formas da Oração",
      lessons: [
        {
          id: "or-2-1",
          title: "Adoração e Ação de Graças",
          intro: [
            "Existe uma diferença entre orar pedindo e orar admirando. A adoração é o tipo de oração que se detém no próprio Deus — em quem Ele é — antes mesmo de tocar no que Ele pode fazer. É a oração que diz 'Senhor, tu és santo' antes de dizer 'Senhor, eu preciso'.",
            "O Saltério, o livro de orações de Israel, está repleto de salmos que começam exatamente assim: convocando a alma, e até a criação inteira, a render louvor a Deus só porque Ele é digno. A ação de graças caminha lado a lado com a adoração — é o reconhecimento consciente de que tudo o que temos vem da mão de Deus.",
            "Começar a oração pela adoração e pela gratidão reordena o coração: as ansiedades que pareciam gigantes diminuem de tamanho diante da grandeza que acabamos de contemplar.",
          ],
          verses: [
            {
              ref: "Salmos 100:4",
              textByVersion: {
                NVI: "Entrem por suas portas com ações de graças e em seus átrios com louvor; deem-lhe graças e bendigam o seu nome.",
              },
            },
            {
              ref: "Filipenses 4:6",
              textByVersion: {
                NVI: "Em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus.",
              },
            },
          ],
          keywords: [
            { word: "תְּהִלָּה", translit: "tehillah", meaning: "'louvor, canto de adoração'. Raiz da palavra 'Salmos' em hebraico (Tehillim), o livro de louvores de Israel.", lang: "hebraico" },
            { word: "εὐχαριστία", translit: "eucharistia", meaning: "'ação de graças, gratidão expressa em palavras'. Raiz da palavra 'eucaristia', usada na tradição cristã para a Ceia do Senhor.", lang: "grego" },
          ],
          deepDive:
            "A ordem importa: 'entrem por suas portas com ações de graças' vem antes de qualquer pedido no Salmo 100. Isso não é regra rígida de etiqueta espiritual, mas sabedoria psicológica e teológica profunda — começar reconhecendo quem Deus é e o que Ele já fez recalibra a perspectiva antes de apresentarmos qualquer necessidade. Paulo, em Filipenses 4:6, escrito de dentro de uma prisão, ainda assim instrui a igreja a misturar toda súplica com ação de graças. Gratidão em meio à dificuldade não é ingenuidade — é fé que já sabe como a história termina.",
          theologianQuote: {
            author: "Davi Lago",
            text: "Adorar não é uma técnica para conseguir algo de Deus; é a resposta natural de um coração que finalmente enxergou quem Ele é.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Davi Lago realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 150:6",
                textByVersion: {
                  NVI: "Que tudo o que tem vida dê louvor ao Senhor! Aleluia!",
                },
              },
              {
                ref: "Colossenses 3:17",
                textByVersion: {
                  NVI: "E tudo o que fizerem, seja em palavra ou em ação, façam-no em nome do Senhor Jesus, dando por meio dele graças a Deus Pai.",
                },
              },
            ],
            additionalKeywords: [
              { word: "זָמַר", translit: "zamar", meaning: "'louvar cantando, tocar instrumento em louvor'. Verbo hebraico que aparece repetidamente no Saltério, ligando louvor e música.", lang: "hebraico" },
              { word: "δοξολογία", translit: "doxologia", meaning: "'palavra de louvor, atribuição de glória'. Raiz da palavra 'doxologia', usada para hinos e orações que exaltam a glória de Deus.", lang: "grego" },
            ],
            historicalContext:
              "Os Salmos serviam como o hinário e o livro de orações oficial do templo em Israel, cantados comunitariamente em festas e sacrifícios. A igreja primitiva herdou esse hábito: Efésios 5:19 e Colossenses 3:16 instruem os cristãos a se edificarem 'com salmos, hinos e cânticos espirituais' — mostrando que a adoração cantada em comunidade sempre foi parte central, não periférica, da vida devocional cristã.",
            exegeticalNotes:
              "A expressão 'em tudo' (en panti), em Filipenses 4:6, é abrangente por design: Paulo não restringe a oração agradecida a momentos de crise ou a datas especiais — ela deve permear toda a vida, inclusive as circunstâncias mais adversas, como as que o próprio apóstolo vivia ao escrever essa carta, preso em Roma.",
            theologicalDebate:
              "Diferenças de estilo entre adoração mais contemplativa e silenciosa e adoração mais expressiva e cantada em voz alta refletem tradições e temperamentos distintos dentro do cristianismo evangélico — não uma questão de doutrina essencial, mas de preferência legítima de expressão cultural e comunitária. O que a Escritura exige não é um estilo específico, mas um coração genuinamente grato e voltado a Deus.",
            secondQuote: {
              author: "C. S. Lewis",
              text: "Não louvamos as coisas apenas para expressar, mas para completar nosso prazer nelas; o louvor é o modo natural de a alegria transbordar.",
            },
          },
          quizzes: [
            {
              question: "Segundo o Salmo 100:4, como devemos entrar na presença de Deus?",
              options: [
                "Com listas de pedidos urgentes",
                "Com ações de graças e louvor",
                "Em silêncio absoluto, sem palavras",
                "Apenas em ocasiões especiais",
              ],
              correctIndex: 1,
            },
            {
              question: "O que Filipenses 4:6 ensina sobre como apresentar pedidos a Deus?",
              options: [
                "Que devemos escondê-los até estarmos completamente calmos",
                "Que devemos misturar toda súplica com ação de graças",
                "Que só devemos orar quando estamos felizes",
                "Que a gratidão é opcional na oração",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Antes de fazer qualquer pedido hoje, escreva cinco motivos concretos de gratidão a Deus. Só depois apresente suas necessidades.",
          prayer:
            "Senhor, perdoa-me por tantas vezes correr direto para os meus pedidos sem parar para te contemplar. Que minha primeira palavra hoje seja de louvor, não de carência. Amém.",
          weeklyChallenge:
            "Escreva um salmo pessoal de louvor de dez linhas, sem nenhum pedido — apenas admiração por quem Deus é e gratidão pelo que Ele já fez.",
          reflectionQuestion:
            "Minhas orações têm mais espaço para pedidos ou para louvor? O que isso revela sobre a imagem de Deus que carrego no coração?",
          xp: 25,
        },
        {
          id: "or-2-2",
          title: "Confissão e Arrependimento no Diálogo com Deus",
          intro: [
            "A confissão é o tipo de oração que a carne humana menos gosta de fazer, e talvez por isso seja um dos termômetros mais confiáveis da saúde espiritual de alguém. Confessar não é informar a Deus algo que Ele já sabe — é concordar com Ele sobre o que fizemos, sem desculpas nem minimizações.",
            "O modelo mais completo de confissão na Bíblia é o Salmo 51, escrito por Davi depois de seu pecado com Bate-Seba. Ali não há autopiedade nem racionalização — há reconhecimento nu do pecado e clamor por um coração novo.",
            "É importante distinguir a confissão que restaura a comunhão diária com o Pai (1 João 1:9) da justificação que já nos salvou de uma vez por todas em Cristo. Confessar pecados não é reconquistar a salvação a cada dia — é manter limpo o relacionamento com o Pai que já nos adotou como filhos.",
          ],
          verses: [
            {
              ref: "1 João 1:9",
              textByVersion: {
                NVI: "Se confessarmos os nossos pecados, ele é fiel e justo para perdoar os nossos pecados e nos purificar de toda injustiça.",
              },
            },
            {
              ref: "Salmos 51:3-4",
              textByVersion: {
                NVI: "Sei quais são as minhas transgressões, e o meu pecado está sempre diante de mim. Só contra ti pequei e fiz o que tu reprovas.",
              },
            },
          ],
          keywords: [
            { word: "ὁμολογέω", translit: "homologeō", meaning: "'confessar, concordar com'. Literalmente, 'dizer a mesma coisa' que Deus diz sobre o pecado — sem minimizar nem justificar.", lang: "grego" },
            { word: "חָטָא", translit: "chata", meaning: "'pecar, errar o alvo'. Imagem de uma flecha que não atinge o centro pretendido — desviar-se do padrão de Deus.", lang: "hebraico" },
          ],
          deepDive:
            "Confessar, no grego original, é 'homologeō' — literalmente, dizer a mesma coisa que Deus diz. Isso significa que a confissão genuína não é apenas admitir um erro, mas concordar plenamente com o diagnóstico de Deus sobre esse pecado, sem tentar suavizá-lo. Davi, no Salmo 51, não culpa Bate-Seba, nem as circunstâncias, nem a pressão do poder — ele diz 'meu pecado está sempre diante de mim'. Esse tipo de confissão sem desculpas é o que abre espaço para a restauração genuína. A promessa de 1 João 1:9 é notável: Deus é 'fiel e justo' para perdoar — fiel à sua promessa, justo porque o preço do pecado já foi pago integralmente na cruz.",
          theologianQuote: {
            author: "Jonas Madureira",
            text: "Confessar não é se afogar em culpa; é subir à superfície da verdade, onde a graça de Deus já está esperando para purificar o que a culpa só sabia esconder.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Jonas Madureira realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 32:3-5",
                textByVersion: {
                  NVI: "Enquanto guardei silêncio, meus ossos se consumiam em meu gemer o dia inteiro... Então confessei a ti o meu pecado e não escondi a minha iniquidade.",
                },
              },
              {
                ref: "2 Coríntios 7:10",
                textByVersion: {
                  NVI: "A tristeza segundo Deus produz arrependimento que leva à salvação e não traz arrependimento nenhum; a tristeza do mundo, porém, produz morte.",
                },
              },
            ],
            additionalKeywords: [
              { word: "נָחַם", translit: "nacham", meaning: "'arrepender-se, mudar de propósito, consolar-se'. Verbo hebraico que descreve uma reviravolta genuína de direção, não apenas remorso emocional.", lang: "hebraico" },
              { word: "μετάνοια", translit: "metanoia", meaning: "'mudança de mente'. Termo grego que descreve arrependimento genuíno como transformação de rumo, não apenas sentimento de pesar.", lang: "grego" },
            ],
            historicalContext:
              "A prática de confessar pecados sempre esteve presente na vida da igreja, mas assumiu formas diferentes ao longo da história. Na igreja primitiva havia momentos de confissão pública para pecados graves e reconciliação com a comunidade; ao longo da Idade Média desenvolveu-se a prática sacramental da confissão auricular a um sacerdote. A Reforma Protestante recuperou a ênfase bíblica de que o crente confessa diretamente a Deus, sem necessidade de mediação sacerdotal humana para o perdão — embora Tiago 5:16 continue recomendando a confiança mútua entre irmãos como parte saudável da vida em comunidade.",
            exegeticalNotes:
              "O verbo 'confessarmos', em 1 João 1:9, está no tempo presente no grego, sugerindo uma prática contínua, um ritmo de vida, não um evento único. Isso reforça a distinção entre a confissão que restaura comunhão (um processo diário) e a justificação diante de Deus, que já foi selada de uma vez por todas pela obra de Cristo na cruz.",
            theologicalDebate:
              "A prática de confessar pecados a um sacerdote como parte de um sacramento formal de penitência é uma tradição histórica de outras famílias cristãs, diferente da prática evangélica de confissão direta a Deus, com apoio fraterno opcional entre crentes de confiança. Essa é uma diferença histórica legítima entre tradições cristãs, que merece ser tratada com respeito, sem ridicularizar nenhum lado; a posição evangélica se apoia em textos como 1 Timóteo 2:5, que afirma um único Mediador entre Deus e os homens.",
            secondQuote: {
              author: "Charles Finney",
              text: "O arrependimento genuíno não termina na tristeza pelo pecado; ele termina na mudança de direção. Onde não há mudança de vida, ainda não houve arrependimento completo.",
            },
          },
          quizzes: [
            {
              question: "O que a palavra grega 'homologeō' comunica sobre a confissão de pecados?",
              options: [
                "Informar a Deus algo que Ele ainda não sabia",
                "Concordar com Deus sobre o pecado, sem minimizá-lo",
                "Um ritual sem relação com o coração",
                "Uma obrigação para reconquistar a salvação",
              ],
              correctIndex: 1,
            },
            {
              question: "Qual é a diferença entre a confissão de 1 João 1:9 e a justificação em Cristo?",
              options: [
                "Não há diferença nenhuma",
                "A confissão restaura a comunhão diária; a justificação já nos salvou de uma vez por todas",
                "A confissão é mais importante que a justificação",
                "A justificação depende de confissões diárias para se manter válida",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Reserve um tempo hoje para confessar a Deus, com palavras específicas (não genéricas), algo que você tem evitado admitir. Não peça apenas perdão — peça também um coração transformado, como Davi no Salmo 51.",
          prayer:
            "Senhor, não quero esconder de ti o que já vês. Confesso meu pecado sem desculpas e recebo tua purificação com gratidão. Cria em mim um coração puro, e renova um espírito estável dentro de mim. Amém.",
          weeklyChallenge:
            "Leia o Salmo 51 inteiro uma vez por dia esta semana, em oração pausada, permitindo que suas próprias palavras de confissão surjam ao longo da leitura.",
          reflectionQuestion:
            "Existe algo que tenho evitado confessar a Deus com sinceridade? O que me impede de fazer isso hoje?",
          xp: 25,
        },
      ],
    },
    {
      id: "or-mod-3",
      title: "Módulo III: Súplica e Intercessão",
      lessons: [
        {
          id: "or-3-1",
          title: "Súplica: Apresentando Nossos Pedidos a Deus",
          intro: [
            "Depois de adorar, agradecer e confessar, chegamos ao tipo de oração mais familiar para a maioria dos cristãos: o pedido. Súplica é apresentar a Deus, com honestidade e confiança, aquilo de que realmente precisamos — sem fingir força que não temos, nem exigir respostas como se fôssemos credores de Deus.",
            "Jesus incentiva a súplica sem rodeios: 'peçam, e lhes será dado' (Mt 7:7). Ao mesmo tempo, ensina que os pedidos de um filho devem estar em sintonia com o caráter e a vontade do Pai — não é manipulação, é confiança filial.",
            "Suplicar não é sinal de fraqueza espiritual; é reconhecimento de dependência. O cristão maduro não deixa de pedir — aprende a pedir com humildade, especificidade e submissão à vontade de Deus.",
          ],
          verses: [
            {
              ref: "Mateus 7:7-8",
              textByVersion: {
                NVI: "Peçam, e lhes será dado; busquem, e encontrarão; batam, e a porta lhes será aberta. Pois todo o que pede recebe; o que busca encontra; e àquele que bate, a porta é aberta.",
              },
            },
            {
              ref: "Filipenses 4:6-7",
              textByVersion: {
                NVI: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará o coração e a mente de vocês em Cristo Jesus.",
              },
            },
          ],
          keywords: [
            { word: "αἰτέω", translit: "aiteō", meaning: "'pedir'. Verbo comum usado por Jesus em Mateus 7:7 para incentivar o pedido direto e confiante a Deus.", lang: "grego" },
            { word: "δέησις", translit: "deēsis", meaning: "'súplica, pedido urgente'. Palavra usada em Filipenses 4:6 para descrever a apresentação sincera de uma necessidade específica.", lang: "grego" },
          ],
          deepDive:
            "A promessa de Mateus 7:7-8 não é um cheque em branco emocional — o próprio contexto do Sermão do Monte já ensinou que os pedidos devem estar alinhados com o caráter do Pai que 'sabe dar boas dádivas aos seus filhos' (Mt 7:11). Suplicar bem é, portanto, um exercício de fé e humildade ao mesmo tempo: fé para acreditar que Deus ouve e se importa, humildade para reconhecer que Ele, e não nós, define o que é realmente bom. O resultado da súplica entregue com confiança, segundo Paulo, não é necessariamente a resposta exata que pedimos, mas 'a paz de Deus, que excede todo o entendimento' — uma tranquilidade que vem antes mesmo da resposta chegar.",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "Deus não se cansa dos nossos pedidos; Ele se alegra quando um filho corre para Ele em vez de tentar resolver tudo sozinho.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Hernandes Dias Lopes realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 37:4",
                textByVersion: {
                  NVI: "Que o Senhor seja a sua alegria, e ele atenderá aos desejos do seu coração.",
                },
              },
              {
                ref: "Tiago 4:2-3",
                textByVersion: {
                  NVI: "Vocês cobiçam coisas e não as têm; matam e invejam, mas não conseguem obter o que querem... Quando pedem, não recebem, pois pedem por motivos errados.",
                },
              },
            ],
            additionalKeywords: [
              { word: "ζητέω", translit: "zēteō", meaning: "'buscar'. Segundo verbo da tríade de Mateus 7:7, sugerindo que a súplica muitas vezes exige persistência ativa, não apenas um pedido único.", lang: "grego" },
              { word: "שָׁאַל", translit: "shaal", meaning: "'pedir, solicitar'. Verbo hebraico comum para pedido, usado, por exemplo, em 1 Samuel 1 quando Ana pede um filho ao Senhor.", lang: "hebraico" },
            ],
            historicalContext:
              "A oração de súplica sempre teve lugar central na piedade de Israel: Ana pedindo um filho (1 Samuel 1), Ezequias pedindo cura e vida mais longa (2 Reis 20), Neemias pedindo favor diante do rei (Neemias 1-2) — todos são exemplos bíblicos de súplica honesta, específica e confiante, sem que isso fosse visto como falta de fé ou espiritualidade imatura.",
            exegeticalNotes:
              "Tiago 4:2-3 acrescenta um contraponto necessário à promessa de Mateus 7: nem todo pedido não atendido revela falta de fé — às vezes revela motivação errada ('para gastarem em seus próprios prazeres'). A súplica madura examina não apenas o que se pede, mas por quê.",
            theologicalDebate:
              "Existe uma tensão pastoral legítima entre incentivar a súplica ousada e confiante (Mt 7:7) e alertar contra pedidos motivados por egoísmo (Tg 4:3) — cristãos fiéis às vezes hesitam entre ênfases diferentes aqui, alguns priorizando a confiança da criança que pede sem medo, outros priorizando o exame de consciência antes de pedir. As duas ênfases são bíblicas e se complementam; não são posições concorrentes, mas faces da mesma moeda da maturidade na oração.",
            secondQuote: {
              author: "Craig Keener",
              text: "A súplica bíblica nunca é indigna de um Deus soberano; pelo contrário, é o próprio convite que Ele estende aos seus filhos para participarem ativamente de seus propósitos no mundo.",
            },
          },
          quizzes: [
            {
              question: "Segundo Filipenses 4:6-7, o que geralmente acompanha a súplica entregue com confiança a Deus?",
              options: [
                "A garantia de receber exatamente o que foi pedido",
                "A paz de Deus, que excede todo entendimento",
                "O fim imediato de toda ansiedade externa",
                "A eliminação da necessidade de continuar orando",
              ],
              correctIndex: 1,
            },
            {
              question: "Segundo Tiago 4:2-3, por que algumas súplicas não são atendidas?",
              options: [
                "Porque Deus não tem poder para atendê-las",
                "Porque são pedidas com motivações egoístas",
                "Porque a oração nunca funciona de verdade",
                "Porque só pedidos grandes são ouvidos",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Escreva uma lista de três pedidos concretos que você tem hesitado em levar a Deus. Ore por eles esta semana com honestidade, examinando também suas próprias motivações.",
          prayer:
            "Pai, ensina-me a pedir com confiança de filho, sem medo de incomodar-te, e com humildade suficiente para examinar por que peço o que peço. Que minha súplica glorifique a ti, não apenas a mim. Amém.",
          weeklyChallenge:
            "Escolha um pedido específico e ore por ele todos os dias desta semana, anotando a data de início. Revise, ao final, se sua fé ou sua motivação mudaram durante o processo.",
          reflectionQuestion:
            "Tenho hesitado em pedir algo a Deus por achar que é pequeno demais, ou grande demais? O que isso revela sobre a imagem que tenho dele?",
          xp: 25,
        },
        {
          id: "or-3-2",
          title: "Intercessão pelos Outros",
          intro: [
            "A oração cristã amadurece quando deixa de ser apenas uma lista de pedidos pessoais e passa a incluir os outros. Paulo pede a Timóteo que 'súplicas, orações, intercessões e ações de graças sejam feitas em favor de todos os homens' (1 Tm 2:1). Interceder é ficar diante de Deus em nome de outra pessoa — um ministério silencioso, quase invisível, mas de altíssimo peso espiritual.",
            "Interceder por alguém muda o interceptor. É quase impossível continuar guardando ressentimento de quem você tem levado a Deus com sinceridade. É por isso que Jesus ordena orar pelos inimigos: não apenas porque eles precisam — precisam sim —, mas porque nós também precisamos.",
            "A intercessão é o modo mais concreto de amar quem está distante de você fisicamente ou emocionalmente.",
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
              ref: "Hebreus 7:25",
              textByVersion: {
                NVI: "Por isso ele é capaz de salvar definitivamente aqueles que, por meio dele, se aproximam de Deus, pois vive sempre para interceder por eles.",
              },
            },
          ],
          keywords: [
            { word: "ἔντευξις", translit: "enteuxis", meaning: "intercessão, apelo em favor de outrem", lang: "grego" },
            { word: "בַּעַד", translit: "ba'ad", meaning: "'em favor de, por trás de'. Preposição hebraica usada em orações intercessórias no Antigo Testamento.", lang: "hebraico" },
          ],
          deepDive:
            "A intercessão tem raízes profundas na Bíblia: Abraão intercede por Sodoma (Gn 18), Moisés intercede por Israel depois do bezerro de ouro (Êx 32), Jesus intercede pelos discípulos em João 17 — e continua intercedendo por nós agora, segundo Hebreus 7:25. Quando você intercede por alguém, participa do próprio ministério celestial de Cristo, que 'vive sempre para interceder'. Isso muda o peso das nossas orações intercessórias: não estamos falando sozinhos com Deus a respeito de alguém — estamos nos juntando à voz de Jesus, que já ora por essa mesma pessoa.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "Interceder por alguém é levá-lo até a presença de Deus e deixá-lo ali, confiando que Deus fará por ele o que nós mesmos não temos poder para fazer.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Dietrich Bonhoeffer realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Gênesis 18:23-25",
                textByVersion: {
                  NVI: "Então Abraão aproximou-se e perguntou: 'Serás capaz de exterminar o justo com o ímpio?... Longe de ti fazer tal coisa! Matar o justo com o ímpio, tratando o justo e o ímpio da mesma maneira!'",
                },
              },
              {
                ref: "João 17:20",
                textByVersion: {
                  NVI: "Minha oração não é apenas por eles. Rogo também por aqueles que crerão em mim, por meio da mensagem deles.",
                },
              },
            ],
            additionalKeywords: [
              { word: "ὑπέρ", translit: "hyper", meaning: "'em favor de, por causa de'. Preposição-chave do vocabulário intercessório do Novo Testamento, usada repetidamente para descrever a obra de Cristo e a oração cristã em favor de outros.", lang: "grego" },
              { word: "פָּגַע", translit: "paga", meaning: "'encontrar, intervir, interceder'. Usado, entre outros lugares, sobre o Servo Sofredor que 'intercede pelos transgressores' em Isaías 53:12.", lang: "hebraico" },
            ],
            historicalContext:
              "A prática de intercessão organizada por outros — listas de oração, cadeias de intercessão, tempos dedicados a orar por líderes, missionários e necessidades da igreja — tem raízes na tradição monástica de intercessão constante pelo mundo, e foi amplamente adotada por igrejas evangélicas como parte estrutural da vida comunitária. Essa prática segue o padrão bíblico estabelecido muito antes de qualquer organização eclesiástica formal, já visível em Abraão e Moisés.",
            exegeticalNotes:
              "A expressão grega usada em Hebreus 7:25 para descrever a intercessão contínua de Cristo — 'eis to pantelēs', algo como 'totalmente, completamente e para sempre' — enfatiza tanto a permanência quanto a suficiência dessa intercessão. Não é uma oração ocasional de Cristo por nós; é uma atividade celestial ininterrupta, o fundamento por trás de toda intercessão humana.",
            theologicalDebate:
              "Algumas tradições cristãs historicamente pediram também a santos falecidos que intercedessem por elas diante de Deus. A teologia evangélica, apoiada em 1 Timóteo 2:5 ('há um só Deus e um só Mediador entre Deus e os homens, Jesus Cristo'), entende que a intercessão bíblica válida ocorre entre crentes vivos uns pelos outros, e sobretudo por meio da intercessão única e suficiente de Cristo — sem necessidade, nem base bíblica, para intercessão de santos falecidos. Essa é uma diferença histórica legítima entre tradições cristãs, que deve ser tratada com respeito.",
            secondQuote: {
              author: "Leslie Newbigin",
              text: "A intercessão pelas nações e pelos que ainda não creem não é um extra opcional da vida cristã; é parte essencial de como a igreja participa da missão de Deus no mundo.",
            },
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
              question: "Segundo Hebreus 7:25, o que Cristo faz continuamente por nós?",
              options: [
                "Ele julga nossas orações antes de as ouvir",
                "Ele intercede por nós, vivendo sempre para isso",
                "Ele delega a intercessão a anjos",
                "Ele intercede apenas em momentos de crise extrema",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Faça uma lista de 5 pessoas por quem você intercederá diariamente esta semana. Inclua pelo menos uma pessoa com quem você tem dificuldade de se relacionar.",
          prayer:
            "Senhor, ensina-me a interceder. Que meus olhos vejam os outros como tu vês, e que minha oração se torne uma ponte entre a tua graça e a vida deles. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Envie uma mensagem esta semana a cada uma das 5 pessoas da sua lista dizendo apenas: 'Estou orando por você'. Não explique motivos.",
          reflectionQuestion:
            "Quem tenho deixado de orar por, e por quê? O que Deus quer fazer em mim ao me colocar a orar por essa pessoa?",
          xp: 25,
        },
      ],
    },
    {
      id: "or-mod-4",
      title: "Módulo IV: Perseverança e Disciplina na Oração",
      lessons: [
        {
          id: "or-4-1",
          title: "Quando Deus Parece Silencioso",
          intro: [
            "Toda vida de oração séria, mais cedo ou mais tarde, atravessa um período de aparente silêncio de Deus. O apóstolo Paulo pediu três vezes que um 'espinho na carne' fosse removido, e a resposta que recebeu não foi a remoção do problema, mas uma promessa: 'a minha graça é suficiente para você' (2 Coríntios 12:9). Até Jesus, no Getsêmani, orou pedindo que o cálice passasse — e ainda assim o cálice não passou.",
            "O silêncio de Deus não é o mesmo que ausência de Deus. A Bíblia tem um gênero inteiro dedicado a essa experiência: os salmos de lamento, que clamam abertamente 'até quando, Senhor?' sem que isso seja tratado como falta de fé.",
            "Aprender a orar no silêncio, sem abandonar a confiança em Deus, é uma das marcas mais profundas de maturidade espiritual — e uma das mais difíceis de ensinar, porque só se aprende de verdade atravessando a experiência.",
          ],
          verses: [
            {
              ref: "2 Coríntios 12:8-9",
              textByVersion: {
                NVI: "Três vezes roguei ao Senhor que o tirasse de mim. Mas ele me disse: 'Minha graça é suficiente para você, pois o meu poder se aperfeiçoa na fraqueza'.",
              },
              originals: [
                { word: "σκόλοψ", translit: "skolops", meaning: "espinho, estaca cravada na carne", lang: "grego" },
              ],
            },
            {
              ref: "Habacuque 1:2",
              textByVersion: {
                NVI: "Até quando, Senhor, clamarei por ajuda e tu não ouvirás? Até quando gritarei 'violência!' e tu não salvarás?",
              },
            },
          ],
          keywords: [
            { word: "σκόλοψ", translit: "skolops", meaning: "'espinho, estaca'. Imagem usada por Paulo para descrever um sofrimento persistente que Deus permitiu, mas não removeu (2 Co 12:7).", lang: "grego" },
            { word: "עַד־אָנָה", translit: "ad-anah", meaning: "'até quando?'. Expressão comum nos lamentos bíblicos, marca de um clamor honesto que não abandona a fé mesmo diante da demora.", lang: "hebraico" },
          ],
          deepDive:
            "O 'não' de Deus a Paulo em 2 Coríntios 12 não é rejeição — é redirecionamento. Deus não removeu o espinho, mas concedeu algo mais profundo: a compreensão de que sua graça basta, e que o poder divino se manifesta com mais clareza justamente na fraqueza humana, não apesar dela. Isso não significa que toda dor tem uma explicação clara e imediata que possamos identificar — muitas vezes não tem, e forçar uma explicação onde a Escritura não a dá (como fizeram os amigos de Jó) só acrescenta sofrimento ao sofrimento. O que a Bíblia oferece, em vez de uma explicação garantida para cada silêncio, é a certeza do caráter de Deus: bom, sábio e presente, mesmo quando as respostas demoram.",
          theologianQuote: {
            author: "Larry Crabb",
            text: "Deus raramente explica o sofrimento da forma como gostaríamos; Ele nos convida, em vez disso, a confiar em seu caráter mesmo quando seus caminhos permanecem incompreensíveis.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Larry Crabb realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 13:1-2",
                textByVersion: {
                  NVI: "Até quando, Senhor? Vais esquecer-te de mim para sempre? Até quando esconderás de mim o teu rosto?",
                },
              },
              {
                ref: "Mateus 26:39",
                textByVersion: {
                  NVI: "Indo um pouco mais adiante, prostrou-se com o rosto em terra e orou: 'Meu Pai, se é possível, afasta de mim este cálice; contudo, não seja como eu quero, mas como tu queres'.",
                },
              },
            ],
            additionalKeywords: [
              { word: "יָחַל", translit: "yachal", meaning: "'esperar, aguardar com expectativa'. Verbo hebraico usado repetidamente nos Salmos para descrever a espera confiante em Deus mesmo em meio à demora.", lang: "hebraico" },
              { word: "ὑπομονή", translit: "hypomonē", meaning: "'perseverança, resistência paciente sob pressão'. Palavra grega que descreve a capacidade de permanecer firme durante um período prolongado de dificuldade.", lang: "grego" },
            ],
            historicalContext:
              "Os salmos de lamento formam a maior categoria isolada de salmos no Saltério — mais numerosos até que os salmos de louvor puro. Isso mostra que a tradição de oração de Israel sempre reservou espaço legítimo para o clamor honesto diante da dor, sem tratá-lo como falta de fé. A cultura devocional evangélica contemporânea, por vezes, tende a evitar essa linguagem de lamento, preferindo um tom apenas positivo — um desequilíbrio que vale a pena corrigir à luz do próprio Saltério.",
            exegeticalNotes:
              "Em 2 Coríntios 12:8, o verbo grego traduzido como 'roguei' (parakaleō) aparece repetido, reforçando a insistência do pedido de Paulo. A resposta de Deus não nega a legitimidade do pedido — apenas reformula a resposta em torno de um bem maior que o próprio Paulo talvez não pudesse enxergar no momento do pedido.",
            theologicalDebate:
              "Existe uma diferença legítima de ênfase pastoral entre cristãos que buscam ativamente identificar 'lições' específicas por trás de cada período de silêncio de Deus, e outros que preferem reconhecer, com mais humildade, que 'as coisas ocultas pertencem ao Senhor, nosso Deus' (Dt 29:29), sem insistir em uma explicação plenamente satisfatória para cada sofrimento. Ambas as posturas têm base bíblica; o cuidado pastoral necessário é evitar o erro dos amigos de Jó, que presumiram conhecer a causa exata do sofrimento alheio. Em situações pessoais difíceis, é sempre sábio buscar acompanhamento do seu pastor ou líder espiritual.",
            secondQuote: {
              author: "Alister McGrath",
              text: "A fé cristã nunca prometeu respostas completas para o mistério do sofrimento; prometeu, isso sim, um Deus que sofreu conosco na cruz e que permanece fiel mesmo no silêncio.",
            },
          },
          quizzes: [
            {
              question: "O que Deus respondeu a Paulo sobre o 'espinho na carne' (2 Co 12:9)?",
              options: [
                "Que o espinho seria removido imediatamente",
                "Que sua graça é suficiente, e seu poder se aperfeiçoa na fraqueza",
                "Que Paulo não tinha fé suficiente",
                "Que ele deveria parar de pedir",
              ],
              correctIndex: 1,
            },
            {
              question: "O que os salmos de lamento (como o Salmo 13) ensinam sobre orar na dificuldade?",
              options: [
                "Que clamar 'até quando, Senhor?' é sinal de falta de fé",
                "Que é legítimo, bíblico, expressar dor e demora honestamente a Deus",
                "Que só devemos orar quando estamos em paz",
                "Que Deus se ofende com perguntas sinceras",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Se você está enfrentando um silêncio de Deus em alguma área da sua vida, escreva uma oração de lamento honesta, nos moldes do Salmo 13, sem esconder sua dor nem fingir uma paz que ainda não sente.",
          prayer:
            "Senhor, não entendo por que este silêncio persiste, mas escolho confiar no teu caráter mesmo quando não vejo teus caminhos. Sustenta minha fé enquanto espero. Amém.",
          weeklyChallenge:
            "Leia um salmo de lamento por dia esta semana (Salmos 13, 22, 42, 77, 88) e observe como cada um termina — a maioria retorna à confiança em Deus, mesmo sem resolver o problema.",
          reflectionQuestion:
            "Já tratei minha própria dúvida ou dor diante do silêncio de Deus como algo proibido de expressar? O que os salmos de lamento libertam em mim ao ler isso?",
          xp: 30,
        },
        {
          id: "or-4-2",
          title: "Jejum e Oração: Intensificando a Busca por Deus",
          intro: [
            "O jejum bíblico é a prática voluntária de abster-se de alimento (ou de outra necessidade legítima) por um período determinado, com o propósito de intensificar a busca por Deus. Moisés, Elias, Ester, a igreja de Antioquia e o próprio Jesus jejuaram — sempre associando essa disciplina à oração, nunca isolada dela.",
            "Jejuar não é uma técnica para forçar a mão de Deus, nem um mérito espiritual que compra respostas mais rápidas. É, antes, um ato físico que expressa e reforça uma urgência espiritual: 'isto importa tanto para mim que estou disposto a abrir mão até das minhas necessidades básicas para buscar a Deus com mais atenção.'",
            "Jesus adverte contra o jejum performático, feito para impressionar os outros (Mt 6:16-18), e o profeta Isaías denuncia o jejum religioso vazio, que não se traduz em justiça e misericórdia concreta (Is 58). O jejum genuíno é sempre acompanhado de sinceridade de coração.",
          ],
          verses: [
            {
              ref: "Atos 13:2-3",
              textByVersion: {
                NVI: "Enquanto adoravam o Senhor e jejuavam, o Espírito Santo disse: 'Separem-me Barnabé e Saulo para a obra a qual os chamei'. Assim, depois de jejuar, orar e lhes impor as mãos, eles os enviaram.",
              },
            },
            {
              ref: "Mateus 6:16-18",
              textByVersion: {
                NVI: "Quando vocês jejuarem, não fiquem carrancudos como os hipócritas... Mas quando você jejuar, penteie os cabelos e lave o rosto, para que não pareça aos outros que você está jejuando, mas somente a seu Pai, que vê o que é feito em secreto.",
              },
            },
          ],
          keywords: [
            { word: "צוֹם", translit: "tsom", meaning: "'jejum'. Abstenção voluntária de alimento, praticada em Israel em momentos de luto, arrependimento ou busca intensa por direção divina.", lang: "hebraico" },
            { word: "νηστεύω", translit: "nēsteuō", meaning: "'jejuar'. Verbo grego usado nos Evangelhos e em Atos para descrever a prática cristã de abstinência voluntária associada à oração.", lang: "grego" },
          ],
          deepDive:
            "O jejum bíblico nunca aparece isolado — ele sempre acompanha a oração, humilhando o corpo para focar o espírito. Em Atos 13, é durante um período de jejum e adoração que a igreja de Antioquia recebe clareza sobre o chamado missionário de Barnabé e Saulo — um lembrete de que o jejum não força respostas de Deus, mas cria espaço de escuta mais atenta. Ao mesmo tempo, Jesus e os profetas denunciam com força o jejum vazio: ritual sem coração, performance sem transformação de vida. O jejum genuíno é medido não pela duração ou pela dificuldade, mas pela sinceridade e pela mudança de vida que produz.",
          theologianQuote: {
            author: "Richard Foster",
            text: "O jejum revela o que está escondido dentro de nós; quando o estômago se cala, muitas vezes descobrimos o quanto dependíamos de outras coisas além de Deus para nos sentirmos seguros.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Richard Foster realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Isaías 58:6-7",
                textByVersion: {
                  NVI: "Este não é o jejum que escolhi: [...] soltar as correntes da injustiça e desatar as cordas do jugo... É partilhar sua comida com o faminto e abrigar em sua casa o pobre.",
                },
              },
              {
                ref: "Mateus 4:1-2",
                textByVersion: {
                  NVI: "Então Jesus foi levado pelo Espírito ao deserto, para ser tentado pelo Diabo. Depois de jejuar quarenta dias e quarenta noites, teve fome.",
                },
              },
            ],
            additionalKeywords: [
              { word: "עִנָּה", translit: "innah", meaning: "'afligir, humilhar'. Verbo hebraico usado para descrever o ato de 'afligir a alma' associado ao jejum ritual no Dia da Expiação (Lv 16, 23).", lang: "hebraico" },
              { word: "ταπεινόω", translit: "tapeinoō", meaning: "'humilhar-se, abaixar-se voluntariamente'. Verbo grego que descreve a postura de humildade que deveria acompanhar qualquer prática de jejum.", lang: "grego" },
            ],
            historicalContext:
              "O jejum acompanhava momentos-chave da vida de Israel, como o Dia da Expiação e tempos de arrependimento nacional. No período entre os testamentos, práticas de jejum regular (como o jejum semanal dos fariseus) se popularizaram, e Jesus critica não o jejum em si, mas sua distorção performática (Mt 6:16). A igreja primitiva manteve a prática — o Didaquê, manual cristão do início do segundo século, já registra dias fixos de jejum semanal entre os cristãos, associados sempre à oração.",
            exegeticalNotes:
              "Isaías 58 usa uma estrutura retórica de contraste deliberado: o povo pergunta por que Deus não vê seu jejum religioso (v. 3), e Deus responde detalhando o tipo de 'jejum' que realmente lhe agrada — um que se traduz em justiça social concreta. O texto ensina que espiritualidade genuína e ética prática nunca podem ser separadas.",
            theologicalDebate:
              "Tradições evangélicas variam quanto à frequência e ao formato recomendado de jejum — algumas praticam jejuns corporativos regulares como igreja, outras deixam inteiramente à convicção pessoal de cada crente. A Escritura não prescreve uma frequência obrigatória de jejum para o cristão do Novo Testamento (diferente da Lei mosaica para Israel), tornando essa uma questão de prática pessoal, não de doutrina essencial. É importante lembrar que o jejum envolve o corpo, e pessoas com condições de saúde específicas devem buscar orientação médica e conversar com seu pastor antes de praticá-lo, ajustando a forma de buscar a Deus com sinceridade sem colocar sua saúde em risco.",
            secondQuote: {
              author: "Thom Rainer",
              text: "Igrejas e cristãos que reservam tempos de jejum e oração diante de decisões importantes frequentemente relatam maior clareza de discernimento — não porque o jejum manipule Deus, mas porque aquieta o coração para ouvi-lo melhor.",
            },
          },
          quizzes: [
            {
              question: "Segundo Atos 13:2-3, em que contexto a igreja de Antioquia recebeu direção do Espírito Santo sobre Barnabé e Saulo?",
              options: [
                "Durante um culto de celebração",
                "Enquanto adoravam o Senhor e jejuavam",
                "Após uma votação da liderança",
                "Em um sonho de um dos líderes",
              ],
              correctIndex: 1,
            },
            {
              question: "Segundo Isaías 58, qual é o jejum que verdadeiramente agrada a Deus?",
              options: [
                "Apenas a abstenção rigorosa de alimento",
                "Um jejum que se traduz em justiça e cuidado com os necessitados",
                "Jejuns longos, quanto mais dias, melhor",
                "Jejuns feitos publicamente, para que outros vejam",
              ],
              correctIndex: 1,
            },
          ],
          application:
            "Se sua saúde permitir e você sentir isso como um chamado sincero, considere reservar um período breve de jejum (como pular uma refeição) dedicado à oração por uma necessidade específica, conversando antes com seu pastor ou líder se tiver qualquer dúvida ou condição de saúde relevante.",
          prayer:
            "Senhor, ensina-me a buscar-te com todo o meu ser, inclusive com disciplinas que aquietam meu corpo para que meu espírito escute com mais atenção. Que meu jejum, se e quando eu o praticar, seja sincero diante de ti, e nunca um espetáculo diante dos outros. Amém.",
          weeklyChallenge:
            "Leia Isaías 58 inteiro e escreva um parágrafo relacionando jejum, oração e justiça prática — como essas três coisas se conectam na visão de Deus para a espiritualidade do seu povo.",
          reflectionQuestion:
            "Minha espiritualidade tem sido separada da minha ética prática com os necessitados ao meu redor? O que Isaías 58 revela sobre essa possível separação?",
          xp: 30,
        },
        {
          id: "or-4-3",
          title: "Vida Devocional: Construindo um Ritmo Sustentável",
          intro: [
            "Todas as lições anteriores desta trilha ensinaram tipos e disciplinas de oração — adoração, confissão, súplica, intercessão, perseverança no silêncio, jejum. Falta uma última pergunta, talvez a mais prática de todas: como transformar tudo isso em um ritmo diário que resista ao cansaço, à correria e às fases secas da vida, em vez de depender só de motivação passageira?",
            "A Bíblia não prescreve um horário fixo, nem uma duração mínima obrigatória, para o tempo devocional do crente. Mas ela mostra, repetidas vezes, pessoas que separaram um tempo intencional e recorrente para buscar a Deus — não por obrigação religiosa, mas porque entenderam que a alma precisa de alimento regular, assim como o corpo.",
            "Jesus, em meio a uma agenda de multidões, curas e ensino constante, ainda assim se retirava sozinho para orar, de madrugada, antes do dia começar. Se o próprio Filho de Deus, em sua humanidade plena, precisou desse ritmo, seria ingenuidade pensar que nós, discípulos, podemos prescindir dele.",
            "Vida devocional não é uma disciplina a mais na lista — é o solo onde todas as outras disciplinas espirituais criam raiz. Sem ritmo, a oração vira evento ocasional; com ritmo, ela se torna caminho de vida.",
          ],
          verses: [
            {
              ref: "Marcos 1:35",
              textByVersion: {
                NVI: "De madrugada, quando ainda estava escuro, Jesus levantou-se, saiu de casa e foi para um lugar deserto, onde ficou orando.",
              },
              originals: [
                { word: "πρωΐ", translit: "prōi", meaning: "de madrugada, bem cedo", lang: "grego" },
              ],
            },
            {
              ref: "Salmos 5:3",
              textByVersion: {
                NVI: "De manhã, Senhor, ouves a minha voz; de manhã te apresento a minha oração e fico esperando.",
              },
            },
          ],
          keywords: [
            { word: "πρωΐ", translit: "prōi", meaning: "'de madrugada, bem cedo'. Marca o hábito de Jesus de buscar a sós o Pai antes do movimento do dia (Mc 1:35).", lang: "grego" },
            { word: "בֹּקֶר", translit: "boqer", meaning: "'manhã'. Palavra usada no Salmo 5:3 para descrever o ritmo diário de apresentar a oração a Deus e esperar por sua resposta.", lang: "hebraico" },
          ],
          deepDive:
            "É significativo que Marcos registre o horário do encontro de Jesus com o Pai: 'de madrugada, quando ainda estava escuro'. Não foi um acidente de agenda — foi escolha deliberada, feita antes que qualquer pedido, cura ou multidão pudesse disputar sua atenção. O Salmo 5:3 usa duas ideias que parecem simples, mas revelam maturidade: 'apresento' (ação ativa e intencional) e 'fico esperando' (postura de expectativa, não de checklist cumprido). Vida devocional sustentável nasce dessa combinação: disciplina que separa o tempo, e expectativa que transforma esse tempo em encontro real, não em tarefa religiosa marcada e esquecida.",
          theologianQuote: {
            author: "Richard Foster",
            text: "A disciplina espiritual não existe para tornar Deus mais presente — Ele já está presente. Ela existe para nos tornar mais capazes de perceber e responder a essa presença.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Richard Foster realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmos 1:1-2",
                textByVersion: {
                  NVI: "Como é feliz o homem que não anda segundo o conselho dos ímpios... Pois seu prazer está na lei do Senhor, e nessa lei medita dia e noite.",
                },
              },
              {
                ref: "1 Timóteo 4:7-8",
                textByVersion: {
                  NVI: "Exercite-se na piedade. Pois, o exercício físico é de pouco proveito; a piedade, porém, para tudo é proveitosa, porque tem promessa da vida presente e da futura.",
                },
              },
            ],
            additionalKeywords: [
              { word: "γυμνάζω", translit: "gymnazō", meaning: "'exercitar, treinar com disciplina repetida'. Metáfora atlética usada por Paulo para descrever o cultivo da piedade — algo construído com prática constante, não conquistado de uma vez (1 Tm 4:7).", lang: "grego" },
              { word: "הָגָה", translit: "hagah", meaning: "'meditar, murmurar em voz baixa, ruminar'. Descreve a meditação hebraica na Palavra como algo quase físico — repetido em voz baixa até penetrar o coração (Sl 1:2).", lang: "hebraico" },
            ],
            historicalContext:
              "A ideia de um tempo diário reservado para oração e leitura das Escrituras não é invenção da espiritualidade evangélica moderna: já aparece em Daniel, que orava três vezes ao dia mesmo sob risco de morte (Dn 6:10), e foi praticada de forma estruturada pela igreja primitiva, que seguia horas fixas de oração herdadas da sinagoga judaica. Ao longo da história da igreja, tradições monásticas desenvolveram rotinas ainda mais elaboradas; o movimento evangélico simplificou essa herança no que hoje comumente se chama de 'tempo devocional' ou 'quiet time' — pessoal, diário, sem exigir estrutura litúrgica complexa.",
            exegeticalNotes:
              "O verbo hebraico 'hagah' (Sl 1:2), traduzido 'medita', descrevia originalmente um som quase audível — o hábito antigo de repetir um texto em voz baixa até memorizá-lo e absorvê-lo. Isso ajuda a entender que a meditação bíblica descrita nos Salmos não era um exercício silencioso e abstrato, mas uma interação ativa, quase física, com o texto sagrado — bem diferente de técnicas de meditação vazias de conteúdo, preenchidas apenas com repetição sem substância.",
            theologicalDebate:
              "Cristãos fiéis divergem legitimamente sobre o formato ideal do tempo devocional: alguns preferem um horário fixo pela manhã (seguindo o padrão de Jesus em Mc 1:35 e do Salmo 5:3), outros encontram mais frutífero um tempo à noite, ou dividido ao longo do dia. A Escritura não prescreve um horário universal obrigatório — o padrão consistente é a intencionalidade e a regularidade, não um relógio específico. É uma questão de prática pessoal, não de doutrina essencial, e vale a pena buscar orientação do seu discipulador ou líder de célula para encontrar o ritmo que melhor se sustenta na sua rotina real.",
            secondQuote: {
              author: "John Mark Comer",
              text: "Um ritmo de vida com Deus não é sobre encaixar mais uma tarefa religiosa num dia já cheio; é sobre reorganizar o dia inteiro em torno da presença dele.",
            },
          },
          quizzes: [
            {
              question: "O que Marcos 1:35 revela sobre a vida devocional de Jesus?",
              options: [
                "Que ele só orava quando enfrentava alguma crise",
                "Que ele separava intencionalmente um tempo, de madrugada, antes da agenda do dia",
                "Que a oração era desnecessária para ele, por ser Deus",
                "Que ele orava apenas em público, diante das multidões",
              ],
              correctIndex: 1,
              explanation: "Jesus se levantou de madrugada, deliberadamente, para buscar o Pai a sós antes de qualquer outra demanda do dia.",
            },
            {
              question: "Segundo 1 Timóteo 4:7-8, como Paulo descreve o cultivo da piedade?",
              options: [
                "Como algo automático, que não exige esforço",
                "Como um exercício, algo treinado com disciplina repetida",
                "Como irrelevante diante do exercício físico",
                "Como algo reservado apenas a líderes da igreja",
              ],
              correctIndex: 1,
              explanation: "'Gymnazō' é a mesma raiz de onde vem 'ginástica' — Paulo compara a piedade a um treino constante, não a um dom instantâneo.",
            },
          ],
          application:
            "Escolha, esta semana, um horário fixo e realista dentro da sua rotina (não o horário 'ideal' de outra pessoa) para um tempo breve e diário com Deus — leitura de um trecho bíblico e oração. Comece pequeno e sustentável, em vez de ambicioso e abandonável em poucos dias.",
          prayer:
            "Senhor, ensina-me a construir um ritmo de encontro contigo que resista ao cansaço e à correria dos meus dias. Que eu não busque apenas cumprir um horário, mas te encontrar de verdade nele, como Jesus te buscava de madrugada. Amém.",
          weeklyChallenge:
            "Durante 7 dias seguidos, no mesmo horário escolhido, reserve pelo menos 10 minutos só para ler um trecho da Bíblia e orar. Anote no diário, ao final da semana, o que mudou — mesmo que pareça pouco.",
          reflectionQuestion:
            "O que tem impedido minha vida devocional de ser constante — falta de tempo real, falta de prioridade, ou expectativas exageradas demais para começar pequeno?",
          xp: 30,
        },
      ],
    },
  ],
};

export const additionalTrails: Trail[] = [comoEstudarBiblia, oracao];
