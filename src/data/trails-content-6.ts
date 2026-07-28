// Trilha "Vida Cristã" (Módulo 8) — a fé vivida no cotidiano: devoção pessoal,
// trabalho, dinheiro, relacionamentos, testemunho e caráter.
import type { Trail } from "./content";

const vidaCrista: Trail = {
  id: "vida-crista",
  title: "Vida Cristã",
  description: "Fé que se vive todos os dias: devoção, trabalho, dinheiro, relacionamentos e caráter.",
  icon: "Footprints",
  color: "from-teal-500 to-emerald-600",
  order: 8,
  modules: [
    {
      id: "vc-mod-1",
      title: "Vida Devocional",
      lessons: [
        {
          id: "vc-1-1",
          title: "A prática diária da Palavra",
          difficulty: 1,
          intro: [
            "Todo cristão quer crescer, mas crescimento espiritual não acontece por acidente. Ele nasce de um hábito simples e repetido: voltar à Palavra de Deus, dia após dia, não como obrigação religiosa, mas como alimento para a alma.",
            "Nesta lição vamos olhar para Salmos 1, o retrato bíblico da pessoa que prospera espiritualmente — e o segredo não é talento, nem intensidade emocional, mas constância.",
          ],
          verses: [
            {
              ref: "Salmos 1:2-3",
              textByVersion: {
                NVI: "Em vez disso, seu prazer está na lei do Senhor, e nela medita dia e noite. É como árvore plantada à beira de um ribeiro, que dá fruto no tempo certo, e cujas folhas nunca murcham. Tudo o que ele faz prospera.",
              },
              originals: [
                { word: "הָגָה", translit: "hagah", meaning: "meditar, murmurar em voz baixa, remoer repetidamente", lang: "hebraico" },
              ],
            },
            {
              ref: "Josué 1:8",
              textByVersion: {
                NVI: "Não deixe de falar as palavras deste Livro; medite nelas de dia e de noite, para que você tenha cuidado de agir segundo tudo o que nele está escrito; assim você prosperará e será bem-sucedido em tudo.",
              },
            },
          ],
          keywords: [
            { word: "הָגָה", translit: "hagah", meaning: "meditar — literalmente, murmurar algo repetidamente em voz baixa, como quem rumina uma ideia até ela se tornar parte de si", lang: "hebraico" },
          ],
          deepDive:
            "A palavra hebraica por trás de 'medita' (hagah) não descreve um exercício intelectual distante, mas algo mais físico e repetitivo — a imagem é de alguém murmurando um texto em voz baixa, várias vezes, até que ele penetre na memória e no coração. É a diferença entre ler um versículo rapidamente pela manhã e verdadeiramente deixá-lo ecoar dentro de você ao longo do dia. O salmista não promete uma vida sem dificuldades a quem faz isso — a árvore plantada à beira do ribeiro ainda enfrenta seca, vento e estações difíceis. O que a raiz profunda garante não é ausência de provação, mas estabilidade em meio a ela. A vida devocional diária não é sobre performance espiritual; é sobre manter a raiz da alma conectada à fonte.",
          theologianQuote: {
            author: "Richard Foster",
            text: "As disciplinas espirituais existem para nos colocar diante de Deus — não para impressioná-lo, mas para nos abrir à sua transformação. (paráfrase da ênfase central de sua obra sobre disciplinas espirituais)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Richard Foster realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Salmos 1, o que caracteriza a pessoa que verdadeiramente prospera espiritualmente?",
              options: [
                "Nunca enfrentar dificuldades",
                "Ter constância em meditar na Palavra de Deus",
                "Ter grande conhecimento teológico",
                "Ser reconhecida publicamente por sua fé",
              ],
              correctIndex: 1,
              explanation: "O salmo descreve alguém cujo prazer e constância estão na lei do Senhor — não alguém livre de provações, mas alguém com raízes profundas.",
            },
            {
              question: "O termo hebraico 'hagah' (meditar) sugere principalmente:",
              options: [
                "Um estudo acadêmico rápido",
                "Repetição e ruminação da Palavra até que ela penetre no coração",
                "Uma experiência emocional intensa e pontual",
                "Memorização mecânica sem reflexão",
              ],
              correctIndex: 1,
              explanation: "Hagah tem o sentido de murmurar ou remoer algo repetidamente — um processo lento, não um evento único.",
            },
          ],
          application:
            "Escolha um horário fixo do seu dia — mesmo que sejam apenas 10 minutos — para ler e meditar na Palavra. O objetivo não é ler muito, mas voltar ao mesmo hábito todos os dias até que ele se torne parte de quem você é.",
          prayer:
            "Senhor, dá-me fome pela tua Palavra todos os dias. Que eu não a trate como obrigação, mas como a fonte que sustenta minha alma. Ajuda-me a ser constante, mesmo quando não sentir vontade. Amém.",
          weeklyChallenge:
            "Durante 7 dias seguidos, leia o mesmo pequeno trecho bíblico (por exemplo, um salmo curto) todas as manhãs, e anote uma frase por dia sobre o que Deus foi te mostrando.",
          reflectionQuestion:
            "Que obstáculo mais frequentemente te impede de ter um tempo diário com Deus — e o que poderia mudar isso essa semana?",
          xp: 25,
        },
        {
          id: "vc-1-2",
          title: "Oração como estilo de vida",
          difficulty: 1,
          intro: [
            "Muitos cristãos entendem oração como um pedido emergencial — algo que se faz quando surge um problema. Mas o Novo Testamento descreve oração como um ritmo contínuo de vida, não um botão de emergência.",
            "Vamos ver o que significa, na prática, 'orar continuamente', sem cair no legalismo de achar que é preciso estar de joelhos o dia inteiro.",
          ],
          verses: [
            {
              ref: "1 Tessalonicenses 5:16-18",
              textByVersion: {
                NVI: "Estejam sempre alegres, orem continuamente, deem graças em todas as circunstâncias, pois esta é a vontade de Deus para vocês em Cristo Jesus.",
              },
              originals: [
                { word: "ἀδιαλείπτως", translit: "adialeíptōs", meaning: "sem interrupção, continuamente, sem deixar de fazer", lang: "grego" },
              ],
            },
            {
              ref: "Efésios 6:18",
              textByVersion: {
                NVI: "Orem no Espírito em todas as ocasiões, com todo tipo de oração e súplica. Para isso, estejam atentos e sejam perseverantes em suas orações por todos os santos.",
              },
            },
          ],
          keywords: [
            { word: "ἀδιαλείπτως", translit: "adialeíptōs", meaning: "sem cessar — usado na época para descrever uma tosse persistente ou um ataque militar contínuo; a ideia é de algo recorrente, não ininterrupto no sentido literal", lang: "grego" },
          ],
          deepDive:
            "A palavra grega adialeíptōs, traduzida como 'continuamente', não significa que Paulo esperava que os tessalonicenses ficassem em silêncio orando 24 horas por dia — isso seria impossível para pessoas que também trabalhavam e cuidavam de famílias. Fora do Novo Testamento, o termo era usado, por exemplo, para descrever uma tosse recorrente: algo que volta repetidamente, em intervalos, não algo que nunca para de acontecer nem por um segundo. A ideia é de um padrão de vida em que a oração é retomada repetidamente ao longo do dia — no trabalho, no trânsito, antes de decisões pequenas — e não apenas reservada para momentos de crise ou para o culto de domingo. Orar 'continuamente' é manter um diálogo aberto com Deus como pano de fundo de toda a vida, não uma atividade isolada.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "A oração é a respiração da alma — assim como respiramos sem parar para pensar nisso, o cristão maduro aprende a orar como parte natural de viver. (paráfrase de uma ênfase recorrente em suas pregações sobre oração)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Spurgeon realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "O termo grego 'adialeíptōs' ('continuamente'), usado em 1 Tessalonicenses 5:17, sugere principalmente:",
              options: [
                "Ficar em silêncio orando sem parar, 24 horas por dia",
                "Um padrão recorrente de oração ao longo do dia, como algo que se repete várias vezes",
                "Orar apenas em momentos de emergência",
                "Uma oração longa feita uma vez por semana",
              ],
              correctIndex: 1,
              explanation: "O termo era usado para descrever algo recorrente (como uma tosse), não algo ininterrupto no sentido literal.",
            },
            {
              question: "Qual é o risco de reduzir a oração a um 'botão de emergência'?",
              options: [
                "Nenhum — é assim que a Bíblia ensina a orar",
                "Perder a intimidade contínua com Deus e tratar a oração como recurso só para crises",
                "Orar demais e se tornar legalista",
                "Ficar dependente demais de Deus",
              ],
              correctIndex: 1,
              explanation: "O padrão bíblico é de diálogo contínuo com Deus, não apenas recorrer a Ele quando surge um problema.",
            },
          ],
          application:
            "Escolha três momentos fixos do seu dia (ex: ao acordar, no almoço, antes de dormir) para pausar e orar brevemente — mesmo que sejam apenas 1-2 minutos cada. O objetivo é criar o hábito de retomar a conversa com Deus repetidamente, não apenas em crises.",
          prayer:
            "Pai, ensina-me a orar como quem respira — sem que isso seja um fardo, mas parte natural do meu dia. Que eu não te procure apenas quando algo dá errado, mas em cada momento comum. Amém.",
          weeklyChallenge:
            "Defina um lembrete no celular para tocar 3 vezes ao dia essa semana. Cada vez que tocar, pare por 30 segundos e ore — mesmo que seja uma frase curta.",
          reflectionQuestion:
            "Sua oração hoje é mais parecida com um 'botão de emergência' ou com uma conversa contínua? O que poderia mudar isso?",
          xp: 25,
        },
      ],
    },
    {
      id: "vc-mod-2",
      title: "Trabalho e Mordomia",
      lessons: [
        {
          id: "vc-2-1",
          title: "Trabalho como vocação",
          difficulty: 2,
          intro: [
            "Para muita gente, trabalho é apenas o que se faz para pagar as contas — algo separado da 'vida espiritual de verdade'. Mas a Bíblia começa com Deus trabalhando (criando) e colocando o ser humano para trabalhar antes mesmo do pecado entrar no mundo.",
            "Isso muda tudo: trabalho não é maldição nem necessidade neutra — é vocação, um lugar onde servimos a Deus e ao próximo.",
          ],
          verses: [
            {
              ref: "Gênesis 2:15",
              textByVersion: {
                NVI: "O Senhor Deus pôs o homem no jardim do Éden para cultivá-lo e cuidar dele.",
              },
              originals: [
                { word: "עָבַד", translit: "avad", meaning: "trabalhar, cultivar, servir — a mesma raiz usada para 'servir a Deus'", lang: "hebraico" },
              ],
            },
            {
              ref: "Colossenses 3:23-24",
              textByVersion: {
                NVI: "Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens, sabendo que receberão do Senhor a recompensa da herança. É a Cristo, o Senhor, que vocês estão servindo.",
              },
            },
          ],
          keywords: [
            { word: "עָבַד", translit: "avad", meaning: "a mesma palavra hebraica é usada tanto para 'trabalhar/cultivar a terra' quanto para 'servir/adorar a Deus' — no pensamento bíblico, trabalho comum e adoração não são categorias separadas", lang: "hebraico" },
          ],
          deepDive:
            "É significativo que a mesma raiz hebraica (avad) usada em Gênesis 2:15 para 'cultivar' o jardim seja a mesma usada, em outras partes do Antigo Testamento, para 'servir' ou 'adorar' a Deus. Isso revela algo profundo: no pensamento bíblico original, não existe uma linha divisória entre trabalho 'secular' e vida espiritual 'de verdade'. Adão foi colocado para trabalhar antes da Queda — trabalho não é castigo, é parte do propósito humano desde o princípio, um reflexo da própria natureza criativa de Deus. O que a Queda trouxe (Gênesis 3:17-19) foi a frustração e o suor do trabalho, não o trabalho em si. Colossenses reforça isso no Novo Testamento: qualquer trabalho, feito de todo o coração, é servido 'como para o Senhor' — o que muda não é a tarefa, mas para quem ela é feita.",
          theologianQuote: {
            author: "Tim Keller",
            text: "O trabalho é uma das formas pelas quais amamos ao próximo e servimos a Deus — não é um mal necessário separado da vida espiritual. (paráfrase de sua ênfase central sobre trabalho e vocação em 'Toda Boa Obra')",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Tim Keller realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Gênesis 2:15, quando Deus colocou o homem para trabalhar no jardim?",
              options: [
                "Como punição, depois da Queda",
                "Antes da Queda, como parte do propósito original da criação",
                "Somente depois do dilúvio",
                "A Bíblia não especifica quando isso aconteceu",
              ],
              correctIndex: 1,
              explanation: "O trabalho antecede o pecado — ele é parte do propósito original de Deus para a humanidade, não uma consequência da Queda.",
            },
            {
              question: "O que Colossenses 3:23 ensina sobre a motivação para o trabalho?",
              options: [
                "Trabalhar apenas o suficiente para não ser demitido",
                "Fazer tudo de todo o coração, como serviço ao Senhor, e não apenas aos homens",
                "O trabalho secular não tem valor espiritual",
                "Só o trabalho na igreja conta como serviço a Deus",
              ],
              correctIndex: 1,
              explanation: "Paulo instrui que qualquer trabalho seja feito 'como para o Senhor' — a motivação e a excelência do serviço são o que importa, não apenas a tarefa em si.",
            },
          ],
          application:
            "Escolha uma tarefa do seu trabalho ou estudo que você costuma fazer com desânimo, e essa semana faça-a conscientemente 'como para o Senhor' — com excelência e atenção, independente de quem está observando.",
          prayer:
            "Senhor, ajuda-me a enxergar meu trabalho como um lugar de serviço a ti, e não apenas como obrigação. Dá-me excelência e propósito nas tarefas mais simples do meu dia. Amém.",
          weeklyChallenge:
            "No fim de cada dia de trabalho ou estudo desta semana, anote uma forma concreta em que seu trabalho serviu ou beneficiou outra pessoa — mesmo que pequena.",
          reflectionQuestion:
            "Você costuma separar 'vida espiritual' de 'vida profissional'? Como seria trabalhar essa semana lembrando que Cristo é quem você está servindo?",
          xp: 30,
        },
        {
          id: "vc-2-2",
          title: "Mordomia financeira e generosidade",
          difficulty: 2,
          intro: [
            "Dinheiro é um dos assuntos que Jesus mais falou nos Evangelhos — mais do que céu e inferno juntos. Isso porque a forma como lidamos com dinheiro revela, de forma muito concreta, onde está nosso coração.",
            "Nesta lição vamos ver o que a Bíblia ensina sobre mordomia — a ideia de que tudo o que temos pertence a Deus, e nós somos apenas administradores.",
          ],
          verses: [
            {
              ref: "2 Coríntios 9:7",
              textByVersion: {
                NVI: "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.",
              },
              originals: [
                { word: "ἱλαρός", translit: "hilarós", meaning: "alegre, contente, disposto — raiz da palavra portuguesa 'hilário/hilariante'", lang: "grego" },
              ],
            },
            {
              ref: "Malaquias 3:10",
              textByVersion: {
                NVI: "Tragam o dízimo integral ao depósito do templo, para que haja alimento em minha casa. Ponham-me à prova, e vejam se não vou abrir as comportas dos céus e derramar bênção sem medida sobre vocês.",
              },
            },
          ],
          keywords: [
            { word: "ἱλαρός", translit: "hilarós", meaning: "alegre, contente — a mesma raiz da palavra 'hilariante'; Paulo não pede apenas generosidade, mas generosidade genuinamente alegre, não forçada", lang: "grego" },
          ],
          deepDive:
            "A palavra grega hilarós (de onde vem 'hilário/hilariante') descreve algo mais do que apenas 'não relutante' — é a ideia de alegria genuína, quase contagiante. Paulo está dizendo que Deus não está interessado apenas na quantidade que damos, mas na disposição do coração por trás da doação. Isso é coerente com o ensino do Antigo Testamento sobre o dízimo em Malaquias — um chamado à confiança prática de que Deus supre as necessidades de quem o honra primeiro com seus recursos. É importante notar que a mordomia bíblica vai além do dízimo: é o reconhecimento de que 100% do que temos — não apenas 10% — pertence a Deus, e o dízimo/oferta é uma expressão concreta e treinável dessa verdade maior, não o teto da generosidade cristã.",
          theologianQuote: {
            author: "John Wesley",
            text: "Ganhe tudo que puder, poupe tudo que puder, dê tudo que puder.",
            source: "Sermão 'The Use of Money'",
          },
          quizzes: [
            {
              question: "Segundo 2 Coríntios 9:7, o que Deus valoriza na forma de dar?",
              options: [
                "Apenas o valor total doado",
                "Que seja feito com alegria, não por pesar ou obrigação",
                "Que seja sempre em segredo absoluto",
                "Que seja anunciado publicamente para incentivar outros",
              ],
              correctIndex: 1,
              explanation: "Paulo enfatiza a disposição do coração — Deus ama quem dá 'hilarós', com alegria genuína, não por pressão.",
            },
            {
              question: "A mordomia bíblica ensina principalmente que:",
              options: [
                "O dízimo é o teto máximo da generosidade cristã",
                "Tudo o que temos pertence a Deus, e somos administradores, não donos",
                "Dinheiro é espiritualmente neutro e não tem relação com fé",
                "Apenas líderes de igreja precisam se preocupar com mordomia",
              ],
              correctIndex: 1,
              explanation: "A mordomia reconhece que 100% dos recursos pertencem a Deus — o dízimo/oferta é uma expressão prática disso, não o limite da generosidade.",
            },
          ],
          application:
            "Revise seus gastos do último mês e identifique uma área onde você poderia ser mais generoso — com a igreja, com alguém em necessidade, ou com uma causa que honra a Deus. Dê um passo concreto essa semana.",
          prayer:
            "Senhor, tudo o que tenho vem de ti. Ajuda-me a administrar meus recursos com sabedoria e a dar com alegria, confiando que tu supres minhas necessidades. Livra-me da ganância e do apego ao dinheiro. Amém.",
          weeklyChallenge:
            "Pratique uma generosidade específica e planejada essa semana — separe um valor, por menor que seja, para dar a alguém ou a uma causa, e faça isso conscientemente como ato de adoração.",
          reflectionQuestion:
            "Quando você pensa em dar (tempo, dinheiro, recursos), a primeira reação do seu coração é alegria ou peso? O que isso revela?",
          xp: 30,
        },
      ],
    },
    {
      id: "vc-mod-3",
      title: "Relacionamentos e Testemunho",
      lessons: [
        {
          id: "vc-3-1",
          title: "Amor ao próximo no dia a dia",
          difficulty: 2,
          intro: [
            "É fácil declarar que amamos ao próximo em teoria. O teste real acontece nos detalhes pequenos e repetitivos da convivência: paciência no trânsito, tolerância com um colega difícil, gentileza quando estamos cansados.",
            "Jesus disse que o amor entre os discípulos seria o principal sinal visível de que pertencemos a ele — não nosso conhecimento bíblico, nem nossa aparência religiosa.",
          ],
          verses: [
            {
              ref: "João 13:34-35",
              textByVersion: {
                NVI: "Um novo mandamento dou a vocês: Amem-se uns aos outros. Como eu os amei, assim também vocês devem amar uns aos outros. Nisto todos saberão que vocês são meus discípulos, se vocês se amarem uns aos outros.",
              },
              originals: [
                { word: "ἀγάπη", translit: "agápē", meaning: "amor de doação, comprometido e voluntário — não um sentimento passageiro, mas uma escolha da vontade", lang: "grego" },
              ],
            },
            {
              ref: "1 Coríntios 13:4-5",
              textByVersion: {
                NVI: "O amor é paciente, é bondoso. O amor não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.",
              },
            },
          ],
          keywords: [
            { word: "ἀγάπη", translit: "agápē", meaning: "diferente de 'philía' (amor de amizade/afeto) ou 'éros' (amor romântico), agápē no Novo Testamento descreve um amor de compromisso e ação, que independe de a outra pessoa 'merecer'", lang: "grego" },
          ],
          deepDive:
            "O grego tinha várias palavras para 'amor' — philía (amizade), éros (paixão romântica), storgē (afeto familiar) — mas o Novo Testamento escolhe consistentemente agápē para descrever o amor cristão. Essa escolha não é acidental: agápē descreve um amor que se origina na vontade, não apenas no sentimento — um compromisso de buscar o bem do outro mesmo quando isso é custoso ou o outro não corresponde. É por isso que 1 Coríntios 13 descreve o amor com verbos de ação ('é paciente', 'não se ira facilmente'), não com adjetivos de sentimento. Jesus eleva esse amor a marca distintiva dos seus discípulos — não porque amor seja fácil, mas porque é precisamente nos relacionamentos do dia a dia, com pessoas imperfeitas, que a realidade da transformação do Evangelho se torna visível ao mundo.",
          theologianQuote: {
            author: "C.S. Lewis",
            text: "O amor cristão não começa como um sentimento — ele nasce como um ato da vontade que, com o tempo, transforma também o sentimento. (paráfrase de sua reflexão sobre caridade em 'Cristianismo Puro e Simples')",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se C.S. Lewis realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo João 13:35, qual é o principal sinal visível de que alguém é discípulo de Jesus?",
              options: [
                "Profundo conhecimento teológico",
                "O amor entre os discípulos",
                "Frequência aos cultos",
                "Milagres e sinais visíveis",
              ],
              correctIndex: 1,
              explanation: "Jesus identifica o amor mútuo entre os discípulos — não conhecimento ou performance religiosa — como o sinal mais visível de pertencer a ele.",
            },
            {
              question: "A palavra grega 'agápē' se diferencia de outras palavras gregas para amor porque:",
              options: [
                "Descreve apenas sentimentos passageiros",
                "É um amor de compromisso e ação da vontade, não dependente de a outra pessoa merecer",
                "Só pode existir entre membros da mesma família",
                "É sinônimo exato de 'philía' (amizade)",
              ],
              correctIndex: 1,
              explanation: "Agápē descreve um amor de escolha e ação, voltado ao bem do outro, e não apenas um sentimento emocional espontâneo.",
            },
          ],
          application:
            "Identifique uma pessoa com quem a convivência tem sido difícil essa semana (um familiar, colega, vizinho) e pratique conscientemente um ato concreto de paciência ou gentileza com ela, mesmo sem sentir vontade.",
          prayer:
            "Senhor, ensina-me a amar como tu amas — não apenas com sentimento, mas com ações concretas de paciência e bondade, especialmente com quem é difícil de amar. Transforma meu coração. Amém.",
          weeklyChallenge:
            "Escolha uma pessoa por dia, durante 5 dias, e faça algo intencional para demonstrar amor prático a ela (uma palavra de encorajamento, um gesto de ajuda, um momento de escuta atenta).",
          reflectionQuestion:
            "Existe alguém na sua vida com quem amar 'como Cristo amou' parece particularmente difícil agora? O que isso revela sobre onde você precisa crescer?",
          xp: 30,
        },
        {
          id: "vc-3-2",
          title: "Testemunho cristão no trabalho e nos estudos",
          difficulty: 2,
          intro: [
            "Boa parte da nossa vida acontece fora da igreja — no trabalho, na escola, na faculdade, entre pessoas que talvez nunca pisem num culto. É ali que nosso testemunho cristão é testado de forma mais concreta.",
            "Vamos ver o que a Bíblia ensina sobre viver e falar do Evangelho nesses espaços comuns, sem sermos nem omissos nem inconvenientes.",
          ],
          verses: [
            {
              ref: "Mateus 5:16",
              textByVersion: {
                NVI: "Assim brilhe a luz de vocês diante dos homens, para que vejam as suas boas obras e glorifiquem ao Pai de vocês, que está nos céus.",
              },
              originals: [
                { word: "μαρτυρία", translit: "martyría", meaning: "testemunho, evidência dada por alguém que viu ou experimentou algo — raiz da palavra 'mártir'", lang: "grego" },
              ],
            },
            {
              ref: "1 Pedro 3:15",
              textByVersion: {
                NVI: "Antes, santifiquem Cristo como Senhor em seu coração, estando sempre preparados para responder a qualquer pessoa que pedir a razão da esperança que há em vocês. Contudo, façam isso com mansidão e respeito.",
              },
            },
          ],
          keywords: [
            { word: "μαρτυρία", translit: "martyría", meaning: "testemunho — a mesma raiz de onde vem 'mártir': alguém cuja vida (e às vezes morte) é a própria evidência daquilo que professa", lang: "grego" },
          ],
          deepDive:
            "É significativo que a palavra grega para 'testemunho' (martyría) tenha dado origem, mais tarde, à palavra 'mártir' — alguém cuja vida inteira (não apenas suas palavras) se torna evidência do que professa. Isso ilumina o que Pedro pede em 1 Pedro 3:15: estar 'preparado para responder', mas com 'mansidão e respeito' — testemunho cristão não é debate agressivo nem sermão forçado, é uma vida consistente que gera perguntas genuínas, seguida de uma resposta humilde quando questionada. Mateus 5:16 reforça a mesma lógica: a 'luz' que atrai as pessoas a glorificar a Deus não é um discurso brilhante, mas boas obras visíveis e consistentes. Testemunho eficaz normalmente combina os dois: uma vida que gera credibilidade, e uma prontidão gentil para explicar a razão da esperança quando perguntado.",
          theologianQuote: {
            author: "John Stott",
            text: "Nosso testemunho é mais convincente quando a coerência entre o que vivemos e o que cremos desperta a pergunta que abre a porta para falarmos de Cristo. (paráfrase de sua ênfase sobre evangelismo e integridade de vida)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Stott realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo 1 Pedro 3:15, como devemos responder quando alguém pergunta sobre nossa fé?",
              options: [
                "Evitando o assunto para não causar constrangimento",
                "Com mansidão e respeito, estando preparados para explicar nossa esperança",
                "Apenas se a pessoa já for cristã",
                "De forma agressiva, para deixar claro que estamos certos",
              ],
              correctIndex: 1,
              explanation: "Pedro pede prontidão para responder, mas com mansidão e respeito — não agressividade nem omissão.",
            },
            {
              question: "A raiz grega de 'testemunho' (martyría), que originou a palavra 'mártir', sugere que testemunho cristão é, antes de tudo:",
              options: [
                "Um discurso teológico bem argumentado",
                "Uma vida inteira que serve de evidência viva daquilo que se professa",
                "Uma atividade reservada apenas a pastores e evangelistas",
                "Um evento único e pontual, como uma palestra",
              ],
              correctIndex: 1,
              explanation: "A ideia de martyría é de uma vida (não só um discurso) que se torna evidência viva da fé professada.",
            },
          ],
          application:
            "No seu ambiente de trabalho ou estudo, escolha uma atitude concreta essa semana (honestidade num detalhe pequeno, gentileza incomum, integridade sob pressão) que possa, silenciosamente, tornar-se testemunho — sem anunciar que está 'fazendo isso por ser cristão'.",
          prayer:
            "Senhor, que minha vida no trabalho e nos estudos seja coerente com o que professo. Dá-me sabedoria para falar de ti com mansidão quando for perguntado, e integridade para que minhas ações não desmintam minhas palavras. Amém.",
          weeklyChallenge:
            "Observe se, ao longo da semana, alguém faz um comentário ou pergunta sobre algo diferente na sua atitude ou seus valores — e esteja pronto para, com humildade, apontar para Cristo como a razão.",
          reflectionQuestion:
            "Se colegas de trabalho ou estudo tivessem que descrever seu caráter sem saber que você é cristão, o que eles diriam? Isso é coerente com o Evangelho que você professa?",
          xp: 30,
        },
      ],
    },
    {
      id: "vc-mod-4",
      title: "Caráter e Santidade Prática",
      lessons: [
        {
          id: "vc-4-1",
          title: "Vencendo a tentação",
          difficulty: 3,
          intro: [
            "Todo cristão enfrenta tentação — isso não é sinal de fraqueza espiritual nem motivo de vergonha em si mesmo, é parte da experiência humana, inclusive a de Jesus (Hebreus 4:15). O que importa é como lidamos com ela.",
            "A Bíblia oferece tanto uma promessa quanto um diagnóstico honesto sobre como a tentação funciona — e ambos são essenciais para vivermos com mais liberdade.",
          ],
          verses: [
            {
              ref: "1 Coríntios 10:13",
              textByVersion: {
                NVI: "Não sobreveio a vocês tentação que não fosse comum aos homens. Mas Deus é fiel; ele não permitirá que vocês sejam tentados além do que podem suportar. Mas, quando forem tentados, ele lhes proverá um escape, para que o possam suportar.",
              },
              originals: [
                { word: "πειρασμός", translit: "peirasmós", meaning: "tentação, prova, teste — o mesmo termo pode descrever tanto uma provação que fortalece quanto uma tentação para pecar", lang: "grego" },
              ],
            },
            {
              ref: "Tiago 1:14-15",
              textByVersion: {
                NVI: "Cada um é tentado quando atraído e seduzido por sua própria cobiça. Depois, quando a cobiça concebe, dá à luz o pecado; e o pecado, quando consumado, gera a morte.",
              },
            },
          ],
          keywords: [
            { word: "πειρασμός", translit: "peirasmós", meaning: "o mesmo substantivo grego é traduzido tanto como 'tentação' quanto 'prova/teste' dependendo do contexto — a mesma experiência pode fortalecer ou derrubar, dependendo da resposta da pessoa", lang: "grego" },
          ],
          deepDive:
            "É revelador que a mesma palavra grega, peirasmós, seja traduzida às vezes como 'tentação' (algo que busca nos fazer pecar) e outras vezes como 'prova' ou 'teste' (algo que, enfrentado com fé, nos fortalece — como em Tiago 1:2-3). A diferença não está na experiência em si, mas em como respondemos a ela. Tiago 1:14-15 descreve o processo com precisão quase clínica: tentação começa com um desejo interno (não vem de Deus, v.13), que, se alimentado ('concebe'), produz o ato pecaminoso, que, por sua vez, leva à morte espiritual. Isso significa que o momento decisivo geralmente não é o ato final, mas a decisão inicial de alimentar ou não o desejo. A promessa de 1 Coríntios 10:13 não é ausência de tentação, mas a garantia de que ela nunca ultrapassa o que, com a ajuda de Deus, podemos suportar — e que sempre existe uma 'saída' (o termo grego sugere uma passagem de fuga, como um desfiladeiro), se estivermos dispostos a procurá-la.",
          theologianQuote: {
            author: "Charles Swindoll",
            text: "Entre o estímulo e a resposta existe um espaço — e nesse espaço está nossa liberdade de escolher a saída que Deus já preparou. (paráfrase de sua ênfase pastoral sobre atitude e escolha diante da tentação)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Swindoll realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo 1 Coríntios 10:13, o que Deus promete diante da tentação?",
              options: [
                "Que o cristão nunca mais será tentado",
                "Que a tentação nunca ultrapassará o que podemos suportar, e sempre haverá uma saída",
                "Que a tentação é sempre culpa exclusivamente do Diabo",
                "Que apenas cristãos fracos são tentados",
              ],
              correctIndex: 1,
              explanation: "A promessa não é ausência de tentação, mas um limite ('além do que podem suportar') e uma saída sempre disponível.",
            },
            {
              question: "Segundo Tiago 1:14-15, onde geralmente começa o processo que leva ao pecado?",
              options: [
                "Diretamente de Deus, que testa as pessoas com o mal",
                "No próprio desejo interno da pessoa, quando alimentado",
                "Sempre por influência direta e visível de outra pessoa",
                "O texto não explica a origem da tentação",
              ],
              correctIndex: 1,
              explanation: "Tiago deixa claro que a tentação nasce do próprio desejo interno (não de Deus), que, se alimentado, gera o pecado.",
            },
          ],
          application:
            "Identifique um padrão de tentação recorrente na sua vida e, em vez de esperar o momento da tentação para decidir, planeje agora, com antecedência, qual será sua 'saída' concreta (evitar um gatilho específico, ligar para um amigo, se afastar de uma situação).",
          prayer:
            "Senhor, tu conheces minhas fraquezas e os padrões de tentação que mais me derrubam. Ajuda-me a reconhecer o desejo antes que ele cresça, e dá-me olhos para enxergar a saída que já preparaste. Amém.",
          weeklyChallenge:
            "Escreva num papel (ou app de notas) qual é sua principal área de luta com tentação hoje, e uma saída prática e específica para a próxima vez que ela surgir. Releia isso diariamente essa semana.",
          reflectionQuestion:
            "Existe algum padrão de tentação em que você geralmente espera até o último momento para reagir? O que mudaria se você decidisse a 'saída' com antecedência?",
          xp: 35,
        },
        {
          id: "vc-4-2",
          title: "Fruto do Espírito no cotidiano",
          difficulty: 3,
          intro: [
            "Ao listar as características do caráter transformado por Deus, Paulo escolhe uma palavra curiosa: não 'frutos' (no plural), mas 'fruto' (no singular) do Espírito. Essa escolha de palavras carrega um ensino importante para nossa vida diária.",
            "Vamos entender por que caráter cristão não é uma lista de itens para escolher, mas um conjunto orgânico que cresce junto — e como isso se conecta a permanecer em Cristo.",
          ],
          verses: [
            {
              ref: "Gálatas 5:22-23",
              textByVersion: {
                NVI: "Mas o fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio. Contra essas coisas não há lei.",
              },
              originals: [
                { word: "καρπός", translit: "karpós", meaning: "fruto — no singular, sugerindo um único produto orgânico e integrado, não uma lista de itens separados", lang: "grego" },
              ],
            },
            {
              ref: "João 15:5",
              textByVersion: {
                NVI: "Eu sou a videira, vocês são os ramos. Se alguém permanecer em mim e eu nele, esse dará muito fruto; pois sem mim vocês não podem fazer coisa alguma.",
              },
            },
          ],
          keywords: [
            { word: "καρπός", translit: "karpós", meaning: "fruto, no singular — em contraste com 'dons' (charísmata, sempre no plural em 1 Coríntios 12), o caráter é descrito como um único fruto orgânico e indivisível", lang: "grego" },
          ],
          deepDive:
            "É teologicamente significativo que Paulo escolha o singular karpós ('fruto', não 'frutos') em Gálatas 5:22-23 — em contraste direto com os 'dons' espirituais (charísmata), que ele sempre descreve no plural, como itens distribuídos diferentemente a cada pessoa (1 Coríntios 12:4-11). A implicação é que o caráter cristão não funciona como um cardápio onde escolhemos ter 'mais paciência' e 'menos amabilidade' — é um único fruto orgânico, e onde há vida genuína do Espírito, as nove qualidades crescem juntas, ainda que em ritmos diferentes conforme a personalidade e a história de cada um. E de onde vem esse fruto? João 15:5 responde: de permanecer na videira. Fruto não é produzido por esforço isolado de tentar 'ser mais paciente' através de força de vontade, mas é o resultado natural de uma vida genuinamente conectada a Cristo — assim como um ramo não se esforça para produzir fruto, ele simplesmente frutifica quando está ligado à videira.",
          theologianQuote: {
            author: "John Wesley",
            text: "A santidade não é um conjunto de regras externas a cumprir, mas o fruto natural de um coração verdadeiramente unido a Cristo pela graça. (paráfrase de sua ênfase sobre santificação progressiva e os meios da graça)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Wesley realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Por que Paulo usa a palavra 'fruto' no singular em Gálatas 5:22-23, e não 'frutos' no plural?",
              options: [
                "Foi apenas uma escolha estilística sem significado teológico",
                "Para sugerir que o caráter cristão cresce como um conjunto orgânico e integrado, não itens escolhidos separadamente",
                "Porque só existe uma característica de caráter que realmente importa",
                "Para diferenciar do Antigo Testamento, que usava o plural",
              ],
              correctIndex: 1,
              explanation: "O singular contrasta com o plural usado para os dons espirituais, sugerindo que o caráter cristão cresce como uma unidade orgânica, não uma lista de escolhas isoladas.",
            },
            {
              question: "Segundo João 15:5, qual é a condição para 'dar muito fruto'?",
              options: [
                "Esforço e disciplina pessoal isolados, sem depender de ninguém",
                "Permanecer em Cristo, como o ramo permanece ligado à videira",
                "Ter dons espirituais específicos",
                "Alcançar um nível avançado de maturidade antes de começar a frutificar",
              ],
              correctIndex: 1,
              explanation: "Jesus é claro: fruto vem de permanecer nele — sem essa conexão, 'nada podemos fazer'.",
            },
          ],
          application:
            "Escolha uma das nove características do fruto do Espírito (Gálatas 5:22-23) em que você sente mais dificuldade hoje, e ao invés de tentar produzi-la só por esforço, dedique essa semana a 'permanecer' — orando, lendo a Palavra e buscando comunhão — e observe o que Deus faz.",
          prayer:
            "Senhor, que eu não tente forjar caráter cristão pela minha própria força, mas que, ao permanecer em ti através da Palavra, da oração e da comunhão, teu fruto cresça naturalmente em mim. Amém.",
          weeklyChallenge:
            "Ao final de cada dia essa semana, anote brevemente um momento em que você percebeu (ou sentiu falta) de uma das nove características do fruto do Espírito em sua reação a alguma situação.",
          reflectionQuestion:
            "Das nove características do fruto do Espírito, qual você sente que menos aparece na sua vida hoje — e o que isso pode revelar sobre sua conexão atual com Cristo (a 'videira')?",
          xp: 35,
        },
      ],
    },
    {
      id: "vc-mod-5",
      title: "Relacionamentos e Perseverança",
      lessons: [
        {
          id: "vc-5-1",
          title: "Relacionamentos Saudáveis",
          difficulty: 2,
          intro: [
            "Você foi feito para relacionamentos — não é acidente que a Bíblia comece com Deus dizendo 'não é bom que o homem esteja só' (Gênesis 2:18), muito antes do pecado entrar no mundo. Amizade, família, comunidade: tudo isso faz parte do desenho original de Deus para a vida humana, não um extra opcional para quem 'tem tempo sobrando'.",
            "Mas viver bem no meio de outras pessoas — imperfeitas como nós — exige mais do que boa vontade. Exige um conjunto de hábitos que a Bíblia ensina com clareza: amor sem hipocrisia, palavras que edificam, disposição para honrar o outro. Relacionamentos saudáveis não acontecem por acaso; eles são cultivados.",
          ],
          verses: [
            {
              ref: "Romanos 12:9-10",
              textByVersion: {
                NVI: "O amor deve ser sincero. Odeiem o que é mau; apeguem-se ao que é bom. Amem-se sinceramente uns aos outros com amor fraternal. Prefiram dar honra aos outros mais do que a si próprios.",
              },
              originals: [
                { word: "ἀνυπόκριτος", translit: "anypokritos", meaning: "'sem hipocrisia, sem máscara' — amor que não é representação, mas realidade genuína", lang: "grego" },
              ],
            },
            {
              ref: "Provérbios 27:17",
              textByVersion: {
                NVI: "Assim como o ferro afia o ferro, uma pessoa afia a outra.",
              },
            },
            {
              ref: "Efésios 4:29",
              textByVersion: {
                NVI: "Nenhuma palavra torpe saia da boca de vocês, mas apenas a que for útil para edificar os outros, conforme a necessidade, para que conceda benefício aos que a ouvem.",
              },
            },
          ],
          keywords: [
            { word: "ἀνυπόκριτος", translit: "anypokritos", meaning: "'sem hipocrisia'. Descreve um amor que não usa máscara social — o que se mostra por fora é o que realmente existe por dentro.", lang: "grego" },
          ],
          deepDive:
            "Paulo não descreve relacionamento saudável como ausência de atrito, mas como presença de certas qualidades: amor genuíno (sem hipocrisia), honra mútua, palavras que edificam. Provérbios usa a imagem do ferro que afia ferro — um processo que, na prática, envolve fricção. Amizades e relações profundas de verdade quase sempre passam por esse tipo de atrito construtivo: alguém que discorda de você com amor, que aponta um ponto cego, que espera mais de você do que você esperaria de si mesmo. A tentação moderna é cercar-se só de gente que concorda com tudo o que fazemos; a sabedoria bíblica descreve algo mais rico e mais difícil — pessoas que nos aproximam de Cristo mesmo quando isso incomoda um pouco.",
          theologianQuote: {
            author: "Larry Crabb",
            text: "Fomos feitos para nos conectar profundamente uns com os outros; é dentro dessa conexão, e não fora dela, que Deus costuma realizar sua obra mais transformadora em nós. (paráfrase da ênfase central de sua obra sobre conexão e relacionamentos)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Larry Crabb realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Romanos 12:9-10, que tipo de amor deve caracterizar as relações entre cristãos?",
              options: [
                "Um amor emocional intenso, mas superficial",
                "Um amor sem hipocrisia, genuíno, que honra o outro",
                "Um amor restrito apenas à família",
                "Um amor condicionado à reciprocidade",
              ],
              correctIndex: 1,
              explanation: "O termo grego 'anypokritos' descreve amor sem máscara — o que se sente é o que se demonstra.",
            },
            {
              question: "O que a imagem de 'ferro que afia ferro' (Provérbios 27:17) ensina sobre amizades saudáveis?",
              options: [
                "Que amizades saudáveis evitam qualquer desacordo",
                "Que o crescimento mútuo muitas vezes envolve atrito construtivo",
                "Que só se deve ter amigos que pensam exatamente igual",
                "Que amizade não exige esforço",
              ],
              correctIndex: 1,
              explanation: "O processo de afiar envolve fricção — amizades profundas frequentemente crescem através de correção e desafio mútuo, feitos com amor.",
            },
          ],
          application:
            "Pense em uma pessoa próxima que costuma 'te afiar' — que te desafia a crescer, mesmo quando isso incomoda. Agradeça a ela essa semana, especificamente, por essa qualidade.",
          prayer:
            "Senhor, obrigado pelas pessoas que colocaste ao meu redor. Ensina-me a amar sem hipocrisia, a honrar mais do que buscar ser honrado, e a receber com humildade quando alguém, com amor, me desafia a crescer. Que minhas palavras sejam sempre para edificar, nunca para destruir. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha três pessoas próximas e, a cada dia, escreva ou diga a uma delas uma palavra específica de encorajamento genuíno — não um elogio vago, mas algo verdadeiro que você percebeu nela.",
          reflectionQuestion:
            "Quem, no seu círculo mais próximo, tem liberdade para discordar de você com amor — e como você reage quando isso acontece?",
          xp: 25,
        },
        {
          id: "vc-5-2",
          title: "Sofrimento e Confiança",
          difficulty: 2,
          intro: [
            "Nenhum discipulado é completo sem enfrentar, de frente, a pergunta mais antiga da fé: por que sofremos, se Deus é bom e poderoso? A Bíblia não evita essa pergunta — ela está em Jó, nos Salmos, em Paulo na prisão. Mas a resposta bíblica não é uma explicação filosófica que resolve tudo; é a promessa de uma presença.",
            "Tiago chama o cristão a considerar as provações como motivo de alegria — não porque a dor seja boa em si mesma, mas porque Deus usa a provação para produzir algo que dificilmente nasceria de outro caminho: uma fé mais firme e um caráter mais maduro.",
          ],
          verses: [
            {
              ref: "Tiago 1:2-4",
              textByVersion: {
                NVI: "Considerem motivo de grande alegria o fato de passarem por diversas provações, pois vocês sabem que a prova da sua fé produz perseverança. E a perseverança deve ter ação completa, a fim de que vocês sejam maduros e íntegros, sem lhes faltar coisa alguma.",
              },
              originals: [
                { word: "ὑπομονή", translit: "hypomonē", meaning: "'perseverança' — não passividade resignada, mas resistência ativa que permanece firme sob o peso da provação", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:28",
              textByVersion: {
                NVI: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.",
              },
            },
            {
              ref: "Salmos 34:18",
              textByVersion: {
                NVI: "Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.",
              },
            },
          ],
          keywords: [
            { word: "ὑπομονή", translit: "hypomonē", meaning: "'perseverança ativa'. Não é simplesmente suportar a dor passivamente, mas permanecer firme e fiel enquanto ela dura, confiando que Deus está produzindo algo através dela.", lang: "grego" },
          ],
          deepDive:
            "Romanos 8:28 é um dos versículos mais citados — e mais mal-entendidos — da Bíblia. Ele não promete que tudo o que acontece é bom em si mesmo (o sofrimento real, a perda, a doença, continuam sendo males reais, e a Bíblia nunca pede que finjamos o contrário). O que o texto promete é que Deus é soberano e bom o suficiente para tecer até mesmo o mal em algo que serve ao seu propósito de formar o caráter de quem o ama — 'chamados de acordo com o seu propósito' é a chave: essa promessa é para quem confia nele, não uma garantia genérica de que 'tudo dá certo' independentemente da fé. Tiago acrescenta outra peça: a provação, vivida com fé, produz 'hypomonē' — não resignação passiva, mas perseverança ativa que amadurece o caráter. O cristão não é chamado a fingir que a dor não dói, mas a atravessá-la confiando que Deus está perto — como diz o Salmo 34 — especialmente quando o coração está quebrantado.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "Quando Cristo chama alguém, ele o chama a morrer para si mesmo — e o sofrimento, para quem o segue, não é uma exceção trágica ao discipulado, mas parte do caminho. (paráfrase da ênfase central de sua obra sobre o custo do discipulado)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Dietrich Bonhoeffer realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo a lição, o que Romanos 8:28 realmente promete?",
              options: [
                "Que nada de ruim jamais vai acontecer com o cristão",
                "Que todo mal que acontece já é bom por si mesmo",
                "Que Deus, sendo soberano e bom, pode tecer até o mal para o propósito de formar quem o ama",
                "Que o sofrimento é sempre punição por pecado",
              ],
              correctIndex: 2,
              explanation: "O texto não nega a realidade do mal, mas afirma que Deus o usa dentro de um propósito maior para quem confia nele.",
            },
            {
              question: "O termo grego 'hypomonē' (perseverança), usado em Tiago 1, descreve principalmente:",
              options: [
                "Resignação passiva diante da dor",
                "Resistência ativa e firme que permanece fiel sob o peso da provação",
                "Ausência total de sofrimento",
                "Uma emoção passageira de coragem",
              ],
              correctIndex: 1,
              explanation: "Hypomonē não é desistir silenciosamente, mas permanecer ativamente firme e fiel enquanto a provação dura.",
            },
          ],
          application:
            "Identifique uma provação atual (ou recente) na sua vida. Em vez de perguntar apenas 'por que isso está acontecendo?', pergunte também: 'o que Deus pode estar formando em mim através disso?'. Escreva sua resposta.",
          prayer:
            "Senhor, quando a dor é real e não desaparece com uma explicação fácil, ajuda-me a confiar que estás perto dos que têm o coração quebrantado. Não me deixes fingir que o sofrimento não dói, mas também não me deixes esquecer que és soberano e bom, e que nada do que atravesso está fora do teu cuidado. Produz em mim perseverança que amadurece, não amargura que endurece. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva uma carta breve para si mesmo (ou para alguém que está sofrendo) lembrando, com suas próprias palavras, que Deus está perto de quem tem o coração quebrantado — e guarde essa carta para reler numa próxima temporada difícil.",
          reflectionQuestion:
            "Existe algum sofrimento no seu passado em que, olhando para trás, você já consegue ver algo que Deus formou em você através dele?",
          xp: 30,
        },
      ],
    },
  ],
};

export const additionalTrails6: Trail[] = [vidaCrista];
