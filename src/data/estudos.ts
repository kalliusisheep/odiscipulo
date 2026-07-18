// Conteúdo da aba "Estudos": Planos de Leitura, Estudos Bíblicos e Meditação com IA.
import type { Original, Quiz, Verse } from "./content";

// ─────────── PLANOS DE LEITURA ───────────
export type ReadingDay = {
  day: number;
  refs: string[];
  focus: string;
  commentary: string; // parágrafo curto de contextualização
};

export type ReadingPlan = {
  id: string;
  title: string;
  description: string;
  intro: string;
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
      "João escreveu para que você creia — e crendo, tenha vida (Jo 20:31). Ao longo de 30 dias, você caminhará com Jesus desde 'no princípio era o Verbo' até o encontro com Pedro à beira do lago.",
    totalDays: 30,
    minutesPerDay: 12,
    icon: "BookMarked",
    days: [
      { day: 1, refs: ["João 1"], focus: "O Verbo se fez carne.", commentary: "João abre com um prólogo cósmico: o Verbo eterno se faz carne e habita entre nós. Note como 'luz' e 'trevas', 'graça' e 'verdade' aparecem em pares — vocabulário que atravessará todo o evangelho." },
      { day: 2, refs: ["João 2"], focus: "Água em vinho: a glória se revela.", commentary: "O primeiro sinal de Jesus acontece num casamento comum, não num templo. A glória de Deus se revela em festas ordinárias — e ainda assim aponta para o vinho novo do Reino." },
      { day: 3, refs: ["João 3"], focus: "Nascer de novo é obra do Espírito.", commentary: "Nicodemos vem de noite — mestre em Israel, mas ainda no escuro. Jesus corta a conversa acadêmica com uma exigência radical: um novo nascimento que só Deus pode operar." },
      { day: 4, refs: ["João 4"], focus: "Jesus atravessa preconceitos por uma alma.", commentary: "Judeu, samaritana, homem, mulher, respeitável, marginalizada. Jesus rompe cinco barreiras num só diálogo. Preste atenção em como Ele conduz a mulher da água ao Messias." },
      { day: 5, refs: ["João 5"], focus: "'Queres ser curado?'", commentary: "A pergunta parece óbvia — mas 38 anos de doença viram identidade. Cura envolve deixar o lugar conhecido do sofrimento e assumir a responsabilidade da vida nova." },
      { day: 6, refs: ["João 6"], focus: "Pão da vida.", commentary: "Multidões seguem Jesus pela comida; Ele se oferece como comida. Muitos discípulos se afastam — o Evangelho de João não esconde os que desistem." },
      { day: 7, refs: ["João 7"], focus: "Divisões sobre Jesus.", commentary: "Meio capítulo é debate popular: 'é bom, é enganador, é o Cristo?' Toda geração precisa responder a mesma pergunta." },
      { day: 8, refs: ["João 8"], focus: "A verdade que liberta.", commentary: "Da mulher adúltera ('nem eu te condeno') ao debate com os fariseus ('antes que Abraão existisse, EU SOU'), Jesus reivindica autoridade divina de forma cada vez mais explícita." },
      { day: 9, refs: ["João 9"], focus: "Ver espiritualmente é dom de Deus.", commentary: "O cego enxerga; os que dizem enxergar ficam cegos. João joga com a metáfora até o fim — quem admite não ver, começa a ver." },
      { day: 10, refs: ["João 10"], focus: "O Bom Pastor.", commentary: "Pastor no Oriente Antigo caminhava à frente e chamava cada ovelha pelo nome. Jesus não empurra o rebanho: Ele o convoca — e conhece você pelo nome." },
      { day: 11, refs: ["João 11"], focus: "'Eu sou a ressurreição e a vida'.", commentary: "Jesus chora antes de ressuscitar — a divindade não anula a compaixão. E note o versículo mais curto da Bíblia (v.35): Deus encarnado chora ao lado de um túmulo." },
      { day: 12, refs: ["João 12"], focus: "Adoração que 'desperdiça' o melhor.", commentary: "Maria quebra um perfume caro; Judas calcula o custo. Adoração real sempre parece 'desperdício' para quem só vê planilha." },
      { day: 13, refs: ["João 13"], focus: "O Rei se ajoelha.", commentary: "Jesus lava os pés — incluindo os de Judas, que já O havia traído. Serviço no Reino não é para quem merece; é o modo de Deus governar." },
      { day: 14, refs: ["João 14"], focus: "'Eu sou o Caminho, a Verdade e a Vida'.", commentary: "Capítulo lido em funerais, mas escrito para consolar discípulos ansiosos. Jesus não aponta um caminho — Ele é o caminho." },
      { day: 15, refs: ["João 15"], focus: "A videira e os ramos.", commentary: "'Permanecei em mim' aparece dez vezes. Fruto não vem de esforço isolado, mas de conexão constante com a videira." },
      { day: 16, refs: ["João 16"], focus: "A promessa do Consolador.", commentary: "Jesus prepara os discípulos para a Sua partida física — 'convém que Eu vá', porque o Espírito virá para todos, em todo lugar." },
      { day: 17, refs: ["João 17"], focus: "Jesus ora por você.", commentary: "A oração mais longa de Jesus. No versículo 20, Ele especificamente ora pelos que crerão pela palavra dos discípulos — ou seja, por você." },
      { day: 18, refs: ["João 18"], focus: "Getsêmani e a negação.", commentary: "Pedro tira a espada; Jesus a repõe. O Rei entra na Paixão sem resistência — porque escolheu entregar-se, ninguém tira Sua vida." },
      { day: 19, refs: ["João 19"], focus: "'Está consumado'.", commentary: "'Tetelestai' — palavra grega usada em recibos comerciais para dizer 'pago em pleno'. A dívida foi liquidada na cruz." },
      { day: 20, refs: ["João 20"], focus: "O túmulo vazio.", commentary: "Maria confunde o Ressurreto com o jardineiro — e, num sentido profundo, Ele é o novo Adão no novo jardim, refazendo o que foi perdido." },
      { day: 21, refs: ["João 21"], focus: "'Tu me amas?'", commentary: "Três negações, três restaurações. Jesus não expõe Pedro; restaura-o em serviço. Falhas não invalidam chamado." },
      { day: 22, refs: ["1 João 1"], focus: "Andar na luz.", commentary: "Comunhão com Deus e comunhão fraterna caminham juntas. Não há vida cristã solitária." },
      { day: 23, refs: ["1 João 2"], focus: "O que passa e o que permanece.", commentary: "O 'mundo' aqui não é o planeta, mas o sistema de valores que compete com Deus. O que permanece? Quem faz a vontade dEle." },
      { day: 24, refs: ["1 João 3"], focus: "Filhos de Deus.", commentary: "'Vede que grande amor…' — o verbo é imperativo. Deus quer que você contemple deliberadamente o amor com que foi amado." },
      { day: 25, refs: ["1 João 4"], focus: "Deus é amor.", commentary: "A frase famosa vem embrulhada em teste doutrinário: nem todo espírito vem de Deus. Amor bíblico não é sentimentalismo — é ancorado em verdade." },
      { day: 26, refs: ["1 João 5"], focus: "Certeza da vida eterna.", commentary: "João escreve 'para que saibam' — não para que sintam. A certeza cristã descansa em fatos, não em humor do dia." },
      { day: 27, refs: ["2 João"], focus: "Verdade e amor juntos.", commentary: "Verdade sem amor endurece; amor sem verdade se dissolve. João exige os dois no mesmo passo." },
      { day: 28, refs: ["3 João"], focus: "Hospitalidade cristã.", commentary: "Uma carta pessoal sobre acolher missionários. A missão global depende de gente comum abrindo casa." },
      { day: 29, refs: ["Apocalipse 1"], focus: "O Cristo glorificado.", commentary: "João, agora idoso e exilado, vê o mesmo Jesus com quem caminhou — agora em plena glória. A vida termina onde João começou: contemplando o Verbo." },
      { day: 30, refs: ["Apocalipse 22"], focus: "'Vem, Senhor Jesus'.", commentary: "A Escritura fecha com um pedido de encontro. Que este mês termine com a mesma oração." },
    ],
  },
  {
    id: "salmos-alma-cansada",
    title: "Salmos para a alma cansada",
    description: "14 dias caminhando pelos salmos que consolam nas noites difíceis.",
    intro:
      "Os salmos não sanitizam a dor — eles a colocam diante de Deus com honestidade. Não pule os versículos duros; eles fazem parte da terapia bíblica.",
    totalDays: 14,
    minutesPerDay: 8,
    icon: "HeartCrack",
    days: [
      { day: 1, refs: ["Salmo 23"], focus: "O Pastor caminha comigo.", commentary: "Davi conhecia ovelhas de perto. O salmo não é poesia romântica — é memória de trabalho. O Pastor caminha no vale, não em cima dele." },
      { day: 2, refs: ["Salmo 13"], focus: "'Até quando, Senhor?'", commentary: "Quatro 'até quando?' seguidos. A Bíblia autoriza a impaciência orante. Mas note como o salmo termina: mesmo sem resposta, Davi decide confiar." },
      { day: 3, refs: ["Salmo 42"], focus: "Uma alma sedenta que espera.", commentary: "'Por que estás abatida, ó minha alma?' O salmista fala com a própria alma — bom exercício quando a emoção quer ditar teologia." },
      { day: 4, refs: ["Salmo 51"], focus: "Quebrantamento como sacrifício.", commentary: "Escrito depois do pecado com Bate-Seba. Davi não terceiriza a culpa nem se justifica — ele se entrega inteiro à misericórdia." },
      { day: 5, refs: ["Salmo 63"], focus: "Sede de Deus como terra seca.", commentary: "Davi escreve no deserto — e a paisagem entra no salmo. Às vezes o deserto é onde a sede por Deus finalmente aparece." },
      { day: 6, refs: ["Salmo 62"], focus: "Somente em Deus, silenciosa.", commentary: "'Somente em Deus' repete-se como refrão. É a única fonte que não seca; qualquer outra é 'como parede pendida'." },
      { day: 7, refs: ["Salmo 88"], focus: "O salmo mais escuro.", commentary: "Único salmo sem giro de esperança no fim. Deus deixou este texto na Bíblia — sinal de que Ele acolhe até a oração que não encontra saída." },
      { day: 8, refs: ["Salmo 103"], focus: "Bendize, ó minha alma.", commentary: "Um exercício de memória: lembre-se dos benefícios. Alma cansada precisa ser conduzida a recordar." },
      { day: 9, refs: ["Salmo 121"], focus: "'De onde vem o meu socorro?'", commentary: "Cântico dos peregrinos subindo a Jerusalém. Os olhos sobem para os montes — mas o socorro vem de mais alto ainda: do Deus que fez os montes." },
      { day: 10, refs: ["Salmo 130"], focus: "Das profundezas clamo.", commentary: "'Contigo há perdão, para que sejas temido' (v.4). O perdão de Deus não gera leviandade — gera reverência." },
      { day: 11, refs: ["Salmo 139"], focus: "Conhecido, sondado, amado.", commentary: "Deus sabe tudo sobre você — e ainda escolhe amar. O versículo 23 pede: 'sonda-me' — permissão para o exame divino." },
      { day: 12, refs: ["Salmo 143"], focus: "'Ensina-me o caminho'.", commentary: "Salmo penitencial. Cansaço espiritual pede direção; direção vem da voz de Deus lida na manhã." },
      { day: 13, refs: ["Salmo 145"], focus: "Perto dos que O invocam.", commentary: "Acróstico hebraico — cada versículo começa com uma letra do alfabeto. Louvor completo, de A a Z, mesmo quando a alma só balbucia." },
      { day: 14, refs: ["Salmo 27"], focus: "'O Senhor é a minha luz'.", commentary: "Começa com coragem, termina com espera. 'Espera no Senhor, tem bom ânimo' — o salmo aceita que a resposta demora." },
    ],
  },
  {
    id: "proverbios-31d",
    title: "Provérbios em 31 dias",
    description: "Um capítulo por dia do mês — sabedoria prática para decisões diárias.",
    intro:
      "Provérbios tem 31 capítulos — praticamente um para cada dia do mês. Leia como um pai falando ao filho, ensinando temor do Senhor, discernimento e disciplina.",
    totalDays: 31,
    minutesPerDay: 7,
    icon: "Compass",
    days: Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const focus =
        i === 0
          ? "Temor do Senhor: princípio do conhecimento."
          : i === 30
            ? "A mulher virtuosa: sabedoria encarnada."
            : "Sublinhe um versículo e ore por ele hoje.";
      const commentary =
        i === 0
          ? "Capítulo-chave: sabedoria começa com reverência, não com QI. Sem temor, o resto do livro vira frase de calendário."
          : i === 30
            ? "Mais que retrato de esposa, é retrato de Sabedoria personificada — o Provérbios inteiro condensado numa figura."
            : `Capítulo ${day}: leia devagar, marque um versículo que fale ao seu dia e pergunte 'como isso muda minha próxima decisão?'`;
      return { day, refs: [`Provérbios ${day}`], focus, commentary };
    }),
  },
];

// ─────────── ESTUDOS BÍBLICOS ───────────
// Reaproveita o fluxo Estudo → Fixar → Aplicar das lições da trilha.
export type StudySection = {
  heading: string;
  body: string[];
  verses?: Verse[];
  originals?: Original[];
};

export type BibleStudy = {
  id: string;
  title: string;
  description: string;
  passage: string;
  minutes: number;
  icon: string;
  sections: StudySection[];
  quiz: Quiz[];
  // Novos campos para o fluxo Aplicar
  application: string;
  prayer: string;
  weeklyChallenge: string;
  reflectionQuestion: string;
  xp: number;
};

export const bibleStudies: BibleStudy[] = [
  {
    id: "bem-aventurancas",
    title: "As Bem-Aventuranças",
    description: "O manifesto do Reino segundo Mateus 5:1-12.",
    passage: "Mateus 5:1-12",
    minutes: 22,
    icon: "Mountain",
    xp: 45,
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
        explanation: "Ptōchós descreve o mendigo — quem sabe que depende inteiramente da graça.",
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
        explanation: "Jesus ordena alegria no meio da perseguição — porque ela confirma pertencimento ao Reino.",
      },
    ],
    application: "Escolha uma bem-aventurança que mais te confronta esta semana. Se é a misericórdia, pratique-a com alguém específico. Se é a pureza de coração, cuide de um hábito de consumo. O Sermão do Monte se prova nos detalhes.",
    prayer: "Senhor, quebranta em mim o orgulho que se acha rico diante de Ti. Faze-me pobre em espírito, faminto de justiça, misericordioso como fui recebido em misericórdia. Que o Teu Reino apareça na maneira comum como eu vivo. Em nome de Jesus, amém.",
    weeklyChallenge: "Escolha uma pessoa da sua rotina que precisa de misericórdia (perdão, paciência ou generosidade). Ofereça-a essa semana sem esperar reciprocidade.",
    reflectionQuestion: "Qual das bem-aventuranças descreve menos a sua vida hoje — e o que Deus está te chamando a mudar por causa disso?",
  },
  {
    id: "salmo-23",
    title: "Salmo 23: O Senhor é meu Pastor",
    description: "Seis versículos, um Deus que conduz, alimenta e recebe.",
    passage: "Salmo 23",
    minutes: 18,
    icon: "Sprout",
    xp: 40,
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
        options: ["Erro do copista", "Aprofundamento de intimidade no vale", "Duas pessoas falando", "Rejeição do pastor"],
        correctIndex: 1,
        explanation: "No vale, Davi passa a falar diretamente com Deus — a treva aproxima a fé.",
      },
      {
        question: "'Vale da sombra da morte' (tsalmavet) descreve:",
        options: ["Um lugar geográfico", "A treva mais densa possível da vida", "Só o momento da morte física", "Um pesadelo"],
        correctIndex: 1,
        explanation: "Metáfora para as trevas mais densas que a experiência humana produz.",
      },
      {
        question: "'Prepara mesa diante dos meus inimigos' significa que Deus:",
        options: ["Elimina os inimigos primeiro", "Provê generosamente diante deles como testemunhas", "Ignora os inimigos", "Convida os inimigos para comer"],
        correctIndex: 1,
        explanation: "Deus honra o seu na presença dos que o hostilizam.",
      },
    ],
    application: "Identifique um 'vale' atual — uma área de medo, luto ou incerteza. Ore o Salmo 23 nomeando esse vale. Onde exatamente você precisa que a companhia de Deus mude o cenário?",
    prayer: "Bom Pastor, obrigado por caminhar comigo mesmo onde eu não enxergo os próximos passos. Faze-me repousar em pastos verdes; conduz-me por bons caminhos por amor do Teu nome. Que a Tua vara me discipline e o Teu cajado me traga de volta. Em Cristo, amém.",
    weeklyChallenge: "Memorize o Salmo 23 esta semana. Recite antes de dormir a cada noite.",
    reflectionQuestion: "Em qual versículo do Salmo 23 você mais precisa acreditar hoje — e por quê?",
  },
  {
    id: "amor-1cor13",
    title: "O amor segundo Paulo",
    description: "1 Coríntios 13 — o hino ao amor no meio de uma bronca.",
    passage: "1 Coríntios 13",
    minutes: 20,
    icon: "Heart",
    xp: 45,
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
        options: ["Discurso de casamento", "Correção a uma igreja com dons mas sem amor", "Poema pessoal de Paulo", "Instrução aos apóstolos"],
        correctIndex: 1,
        explanation: "O capítulo está no meio de uma discussão sobre dons espirituais em Corinto.",
      },
      {
        question: "'Agápē' descreve:",
        options: ["Amor romântico", "Amizade profunda", "Amor de decisão e entrega, o amor divino", "Afeição familiar"],
        correctIndex: 2,
        explanation: "É o amor que se decide, resiste ao mérito e reflete o próprio Deus.",
      },
      {
        question: "Por que o amor é 'o maior'?",
        options: ["Porque é mais fácil de sentir", "Porque permanece mesmo quando fé vira visão e esperança vira posse", "Porque é o único obrigatório", "Porque é o mais antigo"],
        correctIndex: 1,
        explanation: "No céu, fé e esperança se cumprem; amor continua para sempre.",
      },
    ],
    application: "Substitua 'o amor' pelo seu nome em 1 Cor 13:4-7. Quais versos ainda são falsos? Escolha um verbo para trabalhar deliberadamente esta semana com uma pessoa específica.",
    prayer: "Pai, sem o Teu amor eu sou apenas barulho. Enche-me do amor que Cristo derramou por mim, para que ele transborde para os que estão perto — inclusive os que me irritam. Que o meu amor não seja teoria, mas paciência concreta, bondade concreta, verdade concreta. Amém.",
    weeklyChallenge: "Escolha uma pessoa difícil e pratique com ela três verbos de 1 Cor 13 esta semana. Anote no fim da semana o que aprendeu.",
    reflectionQuestion: "Qual verbo de 1 Coríntios 13 Deus está te chamando a exercitar hoje, e com quem?",
  },
  {
    id: "parabolas-reino",
    title: "As parábolas do Reino",
    description: "Três parábolas de Mateus 13 que descrevem o Reino escondido no cotidiano.",
    passage: "Mateus 13",
    minutes: 25,
    icon: "Wheat",
    xp: 50,
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
          { word: "ζύμη", translit: "zýmē", meaning: "fermento — influência que penetra e transforma", lang: "grego" },
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
        options: ["Na semente (a Palavra)", "No semeador", "No solo (o coração que ouve)", "No clima"],
        correctIndex: 2,
        explanation: "A Palavra é a mesma; o que muda é o terreno interior de quem escuta.",
      },
      {
        question: "O grão de mostarda mostra que o Reino:",
        options: ["Cresce por escândalo e espetáculo", "Começa pequeno e cresce silenciosamente", "Depende de números", "É invisível para sempre"],
        correctIndex: 1,
        explanation: "O Reino germina em pequenas obediências até tomar toda a vida.",
      },
      {
        question: "No tesouro escondido, a ordem correta é:",
        options: ["Renúncia → alegria", "Alegria → renúncia", "Renúncia sem alegria", "Alegria sem renúncia"],
        correctIndex: 1,
        explanation: "A alegria pela descoberta faz a renúncia parecer ganho, não perda.",
      },
    ],
    application: "Diagnostique o seu solo agora: endurecido, raso, cheio de espinhos ou fértil? Nomeie um espinho concreto (ansiedade financeira, distração digital, comparação) e comece a arrancá-lo esta semana.",
    prayer: "Semeador fiel, amolece o meu coração para receber a Palavra. Arranca o que sufoca a semente, aprofunda o solo, e faze de mim terra boa que dá fruto para o Teu Reino — trinta, sessenta ou cem por um. Amém.",
    weeklyChallenge: "Todo dia desta semana, leia um trecho curto da Bíblia sem pressa e escreva uma linha do que Deus disse. Guarde o solo bem regado.",
    reflectionQuestion: "Qual dos quatro solos melhor descreve o seu coração agora — e o que precisa mudar para você produzir fruto?",
  },
];

// ─────────── MEDITAÇÃO GUIADA ───────────
export type MeditationStep = {
  heading: string;
  body: string; // texto contemplativo
  scripture?: string; // versículo curto opcional
  pauseSeconds?: number; // sugestão de silêncio
};

export type AiMeditation = {
  id: string;
  title: string;
  description: string;
  passage: string;
  minutes: number;
  icon: string;
  intro: string;
  steps: MeditationStep[];
  centralQuestion: string;
};

export const aiMeditations: AiMeditation[] = [
  {
    id: "sermao-do-monte",
    title: "Meditação no Sermão do Monte",
    description: "Cinco pausas curtas em Mateus 5-7 para respirar diante do Rei.",
    passage: "Mateus 5-7",
    minutes: 12,
    icon: "Mountain",
    intro: "Você vai subir o monte com Jesus. Não há pressa. A cada passo, respire fundo antes de ler; respire fundo depois. Deixe as palavras descerem do intelecto para o coração.",
    steps: [
      {
        heading: "1. Chegada",
        body: "Respire fundo três vezes. Solte o ar devagar. Você está subindo um monte na Galileia — o Rei se sentou e olha para você. Não há multidão neste momento; apenas você, Ele e o vento.",
        pauseSeconds: 20,
      },
      {
        heading: "2. As Bem-Aventuranças",
        body: "Leia sem pressa. 'Bem-aventurados os pobres em espírito…' Onde a sua vida é pobre? Onde ela precisa da consolação do Reino? Não responda ainda — apenas escute.",
        scripture: "Mateus 5:3-4",
        pauseSeconds: 30,
      },
      {
        heading: "3. O Pai Nosso",
        body: "Jesus ensina a orar. Não recite mecanicamente — respire entre cada petição. 'Pai nosso, que estás nos céus'… deixe o Pai te olhar antes de falar. 'Santificado seja o teu nome'… reverencie.",
        scripture: "Mateus 6:9-13",
        pauseSeconds: 30,
      },
      {
        heading: "4. Duas casas, duas fundações",
        body: "Jesus fecha o sermão com uma escolha: rocha ou areia. Não é sobre ouvir — todos ouviram. É sobre praticar. Pergunte em silêncio: onde estou construindo sobre areia hoje?",
        scripture: "Mateus 7:24-27",
        pauseSeconds: 25,
      },
      {
        heading: "5. Descida do monte",
        body: "Você desce o monte com a voz de Jesus na memória. Nada muda pela conversa — muda pela obediência. Ofereça esta semana como resposta ao que você escutou.",
        pauseSeconds: 15,
      },
    ],
    centralQuestion: "Do que você ouviu neste Sermão, o que Deus está te chamando a viver esta semana?",
  },
  {
    id: "salmo-23-med",
    title: "Meditação no Salmo 23",
    description: "Seis versículos, seis respirações diante do Pastor.",
    passage: "Salmo 23",
    minutes: 8,
    icon: "Sprout",
    intro: "Vamos caminhar pelo Salmo 23 devagar, um versículo por vez. A cada passo, deixe uma imagem se formar antes de avançar.",
    steps: [
      {
        heading: "v.1 — O Pastor",
        body: "'O Senhor é o meu pastor; nada me faltará.' Feche os olhos. Ele conhece o seu nome. Não é um pastor abstrato — é o seu.",
        scripture: "Salmo 23:1",
        pauseSeconds: 25,
      },
      {
        heading: "v.2 — Descanso",
        body: "'Deitar-me faz em verdes pastos.' Você tem permissão para descansar. Ele às vezes força a deitada porque sabe que você não pararia sozinho.",
        scripture: "Salmo 23:2",
        pauseSeconds: 25,
      },
      {
        heading: "v.3 — Restauração",
        body: "'Refrigera a minha alma; guia-me pelas veredas da justiça por amor do seu nome.' A alma cansada é reanimada por Ele, não por conta própria.",
        scripture: "Salmo 23:3",
        pauseSeconds: 25,
      },
      {
        heading: "v.4 — O vale",
        body: "'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.' O vale não é evitado — é atravessado. E você não está sozinho.",
        scripture: "Salmo 23:4",
        pauseSeconds: 30,
      },
      {
        heading: "v.5 — A mesa",
        body: "'Preparas uma mesa perante mim na presença dos meus inimigos.' Provisão farta, e ainda diante dos que te olham torto. Ele não esconde a Sua bondade sobre você.",
        scripture: "Salmo 23:5",
        pauseSeconds: 20,
      },
      {
        heading: "v.6 — A casa",
        body: "'Bondade e misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.' O destino não é o vale — é a casa.",
        scripture: "Salmo 23:6",
        pauseSeconds: 20,
      },
    ],
    centralQuestion: "Qual versículo do Salmo 23 tocou mais fundo agora — e o que Deus quis te dizer através dele?",
  },
  {
    id: "getsemani",
    title: "Cristo em Getsêmani",
    description: "A noite antes da cruz — quatro pausas contemplativas.",
    passage: "Mateus 26:36-46",
    minutes: 15,
    icon: "TreeDeciduous",
    intro: "É noite no Monte das Oliveiras. Você está entre as árvores, um pouco atrás dos discípulos que já adormeceram. Adiante, o Filho de Deus ora.",
    steps: [
      {
        heading: "1. O jardim",
        body: "Respire. A noite é fria. Os olivais são silenciosos. Jesus se afasta uns passos, cai com o rosto em terra. Você ouve a voz Dele quebrada.",
        pauseSeconds: 25,
      },
      {
        heading: "2. A oração",
        body: "'Pai, se for possível, passa de mim este cálice; contudo, não seja como eu quero, mas como tu queres.' Ele repete. Três vezes. A entrega custa.",
        scripture: "Mateus 26:39",
        pauseSeconds: 40,
      },
      {
        heading: "3. O silêncio do Pai",
        body: "O Pai não responde tirando o cálice. Ele envia um anjo para fortalecer (Lc 22:43). Às vezes a resposta de Deus é sustentar você a atravessar, não te livrar.",
        pauseSeconds: 30,
      },
      {
        heading: "4. Sua Getsêmani",
        body: "Você tem um cálice hoje? Uma dor, uma decisão, uma perda? Ore com as palavras dEle: 'não como eu quero, mas como Tu queres'. Devagar. De verdade.",
        pauseSeconds: 40,
      },
    ],
    centralQuestion: "Qual é o 'cálice' que você precisa entregar ao Pai agora — e o que a entrega de Jesus te ensina sobre a sua?",
  },
  {
    id: "pai-nosso",
    title: "Orando o Pai Nosso",
    description: "Cada petição como janela para uma oração pessoal.",
    passage: "Mateus 6:9-13",
    minutes: 10,
    icon: "Sun",
    intro: "Você já rezou o Pai Nosso muitas vezes. Hoje, vamos rezar devagar, uma petição por vez, deixando cada uma abrir espaço para a sua vida.",
    steps: [
      {
        heading: "1. Pai nosso, que estás nos céus",
        body: "Antes de pedir, contemple. Você tem um Pai. Não um chefe, não um juiz distante — um Pai. Fique aqui um momento.",
        pauseSeconds: 25,
      },
      {
        heading: "2. Santificado seja o teu nome",
        body: "Antes das suas urgências, o nome dEle. Peça que a Sua reputação seja honrada em você hoje.",
        pauseSeconds: 20,
      },
      {
        heading: "3. Venha o teu Reino",
        body: "Onde o Reino de Deus precisa vir na sua semana? Na sua família, no seu trabalho, no seu coração? Ore por lugar específico.",
        pauseSeconds: 30,
      },
      {
        heading: "4. Pão nosso de cada dia",
        body: "Peça o essencial de hoje — comida, saúde, força, direção. Não peça o de amanhã; hoje basta.",
        pauseSeconds: 25,
      },
      {
        heading: "5. Perdoa as nossas dívidas",
        body: "Nomeie uma dívida sua diante de Deus. E nomeie uma dívida que alguém tem com você — e perdoe agora.",
        pauseSeconds: 40,
      },
      {
        heading: "6. Livra-nos do mal",
        body: "Peça proteção do que você não vê. Termine em confiança: 'porque teu é o reino, o poder e a glória'.",
        pauseSeconds: 20,
      },
    ],
    centralQuestion: "Qual petição do Pai Nosso Deus usou hoje para te falar — e o que Ele disse?",
  },
];
