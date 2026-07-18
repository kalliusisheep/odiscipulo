// Conteúdo da aba "Estudos": Planos de Leitura, Estudos Bíblicos e Meditação com IA.
import type { Original, Quiz, Verse } from "./content";

// ─────────── PLANOS DE LEITURA ───────────
export type ReadingDay = {
  day: number;
  refs: string[]; // ex.: ["João 1", "Salmo 1"]
  focus: string; // frase curta guiando a leitura
};

export type ReadingPlan = {
  id: string;
  title: string;
  description: string;
  intro: string; // parágrafo de abertura
  totalDays: number;
  minutesPerDay: number;
  icon: string;
  days: ReadingDay[];
};

export const readingPlans: ReadingPlan[] = [
  {
    id: "joao-30d",
    title: "30 dias no Evangelho de João",
    description: "Um capítulo por dia — o Evangelho que mostra Jesus como Deus encarnado.",
    intro:
      "João escreveu para que você creia — e crendo, tenha vida (Jo 20:31). Ao longo de 30 dias, você caminhará com Jesus desde 'no princípio era o Verbo' até o encontro com Pedro à beira do lago. Leia cada capítulo pausadamente e volte ao 'foco do dia' antes de fechar a Bíblia.",
    totalDays: 30,
    minutesPerDay: 12,
    icon: "BookMarked",
    days: [
      { day: 1, refs: ["João 1"], focus: "O Verbo se fez carne — a divindade e humanidade de Cristo." },
      { day: 2, refs: ["João 2"], focus: "Água em vinho: a glória que se revela nos detalhes." },
      { day: 3, refs: ["João 3"], focus: "Nascer de novo — obra do Espírito, não do esforço." },
      { day: 4, refs: ["João 4"], focus: "A samaritana: Jesus atravessa preconceitos por uma alma." },
      { day: 5, refs: ["João 5"], focus: "O paralítico de Betesda: 'queres ser curado?'" },
      { day: 6, refs: ["João 6"], focus: "Pão da vida — o milagre físico aponta ao alimento eterno." },
      { day: 7, refs: ["João 7"], focus: "Divisões sobre Jesus: quem você diz que Ele é?" },
      { day: 8, refs: ["João 8"], focus: "A mulher adúltera e a verdade que liberta." },
      { day: 9, refs: ["João 9"], focus: "O cego de nascença — ver espiritualmente é dom de Deus." },
      { day: 10, refs: ["João 10"], focus: "O Bom Pastor conhece as suas ovelhas pelo nome." },
      { day: 11, refs: ["João 11"], focus: "Lázaro: 'Eu sou a ressurreição e a vida'." },
      { day: 12, refs: ["João 12"], focus: "Maria unge Jesus — adoração que 'desperdiça' o melhor." },
      { day: 13, refs: ["João 13"], focus: "Jesus lava os pés — o Rei se ajoelha." },
      { day: 14, refs: ["João 14"], focus: "'Eu sou o Caminho, a Verdade e a Vida'." },
      { day: 15, refs: ["João 15"], focus: "A videira e os ramos: permaneça em mim." },
      { day: 16, refs: ["João 16"], focus: "A promessa do Consolador — o Espírito virá." },
      { day: 17, refs: ["João 17"], focus: "A oração sacerdotal: Jesus ora por você antes da cruz." },
      { day: 18, refs: ["João 18"], focus: "Getsêmani, a prisão e a negação de Pedro." },
      { day: 19, refs: ["João 19"], focus: "A cruz: 'está consumado'." },
      { day: 20, refs: ["João 20"], focus: "A ressurreição — Maria Madalena e o túmulo vazio." },
      { day: 21, refs: ["João 21"], focus: "Pedro restaurado à beira-mar: 'tu me amas?'" },
      { day: 22, refs: ["1 João 1"], focus: "Comunhão com Deus é andar na luz." },
      { day: 23, refs: ["1 João 2"], focus: "Não amem o mundo — o que passa e o que permanece." },
      { day: 24, refs: ["1 João 3"], focus: "Filhos de Deus: veja o amor com que fomos amados." },
      { day: 25, refs: ["1 João 4"], focus: "Deus é amor — teste dos espíritos." },
      { day: 26, refs: ["1 João 5"], focus: "'Estas coisas escrevi para que saibam que têm a vida eterna'." },
      { day: 27, refs: ["2 João"], focus: "Andar na verdade e no amor caminham juntos." },
      { day: 28, refs: ["3 João"], focus: "Hospitalidade cristã e a paz da comunidade." },
      { day: 29, refs: ["Apocalipse 1"], focus: "A visão do Cristo glorificado por João em Patmos." },
      { day: 30, refs: ["Apocalipse 22"], focus: "'Vem, Senhor Jesus' — a esperança que fecha a Escritura." },
    ],
  },
  {
    id: "salmos-alma-cansada",
    title: "Salmos para a alma cansada",
    description: "14 dias caminhando pelos salmos que consolam nas noites difíceis.",
    intro:
      "Os salmos não sanitizam a dor — eles a colocam diante de Deus com honestidade. Neste plano de 14 dias, você lerá salmos escolhidos para épocas de cansaço, medo, luto e desânimo. Não pule os versículos duros; eles fazem parte da terapia bíblica.",
    totalDays: 14,
    minutesPerDay: 8,
    icon: "HeartCrack",
    days: [
      { day: 1, refs: ["Salmo 23"], focus: "O Pastor caminha comigo, inclusive no vale." },
      { day: 2, refs: ["Salmo 13"], focus: "'Até quando, Senhor?' — o lamento também é oração." },
      { day: 3, refs: ["Salmo 42"], focus: "Uma alma sedenta que ainda espera em Deus." },
      { day: 4, refs: ["Salmo 51"], focus: "O quebrantamento é o sacrifício que Deus recebe." },
      { day: 5, refs: ["Salmo 63"], focus: "A alma que busca Deus como a terra seca busca água." },
      { day: 6, refs: ["Salmo 62"], focus: "Descanso silencioso: 'somente em Deus'." },
      { day: 7, refs: ["Salmo 88"], focus: "O salmo mais escuro — e Deus permitiu que ficasse na Bíblia." },
      { day: 8, refs: ["Salmo 103"], focus: "Bendize, ó minha alma, ao Senhor — memória dos benefícios." },
      { day: 9, refs: ["Salmo 121"], focus: "O socorro vem do Senhor que fez os céus e a terra." },
      { day: 10, refs: ["Salmo 130"], focus: "Das profundezas clamo a ti — mas contigo há perdão." },
      { day: 11, refs: ["Salmo 139"], focus: "Sou conhecido, sondado, amado — e ainda assim aceito." },
      { day: 12, refs: ["Salmo 143"], focus: "Ensina-me o caminho que devo seguir." },
      { day: 13, refs: ["Salmo 145"], focus: "Deus está perto de todos os que O invocam." },
      { day: 14, refs: ["Salmo 27"], focus: "'O Senhor é a minha luz e a minha salvação'." },
    ],
  },
  {
    id: "proverbios-31d",
    title: "Provérbios em 31 dias",
    description: "Um capítulo por dia do mês — sabedoria prática para decisões diárias.",
    intro:
      "Provérbios tem 31 capítulos — praticamente um para cada dia do mês. Ler assim, mensalmente, foi hábito de gerações de cristãos. Não leia como coleção de frases: leia como um pai falando ao filho, ensinando temor do Senhor, discernimento e disciplina.",
    totalDays: 31,
    minutesPerDay: 7,
    icon: "Compass",
    days: Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      refs: [`Provérbios ${i + 1}`],
      focus:
        i === 0
          ? "O temor do Senhor é o princípio do conhecimento."
          : i === 30
            ? "A mulher virtuosa: sabedoria encarnada no cotidiano."
            : "Sublinhe um versículo que fale ao seu dia e ore por ele.",
    })),
  },
];

// ─────────── ESTUDOS BÍBLICOS ───────────
export type StudySection = {
  heading: string;
  body: string[]; // parágrafos
  verses?: Verse[];
  originals?: Original[];
};

export type BibleStudy = {
  id: string;
  title: string;
  description: string;
  passage: string; // ex.: "Mateus 5:1-12"
  minutes: number;
  icon: string;
  sections: StudySection[];
  quiz: Quiz[];
};

export const bibleStudies: BibleStudy[] = [
  {
    id: "bem-aventurancas",
    title: "As Bem-Aventuranças",
    description: "O manifesto do Reino segundo Mateus 5:1-12.",
    passage: "Mateus 5:1-12",
    minutes: 22,
    icon: "Mountain",
    sections: [
      {
        heading: "Contexto: um monte, um Rei, um Reino",
        body: [
          "Jesus sobe um monte, senta-se — postura oficial de mestre — e abre o discurso mais famoso já pronunciado. Mateus deliberadamente ecoa Moisés no Sinai: um novo Legislador para um novo povo.",
          "As bem-aventuranças não são requisitos para entrar no Reino, mas descrições de quem já entrou. Elas viram de cabeça para baixo o que o mundo chama de sortudo.",
        ],
        verses: [
          {
            ref: "Mateus 5:3",
            textByVersion: {
              NVI: "Bem-aventurados os pobres em espírito, pois deles é o Reino dos céus.",
              NAA: "Bem-aventurados os pobres de espírito, porque deles é o Reino dos céus.",
              ACF: "Bem-aventurados os pobres de espírito, porque deles é o reino dos céus.",
              KJV: "Bem-aventurados os pobres de espírito, porque deles é o reino dos céus.",
              NVT: "Deus abençoa os que reconhecem sua pobreza espiritual, pois o Reino dos Céus lhes pertence.",
            },
            originals: [
              { word: "μακάριος", translit: "makários", meaning: "bem-aventurado, feliz de verdade — não emoção passageira", lang: "grego" },
              { word: "πτωχός", translit: "ptōchós", meaning: "pobre absoluto, mendigo — o que sabe que nada tem por si", lang: "grego" },
            ],
          },
        ],
      },
      {
        heading: "As oito bênçãos: um retrato do discípulo",
        body: [
          "Pobreza de espírito, tristeza santa, mansidão, fome de justiça, misericórdia, pureza de coração, pacificação e disposição para sofrer por justiça. Não são oito personalidades diferentes — são oito ângulos do mesmo tipo de pessoa: aquela que já foi tocada pela graça.",
          "Cada bênção tem duas partes: uma condição presente e uma promessa. O tempo verbal alterna entre presente e futuro — o Reino já está e ainda virá.",
        ],
        verses: [
          {
            ref: "Mateus 5:6",
            textByVersion: {
              NVI: "Bem-aventurados os que têm fome e sede de justiça, pois serão saciados.",
              NAA: "Bem-aventurados os que têm fome e sede de justiça, porque serão fartos.",
              ACF: "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos.",
              KJV: "Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos.",
              NVT: "Deus abençoa os que têm fome e sede de justiça, pois serão saciados.",
            },
            originals: [
              { word: "δικαιοσύνη", translit: "dikaiosynē", meaning: "justiça — retidão diante de Deus e no trato com o próximo", lang: "grego" },
            ],
          },
        ],
      },
      {
        heading: "A recompensa: perseguição e alegria",
        body: [
          "Jesus fecha o bloco com a oitava bênção — a única com dois versículos. Ser perseguido por causa da justiça não é acidente da vida cristã: é sinal de autenticidade.",
          "'Alegrai-vos e exultai' (v.12) — verbos no imperativo. A alegria diante do sofrimento não é ingenuidade; é fé no galardão que está nos céus.",
        ],
      },
    ],
    quiz: [
      {
        question: "As bem-aventuranças são principalmente:",
        options: [
          "Requisitos para ganhar a salvação",
          "Descrições de quem já pertence ao Reino",
          "Sugestões opcionais para cristãos maduros",
          "Regras exclusivas para líderes",
        ],
        correctIndex: 1,
        explanation: "Elas descrevem o caráter formado pela graça, não o que ganha a graça.",
      },
      {
        question: "'Pobres em espírito' (ptōchós) significa:",
        options: [
          "Sem dinheiro",
          "Espiritualmente arrogantes",
          "Cientes de que nada têm por si diante de Deus",
          "Pessoas depressivas",
        ],
        correctIndex: 2,
      },
      {
        question: "A oitava bem-aventurança (perseguição) ensina que:",
        options: [
          "Cristãos devem procurar sofrer",
          "Sofrer por justiça é sinal e privilégio do Reino",
          "Perseguição indica falta de fé",
          "Deus abandona quem sofre",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "salmo-23",
    title: "Salmo 23: O Senhor é meu Pastor",
    description: "Seis versículos, um Deus que conduz, alimenta e recebe.",
    passage: "Salmo 23",
    minutes: 18,
    icon: "Sprout",
    sections: [
      {
        heading: "O Pastor que provê (v.1-3)",
        body: [
          "Davi conhecia o ofício de pastor. Ele não escreve poesia romântica sobre ovelhas — escreve memória de trabalho. Um pastor de verdade faz descansar, guia por bons caminhos e reanima quando a alma desfalece.",
          "A tradução literal de 'faz-me repousar' carrega ideia de forçar a ovelha a deitar. Deus, por vezes, precisa nos derrubar em pastos verdes porque não pararíamos por conta própria.",
        ],
        verses: [
          {
            ref: "Salmo 23:1",
            textByVersion: {
              NVI: "O Senhor é o meu pastor; nada me faltará.",
              NAA: "O Senhor é o meu pastor; de nada terei falta.",
              ACF: "O Senhor é o meu pastor, nada me faltará.",
              KJV: "O Senhor é o meu pastor, nada me faltará.",
              NVT: "O Senhor é o meu pastor; tenho tudo de que preciso.",
            },
            originals: [
              { word: "יְהוָה רֹעִי", translit: "YHWH roʿi", meaning: "'Yahweh é meu pastor' — nome pessoal do Deus da aliança", lang: "hebraico" },
            ],
          },
        ],
      },
      {
        heading: "O Pastor que caminha no vale (v.4)",
        body: [
          "O salmo vira do 'ele' para o 'tu'. Nas alegrias, falamos sobre Deus; no vale, falamos com Ele. A intimidade se aprofunda exatamente onde a treva aparece.",
          "'Vale da sombra da morte' — em hebraico, 'gei tsalmavet' — é o vale mais profundo e escuro imaginável. E ainda assim Davi só teme o mal se estiver sozinho; a companhia de Deus muda o vale.",
        ],
        verses: [
          {
            ref: "Salmo 23:4",
            textByVersion: {
              NVI: "Mesmo quando eu andar por um vale de trevas e morte, não temerei perigo algum, pois tu estás comigo; a tua vara e o teu cajado me protegem.",
              NAA: "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.",
              ACF: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo.",
              KJV: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo.",
              NVT: "Mesmo quando eu andar pelo vale mais escuro, não temerei, pois tu estás ao meu lado.",
            },
            originals: [
              { word: "צַלְמָוֶת", translit: "tsalmavet", meaning: "sombra da morte — treva mais densa possível", lang: "hebraico" },
            ],
          },
        ],
      },
      {
        heading: "O Anfitrião na casa do Senhor (v.5-6)",
        body: [
          "A metáfora muda: Deus é agora anfitrião que prepara mesa diante dos inimigos. Não elimina os inimigos — os convida a testemunhar sua provisão.",
          "'Habitarei na casa do Senhor por longos dias' — o hebraico sugere 'para sempre'. Do pasto ao vale à mesa à casa: toda a jornada é com Ele.",
        ],
      },
    ],
    quiz: [
      {
        question: "A mudança de 'ele' para 'tu' no v.4 mostra:",
        options: [
          "Erro do copista",
          "Aprofundamento de intimidade no vale",
          "Duas pessoas falando",
          "Rejeição do pastor",
        ],
        correctIndex: 1,
      },
      {
        question: "'Vale da sombra da morte' (tsalmavet) descreve:",
        options: [
          "Um lugar geográfico específico",
          "A treva mais densa que a vida pode oferecer",
          "Apenas o momento da morte física",
          "Um pesadelo",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "amor-1cor13",
    title: "O amor segundo Paulo",
    description: "1 Coríntios 13 — o hino ao amor no meio de uma bronca.",
    passage: "1 Coríntios 13",
    minutes: 20,
    icon: "Heart",
    sections: [
      {
        heading: "Contexto: o capítulo que nasceu numa igreja bagunçada",
        body: [
          "1 Coríntios 13 costuma ser lido em casamentos — mas Paulo o escreveu para uma igreja competitiva, cheia de dons e vazia de amor. O capítulo é uma repreensão embrulhada em poesia.",
          "O ponto: dons sem amor são barulho. Sacrifício sem amor é desperdício. Fé sem amor é nada.",
        ],
        verses: [
          {
            ref: "1 Coríntios 13:1",
            textByVersion: {
              NVI: "Ainda que eu fale as línguas dos homens e dos anjos, se não tiver amor, serei como o bronze que soa ou como o címbalo que retine.",
              NAA: "Ainda que eu fale as línguas dos homens e dos anjos, se não tiver amor, serei como o bronze que soa ou como o címbalo que retine.",
              ACF: "Ainda que eu falasse as línguas dos homens e dos anjos, e não tivesse amor, seria como o metal que soa ou como o sino que tine.",
              KJV: "Ainda que eu falasse as línguas dos homens e dos anjos, e não tivesse amor, seria como o metal que soa ou como o sino que tine.",
              NVT: "Se eu falasse todas as línguas humanas e angelicais, mas não tivesse amor, seria apenas um gongo barulhento ou um címbalo estridente.",
            },
            originals: [
              { word: "ἀγάπη", translit: "agápē", meaning: "amor de decisão e entrega, não emoção; o amor de Deus por nós", lang: "grego" },
            ],
          },
        ],
      },
      {
        heading: "Anatomia do amor (v.4-7)",
        body: [
          "Paulo lista quinze verbos — o amor faz, o amor não faz. Não são adjetivos abstratos: são atitudes concretas. 'É paciente' significa 'demora para se irritar'. 'Não guarda rancor' é literalmente 'não faz contabilidade do mal'.",
          "Cada verbo pode ser testado no espelho. Substitua 'o amor' por seu nome: 'Fulano é paciente, Fulano é bondoso...' — a lista deixa de ser bonita e vira exame de consciência.",
        ],
      },
      {
        heading: "O que permanece (v.8-13)",
        body: [
          "Dons cessarão; conhecimento passará. Três coisas permanecem: fé, esperança e amor. A maior é o amor — porque no céu, fé se torna visão e esperança se torna posse, mas o amor continua sendo amor.",
        ],
      },
    ],
    quiz: [
      {
        question: "1 Coríntios 13 foi escrito principalmente como:",
        options: [
          "Discurso de casamento",
          "Correção a uma igreja com dons mas sem amor",
          "Poema pessoal de Paulo",
          "Instrução aos apóstolos",
        ],
        correctIndex: 1,
      },
      {
        question: "'Agápē' descreve:",
        options: [
          "Amor romântico",
          "Amizade profunda",
          "Amor de decisão e entrega, o amor divino",
          "Afeição familiar",
        ],
        correctIndex: 2,
      },
      {
        question: "Por que o amor é 'o maior' entre fé, esperança e amor?",
        options: [
          "Porque é mais fácil de sentir",
          "Porque permanece mesmo quando fé vira visão e esperança vira posse",
          "Porque é o único obrigatório",
          "Porque é o mais antigo",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "parabolas-reino",
    title: "As parábolas do Reino",
    description: "Três parábolas de Mateus 13 que descrevem o Reino escondido no cotidiano.",
    passage: "Mateus 13",
    minutes: 25,
    icon: "Wheat",
    sections: [
      {
        heading: "O semeador (Mt 13:1-23)",
        body: [
          "Não é uma parábola sobre solos, mas sobre a Palavra e o coração que a recebe. A mesma semente cai em quatro terrenos e produz quatro resultados — o problema nunca está na semente.",
          "Jesus explica cada terreno: beira do caminho (endurecido), pedregoso (raso), espinhos (dividido), boa terra (frutífero). A pergunta pastoral: qual solo eu sou hoje?",
        ],
        verses: [
          {
            ref: "Mateus 13:23",
            textByVersion: {
              NVI: "Mas o que foi semeado em boa terra é aquele que ouve a palavra e a entende, e dá uma colheita de cem, sessenta e trinta por um.",
              NAA: "Mas o que foi semeado em boa terra é o que ouve a palavra e a entende; este frutifica e produz a cem, a sessenta e a trinta por um.",
              ACF: "Mas o que foi semeado em boa terra é o que ouve e compreende a palavra; e dá fruto, e um produz cem, outro sessenta e outro trinta.",
              KJV: "Mas o que foi semeado em boa terra, este é o que ouve a palavra, e a compreende, e dá fruto, e produz a cem, a sessenta e a trinta por um.",
              NVT: "A semente que caiu em solo fértil representa aqueles que verdadeiramente ouvem e entendem a palavra de Deus, produzindo uma colheita trinta, sessenta e até cem vezes maior.",
            },
          },
        ],
      },
      {
        heading: "O grão de mostarda e o fermento (v.31-33)",
        body: [
          "O Reino começa pequeno, quase imperceptível, e cresce de dentro para fora. Nada de espetáculos; muito de fidelidade silenciosa.",
          "O fermento leveda toda a massa não por força, mas por presença. Assim é o Reino no mundo — e na sua semana.",
        ],
        originals: [
          { word: "ζύμη", translit: "zýmē", meaning: "fermento — imagem de influência que penetra e transforma", lang: "grego" },
        ],
      },
      {
        heading: "O tesouro escondido (v.44)",
        body: [
          "O homem acha o tesouro, esconde, vende tudo com alegria e compra o campo. A alegria vem antes da renúncia — quem entendeu o valor do Reino não sente que perdeu nada ao entregar o resto.",
        ],
      },
    ],
    quiz: [
      {
        question: "A parábola do semeador ensina que o problema geralmente está:",
        options: [
          "Na semente (a Palavra)",
          "No semeador",
          "No solo (o coração que ouve)",
          "No clima",
        ],
        correctIndex: 2,
      },
      {
        question: "O grão de mostarda mostra que o Reino:",
        options: [
          "Cresce por escândalo e espetáculo",
          "Começa pequeno e cresce silenciosamente",
          "Depende de números",
          "É invisível para sempre",
        ],
        correctIndex: 1,
      },
    ],
  },
];

// ─────────── MEDITAÇÃO COM IA ───────────
export type AiMeditation = {
  id: string;
  title: string;
  description: string;
  passage: string;
  minutes: number;
  icon: string;
  intro: string;
  seedPrompt: string; // primeira mensagem enviada ao Mentor
};

export const aiMeditations: AiMeditation[] = [
  {
    id: "sermao-do-monte",
    title: "Meditação no Sermão do Monte",
    description: "Deixe a IA te guiar por Mateus 5-7 em oração silenciosa.",
    passage: "Mateus 5-7",
    minutes: 12,
    icon: "Mountain",
    intro:
      "O Sermão do Monte é o texto mais radical já pronunciado. Nesta meditação guiada, o Mentor caminhará com você por seções curtas, propondo silêncios, perguntas e orações. Reserve um espaço tranquilo.",
    seedPrompt:
      "Quero fazer uma meditação guiada em Mateus 5-7 (Sermão do Monte). Conduza-me em 5 momentos: (1) uma respiração e uma oração de abertura, (2) leitura pausada das Bem-Aventuranças com uma pergunta de reflexão, (3) uma parada em Mateus 6:9-13 (Pai Nosso) com convite à oração pessoal, (4) uma pergunta prática de aplicação em Mateus 7:24-27, (5) uma bênção final. Faça um passo por vez, aguardando minha resposta.",
  },
  {
    id: "salmo-23-med",
    title: "Meditação no Salmo 23",
    description: "Seis versículos, seis pausas para respirar diante do Pastor.",
    passage: "Salmo 23",
    minutes: 8,
    icon: "Sprout",
    intro:
      "O Salmo 23 é curto o suficiente para caber num respiro, e profundo o bastante para acompanhar a vida inteira. O Mentor te conduzirá versículo a versículo, com pausas.",
    seedPrompt:
      "Conduza-me numa meditação guiada no Salmo 23, um versículo por vez. Para cada versículo: apresente o texto (NVI), faça uma pausa contemplativa com uma imagem curta, e me faça uma pergunta simples. Vá devagar, um versículo por mensagem, aguardando minha resposta antes de avançar.",
  },
  {
    id: "getsemani",
    title: "Cristo em Getsêmani",
    description: "Contemple a agonia e a entrega de Jesus na noite antes da cruz.",
    passage: "Mateus 26:36-46",
    minutes: 15,
    icon: "TreeDeciduous",
    intro:
      "Antes da cruz, houve o jardim. Ali Jesus suou como gotas de sangue, pediu ao Pai que passasse o cálice — e mesmo assim disse 'não como eu quero, mas como tu queres'. Esta meditação te leva a essa noite.",
    seedPrompt:
      "Guie-me numa meditação contemplativa em Mateus 26:36-46 (Getsêmani). Em quatro passos: (1) ambiente o cenário do jardim à noite, (2) leia devagar a oração de Jesus e me convide a imaginar seu rosto, (3) confronte-me suavemente com uma decisão em que preciso dizer 'não como eu quero, mas como tu queres', (4) feche com uma oração breve. Um passo por mensagem.",
  },
  {
    id: "pai-nosso",
    title: "Orando o Pai Nosso",
    description: "Cada petição do Pai Nosso como uma janela para a oração pessoal.",
    passage: "Mateus 6:9-13",
    minutes: 10,
    icon: "Sun",
    intro:
      "Jesus deu essa oração como molde, não como fórmula. O Mentor te conduzirá petição a petição, expandindo cada uma para a sua vida hoje.",
    seedPrompt:
      "Conduza-me a orar o Pai Nosso (Mateus 6:9-13) petição por petição. Para cada petição: cite-a, explique brevemente, e me convide a orar aquela petição com detalhes da minha vida hoje — depois espere minha resposta. São 6 petições ao todo. Vá uma por vez.",
  },
];
