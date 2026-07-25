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
            "Pai, obrigado por não me tratar como servo distante, mas como filho amado. Confesso que, muitas vezes, ainda ajo como escravo do medo — trabalhando para conquistar teu favor, escondendo minhas falhas por vergonha, achando que preciso merecer a tua presença. Ensina-me a viver como quem já foi adotado por ti em Cristo. Quando eu esquecer, que teu Espírito me lembre, colocando de novo em meus lábios a palavra 'Abbá'. Que essa identidade filial molde minha oração, meu trabalho, minhas relações, minhas quedas e minha alegria. Em nome de Jesus, teu Filho e meu irmão mais velho, amém.",
          weeklyChallenge:
            "Escreva num caderno: 'Sou filho(a) de Deus por adoção em Cristo. Isso é verdade sobre mim, hoje.' Releia essa frase toda manhã, por sete dias, antes de qualquer outra atividade. Ao fim da semana, anote como essa lembrança começou a mudar suas reações diante de erros, medos e conquistas.",
          reflectionQuestion:
            "Em que áreas da sua vida você ainda vive como servo com medo, e não como filho amado? O que mudaria hoje se você abraçasse plenamente a identidade de filho(a) adotado(a) em Cristo?",
          xp: 20,
        },
      ],
    },
  ],
};

import { additionalTrails } from "./trails-content";
import { additionalTrails2 } from "./trails-content-2";
import { additionalTrails3 } from "./trails-content-3";
import { additionalTrails4 } from "./trails-content-4";

// Trilhas em preparação — títulos e descrições, sem lições ainda.
const upcoming: Trail[] = [
  { id: "evangelismo", title: "Evangelismo", description: "Compartilhando o Evangelho no cotidiano.", icon: "Megaphone", color: "from-blue-500 to-cyan-500", order: 6, modules: [] },
  { id: "lideranca", title: "Liderança", description: "Formando líderes servos no Reino.", icon: "Crown", color: "from-purple-600 to-indigo-700", order: 9, modules: [] },
];

export const trails: Trail[] = [novoConvertido, ...additionalTrails3, ...additionalTrails, ...additionalTrails2, ...additionalTrails4, ...upcoming]
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
