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
              originals: [
                { word: "ἠγάπησεν", translit: "ēgápēsen", meaning: "'amou' — de agapáō, amor de doação voluntária e sacrificial, não emoção passageira; é o mesmo verbo usado para o amor de Deus que se entrega", lang: "grego" },
              ],
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
            text: "O Evangelho não é um bom conselho aos homens, mas uma boa notícia sobre Cristo; não um convite para fazermos algo, mas uma declaração do que Deus fez; não uma exigência, mas uma oferta.",
            source: "John Stott, The Message of Galatians (tradução livre)",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Atos 2:22-24",
                textByVersion: {
                  NVI: "Israelitas, ouçam isto: Jesus de Nazaré foi aprovado por Deus diante de vocês por milagres, maravilhas e sinais que Deus fez por meio dele... vocês o mataram, pregando-o na cruz por mãos de homens iníquos. Mas Deus o ressuscitou, rompendo os laços da morte, porque era impossível que ela o retivesse.",
                },
                originals: [
                  { word: "ἀνέστησεν", translit: "anéstēsen", meaning: "'ressuscitou, levantou' — verbo técnico para a ressurreição corporal, não uma sobrevivência espiritual apenas", lang: "grego" },
                ],
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
              originals: [
                { word: "ζητῆσαι καὶ σῶσαι", translit: "zētēsai kai sōsai", meaning: "'buscar e salvar' — dois verbos no infinitivo que descrevem a missão ativa e intencional de Cristo, não uma espera passiva", lang: "grego" },
              ],
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
            text: "Ganhar almas é o principal negócio do ministro cristão; deveria, aliás, ser a busca central de todo verdadeiro crente.",
            source: "Charles H. Spurgeon, The Soul Winner (1895), p. 5 (tradução livre)",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Lucas 15:7",
                textByVersion: {
                  NVI: "Eu digo que, da mesma forma, haverá mais alegria no céu por um pecador que se arrepende do que por noventa e nove justos que não precisam arrepender-se.",
                },
                originals: [
                  { word: "μετανοοῦντι", translit: "metanooúnti", meaning: "'que se arrepende' — de metanoéō, mudança radical de mente e direção, não apenas remorso emocional", lang: "grego" },
                ],
              },
              {
                ref: "Ezequiel 33:11",
                textByVersion: {
                  NVI: "Dize-lhes: Juro pela minha vida, palavra do Soberano, o Senhor, que não tenho prazer na morte dos ímpios, mas em que se convertam dos seus maus caminhos e vivam.",
                },
                originals: [
                  { word: "חָפֵץ", translit: "chafets", meaning: "'ter prazer, deleitar-se' — o hebraico nega explicitamente que Deus tenha prazer na morte do ímpio; seu desejo declarado é a conversão e a vida", lang: "hebraico" },
                ],
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
              originals: [
                { word: "βλέπω", translit: "blépō", meaning: "'vejo' — no presente do indicativo, marcando uma nova realidade contínua; o mesmo verbo descreve tanto a visão física quanto a percepção espiritual", lang: "grego" },
              ],
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
              originals: [
                { word: "παθητὸς", translit: "pathētós", meaning: "'haveria de sofrer, destinado a padecer' — termo que liga o sofrimento do Messias ao plano profético já anunciado nas Escrituras", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "μαρτυρία", translit: "martyría", meaning: "'testemunho' — relato daquilo que se viu e viveu pessoalmente; raiz da palavra posterior 'mártir', alguém que testemunha até o preço máximo.", lang: "grego" },
            { word: "ἀπολογία", translit: "apología", meaning: "'defesa razoável' — resposta articulada e respeitosa, não confronto agressivo.", lang: "grego" },
          ],
          deepDive:
            "Um testemunho claro e útil geralmente segue três movimentos simples. Primeiro, 'antes': como era sua vida, seus valores e sua relação (ou ausência de relação) com Deus antes de conhecer a Cristo — sem exagero nem dramatização artificial; testemunhos de conversões graduais e discretas são tão válidos quanto os dramáticos. Segundo, 'encontro': o que especificamente aconteceu — um momento, um período, uma pessoa, um versículo que Deus usou. Terceiro, 'depois': o que mudou de fato, com exemplos concretos, não apenas sentimentos vagos ('mudou minha vida' diz pouco; 'aprendi a perdoar meu pai' diz muito). O erro mais comum é gastar 90% do tempo no 'antes' (contando a própria história de forma sensacionalista) e quase nada explicando quem é Cristo e o que Ele fez — invertendo o centro da narrativa, que deve sempre ser Ele, não nós.",
          theologianQuote: {
            author: "Lesslie Newbigin",
            text: "Só conheço uma pista para essa pergunta, uma única hermenêutica do Evangelho: uma comunidade de homens e mulheres que creem nele e vivem por ele.",
            source: "Lesslie Newbigin, The Gospel in a Pluralist Society (1989), p. 227 (tradução livre) — no original, Newbigin fala da igreja/comunidade; aplicamos o princípio também ao testemunho pessoal de cada discípulo dentro dessa comunidade",
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
              originals: [
                { word: "ὕδωρ ζῶν", translit: "hýdōr zōn", meaning: "'água viva' — expressão que evoca tanto água corrente (em contraste com água parada) quanto, no contexto, a vida que o Espírito concede", lang: "grego" },
              ],
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
            text: "Nada fala mais alto, nem com mais força, do que uma vida de integridade.",
            source: "Charles R. Swindoll (citação amplamente documentada em suas obras e pregações) (tradução livre)",
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
              originals: [
                { word: "παρρησίᾳ", translit: "parrhēsía", meaning: "'denodo, franqueza, ousadia ao falar' — a mesma palavra usada para a confiança dos apóstolos diante de autoridades hostis em Atos", lang: "grego" },
              ],
            },
            {
              ref: "2 Timóteo 1:7",
              textByVersion: {
                NVI: "Pois Deus não nos deu espírito de covardia, mas de poder, de amor e de equilíbrio.",
                ACF: "Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.",
              },
              originals: [
                { word: "δειλίας", translit: "deilías", meaning: "'covardia, temor covarde' — o que Deus não concede; contrastado com δύναμις (poder), ἀγάπη (amor) e σωφρονισμός (equilíbrio, domínio próprio)", lang: "grego" },
              ],
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
            text: "Aquele que tem vergonha de falar a verdade de Deus precisa, ele mesmo, ter vergonha de si!",
            source: "Charles H. Spurgeon, sermão \"The Very Bold Prophecy\" (tradução livre)",
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
              originals: [
                { word: "ἀπολογίαν", translit: "apología", meaning: "'defesa, razão articulada' — termo jurídico usado para defesas formais em tribunais; implica argumento raciocinado, não apenas sentimento", lang: "grego" },
              ],
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
              originals: [
                { word: "ἐπαγωνίζεσθαι", translit: "epagōnízesthai", meaning: "'batalhar, lutar com esforço' — imagem do atletismo grego, de empenho intenso e persistente em defesa de algo valioso", lang: "grego" },
              ],
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
            text: "Mais frequentemente, é o que você é, e não o que você diz, que trará um descrente a Cristo. Esta é, portanto, a apologética suprema: sua vida.",
            source: "William Lane Craig, Reasonable Faith (Crossway, 1994), pp. 301–302 (tradução livre)",
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
    {
      id: "ev-mod-4",
      title: "Módulo IV: Aprofundando a Missão",
      lessons: [
        {
          id: "ev-4-1",
          title: "Teologia da Evangelização: Soberania de Deus e Responsabilidade Humana",
          difficulty: 3,
          intro: [
            "Uma pergunta honesta surge cedo ou tarde na mente de todo cristão reflexivo: se a salvação depende de Deus, por que evangelizar? Se Deus quer salvar alguém, Ele não salvaria de qualquer jeito, com ou sem a nossa participação? Essa pergunta não é nova — Paulo já a antecipa e responde diretamente em Romanos 10.",
            "A resposta bíblica não diminui a soberania de Deus para exaltar o esforço humano, nem diminui a responsabilidade humana para exaltar apenas a soberania divina — ela une as duas coisas como partes do mesmo plano: Deus soberanamente ordenou não apenas o fim (a salvação dos eleitos), mas também os meios pelos quais esse fim se realiza (a pregação fiel do Evangelho por pessoas reais).",
            "Romanos 10:14-15 é decisivo aqui: 'Como, pois, invocarão aquele em quem não creram? E como crerão naquele de quem nunca ouviram? E como ouvirão, se não há quem pregue?' A pergunta retórica de Paulo é uma cadeia de necessidade: sem pregador, não há mensagem ouvida; sem mensagem ouvida, não há fé; sem fé, não há salvação invocada. Deus decidiu, em sua soberania, tornar a pregação humana um elo indispensável nessa corrente — não porque precise de nós, mas porque escolheu nos incluir como instrumentos de sua obra.",
            "Isso significa que evangelismo não é uma atividade opcional 'apesar' da soberania de Deus — é precisamente o meio que Deus soberanamente designou para operar. Orar por alguém e testemunhar a essa mesma pessoa não são atitudes concorrentes ou contraditórias; são as duas metades do mesmo ato de fé, confiando que Deus opera através dos meios que Ele mesmo instituiu.",
          ],
          verses: [
            {
              ref: "Romanos 10:14-15,17",
              textByVersion: {
                NVI: "Como, pois, invocarão aquele em quem não creram? E como crerão naquele de quem não ouviram? E como ouvirão, se não há quem pregue?... Consequentemente, a fé vem por se ouvir a mensagem, e a mensagem é ouvida mediante a palavra de Cristo.",
                ACF: "Como pois invocarão aquele em quem não creram? e como crerão naquele de quem não ouviram? e como ouvirão, se não há quem pregue?... De sorte que a fé é pelo ouvir, e o ouvir pela palavra de Deus.",
              },
              originals: [
                { word: "κηρύσσων", translit: "kērýssōn", meaning: "'quem pregue, quem proclame' — particípio ligado à necessidade de um proclamador humano real para que a fé aconteça", lang: "grego" },
              ],
            },
            {
              ref: "1 Coríntios 3:6-7",
              textByVersion: {
                NVI: "Eu plantei, Apolo regou, mas Deus deu o crescimento. Assim, nem o que planta é alguma coisa, nem o que rega, mas Deus, que dá o crescimento.",
                ACF: "Eu plantei, Apolo regou, mas o crescimento veio de Deus. De modo que, nem o que planta é alguma coisa, nem o que rega, mas Deus, que dá o crescimento.",
              },
              originals: [
                { word: "ἐφύτευσα", translit: "ephýteusa", meaning: "'plantei' — aoristo que marca uma ação concluída; contrastado com ηὔξανεν ('dava o crescimento'), no imperfeito, ação contínua de Deus", lang: "grego" },
              ],
            },
            {
              ref: "2 Timóteo 2:10",
              textByVersion: {
                NVI: "Por isso, tudo suporto por causa dos eleitos, para que também eles alcancem a salvação que está em Cristo Jesus, com glória eterna.",
              },
              originals: [
                { word: "ἐκλεκτούς", translit: "eklektoús", meaning: "'eleitos' — de eklégomai, escolhidos; os que Deus separou para receber a salvação anunciada pelo Evangelho", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "κηρύσσω", translit: "kērýssō", meaning: "'pregar, proclamar publicamente' — anúncio autorizado, como um arauto anunciando a mensagem do rei.", lang: "grego" },
            { word: "συνεργός", translit: "synergós", meaning: "'cooperador, cocolaborador' — usado por Paulo (1 Co 3:9) para descrever pregadores como colaboradores de Deus, nunca como sua fonte de poder.", lang: "grego" },
          ],
          deepDive:
            "É útil pensar nessa relação com uma analogia simples: Deus decretou soberanamente que uma plantação cresça — mas também decretou que ela cresça através de sementes plantadas, terra regada e sol brilhando, não por mágica desconectada de causas reais. Ninguém pergunta 'se Deus decidiu a colheita, por que plantar sementes?' — a soberania divina sobre o resultado não anula, mas *inclui*, os meios ordinários pelos quais esse resultado acontece. O mesmo vale para a evangelização: a soberania de Deus na salvação nunca é usada, na Escritura, como desculpa para a passividade humana — pelo contrário, é precisamente o fundamento da confiança com que evangelizamos, sabendo que nosso esforço não depende, no fim, apenas do nosso próprio talento ou eloquência, mas da obra segura de Deus através dele.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Não podemos fazer os homens virem; essa é a obra do Espírito Santo — mas podemos persuadi-los pelo amor de Jesus.",
            source: "Charles H. Spurgeon, The Sword and Trowel (1883), pp. 207–208 (tradução livre)",
          },
          deepen: {
            historicalContext:
              "A pergunta 'por que evangelizar, se Deus é soberano?' não é nova nem exclusiva de nenhuma tradição teológica específica — ela já aparece, com nuances diferentes, em debates entre correntes reformadas (que historicamente enfatizaram fortemente a eleição soberana) e correntes arminianas e wesleyanas desde o século XVIII, sem que isso jamais tenha diminuído o zelo missionário de nenhuma das duas tradições: os grandes movimentos missionários modernos (como o de William Carey, batista, e o de George Whitefield, mais próximo do calvinismo) nasceram de ambos os lados dessa discussão teológica, evidenciando que a convicção da soberania de Deus, bem compreendida, historicamente inflama o zelo evangelístico, em vez de apagá-lo.",
            exegeticalNotes:
              "O verbo grego por trás de 'pregue', em Romanos 10:14 ('kērýssōn'), vem do mundo do arauto real — alguém enviado oficialmente para proclamar publicamente a mensagem de um rei, com autoridade delegada, mas sem originar a mensagem por si mesmo. Isso ilustra bem o papel do evangelista: mensageiro autorizado, nunca autor da mensagem que proclama.",
            theologicalDebate:
              "A relação entre a soberania de Deus na eleição e a responsabilidade humana na evangelização é compreendida de formas diferentes entre tradições reformadas e arminianas — como já visto em outras lições desta trilha. Tradições reformadas tendem a enfatizar que a pregação é o meio pelo qual Deus efetivamente chama os eleitos, de forma certa e garantida; tradições arminianas — à qual esta trilha está mais alinhada — enfatizam que a graça preveniente de Deus capacita genuinamente qualquer ouvinte a responder, tornando a pregação um convite real e sincero a todos, não apenas aos já predeterminados. Ambas as tradições concordam, sem exceção, que a evangelização é um meio ordenado e necessário por Deus, e que negligenciá-la é desobediência, independentemente de como se entende os detalhes da eleição.",
            secondQuote: {
              author: "J. I. Packer",
              text: "A soberania de Deus na salvação e a genuína responsabilidade humana de evangelizar não são um paradoxo a ser resolvido pela razão, mas duas verdades bíblicas a serem sustentadas juntas, com humildade, diante do mistério de Deus.",
            },
          },
          quizzes: [
            {
              question: "Segundo Romanos 10:14-15, qual é a cadeia de necessidade que Paulo estabelece para que alguém creia?",
              options: [
                "A fé acontece independentemente de qualquer pregação humana",
                "Sem pregador não há mensagem ouvida; sem mensagem ouvida não há fé; a pregação humana é meio necessário nesse processo",
                "A pregação é opcional, pois Deus salva sem qualquer meio humano",
                "Somente experiências místicas diretas geram fé salvadora",
              ],
              correctIndex: 1,
              explanation: "Paulo estabelece uma cadeia lógica: crer depende de ouvir, ouvir depende de pregação, e pregação depende de alguém ser enviado — tornando a evangelização meio necessário, não opcional.",
            },
            {
              question: "Qual analogia a lição usa para explicar a relação entre soberania divina e meios humanos na evangelização?",
              options: [
                "Um sorteio aleatório, sem qualquer meio envolvido",
                "O plantio de uma colheita: Deus decreta o crescimento, mas através de meios reais como sementes plantadas e terra regada",
                "Um jogo de sorte em que os meios são irrelevantes",
                "Um contrato comercial entre Deus e o evangelista",
              ],
              correctIndex: 1,
              explanation: "Assim como a soberania de Deus sobre a colheita não anula a necessidade de plantar sementes, sua soberania na salvação não anula, mas inclui, a pregação humana como meio.",
            },
            {
              question: "Segundo a lição, o que tradições reformadas e arminianas concordam sobre evangelização, apesar de suas diferenças sobre eleição?",
              options: [
                "Que a evangelização é dispensável para quem já é eleito",
                "Que a evangelização é um meio ordenado e necessário por Deus, e negligenciá-la é desobediência, independentemente da posição sobre eleição",
                "Que apenas os reformados devem evangelizar",
                "Que a evangelização substitui a necessidade de oração",
              ],
              correctIndex: 1,
              explanation: "Apesar de divergirem nos detalhes sobre a eleição, ambas as tradições concordam que a pregação fiel é meio necessário e ordenado por Deus, nunca opcional.",
            },
          ],
          application:
            "Nesta semana, ore antes de cada oportunidade de testemunho pedindo a Deus que use sua fala como meio de sua obra soberana — e depois, com a mesma convicção, fale, confiando que Deus opera através do seu esforço real, não apesar dele.",
          prayer:
            "Senhor, tua soberania sobre a salvação não me exime de agir — ela me dá confiança para agir, sabendo que meu testemunho é o meio que escolheste usar. Tira de mim tanto a passividade que se esconde atrás da tua soberania, quanto o orgulho que esquece que só tu dás o crescimento. Usa minhas palavras, ainda que fracas, para tua obra soberana e boa. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva, em poucas frases, como você explicaria a alguém por que a evangelização continua necessária mesmo acreditando na soberania de Deus sobre a salvação.",
          reflectionQuestion:
            "Você já usou a soberania de Deus como desculpa (mesmo que inconsciente) para não testemunhar? O que muda em você ao entender que a pregação é o meio, não um obstáculo, à obra soberana de Deus?",
          xp: 30,
        },
        {
          id: "ev-4-2",
          title: "Testemunho Digital: o Evangelho nas Redes",
          difficulty: 2,
          intro: [
            "Boa parte da vida relacional de hoje acontece por telas — mensagens, redes sociais, comentários, grupos. Isso muda o cenário do evangelismo cotidiano, mas não muda seus princípios bíblicos fundamentais: continuamos precisando de sabedoria, mansidão, clareza e amor genuíno — só que agora aplicados a um espaço com características próprias, e riscos próprios.",
            "Vale notar que o povo de Deus sempre usou os meios de comunicação disponíveis em cada época para espalhar sua mensagem: cartas apostólicas circulavam entre igrejas (Colossenses 4:16), a invenção da imprensa acelerou imensamente a Reforma Protestante, o rádio e a televisão levaram o Evangelho a lugares inacessíveis no século XX. As redes sociais são apenas o meio mais recente dessa longa história — nem inerentemente santo, nem inerentemente profano, mas uma ferramenta a ser usada com sabedoria.",
            "Colossenses 4:5-6, já estudado nesta trilha, pede sabedoria com os 'de fora' e conversa 'temperada com sal' — princípios que valem tanto para uma conversa presencial quanto para um comentário público na internet. A diferença é que o ambiente digital tem características próprias: é permanente (o que se escreve dificilmente se apaga de verdade), é público (frequentemente visto por muito mais gente do que se imagina) e tende a recompensar reações rápidas e emocionais, não reflexão cuidadosa.",
            "Isso pede um cuidado adicional: testemunhar bem online geralmente significa resistir ao impulso de responder rápido e de forma agressiva a discussões acaloradas, e privilegiar mensagens que ilustrem graça, verdade e paciência — sabendo que, no ambiente digital, um comentário impaciente pode prejudicar o testemunho de Cristo tanto quanto uma palavra sábia pode abrir portas reais.",
          ],
          verses: [
            {
              ref: "Colossenses 4:5-6",
              textByVersion: {
                NVI: "Sejam sábios no procedimento de vocês para com os de fora, aproveitando ao máximo cada oportunidade. A conversa de vocês seja sempre agradável e temperada com sal, para que saibam como responder a cada um.",
                ACF: "Andai em sabedoria para com os que estão de fora, remindo o tempo. A vossa palavra seja sempre agradável, adubada com sal, para que saibais como vos convém responder a cada um.",
              },
              originals: [
                { word: "ἅλατι", translit: "hálati", meaning: "'com sal' — forma dativa de hálas; imagem de conversa que conserva o bom sabor e evita a corrupção da fofoca ou da grosseria", lang: "grego" },
              ],
            },
            {
              ref: "Tiago 1:19",
              textByVersion: {
                NVI: "Cada um seja pronto para ouvir, tardio para falar, tardio para se irar.",
                ACF: "Todo homem seja pronto para ouvir, tardio para falar, tardio para se irar.",
              },
              originals: [
                { word: "ταχὺς", translit: "tachýs", meaning: "'pronto, rápido' — contrastado com βραδύς (bradýs, 'lento, tardio'), usado duas vezes no mesmo versículo para ouvir e para falar/irar-se", lang: "grego" },
              ],
            },
            {
              ref: "1 Pedro 3:15-16",
              textByVersion: {
                NVI: "Estejam sempre preparados para responder a qualquer pessoa que lhes pedir a razão da esperança que há em vocês. Contudo, façam isso com mansidão e respeito, conservando boa consciência.",
              },
              originals: [
                { word: "ἐλπίδος", translit: "elpídos", meaning: "'esperança' — genitivo de elpís; não otimismo vago, mas expectativa firme e fundamentada naquilo que Deus já prometeu e cumpriu em Cristo", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "πραΰτης", translit: "praǘtēs", meaning: "'mansidão' — força sob controle, não fraqueza; qualidade explicitamente exigida ao dar razão da fé (1 Pe 3:15), tanto presencial quanto digitalmente.", lang: "grego" },
            { word: "καιρός", translit: "kairós", meaning: "'ocasião oportuna' — reconhecer quando um comentário edifica e quando apenas alimenta discórdia é parte da sabedoria pedida em Colossenses 4:5.", lang: "grego" },
          ],
          deepDive:
            "Três princípios práticos ajudam a aplicar a sabedoria bíblica ao ambiente digital: primeiro, lembre-se de que por trás de cada comentário há uma pessoa real, criada à imagem de Deus — o anonimato relativo das telas facilita esquecer isso, e é justamente aí que a mansidão bíblica (1 Pedro 3:15) precisa ser mais deliberadamente praticada. Segundo, nem toda discussão pede resposta pública imediata — Tiago 1:19 ('tardio para falar, tardio para se irar') é sabedoria especialmente relevante num ambiente desenhado para reações rápidas; às vezes, uma conversa privada, mais lenta e pessoal, comunica mais amor do que um comentário público defendendo um ponto. Terceiro, seu perfil e sua conduta digital consistente ao longo do tempo — o que você compartilha, como reage, como trata quem discorda — comunicam tanto quanto qualquer postagem isolada e explicitamente evangelística; a coerência entre vida online e offline é, ela mesma, um testemunho silencioso poderoso.",
          theologianQuote: {
            author: "John Mark Comer",
            text: "Aquilo a que você dá atenção é a pessoa em que você se torna.",
            source: "John Mark Comer (citação amplamente documentada em suas obras sobre atenção e vida digital) (tradução livre)",
          },
          deepen: {
            historicalContext:
              "A Reforma Protestante do século XVI é um exemplo histórico notável do uso de uma nova tecnologia de comunicação (a imprensa, inventada por Gutenberg poucas décadas antes) para a rápida disseminação do Evangelho e do ensino bíblico em larga escala — panfletos e traduções bíblicas impressas circularam pela Europa numa velocidade sem precedentes para a época. A Igreja historicamente não temeu novos meios de comunicação; aprendeu a usá-los com discernimento, sem perder de vista os princípios bíblicos permanentes de sabedoria e amor ao próximo.",
            exegeticalNotes:
              "A palavra 'kairós' (ocasião oportuna), em Colossenses 4:5, contrasta deliberadamente com 'chrónos' (tempo cronológico sequencial) — Paulo não está pedindo presença constante e onipresente em toda conversa disponível (o que o ambiente digital tenta constantemente exigir), mas discernimento sábio sobre quando uma oportunidade específica realmente vale a pena ser aproveitada.",
            theologicalDebate:
              "Cristãos fiéis divergem, de forma prática e não doutrinária, sobre o quanto de debate teológico ou apologético público vale a pena travar nas redes sociais: alguns veem valor real em defesas públicas visíveis da fé diante de objeções amplamente compartilhadas; outros preferem reservar discussões mais profundas para conversas privadas e relacionais, considerando o ambiente público das redes menos propício à humildade e à escuta genuína. Não é uma questão de fidelidade bíblica, mas de sabedoria situacional (Colossenses 4:5) — cada um deve avaliar, com oração, onde seu testemunho digital é mais frutífero.",
            secondQuote: {
              author: "Vishal Mangalwadi",
              text: "Toda tecnologia de comunicação é uma ferramenta neutra em si mesma; o que a torna boa ou má é o caráter e a sabedoria de quem a utiliza.",
            },
          },
          quizzes: [
            {
              question: "Segundo a lição, qual princípio de Colossenses 4:5-6 se aplica diretamente ao testemunho nas redes sociais?",
              options: [
                "Falar o máximo possível sobre qualquer assunto religioso, em qualquer contexto",
                "Ter sabedoria no procedimento com os 'de fora' e uma conversa agradável, temperada com sal",
                "Evitar completamente qualquer presença nas redes sociais",
                "Responder imediatamente a toda crítica recebida online",
              ],
              correctIndex: 1,
              explanation: "A sabedoria e a fala 'temperada com sal' pedidas por Paulo se aplicam tanto a conversas presenciais quanto a interações digitais.",
            },
            {
              question: "Por que Tiago 1:19 ('tardio para falar, tardio para se irar') é especialmente relevante no ambiente digital?",
              options: [
                "Porque as redes sociais não têm relação com esse princípio",
                "Porque o ambiente digital tende a recompensar reações rápidas e emocionais, tornando a pausa reflexiva ainda mais necessária",
                "Porque esse princípio só se aplica a conversas presenciais",
                "Porque é melhor nunca comentar nada online",
              ],
              correctIndex: 1,
              explanation: "O design de muitas redes sociais incentiva respostas imediatas; a sabedoria de ser 'tardio para falar' é um contrapeso bíblico deliberado a essa pressão.",
            },
            {
              question: "Segundo a lição, o que comunica testemunho tão poderoso quanto uma postagem explicitamente evangelística?",
              options: [
                "O número de seguidores de um perfil",
                "A coerência entre a conduta digital consistente ao longo do tempo e a vida offline da pessoa",
                "A frequência de postagens religiosas",
                "O uso de linguagem teológica complexa online",
              ],
              correctIndex: 1,
              explanation: "A consistência de caráter, tanto online quanto offline, é, por si só, um testemunho silencioso e poderoso, tanto quanto qualquer postagem explícita.",
            },
          ],
          application:
            "Nesta semana, antes de comentar ou responder a algo potencialmente polêmico nas redes sociais, pare por trinta segundos e pergunte: 'isso edifica, ou apenas alimenta discórdia?' — e considere se uma mensagem privada não comunicaria mais amor do que uma resposta pública.",
          prayer:
            "Senhor, minha vida digital também te pertence. Dá-me sabedoria para saber quando falar e quando ficar em silêncio, mansidão para responder mesmo quando provocado, e coerência entre o que professo online e como vivo offline. Que meu testemunho nas redes reflita graça e verdade, nunca impaciência ou orgulho. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Revise seu próprio perfil nas redes sociais esta semana e pergunte, com honestidade: o que ele comunica sobre Cristo, mesmo sem uma única postagem explicitamente religiosa?",
          reflectionQuestion:
            "Sua conduta online, ao longo do tempo, tem refletido mansidão e sabedoria bíblica — ou você já se arrependeu de alguma reação apressada nas redes?",
          xp: 25,
        },
        {
          id: "ev-4-3",
          title: "Discipulado Inicial: Cuidando de Quem Acabou de Crer",
          difficulty: 2,
          intro: [
            "Uma pessoa acabou de professar fé em Cristo através do seu testemunho. E agora? Esse é um momento decisivo, muitas vezes negligenciado: a Grande Comissão não termina em 'fazer decisões' — ela pede que façamos discípulos, 'ensinando-os a obedecer a tudo o que eu ordenei' (Mateus 28:20). Um recém-convertido deixado sem cuidado nos primeiros passos está muito mais vulnerável a esfriar, se confundir ou até abandonar a fé.",
            "Isso não significa que você precisa se tornar sozinho o mentor completo dessa pessoa para sempre — significa, principalmente, garantir que ela seja conectada rapidamente a três âncoras essenciais: a Palavra de Deus (o hábito de ler e entender a Bíblia), a oração pessoal, e — de forma indispensável — uma igreja local que possa acompanhá-la de perto (retome, se necessário, a trilha 'Novo Convertido' para relembrar essas bases).",
            "Barnabé, no livro de Atos, é um modelo bonito desse cuidado inicial: quando Paulo, recém-convertido, ainda era temido e mal recebido pela igreja de Jerusalém, foi Barnabé quem o acolheu, apresentou aos apóstolos e testemunhou pessoalmente por sua conversão genuína (Atos 9:26-27). Sem esse cuidado inicial de Barnabé, a história da igreja primitiva poderia ter sido bem diferente.",
            "Discipular alguém recém-convertido não exige respostas teológicas perfeitas para tudo — exige presença, paciência, e disposição de caminhar ao lado, como Barnabé caminhou ao lado de Paulo, até que essa pessoa esteja bem enraizada em sua própria caminhada com Cristo e sua própria igreja local.",
          ],
          verses: [
            {
              ref: "Mateus 28:19-20",
              textByVersion: {
                NVI: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, do Filho e do Espírito Santo, ensinando-os a obedecer a tudo o que eu ordenei.",
              },
              originals: [
                { word: "τηρεῖν", translit: "tēreîn", meaning: "'guardar, obedecer continuamente' — não apenas conhecer intelectualmente, mas praticar de forma perseverante", lang: "grego" },
              ],
            },
            {
              ref: "Atos 9:26-27",
              textByVersion: {
                NVI: "Chegando a Jerusalém, Saulo procurava reunir-se aos discípulos, mas todos tinham medo dele, não acreditando que ele fosse discípulo. Barnabé, porém, tomou-o consigo e o levou aos apóstolos.",
              },
              originals: [
                { word: "ἐπελάβετο", translit: "epelábeto", meaning: "'tomou consigo, agarrou' — verbo que descreve a ação decidida de Barnabé de acolher Saulo apesar do medo geral dos discípulos", lang: "grego" },
              ],
            },
            {
              ref: "1 Tessalonicenses 2:7-8,11",
              textByVersion: {
                NVI: "Antes, fomos meigos entre vocês, como uma mãe cuida com carinho de seus filhos. Em nosso profundo afeto por vocês, decidimos dar-lhes não somente o evangelho de Deus, mas também a nossa própria vida... Sabem também como tratamos cada um de vocês como um pai trata os seus filhos.",
              },
              originals: [
                { word: "τροφὸς", translit: "trophós", meaning: "'ama de leite, mãe que amamenta' — imagem de cuidado terno e próximo, usada por Paulo para descrever seu afeto pastoral pelos tessalonicenses", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "τηρέω", translit: "tēréō", meaning: "'guardar, obedecer continuamente' — discipulado genuíno inclui prática perseverante, não apenas conhecimento intelectual.", lang: "grego" },
            { word: "νήπιος", translit: "nḗpios", meaning: "'criancinha, recém-nascido' — imagem usada por Paulo (1 Co 3:1) para crentes ainda imaturos, que precisam de cuidado apropriado à sua fase.", lang: "grego" },
          ],
          deepDive:
            "Cuidar bem de um recém-convertido nas primeiras semanas costuma incluir passos simples, mas decisivos: ajudá-lo a começar um hábito realista de leitura bíblica (mesmo que pequeno no início — cinco minutos são melhores do que uma meta ambiciosa e abandonada em uma semana), introduzi-lo pessoalmente a uma igreja local e, idealmente, apresentá-lo você mesmo a algumas pessoas ali (assim como Barnabé apresentou Paulo aos apóstolos, reduzindo o medo natural de chegar sozinho a um lugar novo), conversar abertamente sobre o batismo como próximo passo público de obediência, e estar disponível para dúvidas simples nas primeiras semanas, sem pressa de que a pessoa 'já saiba tudo'. O erro mais comum é acompanhar intensamente até a decisão de fé, e depois desaparecer — deixando a pessoa sozinha justamente na fase mais frágil e vulnerável do seu crescimento espiritual.",
          theologianQuote: {
            author: "Thom Rainer",
            text: "O discipulado de novos crentes não acontece sozinho — ele precisa ser intencional.",
            source: "Thom S. Rainer (com Eric Geiger), Simple Church (tradução livre)",
          },
          deepen: {
            historicalContext:
              "O nome 'Barnabé' significa, segundo o próprio Lucas explica em Atos 4:36, 'filho da consolação/encorajamento' — um apelido dado pela própria igreja primitiva, provavelmente por seu caráter reconhecido de acolhimento generoso. É significativo que seja justamente esse homem, conhecido por encorajar, quem aparece repetidamente em Atos cuidando de pessoas recém-chegadas à fé ou à comunidade — com Paulo em Atos 9, e depois com a nova e frágil igreja gentia de Antioquia em Atos 11:22-24.",
            exegeticalNotes:
              "O verbo grego 'tēreîn' (guardar, obedecer), em Mateus 28:20, aparece no tempo presente contínuo no texto grego, sugerindo uma prática constante e perseverante — não um evento único de instrução, mas um acompanhamento contínuo de obediência crescente ao longo do tempo, exatamente o que o discipulado inicial de um recém-convertido precisa oferecer.",
            theologicalDebate:
              "Tradições cristãs diferem legitimamente sobre o momento e a forma ideal do batismo dentro do processo de discipulado inicial de um recém-convertido — algumas priorizam o batismo o mais rápido possível após a profissão de fé genuína (seguindo o padrão de Atos, onde batismos muitas vezes aconteciam no mesmo dia da conversão, como em Atos 8:36-38 e 16:33), outras preferem um período mais longo de instrução e observação antes do batismo. Esta é uma questão de prática eclesiástica, sobre a qual vale conversar com a liderança da igreja local específica, e não uma questão que altera o núcleo do discipulado inicial descrito nesta lição.",
            secondQuote: {
              author: "Josué K. Reichow",
              text: "Ninguém deveria caminhar sozinho nas primeiras semanas depois de conhecer a Cristo — esse é exatamente o momento em que a igreja mais precisa se parecer com família.",
            },
          },
          quizzes: [
            {
              question: "Segundo Mateus 28:19-20, o que a Grande Comissão pede além de simplesmente levar alguém a uma decisão inicial de fé?",
              options: [
                "Nada além disso — a Grande Comissão termina na decisão de fé",
                "Ensinar o novo crente a obedecer continuamente a tudo o que Cristo ordenou",
                "Apenas o batismo, sem qualquer ensino posterior",
                "Deixar a pessoa por conta própria para descobrir a fé sozinha",
              ],
              correctIndex: 1,
              explanation: "'Fazer discípulos' inclui explicitamente ensinar obediência contínua e perseverante, não apenas gerar uma decisão pontual de fé.",
            },
            {
              question: "O que Barnabé fez por Paulo, recém-convertido, em Atos 9:26-27?",
              options: [
                "Evitou-o, com medo de sua conversão não ser genuína",
                "Acolheu-o, apresentou-o pessoalmente aos apóstolos, reduzindo o medo natural da igreja em recebê-lo",
                "Exigiu que Paulo provasse sua fé através de testes públicos",
                "Ignorou completamente a situação",
              ],
              correctIndex: 1,
              explanation: "Barnabé modela o cuidado inicial de acolher e apresentar um recém-convertido à comunidade, quando ele mais precisava desse apoio.",
            },
            {
              question: "Qual erro comum a lição aponta no discipulado de recém-convertidos?",
              options: [
                "Cuidar demais da pessoa nas primeiras semanas",
                "Acompanhar intensamente até a decisão de fé e depois desaparecer, deixando a pessoa sozinha na fase mais frágil",
                "Apresentar o novo crente a uma igreja local cedo demais",
                "Falar sobre o batismo como próximo passo",
              ],
              correctIndex: 1,
              explanation: "O erro mais comum e prejudicial é o abandono logo após a conversão — exatamente quando o cuidado contínuo é mais necessário.",
            },
          ],
          application:
            "Se você já levou alguém a Cristo recentemente (ou vier a levar), agende, esta semana, um próximo encontro concreto com essa pessoa — para ler a Bíblia juntos, apresentá-la à sua igreja, ou simplesmente conversar sobre como ela está se sentindo nesses primeiros passos.",
          prayer:
            "Senhor, obrigado por quem cuidou de mim nos meus primeiros passos de fé — e me ajuda a fazer o mesmo por outros. Dá-me o coração de Barnabé: disposto a acolher, apresentar e acompanhar quem ainda está aprendendo a andar contigo. Que eu nunca abandone alguém logo depois de vê-lo crer, mas caminhe ao lado até que esteja bem enraizado em ti e em tua igreja. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Pense em alguém que você conhece que é cristão há pouco tempo (mesmo que não tenha sido você quem o evangelizou). Convide essa pessoa para um café ou uma conversa esta semana, perguntando como você pode apoiá-la nessa fase.",
          reflectionQuestion:
            "Se você levasse alguém a Cristo amanhã, você já sabe, concretamente, quais seriam seus próximos três passos de cuidado com essa pessoa?",
          xp: 25,
        },
        {
          id: "ev-4-4",
          title: "Multiplicação: Discípulos que Fazem Discípulos",
          difficulty: 3,
          intro: [
            "Há uma diferença importante entre adição e multiplicação no crescimento do Reino de Deus. Um evangelista que ganha pessoas para Cristo, uma a uma, ao longo da vida, soma um número real e valioso de vidas transformadas. Mas um discipulador que ensina outros a também evangelizarem e discipularem multiplica esse impacto através de gerações espirituais que ele talvez nunca chegue a conhecer pessoalmente.",
            "Paulo descreve esse princípio com clareza notável em sua última carta, escrita já perto do fim da vida: 'o que você ouviu de mim na presença de muitas testemunhas, confie a homens fiéis, que sejam também idôneos para ensinar a outros' (2 Timóteo 2:2). Note a estrutura: Paulo ensina Timóteo, Timóteo ensina homens fiéis, esses homens ensinam ainda outros — quatro gerações espirituais mencionadas em uma única frase.",
            "Esse padrão de multiplicação não é uma técnica moderna de gestão aplicada à igreja — está enraizado na própria estrutura da Grande Comissão: 'fazer discípulos... ensinando-os a obedecer a tudo o que eu ordenei' (Mateus 28:19-20) inclui, necessariamente, ensinar os novos discípulos a também discipularem outros, porque isso está entre as coisas que Cristo ordenou (a própria Grande Comissão).",
            "Multiplicação genuína exige um investimento maior a curto prazo (é mais rápido simplesmente evangelizar alguém do que treiná-lo para também evangelizar e discipular outros), mas produz um fruto multiplicado a longo prazo — e reflete a própria generosidade de Deus, que não guarda a graça recebida só para si, mas a passa adiante através de gerações inteiras de fiéis.",
          ],
          verses: [
            {
              ref: "2 Timóteo 2:2",
              textByVersion: {
                NVI: "E aquilo que você me ouviu dizer na presença de muitas testemunhas, confie a homens fiéis que sejam também capazes de ensinar a outros.",
                ACF: "E o que de mim, entre muitas testemunhas, ouviste, confia-o a homens fiéis, que sejam idôneos para também ensinarem os outros.",
              },
              originals: [
                { word: "παράθου", translit: "paráthou", meaning: "'confie, deposite como depósito seguro' — imagem financeira de um depósito confiado a alguém de confiança, para ser preservado e repassado", lang: "grego" },
              ],
            },
            {
              ref: "Atos 18:24-26",
              textByVersion: {
                NVI: "Chegou a Éfeso um judeu chamado Apolo... Áquila e Priscila... o convidaram para ir à sua casa e explicaram-lhe com mais precisão o caminho de Deus.",
              },
              originals: [
                { word: "ἀκριβέστερον", translit: "akribésteron", meaning: "'com mais precisão, mais exatamente' — comparativo de akribḗs; Áquila e Priscila não corrigem publicamente, mas aprofundam com cuidado particular", lang: "grego" },
              ],
            },
            {
              ref: "Filipenses 4:9",
              textByVersion: {
                NVI: "O que vocês aprenderam, receberam, ouviram e viram em mim, ponham em prática. E o Deus da paz estará com vocês.",
              },
              originals: [
                { word: "ἐμάθετε", translit: "emáthete", meaning: "'aprendestes' — de manthánō, aprender por instrução recebida; ligado a παρελάβετε ('recebestes'), termo técnico de transmissão fiel de tradição", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "παρατίθημι", translit: "paratíthēmi", meaning: "'depositar, confiar' — termo financeiro para um depósito seguro; discipular é confiar um tesouro recebido a outra pessoa de confiança.", lang: "grego" },
            { word: "πιστός", translit: "pistós", meaning: "'fiel, digno de confiança' — a qualificação central que Paulo pede em quem recebe esse depósito espiritual, mais do que talento ou eloquência.", lang: "grego" },
          ],
          deepDive:
            "Vale notar, em 2 Timóteo 2:2, que a única qualificação explicitamente exigida por Paulo para receber esse 'depósito' e repassá-lo adiante é ser 'fiel' (pistós) — não brilhante, não eloquente, não formado teologicamente, apenas fiel e capaz de ensinar. Isso é uma boa notícia prática: multiplicar discípulos não exige que você seja um especialista teológico antes de começar — exige fidelidade em compartilhar o que você já genuinamente aprendeu e vive, com disposição de investir tempo pessoal em outra pessoa específica, assim como alguém provavelmente investiu tempo em você. Áquila e Priscila, em Atos 18, ilustram isso bem: um casal comum, sem cargo formal de ensino público, que investiu tempo pessoal explicando 'com mais precisão' o caminho de Deus a Apolo, um pregador já talentoso — multiplicação acontece tanto em conversas informais quanto em discipulados formalmente estruturados.",
          theologianQuote: {
            author: "David Bosch",
            text: "Existe igreja porque existe missão, e não o contrário.",
            source: "David J. Bosch, Transforming Mission (1991), p. 390 (tradução livre)",
          },
          deepen: {
            historicalContext:
              "2 Timóteo é geralmente reconhecida, mesmo entre estudiosos mais céticos quanto à autoria paulina de outras cartas pastorais, como escrita perto do fim da vida de Paulo, possivelmente já em sua segunda e última prisão romana, pouco antes de seu martírio. Isso confere um peso especial a 2 Timóteo 2:2: são, essencialmente, as últimas instruções de um homem que sabe que seu tempo pessoal de ministério está terminando, preocupado em garantir que a mensagem continue viva através de outros, muito depois de sua própria morte.",
            exegeticalNotes:
              "O verbo 'parátithēmi', em 2 Timóteo 2:2, era comumente usado no mundo comercial e bancário para descrever um depósito confiado a um banco ou a uma pessoa de confiança, com a expectativa clara de que seria preservado e devolvido (ou, no caso aqui, repassado) fielmente. Paulo escolhe deliberadamente essa imagem financeira para descrever o Evangelho e o ensino apostólico: um tesouro valioso, que não deve ser guardado egoisticamente, mas administrado com fidelidade e repassado adiante.",
            theologicalDebate:
              "Diferentes tradições e igrejas aplicam de formas distintas, mas igualmente legítimas, o princípio da multiplicação de discípulos: algumas enfatizam estruturas formais de discipulado um-a-um ou em pequenos grupos, com materiais e etapas bem definidas; outras enfatizam relações mais orgânicas e informais de mentoria dentro da vida cotidiana da igreja, sem uma estrutura rígida. O padrão bíblico (Paulo-Timóteo, Áquila-Priscila-Apolo) sustenta ambas as aplicações — o que é central e inegociável é que todo discípulo maduro deveria estar, de alguma forma intencional, investindo em outros, e não apenas recebendo passivamente de quem já o discipulou.",
            secondQuote: {
              author: "David L. Allen",
              text: "A fidelidade de uma geração cristã se mede, em boa parte, por quantas outras gerações ela deixou preparadas para continuar depois dela.",
            },
          },
          quizzes: [
            {
              question: "Em 2 Timóteo 2:2, quantas gerações espirituais de ensino Paulo menciona explicitamente em uma única frase?",
              options: [
                "Apenas duas: Paulo e Timóteo",
                "Quatro: Paulo, Timóteo, homens fiéis, e os outros que esses homens ensinarão",
                "Nenhuma — o versículo fala apenas de Paulo",
                "Dez gerações completas",
              ],
              correctIndex: 1,
              explanation: "Paulo descreve uma cadeia de multiplicação: ele ensina Timóteo, que confia a homens fiéis, que ensinarão ainda outros — quatro gerações mencionadas.",
            },
            {
              question: "Segundo a lição, qual é a única qualificação explicitamente exigida por Paulo em 2 Timóteo 2:2 para alguém receber e repassar o ensino apostólico?",
              options: [
                "Formação teológica avançada",
                "Ser fiel ('pistós') e capaz de ensinar a outros — não talento excepcional ou eloquência",
                "Ocupar um cargo formal de liderança na igreja",
                "Ter conhecido pessoalmente o apóstolo Paulo",
              ],
              correctIndex: 1,
              explanation: "A qualificação central exigida é fidelidade, não brilho intelectual ou eloquência — o que torna a multiplicação acessível a qualquer discípulo maduro e fiel.",
            },
            {
              question: "O que Áquila e Priscila fizeram por Apolo, em Atos 18:24-26?",
              options: [
                "Ignoraram-no por ele já ser um pregador talentoso",
                "Investiram tempo pessoal para explicar-lhe 'com mais precisão' o caminho de Deus, mesmo sem ocupar um cargo formal de ensino público",
                "Publicamente o corrigiram e envergonharam diante da multidão",
                "Recusaram-se a ajudá-lo por ele ser estrangeiro",
              ],
              correctIndex: 1,
              explanation: "Um casal comum investiu tempo pessoal e discreto para aprofundar o entendimento de um pregador já talentoso — um belo exemplo de multiplicação informal.",
            },
          ],
          application:
            "Identifique uma pessoa específica, mais nova na fé do que você, em quem você poderia investir intencionalmente — mesmo que de forma simples, como um café mensal ou uma leitura bíblica compartilhada. Convide-a esta semana.",
          prayer:
            "Senhor, obrigado por quem investiu em mim para que eu chegasse até aqui. Ajuda-me a não guardar esse tesouro só para mim, mas a confiá-lo, com fidelidade, a outras pessoas que também possam ensinar outros. Que minha vida não termine em adição, mas contribua para uma verdadeira multiplicação de discípulos fiéis, para tua glória. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Ao longo desta semana, ore pedindo a Deus para revelar uma pessoa específica em quem você deveria começar a investir intencionalmente como discipulador — e dê o primeiro passo concreto de convite.",
          reflectionQuestion:
            "Se você parasse de crescer espiritualmente hoje, o que você já teria repassado, com fidelidade, para a próxima geração de discípulos?",
          xp: 30,
        },
      ],
    },
  ],
};

export const additionalTrails5: Trail[] = [evangelismo];
