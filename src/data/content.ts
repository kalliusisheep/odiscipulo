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
  // ── PÁGINA 1: ESTUDO ─────────────────────────────────
  intro: string[]; // 3-5 parágrafos
  verses: Verse[]; // ≥ 2
  keywords: Original[]; // 2-3 palavras-chave do idioma original
  deepDive: string; // aprofundamento / reflexão teológica
  theologianQuote: { author: string; text: string };
  // ── PÁGINA 2: FIXAR ──────────────────────────────────
  quizzes: Quiz[]; // múltiplas questões
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
          intro: [
            "A pergunta 'quem é Deus?' é a pergunta mais importante que um ser humano pode fazer. Tudo o que você pensa sobre a vida, a moral, o sofrimento e o destino nasce, no fundo, do que você acredita sobre Deus. A doutrina de Deus é o alicerce de toda a fé cristã.",
            "Historicamente, o cristianismo herdou do judaísmo o monoteísmo radical: existe um único Deus verdadeiro. Mas ao mesmo tempo, o Novo Testamento revela que esse Deus único existe eternamente em três Pessoas — Pai, Filho e Espírito Santo. Isso não é politeísmo disfarçado; é a revelação mais alta do que Deus é.",
            "Teologicamente, chamamos isso de doutrina da Trindade. Não se trata de matemática humana (3 = 1), mas de uma verdade revelada que precisa ser recebida com humildade. Um Deus em três Pessoas eternamente distintas, iguais em essência, unidas em amor.",
            "Praticamente, isso muda tudo. Um Deus que é, em si mesmo, comunhão eterna te criou para comunhão — com Ele e com os outros. Você não foi projetado para viver sozinho.",
          ],
          verses: [
            {
              ref: "Deuteronômio 6:4",
              textByVersion: {
                NVI: "Ouça, ó Israel: O Senhor, o nosso Deus, é o único Senhor.",
                NAA: "Ouça, ó Israel! O Senhor, nosso Deus, é o único Senhor.",
                ACF: "Ouve, Israel, o SENHOR nosso Deus é o único SENHOR.",
                KJV: "Ouve, Israel, o SENHOR nosso Deus é o único SENHOR.",
                NVT: "Escute, ó Israel! O Senhor é o nosso Deus, somente o Senhor.",
              },
              originals: [
                { word: "אֶחָד", translit: "echad", meaning: "um — unidade composta, não solidão numérica", lang: "hebraico" },
              ],
            },
            {
              ref: "Mateus 28:19",
              textByVersion: {
                NVI: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai e do Filho e do Espírito Santo.",
                NAA: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, do Filho e do Espírito Santo.",
                ACF: "Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo.",
                KJV: "Portanto ide, fazei discípulos de todas as nações, batizando-as em nome do Pai, e do Filho, e do Espírito Santo.",
                NVT: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, do Filho e do Espírito Santo.",
              },
            },
          ],
          keywords: [
            { word: "אֶחָד", translit: "echad", meaning: "'um' composto. A mesma palavra usada para o casal como 'uma só carne' em Gênesis 2:24. Unidade rica, não solidão.", lang: "hebraico" },
            { word: "יָחִיד", translit: "yachid", meaning: "'único, solitário' — palavra que NÃO aparece no Shemá. Deus não é 'yachid' (solitário); é 'echad' (unidade em comunhão).", lang: "hebraico" },
            { word: "ὄνομα", translit: "ónoma", meaning: "'nome' (singular!) do Pai, do Filho e do Espírito. Um único nome, três Pessoas — a Trindade em uma frase.", lang: "grego" },
          ],
          deepDive:
            "O Shemá afirma a unicidade de Deus com a palavra 'echad' — a mesma palavra usada para o casal 'uma só carne' em Gênesis 2:24. Não é solidão numérica; é unidade rica. Se o texto quisesse enfatizar solidão absoluta, usaria 'yachid'. O Novo Testamento revela essa unidade como Trindade: um Deus em três Pessoas — Pai, Filho e Espírito Santo — distintas mas inseparáveis. Jesus manda batizar em 'nome' (singular) do Pai, do Filho e do Espírito. Um nome, três Pessoas. Um Deus que é, em si mesmo, comunhão eterna de amor — e por isso o amor não é uma decisão tardia de Deus, mas parte de quem Ele sempre foi.",
          theologianQuote: {
            author: "Luiz Sayão",
            text: "A Trindade não é uma matemática impossível; é a assinatura de um Deus que é, em Si mesmo, comunhão eterna de amor.",
          },
          quizzes: [
            {
              question: "O que a doutrina da Trindade afirma?",
              options: [
                "Três deuses cooperando",
                "Um único Deus manifestado em três modos diferentes",
                "Um único Deus em três Pessoas eternamente distintas",
                "Deus, Jesus e a Bíblia",
              ],
              correctIndex: 2,
              explanation: "Um Deus, três Pessoas distintas e coeternas. Não são modos, nem deuses separados.",
            },
            {
              question: "A palavra hebraica 'echad' no Shemá indica:",
              options: [
                "Solidão absoluta e numérica",
                "Unidade composta, como 'uma só carne'",
                "Três deuses juntos",
                "Um deus apenas simbólico",
              ],
              correctIndex: 1,
              explanation: "'Echad' é a mesma palavra usada para o casal em Gênesis 2:24 — unidade rica, não solidão.",
            },
          ],
          application:
            "Nesta semana, ao orar, dirija-se conscientemente às três Pessoas da Trindade em diferentes momentos: agradeça ao Pai por ter enviado, ao Filho por ter vindo, e ao Espírito por habitar em você. Perceba como isso enriquece sua vida de oração.",
          prayer:
            "Deus Trino, tu és mistério e revelação, unidade e diversidade, um só Deus em Pai, Filho e Espírito Santo. Confesso que minha mente não te alcança, mas meu coração te reconhece. Ajuda-me a conhecer-te como Pai que me gera, seguir-te como Filho que me salvou, e ser guiado por ti como Espírito que habita em mim. Que a comunhão eterna que existe dentro de ti transborde para o modo como amo os meus irmãos. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva uma pequena confissão de fé pessoal em três frases: uma sobre o Pai, uma sobre o Filho, uma sobre o Espírito. Recite-a todos os dias antes de dormir esta semana.",
          reflectionQuestion:
            "Como a comunhão eterna da Trindade transforma o modo como você vê a igreja e as suas relações?",
          xp: 20,
        },
        {
          id: "db-1-2",
          title: "Quem é Jesus?",
          intro: [
            "Jesus mesmo fez a pergunta, olhando nos olhos dos discípulos: 'quem dizeis que eu sou?' (Mateus 16:15). Nenhuma pessoa na história forçou tanto o mundo a se posicionar. Grandes mestres foram admirados ou ignorados; Jesus divide a humanidade em duas.",
            "Historicamente, a igreja levou séculos para articular com precisão o que a Bíblia já ensinava: Jesus é totalmente Deus e totalmente homem, sem confusão entre as duas naturezas e sem separação entre elas. Não é meio-deus e meio-homem; é Deus completo em corpo humano completo.",
            "Teologicamente, isso é a doutrina da encarnação. João a resume com uma palavra: 'Lógos' — a Razão eterna de Deus se fez carne (João 1:1,14). Paulo afirma que nEle habita 'toda a plenitude da divindade' corporalmente (Colossenses 2:9).",
            "Praticamente, isso significa que Jesus não é apenas um exemplo — Ele tem autoridade absoluta sobre a sua vida. Se Ele é Deus, tudo o que Ele disse é verdade última.",
          ],
          verses: [
            {
              ref: "João 1:1",
              textByVersion: {
                NVI: "No princípio era aquele que é a Palavra. Ele estava com Deus, e era Deus.",
                NAA: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
                ACF: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
                KJV: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
                NVT: "No princípio a Palavra já existia. A Palavra estava com Deus, e a Palavra era Deus.",
              },
              originals: [
                { word: "Λόγος", translit: "Lógos", meaning: "Palavra, razão criadora, autorrevelação de Deus", lang: "grego" },
              ],
            },
            {
              ref: "Colossenses 2:9",
              textByVersion: {
                NVI: "Pois em Cristo habita corporalmente toda a plenitude da divindade.",
                NAA: "Pois nele habita, corporalmente, toda a plenitude da divindade.",
                ACF: "Porque nele habita corporalmente toda a plenitude da divindade.",
                KJV: "Porque nele habita corporalmente toda a plenitude da divindade.",
                NVT: "Pois em Cristo habita toda a plenitude de Deus em forma humana.",
              },
              originals: [
                { word: "πλήρωμα", translit: "plērōma", meaning: "plenitude — a totalidade, nada faltando", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "Λόγος", translit: "Lógos", meaning: "'Palavra, Razão'. Os gregos usavam para a razão que ordena o universo. João a aplica a Jesus: a Razão eterna se fez carne.", lang: "grego" },
            { word: "πλήρωμα", translit: "plērōma", meaning: "'plenitude'. Não uma parte da divindade — a totalidade dela. Em Cristo não falta nada de Deus.", lang: "grego" },
            { word: "σωματικῶς", translit: "sōmatikōs", meaning: "'corporalmente'. Deus habita em Jesus de forma corporal, real, palpável — não apenas em ideia ou influência.", lang: "grego" },
          ],
          deepDive:
            "João chama Jesus de 'Lógos' — termo que os gregos usavam para a razão que ordena o universo. Ele afirma que essa Razão eterna se fez carne. Em Cristo, Deus não enviou apenas um mensageiro; Ele mesmo veio. Paulo intensifica: nEle habita 'plērōma' — plenitude, totalidade — da divindade, e ainda por cima 'sōmatikōs', corporalmente. Não é uma faísca divina, não é possessão temporária. É Deus completo em corpo humano completo. Se isso é verdade, Jesus não pode ser apenas mais um bom mestre entre outros. Ou Ele é Senhor de tudo — e merece autoridade absoluta sobre a sua vida — ou é o maior impostor da história. Não há meio-termo confortável.",
          theologianQuote: {
            author: "John Lennox",
            text: "Jesus não é apenas a resposta que Deus dá às nossas perguntas — Ele é a Palavra que Deus fala sobre Si mesmo.",
          },
          quizzes: [
            {
              question: "Segundo João 1, quem é o 'Verbo' (Lógos)?",
              options: [
                "Um profeta especial enviado por Deus",
                "Deus se autorrevelando, que se fez carne em Jesus",
                "A Bíblia personificada",
                "Um anjo poderoso",
              ],
              correctIndex: 1,
              explanation: "O 'Lógos' é a Razão eterna de Deus, que se fez carne em Jesus.",
            },
            {
              question: "Colossenses 2:9 afirma que em Cristo habita:",
              options: [
                "Uma parte da divindade",
                "Toda a plenitude da divindade corporalmente",
                "Apenas o Espírito Santo",
                "Apenas humanidade",
              ],
              correctIndex: 1,
              explanation: "'Plērōma' significa plenitude total, e 'sōmatikōs' significa corporalmente.",
            },
          ],
          application:
            "Identifique uma área da sua vida em que você ainda não rendeu autoridade a Jesus (finanças, relacionamentos, tempo, escolhas). Nesta semana, faça uma escolha concreta nessa área submetendo-a ao que Ele ensinou.",
          prayer:
            "Senhor Jesus, tu és Deus e Salvador, o Verbo eterno que se fez carne por mim. Confesso que muitas vezes te trato como um bom mestre entre outros, quando tu és o Senhor de tudo. Perdoa-me pela hesitação em te obedecer nas áreas em que ainda tento manter o controle. Rendo-me à tua autoridade — não por medo, mas porque tu és digno. Reina em cada canto da minha vida. Em teu nome, amém.",
          weeklyChallenge:
            "Escreva uma decisão prática que você tomará esta semana justamente porque Jesus é Senhor — algo que você faria diferente se Ele não fosse. Compartilhe essa decisão com alguém da igreja.",
          reflectionQuestion:
            "Em que área da sua vida você ainda hesita em obedecer a autoridade de Cristo?",
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
          intro: [
            "'Graça' é provavelmente a palavra mais bonita e mais mal compreendida do vocabulário cristão. Ela define o Evangelho, e ao mesmo tempo é a que mais escorrega dos dedos quando tentamos explicá-la.",
            "Historicamente, o cristianismo se distingue de toda outra religião por causa dessa palavra. Toda religião natural funciona por mérito: faça isto, evite aquilo, e você alcança o divino. O Evangelho anuncia o oposto: você não pode alcançar Deus por esforço próprio — Ele desceu até você por pura bondade.",
            "Teologicamente, a graça é favor imerecido. Não é Deus recompensando seu esforço; é Deus dando o que você jamais poderia comprar. Isso não anula sua responsabilidade — ela a possibilita. Quem é salvo pela graça vive uma gratidão que produz obediência, não uma obediência que compra salvação.",
            "Praticamente, entender a graça liberta de duas armadilhas: o orgulho ('mereço porque me esforço') e o desespero ('não mereço porque falhei'). A graça diz que não é sobre o seu mérito — nunca foi.",
          ],
          verses: [
            {
              ref: "Efésios 2:8-9",
              textByVersion: {
                NVI: "Pois vocês são salvos pela graça, por meio da fé, e isto não vem de vocês, é dom de Deus; não por obras, para que ninguém se glorie.",
                NAA: "Porque pela graça vocês são salvos, mediante a fé; e isto não vem de vocês, é dom de Deus; não vem de obras, para que ninguém se glorie.",
                ACF: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus. Não vem das obras, para que ninguém se glorie.",
                KJV: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus. Não vem das obras, para que ninguém se glorie.",
                NVT: "Deus salvou vocês pela graça, quando creram. E vocês não podem receber o crédito por isso; é um presente de Deus. A salvação não é recompensa pelas boas coisas que temos feito, para que ninguém se orgulhe disso.",
              },
              originals: [
                { word: "χάρις", translit: "cháris", meaning: "favor imerecido, dom livre e gratuito", lang: "grego" },
              ],
            },
            {
              ref: "Tito 2:11-12",
              textByVersion: {
                NVI: "Porque a graça de Deus se manifestou salvadora a todos os homens. Ela nos ensina a renunciar à impiedade e às paixões mundanas e a viver de maneira sensata, justa e piedosa nesta era presente.",
                NAA: "Porque a graça de Deus se manifestou salvadora a todos os seres humanos. Essa graça nos ensina a renunciar à impiedade e às paixões mundanas e a viver, no presente século, de maneira sensata, justa e piedosa.",
                ACF: "Porque a graça de Deus se há manifestado, trazendo salvação a todos os homens, ensinando-nos que, renunciando à impiedade e às concupiscências mundanas, vivamos neste presente século sóbria, e justa, e piamente.",
                KJV: "Porque a graça de Deus se há manifestado, trazendo salvação a todos os homens, ensinando-nos que, renunciando à impiedade e às concupiscências mundanas, vivamos neste presente século sóbria, e justa, e piamente.",
                NVT: "Pois a graça de Deus foi revelada, trazendo salvação a todas as pessoas. E somos instruídos por Deus a nos afastarmos de uma vida ímpia e dos prazeres pecaminosos. Devemos viver neste mundo com sabedoria, justiça e devoção a Deus.",
              },
            },
          ],
          keywords: [
            { word: "χάρις", translit: "cháris", meaning: "'graça, favor'. Favor totalmente imerecido — não recompensa, não pagamento. Presente puro.", lang: "grego" },
            { word: "δῶρον", translit: "dōron", meaning: "'dom, presente'. Se fosse recompensa, não seria presente. A salvação é presente, não salário.", lang: "grego" },
            { word: "παιδεύουσα", translit: "paideúousa", meaning: "'ensinando, disciplinando como filho'. A graça não é permissiva — ela educa quem foi salvo por ela.", lang: "grego" },
          ],
          deepDive:
            "'Cháris' significa favor totalmente imerecido. Não é Deus recompensando seu esforço — é Deus dando o que você jamais poderia comprar. Paulo insiste: 'não vem de obras, para que ninguém se glorie'. Deus estruturou a salvação assim justamente para que ninguém tenha do que se gabar. Mas Paulo também adverte, em Tito, que essa mesma graça 'nos ensina' (paideúousa — disciplina como pai educa filho) a renunciar à impiedade. A graça exclui o mérito, mas não a resposta: quem é salvo pela graça vive gratidão que produz obediência. Confundir graça com licença para pecar é o mesmo que confundir um presente de alguém que te ama com um convite para desprezar quem o deu.",
          theologianQuote: {
            author: "John Wesley",
            text: "A graça de Deus não anula nossa responsabilidade; ela a possibilita.",
          },
          quizzes: [
            {
              question: "A salvação pela graça significa que:",
              options: [
                "Podemos pecar livremente porque estamos perdoados",
                "É um favor imerecido de Deus, não fruto de nossas obras",
                "Precisamos completar a graça com obras",
                "Só alguns escolhidos merecem",
              ],
              correctIndex: 1,
              explanation: "'Cháris' é favor imerecido. Nem obras acrescentam mérito, nem pecado a anula como licença.",
            },
            {
              question: "Segundo Tito 2:11-12, a graça de Deus:",
              options: [
                "Ignora o pecado do crente",
                "Ensina o crente a renunciar à impiedade",
                "Substitui a Bíblia",
                "Só se aplica no juízo final",
              ],
              correctIndex: 1,
              explanation: "A mesma graça que salva também educa (paideúousa) para uma vida piedosa.",
            },
          ],
          application:
            "Nesta semana, quando alguém te ofender ou falhar contigo, pergunte-se: 'como Deus me tratou quando eu não merecia?' Escolha responder com uma medida da mesma graça que recebeu — não porque a pessoa merece, mas porque você foi tratado assim.",
          prayer:
            "Pai, obrigado pela tua graça. Confesso que às vezes tento pagar por ela com esforço, e outras vezes a trato como barata, esquecendo o preço que custou ao teu Filho. Ensina-me a receber tua graça sem culpa e sem orgulho — como quem recebe um presente que jamais poderia comprar. Que essa mesma graça me eduque para viver de maneira digna do teu nome. Que ela transborde de mim para todos os que precisam ser tratados como eu fui tratado por ti. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha uma pessoa que te ofendeu recentemente e ofereça a ela um gesto concreto de graça esta semana (uma palavra gentil, um perdão, um favor). Não porque ela mereça — mas porque você foi tratado assim.",
          reflectionQuestion:
            "Como a graça que você recebeu muda o modo como você trata quem te ofende?",
          xp: 20,
        },
      ],
    },
  ],
};

// Trilhas em preparação — títulos e descrições, sem lições ainda.
const upcoming: Trail[] = [
  { id: "santificacao", title: "Santificação", description: "O caminho diário de conformação a Cristo.", icon: "Sparkles", color: "from-fuchsia-500 to-pink-500", order: 5, modules: [] },
  { id: "evangelismo", title: "Evangelismo", description: "Compartilhando o Evangelho no cotidiano.", icon: "Megaphone", color: "from-blue-500 to-cyan-500", order: 6, modules: [] },
  { id: "igreja-local", title: "Igreja Local", description: "O propósito e a beleza da comunidade cristã.", icon: "Church", color: "from-slate-500 to-gray-600", order: 7, modules: [] },
  { id: "familia-crista", title: "Família Cristã", description: "Casamento, filhos e casa segundo a Bíblia.", icon: "Home", color: "from-amber-500 to-yellow-600", order: 8, modules: [] },
  { id: "lideranca", title: "Liderança", description: "Formando líderes servos no Reino.", icon: "Crown", color: "from-purple-600 to-indigo-700", order: 9, modules: [] },
  { id: "missoes", title: "Missões", description: "O coração de Deus pelas nações.", icon: "Globe", color: "from-cyan-500 to-blue-600", order: 10, modules: [] },
];

import { additionalTrails } from "./trails-content";

export const trails: Trail[] = [novoConvertido, doutrinaBasica, ...additionalTrails, ...upcoming]
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
