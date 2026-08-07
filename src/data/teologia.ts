export type TheologyChapter = {
  id: string;
  title: string;
  content: string;
  references: string[];
};

export type TheologyModule = {
  id: string;
  title: string;
  subtitle: string;
  chapters: TheologyChapter[];
};

const chapter = (
  id: string,
  title: string,
  content: string,
  references: string[],
): TheologyChapter => ({ id, title, content, references });

export const theologyModules: TheologyModule[] = [
  {
    id: "prolegomenos",
    title: "Prolegômenos",
    subtitle: "A introdução ao estudo da teologia",
    chapters: [
      chapter(
        "natureza-da-teologia-sistematica",
        "A Natureza da Teologia Sistemática",
        "Teologia é o esforço responsável de conhecer, organizar e comunicar o que Deus revelou. A teologia sistemática reúne o ensino bíblico por temas, sem substituir a leitura histórica, literária e canônica das Escrituras. Seu centro não é uma abstração, mas o Deus que se revela e a obra de Cristo, que conduz a Igreja a amar a Deus com entendimento e a viver em santidade.",
        ["2 Timóteo 3:16-17", "Mateus 22:37-40", "João 5:39"],
      ),
      chapter(
        "metodo-da-teologia-sistematica",
        "O Método da Teologia Sistemática",
        "O método começa com a escuta reverente do texto bíblico em seu contexto, compara passagens relacionadas e distingue claramente o que é afirmação direta, inferência teológica e opinião. A comunidade cristã também testa suas conclusões pela oração, pela tradição histórica e pela razão, mas a Escritura permanece a autoridade final. Como os bereanos, o leitor é chamado a examinar tudo à luz da Palavra.",
        ["Atos 17:11", "Lucas 24:27", "1 Tessalonicenses 5:21"],
      ),
    ],
  },
  {
    id: "bibliologia",
    title: "Bibliologia",
    subtitle: "A doutrina das Sagradas Escrituras",
    chapters: [
      chapter(
        "revelacao-geral",
        "A Revelação Geral",
        "Deus dá testemunho de si mesmo na criação, na ordem do mundo e na consciência humana. Essa revelação torna a humanidade responsável diante do Criador, mas não anuncia por si só, com a clareza necessária, o nome de Cristo e o caminho do Evangelho. Ela prepara o terreno para a revelação especial e impede que alguém trate Deus como totalmente desconhecido.",
        ["Salmos 19:1-4", "Romanos 1:19-20", "Romanos 2:14-16"],
      ),
      chapter(
        "revelacao-especial",
        "A Revelação Especial",
        "Na revelação especial, Deus fala de modo redentor por suas palavras e atos na história, culminando em Jesus Cristo, o Verbo encarnado. A Bíblia registra e interpreta esse testemunho para que a Igreja conheça a vontade de Deus, creia no Salvador e preserve fielmente o Evangelho.",
        ["Hebreus 1:1-2", "João 1:14-18", "2 Timóteo 3:15-17"],
      ),
      chapter(
        "canon-das-escrituras",
        "O Cânon das Escrituras Sagradas",
        "Cânon é a coleção reconhecida como norma para a fé. A Igreja não criou a autoridade dos livros bíblicos; ela recebeu, examinou e reconheceu os escritos apostólicos e proféticos em continuidade com o testemunho de Israel e da comunidade cristã. O cânon deve ser tratado com reverência, sem acrescentar novas obras com autoridade equivalente à Escritura.",
        ["Lucas 24:44", "2 Pedro 3:15-16", "Apocalipse 22:18-19"],
      ),
      chapter(
        "autoridade-das-escrituras",
        "A Autoridade das Escrituras",
        "A autoridade bíblica procede do próprio Deus, que fala por meio dos autores humanos. Por isso, a Palavra julga a Igreja, a tradição e as convicções pessoais, e não o contrário. Submeter-se às Escrituras não é abandonar a razão, mas colocá-la diante da verdade que Deus tornou conhecida.",
        ["João 10:35", "2 Timóteo 3:16-17", "Isaías 8:20"],
      ),
      chapter(
        "confiabilidade-historica-manuscritos",
        "A Confiabilidade Histórica dos Manuscritos Antigos",
        "A confiabilidade histórica dos manuscritos é avaliada pela quantidade e antiguidade das testemunhas, pela comparação textual e pela coerência com dados históricos e arqueológicos. Existem variantes de transmissão, mas elas são estudadas abertamente e não anulam o núcleo da mensagem bíblica. A fé cristã também se apoia em acontecimentos proclamados como fatos, especialmente a morte e a ressurreição de Jesus.",
        ["Lucas 1:1-4", "1 Coríntios 15:3-8", "2 Pedro 1:16"],
      ),
      chapter(
        "transmissao-manuscritos",
        "A Transmissão dos Manuscritos Antigos",
        "A transmissão bíblica aconteceu por cópia, leitura pública, ensino e tradução em diferentes comunidades. Esse processo exige responsabilidade dos escribas e dos estudiosos, mas a providência de Deus não transforma a história em mágica: ela conduz a Igreja a trabalhar com cuidado, comparar testemunhos e comunicar o texto com honestidade.",
        ["Deuteronômio 6:6-9", "2 Timóteo 2:2", "Colossenses 4:16"],
      ),
      chapter(
        "inerrancia-autografos",
        "A Inerrância nos Autógrafos",
        "A doutrina da inerrância afirma que, nos escritos originais, a Bíblia não afirma falsidade. Isso não significa que todos os gêneros literários devam ser lidos como se fossem relatórios modernos, nem ignora linguagem figurada, arredondamentos ou perspectivas narrativas. A confiança está no fato de que Deus não mente e que sua Palavra é verdadeira em tudo o que pretende ensinar.",
        ["Números 23:19", "João 17:17", "Tito 1:2"],
      ),
      chapter(
        "infalibilidade-autografos",
        "A Infalibilidade nos Autógrafos",
        "Infalibilidade enfatiza que a Escritura não falha em cumprir o propósito para o qual Deus a deu: revelar sua verdade, confrontar o pecado e conduzir à salvação e à maturidade. A leitura fiel considera o propósito de cada passagem e rejeita tanto o ceticismo quanto o uso da Bíblia para provar qualquer ideia previamente escolhida.",
        ["Isaías 55:10-11", "Mateus 5:17-18", "2 Timóteo 3:15-17"],
      ),
      chapter(
        "clareza-das-escrituras",
        "A Clareza das Escrituras",
        "A Bíblia é suficientemente clara em sua mensagem central, sobretudo sobre Deus, o pecado e a salvação em Cristo. Isso não significa que toda passagem seja simples ou que o estudo seja dispensável. A clareza chama cada cristão a ler com humildade, atenção ao contexto, oração e disposição para aprender com a comunidade.",
        ["Deuteronômio 30:11-14", "Salmos 119:105", "2 Pedro 3:15-16"],
      ),
      chapter(
        "necessidade-das-escrituras",
        "A Necessidade das Escrituras",
        "A criação testemunha que Deus existe, mas as Escrituras são necessárias para que conheçamos com clareza o Evangelho, a vontade de Deus e a história da redenção. A fé nasce do anúncio da Palavra, e a Igreja depende dela para não reduzir o cristianismo a moralismo, tradição ou experiência subjetiva.",
        ["Mateus 4:4", "Romanos 10:14-17", "2 Timóteo 3:15"],
      ),
      chapter(
        "suficiencia-das-escrituras",
        "A Suficiência das Escrituras",
        "A suficiência significa que a Bíblia contém tudo o que é necessário para conhecer o caminho da salvação e obedecer a Deus em fé e prática. Ela não pretende ser manual técnico de todas as áreas da vida, mas oferece o fundamento para discernir qualquer área. Por isso, nenhuma revelação posterior pode corrigir ou completar a autoridade normativa das Escrituras.",
        ["2 Timóteo 3:16-17", "2 Pedro 1:3-4", "Salmos 19:7-11"],
      ),
    ],
  },
  {
    id: "teontologia",
    title: "Teontologia",
    subtitle: "O ser, os atributos e as obras de Deus",
    chapters: [
      chapter(
        "existencia-de-deus",
        "A Existência de Deus",
        "A Bíblia começa com Deus, não com uma tentativa de provar sua existência. Ela apresenta o Criador como a realidade primeira, reconhecida na criação, na história e na consciência. Argumentos filosóficos podem apontar para a racionalidade da fé, mas o conhecimento salvador nasce quando Deus se dá a conhecer e chama a pessoa a confiar nele.",
        ["Gênesis 1:1", "Salmos 14:1", "Romanos 1:20"],
      ),
      chapter(
        "cognoscibilidade-de-deus",
        "A Cognoscibilidade de Deus",
        "Deus pode ser conhecido verdadeiramente porque ele mesmo se revela, embora nunca possa ser compreendido de forma exaustiva por criaturas finitas. Conhecer a Deus é mais que acumular conceitos: é entrar em relação com ele por meio de sua Palavra e de Cristo. Toda teologia deve unir precisão doutrinária, reverência e obediência.",
        ["Jeremias 9:23-24", "João 17:3", "1 Coríntios 2:10-12"],
      ),
      chapter(
        "atributos-incomunicaveis",
        "Os Atributos Incomunicáveis de Deus",
        "A eternidade, a imutabilidade, a onipotência, a onipresença e a independência de Deus lembram que ele não é uma versão ampliada da criatura. Esses atributos sustentam a esperança: Deus não envelhece, não perde o controle e não muda de caráter. Ao mesmo tempo, a linguagem bíblica nos ensina sobre ele de modo verdadeiro, ainda que analógico.",
        ["Êxodo 3:14", "Salmos 90:1-2", "Malaquias 3:6"],
      ),
      chapter(
        "atributos-comunicaveis",
        "Os Atributos Comunicáveis de Deus",
        "Santo, justo, amoroso, misericordioso e fiel são qualidades que Deus possui de modo perfeito e que chama seu povo a refletir de modo criado e limitado. A imitação cristã não transforma o ser humano em Deus; ela forma um caráter que corresponde ao Deus que salva. A santidade bíblica sempre aparece unida ao amor e à justiça.",
        ["Êxodo 34:6-7", "1 Pedro 1:15-16", "Efésios 5:1-2"],
      ),
      chapter(
        "unidade-essencia-trindade",
        "A Unidade de Essência na Trindade",
        "O testemunho bíblico é monoteísta: há um só Deus. A doutrina da Trindade organiza, sem eliminar o mistério, o ensino de que Pai, Filho e Espírito participam plenamente da única natureza divina. Não são três deuses nem três modos passageiros de uma só pessoa, mas um único Deus em três pessoas distintas.",
        ["Deuteronômio 6:4", "1 Coríntios 8:6", "Mateus 28:19"],
      ),
      chapter(
        "distincao-pessoas-trindade",
        "A Distinção de Pessoas na Trindade",
        "O Pai envia o Filho, o Filho ora ao Pai e o Espírito é enviado pelo Pai e pelo Filho; essas relações não são apenas nomes diferentes para a mesma pessoa. A distinção pessoal preserva a realidade do amor eterno e da missão redentora. A Igreja confessa essa verdade com a linguagem histórica do Credo Niceno-Constantinopolitano, sempre submetida às Escrituras.",
        ["Mateus 3:16-17", "João 14:16-17", "2 Coríntios 13:13"],
      ),
      chapter(
        "criacao-universo",
        "A Criação do Universo",
        "Deus criou todas as coisas do nada, em liberdade e sabedoria, e a criação depende continuamente dele. A bondade original do mundo não significa que tudo esteja hoje como deveria, mas fundamenta a dignidade da matéria, do trabalho e do cuidado com a criação. Cristo é apresentado como aquele por meio de quem todas as coisas foram feitas.",
        ["Gênesis 1:1-31", "João 1:3", "Colossenses 1:15-17"],
      ),
      chapter(
        "providencia-divina",
        "A Providência Divina",
        "Providência é a ação contínua pela qual Deus sustenta, acompanha e conduz sua criação sem abolir a responsabilidade humana. A Bíblia afirma o cuidado de Deus até nos detalhes, mas não oferece uma explicação rasa para todo sofrimento. A confiança cristã repousa no caráter de Deus e na certeza de que ele pode redimir o mal sem ser autor do pecado.",
        ["Mateus 10:29-31", "Atos 17:25-28", "Romanos 8:28"],
      ),
      chapter(
        "preservacao-divina",
        "A Preservação Divina",
        "A criação continua existindo porque Deus a sustenta. Essa preservação não é passividade: ela mantém a ordem do mundo, sustenta a vida e permite que criaturas reais ajam com responsabilidade. Em Cristo, a Igreja vê o fundamento de todas as coisas e a promessa de que a criação não será abandonada.",
        ["Colossenses 1:17", "Hebreus 1:3", "Atos 14:15-17"],
      ),
      chapter(
        "governo-divino",
        "O Governo Divino",
        "Deus reina sobre a história e trabalha para cumprir seus propósitos, mesmo quando governos humanos são limitados e injustos. Seu governo não legitima toda autoridade humana nem dispensa a responsabilidade de denunciar opressão. A soberania bíblica consola o povo perseguido e convoca os poderosos à justiça.",
        ["Daniel 4:35", "Salmos 103:19", "Romanos 13:1-7"],
      ),
      chapter(
        "milagres",
        "Os Milagres",
        "Milagres são atos extraordinários de Deus que apontam para sua revelação e para o avanço de seu Reino. Na Bíblia, eles nunca são meros espetáculos: servem à compaixão, confirmam a missão divina e chamam à fé. O discernimento cristão rejeita tanto a negação automática quanto a credulidade sem exame.",
        ["Êxodo 14:21-31", "João 20:30-31", "Atos 2:22"],
      ),
      chapter(
        "intervencao-divina-historia",
        "A Intervenção Divina na História",
        "Deus age na história sem deixar de ser transcendente, conduzindo povos, alianças e acontecimentos para o cumprimento de sua promessa. O centro dessa intervenção é a encarnação, morte e ressurreição de Jesus. A leitura cristã da história permanece humilde: nem todo acontecimento pode ser interpretado como uma mensagem específica de Deus.",
        ["Atos 17:26-27", "Gálatas 4:4-5", "Hebreus 1:1-2"],
      ),
      chapter(
        "oracao",
        "A Oração",
        "A oração é resposta filial ao Deus que fala e promete, não uma técnica para controlar o futuro. Jesus ensina a pedir o pão, o perdão, a proteção e a vinda do Reino, sempre em submissão à vontade do Pai. A oração também inclui lamento, ação de graças, intercessão e silêncio reverente.",
        ["Mateus 6:9-13", "Filipenses 4:6-7", "1 João 5:14-15"],
      ),
      chapter(
        "soberania-de-deus",
        "A Soberania de Deus",
        "A soberania afirma que Deus é Senhor de tudo e que nenhum propósito seu pode ser frustrado. Cristãos fiéis explicam de formas diferentes como essa soberania se relaciona com a liberdade humana e a responsabilidade moral; a Bíblia mantém as duas verdades sem apresentar uma fórmula que elimine o mistério. A soberania conduz à adoração, à esperança e à ação responsável.",
        ["Efésios 1:11", "Romanos 9:19-24", "Deuteronômio 29:29"],
      ),
    ],
  },
  {
    id: "angelologia",
    title: "Angelologia",
    subtitle: "Os anjos e os seres espirituais",
    chapters: [
      chapter(
        "natureza-anjos-santos",
        "A Natureza dos Anjos Santos",
        "Os anjos são criaturas espirituais, pessoais e finitas, distintas de Deus e dos seres humanos. Eles não devem ser adorados nem transformados em objetos de especulação; servem a Deus e apontam para sua glória. A Escritura fala deles com sobriedade, preservando o foco no Senhor e em sua obra redentora.",
        ["Hebreus 1:14", "Lucas 20:36", "Apocalipse 22:8-9"],
      ),
      chapter(
        "ministerio-anjos-santos",
        "O Ministério dos Anjos Santos",
        "A Bíblia descreve anjos como mensageiros e servos enviados por Deus para cumprir sua vontade e assistir seu povo. Essa promessa não autoriza práticas de invocação ou culto aos anjos. O conforto cristão não está em buscar experiências angelicais, mas em confiar no Deus que ordena seus servos e guarda sua Igreja.",
        ["Salmos 91:11", "Hebreus 1:14", "Atos 12:6-11"],
      ),
    ],
  },
  {
    id: "demonologia",
    title: "Demonologia",
    subtitle: "O mal espiritual e sua oposição a Deus",
    chapters: [
      chapter(
        "origem-satanas",
        "A Origem de Satanás",
        "A Bíblia ensina que Satanás é criatura e adversário, não um princípio eterno oposto a Deus. Ela não oferece uma narrativa única e completa sobre sua origem, por isso devemos evitar transformar imagens poéticas e textos sobre reis humanos em uma biografia detalhada. O mal espiritual é real, mas está subordinado ao governo de Deus.",
        ["Colossenses 1:16", "João 8:44", "1 Timóteo 3:6"],
      ),
      chapter(
        "queda-satanas",
        "A Queda de Satanás",
        "A queda de Satanás aparece associada ao orgulho, à rebelião e ao juízo de Deus. Passagens como Judas 6 e 2 Pedro 2:4 falam de anjos que pecaram, mas não resolvem todos os detalhes da cronologia. A doutrina deve permanecer no que o texto afirma: nenhum poder rebelde escapará do juízo do Criador.",
        ["Judas 6", "2 Pedro 2:4", "Apocalipse 12:7-9"],
      ),
      chapter(
        "origem-demonios",
        "A Origem dos Demônios",
        "No Novo Testamento, os demônios aparecem como poderes espirituais hostis a Deus e destrutivos para as pessoas. A associação deles com anjos caídos é uma inferência teológica antiga e coerente com o testemunho bíblico, mas a Escritura não apresenta um tratado sistemático sobre sua origem. A certeza central é que Jesus tem autoridade sobre eles.",
        ["Mateus 25:41", "Apocalipse 12:9", "Marcos 1:23-27"],
      ),
      chapter(
        "atuacao-demoniaca",
        "A Atuação Demoníaca",
        "A atuação demoníaca inclui mentira, acusação, tentação, opressão e oposição ao testemunho do Evangelho. A Bíblia não permite atribuir toda doença, sofrimento ou pecado diretamente a demônios, pois também reconhece causas físicas, sociais e morais. O discernimento cristão combina oração, verdade, cuidado pastoral e responsabilidade prática.",
        ["1 Pedro 5:8-9", "Marcos 5:1-20", "2 Coríntios 11:13-15"],
      ),
      chapter(
        "batalha-espiritual",
        "A Batalha Espiritual",
        "A batalha espiritual é enfrentada com a verdade, a justiça, a fé, a oração e a perseverança, não com fórmulas de poder pessoal. A vitória decisiva pertence a Cristo, e o cristão permanece firme unido a ele. Resistir ao mal inclui rejeitar a tentação e viver em uma comunidade que pratica o Evangelho.",
        ["Efésios 6:10-18", "Tiago 4:7-8", "Colossenses 2:15"],
      ),
    ],
  },
  {
    id: "antropologia",
    title: "Antropologia",
    subtitle: "A criação e a natureza do ser humano",
    chapters: [
      chapter(
        "criacao-homem",
        "A Criação do Homem",
        "O ser humano foi criado por Deus, recebe dele a vida e possui uma dignidade que não depende de poder, saúde, produtividade ou status. Homem e mulher são chamados a refletir o Criador, cultivar a terra e viver em relação responsável. A visão bíblica evita tanto reduzir a pessoa à matéria quanto desprezar o corpo.",
        ["Gênesis 1:26-28", "Gênesis 2:7", "Salmos 8:3-8"],
      ),
      chapter(
        "imagem-de-deus",
        "A Imagem de Deus no Homem (Imago Dei)",
        "A imagem de Deus fundamenta a dignidade universal, a responsabilidade moral e o chamado à comunhão. O pecado desfigura essa imagem, mas não apaga o valor humano; por isso Tiago ainda fundamenta a ética no fato de as pessoas serem feitas à semelhança de Deus. Em Cristo, o ser humano é renovado para refletir o Criador em justiça e santidade.",
        ["Gênesis 1:26-27", "Tiago 3:9", "Colossenses 3:9-10"],
      ),
      chapter(
        "essencia-natureza-humana",
        "A Essência da Natureza Humana",
        "A Bíblia apresenta a pessoa como unidade viva de corpo e dimensão interior, criada para amar a Deus e ao próximo. Ela não oferece uma definição filosófica única de todas as partes do ser humano, mas afirma a bondade original da criação, a realidade do pecado e a esperança da ressurreição corporal. A salvação bíblica não é fuga do corpo, mas sua redenção.",
        ["Gênesis 2:7", "Marcos 12:30", "1 Coríntios 15:42-49"],
      ),
      chapter(
        "dicotomia-tricotomia",
        "O Debate entre Dicotomia e Tricotomia",
        "Alguns cristãos distinguem corpo e alma ou espírito, enquanto outros descrevem três dimensões distintas na pessoa. Textos como 1 Tessalonicenses 5:23 e Hebreus 4:12 usam linguagem importante, mas não necessariamente apresentam uma anatomia metafísica. O ponto comum é que Deus redime a pessoa inteira e chama cada dimensão da vida à santidade.",
        ["1 Tessalonicenses 5:23", "Hebreus 4:12", "Mateus 10:28"],
      ),
      chapter(
        "livre-arbitrio",
        "O Livre-Arbítrio",
        "A Bíblia responsabiliza as pessoas por suas escolhas e, ao mesmo tempo, descreve a escravidão do coração ao pecado. Tradições reformadas e arminianas explicam essa relação de modos diferentes; ambas procuram fazer justiça aos textos sobre a graça soberana e o chamado real ao arrependimento. Neste material, a liberdade é entendida como responsabilidade humana dependente da graça de Deus.",
        ["Josué 24:15", "João 6:44", "Atos 17:30"],
      ),
      chapter(
        "agencia-moral",
        "A Agência Moral",
        "Agência moral é a capacidade de responder diante de Deus com decisões, intenções e ações. O juízo bíblico considera o coração e o conhecimento recebido, sem reduzir a pessoa a circunstâncias externas. A graça não elimina a responsabilidade; ela restaura a capacidade de viver em obediência e amor.",
        ["Romanos 2:14-16", "Mateus 12:36-37", "2 Coríntios 5:10"],
      ),
    ],
  },
  {
    id: "hamartiologia",
    title: "Hamartiologia",
    subtitle: "A origem, a natureza e os efeitos do pecado",
    chapters: [
      chapter(
        "queda-adao",
        "A Queda de Adão",
        "Gênesis 3 descreve a entrada do pecado como desconfiança da palavra de Deus, desejo de autonomia e ruptura da comunhão. Paulo interpreta Adão como figura cuja transgressão trouxe morte e condenação ao mundo, enquanto Cristo inaugura uma humanidade obediente. A narrativa chama o leitor a reconhecer a seriedade do pecado sem perder a esperança da promessa.",
        ["Gênesis 3:1-24", "Romanos 5:12-19", "1 Coríntios 15:21-22"],
      ),
      chapter(
        "natureza-pecado",
        "A Natureza do Pecado",
        "Pecado não é apenas falhar em uma regra; é rejeitar o governo de Deus e desordenar o amor. Ele aparece em atos, palavras, pensamentos, omissões e estruturas de injustiça. A confissão cristã deve ser concreta e honesta, porque somente a verdade sobre o pecado torna a graça verdadeiramente preciosa.",
        ["1 João 3:4", "Tiago 4:17", "Marcos 7:20-23"],
      ),
      chapter(
        "depravacao-humana",
        "A Extensão da Depravação Humana",
        "A Bíblia descreve o pecado como abrangente: afeta mente, desejos, vontade, relações e práticas. Depravação total não significa que toda pessoa seja tão má quanto poderia ser, mas que nenhuma área da vida está totalmente livre do pecado e ninguém pode salvar a si mesmo. A graça de Deus é necessária do começo ao fim da salvação.",
        ["Romanos 3:10-23", "Efésios 2:1-5", "Jeremias 17:9"],
      ),
      chapter(
        "culpa-herdada",
        "A Culpa Herdada",
        "Romanos 5 relaciona a transgressão de Adão com a condição de toda a humanidade, mas cristãos diferem sobre como descrever a transmissão da culpa e da corrupção. O texto deve ser lido junto com a responsabilidade pessoal e com a justiça de Deus. Todos precisam de Cristo, e ninguém é condenado por estar fora do alcance da misericórdia divina.",
        ["Romanos 5:12-19", "Salmos 51:5", "Ezequiel 18:20"],
      ),
      chapter(
        "aliancas-biblicas",
        "As Alianças Bíblicas",
        "As alianças organizam a história da redenção: Deus promete, estabelece sinais, chama um povo e conduz tudo à nova aliança em Cristo. Elas não são contratos humanos entre iguais, mas compromissos graciosos do Senhor, aos quais o povo responde com fé e obediência. A Ceia recorda que a nova aliança é selada pelo sangue de Jesus.",
        ["Gênesis 9:8-17", "2 Samuel 7:12-16", "Lucas 22:20", "Hebreus 8:6-13"],
      ),
    ],
  },
  {
    id: "cristologia",
    title: "Cristologia",
    subtitle: "A pessoa e a obra de Jesus Cristo",
    chapters: [
      chapter(
        "preexistencia-cristo",
        "A Preexistência de Cristo",
        "Jesus não começou a existir em Belém. O Novo Testamento o apresenta como o Verbo que estava com Deus e era Deus, participante da glória do Pai antes da criação. Sua preexistência garante que a encarnação é a entrada do Filho eterno na história, e não o surgimento de um herói religioso.",
        ["João 1:1-3", "João 17:5", "Colossenses 1:15-17"],
      ),
      chapter(
        "deidade-cristo",
        "A Deidade de Cristo",
        "Jesus recebe nomes, honra e obras atribuídas ao próprio Deus, sem deixar de ser distinto do Pai. Tomé o confessa como Senhor e Deus, e Paulo afirma que em Cristo habita corporalmente toda a plenitude da divindade. A plena divindade de Cristo é essencial para que sua revelação e sua salvação sejam verdadeiramente divinas.",
        ["João 20:28", "Colossenses 2:9", "Hebreus 1:8"],
      ),
      chapter(
        "encarnacao-cristo",
        "A Encarnação de Cristo",
        "Na encarnação, o Filho eterno assume a natureza humana sem deixar de ser Deus. Ele entra na história, nasce, cresce, sofre e morre para tornar conhecido o Pai e reconciliar pecadores. A encarnação revela a proximidade de Deus e confere dignidade à humanidade que Cristo veio redimir.",
        ["João 1:14", "Filipenses 2:6-8", "Gálatas 4:4-5"],
      ),
      chapter(
        "natureza-humana-cristo",
        "A Natureza Humana de Cristo",
        "Jesus possui verdadeira humanidade: corpo, mente, emoções, vontade e experiência de tentação, porém sem pecado. Ele se cansa, chora, aprende e sofre, identificando-se profundamente conosco. Sua humanidade não é aparência; é o fundamento de sua compaixão e de sua representação perfeita.",
        ["Lucas 2:52", "João 11:35", "Hebreus 4:15"],
      ),
      chapter(
        "uniao-hipostatica",
        "A União Hipostática",
        "A união hipostática é a formulação histórica para confessar uma só pessoa, Jesus Cristo, em duas naturezas completas, divina e humana, sem confusão nem divisão. A expressão organiza o testemunho bíblico, mas não elimina o mistério. O mesmo Jesus que pode morrer segundo sua humanidade é o Filho eterno que sustenta todas as coisas.",
        ["João 1:14", "Romanos 1:3-4", "Colossenses 2:9"],
      ),
      chapter(
        "cristo-profeta",
        "Cristo como Profeta",
        "Como Profeta, Jesus revela perfeitamente a vontade do Pai, não apenas transmitindo palavras, mas sendo a Palavra encarnada. Ele anuncia o Reino, confronta a hipocrisia e chama ao arrependimento. Moisés apontou para um profeta semelhante a ele, mas Cristo supera todos os mensageiros porque fala como o Filho.",
        ["Deuteronômio 18:15", "Atos 3:22-23", "Hebreus 1:1-2"],
      ),
      chapter(
        "cristo-sacerdote",
        "Cristo como Sacerdote",
        "Como Sacerdote, Jesus representa seu povo diante de Deus e oferece a si mesmo como sacrifício perfeito. Seu sacerdócio é permanente, compassivo e suficiente, por isso o cristão pode aproximar-se de Deus com confiança. Não há necessidade de repetir a obra da cruz nem de buscar outro mediador para a reconciliação.",
        ["Hebreus 4:14-16", "Hebreus 7:23-27", "1 Timóteo 2:5"],
      ),
      chapter(
        "cristo-rei",
        "Cristo como Rei",
        "Jesus reina como o Messias prometido, mas seu governo se manifesta primeiro na humildade, no serviço e na cruz. Após a ressurreição, toda autoridade lhe foi dada e sua Igreja proclama seu senhorio a todas as nações. O reinado de Cristo já começou e aguarda sua manifestação plena.",
        ["Mateus 28:18-20", "Filipenses 2:9-11", "Apocalipse 19:16"],
      ),
      chapter(
        "significado-expiacao",
        "O Significado da Expiação",
        "Expiação descreve a obra pela qual Deus trata o pecado e reconcilia consigo os pecadores. A cruz envolve substituição, sacrifício, vitória sobre os poderes, demonstração de justiça e manifestação do amor, sem que uma única imagem esgote o testemunho bíblico. O centro é que Deus, em Cristo, realiza a reconciliação que o ser humano não poderia produzir.",
        ["Romanos 3:21-26", "2 Coríntios 5:19-21", "1 Pedro 2:24"],
      ),
      chapter(
        "sacrificio-substitutivo",
        "O Sacrifício Substitutivo",
        "A Escritura afirma que Cristo morreu por nossos pecados e levou sobre si o juízo que nos alcançava. A substituição não descreve um Pai cruel separado do Filho, mas a ação do Deus triúno que, em amor, entrega o Filho e oferece reconciliação. A cruz denuncia o pecado e, simultaneamente, anuncia graça.",
        ["Isaías 53:4-6", "Marcos 10:45", "1 Pedro 3:18"],
      ),
      chapter(
        "extensao-expiacao",
        "A Extensão da Expiação",
        "Cristãos reformados e arminianos interpretam de maneira diferente a relação entre a intenção da cruz e a aplicação da salvação. Textos como João 3:16 e 1 João 2:2 sustentam a amplitude da oferta, enquanto outros destacam a eficácia da morte de Cristo por seu povo. Este estudo reconhece a força de ambos os conjuntos de textos e confessa que toda salvação efetiva depende da cruz.",
        ["João 3:16", "1 João 2:2", "Efésios 5:25"],
      ),
      chapter(
        "oferta-universal-salvacao",
        "A Oferta Universal da Salvação",
        "O Evangelho deve ser anunciado a todas as pessoas com um convite verdadeiro ao arrependimento e à fé. A Igreja não precisa descobrir quem foi eleito antes de proclamar, pois Deus chama todos a se voltarem para Cristo. A oferta universal não transforma a salvação em obra humana; ela anuncia a graça que somente Deus pode aplicar.",
        ["Mateus 11:28", "Atos 17:30", "Apocalipse 22:17"],
      ),
      chapter(
        "ressurreicao-corporal",
        "A Ressurreição Corporal de Cristo",
        "A ressurreição de Jesus foi corporal, histórica e transformadora, não apenas a sobrevivência de sua influência. Os discípulos testemunharam o Ressuscitado, a sepultura foi proclamada vazia e a Igreja nasceu da convicção de que Deus venceu a morte. Sem a ressurreição, a fé cristã perde seu fundamento e sua esperança.",
        ["1 Coríntios 15:3-8", "1 Coríntios 15:12-20", "Lucas 24:36-43"],
      ),
      chapter(
        "ascensao-cristo",
        "A Ascensão de Cristo",
        "A ascensão não significa que Jesus foi para um lugar distante e desinteressado, mas que ele foi exaltado e entronizado junto ao Pai. O Cristo ressuscitado continua intercedendo, governando e enviando seu Espírito. A Igreja vive entre a obra consumada e a promessa de seu retorno.",
        ["Atos 1:9-11", "Efésios 4:8-10", "Hebreus 4:14"],
      ),
      chapter(
        "sessao-direita-pai",
        "A Sessão à Direita do Pai",
        "Sentar-se à direita do Pai é linguagem de autoridade, honra e governo messiânico. Jesus reina como mediador, intercede por seu povo e aguarda a derrota final de todos os inimigos. Essa verdade sustenta a segurança da Igreja: seu Senhor não é apenas lembrado, mas está vivo e governa.",
        ["Salmos 110:1", "Hebreus 1:3", "Romanos 8:34"],
      ),
    ],
  },
  {
    id: "pneumatologia",
    title: "Pneumatologia",
    subtitle: "A pessoa e a obra do Espírito Santo",
    chapters: [
      chapter(
        "personalidade-espirito",
        "A Personalidade do Espírito Santo",
        "O Espírito Santo ensina, guia, fala, pode ser entristecido e intercede; essas ações pertencem a uma pessoa, não a uma força impessoal. A Igreja se relaciona com ele em comunhão e obediência. Falar do Espírito como pessoa protege a realidade de sua presença e evita tratá-lo como energia manipulável.",
        ["João 14:16-17", "Atos 13:2", "Efésios 4:30"],
      ),
      chapter(
        "deidade-espirito",
        "A Deidade do Espírito Santo",
        "O Espírito possui atributos e obras divinas e é colocado junto do Pai e do Filho no batismo e na bênção apostólica. Mentir ao Espírito é mentir a Deus, e o templo do Espírito é o templo de Deus. A plena divindade do Espírito é necessária para que sua obra de regeneração e santificação seja obra do próprio Senhor.",
        ["Atos 5:3-4", "1 Coríntios 3:16", "Mateus 28:19"],
      ),
      chapter(
        "obra-espirito-antigo-testamento",
        "A Obra do Espírito Santo no Antigo Testamento",
        "O Espírito participa da criação, capacita líderes, inspira profetas e fortalece pessoas para tarefas específicas. O Antigo Testamento já revela sua personalidade e ação, embora anuncie uma medida mais ampla e comunitária na nova aliança. A continuidade mostra que o Espírito não é novidade tardia, mas o próprio Deus atuando na história.",
        ["Gênesis 1:2", "Juízes 14:6", "1 Samuel 16:13"],
      ),
      chapter(
        "obra-espirito-nova-alianca",
        "A Obra do Espírito Santo na Nova Aliança",
        "Na nova aliança, o Espírito habita no povo de Deus, regenera, sela, santifica, distribui dons e conduz a Igreja no testemunho de Cristo. Pentecostes não cria um Deus novo, mas inaugura uma etapa decisiva da promessa. Toda experiência do Espírito deve conduzir à exaltação de Jesus e à edificação do corpo.",
        ["João 3:5-8", "Atos 2:1-4", "1 Coríntios 12:12-13"],
      ),
      chapter(
        "batismo-espirito-santo",
        "O Batismo no Espírito Santo",
        "O batismo no Espírito é descrito como a ação pela qual Deus incorpora o crente ao corpo de Cristo e o capacita para o testemunho. Igrejas explicam de forma diferente sua relação com a conversão e com experiências posteriores; este texto preserva a unidade em Cristo e evita transformar um sinal específico em medida de superioridade espiritual.",
        ["Mateus 3:11", "Atos 1:8", "1 Coríntios 12:13"],
      ),
      chapter(
        "preenchimento-espirito",
        "O Preenchimento do Espírito Santo",
        "Ser cheio do Espírito é viver sob sua influência, com mente renovada, gratidão, submissão e coragem para testemunhar. Não é uma emoção que precisa ser constantemente perseguida, mas uma vida de dependência que pode ser renovada diariamente. O fruto aparece no caráter e na edificação da comunidade.",
        ["Efésios 5:18-21", "Atos 4:31", "Gálatas 5:22-23"],
      ),
      chapter(
        "dons-espirituais",
        "Os Dons Espirituais",
        "Dons são capacidades concedidas pela graça para servir e edificar a Igreja, não medalhas de maturidade nem instrumentos de autopromoção. A diversidade é intencional: um só Espírito distribui como quer e chama cada pessoa ao amor. O dom só cumpre seu propósito quando está submetido à verdade e ao bem comum.",
        ["1 Coríntios 12:4-11", "Romanos 12:3-8", "1 Pedro 4:10-11"],
      ),
      chapter(
        "contemporaneidade-dons",
        "A Contemporaneidade dos Dons Espirituais",
        "Há divergência legítima entre cristãos sobre a continuidade de dons extraordinários. Este material adota uma posição cessacionista moderada: reconhece a obra presente do Espírito e os dons de serviço, mas entende que a revelação normativa e os sinais ligados à fundação apostólica não continuam com a mesma função e autoridade. Toda alegação deve ser julgada pela Escritura e pelo fruto produzido.",
        ["1 Coríntios 13:8-12", "Hebreus 2:3-4", "1 Coríntios 14:26-33"],
      ),
      chapter(
        "fruto-espirito",
        "O Fruto do Espírito",
        "O fruto do Espírito é a formação de um caráter semelhante ao de Cristo, visível em amor, alegria, paz, paciência, bondade, fidelidade, mansidão e domínio próprio. Não é uma lista para autopontuação, mas uma vida que cresce pela união com Cristo. O fruto dá credibilidade ao testemunho e protege a Igreja de espiritualidade sem caráter.",
        ["Gálatas 5:22-23", "João 15:4-5", "Colossenses 3:12-14"],
      ),
      chapter(
        "formacao-carater",
        "A Formação do Caráter",
        "O Espírito forma o caráter por meio da Palavra, da comunhão, da correção, do sofrimento e da prática perseverante da fé. A santificação é graça, mas também envolve decisões concretas de abandonar o pecado e cultivar a justiça. O alvo não é uma personalidade religiosa artificial, e sim a semelhança com Cristo.",
        ["2 Coríntios 3:18", "Romanos 8:13-14", "Filipenses 2:12-13"],
      ),
    ],
  },
  {
    id: "soteriologia",
    title: "Soteriologia",
    subtitle: "A salvação realizada por Deus",
    chapters: [
      chapter(
        "graca-preveniente",
        "A Graça Preveniente",
        "Graça preveniente é um termo teológico usado especialmente na tradição arminiana para descrever a ação graciosa de Deus que antecede e torna possível a resposta humana ao Evangelho. A Bíblia afirma que Deus toma a iniciativa, ilumina, chama e atrai; também chama pessoas reais ao arrependimento. A doutrina deve exaltar a graça, não transformar a resposta em mérito.",
        ["João 12:32", "Tito 2:11", "João 6:44"],
      ),
      chapter(
        "chamado-universal-evangelho",
        "O Chamado Universal do Evangelho",
        "O Evangelho é uma proclamação pública de que Jesus é Senhor e de que todos devem arrepender-se e crer. A Igreja anuncia sem discriminação, confiando que Deus usa a mensagem para chamar seu povo e confrontar o mundo. O chamado é urgente, porque a graça não deve ser adiada.",
        ["Mateus 28:19-20", "Atos 17:30-31", "Romanos 10:13-17"],
      ),
      chapter(
        "regeneracao",
        "A Regeneração",
        "Regeneração é a obra do Espírito pela qual Deus concede nova vida e transforma o coração. Ela não é apenas uma decisão pública ou uma reforma moral, mas uma ação profunda que inaugura novos desejos e uma nova relação com Deus. A pessoa regenerada passa a viver pela fé e começa a produzir frutos de obediência.",
        ["Tito 3:5", "Ezequiel 36:26-27", "2 Coríntios 5:17"],
      ),
      chapter(
        "novo-nascimento",
        "O Novo Nascimento",
        "Jesus ensinou que ninguém vê o Reino sem nascer de novo, isto é, nascer da água e do Espírito. O novo nascimento é necessário para todos, inclusive para pessoas religiosas, porque a salvação não é herdada por tradição. Ele gera uma vida que reconhece a verdade, ama a luz e se volta para Cristo.",
        ["João 3:3-8", "1 Pedro 1:23", "João 1:12-13"],
      ),
      chapter(
        "arrependimento",
        "O Arrependimento (Metanoia)",
        "Arrependimento é mudança de mente, direção e lealdade diante de Deus, não apenas remorso emocional. A metanoia bíblica abandona o pecado e se volta para a misericórdia de Deus em Cristo. Ela é dom e resposta: Deus concede arrependimento, e a pessoa é chamada a praticá-lo de forma concreta.",
        ["Marcos 1:15", "Atos 2:38", "2 Coríntios 7:10"],
      ),
      chapter(
        "fe-salvadora",
        "A Fé Salvadora",
        "A fé salvadora confia na pessoa e na promessa de Cristo, não em uma ideia vaga de Deus nem em obras de autopromoção. Ela inclui conhecimento, assentimento e entrega, e se torna visível no amor e na obediência. As obras não compram a salvação, mas a fé viva nunca permanece estéril.",
        ["Efésios 2:8-10", "Romanos 10:9-10", "Tiago 2:17-18"],
      ),
      chapter(
        "justificacao-forense",
        "A Justificação Forense",
        "Justificação é o veredito gracioso pelo qual Deus declara justo o pecador que crê, com base na obra de Cristo. A linguagem forense não reduz a salvação a uma formalidade: o mesmo Deus que perdoa também inicia a renovação da vida. A justiça recebida é dom, e a nova posição produz paz e serviço.",
        ["Romanos 3:24-26", "Romanos 4:5-8", "Romanos 5:1"],
      ),
      chapter(
        "adocao-familia-deus",
        "A Adoção na Família de Deus",
        "Em Cristo, o salvo não recebe apenas perdão jurídico, mas é recebido como filho e herdeiro. A adoção comunica intimidade, disciplina, segurança e uma nova identidade comunitária. O Espírito ensina o crente a clamar ao Pai e a tratar os irmãos como família da fé.",
        ["Romanos 8:15-17", "Gálatas 4:4-7", "Efésios 1:5"],
      ),
      chapter(
        "santificacao-progressiva",
        "A Santificação Progressiva",
        "Santificação é a obra contínua pela qual Deus conforma o crente à imagem de Cristo. Ela envolve a ação do Espírito e a participação obediente do cristão em práticas como oração, Palavra, comunhão, confissão e serviço. O crescimento é real, mas gradual; a Igreja deve unir verdade, paciência e correção.",
        ["1 Tessalonicenses 4:3", "2 Coríntios 3:18", "Filipenses 2:12-13"],
      ),
      chapter(
        "presciencia-divina",
        "A Presciência Divina",
        "A presciência bíblica não é mera previsão fria, mas conhecimento pessoal de Deus. Cristãos interpretam de modos diferentes a relação entre presciência, eleição e liberdade, e textos como Romanos 8 e 1 Pedro 1 precisam ser lidos sem caricaturar nenhuma tradição fiel. A certeza comum é que a salvação começa na iniciativa graciosa de Deus.",
        ["Romanos 8:29-30", "1 Pedro 1:1-2", "Amós 3:2"],
      ),
      chapter(
        "eleicao-corporativa",
        "A Eleição Corporativa em Cristo",
        "A eleição corporativa enfatiza que Deus escolhe um povo em união com Cristo e o chama a participar da bênção e da missão da nova aliança. Essa leitura procura valorizar textos que falam da eleição de Cristo, da Igreja e das nações, sem negar a responsabilidade pessoal de crer. O debate deve ser conduzido com reverência, porque a eleição bíblica sempre conduz à santidade e ao serviço.",
        ["Efésios 1:3-6", "1 Pedro 2:9-10", "Efésios 2:10"],
      ),
      chapter(
        "seguranca-crente",
        "A Segurança do Crente",
        "A segurança do crente repousa na fidelidade de Deus, na obra concluída de Cristo e no testemunho do Espírito. Ela não autoriza indiferença moral nem transforma uma profissão vazia em garantia automática. A perseverança é fruto da graça e se manifesta em fé contínua, arrependimento e apego a Jesus.",
        ["João 10:27-29", "Romanos 8:31-39", "1 João 5:11-13"],
      ),
      chapter(
        "alerta-apostasia",
        "O Alerta Bíblico contra a Apostasia",
        "As advertências bíblicas contra abandonar a fé são reais e devem ser lidas pastoralmente, não usadas para produzir desespero ou segurança carnal. Tradições cristãs diferem sobre a possibilidade final de apostasia, mas todas reconhecem a seriedade de rejeitar deliberadamente Cristo. A resposta bíblica é perseverar, encorajar os irmãos e buscar a misericórdia enquanto se chama hoje.",
        ["Hebreus 6:4-6", "Hebreus 10:26-31", "Hebreus 3:12-14"],
      ),
      chapter(
        "glorificacao",
        "A Glorificação",
        "Glorificação é a consumação da salvação, quando Deus ressuscitará seu povo e o conformará plenamente à imagem do Filho. O corpo será transformado, a corrupção será vencida e a presença de Deus será desfrutada sem pecado. A esperança futura sustenta a perseverança no presente.",
        ["Romanos 8:30", "Filipenses 3:20-21", "1 Coríntios 15:51-57"],
      ),
    ],
  },
  {
    id: "eclesiologia",
    title: "Eclesiologia",
    subtitle: "A natureza e a missão da Igreja",
    chapters: [
      chapter(
        "igreja-organismo-universal",
        "A Igreja como Organismo Universal",
        "A Igreja universal é o povo de Deus unido a Cristo, formado por pessoas de todas as nações e épocas. Ela é chamada corpo, noiva, templo e família, imagens que destacam comunhão, santidade, dependência e missão. Nenhuma denominação esgota a Igreja de Cristo.",
        ["Efésios 1:22-23", "1 Coríntios 12:12-13", "Apocalipse 7:9-10"],
      ),
      chapter(
        "igreja-assembleia-local",
        "A Igreja como Assembleia Local",
        "O Novo Testamento também fala de igrejas concretas que se reúnem, adoram, ensinam, celebram as ordenanças, cuidam dos necessitados e exercem disciplina. A igreja local não é apenas um prédio ou uma transmissão digital; é uma comunidade responsável diante de Deus e dos irmãos. A vida cristã normal inclui pertencimento e participação.",
        ["Atos 2:42-47", "1 Coríntios 1:2", "Hebreus 10:24-25"],
      ),
      chapter(
        "marcas-igreja-verdadeira",
        "As Marcas de uma Igreja Verdadeira",
        "A Escritura oferece sinais de uma comunidade saudável: fidelidade ao ensino apostólico, centralidade de Cristo, prática das ordenanças, amor, santidade, cuidado e missão. Nenhuma igreja é perfeita, mas uma comunidade verdadeira recebe correção e não transforma sua marca principal em personalidade, celebridade ou poder.",
        ["Atos 2:42", "João 13:34-35", "Apocalipse 2:1-7"],
      ),
      chapter(
        "propositos-igreja",
        "Os Propósitos da Igreja",
        "A Igreja existe para adorar a Deus, edificar os santos, anunciar o Evangelho, praticar justiça e testemunhar o Reino. Esses propósitos não competem entre si: a adoração alimenta a missão, a doutrina sustenta o amor e o cuidado com o próximo torna visível a mensagem. Uma igreja madura forma discípulos que fazem discípulos.",
        ["Mateus 28:19-20", "Efésios 4:11-16", "1 Pedro 2:9"],
      ),
      chapter(
        "governo-eclesiastico",
        "O Governo Eclesiástico",
        "O Novo Testamento apresenta liderança responsável, pluralidade de presbíteros, participação da comunidade e prestação de contas. Igrejas adotam modelos congregacionais, presbiterianos ou episcopais; o modelo não pode ser usado para fugir dos princípios de serviço, caráter, transparência e cuidado com o rebanho.",
        ["Atos 15:1-29", "1 Timóteo 3:1-7", "1 Pedro 5:1-4"],
      ),
      chapter(
        "autonomia-congregacional",
        "A Autonomia Congregacional",
        "A autonomia congregacional significa que a igreja local responde diretamente a Cristo e toma decisões em comunidade, sem negar cooperação entre igrejas. Autonomia não é isolamento nem licença para o líder agir sem prestação de contas. A independência saudável caminha com unidade, aconselhamento e compromisso com o corpo de Cristo.",
        ["Atos 6:1-6", "2 Coríntios 8:1-5", "Mateus 18:15-20"],
      ),
      chapter(
        "oficio-pastoral",
        "O Ofício Pastoral",
        "O pastor é chamado a ensinar, proteger, conduzir e cuidar do rebanho com caráter irrepreensível. A autoridade pastoral é ministerial e limitada pela Palavra; não é domínio sobre a consciência nem privilégio para abuso. A liderança de Jesus, que serve e dá a vida, é o padrão para todo pastor.",
        ["1 Timóteo 3:1-7", "1 Pedro 5:1-4", "Marcos 10:42-45"],
      ),
      chapter(
        "oficio-diaconal",
        "O Ofício Diaconal",
        "O diaconato expressa o cuidado prático e espiritual da Igreja, protegendo a comunhão e permitindo que necessidades reais sejam atendidas com sabedoria. O serviço não é uma função inferior: a palavra e a mesa pertencem à mesma missão. Diáconos precisam de caráter, maturidade e amor, não apenas eficiência.",
        ["Atos 6:1-6", "1 Timóteo 3:8-13", "Filipenses 1:1"],
      ),
      chapter(
        "ordenanca-batismo",
        "A Ordenança do Batismo",
        "O batismo é o sinal público de união com Cristo, arrependimento e entrada na comunidade visível da fé. Ele dramatiza a morte e a ressurreição com Jesus e chama o discípulo a uma nova vida. Igrejas divergem sobre detalhes da prática, mas concordam que o batismo aponta para a graça de Cristo e não é uma obra que compra salvação.",
        ["Mateus 28:19-20", "Romanos 6:3-4", "Atos 2:38-41"],
      ),
      chapter(
        "ordenanca-ceia",
        "A Ordenança da Ceia do Senhor",
        "Na Ceia, a Igreja recorda e proclama a morte de Cristo, participa da comunhão do corpo e aguarda sua volta. O pão e o cálice não são acessórios de um evento social, mas sinais santos que pedem fé, gratidão, reconciliação e discernimento. A mesa não deve ser usada para excluir os fracos nem para alimentar divisões.",
        ["Lucas 22:19-20", "1 Coríntios 10:16-17", "1 Coríntios 11:23-29"],
      ),
      chapter(
        "sacerdocio-universal",
        "O Sacerdócio Universal dos Crentes",
        "Todo cristão tem acesso a Deus por meio de Cristo e é chamado a oferecer sua vida em adoração e serviço. Isso não elimina a necessidade de líderes reconhecidos, pois o próprio Novo Testamento ordena ministérios; impede, porém, uma classe que monopolize a graça ou a missão. A Igreja inteira participa do testemunho.",
        ["1 Pedro 2:5,9", "Apocalipse 1:5-6", "Hebreus 10:19-22"],
      ),
      chapter(
        "adoracao",
        "A Adoração",
        "Adoração é a resposta integral ao valor de Deus, envolvendo corpo, mente, afetos, trabalho e reunião da Igreja. Cânticos são importantes, mas não esgotam a adoração; justiça, generosidade e obediência também são culto. A forma pode variar entre culturas, mas o centro é Deus, não o desempenho humano.",
        ["João 4:23-24", "Romanos 12:1-2", "Colossenses 3:16-17"],
      ),
      chapter(
        "comunhao",
        "A Comunhão",
        "Comunhão é participação compartilhada na vida de Cristo, na verdade, nos bens, nos sofrimentos e na esperança. Ela exige presença, hospitalidade, perdão e disposição para carregar os fardos uns dos outros. Uma comunidade que fala de comunhão, mas tolera isolamento e negligência, contradiz o Evangelho.",
        ["Atos 2:42-47", "Gálatas 6:2", "1 João 1:7"],
      ),
      chapter(
        "missao-integral",
        "A Missão Integral da Igreja",
        "A missão integral anuncia o Evangelho e manifesta o amor de Deus no cuidado com pessoas e comunidades. A Igreja não deve substituir a salvação por ativismo social, nem usar a evangelização para ignorar fome, injustiça e vulnerabilidade. Em Cristo, palavra e prática caminham juntas, com humildade e justiça.",
        ["Mateus 25:35-40", "Tiago 2:14-17", "Mateus 28:19-20"],
      ),
    ],
  },
  {
    id: "escatologia",
    title: "Escatologia",
    subtitle: "A consumação do plano de Deus",
    chapters: [
      chapter(
        "morte-fisica",
        "A Morte Física",
        "A morte física é apresentada como inimiga, consequência da queda e realidade que será finalmente vencida por Cristo. A Bíblia não manda romantizar a morte, mas permite lamentá-la com esperança. Para quem está em Cristo, a morte não tem a palavra final, embora continue sendo uma separação dolorosa.",
        ["Hebreus 9:27", "1 Coríntios 15:26", "João 11:25-26"],
      ),
      chapter(
        "estado-intermediario",
        "O Estado Intermediário da Alma",
        "Entre a morte e a ressurreição final, a Bíblia oferece esperança de comunhão com Cristo e juízo, mas não apresenta todos os detalhes do estado intermediário. Textos poéticos e parábolas devem ser lidos com cuidado, sem construir mapas do além a partir de uma única imagem. A certeza cristã é que estar com Cristo é melhor e que a redenção será plenamente corporal.",
        ["Lucas 23:43", "Filipenses 1:23", "2 Coríntios 5:6-8"],
      ),
      chapter(
        "segunda-vinda",
        "A Segunda Vinda de Cristo (Parousia)",
        "A segunda vinda será pessoal, visível, gloriosa e decisiva. Jesus não retorna para uma nova oportunidade de anunciar o Evangelho, mas para ressuscitar, julgar, reunir seu povo e consumar seu Reino. A expectativa não deve produzir cálculos de datas, e sim vigilância, santidade e missão.",
        ["Atos 1:11", "1 Tessalonicenses 4:16-17", "Mateus 24:36-44"],
      ),
      chapter(
        "pre-milenarismo",
        "O Pré-milenarismo",
        "O pré-milenarismo entende que a volta de Cristo precede um reino milenar descrito em Apocalipse 20. Há versões diferentes dentro dessa posição, especialmente sobre a relação entre Israel, Igreja e tribulação. O ponto principal é a esperança de que Cristo reinará de modo vitorioso antes da consumação final.",
        ["Apocalipse 20:1-6", "1 Coríntios 15:23-26", "Isaías 11:1-10"],
      ),
      chapter(
        "amilenarismo",
        "O Amilenarismo",
        "O amilenarismo interpreta o milênio de Apocalipse 20 de forma simbólica ou como realidade presente do reinado de Cristo entre sua primeira e segunda vindas. A posição enfatiza a unidade do povo de Deus e a consumação associada ao retorno de Cristo. Como toda leitura escatológica, deve respeitar o gênero apocalíptico e reconhecer limites interpretativos.",
        ["Apocalipse 20:1-6", "João 5:28-29", "Efésios 2:4-7"],
      ),
      chapter(
        "pos-milenarismo",
        "O Pós-milenarismo",
        "O pós-milenarismo entende que a expansão do Evangelho conduzirá a uma ampla manifestação do Reino antes da volta de Cristo, sem necessariamente imaginar uma era sem pecado. Seus defensores destacam as promessas de crescimento do Reino e a missão histórica da Igreja. A esperança deve sempre manter a dependência da graça e a certeza de que a consumação pertence ao Senhor.",
        ["Mateus 13:31-33", "Apocalipse 20:1-6", "Salmos 22:27-28"],
      ),
      chapter(
        "ressurreicao-final",
        "A Ressurreição Final",
        "A esperança cristã é a ressurreição do corpo, não a libertação definitiva da matéria. Deus transformará o corpo corruptível em incorruptível e reunirá a pessoa inteira com ele. A ressurreição confirma que a criação importa e que a salvação alcança tudo o que o pecado destruiu.",
        ["João 5:28-29", "1 Coríntios 15:42-49", "Daniel 12:2"],
      ),
      chapter(
        "juizo-final",
        "O Juízo Final",
        "Deus julgará com justiça por meio de Cristo, revelando a verdade das obras e dos corações. O juízo não contradiz a salvação pela graça: as obras evidenciam a realidade da fé e a responsabilidade humana. A cena final consola vítimas de injustiça e chama a Igreja a viver em integridade.",
        ["Mateus 25:31-46", "Apocalipse 20:11-15", "2 Coríntios 5:10"],
      ),
      chapter(
        "justica-retributiva",
        "A Justiça Retributiva",
        "A justiça retributiva afirma que Deus leva o mal a sério e julga cada pessoa com verdade, sem favoritismo. Ela não autoriza vingança privada, pois o juízo pertence a Deus e deve orientar a sociedade a buscar justiça responsável. Na cruz, vemos simultaneamente a gravidade do pecado e a oferta de reconciliação.",
        ["Romanos 2:6-11", "Romanos 12:19", "Apocalipse 20:12"],
      ),
      chapter(
        "castigo-final-gehena",
        "O Castigo Final na Geena",
        "Jesus e os apóstolos tratam o juízo final como realidade séria, usando imagens de fogo, trevas, perda e exclusão da presença favorável de Deus. A linguagem exige reverência e não permite especulação sensacionalista. A Igreja anuncia a salvação com lágrimas, justiça e urgência, confiando no caráter perfeito do Juiz.",
        ["Marcos 9:43-48", "Mateus 10:28", "Apocalipse 21:8"],
      ),
      chapter(
        "novos-ceus",
        "Os Novos Céus",
        "A esperança bíblica não é um céu desincorporado e desconectado da história, mas a renovação cósmica sob o governo de Deus. Os novos céus indicam que o domínio criado será purificado da corrupção e reconciliado com o propósito original. O futuro cristão é cósmico, santo e centrado na presença de Deus.",
        ["Isaías 65:17", "2 Pedro 3:13", "Apocalipse 21:1"],
      ),
      chapter(
        "nova-terra",
        "A Nova Terra",
        "Na nova terra, Deus habitará com seu povo, a morte será vencida e não haverá luto, dor ou maldição. A visão final retoma a criação e mostra uma cidade-jardim onde a presença do Cordeiro ilumina tudo. Essa promessa alimenta perseverança, cuidado com o mundo presente e esperança ativa.",
        ["Apocalipse 21:1-5", "Apocalipse 22:1-5", "Romanos 8:19-23"],
      ),
    ],
  },
];
