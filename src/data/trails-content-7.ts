// Conteúdo pastoral completo — Turno 7.
// Trilha 9 (Liderança / Módulo 10 no mapeamento de disciple_modules).
// Padrão idêntico ao já usado em "Novo Convertido", "Fundamentos da Fé",
// "Como Estudar a Bíblia", "Oração", "Santificação", "Igreja Local",
// "Família Cristã", "Missões", "Evangelismo" e "Vida Cristã".
// Base teológica: cristão evangélico, cristocêntrico, cessacionista moderado,
// Sola Scriptura (autores de diferentes tradições usados como referência
// secundária, sem que nenhuma soteriologia específica seja apresentada como
// normativa ao leitor). Nenhuma tradição denominacional é nomeada no
// conteúdo voltado ao usuário.
// Os 10 temas planejados para o Módulo 10 (Liderança Bíblica, Liderança
// Servidora, O Primado do Caráter, Vitalidade Espiritual, Discernimento e
// Decisão, A Arte de Delegar, Liderança sob Pressão, Cuidado Pastoral,
// Lidando com Fracassos, Deixando um Legado) foram organizados aqui como
// 10 lições (2 por módulo, 5 módulos), no mesmo esquema Lesson já usado no
// restante do app — não como 10 Trails separadas, já que o schema atual
// (content.ts) modela cada área grande como 1 Trail com módulos e lições.
// Os ids de lição abaixo (lid-1-1 ... lid-5-2) devem ser referenciados pela
// migration SQL que preenche disciple_trails.lesson_id para module_id='m10'.

import type { Trail } from "./content";

const lideranca: Trail = {
  id: "lideranca",
  title: "Liderança",
  description: "Servir liderando à maneira de Cristo: caráter, sabedoria e perseverança.",
  icon: "Crown",
  color: "from-yellow-500 to-amber-600",
  order: 9,
  modules: [
    {
      id: "lid-mod-1",
      title: "Módulo I: Fundamentos da Liderança Cristã",
      lessons: [
        {
          id: "lid-1-1",
          title: "Liderança Bíblica",
          difficulty: 3,
          intro: [
            "Quando o mundo pensa em liderança, geralmente pensa em poder: quem manda, quem decide, quem está no topo. A Bíblia oferece um retrato radicalmente diferente. Em Mateus 20, os discípulos disputam posições de destaque, e Jesus os corrige com uma frase que redefine liderança para sempre: 'não será assim entre vocês' (Mateus 20:26). No Reino de Deus, a grandeza se mede pelo serviço, não pelo controle.",
            "Isso não significa que a Bíblia seja contra autoridade ou estrutura — ela reconhece líderes, anciãos, pastores e responsabilidades claras (Hebreus 13:7,17). Significa que o *modelo* de liderança cristã tem uma fonte e uma forma específicas: a própria vida de Cristo, que 'não veio para ser servido, mas para servir' (Mateus 20:28). Toda liderança verdadeiramente cristã começa aqui — não numa técnica de gestão, mas numa pessoa a ser imitada.",
          ],
          verses: [
            {
              ref: "Mateus 20:25-28",
              textByVersion: {
                NVI: "Jesus os chamou e disse: 'Vocês sabem que os governantes das nações as dominam, e as autoridades exercem poder sobre elas. Não será assim entre vocês. Ao contrário, quem quiser tornar-se grande entre vocês deverá ser servo, e quem quiser ser o primeiro deverá ser escravo; como o Filho do homem, que não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos.'",
              },
              originals: [
                { word: "διάκονος", translit: "diákonos", meaning: "'servo, aquele que serve às mesas' — raiz da palavra 'diácono'; descreve serviço prático e humilde, não posição de prestígio", lang: "grego" },
              ],
            },
            {
              ref: "Hebreus 13:7,17",
              textByVersion: {
                NVI: "Lembrem-se dos seus líderes, que lhes comunicaram a palavra de Deus. Considerem o resultado da forma de viver deles e imitem-lhes a fé... Obedeçam aos seus líderes e sujeitem-se à autoridade deles, pois eles cuidam de vocês como quem deve prestar contas.",
              },
              originals: [
                { word: "ἡγέομαι", translit: "hēgéomai", meaning: "'liderar, ir à frente, considerar' — descreve quem vai adiante para abrir caminho, não quem apenas comanda de longe", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "διάκονος", translit: "diákonos", meaning: "servo — na cultura greco-romana, geralmente associado a trabalho braçal de baixo prestígio; Jesus escolhe deliberadamente essa palavra para descrever grandeza no seu Reino", lang: "grego" },
          ],
          deepDive:
            "É importante notar o contraste que Jesus constrói em Mateus 20:25-28: de um lado, o modelo dos 'governantes das nações', que 'dominam' e 'exercem poder' (verbos que carregam a ideia de subjugar, impor-se de cima para baixo); do outro, o modelo do Reino, expresso em duas palavras que soam quase como um erro de tradução para ouvidos antigos — 'servo' (diákonos) e 'escravo' (doûlos) associadas a 'grandeza' e a 'ser o primeiro'. Jesus não está romantizando fraqueza ou passividade; Ele está redefinindo poder como algo que se exerce *a favor* de outros, e não *sobre* outros. E Ele não apenas ensina isso — Ele vive isso até a cruz, o ato supremo de poder usado em benefício alheio. Isso não anula a existência de autoridade estruturada na igreja (Hebreus 13:17 é claro sobre isso), mas define a *forma* que essa autoridade deve tomar: liderar servindo, não servir-se da posição de líder.",
          theologianQuote: {
            author: "John Stott",
            text: "A autoridade pela qual o líder cristão lidera não é o poder, mas o amor; não a força, mas o exemplo; não a coerção, mas a persuasão fundamentada na razão. Líderes têm poder, mas o poder só é seguro nas mãos daqueles que se humilham para servir.",
            source: "Issues Facing Christians Today, 4ª ed. (Zondervan, 2011)",
          },
          deepen: {
            historicalContext:
              "No mundo greco-romano do primeiro século, o valor de uma pessoa estava intimamente ligado ao seu status social, e servir era associado a escravos e à classe mais baixa da sociedade — buscar prestígio e ser servido era o caminho natural de quem tinha qualquer poder. É nesse contexto cultural que a afirmação de Jesus em Mateus 20 soa quase escandalosa: Ele inverte deliberadamente a escala de valores do seu tempo, e os primeiros cristãos, ao lerem essas palavras, entendiam perfeitamente o quanto elas contrariavam o senso comum ao seu redor.",
            exegeticalNotes:
              "Jesus usa dois termos progressivamente mais baixos na escala social da época: diákonos ('servo', alguém que presta serviço) e doûlos ('escravo', posição ainda mais baixa, sem liberdade própria). A progressão é intencional: quanto maior a ambição por grandeza, maior deve ser a disposição para o serviço mais humilde — não o contrário.",
            theologicalDebate:
              "Cristãos fiéis divergem sobre estruturas específicas de governo eclesiástico (quantos líderes, como são escolhidos, quais os limites exatos de sua autoridade). Esta é uma questão importante, mas secundária: o que este material apresenta como inegociável é apenas o princípio de que toda autoridade cristã — qualquer que seja sua estrutura formal — deve ser exercida à maneira de Cristo, como serviço, e nunca como domínio pessoal. Para entender a estrutura específica de liderança da sua igreja local, converse com seu pastor ou líder de discipulado.",
            secondQuote: {
              author: "John Stott",
              text: "A negação de si mesmo não é privar-se de pequenos luxos; é, na verdade, negar ou desconhecer a si mesmo, renunciando ao suposto direito de seguir o próprio caminho.",
              source: "The Cross of Christ (IVP, 1986), p. 278",
            },
          },
          quizzes: [
            {
              question: "Segundo Mateus 20:25-28, o que diferencia a liderança no Reino de Deus da liderança das 'nações'?",
              options: [
                "No Reino de Deus não existe nenhuma autoridade",
                "A grandeza no Reino se mede pelo serviço, não pelo domínio sobre os outros",
                "Líderes cristãos não devem ter responsabilidades formais",
                "A Bíblia é indiferente ao tema da liderança",
              ],
              correctIndex: 1,
              explanation: "Jesus não elimina autoridade, mas a redefine: quem quiser ser grande deve ser servo — o oposto do modelo de dominação das nações.",
            },
            {
              question: "A palavra grega 'diákonos', usada por Jesus em Mateus 20:26, tinha na cultura da época a conotação de:",
              options: [
                "Alto prestígio social",
                "Trabalho humilde e de baixo status, associado a servir às mesas",
                "Um título honorífico religioso",
                "Um cargo político de destaque",
              ],
              correctIndex: 1,
              explanation: "Jesus escolhe deliberadamente uma palavra associada a trabalho humilde para redefinir o que significa 'ser grande' no seu Reino.",
            },
          ],
          application:
            "Pense em um espaço onde você exerce alguma forma de liderança ou influência (família, trabalho, ministério, grupo de amigos). Escolha um ato concreto de serviço, nesta semana, que só faz sentido se a grandeza for medida por servir, não por ser servido.",
          prayer:
            "Senhor Jesus, tu que não vieste para ser servido, mas para servir, transforma minha visão de liderança. Onde eu busco reconhecimento, ensina-me a buscar o bem de quem está ao meu redor. Que minha influência, por menor que seja, reflita a tua forma de exercer poder — pelo serviço, não pelo domínio. Amém.",
          weeklyChallenge:
            "Identifique uma pessoa sob sua influência (um filho, um colega, alguém que você discipula) e pergunte a ela, com humildade genuína: 'como posso te servir melhor esta semana?' — e faça o que ela responder.",
          reflectionQuestion:
            "Em que área da sua vida você tem buscado mais ser servido do que servir — e o que mudaria se você invertesse essa lógica esta semana?",
          xp: 30,
        },
        {
          id: "lid-1-2",
          title: "Liderança Servidora",
          difficulty: 3,
          intro: [
            "Na última noite antes da cruz, Jesus faz algo que chocaria qualquer líder religioso do seu tempo: ele se levanta da ceia, tira o manto, ajoelha-se e lava os pés dos discípulos (João 13:4-5) — tarefa reservada aos escravos de posição mais baixa numa casa. Pedro reage com resistência: 'Tu, lavar os meus pés? Nunca!' (João 13:8). A cena é chocante precisamente porque contraria tudo que os discípulos esperavam de um mestre.",
            "Jesus então explica o propósito do gesto: 'eu lhes dei o exemplo, para que vocês façam como lhes fiz' (João 13:15). Liderança servidora não é uma técnica de humildade performática nem uma estratégia para conquistar seguidores — é a resposta natural de quem já entendeu, como Jesus entendeu (João 13:3), quem é e de onde veio. Só quem tem segurança em sua identidade consegue se abaixar sem medo de se diminuir.",
          ],
          verses: [
            {
              ref: "João 13:12-15",
              textByVersion: {
                NVI: "Depois de lavar os pés deles, Jesus tornou a vestir-se. Voltando a assentar-se, perguntou-lhes: 'Vocês entendem o que fiz? Vocês me chamam mestre e Senhor, e com razão, pois eu o sou. Ora, se eu, sendo Senhor e Mestre, lavei os pés de vocês, vocês também devem lavar os pés uns dos outros. Eu lhes dei o exemplo, para que vocês façam como lhes fiz.'",
              },
            },
            {
              ref: "Filipenses 2:5-7",
              textByVersion: {
                NVI: "Que a atitude de vocês seja a mesma de Cristo Jesus, que, existindo em forma de Deus, não considerou como algo a ser retido a sua igualdade com Deus; ao contrário, esvaziou-se a si mesmo, vindo a ser feito à semelhança dos homens, assumindo a forma de servo.",
              },
              originals: [
                { word: "ἐκένωσεν", translit: "ekénōsen", meaning: "'esvaziou-se' — não abrir mão da divindade, mas renunciar voluntariamente a privilégios e prerrogativas para assumir a condição de servo", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἐκένωσεν", translit: "ekénōsen", meaning: "de kenóō, 'esvaziar' — a chamada 'kenosis' de Cristo: não deixou de ser Deus, mas renunciou ao uso independente de suas prerrogativas divinas para viver como servo entre os homens", lang: "grego" },
          ],
          deepDive:
            "O hino de Filipenses 2:5-11 é considerado por muitos estudiosos um dos textos cristológicos mais antigos do Novo Testamento, possivelmente já cantado nas igrejas antes mesmo de Paulo escrever a carta. Ele descreve um movimento em duas direções: descida (esvaziamento, humilhação, morte de cruz) seguida de exaltação (Deus o exaltou soberanamente, todo joelho se dobrará). A ordem importa: a exaltação vem *depois* da humilhação voluntária, nunca a substitui. Isso desmonta qualquer versão de liderança servidora que seja apenas uma tática para, no fim, ser exaltado por si mesmo. A humildade de Cristo não era um meio para um fim egoísta — era a expressão genuína de quem Ele era. Líderes cristãos que servem esperando reconhecimento imediato ainda não entenderam o padrão: o serviço genuíno pode, sim, ser seguido de honra dada por Deus, mas nunca é praticado *para* obtê-la.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "Quando Cristo chama um homem, Ele o chama para vir e morrer.",
            source: "The Cost of Discipleship (Nachfolge, 1937)",
          },
          quizzes: [
            {
              question: "Por que a reação inicial de Pedro em João 13:8 ('Nunca lavarás os meus pés') é significativa?",
              options: [
                "Porque Pedro era humilde demais para aceitar",
                "Porque lavar pés era tarefa de escravos, e Pedro não conseguia conciliar isso com quem Jesus era",
                "Porque Pedro já tinha os pés limpos",
                "Porque Pedro queria lavar os pés de Jesus primeiro",
              ],
              correctIndex: 1,
              explanation: "A resistência de Pedro revela o choque cultural: um mestre e Senhor assumindo a tarefa mais humilhante reservada aos escravos.",
            },
            {
              question: "Segundo Filipenses 2:5-7, a atitude de Cristo ao 'esvaziar-se' (kenóō) significa que:",
              options: [
                "Ele deixou de ser Deus temporariamente",
                "Ele renunciou voluntariamente ao uso de privilégios divinos para viver como servo, sem deixar de ser Deus",
                "Ele fingiu ser humano",
                "Ele perdeu poder ao se tornar homem",
              ],
              correctIndex: 1,
              explanation: "A kenosis descreve renúncia voluntária a prerrogativas, não perda da natureza divina — Cristo permanece plenamente Deus e assume plenamente a condição de servo.",
            },
          ],
          application:
            "Pratique nesta semana um ato de serviço que seja propositalmente 'invisível' — algo que ninguém vai elogiar publicamente. Observe como sua reação interior revela se você serve por amor ou por reconhecimento.",
          prayer:
            "Pai, dá-me a mesma atitude de Cristo: disposição de me abaixar sem medo de me diminuir, porque minha identidade está segura em ti, não na opinião dos outros sobre mim. Ensina-me a servir sem calcular o retorno. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha uma tarefa de serviço que você normalmente evita ou delega por parecer 'abaixo' da sua posição, e faça-a pessoalmente esta semana, com alegria genuína.",
          reflectionQuestion:
            "Existe alguma tarefa de serviço que você acha 'abaixo' de você fazer? O que isso revela sobre onde você tem buscado sua identidade e valor?",
          xp: 30,
        },
      ],
    },
    {
      id: "lid-mod-2",
      title: "Módulo II: O Caráter do Líder",
      lessons: [
        {
          id: "lid-2-1",
          title: "O Primado do Caráter",
          difficulty: 3,
          intro: [
            "Quando Paulo lista as qualificações para presbíteros (líderes/pastores) em 1 Timóteo 3 e Tito 1, algo chama atenção: quase toda a lista é sobre caráter, não sobre competência técnica. 'Irrepreensível', 'marido de uma só mulher', 'sóbrio', 'prudente', 'hospitaleiro', 'apto para ensinar', 'não dado ao vinho', 'não violento', 'pacífico' (1 Timóteo 3:2-3) — apenas um item da lista ('apto para ensinar') se refere a habilidade; o restante é sobre quem a pessoa é quando ninguém está olhando.",
            "Isso contraria diretamente a cultura de liderança que valoriza sobretudo carisma, competência e resultados. A Bíblia não descarta habilidade — 'apto para ensinar' importa —, mas insiste que caráter vem primeiro, e que um líder com grande talento e caráter frágil é, no fim, um perigo maior para a Igreja do que um líder com talento limitado e caráter firme.",
          ],
          verses: [
            {
              ref: "1 Timóteo 3:1-3",
              textByVersion: {
                NVI: "É fiel esta palavra: se alguém deseja ser bispo, excelente tarefa almeja. É necessário, pois, que o bispo seja irrepreensível, marido de uma só mulher, moderado, sensato, respeitável, hospitaleiro, apto para ensinar; não deve ser dado ao vinho, nem violento, mas sim amável, pacífico, e não apegado ao dinheiro.",
              },
              originals: [
                { word: "ἀνεπίλημπτος", translit: "anepílēmptos", meaning: "'irrepreensível' — literalmente, 'que não se pode agarrar/acusar'; não perfeição absoluta, mas conduta que não dá margem legítima à acusação", lang: "grego" },
              ],
            },
            {
              ref: "Tito 1:7-9",
              textByVersion: {
                NVI: "É necessário que o bispo seja irrepreensível, por ser encarregado da obra de Deus. Não deve ser arrogante, nem briguento, nem apegado ao vinho, nem violento, nem cobiçoso de lucro desonesto. Ao contrário, deve ser hospitaleiro, amigo do bem, sensato, justo, consagrado e disciplinado. Deve apegar-se firmemente à mensagem fiel.",
              },
            },
          ],
          keywords: [
            { word: "ἀνεπίλημπτος", translit: "anepílēmptos", meaning: "irrepreensível — não significa isento de qualquer falha, mas alguém cuja conduta pública não oferece uma base legítima e sustentável para acusação séria", lang: "grego" },
          ],
          deepDive:
            "É importante notar o que as listas de 1 Timóteo 3 e Tito 1 *não* incluem: nenhum item exige carisma excepcional, dons extraordinários, oratória impressionante ou resultados numéricos visíveis. A ênfase recai quase inteiramente sobre estabilidade de caráter em áreas ordinárias da vida — casamento, domínio próprio, hospitalidade, relação com dinheiro, temperamento. Isso ensina algo contracultural: a igreja não deve confiar liderança a alguém simplesmente porque é talentoso ou carismático, mas porque sua vida, examinada de perto, sustenta o peso da confiança que lhe é dada. 'Irrepreensível' (anepílēmptos) não exige perfeição — todo líder, como qualquer cristão, ainda luta contra o pecado —, mas exige que não haja um padrão sustentado de conduta que desqualifique sua credibilidade diante da igreja e do mundo.",
          theologianQuote: {
            author: "John Wesley",
            text: "Mas há uma consideração mais elevada do que essa; mais elevada do que quaisquer dons, naturais ou adquiridos, somados: pois o que são todos os outros dons comparados à graça de Deus?",
            source: "An Address to the Clergy (1756)",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "1 Timóteo 4:16",
                textByVersion: {
                  NVI: "Tenha cuidado com a sua vida e com a sua doutrina. Persevere nisso, porque, agindo assim, você se salvará, e também aos que o ouvem.",
                },
              },
            ],
            historicalContext:
              "As igrejas do primeiro século enfrentavam falsos mestres e líderes movidos por ganância ou ambição (situação explícita no contexto de 1 Timóteo e Tito). As listas de qualificações não foram escritas no vácuo teórico, mas como resposta prática a crises reais de liderança que já estavam ferindo comunidades cristãs concretas.",
            exegeticalNotes:
              "A ordem em 1 Timóteo 4:16 — 'sua vida' antes de 'sua doutrina' — não é acidental. Paulo repetidamente coloca integridade pessoal como pré-requisito, não como complemento opcional, da fidelidade doutrinária de um líder.",
            theologicalDebate:
              "Tradições cristãs divergem sobre detalhes específicos de aplicação dessas qualificações (por exemplo, sobre quem pode ocupar cada ofício de liderança na igreja). Esta é uma questão importante para a vida da igreja local, mas o princípio central apresentado aqui — caráter como prioridade sobre talento — é amplamente compartilhado entre tradições fiéis. Para questões específicas sobre ofícios e qualificações na sua igreja, converse com seu pastor ou líder de discipulado.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "Assim como as ações falam mais alto que as palavras, uma vida ímpia afogará com eficácia a voz do ministério mais eloquente. Nossa verdadeira edificação deve ser feita com as próprias mãos; nosso caráter deve ser mais persuasivo que nosso discurso.",
              source: "Lectures to My Students, Lecture I ('The Minister's Self-Watch')",
            },
          },
          quizzes: [
            {
              question: "O que chama atenção nas listas de qualificações para líderes em 1 Timóteo 3 e Tito 1?",
              options: [
                "Elas exigem sobretudo carisma e talento para falar em público",
                "Quase todos os itens tratam de caráter pessoal, não de habilidade técnica",
                "Elas só se aplicam a pessoas com formação teológica formal",
                "Elas não têm nenhuma exigência prática, apenas espiritual",
              ],
              correctIndex: 1,
              explanation: "Com exceção de 'apto para ensinar', toda a lista trata de estabilidade de caráter em áreas ordinárias da vida.",
            },
            {
              question: "O termo grego 'anepílēmptos' ('irrepreensível') significa, mais precisamente:",
              options: [
                "Perfeição absoluta, sem nenhuma falha",
                "Uma conduta que não oferece base legítima e sustentada para acusação séria",
                "Um título honorífico dado pela congregação",
                "Ausência total de tentação",
              ],
              correctIndex: 1,
              explanation: "A palavra descreve alguém 'que não se pode agarrar/acusar' com fundamento — não isenção de luta contra o pecado, mas integridade sustentada de vida.",
            },
          ],
          application:
            "Faça um inventário honesto: em qual das áreas listadas em 1 Timóteo 3 (temperamento, relação com dinheiro, hospitalidade, domínio próprio) você sente que precisa de mais crescimento? Escolha uma e busque um passo concreto de mudança esta semana.",
          prayer:
            "Senhor, não permita que eu busque influência sem antes buscar caráter. Molda em mim, pelo teu Espírito, uma vida que sustente a confiança de quem me olha de perto — não uma imagem pública que esconde uma vida privada frágil. Amém.",
          weeklyChallenge:
            "Peça a alguém que te conhece de perto (cônjuge, amigo próximo, discipulador) uma avaliação honesta: 'em que área do meu caráter você acha que eu preciso crescer mais?' — e receba a resposta sem se defender.",
          reflectionQuestion:
            "Se sua vida particular, longe dos olhos públicos, fosse examinada com a mesma lista de 1 Timóteo 3, o que ela revelaria?",
          xp: 35,
        },
        {
          id: "lid-2-2",
          title: "Vitalidade Espiritual",
          difficulty: 3,
          intro: [
            "Antes de qualquer decisão importante, antes de escolher os doze apóstolos, antes de multiplicar pães ou enfrentar a multidão, os evangelhos registram um padrão silencioso na vida de Jesus: ele se retirava para lugares desertos e orava (Marcos 1:35; Lucas 5:16; Lucas 6:12). Um líder que era plenamente Deus ainda assim dependia visivelmente de tempo a sós com o Pai — o que isso ensina sobre líderes que são apenas humanos?",
            "Liderança sustentável nunca nasce de reservas próprias de energia, sabedoria ou disciplina. Ela nasce de permanecer conectado à fonte. Jesus usa a imagem da videira: 'quem permanece em mim, e eu nele, esse dá muito fruto; pois sem mim vocês não podem fazer coisa alguma' (João 15:5). Um líder pode servir por um tempo com forças próprias — mas isso sempre termina em esgotamento, amargura ou queda.",
          ],
          verses: [
            {
              ref: "João 15:4-5",
              textByVersion: {
                NVI: "Permaneçam em mim, e eu permanecerei em vocês. Nenhum ramo pode dar fruto por si mesmo, se não permanecer na videira; vocês também não podem dar fruto, se não permanecerem em mim. Eu sou a videira; vocês são os ramos. Se alguém permanecer em mim e eu nele, esse dará muito fruto; pois sem mim vocês não podem fazer coisa alguma.",
              },
              originals: [
                { word: "μένω", translit: "ménō", meaning: "'permanecer, habitar, ficar' — não uma visita ocasional, mas uma habitação contínua e estável", lang: "grego" },
              ],
            },
            {
              ref: "Marcos 1:35",
              textByVersion: {
                NVI: "De madrugada, quando ainda estava escuro, Jesus se levantou, saiu e foi para um lugar deserto, onde ficou orando.",
              },
            },
          ],
          keywords: [
            { word: "μένω", translit: "ménō", meaning: "permanecer — verbo repetido dez vezes em João 15:4-10; descreve conexão contínua e estável, não um encontro pontual e esporádico com Deus", lang: "grego" },
          ],
          deepDive:
            "A repetição do verbo ménō ('permanecer') em João 15 — dez vezes em poucos versículos — não é estilo literário casual; é ênfase deliberada. Jesus está descrevendo uma relação de dependência contínua, não uma visita espiritual ocasional antes de uma grande tarefa. Isso é especialmente relevante para quem exerce alguma forma de liderança: existe uma tentação constante de tratar o tempo com Deus como preparação técnica para o próximo evento ou decisão, em vez de tratá-lo como a fonte da própria vida espiritual do líder. Marcos 1:35 mostra Jesus buscando solidão para orar logo após um dia de intenso ministério (Marcos 1:32-34) e imediatamente antes de decisões importantes (Marcos 1:38) — o padrão é claro: a vitalidade espiritual do líder não é um luxo opcional quando sobra tempo, mas a raiz sem a qual toda liderança eventualmente seca.",
          theologianQuote: {
            author: "Richard Foster",
            text: "A superficialidade é a maldição da nossa era. A doutrina da satisfação instantânea é um problema espiritual primário. A necessidade urgente hoje não é de mais pessoas inteligentes ou talentosas, mas de pessoas profundas.",
            source: "Celebration of Discipline (HarperCollins), p. 1",
          },
          quizzes: [
            {
              question: "O que o padrão de vida de oração de Jesus (Marcos 1:35; Lucas 5:16) ensina sobre liderança?",
              options: [
                "Que a oração é opcional para quem já tem experiência em liderar",
                "Que mesmo Jesus buscava tempo a sós com o Pai antes e depois de momentos intensos de ministério",
                "Que líderes devem orar apenas em público",
                "Que a oração é substituída por planejamento estratégico",
              ],
              correctIndex: 1,
              explanation: "Jesus modela dependência contínua do Pai mesmo sendo plenamente Deus — um padrão ainda mais necessário para líderes que são apenas humanos.",
            },
            {
              question: "A repetição do verbo grego 'ménō' ('permanecer') em João 15:4-10 enfatiza:",
              options: [
                "Um encontro espiritual pontual e ocasional",
                "Uma conexão contínua e estável com Cristo, da qual depende todo fruto genuíno",
                "Uma obrigação religiosa formal e distante",
                "Um evento único de conversão, sem continuidade posterior",
              ],
              correctIndex: 1,
              explanation: "O verbo descreve habitação contínua, não visita esporádica — a fonte de todo fruto espiritual sustentável.",
            },
          ],
          application:
            "Avalie honestamente sua vida devocional atual: ela é fonte real de vitalidade ou apenas uma tarefa a mais na agenda? Reserve, nesta semana, um tempo diário fixo e protegido só para estar com Deus, sem agenda ministerial anexada.",
          prayer:
            "Senhor, não quero liderar com forças que se esgotam. Ensina-me a permanecer em ti como o ramo permanece na videira — não por obrigação, mas porque sei que sem ti nada do que eu faço tem fruto duradouro. Amém.",
          weeklyChallenge:
            "Durante 7 dias, antes de qualquer atividade de liderança ou serviço (uma reunião, uma aula, um cuidado pastoral), reserve 5 minutos de silêncio e oração — só entre você e Deus, sem pedido específico além de comunhão.",
          reflectionQuestion:
            "Sua vida devocional hoje é mais fonte de vitalidade ou mais uma obrigação a cumprir? O que revela essa resposta sobre a saúde da sua liderança?",
          xp: 35,
        },
      ],
    },
    {
      id: "lid-mod-3",
      title: "Módulo III: Sabedoria em Ação",
      lessons: [
        {
          id: "lid-3-1",
          title: "Discernimento e Decisão",
          difficulty: 4,
          intro: [
            "Quando Salomão se torna rei ainda jovem, diante de uma responsabilidade que ultrapassa sua experiência, Deus lhe oferece qualquer coisa que ele pedir. Salomão não pede riquezas, longa vida ou vitória sobre inimigos — ele pede 'um coração que ouve' (1 Reis 3:9), a capacidade de discernir entre o certo e o errado para liderar bem o povo de Deus. Sua resposta agrada a Deus precisamente porque revela onde estava seu verdadeiro senso de necessidade.",
            "Toda liderança envolve decisões — algumas pequenas e cotidianas, outras que afetam vidas por anos. Tiago 1:5 promete que 'se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade, e a receberá'. Discernimento bíblico não é apenas inteligência natural ou experiência acumulada — é um dom que se pede, se cultiva e se exercita em submissão à Palavra de Deus.",
          ],
          verses: [
            {
              ref: "1 Reis 3:9",
              textByVersion: {
                NVI: "Dá, pois, ao teu servo um coração que ouve, para governar o teu povo e para poder discernir entre o bem e o mal. Pois, quem poderia governar este teu grande povo?",
              },
              originals: [
                { word: "לֵב שֹׁמֵעַ", translit: "lev shomea", meaning: "'coração que ouve' — expressão hebraica que une inteligência prática e capacidade moral de discernir, não apenas conhecimento intelectual", lang: "hebraico" },
              ],
            },
            {
              ref: "Tiago 1:5",
              textByVersion: {
                NVI: "Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade, e a receberá.",
              },
            },
          ],
          keywords: [
            { word: "לֵב שֹׁמֵעַ", translit: "lev shomea", meaning: "literalmente 'coração ouvinte' — no pensamento hebraico, o coração é o centro da vontade e da decisão, não apenas dos sentimentos; um 'coração que ouve' é receptivo à instrução de Deus", lang: "hebraico" },
          ],
          deepDive:
            "É significativo o que Salomão *não* pede: nem riqueza, nem longa vida, nem vitória militar sobre seus inimigos (1 Reis 3:11) — pedidos absolutamente razoáveis para um rei jovem e inseguro. Ele pede, em vez disso, um 'coração que ouve' (lev shomea), expressão que no pensamento hebraico une duas ideias que costumamos separar: capacidade intelectual de compreender e disposição moral de obedecer. Discernimento bíblico nunca é neutro — não é apenas 'saber a coisa certa a fazer' no sentido abstrato, mas ter um coração disposto a se submeter ao que Deus revela como certo, mesmo quando isso é custoso ou impopular. Tiago 1:5 confirma que essa sabedoria não é reservada a poucos privilegiados; é oferecida livremente a quem a pede com sinceridade — mas o contexto de Tiago 1:6-8 também adverte que ela deve ser pedida 'com fé, sem duvidar', ou seja, com disposição real de agir segundo o que Deus mostrar, não apenas como consulta teórica.",
          theologianQuote: {
            author: "D.A. Carson",
            text: "As pessoas não se movem à deriva rumo à santidade. Sem um esforço movido pela graça, ninguém caminha naturalmente para a piedade, a oração, a obediência às Escrituras, a fé e o prazer no Senhor.",
            source: "For the Love of God, Vol. 2",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Provérbios 3:5-6",
                textByVersion: {
                  NVI: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas.",
                },
              },
            ],
            historicalContext:
              "O relato de 1 Reis 3 ocorre logo no início do reinado de Salomão, num contexto político instável, após a morte de Davi e disputas pela sucessão ao trono (1 Reis 1-2). O pedido de sabedoria acontece exatamente no momento em que Salomão mais sentia o peso e a inexperiência de sua nova responsabilidade.",
            exegeticalNotes:
              "O termo hebraico para 'discernir' em 1 Reis 3:9 (lehavin) está relacionado a distinguir e separar corretamente entre coisas — a mesma raiz usada para descrever a capacidade de separar o sagrado do comum, o puro do impuro. Discernimento, no pensamento bíblico, é sempre relacional a categorias morais claras, não relativismo situacional.",
            theologicalDebate:
              "Cristãos de diferentes tradições divergem sobre como Deus comunica sabedoria e direção hoje (por exemplo, sobre a natureza de impressões pessoais, 'paz interior' como confirmação, ou conselho profético). Esta é uma questão secundária importante; o núcleo comum e inegociável entre tradições fiéis é que toda busca de discernimento deve estar ancorada e submetida à Palavra de Deus já revelada, nunca contradizendo-a. Para decisões pessoais complexas, busque também o conselho do seu pastor ou líder espiritual.",
            secondQuote: {
              author: "Tim Keller",
              text: "Sabedoria não é ter uma técnica que ajuda a tomar as decisões certas; é ter um caráter de mente e coração que capacita a pessoa a tomar as decisões certas.",
              source: "sermão 'The Wellspring of Wisdom', série sobre Provérbios, Redeemer Presbyterian Church (26 de setembro de 2004)",
            },
          },
          quizzes: [
            {
              question: "Por que o pedido de Salomão em 1 Reis 3:9 é significativo?",
              options: [
                "Porque ele pediu riquezas disfarçadas de sabedoria",
                "Porque, podendo pedir qualquer coisa, ele escolheu um coração que ouve para discernir o bem e o mal, revelando onde estava seu verdadeiro senso de necessidade",
                "Porque ele já sabia tudo o que precisava saber",
                "Porque Deus o obrigou a pedir sabedoria",
              ],
              correctIndex: 1,
              explanation: "Entre pedidos razoáveis como riqueza ou vitória militar, Salomão escolhe sabedoria para governar bem — e isso agrada a Deus.",
            },
            {
              question: "A expressão hebraica 'lev shomea' ('coração que ouve') une, no pensamento bíblico:",
              options: [
                "Apenas capacidade emocional",
                "Compreensão intelectual e disposição moral de obedecer, juntas",
                "Apenas conhecimento acadêmico",
                "Sorte e circunstância favorável",
              ],
              correctIndex: 1,
              explanation: "No hebraico bíblico, o coração é centro da vontade e decisão — 'ouvir' com o coração implica disposição de agir segundo o que se compreende.",
            },
          ],
          application:
            "Diante de uma decisão que você está enfrentando agora (grande ou pequena), pare e pergunte, à maneira de Tiago 1:5: já pedi sabedoria a Deus com sinceridade sobre isso, ou apenas confiei no meu próprio raciocínio?",
          prayer:
            "Senhor, dá-me um coração que ouve. Não quero apenas conhecer o que é certo, mas ter coragem e humildade para agir de acordo com o que tu revelas, mesmo quando é difícil. Guarda-me de confiar apenas no meu próprio entendimento. Amém.",
          weeklyChallenge:
            "Antes de tomar a próxima decisão importante que estiver diante de você, escreva num papel: o que a Bíblia já revela sobre princípios relacionados a essa decisão, antes de decidir apenas por instinto ou pressão do momento.",
          reflectionQuestion:
            "Em que decisão recente você percebe, olhando para trás, que confiou mais no seu próprio entendimento do que buscou sinceramente a sabedoria de Deus?",
          xp: 40,
        },
        {
          id: "lid-3-2",
          title: "A Arte de Delegar",
          difficulty: 4,
          intro: [
            "Moisés está exausto. Do amanhecer ao anoitecer, ele julga sozinho todas as disputas do povo de Israel no deserto, enquanto uma fila enorme espera sua vez (Êxodo 18:13-14). Seu sogro Jetro observa a cena e faz uma avaliação direta: 'não é bom o que você está fazendo. Certamente você e o povo que está com você ficarão esgotados, pois essa tarefa é pesada demais; você não pode realizá-la sozinho' (Êxodo 18:17-18).",
            "A solução de Jetro não é que Moisés trabalhe mais ou seja mais eficiente — é que ele compartilhe a responsabilidade, escolhendo homens capazes para julgar os casos menores, reservando para si apenas os casos mais difíceis (Êxodo 18:21-22). O mesmo padrão aparece em Atos 6, quando os apóstolos, sobrecarregados com a distribuição diária de alimentos, escolhem sete homens cheios do Espírito para essa tarefa, liberando-se para 'dedicar-se à oração e ao ministério da palavra' (Atos 6:4). Delegar não é fraqueza de liderança — é sabedoria de liderança.",
          ],
          verses: [
            {
              ref: "Êxodo 18:17-18,21-22",
              textByVersion: {
                NVI: "Respondeu-lhe o sogro de Moisés: 'Não é bom o que você está fazendo. Certamente você e o povo que está com você ficarão esgotados, pois essa tarefa é pesada demais; você não pode realizá-la sozinho'... Escolha ainda dentre o povo homens capazes, tementes a Deus, dignos de confiança, que odeiem o suborno, e estabeleça-os como chefes de mil, chefes de cem, chefes de cinquenta e chefes de dez. Que julguem o povo em todos os momentos.'",
              },
            },
            {
              ref: "Atos 6:3-4",
              textByVersion: {
                NVI: "Portanto, irmãos, escolham dentre vocês sete homens de bom testemunho, cheios do Espírito e de sabedoria; passaremos a eles essa tarefa, e nós nos dedicaremos à oração e ao ministério da palavra.",
              },
            },
          ],
          keywords: [
            { word: "נָשָׂא", translit: "nasá", meaning: "'carregar, levar o peso' — usado em Êxodo 18:22 ('para que seja mais leve para você e eles levem a carga com você'); descreve compartilhar responsabilidade, não apenas transferi-la", lang: "hebraico" },
          ],
          deepDive:
            "É fácil ler Êxodo 18 e Atos 6 apenas como conselhos práticos de organização, mas ambos os textos revelam algo teológico mais profundo: nem mesmo Moisés — o maior líder do Antigo Testamento — nem os apóstolos — os fundadores da igreja primitiva — foram projetados por Deus para fazer tudo sozinhos. A tentação de delegar mal geralmente nasce de duas fontes: orgulho ('ninguém faz tão bem quanto eu') ou insegurança ('se eu não fizer, talvez eu pareça dispensável'). Jetro não sugere que Moisés abandone completamente seu papel — ele reserva para Moisés 'os casos mais difíceis' (Êxodo 18:22) — mas insiste que a maior parte da carga seja compartilhada com pessoas qualificadas e confiáveis. Da mesma forma, os apóstolos não deixam de se importar com a distribuição de alimentos às viúvas; eles reconhecem que sua função primária (oração e ensino da Palavra) seria comprometida se continuassem acumulando tudo. Delegar bem exige humildade para reconhecer limites e confiança genuína em outros — ambas, virtudes de liderança madura.",
          theologianQuote: {
            author: "Thom Rainer",
            text: "Ignoramos a imagem do Corpo de Cristo em 1 Coríntios 12. Negamos essa imagem quando escolhemos desempenhar o papel de cada parte do Corpo — seja fazendo tudo nós mesmos, seja 'limpando a bagunça' do que outros fizeram.",
            source: "'A Quiz for Those of Us who Don't Delegate Well', ThomRainer.com / Church Answers (25 de setembro de 2025)",
          },
          quizzes: [
            {
              question: "Qual foi o diagnóstico de Jetro sobre o método de Moisés em Êxodo 18?",
              options: [
                "Que Moisés precisava trabalhar ainda mais horas",
                "Que a tarefa era pesada demais para uma só pessoa, e que ela esgotaria tanto Moisés quanto o povo",
                "Que Moisés deveria abandonar completamente sua função de juiz",
                "Que o povo não merecia a atenção de Moisés",
              ],
              correctIndex: 1,
              explanation: "Jetro não questiona a dedicação de Moisés, mas o método insustentável de fazer tudo sozinho — a solução é compartilhar a responsabilidade com pessoas qualificadas.",
            },
            {
              question: "Por que os apóstolos escolheram sete homens em Atos 6, em vez de continuarem cuidando pessoalmente da distribuição diária de alimentos?",
              options: [
                "Porque não se importavam com as viúvas necessitadas",
                "Para se dedicarem prioritariamente à oração e ao ministério da Palavra, sua função primária",
                "Porque foram forçados pela multidão",
                "Porque essa tarefa não tinha nenhuma importância espiritual",
              ],
              correctIndex: 1,
              explanation: "Delegar essa responsabilidade não era desinteresse, mas sabedoria para proteger a prioridade central do chamado apostólico.",
            },
          ],
          application:
            "Identifique uma responsabilidade que você carrega sozinho hoje, mas que poderia ser compartilhada com alguém capaz e confiável. Dê o primeiro passo esta semana para começar a delegá-la.",
          prayer:
            "Senhor, livra-me do orgulho de achar que só eu posso fazer bem certas coisas, e da insegurança de temer ser dispensável. Ensina-me a confiar responsabilidades a outros, para servir melhor a quem você colocou sob meu cuidado. Amém.",
          weeklyChallenge:
            "Faça uma lista de tudo que você carrega sozinho atualmente (em casa, no trabalho, no ministério) e marque, ao lado de cada item, se é algo que só você pode fazer ou algo que poderia ser compartilhado.",
          reflectionQuestion:
            "O que te impede, na prática, de delegar mais — orgulho, desconfiança nos outros, medo de perder controle, ou algo diferente?",
          xp: 40,
        },
      ],
    },
    {
      id: "lid-mod-4",
      title: "Módulo IV: Liderando em Meio às Provas",
      lessons: [
        {
          id: "lid-4-1",
          title: "Liderança sob Pressão",
          difficulty: 4,
          intro: [
            "Neemias enfrenta um dos maiores desafios de liderança do Antigo Testamento: reconstruir os muros de Jerusalém, destruídos e abandonados havia décadas, enquanto inimigos externos (Sambalate, Tobias) zombam do projeto, ameaçam ataque armado e espalham boatos de traição (Neemias 4:1-3,7-8,11). Ao mesmo tempo, surgem crises internas — fome entre o próprio povo e conflitos econômicos (Neemias 5:1-5). A pressão vem de todos os lados ao mesmo tempo.",
            "A resposta de Neemias combina duas coisas que parecem opostas, mas que a Bíblia frequentemente une: oração e ação prática. 'Oramos ao nosso Deus, e, por causa deles, mantivemos uma guarda de dia e de noite' (Neemias 4:9). Ele não escolhe entre confiar em Deus ou agir com sabedoria — ele faz as duas coisas ao mesmo tempo. Paulo, séculos depois, descreve a mesma tensão sustentada: 'em tudo somos atribulados, mas não angustiados; perplexos, mas não desesperados' (2 Coríntios 4:8).",
          ],
          verses: [
            {
              ref: "Neemias 4:8-9",
              textByVersion: {
                NVI: "Todos eles se juntaram para vir guerrear contra Jerusalém e criar confusão contra ela... Mas oramos ao nosso Deus, e, por causa deles, mantivemos uma guarda de dia e de noite.",
              },
            },
            {
              ref: "2 Coríntios 4:8-9",
              textByVersion: {
                NVI: "Em tudo somos atribulados, mas não angustiados; perplexos, mas não desesperados; perseguidos, mas não abandonados; abatidos, mas não destruídos.",
              },
              originals: [
                { word: "ἀπορούμενοι", translit: "aporoúmenoi", meaning: "'perplexos, sem saída aparente' — descreve confusão real diante da situação, mas não desespero (ex-aporoúmenoi, 'sem esperança nenhuma'), que Paulo nega em seguida", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἀπορούμενοι", translit: "aporoúmenoi", meaning: "de aporéō, 'estar sem caminho, sem saída aparente' — Paulo admite honestamente a perplexidade real da pressão, sem negar a dificuldade, mas nega que ela leve ao desespero total", lang: "grego" },
          ],
          deepDive:
            "O jogo de palavras de Paulo em 2 Coríntios 4:8-9 (no grego original, cada par usa a mesma raiz com e sem prefixo negativo intensificado) é deliberado: ele não afirma que líderes cristãos estão imunes à pressão, à confusão ou à perseguição — ele afirma honestamente que sentem tudo isso ('perplexos') sem serem consumidos por isso ('mas não desesperados', literalmente 'sem-saída-total'). Isso é importante porque muitos líderes cristãos sentem que precisam projetar uma fachada de confiança inabalável o tempo todo, como se admitir pressão fosse falta de fé. Neemias e Paulo modelam algo diferente: honestidade real sobre a dificuldade, combinada com uma confiança que não depende da ausência de problemas, mas da presença fiel de Deus em meio a eles. A resposta prática de Neemias — orar *e* organizar uma guarda armada — mostra que confiança em Deus nunca substitui sabedoria e ação responsável; ela as acompanha.",
          theologianQuote: {
            author: "Charles Swindoll",
            text: "Críticos desmoralizam. Líderes encorajam. Quando os críticos falaram, os trabalhadores os ouviram e ficaram desmoralizados. Mas quando o líder capaz se levantou e disse: 'Vamos olhar isso à maneira de Deus, permaneçam na obra', a equipe voltou ao trabalho.",
            source: "Hand Me Another Brick: A Study of Nehemiah",
          },
          deepen: {
            historicalContext:
              "A reconstrução dos muros de Jerusalém sob Neemias ocorreu numa janela de apenas 52 dias (Neemias 6:15), um ritmo extraordinariamente rápido para a época, realizado sob oposição contínua e ameaça real de ataque armado — o texto descreve trabalhadores erguendo o muro com uma ferramenta numa mão e uma arma na outra (Neemias 4:17).",
            exegeticalNotes:
              "O verbo usado para 'orar' em Neemias 4:9 está no tempo que indica ação contínua, sugerindo oração sustentada ao longo da crise, não um único pedido pontual — reforçando que a resposta de Neemias foi um padrão constante, não uma reação isolada.",
            theologicalDebate:
              "Existe discussão legítima entre cristãos sobre até que ponto líderes devem confrontar oposição diretamente (como Neemias fez, organizando defesa armada) versus responder com não-resistência em certas situações. O contexto de Neemias é de liderança civil/nacional com responsabilidade de proteção física do povo — diferente, por exemplo, do chamado de Jesus e dos apóstolos a sofrer perseguição sem retaliação pessoal por causa do Evangelho. Para discernir como aplicar esses princípios em situações específicas de conflito ou oposição, busque o conselho do seu pastor ou líder espiritual.",
              secondQuote: {
                author: "Hernandes Dias Lopes",
                text: "Realmente, Neemias é um grande exemplo de liderança, pois mesmo a realidade dizendo que não era possível a reconstrução, ele permaneceu confiando naquele que o havia chamado.",
                source: "'Neemias, um líder que mudou a história de uma nação', hernandesdiaslopes.com.br",
              },
          },
          quizzes: [
            {
              question: "Como Neemias respondeu simultaneamente às ameaças externas contra a reconstrução do muro?",
              options: [
                "Abandonou o projeto até a ameaça passar",
                "Orou a Deus e, ao mesmo tempo, organizou uma guarda prática de proteção",
                "Ignorou completamente a ameaça, sem tomar nenhuma precaução",
                "Confiou apenas em armas, sem buscar a Deus",
              ],
              correctIndex: 1,
              explanation: "Neemias 4:9 mostra as duas respostas juntas: oração genuína e ação prática responsável, sem que uma substitua a outra.",
            },
            {
              question: "O termo grego 'aporoúmenoi' ('perplexos') em 2 Coríntios 4:8 descreve:",
              options: [
                "Ausência total de qualquer dificuldade",
                "Confusão real diante da pressão, mas sem cair em desespero total",
                "Fingimento de tranquilidade emocional",
                "Falta de fé genuína",
              ],
              correctIndex: 1,
              explanation: "Paulo admite honestamente a perplexidade da pressão, mas nega que ela leve à falta total de esperança — as duas coisas coexistem.",
            },
          ],
          application:
            "Diante de uma pressão que você enfrenta agora como líder (em casa, no trabalho, no ministério), pratique o padrão de Neemias: leve o problema a Deus em oração honesta e, ao mesmo tempo, dê um passo prático e responsável esta semana.",
          prayer:
            "Senhor, quando a pressão vem de todos os lados, não me deixes escolher entre confiar em ti e agir com sabedoria — ensina-me a fazer as duas coisas juntas, como Neemias fez. Sustenta-me para que eu não desista da obra que confiaste a mim. Amém.",
          weeklyChallenge:
            "Escreva, num só parágrafo, a pressão mais real que você enfrenta hoje como líder — sem minimizá-la — e, logo abaixo, um passo prático concreto que você pode dar esta semana apesar dela.",
          reflectionQuestion:
            "Você tende a reagir à pressão mais com paralisia (parar tudo), mais com ansiedade descontrolada, ou mais com o padrão bíblico de oração e ação combinadas? O que precisaria mudar?",
          xp: 45,
        },
        {
          id: "lid-4-2",
          title: "Cuidado Pastoral",
          difficulty: 4,
          intro: [
            "Jesus se descreve como 'o bom pastor', em contraste com o mercenário que 'não se importa com as ovelhas' e foge quando vê o lobo se aproximar (João 10:11-13). A diferença central não é competência técnica em cuidar de ovelhas, mas relação genuína: 'conheço as minhas ovelhas, e elas me conhecem' (João 10:14). Cuidado pastoral, no sentido bíblico, nunca é gestão distante de pessoas — é relacionamento próximo o suficiente para conhecer, e comprometido o suficiente para permanecer quando as coisas ficam difíceis.",
            "Pedro estende essa mesma imagem aos líderes da igreja: 'pastoreiem o rebanho de Deus que está sob os seus cuidados... não por imposição, mas espontaneamente... não como dominadores dos que lhes foram confiados, mas como exemplos ao rebanho' (1 Pedro 5:2-3). Cuidar pastoralmente das pessoas sob sua influência é parte inseparável de liderar cristãmente — não é uma tarefa reservada apenas a pastores ordenados, mas um princípio para todo aquele que tem influência sobre outros na fé.",
          ],
          verses: [
            {
              ref: "João 10:11-14",
              textByVersion: {
                NVI: "'Eu sou o bom pastor. O bom pastor dá a sua vida pelas ovelhas. O mercenário foge porque é apenas assalariado e não se importa com as ovelhas... Eu sou o bom pastor; conheço as minhas ovelhas, e elas me conhecem.'",
              },
              originals: [
                { word: "ποιμήν", translit: "poimḗn", meaning: "'pastor' — aquele que conduz, alimenta, protege e conhece pessoalmente o rebanho, diferente de quem apenas o supervisiona à distância", lang: "grego" },
              ],
            },
            {
              ref: "1 Pedro 5:2-3",
              textByVersion: {
                NVI: "Pastoreiem o rebanho de Deus que está sob os seus cuidados, servindo como bispos, não por imposição, mas espontaneamente, de acordo com a vontade de Deus; não por ganância, mas de bom grado; não como dominadores dos que lhes foram confiados, mas como exemplos ao rebanho.",
              },
            },
          ],
          keywords: [
            { word: "ποιμαίνω", translit: "poimaínō", meaning: "'pastorear' — verbo que envolve alimentar, guiar, proteger e cuidar continuamente, não apenas administrar ou supervisionar de longe", lang: "grego" },
          ],
          deepDive:
            "A diferença que Jesus estabelece entre o 'bom pastor' e o 'mercenário' (João 10:11-13) não está na tarefa realizada — ambos, à primeira vista, cuidam do rebanho —, mas na motivação e no compromisso por trás dela. O mercenário faz o trabalho enquanto é conveniente e foge diante do perigo real, porque as ovelhas não são realmente suas; o pastor permanece porque as ovelhas são dele, e ele as conhece pessoalmente. Isso desafia diretamente qualquer modelo de liderança cristã que trate pessoas como números, projetos ou tarefas a gerenciar. 1 Pedro 5:2-3 acrescenta três contrastes práticos para quem lidera pastoralmente: motivação (espontânea, não forçada), interesse (serviço genuíno, não ganância pessoal) e método (exemplo vivido, não dominação). Cuidado pastoral genuíno exige proximidade suficiente para conhecer as dores reais das pessoas — o que é mais custoso, e também mais fiel ao modelo de Cristo, do que liderar de forma distante e apenas funcional.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Você não pode cuidar do povo de Deus, e zelar por ele em todos os seus pecados, tentações, provações e dificuldades, a menos que o ame; você se cansará e se fatigará da obra pastoral se não houver uma fonte constante de amor brotando em seu coração por eles.",
            source: "sermão 'Feed My Sheep', Pastor's College Conference (13 de abril de 1877)",
          },
          quizzes: [
            {
              question: "Segundo João 10:11-14, o que diferencia o 'bom pastor' do 'mercenário'?",
              options: [
                "O bom pastor tem mais treinamento técnico",
                "O bom pastor conhece pessoalmente as ovelhas e permanece mesmo diante do perigo, enquanto o mercenário foge porque não se importa de verdade",
                "O mercenário cuida melhor das ovelhas por ser pago para isso",
                "Não há diferença real entre os dois",
              ],
              correctIndex: 1,
              explanation: "A diferença está na motivação e no compromisso genuíno — o bom pastor dá a própria vida pelas ovelhas; o mercenário abandona quando fica difícil.",
            },
            {
              question: "Segundo 1 Pedro 5:2-3, como líderes devem pastorear o rebanho de Deus?",
              options: [
                "Por imposição, ganância e dominação sobre os outros",
                "Espontaneamente, de bom grado, e como exemplo vivido — não como dominadores",
                "Apenas quando forem pagos para isso",
                "Mantendo distância emocional das pessoas cuidadas",
              ],
              correctIndex: 1,
              explanation: "Pedro contrasta explicitamente o cuidado pastoral genuíno com imposição, ganância e dominação — o modelo bíblico é serviço espontâneo e exemplo vivido.",
            },
          ],
          application:
            "Pense em alguém sob sua influência espiritual (alguém que você discipula, lidera ou acompanha). Pergunte-se honestamente: você conhece de verdade as dores e lutas reais dessa pessoa, ou apenas gerencia sua participação em atividades?",
          prayer:
            "Senhor, tu és o bom pastor que conhece cada ovelha pelo nome. Ensina-me a cuidar das pessoas que colocaste sob minha influência com o mesmo compromisso — não como tarefas a administrar, mas como pessoas a amar e conhecer de verdade. Amém.",
          weeklyChallenge:
            "Esta semana, dedique um tempo de qualidade e atenção total (sem pressa, sem agenda paralela) a uma pessoa que você lidera ou disciplina, apenas para ouvir como ela realmente está.",
          reflectionQuestion:
            "Existe alguém sob sua influência que você tem tratado mais como 'mercenário' (funcional, distante) do que como 'bom pastor' (próximo, comprometido)? O que poderia mudar isso?",
          xp: 45,
        },
      ],
    },
    {
      id: "lid-mod-5",
      title: "Módulo V: Terminando Bem",
      lessons: [
        {
          id: "lid-5-1",
          title: "Lidando com Fracassos",
          difficulty: 4,
          intro: [
            "Poucas quedas na Bíblia são tão públicas e dolorosas quanto a de Pedro. Depois de prometer com toda confiança que jamais abandonaria Jesus, mesmo que precisasse morrer com ele (Mateus 26:33-35), Pedro nega conhecê-lo três vezes, na mesma noite, diante de uma simples serva — e, ao ouvir o galo cantar, 'saiu dali e chorou amargamente' (Lucas 22:62). Não há maquiagem nesse relato: o mais proeminente dos discípulos falhou de forma grave e pública.",
            "Mas a história de Pedro não termina no fracasso. Ressuscitado, Jesus vai pessoalmente ao encontro de Pedro à beira do mar da Galileia e, três vezes — o mesmo número das negações —, pergunta 'você me ama?' e, três vezes, comissiona: 'apascenta as minhas ovelhas' (João 21:15-17). Deus não descarta líderes que falham; Ele os restaura, quando há arrependimento genuíno, e frequentemente os usa de forma ainda mais poderosa depois da queda — como o próprio Pedro seria, semanas depois, no dia de Pentecostes.",
          ],
          verses: [
            {
              ref: "Lucas 22:60-62",
              textByVersion: {
                NVI: "Pedro respondeu: 'Homem, não sei do que você está falando!' Falava ele ainda, quando o galo cantou. O Senhor se voltou e olhou diretamente para Pedro. Então Pedro se lembrou da palavra que o Senhor lhe tinha dito: 'Hoje, antes que o galo cante, você me negará três vezes'. E, saindo dali, chorou amargamente.",
              },
            },
            {
              ref: "João 21:15-17",
              textByVersion: {
                NVI: "Depois de comerem, Jesus perguntou a Simão Pedro: 'Simão, filho de João, você me ama mais do que estes?' Disse ele: 'Sim, Senhor, tu sabes que te amo'. Disse Jesus: 'Alimente os meus cordeiros'... A terceira vez perguntou-lhe: 'Simão, filho de João, você me ama?' Pedro entristeceu-se por Jesus lhe ter perguntado pela terceira vez: 'Você me ama?' e disse: 'Senhor, tu sabes todas as coisas; tu sabes que te amo'. Disse Jesus: 'Apascente as minhas ovelhas.'",
              },
              originals: [
                { word: "ἀγαπάω / φιλέω", translit: "agapáō / philéō", meaning: "dois verbos distintos para 'amar' — Jesus pergunta com 'agapáō' (amor de compromisso pleno) nas duas primeiras vezes, e Pedro responde com 'philéō' (amor de afeto pessoal); na terceira, Jesus usa 'philéō', encontrando Pedro onde ele está", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "φιλέω", translit: "philéō", meaning: "amar com afeto pessoal e amizade — a palavra que Pedro usa nas três respostas, talvez porque, após sua queda, não ousasse mais afirmar o compromisso total implícito em 'agapáō'", lang: "grego" },
          ],
          deepDive:
            "A troca de verbos entre 'agapáō' e 'philéō' em João 21:15-17 é um dos detalhes mais discutidos do quarto Evangelho — e mesmo que estudiosos divirjam sobre o quanto essa distinção era ainda percebida como forte no grego koiné da época, o padrão literário permanece significativo: Pedro, que outrora prometera lealdade absoluta e falhou publicamente, agora responde com uma palavra mais modesta, de afeto pessoal, em vez de reivindicar o compromisso pleno que já demonstrara não conseguir sustentar sozinho. Jesus não o repreende por isso; Ele o encontra exatamente onde ele está, e por três vezes — espelhando deliberadamente as três negações — o restaura publicamente à sua missão: 'apascenta as minhas ovelhas'. O fracasso de Pedro não foi a palavra final sobre sua vida ou seu chamado; foi o cenário em que a graça restauradora de Cristo se tornou mais visível. Isso não trivializa a gravidade do pecado — Pedro chorou amargamente —, mas mostra que arrependimento genuíno sempre encontra a porta da restauração aberta.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "Graça custosa é o evangelho que precisa ser buscado repetidas vezes, o dom que precisa ser pedido, a porta em que se deve bater. [...] É custosa porque condena o pecado, e é graça porque justifica o pecador.",
            source: "The Cost of Discipleship (Nachfolge, 1937)",
          },
          deepen: {
            historicalContext:
              "A cultura mediterrânea antiga atribuía enorme peso à honra pública e à vergonha — uma negação pública tríplice, diante de testemunhas, seria vista como desonra praticamente irreparável para a reputação de qualquer pessoa daquela época, o que torna a restauração pública de Pedro por Jesus (também diante de outros discípulos, João 21:2-3) ainda mais notável.",
            exegeticalNotes:
              "O cenário de João 21 — junto ao mar da Galileia, com uma fogueira de brasas (João 21:9) — ecoa deliberadamente o cenário da negação de Pedro, que também ocorreu junto a uma fogueira de brasas no pátio do sumo sacerdote (João 18:18). O paralelo parece intencional: Jesus recria o cenário para oferecer restauração exatamente no tipo de contexto em que ocorreu a queda.",
            theologicalDebate:
              "Tradições cristãs divergem sobre os detalhes exatos de restauração formal de líderes que caem em pecado grave (por exemplo, prazos, processos e se — e quando — é apropriado retomar funções específicas de liderança pública). Esta é uma questão importante que exige sabedoria pastoral caso a caso; o princípio bíblico central aqui é que a graça de Deus genuinamente restaura o arrependido, mas restauração ao caráter (relação com Deus) e restauração à função pública de liderança nem sempre seguem o mesmo ritmo ou processo. Para situações reais de queda e restauração, busque sempre o acompanhamento do seu pastor e da liderança da sua igreja local.",
            secondQuote: {
              author: "C.S. Lewis",
              text: "O arrependimento não é algo que Deus exige de você antes de aceitá-lo de volta, e que Ele poderia dispensar se quisesse; é simplesmente a descrição de como é o caminho de volta.",
              source: "Mere Christianity (HarperCollins), p. 60",
            },
          },
          quizzes: [
            {
              question: "O que a restauração de Pedro em João 21:15-17 ensina sobre líderes que fracassam gravemente?",
              options: [
                "Que o fracasso de Pedro desqualificou-o permanentemente da liderança",
                "Que Deus, diante de arrependimento genuíno, restaura líderes caídos e pode recomissioná-los à sua missão",
                "Que Jesus nunca menciona novamente a negação de Pedro",
                "Que fracassar publicamente é irrelevante para a vida espiritual",
              ],
              correctIndex: 1,
              explanation: "Jesus restaura Pedro deliberadamente, espelhando as três negações com três perguntas e três comissionamentos — graça que restaura, sem minimizar a gravidade da queda.",
            },
            {
              question: "A alternância entre os verbos gregos 'agapáō' e 'philéō' em João 21:15-17 é frequentemente entendida como:",
              options: [
                "Um erro de tradução sem significado",
                "Jesus encontrando Pedro com humildade, onde ele estava, após sua queda pública",
                "Uma prova de que Pedro nunca amou Jesus verdadeiramente",
                "Uma disputa teológica sem relação com o contexto da negação",
              ],
              correctIndex: 1,
              explanation: "A troca de verbos, no contexto da restauração após a negação, sugere Jesus encontrando Pedro em sua humildade real, sem exigir dele mais do que ele podia genuinamente afirmar naquele momento.",
            },
          ],
          application:
            "Se você carrega hoje o peso de um fracasso de liderança (grande ou pequeno), traga-o abertamente diante de Deus em oração, sem minimizá-lo nem se afundar nele — e pergunte-se que passo concreto de restauração e recomeço você pode dar.",
          prayer:
            "Senhor, assim como restauraste Pedro depois da sua queda, restaura-me também nos meus próprios fracassos como líder. Não me deixes fugir da tua presença por vergonha, nem fingir que a queda não aconteceu — encontra-me, como encontraste Pedro, e recomissiona-me para o teu serviço. Amém.",
          weeklyChallenge:
            "Se existe um fracasso não resolvido em sua trajetória de liderança, procure esta semana uma conversa honesta com seu pastor, discipulador ou líder espiritual sobre ele, buscando processo genuíno de restauração.",
          reflectionQuestion:
            "Existe algum fracasso de liderança em seu passado que você ainda não trouxe honestamente diante de Deus e de pessoas de confiança para processar e ser restaurado?",
          xp: 45,
        },
        {
          id: "lid-5-2",
          title: "Deixando um Legado",
          difficulty: 4,
          intro: [
            "Ao fim de sua vida, prestes a ser executado, Paulo escreve a Timóteo, seu discípulo mais próximo, com um tom de despedida e comissionamento ao mesmo tempo: 'combati o bom combate, terminei a corrida, guardei a fé' (2 Timóteo 4:7). Mas antes disso, no mesmo livro, ele já havia dado a Timóteo a chave de todo legado espiritual duradouro: 'o que você ouviu de mim na presença de muitas testemunhas, confie a homens fiéis, que sejam também capazes de ensinar a outros' (2 Timóteo 2:2).",
            "Note a estrutura: Paulo → Timóteo → homens fiéis → outros. Quatro gerações de discipulado explicitamente nomeadas num só versículo. Legado bíblico nunca é sobre construir um monumento pessoal que carregue seu nome — é sobre multiplicar fidelidade para além da própria vida. O verdadeiro teste de uma liderança não é o quanto ela realizou enquanto estava presente, mas o quanto continua frutificando quando ela já não está mais lá.",
          ],
          verses: [
            {
              ref: "2 Timóteo 2:2",
              textByVersion: {
                NVI: "E as coisas que você me ouviu dizer na presença de muitas testemunhas, confie-as a homens fiéis, que sejam também capazes de ensinar a outros.",
              },
              originals: [
                { word: "παράθου", translit: "paráthou", meaning: "'confie, deposite' — termo usado para depósitos valiosos entregues à guarda responsável de outra pessoa; transmissão cuidadosa, não descarte casual", lang: "grego" },
              ],
            },
            {
              ref: "2 Timóteo 4:6-8",
              textByVersion: {
                NVI: "Quanto a mim, já estou sendo derramado como oferta de bebida, e o tempo da minha partida está próximo. Combati o bom combate, terminei a corrida, guardei a fé. Agora me está reservada a coroa da justiça, que o Senhor, justo Juiz, me dará naquele dia; e não somente a mim, mas também a todos os que amam a sua vinda.",
              },
            },
          ],
          keywords: [
            { word: "παρατίθημι", translit: "paratíthēmi", meaning: "'confiar, depositar sob cuidado' — imagem financeira de um depósito valioso entregue a alguém de confiança, que deve ser preservado e, no caso de 2 Timóteo 2:2, repassado adiante com fidelidade", lang: "grego" },
          ],
          deepDive:
            "A cadeia de 2 Timóteo 2:2 (Paulo → Timóteo → homens fiéis → outros) descreve o que hoje se chamaria discipulado multiplicador: não basta que a fé chegue à geração seguinte; ela precisa ser transmitida de forma que essa geração seguinte também seja 'capaz de ensinar a outros'. Um líder que forma seguidores dependentes de sua presença pessoal constrói algo frágil, que desaba quando ele sai de cena; um líder que forma outros líderes, capazes de multiplicar o que receberam, constrói algo que continua crescendo muito além de sua própria vida. Em 2 Timóteo 4:7, ao olhar para trás no fim da vida, Paulo não celebra números, plataformas ou reconhecimento público — celebra fidelidade sustentada: 'combati o bom combate, terminei a corrida, guardei a fé'. O verdadeiro legado de um líder cristão não se mede pelo tamanho do que ele construiu sob seu próprio nome, mas pela fidelidade transmitida às pessoas que ele deixa para trás, capazes de continuar multiplicando o que aprenderam.",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "O maior legado que um líder cristão pode deixar não é uma obra com seu nome, mas discípulos fiéis que continuam multiplicando o Evangelho muito depois que sua própria voz já não puder mais ser ouvida. (paráfrase de uma ênfase recorrente em seus estudos sobre 2 Timóteo)",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme a formulação exata antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo 2 Timóteo 2:2, qual é o padrão de multiplicação espiritual que Paulo ensina a Timóteo?",
              options: [
                "Que Timóteo deveria guardar o ensino só para si mesmo",
                "Que Timóteo deveria confiar o que aprendeu a homens fiéis, capazes também de ensinar a outros — uma cadeia de multiplicação",
                "Que apenas Paulo tinha autoridade para ensinar",
                "Que o ensino deveria ser restrito a especialistas acadêmicos",
              ],
              correctIndex: 1,
              explanation: "O versículo descreve explicitamente quatro gerações de transmissão fiel — Paulo, Timóteo, homens fiéis, e outros — o padrão bíblico de multiplicação de discípulos.",
            },
            {
              question: "Em 2 Timóteo 4:7, ao refletir sobre sua vida perto do fim, o que Paulo celebra?",
              options: [
                "O tamanho de suas conquistas públicas e reconhecimento",
                "Fidelidade sustentada: ter combatido o bom combate, terminado a corrida e guardado a fé",
                "As riquezas que acumulou ao longo do ministério",
                "O número de pessoas que o seguiam pessoalmente",
              ],
              correctIndex: 1,
              explanation: "Paulo não menciona números ou reconhecimento — celebra fidelidade perseverante até o fim, o verdadeiro critério bíblico de um legado bem-sucedido.",
            },
          ],
          application:
            "Identifique uma ou duas pessoas em quem você poderia investir intencionalmente, ensinando não apenas conteúdo, mas o próprio hábito de discipular outros — de modo que, um dia, elas continuem multiplicando isso sem depender de você.",
          prayer:
            "Senhor, ajuda-me a não construir nada em meu próprio nome, mas a investir fielmente em outros, para que o que recebi de ti continue multiplicando muito depois que minha própria voz já não estiver mais aqui. Que, ao fim, eu também possa dizer que guardei a fé. Amém.",
          weeklyChallenge:
            "Comece, esta semana, a investir intencionalmente em uma pessoa mais nova na fé, com o objetivo explícito de que ela um dia seja capaz de discipular outras pessoas também — não apenas de acompanhá-la de longe.",
          reflectionQuestion:
            "Se sua influência e liderança terminassem hoje, o que continuaria frutificando depois — ou tudo dependeria da sua presença pessoal para continuar existindo?",
          xp: 50,
        },
      ],
    },
  ],
};

export const additionalTrails7: Trail[] = [lideranca];
