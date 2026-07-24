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
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Um homem que só ora e não estuda a Bíblia se torna emocionalmente devoto e teologicamente cego; um homem que só estuda e não ora se torna orgulhoso. Estudar e orar precisam andar de mãos dadas.",
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
