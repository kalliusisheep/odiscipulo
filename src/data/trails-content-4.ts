// Conteúdo pastoral completo — Turno 4.
// Trilhas 7 (Igreja Local), 8 (Família Cristã) e 10 (Missões).
// Padrão idêntico ao já usado em "Novo Convertido", "Doutrina Básica",
// "Como Estudar a Bíblia", "Oração" e "Santificação".
// Base teológica: Cristão Evangélico, Batista Aberto, soteriologia arminiana
// (autores reformados usados como referência secundária, sem normatividade
// soteriológica), cristocêntrico, cessacionista moderado. Sola Scriptura.
// Densidade progressiva: estas três trilhas, por virem mais adiante na
// sequência, são intencionalmente mais densas que as trilhas anteriores.

import type { Trail } from "./content";

const igrejaLocal: Trail = {
  id: "igreja-local",
  title: "Igreja Local",
  description: "O propósito e a beleza da comunidade cristã.",
  icon: "Church",
  color: "from-slate-500 to-gray-600",
  order: 7,
  modules: [
    {
      id: "il-mod-1",
      title: "Módulo I: O que é a Igreja?",
      lessons: [
        {
          id: "il-1-1",
          title: "Povo Chamado, Corpo de Cristo",
          intro: [
            "Para muita gente, 'igreja' é sinônimo de prédio, de horário de culto ou de uma instituição religiosa entre outras. A Bíblia ensina algo muito mais profundo: a igreja é um povo — homens e mulheres chamados por Deus, unidos a Cristo pela fé e uns aos outros pelo Espírito Santo. Você não 'vai à igreja' como quem visita um edifício; você É igreja, junto com todos os que também foram resgatados pelo sangue de Cristo.",
            "A palavra grega usada no Novo Testamento para 'igreja', ekklesia, já carregava esse sentido antes mesmo do cristianismo: designava uma assembleia de cidadãos convocados para deliberar sobre assuntos públicos. Ao adotar essa palavra, os primeiros cristãos declaravam algo revolucionário: somos um povo convocado por Deus, com uma identidade e uma missão pública, não um clube privado de interesses religiosos semelhantes.",
            "O Novo Testamento usa ainda outra imagem, talvez a mais rica de todas: a igreja é o corpo de Cristo. Um corpo tem muitos membros, cada um com função diferente, mas todos unidos organicamente à mesma cabeça. Isso significa que você não foi salvo apenas para ter um relacionamento individual e isolado com Deus — foi salvo para ser enxertado num corpo, onde depende dos outros e é necessário aos outros.",
            "Entender isso muda tudo. Sem a igreja, a vida cristã se torna um projeto solitário de autoaperfeiçoamento espiritual. Com a igreja, ela se torna o que sempre foi desenhada para ser: uma família em que crescemos juntos, servimos juntos e somos guardados uns pelos outros até o dia da volta de Cristo.",
          ],
          verses: [
            {
              ref: "1 Coríntios 12:27",
              textByVersion: {
                NVI: "Vocês são corpo de Cristo, e cada um de vocês, individualmente, é membro desse corpo.",
                ACF: "Ora, vós sois o corpo de Cristo, e seus membros em particular.",
              },
              originals: [
                { word: "σῶμα", translit: "sōma", meaning: "corpo — organismo vivo, unido e interdependente, não uma soma de partes soltas", lang: "grego" },
              ],
            },
            {
              ref: "Mateus 16:18",
              textByVersion: {
                NVI: "e eu lhe digo que você é Pedro, e sobre esta pedra edificarei a minha igreja, e as portas do Hades não poderão vencê-la.",
                ACF: "E também eu te digo que tu és Pedro, e sobre esta pedra edificarei a minha igreja, e as portas do inferno não prevalecerão contra ela.",
              },
              originals: [
                { word: "ἐκκλησία", translit: "ekklēsia", meaning: "assembleia dos convocados; povo chamado para fora do mundo e reunido por Deus", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἐκκλησία", translit: "ekklēsia", meaning: "igreja — assembleia de pessoas convocadas por Deus, não um edifício ou instituição", lang: "grego" },
            { word: "σῶμα", translit: "sōma", meaning: "corpo — figura da igreja como organismo vivo, unido a Cristo como cabeça", lang: "grego" },
            { word: "μέλος", translit: "melos", meaning: "membro — parte funcional e necessária de um corpo maior", lang: "grego" },
          ],
          deepDive:
            "É importante notar que Jesus é quem edifica a igreja ('edificarei a minha igreja') — a iniciativa e a garantia de permanência não são humanas, mas divinas. Isso deveria nos dar humildade (a igreja não depende do nosso talento) e esperança (nenhuma força, nem mesmo a morte — 'portas do Hades' —, prevalecerá contra ela). Ao mesmo tempo, a metáfora do corpo em 1 Coríntios 12 é usada por Paulo para corrigir uma igreja dividida por orgulho espiritual: uns se achavam mais importantes por causa de certos dons. A resposta de Paulo não é diminuir a diversidade de funções, mas mostrar que ela é desenhada por Deus para gerar interdependência, não hierarquia de valor. Um olho não pode dizer à mão 'não preciso de você' (1 Co 12:21) — e nenhum cristão pode viver dizendo, na prática, o mesmo à igreja local.",
          theologianQuote: {
            author: "John Stott",
            text: "Não existe cristianismo bíblico sem igreja. A igreja não é um apêndice opcional à salvação; é a família para a qual todo salvo foi adotado.",
          },
          quizzes: [
            {
              question: "O que a palavra grega 'ekklesia' comunica sobre a natureza da igreja?",
              options: [
                "Que a igreja é primariamente um edifício sagrado",
                "Que a igreja é um povo convocado por Deus, com identidade e missão públicas",
                "Que a igreja é uma organização religiosa entre outras",
                "Que a igreja só existe onde há um prédio dedicado ao culto",
              ],
              correctIndex: 1,
              explanation: "Ekklesia designa uma assembleia de convocados — a igreja é, antes de tudo, um povo chamado por Deus.",
            },
            {
              question: "Segundo 1 Coríntios 12, por que a imagem do 'corpo' é usada para a igreja?",
              options: [
                "Para mostrar que alguns membros são mais importantes que outros",
                "Para ensinar que os membros são interdependentes, cada um necessário aos demais",
                "Para justificar que cristãos podem viver a fé isoladamente",
                "Para descrever apenas a liderança da igreja",
              ],
              correctIndex: 1,
              explanation: "O corpo é um organismo unido: cada membro tem função própria, mas nenhum é dispensável aos demais.",
            },
            {
              question: "Em Mateus 16:18, quem é o sujeito que edifica a igreja?",
              options: [
                "Os apóstolos, por sua liderança",
                "A própria igreja, por seu esforço coletivo",
                "Jesus Cristo, que garante que ela não será vencida",
                "O império romano, que permitiu sua expansão",
              ],
              correctIndex: 2,
              explanation: "'Edificarei a minha igreja' — a iniciativa e a garantia de permanência da igreja são de Cristo, não do esforço humano.",
            },
          ],
          application:
            "Se você ainda não é membro comprometido de uma igreja local, dê o primeiro passo esta semana: converse com um pastor ou líder sobre como isso funciona ali. Se já é, escreva o nome de um membro que você tem negligenciado e busque reatar essa conexão nos próximos dias.",
          prayer:
            "Senhor Jesus, obrigado por me chamar não apenas para uma salvação individual, mas para uma família. Perdoa-me pelas vezes em que tratei a igreja como opcional ou secundária. Ensina-me a viver como membro de verdade do teu corpo, dependendo dos outros e sendo necessário a eles. Edifica a tua igreja, e usa-me nela para a tua glória. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Esta semana, pergunte a três irmãos da sua igreja como você pode orar por eles — e ore de fato, todos os dias, por cada um. Anote o que Deus for fazendo nessas vidas e na sua própria.",
          reflectionQuestion:
            "Você tem vivido a vida cristã como um projeto solitário ou como parte real de um corpo do qual depende e ao qual serve? O que precisaria mudar para que sua vida refletisse de fato a imagem do corpo de Cristo?",
          xp: 25,
        },
        {
          id: "il-1-2",
          title: "As Marcas de uma Igreja Fiel",
          intro: [
            "Nem tudo que se chama 'igreja' vive de fato como igreja bíblica. Ao longo da história, cristãos fiéis identificaram certas 'marcas' — sinais essenciais — que distinguem uma comunidade genuinamente cristã de uma reunião meramente religiosa ou social. Essas marcas não são um checklist burocrático; são o resultado natural de um povo que leva a sério o senhorio de Cristo sobre sua vida comum.",
            "A primeira e mais fundamental marca é a pregação fiel da Palavra de Deus. Onde as Escrituras são ensinadas com fidelidade, verdade e clareza, ali há solo fértil para tudo o mais que a igreja é chamada a ser. Sem isso, qualquer outra atividade — por mais bem-intencionada que seja — perde seu fundamento.",
            "A segunda marca é a prática correta das ordenanças que Cristo instituiu: o batismo e a Ceia do Senhor. Elas não são rituais vazios, mas sinais visíveis do Evangelho invisível — o batismo proclama a morte e ressurreição de Cristo aplicadas ao crente, e a Ceia proclama sua morte 'até que ele venha' (1 Co 11:26).",
            "A terceira marca, mais discreta, mas igualmente essencial, é o exercício amoroso da disciplina eclesiástica — o cuidado ativo da igreja com a santidade e a restauração de seus membros, quando necessário. Uma igreja que nunca corrige com amor não está sendo gentil; está sendo negligente com almas que ama.",
          ],
          verses: [
            {
              ref: "Atos 2:42",
              textByVersion: {
                NVI: "Eles se dedicavam ao ensino dos apóstolos e à comunhão, ao partir do pão e às orações.",
                ACF: "E perseveravam na doutrina dos apóstolos, e na comunhão, e no partir do pão, e nas orações.",
              },
              originals: [
                { word: "προσκαρτεροῦντες", translit: "proskarterountes", meaning: "perseverando com firmeza e constância, dedicando-se de forma continuada", lang: "grego" },
              ],
            },
            {
              ref: "Mateus 18:15-17",
              textByVersion: {
                NVI: "Se seu irmão pecar contra você, vá e, a sós com ele, mostre-lhe a sua falha. Se ele o ouvir, você ganhou seu irmão.",
              },
            },
          ],
          keywords: [
            { word: "διδαχή", translit: "didachē", meaning: "ensino, doutrina — o corpo de verdades transmitido pelos apóstolos e fielmente pregado na igreja", lang: "grego" },
            { word: "κοινωνία", translit: "koinōnia", meaning: "comunhão, participação em comum — vida partilhada, não apenas contato social superficial", lang: "grego" },
          ],
          deepDive:
            "Atos 2:42 descreve quatro práticas simultâneas e inseparáveis da igreja primitiva: doutrina, comunhão, o partir do pão (a Ceia) e orações. O verbo grego proskarterountes, no tempo imperfeito, descreve uma dedicação contínua, não esporádica — a igreja de Jerusalém não visitava essas práticas de vez em quando; vivia nelas como estilo de vida. Já em Mateus 18, Jesus estabelece um processo gradual e restaurador para a disciplina: conversa privada, depois com testemunhas, depois diante da igreja — sempre visando o arrependimento e a restauração do irmão, nunca a humilhação pública como primeiro passo. Sobre exatamente como cada igreja aplica esse processo em sua estrutura de governo (batista congregacional, presbiteriano, episcopal), cristãos fiéis de diferentes tradições organizam-se de formas distintas; isso é uma questão secundária, e o essencial é que toda igreja pratique, de algum modo fiel, o cuidado mútuo que Cristo ordenou.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Uma igreja sem doutrina sólida é como um corpo sem esqueleto: pode até se mover por algum tempo, mas não tem como ficar em pé quando a tempestade vier.",
          },
          quizzes: [
            {
              question: "Quais são as quatro práticas que a igreja primitiva mantinha continuamente, segundo Atos 2:42?",
              options: [
                "Jejum, música, evangelismo e caridade",
                "Doutrina apostólica, comunhão, partir do pão e orações",
                "Liderança, organização, finanças e eventos",
                "Profecia, línguas, cura e milagres",
              ],
              correctIndex: 1,
              explanation: "Atos 2:42 lista essas quatro práticas como o padrão contínuo e dedicado da igreja recém-nascida.",
            },
            {
              question: "Qual é o objetivo do processo de disciplina descrito em Mateus 18:15-17?",
              options: [
                "Humilhar publicamente quem pecou, como exemplo aos demais",
                "Expulsar imediatamente qualquer membro que erre",
                "Buscar, de forma gradual e amorosa, o arrependimento e a restauração do irmão",
                "Evitar qualquer confronto, preservando a harmonia a qualquer custo",
              ],
              correctIndex: 2,
              explanation: "Jesus estabelece um processo gradual — privado, depois com testemunhas, depois com a igreja — sempre visando restauração.",
            },
          ],
          application:
            "Avalie sua própria igreja (ou a igreja que você está buscando) à luz dessas marcas: há pregação fiel da Palavra? As ordenanças são praticadas com o devido cuidado? Existe cuidado mútuo real entre os membros? Converse com um líder sobre como você pode se engajar mais nessas práticas.",
          prayer:
            "Pai, obrigado pela igreja que edificaste através dos séculos sobre o fundamento da tua Palavra. Ajuda-me a valorizar o ensino fiel, a participar de coração das ordenanças que Cristo instituiu, e a receber com humildade o cuidado e, quando necessário, a correção dos meus irmãos. Faz da minha igreja um lugar onde a tua verdade e o teu amor andam sempre juntos. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia Atos 2:42-47 inteiro e escreva, num caderno ou no seu diário do app, três diferenças concretas entre a vida da igreja de Jerusalém e a sua própria experiência de igreja hoje. Ore pedindo a Deus para crescer em pelo menos uma dessas áreas.",
          reflectionQuestion:
            "Das quatro marcas de Atos 2:42 (doutrina, comunhão, ordenanças, oração), qual delas você mais tem negligenciado na sua vida cristã — e o que pode fazer, de forma prática, para mudar isso nesta semana?",
          xp: 25,
        },
      ],
    },
    {
      id: "il-mod-2",
      title: "Módulo II: Vida em Comunidade",
      lessons: [
        {
          id: "il-2-1",
          title: "Membresia: Um Compromisso Bíblico",
          intro: [
            "'Preciso mesmo ser membro formal de uma igreja? Não basta amar a Jesus e frequentar os cultos quando posso?' Essa pergunta é comum, especialmente numa cultura que valoriza a autonomia individual acima de quase tudo. Mas a Bíblia descreve a vida cristã de um jeito diferente: você não foi salvo para flutuar livremente entre comunidades, sem compromisso real com nenhuma delas — foi salvo para pertencer.",
            "Embora a palavra 'membresia' não apareça literalmente no Novo Testamento, o conceito está por toda parte: os cristãos sabiam a quais 'rebanhos' pertenciam (At 20:28), os líderes prestavam contas por pessoas específicas que lhes foram confiadas (Hb 13:17), e a disciplina eclesiástica só faz sentido se existe um grupo definido de pessoas que pertencem àquela igreja e podem, em última instância, ser dela removidas (1 Co 5:1-13).",
            "Comprometer-se formalmente com uma igreja local não é burocracia religiosa; é um ato de humildade e amor. É dizer, na prática: 'Eu me submeto ao cuidado pastoral desta comunidade, e me comprometo a servir, orar e crescer com estas pessoas específicas, e não apenas com cristãos em geral, de forma abstrata.'",
            "Isso protege tanto você quanto a igreja. Protege você, porque ninguém cresce espiritualmente sozinho, sem prestar contas a ninguém. E protege a igreja, porque líderes só conseguem cuidar de verdade das ovelhas que sabem, com clareza, que são suas.",
          ],
          verses: [
            {
              ref: "Hebreus 13:17",
              textByVersion: {
                NVI: "Obedeçam a seus líderes e submetam-se à sua autoridade. Eles cuidam de vocês como quem tem que prestar contas.",
                ACF: "Obedecei a vossos pastores, e sujeitai-vos a eles; porque velam por vossas almas, como aqueles que hão de dar conta delas.",
              },
              originals: [
                { word: "ἀγρυπνοῦσιν", translit: "agrypnousin", meaning: "vigiam, permanecem acordados vigilantemente — cuidado ativo e atento pelos que lhes foram confiados", lang: "grego" },
              ],
            },
            {
              ref: "Atos 20:28",
              textByVersion: {
                NVI: "Cuidem de vocês mesmos e de todo o rebanho sobre o qual o Espírito Santo os designou bispos, para pastorearem a igreja de Deus, a qual ele comprou com seu próprio sangue.",
              },
            },
          ],
          keywords: [
            { word: "ποίμνιον", translit: "poimnion", meaning: "rebanho — grupo específico de ovelhas sob o cuidado de um pastor determinado, não um conceito abstrato", lang: "grego" },
            { word: "ἀγρυπνέω", translit: "agrypneō", meaning: "vigiar sem dormir, cuidar com atenção contínua e responsável", lang: "grego" },
          ],
          deepDive:
            "Hebreus 13:17 pressupõe uma relação concreta e identificável entre líderes e membros: 'eles cuidam de vocês' — não de cristãos em geral, mas de pessoas específicas pelas quais 'hão de dar conta'. Isso só é possível quando existe clareza sobre quem pertence a qual igreja. Sobre a forma exata de organizar essa membresia (registro formal, votação da igreja, entrevista pastoral etc.), cada tradição batista e evangélica desenvolveu práticas próprias — isso é uma questão secundária de ordem prática. O que é essencial, e não secundário, é o princípio: cristãos são chamados a se comprometer visivelmente com uma comunidade local específica, submetendo-se ao seu cuidado pastoral e contribuindo ativamente para sua vida.",
          theologianQuote: {
            author: "Thom Rainer",
            text: "Membresia de igreja não é sobre o que a igreja pode fazer por você; é sobre o compromisso mútuo de pertencer, servir e ser servido dentro de uma comunidade específica de fé.",
          },
          quizzes: [
            {
              question: "Segundo Hebreus 13:17, por que os líderes da igreja 'velam' pelas almas dos membros?",
              options: [
                "Porque isso lhes dá poder e prestígio",
                "Porque terão que prestar contas a Deus por essas pessoas específicas",
                "Apenas por tradição religiosa, sem base bíblica",
                "Porque a lei civil exige isso das igrejas",
              ],
              correctIndex: 1,
              explanation: "O texto liga o cuidado pastoral à prestação de contas — líderes cuidam de pessoas específicas, não de uma multidão anônima.",
            },
            {
              question: "O que a lição afirma sobre a palavra 'membresia' no Novo Testamento?",
              options: [
                "A palavra aparece literalmente em vários textos do Novo Testamento",
                "O termo exato não aparece, mas o conceito de pertencimento comprometido está presente",
                "É um conceito puramente moderno, sem base bíblica alguma",
                "Só se aplica a igrejas de estrutura episcopal",
              ],
              correctIndex: 1,
              explanation: "Embora a palavra não conste literalmente, textos como At 20:28 e Hb 13:17 pressupõem um pertencimento definido e comprometido.",
            },
          ],
          application:
            "Se você frequenta uma igreja há algum tempo mas nunca se tornou membro formal, converse esta semana com um pastor ou líder sobre os próximos passos. Se já é membro, pergunte-se: você tem vivido esse compromisso de forma ativa, ou apenas presencial?",
          prayer:
            "Senhor, perdoa-me pelas vezes em que tratei minha relação com a igreja como algo casual, sem compromisso real. Ensina-me a me submeter com humildade ao cuidado pastoral que colocaste sobre mim, e a assumir, com seriedade e alegria, meu lugar dentro de uma comunidade específica de fé. Usa-me para o bem dessa igreja, assim como ela é usada por ti para o meu bem. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva o nome do(s) líder(es) espiritual(is) que Deus colocou sobre sua vida. Ore por eles nomeadamente todos os dias desta semana, e, se possível, envie uma mensagem de encorajamento a um deles.",
          reflectionQuestion:
            "Como sua vida mudaria se você levasse tão a sério o compromisso com sua igreja local quanto leva outros compromissos importantes da sua vida (trabalho, estudos, família)?",
          xp: 28,
        },
        {
          id: "il-2-2",
          title: "Cada Membro, Uma Função: Dons e Serviço",
          intro: [
            "Uma armadilha comum na vida da igreja é o 'cristianismo de espectador': algumas pessoas servem e ensinam ativamente, enquanto a maioria assiste, avalia e, no máximo, aplaude. A Bíblia descreve algo radicalmente diferente. Cada crente recebeu do Espírito Santo pelo menos um dom para o bem comum — não como privilégio de poucos, mas como responsabilidade de todos.",
            "Paulo é explícito: 'a manifestação do Espírito é dada a cada um' (1 Co 12:7). Não há cristão sem dom nenhum, e não há dom dado apenas para benefício próprio. O propósito declarado é sempre 'o bem comum' — a edificação de toda a igreja, não a promoção pessoal de quem exerce o dom.",
            "Efésios 4 mostra o objetivo final desse arranjo: líderes (apóstolos, profetas, evangelistas, pastores e mestres) não existem para fazer todo o trabalho ministerial sozinhos, mas para 'preparar os santos para a obra do ministério'. Em outras palavras, o papel dos líderes é equipar a igreja inteira para servir — não substituir esse serviço.",
            "Isso muda a pergunta que você deveria fazer sobre sua igreja. Não é apenas 'o que recebo aqui?', mas 'como Deus me capacitou a servir aqui?'. Descobrir e exercer seu dom não é opcional para uma vida cristã madura — é parte essencial de viver como membro funcional do corpo de Cristo.",
          ],
          verses: [
            {
              ref: "1 Coríntios 12:7",
              textByVersion: {
                NVI: "A cada um, porém, é dada a manifestação do Espírito, visando ao bem comum.",
                ACF: "Mas a cada um é dada a manifestação do Espírito para o que for útil.",
              },
              originals: [
                { word: "χάρισμα", translit: "charisma", meaning: "dom, capacidade dada gratuitamente pela graça de Deus para o serviço da igreja", lang: "grego" },
              ],
            },
            {
              ref: "Efésios 4:11-12",
              textByVersion: {
                NVI: "Foi ele quem concedeu... com o fim de preparar os santos para a obra do ministério, para que o corpo de Cristo seja edificado.",
              },
            },
          ],
          keywords: [
            { word: "χάρισμα", translit: "charisma", meaning: "dom espiritual — capacidade concedida pela graça, não conquistada por mérito, para servir a igreja", lang: "grego" },
            { word: "καταρτισμός", translit: "katartismos", meaning: "preparo, equipagem — o ato de aparelhar plenamente alguém para uma tarefa", lang: "grego" },
          ],
          deepDive:
            "Sobre a natureza e a duração de certos dons específicos mencionados no Novo Testamento (como línguas e profecia), há divergência legítima entre cristãos fiéis. Esta trilha segue a perspectiva cessacionista moderada: entende que as línguas descritas no livro de Atos eram idiomas humanos reais, dados para a proclamação do Evangelho em contextos multilíngues, e que a revelação normativa e apostólica foi encerrada com o fechamento do cânon bíblico — de modo que nenhuma experiência espiritual contemporânea possui autoridade equivalente às Escrituras. Irmãos de tradições continuístas entendem esses dons de forma diferente, com honestidade e zelo pela Palavra também. Independentemente dessa questão secundária, o que é central e inegociável em 1 Coríntios 12 e Efésios 4 permanece: todo crente recebeu alguma capacidade do Espírito para servir, e negligenciar esse serviço empobrece toda a igreja.",
          theologianQuote: {
            author: "Wayne Grudem",
            text: "Deus distribuiu os dons espirituais de tal forma que nenhum crente pode dizer 'não tenho nada a oferecer', e nenhuma igreja pode dizer 'não precisamos mais de ninguém'.",
          },
          quizzes: [
            {
              question: "Segundo 1 Coríntios 12:7, qual é o propósito declarado da manifestação do Espírito em cada crente?",
              options: [
                "O crescimento espiritual individual, isolado dos demais",
                "O bem comum — a edificação de toda a igreja",
                "Comprovar a superioridade espiritual de quem recebe o dom",
                "Substituir a necessidade da pregação da Palavra",
              ],
              correctIndex: 1,
              explanation: "O texto é claro: os dons são dados 'visando ao bem comum', não à promoção pessoal.",
            },
            {
              question: "Qual é o papel dos líderes segundo Efésios 4:11-12?",
              options: [
                "Fazer sozinhos toda a obra do ministério, dispensando os demais membros",
                "Preparar e equipar os santos para que eles próprios exerçam o ministério",
                "Concentrar autoridade espiritual, evitando delegar responsabilidades",
                "Substituir o exercício dos dons pelos demais membros da igreja",
              ],
              correctIndex: 1,
              explanation: "Líderes existem para equipar a igreja para o serviço, não para monopolizar o ministério.",
            },
            {
              question: "Qual é a posição adotada nesta trilha sobre os dons de línguas e profecia hoje?",
              options: [
                "Cessacionismo moderado: as línguas do NT eram idiomas humanos e a revelação normativa se encerrou com o cânon",
                "Continuísmo pleno, sem qualquer distinção da era apostólica",
                "Rejeição total de que qualquer dom espiritual exista hoje",
                "Silêncio absoluto sobre o tema, sem posicionamento algum",
              ],
              correctIndex: 0,
              explanation: "A trilha adota, de forma respeitosa às demais posições, a perspectiva cessacionista moderada.",
            },
          ],
          application:
            "Se você ainda não sabe qual é o seu dom espiritual, converse com seu pastor ou discipulador esta semana e ofereça-se para servir em uma área prática da igreja (acolhimento, ensino, música, intercessão, ação social). Comece a servir mesmo antes de ter certeza total do seu dom — ele frequentemente se revela no próprio exercício do serviço.",
          prayer:
            "Espírito Santo, obrigado por me capacitares com dons para servir a tua igreja. Perdoa-me pelas vezes em que fiquei na plateia, observando outros servirem, sem assumir minha própria responsabilidade. Revela-me como me capacitaste, e dá-me coragem e humildade para exercer isso para o bem comum, e não para minha própria promoção. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Ofereça-se voluntariamente para uma tarefa prática na sua igreja nesta semana — mesmo pequena. Observe como esse ato de serviço afeta seu senso de pertencimento à comunidade.",
          reflectionQuestion:
            "Você tem vivido como espectador ou como membro funcional do corpo de Cristo? Que dom ou capacidade Deus pode já ter colocado em você, esperando apenas que você o exerça com fé?",
          xp: 28,
        },
      ],
    },
  ],
};

const familiaCrista: Trail = {
  id: "familia-crista",
  title: "Família Cristã",
  description: "Casamento, filhos e casa segundo a Bíblia.",
  icon: "Home",
  color: "from-amber-500 to-yellow-600",
  order: 8,
  modules: [
    {
      id: "fc-mod-1",
      title: "Módulo I: O Design de Deus para o Casamento",
      lessons: [
        {
          id: "fc-1-1",
          title: "Casamento: Aliança e Retrato do Evangelho",
          intro: [
            "Antes de ser uma instituição social, uma cerimônia ou um contrato legal, o casamento é uma ideia de Deus. Em Gênesis 2, antes mesmo da queda, antes do pecado entrar no mundo, Deus já havia estabelecido o padrão: um homem e uma mulher unidos numa aliança de vida inteira, tornando-se 'uma só carne'. O casamento não é invenção cultural nem acordo puramente humano — é desenho divino, dado como presente de bondade.",
            "A Bíblia descreve o casamento como aliança, não apenas como contrato. Um contrato troca serviços sob condições; uma aliança compromete pessoas inteiras, incondicionalmente, diante de Deus como testemunha (Ml 2:14). Isso explica por que o casamento pede permanência: não é uma parceria que dura enquanto for conveniente, mas um compromisso que persevera mesmo quando é difícil.",
            "Efésios 5 revela o propósito mais profundo dessa aliança: o casamento humano existe, em última análise, para retratar a relação entre Cristo e a igreja. O amor sacrificial do marido reflete o amor de Cristo, que se entregou por sua noiva; a resposta amorosa e confiante da esposa reflete a resposta da igreja a esse amor. Casar-se cristãmente, portanto, é participar de uma pregação viva do Evangelho, todos os dias, diante de quem observa.",
            "Isso muda completamente a pergunta com que muitos entram no casamento. Não é apenas 'esta pessoa vai me fazer feliz?', mas 'como esta união pode glorificar a Deus e mostrar ao mundo, de forma visível, como é o amor de Cristo pela sua igreja?'.",
          ],
          verses: [
            {
              ref: "Gênesis 2:24",
              textByVersion: {
                NVI: "Por essa razão, o homem deixará pai e mãe e se unirá à sua mulher, e eles se tornarão uma só carne.",
                ACF: "Portanto deixará o varão a seu pai e a sua mãe, e apegar-se-á à sua mulher, e serão ambos uma carne.",
              },
              originals: [
                { word: "בָּשָׂר אֶחָד", translit: "basar echad", meaning: "uma só carne — unidade profunda e indivisível, física, emocional e espiritual", lang: "hebraico" },
              ],
            },
            {
              ref: "Efésios 5:25",
              textByVersion: {
                NVI: "Maridos, ame cada um a sua mulher, assim como Cristo amou a igreja e entregou-se por ela.",
                ACF: "Vós, maridos, amai vossas mulheres, como também Cristo amou a igreja, e a si mesmo se entregou por ela.",
              },
              originals: [
                { word: "ἀγαπάω", translit: "agapaō", meaning: "amar de forma sacrificial e determinada, buscando o bem do outro independente de sentimento ou merecimento", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "בָּשָׂר אֶחָד", translit: "basar echad", meaning: "'uma só carne' — a unidade total pretendida por Deus para o casal", lang: "hebraico" },
            { word: "ἀγαπάω", translit: "agapaō", meaning: "amor de escolha e entrega, o mesmo tipo de amor com que Cristo amou a igreja", lang: "grego" },
            { word: "μυστήριον", translit: "mystērion", meaning: "mistério — verdade antes oculta, agora revelada: o casamento retrata Cristo e a igreja (Ef 5:32)", lang: "grego" },
          ],
          deepDive:
            "Note a ordem em Gênesis 2:24: o homem 'deixa' (rompe um vínculo de dependência anterior) e 'se une' (cria um novo vínculo primário) para então se tornarem 'uma só carne'. Deixar, unir e tornar-se uma só carne não são passos automáticos nem meramente emocionais — envolvem decisão pública, compromisso de aliança e, depois, um processo contínuo de vida compartilhada. Em Efésios 5:32, Paulo chama essa dinâmica de 'mistério': o casamento humano sempre apontou, mesmo sem que os primeiros casais soubessem plenamente, para a união entre Cristo e sua igreja. Isso não torna o casamento humano menos real ou menos terreno — mas lhe dá um peso espiritual que nenhuma outra relação humana carrega da mesma forma.",
          theologianQuote: {
            author: "Tim Keller",
            text: "O casamento não é primariamente sobre encontrar a pessoa certa, mas sobre se tornar, com a ajuda de Deus, o tipo de pessoa que ama como Cristo amou — sacrificialmente, fielmente, até o fim.",
          },
          quizzes: [
            {
              question: "Segundo Gênesis 2:24, o que caracteriza a união conjugal desde a criação?",
              options: [
                "Um contrato temporário, sujeito a renegociação constante",
                "Uma aliança de vida inteira, tornando o casal 'uma só carne'",
                "Uma tradição cultural sem fundamento divino",
                "Um arranjo puramente social, sem propósito espiritual",
              ],
              correctIndex: 1,
              explanation: "O texto descreve deixar, unir-se e tornar-se uma só carne como o padrão divino estabelecido antes mesmo da queda.",
            },
            {
              question: "Qual é o propósito mais profundo do casamento revelado em Efésios 5?",
              options: [
                "Garantir estabilidade econômica e social para o casal",
                "Retratar visivelmente o amor de Cristo pela igreja",
                "Servir apenas como meio de procriação",
                "Ser uma instituição meramente civil, sem significado espiritual",
              ],
              correctIndex: 1,
              explanation: "Paulo chama esse propósito de 'mistério': o casamento humano aponta para a relação entre Cristo e sua igreja.",
            },
          ],
          application:
            "Se você é casado, escreva uma forma concreta em que pode amar seu cônjuge esta semana à maneira de Efésios 5:25 — de modo sacrificial, buscando o bem dele(a) mais do que sua própria conveniência. Se você não é casado, reflita sobre que expectativas sua cultura moldou em você a respeito do casamento, e compare-as com o padrão bíblico.",
          prayer:
            "Pai celestial, obrigado por teres desenhado o casamento como retrato do teu amor por nós. Ensina-me a amar como Cristo amou — sacrificialmente, fielmente, sem condições. Onde há orgulho ou egoísmo no meu jeito de amar, purifica-me. Faz do meu casamento (ou da minha futura vida conjugal) uma pregação viva do teu Evangelho a todos que observam. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia Efésios 5:21-33 inteiro nesta semana, em mais de uma versão da Bíblia (use o seletor de versões do app), e anote uma verdade que você nunca havia notado antes sobre o desenho de Deus para o casamento.",
          reflectionQuestion:
            "De que forma sua vida conjugal (atual ou futura) pode se tornar um testemunho visível do amor de Cristo pela igreja, diante das pessoas que observam de fora?",
          xp: 25,
        },
        {
          id: "fc-1-2",
          title: "Amor e Liderança Servidora no Lar",
          intro: [
            "Poucos textos bíblicos são tão mal compreendidos, e às vezes mal aplicados, quanto Efésios 5:21-33. De um lado, alguns o usam para justificar autoritarismo masculino; de outro, muitos o rejeitam sem lê-lo com atenção ao contexto. Mas o texto, lido inteiro, revela um padrão muito mais bonito e muito mais exigente do que qualquer um desses extremos.",
            "O capítulo começa com um princípio que envolve todos os cristãos, antes de falar especificamente de maridos e esposas: 'sujeitando-vos uns aos outros no temor de Cristo' (v.21). A submissão mútua é o solo onde crescem as instruções específicas que seguem — o texto não descreve uma hierarquia de valor entre homem e mulher (ambos são igualmente imagem de Deus e igualmente herdeiros da graça, 1 Pe 3:7), mas uma diferença de papel funcional dentro da aliança conjugal.",
            "À esposa, Paulo pede que se submeta ao marido 'como ao Senhor' — não porque ele seja superior, mas como reflexo da submissão confiante da igreja a Cristo. Ao marido, Paulo pede algo, à sua maneira, ainda mais exigente: amar a esposa 'como Cristo amou a igreja e entregou-se por ela'. Não é pedido a ele que domine, mas que sirva a ponto de dar a própria vida.",
            "Quando esses dois chamados são vividos de verdade — liderança que se sacrifica e submissão que confia — o resultado não é opressão, mas um lar onde ambos florescem, cada um exercendo, com alegria, o papel que Deus desenhou para ele.",
          ],
          verses: [
            {
              ref: "Efésios 5:21",
              textByVersion: {
                NVI: "Sujeitem-se uns aos outros, por temor a Cristo.",
                ACF: "Sujeitando-vos uns aos outros no temor de Deus.",
              },
              originals: [
                { word: "ὑποτασσόμενοι", translit: "hypotassomenoi", meaning: "sujeitando-se voluntariamente, colocando-se sob ordem por amor e reverência, não por coação", lang: "grego" },
              ],
            },
            {
              ref: "1 Pedro 3:7",
              textByVersion: {
                NVI: "Maridos... tratem-nas com honra, como coerdeiras do dom da graça da vida.",
              },
            },
          ],
          keywords: [
            { word: "ὑποτάσσω", translit: "hypotassō", meaning: "submeter-se, colocar-se sob ordem — na voz média, ato voluntário, não imposição externa", lang: "grego" },
            { word: "κεφαλή", translit: "kephalē", meaning: "cabeça — no contexto de Efésios 5, liderança entendida à luz do modelo de Cristo: sacrifício e cuidado, não dominação", lang: "grego" },
          ],
          deepDive:
            "É importante notar que a submissão pedida à esposa em Efésios 5:22 está gramaticalmente ligada ao verbo do versículo 21 ('sujeitando-vos uns aos outros') — não é um mandamento isolado e unilateral, mas uma aplicação específica de um princípio que já envolve todos os cristãos entre si. Ao mesmo tempo, o texto claramente distingue papéis: à esposa cabe uma submissão de confiança ao marido; ao marido cabe uma liderança de sacrifício pela esposa, segundo o padrão de Cristo. Sobre como esse padrão se aplica em decisões práticas do dia a dia do casal, cristãos fiéis de diferentes tradições e culturas aplicam de formas distintas — mas o essencial, que não é negociável, é que a liderança do marido nunca deve se parecer com dominação egoísta, e a submissão da esposa nunca deve ser extraída pela força ou pelo medo. Onde há abuso, físico, emocional ou espiritual, a igreja local deve ser buscada com urgência para proteção e cuidado.",
          theologianQuote: {
            author: "John Stott",
            text: "A liderança que Efésios 5 pede ao marido não é a liderança de um chefe sobre empregados, mas a liderança de Cristo sobre a igreja: uma liderança que se derrama, que serve, que morre por quem ama.",
          },
          quizzes: [
            {
              question: "Segundo Efésios 5:21, qual princípio antecede e enquadra as instruções específicas para maridos e esposas?",
              options: [
                "A superioridade natural do homem sobre a mulher",
                "A submissão mútua entre todos os cristãos, por reverência a Cristo",
                "A total independência entre marido e esposa",
                "A ausência de qualquer papel diferenciado no casamento",
              ],
              correctIndex: 1,
              explanation: "O versículo 21 estabelece a submissão mútua como base para tudo o que segue no capítulo.",
            },
            {
              question: "Como Efésios 5 descreve o padrão de liderança esperado do marido?",
              options: [
                "Como dominação e controle sobre a esposa",
                "Como amor sacrificial, a exemplo de Cristo, que se entregou pela igreja",
                "Como ausência total de responsabilidade ou iniciativa",
                "Como autoridade baseada em superioridade intelectual ou física",
              ],
              correctIndex: 1,
              explanation: "O texto chama o marido a amar 'como Cristo amou a igreja e entregou-se por ela' — sacrifício, não dominação.",
            },
          ],
          application:
            "Se você é casado, pergunte hoje ao seu cônjuge: 'Como posso amar você melhor esta semana, à maneira de Cristo?' — e realmente pratique a resposta. Se você não é casado, observe casamentos ao seu redor e identifique um exemplo vivo de liderança servidora ou submissão confiante que você admira.",
          prayer:
            "Senhor, dá-me um coração que se sujeita a ti e, no contexto certo, aos meus irmãos e à minha família, não por medo, mas por amor e confiança. Onde sou chamado a liderar, ensina-me a liderar servindo e me entregando, como Cristo fez pela igreja. Protege os lares da minha igreja de qualquer forma de abuso ou dominação que desonre o teu nome. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Faça um gesto concreto e visível de serviço sacrificial ao seu cônjuge (ou, se solteiro, a um familiar próximo) nesta semana — algo que custe tempo ou conforto, feito com alegria e sem cobrança de reciprocidade.",
          reflectionQuestion:
            "O que mudaria nos seus relacionamentos mais próximos se você levasse a sério o chamado de Efésios 5:21 — 'sujeitando-vos uns aos outros por temor a Cristo' — antes de pensar em quaisquer papéis específicos?",
          xp: 28,
        },
      ],
    },
    {
      id: "fc-mod-2",
      title: "Módulo II: Filhos e o Altar Doméstico",
      lessons: [
        {
          id: "fc-2-1",
          title: "Educando os Filhos no Senhor",
          intro: [
            "Nenhum manual de criação de filhos garante resultados automáticos — nem mesmo a Bíblia promete isso de forma mecânica (Pv 22:6 é um princípio geral de sabedoria, não uma fórmula infalível). Mas a Escritura dá aos pais cristãos algo mais valioso que uma fórmula: um propósito claro e um método consistente com o caráter de Deus para a tarefa de criar filhos.",
            "Efésios 6:4 resume esse chamado numa única frase densa: pais (o texto se dirige especialmente aos pais, sem excluir a responsabilidade compartilhada das mães) não devem provocar seus filhos à ira, mas criá-los 'na disciplina e admoestação do Senhor'. Duas palavras carregam esse mandamento: disciplina, que envolve formação de caráter através de correção amorosa e consistente; e admoestação, que envolve instrução verbal, ensino ativo e intencional da Palavra de Deus.",
            "Note a advertência que vem primeiro: 'não provoquem seus filhos à ira'. Criar filhos segundo a Bíblia não é sinônimo de rigidez excessiva, humilhação ou autoritarismo sem afeto. Pais que exasperam seus filhos com exigências desproporcionais, favoritismo ou dureza desnecessária desobedecem tanto quanto pais que são permissivos demais.",
            "O objetivo final não é produzir filhos bem-comportados por si só, mas filhos que conheçam e amem o Senhor. Comportamento sem coração transformado é apenas verniz religioso; o alvo bíblico é formar, com paciência e ao longo de anos, um coração que responde ao Evangelho.",
          ],
          verses: [
            {
              ref: "Efésios 6:4",
              textByVersion: {
                NVI: "Pais, não irritem seus filhos; antes, criem-nos segundo a disciplina e o conselho do Senhor.",
                ACF: "E vós, pais, não provoqueis à ira a vossos filhos, mas criai-os na doutrina e admoestação do Senhor.",
              },
              originals: [
                { word: "παιδεία", translit: "paideia", meaning: "disciplina, formação de caráter — educação abrangente que molda toda a pessoa, não apenas correção pontual", lang: "grego" },
                { word: "νουθεσία", translit: "nouthesia", meaning: "admoestação, instrução com propósito — ensino verbal intencional que aponta para a mente e o coração", lang: "grego" },
              ],
            },
            {
              ref: "Deuteronômio 6:6-7",
              textByVersion: {
                NVI: "Estas palavras que hoje lhe ordeno estarão em seu coração. Ensine-as com persistência a seus filhos.",
              },
            },
          ],
          keywords: [
            { word: "παιδεία", translit: "paideia", meaning: "formação de caráter através de disciplina consistente e amorosa", lang: "grego" },
            { word: "נוּ֙חַ", translit: "nouthesia (grego, cf. hebr. musar)", meaning: "instrução que corrige e direciona a mente e o coração para a sabedoria de Deus", lang: "grego" },
          ],
          deepDive:
            "Deuteronômio 6:6-7 estabelece o padrão veterotestamentário que Efésios 6:4 assume e aprofunda: a formação espiritual dos filhos não é tarefa isolada em horários específicos ('hora do culto em casa'), mas um estilo de vida contínuo — 'quando estiver sentado em casa, quando andar pelo caminho, quando se deitar e quando se levantar'. Isso não significa sermões constantes, mas uma vida em que a fé é natural, visível e conversada em meio às atividades comuns do dia. Sobre métodos específicos de disciplina (formas concretas de correção, limites, consequências), a Bíblia dá princípios de caráter — amor, consistência, ausência de ira descontrolada, propósito redentivo — mais do que uma técnica única aplicável a toda criança e toda cultura; pais sábios buscam conselho pastoral e, quando necessário, profissional, para aplicar esses princípios com sabedoria à realidade específica de cada filho.",
          theologianQuote: {
            author: "David Merkh",
            text: "Criar filhos segundo o Evangelho não é produzir comportamento perfeito, mas modelar, diariamente, a mesma graça que recebemos de Deus — disciplina com amor, verdade com paciência, correção com esperança.",
          },
          quizzes: [
            {
              question: "Segundo Efésios 6:4, qual advertência vem antes do mandamento de disciplinar os filhos?",
              options: [
                "Que os pais devem ser rígidos e exigentes acima de tudo",
                "Que os pais não devem provocar seus filhos à ira",
                "Que a disciplina deve ser aplicada apenas pela mãe",
                "Que os filhos devem ser tratados como adultos desde cedo",
              ],
              correctIndex: 1,
              explanation: "O texto começa com um alerta contra o exasperar dos filhos, antes de descrever o modelo positivo de criação.",
            },
            {
              question: "O que significa 'criar os filhos na disciplina e admoestação do Senhor'?",
              options: [
                "Apenas impor regras rígidas, sem explicação",
                "Formar caráter (disciplina) e instruir ativamente na Palavra (admoestação)",
                "Deixar que os filhos decidam por si mesmos, sem qualquer direção",
                "Delegar toda a educação espiritual à igreja"
              ],
              correctIndex: 1,
              explanation: "As duas palavras gregas combinam formação de caráter com instrução intencional na verdade de Deus.",
            },
          ],
          application:
            "Se você é pai ou mãe, escolha esta semana um momento comum do dia (refeição, trajeto, hora de dormir) para conversar naturalmente sobre algo da fé com seu(s) filho(s), seguindo o padrão de Deuteronômio 6. Se ainda não é pai ou mãe, ore por famílias da sua igreja que estão nessa etapa da vida.",
          prayer:
            "Pai, obrigado pelo privilégio e pela responsabilidade de formar a próxima geração na fé. Perdoa-me pelas vezes em que exasperei ou negligenciei quem colocaste sob meus cuidados. Dá-me sabedoria para disciplinar com amor e para ensinar com naturalidade, para que meus filhos (ou os filhos da minha igreja) conheçam e amem a ti, não apenas se comportem bem. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia Deuteronômio 6:4-9 com sua família (ou, se não tiver filhos, com alguém que você discipula) e converse sobre uma forma prática de tornar a fé mais presente nas conversas cotidianas dessa casa.",
          reflectionQuestion:
            "Sua forma de educar (seus filhos, ou aqueles que você influencia) tem sido mais marcada por regras sem relacionamento, ou por disciplina e instrução vividas dentro de um vínculo de amor e paciência?",
          xp: 28,
        },
        {
          id: "fc-2-2",
          title: "O Altar Doméstico: Fé Vivida em Casa",
          intro: [
            "Ao longo da história da igreja, muitas famílias cristãs mantiveram uma prática simples, mas poderosa: o chamado 'altar doméstico' ou 'culto doméstico' — um momento regular, dentro de casa, dedicado à leitura da Palavra, à oração e ao louvor em família. Não é um mandamento explícito e detalhado no Novo Testamento, mas é uma aplicação natural e sábia de princípios bíblicos claros sobre a transmissão da fé no lar.",
            "Josué, ao final de sua vida, declarou publicamente: 'eu e a minha casa serviremos ao Senhor' (Js 24:15). Essa frase, tão citada, descreve mais do que uma decisão individual — descreve uma liderança espiritual assumida e visível dentro do próprio lar, algo que cada geração de pais é chamada a renovar.",
            "O altar doméstico não precisa ser longo, formal ou perfeito. Pode ser tão simples quanto ler um trecho curto da Bíblia à mesa, orar juntos antes de dormir, ou cantar um hino simples com as crianças. O valor não está na sofisticação, mas na consistência — na mensagem silenciosa e poderosa que ele transmite: 'nesta casa, Deus é real, e o buscamos juntos, todos os dias'.",
            "Famílias que praticam isso constroem, sem perceber, uma herança espiritual que atravessa gerações. Salmo 78 descreve exatamente esse propósito: contar às gerações futuras 'os feitos gloriosos do Senhor' para que 'ponham no próprio Deus a sua confiança' (Sl 78:4,7). O altar doméstico é um dos meios mais simples e mais eficazes de fazer isso acontecer.",
          ],
          verses: [
            {
              ref: "Josué 24:15",
              textByVersion: {
                NVI: "Escolham hoje a quem irão servir... Quanto a mim e à minha família, serviremos ao Senhor.",
                ACF: "Porém, se vos parece mal aos vossos olhos servir ao Senhor, escolhei hoje a quem sirvais... Mas eu e a minha casa serviremos ao Senhor.",
              },
            },
            {
              ref: "Salmo 78:4",
              textByVersion: {
                NVI: "Não os esconderemos de seus filhos; contaremos à próxima geração os louváveis feitos do Senhor.",
              },
              originals: [
                { word: "דּוֹר", translit: "dor", meaning: "geração — ênfase na continuidade da fé sendo transmitida de uma geração para a seguinte", lang: "hebraico" },
              ],
            },
          ],
          keywords: [
            { word: "בַּיִת", translit: "bayit", meaning: "casa, lar — em Josué 24:15, inclui toda a família sob a liderança espiritual assumida do pai/chefe da casa", lang: "hebraico" },
            { word: "דּוֹר", translit: "dor", meaning: "geração — a fé bíblica sempre pensa em termos de transmissão para as gerações seguintes", lang: "hebraico" },
          ],
          deepDive:
            "A declaração de Josué em 24:15 é pública e comunitária ('diante de todo o povo', v.1), não uma decisão privada e silenciosa. Isso ensina algo importante: a liderança espiritual no lar não precisa ser espetacular, mas deve ser visível e intencional — os filhos precisam ver, e não apenas presumir, que a fé dos pais é real e prioritária. Quanto à forma exata de estruturar um momento de altar doméstico (horário, duração, formato), a Bíblia não prescreve um modelo único; famílias cristãs de diferentes culturas e temperamentos adaptam essa prática de formas variadas, e isso é uma questão de sabedoria prática, não de doutrina essencial. O que permanece essencial é o princípio de Salmo 78: a fé bíblica nunca foi pensada para morrer com uma geração — ela é chamada a ser contada, cantada e vivida diante dos filhos, geração após geração.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Uma casa sem oração é uma casa sem telhado, exposta a todas as tempestades; que cada lar cristão tenha, ao menos, um pequeno altar onde a família se ajoelha e ergue os olhos para Deus.",
          },
          quizzes: [
            {
              question: "O que Josué 24:15 revela sobre a liderança espiritual no lar?",
              options: [
                "Que a fé deve permanecer uma decisão privada, nunca declarada abertamente",
                "Que Josué assumiu, de forma pública e clara, a liderança espiritual de sua casa",
                "Que apenas os sacerdotes eram responsáveis pela fé da família",
                "Que servir ao Senhor era irrelevante para a vida doméstica",
              ],
              correctIndex: 1,
              explanation: "Josué faz uma declaração pública e clara: ele e sua casa serviriam ao Senhor — liderança espiritual visível e assumida.",
            },
            {
              question: "Qual é o propósito descrito em Salmo 78:4 ao contar os feitos de Deus 'à próxima geração'?",
              options: [
                "Apenas preservar registros históricos por curiosidade",
                "Que a geração seguinte também ponha sua confiança em Deus",
                "Substituir a necessidade de ensino bíblico formal na igreja",
                "Garantir prestígio social para a família",
              ],
              correctIndex: 1,
              explanation: "O salmo é claro quanto ao objetivo: para que os filhos 'ponham no próprio Deus a sua confiança' (v.7).",
            },
          ],
          application:
            "Estabeleça (ou reforce) um momento simples de altar doméstico esta semana: um versículo lido em voz alta, uma oração breve em conjunto, um hino cantado juntos. Se você mora sozinho ou ainda não tem família própria, considere como pode criar esse mesmo tipo de momento com quem Deus colocou ao seu redor — colegas de casa, um grupo pequeno, ou parentes próximos.",
          prayer:
            "Senhor, assim como Josué, quero declarar diante de ti e dos meus: quanto a mim e à minha casa, serviremos ao Senhor. Ajuda-me a tornar isso visível, não apenas uma convicção privada. Dá-me consistência para contar aos que estão sob minha influência os teus feitos gloriosos, para que eles também ponham em ti a sua confiança, geração após geração. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Mantenha um pequeno momento de altar doméstico por sete dias seguidos, mesmo que dure apenas cinco minutos, e registre no seu diário do app o que Deus foi ensinando sua família (ou você mesmo) ao longo da semana.",
          reflectionQuestion:
            "Se seus filhos, familiares ou pessoas próximas só pudessem observar sua vida — sem ouvir uma palavra sua sobre fé — o que concluiriam sobre o lugar que Deus ocupa na sua casa?",
          xp: 30,
        },
      ],
    },
  ],
};

const missoes: Trail = {
  id: "missoes",
  title: "Missões",
  description: "O coração de Deus pelas nações.",
  icon: "Globe",
  color: "from-cyan-500 to-blue-600",
  order: 10,
  modules: [
    {
      id: "ms-mod-1",
      title: "Módulo I: O Coração de Deus pelas Nações",
      lessons: [
        {
          id: "ms-1-1",
          title: "A Missão de Deus na Bíblia Inteira",
          intro: [
            "Muitos cristãos pensam em 'missões' como um capítulo específico do Novo Testamento — algo que começa em Atos e se resume a enviar missionários para países distantes. Mas quando lemos a Bíblia como uma história única, do Gênesis ao Apocalipse, percebemos algo maior: a missão de Deus para alcançar as nações não é um apêndice da história bíblica; é o fio condutor de toda ela.",
            "Já em Gênesis 12, ao chamar Abrão, Deus declara o propósito de sua eleição: 'por meio de você, todos os povos da terra serão abençoados' (Gn 12:3). Israel não foi escolhido para se fechar em si mesmo, mas para ser, de início, canal de bênção para todas as famílias da terra. Essa promessa atravessa toda a Escritura — nos Salmos, que convocam as nações a louvar ao Senhor (Sl 67, 96); nos profetas, que anunciam um dia em que 'todas as nações' fluirão ao monte do Senhor (Is 2:2); e culmina no Apocalipse, onde uma multidão 'de toda tribo, língua, povo e nação' está diante do trono (Ap 7:9).",
            "Teólogos têm chamado esse fio condutor de missio Dei — a missão de Deus. Ela nos ensina algo humilde e libertador: missões não começam com o nosso esforço evangelístico, começam no próprio coração de Deus, que sempre teve as nações em vista. Nós não convidamos Deus a se importar com o mundo; Deus nos convida a participar de algo que ele já estava fazendo desde o princípio.",
            "Entender isso muda a motivação para o envolvimento missionário. Não é culpa, obrigação fria ou ativismo religioso — é participação alegre num plano que atravessa toda a história da redenção, do jardim do Éden até a nova criação, onde adoradores de todas as nações cercarão o trono de Deus para sempre.",
          ],
          verses: [
            {
              ref: "Gênesis 12:2-3",
              textByVersion: {
                NVI: "Farei de você um grande povo... e por meio de você todos os povos da terra serão abençoados.",
                ACF: "E far-te-ei uma grande nação... e em ti serão benditas todas as famílias da terra.",
              },
              originals: [
                { word: "מִשְׁפָּחָה", translit: "mishpachah", meaning: "família, clã — usada aqui para 'todas as famílias da terra', abrangendo toda a humanidade dividida em povos", lang: "hebraico" },
              ],
            },
            {
              ref: "Apocalipse 7:9",
              textByVersion: {
                NVI: "Diante do trono e do Cordeiro havia uma multidão que ninguém podia contar, de toda nação, tribo, povo e língua.",
              },
              originals: [
                { word: "ἔθνος", translit: "ethnos", meaning: "nação, povo, etnia — a visão final da redenção inclui explicitamente a diversidade de povos, não sua eliminação", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "מִשְׁפָּחָה", translit: "mishpachah", meaning: "família/povo — a promessa a Abraão abrange todos os povos da terra, não apenas Israel", lang: "hebraico" },
            { word: "ἔθνος", translit: "ethnos", meaning: "nação — termo que dá origem à palavra 'etnia'; a missão bíblica sempre teve as nações, e não apenas indivíduos isolados, em vista", lang: "grego" },
          ],
          deepDive:
            "A expressão missio Dei ('missão de Deus') resume uma virada importante na teologia missionária moderna: em vez de pensar 'a igreja tem uma missão', pensamos primeiro 'Deus tem uma missão, e a igreja é chamada a participar dela'. Isso evita dois erros: fazer de missões um projeto puramente humano e voluntarista (como se dependesse só do nosso esforço e estratégia), e reduzir a Bíblia a uma coleção de histórias morais desconectadas, perdendo de vista sua unidade como uma única narrativa de redenção que começa em Gênesis e termina em Apocalipse com adoradores de todas as nações. Vale notar: a diversidade de povos, línguas e culturas não desaparece na eternidade (Ap 7:9) — ela é redimida e reunida em torno do Cordeiro, celebrando, cada povo com sua própria voz, o mesmo Salvador.",
          theologianQuote: {
            author: "David Bosch",
            text: "A missão não é primariamente uma atividade da igreja, mas um atributo de Deus. Deus é um Deus missionário, e a igreja existe porque há missão, e não o contrário.",
          },
          quizzes: [
            {
              question: "Segundo Gênesis 12:2-3, qual era o propósito da promessa feita a Abraão?",
              options: [
                "Que apenas seus descendentes diretos fossem abençoados, isolados das demais nações",
                "Que, por meio dele, todos os povos da terra fossem abençoados",
                "Que Israel se tornasse uma nação fechada em si mesma",
                "Que a bênção fosse condicionada ao mérito de cada povo",
              ],
              correctIndex: 1,
              explanation: "Desde o chamado de Abraão, o propósito declarado de Deus já incluía todas as nações da terra.",
            },
            {
              question: "O que Apocalipse 7:9 revela sobre o alvo final da redenção?",
              options: [
                "Que todas as diferenças étnicas e culturais desaparecerão completamente",
                "Que uma multidão de toda nação, tribo, povo e língua estará diante do trono",
                "Que apenas um povo específico terá acesso à presença de Deus",
                "Que a diversidade de povos é irrelevante para a eternidade",
              ],
              correctIndex: 1,
              explanation: "A cena final da redenção inclui explicitamente adoradores de todas as nações, tribos, povos e línguas.",
            },
            {
              question: "O que significa a expressão teológica 'missio Dei'?",
              options: [
                "Que a missão é responsabilidade exclusiva dos missionários profissionais",
                "Que a missão pertence primeiro a Deus, e a igreja participa dela",
                "Que missões são um projeto puramente humano de expansão religiosa",
                "Que a Bíblia não tem uma narrativa unificada sobre as nações",
              ],
              correctIndex: 1,
              explanation: "Missio Dei ensina que a missão nasce do próprio caráter e propósito de Deus, e a igreja é convidada a nela participar.",
            },
          ],
          application:
            "Esta semana, leia um Salmo missionário (Salmo 67 ou 96) e ore especificamente por um povo ou nação que ainda tem pouco ou nenhum acesso ao Evangelho. Se possível, pesquise sobre um grupo étnico não alcançado e comece a orar regularmente por ele.",
          prayer:
            "Senhor, tu és um Deus que ama as nações desde o princípio. Perdoa-me pelas vezes em que reduzi minha fé a um assunto pessoal e privado, esquecendo que fui chamado a participar da tua missão para o mundo inteiro. Dá-me um coração que se importa com os povos que ainda não te conhecem, e mostra-me como posso participar, de alguma forma concreta, da tua missão. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Pesquise a história de um missionário que atravessou fronteiras culturais para levar o Evangelho (por exemplo, William Carey, Hudson Taylor ou algum missionário brasileiro) e anote uma lição que essa vida ensina sobre o coração de Deus pelas nações.",
          reflectionQuestion:
            "Se a missão de Deus para as nações atravessa toda a Bíblia, do Gênesis ao Apocalipse, que lugar ela tem ocupado na sua própria vida de fé até agora?",
          xp: 30,
        },
        {
          id: "ms-1-2",
          title: "A Grande Comissão",
          intro: [
            "As últimas palavras de alguém que amamos costumam carregar peso especial — são o resumo do que mais importa para essa pessoa. As últimas palavras de Jesus antes de subir aos céus, registradas em Mateus 28:18-20, não foram diferentes: elas resumem, de forma solene e definitiva, a missão que a igreja carregaria dali em diante. A tradição cristã chama esse trecho de 'Grande Comissão' — e por boas razões.",
            "Jesus começa afirmando sua autoridade absoluta: 'toda autoridade me foi dada nos céus e na terra'. A comissão que segue não é uma sugestão entre outras opções religiosas, mas uma ordem dada por Aquele que já venceu a morte e reina soberanamente sobre toda a criação. É a partir dessa autoridade, e não da nossa capacidade, que a missão é possível.",
            "O mandamento central, no grego original, gira em torno de um único verbo principal: 'façam discípulos' — as demais ações (indo, batizando, ensinando) são participações que descrevem como essa tarefa central acontece. Fazer discípulos não é apenas converter pessoas ou aumentar números; é formar seguidores fiéis de Jesus, batizados publicamente em nome da Trindade, e ensinados a obedecer tudo o que Cristo ordenou — um processo de vida inteira, não um evento pontual.",
            "E a comissão termina com uma promessa impressionante: 'estarei sempre com vocês, até o fim dos tempos'. A tarefa é grande, mas ninguém a cumpre sozinho — o próprio Cristo ressuscitado acompanha sua igreja em cada passo dessa missão, até que ela seja plenamente concluída.",
          ],
          verses: [
            {
              ref: "Mateus 28:18-20",
              textByVersion: {
                NVI: "Toda autoridade me foi dada nos céus e na terra. Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, do Filho e do Espírito Santo, ensinando-os a obedecer a tudo o que lhes ordenei. E eu estarei sempre com vocês, até o fim dos tempos.",
                ACF: "E, aproximando-se Jesus, falou-lhes, dizendo: É-me dado todo o poder no céu e na terra. Portanto, ide, fazei discípulos de todas as nações... e eis que eu estou convosco todos os dias, até à consumação dos séculos.",
              },
              originals: [
                { word: "μαθητεύσατε", translit: "mathēteusate", meaning: "façam discípulos — verbo imperativo, o mandamento central da comissão; os demais verbos (indo, batizando, ensinando) descrevem esse processo", lang: "grego" },
              ],
            },
            {
              ref: "Atos 1:8",
              textByVersion: {
                NVI: "Vocês receberão poder... e serão minhas testemunhas em Jerusalém, em toda a Judeia e Samaria, e até os confins da terra.",
              },
              originals: [
                { word: "μάρτυς", translit: "martys", meaning: "testemunha — alguém que relata, com autoridade pessoal, o que viu e viveu de Cristo", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "μαθητεύω", translit: "mathēteuō", meaning: "fazer discípulo — formar um seguidor comprometido, não apenas registrar uma conversão inicial", lang: "grego" },
            { word: "ἔθνος", translit: "ethnē", meaning: "nações, povos — a comissão abrange todos os grupos humanos, sem exceção geográfica ou étnica", lang: "grego" },
            { word: "μάρτυς", translit: "martys", meaning: "testemunha — de onde vem a palavra 'mártir': alguém que dá testemunho de Cristo, às vezes ao custo da própria vida", lang: "grego" },
          ],
          deepDive:
            "Na estrutura gramatical grega de Mateus 28:19-20, apenas 'façam discípulos' (mathēteusate) está no modo imperativo — o mandamento propriamente dito. 'Indo', 'batizando' e 'ensinando' são particípios que descrevem os meios pelos quais esse discipulamento acontece. Isso é significativo: a Grande Comissão não termina quando alguém faz uma oração de conversão ou é batizado; ela continua no ensino contínuo, 'ensinando-os a obedecer tudo o que ordenei' — um processo de formação que dura a vida inteira. Já Atos 1:8 traça uma espiral geográfica (Jerusalém, Judeia, Samaria, confins da terra) que ilustra um princípio: missões começam onde você está (seu 'Jerusalém'), mas nunca se limitam a isso — o alcance final é 'até os confins da terra'. Um cristão pode viver essa comissão sem nunca atravessar uma fronteira nacional, e outro pode ser especificamente chamado por Deus a atravessar culturas e continentes; ambos participam da mesma missão, em campos diferentes.",
          theologianQuote: {
            author: "John Stott",
            text: "A Grande Comissão não é uma opção para cristãos entusiasmados, mas o mandamento de Cristo para toda a sua igreja; a única pergunta legítima não é se participaremos, mas como e onde.",
          },
          quizzes: [
            {
              question: "Qual é o verbo central, no imperativo, em Mateus 28:19?",
              options: [
                "'Ide' — o ato de viajar geograficamente",
                "'Façam discípulos' — o mandamento central da comissão",
                "'Batizando' — o ato litúrgico do batismo",
                "'Ensinando' — apenas a transmissão de conteúdo doutrinário",
              ],
              correctIndex: 1,
              explanation: "No grego, 'façam discípulos' é o único verbo no imperativo; os demais descrevem como isso acontece.",
            },
            {
              question: "Segundo a lição, o que significa 'fazer discípulos' segundo Mateus 28:20?",
              options: [
                "Apenas registrar uma decisão inicial de fé",
                "Um processo contínuo de ensinar a obedecer tudo o que Cristo ordenou",
                "Somente batizar o maior número possível de pessoas",
                "Uma tarefa reservada apenas a missionários de tempo integral",
              ],
              correctIndex: 1,
              explanation: "O discipulamento envolve ensino contínuo e obediência prática, não apenas um evento pontual de conversão.",
            },
            {
              question: "Que padrão geográfico Atos 1:8 estabelece para o testemunho cristão?",
              options: [
                "Que missões só valem quando acontecem em terras distantes",
                "Um movimento que começa perto (Jerusalém) e se estende até os confins da terra",
                "Que apenas apóstolos podiam ser testemunhas de Cristo",
                "Que o testemunho deve se limitar apenas à própria cidade",
              ],
              correctIndex: 1,
              explanation: "Atos 1:8 traça uma espiral que começa no contexto imediato e se estende progressivamente até os confins da terra.",
            },
          ],
          application:
            "Identifique seu 'Jerusalém' (seu contexto mais próximo — família, vizinhança, trabalho) e seus 'confins da terra' (um povo ou lugar distante pelo qual você pode orar ou apoiar). Dê um passo concreto esta semana em pelo menos uma dessas frentes: uma conversa espiritual próxima, ou uma oração/contribuição específica por missões ao redor do mundo.",
          prayer:
            "Senhor Jesus, tu tens toda a autoridade nos céus e na terra, e nos comissionaste para fazer discípulos de todas as nações. Perdoa-me pela indiferença ou pelo medo que às vezes me impedem de participar dessa missão. Lembra-me da tua promessa: que estás comigo todos os dias, até o fim dos tempos. Usa-me, onde quer que eu esteja, para fazer discípulos fiéis a ti. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva o nome de uma pessoa próxima com quem você pode, nos próximos dias, iniciar ou aprofundar uma conversa sobre Jesus. Ore por essa pessoa diariamente e busque uma oportunidade natural de conversa.",
          reflectionQuestion:
            "A Grande Comissão foi dada a toda a igreja, não apenas a missionários profissionais. Como você, na sua realidade concreta, tem participado (ou pode começar a participar) de 'fazer discípulos de todas as nações'?",
          xp: 32,
        },
      ],
    },
    {
      id: "ms-mod-2",
      title: "Módulo II: Vivendo a Missão",
      lessons: [
        {
          id: "ms-2-1",
          title: "Cada Cristão, Uma Testemunha",
          intro: [
            "Existe uma distinção útil, embora nem sempre nítida, entre o chamado geral que todo cristão recebe para testemunhar de Cristo e o chamado específico que alguns recebem para dedicar a vida inteira ao trabalho missionário, muitas vezes atravessando fronteiras culturais e geográficas. Ambos são reais, ambos são bíblicos — mas confundi-los gera dois erros opostos.",
            "O primeiro erro é achar que 'missões' é assunto apenas para um grupo especializado de cristãos com um chamado extraordinário, deixando a maioria confortável e passiva. Atos 8 mostra o contrário: após a perseguição em Jerusalém, 'os que foram dispersos iam por toda parte pregando a palavra' (At 8:4) — não apenas os apóstolos, mas cristãos comuns, espalhados por circunstâncias, testemunhando onde quer que estivessem.",
            "O segundo erro é o oposto: achar que, como todo cristão é chamado a testemunhar, ninguém precisa se dedicar especificamente ao trabalho missionário de tempo integral, especialmente entre povos ainda não alcançados. Mas Paulo é claro em Romanos 10:14-15: como ouvirão sem pregador? E como pregarão se não forem enviados? Há um chamado específico, e real, para quem Deus separa para essa tarefa.",
            "A resposta bíblica equilibrada é esta: todo cristão é uma testemunha no lugar onde está, e alguns cristãos são chamados a se tornar enviados — a deixar seu lugar para levar o Evangelho a outros. Ambos os chamados são igualmente honrosos diante de Deus; a pergunta que cada crente precisa fazer não é 'sou obrigado a ir?', mas 'que papel Deus está me chamando a exercer nessa missão que já é minha, esteja eu aqui ou lá?'.",
          ],
          verses: [
            {
              ref: "Atos 8:4",
              textByVersion: {
                NVI: "Os que haviam sido dispersos pregavam a palavra por onde iam.",
                ACF: "E os que foram dispersos iam por toda parte, anunciando a palavra.",
              },
              originals: [
                { word: "εὐαγγελιζόμενοι", translit: "euangelizomenoi", meaning: "evangelizando, anunciando boas novas — particípio que descreve uma ação contínua e espontânea", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 10:14-15",
              textByVersion: {
                NVI: "Como ouvirão, se não houver quem pregue? E como pregarão, se não forem enviados?",
              },
              originals: [
                { word: "ἀποσταλῶσιν", translit: "apostalōsin", meaning: "sejam enviados — raiz da palavra 'apóstolo'; envio intencional e reconhecido pela comunidade", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "εὐαγγελίζω", translit: "euangelizō", meaning: "evangelizar, anunciar boas novas — a tarefa de todo cristão, onde quer que esteja", lang: "grego" },
            { word: "ἀποστέλλω", translit: "apostellō", meaning: "enviar oficialmente — chamado específico de alguns para atravessar fronteiras com o Evangelho", lang: "grego" },
          ],
          deepDive:
            "É importante distinguir, sem separar, dois conceitos que às vezes se confundem: testemunho (a tarefa de todo cristão, exercida naturalmente onde ele vive, trabalha e se relaciona) e envio missionário (o chamado específico, reconhecido pela igreja local, para que alguém se dedique à obra missionária, muitas vezes atravessando fronteiras culturais, linguísticas ou geográficas). Romanos 10:14-15 pressupõe uma cadeia: alguém precisa ser enviado para que outros ouçam e creiam. Essa dinâmica de envio não é individualista — na igreja primitiva (At 13:1-3), a igreja de Antioquia, reunida em jejum e oração, reconheceu e comissionou formalmente Paulo e Barnabé para a obra específica à qual o Espírito os chamava. Isso ensina que o chamado missionário específico, embora pessoal, é também confirmado e enviado pela comunidade da igreja local — não é uma decisão isolada e puramente individual.",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "Nem todo cristão precisa deixar sua terra para ser missionário, mas todo cristão precisa deixar sua zona de conforto para ser testemunha, ali onde Deus o colocou.",
          },
          quizzes: [
            {
              question: "O que Atos 8:4 revela sobre quem pregava o Evangelho após a dispersão da igreja de Jerusalém?",
              options: [
                "Apenas os apóstolos continuaram pregando",
                "Cristãos comuns, espalhados pela perseguição, pregavam por onde iam",
                "A pregação cessou completamente até nova organização formal",
                "Somente líderes ordenados tinham autoridade para pregar",
              ],
              correctIndex: 1,
              explanation: "O texto mostra cristãos comuns testemunhando espontaneamente onde quer que a dispersão os levasse.",
            },
            {
              question: "Segundo Romanos 10:14-15, qual é a lógica que Paulo apresenta para o envio de pregadores?",
              options: [
                "Que a pregação acontece de forma automática, sem necessidade de ser enviada",
                "Que é preciso haver quem seja enviado, para que haja quem pregue e, assim, quem ouça e creia",
                "Que a fé pode surgir sem qualquer testemunho humano",
                "Que apenas apóstolos podiam ser legitimamente enviados",
              ],
              correctIndex: 1,
              explanation: "Paulo estabelece uma cadeia lógica: envio leva à pregação, que leva à audição, que leva à fé.",
            },
          ],
          application:
            "Reflita sobre seu próprio 'campo missionário' imediato — vizinhança, trabalho, família estendida — e identifique uma pessoa específica com quem você pode testemunhar de forma natural esta semana. Se você sente um chamado mais específico para missões transculturais, converse com um líder da sua igreja sobre os próximos passos.",
          prayer:
            "Senhor, tu me colocaste onde estou por um propósito. Ajuda-me a ser testemunha fiel no meu contexto imediato, e dá-me sensibilidade para reconhecer se és tu quem me chama a ir além dele. Levanta, da minha igreja, obreiros dispostos a serem enviados aos povos que ainda não te conhecem. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Converse com um missionário (pessoalmente, por mensagem, ou através de um relatório de missões da sua igreja) e anote uma lição prática sobre como ele vive o testemunho de Cristo no seu contexto específico.",
          reflectionQuestion:
            "Você tem vivido seu chamado a testemunhar como algo natural e contínuo no seu contexto, ou como algo distante, reservado apenas a 'missionários profissionais'?",
          xp: 30,
        },
        {
          id: "ms-2-2",
          title: "Enviando e Sustentando: A Igreja como Base de Missões",
          intro: [
            "Nenhum missionário verdadeiramente bíblico vai sozinho. Mesmo quando atravessa oceanos e se estabelece em terras distantes, ele carrega consigo o envio, a oração e o sustento de uma comunidade que ficou. A Bíblia descreve a igreja local não apenas como quem produz missionários, mas como parceira ativa e contínua na obra que eles realizam.",
            "Em Atos 13:1-3, a igreja de Antioquia não apenas 'deixou ir' Paulo e Barnabé — ela participou ativamente do processo: jejuou, orou, impôs as mãos sobre eles e os enviou. O verbo usado (apolyō, 'despediram') carrega o sentido de um envio comissionado, não de um simples deixar partir por conta própria.",
            "Paulo, por sua vez, reconhece publicamente sua dependência do apoio de igrejas que ficaram: à igreja de Filipos, ele agradece por terem 'se associado' com ele, tanto no dar quanto no receber (Fp 4:15). O sustento financeiro, a oração contínua e a comunicação regular não são detalhes práticos secundários — são parte integrante e bíblica da própria obra missionária.",
            "Isso significa que quem nunca cruzará uma fronteira internacional ainda pode ser, de fato, parte ativa da obra missionária: orando com fidelidade por obreiros específicos, contribuindo financeiramente, mantendo comunicação e cuidado pastoral com quem foi enviado, e recebendo com alegria os relatórios do que Deus tem feito. Missões são obra de toda a igreja — de quem vai e de quem envia.",
          ],
          verses: [
            {
              ref: "Atos 13:2-3",
              textByVersion: {
                NVI: "Enquanto adoravam o Senhor e jejuavam, disse o Espírito Santo: 'Separem para mim Barnabé e Saulo, para a obra a que os tenho chamado.' ...impuseram-lhes as mãos e os enviaram.",
                ACF: "E, servindo eles ao Senhor, e jejuando, disse o Espírito Santo: Apartai-me a Barnabé e a Saulo para a obra... e, orando, e jejuando, e pondo sobre eles as mãos, os despediram.",
              },
              originals: [
                { word: "ἀφορίσατε", translit: "aphorisate", meaning: "separem, designem para um propósito específico — a igreja reconhece e confirma um chamado já dado por Deus", lang: "grego" },
              ],
            },
            {
              ref: "Filipenses 4:15",
              textByVersion: {
                NVI: "Vocês sabem que, no início da pregação do evangelho... nenhuma igreja se associou comigo no dar e no receber, a não ser vocês.",
              },
            },
          ],
          keywords: [
            { word: "ἀφορίζω", translit: "aphorizō", meaning: "separar para um propósito específico — a igreja não cria o chamado, mas o reconhece e confirma publicamente", lang: "grego" },
            { word: "κοινωνία", translit: "koinōnia", meaning: "parceria, comunhão — usada por Paulo em Filipenses para descrever a parceria financeira e espiritual entre ele e a igreja que o enviava", lang: "grego" },
          ],
          deepDive:
            "O processo de Atos 13:1-3 mostra um equilíbrio importante entre o chamado individual e a confirmação comunitária: o Espírito Santo fala no contexto da igreja reunida em adoração e jejum ('Separem para mim...'), e a igreja responde com um ato formal e visível de envio (jejum, oração, imposição de mãos). Isso protege contra dois extremos: o individualismo missionário, em que alguém parte por conta própria sem qualquer prestação de contas ou conexão com uma igreja local; e o institucionalismo frio, em que o envio se torna apenas burocracia administrativa, sem oração genuína nem discernimento espiritual comunitário. A koinonia financeira mencionada em Filipenses 4:15 não era caridade ocasional, mas parceria estruturada e contínua — a igreja de Filipos apoiou Paulo repetidamente (Fp 4:16), entendendo que sustentar quem ia era, de fato, participar da própria obra do Evangelho.",
          theologianQuote: {
            author: "Vishal Mangalwadi",
            text: "Toda igreja que ora fielmente, dá com generosidade e mantém-se conectada aos que enviou está, tanto quanto o missionário no campo, participando ativamente da obra de Deus entre as nações.",
          },
          quizzes: [
            {
              question: "O que a igreja de Antioquia fez, segundo Atos 13:1-3, antes de enviar Paulo e Barnabé?",
              options: [
                "Simplesmente permitiu que eles partissem por conta própria",
                "Adorou, jejuou, orou e impôs as mãos sobre eles antes do envio",
                "Ignorou completamente o processo, sem qualquer envolvimento",
                "Exigiu que eles pagassem pela própria viagem, sem apoio da igreja",
              ],
              correctIndex: 1,
              explanation: "O envio missionário em Atos 13 foi um processo comunitário de discernimento, oração e comissionamento formal.",
            },
            {
              question: "O que Filipenses 4:15 revela sobre a relação entre Paulo e a igreja de Filipos?",
              options: [
                "Que Paulo nunca aceitava apoio financeiro de igrejas",
                "Que a igreja de Filipos se associou com ele, de forma contínua, 'no dar e no receber'",
                "Que apenas Paulo sustentava financeiramente a igreja",
                "Que missões não envolvem qualquer tipo de parceria financeira",
              ],
              correctIndex: 1,
              explanation: "Paulo reconhece publicamente a parceria financeira contínua e ativa da igreja de Filipos na obra missionária.",
            },
          ],
          application:
            "Escolha um missionário ou projeto missionário apoiado pela sua igreja e comprometa-se a orar por ele regularmente nas próximas semanas. Se possível, contribua financeiramente, mesmo que com um valor pequeno, como expressão concreta de parceria na obra.",
          prayer:
            "Senhor, obrigado por não deixares nenhum obreiro sozinho na tua obra. Ensina-me a participar ativamente das missões, seja orando com fidelidade, contribuindo com generosidade, ou mantendo-me conectado a quem foi enviado. Levanta, na minha igreja, um espírito de verdadeira parceria com os que vão às nações. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Descubra o nome de pelo menos um missionário apoiado pela sua igreja e adicione-o à sua lista de oração contínua, junto com as pessoas do seu Mural de Clamores.",
          reflectionQuestion:
            "Você tem participado da obra missionária da sua igreja de forma ativa (oração, contribuição, conexão), ou tem tratado missões como algo distante, que não diz respeito à sua vida cotidiana?",
          xp: 32,
        },
      ],
    },
  ],
};

export const additionalTrails4: Trail[] = [igrejaLocal, familiaCrista, missoes];
