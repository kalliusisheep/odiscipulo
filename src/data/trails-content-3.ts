// Módulo 2 — Fundamentos da Fé.
// Dez lições progressivas: começam simples (autoridade da Bíblia) e vão
// se aprofundando até temas mais densos (escatologia). Cada lição já
// inclui conteúdo de "Aprofundar" (campo `deepen`).

import type { Trail } from "./content";

const fundamentosDaFe: Trail = {
  id: "fundamentos-da-fe",
  title: "Fundamentos da Fé",
  description: "As grandes verdades que sustentam toda a vida cristã, do começo ao fim da história da redenção.",
  icon: "BookOpen",
  color: "from-sky-500 to-blue-600",
  order: 2,
  modules: [
    {
      id: "fd-mod-1",
      title: "Módulo II: Fundamentos da Fé",
      lessons: [
        // ───────────────────────────── 1 ─────────────────────────────
        {
          id: "fd-1",
          title: "Autoridade das Escrituras",
          difficulty: 1,
          intro: [
            "Antes de aprender qualquer doutrina, é preciso responder a uma pergunta anterior a todas: por que confiar na Bíblia? Se ela não é digna de confiança, nada do que ela ensina tem peso. Se é, tudo muda.",
            "A Bíblia não se apresenta como uma coleção de boas ideias religiosas. Paulo diz a Timóteo que toda a Escritura é 'inspirada por Deus' — literalmente, 'soprada por Deus'. Não é um livro sobre Deus; é, em certo sentido, a própria voz de Deus em palavras humanas.",
            "Isso não significa que a Bíblia caiu do céu pronta. Deus falou por meio de homens reais, em línguas, culturas e momentos históricos concretos — e, ainda assim, o que resultou é exatamente o que Ele quis comunicar, sem erro no que afirma.",
          ],
          verses: [
            {
              ref: "2 Timóteo 3:16-17",
              textByVersion: {
                NVI: "Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça, para que o homem de Deus seja apto e plenamente preparado para toda boa obra.",
                NVT: "Toda a Escritura é inspirada por Deus e é útil para nos ensinar o que é verdade e para nos fazer perceber o que há de errado em nossa vida. Ela nos corrige quando estamos errados e nos ensina a fazer o que é certo.",
              },
              originals: [
                { word: "θεόπνευστος", translit: "theópneustos", meaning: "'soprada por Deus' — literalmente, com o próprio fôlego divino", lang: "grego" },
              ],
            },
            {
              ref: "Salmos 119:105",
              textByVersion: {
                NVI: "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.",
                NVT: "Tua palavra é lâmpada que ilumina o meu caminho e luz que clareia a minha jornada.",
              },
            },
          ],
          keywords: [
            { word: "θεόπνευστος", translit: "theópneustos", meaning: "'soprada por Deus'. A Escritura tem origem divina, ainda que escrita por mãos humanas.", lang: "grego" },
            { word: "נֵר", translit: "ner", meaning: "'lâmpada'. Imagem hebraica de luz suficiente para o próximo passo — não para enxergar tudo de uma vez.", lang: "hebraico" },
          ],
          deepDive:
            "Chamamos essa doutrina de 'inspiração verbal e plenária': cada palavra da Escritura (verbal), em todas as suas partes (plenária), carrega autoridade divina. Isso não apaga a personalidade dos autores humanos — Paulo escreve como Paulo, Lucas como Lucas —, mas garante que o que eles escreveram é exatamente o que Deus quis registrar. Um erro comum é tratar a Bíblia como um livro de regras soltas, abrindo em qualquer página em busca de uma frase de efeito. A imagem do salmista é outra: lâmpada para os pés, não holofote para o horizonte inteiro. A Escritura ilumina o passo de hoje, e confiamos que continuará iluminando o de amanhã.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "A Bíblia não precisa ser defendida; solte-a, e ela se defenderá sozinha.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Spurgeon realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "O que significa 'theópneustos' em 2 Timóteo 3:16?",
              options: ["Antigo e valioso", "Soprado por Deus", "Traduzido com cuidado", "Aprovado pelos apóstolos"],
              correctIndex: 1,
              explanation: "'Theópneustos' descreve a origem divina do texto: Deus o 'soprou'.",
            },
            {
              question: "Segundo o Salmo 119:105, a Palavra de Deus é comparada a:",
              options: ["Um mapa completo do futuro", "Uma lâmpada para o próximo passo", "Um livro de leis apenas", "Um talismã de proteção"],
              correctIndex: 1,
              explanation: "A imagem é de luz suficiente e progressiva, não de visão total e imediata.",
            },
          ],
          application:
            "Escolha um horário fixo nos próximos sete dias para ler um capítulo da Bíblia sem pressa, perguntando: 'o que isso revela sobre Deus, e o que devo fazer com isso hoje?'",
          prayer:
            "Senhor, obrigado por teres falado. Tua Palavra não é distante nem opcional — é lâmpada para os meus passos. Dá-me fome por ela, humildade para recebê-la mesmo quando confronta minhas ideias, e coragem para obedecer o que já entendo, enquanto aprendo o que ainda não entendo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Anote, ao final de cada leitura bíblica desta semana, uma frase começando com 'Isso me mostra que Deus é...' — um pequeno hábito que treina o olhar para enxergar a Deus no texto, não apenas informações.",
          reflectionQuestion:
            "Se a Bíblia é realmente a Palavra de Deus, o que isso muda na forma como você a trata no seu dia a dia — não apenas no que você crê sobre ela?",
          xp: 20,
          deepen: {
            historicalContext:
              "O cânon do Novo Testamento não foi 'decidido' por um concílio que escolheu livros arbitrariamente séculos depois. Os primeiros cristãos já reconheciam e citavam os escritos apostólicos como Escritura ainda no primeiro século (2 Pedro 3:15-16 já chama as cartas de Paulo de 'Escrituras'). Os concílios posteriores apenas confirmaram formalmente o que a igreja já usava e reconhecia havia gerações.",
            theologicalDebate:
              "Existe divergência legítima entre cristãos fiéis sobre até que ponto a inerrância se aplica a detalhes científicos e cronológicos incidentais versus ao propósito teológico e moral do texto. Isso é uma questão secundária; o essencial — que a Escritura é digna de confiança total naquilo que afirma sobre Deus, o homem e a salvação — é compartilhado por toda a ortodoxia histórica.",
            secondQuote: {
              author: "Luiz Sayão",
              text: "A Bíblia não é um livro de respostas mágicas; é a revelação de um Deus que quer ser conhecido.",
            },
          },
        },
        // ───────────────────────────── 2 ─────────────────────────────
        {
          id: "fd-2",
          title: "Deus e a Trindade",
          difficulty: 1,
          intro: [
            "Se a Bíblia é confiável, a próxima pergunta é inevitável: confiável para dizer o quê sobre quem? A resposta central da Escritura é: um só Deus, eternamente Pai, Filho e Espírito Santo.",
            "Essa não é uma fórmula abstrata para ser memorizada e esquecida. É a descrição do Deus que existe, em si mesmo, como comunhão eterna — e que criou você para viver em comunhão, com Ele e com os outros.",
            "A igreja não inventou a Trindade; ela a reconheceu ao ler com atenção como o Pai, o Filho e o Espírito são tratados nas Escrituras — cada um plenamente Deus, e ainda assim um só Deus.",
          ],
          verses: [
            {
              ref: "Mateus 28:19",
              textByVersion: {
                NVI: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai e do Filho e do Espírito Santo.",
                NVT: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, do Filho e do Espírito Santo.",
              },
              originals: [
                { word: "ὄνομα", translit: "ónoma", meaning: "'nome', no singular — um só nome para as três Pessoas", lang: "grego" },
              ],
            },
            {
              ref: "2 Coríntios 13:14",
              textByVersion: {
                NVI: "A graça do Senhor Jesus Cristo, o amor de Deus e a comunhão do Espírito Santo sejam com vocês todos.",
                NVT: "Que a graça do Senhor Jesus Cristo, o amor de Deus e a comunhão do Espírito Santo estejam com todos vocês.",
              },
            },
          ],
          keywords: [
            { word: "ὄνομα", translit: "ónoma", meaning: "'nome' no singular para as três Pessoas em Mateus 28:19 — um só Deus, três distinções pessoais.", lang: "grego" },
          ],
          deepDive:
            "A Trindade não é matemática (3 = 1), mas revelação: um só Deus, eternamente três Pessoas distintas, iguais em essência e glória, unidas em amor. O erro mais comum é imaginar 'três modos' de um mesmo Deus aparecendo em momentos diferentes — isso já foi rejeitado pela igreja antiga como distorção. O Pai não é o Filho, o Filho não é o Espírito, mas os três são, cada um, plenamente Deus. Isso importa na prática: um Deus que é, em si mesmo, relacionamento, não criou você para uma fé isolada. A comunhão que existe dentro da Trindade é o modelo da comunhão que Ele quer construir na igreja.",
          theologianQuote: {
            author: "Wayne Grudem",
            text: "A doutrina da Trindade é, em essência, mistério — mas mistério revelado, não inventado.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Wayne Grudem realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "A doutrina da Trindade afirma que:",
              options: [
                "Deus aparece em três formas diferentes, uma de cada vez",
                "Existem três deuses trabalhando juntos",
                "Um só Deus existe eternamente em três Pessoas distintas",
                "Jesus e o Espírito são criações do Pai",
              ],
              correctIndex: 2,
              explanation: "Um Deus, três Pessoas coeternas e coiguais — não três deuses, nem três disfarces.",
            },
            {
              question: "Em Mateus 28:19, o batismo é feito em:",
              options: ["Três nomes diferentes", "Um só nome — do Pai, do Filho e do Espírito", "Nome apenas de Jesus, sem menção aos outros", "Nome da igreja"],
              correctIndex: 1,
              explanation: "'Nome' aparece no singular grego, sugerindo unidade de essência nas três Pessoas.",
            },
          ],
          application:
            "Em sua oração desta semana, dirija-se conscientemente às três Pessoas: agradeça ao Pai por ter planejado a salvação, ao Filho por tê-la realizado na cruz, e ao Espírito por aplicá-la e habitar em você.",
          prayer:
            "Deus Trino, tu és mistério que adoramos e revelação que recebemos com fé. Obrigado por seres, em ti mesmo, comunhão perfeita — e por me convidar a participar dela. Ensina-me a conhecer-te como Pai, seguir-te como Filho e ser guiado por ti como Espírito. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva três frases curtas de fé pessoal — uma sobre o Pai, uma sobre o Filho, uma sobre o Espírito — e leia-as em voz alta antes de dormir esta semana.",
          reflectionQuestion:
            "Como a ideia de um Deus que é, em si mesmo, comunhão eterna, muda o valor que você dá às suas relações na igreja?",
          xp: 20,
          deepen: {
            historicalContext:
              "O termo 'Trindade' não aparece na Bíblia, mas foi cunhado pela igreja (Tertuliano, por volta do ano 200) para resumir o que o texto bíblico já ensinava. O Concílio de Niceia (325) e Constantinopla (381) não criaram a doutrina — combateram distorções (como o arianismo, que negava a plena divindade do Filho) e formalizaram a linguagem que já expressava a fé apostólica.",
            exegeticalNotes:
              "Vale notar que a plena revelação da Trindade só se torna clara no Novo Testamento, à luz da vinda de Cristo e do derramamento do Espírito em Pentecostes — mas sementes dela já aparecem no Antigo Testamento, como em Gênesis 1:26 ('façamos o homem') e no próprio Shemá (Deuteronômio 6:4), que usa 'echad', unidade composta, não solidão absoluta.",
            secondQuote: {
              author: "Hernandes Dias Lopes",
              text: "A Trindade não é problema para a razão explicar, mas verdade para o coração adorar.",
            },
          },
        },
        // ───────────────────────────── 3 ─────────────────────────────
        {
          id: "fd-3",
          title: "Criação e Queda",
          difficulty: 2,
          intro: [
            "Toda história tem um começo. A da Bíblia começa com um Deus que cria por pura vontade — não por necessidade — e declara sua obra 'muito boa'. O mundo não nasceu por acaso nem por conflito entre forças cósmicas; nasceu de uma decisão de amor.",
            "Mas o mesmo capítulo que descreve a bondade original também prepara o terreno para a tragédia seguinte: criaturas livres, capazes de amar a Deus verdadeiramente, também são capazes de se rebelar contra Ele.",
            "Gênesis 3 registra essa rebelião — a Queda. Compreendê-la bem evita dois erros opostos: minimizar o pecado como um simples erro, ou culpar Deus pela existência do mal. O texto não faz nenhum dos dois.",
          ],
          verses: [
            {
              ref: "Gênesis 1:27",
              textByVersion: {
                NVI: "Criou Deus o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.",
                NVT: "Assim Deus criou os seres humanos à sua própria imagem. À imagem de Deus ele os criou; homem e mulher ele os criou.",
              },
              originals: [
                { word: "צֶלֶם", translit: "tzélem", meaning: "'imagem' — representar, refletir o caráter de quem a imagem retrata", lang: "hebraico" },
              ],
            },
            {
              ref: "Romanos 5:12",
              textByVersion: {
                NVI: "Portanto, da mesma forma como o pecado entrou no mundo por um homem, e pelo pecado a morte, assim também a morte veio a todos os homens, porque todos pecaram.",
                NVT: "Quando Adão pecou, o pecado entrou no mundo. O pecado de Adão trouxe a morte, de modo que a morte se espalhou a todos, porque todos pecaram.",
              },
            },
          ],
          keywords: [
            { word: "צֶלֶם", translit: "tzélem", meaning: "'imagem de Deus'. Todo ser humano — não apenas reis ou sacerdotes, como se pensava na Antiguidade — carrega dignidade e propósito divinos.", lang: "hebraico" },
          ],
          deepDive:
            "No mundo antigo, dizer que alguém era 'imagem' de um deus era linguagem reservada a reis. Gênesis rompe esse padrão: todo ser humano, homem e mulher, carrega essa dignidade. Isso é o fundamento bíblico da igualdade humana e do valor de cada vida. A Queda não apaga essa imagem — ela a distorce. Adão e Eva não perdem sua humanidade ao pecar, mas perdem a comunhão não-quebrada com Deus, e essa fratura afeta toda a criação (Romanos 8:20-22). Um erro comum é achar que 'pecado original' significa que Deus nos considera culpados de um crime que não cometemos; a Bíblia ensina algo mais profundo: nascemos numa condição humana já ferida, inclinada a repetir a mesma rebelião de Adão — e é justamente aí que a promessa de um novo Adão, Jesus Cristo, se torna boa notícia.",
          theologianQuote: {
            author: "Francis Schaeffer",
            text: "O homem não é grande o bastante para ser deus, nem pequeno o bastante para ser irrelevante.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Francis Schaeffer realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Ser 'imagem de Deus' em Gênesis 1:27 significa que:",
              options: [
                "Apenas reis e sacerdotes representam Deus",
                "Todo ser humano carrega dignidade e propósito que refletem o Criador",
                "Os seres humanos são deuses menores",
                "Somente o espírito humano, não o corpo, reflete Deus",
              ],
              correctIndex: 1,
              explanation: "Gênesis estende a toda a humanidade uma dignidade que o mundo antigo reservava a reis.",
            },
            {
              question: "Segundo Romanos 5:12, o que entrou no mundo através de um homem?",
              options: ["A sabedoria", "O pecado e, por meio dele, a morte", "As nações", "A lei"],
              correctIndex: 1,
              explanation: "Paulo liga a condição humana caída à desobediência de Adão, preparando o contraste com Cristo.",
            },
          ],
          application:
            "Nesta semana, escolha uma pessoa que você tende a desvalorizar ou julgar rapidamente e lembre-se, antes de reagir: ela também carrega a imagem de Deus. Deixe isso moldar como você a trata.",
          prayer:
            "Criador, obrigado por me teres feito à tua imagem — isso me dá valor que eu não fabriquei e não posso perder. Confesso que, como Adão, também escolho o caminho da minha própria vontade em vez da tua. Obrigado por não teres nos abandonado ao fracasso; a promessa do Redentor começa já em Gênesis 3. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia Gênesis 1 a 3 inteiro de uma só vez esta semana — sem parar para comentários — e anote uma frase sobre o caráter de Deus que aparece em cada capítulo.",
          reflectionQuestion:
            "De que forma acreditar que toda pessoa é 'imagem de Deus' deveria mudar o modo como você fala sobre quem discorda de você?",
          xp: 22,
          deepen: {
            historicalContext:
              "As narrativas de criação do Antigo Oriente Próximo (como o Enuma Elish babilônico) descrevem os deuses criando o mundo em meio a violência e conflito, e os seres humanos como escravos criados para servir aos deuses. Gênesis se opõe ponto a ponto a essa visão: um só Deus cria por palavra, sem luta, e faz da humanidade não escrava, mas imagem — parceira no propósito de cuidar da criação.",
            theologicalDebate:
              "Sobre como interpretar os 'dias' de Gênesis 1 (literais de 24 horas, longos períodos, ou estrutura literária), há divergência legítima entre cristãos fiéis às Escrituras — trata-se de uma questão secundária. O essencial, compartilhado por toda a ortodoxia histórica, é que Deus é o Criador soberano e que a humanidade foi feita à sua imagem.",
            secondQuote: {
              author: "Norman Geisler",
              text: "Negar a Queda não elimina o mal do mundo; apenas nos deixa sem explicação para ele.",
            },
          },
        },
        // ───────────────────────────── 4 ─────────────────────────────
        {
          id: "fd-4",
          title: "História da Redenção",
          difficulty: 2,
          intro: [
            "A Bíblia não é uma coleção de histórias soltas — é uma única grande narrativa, com começo, conflito e resolução: criação, queda, redenção e restauração final. Ler qualquer texto bíblico fora desse mapa maior é como entrar numa sala no meio de um filme.",
            "Desde Gênesis 3:15, logo após a Queda, Deus já promete um libertador que esmagaria o mal. Toda a Escritura que segue — a aliança com Abraão, o êxodo, a lei, os reis, os profetas — caminha na direção dessa promessa.",
            "Jesus mesmo lê as Escrituras assim: depois da ressurreição, ele explica aos discípulos, 'começando por Moisés e todos os profetas', tudo o que se referia a ele (Lucas 24:27). A Bíblia inteira aponta para Cristo.",
          ],
          verses: [
            {
              ref: "Gênesis 12:2-3",
              textByVersion: {
                NVI: "Farei de você um grande povo, e o abençoarei; tornarei famoso o seu nome, e você será uma bênção... por meio de você todos os povos da terra serão abençoados.",
                NVT: "Farei de você uma grande nação. Eu o abençoarei e farei seu nome famoso... todas as famílias da terra serão abençoadas por meio de você.",
              },
            },
            {
              ref: "Lucas 24:27",
              textByVersion: {
                NVI: "E, começando por Moisés e todos os profetas, explicou-lhes o que constava a respeito dele em todas as Escrituras.",
                NVT: "Então Jesus os guiou por todas as Escrituras, começando com os livros de Moisés e todos os profetas, explicando o que diziam a respeito dele mesmo.",
              },
            },
          ],
          keywords: [
            { word: "בְּרָכָה", translit: "berachá", meaning: "'bênção'. A promessa a Abraão nunca foi só para ele — sempre teve as nações em vista.", lang: "hebraico" },
          ],
          deepDive:
            "Teólogos chamam esse fio condutor de 'história da redenção' (ou 'teologia bíblica' em sentido técnico): a Bíblia contada como uma única narrativa que caminha da criação à nova criação, com Cristo no centro. Isso evita dois erros comuns de leitura. O primeiro é o moralismo — tratar cada personagem do Antigo Testamento apenas como 'exemplo a seguir ou evitar', perdendo de vista que a história aponta para algo maior que qualquer herói humano. O segundo é a leitura fragmentada — usar versículos isolados como amuletos, sem perguntar onde aquele texto se encaixa na grande história. Ler bem a Bíblia é perguntar sempre: onde estamos nessa linha do tempo, e como este texto aponta para Cristo?",
          theologianQuote: {
            author: "Tim Keller",
            text: "Toda a Bíblia é, em última análise, sobre Jesus.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Tim Keller realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "A promessa feita a Abraão em Gênesis 12 tinha em vista, desde o início:",
              options: ["Apenas a nação de Israel", "Todas as famílias da terra", "Somente os descendentes diretos de Abraão", "Nenhum propósito além da riqueza pessoal"],
              correctIndex: 1,
              explanation: "'Por meio de você todos os povos da terra serão abençoados' — a bênção sempre teve alcance universal.",
            },
            {
              question: "Em Lucas 24:27, Jesus explica aos discípulos que:",
              options: [
                "As Escrituras não falam sobre ele",
                "Moisés e os profetas escreveram apenas sobre o passado de Israel",
                "Toda a Escritura, desde Moisés, apontava para ele",
                "Apenas os Salmos falavam do Messias",
              ],
              correctIndex: 2,
              explanation: "Jesus lê o Antigo Testamento inteiro como testemunho a seu respeito.",
            },
          ],
          application:
            "Na próxima leitura do Antigo Testamento, antes de perguntar 'o que devo fazer?', pergunte primeiro 'o que isso revela sobre o plano de Deus que culmina em Cristo?'. Depois, então, busque a aplicação.",
          prayer:
            "Senhor da história, obrigado por não teres abandonado o mundo depois da Queda. Desde a primeira promessa em Gênesis 3, tu conduzias tudo para Cristo. Ajuda-me a ler tua Palavra vendo o quadro inteiro, e a confiar que a mesma fidelidade que cumpriu promessas antigas cumprirá as que ainda aguardo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Desenhe (à mão, num papel) uma linha do tempo simples: Criação → Queda → Promessa a Abraão → Êxodo → Reis e Profetas → Cristo → Igreja → Volta de Cristo. Cole em um lugar visível.",
          reflectionQuestion:
            "Como enxergar sua vida como parte dessa grande história — e não apenas uma coleção de eventos soltos — muda o peso que você dá às suas dificuldades atuais?",
          xp: 22,
          deepen: {
            exegeticalNotes:
              "O termo técnico para essa abordagem é 'teologia bíblica' — diferente da 'teologia sistemática', que organiza doutrinas por tema. A teologia bíblica acompanha o desenvolvimento progressivo da revelação através da história, mostrando como cada aliança (com Noé, Abraão, Moisés, Davi) prepara terreno para a Nova Aliança em Cristo (Jeremias 31:31-34, Hebreus 8).",
            theologicalDebate:
              "Há debate legítimo entre tradições cristãs sobre a continuidade entre Israel e a Igreja — se a Igreja 'substitui', 'cumpre' ou 'se soma' às promessas feitas a Israel. Essa é uma questão secundária de interpretação profética; o essencial, compartilhado amplamente, é que Cristo é o centro e o cumprimento de toda a revelação bíblica.",
            secondQuote: {
              author: "D. A. Carson",
              text: "Sem entender a história inteira, cada parte da Bíblia perde seu verdadeiro peso.",
            },
          },
        },
        // ───────────────────────────── 5 ─────────────────────────────
        {
          id: "fd-5",
          title: "A Pessoa de Cristo",
          difficulty: 3,
          intro: [
            "Chegamos ao centro de tudo. Se a história da redenção aponta para Cristo, é hora de perguntar: quem, exatamente, é esse Jesus? Nenhuma outra pergunta divide tanto a humanidade.",
            "A resposta bíblica é ousada e, à primeira vista, difícil de sustentar: Jesus é plenamente Deus e plenamente homem — ao mesmo tempo, sem mistura e sem divisão entre as duas naturezas.",
            "Isso não é um enigma filosófico inventado por teólogos entediados. É a única leitura que faz justiça ao que os evangelhos mostram: um homem que tem fome, chora, se cansa — e também perdoa pecados, acalma tempestades com uma palavra e recebe adoração sem repreender quem o adora.",
          ],
          verses: [
            {
              ref: "João 1:14",
              textByVersion: {
                NVI: "Aquele que é a Palavra tornou-se carne e viveu entre nós. Vimos a sua glória, glória como do Unigênito vindo do Pai, cheio de graça e de verdade.",
                NVT: "E o Verbo se fez carne e habitou entre nós. Vimos a sua glória, a glória do único Filho do Pai, cheio de graça e verdade.",
              },
              originals: [
                { word: "σὰρξ ἐγένετο", translit: "sárx egéneto", meaning: "'se fez carne' — não parecia humano; tornou-se genuinamente humano", lang: "grego" },
              ],
            },
            {
              ref: "Colossenses 1:15-17",
              textByVersion: {
                NVI: "Ele é a imagem do Deus invisível... pois nele foram criadas todas as coisas... e nele tudo subsiste.",
                NVT: "Cristo é a imagem visível do Deus invisível... pois por meio dele Deus criou tudo... ele existe acima de tudo, e é ele quem mantém toda a criação unida.",
              },
            },
          ],
          keywords: [
            { word: "σὰρξ", translit: "sárx", meaning: "'carne' — humanidade real e completa, não uma aparência.", lang: "grego" },
          ],
          deepDive:
            "A igreja antiga precisou de séculos para articular com precisão o que a Bíblia já ensinava: Cristo tem duas naturezas — plenamente divina, plenamente humana — unidas em uma só Pessoa, sem confusão nem separação. Rejeitar sua divindade reduz Jesus a um bom mestre entre outros; rejeitar sua humanidade o torna uma aparição distante, incapaz de realmente entender e representar você diante de Deus. C.S. Lewis resumiu bem o dilema com seu famoso 'trilema': alguém que fala como Jesus falou, afirmando ser Deus, só pode ser louco, mentiroso ou, de fato, Senhor. Não sobra espaço confortável para 'apenas um bom professor'.",
          theologianQuote: {
            author: "C.S. Lewis",
            text: "Não deixamos essa opção aberta. Ele não pretendia deixar.",
            source: "Mere Christianity — ideia real de Lewis; confirme a tradução exata em português antes de publicar",
          },
          quizzes: [
            {
              question: "A doutrina bíblica sobre Jesus Cristo afirma que ele é:",
              options: [
                "Um grande profeta, mas não Deus",
                "Deus disfarçado de homem, sem humanidade real",
                "Plenamente Deus e plenamente homem, em uma só Pessoa",
                "Um anjo elevado à categoria divina",
              ],
              correctIndex: 2,
              explanation: "As duas naturezas — divina e humana — coexistem em Cristo sem mistura nem divisão.",
            },
            {
              question: "'A Palavra se fez carne' (João 1:14) enfatiza que Jesus:",
              options: ["Apenas parecia humano", "Tornou-se genuinamente humano, real e completo", "Deixou de ser divino ao nascer", "Era apenas um símbolo espiritual"],
              correctIndex: 1,
              explanation: "'Sárx egéneto' descreve humanidade real, não uma ilusão ou disfarce.",
            },
          ],
          application:
            "Identifique uma dificuldade que você enfrenta agora — física, emocional ou espiritual. Lembre-se de que Jesus, sendo plenamente humano, já enfrentou cansaço, dor e tentação (Hebreus 4:15), e pode ser abordado com essa dificuldade em oração.",
          prayer:
            "Senhor Jesus, tu és Deus que se fez homem por mim. Confesso que às vezes te trato como uma ideia distante, e não como alguém que realmente viveu, sofreu e triunfou em meu lugar. Ajuda-me a te conhecer como realmente és: Deus próximo o bastante para entender, e Deus grande o bastante para salvar. Em teu nome, amém.",
          weeklyChallenge:
            "Leia um evangelho (Marcos é o mais curto) de uma só vez esta semana, prestando atenção especial aos momentos em que Jesus demonstra humanidade e aos momentos em que revela autoridade divina.",
          reflectionQuestion:
            "Você tende a pensar em Jesus mais como 'Deus distante' ou como 'bom exemplo humano'? O que mudaria se você o conhecesse plenamente nas duas naturezas?",
          xp: 25,
          deepen: {
            historicalContext:
              "O Concílio de Calcedônia (451 d.C.) formulou a chamada 'definição calcedonense': Cristo é reconhecido em duas naturezas, 'sem confusão, sem mudança, sem divisão, sem separação'. Essa fórmula não inventou nada novo — respondeu a heresias específicas: o docetismo (negava a humanidade real de Cristo), o arianismo (negava sua plena divindade) e o nestorianismo (dividia Cristo em duas pessoas).",
            theologicalDebate:
              "Como as duas naturezas de Cristo se relacionam na prática — por exemplo, como Jesus podia 'não saber' o dia de sua volta (Marcos 13:32) sendo Deus — é um tema de reflexão teológica profunda (a doutrina da kénosis, o 'esvaziamento', de Filipenses 2:7). Isso é debatido com nuance entre teólogos fiéis, mas sem abalar o essencial: a unidade das duas naturezas em uma só Pessoa.",
            secondQuote: {
              author: "John Stott",
              text: "Cristo não veio apenas para nos mostrar Deus; veio para nos trazer a Deus.",
            },
          },
        },
        // ───────────────────────────── 6 ─────────────────────────────
        {
          id: "fd-6",
          title: "A Obra de Cristo",
          difficulty: 3,
          intro: [
            "Saber quem Jesus é prepara o terreno para a pergunta seguinte: o que ele fez? A resposta bíblica tem um centro inegociável — a cruz — e um coroamento igualmente essencial — a ressurreição.",
            "A cruz não foi um acidente trágico nem apenas um exemplo de sofrimento injusto. As Escrituras a apresentam como o momento em que Cristo carregou, em nosso lugar, a penalidade que o pecado exige.",
            "E a ressurreição não é um apêndice opcional à história — Paulo é direto: sem ela, a fé cristã seria inútil (1 Coríntios 15:17). Cruz e ressurreição são as duas metades de uma só obra de salvação.",
          ],
          verses: [
            {
              ref: "Isaías 53:5",
              textByVersion: {
                NVI: "Mas ele foi transpassado por causa das nossas transgressões, foi esmagado por causa de nossas iniquidades; o castigo que nos trouxe paz estava sobre ele, e pelas suas feridas fomos curados.",
                NVT: "Mas ele foi ferido e esmagado por nossos pecados. Ele foi castigado para que nós tivéssemos paz; foi ferido para que fôssemos curados.",
              },
            },
            {
              ref: "1 Coríntios 15:3-4",
              textByVersion: {
                NVI: "Que Cristo morreu pelos nossos pecados, segundo as Escrituras, que foi sepultado, que ressuscitou ao terceiro dia, segundo as Escrituras.",
                NVT: "Cristo morreu por nossos pecados, conforme as Escrituras diziam. Ele foi sepultado e ressuscitou no terceiro dia, como as Escrituras haviam predito.",
              },
              originals: [
                { word: "ἱλασμός", translit: "hilasmós", meaning: "'propiciação' — o sacrifício que aplaca justamente a ira contra o pecado", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἱλασμός", translit: "hilasmós", meaning: "'propiciação'. Não é apaziguar um Deus caprichoso — é a solução que o próprio Deus, em amor, provê para sua justiça ser satisfeita.", lang: "grego" },
          ],
          deepDive:
            "A cruz responde a um problema real: Deus é justo e não pode simplesmente ignorar o pecado, mas também é amor e não deseja a destruição do pecador. Na cruz, os dois se encontram — a justiça é satisfeita e o amor se derrama, no mesmo evento. Chamamos isso de expiação substitutiva: Cristo ocupa o lugar que era nosso. Um erro comum é ver a cruz apenas como exemplo moral de sacrifício ('Jesus morreu para nos ensinar a amar') — isso é verdade, mas incompleto; sem a dimensão substitutiva, a cruz perde seu poder de realmente resolver o problema da culpa diante de Deus. A ressurreição, por sua vez, é a prova pública de que o sacrifício foi aceito e a morte, derrotada.",
          theologianQuote: {
            author: "John Stott",
            text: "A cruz é o lugar onde a justiça e a misericórdia de Deus se encontram sem contradição.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Stott realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Isaías 53:5, o sofrimento do Servo foi:",
              options: ["Um acidente injusto", "Um exemplo apenas moral", "Substitutivo — em lugar dos pecadores", "Irrelevante para a salvação"],
              correctIndex: 2,
              explanation: "'Ele foi transpassado por causa das nossas transgressões' descreve substituição, não apenas exemplo.",
            },
            {
              question: "Por que a ressurreição de Cristo é essencial, segundo 1 Coríntios 15?",
              options: [
                "É apenas um símbolo de esperança",
                "Sem ela, a fé cristã seria vazia e inútil",
                "Não é central para o Evangelho",
                "Serve apenas para provar milagres em geral",
              ],
              correctIndex: 1,
              explanation: "Paulo é enfático: a fé cristã depende historicamente da ressurreição real de Cristo.",
            },
          ],
          application:
            "Nesta semana, ao confessar um pecado específico em oração, declare em voz alta: 'Cristo já pagou por isso na cruz' — treinando o hábito de responder à culpa com o Evangelho, não apenas com autocrítica.",
          prayer:
            "Senhor Jesus, na cruz tu levaste o que era meu, para que eu recebesse o que era teu. Não tenho como retribuir isso — só posso recebê-lo com gratidão. Obrigado por teres ressuscitado, provando que teu sacrifício foi suficiente e que a morte não tem a palavra final. Em teu nome, amém.",
          weeklyChallenge:
            "Leia Isaías 53 inteiro e depois um dos relatos da crucificação (João 19 ou Mateus 27). Observe quantos detalhes proféticos se cumprem.",
          reflectionQuestion:
            "Você tende a se relacionar com a cruz mais como um fato histórico distante ou como algo que realmente resolve sua culpa hoje? O que mudaria se fosse a segunda opção?",
          xp: 25,
          deepen: {
            historicalContext:
              "Isaías 53 foi escrito cerca de 700 anos antes de Cristo, décadas antes mesmo da crucificação existir como método de execução romano. A precisão profética — sofrimento silencioso, morte entre malfeitores, sepultamento com o rico — é um dos textos mais debatidos entre judeus e cristãos ao longo da história quanto à identidade do 'Servo Sofredor'.",
            theologicalDebate:
              "Existem diferentes ênfases teológicas sobre 'por quem' Cristo morreu — se a extensão da expiação alcança toda a humanidade de forma oferecida a todos (posição arminiana/geral) ou é limitada de forma eficaz apenas aos eleitos (posição reformada). Essa é uma questão onde cristãos fiéis discordam; o essencial — que a morte de Cristo é suficiente, substitutiva e o único fundamento da salvação — é compartilhado por ambas as tradições.",
            secondQuote: {
              author: "John Wesley",
              text: "Cristo morreu, não apenas para tornar a salvação possível, mas para torná-la real em quem crê.",
            },
          },
        },
        // ───────────────────────────── 7 ─────────────────────────────
        {
          id: "fd-7",
          title: "O Espírito Santo",
          difficulty: 3,
          intro: [
            "Depois da ascensão de Jesus, a igreja não ficou órfã. Antes de partir, Cristo prometeu 'outro Consolador' — o Espírito Santo — que viria habitar permanentemente em cada crente.",
            "O Espírito não é uma força impessoal, como energia ou eletricidade. Ele é a terceira Pessoa da Trindade: pensa, sente, fala, intercede, pode ser entristecido (Efésios 4:30) — plenamente Deus, plenamente pessoal.",
            "Sua obra é ampla: convence o mundo do pecado, regenera o coração na conversão, habita o crente, produz caráter semelhante a Cristo e capacita a igreja para o serviço.",
          ],
          verses: [
            {
              ref: "João 14:26",
              textByVersion: {
                NVI: "Mas o Conselheiro, o Espírito Santo, que o Pai enviará em meu nome, ensinará a vocês todas as coisas e fará vocês se lembrarem de tudo o que eu disse.",
                NVT: "Mas quando o Pai enviar o Advogado como meu representante — isto é, o Espírito Santo — ele lhes ensinará tudo e lhes fará lembrar cada coisa que eu disse.",
              },
              originals: [
                { word: "παράκλητος", translit: "paráklētos", meaning: "'chamado ao lado de' — conselheiro, defensor, aquele que ajuda diretamente", lang: "grego" },
              ],
            },
            {
              ref: "Gálatas 5:22-23",
              textByVersion: {
                NVI: "Mas o fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio.",
                NVT: "Mas quando o Espírito Santo controla nossa vida, ele produz este tipo de fruto em nós: amor, alegria, paz, paciência, gentileza, bondade, fidelidade, mansidão e domínio próprio.",
              },
            },
          ],
          keywords: [
            { word: "παράκλητος", translit: "paráklētos", meaning: "'Consolador, Advogado'. Alguém chamado para estar ao seu lado ativamente — não uma presença passiva.", lang: "grego" },
          ],
          deepDive:
            "Um erro comum reduz o Espírito Santo a uma 'sensação' religiosa ou a um assunto ligado apenas a experiências extraordinárias. A Bíblia o descreve, antes de tudo, como quem regenera (nos torna novas criaturas, Tito 3:5), habita permanentemente todo crente genuíno (Romanos 8:9) e produz fruto — caráter transformado, não apenas fenômenos pontuais. Sobre os dons espirituais mais extraordinários (como línguas e profecia), há debate sincero entre cristãos fiéis: alguns creem que continuam plenamente ativos hoje (continuísmo); outros, que dons específicos de revelação direta cessaram após o período apostólico, com o cânon completo (cessacionismo moderado). Ambas as posições concordam no essencial: toda manifestação espiritual deve ser julgada pela Escritura, e o fruto do Espírito — caráter como o de Cristo — é sempre a evidência mais segura de sua presença ativa.",
          theologianQuote: {
            author: "Millard Erickson",
            text: "O Espírito Santo não veio para chamar atenção a si mesmo, mas para glorificar a Cristo.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Millard Erickson realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "O termo grego 'paráklētos', usado para o Espírito Santo, sugere:",
              options: ["Uma força impessoal", "Alguém chamado para estar ao lado, ajudando ativamente", "Um anjo superior", "Um símbolo apenas"],
              correctIndex: 1,
              explanation: "'Paráklētos' descreve presença pessoal e ativa, não uma força abstrata.",
            },
            {
              question: "Segundo Gálatas 5:22-23, a evidência mais clara da obra do Espírito é:",
              options: ["Experiências emocionais intensas", "O fruto — caráter transformado", "Riqueza material", "Popularidade na igreja"],
              correctIndex: 1,
              explanation: "O 'fruto do Espírito' é caráter, não apenas sensação ou fenômeno.",
            },
          ],
          application:
            "Escolha um único fruto da lista de Gálatas 5:22-23 (por exemplo, paciência) e observe, ao longo desta semana, quando você reage sem ele — pedindo ao Espírito, na hora, que produza esse fruto em você.",
          prayer:
            "Espírito Santo, obrigado por habitares em mim — não sou deixado sozinho. Perdoa-me quando busco experiências e esqueço de buscar teu fruto: caráter como o de Cristo. Molda-me, ensina-me, e usa-me para glorificar a Jesus, não a mim mesmo. Em nome dele, amém.",
          weeklyChallenge:
            "Escreva os nove aspectos do fruto do Espírito num cartão e avalie, ao fim de cada dia desta semana, qual deles mais precisou de você — e ore especificamente por ele.",
          reflectionQuestion:
            "Quando você pensa no Espírito Santo, pensa mais em experiências espirituais ou em caráter transformado? O que a Bíblia enfatiza mais?",
          xp: 25,
          deepen: {
            historicalContext:
              "No Pentecostes (Atos 2), as línguas faladas pelos discípulos eram idiomas humanos reais, compreendidos por estrangeiros de diferentes nações presentes em Jerusalém (Atos 2:6-11) — um sinal de que o Evangelho, antes restrito a Israel, agora alcançaria todas as nações, revertendo simbolicamente a confusão de línguas de Babel (Gênesis 11).",
            theologicalDebate:
              "A questão dos dons espirituais hoje — se todos os dons do Novo Testamento continuam exatamente como no primeiro século — é uma questão secundária sobre a qual cristãos fiéis discordam com honestidade. Continuístas apontam para textos como 1 Coríntios 14 como normativos para todas as épocas; cessacionistas moderados argumentam que dons ligados à revelação direta (profecia reveladora, línguas como sinal) tinham um propósito ligado à era apostólica e ao estabelecimento do cânon. Em ambos os casos, a prioridade bíblica é clara: tudo deve ser julgado pela Escritura, e o amor deve governar o uso de qualquer dom (1 Coríntios 13).",
            secondQuote: {
              author: "Jonas Madureira",
              text: "O maior milagre do Espírito Santo não é o extraordinário, mas o caráter de Cristo formado em nós dia após dia.",
            },
          },
        },
        // ───────────────────────────── 8 ─────────────────────────────
        {
          id: "fd-8",
          title: "A Salvação",
          difficulty: 4,
          intro: [
            "Depois de conhecer quem é Deus, quem é Cristo e quem é o Espírito, chegamos à pergunta mais pessoal de todas: como alguém é salvo?",
            "A resposta bíblica é radical em sua simplicidade e profunda em suas implicações: pela graça, mediante a fé — não por méritos, esforços religiosos ou boas obras acumuladas.",
            "Isso não significa que as obras não importam. Significa que elas não são a base da salvação, mas o fruto natural de quem já foi salvo. A ordem importa: graça primeiro, obediência depois — nunca o contrário.",
          ],
          verses: [
            {
              ref: "Efésios 2:8-9",
              textByVersion: {
                NVI: "Pois vocês são salvos pela graça, por meio da fé, e isto não vem de vocês, é dom de Deus; não por obras, para que ninguém se glorie.",
                NVT: "Deus salvou vocês pela graça, quando creram. Vocês não podem receber o crédito por isso; é um presente de Deus. A salvação não é recompensa pelas boas coisas que temos feito.",
              },
              originals: [
                { word: "χάρις", translit: "cháris", meaning: "'graça' — favor totalmente imerecido", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 10:9",
              textByVersion: {
                NVI: "Se você confessar com a sua boca que Jesus é Senhor e crer em seu coração que Deus o ressuscitou dentre os mortos, você será salvo.",
                NVT: "Se você declarar publicamente que Jesus Cristo é Senhor e crer em seu coração que Deus o ressuscitou dos mortos, você será salvo.",
              },
            },
          ],
          keywords: [
            { word: "χάρις", translit: "cháris", meaning: "'graça'. Favor que não pode ser comprado nem merecido — só recebido.", lang: "grego" },
          ],
          deepDive:
            "A salvação bíblica tem duas dimensões inseparáveis: a justificação (Deus nos declara justos, com base na obra de Cristo, no momento em que cremos — um ato jurídico, instantâneo) e a santificação (o processo contínuo de crescimento em caráter e obediência ao longo da vida). Confundir as duas gera dois erros opostos: o legalismo (achar que preciso acrescentar obras à graça para ser salvo) e o antinomianismo (usar a graça como licença para viver sem compromisso com a santidade). Tiago é claro: fé genuína sempre produz obras, não como pagamento, mas como evidência (Tiago 2:17). Sobre como a perseverança na fé se relaciona exatamente com a segurança eterna do crente, cristãos fiéis de diferentes tradições explicam de formas distintas — mas todos concordam que a salvação, do início ao fim, é obra de Deus e não conquista humana.",
          theologianQuote: {
            author: "John Wesley",
            text: "A graça de Deus não anula nossa responsabilidade; ela a torna possível.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Wesley realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Efésios 2:8-9, a salvação é:",
              options: ["Conquistada por boas obras", "Um dom recebido pela graça, mediante a fé", "Garantida pelo nascimento em família cristã", "Resultado de esforço religioso"],
              correctIndex: 1,
              explanation: "'Cháris' é favor imerecido — a salvação não pode ser comprada nem merecida.",
            },
            {
              question: "Qual a relação bíblica entre fé e obras na salvação?",
              options: [
                "Obras salvam, fé apenas ajuda",
                "Fé salva; obras são o fruto natural de quem já foi salvo",
                "Fé e obras são igualmente necessárias para merecer a salvação",
                "Obras substituem a necessidade de fé",
              ],
              correctIndex: 1,
              explanation: "A ordem bíblica é clara: graça e fé primeiro, obras como evidência depois.",
            },
          ],
          application:
            "Se você já é cristão, escreva em uma frase o que motiva sua obediência a Deus nesta fase da vida — gratidão pela graça recebida, ou medo de perder o favor de Deus? Leve essa resposta à oração.",
          prayer:
            "Pai, obrigado pela salvação que não venho de mim. Confesso que às vezes tento pagar por ela com esforço, e outras vezes a trato como barata demais. Ensina-me a receber tua graça com humildade — sem orgulho por merecê-la, sem culpa por não poder comprá-la — e que ela produza em mim uma vida de gratidão ativa. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Compartilhe com alguém, em poucas frases, como e quando você entendeu — ou está entendendo — o que significa ser salvo pela graça. Praticar contar isso fortalece sua própria fé.",
          reflectionQuestion:
            "Sua obediência a Deus hoje nasce mais de gratidão pela graça recebida, ou de medo de não ser suficientemente bom? Como isso molda sua vida espiritual?",
          xp: 28,
          deepen: {
            exegeticalNotes:
              "O verbo grego para 'salvos' em Efésios 2:8 está no tempo perfeito (sesōsménoi) — descrevendo uma ação passada com resultado permanente que continua até hoje. A salvação não é apenas um evento pontual esquecido no passado, mas um estado presente e contínuo do crente.",
            theologicalDebate:
              "A relação entre a soberania de Deus na salvação e a responsabilidade humana em crer é um dos temas mais debatidos, com honestidade, entre tradições reformadas e arminianas — incluindo a questão de saber se um crente genuíno pode, de fato, abandonar a fé. Essa é uma questão secundária importante, mas não essencial, sobre a qual cristãos fiéis discordam. O núcleo compartilhado por ambas as tradições, e inegociável, é: a salvação é inteiramente pela graça de Deus, mediante a fé em Cristo, e não por méritos humanos. Havendo dúvidas pessoais sobre segurança da salvação, vale conversar com seu pastor ou líder de discipulado.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "A graça é o favor imerecido, e a fé é a mão vazia que o recebe.",
            },
          },
        },
        // ───────────────────────────── 9 ─────────────────────────────
        {
          id: "fd-9",
          title: "A Igreja",
          difficulty: 4,
          intro: [
            "A salvação nunca foi projetada para ser vivida sozinha. Desde o primeiro dia, Deus salva pessoas para formar um povo — a igreja — não apenas indivíduos isolados com uma fé privada.",
            "O Novo Testamento usa imagens ricas para descrevê-la: corpo de Cristo, com muitos membros e uma só cabeça; templo do Espírito Santo, construído de pedras vivas; família de Deus, com irmãos de sangue diferente e fé comum.",
            "Isso significa algo prático e desconfortável para o individualismo moderno: crescer na fé fora da comunhão de uma igreja local não é o plano normal de Deus — é a exceção, quando existe alguma barreira real.",
          ],
          verses: [
            {
              ref: "1 Coríntios 12:27",
              textByVersion: {
                NVI: "Vocês são corpo de Cristo, e cada um de vocês é uma parte desse corpo.",
                NVT: "Todos vocês juntos são o corpo de Cristo, e cada um de vocês é uma parte individual desse corpo.",
              },
            },
            {
              ref: "Hebreus 10:24-25",
              textByVersion: {
                NVI: "E consideremos uns aos outros, a fim de nos incentivarmos ao amor e às boas obras. Não deixemos de reunir-nos, como igreja, mas encorajemo-nos uns aos outros.",
                NVT: "Pensemos em maneiras de estimular uns aos outros a atos de amor e boas obras. E não deixemos de nos reunir, como é costume de alguns; ao contrário, encorajemo-nos uns aos outros.",
              },
              originals: [
                { word: "ἐκκλησία", translit: "ekklēsía", meaning: "'assembleia convocada' — pessoas chamadas para fora e reunidas juntas, não uma instituição abstrata", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἐκκλησία", translit: "ekklēsía", meaning: "'igreja'. Não um prédio nem uma marca — uma assembleia de pessoas chamadas por Deus e reunidas entre si.", lang: "grego" },
          ],
          deepDive:
            "A palavra grega 'ekklēsía' nunca descreve, no Novo Testamento, um edifício — descreve pessoas reunidas. Isso corrige um erro comum: pensar na igreja como um lugar que se visita ocasionalmente, em vez de um povo ao qual se pertence de verdade, com compromisso mútuo. A metáfora do corpo (1 Coríntios 12) ensina duas coisas ao mesmo tempo: diversidade de dons e funções, e unidade indispensável — um dedo cortado fora do corpo não sobrevive sozinho por muito tempo, e uma fé cristã isolada da igreja tende à mesma fragilidade. Isso não significa que toda estrutura eclesiástica humana seja perfeita ou acima de crítica — mas significa que abandonar a comunhão de uma igreja local não é uma opção neutra na vida cristã; é a Bíblia explicitamente advertindo contra isso.",
          theologianQuote: {
            author: "Thom Rainer",
            text: "A igreja não é um evento que você frequenta; é uma família à qual você pertence.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Thom Rainer realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "O termo grego 'ekklēsía' (igreja) descreve, no Novo Testamento, principalmente:",
              options: ["Um edifício sagrado", "Uma assembleia de pessoas reunidas", "Uma organização religiosa formal", "Um sistema de crenças"],
              correctIndex: 1,
              explanation: "'Ekklēsía' significa pessoas chamadas e reunidas — não um lugar físico.",
            },
            {
              question: "Segundo Hebreus 10:24-25, os cristãos são exortados a:",
              options: ["Viver a fé de forma privada e individual", "Não se reunir com frequência", "Não deixar de se reunir, encorajando uns aos outros", "Depender apenas de estudo pessoal"],
              correctIndex: 2,
              explanation: "O texto adverte explicitamente contra o hábito de abandonar a reunião com outros crentes.",
            },
          ],
          application:
            "Se você ainda não está envolvido de forma comprometida em uma igreja local (não apenas frequentando, mas pertencendo — conhecido e conhecendo outros), dê um passo concreto esta semana: converse com um líder sobre como se envolver mais.",
          prayer:
            "Senhor, obrigado por não me chamares para uma fé solitária. Perdoa-me quando trato a igreja como opcional ou como mero prestador de serviços religiosos. Ensina-me a amar meus irmãos de verdade, a servir com os dons que me deste, e a permanecer comprometido mesmo quando a comunhão é difícil. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Entre em contato esta semana com alguém da sua igreja com quem você tem pouco contato — um café, uma mensagem, uma oração em conjunto — como um passo prático de comunhão real.",
          reflectionQuestion:
            "Você vive sua fé mais como algo pessoal e privado, ou como parte de um povo ao qual pertence de verdade? O que precisaria mudar para viver mais como a Bíblia descreve?",
          xp: 28,
          deepen: {
            historicalContext:
              "Desde o livro de Atos, a vida da igreja primitiva incluía elementos concretos e regulares: ensino apostólico, comunhão, partir do pão e oração (Atos 2:42) — nunca uma fé isolada. A palavra 'ekklēsía' também era usada no mundo grego secular para a assembleia de cidadãos convocados para deliberar sobre assuntos públicos — reforçando a ideia de povo reunido com propósito comum.",
            theologicalDebate:
              "Sobre estrutura de governo eclesiástico (episcopal, presbiteriana, congregacional) e sobre os ofícios da igreja, há divergência histórica legítima entre denominações fiéis — trata-se de questão secundária. O essencial, compartilhado amplamente, é que a igreja é o povo de Deus reunido, submisso a Cristo como cabeça, comprometido em amor mútuo e missão. Dúvidas específicas sobre membresia e envolvimento vale conversar diretamente com a liderança da sua igreja local.",
            secondQuote: {
              author: "Davi Lago",
              text: "Ninguém cresce sozinho na fé; crescemos uns com os outros, ou não crescemos de verdade.",
            },
          },
        },
        // ───────────────────────────── 10 ────────────────────────────
        {
          id: "fd-10",
          title: "Escatologia Básica",
          difficulty: 4,
          intro: [
            "A história da redenção que começou em Gênesis ainda não terminou. A Bíblia aponta consistentemente para um futuro: o retorno pessoal, visível e glorioso de Jesus Cristo.",
            "Escatologia — o estudo das 'últimas coisas' — não é especulação sobre datas ou eventos sensacionalistas. É a certeza, fundamentada nas Escrituras, de que a história caminha para um fim definido por Deus: justiça restaurada, mal derrotado, criação renovada.",
            "Paulo resume a esperança cristã de forma prática: 'consolem-se uns aos outros com estas palavras' (1 Tessalonicenses 4:18). A escatologia bíblica não existe para alimentar curiosidade, mas para sustentar esperança em meio ao sofrimento presente.",
          ],
          verses: [
            {
              ref: "Apocalipse 21:3-4",
              textByVersion: {
                NVI: "A morada de Deus é com os homens... Ele enxugará dos seus olhos toda lágrima. Não haverá mais morte, nem tristeza, nem choro, nem dor, pois a antiga ordem já passou.",
                NVT: "Deus estará entre eles... Ele enxugará cada lágrima dos olhos deles, e não haverá mais morte, nem tristeza, nem choro, nem dor, pois a velha ordem de coisas já passou.",
              },
            },
            {
              ref: "1 Tessalonicenses 4:16-17",
              textByVersion: {
                NVI: "Pois, dada a ordem, com a voz do arcanjo e o ressoar da trombeta de Deus, o próprio Senhor descerá dos céus... e estaremos para sempre com o Senhor.",
                NVT: "Pois haverá um grito de comando, o chamado do arcanjo e o som da trombeta de Deus, e o próprio Senhor descerá do céu... e ficaremos com o Senhor para sempre.",
              },
              originals: [
                { word: "παρουσία", translit: "parousía", meaning: "'vinda, presença' — termo usado para a chegada oficial de um rei; a volta de Cristo em glória visível", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "παρουσία", translit: "parousía", meaning: "'vinda, presença real'. Usada no mundo antigo para a chegada solene de um imperador — a volta de Cristo será assim: pública e inconfundível.", lang: "grego" },
          ],
          deepDive:
            "Sobre a ordem exata dos eventos finais — o momento do arrebatamento em relação à tribulação, a natureza do milênio de Apocalipse 20 — existem interpretações diferentes e sinceras entre cristãos igualmente comprometidos com a autoridade da Escritura; isso é, deliberadamente, uma questão secundária na tradição cristã histórica. O que é doutrina essencial, compartilhada por toda ortodoxia cristã desde o Credo Niceno-Constantinopolitano, é bem mais simples e bem mais firme: Cristo voltará pessoal e visivelmente, os mortos ressuscitarão corporalmente, haverá um juízo final, e Deus renovará céus e terra — não uma existência etérea e desencarnada, mas uma criação física restaurada, sem a presença do mal, da dor ou da morte. Um erro comum é deixar a escatologia virar motivo de ansiedade ou de fascínio por especulação; a Bíblia a apresenta como fonte de esperança prática e motivação para viver com santidade agora (2 Pedro 3:11-13).",
          theologianQuote: {
            author: "Alister McGrath",
            text: "A esperança cristã não escapa do mundo; espera pela renovação dele.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Alister McGrath realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Apocalipse 21:3-4, o futuro prometido por Deus inclui:",
              options: [
                "Uma existência puramente espiritual, sem corpo",
                "Fim da morte, tristeza e dor, com Deus habitando com seu povo",
                "Um ciclo interminável de julgamentos",
                "O fim definitivo da criação material"
              ],
              correctIndex: 1,
              explanation: "A esperança bíblica é de renovação — presença de Deus, sem morte nem dor — não de aniquilação da matéria.",
            },
            {
              question: "Sobre a ordem exata dos eventos do fim dos tempos, a postura bíblica e histórica recomendada é:",
              options: [
                "Considerar uma única interpretação como a única aceitável para todo cristão fiel",
                "Reconhecer que é uma questão secundária, com espaço para interpretações diferentes entre cristãos fiéis",
                "Ignorar completamente o assunto",
                "Definir datas específicas com base em cálculos proféticos"
              ],
              correctIndex: 1,
              explanation: "A ordem dos eventos finais é debatida com sinceridade entre tradições; o essencial (o retorno de Cristo, a ressurreição, o juízo, a renovação) é consensual.",
            },
          ],
          application:
            "Diante de uma dificuldade ou perda recente, releia Apocalipse 21:3-4 e pergunte: como essa esperança futura muda o peso que dou a essa dificuldade hoje?",
          prayer:
            "Senhor Jesus, tu prometeste voltar, e essa promessa sustenta minha esperança em meio às dores deste mundo. Ensina-me a viver com os olhos voltados para o que virá, sem fugir das responsabilidades de hoje, mas encontrando nelas sentido à luz da tua vitória final. Vem, Senhor Jesus. Amém.",
          weeklyChallenge:
            "Escreva uma carta curta para si mesmo, para ser lida daqui a um ano, descrevendo a esperança que Apocalipse 21 desperta em você agora — e o que você quer que essa esperança mude na sua vida enquanto espera.",
          reflectionQuestion:
            "Como a certeza de que Cristo voltará e renovará todas as coisas muda a forma como você enfrenta o sofrimento e a injustiça que vê hoje?",
          xp: 30,
          deepen: {
            historicalContext:
              "O Credo Niceno-Constantinopolitano (381 d.C.), aceito por praticamente toda a cristandade histórica — católica, ortodoxa e protestante —, confessa que Cristo 'há de vir com glória para julgar os vivos e os mortos, e o seu reino não terá fim', e espera 'a ressurreição dos mortos'. Esses elementos são o núcleo mínimo compartilhado, independentemente de detalhes sobre cronologia profética.",
            theologicalDebate:
              "As principais posições sobre o milênio (pré-milenismo, amilenismo, pós-milenismo) e sobre o momento do arrebatamento (pré-tribulacionismo, midtribulacionismo, pós-tribulacionismo) representam leituras diferentes de textos proféticos complexos, especialmente de Apocalipse e Daniel. Cristãos igualmente fiéis às Escrituras discordam nesse ponto há séculos. Para um estudo aprofundado e pastoral sobre qual posição adotar, vale muito conversar com seu pastor ou líder de discipulado, que conhece o ensino específico da sua igreja.",
            secondQuote: {
              author: "Jonas Madureira",
              text: "Esperamos a volta de Cristo não com medo, mas com a alegria de quem espera alguém amado.",
            },
          },
        },
      ],
    },
  ],
};

export const additionalTrails3: Trail[] = [fundamentosDaFe];
