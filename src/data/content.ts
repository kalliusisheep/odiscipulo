// Conteúdo semente: trilhas, módulos e lições do Disciple.
// Estrutura fixa em código — o progresso do usuário fica no banco.

export const BIBLE_VERSIONS = ["NVI", "NAA", "ACF", "KJV", "NVT"] as const;
export type BibleVersion = typeof BIBLE_VERSIONS[number];

export type Original = {
  word: string;
  translit: string;
  meaning: string;
  lang: "grego" | "hebraico";
};

export type Verse = {
  ref: string; // "João 3:16"
  textByVersion: Partial<Record<BibleVersion, string>>; // pelo menos NVI
  originals?: Original[]; // originais dessa passagem
};

export type Quiz = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Lesson = {
  id: string;
  title: string;
  difficulty?: 1 | 2 | 3 | 4 | 5; // calibra densidade — opcional, padrão 1
  // ── PÁGINA 1: ESTUDO (núcleo) ────────────────────────
  intro: string[];
  verses: Verse[];
  keywords: Original[];
  deepDive: string;
  theologianQuote: { author: string; text: string; source?: string };
  // ── APROFUNDAR (opcional — exibe botão só se existir) ─
  deepen?: {
    additionalVerses?: Verse[];
    additionalKeywords?: Original[];
    historicalContext?: string;
    exegeticalNotes?: string;
    theologicalDebate?: string;
    secondQuote?: { author: string; text: string; source?: string };
  };
  // ── PÁGINA 2: FIXAR ──────────────────────────────────
  quizzes: Quiz[];
  // ── PÁGINA 3: APLICAR ────────────────────────────────
  application: string;
  prayer: string;
  weeklyChallenge: string;
  reflectionQuestion: string;
  xp: number;
};

export type ModuleT = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Trail = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules: ModuleT[];
  order: number;
};

/** Retorna o texto do versículo na versão pedida, com fallback. */
export function verseText(v: Verse, version: BibleVersion): string {
  return (
    v.textByVersion[version] ??
    v.textByVersion.NVI ??
    v.textByVersion.NAA ??
    v.textByVersion.ACF ??
    v.textByVersion.KJV ??
    v.textByVersion.NVT ??
    ""
  );
}

const novoConvertido: Trail = {
  id: "novo-convertido",
  title: "Novo Convertido",
  description: "Primeiros passos na fé cristã. Do arrependimento à segurança da salvação.",
  icon: "Sprout",
  color: "from-violet-500 to-indigo-500",
  order: 1,
  modules: [
    {
      id: "nc-mod-1",
      title: "Módulo I: O Encontro",
      lessons: [
        {
          id: "db-1-2",
          title: "Quem é Jesus?",
          difficulty: 1,
          intro: [
            "Toda a fé cristã se apoia numa única pergunta, feita pelo próprio Jesus aos seus discípulos: 'e vocês, quem dizem que eu sou?' (Mateus 16:15). Não é uma pergunta de curiosidade histórica. É a pergunta mais decisiva que qualquer ser humano pode responder — porque a resposta determina tudo o que vem depois na sua fé.",
            "Muita gente admira Jesus como grande professor de moral, como líder religioso ou como exemplo de bondade. Mas o próprio Jesus nunca deixou essa porta aberta. C.S. Lewis observou que alguém que diz as coisas que Jesus disse — 'antes de Abraão existir, eu sou' (João 8:58), 'eu e o Pai somos um' (João 10:30) — só pode ser uma dessas três coisas: um mentiroso, um louco, ou exatamente quem afirmou ser: o Senhor. A opção de 'grande mestre moral, mas não Deus' simplesmente não está disponível para quem lê os Evangelhos com honestidade.",
            "A Bíblia ensina que Jesus é plenamente Deus e plenamente homem — uma só pessoa, duas naturezas, unidas sem confusão, sem mistura, sem separação. Esse é o coração da fé cristã histórica, confessado desde os primeiros séculos da Igreja: 'o Verbo se fez carne e habitou entre nós' (João 1:14). Deus não enviou uma mensagem sobre si mesmo; Ele veio pessoalmente, em carne humana.",
            "Entender quem é Jesus não é um exercício acadêmico distante — é o fundamento sobre o qual toda a sua vida cristã será construída. Se Jesus é apenas um bom homem, seguir seus ensinos é opcional, uma entre várias filosofias de vida. Se Jesus é Deus encarnado, então tudo o que Ele disse tem autoridade absoluta, e a resposta correta diante dele não é admiração distante, mas adoração, confiança e entrega.",
          ],
          verses: [
            {
              ref: "João 1:1,14",
              textByVersion: {
                NVI: "No princípio era aquele que é a Palavra. Ele estava com Deus, e era Deus... Aquele que é a Palavra tornou-se carne e viveu entre nós. Vimos a sua glória, glória como do Unigênito vindo do Pai, cheio de graça e de verdade.",
                NAA: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus... E o Verbo se fez carne e habitou entre nós, cheio de graça e de verdade; e vimos a sua glória, glória como do unigênito do Pai.",
                ACF: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus... E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, como a glória do unigênito do Pai, cheio de graça e de verdade.",
                KJV: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus... E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, como a glória do unigênito do Pai, cheio de graça e de verdade.",
                NVT: "No princípio, antes de todas as coisas começarem, a Palavra já existia. A Palavra estava com Deus e era Deus... Assim, a Palavra tornou-se homem e viveu aqui na terra entre nós. Ele estava cheio de amor inabalável e fidelidade. E nós vimos a sua glória, a glória do único Filho do Pai.",
              },
              originals: [
                { word: "λόγος", translit: "lógos", meaning: "'Palavra, Verbo' — expressão perfeita e eterna do próprio Deus, presente desde antes da criação", lang: "grego" },
              ],
            },
            {
              ref: "Colossenses 1:15-17",
              textByVersion: {
                NVI: "Ele é a imagem do Deus invisível, o primogênito de toda a criação, pois nele foram criadas todas as coisas... Ele é antes de todas as coisas, e nele tudo subsiste.",
                NAA: "Ele é a imagem do Deus invisível, o primogênito de toda a criação, porque nele foram criadas todas as coisas... Ele é antes de todas as coisas, e nele subsistem todas as coisas.",
                ACF: "O qual é imagem do Deus invisível, o primogênito de toda a criação; porque nele foram criadas todas as coisas... e ele é antes de todas as coisas, e todas as coisas subsistem por ele.",
                NVT: "Cristo é a imagem visível do Deus invisível. Ele existia antes que qualquer coisa fosse criada e é supremo sobre toda a criação, pois, por meio dele, Deus criou tudo... Ele existia antes de tudo o mais, e é ele quem mantém a criação unida.",
              },
              originals: [
                { word: "εἰκὼν", translit: "eikōn", meaning: "'imagem' — não uma cópia imperfeita, mas a representação exata e visível do que é invisível", lang: "grego" },
              ],
            },
            {
              ref: "Mateus 16:15-16",
              textByVersion: {
                NVI: "'E vocês', perguntou ele, 'quem dizem que eu sou?' Simão Pedro respondeu: 'Tu és o Cristo, o Filho do Deus vivo'.",
                NAA: "Ele lhes perguntou: — E vocês, quem dizem que eu sou? Respondeu-lhe Simão Pedro: — Tu és o Cristo, o Filho do Deus vivo.",
                ACF: "Disse-lhes ele: E vós, quem dizeis que eu sou? E Simão Pedro, respondendo, disse: Tu és o Cristo, o Filho do Deus vivo.",
                NVT: "'E vocês?', ele perguntou. 'Quem vocês dizem que eu sou?' Simão Pedro respondeu: 'Tu és o Messias, o Filho do Deus vivo'.",
              },
              originals: [
                { word: "Χριστός", translit: "Christós", meaning: "'Ungido, Messias' — o Rei prometido desde o Antigo Testamento, aguardado por Israel", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "λόγος", translit: "lógos", meaning: "'Palavra, Verbo'. João escolhe esse termo para dizer que Jesus é a auto-expressão eterna de Deus — não uma criatura, mas Deus mesmo se comunicando e se revelando.", lang: "grego" },
            { word: "εἰκὼν", translit: "eikōn", meaning: "'imagem'. Jesus não aponta apenas para Deus — ele torna Deus visível. Quem vê a Jesus, vê o caráter e a glória do Pai (João 14:9).", lang: "grego" },
            { word: "Χριστός", translit: "Christós", meaning: "'Ungido, Messias'. Título que liga Jesus às promessas do Antigo Testamento sobre um Rei, Sacerdote e Profeta enviado por Deus para salvar seu povo.", lang: "grego" },
          ],
          deepDive:
            "João abre seu Evangelho ecoando deliberadamente Gênesis 1:1 — 'no princípio' — para dizer que Jesus, o 'lógos', já estava lá antes de qualquer coisa existir, e que esse Lógos 'era Deus'. Não uma força impessoal, não um anjo superior, não uma criatura exaltada: Deus mesmo. E então vem a afirmação mais chocante do cristianismo: esse Deus eterno 'se fez carne' — tornou-se plenamente humano, sem deixar de ser plenamente divino. Paulo, em Colossenses, acrescenta outra peça: Jesus é a 'eikōn' do Deus invisível — não uma pintura aproximada, mas a representação exata e visível daquilo que ninguém jamais viu. E tudo isso desemboca na pergunta pessoal que Jesus faz a Pedro: não 'o que as pessoas pensam de mim', mas 'quem vocês dizem que eu sou'. A resposta de Pedro — 'o Cristo, o Filho do Deus vivo' — é a confissão que sustenta toda a Igreja cristã através dos séculos. Conhecer fatos sobre Jesus não é o mesmo que confessá-lo como Senhor; a fé cristã nasce quando essa verdade deixa de ser informação e se torna confissão pessoal.",
          theologianQuote: {
            author: "C.S. Lewis",
            text: "Um homem que fosse meramente humano e dissesse as coisas que Jesus disse não seria um grande mestre moral. Ou ele é o Filho de Deus, ou é um louco, ou algo pior. Você precisa escolher.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Filipenses 2:6-7",
                textByVersion: {
                  NVI: "Que, embora tendo a natureza de Deus, não considerou que ser igual a Deus era algo a que devia se apegar; mas esvaziou-se de si mesmo, vindo a ser servo, tornando-se semelhante aos seres humanos.",
                },
              },
              {
                ref: "Hebreus 1:3",
                textByVersion: {
                  NVI: "O Filho é o resplendor da glória de Deus e a expressão exata do seu ser, sustentando todas as coisas por sua palavra poderosa.",
                },
              },
            ],
            additionalKeywords: [
              { word: "μορφῇ", translit: "morphē", meaning: "'forma, natureza essencial'. Paulo usa esse termo em Filipenses 2:6 para afirmar que Jesus possui, por natureza, a essência plena de Deus — não uma aparência, mas a realidade.", lang: "grego" },
              { word: "χαρακτὴρ", translit: "charaktēr", meaning: "'expressão exata, marca impressa'. Assim como um selo produz uma marca idêntica à sua gravação, Jesus é a impressão exata do próprio ser de Deus (Hebreus 1:3).", lang: "grego" },
            ],
            historicalContext:
              "A confissão de que Jesus é plenamente Deus e plenamente homem não nasceu de especulação filosófica tardia — ela já está presente nos escritos mais antigos do Novo Testamento, como o hino cristológico de Filipenses 2 (provavelmente um cântico usado pela igreja primitiva antes mesmo de Paulo escrever a carta) e nas afirmações diretas dos Evangelhos. Nos primeiros séculos, a Igreja precisou defender essa verdade contra distorções: o docetismo (que negava a humanidade real de Jesus, tratando-a como aparência) e o arianismo (que negava sua plena divindade, tratando-o como a primeira e maior criatura de Deus). O Concílio de Niceia (325 d.C.) e o Concílio de Calcedônia (451 d.C.) não inventaram a doutrina da encarnação — eles a defenderam e a formularam com precisão diante de erros que ameaçavam distorcer o Evangelho.",
            exegeticalNotes:
              "O prólogo de João (1:1-18) é cuidadosamente estruturado: 'o Verbo era Deus' (afirmando plena divindade) e, ao mesmo tempo, 'o Verbo estava com Deus' (afirmando distinção pessoal entre o Pai e o Filho). O grego evita tanto o erro de dizer que Jesus é 'um deus' menor (não há artigo definido antes de 'Deus' na segunda cláusula, o que os gramáticos entendem como ênfase qualitativa: o Verbo possui a mesma natureza divina) quanto o erro de apagar a distinção entre as pessoas da Trindade. É precisão teológica extrema construída em poucas palavras gregas.",
            theologicalDebate:
              "A doutrina da encarnação — Jesus plenamente Deus e plenamente homem numa só pessoa — é uma doutrina essencial da fé cristã histórica, confessada por praticamente toda a Igreja ortodoxa ao longo dos séculos, e não é um tema de divergência legítima entre cristãos fiéis, diferente de outros temas tratados nesta trilha. Ainda assim, é importante saber que grupos que negam a plena divindade de Cristo (como as Testemunhas de Jeová, historicamente) ou sua plena humanidade se afastam, neste ponto, da ortodoxia cristã histórica. Se você tiver dúvidas específicas sobre esse tema ao conversar com pessoas de outras tradições religiosas, procure seu pastor ou líder de discipulado para aprofundar com cuidado pastoral.",
            secondQuote: {
              author: "John Stott",
              text: "Jesus Cristo não é apenas um bom exemplo a seguir; ele é o próprio Deus que se fez homem para nos alcançar onde estávamos.",
            },
          },
          quizzes: [
            {
              question: "Segundo João 1:1 e 1:14, quem é o 'Verbo' (lógos)?",
              options: [
                "Um anjo poderoso enviado por Deus",
                "Deus mesmo, que existia desde o princípio e se fez carne",
                "Um título simbólico sem realidade pessoal",
                "A primeira criatura feita por Deus",
              ],
              correctIndex: 1,
              explanation: "João afirma que o Verbo 'era Deus' e, ao se encarnar, não deixou de sê-lo — Jesus é plenamente Deus e plenamente homem.",
            },
            {
              question: "De acordo com o argumento de C.S. Lewis apresentado na lição, o que NÃO é uma opção coerente diante das afirmações de Jesus sobre si mesmo?",
              options: [
                "Que ele seja o Senhor, exatamente quem afirmou ser",
                "Que ele fosse um mentiroso deliberado",
                "Que ele estivesse enganado, como um louco",
                "Que ele fosse apenas um bom mestre moral, mas não Deus",
              ],
              correctIndex: 3,
              explanation: "Quem afirma ser igual ao Pai e preexistente a Abraão não deixa espaço para ser classificado apenas como 'bom professor' — essa opção não está disponível diante do que Jesus realmente disse.",
            },
            {
              question: "Qual foi a resposta de Pedro à pergunta de Jesus em Mateus 16:15-16, e por que ela é importante?",
              options: [
                "'Tu és um grande profeta' — reconhecendo apenas um dom espiritual",
                "'Tu és o Cristo, o Filho do Deus vivo' — confissão que sustenta a fé cristã histórica",
                "'Não sei quem tu és' — expressando dúvida legítima",
                "'Tu és um anjo do Senhor' — atribuindo natureza angelical a Jesus",
              ],
              correctIndex: 1,
              explanation: "A confissão de Pedro identifica Jesus como o Messias prometido e o Filho de Deus — o fundamento da fé que a Igreja confessa desde então.",
            },
          ],
          application:
            "Responda, hoje, por escrito, a mesma pergunta que Jesus fez a Pedro: 'quem eu digo que Jesus é?'. Não escreva o que você aprendeu sobre ele — escreva o que você crê, com suas próprias palavras. Se houver hesitação ou dúvida, leve-a numa conversa franca com Deus em oração, e também com seu líder de discipulado.",
          prayer:
            "Senhor Jesus, tu não vieste apenas para me ensinar um caminho — tu és o caminho, a verdade e a vida. Confesso que muitas vezes reduzo você a um bom exemplo a seguir, esquecendo que você é Deus que se fez carne para me alcançar. Perdoa minha lentidão em reconhecer sua glória plena. Que eu, como Pedro, possa confessar de coração: tu és o Cristo, o Filho do Deus vivo. Molda toda a minha vida a partir dessa verdade. Em teu próprio nome, amém.",
          weeklyChallenge:
            "Leia o capítulo 1 do Evangelho de João nesta semana, um pedaço por dia se necessário, sublinhando toda vez que o texto afirmar algo sobre quem Jesus é. Ao final, escreva uma lista com pelo menos cinco dessas afirmações.",
          reflectionQuestion:
            "Antes de conhecer a Cristo, quem você pensava que Jesus era? O que mudou nessa percepção — e o que ainda precisa mudar?",
          xp: 15,
        },
        {
          id: "nc-1-1",
          title: "O que aconteceu comigo?",
          intro: [
            "A experiência da conversão é, ao mesmo tempo, a mais íntima e a mais cósmica que um ser humano pode viver. Íntima porque acontece no interior, num lugar que ninguém vê. Cósmica porque, segundo a Bíblia, os céus se alegram quando ela acontece (Lucas 15:10). Você atravessou uma linha que separa dois mundos, e talvez ainda esteja tentando entender o que exatamente atravessou.",
            "Historicamente, a igreja sempre chamou essa experiência de 'novo nascimento' ou 'regeneração'. Não é linguagem poética inventada por pregadores modernos — é a linguagem do próprio Jesus, dita a Nicodemos numa noite em Jerusalém há dois mil anos. Nicodemos era um doutor da lei, alguém acostumado a explicar Deus a outros. E, ainda assim, Jesus lhe diz que ele precisa começar de novo.",
            "Teologicamente, o novo nascimento não é uma reforma moral. Não é você resolvendo ser uma pessoa melhor. É Deus operando em você algo que você não poderia operar sozinho: uma origem espiritual nova. Um coração antigo não vira coração novo com esforço; ele precisa ser trocado.",
            "Praticamente, entender isso muda tudo. Se sua nova vida em Cristo depende do seu esforço, você viverá com medo de fracassar. Se ela depende da obra de Deus em você, você viverá com gratidão — e o esforço vem daí, não do medo.",
          ],
          verses: [
            {
              ref: "João 3:3",
              textByVersion: {
                NVI: "Jesus respondeu: 'Digo-lhe a verdade: ninguém pode ver o Reino de Deus, se não nascer de novo'.",
                NAA: "Jesus lhe respondeu: — Em verdade, em verdade lhe digo que, se alguém não nascer de novo, não pode ver o Reino de Deus.",
                ACF: "Jesus respondeu, e disse-lhe: Na verdade, na verdade te digo que aquele que não nascer de novo, não pode ver o reino de Deus.",
                KJV: "Jesus respondeu-lhe: Em verdade, em verdade te digo que, se um homem não nascer de novo, não pode ver o reino de Deus.",
                NVT: "Jesus respondeu: 'Digo-lhe a verdade: ninguém pode ver o Reino de Deus, a menos que nasça de novo'.",
              },
              originals: [
                { word: "ἄνωθεν", translit: "anōthen", meaning: "de novo / do alto — duplo sentido intencional", lang: "grego" },
              ],
            },
            {
              ref: "2 Coríntios 5:17",
              textByVersion: {
                NVI: "Portanto, se alguém está em Cristo, é nova criação. As coisas antigas já passaram; eis que surgiram coisas novas!",
                NAA: "Assim, se alguém está em Cristo, é nova criação. As coisas antigas já passaram; eis que surgiram coisas novas!",
                ACF: "Assim que, se alguém está em Cristo, nova criatura é: as coisas velhas já passaram; eis que tudo se fez novo.",
                KJV: "Portanto, se alguém está em Cristo, é nova criatura: as coisas velhas passaram; eis que tudo se fez novo.",
                NVT: "Isso significa que todo aquele que pertence a Cristo tornou-se uma nova pessoa. A velha vida se foi; uma nova vida começou!",
              },
              originals: [
                { word: "καινὴ κτίσις", translit: "kainē ktisis", meaning: "nova criação — algo qualitativamente novo, não apenas renovado", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἄνωθεν", translit: "anōthen", meaning: "'de novo' ou 'do alto'. O duplo sentido não é acidente — o novo nascimento tem origem celestial, não humana.", lang: "grego" },
            { word: "καινὴ", translit: "kainē", meaning: "novo em qualidade, não apenas em tempo. Não é 'mais um dia' — é outra categoria de existência.", lang: "grego" },
            { word: "κτίσις", translit: "ktisis", meaning: "criação, ato criador. A mesma palavra usada para a criação do mundo. Em você, Deus faz obra criadora nova.", lang: "grego" },
          ],
          deepDive:
            "Quando Jesus fala do novo nascimento a Nicodemos, ele não está descrevendo um esforço religioso melhor — está descrevendo uma recriação. A palavra 'anōthen' carrega intencionalmente dois sentidos: 'de novo' e 'do alto'. Ambos importam. É uma origem nova, e essa origem vem de Deus. Paulo confirma o mesmo mistério em outra palavra: 'kainē ktisis' — não uma versão melhorada da criatura antiga, mas uma criação qualitativamente diferente. O verbo por trás é o mesmo de Gênesis 1: Deus cria. Isso é o que aconteceu com você. Não foi você que decidiu mudar; foi Deus que começou uma obra nova, e agora sua parte é aprender a viver à altura dessa nova identidade.",
          theologianQuote: {
            author: "Paul Washer",
            text: "A conversão verdadeira não é uma decisão que você toma. É uma obra que Deus faz — e ela deixa marcas.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Tito 3:5",
                textByVersion: {
                  NVI: "Ele nos salvou, não por causa de atos de justiça que tivéssemos feito, mas por sua misericórdia, por meio do lavar regenerador e renovador do Espírito Santo.",
                },
              },
              {
                ref: "Ezequiel 36:26",
                textByVersion: {
                  NVI: "Darei a vocês um novo coração e porei um novo espírito em vocês; tirarei de vocês o coração de pedra e lhes darei um coração de carne.",
                },
              },
            ],
            additionalKeywords: [
              { word: "παλιγγενεσία", translit: "palingenesía", meaning: "'regeneração, novo começo'. Termo usado em Tito 3:5 para descrever o lavar renovador do Espírito — a mesma realidade que Jesus chama de 'nascer de novo' em João 3.", lang: "grego" },
            ],
            historicalContext:
              "Nicodemos era fariseu e 'mestre de Israel' (João 3:10) — alguém treinado para explicar as Escrituras a outros. Jesus provavelmente alude a Ezequiel 36:25-27, onde Deus promete um dia aspergir água pura sobre o povo, dar-lhe um coração novo e colocar seu Espírito nele. Um mestre da lei deveria reconhecer essa promessa profética. A surpresa de Nicodemos não é por desconhecer a ideia de renovação espiritual, mas por não ter percebido que essa promessa profética precisava se cumprir nele mesmo, um judeu religioso e não apenas nos gentios distantes.",
            exegeticalNotes:
              "A expressão 'nascer da água e do Espírito' (João 3:5) tem sido lida de formas diferentes ao longo da história da Igreja: alguns veem uma referência ao batismo cristão; outros, ecoando Ezequiel 36, entendem 'água' como imagem de purificação espiritual paralela ao 'Espírito', descrevendo uma única realidade de limpeza e regeneração, não dois eventos separados. Esta segunda leitura tem a vantagem de manter coerência com o contexto imediato, que é sobre nascimento espiritual, não sobre um rito.",
            theologicalDebate:
              "Um tema em que cristãos fiéis historicamente divergem é a ordem entre a regeneração (o novo nascimento) e a fé: tradições reformadas ensinam que a regeneração é obra soberana do Espírito que precede e capacita a fé (o cego passa a ver antes de escolher olhar); tradições arminianas — à qual esta trilha está mais alinhada — ensinam que a graça preveniente de Deus capacita toda pessoa a responder livremente ao chamado do Evangelho, e a fé e o novo nascimento acontecem de forma unida nesse instante de resposta. Em ambas as tradições, a ênfase central desta lição permanece verdadeira e inegociável: o novo nascimento é obra de Deus, não conquista humana. Esta é uma questão importante, mas secundária — vale a pena estudá-la com seu pastor ou líder de discipulado.",
            secondQuote: {
              author: "John Wesley",
              text: "O novo nascimento é aquela grande mudança que Deus opera na alma quando a traz à vida em Cristo, transformando-a de morte espiritual em vida espiritual.",
            },
          },
          quizzes: [
            {
              question: "O que significa 'nascer de novo' segundo Jesus em João 3?",
              options: [
                "Melhorar o comportamento e frequentar a igreja",
                "Uma recriação espiritual feita por Deus",
                "Aprender toda a Bíblia de cor",
                "Ser batizado publicamente",
              ],
              correctIndex: 1,
              explanation: "É obra de Deus, não esforço humano. Você foi recriado.",
            },
            {
              question: "A expressão grega 'anōthen' carrega qual duplo sentido?",
              options: [
                "'Rápido' e 'devagar'",
                "'De novo' e 'do alto'",
                "'Baixo' e 'alto'",
                "'Antigo' e 'moderno'",
              ],
              correctIndex: 1,
              explanation: "Jesus usa 'anōthen' intencionalmente: o novo nascimento é uma origem nova e celestial.",
            },
            {
              question: "Segundo 2 Coríntios 5:17, ser 'nova criação' significa:",
              options: [
                "Uma versão melhorada da criatura antiga",
                "Uma nova criação qualitativamente diferente em Cristo",
                "Uma promessa apenas para o futuro no céu",
                "Um sentimento passageiro de renovação",
              ],
              correctIndex: 1,
              explanation: "'Kainē ktisis' é criação nova em qualidade, não apenas em cronologia.",
            },
          ],
          application:
            "Hoje, escolha uma prática antiga — um pensamento recorrente, um hábito, uma reação automática — e a trate como 'coisa antiga que passou'. Sempre que ela voltar, repita para si mesmo: 'sou nova criação em Cristo'. Não é auto-ajuda; é lembrar quem você é agora diante de Deus.",
          prayer:
            "Pai, obrigado por não me deixar como me encontrou. Confesso que às vezes ainda me olho com os olhos do velho homem, esquecendo que fizeste em mim uma obra nova. Ensina-me a viver à altura da identidade que me deste em Cristo. Quando o passado bater à porta acusando, lembra-me de que aquele que se foi não sou mais eu. Renova em mim hoje o assombro de saber que sou uma nova criação. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Ao longo desta semana, escreva num caderno três 'coisas antigas' que você percebe que Deus já começou a mudar em você, e três 'coisas novas' que Ele está formando. Traga essa lista para sua oração todo dia.",
          reflectionQuestion:
            "O que na sua vida antiga você percebe que já passou — e o que ainda está sendo renovado por Deus?",
          xp: 15,
        },
        {
          id: "nc-1-2",
          title: "Tenho certeza da salvação?",
          intro: [
            "Poucas perguntas atormentam tanto o novo convertido quanto esta: 'e se, no fim, eu descobrir que não era salvo de verdade?' A pergunta em si não é sinal de falta de fé — muitas vezes é justamente o oposto. Quem nunca se preocupou com isso raramente levou a fé a sério.",
            "A tradição cristã, desde os primeiros séculos, distinguiu entre 'ter salvação' e 'ter certeza da salvação'. As duas coisas não crescem sempre juntas. Alguém pode estar salvo e passar por temporadas de dúvida; alguém pode se sentir muito confiante e viver alheio a Deus. A segurança bíblica não nasce da autoconfiança, mas de onde a fé descansa.",
            "João escreveu sua primeira carta, segundo ele próprio, para que os cristãos 'saibam' que têm a vida eterna (1 João 5:13). O verbo é 'saber', não 'sentir'. Existe um conhecimento sólido possível — e ele se apoia em duas testemunhas que a Bíblia oferece: a Palavra que promete, e o Espírito que confirma.",
            "Isso não elimina temporadas de aridez ou dúvida. Mas oferece um chão. Sua salvação não flutua conforme seu humor de hoje; ela repousa numa aliança que Deus fez, e que Ele não quebra.",
          ],
          verses: [
            {
              ref: "1 João 5:13",
              textByVersion: {
                NVI: "Escrevi-lhes estas coisas, a vocês que crêem no nome do Filho de Deus, para que saibam que têm a vida eterna.",
                NAA: "Estas coisas eu lhes escrevi, a vocês que creem no nome do Filho de Deus, para que saibam que têm a vida eterna.",
                ACF: "Estas coisas vos escrevi, a vós que credes no nome do Filho de Deus, para que saibais que tendes a vida eterna.",
                KJV: "Estas coisas vos escrevi, a vós que credes no nome do Filho de Deus, para que saibais que tendes a vida eterna.",
                NVT: "Escrevi estas coisas a vocês, que creem no nome do Filho de Deus, para que saibam que têm vida eterna.",
              },
            },
            {
              ref: "Romanos 8:16",
              textByVersion: {
                NVI: "O próprio Espírito testemunha ao nosso espírito que somos filhos de Deus.",
                NAA: "O próprio Espírito testifica com o nosso espírito que somos filhos de Deus.",
                ACF: "O mesmo Espírito testifica com o nosso espírito que somos filhos de Deus.",
                KJV: "O mesmo Espírito testifica com o nosso espírito que somos filhos de Deus.",
                NVT: "O próprio Espírito Santo se une ao nosso espírito para afirmar que somos filhos de Deus.",
              },
              originals: [
                { word: "συμμαρτυρεῖ", translit: "symmartyrei", meaning: "testifica junto com, corrobora ao lado", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "οἴδατε", translit: "oidate", meaning: "'sabeis' — conhecimento firme, não mera opinião. João não escreve para você sentir, mas para você saber.", lang: "grego" },
            { word: "συμμαρτυρεῖ", translit: "symmartyrei", meaning: "'testifica junto com'. O prefixo 'syn-' significa 'com' — o Espírito não testemunha sozinho; corrobora com sua consciência renovada.", lang: "grego" },
            { word: "τέκνα", translit: "tékna", meaning: "'filhos' — laço de nascimento, não apenas adoção legal. Você é filho pelo mesmo ato do novo nascimento.", lang: "grego" },
          ],
          deepDive:
            "João escreve para que você 'saiba' — não sinta apenas, mas saiba. A segurança tem duas testemunhas: a Palavra escrita (você creu no nome do Filho, e a promessa é firme) e o Espírito (que 'symmartyrei' — testifica junto). Sentimentos oscilam; essas duas testemunhas não. Quando a dúvida bate, o caminho não é buscar mais emoção, mas voltar às testemunhas: o que Deus disse na Palavra, e o que o Espírito confirma no íntimo — um desejo por Deus, uma tristeza pelo pecado, uma inclinação para as coisas do alto que antes não existia. Essas marcas, ainda que pequenas, são obra do Espírito e não podem ser forjadas pela carne.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "A fé não é maior por ter sentimentos fortes, e não é menor por não os ter. A fé se apoia em Cristo, não em si mesma.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "João 10:28-29",
                textByVersion: {
                  NVI: "Eu lhes dou a vida eterna, e elas jamais perecerão; ninguém as arrancará da minha mão. Meu Pai, que as deu para mim, é maior do que todos; ninguém pode arrancá-las da mão de meu Pai.",
                },
              },
              {
                ref: "2 Coríntios 13:5",
                textByVersion: {
                  NVI: "Examinem-se a vocês mesmos, para ver se estão na fé; provem-se a vocês mesmos. Vocês não reconhecem que Cristo Jesus está em vocês? A menos que fracassem no exame!",
                },
              },
            ],
            additionalKeywords: [
              { word: "ἁρπάσει", translit: "harpásei", meaning: "'arrebatar à força'. Jesus usa esse verbo forte em João 10:28 para garantir que ninguém — nem circunstância, nem inimigo — consegue arrancar o crente da mão que o segura.", lang: "grego" },
            ],
            historicalContext:
              "A doutrina da segurança do crente foi debatida com intensidade especial entre os puritanos ingleses do século XVII, que distinguiam cuidadosamente entre 'ter fé salvadora' e 'ter certeza consciente dessa fé' — reconhecendo que um cristão genuíno pode, por temporadas, viver sem plena certeza subjetiva, sem que isso signifique ausência de salvação real. Já a Reforma Protestante, de modo geral, reagiu contra o ensino medieval que tornava a certeza da salvação quase impossível para o crente comum, prendendo-a a méritos e sacramentos administrados pela Igreja; os reformadores insistiram que a segurança podia — e devia — ser buscada diretamente nas promessas de Cristo.",
            exegeticalNotes:
              "O verbo grego 'oídate' (1 João 5:13, 'saibam') pertence à mesma família de palavras que descrevem conhecimento firme e consciente, não impressão vaga. É significativo que João escreva toda a sua carta para produzir esse tipo de certeza — o texto inteiro de 1 João funciona como um conjunto de 'testes' práticos (obediência aos mandamentos, amor aos irmãos, rejeição do pecado como estilo de vida) que servem de evidência externa confirmando a realidade interna da fé.",
            theologicalDebate:
              "Um tema em que cristãos fiéis historicamente divergem é se a salvação, uma vez recebida, pode ser perdida. Tradições reformadas defendem a perseverança dos santos ('uma vez salvo, sempre salvo'), apoiadas em textos como João 10:28-29. Tradições arminianas — à qual esta trilha está mais alinhada — reconhecem a força dessas promessas, mas também levam a sério advertências sérias do Novo Testamento (como Hebreus 6:4-6 e 10:26-29) como reais e não meramente hipotéticas, entendendo que a fé precisa perseverar até o fim para se provar genuína. Esta é uma questão doutrinária importante, mas secundária ao Evangelho — cristãos sinceros de ambos os lados concordam que a salvação é pela graça, mediante a fé em Cristo, e nenhum lado ensina que o crente deve viver com ansiedade constante sobre sua salvação. Se essa dúvida pesa sobre você, converse com seu pastor ou líder espiritual.",
            secondQuote: {
              author: "John Wesley",
              text: "O testemunho do Espírito é uma impressão interior na alma, pela qual o Espírito de Deus testifica diretamente ao meu espírito que sou filho de Deus.",
            },
          },
          quizzes: [
            {
              question: "A segurança da salvação vem principalmente de:",
              options: [
                "Não errar mais nunca",
                "A promessa da Palavra e o testemunho do Espírito",
                "Um sentimento constante de alegria",
                "Fazer boas obras suficientes",
              ],
              correctIndex: 1,
              explanation: "Duas testemunhas: Palavra que promete e Espírito que confirma.",
            },
            {
              question: "Por que João diz que escreveu sua carta em 1 João 5:13?",
              options: [
                "Para que os cristãos duvidem mais",
                "Para que saibam que têm a vida eterna",
                "Para que aprendam grego",
                "Para que trabalhem por sua salvação",
              ],
              correctIndex: 1,
              explanation: "O verbo é 'saber' — conhecimento firme, não sentimento oscilante.",
            },
          ],
          application:
            "Nesta semana, quando bater a dúvida sobre sua salvação, não discuta consigo mesmo — vá a duas testemunhas: leia uma promessa escrita da Palavra em voz alta, e peça ao Espírito que confirme dentro de você. Repita o exercício sempre que a dúvida voltar. A segurança se fortalece nesse hábito, não em resolver todas as perguntas de uma vez.",
          prayer:
            "Senhor, tu conheces meu coração — os momentos em que descanso na tua promessa e os momentos em que a dúvida me sacode. Obrigado por não fundar minha salvação nos meus sentimentos, mas em ti mesmo. Ensina-me a ouvir tanto a tua Palavra escrita quanto o teu Espírito que testifica dentro de mim. Quando eu vacilar, não me deixes procurar segurança em mim, mas em Cristo. Firma o meu coração na tua fidelidade. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha um versículo de promessa (como 1 João 5:13, João 10:28 ou Romanos 8:38-39) e o memorize completamente até o fim da semana. Ele será a sua âncora nos dias de dúvida.",
          reflectionQuestion:
            "Que dúvida específica sobre sua salvação você quer trazer diante de Deus hoje — e a qual promessa da Palavra você quer se agarrar em resposta?",
          xp: 15,
        },
      ],
    },
    {
      id: "nc-mod-2",
      title: "Módulo II: Primeiros Hábitos",
      lessons: [
        {
          id: "nc-2-1",
          title: "Por que ler a Bíblia todo dia?",
          intro: [
            "Uma das perguntas mais honestas do novo convertido é: 'preciso mesmo ler a Bíblia todos os dias?' Por trás dela há normalmente duas outras: 'não basta ir aos cultos?' e 'não é legalismo ler diariamente?'. Ambas merecem resposta.",
            "Historicamente, a igreja sempre entendeu a leitura pessoal das Escrituras como alimento diário, não como tarefa religiosa. Nos primeiros séculos, quando poucos tinham acesso a manuscritos, a comunidade lia junta em voz alta — mas o ideal sempre foi que cada crente pudesse se encontrar diariamente com a Palavra.",
            "Teologicamente, o motivo é simples: o novo homem tem fome nova. Você não come todo dia porque comer ontem foi um fracasso — come porque hoje você tem fome. A Palavra funciona assim. Não se lê diariamente para ganhar méritos, mas porque a vida espiritual real precisa de alimento real.",
            "Praticamente, o desafio é começar pequeno e sustentável. Melhor cinco minutos todo dia do que uma hora uma vez por mês. A regularidade forma alma; a intensidade sem constância forma frustração.",
          ],
          verses: [
            {
              ref: "Mateus 4:4",
              textByVersion: {
                NVI: "Jesus respondeu: 'Está escrito: Nem só de pão viverá o homem, mas de toda palavra que procede da boca de Deus'.",
                NAA: "Jesus, porém, respondeu: — Está escrito: 'Nem só de pão viverá o homem, mas de toda palavra que procede da boca de Deus'.",
                ACF: "Ele, porém, respondendo, disse: Está escrito: Nem só de pão viverá o homem, mas de toda a palavra que sai da boca de Deus.",
                KJV: "Ele porém, respondendo, disse: Está escrito: Nem só de pão viverá o homem, mas de toda a palavra que sai da boca de Deus.",
                NVT: "Mas Jesus lhe disse: 'As Escrituras dizem: Nem só de pão viverá o homem, mas de toda palavra que procede da boca de Deus'.",
              },
            },
            {
              ref: "Salmos 119:105",
              textByVersion: {
                NVI: "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.",
                NAA: "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.",
                ACF: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.",
                KJV: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.",
                NVT: "A tua palavra é lâmpada que ilumina meus passos e luz que clareia meu caminho.",
              },
              originals: [
                { word: "נֵר", translit: "nēr", meaning: "lâmpada de óleo — a que ilumina o próximo passo, não o horizonte inteiro", lang: "hebraico" },
              ],
            },
          ],
          keywords: [
            { word: "נֵר", translit: "nēr", meaning: "lâmpada portátil de óleo. Não é holofote — é a luz próxima que revela o próximo passo. Deus ilumina hoje, não amanhã inteiro.", lang: "hebraico" },
            { word: "רֶגֶל", translit: "regel", meaning: "pé, passo. A Palavra guia o caminhar concreto, não apenas o pensamento abstrato.", lang: "hebraico" },
            { word: "ῥήματι", translit: "rhēmati", meaning: "'palavra proferida' — a Palavra viva e ativa que sai da boca de Deus, não letra morta.", lang: "grego" },
          ],
          deepDive:
            "O salmista não diz que a Palavra é um holofote que ilumina o horizonte inteiro — ela é 'nēr', a lâmpada de óleo que ilumina o próximo passo. Deus raramente mostra o mapa completo; Ele mostra o próximo passo. Por isso a leitura diária: você precisa da luz de hoje, não da luz do ano que vem. E Jesus, ao ser tentado no deserto, revela que a Palavra é alimento tão essencial quanto o pão. Sem ela, o homem interior enfraquece — mesmo que o exterior pareça forte. A disciplina da leitura diária não é para ganhar aprovação de Deus, mas para receber a luz e o pão que Ele já disse que você precisa hoje.",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "A Bíblia não é um livro que lemos apenas; é um livro que nos lê. Ela nos revela quem somos diante de Deus.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Atos 17:11",
                textByVersion: {
                  NVI: "Os bereanos eram mais nobres do que os tessalonicenses, pois receberam a mensagem com grande interesse e examinavam diariamente as Escrituras, para ver se as coisas eram assim mesmo.",
                },
              },
              {
                ref: "2 Timóteo 3:16-17",
                textByVersion: {
                  NVI: "Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça, para que o homem de Deus seja apto e plenamente preparado para toda boa obra.",
                },
              },
            ],
            additionalKeywords: [
              { word: "ἀνακρίνοντες", translit: "anakrínontes", meaning: "'examinando cuidadosamente'. Descreve os bereanos investigando as Escrituras dia após dia, o padrão de um leitor sério, não apenas de um ouvinte passivo.", lang: "grego" },
            ],
            historicalContext:
              "Durante boa parte da história da Igreja, o acesso pessoal às Escrituras foi limitado — manuscritos eram caros, a alfabetização era rara, e por séculos a Bíblia circulava principalmente em latim, uma língua que o povo comum não falava mais no dia a dia. A Reforma Protestante do século XVI, com a tradução da Bíblia para línguas vernáculas e a invenção da imprensa, devolveu ao crente comum algo que a Igreja primitiva já valorizava: o acesso direto e diário à Palavra, como se vê no elogio que Lucas faz aos bereanos em Atos 17:11, que examinavam as Escrituras por conta própria para confirmar até o ensino do apóstolo Paulo.",
            exegeticalNotes:
              "Salmos 119 é o maior capítulo da Bíblia, um poema acróstico hebraico de 22 estrofes (uma para cada letra do alfabeto hebraico), inteiramente dedicado a celebrar a Palavra de Deus sob diferentes ângulos — lei, testemunho, preceito, promessa, mandamento. Essa estrutura cuidadosa não é acidental: o salmista organiza deliberadamente todo o alfabeto ao redor da Palavra, como quem diz que não existe letra da experiência humana que a Palavra de Deus não alcance.",
            theologicalDebate:
              "Um tema prático, e não propriamente doutrinário, é a escolha da versão bíblica para leitura diária. Traduções de equivalência dinâmica (como NVI e NVT) priorizam clareza e fluência na leitura; traduções de equivalência formal (como ACF e a tradição da KJV) priorizam proximidade literal com o texto original, sendo úteis para estudo mais detido. Nenhuma escolha é errada — muitos leitores se beneficiam de usar uma versão de leitura fluente no dia a dia e consultar uma mais literal ao estudar com mais profundidade.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "Uma Bíblia que se desfaz pelo uso normalmente pertence a alguém que não se desfaz.",
            },
          },
          quizzes: [
            {
              question: "Segundo Salmos 119:105, a Palavra é uma lâmpada porque:",
              options: [
                "Ilumina todo o seu futuro de uma vez",
                "Ilumina o próximo passo do seu caminho",
                "Substitui a necessidade de oração",
                "Só serve para pregação pública",
              ],
              correctIndex: 1,
              explanation: "A palavra hebraica 'nēr' descreve a lâmpada portátil, que ilumina os passos, não o horizonte inteiro.",
            },
            {
              question: "Ao citar Deuteronômio no deserto, Jesus ensina que:",
              options: [
                "O pão não é importante",
                "Palavra de Deus é alimento tão essencial quanto o pão",
                "Só se deve jejuar",
                "A tentação vem sempre da fome",
              ],
              correctIndex: 1,
              explanation: "Sem a Palavra, o homem interior enfraquece — mesmo com o corpo bem alimentado.",
            },
          ],
          application:
            "Escolha, ainda hoje, um horário fixo do seu dia (ao acordar, no almoço ou antes de dormir) e um lugar específico. Reserve 10 minutos para ler um capítulo — comece pelo Evangelho de João. Não é sobre volume, é sobre presença regular.",
          prayer:
            "Pai, cria em mim fome pela tua Palavra. Confesso que muitas vezes eu como pão material com pressa e ignoro o pão que sustenta a alma. Que a leitura diária deixe de ser tarefa e vire alimento. Ilumina o meu próximo passo com a luz da tua Palavra, mesmo quando eu não enxergar o caminho todo. Ensina-me a te ouvir nas Escrituras como filho que ouve o Pai. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia um capítulo do Evangelho de João por dia durante os próximos 7 dias, no mesmo horário. Ao final, anote em uma frase o que Deus falou com você em cada dia.",
          reflectionQuestion:
            "Que horário e lugar do seu dia você quer transformar, a partir de hoje, no seu tempo fixo com a Bíblia?",
          xp: 15,
        },
        {
          id: "nc-2-2",
          title: "Como orar quando não sei orar",
          intro: [
            "Existe um segredo mal contado sobre a vida cristã: quase todo mundo, em algum momento, se sente incapaz de orar. O novo convertido não sabe as palavras; o cristão experiente encontra dias em que as palavras se recusam a vir. Isso não é sinal de fé fraca — é sinal de que a oração é mais profunda do que discurso.",
            "Historicamente, o cristianismo herdou do judaísmo a compreensão de que a oração é, antes de qualquer coisa, um relacionamento. Não é fórmula mágica, nem performance religiosa. É o filho falando com o Pai — e o filho não precisa impressionar quem o ama.",
            "Teologicamente, Jesus rompe uma barreira ao ensinar a chamar Deus de 'Pai'. Isso não era comum no judaísmo da época. Ele oferece intimidade onde havia apenas reverência distante. E Paulo vai além: quando você não sabe orar, o próprio Espírito Santo intercede por você.",
            "Praticamente, aprender a orar é como aprender a conversar com alguém que você ama — começa balbuciando, e a intimidade cresce com o tempo. Não espere ter as palavras certas para começar; comece com as palavras que você tem.",
          ],
          verses: [
            {
              ref: "Mateus 6:9",
              textByVersion: {
                NVI: "Vocês, orem assim: 'Pai nosso, que estás nos céus! Santificado seja o teu nome.",
                NAA: "Portanto, orem vocês assim: 'Pai nosso, que estás nos céus, santificado seja o teu nome.",
                ACF: "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome.",
                KJV: "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome.",
                NVT: "Vocês devem orar assim: 'Pai nosso, que estás no céu, santificado seja o teu nome.",
              },
              originals: [
                { word: "Πάτερ", translit: "Páter", meaning: "Pai — intimidade familiar, não distância religiosa", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:26",
              textByVersion: {
                NVI: "Da mesma forma, o Espírito nos ajuda em nossa fraqueza, pois não sabemos como orar, mas o próprio Espírito intercede por nós com gemidos inexprimíveis.",
                NAA: "Também o Espírito, semelhantemente, nos ajuda na nossa fraqueza; porque não sabemos orar como convém, mas o próprio Espírito intercede por nós com gemidos inexprimíveis.",
                ACF: "E da mesma maneira também o Espírito ajuda as nossas fraquezas; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis.",
                KJV: "E da mesma maneira também o Espírito ajuda as nossas fraquezas; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis.",
                NVT: "E o Espírito Santo nos ajuda em nossa fraqueza. Por exemplo, nós não sabemos o que Deus quer que peçamos em oração, mas o Espírito Santo ora por nós com gemidos que não podem ser expressos em palavras.",
              },
            },
          ],
          keywords: [
            { word: "Πάτερ", translit: "Páter", meaning: "'Pai' — a palavra que a criança usava para chamar o pai em casa. Jesus autoriza intimidade filial, não formalidade religiosa.", lang: "grego" },
            { word: "συναντιλαμβάνεται", translit: "synantilambánetai", meaning: "'ajuda pegando junto do outro lado da carga'. O Espírito não observa você orando — carrega junto.", lang: "grego" },
            { word: "ἐντυγχάνει", translit: "entynchánei", meaning: "'intercede, encontra em favor de'. Quando você não sabe orar, alguém já está orando por você — dentro de você.", lang: "grego" },
          ],
          deepDive:
            "Jesus começa a oração modelo com 'Páter' — a palavra que uma criança usava para chamar seu pai em casa. Não é performance. Deus não é impressionado com vocabulário difícil; Ele é comovido por corações filiais. E quando você não souber orar (todos nós passamos por isso), Paulo garante: o Espírito ora por você. O verbo 'synantilambánetai' descreve alguém que pega o outro lado da carga junto contigo. Você não ora sozinho. Comece pequeno. Fale com o Pai como um filho — e confie que, mesmo quando as palavras falharem, o Espírito continua traduzindo o coração para Deus.",
          theologianQuote: {
            author: "C.S. Lewis",
            text: "Oramos não porque Deus precise ser informado, mas porque nós precisamos ser transformados no processo.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Lucas 11:1",
                textByVersion: {
                  NVI: "Certa vez Jesus estava orando em determinado lugar. Quando terminou, um de seus discípulos lhe disse: 'Senhor, ensina-nos a orar, como João ensinou aos discípulos dele'.",
                },
              },
              {
                ref: "Salmos 62:8",
                textByVersion: {
                  NVI: "Confiem nele em todo tempo, ó povo; derramem diante dele o coração, pois Deus é o nosso refúgio.",
                },
              },
            ],
            additionalKeywords: [
              { word: "στεναγμοῖς", translit: "stenagmoîs", meaning: "'gemidos'. Palavra usada em Romanos 8:26 para descrever a intercessão do Espírito — algo mais profundo do que palavras articuladas, expressando a própria compaixão de Deus por nós.", lang: "grego" },
            ],
            historicalContext:
              "No judaísmo do primeiro século, as orações formais (como a Amidá) geralmente se dirigiam a Deus com títulos de reverência distante — 'Senhor do universo', 'Rei eterno'. Chamar Deus de 'Abbá/Pai' de forma tão direta e íntima, como Jesus ensina no Pai Nosso, era incomum para os padrões religiosos da época. Os discípulos, ao pedirem 'ensina-nos a orar' (Lucas 11:1), reconheciam que havia algo distintivo na vida de oração de Jesus que eles queriam aprender.",
            exegeticalNotes:
              "A expressão 'gemidos inexprimíveis' de Romanos 8:26 tem sido interpretada de formas diferentes ao longo da história da interpretação: alguns leem como referência à oração em línguas; a leitura mais natural do contexto, porém, é que Paulo descreve o próprio Espírito gemendo — não o crente — intercedendo de um modo que ultrapassa qualquer fala humana articulada, seja ordinária ou extraordinária. O texto descreve a ajuda do Espírito na nossa fraqueza ao orar, mais do que uma prática específica a ser reproduzida.",
            theologicalDebate:
              "Cristãos de tradições continuístas entendem os 'gemidos inexprimíveis' de Romanos 8:26, ou expressões semelhantes, como relacionados à oração em línguas como prática contínua na igreja hoje. Esta trilha segue uma perspectiva cessacionista moderada, entendendo que os dons de línguas descritos no Novo Testamento eram idiomas humanos reais (como em Atos 2) com um propósito específico de sinal para aquela fase da história da redenção, e que o texto de Romanos 8:26 descreve a intercessão do próprio Espírito, distinta de qualquer fala humana. Cristãos fiéis discordam legitimamente sobre esse tema — é uma questão secundária, e vale conversar com sua liderança espiritual sobre como sua igreja local o compreende.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "A oração é o respirar da alma nova, o clamor natural do coração que Deus regenerou.",
            },
          },
          quizzes: [
            {
              question: "Qual a atitude central da oração ensinada por Jesus?",
              options: [
                "Repetir fórmulas corretas",
                "Impressionar Deus com palavras difíceis",
                "Falar como filho ao Pai",
                "Orar apenas em público",
              ],
              correctIndex: 2,
              explanation: "'Páter' é a palavra doméstica, familiar. Jesus autoriza intimidade filial.",
            },
            {
              question: "Segundo Romanos 8:26, quando não sabemos orar:",
              options: [
                "Devemos parar de tentar",
                "O Espírito Santo intercede por nós",
                "Perdemos o acesso a Deus",
                "Precisamos pedir a um pastor",
              ],
              correctIndex: 1,
              explanation: "O próprio Espírito ora por você quando as palavras falham.",
            },
          ],
          application:
            "Reserve 5 minutos hoje para conversar com Deus sem roteiro. Fale como falaria com alguém que te ama profundamente e conhece você por inteiro. Se as palavras faltarem, permaneça em silêncio — a presença já é oração.",
          prayer:
            "Pai, obrigado por ser Pai, e não juiz distante. Confesso que muitas vezes tento orar como se precisasse te impressionar, esquecendo que sou filho. Livra-me da religiosidade vazia e da vergonha de não ter as palavras certas. Quando eu não souber orar, confio que o teu Espírito ora dentro de mim aquilo que meu coração não consegue expressar. Ensina-me a te procurar cedo, no meio e no fim do dia — não por obrigação, mas por amor. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Faça, todos os dias desta semana, uma 'oração dos 3 momentos': ao acordar, no meio do dia e antes de dormir. Cada uma pode ter apenas uma frase — mas fale com o Pai em cada um desses três momentos.",
          reflectionQuestion:
            "O que você quer dizer ao Pai hoje que ainda não teve coragem de dizer?",
          xp: 15,
        },
      ],
    },
    {
      id: "nc-mod-3",
      title: "Módulo III: Evangelho e Filiação",
      lessons: [
        {
          id: "nc-3-1",
          title: "O que é o Evangelho?",
          intro: [
            "'Evangelho' virou uma palavra tão comum entre cristãos que quase perdemos o susto que ela deveria causar. Antes de ser um rótulo religioso, era um anúncio público: no mundo greco-romano, 'euangelion' era a notícia oficial de que um novo imperador havia nascido, de que uma guerra fora vencida, de que um novo governo começaria. Era declaração, não conselho.",
            "Quando o Novo Testamento usa essa palavra para descrever a obra de Jesus, ele está dizendo algo muito específico: aconteceu, na história, um evento que muda o mundo — e ele precisa ser anunciado. O Evangelho, portanto, não é primeiramente uma técnica para melhorar de vida nem uma lista de exigências morais. É notícia sobre o que Deus fez em Cristo.",
            "Paulo resume esse conteúdo em quatro cláusulas simples em 1 Coríntios 15: Cristo morreu pelos nossos pecados, foi sepultado, ressuscitou ao terceiro dia e apareceu a testemunhas. Cada uma dessas afirmações é um fato histórico com significado teológico. Retire uma e o Evangelho desmorona; junte-as e você tem a notícia que sustenta a Igreja há dois mil anos.",
            "Praticamente, entender isso muda o ângulo da sua fé. Você não está tentando conquistar Deus com um bom comportamento; você está respondendo à notícia de que Deus, em Cristo, conquistou salvação para você. O que se pede não é performance — é confiança que se traduz em obediência agradecida.",
          ],
          verses: [
            {
              ref: "1 Coríntios 15:3-4",
              textByVersion: {
                NVI: "Pois o que recebi transmiti a vocês, como de primeira importância: que Cristo morreu pelos nossos pecados, segundo as Escrituras, foi sepultado, foi ressuscitado no terceiro dia, segundo as Escrituras.",
                NAA: "Porque, em primeiro lugar, entreguei a vocês o que também recebi: que Cristo morreu pelos nossos pecados, segundo as Escrituras, e que foi sepultado e ressuscitou ao terceiro dia, segundo as Escrituras.",
                ACF: "Porque primeiramente vos entreguei o que também recebi: que Cristo morreu por nossos pecados, segundo as Escrituras, e que foi sepultado, e que ressuscitou ao terceiro dia, segundo as Escrituras.",
                NVT: "Transmiti a vocês o que é da mais alta importância e que também me foi passado: Cristo morreu por nossos pecados, como dizem as Escrituras. Foi sepultado e ressuscitou no terceiro dia, como dizem as Escrituras.",
              },
              originals: [
                { word: "εὐαγγέλιον", translit: "euangélion", meaning: "'boa notícia' — anúncio público de um acontecimento que muda a realidade", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 1:16",
              textByVersion: {
                NVI: "Não me envergonho do evangelho, porque é o poder de Deus para a salvação de todo aquele que crê: primeiro do judeu, depois do grego.",
                NAA: "Porque não me envergonho do evangelho, pois é o poder de Deus para a salvação de todo aquele que crê, primeiro do judeu e também do grego.",
                ACF: "Porque não me envergonho do evangelho de Cristo, pois é o poder de Deus para salvação de todo aquele que crê; primeiro do judeu, e também do grego.",
                NVT: "Não me envergonho da Boa Nova sobre Cristo. Ela é o poder de Deus em ação, para salvar todo aquele que crê — primeiro os judeus e também os gentios.",
              },
              originals: [
                { word: "δύναμις", translit: "dýnamis", meaning: "'poder' — força efetiva que produz resultado; origem da palavra 'dinamite'", lang: "grego" },
              ],
            },
            {
              ref: "Marcos 1:15",
              textByVersion: {
                NVI: "'O tempo é chegado', dizia ele. 'O Reino de Deus está próximo. Arrependam-se e creiam nas boas novas!'",
                NAA: "E dizia: — O tempo está cumprido, e o Reino de Deus está próximo; arrependam-se e creiam no evangelho.",
                ACF: "E dizendo: O tempo está cumprido, e o reino de Deus está próximo. Arrependei-vos, e crede no evangelho.",
                NVT: "'Chegou o tempo prometido por Deus!', ele anunciava. 'O Reino de Deus está próximo! Arrependam-se dos seus pecados e creiam na Boa Nova!'",
              },
              originals: [
                { word: "μετανοεῖτε", translit: "metanoeîte", meaning: "'mudai de mente' — reorientação profunda de pensamento, afetos e direção", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "εὐαγγέλιον", translit: "euangélion", meaning: "'boa notícia'. No mundo romano, o anúncio da vitória ou da coroação de um imperador. Para Paulo, o anúncio de que Jesus é o verdadeiro Rei que venceu o pecado e a morte.", lang: "grego" },
            { word: "δύναμις", translit: "dýnamis", meaning: "'poder efetivo'. O Evangelho não é apenas informação — é força de Deus que produz salvação real em quem crê.", lang: "grego" },
            { word: "πίστις", translit: "pístis", meaning: "'fé, confiança'. Não é assentimento intelectual apenas, mas descanso confiante em Cristo e naquilo que Ele fez.", lang: "grego" },
          ],
          deepDive:
            "John Stott dizia que o Evangelho tem três tempos verbais: passado, presente e futuro. No passado, Cristo morreu e ressuscitou por nós — é fato histórico consumado. No presente, esse mesmo Evangelho continua sendo 'dýnamis' de Deus para salvação — não é apenas o portal por onde entramos na fé, mas o poder que nos sustenta nela. No futuro, esse Evangelho aponta para o Reino que virá em plenitude quando Cristo voltar. Muitos cristãos tratam o Evangelho como algo apenas para não-convertidos — uma espécie de porta de entrada. Mas o Novo Testamento apresenta o Evangelho como o próprio ar que respiramos. Paulo escreve aos cristãos de Roma, gente já convertida, dizendo que quer pregar o Evangelho a eles (Romanos 1:15). Nós nunca deixamos de precisar dele. Toda vez que a culpa acusa, voltamos ao Evangelho. Toda vez que o orgulho infla, voltamos ao Evangelho. Toda vez que o cansaço bate, voltamos ao Evangelho. Ele não é o ABC da fé — ele é a fé inteira, do primeiro dia ao último.",
          theologianQuote: {
            author: "John Stott",
            text: "O Evangelho não é um bom conselho a ser seguido; é uma boa notícia a ser crida. Antes de ser algo que fazemos, é algo que Deus fez.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Isaías 52:7",
                textByVersion: {
                  NVI: "Como são belos, sobre os montes, os pés daquele que traz boas novas, que proclama a paz, que anuncia boas novas, que proclama a salvação, que diz a Sião: 'O teu Deus reina!'",
                },
              },
              {
                ref: "Lucas 4:18",
                textByVersion: {
                  NVI: "O Espírito do Senhor está sobre mim, porque ele me ungiu para pregar boas novas aos pobres. Ele me enviou para proclamar liberdade aos presos e recuperação da vista aos cegos, para libertar os oprimidos.",
                },
              },
            ],
            additionalKeywords: [
              { word: "מְבַשֵּׂר", translit: "mevasser", meaning: "'aquele que anuncia boas novas'. Termo hebraico de Isaías 52:7 que prepara, séculos antes, o vocabulário que o Novo Testamento usará para descrever o anúncio do Evangelho.", lang: "hebraico" },
            ],
            historicalContext:
              "No mundo greco-romano do primeiro século, 'euangélion' já era palavra conhecida fora dos círculos religiosos: usava-se para anunciar publicamente vitórias militares, o nascimento de um herdeiro imperial ou a ascensão de um novo César ao trono — como registra, por exemplo, a inscrição do calendário de Priene (9 a.C.), que chama o nascimento do imperador Augusto de 'boa notícia (euangelion) para o mundo'. Quando os apóstolos anunciam o 'evangelho de Jesus Cristo', eles usam deliberadamente essa linguagem política de proclamação real — dizendo, em contraste direto com César, que o verdadeiro Rei e Senhor do mundo é Jesus.",
            exegeticalNotes:
              "1 Coríntios 15:3-4 é reconhecido por estudiosos como uma fórmula credal extremamente antiga — Paulo usa o vocabulário técnico de 'receber' e 'entregar' (parádosis), linguagem usada para transmissão cuidadosa de tradição fixa, sugerindo que ele está citando uma confissão de fé já estabelecida na Igreja antes mesmo de escrever a carta, datável a poucos anos da morte e ressurreição de Jesus. Isso é relevante historicamente: o núcleo do Evangelho não é lenda que cresceu com o tempo, mas proclamação fixada muito cedo pela comunidade cristã original.",
            theologicalDebate:
              "Existe uma diferença de ênfase entre teólogos sobre a extensão do 'Evangelho': uma leitura mais restrita entende o Evangelho primariamente como a mensagem da salvação pessoal pela fé em Cristo; uma leitura mais ampla, associada a autores como N.T. Wright e a tradições que enfatizam a 'missão integral' (Michael Goheen, Leslie Newbigin, David Bosch), entende o Evangelho também como o anúncio do reinado de Cristo sobre toda a criação, com implicações sociais e cósmicas. Esta trilha entende que o centro do Evangelho é, inegociavelmente, a obra salvadora de Cristo por pecadores (1 Coríntios 15:3-4) — mas reconhece que essa boa notícia tem, de fato, implicações que alcançam toda a vida e toda a criação. É uma questão de ênfase, não de essência do Evangelho, e vale a pena explorá-la com sua liderança espiritual.",
            secondQuote: {
              author: "Tim Keller",
              text: "O Evangelho não é apenas o ABC da vida cristã, mas o A a Z. Não avançamos além dele; avançamos mais fundo nele.",
            },
          },
          quizzes: [
            {
              question: "O que a palavra grega 'euangélion' significa originalmente?",
              options: [
                "Um código secreto religioso",
                "Um anúncio público de uma notícia que muda a realidade",
                "Um manual de moral",
                "Um sinônimo de milagre",
              ],
              correctIndex: 1,
              explanation: "'Euangélion' era o anúncio de vitórias ou da coroação de um imperador. O Novo Testamento usa a palavra para dizer: Jesus é o verdadeiro Rei, e a notícia da sua vitória precisa ser proclamada.",
            },
            {
              question: "Segundo 1 Coríntios 15:3-4, o conteúdo central do Evangelho é:",
              options: [
                "Um conjunto de princípios éticos de Jesus",
                "Que Cristo morreu por nossos pecados, foi sepultado e ressuscitou ao terceiro dia",
                "Que devemos ser boas pessoas para agradar a Deus",
                "Uma promessa de prosperidade material",
              ],
              correctIndex: 1,
              explanation: "Paulo entrega esses fatos como 'de primeira importância'. O Evangelho é história antes de ser aplicação.",
            },
            {
              question: "Em Romanos 1:16, Paulo diz que o Evangelho é 'dýnamis' de Deus, isto é:",
              options: [
                "Uma sugestão religiosa opcional",
                "Poder efetivo que produz salvação em quem crê",
                "Um símbolo apenas simbólico da bondade divina",
                "Uma técnica para ter uma vida melhor",
              ],
              correctIndex: 1,
              explanation: "'Dýnamis' aponta para força que produz resultado real. O Evangelho salva de fato quem crê.",
            },
          ],
          application:
            "Escolha hoje uma acusação que costuma pesar sobre você — uma falha do passado, um pecado recorrente, uma vergonha antiga. Traga essa acusação e coloque-a lado a lado com 1 Coríntios 15:3-4. Diga em voz alta: 'Cristo morreu pelos meus pecados, foi sepultado e ressuscitou'. Essa é a notícia que decide o veredito sobre você — não a acusação.",
          prayer:
            "Pai, obrigado pela Boa Notícia. Confesso que muitas vezes vivo como se ainda precisasse conquistar teu favor, esquecendo que Cristo já fez tudo o que era necessário. Perdoa-me quando trato o Evangelho como assunto antigo — como se ele fosse apenas a porta de entrada da fé, e não o chão onde piso todos os dias. Renova em mim o assombro do que Jesus fez: morreu pelos meus pecados, foi sepultado, ressuscitou. Que essa notícia me sustente na acusação, me humilhe no orgulho, me console no cansaço. Ensina-me a viver, hoje, à luz dessa vitória. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva, em três frases suas, o que é o Evangelho. Guarde essa versão no celular. Ao longo da semana, compartilhe-a com pelo menos uma pessoa — pode ser um irmão de fé, para conferir; pode ser alguém que ainda não conhece a Cristo, como testemunho.",
          reflectionQuestion:
            "Em que área da sua vida você ainda vive como se o Evangelho não bastasse — como se você precisasse acrescentar algo do seu próprio esforço para ser aceito por Deus?",
          xp: 20,
        },
        {
          id: "nc-3-2",
          title: "Graça e Adoção: chamado de filho",
          intro: [
            "Quando o Novo Testamento quer descrever o que aconteceu na sua salvação, ele usa várias imagens: você foi justificado (linguagem de tribunal), reconciliado (linguagem de relacionamento quebrado e restaurado), redimido (linguagem de escravo comprado da escravidão). Mas há uma imagem que Paulo prefere quando quer descrever o coração da salvação: adoção.",
            "'Huiothesía' é a palavra grega. Ela vem do mundo romano, onde a adoção era um ato jurídico irrevogável. Um pai romano podia deserdar um filho biológico; jamais podia deserdar um filho adotivo. A adoção conferia nome, herança e status para sempre. Quando Paulo usa essa palavra para descrever nossa relação com Deus, ele está dizendo algo muito específico: você não é apenas perdoado — você é família.",
            "Historicamente, a teologia da adoção foi um pouco esquecida durante séculos, tratada como consequência lateral da justificação. Foi J. I. Packer, no século XX, quem devolveu o brilho a essa doutrina, chamando-a de 'o maior privilégio que o Evangelho oferece'. Não porque a justificação seja menos — mas porque a adoção descreve a intimidade que a justificação torna possível.",
            "Praticamente, a diferença entre viver como servo e viver como filho muda tudo. Servos trabalham por medo de perder o emprego; filhos trabalham por amor pela casa. Servos precisam merecer a comida do dia; filhos comem à mesa como parte da família. A graça não te faz apenas um perdoado com boa conduta — ela te faz filho de Deus.",
          ],
          verses: [
            {
              ref: "Efésios 1:4-5",
              textByVersion: {
                NVI: "Porque Deus nos escolheu nele antes da criação do mundo, para sermos santos e irrepreensíveis em sua presença. Em amor nos predestinou para sermos adotados como filhos por meio de Jesus Cristo, conforme o bom propósito da sua vontade.",
                NAA: "Assim como nos escolheu, nele, antes da fundação do mundo, para sermos santos e irrepreensíveis diante dele no amor; e nos predestinou para sermos adotados como filhos, por meio de Jesus Cristo, para si mesmo, conforme o bom propósito da sua vontade.",
                ACF: "Como também nos elegeu nele antes da fundação do mundo, para que fôssemos santos e irrepreensíveis diante dele em amor; e nos predestinou para filhos de adoção por Jesus Cristo, para si mesmo, segundo o beneplácito de sua vontade.",
                NVT: "Antes mesmo de criar o mundo, Deus nos amou e nos escolheu em Cristo para sermos santos e irrepreensíveis diante dele. Deus decidiu de antemão que nos adotaria em sua própria família, trazendo-nos a si mesmo por meio de Jesus Cristo. Isso lhe deu enorme prazer.",
              },
              originals: [
                { word: "υἱοθεσία", translit: "huiothesía", meaning: "'adoção como filho' — ato jurídico irrevogável no mundo greco-romano, conferindo nome, herança e status permanente", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:15",
              textByVersion: {
                NVI: "Pois vocês não receberam um espírito que os torne novamente escravos do medo, mas receberam o Espírito que os adota como filhos, por meio do qual clamamos: 'Aba, Pai'.",
                NAA: "Porque vocês não receberam o espírito de escravidão para, de novo, terem medo, mas receberam o Espírito de adoção, pelo qual clamamos: — Aba, Pai!",
                ACF: "Porque não recebestes o espírito de escravidão, para outra vez estardes em temor, mas recebestes o Espírito de adoção de filhos, pelo qual clamamos: Aba, Pai.",
                NVT: "Vocês não receberam de Deus um espírito que os torne outra vez escravos do medo; receberam, ao contrário, o Espírito de Deus, quando ele os adotou como seus próprios filhos. E, pelo Espírito, dizemos: 'Aba, Pai'.",
              },
              originals: [
                { word: "Ἀββά", translit: "Abbá", meaning: "termo aramaico íntimo pelo qual um filho chamava o pai; carrega ternura, confiança e proximidade", lang: "grego" },
              ],
            },
            {
              ref: "João 1:12",
              textByVersion: {
                NVI: "Contudo, aos que o receberam, aos que creram em seu nome, deu-lhes o direito de se tornarem filhos de Deus.",
                NAA: "Mas a todos quantos o receberam, aos que creem no seu nome, deu-lhes o direito de se tornarem filhos de Deus.",
                ACF: "Mas, a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus, aos que crêem no seu nome.",
                NVT: "Mas, a todos que creram nele e o aceitaram, ele deu o direito de se tornarem filhos de Deus.",
              },
              originals: [
                { word: "τέκνα", translit: "tékna", meaning: "'filhos' pelo laço de nascimento; termo afetivo que sublinha o vínculo familiar real", lang: "grego" },
                { word: "ἐξουσίαν", translit: "exousían", meaning: "'direito, autoridade' — não capacidade humana, mas prerrogativa concedida por Deus", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "χάρις", translit: "cháris", meaning: "'graça' — favor totalmente imerecido. É o solo em que a adoção acontece: ninguém é adotado por mérito próprio.", lang: "grego" },
            { word: "υἱοθεσία", translit: "huiothesía", meaning: "'adoção como filho'. No direito romano, um ato irrevogável que conferia nome, herança e identidade permanente ao adotado.", lang: "grego" },
            { word: "Ἀββά", translit: "Abbá", meaning: "palavra aramaica que Jesus mesmo usou para se dirigir ao Pai (Marcos 14:36). Colocada em nossos lábios pelo Espírito, ela é sinal de que somos família.", lang: "grego" },
          ],
          deepDive:
            "A graça abre caminho para a adoção, e a adoção é onde a graça alcança seu ápice. Paulo escolhe a palavra 'huiothesía' com precisão jurídica: no mundo romano, o filho adotivo assumia um novo nome, entrava numa nova linhagem, herdava plenamente e não podia ser deserdado. Aplicado à salvação, isso significa que Deus não te deu apenas um perdão — Ele te deu um sobrenome. Você chama-se, agora, filho. E, mais impressionante ainda, o Espírito Santo põe nos seus lábios a mesma palavra que Jesus usou no Getsêmani: 'Abbá' (Marcos 14:36). É o vocabulário familiar da Trindade sendo emprestado a você. J. I. Packer disse que se você quer avaliar o quanto entendeu o cristianismo, pergunte-se se você pensa em Deus, e se dirige a Deus, como Pai. Se sim, você entendeu o Evangelho. Se essa palavra ainda soa estranha, distante, aterrorizante — o problema não é teológico, é filial. A boa notícia é que o próprio Espírito ensina o coração adotado a soletrar 'Abbá'. Não com esforço religioso, mas com descanso confiante. Você não precisa merecer ser filho; você já é. O que resta é aprender a viver como um.",
          theologianQuote: {
            author: "J. I. Packer",
            text: "A adoção é o mais alto privilégio que o Evangelho oferece: mais alto que a própria justificação. A justificação nos dá um veredito favorável; a adoção nos dá um Pai.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Oséias 11:1",
                textByVersion: {
                  NVI: "Quando Israel era menino, eu o amei, e do Egito chamei o meu filho.",
                },
              },
              {
                ref: "1 João 3:1",
                textByVersion: {
                  NVI: "Vejam como é grande o amor que o Pai nos concedeu, que sejamos chamados filhos de Deus! E de fato somos! Por isso o mundo não nos conhece, porque não o conheceu.",
                },
              },
            ],
            additionalKeywords: [
              { word: "τέκνα Θεοῦ", translit: "tékna Theoú", meaning: "'filhos de Deus'. Termo preferido do apóstolo João, com ênfase no vínculo de nascimento (nova criação); complementa a imagem jurídica de 'huiothesía' que Paulo usa, com ênfase no ato legal de adoção.", lang: "grego" },
            ],
            historicalContext:
              "No mundo romano, a adoção de um herdeiro era prática comum entre famílias de posição social, e nem sempre envolvia crianças: o caso mais famoso da história romana é a adoção de Otávio (o futuro imperador Augusto) por Júlio César, que o tornou herdeiro legal pleno, com novo nome e status, apesar de Otávio já ser adulto. Esse pano de fundo cultural ilumina por que Paulo escolhe a linguagem de adoção, e não apenas de nascimento, para descrever nossa nova relação com Deus: ela enfatiza uma decisão deliberada e um ato legal, não apenas um evento biológico.",
            exegeticalNotes:
              "É digno de nota que a palavra grega 'huiothesía' aparece apenas cinco vezes no Novo Testamento, todas em cartas de Paulo (Romanos 8:15, 8:23, 9:4; Gálatas 4:5; Efésios 1:5) — nunca nos escritos de João, que prefere a imagem de 'tékna Theoú' ('filhos de Deus'), com ênfase no nascimento espiritual (ver nc-1-1). As duas imagens não competem: Paulo enfatiza o ato jurídico e a mudança de status; João enfatiza a origem nova e o vínculo íntimo. Juntas, formam um quadro completo — você se tornou filho tanto por um novo nascimento quanto por um ato de adoção deliberado da parte de Deus.",
            theologicalDebate:
              "A relação entre a adoção do crente individual e o conceito bíblico mais amplo de 'filiação' de Israel como povo (Êxodo 4:22, Oséias 11:1) é discutida de formas diferentes por tradições teológicas: teologias de aliança tendem a enfatizar continuidade entre a filiação de Israel e a adoção da Igreja como o povo renovado de Deus; outras tradições, incluindo boa parte da tradição batista, enfatizam mais a novidade radical da adoção individual trazida pelo Evangelho, sem negar a continuidade da história da redenção. Esta é uma questão secundária de teologia bíblica, e não afeta a certeza central desta lição: em Cristo, você é verdadeiramente filho de Deus.",
            secondQuote: {
              author: "Wayne Grudem",
              text: "A adoção é um ato de Deus pelo qual Ele nos torna membros de sua família, com todos os privilégios e responsabilidades de filhos.",
            },
          },
          quizzes: [
            {
              question: "A palavra grega 'huiothesía' descreve:",
              options: [
                "Um estado provisório que pode ser revertido",
                "Um ato jurídico irrevogável que confere nome, herança e status de filho",
                "Um sentimento passageiro de proximidade com Deus",
                "Uma prática ritual do Antigo Testamento",
              ],
              correctIndex: 1,
              explanation: "No mundo romano, a adoção era irrevogável: um pai podia deserdar um filho biológico, mas jamais um filho adotivo. Paulo usa essa força jurídica para descrever nossa segurança em Deus.",
            },
            {
              question: "Segundo Romanos 8:15, o Espírito Santo produz no filho adotado:",
              options: [
                "Medo constante de perder a salvação",
                "Um clamor íntimo e confiante: 'Abbá, Pai'",
                "A obrigação de ganhar a aprovação de Deus por obras",
                "Uma sensação vaga de espiritualidade",
              ],
              correctIndex: 1,
              explanation: "O mesmo Espírito que estava sobre Jesus no Getsêmani coloca em seus lábios a mesma palavra íntima: 'Abbá'. É sinal de família, não de escravidão.",
            },
            {
              question: "A diferença entre viver como servo e viver como filho de Deus é:",
              options: [
                "Nenhuma — os dois trabalham igualmente",
                "O servo trabalha por medo de perder o lugar; o filho serve por amor e pertence à casa",
                "O filho não precisa mais obedecer",
                "O servo tem mais herança",
              ],
              correctIndex: 1,
              explanation: "A adoção não anula a obediência — ela muda o motivo. Filhos obedecem por amor, não por medo.",
            },
          ],
          application:
            "Nesta semana, quando você orar, comece deliberadamente com a palavra 'Pai'. Se soar estranho, permaneça alguns segundos em silêncio antes de continuar — deixe o Espírito Santo confirmar dentro de você que essa palavra é verdadeira. Repita esse exercício todos os dias. Você não está tentando gerar um sentimento — está aprendendo a reconhecer uma identidade que já é sua.",
          prayer:
            "Pai, obrigado por não me tratar como servo distante, mas como filho amado. Confesso que, muitas vezes, ainda ajo como escravo do medo — trabalhando para conquistar teu favor, escondendo minhas falhas por vergonha, achando que preciso merecer a tua presença. Ensina-me a viver como quem já foi adotado por ti em Cristo. Quando eu esquecer, que teu Espírito me lembre, colocando de novo em meus lábios a palavra 'Abbá'. Que essa identidade filial molde minha oração, meu trabalho, minhas relações, minhas quedas e minha alegria. Em nome de Jesus, teu Filho eterno, e nosso Senhor e Salvador, amém.",
          weeklyChallenge:
            "Escreva num caderno: 'Sou filho(a) de Deus por adoção em Cristo. Isso é verdade sobre mim, hoje.' Releia essa frase toda manhã, por sete dias, antes de qualquer outra atividade. Ao fim da semana, anote como essa lembrança começou a mudar suas reações diante de erros, medos e conquistas.",
          reflectionQuestion:
            "Em que áreas da sua vida você ainda vive como servo com medo, e não como filho amado? O que mudaria hoje se você abraçasse plenamente a identidade de filho(a) adotado(a) em Cristo?",
          xp: 20,
        },
      ],
    },
    {
      id: "nc-mod-4",
      title: "Módulo IV: Corpo e Missão",
      lessons: [
        {
          id: "nc-4-1",
          title: "Igreja e Comunhão",
          difficulty: 2,
          intro: [
            "Um erro comum entre novos convertidos é pensar que a vida cristã é, no fundo, um assunto entre 'eu e Deus' — e que a igreja é só um complemento opcional, útil para quem gosta desse tipo de coisa. A Bíblia ensina algo bem diferente: no instante em que você nasceu de novo, você foi colocado dentro de um corpo. Não existe, no Novo Testamento, a categoria de 'cristão sozinho'.",
            "Desde o dia de Pentecostes, a marca dos primeiros convertidos não foi apenas a fé pessoal, mas a vida compartilhada: 'perseveravam na doutrina dos apóstolos, na comunhão, no partir do pão e nas orações' (Atos 2:42). A igreja não nasceu como uma ideia organizacional posterior — ela nasceu junto com a conversão dos primeiros três mil, no mesmo dia.",
            "Isso não significa que frequentar reuniões substitui a comunhão real. 'Koinonia' — a palavra grega para comunhão — descreve participação compartilhada, vida em comum, não apenas presença física num mesmo prédio. É possível estar numa igreja cheia e viver espiritualmente sozinho; e é isso que o Novo Testamento quer evitar quando manda os crentes não abandonarem 'a nossa congregação' (Hebreus 10:25).",
          ],
          verses: [
            {
              ref: "Atos 2:42",
              textByVersion: {
                NVI: "Eles se dedicavam ao ensino dos apóstolos e à comunhão, ao partir do pão e às orações.",
                NAA: "E perseveravam na doutrina dos apóstolos, e na comunhão, e no partir do pão, e nas orações.",
                ACF: "E perseveravam na doutrina dos apóstolos, e na comunhão, e no partir do pão, e nas orações.",
                NVT: "Todos os credores se dedicavam com fervor ao ensino dos apóstolos, à vida em comunidade, à Ceia do Senhor e às orações.",
              },
              originals: [
                { word: "κοινωνία", translit: "koinōnía", meaning: "comunhão, participação compartilhada, vida em comum", lang: "grego" },
              ],
            },
            {
              ref: "Hebreus 10:24-25",
              textByVersion: {
                NVI: "E consideremos uns aos outros, a fim de incentivar-nos ao amor e às boas obras, não abandonando a nossa congregação, como é costume de alguns, mas encorajando-nos uns aos outros, ainda mais quando vocês vêem que se aproxima o Dia.",
                NAA: "E consideremos uns aos outros, para nos incentivarmos ao amor e às boas obras. Não deixemos de reunir-nos, como é costume de alguns; antes, façamos admoestações mútuas, e tanto mais quanto vedes que se aproxima aquele Dia.",
                ACF: "E consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras, não deixando a nossa congregação, como é costume de alguns; antes, admoestando-nos uns aos outros; e tanto mais, quanto vedes que se vai aproximando aquele dia.",
                NVT: "Também vamos pensar em maneiras de estimular uns aos outros a atos de amor e boas obras. E não deixemos de nos reunir, como é costume de alguns, mas encorajemo-nos uns aos outros, principalmente agora que o dia da volta do Senhor está se aproximando.",
              },
            },
          ],
          keywords: [
            { word: "κοινωνία", translit: "koinōnía", meaning: "'comunhão'. Não é sinônimo de socializar — descreve participação real e compartilhada na vida, nos recursos e no sofrimento uns dos outros.", lang: "grego" },
          ],
          deepDive:
            "'Koinōnía' aparece em Atos 2:42 ao lado de três outras práticas — ensino, partir do pão, orações — como parte do mesmo pacote da vida cristã inicial, não como opcional avançado. E o contexto de Hebreus 10:24-25 é revelador: o autor não manda simplesmente 'não faltar aos cultos' — ele conecta a reunião com um propósito específico, 'incentivar-nos ao amor e às boas obras' e 'encorajar-nos uns aos outros'. Ou seja, a igreja existe para que crentes ativamente cuidem uns dos outros, não apenas para que ouçam uma pregação em silêncio e vão embora. Um cristão que evita a igreja local não está apenas perdendo um benefício espiritual — está retirando de si mesmo um dos meios que Deus escolheu para sua própria santificação, e retirando de outros o cuidado que ele deveria oferecer.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "A presença física de outros cristãos é uma fonte de alegria e força incomparáveis para o crente.",
          },
          deepen: {
            historicalContext:
              "A carta aos Hebreus foi escrita para uma comunidade de cristãos judeus sob pressão de perseguição, provavelmente tentados a abandonar as reuniões cristãs para evitar exposição pública ou para retornar à segurança social da sinagoga. Nesse contexto, 'não abandonar a nossa congregação' não é um conselho genérico de boa prática religiosa — é uma exortação urgente contra o isolamento voluntário como estratégia de autoproteção diante da perseguição, algo que a igreja perseguida enfrenta até hoje em diversas partes do mundo.",
            exegeticalNotes:
              "O verbo grego por trás de 'consideremos uns aos outros' (katanoōmen) sugere observação atenta e propositada — não um olhar distraído. A igreja primitiva entendia que 'ir à igreja' envolvia estudar ativamente as necessidades dos irmãos ao redor, e não apenas consumir um culto. Isso é coerente com a visão de igreja adotada neste material: comunhão ativa, na qual cada membro participa do cuidado mútuo da igreja local, e não apenas a presença passiva.",
            theologicalDebate:
              "Existe uma diferença legítima entre tradições cristãs sobre a estrutura de governo da igreja local (congregacional, presbiteriana, episcopal). Este material apresenta o modelo congregacional, no qual a autoridade de decisão pertence à congregação reunida, sob a liderança de pastores/presbíteros e diáconos servos — mas reconhece que outras tradições organizam essa autoridade de forma diferente, com igual zelo pelas Escrituras. Isso é uma questão secundária de eclesiologia, na qual cristãos fiéis discordam com base em leituras diferentes do Novo Testamento — vale conversar com seu pastor sobre como sua igreja local está estruturada e por quê.",
          },
          quizzes: [
            {
              question: "Segundo Atos 2:42, o que caracterizava a vida dos primeiros convertidos, além da fé pessoal?",
              options: [
                "Isolamento para estudo bíblico individual",
                "Perseverança conjunta no ensino, na comunhão, no partir do pão e nas orações",
                "Reuniões apenas uma vez por ano",
                "Dependência exclusiva dos apóstolos para tudo",
              ],
              correctIndex: 1,
              explanation: "A vida cristã nasceu, desde o início, como vida compartilhada — não como prática individual isolada.",
            },
            {
              question: "Um cristão que diz 'minha fé é só entre mim e Deus, não preciso de igreja' está em desacordo com qual ensino bíblico central desta lição?",
              options: [
                "Com nenhum — essa é uma posição bíblica legítima",
                "Com o padrão do Novo Testamento, no qual a conversão insere o crente num corpo, e a comunhão é meio de crescimento e cuidado mútuo",
                "Apenas com uma tradição cultural, sem base bíblica",
                "Com a doutrina da salvação apenas pela graça",
              ],
              correctIndex: 1,
              explanation: "Hebreus 10:24-25 e Atos 2:42 mostram que a comunhão não é acessório — é parte do desenho bíblico da vida cristã.",
            },
            {
              question: "Por que o autor de Hebreus manda os crentes 'não abandonar a nossa congregação'?",
              options: [
                "Apenas por tradição religiosa, sem propósito declarado",
                "Para que se incentivem mutuamente ao amor e às boas obras, especialmente diante da pressão e da perseguição",
                "Porque a oração individual não tem valor",
                "Porque a Bíblia proíbe qualquer tempo a sós com Deus",
              ],
              correctIndex: 1,
              explanation: "O propósito da reunião é explicitamente relacional e mútuo — incentivo e encorajamento uns aos outros.",
            },
          ],
          application:
            "Esta semana, além de participar de um culto ou reunião da sua igreja, procure ativamente um irmão ou irmã na fé e pergunte como ele está — de verdade. Ouça, e ofereça oração ou ajuda concreta se for o caso. Pratique 'koinōnía', não apenas presença.",
          prayer:
            "Pai, obrigado por não me deixares sozinho na fé. Perdoa-me quando trato a igreja como opcional, ou quando vou às reuniões sem realmente me importar com quem está ao meu lado. Ensina-me a viver em comunhão de verdade — a considerar os outros, a encorajar, a ser encorajado. Que eu nunca abandone a congregação dos teus filhos, especialmente nos dias difíceis. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Identifique um irmão ou irmã da sua igreja que você conhece pouco. Esta semana, tome a iniciativa de conversar com essa pessoa e conhecer sua história de fé.",
          reflectionQuestion:
            "Você tem vivido a fé cristã como algo compartilhado, ou tem mantido distância da comunhão da igreja? O que te impede de se aproximar mais?",
          xp: 20,
        },
        {
          id: "nc-4-2",
          title: "Batismo",
          difficulty: 2,
          intro: [
            "Depois de crer em Cristo, toda pessoa no Novo Testamento é chamada a dar um passo público e concreto: o batismo. Não é um convite opcional para quem 'se sentir à vontade' — no livro de Atos, o batismo acontece imediatamente após a conversão, quase sempre no mesmo dia (Atos 2:41; 8:36-38; 16:33).",
            "É importante entender o que o batismo é e o que ele não é. Ele não salva ninguém — a salvação vem exclusivamente pela graça, mediante a fé em Cristo (Efésios 2:8-9). O batismo é, antes, um testemunho público: uma declaração visível de algo que já aconteceu invisivelmente no coração. Este material apresenta o batismo como sendo para aqueles que já professam fé pessoal em Cristo — batismo do crente, por imersão — e não um rito que gera ou garante a salvação por si mesmo.",
            "Paulo usa uma imagem poderosa para explicar o significado do batismo: ele representa a nossa união com a morte, sepultamento e ressurreição de Cristo (Romanos 6:3-4). Ao ser imerso na água, o crente encena visivelmente o que já é verdade espiritual: o velho homem morreu com Cristo, e uma vida nova ressuscitou com Ele.",
          ],
          verses: [
            {
              ref: "Romanos 6:3-4",
              textByVersion: {
                NVI: "Ou vocês não sabem que todos nós, que fomos batizados em Cristo Jesus, fomos batizados em sua morte? Fomos sepultados com ele por meio do batismo na morte, a fim de que, assim como Cristo foi ressuscitado dentre os mortos mediante a glória do Pai, também nós vivamos uma vida nova.",
                NAA: "Ou não sabeis que todos quantos fomos batizados em Cristo Jesus fomos batizados na sua morte? Fomos, pois, sepultados com ele pelo batismo na morte, para que, assim como Cristo ressuscitou dentre os mortos, pela glória do Pai, assim também andemos nós em novidade de vida.",
                ACF: "Ou não sabeis que todos quantos fomos batizados em Jesus Cristo fomos batizados na sua morte? De sorte que fomos sepultados com ele pelo batismo na morte, para que, como Cristo ressuscitou dentre os mortos pela glória do Pai, assim andemos nós também em novidade de vida.",
                NVT: "Vocês não sabem que, quando fomos batizados para nos unirmos a Cristo Jesus, todos nós fomos batizados em sua morte? Pois fomos sepultados com Cristo pelo batismo na morte. E, assim como Cristo foi ressuscitado dos mortos pela glória gloriosa do Pai, agora nós também podemos viver uma vida nova.",
              },
              originals: [
                { word: "βαπτίζω", translit: "baptízō", meaning: "imergir, mergulhar completamente — a imagem visual de ser submerso e emergir", lang: "grego" },
              ],
            },
            {
              ref: "Atos 8:36-38",
              textByVersion: {
                NVI: "Indo eles pelo caminho, chegaram a um lugar onde havia água, e o eunuco disse: 'Aqui há água. Que me impede de ser batizado?' [...] E desceram ambos à água, e Filipe o batizou.",
                NAA: "E, indo eles caminhando, chegaram a um lugar onde havia água. Então, disse o eunuco: — Eis aqui água; que impede que eu seja batizado? [...] E desceram ambos à água, tanto Filipe como o eunuco, e Filipe o batizou.",
              },
            },
          ],
          keywords: [
            { word: "βαπτίζω", translit: "baptízō", meaning: "'imergir, mergulhar completamente'. A própria palavra descreve o modo do batismo praticado no Novo Testamento: por imersão, não por aspersão.", lang: "grego" },
          ],
          deepDive:
            "Em cada caso registrado no livro de Atos, o padrão é o mesmo: uma pessoa ouve o Evangelho, crê, e é batizada — nessa ordem, e geralmente sem demora. O eunuco etíope, ao ver água no caminho, pergunta 'que me impede de ser batizado?' — evidência de que ele já entendia o batismo como resposta natural e imediata à fé. Isso não significa que a preparação seja dispensável: a igreja local tem a responsabilidade de instruir e acompanhar quem será batizado. O ponto é outro — é a fé, e não o acúmulo de exigências externas, que qualifica alguém para o batismo. A palavra grega 'baptízō' descrevia, no uso comum da época, o ato de mergulhar um tecido no tingimento ou afundar um navio — sempre com o sentido de submersão completa, o que explica por que diversas tradições cristãs praticam o batismo por imersão total, e não por aspersão. O significado teológico, segundo Romanos 6, não é lavagem de pecados (isso já aconteceu pela fé), mas identificação visível com a morte e ressurreição de Cristo — o crente 'morre' simbolicamente ao ser submerso, e 'ressuscita' ao emergir da água, numa encenação pública do Evangelho que ele já criu.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "A simplicidade e a aparente inutilidade da ordenança devem levar o crente a dizer: 'Faço isso porque se torna, para mim, o melhor teste da minha obediência ao meu Mestre.'",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Mateus 28:19",
                textByVersion: {
                  NVI: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai e do Filho e do Espírito Santo.",
                },
              },
            ],
            historicalContext:
              "No judaísmo do primeiro século, já existia a prática de imersão ritual (mikveh) para purificação cerimonial, e João Batista chocou seus contemporâneos ao chamar judeus — não apenas gentios convertidos — a esse mesmo ato, como sinal de arrependimento. Isso preparou o terreno cultural para que o batismo cristão fosse entendido, desde o início, como um rito visível e público de identificação com uma nova realidade espiritual.",
            exegeticalNotes:
              "O verbo 'baptízō' na literatura grega secular da época (por exemplo, em textos sobre tingimento de tecidos) descreve consistentemente imersão completa, não aspersão parcial. Isso é relevante para o modo do batismo, mas — é importante dizer com honestidade — o Novo Testamento não descreve com detalhes técnicos exatos a quantidade de água ou a postura física em cada caso registrado; a convicção sobre o modo (imersão) apoia-se principalmente no sentido lexical do verbo e no simbolismo de sepultamento e ressurreição de Romanos 6.",
            theologicalDebate:
              "Este é um tema em que cristãos fiéis historicamente divergem, e é importante apresentar isso com honestidade. Tradições paedobatistas (que praticam o batismo de bebês de famílias cristãs, comuns em igrejas reformadas, luteranas, anglicanas e católicas) entendem o batismo como sinal de aliança, análogo à circuncisão no Antigo Testamento, aplicado à família do crente. Tradições credobatistas — a posição apresentada neste material — entendem que o Novo Testamento consistentemente liga o batismo à profissão pessoal de fé que precede o rito (por isso 'batismo do crente'), e portanto reservam o batismo para quem já é capaz de professar fé conscientemente. Ambas as tradições concordam que o batismo não salva por si mesmo, e que a fé em Cristo é indispensável. Esta é uma questão doutrinária importante, mas não essencial à salvação — se você tem dúvidas ou vem de uma tradição diferente, converse com seu pastor ou líder de discipulado antes de tomar uma decisão sobre seu próprio batismo.",
          },
          quizzes: [
            {
              question: "Segundo a lição, qual é a relação correta entre fé e batismo?",
              options: [
                "O batismo salva a pessoa, independentemente da fé",
                "A fé salva; o batismo é o testemunho público de uma salvação que já aconteceu",
                "Fé e batismo são exatamente a mesma coisa",
                "O batismo deve ser adiado por vários anos após a conversão para testar a fé",
              ],
              correctIndex: 1,
              explanation: "Efésios 2:8-9 é claro: a salvação vem pela graça, mediante a fé. O batismo é resposta obediente e pública a essa salvação, não sua causa.",
            },
            {
              question: "O que o batismo representa, segundo Romanos 6:3-4?",
              options: [
                "Uma limpeza física do corpo",
                "A identificação do crente com a morte, sepultamento e ressurreição de Cristo",
                "Um ritual sem qualquer significado teológico",
                "A entrada automática no céu",
              ],
              correctIndex: 1,
              explanation: "O crente 'morre' simbolicamente ao ser imerso e 'ressuscita' ao emergir — uma encenação visível do Evangelho que ele já criu.",
            },
            {
              question: "No relato do eunuco etíope (Atos 8:36-38), o que chama atenção sobre o momento do batismo?",
              options: [
                "Ele foi orientado a esperar meses antes de ser batizado",
                "Ele foi batizado imediatamente após crer, assim que havia água disponível",
                "Ele recusou o batismo por não entender seu significado",
                "Ele exigiu um exame teológico longo antes do batismo",
              ],
              correctIndex: 1,
              explanation: "O padrão do livro de Atos é batismo como resposta imediata à fé — o que não dispensa a preparação e o acompanhamento da igreja local, mas mostra que é a fé, e não a demora, que qualifica alguém para o batismo.",
            },
          ],
          application:
            "Se você já creu em Cristo e ainda não foi batizado, converse esta semana com seu pastor ou líder da igreja sobre os próximos passos. Se você já foi batizado, escreva num papel o que esse dia significou — e agradeça a Deus por ele.",
          prayer:
            "Senhor, obrigado pela salvação que já é minha pela graça, mediante a fé em Cristo. Ensina-me a não ter vergonha de declarar publicamente o que aconteceu no meu coração. Que meu batismo — já vivido ou ainda por vir — seja um testemunho fiel da minha morte para o pecado e da minha nova vida em ti. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Se você ainda não foi batizado como crente, dê o primeiro passo esta semana: converse com sua liderança espiritual sobre agendar seu batismo. Se já foi batizado, compartilhe seu testemunho de batismo com alguém que ainda não o conhece.",
          reflectionQuestion:
            "O que impede você de dar (ou de valorizar) o passo público do batismo como testemunho da sua fé?",
          xp: 20,
        },
        {
          id: "nc-4-3",
          title: "Missão Inicial",
          difficulty: 3,
          intro: [
            "Uma das primeiras coisas que Jesus fez com cada pessoa que chamou foi enviá-la a contar para outra. André, assim que encontrou o Messias, foi direto ao seu irmão Simão e disse: 'Achamos o Messias' (João 1:41). Ele não esperou anos de maturidade teológica — sua própria experiência recente já era suficiente para um convite simples e honesto.",
            "Isso não significa que todo novo convertido precisa se tornar um evangelista treinado da noite para o dia — essa formação mais completa é o assunto de uma trilha própria, mais à frente. Mas o Novo Testamento não conhece a categoria de 'cristão silencioso por vocação'. Antes mesmo de saber muita teologia, você já tem a coisa mais persuasiva que existe: sua própria história de como Cristo mudou sua vida.",
            "Jesus deu essa mesma missão ao endemoninhado gadareno, curado ainda antes de qualquer discipulado formal: 'Vai para tua casa, para os teus, e anuncia-lhes quão grandes coisas o Senhor te fez' (Marcos 5:19). A missão inicial de todo novo crente começa exatamente onde ele está — na própria casa, entre os próprios amigos.",
          ],
          verses: [
            {
              ref: "João 1:40-42",
              textByVersion: {
                NVI: "André, irmão de Simão Pedro, era um dos dois que tinham ouvido as palavras de João e seguido Jesus. O primeiro que ele encontrou foi seu irmão Simão, a quem disse: 'Achamos o Messias' (isto é, o Cristo). E o levou a Jesus.",
                NAA: "Um dos dois que ouviram João falar, seguindo a Jesus, era André, irmão de Simão Pedro. Ele foi primeiro ter com seu irmão, Simão, e lhe disse: — Achamos o Messias (que quer dizer Cristo). E o levou a Jesus.",
              },
            },
            {
              ref: "Marcos 5:19",
              textByVersion: {
                NVI: "Jesus, porém, não o permitiu, mas disse: 'Vá para casa, para a sua família, e conte-lhes quanto o Senhor fez por você, e como teve misericórdia de você.'",
                NAA: "Jesus, porém, não lho permitiu, mas lhe disse: — Vai para tua casa, para os teus, e anuncia-lhes quão grandes coisas te fez o Senhor e como teve compaixão de ti.",
              },
            },
            {
              ref: "Atos 1:8",
              textByVersion: {
                NVI: "Mas receberão poder quando o Espírito Santo descer sobre vocês, e serão minhas testemunhas em Jerusalém, em toda a Judeia e Samaria, e até os confins da terra.",
                NAA: "Mas recebereis poder ao descer sobre vós o Espírito Santo e sereis minhas testemunhas tanto em Jerusalém como em toda a Judeia e Samaria e até os confins da terra.",
              },
              originals: [
                { word: "μάρτυς", translit: "mártys", meaning: "testemunha — a mesma raiz de onde vem a palavra 'mártir'; testemunhar pode custar caro", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "μάρτυς", translit: "mártys", meaning: "'testemunha'. No grego, é a mesma palavra que originou 'mártir' — quem testemunha, no relato bíblico, frequentemente paga um preço por isso.", lang: "grego" },
          ],
          deepDive:
            "Repare no padrão relacional do início do discipulado no Evangelho de João: André encontra Jesus e vai direto ao irmão; Filipe encontra Jesus e vai direto a Natanael (João 1:45). Nenhum dos dois espera 'estar pronto'. A ferramenta que usam não é um argumento apologético sofisticado, mas o convite mais simples possível: 'vem e vê' (João 1:46). Jesus segue esse mesmo padrão com o gadareno liberto — ele não é levado para acompanhar os discípulos em treinamento; é enviado de volta para casa, para contar aos seus. Isso ensina algo importante para quem está começando: sua missão inicial não é distante nem espetacular. Ela começa no espaço mais próximo que você tem — sua família, seus amigos, seu ambiente de trabalho — e a matéria-prima é a sua própria experiência com Cristo, contada com honestidade. Atos 1:8 amplia esse chamado para o mundo inteiro, mas note a ordem geográfica: Jerusalém primeiro — o lugar mais próximo, mais familiar, às vezes o mais difícil de todos para testemunhar.",
          theologianQuote: {
            author: "John Stott",
            text: "Almas são ganhas para Cristo por lágrimas, suor e dor, especialmente na oração e na amizade pessoal e sacrificial.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "João 1:45-46",
                textByVersion: {
                  NVI: "Filipe encontrou Natanael e lhe disse: 'Achamos aquele sobre quem Moisés escreveu na Lei, e sobre quem os profetas também escreveram: Jesus de Nazaré, filho de José.' Perguntou Natanael: 'Nazaré? Pode vir alguma coisa boa de lá?' Disse Filipe: 'Vem e vê.'",
                },
              },
            ],
            historicalContext:
              "No mundo antigo, o testemunho pessoal e a rede de relacionamentos familiares e de amizade eram, de longe, o principal meio de disseminação de qualquer movimento religioso ou filosófico — muito antes de existir qualquer estrutura de comunicação em massa. O crescimento explosivo do cristianismo nos primeiros três séculos, mesmo sob perseverança e sem apoio do Estado, é amplamente atribuído por historiadores da igreja a essa rede orgânica de testemunho pessoal entre vizinhos, familiares e colegas de trabalho — o mesmo padrão relacional visto em João 1.",
            exegeticalNotes:
              "A palavra grega 'mártys' (testemunha) carrega, já no Novo Testamento, a sombra de seu desenvolvimento posterior para 'mártir' — alguém que testemunha até o preço máximo. Isso não significa que toda testemunha cristã enfrentará martírio físico, mas revela que o testemunho bíblico nunca foi pensado como uma atividade confortável ou sem custo: envolve vulnerabilidade, honestidade sobre a própria vida, e disposição a ser rejeitado.",
            theologicalDebate:
              "Vale distinguir aqui entre o chamado geral de todo crente a testemunhar (o que esta lição aborda, e que é para todos, sem exceção) e o dom espiritual específico de evangelista (Efésios 4:11), que nem todo cristão recebe da mesma forma. Nem todos serão pregadores públicos ou evangelistas vocacionados, mas todos são chamados a compartilhar sua própria história, no espaço relacional em que já vivem. Um estudo mais completo sobre estratégias e treinamento de evangelismo será tratado numa trilha própria, mais adiante.",
          },
          quizzes: [
            {
              question: "No padrão visto em João 1 (André e Filipe), qual foi o principal método de testemunho usado?",
              options: [
                "Um sermão público bem estruturado",
                "Um convite relacional simples e direto a alguém próximo: 'vem e vê'",
                "Um debate teológico formal",
                "A distribuição de panfletos",
              ],
              correctIndex: 1,
              explanation: "O testemunho inicial no Evangelho de João acontece de pessoa para pessoa, dentro de relações já existentes — irmão para irmão, amigo para amigo.",
            },
            {
              question: "Por que Jesus enviou o gadareno liberto de volta para casa, em vez de levá-lo para acompanhar os discípulos (Marcos 5:19)?",
              options: [
                "Porque ele não era digno de seguir Jesus",
                "Para que ele testemunhasse primeiro no espaço mais próximo e familiar que já tinha",
                "Porque Jesus não queria mais discípulos naquele momento",
                "Porque a família dele exigiu isso",
              ],
              correctIndex: 1,
              explanation: "A missão inicial começa no lugar mais próximo — família e conhecidos — antes de qualquer alcance mais distante.",
            },
            {
              question: "Qual é a diferença entre o chamado geral ao testemunho e o dom espiritual de evangelista, segundo a lição?",
              options: [
                "Não existe diferença — são a mesma coisa",
                "Todo crente é chamado a testemunhar sua própria história; nem todos recebem o dom específico de evangelista vocacionado",
                "Só quem tem o dom de evangelista deve falar de Cristo",
                "O dom de evangelista substitui a necessidade de testemunho pessoal",
              ],
              correctIndex: 1,
              explanation: "Efésios 4:11 descreve o dom de evangelista como específico a alguns; mas o chamado a testemunhar (Atos 1:8) é para toda a igreja.",
            },
          ],
          application:
            "Escreva, em poucas frases, sua própria história de como Cristo entrou na sua vida — o que você era antes, o que aconteceu, o que mudou. Esta semana, procure uma oportunidade natural de compartilhar essa história com alguém próximo (um familiar, um amigo, um colega).",
          prayer:
            "Senhor, obrigado pela minha própria história com Cristo — mesmo que ainda pareça pequena ou recente. Tira de mim o medo e a vergonha de falar sobre ti para quem está mais perto de mim. Assim como André foi ao seu irmão, e o gadareno voltou para os seus, ajuda-me a começar minha missão exatamente onde estou. Dá-me coragem e palavras simples e verdadeiras. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha uma pessoa próxima — da família, do trabalho ou de amizade — e ore especificamente por ela todos os dias desta semana, pedindo a Deus uma oportunidade natural de compartilhar sua fé com ela.",
          reflectionQuestion:
            "Quem, no seu círculo mais próximo, ainda não ouviu sua história com Cristo — e o que te impede de contá-la?",
          xp: 25,
        },
      ],
    },
  ],
};

import { additionalTrails } from "./trails-content";
import { additionalTrails2 } from "./trails-content-2";
import { additionalTrails3 } from "./trails-content-3";
import { additionalTrails4 } from "./trails-content-4";
import { additionalTrails5 } from "./trails-content-5";

// Trilhas em preparação — títulos e descrições, sem lições ainda.
const upcoming: Trail[] = [
  { id: "lideranca", title: "Liderança", description: "Formando líderes servos no Reino.", icon: "Crown", color: "from-purple-600 to-indigo-700", order: 9, modules: [] },
];

export const trails: Trail[] = [novoConvertido, ...additionalTrails3, ...additionalTrails, ...additionalTrails2, ...additionalTrails4, ...additionalTrails5, ...upcoming]
  .sort((a, b) => a.order - b.order);

export const trailById = (id: string) => trails.find((t) => t.id === id);

export const allLessons = (): { trail: Trail; module: ModuleT; lesson: Lesson }[] =>
  trails.flatMap((t) => t.modules.flatMap((m) => m.lessons.map((l) => ({ trail: t, module: m, lesson: l }))));

export const lessonById = (id: string) => allLessons().find((x) => x.lesson.id === id);

// Estudos avulsos
export type StudyItem = {
  id: string;
  title: string;
  description: string;
  category: "Estudo Bíblico" | "Plano de Leitura" | "Meditação IA";
  minutes: number;
  icon: string;
};

export const studies: StudyItem[] = [
  { id: "s1", title: "Plano de Leitura Anual (Cronológico)", description: "Leia a Bíblia inteira em 365 dias, em ordem histórica.", category: "Plano de Leitura", minutes: 15, icon: "CalendarDays" },
  { id: "s2", title: "Salmos para dias difíceis", description: "10 salmos comentados para momentos de angústia.", category: "Estudo Bíblico", minutes: 20, icon: "HeartCrack" },
  { id: "s3", title: "Meditação guiada — Sermão do Monte", description: "Deixe a IA te guiar por Mateus 5 em oração silenciosa.", category: "Meditação IA", minutes: 10, icon: "Wind" },
  { id: "s4", title: "O Evangelho segundo João em 21 dias", description: "Um capítulo por dia, com perguntas de reflexão.", category: "Plano de Leitura", minutes: 12, icon: "BookMarked" },
  { id: "s5", title: "As parábolas do Reino", description: "Estudo temático das principais parábolas de Jesus.", category: "Estudo Bíblico", minutes: 25, icon: "Wheat" },
];

// Níveis / Títulos gamificados (mantidos por compatibilidade — o sistema principal usa src/data/levels.ts)
export const LEVEL_TITLES = [
  { level: 1, title: "Novo Convertido", minXP: 0 },
  { level: 2, title: "Filho Pródigo", minXP: 100 },
  { level: 3, title: "Sedento por Cristo", minXP: 250 },
  { level: 4, title: "Semeador", minXP: 500 },
  { level: 5, title: "Peregrino Devoto", minXP: 800 },
  { level: 6, title: "Servo Fiel", minXP: 1100 },
  { level: 7, title: "Guerreiro da Fé", minXP: 1400 },
  { level: 8, title: "Comedor de Pão da Ceia", minXP: 1800 },
  { level: 9, title: "Discípulo Amado", minXP: 2300 },
  { level: 10, title: "Coluna da Igreja", minXP: 3000 },
];

export const getLevel = (xp: number) => {
  const found = [...LEVEL_TITLES].reverse().find((l) => xp >= l.minXP);
  return found ?? LEVEL_TITLES[0];
};

// Personagens bíblicos
export const CHARACTERS = [
  { id: "pedro", name: "Pedro", emoji: "🎣" },
  { id: "paulo", name: "Paulo", emoji: "✍️" },
  { id: "maria", name: "Maria", emoji: "🕊️" },
  { id: "davi", name: "Davi", emoji: "🎵" },
  { id: "ester", name: "Ester", emoji: "👑" },
  { id: "rute", name: "Rute", emoji: "🌾" },
  { id: "daniel", name: "Daniel", emoji: "🦁" },
  { id: "timoteo", name: "Timóteo", emoji: "📜" },
];
