// Conteúdo de apoio ao discipulado — Modo Líder.
// Cada tema segue a mesma estrutura das lições da Home (versículo com
// original grego/hebraico, palavras-chave, aprofundamento, citação teológica,
// aplicação) e soma dois exercícios de fixação: o quiz de sempre e um novo
// exercício de "relacionar" (termo original ↔ significado), montado a partir
// das próprias keywords de cada tema — não precisa de dado duplicado nem de
// tabela nova no Supabase.

import type { Original, Quiz, Verse } from "@/data/content";

export type SupportLesson = {
  id: string;
  title: string;
  verse: Verse;
  keywords: Original[]; // também alimentam o exercício "Relacione os termos"
  intro: string[];
  deepDive: string;
  theologianQuote: { author: string; text: string; source?: string };
  quiz: Quiz;
  application: string;
  prayer: string;
  weeklyChallenge: string;
  reflectionQuestion: string;
};

export const SUPPORT_LESSONS: SupportLesson[] = [
  {
    id: "orgulho",
    title: "Orgulho",
    verse: {
      ref: "Tiago 4:6",
      textByVersion: { NVI: "Mas ele nos concede graça maior. Por isso diz a Escritura: ‘Deus se opõe aos orgulhosos, mas concede graça aos humildes.’" },
      originals: [
        { word: "ἀντιτάσσεται", translit: "antitássetai", meaning: "'opõe-se, resiste como um adversário' — Deus não apenas desaprova o orgulho, ele o enfrenta ativamente, como quem se posiciona contra um inimigo", lang: "grego" },
      ],
    },
    keywords: [
      { word: "ἀντιτάσσεται", translit: "antitássetai", meaning: "opõe-se, resiste como um adversário — Deus enfrenta ativamente o orgulho, não apenas o desaprova", lang: "grego" },
      { word: "ταπεινοῖς", translit: "tapeinoîs", meaning: "aos humildes — dativo de tapeinós; os que reconhecem sua dependência de Deus, sem se rebaixar por fingimento", lang: "grego" },
      { word: "χάρις", translit: "cháris", meaning: "graça — favor totalmente imerecido, que Deus derrama sobre quem já não confia em si mesmo", lang: "grego" },
    ],
    intro: [
      "Orgulho não é apenas vaidade ou arrogância visível; é, na raiz, a recusa de depender de Deus. O orgulhoso se coloca no centro — do próprio mérito, da própria opinião, da própria capacidade de resolver tudo sozinho.",
      "O discipulado começa, e continua, no reconhecimento de que somos criaturas dependentes de um Deus que se opõe ao orgulho, mas corre ao encontro de quem se humilha diante dele.",
    ],
    deepDive: "Tiago cita Provérbios 3:34 para mostrar que essa não é uma observação isolada, mas um padrão constante de Deus através das Escrituras. O verbo antitássetai é forte: Deus não fica neutro diante do orgulho, ele se posiciona contra ele. Ao mesmo tempo, a graça está disponível, generosa, para quem se reconhece pequeno. O antídoto do orgulho não é uma autoestima menor, mas os olhos voltados para Cristo.",
    theologianQuote: { author: "Tim Keller", text: "O oposto do orgulho não é apenas humildade; é esquecer-se de si mesmo diante da grandeza de Deus.", source: "frase atribuída" },
    quiz: {
      question: "Segundo Tiago 4:6, qual é a atitude de Deus diante do orgulho e da humildade?",
      options: ["Ele trata as duas atitudes da mesma forma", "Ele se opõe ao orgulhoso e concede graça ao humilde", "Ele recompensa quem confia nas próprias forças", "Ele ignora o orgulho quando a pessoa é bem-sucedida"],
      correctIndex: 1,
      explanation: "O verbo antitássetai mostra que Deus resiste ativamente ao orgulhoso, enquanto reserva graça abundante para quem se humilha diante dele.",
    },
    application: "Em uma conversa desta semana, escolha ouvir mais do que falar, e receba uma correção sem se justificar imediatamente.",
    prayer: "Senhor, mostra-me onde tenho confiado em mim mesmo em vez de confiar em ti. Ensina-me a depender da tua graça a cada dia. Amém.",
    weeklyChallenge: "Peça a alguém de confiança que aponte, com sinceridade, uma área em que seu orgulho costuma aparecer.",
    reflectionQuestion: "Em qual conversa desta semana posso ouvir antes de responder?",
  },
  {
    id: "pecado",
    title: "Pecado",
    verse: {
      ref: "1 João 1:9",
      textByVersion: { NVI: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça." },
    },
    keywords: [
      { word: "ὁμολογῶμεν", translit: "homologômen", meaning: "confessarmos — literalmente 'dizer o mesmo'; concordar com Deus sobre o pecado, em vez de justificá-lo ou escondê-lo", lang: "grego" },
      { word: "πιστός", translit: "pistós", meaning: "fiel — o caráter constante de Deus é o que garante o perdão, não o esforço ou o sentimento de quem confessa", lang: "grego" },
      { word: "καθαρίσῃ", translit: "katharísē", meaning: "purificar — raiz da palavra 'catarse'; ação completa de limpeza, não apenas perdão pontual", lang: "grego" },
    ],
    intro: [
      "Em Cristo há perdão real para quem confessa. A tentação diante do pecado é sempre a mesma: esconder, minimizar ou justificar. As Escrituras oferecem outro caminho — trazer o pecado à luz diante de Deus e, quando necessário, diante de irmãos de confiança.",
      "Confessar não é se punir; é concordar com Deus sobre a gravidade do pecado e receber, com humildade, o perdão que ele já providenciou em Cristo.",
    ],
    deepDive: "Homologômen carrega a ideia de 'falar junto', de estar de acordo. Confessar o pecado não é informar Deus de algo que ele já sabe, é alinhar nossa avaliação à dele. A base do perdão não está na intensidade do arrependimento, mas na fidelidade (pistós) e na justiça de Deus, que já tratou o pecado na cruz de Cristo.",
    theologianQuote: { author: "John Stott", text: "O primeiro passo para a santidade não é a autoperfeição, mas a confissão honesta diante de Deus.", source: "frase atribuída" },
    quiz: {
      question: "O que garante o perdão prometido em 1 João 1:9?",
      options: ["A intensidade do sentimento de culpa da pessoa", "O tempo que ela leva para se arrepender", "A fidelidade e a justiça de Deus", "A ausência de pecados futuros"],
      correctIndex: 2,
      explanation: "O texto ancora o perdão no caráter de Deus — fiel e justo —, não na performance espiritual de quem confessa.",
    },
    application: "Escolha um pecado que você tem escondido ou minimizado e leve-o abertamente a Deus em oração ainda hoje.",
    prayer: "Pai, eu confesso diante de ti aquilo que tenho escondido. Obrigado por seres fiel e justo para me perdoar. Amém.",
    weeklyChallenge: "Ore com sinceridade e, se a luta for persistente, procure apoio pastoral em vez de enfrentá-la sozinho.",
    reflectionQuestion: "Existe algo que tenho evitado confessar a Deus ou a alguém de confiança?",
  },
  {
    id: "casamento",
    title: "Casamento",
    verse: {
      ref: "Efésios 5:25",
      textByVersion: { NVI: "Maridos, amem suas esposas, assim como Cristo amou a igreja e entregou-se a si mesmo por ela." },
    },
    keywords: [
      { word: "ἀγαπᾶτε", translit: "agapâte", meaning: "amem — imperativo de agapáō, amor de doação voluntária e sacrificial, não sentimento passageiro", lang: "grego" },
      { word: "παρέδωκεν", translit: "parédōken", meaning: "entregou — o mesmo verbo usado para a entrega de Cristo à cruz; o padrão do amor conjugal é o sacrifício, não a conveniência", lang: "grego" },
      { word: "κεφαλή", translit: "kephalē", meaning: "cabeça — no mesmo capítulo, liderança entendida como serviço sacrificial, seguindo o exemplo de Cristo, nunca como domínio", lang: "grego" },
    ],
    intro: [
      "O casamento cristão é uma aliança, não um contrato de conveniência. Efésios 5 usa a relação entre Cristo e a igreja como padrão: um amor que se entrega, que serve, que busca o bem do outro antes do próprio conforto.",
      "Isso não é sentimentalismo: é um chamado exigente, que confronta o egoísmo natural de qualquer relação e aponta para a cruz como medida do amor conjugal.",
    ],
    deepDive: "Agapâte está no imperativo — não é sugestão, é ordem. E o padrão citado não é um casamento humano exemplar, mas a própria entrega de Cristo, expressa em parédōken, o verbo da cruz. O amor conjugal bíblico não é definido pelo sentimento, mas pela disposição de se entregar pelo bem do outro, dia após dia.",
    theologianQuote: { author: "C. S. Lewis", text: "O amor que não está disposto a se entregar ainda não aprendeu a amar como Cristo amou.", source: "frase atribuída" },
    quiz: {
      question: "Qual é o padrão que Efésios 5:25 estabelece para o amor no casamento?",
      options: ["A afinidade de personalidades", "O amor sacrificial de Cristo pela igreja", "O equilíbrio de interesses pessoais", "A ausência de conflitos"],
      correctIndex: 1,
      explanation: "Parédōken liga o amor conjugal diretamente à entrega de Cristo na cruz — um padrão de sacrifício, não de conveniência.",
    },
    application: "Conversem sobre uma forma concreta de servir um ao outro nesta semana, sem esperar retribuição imediata.",
    prayer: "Senhor, ensina-me a amar como Cristo amou — entregando-me, servindo, buscando o bem do outro antes do meu. Amém.",
    weeklyChallenge: "Identifique uma necessidade do seu cônjuge (ou, se solteiro, reflita sobre o padrão para o futuro) e atenda-a sem ser solicitado.",
    reflectionQuestion: "Meu modo de amar reflete entrega ou conveniência?",
  },
  {
    id: "namoro",
    title: "Namoro",
    verse: {
      ref: "1 Tessalonicenses 4:3-4",
      textByVersion: { NVI: "A vontade de Deus é que vocês sejam santificados: abstenham-se da prática da imoralidade sexual; cada um saiba controlar o próprio corpo de maneira santa e honrosa." },
    },
    keywords: [
      { word: "ἁγιασμὸς", translit: "hagiasmós", meaning: "santificação — separação para um propósito sagrado; o namoro é chamado a refletir esse mesmo padrão de pertencer a Deus", lang: "grego" },
      { word: "πορνείας", translit: "porneías", meaning: "imoralidade sexual — termo amplo, raiz da palavra 'pornografia', que cobre toda relação sexual fora do casamento", lang: "grego" },
      { word: "τιμῇ", translit: "timē", meaning: "honra — tratar o corpo do outro com dignidade e valor, nunca como objeto de satisfação pessoal", lang: "grego" },
    ],
    intro: [
      "O namoro cristão não é um tempo neutro antes do casamento; é um período de honrar a Deus, honrar o outro e construir uma base de confiança e clareza de propósito.",
      "Paulo é direto: a vontade de Deus para os solteiros é santificação — viver de forma diferente do padrão sexual do mundo ao redor, com domínio próprio e honra mútua.",
    ],
    deepDive: "Hagiasmós aparece duas vezes nesses versículos: é a vontade explícita de Deus, não um ideal distante. Porneías descreve qualquer prática sexual fora do desenho de Deus para o casamento. O texto não trata o corpo como algo a ser reprimido, mas como algo a ser tratado com timē — honra —, tanto o próprio corpo quanto o do namorado ou namorada.",
    theologianQuote: { author: "Charles Swindoll", text: "Pureza não é ausência de tentação; é a presença de um compromisso maior com Cristo.", source: "frase atribuída" },
    quiz: {
      question: "Segundo 1 Tessalonicenses 4:3-4, qual é a vontade explícita de Deus para os solteiros?",
      options: ["Que evitem qualquer relacionamento", "Que vivam em santificação, com domínio próprio e honra", "Que casem o mais rápido possível", "Que sigam apenas os próprios sentimentos"],
      correctIndex: 1,
      explanation: "Hagiasmós é chamado explicitamente de 'vontade de Deus' — santificação prática, expressa em domínio próprio e honra mútua.",
    },
    application: "Definam, como casal, limites claros que protejam a pureza e conversem sobre eles com uma liderança espiritual de confiança.",
    prayer: "Senhor, ajuda-nos a honrar um ao outro e a ti em nosso relacionamento. Dá-nos domínio próprio e clareza de propósito. Amém.",
    weeklyChallenge: "Marquem uma conversa com um casal maduro da igreja para pedir conselho sobre limites saudáveis no namoro.",
    reflectionQuestion: "Meu namoro tem honrado a Deus e a outra pessoa, ou tem cedido à pressão do momento?",
  },
  {
    id: "pornografia",
    title: "Pornografia",
    verse: {
      ref: "1 Coríntios 6:18-20",
      textByVersion: { NVI: "Fujam da imoralidade sexual... Vocês não sabem que o seu corpo é santuário do Espírito Santo?... vocês foram comprados por bom preço. Portanto, glorifiquem a Deus com o seu corpo." },
    },
    keywords: [
      { word: "φεύγετε", translit: "pheúgete", meaning: "fujam — imperativo presente; fuga ativa e contínua, não resistência estática ou negociação com a tentação", lang: "grego" },
      { word: "ἠγοράσθητε", translit: "ēgorásthēte", meaning: "foram comprados — termo do mercado de escravos, usado aqui para o resgate pago por Cristo na cruz", lang: "grego" },
      { word: "ναός", translit: "naós", meaning: "santuário, templo — não o pátio externo, mas o lugar mais sagrado; o corpo do crente recebe essa mesma dignidade", lang: "grego" },
    ],
    intro: [
      "A libertação da pornografia envolve arrependimento real, graça genuína, limites práticos, prestação de contas e cuidado responsável — nenhum desses elementos sozinho é suficiente.",
      "Paulo não pede apenas resistência mental: pede fuga ativa. E a razão é profunda — o corpo do cristão não é propriedade privada para consumo próprio, é santuário do Espírito Santo, comprado por um preço que Cristo pagou com a própria vida.",
    ],
    deepDive: "Pheúgete está no imperativo presente, indicando ação contínua: fugir sempre que a tentação se apresenta, não apenas uma vez. Ēgorásthēte lembra que a liberdade do crente custou caro — a cruz. O corpo como naós eleva a discussão para além da moralidade: é uma questão de que espaço Deus habita e como isso deve ser tratado com reverência.",
    theologianQuote: { author: "Tim Keller", text: "Todo pecado sexual é, no fundo, a tentativa de buscar em outro lugar aquilo que só Deus pode realmente dar.", source: "frase atribuída" },
    quiz: {
      question: "Por que Paulo chama o corpo do crente de 'santuário do Espírito Santo' em 1 Coríntios 6?",
      options: ["Porque o corpo não tem importância real", "Porque o corpo pertence a Deus, que o comprou e nele habita", "Porque apenas líderes espirituais têm essa dignidade", "Porque isso se aplica só depois da morte"],
      correctIndex: 1,
      explanation: "Ēgorásthēte (foram comprados) e naós (santuário) mostram que o corpo pertence a Deus e é lugar da presença do Espírito Santo.",
    },
    application: "Remova hoje mesmo um acesso fácil à tentação (aplicativo, filtro ausente, horário vulnerável) e converse com alguém maduro sobre o que está enfrentando.",
    prayer: "Senhor, meu corpo é teu santuário. Dá-me força para fugir da tentação e coragem para não lutar sozinho. Amém.",
    weeklyChallenge: "Marque uma conversa de prestação de contas semanal com alguém maduro e de confiança na sua igreja.",
    reflectionQuestion: "Tenho lutado sozinho com algo que precisava ser trazido à luz diante de outra pessoa?",
  },
  {
    id: "vicios",
    title: "Vícios (álcool/drogas)",
    verse: {
      ref: "1 Coríntios 6:12",
      textByVersion: { NVI: "‘Tudo me é permitido’, mas nem tudo convém. ‘Tudo me é permitido’, mas eu não me deixarei dominar por coisa alguma." },
    },
    keywords: [
      { word: "ἐξουσιασθήσομαι", translit: "exousiasthḗsomai", meaning: "serei dominado — de exousiázō, exercer controle sobre alguém; Paulo recusa-se a ser controlado por qualquer coisa além de Cristo", lang: "grego" },
      { word: "συμφέρει", translit: "sympherei", meaning: "convém, é proveitoso — nem tudo o que é tecnicamente permitido edifica ou constrói uma vida saudável", lang: "grego" },
      { word: "ἐλευθερία", translit: "eleuthería", meaning: "liberdade — a liberdade cristã não é licença para se tornar escravo de algo; é liberdade para servir a Deus", lang: "grego" },
    ],
    intro: [
      "Nada deve dominar o discípulo além de Cristo. Dependências químicas ou comportamentais frequentemente começam como escolhas aparentemente livres e terminam escravizando a própria liberdade que prometiam.",
      "As Escrituras não tratam vícios apenas como falha moral isolada; reconhecem que podem exigir cuidado espiritual, médico e psicológico integrado — nenhuma dessas frentes substitui as outras.",
    ],
    deepDive: "Paulo cita um slogan da igreja de Corinto ('tudo me é permitido') duas vezes, e em ambas acrescenta uma ressalva: sympherei (convém) e a recusa de ser dominado (exousiasthḗsomai). A liberdade cristã (eleuthería) não é ausência de limites; é a libertação para não ser mais escravo de nada além do próprio Senhor.",
    theologianQuote: { author: "Richard Foster", text: "A disciplina espiritual liberta, porque coloca Deus, e não o desejo, no centro da vida.", source: "frase atribuída" },
    quiz: {
      question: "Qual é o princípio central que Paulo estabelece em 1 Coríntios 6:12 sobre liberdade?",
      options: ["Tudo que é permitido deve ser feito sem limites", "A liberdade cristã não pode ser usada para se tornar escravo de algo", "Vícios são apenas um problema espiritual, sem outras causas", "A liberdade não tem nenhuma responsabilidade"],
      correctIndex: 1,
      explanation: "Paulo recusa deixar-se dominar (exousiasthḗsomai) por qualquer coisa — a liberdade cristã existe para servir a Deus, não para escravizar.",
    },
    application: "Converse hoje com alguém seguro sobre a luta que está enfrentando e busque apoio profissional (médico ou psicológico) quando necessário, além do cuidado espiritual.",
    prayer: "Senhor, liberta-me de tudo o que me domina além de ti. Dá-me coragem para buscar ajuda e não esconder minha luta. Amém.",
    weeklyChallenge: "Identifique um primeiro passo prático e concreto — conversar com um profissional, um pastor ou um grupo de apoio — e dê esse passo esta semana.",
    reflectionQuestion: "Há algo em minha vida que, mesmo permitido, já não convém porque me domina?",
  },
  {
    id: "dificuldade-financeira",
    title: "Dificuldade financeira",
    verse: {
      ref: "Mateus 6:33",
      textByVersion: { NVI: "Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas serão acrescentadas a vocês." },
    },
    keywords: [
      { word: "ζητεῖτε", translit: "zēteîte", meaning: "busquem — imperativo presente; busca contínua e prioritária, não um esforço pontual", lang: "grego" },
      { word: "προστεθήσεται", translit: "prostethḗsetai", meaning: "serão acrescentadas — passivo divino; é Deus quem age como agente que supre as necessidades reais", lang: "grego" },
      { word: "μεριμνᾶτε", translit: "merimnâte", meaning: "andem ansiosos — o mandamento que Jesus dá logo antes, no mesmo capítulo, contra a preocupação constante com o amanhã", lang: "grego" },
    ],
    intro: [
      "Deus chama seu povo à confiança, ao trabalho honesto, à mordomia responsável e à sabedoria para pedir ajuda quando necessário. Dificuldade financeira não é, por si só, sinal de falta de fé — nem prosperidade é sinal automático de bênção.",
      "Jesus ensina uma ordem de prioridades: buscar primeiro o Reino de Deus reorganiza a ansiedade financeira em confiança prática, sem promover passividade ou irresponsabilidade.",
    ],
    deepDive: "Zēteîte, no presente, descreve um hábito contínuo de buscar o Reino antes de qualquer outra coisa. Prostethḗsetai está na voz passiva — é Deus quem acrescenta, não o esforço humano isolado. O contexto imediato (merimnâte, 'andem ansiosos') mostra que Jesus está confrontando a ansiedade, não recomendando ociosidade: a confiança em Deus caminha junto com trabalho, planejamento e mordomia.",
    theologianQuote: { author: "John Wesley", text: "Ganhe tudo o que puder, poupe tudo o que puder, dê tudo o que puder.", source: "atribuída" },
    quiz: {
      question: "O que Jesus ensina em Mateus 6:33 sobre a relação entre buscar o Reino de Deus e as necessidades materiais?",
      options: ["Que as necessidades materiais não importam", "Que buscar primeiro o Reino reordena as prioridades, e Deus supre o necessário", "Que riqueza é sinal automático de fé", "Que pobreza é sempre falta de confiança em Deus"],
      correctIndex: 1,
      explanation: "Prostethḗsetai indica que Deus supre como resultado de buscarmos primeiro o Reino — não elimina o trabalho responsável, mas reordena a prioridade e a ansiedade.",
    },
    application: "Faça um orçamento simples desta semana e procure orientação prática com alguém experiente da sua igreja.",
    prayer: "Senhor, ensina-me a buscar primeiro o teu Reino e a confiar em ti com o que tenho. Dá-me sabedoria para administrar bem. Amém.",
    weeklyChallenge: "Liste três gastos que podem ser reavaliados esta semana e ore antes de tomar cada decisão financeira importante.",
    reflectionQuestion: "Minha relação com o dinheiro reflete confiança em Deus ou ansiedade constante?",
  },
  {
    id: "vida-devocional",
    title: "Vida devocional",
    verse: {
      ref: "Marcos 1:35",
      textByVersion: { NVI: "De madrugada, quando ainda estava escuro, Jesus se levantou, saiu e foi para um lugar deserto, onde ficou orando." },
    },
    keywords: [
      { word: "ἔρημον", translit: "érēmon", meaning: "deserto — lugar isolado, buscado deliberadamente por Jesus, longe da demanda constante das multidões", lang: "grego" },
      { word: "προσηύχετο", translit: "prosēúcheto", meaning: "orava — no imperfeito, indicando um hábito contínuo, não um evento isolado", lang: "grego" },
      { word: "πρωΐ", translit: "prōí", meaning: "de madrugada — prioridade de tempo; Jesus busca o Pai antes de qualquer outra demanda do dia", lang: "grego" },
    ],
    intro: [
      "Vida devocional é ritmo de escuta da Palavra, oração e obediência que sustenta a fé — não um item a mais na lista de tarefas espirituais, mas a fonte da qual tudo o mais se alimenta.",
      "Mesmo com a agenda mais cheia de qualquer pessoa que já existiu, Jesus se retirava para orar. Isso não era intervalo da missão; era a fonte dela.",
    ],
    deepDive: "Prōí e érēmon, juntos, mostram uma escolha deliberada: tempo e lugar reservados antes de qualquer outra demanda. Prosēúcheto, no imperfeito, sugere um padrão recorrente, não um momento excepcional. A agenda cheia não substitui a presença de Deus; ela torna essa presença ainda mais necessária.",
    theologianQuote: { author: "John Stott", text: "A oração não é um monólogo para convencer Deus, mas um encontro que nos transforma diariamente.", source: "frase atribuída" },
    quiz: {
      question: "O que o hábito de Jesus em Marcos 1:35 ensina sobre vida devocional?",
      options: ["Que oração é só para momentos de crise", "Que buscar a Deus deve ser prioridade, mesmo com agenda cheia", "Que só líderes precisam orar regularmente", "Que o local da oração não tem importância"],
      correctIndex: 1,
      explanation: "Prōí (de madrugada) e érēmon (lugar isolado) mostram uma escolha deliberada de tempo e espaço para orar antes de qualquer outra demanda do dia.",
    },
    application: "Separe dez minutos diários para ler um Evangelho e responder a Deus em oração, de preferência no mesmo horário todos os dias.",
    prayer: "Senhor, ensina-me a buscar-te antes de qualquer outra coisa. Que minha vida devocional seja fonte, e não obrigação. Amém.",
    weeklyChallenge: "Escolha um horário fixo nesta semana e proteja-o especificamente para leitura bíblica e oração, sem interrupções.",
    reflectionQuestion: "O que minha rotina revela sobre de quem eu realmente espero direção e força?",
  },
  {
    id: "perdao",
    title: "Perdão",
    verse: {
      ref: "Efésios 4:32",
      textByVersion: { NVI: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo." },
    },
    keywords: [
      { word: "χαριζόμενοι", translit: "charizómenoi", meaning: "perdoando — de charízomai, ligado a cháris (graça); perdão como ato generoso, não obrigação relutante", lang: "grego" },
      { word: "εὔσπλαγχνοι", translit: "eúsplanchnoi", meaning: "bondosos, compassivos — literalmente 'de boas entranhas'; compaixão visceral, sentida, não apenas uma decisão fria", lang: "grego" },
      { word: "ἀφῆκεν", translit: "aphêken", meaning: "perdoou — de aphíēmi, soltar, deixar ir uma dívida por completo, sem cobrá-la de volta", lang: "grego" },
    ],
    intro: [
      "Perdoar é entregar a vingança a Deus e recusar que a ofensa continue governando o coração. Isso não significa fingir que a dor não existiu, nem reatar automaticamente relações que exigem cuidado e limites.",
      "O padrão do perdão cristão é o próprio Deus: assim como ele perdoou em Cristo — completamente, sem cobrar de volta — somos chamados a perdoar uns aos outros.",
    ],
    deepDive: "Charizómenoi está ligado à mesma raiz de cháris (graça): perdoar é um ato de graça generosa, não um cálculo de merecimento. Eúsplanchnoi descreve compaixão sentida no íntimo, não apenas encenada. O verbo aphêken, usado para o perdão de Deus, descreve uma dívida completamente solta — nada fica pendente para ser cobrado depois.",
    theologianQuote: { author: "C. S. Lewis", text: "Perdoar não significa dizer que a ofensa não teve importância; significa entregar a Deus o direito de vingança.", source: "frase atribuída" },
    quiz: {
      question: "Qual é o padrão de perdão que Efésios 4:32 estabelece para os cristãos?",
      options: ["Perdoar apenas quando a pessoa se desculpa", "Perdoar como Deus perdoou em Cristo — de forma completa e generosa", "Evitar qualquer contato com quem ofendeu", "Perdoar só depois de muito tempo"],
      correctIndex: 1,
      explanation: "Aphêken descreve o perdão de Deus como uma dívida totalmente solta; esse é o padrão — não a lentidão nem a condição — apontado para os cristãos.",
    },
    application: "Nomeie diante de Deus a dor de uma ofensa específica e escolha, hoje, começar a soltar o direito de cobrá-la de volta.",
    prayer: "Pai, tu me perdoaste completamente em Cristo. Ajuda-me a perdoar como fui perdoado, sem guardar rancor. Amém.",
    weeklyChallenge: "Em situações graves ou que envolvam abuso, converse com seu pastor antes de decidir sobre reaproximação — perdão não exige exposição a novo dano.",
    reflectionQuestion: "Existe alguém que ainda cobro, mesmo em silêncio, por uma ofensa do passado?",
  },
  {
    id: "empatia",
    title: "Empatia",
    verse: {
      ref: "Romanos 12:15",
      textByVersion: { NVI: "Alegrem-se com os que se alegram; chorem com os que choram." },
    },
    keywords: [
      { word: "χαίρειν", translit: "chaírein", meaning: "alegrar-se — infinitivo; entrar de fato na alegria do outro, sem inveja nem distância", lang: "grego" },
      { word: "κλαίειν", translit: "klaíein", meaning: "chorar — infinitivo emparelhado com o anterior; presença emocional genuína na dor alheia, sem pressa de resolver", lang: "grego" },
      { word: "φιλόστοργοι", translit: "philóstorgoi", meaning: "com afeto fraternal — do mesmo bloco de exortações, em Romanos 12:10; afeição de família, natural e calorosa", lang: "grego" },
    ],
    intro: [
      "A empatia cristã se aproxima da alegria e da dor do próximo sem minimizar, sem comparar e sem corrigir apressadamente. Antes de oferecer solução, oferece presença.",
      "Romanos 12 emparelha dois mandamentos que exigem coisas opostas do coração — alegrar-se e chorar — mostrando que o discípulo maduro sabe entrar genuinamente em ambos os movimentos do outro.",
    ],
    deepDive: "Os dois infinitivos, chaírein e klaíein, aparecem lado a lado, sem hierarquia entre eles: alegrar-se com quem se alegra exige humildade (ausência de inveja); chorar com quem chora exige disponibilidade (presença sem pressa de resolver). Philóstorgoi, poucos versículos antes, mostra que esse tipo de empatia nasce de um afeto fraternal genuíno dentro da igreja, não de obrigação social.",
    theologianQuote: { author: "Francis Schaeffer", text: "O amor cristão começa quando aprendemos a chorar com quem chora antes de tentar consertar tudo.", source: "frase atribuída" },
    quiz: {
      question: "O que Romanos 12:15 pede da comunidade cristã em relação às emoções uns dos outros?",
      options: ["Que mantenham distância emocional por prudência", "Que entrem genuinamente tanto na alegria quanto na dor do próximo", "Que corrijam rapidamente quem está sofrendo", "Que só se alegrem com as próprias conquistas"],
      correctIndex: 1,
      explanation: "Os dois infinitivos emparelhados, chaírein e klaíein, pedem envolvimento emocional genuíno nos dois movimentos — alegria e dor —, sem hierarquia entre eles.",
    },
    application: "Pergunte a alguém como ele está e escute sem interromper, sem comparar com sua própria experiência e sem tentar resolver de imediato.",
    prayer: "Senhor, dá-me um coração que se alegra sem inveja e que chora sem pressa de consertar tudo. Ensina-me a presença genuína. Amém.",
    weeklyChallenge: "Visite ou ligue para alguém que está passando por um momento difícil apenas para ouvir, sem levar uma solução pronta.",
    reflectionQuestion: "Tenho entrado de verdade na alegria e na dor das pessoas ao meu redor, ou mantenho distância segura?",
  },
  {
    id: "servico",
    title: "Serviço (Mordomia)",
    verse: {
      ref: "1 Pedro 4:10",
      textByVersion: { NVI: "Cada um exerça o dom que recebeu para servir os outros, administrando fielmente a graça de Deus em suas múltiplas formas." },
    },
    keywords: [
      { word: "χάρισμα", translit: "chárisma", meaning: "dom da graça — dado gratuitamente por Deus, não conquistado por mérito próprio", lang: "grego" },
      { word: "οἰκονόμοι", translit: "oikonómoi", meaning: "administradores — raiz da palavra 'economia'; gestores fiéis de algo que pertence a outro, não donos", lang: "grego" },
      { word: "ποικίλης", translit: "poikílēs", meaning: "multiforme, variada — a graça de Deus se expressa em muitas formas diferentes de dons, não em um único padrão", lang: "grego" },
    ],
    intro: [
      "Tempo, dons, recursos e oportunidades florescem quando são oferecidos para o bem da igreja e do próximo — não quando são acumulados ou usados apenas para benefício próprio.",
      "O texto de Pedro coloca cada crente na posição de administrador (oikonómoi), não de dono: os dons recebidos pertencem, em última instância, a Deus, e devem ser geridos com fidelidade para servir a outros.",
    ],
    deepDive: "Chárisma lembra que todo dom tem origem na graça — ninguém o merece por si mesmo. Oikonómoi descreve alguém encarregado de administrar bens de outra pessoa: o crente não é proprietário de seus dons, mas gestor fiel. Poikílēs mostra a diversidade intencional da graça de Deus: nenhum crente precisa ter todos os dons, e nenhuma igreja funciona bem com um único tipo de serviço.",
    theologianQuote: { author: "Charles Spurgeon", text: "Um coração cheio de graça está sempre transbordando em gratidão e serviço.", source: "frase atribuída" },
    quiz: {
      question: "Segundo 1 Pedro 4:10, qual é a postura correta do crente diante dos dons que recebeu?",
      options: ["Guardá-los para uso próprio exclusivo", "Administrá-los fielmente para servir aos outros, como quem gerencia algo de outro", "Buscar ter todos os dons possíveis", "Ignorá-los até que sejam formalmente reconhecidos pela igreja"],
      correctIndex: 1,
      explanation: "Oikonómoi (administradores) mostra que os dons pertencem a Deus; o crente é chamado a geri-los com fidelidade para o bem de outros.",
    },
    application: "Escolha uma necessidade concreta da sua comunidade e sirva de forma prática nesta semana, usando um dom específico que você reconhece ter recebido.",
    prayer: "Senhor, obrigado pelos dons que me confiaste. Ajuda-me a administrá-los com fidelidade, para servir e não para acumular. Amém.",
    weeklyChallenge: "Converse com um líder da sua igreja sobre uma área de serviço em que você poderia se envolver de forma mais constante.",
    reflectionQuestion: "Tenho tratado meus dons como posse pessoal ou como algo confiado a mim para servir outros?",
  },
  {
    id: "preparo-para-liderar",
    title: "Preparo para liderar",
    verse: {
      ref: "2 Timóteo 2:15",
      textByVersion: { NVI: "Procure apresentar-se a Deus aprovado, como obreiro que não tem do que se envergonhar e que maneja com precisão a palavra da verdade." },
    },
    keywords: [
      { word: "ὀρθοτομοῦντα", translit: "orthotomoûnta", meaning: "que maneja com precisão, que corta reto — imagem de um artesão que traça um caminho reto ao lidar com a Palavra", lang: "grego" },
      { word: "ἐργάτην", translit: "ergátēn", meaning: "obreiro, trabalhador — alguém que se esforça ativamente no preparo, não um espectador passivo", lang: "grego" },
      { word: "δόκιμον", translit: "dókimon", meaning: "aprovado — testado e considerado genuíno, como um metal examinado antes de ser certificado como puro", lang: "grego" },
    ],
    intro: [
      "Preparar-se para liderar inclui caráter, conhecimento bíblico, oração, serviço e disposição para ser corrigido. Não existe atalho: a aprovação diante de Deus (dókimon) exige um processo real, não apenas boas intenções.",
      "Paulo escreve a Timóteo, um líder jovem, apontando o caminho: esforço ativo (ergátēn) e precisão no manejo da Palavra (orthotomoûnta) — habilidades que se desenvolvem, não que surgem prontas.",
    ],
    deepDive: "Orthotomoûnta evoca a imagem de um artesão traçando uma linha reta — seja um agricultor abrindo um sulco correto, seja um sacerdote repartindo corretamente o alimento. Ergátēn afasta qualquer ideia de liderança passiva: exige trabalho real. Dókimon é o mesmo termo usado para metais examinados e aprovados como genuínos — a liderança madura passa por esse tipo de teste ao longo do tempo.",
    theologianQuote: { author: "John Wesley", text: "Dai-me cem homens que nada temam senão o pecado e nada desejem senão a Deus, e abalarei o mundo.", source: "atribuída" },
    quiz: {
      question: "O que a expressão orthotomoûnta ('maneja com precisão') comunica sobre o preparo para liderar?",
      options: ["Que a Palavra pode ser interpretada livremente por qualquer sentimento pessoal", "Que lidar bem com as Escrituras exige cuidado, esforço e precisão", "Que apenas teólogos formados podem liderar", "Que o preparo bíblico não é necessário para servir"],
      correctIndex: 1,
      explanation: "A imagem de 'cortar reto' aponta para cuidado e precisão no manejo da Palavra — fruto de esforço real (ergátēn), não de improviso.",
    },
    application: "Peça a um líder da sua igreja uma área específica da Palavra para estudar e uma oportunidade simples e concreta para servir.",
    prayer: "Senhor, forma em mim um obreiro aprovado. Dá-me disciplina para estudar tua Palavra e humildade para ser corrigido. Amém.",
    weeklyChallenge: "Escolha um livro da Bíblia para estudar com mais profundidade nas próximas semanas, com apoio de um comentário confiável ou de um líder mais experiente.",
    reflectionQuestion: "Tenho me preparado de verdade para liderar, ou apenas esperado ser reconhecido como líder?",
  },
  {
    id: "batismo",
    title: "Batismo",
    verse: {
      ref: "Romanos 6:3-4",
      textByVersion: { NVI: "Todos nós, que fomos batizados em Cristo Jesus, fomos batizados em sua morte... a fim de que, assim como Cristo foi ressuscitado dentre os mortos mediante a glória do Pai, também nós vivamos uma vida nova." },
    },
    keywords: [
      { word: "ἐβαπτίσθημεν", translit: "ebaptísthēmen", meaning: "fomos batizados — de baptízō, imergir completamente; o batismo simboliza identificação total com a morte e a nova vida de Cristo", lang: "grego" },
      { word: "καινότητι ζωῆς", translit: "kainótēti zōês", meaning: "novidade de vida — vida genuinamente nova, e não apenas uma versão reformada da vida antiga", lang: "grego" },
      { word: "σύμφυτοι", translit: "sýmphytoi", meaning: "unidos, plantados juntos — imagem, no versículo seguinte, de um enxerto que passa a compartilhar a mesma vida da planta", lang: "grego" },
    ],
    intro: [
      "O batismo é o testemunho público de união com a morte e a ressurreição de Cristo. Jesus Cristo, Deus encarnado, é quem torna esse batismo possível: não um exemplo humano a mais, mas o próprio Senhor que morreu, ressuscitou e une o crente a si mesmo.",
      "Não é o rito em si que salva; é aquilo que ele proclama publicamente — uma salvação já operada por Cristo, recebida pela fé, e agora declarada diante da igreja.",
    ],
    deepDive: "Ebaptísthēmen descreve uma imersão completa, imagem física de uma realidade espiritual: o crente é identificado com a morte de Cristo e, pela mesma união, com sua ressurreição. Kainótēti zōês não é apenas 'vida melhorada'; é vida genuinamente nova. Sýmphytoi, logo a seguir no capítulo, mostra que essa união não é simbólica apenas — é uma participação real na vida do próprio Cristo.",
    theologianQuote: { author: "John Stott", text: "O batismo não salva; ele proclama publicamente a salvação que Cristo já operou.", source: "frase atribuída" },
    quiz: {
      question: "O que o batismo simboliza, segundo Romanos 6:3-4?",
      options: ["Um rito que, por si só, concede a salvação", "A identificação do crente com a morte e a ressurreição de Cristo", "Uma tradição cultural sem significado espiritual", "Um compromisso que substitui a fé pessoal"],
      correctIndex: 1,
      explanation: "Ebaptísthēmen liga o batismo diretamente à morte e ressurreição de Cristo — o rito proclama publicamente uma união espiritual já real pela fé.",
    },
    application: "Se você ainda não foi batizado após conhecer a Cristo, converse com seu pastor sobre os próximos passos para dar esse testemunho público.",
    prayer: "Senhor Jesus, tu que és Deus e te entregaste por mim, obrigado por me unir à tua morte e ressurreição. Que minha vida reflita essa novidade. Amém.",
    weeklyChallenge: "Converse com alguém que ainda não foi batizado sobre o significado bíblico do batismo e ofereça-se para caminhar com essa pessoa até a igreja local.",
    reflectionQuestion: "Minha vida, no dia a dia, tem refletido a 'novidade de vida' que o batismo proclama?",
  },
];
