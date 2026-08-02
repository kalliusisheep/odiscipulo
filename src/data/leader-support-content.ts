// Conteúdo de apoio ao discipulado — Modo Líder.
// 13 módulos temáticos, cada um com 10 trilhas (lições). Cada trilha segue a
// mesma estrutura das lições da Home (versículo com original grego/hebraico,
// palavras-chave, aprofundamento, reflexão pastoral, aplicação) e soma dois
// exercícios de fixação: o quiz de sempre e um exercício de "relacionar"
// (termo original ↔ significado), montado a partir das próprias keywords de
// cada trilha — não precisa de dado duplicado nem de tabela nova no Supabase.
//
// Tudo aqui é conteúdo estático (sem escrita no banco). O progresso de leitura
// destas trilhas, se quiser persistir no futuro, pode reaproveitar a mesma
// tabela de progresso das lições normais, guardando o `id` da trilha.

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

export type SupportModule = {
  id: string;
  title: string;
  lessons: SupportLesson[];
};

export const SUPPORT_MODULES: SupportModule[] = [
  {
    id: "orgulho",
    title: "Orgulho",
    lessons: [
      {
        id: "orgulho-1",
        title: "Olhar Sincero",
        verse: {
          ref: "Salmos 139:23-24",
          textByVersion: { NVI: "Sonda-me, ó Deus, e conhece o meu coração; prova-me, e conhece os meus pensamentos. Vê se em mim há algum caminho mau, e guia-me pelo caminho eterno." },
          originals: [
            { word: "חָקְרֵנִי", translit: "choqrení", meaning: "'sonda-me, examina-me' — pedido para que Deus investigue o que a própria pessoa não consegue ver em si mesma", lang: "hebraico" },
          ],
        },
        keywords: [
          { word: "חָקְרֵנִי", translit: "choqrení", meaning: "sonda-me — convite para que Deus examine o coração além do que os olhos alcançam", lang: "hebraico" },
          { word: "דֶּרֶךְ־עֹצֶב", translit: "dérech-ótsev", meaning: "caminho de dor/mau caminho — expressão para um padrão de vida que fere a si e a outros", lang: "hebraico" },
        ],
        intro: [
          "Antes de tratar do orgulho nos outros, o discipulado começa com um olhar sincero sobre si mesmo. Davi não pede que Deus mude alguém — pede para ser examinado.",
          "Esse é o primeiro passo de qualquer trilha sobre orgulho: parar de olhar para fora e permitir que Deus mostre o que está escondido dentro.",
        ],
        deepDive: "O salmo termina em oração, não em autoanálise. Choqrení é um pedido de vulnerabilidade: Davi sabe que o coração humano se engana facilmente sobre si mesmo (Jeremias 17:9), por isso entrega a tarefa a Deus. Um discípulo que nunca faz essa oração tende a enxergar o orgulho apenas no outro.",
        theologianQuote: { author: "Reflexão pastoral", text: "Quem nunca pediu a Deus para ser examinado provavelmente já decidiu, sozinho, que está bem." },
        quiz: {
          question: "O que Davi pede a Deus em Salmos 139:23-24?",
          options: ["Que Deus mude as pessoas ao seu redor", "Que Deus o examine e mostre onde há mau caminho nele", "Que Deus o livre de todo sofrimento", "Que Deus julgue seus inimigos"],
          correctIndex: 1,
          explanation: "Davi direciona o pedido de exame a si mesmo — um ponto de partida honesto para tratar do orgulho.",
        },
        application: "Reserve dez minutos esta semana para orar essa oração de Davi, com um caderno em mãos, e anote o que vier à mente sem se justificar.",
        prayer: "Senhor, sonda-me. Mostra-me o que tenho evitado ver em mim mesmo. Amém.",
        weeklyChallenge: "Pergunte a alguém de confiança: 'Você já viu orgulho aparecer em mim? Como?' — e apenas ouça, sem se defender.",
        reflectionQuestion: "Da última vez que fui corrigido, minha primeira reação foi ouvir ou me justificar?",
      },
      {
        id: "orgulho-2",
        title: "Coração e Trono",
        verse: {
          ref: "Isaías 14:13-14",
          textByVersion: { NVI: "Você, que dizia no coração: 'Subirei aos céus; erguerei o meu trono acima das estrelas de Deus... Serei como o Altíssimo.'" },
        },
        keywords: [
          { word: "אֶעֱלֶה", translit: "e'ele", meaning: "'subirei' — verbo repetido cinco vezes no oráculo, mostrando a escalada da autoexaltação", lang: "hebraico" },
          { word: "כִּסְאִי", translit: "kis'í", meaning: "meu trono — a raiz do orgulho descrita como o desejo de ocupar o lugar que só pertence a Deus", lang: "hebraico" },
        ],
        intro: [
          "Esse oráculo contra o rei da Babilônia expõe a raiz mais profunda do orgulho: o desejo de colocar o próprio trono no lugar de Deus.",
          "Todo orgulho, em menor ou maior escala, repete esse mesmo movimento — tirar Deus do centro e colocar a si mesmo.",
        ],
        deepDive: "O texto usa linguagem de trono e altura para mostrar que o orgulho não é apenas um defeito de personalidade, é uma disputa espiritual pelo lugar de Deus. Cada 'subirei' aprofunda o afastamento. É um retrato solene de para onde o orgulho não confrontado sempre caminha.",
        theologianQuote: { author: "Reflexão pastoral", text: "O orgulho raramente começa grande — começa pequeno, um degrau de cada vez, até ocupar um trono que nunca foi seu." },
        quiz: {
          question: "Qual é a imagem central usada em Isaías 14 para descrever o orgulho?",
          options: ["Um rio que transborda", "A tentativa de ocupar o trono de Deus", "Uma sombra que passa", "Um vento que sopra"],
          correctIndex: 1,
          explanation: "O texto repete 'subirei' até a tentativa de ocupar o lugar do Altíssimo — o retrato mais nu do orgulho nas Escrituras.",
        },
        application: "Identifique uma área da sua vida (trabalho, casa, ministério) onde você tem agido como se estivesse no comando absoluto, sem prestar contas a ninguém.",
        prayer: "Senhor, tira-me do trono que não é meu. Tu és Deus, e eu não sou. Amém.",
        weeklyChallenge: "Escreva em um papel uma decisão recente que você tomou sozinho e pergunte: 'Eu busquei a Deus ou apenas segui minha vontade?'",
        reflectionQuestion: "Em que área da minha vida ainda insisto em ocupar um lugar que só pertence a Deus?",
      },
      {
        id: "orgulho-3",
        title: "Deus Resiste",
        verse: {
          ref: "Tiago 4:6",
          textByVersion: { NVI: "Deus se opõe aos orgulhosos, mas concede graça aos humildes." },
          originals: [
            { word: "ἀντιτάσσεται", translit: "antitássetai", meaning: "'opõe-se, resiste como um adversário' — Deus não apenas desaprova o orgulho, ele o enfrenta ativamente", lang: "grego" },
          ],
        },
        keywords: [
          { word: "ἀντιτάσσεται", translit: "antitássetai", meaning: "opõe-se — Deus enfrenta ativamente o orgulho, não apenas o desaprova", lang: "grego" },
          { word: "ταπεινοῖς", translit: "tapeinoîs", meaning: "aos humildes — os que reconhecem sua dependência de Deus, sem fingimento", lang: "grego" },
        ],
        intro: [
          "Orgulho não é apenas vaidade visível; é, na raiz, a recusa de depender de Deus. O orgulhoso se coloca no centro do próprio mérito e da própria capacidade.",
          "O discipulado começa, e continua, no reconhecimento de que somos criaturas dependentes de um Deus que se opõe ao orgulho, mas corre ao encontro de quem se humilha.",
        ],
        deepDive: "Tiago cita Provérbios 3:34 para mostrar um padrão constante de Deus através das Escrituras. Antitássetai é um verbo forte: Deus não fica neutro diante do orgulho, ele se posiciona contra ele. Ao mesmo tempo, a graça está disponível, generosa, para quem se reconhece pequeno.",
        theologianQuote: { author: "Reflexão pastoral", text: "O oposto do orgulho não é apenas humildade; é esquecer-se de si mesmo diante da grandeza de Deus." },
        quiz: {
          question: "Segundo Tiago 4:6, qual é a atitude de Deus diante do orgulho e da humildade?",
          options: ["Ele trata as duas atitudes da mesma forma", "Ele se opõe ao orgulhoso e concede graça ao humilde", "Ele recompensa quem confia nas próprias forças", "Ele ignora o orgulho quando a pessoa é bem-sucedida"],
          correctIndex: 1,
          explanation: "O verbo antitássetai mostra que Deus resiste ativamente ao orgulhoso, enquanto reserva graça abundante para quem se humilha.",
        },
        application: "Em uma conversa desta semana, escolha ouvir mais do que falar, e receba uma correção sem se justificar imediatamente.",
        prayer: "Senhor, mostra-me onde tenho confiado em mim mesmo em vez de confiar em ti. Amém.",
        weeklyChallenge: "Peça a alguém de confiança que aponte, com sinceridade, uma área em que seu orgulho costuma aparecer.",
        reflectionQuestion: "Em qual conversa desta semana posso ouvir antes de responder?",
      },
      {
        id: "orgulho-4",
        title: "Verdadeira Grandeza",
        verse: {
          ref: "Marcos 9:35",
          textByVersion: { NVI: "Se alguém quiser ser o primeiro, deverá ser o último de todos e servo de todos." },
        },
        keywords: [
          { word: "διάκονος", translit: "diákonos", meaning: "servo — palavra de onde vem 'diácono'; alguém que serve ativamente, não passivamente", lang: "grego" },
        ],
        intro: [
          "Os discípulos discutiam quem era o maior. Jesus responde invertendo completamente a escala de valor do mundo: grandeza é medida por serviço, não por posição.",
          "Onde o orgulho busca subir, Jesus ensina a descer — e é exatamente aí que se encontra a verdadeira grandeza no Reino.",
        ],
        deepDive: "A discussão dos discípulos era sobre hierarquia; a resposta de Jesus é sobre vocação. Diákonos não é um título de prestígio — é uma função de entrega ao outro. Jesus não elimina o desejo de grandeza, ele o redireciona: sirva a todos, e aí você encontrará o lugar que buscava.",
        theologianQuote: { author: "Reflexão pastoral", text: "Quem precisa ser visto como o maior ainda não entendeu o que Jesus quis dizer com grandeza." },
        quiz: {
          question: "Como Jesus define a verdadeira grandeza em Marcos 9:35?",
          options: ["Pela quantidade de seguidores", "Por ser servo de todos", "Pelo reconhecimento público", "Pela posição de autoridade"],
          correctIndex: 1,
          explanation: "Jesus inverte a lógica humana de status: o maior é aquele que se torna servo de todos.",
        },
        application: "Faça esta semana uma tarefa de serviço que ninguém vai notar ou agradecer publicamente.",
        prayer: "Jesus, ensina-me a servir sem precisar ser visto. Amém.",
        weeklyChallenge: "Observe quantas vezes, em uma única semana, você busca reconhecimento por algo que fez — e ore sobre isso.",
        reflectionQuestion: "Eu sirvo mesmo quando ninguém está olhando?",
      },
      {
        id: "orgulho-5",
        title: "Máscaras Sutis",
        verse: {
          ref: "Lucas 18:11-12",
          textByVersion: { NVI: "O fariseu, em pé, orava a si mesmo: 'Deus, eu te agradeço porque não sou como os demais homens.'" },
        },
        keywords: [
          { word: "πρὸς ἑαυτὸν", translit: "pros heautón", meaning: "'para si mesmo' — a oração do fariseu, ainda que dirigida a Deus, tinha a si mesmo como verdadeiro centro", lang: "grego" },
        ],
        intro: [
          "O orgulho religioso é o mais difícil de identificar porque se disfarça de gratidão e de linguagem espiritual. O fariseu até agradece a Deus — mas o assunto da oração é ele mesmo.",
          "Essa trilha convida a examinar as formas sutis de orgulho que se escondem atrás de aparência de piedade, serviço ou conhecimento bíblico.",
        ],
        deepDive: "Pros heautón revela o problema: a oração é tecnicamente dirigida a Deus, mas seu verdadeiro eixo é a comparação com os outros. O orgulho religioso troca a dependência de Deus pela comparação com pessoas que parecem 'piores'. É uma máscara sutil porque usa vocabulário certo com o coração errado.",
        theologianQuote: { author: "Reflexão pastoral", text: "É possível agradecer a Deus em voz alta e, ainda assim, estar apenas se admirando." },
        quiz: {
          question: "Qual é o problema central na oração do fariseu em Lucas 18?",
          options: ["Ele não orou o suficiente", "Sua oração era, na prática, sobre si mesmo", "Ele orou em público", "Ele usou palavras difíceis"],
          correctIndex: 1,
          explanation: "Pros heautón mostra que, apesar da linguagem religiosa, o centro da oração era o próprio fariseu, não Deus.",
        },
        application: "Revise suas últimas orações de gratidão: elas comparam você com outras pessoas ou apontam de fato para Deus?",
        prayer: "Senhor, examina até minha gratidão. Que ela aponte para ti, não para mim. Amém.",
        weeklyChallenge: "Ore hoje sem usar nenhuma comparação com outra pessoa — só você e Deus.",
        reflectionQuestion: "Minha linguagem espiritual já escondeu, alguma vez, um orgulho disfarçado?",
      },
      {
        id: "orgulho-6",
        title: "Ouvir Correção",
        verse: {
          ref: "Provérbios 12:1",
          textByVersion: { NVI: "Quem ama a disciplina ama o conhecimento, mas quem odeia a repreensão é tolo." },
        },
        keywords: [
          { word: "תּוֹכַחַת", translit: "tochachát", meaning: "repreensão/correção — termo usado em Provérbios para a advertência que reconduz ao caminho certo", lang: "hebraico" },
        ],
        intro: [
          "A reação a uma correção revela muito sobre o coração. O orgulho sente a correção como ataque; a humildade a recebe como presente.",
          "Provérbios liga diretamente o amor pelo conhecimento à disposição de ser corrigido — não são coisas separadas.",
        ],
        deepDive: "Tochachát não é humilhação, é reconduzir alguém ao caminho certo. O provérbio é direto: quem rejeita a correção não está apenas sendo orgulhoso, está escolhendo permanecer tolo. Amar o conhecimento sem amar a correção é uma contradição, porque toda correção honesta traz conhecimento sobre si mesmo.",
        theologianQuote: { author: "Reflexão pastoral", text: "A pessoa que nunca mais ouve correção não amadureceu — apenas ficou sem quem se arrisque a corrigi-la." },
        quiz: {
          question: "Segundo Provérbios 12:1, o que caracteriza quem odeia a repreensão?",
          options: ["Sabedoria", "Tolice", "Humildade", "Maturidade"],
          correctIndex: 1,
          explanation: "O texto liga diretamente a rejeição da correção à tolice, em contraste com o amor ao conhecimento.",
        },
        application: "Na próxima vez que alguém te corrigir, responda apenas 'obrigado, vou pensar sobre isso' antes de se justificar.",
        prayer: "Senhor, dá-me um coração que ame a correção mais do que o próprio conforto. Amém.",
        weeklyChallenge: "Pergunte a um irmão ou irmã na fé: 'Existe algo que você gostaria de me dizer, mas nunca disse?'",
        reflectionQuestion: "Quando foi a última vez que agradeci sinceramente por uma correção?",
      },
      {
        id: "orgulho-7",
        title: "Zelo Disfarçado",
        verse: {
          ref: "Gálatas 6:3",
          textByVersion: { NVI: "Se alguém pensa ser alguma coisa, sem nada ser, engana-se a si mesmo." },
        },
        keywords: [
          { word: "φρεναπατᾷ", translit: "frenapatâ", meaning: "'engana a si mesmo' — literalmente 'ilude a própria mente'; o orgulho começa como autoengano", lang: "grego" },
        ],
        intro: [
          "Muitas vezes o que parece zelo — por doutrina, por ministério, por justiça — é, no fundo, orgulho disfarçado de causa nobre.",
          "Esse texto de Gálatas confronta diretamente essa ilusão: pensar-se importante sem fundamento é enganar a si mesmo, não aos outros.",
        ],
        deepDive: "Frenapatâ descreve um engano interno, não uma mentira contada a terceiros. O orgulho zeloso é perigoso porque se apresenta como defesa da verdade, quando na verdade defende a própria imagem. Paulo escreve isso logo após falar de restaurar quem erra 'com espírito de mansidão' — o contexto expõe como o zelo sem humildade se volta facilmente contra o próprio irmão.",
        theologianQuote: { author: "Reflexão pastoral", text: "Nem todo zelo que parece defender a verdade está, de fato, livre de vaidade." },
        quiz: {
          question: "O que Gálatas 6:3 ensina sobre quem se acha 'alguma coisa' sem fundamento?",
          options: ["Que essa pessoa é sábia", "Que essa pessoa engana a si mesma", "Que essa pessoa deve ser corrigida publicamente", "Que essa pessoa está certa"],
          correctIndex: 1,
          explanation: "Frenapatâ mostra que o problema é interno: a pessoa se ilude sobre sua própria importância.",
        },
        application: "Examine uma discussão recente em que você 'defendeu a verdade': havia mais desejo de estar certo do que de restaurar o outro?",
        prayer: "Senhor, purifica meu zelo. Que ele sirva à verdade, não à minha vaidade. Amém.",
        weeklyChallenge: "Da próxima vez que discordar de alguém, pergunte a si mesmo antes de falar: 'Quero corrigir ou quero vencer?'",
        reflectionQuestion: "Meu zelo por estar certo já feriu alguém que eu deveria ter restaurado com mansidão?",
      },
      {
        id: "orgulho-8",
        title: "Cura em Comunidade",
        verse: {
          ref: "Tiago 5:16",
          textByVersion: { NVI: "Confessem os seus pecados uns aos outros e orem uns pelos outros, para que sejam curados." },
        },
        keywords: [
          { word: "ἰαθῆτε", translit: "iathête", meaning: "'sejam curados' — a cura aqui é relacional e espiritual, ligada diretamente à confissão mútua", lang: "grego" },
        ],
        intro: [
          "O orgulho isola. Ele convence a pessoa de que não precisa de ninguém e de que suas falhas devem permanecer escondidas.",
          "Tiago propõe o caminho oposto: confissão mútua em comunidade como parte do processo de cura, não como humilhação.",
        ],
        deepDive: "Iathête liga a cura à confissão compartilhada — não é apenas perdão individual diante de Deus, é também restauração relacional na igreja. O orgulho resiste a esse texto porque exige vulnerabilidade real diante de outra pessoa. Mas é justamente aí, na comunidade, que Tiago diz que a cura acontece.",
        theologianQuote: { author: "Reflexão pastoral", text: "O orgulho quer resolver tudo sozinho; a cura que Deus oferece, muitas vezes, passa por outra pessoa." },
        quiz: {
          question: "Segundo Tiago 5:16, o que está ligado à cura espiritual?",
          options: ["O isolamento e a autossuficiência", "A confissão mútua e a oração em comunidade", "A perfeição moral antes de confessar", "A ausência total de falhas"],
          correctIndex: 1,
          explanation: "O texto conecta diretamente a confissão compartilhada e a oração mútua ao processo de cura.",
        },
        application: "Escolha uma pessoa de confiança e compartilhe, ainda esta semana, uma luta que você tem escondido por orgulho.",
        prayer: "Senhor, tira de mim a vergonha que me isola. Ensina-me a buscar irmãos, não esconderijos. Amém.",
        weeklyChallenge: "Pergunte a alguém do seu grupo: 'Como posso orar por você essa semana?' — e depois compartilhe também um pedido seu.",
        reflectionQuestion: "O que tenho escondido por orgulho, achando que resolveria sozinho?",
      },
      {
        id: "orgulho-9",
        title: "Recomeçar sem Punição",
        verse: {
          ref: "Romanos 8:1",
          textByVersion: { NVI: "Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus." },
        },
        keywords: [
          { word: "κατάκριμα", translit: "katákrima", meaning: "condenação — sentença judicial; Paulo declara que essa sentença não recai mais sobre quem está em Cristo", lang: "grego" },
        ],
        intro: [
          "Um efeito perverso do orgulho ferido é a autopunição: quando a pessoa é confrontada, ao invés de se humilhar diante de Deus, ela se afunda em vergonha e autocondenação.",
          "Romanos 8 corta esse ciclo pela raiz: em Cristo, não há mais katákrima — nenhuma sentença de condenação pendente.",
        ],
        deepDive: "Katákrima é termo jurídico: uma sentença formal de culpa. Paulo declara essa sentença cancelada para quem está em Cristo. Isso muda completamente como lidamos com o próprio orgulho descoberto: não é hora de se punir, é hora de recomeçar em graça, porque a punição já foi levada por Cristo na cruz.",
        theologianQuote: { author: "Reflexão pastoral", text: "Reconhecer o orgulho não deveria terminar em autopunição, mas em gratidão por já não haver condenação." },
        quiz: {
          question: "O que Romanos 8:1 declara sobre quem está em Cristo?",
          options: ["Que ainda precisa pagar pela própria culpa", "Que não há mais condenação para essa pessoa", "Que deve se punir até se sentir melhor", "Que a culpa nunca é totalmente resolvida"],
          correctIndex: 1,
          explanation: "Katákrima descreve uma sentença legal, e Paulo afirma que ela foi removida para quem está em Cristo.",
        },
        application: "Da próxima vez que se sentir mal por um deslize de orgulho, troque a autopunição por uma oração de gratidão pela graça de Cristo.",
        prayer: "Senhor, obrigado por não haver condenação em ti. Ajuda-me a recomeçar sem me punir. Amém.",
        weeklyChallenge: "Escreva uma área em que você tem se autopunido em vez de receber o perdão de Deus, e ore especificamente sobre ela.",
        reflectionQuestion: "Eu trato meus próprios erros com a mesma graça que Cristo já me deu?",
      },
      {
        id: "orgulho-10",
        title: "Caminho Constante",
        verse: {
          ref: "Miqueias 6:8",
          textByVersion: { NVI: "Ele mostrou a você, ó homem, o que é bom... andar humildemente com o seu Deus." },
        },
        keywords: [
          { word: "הַצְנֵעַ לֶכֶת", translit: "hatsnéa léchet", meaning: "'andar humildemente' — expressão hebraica para uma caminhada discreta e constante, sem exibição", lang: "hebraico" },
        ],
        intro: [
          "Vencer o orgulho não é um evento único, é um andar contínuo. Miqueias resume o que Deus pede em três verbos: agir com justiça, amar a misericórdia e andar humildemente.",
          "Esta última trilha do módulo é um convite a transformar tudo o que foi aprendido em hábito diário, não apenas em insight passageiro.",
        ],
        deepDive: "Hatsnéa léchet descreve movimento constante, não uma pose momentânea. A humildade bíblica não é um sentimento ocasional de baixa autoestima; é um ritmo de vida, um caminhar diário com Deus que se sustenta ao longo dos anos, inclusive quando ninguém está observando.",
        theologianQuote: { author: "Reflexão pastoral", text: "Humildade não é o que você sente num dia bom — é o caminho que você segue nos dias comuns." },
        quiz: {
          question: "Que tipo de humildade Miqueias 6:8 descreve?",
          options: ["Um sentimento passageiro de tristeza", "Um caminhar constante e discreto com Deus", "Uma performance pública de modéstia", "Uma emoção sentida apenas em crises"],
          correctIndex: 1,
          explanation: "Hatsnéa léchet fala de um andar contínuo, não de um momento isolado de humildade.",
        },
        application: "Escolha um hábito simples e diário (uma oração breve pela manhã, por exemplo) que te lembre de caminhar humildemente com Deus.",
        prayer: "Senhor, que eu não busque momentos de humildade, mas um caminhar humilde contigo todos os dias. Amém.",
        weeklyChallenge: "Ao final de cada dia desta semana, anote uma frase sobre como foi seu 'andar' com Deus naquele dia.",
        reflectionQuestion: "Minha humildade é um hábito constante ou aparece só em momentos específicos?",
      },
    ],
  },
  {
    id: "pecado",
    title: "Pecado",
    lessons: [
      {
        id: "pecado-1",
        title: "O que nos Separa",
        verse: {
          ref: "Isaías 59:2",
          textByVersion: { NVI: "As iniquidades de vocês fizeram separação entre vocês e o seu Deus; os pecados de vocês esconderam o rosto dele, de modo que ele não os ouve." },
        },
        keywords: [
          { word: "מַבְדִּלִים", translit: "mavdilím", meaning: "'que separam' — o pecado descrito como algo que cria uma barreira real entre a pessoa e Deus", lang: "hebraico" },
        ],
        intro: [
          "Antes de falar de perdão, é preciso entender o problema: o pecado não é apenas um erro moral, é o que rompe a comunhão entre a pessoa e Deus.",
          "Isaías descreve essa ruptura sem suavizar: o rosto de Deus fica escondido, a oração parece não ser ouvida. É o ponto de partida honesto para qualquer conversa sobre pecado.",
        ],
        deepDive: "Mavdilím vem da mesma raiz usada em Gênesis 1 para 'separar' a luz das trevas — uma divisão real, não simbólica. O texto não culpa Deus pelo silêncio; ele nomeia a causa: as próprias escolhas do povo. Reconhecer essa separação é o primeiro passo para buscar o caminho de volta.",
        theologianQuote: { author: "Reflexão pastoral", text: "Não dá para tratar do pecado como um deslize sem consequência — a Bíblia é clara: ele separa." },
        quiz: {
          question: "Segundo Isaías 59:2, o que o pecado faz na relação entre a pessoa e Deus?",
          options: ["Não altera nada na relação", "Cria separação e esconde o rosto de Deus", "Apenas atrasa as bênçãos", "Só afeta os outros, não a própria pessoa"],
          correctIndex: 1,
          explanation: "O texto descreve o pecado como algo que efetivamente separa e interrompe a comunhão com Deus.",
        },
        application: "Nomeie, em oração, uma área específica onde você sente essa 'separação' — sem minimizar nem exagerar.",
        prayer: "Senhor, mostra-me onde tenho permitido que o pecado abra distância entre nós. Amém.",
        weeklyChallenge: "Converse com seu discípulo sobre a diferença entre 'errar' e 'pecado que separa' — sem julgamento, com sinceridade.",
        reflectionQuestion: "Existe alguma área da minha vida onde sinto que Deus está distante por causa de uma escolha minha?",
      },
      {
        id: "pecado-2",
        title: "Por que Escondemos",
        verse: {
          ref: "Gênesis 3:9-10",
          textByVersion: { NVI: "O Senhor Deus chamou o homem: 'Onde você está?' Ele respondeu: 'Ouvi te andando no jardim e, por estar nu, tive medo e me escondi.'" },
        },
        keywords: [
          { word: "וַיִּתְחַבֵּא", translit: "vayitchabé", meaning: "'e se escondeu' — reação imediata ao pecado: cobrir-se e fugir da presença de Deus", lang: "hebraico" },
        ],
        intro: [
          "A primeira reação humana ao pecado, desde o Éden, é esconder-se. Adão não corre para Deus com o problema — corre para longe dele.",
          "Esse padrão se repete até hoje: medo e vergonha levam a esconder, e não a buscar ajuda.",
        ],
        deepDive: "A pergunta de Deus, 'onde você está?', não é geográfica — é um convite ao diálogo que Adão evita. Vayitchabé mostra o instinto humano de se cobrir diante da culpa. O texto revela que o problema do pecado sempre vem acompanhado de um segundo problema: o impulso de escondê-lo, o que só aumenta a distância.",
        theologianQuote: { author: "Reflexão pastoral", text: "Deus não precisa perguntar 'onde você está' porque não sabe — ele pergunta para que você mesmo perceba onde se escondeu." },
        quiz: {
          question: "Qual foi a reação imediata de Adão após o pecado, segundo Gênesis 3?",
          options: ["Ele correu para conversar com Deus", "Ele se escondeu", "Ele confessou imediatamente", "Ele ignorou o que aconteceu"],
          correctIndex: 1,
          explanation: "Vayitchabé descreve o impulso de se esconder — a primeira reação humana registrada diante do pecado.",
        },
        application: "Identifique algo que você tem 'escondido' de Deus ou da igreja por medo, e dê o primeiro passo para trazer à luz esta semana.",
        prayer: "Senhor, tira-me do esconderijo. Ajuda-me a responder 'aqui estou' em vez de fugir. Amém.",
        weeklyChallenge: "Pergunte a alguém que você discipula: 'Existe algo que você tem escondido por medo de julgamento?' — e escute sem reagir com choque.",
        reflectionQuestion: "O que eu escondo de Deus, achando que ele não vai perguntar?",
      },
      {
        id: "pecado-3",
        title: "Da Queda à Cruz",
        verse: {
          ref: "Romanos 5:8",
          textByVersion: { NVI: "Mas Deus demonstra seu amor por nós: Cristo morreu em nosso favor quando ainda éramos pecadores." },
        },
        keywords: [
          { word: "συνίστησιν", translit: "synístesin", meaning: "'demonstra, comprova' — o amor de Deus provado por um ato concreto, não por sentimento", lang: "grego" },
        ],
        intro: [
          "Da queda no Éden até a cruz, a Bíblia conta uma única história: a humanidade se afasta, e Deus vem ao encontro.",
          "Romanos 5:8 é o resumo dessa história inteira: Cristo morreu não por pessoas já boas, mas por pecadores — enquanto ainda éramos pecadores.",
        ],
        deepDive: "Synístesin não descreve um sentimento — descreve uma prova, algo demonstrado com evidência concreta. A cruz é essa prova. O texto elimina qualquer ideia de que era preciso 'merecer' o amor de Deus antes de recebê-lo: a iniciativa foi dele, no momento exato em que menos merecíamos.",
        theologianQuote: { author: "Reflexão pastoral", text: "A cruz não é a resposta ao nosso esforço — é a resposta de Deus à nossa incapacidade de nos salvar." },
        quiz: {
          question: "Segundo Romanos 5:8, quando Cristo morreu por nós?",
          options: ["Depois que nos tornamos justos", "Enquanto ainda éramos pecadores", "Somente para pessoas religiosas", "Após um longo processo de merecimento"],
          correctIndex: 1,
          explanation: "O texto é enfático: Cristo morreu por nós exatamente quando ainda éramos pecadores, sem mérito prévio.",
        },
        application: "Compartilhe essa semana, com alguém que se sente 'longe demais' de Deus, que a cruz foi exatamente para pessoas nessa condição.",
        prayer: "Senhor, obrigado por não teres esperado eu melhorar para me amar. Amém.",
        weeklyChallenge: "Escreva, em uma frase, a diferença entre 'merecer o amor de Deus' e 'receber o amor de Deus' — e leia em voz alta para si mesmo.",
        reflectionQuestion: "Eu ainda tento 'merecer' algo que já me foi dado de graça na cruz?",
      },
      {
        id: "pecado-4",
        title: "Resposta na Cruz",
        verse: {
          ref: "2 Coríntios 5:21",
          textByVersion: { NVI: "Deus tornou pecado por nós aquele que não tinha pecado, para que nele nos tornássemos justiça de Deus." },
        },
        keywords: [
          { word: "ἁμαρτίαν", translit: "hamartían", meaning: "pecado — Cristo, sem nenhum pecado próprio, é tratado como pecado em nosso lugar na cruz", lang: "grego" },
        ],
        intro: [
          "A cruz não é apenas um gesto de amor — é a resposta concreta de Deus ao problema do pecado. Uma troca acontece: nosso pecado sobre Cristo, a justiça dele sobre nós.",
          "Essa troca é o centro da resposta cristã ao pecado: não minimizá-lo, nem se afundar nele, mas olhar para a cruz onde ele já foi tratado.",
        ],
        deepDive: "Hamartían aplicada a Cristo é chocante: aquele que não tinha pecado algum foi 'feito pecado'. Paulo descreve uma troca judicial real — a culpa vai para Cristo, a justiça de Deus vem para nós. Isso significa que tratar do pecado, no discipulado, sempre aponta de volta para essa troca já realizada, não para um esforço de autocorreção.",
        theologianQuote: { author: "Reflexão pastoral", text: "Na cruz aconteceu a maior troca da história: nosso pecado por sua justiça." },
        quiz: {
          question: "O que aconteceu na cruz, segundo 2 Coríntios 5:21?",
          options: ["Cristo apenas exemplificou uma vida sem pecado", "Houve uma troca: nosso pecado sobre Cristo, a justiça de Deus sobre nós", "Deus ignorou o pecado da humanidade", "A cruz foi só um símbolo, sem efeito real"],
          correctIndex: 1,
          explanation: "O texto descreve uma troca judicial real: Cristo foi feito pecado por nós para que nos tornássemos justiça de Deus.",
        },
        application: "Quando lembrar de um pecado específico esta semana, direcione o pensamento imediatamente para a cruz, não para a autocondenação.",
        prayer: "Senhor, obrigado pela troca que fizeste na cruz. Que eu viva à luz dessa justiça que recebi. Amém.",
        weeklyChallenge: "Escreva um pecado que ainda pesa sobre você e, ao lado, escreva 'já levado na cruz' — guarde esse papel como lembrete.",
        reflectionQuestion: "Eu realmente vivo como alguém que recebeu a justiça de Cristo, ou ainda carrego o peso que já foi resolvido?",
      },
      {
        id: "pecado-5",
        title: "Confissão Sincera",
        verse: {
          ref: "1 João 1:9",
          textByVersion: { NVI: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça." },
        },
        keywords: [
          { word: "ὁμολογῶμεν", translit: "homologômen", meaning: "confessarmos — literalmente 'dizer o mesmo'; concordar com Deus sobre o pecado, em vez de justificá-lo", lang: "grego" },
          { word: "καθαρίσῃ", translit: "katharísē", meaning: "purificar — ação completa de limpeza, não apenas perdão pontual", lang: "grego" },
        ],
        intro: [
          "Confessar não é se punir; é concordar com Deus sobre a gravidade do pecado e receber, com humildade, o perdão que ele já providenciou em Cristo.",
          "A tentação diante do pecado é sempre a mesma: esconder, minimizar ou justificar. Este texto oferece outro caminho.",
        ],
        deepDive: "Homologômen carrega a ideia de estar de acordo com Deus, não apenas informá-lo de algo que ele já sabe. A base do perdão não está na intensidade do arrependimento, mas na fidelidade (pistós) e na justiça de Deus, que já tratou o pecado na cruz de Cristo.",
        theologianQuote: { author: "Reflexão pastoral", text: "O primeiro passo para a santidade não é a autoperfeição, mas a confissão honesta diante de Deus." },
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
        id: "pecado-6",
        title: "Convicção x Culpa",
        verse: {
          ref: "João 16:8",
          textByVersion: { NVI: "Quando ele vier, convencerá o mundo do pecado, da justiça e do juízo." },
        },
        keywords: [
          { word: "ἐλέγξει", translit: "elénxei", meaning: "'convencerá' — termo jurídico para expor a verdade com o objetivo de restaurar, não apenas condenar", lang: "grego" },
        ],
        intro: [
          "Existe uma diferença essencial entre a convicção que o Espírito Santo traz e a culpa destrutiva que só acusa sem oferecer saída.",
          "A convicção do Espírito sempre aponta para Cristo e para um caminho de restauração; a culpa sem esperança só paralisa e isola.",
        ],
        deepDive: "Elénxei é um verbo jurídico, usado para expor algo à luz com o objetivo de correção. O Espírito Santo convence do pecado, mas o mesmo versículo o liga à justiça e ao juízo já resolvidos em Cristo. Diferente da culpa vaga que apenas condena, a convicção genuína sempre vem acompanhada de um caminho para frente.",
        theologianQuote: { author: "Reflexão pastoral", text: "A convicção do Espírito aponta para a cruz; a culpa que só acusa aponta para lugar nenhum." },
        quiz: {
          question: "Qual é a característica da 'convicção' trazida pelo Espírito Santo, segundo João 16:8?",
          options: ["Ela apenas acusa, sem solução", "Ela está ligada à justiça e ao juízo já resolvidos em Cristo", "Ela é igual à culpa que paralisa", "Ela só ocorre em momentos de crise"],
          correctIndex: 1,
          explanation: "Elénxei liga a convicção diretamente à justiça — um processo que aponta para restauração, não apenas acusação.",
        },
        application: "Da próxima vez que sentir culpa por um pecado, pergunte: 'Isso está me levando à cruz ou apenas me paralisando?'",
        prayer: "Espírito Santo, convence-me do pecado, mas conduz-me sempre de volta à cruz. Amém.",
        weeklyChallenge: "Ajude alguém que você discipula a distinguir, em uma conversa real, entre convicção saudável e culpa que só condena.",
        reflectionQuestion: "A culpa que sinto hoje me aproxima de Deus ou só me afasta em vergonha?",
      },
      {
        id: "pecado-7",
        title: "Padrões Repetidos",
        verse: {
          ref: "Romanos 7:19",
          textByVersion: { NVI: "Pois o bem que quero não faço; ao contrário, o mal que não quero, esse eu pratico." },
        },
        keywords: [
          { word: "πράσσω", translit: "prásso", meaning: "'pratico, faço repetidamente' — verbo que descreve uma ação continuada, não um deslize isolado", lang: "grego" },
        ],
        intro: [
          "Padrões de pecado que se repetem geram um desânimo particular: a sensação de estar preso em ciclo, mesmo desejando mudar.",
          "Paulo descreve exatamente essa luta, sem esconder a frustração — e é justamente aí que o discipulado precisa entrar com honestidade e acompanhamento, não apenas força de vontade.",
        ],
        deepDive: "Prásso indica uma prática contínua, não um único tropeço. Paulo, um apóstolo, admite abertamente essa luta interna — o texto normaliza que até crentes maduros enfrentam padrões repetidos. A solução que Paulo aponta, no capítulo seguinte, não é mais esforço, mas a vida no Espírito.",
        theologianQuote: { author: "Reflexão pastoral", text: "Reconhecer um padrão repetido de pecado não é fracasso espiritual — é o primeiro passo honesto para buscar ajuda real." },
        quiz: {
          question: "O que Romanos 7:19 revela sobre a luta contra padrões de pecado?",
          options: ["Que só cristãos imaturos enfrentam isso", "Que até Paulo lutava com um padrão que se repetia", "Que a solução é apenas mais força de vontade", "Que esse tipo de luta não tem solução"],
          correctIndex: 1,
          explanation: "Paulo descreve abertamente sua própria luta com um padrão repetido, mostrando que essa é uma experiência real mesmo para líderes maduros.",
        },
        application: "Nomeie, com um irmão de confiança, um padrão específico de pecado que se repete na sua vida — sem minimizar nem exagerar.",
        prayer: "Senhor, onde luto sozinho há anos, ensina-me a buscar ajuda e a viver no teu Espírito. Amém.",
        weeklyChallenge: "Procure alguém que possa te acompanhar de perto (accountability) em uma área específica de padrão repetido.",
        reflectionQuestion: "Existe um padrão de pecado que enfrento sozinho há muito tempo e nunca pedi ajuda?",
      },
      {
        id: "pecado-8",
        title: "Confissão Mútua",
        verse: {
          ref: "Provérbios 28:13",
          textByVersion: { NVI: "Quem esconde as suas transgressões jamais prosperará, mas quem as confessa e as abandona, obterá misericórdia." },
        },
        keywords: [
          { word: "מְכַסֶּה", translit: "mechassé", meaning: "'esconde, cobre' — atitude que impede a prosperidade espiritual, em contraste com confessar e abandonar", lang: "hebraico" },
        ],
        intro: [
          "Existe uma diferença entre confessar a Deus em segredo e confessar diante de outra pessoa que pode ajudar a caminhar para a mudança real.",
          "Este provérbio liga diretamente esconder o pecado a uma falta de prosperidade espiritual — e liga confessar e abandonar à misericórdia.",
        ],
        deepDive: "Mechassé descreve um esforço ativo de cobrir, esconder. O provérbio não fala apenas de confessar, mas de confessar e abandonar — dois movimentos, não um só. A confissão mútua na comunidade cristã existe justamente para apoiar esse segundo passo, o abandono, que sozinho é muito mais difícil.",
        theologianQuote: { author: "Reflexão pastoral", text: "Confessar sem buscar apoio para abandonar o pecado costuma virar apenas um alívio momentâneo, não uma mudança real." },
        quiz: {
          question: "Segundo Provérbios 28:13, o que acontece com quem esconde suas transgressões?",
          options: ["Prospera mais rápido", "Jamais prosperará", "Recebe misericórdia automaticamente", "Não sofre consequências"],
          correctIndex: 1,
          explanation: "O texto contrasta diretamente esconder (sem prosperidade) com confessar e abandonar (com misericórdia).",
        },
        application: "Escolha uma pessoa madura na fé e confesse a ela algo que você tem escondido, pedindo apoio prático para abandonar esse padrão.",
        prayer: "Senhor, dá-me coragem para confessar não só a ti, mas a quem pode me ajudar a caminhar para a mudança. Amém.",
        weeklyChallenge: "Combine um horário fixo semanal com alguém de confiança só para prestar contas sobre uma área específica de luta.",
        reflectionQuestion: "Tenho confessado meu pecado só a Deus, evitando o apoio de outra pessoa que poderia me ajudar a mudar?",
      },
      {
        id: "pecado-9",
        title: "Quando Tropeçamos",
        verse: {
          ref: "Gálatas 6:1",
          textByVersion: { NVI: "Se alguém for surpreendido em algum pecado, vocês que são espirituais deverão restaurá-lo com mansidão." },
        },
        keywords: [
          { word: "καταρτίζετε", translit: "katartízete", meaning: "'restaurar' — usado também para 'consertar redes de pesca'; recolocar algo quebrado em seu devido lugar", lang: "grego" },
        ],
        intro: [
          "Tropeços vão acontecer — a questão não é se, mas como a comunidade responde quando alguém cai em pecado.",
          "Paulo não descreve punição nem exposição pública, mas restauração feita com mansidão, por quem está espiritualmente maduro para isso.",
        ],
        deepDive: "Katartízete é o mesmo verbo usado para consertar redes de pesca rasgadas — a ideia é recolocar algo quebrado em seu devido lugar, com cuidado, não com violência. Paulo alerta em seguida: 'cuidando de você mesmo, para que também não seja tentado' — restaurar exige humildade de quem restaura, não superioridade.",
        theologianQuote: { author: "Reflexão pastoral", text: "Restaurar alguém que tropeçou pede mansidão — a mesma que você vai precisar quando for sua vez de tropeçar." },
        quiz: {
          question: "Como Gálatas 6:1 orienta a resposta a alguém 'surpreendido em algum pecado'?",
          options: ["Com exposição pública imediata", "Com restauração feita com mansidão", "Ignorando a situação", "Com afastamento definitivo"],
          correctIndex: 1,
          explanation: "O texto orienta restauração (katartízete) feita com mansidão, não punição ou exposição.",
        },
        application: "Se você souber de alguém que tropeçou recentemente, procure-o esta semana com o único objetivo de restaurar, não de julgar.",
        prayer: "Senhor, ensina-me a restaurar com a mesma mansidão que gostaria de receber. Amém.",
        weeklyChallenge: "Antes de comentar sobre o tropeço de alguém, pergunte-se: 'Estou cuidando de mim mesmo para não cair na mesma tentação?'",
        reflectionQuestion: "Quando alguém tropeça perto de mim, minha primeira reação é restaurar ou julgar?",
      },
      {
        id: "pecado-10",
        title: "Andar na Luz",
        verse: {
          ref: "1 João 1:7",
          textByVersion: { NVI: "Se andarmos na luz, como ele está na luz, temos comunhão uns com os outros, e o sangue de Jesus, seu Filho, nos purifica de todo pecado." },
        },
        keywords: [
          { word: "κοινωνίαν", translit: "koinonían", meaning: "comunhão — vida compartilhada, não apenas ausência de conflito; consequência natural de andar na luz", lang: "grego" },
        ],
        intro: [
          "Este módulo termina onde deveria terminar toda conversa sobre pecado: não na vergonha, mas em uma vida vivida abertamente diante de Deus e da comunidade.",
          "Andar na luz não significa nunca pecar — significa não esconder o que acontece, mantendo comunhão real com Deus e com os outros.",
        ],
        deepDive: "Koinonían descreve vida compartilhada, não apenas boas maneiras entre pessoas. O texto liga diretamente 'andar na luz' à purificação contínua pelo sangue de Cristo — não é um estado de perfeição, é um estilo de vida transparente, onde o pecado não fica escondido nem entre irmãos.",
        theologianQuote: { author: "Reflexão pastoral", text: "Andar na luz não é nunca tropeçar — é nunca esconder o tropeço de quem pode caminhar ao seu lado." },
        quiz: {
          question: "O que caracteriza 'andar na luz', segundo 1 João 1:7?",
          options: ["Nunca pecar", "Viver em comunhão aberta, sem esconder o pecado", "Evitar todo contato com a igreja", "Depender apenas do próprio esforço"],
          correctIndex: 1,
          explanation: "Koinonían mostra que andar na luz resulta em comunhão real, não em perfeição — é viver sem esconder.",
        },
        application: "Escolha, a partir de hoje, ser mais transparente com pelo menos uma pessoa sobre uma luta real, em vez de manter aparências.",
        prayer: "Senhor, que eu viva na luz, em comunhão real contigo e com meus irmãos, sem máscaras. Amém.",
        weeklyChallenge: "Reflita sobre sua vida em comunidade: existe algo que você mantém escondido só para preservar uma boa imagem?",
        reflectionQuestion: "Minha vida diante da igreja é a mesma que vivo em segredo, ou existem duas versões de mim?",
      },
    ],
  },
  {
    id: "casamento",
    title: "Casamento",
    lessons: [
      {
        id: "casamento-1",
        title: "Desenho Original",
        verse: {
          ref: "Gênesis 2:24",
          textByVersion: { NVI: "Por essa razão, o homem deixará pai e mãe e se unirá à sua mulher, tornando-se os dois uma só carne." },
        },
        keywords: [
          { word: "וְדָבַק", translit: "vedavák", meaning: "'e se apegará/unirá' — verbo de vínculo forte e duradouro, base do desenho original do casamento", lang: "hebraico" },
        ],
        intro: [
          "Antes de falar sobre desafios do casamento, é preciso voltar ao desenho original: uma união que deixa, se apega e se torna uma só carne.",
          "Esse padrão estabelecido em Gênesis é a base sobre a qual todo o ensino bíblico sobre casamento se apoia.",
        ],
        deepDive: "Vedavák descreve um vínculo de lealdade forte — a mesma raiz usada para descrever a fidelidade de Rute a Noemi. O casamento bíblico começa com um 'deixar' claro (independência de outras lealdades) e termina em um 'tornar-se uma só carne' — uma união completa, não apenas contratual.",
        theologianQuote: { author: "Reflexão pastoral", text: "Antes de tratar de qualquer crise conjugal, vale a pena lembrar o desenho original: união, não apenas convivência." },
        quiz: {
          question: "O que Gênesis 2:24 descreve como o padrão do casamento?",
          options: ["Uma convivência conveniente", "Deixar, unir-se e tornar-se uma só carne", "Um contrato temporário", "Uma parceria apenas econômica"],
          correctIndex: 1,
          explanation: "O texto descreve um movimento de três passos: deixar, apegar-se e tornar-se uma só carne — uma união completa.",
        },
        application: "Converse com seu cônjuge (ou, se for líder acompanhando um casal, pergunte a eles) sobre o que significa 'deixar' outras prioridades para priorizar o casamento.",
        prayer: "Senhor, obrigado pelo desenho do casamento. Ajuda-nos a vivê-lo como tu planejaste. Amém.",
        weeklyChallenge: "Identifique uma prioridade (trabalho, família de origem, hobby) que tem competido com o tempo dedicado ao casamento.",
        reflectionQuestion: "Meu casamento reflete união real ou apenas convivência no mesmo espaço?",
      },
      {
        id: "casamento-2",
        title: "Onde Falhamos",
        verse: {
          ref: "Malaquias 2:14",
          textByVersion: { NVI: "O Senhor foi testemunha entre você e a mulher da sua mocidade, contra quem você foi infiel, embora ela seja sua companheira, a mulher da sua aliança." },
        },
        keywords: [
          { word: "בָּגַדְתָּה", translit: "bagádeta", meaning: "'você foi infiel/traiu' — verbo usado para quebra de aliança, não apenas desentendimento comum", lang: "hebraico" },
        ],
        intro: [
          "É importante nomear com honestidade onde casamentos falham: a Bíblia não esconde que a infidelidade à aliança é uma realidade séria, tratada com gravidade por Deus.",
          "Reconhecer onde falhamos — em pequenas ou grandes traições de confiança — é passo necessário antes de qualquer caminho de restauração.",
        ],
        deepDive: "Bagádeta é um verbo forte, usado para quebra de aliança. Deus se apresenta como testemunha da aliança conjugal — o casamento não é apenas um acordo entre duas pessoas, é feito diante dele. Isso confere seriedade tanto à aliança quanto à sua quebra, mas também abre espaço para arrependimento genuíno diante do mesmo Deus que testemunhou a promessa.",
        theologianQuote: { author: "Reflexão pastoral", text: "Nomear onde falhamos no casamento não é destruir a relação — é o primeiro passo honesto para reconstruí-la." },
        quiz: {
          question: "Como Malaquias 2:14 descreve o casamento?",
          options: ["Um acordo informal sem testemunhas", "Uma aliança testemunhada por Deus", "Uma tradição cultural sem peso espiritual", "Uma escolha que pode ser desfeita sem consequência"],
          correctIndex: 1,
          explanation: "O texto apresenta Deus como testemunha da aliança conjugal, dando peso espiritual real à união e à sua quebra.",
        },
        application: "Se houver uma falha não resolvida no seu casamento, dê o primeiro passo esta semana para nomeá-la com sinceridade diante do cônjuge.",
        prayer: "Senhor, tu és testemunha da minha aliança. Mostra-me onde preciso pedir perdão. Amém.",
        weeklyChallenge: "Pergunte ao seu cônjuge: 'Existe algo em que você sente que falhei com você e nunca conversamos sobre isso?'",
        reflectionQuestion: "Há alguma falha na minha aliança conjugal que ainda não nomeei com honestidade?",
      },
      {
        id: "casamento-3",
        title: "Modelo de Efésios",
        verse: {
          ref: "Efésios 5:25",
          textByVersion: { NVI: "Maridos, amem suas esposas, assim como Cristo amou a igreja e entregou-se a si mesmo por ela." },
        },
        keywords: [
          { word: "ἀγαπᾶτε", translit: "agapâte", meaning: "amem — imperativo de agapáō, amor de doação voluntária e sacrificial, não sentimento passageiro", lang: "grego" },
          { word: "παρέδωκεν", translit: "parédōken", meaning: "entregou — o mesmo verbo usado para a entrega de Cristo à cruz", lang: "grego" },
        ],
        intro: [
          "O casamento cristão é uma aliança, não um contrato de conveniência. Efésios 5 usa a relação entre Cristo e a igreja como padrão de amor conjugal.",
          "É um chamado exigente, que confronta o egoísmo natural de qualquer relação e aponta para a cruz como medida do amor.",
        ],
        deepDive: "Agapâte está no imperativo — não é sugestão, é ordem. O padrão citado não é um casamento humano exemplar, mas a própria entrega de Cristo, expressa em parédōken, o verbo da cruz. O amor conjugal bíblico não é definido pelo sentimento, mas pela disposição de se entregar pelo bem do outro, dia após dia.",
        theologianQuote: { author: "Reflexão pastoral", text: "O amor que não está disposto a se entregar ainda não aprendeu a amar como Cristo amou." },
        quiz: {
          question: "Qual é o padrão que Efésios 5:25 estabelece para o amor no casamento?",
          options: ["A afinidade de personalidades", "O amor sacrificial de Cristo pela igreja", "O equilíbrio de interesses pessoais", "A ausência de conflitos"],
          correctIndex: 1,
          explanation: "Parédōken liga o amor conjugal diretamente à entrega de Cristo na cruz — um padrão de sacrifício, não de conveniência.",
        },
        application: "Conversem sobre uma forma concreta de servir um ao outro nesta semana, sem esperar retribuição imediata.",
        prayer: "Senhor, ensina-me a amar como Cristo amou — entregando-me, servindo, buscando o bem do outro antes do meu. Amém.",
        weeklyChallenge: "Identifique uma necessidade do seu cônjuge e atenda-a sem ser solicitado.",
        reflectionQuestion: "Meu modo de amar reflete entrega ou conveniência?",
      },
      {
        id: "casamento-4",
        title: "Amor como Aliança",
        verse: {
          ref: "Provérbios 2:17",
          textByVersion: { NVI: "Que abandona o companheiro de sua mocidade e esquece a aliança que fez perante o seu Deus." },
        },
        keywords: [
          { word: "בְּרִית", translit: "berít", meaning: "aliança — compromisso solene e duradouro, distinto de um contrato que pode ser cancelado por conveniência", lang: "hebraico" },
        ],
        intro: [
          "Amor no casamento bíblico não é apenas emoção — é aliança. Emoções variam; a aliança é o compromisso que sustenta o relacionamento quando o sentimento momentâneo falha.",
          "Entender o casamento como berít, e não apenas como contrato, muda completamente como se enfrentam as dificuldades da vida a dois.",
        ],
        deepDive: "Berít é a mesma palavra usada para as alianças de Deus com seu povo — um compromisso solene, não uma parceria de conveniência. O provérbio adverte sobre esquecer essa aliança, tratando o casamento como algo descartável. Lembrar-se da aliança feita 'perante Deus' recoloca o compromisso em uma dimensão espiritual, não apenas emocional.",
        theologianQuote: { author: "Reflexão pastoral", text: "Sentimentos oscilam ao longo dos anos; a aliança foi feita para sustentar o casamento justamente quando o sentimento vacila." },
        quiz: {
          question: "O que Provérbios 2:17 chama de 'aliança'?",
          options: ["Um acordo informal e revogável", "O compromisso do casamento feito perante Deus", "Apenas um documento legal", "Uma tradição cultural sem peso"],
          correctIndex: 1,
          explanation: "Berít descreve um compromisso solene, ligado diretamente ao caráter de Deus, não uma conveniência revogável.",
        },
        application: "Relembre, com seu cônjuge, os votos ou compromissos feitos no início do casamento, e reafirmem juntos essa aliança.",
        prayer: "Senhor, ajuda-nos a honrar a aliança que fizemos diante de ti, mesmo quando o sentimento vacila. Amém.",
        weeklyChallenge: "Escreva uma carta breve ao seu cônjuge reafirmando o compromisso da aliança, independente de como se sentiu essa semana.",
        reflectionQuestion: "Meu casamento hoje é sustentado por aliança ou apenas por sentimento momentâneo?",
      },
      {
        id: "casamento-5",
        title: "Servir, não Dominar",
        verse: {
          ref: "Efésios 5:21",
          textByVersion: { NVI: "Sujeitem-se uns aos outros, por reverência a Cristo." },
        },
        keywords: [
          { word: "ὑποτασσόμενοι", translit: "hypotassómenoi", meaning: "'sujeitando-se' — participio que introduz o ensino sobre casamento; submissão mútua, não unilateral", lang: "grego" },
        ],
        intro: [
          "Antes de qualquer instrução específica ao marido e à esposa, Efésios estabelece um princípio que envolve os dois: sujeição mútua, por reverência a Cristo.",
          "O casamento bíblico não é sobre dominar o outro — é sobre servir, cada um à sua maneira, seguindo o exemplo de Cristo.",
        ],
        deepDive: "Hypotassómenoi introduz toda a seção sobre casamento em Efésios 5 — antes de falar a maridos e esposas separadamente, Paulo estabelece a base: sujeição mútua. Isso muda a leitura de tudo que vem depois: nenhuma instrução específica anula esse princípio inicial de servir ao outro, não de dominá-lo.",
        theologianQuote: { author: "Reflexão pastoral", text: "Onde há domínio no lugar de serviço, o casamento já se afastou do modelo que Efésios 5 propõe desde o primeiro versículo." },
        quiz: {
          question: "Qual princípio Efésios 5:21 estabelece antes de falar especificamente sobre maridos e esposas?",
          options: ["Que o marido deve dominar a esposa", "Sujeição mútua, por reverência a Cristo", "Que cada um deve viver de forma independente", "Que a esposa deve decidir tudo sozinha"],
          correctIndex: 1,
          explanation: "Hypotassómenoi estabelece sujeição mútua como base antes de qualquer instrução específica ao casal.",
        },
        application: "Identifique uma decisão recente no casamento em que você buscou 'vencer' em vez de servir, e converse sobre isso com seu cônjuge.",
        prayer: "Senhor, ensina-nos a nos sujeitarmos um ao outro, por reverência a ti, e não a dominar. Amém.",
        weeklyChallenge: "Pergunte ao seu cônjuge: 'Em que área você sente que eu tento controlar mais do que servir?'",
        reflectionQuestion: "No meu casamento, eu busco servir ou controlar?",
      },
      {
        id: "casamento-6",
        title: "Comunicação e Perdão",
        verse: {
          ref: "Efésios 4:26",
          textByVersion: { NVI: "'Quando ficarem irados, não pequem.' Não deixem o sol se pôr estando vocês ainda irados." },
        },
        keywords: [
          { word: "παροργισμῷ", translit: "parorgismô", meaning: "'irritação, ira' — a instrução não proíbe o sentimento, mas o prazo para resolvê-lo", lang: "grego" },
        ],
        intro: [
          "Conflitos vão acontecer em qualquer casamento — a diferença está em como e quando são resolvidos.",
          "Paulo não manda o casal nunca se irritar; ele estabelece um limite claro: não deixar a irritação se acumular além de um dia.",
        ],
        deepDive: "Parorgismô reconhece que a ira acontece; o texto não a condena por si só, mas condena deixá-la se acumular sem resolução. 'Não deixar o sol se pôr' é uma imagem prática de urgência: comunicação e perdão não devem ser adiados indefinidamente, porque o acúmulo é o que abre espaço para o pecado.",
        theologianQuote: { author: "Reflexão pastoral", text: "Não é o conflito que destrói um casamento — é o conflito nunca resolvido, empilhado ano após ano." },
        quiz: {
          question: "O que Efésios 4:26 orienta sobre a ira no casamento?",
          options: ["Que ela nunca deve acontecer", "Que não deve se prolongar além de um dia sem resolução", "Que deve ser ignorada", "Que só um dos cônjuges deve resolver conflitos"],
          correctIndex: 1,
          explanation: "O texto reconhece a ira como real, mas estabelece um limite de tempo para resolvê-la, evitando o acúmulo.",
        },
        application: "Se existe um conflito não resolvido no seu casamento, proponha uma conversa ainda hoje, mesmo que breve, para começar a resolvê-lo.",
        prayer: "Senhor, ajuda-nos a não deixar conflitos se acumularem entre nós. Ensina-nos a resolver com rapidez e amor. Amém.",
        weeklyChallenge: "Estabeleçam, como casal, um combinado prático para conversar sobre desentendimentos ainda no mesmo dia.",
        reflectionQuestion: "Existem conflitos acumulados no meu casamento que deveriam ter sido resolvidos há muito tempo?",
      },
      {
        id: "casamento-7",
        title: "Fidelidade e Corpo",
        verse: {
          ref: "1 Coríntios 7:3-4",
          textByVersion: { NVI: "O marido cumpra os seus deveres conjugais para com a mulher, e da mesma forma a mulher para com o marido... pois o corpo da mulher não pertence só a ela, mas também ao marido." },
        },
        keywords: [
          { word: "ὀφειλὴν", translit: "ofeilên", meaning: "'dever, obrigação' — a intimidade conjugal descrita como cuidado mútuo, não como direito unilateral", lang: "grego" },
        ],
        intro: [
          "A fidelidade no casamento inclui a dimensão física da relação — Paulo trata isso com franqueza, como parte do cuidado mútuo entre os cônjuges.",
          "O texto equilibra os dois lados: nem o marido nem a esposa têm autoridade unilateral sobre o próprio corpo dentro do casamento — há mutualidade e cuidado recíproco.",
        ],
        deepDive: "Ofeilên descreve uma obrigação mútua de cuidado, não um direito de exigência. Paulo trata a intimidade conjugal com seriedade e equilíbrio, evitando tanto a negligência quanto o abuso de poder de um cônjuge sobre o outro. É um chamado à fidelidade prática, cotidiana, dentro da aliança.",
        theologianQuote: { author: "Reflexão pastoral", text: "Fidelidade no casamento não é apenas ausência de traição — é cuidado ativo e mútuo, todos os dias." },
        quiz: {
          question: "O que 1 Coríntios 7:3-4 ensina sobre o corpo dentro do casamento?",
          options: ["Que pertence exclusivamente à própria pessoa", "Que há mutualidade e cuidado recíproco entre os cônjuges", "Que é irrelevante para a fidelidade conjugal", "Que apenas o marido tem autoridade sobre isso"],
          correctIndex: 1,
          explanation: "O texto descreve mutualidade — nem marido nem esposa têm autoridade unilateral, há cuidado recíproco.",
        },
        application: "Conversem, com honestidade e respeito, sobre como cada um tem se sentido cuidado nessa área da relação.",
        prayer: "Senhor, ajuda-nos a viver fidelidade prática e cuidado mútuo em todas as áreas do nosso casamento. Amém.",
        weeklyChallenge: "Pergunte ao seu cônjuge, com gentileza, se ele ou ela se sente cuidado(a) nessa dimensão do casamento.",
        reflectionQuestion: "Minha fidelidade no casamento é ativa e cuidadosa, ou apenas ausência de traição?",
      },
      {
        id: "casamento-8",
        title: "Cuidado da Igreja",
        verse: {
          ref: "Efésios 5:29",
          textByVersion: { NVI: "Ninguém jamais odiou o seu próprio corpo, antes o nutre e dele cuida, como também Cristo faz com a igreja." },
        },
        keywords: [
          { word: "ἐκτρέφει", translit: "ektréfei", meaning: "'nutre, alimenta' — cuidado contínuo e ativo, como o de Cristo pela igreja", lang: "grego" },
        ],
        intro: [
          "Paulo conecta o cuidado conjugal ao cuidado de Cristo pela igreja: nutrir, alimentar, zelar continuamente.",
          "Um casamento saudável reflete, em pequena escala, o mesmo tipo de cuidado paciente e constante que Cristo tem por seu povo.",
        ],
        deepDive: "Ektréfei descreve nutrição contínua, como alguém que alimenta e cuida de algo dia após dia, não em momentos isolados. O casamento, nessa lógica, não é sustentado por gestos ocasionais grandiosos, mas por cuidado diário — assim como Cristo cuida da igreja de forma constante, não apenas em momentos especiais.",
        theologianQuote: { author: "Reflexão pastoral", text: "O cuidado que sustenta um casamento não é o gesto grandioso ocasional, mas a atenção diária e constante." },
        quiz: {
          question: "Que tipo de cuidado Efésios 5:29 descreve como modelo para o casamento?",
          options: ["Gestos grandiosos ocasionais", "Cuidado contínuo e diário, como o de Cristo pela igreja", "Apenas suporte financeiro", "Cuidado apenas em momentos de crise"],
          correctIndex: 1,
          explanation: "Ektréfei descreve nutrição contínua — cuidado diário e constante, seguindo o modelo de Cristo com a igreja.",
        },
        application: "Escolha um gesto pequeno e diário de cuidado com seu cônjuge para praticar todos os dias desta semana.",
        prayer: "Senhor, ensina-nos a cuidar um do outro com a mesma constância que tu cuidas da tua igreja. Amém.",
        weeklyChallenge: "Pergunte ao seu cônjuge: 'O que te faria sentir mais cuidado(a) no dia a dia, não em ocasiões especiais?'",
        reflectionQuestion: "Meu cuidado no casamento é constante ou só aparece em datas especiais?",
      },
      {
        id: "casamento-9",
        title: "Recomeço e Graça",
        verse: {
          ref: "1 Pedro 4:8",
          textByVersion: { NVI: "Sobretudo, amem-se sinceramente uns aos outros, porque o amor cobre uma multidão de pecados." },
        },
        keywords: [
          { word: "καλύπτει", translit: "kalýptei", meaning: "'cobre' — não no sentido de esconder mal, mas de não guardar rancor, permitindo recomeço", lang: "grego" },
        ],
        intro: [
          "Todo casamento passa por momentos que exigem recomeço — depois de um erro, de uma temporada difícil ou de um período de distância.",
          "Este texto lembra que o amor genuíno cobre uma multidão de pecados: não ignora o erro, mas não o usa como arma permanente contra o outro.",
        ],
        deepDive: "Kalýptei não significa fingir que nada aconteceu, mas escolher não guardar o erro como munição para o futuro. Depois da confissão e do arrependimento genuíno, o amor bíblico permite recomeço — não porque o pecado não importou, mas porque a graça já tratou dele.",
        theologianQuote: { author: "Reflexão pastoral", text: "Recomeçar no casamento não é fingir que o erro não aconteceu — é escolher não usá-lo para sempre contra o outro." },
        quiz: {
          question: "O que significa o amor 'cobrir uma multidão de pecados' em 1 Pedro 4:8?",
          options: ["Ignorar erros graves sem tratá-los", "Não guardar o erro como arma permanente após arrependimento genuíno", "Fingir que nada aconteceu", "Nunca perdoar completamente"],
          correctIndex: 1,
          explanation: "Kalýptei descreve amor que permite recomeço genuíno, sem usar o erro passado como arma contínua.",
        },
        application: "Se existe algo do passado que ainda é usado como arma em discussões do casal, conversem sobre deixar esse assunto verdadeiramente resolvido.",
        prayer: "Senhor, ensina-nos a amar com um amor que permite recomeço de verdade. Amém.",
        weeklyChallenge: "Identifique, com seu cônjuge, um assunto do passado que precisa ser encerrado de vez, com graça.",
        reflectionQuestion: "Eu ainda uso erros passados do meu cônjuge como arma, mesmo depois do arrependimento?",
      },
      {
        id: "casamento-10",
        title: "Uma Vida que Aponta",
        verse: {
          ref: "Efésios 5:32",
          textByVersion: { NVI: "Isto é um mistério profundo — e eu me refiro a Cristo e à igreja." },
        },
        keywords: [
          { word: "μυστήριον", translit: "mystérion", meaning: "mistério — realidade espiritual profunda; o casamento humano reflete algo maior que ele mesmo", lang: "grego" },
        ],
        intro: [
          "O casamento cristão não existe apenas para o bem-estar do casal — ele aponta para algo maior: a relação entre Cristo e sua igreja.",
          "Essa última trilha do módulo convida o casal a lembrar que sua união é também um testemunho visível ao mundo ao redor.",
        ],
        deepDive: "Mystérion não significa algo confuso, mas uma realidade espiritual profunda antes escondida e agora revelada. Ao descrever o casamento como reflexo de Cristo e a igreja, Paulo eleva o propósito da união para além do casal: cada casamento cristão é, de alguma forma, um pequeno retrato público do evangelho.",
        theologianQuote: { author: "Reflexão pastoral", text: "Um casamento cristão vivido com fidelidade e graça é, sem dizer uma palavra, um sermão sobre o evangelho." },
        quiz: {
          question: "O que Efésios 5:32 diz que o casamento reflete?",
          options: ["Apenas um acordo social", "Um mistério profundo ligado a Cristo e à igreja", "Uma tradição cultural sem propósito maior", "Nada além da relação entre o casal"],
          correctIndex: 1,
          explanation: "Mystérion aponta para uma realidade espiritual maior: o casamento como reflexo da relação entre Cristo e a igreja.",
        },
        application: "Conversem, como casal, sobre que tipo de 'testemunho' o casamento de vocês tem sido para quem observa de fora.",
        prayer: "Senhor, que nosso casamento aponte sempre para o teu amor por nós. Amém.",
        weeklyChallenge: "Pensem juntos em uma pessoa ou casal que poderia ser encorajado pelo testemunho do casamento de vocês, e busquem esse contato.",
        reflectionQuestion: "Meu casamento, hoje, aponta para o evangelho ou apenas para o meu próprio conforto?",
      },
    ],
  },
];
