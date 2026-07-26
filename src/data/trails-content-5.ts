// Conteúdo pastoral completo — Turno 5.
// Trilha 6 (Evangelismo).
// Padrão idêntico ao já usado em "Novo Convertido", "Como Estudar a Bíblia",
// "Oração", "Santificação", "Fundamentos da Fé", "Igreja Local", "Família
// Cristã" e "Missões".
// Base teológica: Cristão Evangélico, Batista Aberto, soteriologia arminiana
// (autores reformados usados como referência secundária, sem normatividade
// soteriológica), cristocêntrico, cessacionista moderado. Sola Scriptura.
// Esta trilha retoma e aprofunda o que já foi introduzido em "nc-4-3"
// (Novo Convertido, Módulo IV): lá, o crente aprendeu que testemunhar é um
// chamado geral; aqui, ele aprende a fazer isso com clareza, coragem e
// sabedoria.

import type { Trail } from "./content";

const evangelismo: Trail = {
  id: "evangelismo",
  title: "Evangelismo",
  description: "Compartilhando o Evangelho no cotidiano.",
  icon: "Megaphone",
  color: "from-blue-500 to-cyan-500",
  order: 6,
  modules: [
    {
      id: "ev-mod-1",
      title: "Módulo I: O Coração do Evangelho e da Missão",
      lessons: [
        {
          id: "ev-1-1",
          title: "O Evangelho em Poucas Palavras",
          difficulty: 2,
          intro: [
            "Antes de aprender a compartilhar o Evangelho, é preciso ter clareza sobre uma pergunta simples e decisiva: o que exatamente é o Evangelho? Muita gente evangeliza há anos sem conseguir resumir, em poucas frases, a mensagem que está anunciando — e o resultado costuma ser uma mistura confusa de moralismo ('seja uma pessoa melhor'), autoajuda espiritual ('Deus tem um plano maravilhoso para você') ou apenas convite social ('venha à minha igreja').",
            "'Evangelho' traduz a palavra grega 'euangélion' — boa notícia. E notícia é diferente de conselho. Um conselho diz o que você deve fazer; uma notícia anuncia algo que já aconteceu, fora de você, e que muda sua situação. O Evangelho não é primariamente um conjunto de instruções morais — é o anúncio de que Deus agiu, na história, através de Jesus Cristo, para resolver o problema mais profundo da humanidade: nossa separação de Deus por causa do pecado.",
            "Paulo resume essa mensagem com precisão em 1 Coríntios 15:3-5, usando linguagem técnica de transmissão de tradição confiável ('recebi' e 'transmiti'): Cristo morreu pelos nossos pecados, foi sepultado, ressuscitou ao terceiro dia — tudo conforme as Escrituras. Quatro fatos históricos, com uma interpretação teológica inseparável deles: essa morte foi 'pelos nossos pecados'.",
            "Evangelizar, portanto, não é primariamente ser persuasivo, carismático ou bem-informado — é ser fiel a uma mensagem que não nos pertence e que não podemos alterar. O evangelista mais eficaz não é o mais talentoso, mas o mais fiel ao que já foi 'recebido e transmitido'.",
          ],
          verses: [
            {
              ref: "1 Coríntios 15:3-5",
              textByVersion: {
                NVI: "Pois o que primeiramente vos transmiti foi o que recebi: que Cristo morreu pelos nossos pecados, segundo as Escrituras, que foi sepultado, que ressuscitou ao terceiro dia, segundo as Escrituras, e que apareceu a Pedro e depois aos Doze.",
                ACF: "Porque primeiramente vos entreguei o que também recebi: que Cristo morreu por nossos pecados, segundo as Escrituras; e que foi sepultado, e que ressuscitou ao terceiro dia, conforme as Escrituras; e que foi visto por Cefas, e depois pelos doze.",
                NVT: "Pois o que recebi, e é da mais alta importância, eu passei adiante para vocês: que Cristo morreu pelos nossos pecados, conforme haviam anunciado as Escrituras. Ele foi sepultado e ressuscitou ao terceiro dia, como as Escrituras haviam predito. Depois apareceu a Pedro e, então, aos Doze.",
              },
              originals: [
                { word: "εὐαγγέλιον", translit: "euangélion", meaning: "'boa notícia' — anúncio de um fato já realizado, não uma proposta ou conselho", lang: "grego" },
                { word: "παρέδωκα", translit: "parédōka", meaning: "'transmiti, entreguei' — termo técnico para a passagem fiel de uma tradição recebida, sem alteração", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 1:16",
              textByVersion: {
                NVI: "Não me envergonho do evangelho, porque é o poder de Deus para a salvação de todo aquele que crê: primeiro do judeu, depois do grego.",
                ACF: "Porque não me envergonho do evangelho de Cristo, pois é o poder de Deus para salvação de todo aquele que crê; primeiro do judeu, e também do grego.",
                NVT: "Pois não tenho vergonha desta Boa Notícia a respeito de Cristo. É o poder de Deus para salvar todos os que creem, os judeus primeiro e também os gentios.",
              },
              originals: [
                { word: "δύναμις", translit: "dýnamis", meaning: "'poder, força ativa' — o Evangelho não apenas informa, ele produz salvação real em quem crê", lang: "grego" },
              ],
            },
            {
              ref: "João 3:16",
              textByVersion: {
                NVI: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.",
                ACF: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
              },
            },
          ],
          keywords: [
            { word: "εὐαγγέλιον", translit: "euangélion", meaning: "'boa notícia' — no mundo greco-romano, usada para anunciar vitórias militares ou a ascensão de um imperador; os cristãos a aplicam a Cristo, o verdadeiro Rei.", lang: "grego" },
            { word: "κήρυγμα", translit: "kḗrygma", meaning: "'proclamação' — o conteúdo essencial pregado pelos apóstolos, distinto de ensino moral ou especulação filosófica.", lang: "grego" },
            { word: "πίστις", translit: "pístis", meaning: "'fé' — resposta pessoal de confiança e entrega à mensagem anunciada, não mero assentimento intelectual.", lang: "grego" },
          ],
          deepDive:
            "Se você precisasse resumir o Evangelho para alguém em trinta segundos, o que diria? Um jeito simples e fiel de organizar essa mensagem segue quatro movimentos da própria narrativa bíblica: Deus (criou tudo bom, e é santo e justo), Homem (pecou, se rebelou, está separado de Deus e sob julgamento), Cristo (o Filho de Deus se encarnou, viveu sem pecado, morreu como substituto na cruz e ressuscitou fisicamente), Resposta (arrependimento e fé pessoal em Cristo, não obras, é o que recebe essa salvação). Esse esqueleto de quatro pontos aparece, com variações de linguagem, em praticamente todo resumo evangelístico fiel já usado pela Igreja — porque não é uma fórmula inventada, é a estrutura da própria mensagem apostólica. O erro mais comum ao evangelizar é pular direto para 'Cristo' e 'Resposta' sem primeiro estabelecer quem é Deus e qual é o problema real do pecado — o resultado é um Evangelho que soa como solução para um problema que a pessoa ainda não sabe que tem.",
          theologianQuote: {
            author: "John Stott",
            text: "O Evangelho não é um bom conselho sobre o que fazer, mas uma boa notícia sobre o que Deus fez.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Atos 2:22-24",
                textByVersion: {
                  NVI: "Israelitas, ouçam isto: Jesus de Nazaré foi aprovado por Deus diante de vocês por milagres, maravilhas e sinais que Deus fez por meio dele... vocês o mataram, pregando-o na cruz por mãos de homens iníquos. Mas Deus o ressuscitou, rompendo os laços da morte, porque era impossível que ela o retivesse.",
                },
              },
            ],
            historicalContext:
              "A maioria dos estudiosos do Novo Testamento, de diferentes tradições, reconhece em 1 Coríntios 15:3-5 uma fórmula credal extremamente antiga — provavelmente formulada em aramaico nos primeiros anos após a ressurreição, e já em circulação fixa quando Paulo a 'recebeu', anos antes de escrever a carta. Isso significa que a afirmação central do cristianismo (morte, sepultamento e ressurreição de Cristo) não é uma lenda que cresceu lentamente com o tempo, mas uma confissão fixada e transmitida desde os primeiríssimos anos do movimento cristão.",
            exegeticalNotes:
              "Os verbos 'parélabon' (recebi) e 'parédōka' (transmiti), em 1 Coríntios 15:3, são termos técnicos rabínicos para a transmissão cuidadosa e fiel de uma tradição — o mesmo vocabulário usado para descrever como um rabino passava adiante um ensino sem distorcê-lo. Paulo está deliberadamente sinalizando que não está inventando nada: está entregando o que ele mesmo recebeu de outros, na cadeia apostólica.",
            theologicalDebate:
              "Existem diferentes formas legítimas de resumir e apresentar o Evangelho de modo memorável — o esquema de quatro pontos usado aqui (Deus-Homem-Cristo-Resposta), a 'Ponte' (a cruz como ponte sobre o abismo do pecado), as 'Quatro Leis Espirituais' e outros. Nenhum desses formatos é, em si, mais 'correto' que os outros — são ferramentas pedagógicas, não Escritura. O que realmente importa, e é inegociável, é que qualquer resumo usado preserve fielmente o conteúdo do Evangelho apostólico: a santidade de Deus, a gravidade real do pecado, a morte substitutiva e a ressurreição corporal de Cristo, e a necessidade de uma resposta pessoal de fé e arrependimento — nunca apenas um convite a 'aceitar Jesus' sem esses fundamentos.",
            secondQuote: {
              author: "Tim Keller",
              text: "O Evangelho não é apenas o ABC da vida cristã, mas o A ao Z: não é só a porta de entrada da fé, é a casa inteira em que vivemos.",
            },
          },
          quizzes: [
            {
              question: "Segundo 1 Coríntios 15:3-5, qual é o núcleo histórico da mensagem que Paulo 'recebeu e transmitiu'?",
              options: [
                "Uma lista de regras morais para se viver corretamente",
                "A morte de Cristo pelos pecados, seu sepultamento e sua ressurreição ao terceiro dia, conforme as Escrituras",
                "Uma experiência espiritual subjetiva de Paulo",
                "Uma promessa de prosperidade material para quem crê",
              ],
              correctIndex: 1,
              explanation: "Paulo usa linguagem técnica de transmissão fiel de tradição para descrever fatos históricos objetivos: morte, sepultamento e ressurreição de Cristo, ambos conforme as Escrituras.",
            },
            {
              question: "Qual é a diferença essencial entre 'Evangelho' e um simples 'bom conselho', segundo esta lição?",
              options: [
                "Não há diferença real entre os dois",
                "O Evangelho é uma notícia sobre algo que Deus já fez; o conselho diz o que você ainda precisa fazer",
                "O Evangelho é apenas para quem já é religioso",
                "Um bom conselho é sempre mais eficaz que uma notícia",
              ],
              correctIndex: 1,
              explanation: "'Euangélion' significa boa notícia — o anúncio de um fato consumado por Deus em Cristo, não uma instrução moral a ser cumprida por esforço próprio.",
            },
            {
              question: "Qual erro comum a lição aponta ao resumir o Evangelho para alguém?",
              options: [
                "Falar demais sobre a santidade de Deus",
                "Pular direto para 'Cristo' e a resposta pessoal, sem primeiro estabelecer quem é Deus e a gravidade real do pecado",
                "Usar demais as línguas originais",
                "Mencionar a ressurreição de Cristo",
              ],
              correctIndex: 1,
              explanation: "Sem entender o problema (Deus é santo, o homem pecou), a solução em Cristo soa como resposta a uma pergunta que a pessoa ainda não fez.",
            },
          ],
          application:
            "Escreva, em no máximo cinco frases, seu próprio resumo do Evangelho, seguindo o esquema Deus-Homem-Cristo-Resposta. Leia em voz alta para si mesmo até conseguir dizê-lo sem consultar o papel.",
          prayer:
            "Senhor, obrigado pela boa notícia de Cristo — não um conselho que eu preciso seguir, mas uma obra que já foi consumada por ti. Perdoa-me pelas vezes em que troquei o Evangelho por moralismo ou por convite social vazio. Dá-me clareza para entender essa mensagem profundamente, e coragem para anunciá-la com fidelidade, sem acrescentar nem tirar nada do que tu já revelaste. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Nesta semana, pratique seu resumo do Evangelho (Deus-Homem-Cristo-Resposta) com um amigo cristão de confiança, pedindo que ele aponte onde você pode ganhar clareza ou fidelidade bíblica.",
          reflectionQuestion:
            "Se alguém te perguntasse agora mesmo 'o que é o cristianismo, resumidamente?', o que você responderia — e essa resposta seria mais parecida com um conselho moral ou com uma boa notícia histórica?",
          xp: 25,
        },
        {
          id: "ev-1-2",
          title: "Por Que Evangelizar? O Coração de Deus pelos Perdidos",
          difficulty: 2,
          intro: [
            "Muita gente evangeliza — quando evangeliza — motivada principalmente por culpa ou obrigação religiosa: 'eu deveria fazer isso' ou 'vou ser cobrado se não fizer'. Essa motivação, embora compreensível, é frágil e não sustenta um estilo de vida evangelístico duradouro. A Bíblia oferece uma motivação muito mais profunda e mais estável: o próprio coração de Deus pelos perdidos.",
            "Em Lucas 15, diante da crítica dos religiosos por comer com pecadores, Jesus conta três parábolas seguidas — a ovelha perdida, a moeda perdida, o filho perdido — todas terminando em festa e alegria pela recuperação do que estava perdido. O ponto não é sutil: buscar o perdido não é um fardo relutante para Deus, é uma alegria que ecoa no céu (Lucas 15:7,10).",
            "Jesus resume sua própria missão nesses termos: 'o Filho do Homem veio buscar e salvar o que se havia perdido' (Lucas 19:10). Evangelizar, portanto, não é uma atividade estranha e adicional à vida cristã — é participar da própria missão pela qual Cristo veio, e que Ele agora confia à sua Igreja através da Grande Comissão (Mateus 28:18-20).",
            "Isso muda tudo sobre a motivação: você não evangeliza para aplacar culpa, cumprir cota ou parecer um bom cristão — você evangeliza porque foi enxertado numa missão que já é, desde a eternidade, o coração de Deus, e porque ama de verdade as pessoas ao seu redor.",
          ],
          verses: [
            {
              ref: "Mateus 28:18-20",
              textByVersion: {
                NVI: "Toda a autoridade me foi dada nos céus e na terra. Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, do Filho e do Espírito Santo, ensinando-os a obedecer a tudo o que eu ordenei. E eu estarei sempre com vocês, até o fim dos tempos.",
                ACF: "E, chegando-se Jesus, falou-lhes, dizendo: É-me dado todo o poder no céu e na terra. Portanto ide, ensinai todas as nações, batizando-as em nome do Pai, e do Filho, e do Espírito Santo; ensinando-as a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos.",
              },
              originals: [
                { word: "μαθητεύσατε", translit: "mathēteúsate", meaning: "'fazei discípulos' — o único verbo principal no imperativo do mandato; 'indo', 'batizando' e 'ensinando' são particípios que descrevem como esse discipulado acontece", lang: "grego" },
              ],
            },
            {
              ref: "Lucas 19:10",
              textByVersion: {
                NVI: "Pois o Filho do homem veio buscar e salvar o que se havia perdido.",
                ACF: "Porque o Filho do homem veio buscar e salvar o que se havia perdido.",
              },
            },
            {
              ref: "2 Coríntios 5:19-20",
              textByVersion: {
                NVI: "Isto é, em Cristo, Deus estava reconciliando consigo o mundo, não lhes atribuindo os seus pecados... Somos, pois, embaixadores de Cristo, como se Deus estivesse fazendo o seu apelo por nosso intermédio.",
                ACF: "Isto é, Deus estava em Cristo reconciliando consigo o mundo, não lhes imputando os seus pecados... De sorte que somos embaixadores da parte de Cristo, como se Deus por nós rogasse.",
              },
              originals: [
                { word: "πρεσβεύομεν", translit: "presbeúomen", meaning: "'somos embaixadores' — representantes oficiais que falam em nome de outro, sem autoridade própria, mas com a autoridade de quem os enviou", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "καταλλαγή", translit: "katallagḗ", meaning: "'reconciliação' — restauração de uma relação quebrada; o ministério confiado à Igreja de anunciar essa reconciliação já realizada em Cristo.", lang: "grego" },
            { word: "πρεσβευτής", translit: "presbeutḗs", meaning: "'embaixador' — quem representa uma autoridade estrangeira em território alheio, sem falar por si mesmo, mas por quem o enviou.", lang: "grego" },
          ],
          deepDive:
            "É importante distinguir, com honestidade pastoral, entre dois chamados diferentes descritos no Novo Testamento: o chamado geral de todo crente a ser testemunha de Cristo (Atos 1:8, 1 Pedro 3:15) e o dom espiritual específico de evangelista, mencionado em Efésios 4:11 junto a apóstolos, profetas, pastores e mestres. Nem todo cristão tem o dom de evangelista — a capacitação especial e o chamado vocacional para pregar publicamente o Evangelho, muitas vezes de forma itinerante ou pública. Mas todo cristão, sem exceção, é chamado a testemunhar: a compartilhar, no espaço relacional em que já vive, a história de o que Cristo fez por ele. Confundir essas duas coisas produz dois erros opostos: ou a igreja terceiriza todo o evangelismo para 'os dons', deixando de testemunhar no cotidiano, ou impõe a todo crente uma pressão de pregação pública para a qual ele não foi dotado. O equilíbrio bíblico é: todos testemunham; nem todos pregam publicamente como vocação.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Aquele que ganha almas deve, primeiro, ter uma alma cheia de amor por Cristo e por aqueles que Cristo veio salvar.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Lucas 15:7",
                textByVersion: {
                  NVI: "Eu digo que, da mesma forma, haverá mais alegria no céu por um pecador que se arrepende do que por noventa e nove justos que não precisam arrepender-se.",
                },
              },
              {
                ref: "Ezequiel 33:11",
                textByVersion: {
                  NVI: "Dize-lhes: Juro pela minha vida, palavra do Soberano, o Senhor, que não tenho prazer na morte dos ímpios, mas em que se convertam dos seus maus caminhos e vivam.",
                },
              },
            ],
            historicalContext:
              "A Grande Comissão, em Mateus 28:18-20, foi dada a um pequeno grupo de discípulos judeus, em uma província remota do Império Romano, sem recursos, redes sociais ou apoio institucional — e, ainda assim, o mandato era explicitamente universal: 'todas as nações'. A expansão do cristianismo nos três primeiros séculos, atingindo praticamente todo o mundo mediterrâneo conhecido sem apoio estatal e sob perseguição intermitente, é historicamente atribuída em grande parte a essa convicção missionária compartilhada por cristãos comuns, não apenas por líderes.",
            exegeticalNotes:
              "Em grego, Mateus 28:19-20 contém apenas um verbo principal no modo imperativo: 'mathēteúsate' ('fazei discípulos'). 'Indo' (poreuthéntes), 'batizando' (baptízontes) e 'ensinando' (didáskontes) são particípios, gramaticalmente subordinados a esse único mandato central. Isso significa que o alvo do mandato não é apenas 'ir' ou apenas 'batizar', mas fazer discípulos genuínos — um processo que inclui proclamação, batismo e ensino contínuo da obediência a Cristo, não apenas uma decisão pontual.",
            theologicalDebate:
              "Um tema debatido com honestidade entre evangélicos comprometidos com a Escritura é a relação entre evangelismo (proclamação verbal do Evangelho) e ação social (cuidado prático com necessidades físicas, justiça, misericórdia). Algumas tradições enfatizam a primazia da proclamação verbal, por ser o único meio que comunica a mensagem salvadora explícita; outras enfatizam que amor genuíno ao próximo inclui necessariamente cuidado prático, e que um evangelho sem compaixão concreta soa vazio (Tiago 2:15-17). Ambas as ênfases, bem aplicadas, reconhecem que a proclamação do Evangelho é insubstituível para a salvação eterna, e que o amor prático confirma e ilustra essa mensagem, sem substituí-la.",
            secondQuote: {
              author: "John Stott",
              text: "A missão da Igreja flui da missão de Deus. Não somos nós que temos um plano para Deus; é Deus que tem uma missão, e nos convida a participar dela.",
            },
          },
          quizzes: [
            {
              question: "Segundo as parábolas de Lucas 15, qual é a reação do céu diante de um pecador que se arrepende?",
              options: [
                "Indiferença — o céu não se importa com casos individuais",
                "Alegria e festa, semelhante à alegria de quem encontra o que estava perdido",
                "Julgamento imediato pelos anos perdidos",
                "Nenhuma reação é descrita",
              ],
              correctIndex: 1,
              explanation: "As três parábolas (ovelha, moeda, filho perdidos) terminam em festa — revelando que buscar o perdido é alegria para Deus, não fardo relutante.",
            },
            {
              question: "Qual é a diferença entre o chamado geral ao testemunho e o dom espiritual de evangelista (Efésios 4:11)?",
              options: [
                "Não existe diferença — são idênticos",
                "Todo crente é chamado a testemunhar sua própria história; o dom de evangelista é uma capacitação vocacional específica, dada a alguns",
                "Só quem tem o dom de evangelista deve falar de Cristo a alguém",
                "O dom de evangelista substitui a necessidade de obediência à Grande Comissão pelos demais crentes",
              ],
              correctIndex: 1,
              explanation: "Efésios 4:11 descreve o evangelista como um dom específico, dado a alguns para a edificação da igreja; o chamado a testemunhar (Atos 1:8) é para toda a igreja, sem exceção.",
            },
            {
              question: "Gramaticalmente, em Mateus 28:19-20, qual é o único verbo no imperativo (o mandato central)?",
              options: [
                "'Ide' (ir)",
                "'Fazei discípulos'",
                "'Batizando'",
                "'Ensinando'",
              ],
              correctIndex: 1,
              explanation: "'Ide', 'batizando' e 'ensinando' são particípios subordinados; o único imperativo principal é 'fazei discípulos' — o alvo real do mandato.",
            },
          ],
          application:
            "Nesta semana, ore diariamente pedindo a Deus que renove em você não culpa, mas compaixão genuína pelas pessoas ao seu redor que ainda não conhecem a Cristo — peça para enxergá-las como Jesus as enxerga.",
          prayer:
            "Pai, teu coração sempre esteve voltado para os perdidos — não com relutância, mas com alegria de pai que corre ao encontro do filho que volta. Perdoa-me pelas vezes em que tratei o evangelismo como fardo ou obrigação vazia, em vez de participação na tua própria missão de amor. Dá-me um coração que se importa de verdade com quem ainda não te conhece. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Faça uma lista de três pessoas específicas, no seu círculo de convivência, que ainda não conhecem a Cristo. Ore por elas, pelo nome, todos os dias desta semana.",
          reflectionQuestion:
            "Sua motivação atual para falar de Cristo se parece mais com culpa e obrigação, ou com o coração de um Pai que corre ao encontro de quem estava perdido?",
          xp: 25,
        },
      ],
    },
    {
      id: "ev-mod-2",
      title: "Módulo II: Compartilhando sua Fé",
      lessons: [
        {
          id: "ev-2-1",
          title: "Seu Testemunho: A História que Só Você Pode Contar",
          difficulty: 2,
          intro: [
            "Você já aprendeu, em 'Novo Convertido', que o testemunho pessoal costuma ser o ponto de partida mais natural do evangelismo (veja novamente a lição sobre André e Filipe, em João 1). Agora é hora de aprender a estruturar essa história com clareza — porque um testemunho desorganizado, por mais sincero que seja, pode confundir mais do que esclarecer.",
            "O apóstolo Paulo conta a própria conversão pelo menos três vezes no livro de Atos (capítulos 9, 22 e 26), cada vez ajustando os detalhes ao público, mas mantendo sempre a mesma estrutura básica: quem eu era antes, o que aconteceu comigo, quem eu sou agora. Essa estrutura simples — antes, encontro, depois — funciona porque segue o próprio padrão da narrativa bíblica de queda e redenção.",
            "É importante lembrar: seu testemunho não é a prova de que o cristianismo é verdadeiro (essa prova está no Evangelho objetivo — a morte e ressurreição de Cristo, ensinadas na lição anterior). Seu testemunho é a ilustração viva de como aquele Evangelho, que é verdadeiro independentemente da sua experiência, realmente transformou uma vida real: a sua.",
            "1 Pedro 3:15 chama isso de estar 'sempre preparados para responder' — a palavra grega usada ali, 'apología', não descreve um ataque agressivo, mas uma defesa cuidadosa e razoável, dada 'com mansidão e temor'.",
          ],
          verses: [
            {
              ref: "João 9:25",
              textByVersion: {
                NVI: "Ele respondeu: 'Se ele é pecador, não sei. Uma coisa sei: eu era cego e agora vejo!'",
                ACF: "Respondeu ele então, e disse: Se é pecador, não sei; uma coisa sei: que, tendo eu sido cego, agora vejo.",
              },
            },
            {
              ref: "1 Pedro 3:15",
              textByVersion: {
                NVI: "Antes, santifiquem Cristo como Senhor em seu coração. Estejam sempre preparados para responder a qualquer pessoa que lhes pedir a razão da esperança que há em vocês. Contudo, façam isso com mansidão e respeito.",
                ACF: "Antes, santificai ao Senhor Deus em vosso coração; e estai sempre preparados para responder com mansidão e temor a qualquer que vos pedir a razão da esperança que há em vós.",
              },
              originals: [
                { word: "ἀπολογία", translit: "apología", meaning: "'defesa, resposta razoável' — termo jurídico usado para uma defesa articulada diante de um tribunal, não um ataque agressivo", lang: "grego" },
              ],
            },
            {
              ref: "Atos 26:22-23",
              textByVersion: {
                NVI: "Mas tenho contado com a ajuda de Deus até este dia e continuo dando testemunho, tanto a pequenos como a grandes... que o Cristo haveria de sofrer e, sendo o primeiro a ressuscitar dos mortos, proclamaria luz tanto ao seu próprio povo como aos gentios.",
              },
            },
          ],
          keywords: [
            { word: "μαρτυρία", translit: "martyría", meaning: "'testemunho' — relato daquilo que se viu e viveu pessoalmente; raiz da palavra posterior 'mártir', alguém que testemunha até o preço máximo.", lang: "grego" },
            { word: "ἀπολογία", translit: "apología", meaning: "'defesa razoável' — resposta articulada e respeitosa, não confronto agressivo.", lang: "grego" },
          ],
          deepDive:
            "Um testemunho claro e útil geralmente segue três movimentos simples. Primeiro, 'antes': como era sua vida, seus valores e sua relação (ou ausência de relação) com Deus antes de conhecer a Cristo — sem exagero nem dramatização artificial; testemunhos de conversões graduais e discretas são tão válidos quanto os dramáticos. Segundo, 'encontro': o que especificamente aconteceu — um momento, um período, uma pessoa, um versículo que Deus usou. Terceiro, 'depois': o que mudou de fato, com exemplos concretos, não apenas sentimentos vagos ('mudou minha vida' diz pouco; 'aprendi a perdoar meu pai' diz muito). O erro mais comum é gastar 90% do tempo no 'antes' (contando a própria história de forma sensacionalista) e quase nada explicando quem é Cristo e o que Ele fez — invertendo o centro da narrativa, que deve sempre ser Ele, não nós.",
          theologianQuote: {
            author: "Josué K. Reichow",
            text: "Ninguém pode discutir sua experiência pessoal com Cristo — mas todo testemunho fiel aponta para além de si mesmo, para a obra objetiva do Evangelho.",
          },
          deepen: {
            historicalContext:
              "É digno de nota que Lucas registra a conversão de Paulo três vezes em Atos (9, 22, 26) — uma redundância literária incomum, que sinaliza a importância central desse evento para a narrativa do livro. Em cada relato, Paulo ajusta ênfases conforme a audiência (uma narrativa histórica para o leitor de Lucas, um discurso em aramaico para a multidão hostil em Jerusalém, uma defesa formal diante do rei Agripa) — mostrando sensibilidade ao público sem alterar os fatos centrais.",
            exegeticalNotes:
              "A palavra 'apología', em 1 Pedro 3:15, é o mesmo termo usado para descrever defesas formais em tribunais gregos e romanos — implica raciocínio articulado, não apenas emoção. Mas o versículo imediatamente qualifica essa defesa com 'mansidão e temor' (praǘtēs kai phóbos): argumento firme não é incompatível com humildade genuína; pelo contrário, a ausência de humildade costuma anular o próprio argumento aos ouvidos de quem escuta.",
            theologicalDebate:
              "Alguns cristãos, especialmente vindos de tradições mais dramáticas de conversão, sentem que seu testemunho é 'fraco' ou 'sem graça' por terem crescido na fé, sem uma virada abrupta e visível. Isso não é uma questão doutrinária, mas pastoral: a Escritura não valoriza testemunhos dramáticos mais do que testemunhos de fidelidade contínua desde a infância (2 Timóteo 3:15, sobre Timóteo, que conhecia as Escrituras 'desde criança'). Todo testemunho genuíno de uma vida transformada pela graça, dramático ou gradual, é válido e útil.",
            secondQuote: {
              author: "David L. Allen",
              text: "Sua história pessoal nunca prova o Evangelho — mas ilustra, de forma insubstituível, o poder de um Evangelho que já é verdadeiro antes e independentemente dela.",
            },
          },
          quizzes: [
            {
              question: "Segundo a lição, qual é a estrutura simples e útil para organizar um testemunho pessoal?",
              options: [
                "Apenas descrever, em detalhes, os pecados cometidos antes da conversão",
                "Antes (como eu era), encontro (o que aconteceu) e depois (o que mudou, com exemplos concretos)",
                "Uma lista de versículos decorados, sem experiência pessoal",
                "Um discurso teológico complexo, sem menção à própria vida",
              ],
              correctIndex: 1,
              explanation: "A estrutura antes-encontro-depois segue o próprio padrão narrativo bíblico de queda e redenção, e ajuda o ouvinte a acompanhar a história com clareza.",
            },
            {
              question: "O que a palavra grega 'apología', em 1 Pedro 3:15, realmente significa?",
              options: [
                "Um pedido de desculpas",
                "Uma defesa articulada e razoável, dada com mansidão e respeito — não um ataque agressivo",
                "Um discurso emocional sem argumento",
                "Uma explicação apenas para especialistas em teologia",
              ],
              correctIndex: 1,
              explanation: "'Apología' é termo jurídico para defesa racional formal; o próprio versículo qualifica essa defesa com 'mansidão e temor', unindo firmeza e humildade.",
            },
            {
              question: "Qual erro comum a lição aponta ao contar um testemunho pessoal?",
              options: [
                "Falar pouco sobre si mesmo",
                "Gastar quase todo o tempo descrevendo a própria história de forma sensacionalista, e pouco tempo explicando quem é Cristo e o que Ele fez",
                "Mencionar Cristo cedo demais na história",
                "Usar linguagem simples demais",
              ],
              correctIndex: 1,
              explanation: "O testemunho deve sempre apontar para Cristo como centro, não se tornar uma narrativa autocentrada em que a pessoa é a protagonista principal.",
            },
          ],
          application:
            "Escreva seu próprio testemunho seguindo a estrutura antes-encontro-depois, em no máximo um parágrafo curto para cada parte. Releia garantindo que Cristo, não você, seja o centro da história.",
          prayer:
            "Senhor, obrigado pela minha própria história de graça — seja ela dramática ou silenciosa, ela é real e é tua obra. Ajuda-me a contá-la com clareza, humildade e coragem, sempre apontando para ti como o verdadeiro centro, e não para mim mesmo. Prepara meu coração para responder com mansidão a quem me perguntar sobre a esperança que há em mim. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Compartilhe seu testemunho, já estruturado, com uma pessoa não-cristã próxima a você esta semana — mesmo que de forma breve e natural, numa conversa comum.",
          reflectionQuestion:
            "No seu testemunho atual, quem ocupa mais espaço na narrativa: você mesmo ou Cristo?",
          xp: 25,
        },
        {
          id: "ev-2-2",
          title: "Evangelismo no Cotidiano: Relações, Não Discursos",
          difficulty: 2,
          intro: [
            "Quando pensamos em 'evangelismo', muita gente imagina um discurso preparado, um confronto direto na rua, ou uma conversa artificialmente forçada sobre religião. Mas o padrão que Jesus modela no Evangelho de João, capítulo 4, é bem diferente: uma conversa comum, iniciada com um pedido simples ('me dá de beber'), que naturalmente se aprofunda até tocar nas questões mais essenciais da vida da mulher samaritana.",
            "Jesus não abre com um sermão. Ele faz perguntas, ouve, observa a vida real da pessoa à sua frente, e só então revela verdades mais profundas — sempre no ritmo certo, nunca impondo. O evangelismo mais fiel ao padrão bíblico normalmente acontece assim: dentro de relações reais, com tempo, atenção genuína e perguntas verdadeiras — não como um discurso decorado, entregue e esquecido.",
            "Jesus chama seus discípulos de 'sal da terra' e 'luz do mundo' (Mateus 5:13-16) — imagens que sugerem influência constante e discreta, não um evento único e isolado. Sal tempera aos poucos; luz ilumina simplesmente por estar presente e acesa.",
            "Paulo instrui os coríntios a agir 'com sabedoria para com os que estão de fora, aproveitando ao máximo cada oportunidade' e a ter 'a conversa sempre agradável, temperada com sal' (Colossenses 4:5-6) — uma imagem de conversas naturais, saborosas e oportunas, não discursos forçados ou fora de contexto.",
          ],
          verses: [
            {
              ref: "Mateus 5:13-16",
              textByVersion: {
                NVI: "Vocês são o sal da terra... Vocês são a luz do mundo... Assim brilhe a luz de vocês diante dos homens, para que vejam as boas obras de vocês e glorifiquem ao Pai celestial.",
                ACF: "Vós sois o sal da terra... Vós sois a luz do mundo... Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem a vosso Pai, que está nos céus.",
              },
              originals: [
                { word: "ἅλας", translit: "hálas", meaning: "'sal' — usado na Antiguidade tanto para tempero quanto para conservação; imagem de influência constante e discreta", lang: "grego" },
              ],
            },
            {
              ref: "Colossenses 4:5-6",
              textByVersion: {
                NVI: "Sejam sábios no procedimento de vocês para com os de fora, aproveitando ao máximo cada oportunidade. A conversa de vocês seja sempre agradável e temperada com sal, para que saibam como responder a cada um.",
                ACF: "Andai em sabedoria para com os que estão de fora, remindo o tempo. A vossa palavra seja sempre agradável, adubada com sal, para que saibais como vos convém responder a cada um.",
              },
              originals: [
                { word: "καιρός", translit: "kairós", meaning: "'tempo oportuno, ocasião certa' — distinto de 'chrónos' (tempo cronológico); a oportunidade certa a ser reconhecida e aproveitada", lang: "grego" },
              ],
            },
            {
              ref: "João 4:9-10",
              textByVersion: {
                NVI: "A mulher samaritana lhe perguntou: 'Como o senhor, sendo judeu, pede a mim, uma samaritana, água para beber?'... Jesus respondeu: 'Se você conhecesse o dom de Deus e quem está pedindo água, você lhe pediria e ele lhe daria água viva.'",
              },
            },
          ],
          keywords: [
            { word: "καιρός", translit: "kairós", meaning: "'ocasião oportuna' — o momento certo, reconhecido e aproveitado, e não forçado.", lang: "grego" },
            { word: "ἅλας", translit: "hálas", meaning: "'sal' — tempero e conservante; imagem de influência contínua, não de um único evento evangelístico isolado.", lang: "grego" },
          ],
          deepDive:
            "João 4 revela um padrão evangelístico rico em detalhes práticos: Jesus atravessa uma barreira cultural e religiosa (judeus normalmente evitavam a Samaria), inicia com um pedido simples e vulnerável ('me dá de beber'), faz perguntas genuínas em vez de acusações, reconhece com honestidade a situação de vida da mulher sem minimizar nem exagerar seu pecado, e só depois de estabelecida a confiança revela verdades mais profundas sobre si mesmo. O resultado é uma conversa que a própria mulher leva de volta à sua cidade, gerando um pequeno avivamento local (João 4:39-42). Esse padrão sugere que evangelismo eficaz raramente é um evento isolado e forçado — é, na maior parte das vezes, o fruto de relações reais, tempo investido, perguntas genuínas e disposição de cruzar barreiras sociais para se aproximar de quem é diferente de nós.",
          theologianQuote: {
            author: "Charles Swindoll",
            text: "As pessoas raramente são convencidas por um argumento perfeito; elas são atraídas por uma vida que reflete, de forma consistente, aquilo que é anunciado.",
          },
          deepen: {
            historicalContext:
              "A tensão entre judeus e samaritanos, no primeiro século, tinha raízes históricas profundas (desde a divisão do reino de Israel e a mistura étnico-religiosa dos samaritanos após a conquista assíria). Judeus piedosos normalmente evitavam até mesmo atravessar a região da Samaria em suas viagens. O fato de Jesus não apenas atravessar a região, mas iniciar uma conversa pública e prolongada com uma mulher samaritana — dupla barreira social, de gênero e de etnia — seria, para os primeiros leitores judeus do Evangelho, um detalhe chocante e deliberadamente significativo.",
            exegeticalNotes:
              "O termo 'kairós', em Colossenses 4:5, contrasta com 'chrónos' (tempo cronológico, sequencial). Paulo não está pedindo que os coríntios estejam sempre falando de religião, mas que estejam atentos e prontos para reconhecer o momento certo — a oportunidade específica dentro de uma conversa ou relação — quando ela surgir, em vez de deixá-la passar despercebida ou de forçá-la artificialmente onde não há abertura.",
            theologicalDebate:
              "Há um debate metodológico legítimo, mais prático do que doutrinário, entre ênfases de 'evangelismo relacional' (investir tempo em amizades reais antes de falar explicitamente de Cristo) e 'evangelismo direto' (iniciar conversas espirituais mais rapidamente, mesmo com desconhecidos). A Escritura contém exemplos de ambos os padrões — Jesus com a samaritana ilustra o primeiro; Filipe com o eunuco etíope (Atos 8:26-38), uma conversa direta com um desconhecido, ilustra o segundo. Não são métodos concorrentes, mas ferramentas diferentes para contextos diferentes; a sabedoria bíblica (Colossenses 4:5) é reconhecer qual se aplica a cada situação.",
            secondQuote: {
              author: "David Merkh",
              text: "As melhores conversas espirituais raramente começam com um sermão — começam com uma pergunta genuína e um ouvido disposto a escutar antes de falar.",
            },
          },
          quizzes: [
            {
              question: "No padrão evangelístico de João 4, o que Jesus faz antes de revelar verdades espirituais profundas à mulher samaritana?",
              options: [
                "Começa imediatamente acusando-a de seus pecados",
                "Inicia com um pedido simples, faz perguntas genuínas e estabelece uma conversa real, cruzando barreiras sociais",
                "Ignora completamente a situação de vida dela",
                "Pede que ela primeiro se converta ao judaísmo",
              ],
              correctIndex: 1,
              explanation: "Jesus cruza barreiras culturais, inicia com vulnerabilidade ('me dá de beber'), faz perguntas e ouve, e só então aprofunda a conversa espiritual.",
            },
            {
              question: "O que a imagem de 'sal' (Mateus 5:13) sugere sobre a influência do cristão no mundo?",
              options: [
                "Um evento evangelístico único e isolado",
                "Uma influência constante e discreta, presente continuamente, como tempero em cada interação",
                "Uma separação total do convívio com não-cristãos",
                "Uma pressão constante para converter todos imediatamente",
              ],
              correctIndex: 1,
              explanation: "Sal tempera continuamente, aos poucos — imagem de presença constante e discreta, não de um único confronto evangelístico.",
            },
            {
              question: "O que significa 'kairós', em Colossenses 4:5, e por que isso importa para o evangelismo cotidiano?",
              options: [
                "Tempo cronológico contado em horas — sugere um cronograma rígido de evangelismo",
                "Ocasião oportuna e específica — sugere atenção e sabedoria para reconhecer o momento certo, sem forçar nem deixar passar",
                "Um ritual religioso específico",
                "Um período de jejum obrigatório antes de evangelizar",
              ],
              correctIndex: 1,
              explanation: "'Kairós' contrasta com 'chrónos' (tempo sequencial) e descreve o momento oportuno certo — reconhecido com sabedoria, não imposto artificialmente.",
            },
          ],
          application:
            "Esta semana, escolha uma conversa comum (no trabalho, na fila, com um vizinho) e pratique fazer duas ou três perguntas genuínas sobre a vida da pessoa, ouvindo de verdade antes de falar sobre sua fé.",
          prayer:
            "Senhor, ensina-me a evangelizar como Jesus evangelizou a mulher samaritana: com perguntas genuínas, escuta atenta, e disposição de cruzar barreiras sociais para me aproximar de quem é diferente de mim. Dá-me sabedoria para reconhecer as oportunidades certas, sem forçar conversas nem deixá-las passar por medo. Que minha vida cotidiana tempere e ilumine, como sal e luz, antes mesmo de qualquer palavra. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Identifique uma relação cotidiana (colega, vizinho, familiar distante) em que você tem investido pouco tempo real de conversa e escuta. Invista, deliberadamente, em ouvir essa pessoa esta semana, sem pressa de 'chegar ao ponto espiritual'.",
          reflectionQuestion:
            "Nas suas conversas cotidianas, você tem investido tempo genuíno em ouvir as pessoas antes de falar, ou tende a forçar o assunto espiritual cedo demais — ou a evitá-lo por completo?",
          xp: 25,
        },
      ],
    },
    {
      id: "ev-mod-3",
      title: "Módulo III: Perseverança e Sabedoria",
      lessons: [
        {
          id: "ev-3-1",
          title: "Vencendo o Medo de Falar de Cristo",
          difficulty: 3,
          intro: [
            "É comum sentir medo antes de falar de Cristo com alguém — medo de rejeição, de parecer estranho, de não saber responder a uma pergunta difícil, de prejudicar um relacionamento importante. Esse medo não é sinal de pouca fé; é uma reação humana normal diante de algo que envolve vulnerabilidade real. A questão bíblica não é 'como eliminar o medo', mas 'o que fazer apesar dele'.",
            "A igreja primitiva enfrentou esse mesmo medo de forma muito mais concreta que a nossa: logo após serem ameaçados pelas autoridades religiosas por pregarem a Cristo, os discípulos não pediram a Deus que removesse a ameaça — pediram ousadia para continuar falando apesar dela (Atos 4:29-31). E a resposta veio: o lugar tremeu, e todos foram cheios do Espírito Santo e 'anunciavam a palavra de Deus com ousadia'.",
            "'Ousadia' traduz a palavra grega 'parrēsía' — literalmente, 'dizer tudo', franqueza sem esconder nada por medo. É notável que Paulo, mesmo preso e já experiente no ministério, pede especificamente à igreja de Éfeso que ore para que ele fale 'com ousadia, como convém que eu fale' (Efésios 6:19-20) — a ousadia evangelística não é um talento natural de alguns privilegiados, é algo que se pede a Deus em oração, continuamente, mesmo depois de anos de experiência.",
            "2 Timóteo 1:7 lembra que 'Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação' — a alternativa bíblica ao medo paralisante não é a arrogância inconsequente, mas um equilíbrio de poder (coragem para falar), amor (motivação genuína pelo outro) e moderação (sabedoria e domínio próprio no como e quando falar).",
          ],
          verses: [
            {
              ref: "Atos 4:29-31",
              textByVersion: {
                NVI: "Agora, Senhor, considera as ameaças deles e capacita os teus servos para pregarem a tua palavra com toda a ousadia... Depois de orarem, tremeu o lugar em que estavam reunidos; todos ficaram cheios do Espírito Santo e anunciavam a palavra de Deus com ousadia.",
              },
              originals: [
                { word: "παρρησία", translit: "parrēsía", meaning: "'ousadia, franqueza' — literalmente 'dizer tudo'; termo usado no contexto político grego para a liberdade de falar abertamente numa assembleia", lang: "grego" },
              ],
            },
            {
              ref: "Efésios 6:19-20",
              textByVersion: {
                NVI: "Orem também por mim, para que, quando eu falar, seja-me dada a mensagem, a fim de que anuncie com denodo o mistério do evangelho, do qual sou embaixador preso em correntes; orem para que eu o proclame com denodo, como devo fazer.",
                ACF: "E por mim, para que me seja dada a palavra na abertura da minha boca, para com ousadia fazer notório o mistério do evangelho, pelo qual sou embaixador em cadeias; para que possa falar dele ousadamente, como me convém falar.",
              },
            },
            {
              ref: "2 Timóteo 1:7",
              textByVersion: {
                NVI: "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.",
                ACF: "Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.",
              },
            },
          ],
          keywords: [
            { word: "παρρησία", translit: "parrēsía", meaning: "'ousadia, franqueza' — falar abertamente, sem esconder por medo; um dom pedido em oração, não uma personalidade natural.", lang: "grego" },
            { word: "δειλία", translit: "deilía", meaning: "'covardia, timidez paralisante' — o oposto do espírito que Deus dá ao crente (2 Tm 1:7).", lang: "grego" },
          ],
          deepDive:
            "É importante notar que a ousadia bíblica nunca é apresentada como ausência de sabedoria ou de tato. O mesmo Novo Testamento que pede ousadia (Atos 4:29, Efésios 6:19) também pede mansidão e respeito (1 Pedro 3:15) e sabedoria no procedimento com os de fora (Colossenses 4:5). Ousadia sem mansidão vira agressividade, que afasta em vez de atrair; mansidão sem ousadia vira silêncio covarde disfarçado de educação. O equilíbrio bíblico é falar com clareza e coragem sobre Cristo, sem, no entanto, tratar quem discorda com desprezo, impaciência ou hostilidade. Vale lembrar ainda que, em contextos onde o evangelismo é legalmente restrito ou perigoso, a aplicação prática da ousadia bíblica exige também sabedoria situacional e prudência — a Escritura nunca pede imprudência temerária, mas fidelidade corajosa dentro da sabedoria disponível a cada contexto.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Um cristão tímido demais para falar de Cristo em terra provavelmente ficará também calado demais para cantar seus louvores no céu — não porque não ame, mas porque nunca aprendeu a vencer o medo pela graça.",
          },
          deepen: {
            historicalContext:
              "O contexto de Atos 4 é uma ameaça real e imediata das autoridades religiosas judaicas, com poder legal para prender e punir os discípulos — não uma simples desaprovação social. É notável que, mesmo diante dessa ameaça concreta, a oração da igreja primitiva não pede proteção ou o fim da perseguição, mas capacitação para continuar falando apesar dela — um modelo de oração que prioriza a fidelidade à missão acima até da própria segurança pessoal.",
            exegeticalNotes:
              "'Parrēsía' tem origem no vocabulário político da democracia ateniense, onde descrevia o direito e a coragem de um cidadão livre de falar abertamente numa assembleia pública, mesmo dizendo algo impopular ou arriscado. Ao aplicar esse termo à pregação cristã, o Novo Testamento sugere uma franqueza corajosa e pública, não uma fé silenciosa e estritamente privada.",
            theologicalDebate:
              "Cristãos fiéis aplicam a ousadia evangelística de formas legitimamente diferentes conforme o contexto cultural e legal em que vivem: em países onde a evangelização é aberta e legal, a ousadia pode significar iniciativa direta e pública; em contextos de restrição severa ou perseguição, a mesma ousadia interior pode se expressar de forma mais discreta e estratégica, sem que isso signifique menor fidelidade ou covardia — a prudência sábia diante do perigo real é distinta do medo paralisante nascido apenas do constrangimento social. Esta é uma questão de aplicação prática, não de princípio bíblico central, que muitas vezes se beneficia de conversa com líderes locais que conhecem melhor o contexto específico.",
            secondQuote: {
              author: "Hernandes Dias Lopes",
              text: "A ousadia que a Bíblia pede não nasce de coragem natural, mas é fruto de uma oração respondida e do Espírito que enche o crente até transbordar em palavras corajosas.",
            },
          },
          quizzes: [
            {
              question: "Diante da ameaça das autoridades religiosas, o que a igreja primitiva pediu a Deus em oração, segundo Atos 4:29-31?",
              options: [
                "Que a ameaça e a perseguição fossem removidas imediatamente",
                "Capacitação e ousadia para continuar pregando a palavra de Deus, apesar da ameaça",
                "Vingança contra as autoridades",
                "Permissão para parar de evangelizar até a ameaça passar",
              ],
              correctIndex: 1,
              explanation: "A oração da igreja primitiva prioriza fidelidade corajosa à missão, não a remoção da ameaça — e Deus responde enchendo-os do Espírito Santo com ousadia.",
            },
            {
              question: "Segundo 2 Timóteo 1:7, qual é o espírito que Deus dá ao crente, em contraste com a covardia?",
              options: [
                "Um espírito de arrogância e confronto",
                "Um espírito de poder, amor e moderação (equilíbrio)",
                "Um espírito de indiferença emocional",
                "Um espírito de isolamento social",
              ],
              correctIndex: 1,
              explanation: "O contraste bíblico à covardia não é agressividade, mas um equilíbrio entre poder, amor genuíno e domínio próprio.",
            },
            {
              question: "Segundo a lição, o que caracteriza o equilíbrio bíblico entre ousadia e mansidão no evangelismo?",
              options: [
                "Ousadia sem qualquer preocupação com a forma como se fala",
                "Falar com clareza e coragem sobre Cristo, mas sem tratar quem discorda com desprezo ou hostilidade",
                "Evitar completamente qualquer tema que possa gerar desconforto",
                "Priorizar sempre a mansidão, mesmo que isso signifique nunca falar de Cristo",
              ],
              correctIndex: 1,
              explanation: "Ousadia sem mansidão vira agressividade; mansidão sem ousadia vira silêncio covarde — a Escritura pede as duas coisas juntas.",
            },
          ],
          application:
            "Nesta semana, ore especificamente pedindo ousadia (não a remoção do medo, mas capacidade de agir apesar dele) antes de uma conversa em que você sinta receio de mencionar sua fé.",
          prayer:
            "Senhor, assim como a igreja primitiva, eu te peço: não que retires todo desconforto ou risco, mas que me dês ousadia para falar de ti apesar do medo. Tira de mim tanto a covardia paralisante quanto a agressividade sem amor. Enche-me do teu Espírito, como encheste aqueles discípulos, para que eu também anuncie tua palavra com denodo e mansidão. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Identifique uma conversa específica que você tem evitado por medo de mencionar sua fé. Ore por ela todos os dias desta semana, pedindo a Deus uma oportunidade e ousadia para agir quando ela vier.",
          reflectionQuestion:
            "O que especificamente você teme que aconteça se falar abertamente de Cristo com alguém esta semana — e esse medo já foi entregue a Deus em oração?",
          xp: 30,
        },
        {
          id: "ev-3-2",
          title: "Perguntas Difíceis: Introdução à Apologética Cotidiana",
          difficulty: 3,
          intro: [
            "Mais cedo ou mais tarde, quem compartilha sua fé com regularidade vai ouvir perguntas difíceis: 'como pode existir um Deus bom, com tanto sofrimento no mundo?', 'e as outras religiões, todas estão erradas?', 'como você sabe que a Bíblia é confiável?'. Apologética é justamente essa disciplina — do grego 'apología', a mesma palavra de 1 Pedro 3:15 — de oferecer razões cuidadosas e honestas para a fé cristã, diante de objeções reais.",
            "É importante começar com uma expectativa realista: apologética não substitui a obra do Espírito Santo na conversão de alguém (João 16:8), e você não precisa ter resposta perfeita para toda pergunta possível para ser fiel. Muitas vezes, a resposta mais honesta e mais poderosa é simplesmente: 'não sei, mas posso pesquisar com você' — a honestidade constrói mais confiança do que respostas apressadas e superficiais.",
            "O modelo mais rico de apologética contextualizada no Novo Testamento é o discurso de Paulo no Areópago (Atos 17:22-31). Diante de filósofos atenienses, Paulo não começa citando as Escrituras hebraicas (que eles não reconheceriam como autoridade) — ele começa observando a própria cultura religiosa deles (um altar 'ao deus desconhecido'), estabelece pontos de contato através da própria poesia grega que eles conheciam, e só então avança para a revelação específica de Cristo e da ressurreição.",
            "Esse padrão ensina uma lição valiosa: apologética eficaz começa ouvindo e entendendo de verdade a objeção ou a cultura da pessoa, constrói pontes a partir de pontos de contato genuínos, e então apresenta com clareza a verdade específica do Evangelho — sem arrogância, mas também sem covardia intelectual.",
          ],
          verses: [
            {
              ref: "1 Pedro 3:15-16",
              textByVersion: {
                NVI: "Estejam sempre preparados para responder a qualquer pessoa que lhes pedir a razão da esperança que há em vocês. Contudo, façam isso com mansidão e respeito, conservando boa consciência.",
                ACF: "Estai sempre preparados para responder com mansidão e temor a qualquer que vos pedir a razão da esperança que há em vós, tendo uma boa consciência.",
              },
            },
            {
              ref: "Atos 17:22-23",
              textByVersion: {
                NVI: "Então Paulo, levantando-se no meio do Areópago, disse: 'Atenienses, vejo que em todos os aspectos vocês são muito religiosos, pois, andando pela cidade, observando os objetos de adoração, encontrei também um altar com esta inscrição: A um Deus desconhecido. Ora, o que vocês adoram sem conhecer, isso mesmo lhes anuncio.'",
              },
              originals: [
                { word: "ἐπαγωνίζεσθαι", translit: "epagōnízesthai", meaning: "'lutar/contender esforçadamente' — imagem atlética de esforço intenso na defesa da fé (Judas 1:3), sem sugerir agressividade contra pessoas", lang: "grego" },
              ],
            },
            {
              ref: "Judas 1:3",
              textByVersion: {
                NVI: "Amados, embora eu estivesse muito ansioso para escrever a vocês acerca da salvação que temos em comum, senti a necessidade de fazê-lo a fim de exortá-los a batalhar pela fé que uma vez por todas foi entregue aos santos.",
              },
            },
          ],
          keywords: [
            { word: "ἀπολογία", translit: "apología", meaning: "'defesa razoável' — dar razões articuladas para a fé, diante de objeções honestas.", lang: "grego" },
            { word: "ἐπαγωνίζεσθαι", translit: "epagōnízesthai", meaning: "'contender esforçadamente' — imagem de esforço atlético na defesa da fé, dirigido à verdade, não à agressão contra pessoas.", lang: "grego" },
          ],
          deepDive:
            "Sem pretender esgotar o assunto (que merece estudo contínuo ao longo da vida), três objeções aparecem com frequência em conversas cotidianas, e vale ter ao menos um ponto de partida simples e honesto para cada uma: (1) O problema do sofrimento — a Bíblia nunca minimiza o sofrimento real, mas ensina que Deus entrou nele pessoalmente em Cristo (que sofreu e morreu), e promete restauração final (Apocalipse 21:4); a existência do mal, paradoxalmente, pressupõe um padrão real de bem, o que é mais difícil de explicar sem Deus do que com Ele. (2) A exclusividade de Cristo diante de outras religiões — Jesus mesmo afirmou ser 'o caminho, a verdade e a vida' (João 14:6); isso soa estreito à cultura contemporânea, mas é coerente: se Cristo realmente ressuscitou dos mortos (um fato histórico investigável, não apenas uma opinião religiosa entre outras), essa afirmação exclusiva se torna razoável, não arrogante. (3) A confiabilidade da Bíblia — o Novo Testamento tem, de longe, mais manuscritos antigos e mais próximos dos eventos originais do que qualquer outro documento da Antiguidade, um fato reconhecido mesmo por historiadores seculares. Em todos os casos, o objetivo não é 'vencer' a pessoa num debate, mas remover obstáculos honestos que impedem alguém de considerar Cristo com seriedade.",
          theologianQuote: {
            author: "William Lane Craig",
            text: "A boa apologética não tenta substituir a fé por prova; ela remove obstáculos intelectuais para que a fé, gerada pelo Espírito, encontre um caminho mais livre até o coração.",
          },
          deepen: {
            historicalContext:
              "Atenas, no primeiro século, era um centro filosófico com forte presença de escolas estoica e epicurista, ambas mencionadas explicitamente em Atos 17:18 como presentes na audiência de Paulo. O Areópago não era propriamente um tribunal criminal naquele contexto, mas um conselho respeitado que supervisionava questões religiosas e educacionais da cidade — o ambiente intelectual mais prestigiado que Paulo enfrentaria em toda sua jornada registrada em Atos.",
            exegeticalNotes:
              "É notável que, em Atos 17:28, Paulo cita diretamente dois poetas gregos pagãos ('nele vivemos, nos movemos e existimos', atribuído a Epimênides, e 'dele também somos geração', de Arato) — não como Escritura, mas como pontos de contato retórico legítimos, reconhecendo verdades parciais presentes na cultura grega, para então corrigi-las e completá-las com a revelação específica do Evangelho. Isso modela uma apologética que respeita elementos verdadeiros em outras culturas, sem abrir mão da unicidade de Cristo.",
            theologicalDebate:
              "Apologistas cristãos fiéis discordam, de forma legítima, sobre o melhor método apologético a ser usado: a abordagem 'evidencialista' (como a de William Lane Craig) enfatiza argumentos históricos, filosóficos e científicos independentes, que sustentam a fé cristã diante de qualquer pressuposto; a abordagem 'pressuposicionalista' (associada a Cornelius Van Til, entre outros) argumenta que toda evidência já é interpretada dentro de pressupostos, e que o ponto de partida deve ser a própria revelação bíblica como fundamento de toda racionalidade. Esta é uma discussão metodológica entre cristãos comprometidos com a mesma Escritura e o mesmo Evangelho — nenhuma das abordagens nega a suficiência das Escrituras nem a necessidade da obra do Espírito Santo na conversão.",
            secondQuote: {
              author: "Alister McGrath",
              text: "Apologética não é sobre ter todas as respostas, mas sobre amar a Deus também com a mente, oferecendo razões honestas num mundo cheio de perguntas honestas.",
            },
          },
          quizzes: [
            {
              question: "No discurso de Paulo no Areópago (Atos 17), qual foi seu ponto de partida ao se dirigir aos filósofos atenienses?",
              options: [
                "Citou diretamente o Antigo Testamento hebraico como autoridade inquestionável para eles",
                "Observou a própria religiosidade e cultura deles (o altar 'ao deus desconhecido') como ponto de contato inicial",
                "Começou acusando-os de idolatria de forma agressiva",
                "Ignorou completamente a cultura grega e falou apenas de doutrina cristã abstrata",
              ],
              correctIndex: 1,
              explanation: "Paulo estabelece pontos de contato genuínos com a cultura da audiência antes de apresentar a revelação específica de Cristo — um modelo de apologética contextualizada.",
            },
            {
              question: "Segundo a lição, o que fazer quando você não sabe responder a uma pergunta difícil sobre a fé?",
              options: [
                "Inventar uma resposta convincente para não parecer despreparado",
                "Admitir honestamente que não sabe, e se dispor a pesquisar junto com a pessoa",
                "Mudar de assunto imediatamente",
                "Encerrar a conversa e evitar a pessoa dali em diante",
              ],
              correctIndex: 1,
              explanation: "A honestidade sobre os próprios limites constrói mais confiança do que respostas apressadas e superficiais — e apologética não substitui a obra do Espírito Santo na conversão.",
            },
            {
              question: "Qual é a diferença metodológica citada entre apologética 'evidencialista' e 'pressuposicionalista'?",
              options: [
                "Uma nega a Bíblia; a outra a aceita integralmente",
                "A evidencialista enfatiza argumentos históricos e filosóficos independentes; a pressuposicionalista parte da revelação bíblica como fundamento de toda racionalidade",
                "Não há diferença real entre as duas",
                "Uma é bíblica; a outra é herética",
              ],
              correctIndex: 1,
              explanation: "São duas abordagens metodológicas legítimas usadas por apologistas cristãos fiéis comprometidos com a mesma Escritura, não uma questão de ortodoxia versus heresia.",
            },
          ],
          application:
            "Escolha uma das três objeções apresentadas nesta lição (sofrimento, exclusividade de Cristo, ou confiabilidade da Bíblia) e escreva, em suas próprias palavras, uma resposta simples e honesta de dois ou três parágrafos, que você se sentiria confortável em compartilhar numa conversa real.",
          prayer:
            "Senhor, ajuda-me a amar-te também com a mente, oferecendo razões honestas para a esperança que há em mim, sempre com mansidão e respeito. Onde eu não souber responder, dá-me humildade para admitir e disposição para aprender. Que eu nunca use apologética para vencer discussões, mas para remover obstáculos honestos no caminho de alguém até ti. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Pesquise, ao longo desta semana, uma resposta cristã honesta para a objeção que mais te incomoda ou que você mais ouve de pessoas ao seu redor — usando fontes confiáveis, e conversando com seu pastor ou líder de discipulado se tiver dúvidas.",
          reflectionQuestion:
            "Qual pergunta difícil sobre a fé cristã você mais teme ouvir — e você já buscou, com honestidade e humildade, uma resposta refletida para ela?",
          xp: 30,
        },
      ],
    },
  ],
};

export const additionalTrails5: Trail[] = [evangelismo];
