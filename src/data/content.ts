// Conteúdo semente: trilhas, módulos e lições do Disciple.
// Estrutura fixa em código — o progresso do usuário fica no banco.

export type Verse = {
  ref: string; // "João 3:16"
  text: string;
  originals?: { word: string; translit: string; meaning: string; lang: "grego" | "hebraico" }[];
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
  intro: string;
  verses: Verse[];
  explanation: string;
  theologianQuote: { author: string; text: string };
  quiz: Quiz;
  reflection: { summary: string; prayer: string; question: string };
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
  icon: string; // lucide name
  color: string; // tailwind gradient class
  modules: ModuleT[];
  order: number;
};

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
          id: "nc-1-1",
          title: "O que aconteceu comigo?",
          intro: "Você experimentou algo que a Bíblia chama de 'novo nascimento'. Entenda o que isso significa.",
          verses: [
            {
              ref: "João 3:3",
              text: "Em verdade, em verdade te digo que se alguém não nascer de novo não pode ver o Reino de Deus.",
              originals: [
                { word: "ἄνωθεν", translit: "anōthen", meaning: "de novo / do alto", lang: "grego" },
              ],
            },
            {
              ref: "2 Coríntios 5:17",
              text: "Portanto, se alguém está em Cristo, é nova criação. As coisas antigas já passaram; eis que se fizeram novas.",
              originals: [
                { word: "καινὴ κτίσις", translit: "kainē ktisis", meaning: "nova criação, algo qualitativamente novo", lang: "grego" },
              ],
            },
          ],
          explanation:
            "Quando Jesus fala do novo nascimento a Nicodemos, ele não descreve reforma moral, mas recriação. A palavra 'anōthen' pode significar tanto 'de novo' quanto 'do alto' — e ambos os sentidos importam: é uma origem nova, e essa origem vem de Deus. Paulo confirma: quem está em Cristo é 'kainē ktisis', uma criatura qualitativamente diferente. Isso é o que aconteceu com você.",
          theologianQuote: {
            author: "Paul Washer",
            text: "A conversão verdadeira não é uma decisão que você toma. É uma obra que Deus faz — e ela deixa marcas.",
          },
          quiz: {
            question: "O que significa 'nascer de novo' segundo Jesus em João 3?",
            options: [
              "Melhorar seu comportamento e frequentar a igreja",
              "Uma recriação espiritual feita por Deus",
              "Aprender toda a Bíblia de cor",
              "Ser batizado publicamente",
            ],
            correctIndex: 1,
            explanation: "É obra de Deus, não esforço humano. Você foi recriado.",
          },
          reflection: {
            summary: "O novo nascimento não é um upgrade — é uma nova origem. Você é, hoje, uma nova criação em Cristo.",
            prayer: "Pai, obrigado por me fazer nova criação. Ajuda-me a viver à altura dessa nova identidade.",
            question: "O que na sua vida antiga você percebe que já 'passou'? E o que ainda está sendo renovado?",
          },
          xp: 15,
        },
        {
          id: "nc-1-2",
          title: "Tenho certeza da salvação?",
          intro: "Dúvida é comum no início. A Bíblia oferece âncoras concretas para sua segurança.",
          verses: [
            {
              ref: "1 João 5:13",
              text: "Estas coisas vos escrevi para que saibais que tendes a vida eterna, a vós que credes no nome do Filho de Deus.",
            },
            {
              ref: "Romanos 8:16",
              text: "O próprio Espírito testifica com o nosso espírito que somos filhos de Deus.",
              originals: [
                { word: "συμμαρτυρεῖ", translit: "symmartyrei", meaning: "testifica junto com, corrobora", lang: "grego" },
              ],
            },
          ],
          explanation:
            "João escreve para que você saiba — não sinta apenas, mas saiba. A segurança tem duas testemunhas: a Palavra escrita (você creu no nome do Filho) e o Espírito (que 'symmartyrei' — testifica junto). Sentimentos oscilam; essas duas testemunhas não.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "A fé não é maior por ter sentimentos fortes, e não é menor por não os ter. A fé se apoia em Cristo, não em si mesma.",
          },
          quiz: {
            question: "A segurança da salvação vem principalmente de:",
            options: [
              "Não errar mais nunca",
              "A promessa da Palavra e o testemunho do Espírito",
              "Um sentimento constante de alegria",
              "Fazer boas obras suficientes",
            ],
            correctIndex: 1,
          },
          reflection: {
            summary: "Salvação não é sensação — é aliança. Deus é fiel mesmo quando você duvida.",
            prayer: "Senhor, quando meus sentimentos oscilarem, ajuda-me a descansar nas Tuas promessas.",
            question: "Que dúvida sobre sua salvação você quer trazer diante de Deus hoje?",
          },
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
          intro: "A Palavra não é uma tarefa religiosa — é o alimento do novo homem.",
          verses: [
            {
              ref: "Mateus 4:4",
              text: "Nem só de pão viverá o homem, mas de toda palavra que sai da boca de Deus.",
            },
            {
              ref: "Salmos 119:105",
              text: "Lâmpada para os meus pés é a Tua palavra, e luz para o meu caminho.",
              originals: [
                { word: "נֵר", translit: "nēr", meaning: "lâmpada, luz próxima que ilumina o próximo passo", lang: "hebraico" },
              ],
            },
          ],
          explanation:
            "O salmista não diz que a Palavra é um holofote que ilumina o horizonte inteiro — ela é 'nēr', a lâmpada de óleo que ilumina o próximo passo. Deus raramente mostra o mapa completo; Ele mostra o próximo passo. Por isso a leitura diária: você precisa da luz de hoje, não da luz do ano que vem.",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "A Bíblia não é um livro que lemos apenas; é um livro que nos lê. Ela nos revela quem somos diante de Deus.",
          },
          quiz: {
            question: "Segundo Salmos 119:105, a Palavra é uma lâmpada porque:",
            options: [
              "Ilumina todo o seu futuro de uma vez",
              "Ilumina o próximo passo do seu caminho",
              "Substitui a necessidade de oração",
              "Só serve para pregação pública",
            ],
            correctIndex: 1,
          },
          reflection: {
            summary: "Leitura diária é como comer diariamente: não porque comer ontem foi ruim, mas porque hoje você tem fome.",
            prayer: "Senhor, cria em mim fome pela Tua Palavra. Que eu deseje conhecer-Te mais.",
            question: "Que horário do seu dia pode se tornar seu tempo fixo com a Bíblia?",
          },
          xp: 15,
        },
        {
          id: "nc-2-2",
          title: "Como orar quando não sei orar",
          intro: "Oração não é discurso religioso. É conversa filial com o Pai.",
          verses: [
            {
              ref: "Mateus 6:9",
              text: "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o Teu nome.",
              originals: [
                { word: "Πάτερ", translit: "Páter", meaning: "Pai — intimidade familiar, não distância religiosa", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:26",
              text: "O Espírito ajuda as nossas fraquezas; porque não sabemos o que havemos de pedir como convém, mas o mesmo Espírito intercede por nós com gemidos inexprimíveis.",
            },
          ],
          explanation:
            "Jesus começa a oração modelo com 'Páter' — a palavra que uma criança usava para chamar seu pai em casa. Não é performance. E quando você não souber orar (todos nós passamos por isso), Paulo garante: o Espírito ora por você. Comece pequeno. Fale com o Pai como um filho.",
          theologianQuote: {
            author: "C.S. Lewis",
            text: "Oramos não porque Deus precise ser informado, mas porque nós precisamos ser transformados no processo.",
          },
          quiz: {
            question: "Qual a atitude central da oração ensinada por Jesus?",
            options: [
              "Repetir fórmulas corretas",
              "Impressionar Deus com palavras difíceis",
              "Falar como filho ao Pai",
              "Orar apenas em público",
            ],
            correctIndex: 2,
          },
          reflection: {
            summary: "Oração é intimidade, não eloquência. Deus ouve o balbuciar do filho mais do que o discurso do estranho.",
            prayer: "Pai, ensina-me a orar. Livra-me da vergonha e da religiosidade vazia.",
            question: "O que você quer dizer ao Pai hoje que ainda não teve coragem de dizer?",
          },
          xp: 15,
        },
      ],
    },
  ],
};

const doutrinaBasica: Trail = {
  id: "doutrina-basica",
  title: "Doutrina Básica da Fé",
  description: "Os fundamentos inegociáveis do cristianismo histórico.",
  icon: "BookOpen",
  color: "from-indigo-500 to-purple-600",
  order: 2,
  modules: [
    {
      id: "db-mod-1",
      title: "Módulo I: Fundações Eternas",
      lessons: [
        {
          id: "db-1-1",
          title: "Quem é Deus?",
          intro: "A doutrina de Deus é o alicerce de toda a fé cristã.",
          verses: [
            {
              ref: "Deuteronômio 6:4",
              text: "Ouve, ó Israel: o Senhor, nosso Deus, é o único Senhor.",
              originals: [
                { word: "אֶחָד", translit: "echad", meaning: "um — unidade composta, não solidão numérica", lang: "hebraico" },
              ],
            },
            {
              ref: "Mateus 28:19",
              text: "Ide, portanto, e fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo.",
            },
          ],
          explanation:
            "O Shemá afirma a unicidade de Deus com a palavra 'echad' — a mesma palavra usada para o casal 'uma só carne' em Gênesis 2:24. Não é solidão numérica; é unidade rica. O Novo Testamento revela essa unidade como Trindade: um Deus em três Pessoas — Pai, Filho e Espírito Santo — distintas mas inseparáveis.",
          theologianQuote: {
            author: "Luiz Sayão",
            text: "A Trindade não é uma matemática impossível; é a assinatura de um Deus que é, em Si mesmo, comunhão eterna de amor.",
          },
          quiz: {
            question: "O que a doutrina da Trindade afirma?",
            options: [
              "Três deuses cooperando",
              "Um único Deus manifestado em três modos diferentes",
              "Um único Deus em três Pessoas eternamente distintas",
              "Deus, Jesus e a Bíblia",
            ],
            correctIndex: 2,
          },
          reflection: {
            summary: "Deus é comunhão em Si mesmo. Por isso Ele nos criou para comunhão com Ele e uns com os outros.",
            prayer: "Deus Trino, ajuda-me a conhecer-Te como Pai, seguir-Te como Filho e ser guiado pelo Espírito.",
            question: "Como a comunhão eterna da Trindade transforma o modo como você vê a igreja?",
          },
          xp: 20,
        },
        {
          id: "db-1-2",
          title: "Quem é Jesus?",
          intro: "A pergunta que Jesus mesmo fez: 'Quem dizeis que eu sou?'",
          verses: [
            {
              ref: "João 1:1",
              text: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
              originals: [
                { word: "Λόγος", translit: "Lógos", meaning: "Palavra, razão criadora, autorrevelação de Deus", lang: "grego" },
              ],
            },
            {
              ref: "Colossenses 2:9",
              text: "Porque nEle habita corporalmente toda a plenitude da divindade.",
            },
          ],
          explanation:
            "João chama Jesus de 'Lógos' — termo que os gregos usavam para a razão que ordena o universo. Ele afirma que essa Razão eterna se fez carne. Em Cristo, Deus não enviou apenas um mensageiro; Ele mesmo veio. Jesus é totalmente Deus e totalmente homem, sem confusão e sem mistura.",
          theologianQuote: {
            author: "John Lennox",
            text: "Jesus não é apenas a resposta que Deus dá às nossas perguntas — Ele é a Palavra que Deus fala sobre Si mesmo.",
          },
          quiz: {
            question: "Segundo João 1, quem é o 'Verbo'?",
            options: [
              "Um profeta especial enviado por Deus",
              "Deus se autorrevelando, que se fez carne em Jesus",
              "A Bíblia personificada",
              "Um anjo poderoso",
            ],
            correctIndex: 1,
          },
          reflection: {
            summary: "Se Jesus é Deus, então tudo o que Ele disse tem autoridade absoluta sobre sua vida.",
            prayer: "Senhor Jesus, tu és Deus e Salvador. Rendo-me à Tua autoridade.",
            question: "Em que área da sua vida você ainda hesita em obedecer a autoridade de Cristo?",
          },
          xp: 20,
        },
      ],
    },
    {
      id: "db-mod-2",
      title: "Módulo II: Vida Cristã Prática",
      lessons: [
        {
          id: "db-2-1",
          title: "O que é graça?",
          intro: "A palavra que define o Evangelho — e a mais mal compreendida.",
          verses: [
            {
              ref: "Efésios 2:8-9",
              text: "Porque pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus. Não vem das obras, para que ninguém se glorie.",
              originals: [
                { word: "χάρις", translit: "cháris", meaning: "favor imerecido, dom livre e gratuito", lang: "grego" },
              ],
            },
          ],
          explanation:
            "'Cháris' significa favor totalmente imerecido. Não é Deus recompensando seu esforço — é Deus dando o que você jamais poderia comprar. A graça exclui o mérito, mas não a resposta: quem é salvo pela graça vive gratidão que produz obediência.",
          theologianQuote: {
            author: "John Wesley",
            text: "A graça de Deus não anula nossa responsabilidade; ela a possibilita.",
          },
          quiz: {
            question: "A salvação pela graça significa que:",
            options: [
              "Podemos pecar livremente porque estamos perdoados",
              "É um favor imerecido de Deus, não fruto de nossas obras",
              "Precisamos completar a graça com obras",
              "Só alguns escolhidos merecem",
            ],
            correctIndex: 1,
          },
          reflection: {
            summary: "Graça é o que Deus faz por você quando você não pode fazer nada por Si mesmo.",
            prayer: "Pai, obrigado pela Tua graça. Que eu jamais a trate como barata.",
            question: "Como a graça que você recebeu muda o modo como você trata quem te ofende?",
          },
          xp: 20,
        },
      ],
    },
  ],
};

// Trilhas em preparação — títulos e descrições, sem lições ainda.
const upcoming: Trail[] = [
  { id: "como-estudar-biblia", title: "Como Estudar a Bíblia", description: "Ferramentas simples de interpretação bíblica.", icon: "Search", color: "from-emerald-500 to-teal-600", order: 3, modules: [] },
  { id: "oracao", title: "Oração", description: "Aprofunde sua vida de oração pessoal.", icon: "Flame", color: "from-orange-500 to-rose-500", order: 4, modules: [] },
  { id: "santificacao", title: "Santificação", description: "O caminho diário de conformação a Cristo.", icon: "Sparkles", color: "from-fuchsia-500 to-pink-500", order: 5, modules: [] },
  { id: "evangelismo", title: "Evangelismo", description: "Compartilhando o Evangelho no cotidiano.", icon: "Megaphone", color: "from-blue-500 to-cyan-500", order: 6, modules: [] },
  { id: "igreja-local", title: "Igreja Local", description: "O propósito e a beleza da comunidade cristã.", icon: "Church", color: "from-slate-500 to-gray-600", order: 7, modules: [] },
  { id: "familia-crista", title: "Família Cristã", description: "Casamento, filhos e casa segundo a Bíblia.", icon: "Home", color: "from-amber-500 to-yellow-600", order: 8, modules: [] },
  { id: "lideranca", title: "Liderança", description: "Formando líderes servos no Reino.", icon: "Crown", color: "from-purple-600 to-indigo-700", order: 9, modules: [] },
  { id: "missoes", title: "Missões", description: "O coração de Deus pelas nações.", icon: "Globe", color: "from-cyan-500 to-blue-600", order: 10, modules: [] },
];

export const trails: Trail[] = [novoConvertido, doutrinaBasica, ...upcoming];

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

// Níveis / Títulos gamificados
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

export const BIBLE_VERSIONS = ["NVI", "NAA", "ACF", "KJV", "NVT"] as const;
export type BibleVersion = typeof BIBLE_VERSIONS[number];
