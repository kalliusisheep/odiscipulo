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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Stott realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Spurgeon realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Thom Rainer realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Wayne Grudem realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
    {
      id: "il-mod-3",
      title: "Módulo III: Ofícios e Ordenanças",
      lessons: [
        {
          id: "il-3-1",
          title: "Ofícios Bíblicos: Pastores e Diáconos",
          intro: [
            "Deus não deixou sua igreja sem estrutura. Desde o início, ele levantou homens para servir em ofícios específicos, com responsabilidades e qualificações claramente definidas nas Escrituras. Isso não é burocracia religiosa — é o próprio Cristo, Cabeça da igreja, cuidando do seu corpo por meio de líderes que ele mesmo capacita e chama.",
            "O Novo Testamento descreve basicamente dois ofícios permanentes na igreja local: pastores/presbíteros/bispos (os três termos descrevem a mesma função, vista por ângulos diferentes — pastoreio, maturidade e supervisão) e diáconos. Em Filipenses 1:1, Paulo saúda 'a igreja... com os bispos e diáconos' — os dois ofícios já operando lado a lado desde os primeiros anos da igreja.",
            "Os pastores são responsáveis por ensinar a Palavra, cuidar espiritualmente do rebanho e supervisionar a vida da igreja (1 Pe 5:1-3). Os diáconos, cujo nome vem da palavra grega para 'servo', cuidam das necessidades práticas da congregação — como no relato de Atos 6, quando sete homens foram escolhidos para cuidar da distribuição de alimentos, liberando os apóstolos para a oração e o ensino.",
            "Em tradição batista congregacional, esses ofícios servem sob a autoridade final da própria congregação, reunida para tomar decisões importantes diante de Deus. Isso não diminui a autoridade pastoral — o rebanho ainda deve 'obedecer aos seus líderes' (Hb 13:17) — mas garante que nenhum homem, sozinho, concentre poder que pertence a Cristo e ao seu povo reunido.",
          ],
          verses: [
            {
              ref: "1 Timóteo 3:1-2,8",
              textByVersion: {
                NVI: "Quem deseja ser bispo, excelente trabalho almeja. É necessário, pois, que o bispo seja irrepreensível... Da mesma forma, os diáconos devem ser dignos de respeito.",
                NAA: "Fiel é esta palavra: se alguém aspira ao episcopado, excelente obra deseja. É necessário, pois, que o bispo seja irrepreensível... Da mesma maneira, os diáconos sejam sérios.",
                ACF: "Esta é uma palavra fiel: Se alguém deseja o episcopado, excelente obra deseja. Convém, pois, que o bispo seja irrepreensível... Da mesma sorte os diáconos sejam honestos.",
              },
              originals: [
                { word: "ἐπίσκοπος", translit: "episkopos", meaning: "'supervisor, bispo' — aquele que vela pela igreja; termo usado como sinônimo de presbítero/pastor", lang: "grego" },
              ],
            },
            {
              ref: "Atos 6:2-4",
              textByVersion: {
                NVI: "Não é certo que negligenciemos o ministério da palavra de Deus para servir às mesas... e nós nos dedicaremos à oração e ao ministério da palavra.",
                ACF: "Não é razoável que nós deixemos a palavra de Deus e sirvamos às mesas... e nós perseveraremos na oração e no ministério da palavra.",
              },
              originals: [
                { word: "διακονέω", translit: "diakoneō", meaning: "servir, cuidar de necessidades práticas — raiz do ofício de diácono", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "πρεσβύτερος", translit: "presbyteros", meaning: "'ancião, presbítero' — termo que enfatiza maturidade espiritual, usado como sinônimo de pastor/bispo", lang: "grego" },
            { word: "διάκονος", translit: "diakonos", meaning: "'servo, diácono' — ofício voltado ao cuidado prático e material da igreja", lang: "grego" },
          ],
          deepDive:
            "Uma questão legítima entre cristãos fiéis é o modelo de governo eclesiástico: episcopal (bispos com autoridade regional), presbiteriano (conselho de presbíteros com autoridade final) ou congregacional (a congregação local como instância final de decisão, sob pastores e diáconos). Esta trilha adota o modelo congregacional, comum na tradição batista: uma pluralidade de pastores/presbíteros ensina e pastoreia, diáconos servem nas necessidades práticas, e decisões maiores — como a recepção de membros, disciplina e escolha de líderes — são levadas à congregação reunida, seguindo o padrão visto em Atos 6:3 e 15:22, onde 'toda a igreja' participa de decisões importantes. Irmãos de outras tradições organizam essa autoridade de forma diferente, com zelo igualmente sincero pelas Escrituras.",
          theologianQuote: {
            author: "Alexander Strauch",
            text: "A liderança bíblica nunca é sobre um homem no topo, mas sobre uma pluralidade de pastores servindo juntos, debaixo de Cristo.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Alexander Strauch realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Tito 1:6-9",
                textByVersion: {
                  NVI: "O bispo deve ser irrepreensível, marido de uma só mulher... apegado à mensagem fiel, como lhe foi ensinada, para que seja capaz de encorajar outros pela sã doutrina e de refutar os que a contradizem.",
                },
              },
              {
                ref: "1 Pedro 5:2-3",
                textByVersion: {
                  NVI: "Pastoreiem o rebanho de Deus que está aos seus cuidados... não por imposição, mas de boa vontade, como Deus quer; não por ganância, mas com o desejo de servir; não como quem domina os que estão sob seus cuidados, mas sendo exemplos para o rebanho.",
                },
              },
            ],
            historicalContext:
              "Nas cartas pastorais e em Atos, os termos 'presbítero' (ancião), 'bispo/supervisor' e 'pastor' são usados de forma intercambiável para o mesmo ofício — Paulo, em Atos 20, chama os mesmos homens de 'presbíteros' (v. 17) e diz que o Espírito os fez 'bispos/supervisores' para 'pastorear' a igreja (v. 28). Só séculos depois, gradualmente, um único 'bispo' passou a ter autoridade sobre vários presbíteros e várias igrejas — um desenvolvimento histórico posterior ao Novo Testamento, não um mandamento apostólico direto.",
            theologicalDebate:
              "Um debate sensível entre cristãos fiéis é sobre quem pode ocupar o ofício de pastor/presbítero. A leitura complementarista — adotada por esta trilha, com base em 1 Timóteo 2:12 e 3:2 ('marido de uma mulher') — entende que o ofício de ensino e governo pastoral é reservado a homens qualificados, sem que isso diminua a igual dignidade e o chamado ministerial das mulheres em tantas outras funções da igreja. Irmãos igualitaristas leem esses textos de forma diferente, com sinceridade e zelo pelas Escrituras também.",
            secondQuote: {
              author: "John MacArthur",
              text: "Uma igreja liderada por uma pluralidade de pastores qualificados reflete melhor o padrão do Novo Testamento do que a liderança solitária de um único homem.",
            },
          },
          quizzes: [
            {
              question: "Segundo Filipenses 1:1, quantos ofícios permanentes Paulo saúda na igreja?",
              options: ["Apenas um: o apóstolo", "Dois: bispos e diáconos", "Três: bispos, presbíteros e diáconos como cargos distintos", "Nenhum ofício formal é mencionado"],
              correctIndex: 1,
              explanation: "Paulo saúda especificamente 'os bispos e diáconos' — os dois ofícios da igreja local.",
            },
            {
              question: "Qual foi o motivo da criação do ofício de diácono em Atos 6?",
              options: [
                "Substituir os apóstolos no ensino da Palavra",
                "Cuidar das necessidades práticas, liberando os apóstolos para oração e ensino",
                "Governar a igreja com autoridade superior à dos apóstolos",
                "Uma inovação sem base nas necessidades reais da igreja",
              ],
              correctIndex: 1,
              explanation: "Os sete foram escolhidos para o cuidado prático, para que os apóstolos se dedicassem à Palavra e à oração.",
            },
            {
              question: "No modelo congregacional adotado nesta trilha, quem tem a autoridade final para decisões maiores da igreja?",
              options: [
                "Um bispo regional, sozinho",
                "Um conselho externo à igreja local",
                "A própria congregação reunida, sob o ensino de seus pastores",
                "Nenhuma autoridade humana é reconhecida",
              ],
              correctIndex: 2,
              explanation: "No modelo congregacional, decisões importantes são levadas à congregação, seguindo o padrão de Atos 6 e 15.",
            },
          ],
          application:
            "Descubra quem são os pastores e diáconos da sua igreja local e ore especificamente por cada um esta semana, pedindo sabedoria, integridade e proteção espiritual para eles.",
          prayer:
            "Senhor, obrigado por cuidares da tua igreja através de homens chamados e capacitados por ti. Abençoa os pastores e diáconos da minha igreja — dá-lhes sabedoria, integridade e perseverança. Ensina-me a honrá-los e a servir ao lado deles, e não apenas como espectador. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Envie uma mensagem de encorajamento a um pastor ou diácono da sua igreja esta semana, agradecendo especificamente por algo que ele fez ou ensinou.",
          reflectionQuestion:
            "Como você tem honrado (ou negligenciado) a liderança que Deus colocou sobre sua igreja local?",
          xp: 28,
        },
        {
          id: "il-3-2",
          title: "Batismo e Ceia: As Ordenanças de Cristo",
          intro: [
            "Cristo deixou à sua igreja dois sinais visíveis e físicos do Evangelho invisível: o batismo e a Ceia do Senhor. A tradição batista os chama de 'ordenanças' — não porque salvem ou concedam graça automaticamente, mas porque foram literalmente 'ordenados' por Cristo como atos de obediência e testemunho para todo crente e toda igreja.",
            "O batismo é o primeiro passo de obediência pública de quem creu. Ele não causa a salvação — é um testemunho dela. Em Romanos 6:3-4, Paulo explica que ser batizado é ser 'sepultado com Cristo' e ressuscitado com ele 'para andarmos em novidade de vida'. É por isso que esta trilha entende o batismo bíblico como o de crentes, por imersão, após a conversão consciente — e não de crianças, já que o Novo Testamento sempre liga o batismo à fé pessoal e ao arrependimento (At 2:38,41).",
            "A Ceia do Senhor, por sua vez, é celebrada 'em memória' de Cristo (1 Co 11:24-25) — um lembrete visível, repetido, do seu corpo partido e sangue derramado por nós. Não se trata de repetir o sacrifício de Cristo (Hb 10:12 é claro que essa oferta foi feita 'uma vez para sempre'), mas de proclamar, ao redor da mesa, a morte do Senhor 'até que ele venha' (1 Co 11:26).",
            "Como igreja de tradição aberta, entendemos que a mesa do Senhor pertence a Cristo, não a uma denominação — por isso recebemos à Ceia todo aquele que genuinamente confia em Jesus, mesmo vindo de outra igreja cristã fiel. Já a participação plena na membresia e o próprio batismo seguem o padrão bíblico do crente que professa fé e é imerso.",
          ],
          verses: [
            {
              ref: "Romanos 6:3-4",
              textByVersion: {
                NVI: "Vocês não sabem que todos nós, que fomos batizados em Cristo Jesus, fomos batizados em sua morte? Fomos, pois, sepultados com ele na morte por meio do batismo, para que, assim como Cristo foi ressuscitado dentre os mortos... também nós vivamos uma vida nova.",
                ACF: "Ou não sabeis que todos quantos fomos batizados em Jesus Cristo fomos batizados na sua morte? De sorte que fomos sepultados com ele pelo batismo na morte... para que também andemos nós em novidade de vida.",
              },
              originals: [
                { word: "βαπτίζω", translit: "baptizō", meaning: "'imergir, mergulhar completamente' — o termo grego descreve literalmente a submersão em água", lang: "grego" },
              ],
            },
            {
              ref: "1 Coríntios 11:24-26",
              textByVersion: {
                NVI: "Isto é o meu corpo, que é dado em favor de vocês; façam isto em memória de mim... Porque, sempre que comerem deste pão e beberem deste cálice, vocês anunciam a morte do Senhor, até que ele venha.",
                ACF: "Isto é o meu corpo, que é partido por vós; fazei isto em memória de mim... Porque todas as vezes que comerdes este pão e beberdes este cálice, anunciais a morte do Senhor, até que venha.",
                NVT: "Este é o meu corpo, que é dado em seu benefício. Façam isto em memória de mim... Pois sempre que vocês comerem deste pão e beberem deste cálice, vocês estão anunciando a morte do Senhor até que ele volte.",
              },
              originals: [
                { word: "ἀνάμνησις", translit: "anamnesis", meaning: "'memória, lembrança ativa' — não uma simples recordação mental, mas um ato que reapresenta o significado do evento lembrado", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "βαπτίζω", translit: "baptizō", meaning: "imergir — ato que retrata visualmente a morte, sepultamento e ressurreição com Cristo", lang: "grego" },
            { word: "ἀνάμνησις", translit: "anamnesis", meaning: "memória viva — o propósito declarado da Ceia do Senhor", lang: "grego" },
          ],
          deepDive:
            "Sobre o batismo infantil (pedobatismo), praticado por irmãos de tradições reformadas, luteranas e católicas, há divergência histórica e sincera. Esta trilha, alinhada à convicção batista, entende que todos os exemplos e ensinos do Novo Testamento ligam o batismo à profissão pessoal de fé — não há um único caso claro de batismo de bebê nas Escrituras. Da mesma forma, sobre a natureza da Ceia, há visões diversas: a transubstanciação católica, a presença real luterana, a presença espiritual reformada e a visão memorial batista aqui adotada — que entende o pão e o vinho como símbolos poderosos, não como o corpo e sangue literais de Cristo. Reconhecemos essas diferenças com respeito, mantendo o essencial: ambas as ordenanças proclamam o Evangelho e devem ser tratadas com reverência, não como rituais vazios.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "O batismo e a Ceia são os dois braços com que a igreja visível abraça e proclama o Evangelho ao mundo que observa.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Charles Spurgeon realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Atos 2:38,41",
                textByVersion: {
                  NVI: "Arrependam-se, e cada um de vocês seja batizado em nome de Jesus Cristo... Os que aceitaram a mensagem foram batizados, e naquele dia agregaram-se à igreja cerca de três mil pessoas.",
                },
              },
              {
                ref: "1 Coríntios 11:27-29",
                textByVersion: {
                  NVI: "Todo aquele que comer o pão ou beber o cálice do Senhor, indignamente, será culpado de pecar contra o corpo e o sangue do Senhor. Examine-se cada um, e então coma do pão e beba do cálice.",
                },
              },
            ],
            historicalContext:
              "No século XVI, grupos conhecidos como anabatistas ('rebatizadores') foram perseguidos — inclusive por outros protestantes — por insistirem que o batismo deveria seguir a profissão pessoal de fé, e não ocorrer na infância. Essa convicção, considerada radical na época, é hoje a posição histórica de batistas, muitas igrejas evangélicas livres e pentecostais em todo o mundo, embora a maioria das denominações cristãs históricas (católica, ortodoxa, luterana, reformada, anglicana) ainda pratique o batismo infantil.",
            theologicalDebate:
              "Além da questão do modo e do momento do batismo, cristãos fiéis divergem sobre a frequência ideal da Ceia (semanal, como nas igrejas mais litúrgicas, ou mensal/trimestral, como em muitas igrejas batistas) e sobre quem pode participar dela: comunhão fechada (restrita aos membros da própria igreja ou denominação) ou comunhão aberta (estendida a todo crente batizado de qualquer igreja cristã fiel, posição adotada nesta trilha).",
            secondQuote: {
              author: "Billy Graham",
              text: "O batismo não faz de você um cristão — ele declara publicamente que você já é um.",
            },
          },
          quizzes: [
            {
              question: "Segundo Romanos 6:3-4, o que o batismo retrata visualmente?",
              options: [
                "A causa da salvação, sem a qual ninguém pode ser salvo",
                "A morte, sepultamento e ressurreição do crente com Cristo",
                "Um rito cultural sem conexão com a fé pessoal",
                "A substituição da fé por um ato religioso externo",
              ],
              correctIndex: 1,
              explanation: "Paulo liga diretamente o batismo à identificação do crente com a morte e ressurreição de Cristo.",
            },
            {
              question: "De acordo com 1 Coríntios 11:24-26, qual é o propósito declarado da Ceia do Senhor?",
              options: [
                "Repetir o sacrifício de Cristo a cada celebração",
                "Anunciar e lembrar a morte do Senhor até que ele volte",
                "Substituir a necessidade da pregação da Palavra",
                "Servir apenas como uma refeição social entre os membros",
              ],
              correctIndex: 1,
              explanation: "O texto é explícito: a Ceia anuncia a morte do Senhor 'até que ele venha' — é memorial e proclamação.",
            },
            {
              question: "Qual visão do batismo esta trilha adota, e por quê?",
              options: [
                "Batismo infantil, por tradição familiar",
                "Batismo de crentes por imersão, após profissão pessoal de fé",
                "Qualquer forma é irrelevante, pois o rito não importa",
                "Apenas o batismo no Espírito, sem elemento de água",
              ],
              correctIndex: 1,
              explanation: "A trilha segue a convicção batista de que o Novo Testamento sempre liga o batismo à fé pessoal consciente.",
            },
          ],
          application:
            "Se você já é crente mas ainda não foi batizado por imersão após sua conversão, converse com seu pastor esta semana sobre dar esse passo de obediência pública. Se já foi batizado, reflita sobre o que esse ato significou e ainda significa para você.",
          prayer:
            "Senhor Jesus, obrigado por nos deixares sinais visíveis do teu Evangelho invisível. Ajuda-me a nunca tratar o batismo ou a Ceia como rituais vazios, mas como proclamações vivas da tua morte e ressurreição por mim. Renova em mim a alegria da minha própria identificação contigo. Amém.",
          weeklyChallenge:
            "Na próxima vez que sua igreja celebrar a Ceia do Senhor, participe com atenção redobrada — silenciando distrações e meditando conscientemente no corpo partido e sangue derramado de Cristo por você.",
          reflectionQuestion:
            "O que o seu batismo (ou a falta dele) diz sobre o seu compromisso público e visível com Cristo?",
          xp: 28,
        },
      ],
    },
    {
      id: "il-mod-4",
      title: "Módulo IV: Comunidade, Correção e Missão",
      lessons: [
        {
          id: "il-4-1",
          title: "Pequenos Grupos: Igreja em Casa",
          intro: [
            "A igreja do Novo Testamento nunca foi apenas um evento de domingo. Atos 2:46 descreve os primeiros cristãos perseverando 'todos os dias, unânimes, no templo, e partindo o pão de casa em casa' — a vida comunitária acontecia tanto no grande culto público quanto na intimidade dos lares. Sem esse segundo espaço, a fé cristã tende a ficar rasa, anônima e facilmente escondida.",
            "Pequenos grupos — células, grupos de estudo, grupos familiares, como cada igreja os chame — recuperam esse padrão bíblico. É num círculo pequeno que as pessoas são realmente conhecidas: alguém percebe quando você falta, ora por seus problemas específicos, e nota quando você está se afastando espiritualmente antes que isso vire uma crise.",
            "Hebreus 10:24-25 conecta diretamente essa vida em comunidade próxima com perseverança na fé: 'consideremo-nos uns aos outros para nos incentivarmos ao amor e às boas obras. Não deixemos de reunir-nos... antes façamos as devidas exortações'. A palavra usada para 'considerar' implica atenção deliberada e contínua à vida do outro — algo praticamente impossível numa multidão, mas natural num pequeno grupo.",
            "Participar de um pequeno grupo não é um extra opcional para cristãos mais 'engajados' — é o ambiente onde os 'uns aos outros' do Novo Testamento (ame uns aos outros, exortai-vos uns aos outros, confessai as faltas uns aos outros) realmente acontecem na prática.",
          ],
          verses: [
            {
              ref: "Atos 2:46-47",
              textByVersion: {
                NVI: "Todos os dias reuniam-se nos átrios do templo. Partiam o pão em casa e comiam juntos, com alegria e sinceridade de coração.",
                ACF: "E, perseverando unânimes todos os dias no templo, e partindo o pão de casa em casa, comiam juntos com alegria e singeleza de coração.",
              },
              originals: [
                { word: "κατ' οἶκον", translit: "kat' oikon", meaning: "'de casa em casa' — expressão que descreve a vida comunitária cristã nos lares, complementar ao culto público", lang: "grego" },
              ],
            },
            {
              ref: "Hebreus 10:24-25",
              textByVersion: {
                NVI: "E consideremo-nos uns aos outros para nos incentivarmos ao amor e às boas obras. Não deixemos de reunir-nos como igreja, segundo o costume de alguns, antes façamos as devidas exortações; e tanto mais quanto vedes que se aproxima aquele dia.",
                ACF: "E consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras, não deixando a nossa congregação, como é costume de alguns, antes, admoestando-nos uns aos outros.",
              },
            },
          ],
          keywords: [
            { word: "κατ' οἶκον", translit: "kat' oikon", meaning: "de casa em casa — a dimensão íntima da vida da igreja primitiva", lang: "grego" },
            { word: "κοινωνία", translit: "koinonia", meaning: "comunhão, participação conjunta — vida compartilhada, não apenas presença física simultânea", lang: "grego" },
          ],
          deepDive:
            "Alguns cristãos temem que pequenos grupos criem 'igrejinhas' desconectadas da igreja local ou substituam a autoridade dos pastores por lideranças informais. É um risco real, mas administrável: um bom pequeno grupo funciona sob a supervisão e a doutrina da igreja local, com líderes acompanhados por pastores, e existe para servir à igreja como um todo — não competir com ela. Quando bem estruturado, o pequeno grupo é simplesmente a igreja local em formato mais próximo e acessível, não uma entidade paralela.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "Aquele que não pode estar sozinho deve tomar cuidado com a comunidade; aquele que não está em comunidade deve tomar cuidado com a solidão.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Dietrich Bonhoeffer realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Atos 20:20",
                textByVersion: {
                  NVI: "Vocês sabem que não deixei de pregar-lhes coisa alguma que os beneficiasse, mas ensinei-lhes publicamente e de casa em casa.",
                },
              },
              {
                ref: "Tiago 5:16",
                textByVersion: {
                  NVI: "Confessem os seus pecados uns aos outros e orem uns pelos outros, para que sejam curados. A oração de um justo é poderosa e eficaz.",
                },
              },
            ],
            historicalContext:
              "No século XVIII, John Wesley organizou os primeiros metodistas em pequenas 'sociedades' e 'classes' — grupos de cerca de doze pessoas que se reuniam semanalmente para prestar contas mútuas sobre sua vida espiritual. Historiadores atribuem a esse sistema de pequenos grupos boa parte da perseverança e do crescimento explosivo do movimento metodista, muito além do que os grandes cultos ao ar livre de Wesley conseguiriam sozinhos.",
            theologicalDebate:
              "Igrejas fiéis organizam seus pequenos grupos de formas variadas: alguns seguem estudos preparados centralmente pela liderança, ligados ao sermão do domingo; outros dão mais liberdade de tema ao próprio grupo. Ambos os modelos podem ser saudáveis, desde que mantenham fidelidade doutrinária e conexão real com a igreja local — o risco maior não está no formato, mas no isolamento ou na ausência de supervisão pastoral.",
            secondQuote: {
              author: "John Wesley",
              text: "Não conheço nenhuma forma de religião que não implique uma comunhão constante, próxima e responsável com outros cristãos.",
            },
          },
          quizzes: [
            {
              question: "Segundo Atos 2:46, onde a igreja primitiva vivia sua comunhão, além do templo?",
              options: ["Apenas em eventos públicos oficiais", "De casa em casa, partindo o pão juntos", "Isoladamente, sem reuniões regulares", "Somente por meio de cartas"],
              correctIndex: 1,
              explanation: "O texto descreve claramente a dimensão doméstica e íntima da vida da igreja primitiva.",
            },
            {
              question: "Qual verbo Hebreus 10:24 usa para descrever como devemos tratar uns aos outros?",
              options: ["Ignorar", "Considerar/estimular deliberadamente", "Competir", "Evitar contato"],
              correctIndex: 1,
              explanation: "O texto pede atenção deliberada e contínua ao próximo, algo mais natural em grupos pequenos.",
            },
            {
              question: "Segundo esta trilha, como um pequeno grupo deve se relacionar com a igreja local?",
              options: [
                "Como uma entidade paralela e independente",
                "Substituindo a autoridade pastoral por líderes informais",
                "Sob a supervisão e doutrina da igreja local, servindo-a",
                "Sem qualquer conexão ou prestação de contas",
              ],
              correctIndex: 2,
              explanation: "Um bom pequeno grupo funciona como extensão da igreja local, não como substituto dela.",
            },
          ],
          application:
            "Se você ainda não participa de um pequeno grupo na sua igreja, inscreva-se em um esta semana. Se já participa, convide alguém que você sabe estar espiritualmente isolado para vir com você.",
          prayer:
            "Pai, obrigado por não nos chamares para uma fé solitária. Ajuda-me a encontrar (ou fortalecer) uma comunidade próxima de irmãos que me conheçam de verdade, que orem por mim e me chamem à responsabilidade. Que eu também seja esse tipo de irmão para outros. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Compartilhe com seu pequeno grupo (ou com um amigo cristão próximo) uma luta real que você está enfrentando, pedindo oração específica sobre ela.",
          reflectionQuestion:
            "Alguém na sua igreja te conhece o suficiente para perceber quando você está se afastando espiritualmente?",
          xp: 26,
        },
        {
          id: "il-4-2",
          title: "Disciplina Eclesiástica: Amor que Corrige",
          intro: [
            "Poucos temas assustam tanto os cristãos modernos quanto 'disciplina eclesiástica' — soa a julgamento, exposição pública e exclusão vingativa. Mas o texto que a institui, Mateus 18:15-17, tem um tom completamente diferente: é sobre amor que não desiste de um irmão que está se afastando em pecado não confessado.",
            "O processo que Jesus ensina é gradual e protetor: primeiro, uma conversa privada, a sós ('vá e, a sós com ele, mostre-lhe a sua falta'); se não houver arrependimento, leve uma ou duas testemunhas; só depois disso, envolva a igreja; e apenas como último recurso, se a pessoa persistir impenitente, ela é tratada como alguém fora da comunhão. Em nenhum momento o objetivo é humilhar — é 'ganhar' o irmão de volta (v. 15).",
            "Gálatas 6:1 mostra o espírito correto para esse processo: 'se alguém for surpreendido em algum pecado, vocês que são espirituais devem restaurá-lo com mansidão. Cuidado, porém, para que você também não seja tentado'. A restauração — não a punição — é o coração da disciplina bíblica, e quem corrige deve fazê-lo com humildade, sabendo que também é vulnerável à queda.",
            "Disciplina eclesiástica bem aplicada é, paradoxalmente, uma das expressões mais profundas do amor de uma igreja: ela recusa fingir que o pecado não importa, e recusa abandonar quem está preso a ele.",
          ],
          verses: [
            {
              ref: "Mateus 18:15-17",
              textByVersion: {
                NVI: "Se seu irmão pecar contra você, vá e, a sós com ele, mostre-lhe a sua falta. Se ele o ouvir, você ganhou seu irmão. Mas, se não o ouvir, leve consigo mais um ou dois... Se ele se recusar a ouvi-los, conte à igreja.",
                ACF: "Ora, se teu irmão pecar contra ti, vai, e repreende-o entre ti e ele só; se te ouvir, ganhaste a teu irmão; se, porém, não te ouvir, leva ainda contigo um ou dois... e, se recusar ouvi-los, dize-o à igreja.",
              },
            },
            {
              ref: "Gálatas 6:1",
              textByVersion: {
                NVI: "Irmãos, se alguém for surpreendido em algum pecado, vocês que são espirituais deverão restaurá-lo com mansidão. Cuidado, porém, para que vocês também não sejam tentados.",
                ACF: "Irmãos, se algum homem chegar a ser surpreendido em algum delito, vós, que sois espirituais, encaminhai o tal com espírito de mansidão; olhando por ti mesmo, para que não sejas também tentado.",
              },
              originals: [
                { word: "καταρτίζω", translit: "katartizō", meaning: "'restaurar, consertar, ajustar' — o mesmo termo usado para consertar redes de pesca; implica cuidado, não violência", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἐλέγχω", translit: "elenchō", meaning: "'repreender, mostrar a falta' — confrontar com o objetivo de trazer à luz e à correção, não humilhar", lang: "grego" },
            { word: "καταρτίζω", translit: "katartizō", meaning: "restaurar cuidadosamente — o objetivo final de toda disciplina bíblica genuína", lang: "grego" },
          ],
          deepDive:
            "É importante distinguir disciplina eclesiástica de pecados que exigem denúncia imediata às autoridades civis — como abuso, violência ou crimes contra menores. Mateus 18 descreve o processo pastoral comum para pecados pessoais e interpessoais; ele nunca substitui a responsabilidade legal e moral de proteger vítimas e reportar crimes às autoridades competentes. Além disso, esse processo pressupõe pecado claro e não confessado, não meras diferenças de opinião, gostos pessoais ou convicções secundárias — usar disciplina para forçar conformidade em áreas de liberdade cristã é um abuso grave desse instrumento bíblico.",
          theologianQuote: {
            author: "Jonathan Leeman",
            text: "A disciplina da igreja não existe para proteger a reputação da igreja, mas para proteger o Evangelho e, com amor, chamar o irmão de volta a ele.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Jonathan Leeman realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "1 Coríntios 5:4-5",
                textByVersion: {
                  NVI: "Quando vocês estiverem reunidos em nome de nosso Senhor Jesus... entreguem esse homem a Satanás, para a destruição da carne, a fim de que o seu espírito seja salvo no dia do Senhor.",
                },
              },
              {
                ref: "2 Coríntios 2:6-8",
                textByVersion: {
                  NVI: "Para esse homem, é suficiente o castigo que lhe foi imposto pela maioria. Agora, ao contrário, vocês devem perdoá-lo e consolá-lo, para que ele não seja dominado por excessiva tristeza. Por isso eu recomendo que vocês reafirmem o amor que têm por ele.",
                },
              },
            ],
            historicalContext:
              "A Reforma Protestante do século XVI recuperou a disciplina eclesiástica como uma das marcas essenciais de uma igreja verdadeira, ao lado da pregação fiel da Palavra e da correta administração das ordenanças — presente em confissões de fé reformadas da época. João Calvino a chamava de 'os nervos' que sustentam o corpo da igreja unido e saudável. Ao longo do século XX, porém, boa parte das igrejas evangélicas praticamente abandonou essa prática, temendo parecer legalista ou hostil.",
            theologicalDebate:
              "Há divergência sobre o quanto de um processo disciplinar deve ser comunicado publicamente à congregação, e em que estágio. Algumas igrejas comunicam apenas quando a pessoa se torna impenitente diante da igreja (o passo final de Mateus 18:17); outras comunicam desde etapas anteriores, buscando oração coletiva pelo processo. Ambas as práticas podem ser fiéis, desde que preservem primeiro a busca privada por restauração, e nunca exponham a pessoa de forma desnecessária ou vingativa.",
            secondQuote: {
              author: "João Calvino",
              text: "Assim como a salvação da alma consiste na doutrina de Cristo, também a disciplina serve como um freio para conter e domar os que se rebelam contra essa doutrina.",
            },
          },
          quizzes: [
            {
              question: "Qual é o primeiro passo indicado por Jesus em Mateus 18:15 diante do pecado de um irmão?",
              options: [
                "Expor publicamente o pecado imediatamente",
                "Uma conversa privada, a sós com a pessoa",
                "Excluir a pessoa da igreja sem conversa prévia",
                "Ignorar o problema, esperando que se resolva sozinho",
              ],
              correctIndex: 1,
              explanation: "O processo bíblico começa de forma privada e protetora, não pública.",
            },
            {
              question: "Segundo Gálatas 6:1, com que atitude a restauração deve ser feita?",
              options: ["Com dureza e distanciamento", "Com mansidão, e vigilância sobre a própria vulnerabilidade", "Com indiferença", "Com superioridade moral"],
              correctIndex: 1,
              explanation: "O texto pede mansidão e autoconsciência de que quem corrige também pode cair.",
            },
            {
              question: "O que esta trilha esclarece sobre os limites da disciplina eclesiástica segundo Mateus 18?",
              options: [
                "Ela substitui qualquer responsabilidade de reportar crimes às autoridades civis",
                "Ela deve ser usada para forçar conformidade em qualquer diferença de opinião",
                "Ela não substitui a obrigação de proteger vítimas e reportar crimes às autoridades competentes",
                "Ela é opcional e nunca deve ser praticada",
              ],
              correctIndex: 2,
              explanation: "Disciplina eclesiástica trata de pecado pessoal não confessado; crimes exigem reporte às autoridades.",
            },
          ],
          application:
            "Se você tem algo contra um irmão (ou sabe de um pecado não confessado em sua própria vida), dê o primeiro passo bíblico esta semana: busque uma conversa privada e humilde, em vez de guardar mágoa ou espalhar a questão para terceiros.",
          prayer:
            "Senhor, dá-me coragem para buscar reconciliação de forma bíblica, e humildade para receber correção quando eu for o que está errado. Que eu nunca use a disciplina como arma, mas sempre como expressão de amor que busca restaurar. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Examine se há alguma mágoa ou ofensa não resolvida entre você e um irmão na fé. Dê o passo de buscar uma conversa privada e humilde esta semana.",
          reflectionQuestion:
            "Você reage à correção como alguém que quer ser restaurado, ou como alguém que se defende a qualquer custo?",
          xp: 27,
        },
        {
          id: "il-4-3",
          title: "Pacificação: Vivendo em Paz na Igreja",
          intro: [
            "Onde há pessoas reais convivendo de perto, haverá conflito — e a igreja local não é exceção. A pergunta não é se conflitos vão acontecer, mas como lidamos com eles quando surgem. Romanos 12:18 estabelece o padrão: 'se for possível, quanto depender de vocês, vivam em paz com todos'.",
            "Jesus vai além de apenas tolerar conflitos — ele chama seus seguidores de 'pacificadores', prometendo que 'serão chamados filhos de Deus' (Mt 5:9). Pacificador, aqui, não é sinônimo de pessoa passiva que evita todo confronto; é alguém que ativamente busca reconciliação, mesmo quando isso exige coragem para confrontar com amor.",
            "Efésios 4:2-3 descreve as atitudes que sustentam a paz na igreja: 'toda humildade e mansidão, com paciência, suportando uns aos outros em amor, procurando com diligência guardar a unidade do Espírito pelo vínculo da paz'. Note que a unidade não é automática — ela exige diligência ativa e disposição para suportar as fraquezas alheias.",
            "Conflitos não resolvidos entre irmãos não ficam contidos — eles corroem a comunhão, dividem grupos, e frequentemente afastam pessoas da igreja por completo. Aprender a fazer as pazes biblicamente não é um dom espiritual raro; é uma disciplina que toda igreja saudável precisa cultivar em seus membros.",
          ],
          verses: [
            {
              ref: "Romanos 12:18",
              textByVersion: {
                NVI: "Se for possível, e quanto depender de vocês, vivam em paz com todos.",
                ACF: "Se for possível, quanto estiver em vós, tende paz com todos os homens.",
              },
            },
            {
              ref: "Mateus 5:9",
              textByVersion: {
                NVI: "Bem-aventurados os pacificadores, pois serão chamados filhos de Deus.",
                ACF: "Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.",
              },
              originals: [
                { word: "εἰρηνοποιός", translit: "eirēnopoios", meaning: "'pacificador' — aquele que faz, produz e constrói a paz ativamente, não apenas a deseja", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "εἰρηνοποιός", translit: "eirēnopoios", meaning: "pacificador — quem busca ativamente a reconciliação, não apenas evita conflito", lang: "grego" },
            { word: "καταλλαγή", translit: "katallagē", meaning: "'reconciliação' — a restauração de um relacionamento rompido, tema central do Evangelho (2 Co 5:18)", lang: "grego" },
          ],
          deepDive:
            "Fazer as pazes bíblicas não significa evitar todo desconforto ou fingir que ofensas não aconteceram. A verdadeira pacificação envolve, quando necessário, confrontar com amor (Gl 6:1, Mt 18:15), confessar a própria contribuição para o conflito, perdoar genuinamente a ofensa do outro, e buscar ativamente a reconciliação — mesmo quando isso é desconfortável. Ken Sande, fundador do ministério Peacemaker Ministries, descreve quatro compromissos práticos da reconciliação bíblica: (1) glorificar a Deus acima de 'ganhar' a discussão, (2) tirar a trave do próprio olho antes de apontar o cisco do outro, (3) restaurar suavemente, e (4) perdoar como Cristo perdoou.",
          theologianQuote: {
            author: "Ken Sande",
            text: "Conflito é uma oportunidade — de glorificar a Deus, servir aos outros e crescer para sermos mais como Cristo, não apenas um problema a evitar.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Ken Sande realmente escreveu/disse algo equivalente antes de publicar como citação literal",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Mateus 5:23-24",
                textByVersion: {
                  NVI: "Se você estiver apresentando sua oferta diante do altar e ali se lembrar de que seu irmão tem algo contra você, deixe sua oferta ali diante do altar e vá primeiro reconciliar-se com seu irmão; depois volte e apresente sua oferta.",
                },
              },
              {
                ref: "1 Coríntios 6:1,7",
                textByVersion: {
                  NVI: "Se algum de vocês tem uma queixa contra outro, ousa levar o caso a juízo perante os injustos, e não perante os santos?... O fato de haver litígios entre vocês já significa uma completa derrota.",
                },
              },
            ],
            historicalContext:
              "A partir da segunda metade do século XX, movimentos como o Peacemaker Ministries (fundado por Ken Sande) recuperaram, de forma sistemática, a prática da mediação e reconciliação bíblica entre cristãos, oferecendo uma alternativa explicitamente fiel a 1 Coríntios 6 — que repreende irmãos por levarem disputas entre si a tribunais seculares, em vez de resolvê-las dentro da comunidade da fé.",
            theologicalDebate:
              "Nem todo conflito exige o mesmo nível de intervenção: Provérbios 19:11 elogia quem 'passa por cima da ofensa' em assuntos menores, enquanto Mateus 18 prescreve um processo mais estruturado para pecados sérios e não confessados. Discernir quando simplesmente suportar com amor (Ef 4:2) e quando confrontar ativamente (Gl 6:1) exige sabedoria pastoral, e cristãos maduros podem, de boa fé, avaliar essa linha de forma diferente em situações específicas.",
            secondQuote: {
              author: "Corrie ten Boom",
              text: "O perdão é a chave que abre a porta do ressentimento e as algemas do ódio. É um ato de vontade, não um sentimento.",
            },
          },
          quizzes: [
            {
              question: "Segundo Romanos 12:18, qual é a condição para viver em paz com todos?",
              options: [
                "Nenhuma condição — é sempre garantido",
                "Quanto depender de nós, buscarmos ativamente a paz",
                "Apenas quando o outro pedir desculpas primeiro",
                "Somente com quem já concorda conosco",
              ],
              correctIndex: 1,
              explanation: "O texto reconhece que nem sempre a paz depende só de nós, mas exige nosso esforço ativo.",
            },
            {
              question: "O que significa, biblicamente, ser um 'pacificador' (Mateus 5:9)?",
              options: [
                "Evitar qualquer confronto, a qualquer custo",
                "Buscar ativamente a reconciliação, mesmo exigindo coragem",
                "Fingir que os conflitos não existem",
                "Concordar sempre com o outro para evitar desconforto",
              ],
              correctIndex: 1,
              explanation: "O termo grego implica ação — construir a paz, não apenas desejá-la passivamente.",
            },
            {
              question: "Segundo o resumo de Ken Sande citado nesta trilha, qual é o primeiro compromisso da reconciliação bíblica?",
              options: [
                "Vencer a discussão a qualquer custo",
                "Glorificar a Deus acima de 'ganhar' o conflito",
                "Ignorar a própria contribuição para o problema",
                "Esperar que o outro mude primeiro",
              ],
              correctIndex: 1,
              explanation: "O primeiro compromisso é buscar glorificar a Deus, e não simplesmente vencer a disputa.",
            },
          ],
          application:
            "Identifique um conflito não resolvido com um irmão na fé. Esta semana, dê o primeiro passo — seja pedindo perdão pela sua parte, seja buscando uma conversa honesta e cheia de graça para reconciliação.",
          prayer:
            "Senhor, tu és o Deus da reconciliação — reconciliaste-me contigo ao custo da cruz. Torna-me um pacificador na minha igreja: dá-me coragem para confrontar com amor, humildade para reconhecer minhas falhas, e graça para perdoar como fui perdoado. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Pratique um dos quatro compromissos da reconciliação bíblica citados nesta trilha em uma situação real de conflito (mesmo pequeno) que você esteja enfrentando.",
          reflectionQuestion:
            "Há algum conflito na sua igreja ou família que você tem evitado resolver? O que te impede de dar o primeiro passo?",
          xp: 27,
        },
        {
          id: "il-4-4",
          title: "Missão Corporativa: A Igreja Enviada",
          intro: [
            "Evangelismo pessoal é essencial, mas a Bíblia mostra algo além disso: igrejas inteiras, reunidas, enviando e sustentando missão juntas. Atos 13:1-3 registra o momento em que a igreja de Antioquia, reunida em jejum e oração, ouviu o Espírito Santo dizer 'separai-me a Barnabé e Saulo' e, como corpo, 'lhes impuseram as mãos e os despediram'. A missão nasceu de uma decisão corporativa, não apenas de uma iniciativa individual.",
            "Isso muda a forma como enxergamos missões: não é apenas 'os missionários lá fora fazendo o trabalho' enquanto a igreja local apenas observa. Filipenses 4:15-16 mostra a igreja de Filipos sustentando financeiramente o ministério de Paulo repetidas vezes — participando ativamente da obra, mesmo sem estar fisicamente presente no campo missionário.",
            "Toda igreja local tem um papel na missão de Deus, mesmo que a maioria dos membros nunca cruze uma fronteira: orando com constância pelos que foram enviados, sustentando financeiramente o trabalho missionário, mantendo contato pastoral com os obreiros, e mobilizando novos candidatos ao chamado missionário a partir da própria congregação.",
            "Uma igreja saudável não pergunta apenas 'quem entre nós vai?', mas 'como todos nós, juntos, enviamos, sustentamos e participamos da missão de Deus até os confins da terra?'.",
          ],
          verses: [
            {
              ref: "Atos 13:2-3",
              textByVersion: {
                NVI: "Enquanto adoravam ao Senhor e jejuavam, disse o Espírito Santo: 'Separem-me Barnabé e Saulo para a obra a que os tenho chamado'. Então, depois de jejuarem, orarem e lhes imporem as mãos, eles os enviaram.",
                ACF: "E, servindo eles ao Senhor, e jejuando, disse o Espírito Santo: Apartai-me a Barnabé e a Saulo para a obra para que os tenho chamado. Então, jejuando, e orando, e pondo sobre eles as mãos, os despediram.",
              },
              originals: [
                { word: "ἀφορίζω", translit: "aphorizō", meaning: "'separar, apartar para um propósito específico' — decisão tomada pela igreja reunida, conduzida pelo Espírito", lang: "grego" },
              ],
            },
            {
              ref: "Filipenses 4:15-16",
              textByVersion: {
                NVI: "Vocês mesmos sabem que, no início da obra do evangelho... nenhuma igreja participou comigo no dar e no receber, a não ser vocês somente; pois, estando eu ainda em Tessalônica, vocês me enviaram ajuda mais de uma vez para suprir as minhas necessidades.",
                ACF: "E bem sabeis também, ó filipenses, que, no princípio do evangelho... nenhuma igreja comunicou comigo em razão de dar e receber, senão vós somente; Porque também uma e outra vez me enviastes o necessário a Tessalônica.",
              },
            },
          ],
          keywords: [
            { word: "ἀφορίζω", translit: "aphorizō", meaning: "separar para um propósito — o ato corporativo da igreja de comissionar alguém para a missão", lang: "grego" },
            { word: "ἀποστέλλω", translit: "apostellō", meaning: "'enviar com autoridade e propósito' — raiz da palavra 'apóstolo', aquele que é enviado", lang: "grego" },
          ],
          deepDive:
            "É comum reduzir 'apoio a missões' a uma simples contribuição financeira mensal, sem qualquer outro envolvimento. Embora o sustento financeiro seja bíblico e necessário (Fp 4:15-16), o padrão de Antioquia em Atos 13 mostra um envolvimento mais profundo: a igreja orou e jejuou coletivamente antes de enviar, impôs as mãos como ato público de comissionamento, e manteve vínculo com os enviados — Paulo e Barnabé voltaram a Antioquia para relatar 'tudo quanto Deus fizera por meio deles' (At 14:27). Uma igreja que só transfere dinheiro, sem oração constante, comunicação e cuidado pastoral com seus missionários, perdeu a essência corporativa do envio bíblico.",
          theologianQuote: {
            author: "John Piper",
            text: "Missões existem porque a adoração não existe.",
            source: "Let the Nations Be Glad! The Supremacy of God in Missions",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Romanos 10:14-15",
                textByVersion: {
                  NVI: "Como, pois, invocarão aquele em quem não creram? E como crerão naquele de quem não ouviram falar? E como ouvirão, se não houver quem pregue? E como pregarão, se não forem enviados?",
                },
              },
              {
                ref: "3 João 1:5-8",
                textByVersion: {
                  NVI: "Amado, você é fiel no que faz pelos irmãos, mesmo sendo eles estranhos... Enviando-os em sua viagem de maneira digna de Deus, você fará bem. Pois eles saíram por causa do Nome... Portanto, devemos receber com hospitalidade a tais homens, para que sejamos cooperadores com a verdade.",
                },
              },
            ],
            historicalContext:
              "Em 1792, o pastor batista inglês William Carey — considerado o 'pai das missões modernas' — ajudou a fundar uma das primeiras sociedades missionárias organizadas por igrejas, num tempo em que muitos cristãos acreditavam que a Grande Comissão já havia sido cumprida apenas pelos apóstolos. Seu lema, 'esperai grandes coisas de Deus, empreendei grandes coisas para Deus', ajudou a inaugurar uma era de envio missionário corporativo e sistemático por igrejas locais e denominações inteiras.",
            theologicalDebate:
              "Hoje, igrejas fiéis diferem sobre o melhor modelo estrutural de envio: algumas enviam e sustentam missionários diretamente, sem intermediários; outras trabalham por meio de agências e juntas missionárias paraeclesiásticas especializadas, que oferecem suporte logístico, treinamento e cuidado que uma igreja local sozinha nem sempre consegue prover. Ambos os modelos podem glorificar a Deus, desde que a igreja local nunca terceirize por completo sua responsabilidade de oração, cuidado pastoral e conexão pessoal com quem enviou.",
            secondQuote: {
              author: "William Carey",
              text: "Esperai grandes coisas de Deus; empreendei grandes coisas para Deus.",
            },
          },
          quizzes: [
            {
              question: "Em Atos 13:2-3, quem toma a decisão de separar Barnabé e Saulo para a missão?",
              options: [
                "Apenas Barnabé e Saulo, individualmente, sem envolvimento da igreja",
                "A igreja reunida, em adoração e jejum, guiada pelo Espírito Santo",
                "Uma autoridade externa e distante da igreja local",
                "Uma votação sem qualquer busca espiritual prévia",
              ],
              correctIndex: 1,
              explanation: "O envio nasceu de um momento corporativo de adoração e busca do Espírito pela igreja reunida.",
            },
            {
              question: "Segundo Filipenses 4:15-16, como a igreja de Filipos participou da obra missionária de Paulo?",
              options: [
                "Apenas orando, sem qualquer outro tipo de apoio",
                "Sustentando financeiramente o ministério dele repetidas vezes",
                "Enviando membros para substituí-lo no campo",
                "De forma alguma — permaneceram alheios ao trabalho dele",
              ],
              correctIndex: 1,
              explanation: "O texto menciona claramente o apoio financeiro repetido da igreja de Filipos a Paulo.",
            },
            {
              question: "Segundo esta trilha, o que caracteriza um envolvimento corporativo mais completo com a missão, além do dinheiro?",
              options: [
                "Nada além do sustento financeiro é necessário",
                "Oração constante, comunicação e cuidado pastoral com os enviados",
                "Ignorar os missionários após o envio inicial",
                "Delegar toda a responsabilidade a agências externas, sem envolvimento da igreja",
              ],
              correctIndex: 1,
              explanation: "O padrão de Atos 13 e 14 mostra vínculo contínuo — oração, comissionamento e prestação de contas mútua.",
            },
          ],
          application:
            "Descubra quais missionários ou projetos missionários sua igreja apoia atualmente. Escolha um deles para orar especificamente por nome esta semana, e considere enviar uma mensagem de encorajamento direto.",
          prayer:
            "Senhor da messe, obrigado por incluíres minha igreja local na tua missão de alcançar as nações. Ajuda-nos a ser uma igreja que não apenas contribui financeiramente, mas ora com constância, se importa genuinamente e participa de coração da tua obra até os confins da terra. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Ore diariamente por um missionário específico apoiado pela sua igreja durante toda esta semana, e envie a ele (ou à família dele) uma palavra de encorajamento.",
          reflectionQuestion:
            "Sua igreja local tem sido apenas espectadora ou participante ativa na missão de Deus pelo mundo?",
          xp: 29,
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
            source: "Reflete o tema central de Tim Keller em O Significado do Casamento (The Meaning of Marriage): o egocentrismo, não a incompatibilidade, é a raiz da maioria dos problemas conjugais.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Malaquias 2:14-15",
                textByVersion: {
                  NVI: "Vocês perguntam por quê. É porque o Senhor está agindo como testemunha entre você e a mulher da sua mocidade, à qual você foi infiel, embora ela seja sua companheira, sua mulher por aliança... Portanto, tenham cuidado com o seu próprio espírito, e nenhum de vocês seja infiel à mulher da sua mocidade.",
                },
              },
            ],
            historicalContext:
              "No Antigo Oriente Próximo, o casamento normalmente envolvia acordos entre famílias, dote e proteção legal da esposa — mas o profeta Malaquias vai além da mera formalidade civil ao chamar Deus de 'testemunha' da aliança conjugal (Ml 2:14). Isso elevava o casamento israelita acima dos padrões meramente contratuais das culturas vizinhas: quebrar a aliança matrimonial não era apenas descumprir um acordo social, era pecar diante de Deus, que selou aquela união como testemunha pessoal.",
            exegeticalNotes:
              "A palavra grega 'mystērion' em Efésios 5:32 não significa algo misterioso e incompreensível, mas uma verdade que estava oculta e agora foi plenamente revelada em Cristo. Paulo não está inventando uma alegoria a partir de Gênesis 2:24 — ele está mostrando, com autoridade apostólica, que o padrão de aliança e união estabelecido na criação sempre apontou, na intenção de Deus, para o relacionamento final entre Cristo e sua igreja.",
            theologicalDebate:
              "Cristãos evangélicos fiéis interpretam de formas diferentes o que significa o marido ser 'cabeça' da esposa em Efésios 5:23. A posição complementarista entende que há uma diferença de papéis (não de valor) entre marido e mulher, com o marido chamado a um tipo específico de liderança servil, sacrificial. A posição igualitarista entende que 'cabeça' descreve origem ou fonte, e que a ênfase do texto está inteiramente na submissão mútua e no amor sacrificial, sem hierarquia funcional fixa. Ambas as posições afirmam a igualdade plena de valor entre homem e mulher diante de Deus (Gl 3:28) e concordam que o texto exige, de qualquer forma, um amor que se entrega — a diferença está em como aplicar a liderança dentro do lar. Esta é uma questão secundária entre irmãos que compartilham o mesmo Evangelho.",
            secondQuote: {
              author: "C.S. Lewis",
              text: "O amor humano do casamento, quando vivido segundo o desenho de Deus, não é apenas um sentimento — é uma promessa que continua amando mesmo quando o sentimento momentaneamente falha.",
              source: "Reflete o conceito de amor como 'estado da vontade, não do sentimento' de C.S. Lewis em Cristianismo Puro e Simples (Mere Christianity), Livro III, capítulo sobre Caridade.",
            },
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
            source: "Reflete a leitura de John Stott sobre Efésios 5 em seu comentário A Mensagem de Efésios (God's New Society), no qual a liderança do marido é modelada pelo amor sacrificial de Cristo.",
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
      title: "Módulo II: Comunicação, Conflito e Perdão no Casamento",
      lessons: [
        {
          id: "fc-2-1",
          title: "Falando a Verdade em Amor",
          intro: [
            "Todo casamento é feito de duas pessoas pecadoras tentando viver 'uma só carne'. Isso significa que o conflito não é sinal de que algo deu errado — é parte esperada da vida a dois neste mundo caído. A pergunta bíblica não é 'como evitar todo conflito?', mas 'como conversar e discordar de um jeito que honre a Deus e edifique o casamento?'.",
            "Efésios 4:15 dá a chave: 'seguindo a verdade em amor'. São duas coisas que muitos casais separam, para o próprio mal. Alguns falam a verdade sem amor — de forma dura, sarcástica, humilhante — e chamam isso de 'sinceridade'. Outros oferecem um amor sem verdade — evitam todo assunto difícil para preservar uma paz aparente — e chamam isso de 'não brigar'. A Bíblia pede as duas coisas juntas: honestidade real, entregue com gentileza real.",
            "Tiago 1:19 acrescenta um princípio prático poderoso: 'seja pronto para ouvir, tardio para falar, tardio para se irar'. A ordem importa. A maioria dos conflitos conjugais piora não porque os cônjuges discordam, mas porque falam antes de realmente ouvir, e reagem com irritação antes de buscar entender. Comunicação bíblica começa com os ouvidos, não com a boca.",
          ],
          verses: [
            {
              ref: "Efésios 4:15,29",
              textByVersion: {
                NVI: "Seguindo a verdade em amor, cresçamos em tudo naquele que é a cabeça, Cristo... Não saia da boca de vocês nenhuma palavra corrompida, mas apenas a que for útil para edificar os outros.",
                ACF: "Antes, seguindo a verdade em amor, cresçamos em tudo naquele que é a cabeça, Cristo... Não saia da vossa boca nenhuma palavra torpe, mas só a que for boa para promover a edificação.",
              },
              originals: [
                { word: "ἀληθεύοντες", translit: "alētheuontes", meaning: "vivendo/falando a verdade — particípio contínuo, um estilo de vida sincero, não apenas um ato isolado", lang: "grego" },
              ],
            },
            {
              ref: "Tiago 1:19",
              textByVersion: {
                NVI: "Que todo homem seja pronto para ouvir, tardio para falar e tardio para irar-se.",
              },
            },
          ],
          keywords: [
            { word: "ἀληθεύω", translit: "alētheuō", meaning: "falar/viver a verdade com constância — não é confrontação pontual, é um caráter de honestidade contínua", lang: "grego" },
            { word: "οἰκοδομή", translit: "oikodomē", meaning: "edificação — o critério bíblico para saber se uma fala é útil: ela constrói ou destrói o outro?", lang: "grego" },
          ],
          deepDive:
            "Efésios 4:29 dá um teste prático extremamente útil antes de qualquer conversa difícil no casamento: essa palavra vai edificar ('oikodomē') ou vai destruir? Isso não significa evitar temas difíceis — significa escolher o momento, o tom e as palavras que constroem, mesmo quando o conteúdo é uma correção necessária. Sobre técnicas específicas de comunicação (linguagem não violenta, tempo de fala, métodos de resolução de conflito), a Bíblia não prescreve uma metodologia única — são ferramentas humanas que podem, sim, ajudar bastante quando usadas dentro do caráter descrito em Efésios 4 e Tiago 1: verdade, amor, prontidão para ouvir e lentidão para se irar. A ferramenta serve ao caráter; o caráter não nasce da ferramenta.",
          theologianQuote: {
            author: "Charles Swindoll",
            text: "A comunicação no casamento não é sobre vencer o argumento, é sobre entender o coração do outro; quando entendemos primeiro, quase sempre falamos diferente depois.",
            source: "Reflete a ênfase de Charles Swindoll sobre relacionamentos e serviço mútuo em Aperfeiçoando seu Caráter (Improving Your Serve).",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Provérbios 15:1",
                textByVersion: {
                  NVI: "A resposta calma desvia a fúria, mas a palavra ríspida desperta a ira.",
                },
              },
            ],
            historicalContext:
              "Éfeso, no primeiro século, era uma cidade portuária cosmopolita, marcada por códigos domésticos greco-romanos que regulavam rigidamente a autoridade do chefe da casa sobre esposa, filhos e escravos, quase sempre em uma única via. Ao escrever sobre o lar em Efésios 4-6, Paulo usa parte dessa estrutura cultural conhecida, mas a transforma radicalmente ao fundamentar tudo em submissão mútua 'por temor a Cristo' (Ef 5:21) e amor sacrificial — um padrão de reciprocidade estranho para os ouvidos daquela cultura.",
            exegeticalNotes:
              "Em Efésios 4:29, a palavra grega 'oikodomē' (edificação, construção) descreve literalmente o ato de erguer um edifício. Paulo pede que cada palavra dita no lar passe por esse teste: ela constrói ou destrói? Já em Efésios 4:26, 'irritai-vos, e não pequeis' reconhece que a raiva em si não é automaticamente pecado — a Escritura distingue entre sentir raiva diante de uma injustiça real e permitir que essa raiva vire amargura, vingança ou pecado não resolvido antes do anoitecer.",
            theologicalDebate:
              "Existem diferentes escolas evangélicas de aconselhamento sobre técnicas específicas de comunicação conjugal (métodos estruturados de fala e escuta, terapia de casal cristã, aconselhamento bíblico biblicamente centrado). A Escritura não prescreve uma técnica única e universal para resolver conflitos — ela estabelece princípios claros (verdade, amor, humildade, perdão) que podem ser aplicados por meio de diferentes métodos pastorais responsáveis. Diante de conflitos conjugais persistentes ou dolorosos, buscar aconselhamento de um pastor ou conselheiro cristão qualificado é sabedoria, não fraqueza.",
            secondQuote: {
              author: "Larry Crabb",
              text: "Muitos conflitos no casamento não são, no fundo, sobre o assunto discutido, mas sobre feridas mais profundas do coração que ainda não foram trazidas honestamente diante de Deus e do cônjuge.",
              source: "Reflete a tese central de Larry Crabb em Por Dentro e Por Fora (Inside Out): conflitos superficiais geralmente escondem feridas mais profundas do coração.",
            },
          },
          quizzes: [
            {
              question: "Segundo Efésios 4:15, como a verdade deve ser comunicada entre cristãos, especialmente no casamento?",
              options: [
                "Com dureza, priorizando estar certo acima de tudo",
                "Em amor, buscando o crescimento mútuo",
                "Evitando qualquer confronto ou correção",
                "Apenas por meio de terceiros, nunca diretamente",
              ],
              correctIndex: 1,
              explanation: "O texto une verdade e amor como inseparáveis: falar a verdade sem amor fere; amar sem verdade não edifica.",
            },
            {
              question: "De acordo com Tiago 1:19, qual é a ordem recomendada diante de um conflito?",
              options: [
                "Falar primeiro para deixar claro o próprio ponto de vista",
                "Ser pronto para ouvir, tardio para falar e tardio para se irar",
                "Evitar completamente qualquer conversa sobre o assunto",
                "Reagir imediatamente para não perder a oportunidade de se defender",
              ],
              correctIndex: 1,
              explanation: "Tiago inverte o instinto natural: primeiro ouvir, depois falar, e por último — se necessário — expressar irritação, com cautela.",
            },
          ],
          application:
            "Na próxima conversa difícil com seu cônjuge (ou familiar próximo), pratique o padrão de Tiago 1:19: escute completamente antes de responder, repita o que entendeu com suas próprias palavras, e só então fale sua posição, com gentileza.",
          prayer:
            "Senhor, ensina-me a falar a verdade com amor e a ouvir antes de responder. Perdoa-me pelas vezes em que usei palavras para ferir, ou pelo silêncio para evitar covardemente uma verdade necessária. Faz das minhas palavras, especialmente dentro de casa, instrumentos de edificação e não de destruição. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha um assunto pendente e não resolvido no seu casamento (ou relacionamento próximo) e agende um momento específico, sem pressa, para conversar sobre ele seguindo o padrão de 'ouvir primeiro, falar depois, com verdade e amor'.",
          reflectionQuestion:
            "Nos seus conflitos mais recentes, você tem priorizado ser entendido ou entender o outro primeiro? O que isso revela sobre o seu coração?",
          xp: 27,
        },
        {
          id: "fc-2-2",
          title: "Perdão Conjugal: Não Deixando o Sol se Pôr",
          intro: [
            "Nenhum casamento sobrevive sem perdão constante, porque nenhum casamento é feito de duas pessoas perfeitas. Paulo é direto em Efésios 4:26: 'não se ponha o sol sobre a vossa ira' — um princípio que, aplicado ao casamento, significa não deixar mágoas se acumularem em silêncio, dia após dia, até formarem uma distância que parece impossível de atravessar.",
            "O perdão bíblico não é fingir que a ofensa não doeu, nem é dizer 'tudo bem' quando não está tudo bem. Perdão é uma decisão, tomada diante de Deus, de não cobrar mais a dívida do outro — mesmo sentindo a dor da ofensa. Colossenses 3:13 conecta diretamente o perdão conjugal ao perdão que já recebemos: 'perdoando-vos uns aos outros... como o Senhor vos perdoou, assim fazei vós também'.",
            "Isso não significa que toda mágoa deva ser varrida para debaixo do tapete sem conversa. Perdão genuíno geralmente caminha junto com uma conversa honesta sobre o que doeu (Mt 18:15) — mas o objetivo final dessa conversa nunca é vencer ou fazer o outro se sentir pior; é reconciliação. Casais que aprendem a pedir perdão rápido e a perdoar de verdade constroem, ao longo dos anos, uma intimidade que casais que acumulam ressentimento nunca alcançam.",
          ],
          verses: [
            {
              ref: "Efésios 4:26,32",
              textByVersion: {
                NVI: "Quando ficarem irados, não pequem. Que o sol não se ponha estando vocês ainda irados... Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus perdoou vocês em Cristo.",
                ACF: "Irai-vos, e não pequeis; não se ponha o sol sobre a vossa ira... Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.",
              },
            },
            {
              ref: "Colossenses 3:13",
              textByVersion: {
                NVI: "Suportem-se uns aos outros e perdoem as ofensas que tiverem uns contra os outros. Perdoem como o Senhor lhes perdoou.",
              },
              originals: [
                { word: "χαρίζομαι", translit: "charizomai", meaning: "perdoar generosamente, por graça — a mesma raiz de 'charis' (graça); perdão como dádiva imerecida, não obrigação fria", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "χαρίζομαι", translit: "charizomai", meaning: "conceder por graça, perdoar — refletindo o mesmo perdão gracioso recebido de Deus", lang: "grego" },
            { word: "παροργισμός", translit: "parorgismos", meaning: "irritação intensa, ira prolongada — o tipo de raiva que Efésios 4:26 pede que não se estenda além de um dia", lang: "grego" },
          ],
          deepDive:
            "O mandamento 'não se ponha o sol sobre a vossa ira' não exige que todo conflito seja totalmente resolvido em vinte e quatro horas — algumas questões são complexas e exigem várias conversas. O que o texto exige é que a ira não seja alimentada em silêncio, sem intenção de reconciliação; que haja, ainda naquele dia, uma disposição de coração para buscar a paz, mesmo que os detalhes práticos levem mais tempo para se resolver. Sobre a diferença entre perdão e reconciliação plena: o perdão é uma decisão unilateral, que o ofendido pode tomar diante de Deus independentemente da resposta do outro; a reconciliação plena da relação normalmente exige arrependimento genuíno e, em casos de ofensa repetida ou grave, tempo, mudança comprovada de comportamento e, muitas vezes, o acompanhamento de um pastor ou conselheiro cristão maduro.",
          theologianQuote: {
            author: "Lucas Gesta",
            text: "Perdoar no casamento não é dizer que a dor não existiu; é escolher, todos os dias, não usar essa dor como arma contra quem já pediu perdão — porque foi assim que Cristo nos tratou.",
            source: "Reflete a ênfase pastoral de Lucas Gesta sobre o perdão conjugal como reflexo do perdão recebido em Cristo.",
          },
          quizzes: [
            {
              question: "O que Efésios 4:26 ensina sobre lidar com a ira dentro do casamento?",
              options: [
                "Que a raiva nunca deve ser sentida por um cristão",
                "Que a ira não deve ser alimentada além do mesmo dia, sem buscar reconciliação",
                "Que é melhor guardar a mágoa até se sentir totalmente pronto para perdoar",
                "Que expressar irritação é sempre pecado",
              ],
              correctIndex: 1,
              explanation: "O texto não proíbe sentir irritação, mas proíbe deixá-la se acumular sem resolução, dia após dia.",
            },
            {
              question: "Segundo Colossenses 3:13, qual é o modelo e o motivo para o perdão conjugal?",
              options: [
                "Perdoar apenas quando o outro merecer",
                "Perdoar como o Senhor perdoou — por graça, generosamente",
                "Perdoar somente após uma punição adequada",
                "Evitar perdoar para não parecer fraco",
              ],
              correctIndex: 1,
              explanation: "O padrão do perdão cristão é o próprio perdão de Deus em Cristo — gracioso e imerecido.",
            },
          ],
          application:
            "Se há uma mágoa não resolvida no seu casamento (ou em outro relacionamento próximo), dê o primeiro passo esta semana: peça perdão por sua parte no conflito, mesmo que a outra pessoa também tenha errado, e ofereça perdão genuíno pela parte dela.",
          prayer:
            "Pai, obrigado por teres me perdoado em Cristo quando eu não merecia. Ensina-me a oferecer esse mesmo perdão a quem me ofende, especialmente dentro de casa. Não deixe que o orgulho me faça guardar mágoa além da conta. Onde há reconciliação pendente na minha vida, dá-me coragem para buscá-la hoje. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva (só para você, não precisa mostrar a ninguém) uma lista de pequenas mágoas que você tem guardado silenciosamente contra seu cônjuge ou familiar próximo, e entregue cada uma delas a Deus em oração, decidindo, uma a uma, perdoar.",
          reflectionQuestion:
            "Existe alguma mágoa em sua casa que 'o sol já se pôs' várias vezes sobre ela? O que está te impedindo de buscar reconciliação hoje?",
          xp: 27,
        },
      ],
    },
    {
      id: "fc-mod-3",
      title: "Módulo III: Intimidade Sexual e Pureza Conjugal",
      lessons: [
        {
          id: "fc-3-1",
          title: "O Design de Deus para a Intimidade Sexual",
          intro: [
            "A sexualidade não é um tema que a Bíblia evita ou trata com vergonha — é um dom criado por Deus, declarado 'muito bom' junto com o restante da criação (Gn 1:31). Antes de qualquer discussão sobre limites e pureza, é preciso afirmar isso com clareza: Deus é o autor da sexualidade, e o prazer dentro do desenho dele não é pecado, é presente.",
            "1 Coríntios 7 ensina que, dentro do casamento, a intimidade sexual é mútua, generosa e não deve ser negada como forma de controle ou punição: 'o marido cumpra o dever conjugal para com a mulher, e da mesma forma a mulher para com o marido' (v.3). O texto descreve reciprocidade e cuidado mútuo, não um direito unilateral de um cônjuge sobre o outro.",
            "Hebreus 13:4 resume o princípio bíblico com uma frase equilibrada: 'o matrimônio seja honrado por todos, e o leito conjugal seja mantido puro'. Duas coisas juntas: honra ao casamento como instituição valiosa, e pureza do leito conjugal — o que implica tanto guardar a sexualidade para dentro da aliança do casamento quanto desfrutá-la livremente e sem culpa dentro dela.",
          ],
          verses: [
            {
              ref: "Hebreus 13:4",
              textByVersion: {
                NVI: "O matrimônio seja honrado por todos, e a união conjugal, mantida pura, pois Deus julgará os imorais e os adúlteros.",
                ACF: "Honroso seja entre todos o matrimônio e o leito sem mácula; porém aos fornicadores e adúlteros Deus os julgará.",
              },
              originals: [
                { word: "τίμιος", translit: "timios", meaning: "honroso, precioso, de grande valor — o casamento (e o que acontece dentro dele) tem valor e dignidade diante de Deus", lang: "grego" },
              ],
            },
            {
              ref: "1 Coríntios 7:3-5",
              textByVersion: {
                NVI: "O marido cumpra o dever conjugal para com sua mulher, e da mesma forma a mulher para com o marido... Não se recusem um ao outro.",
              },
            },
          ],
          keywords: [
            { word: "τίμιος", translit: "timios", meaning: "honroso, de valor precioso — descreve tanto o casamento quanto a intimidade sexual dentro dele", lang: "grego" },
            { word: "ἀμίαντος", translit: "amiantos", meaning: "não contaminado, puro — o 'leito conjugal' descrito como algo a ser preservado sem mancha", lang: "grego" },
          ],
          deepDive:
            "É significativo que Hebreus 13:4 coloque honra e pureza lado a lado, sem contradição: a Bíblia nunca ensina que sexualidade seja algo sujo que precise apenas ser tolerado para fins de procriação — ela é chamada de 'honrosa'. Ao mesmo tempo, 1 Coríntios 7:3-5 ensina generosidade mútua dentro do casamento, incluindo até mesmo a orientação de que privações prolongadas da intimidade conjugal, quando não acordadas por ambos e por um tempo limitado (geralmente para oração, v.5), podem abrir espaço para tentação. Sobre questões práticas específicas de vida sexual dentro do casamento — frequência, expressões de intimidade, desafios físicos ou emocionais —, a Bíblia estabelece princípios de honra, pureza, generosidade mútua e ausência de coerção, mas não um manual detalhado; casais que enfrentam dificuldades nessa área fazem bem em buscar, com humildade, aconselhamento pastoral ou profissional cristão qualificado.",
          theologianQuote: {
            author: "Tim Keller",
            text: "O sexo dentro do casamento não é apenas permitido, é celebrado pela Escritura, como uma linguagem de entrega total, corpo e alma, dentro da segurança de uma aliança que promete permanecer.",
            source: "Reflete a leitura de Tim Keller sobre sexualidade e aliança em O Significado do Casamento (The Meaning of Marriage), em diálogo com Cantares dos Cânticos.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "1 Coríntios 6:18-20",
                textByVersion: {
                  NVI: "Fujam do pecado sexual!... Vocês não sabem que o seu corpo é santuário do Espírito Santo? ... Vocês não são de vocês mesmos; vocês foram comprados por bom preço. Portanto, glorifiquem a Deus com o seu corpo.",
                },
              },
            ],
            historicalContext:
              "Corinto, no primeiro século, era famosa em todo o mundo greco-romano por sua permissividade sexual, incluindo prostituição associada a templos pagãos. A igreja em Corinto refletia essa tensão cultural de dois extremos: alguns membros toleravam imoralidade sexual flagrante (1 Co 5), enquanto outros, talvez reagindo contra isso, promoviam um ascetismo exagerado dentro do próprio casamento, evitando a intimidade conjugal como se fosse mais 'espiritual' (1 Co 7:1). Paulo corrige os dois extremos com o mesmo texto.",
            exegeticalNotes:
              "Em 1 Coríntios 7:3-5, Paulo usa a palavra grega 'opheilē' (dívida, obrigação devida) para descrever o dever conjugal mútuo — um termo comercial forte, incomum nesse contexto. Ele também afirma que a esposa tem 'exousia' (autoridade) sobre o corpo do marido, e vice-versa — uma reciprocidade radical para os padrões daquela cultura, onde normalmente apenas o homem teria autoridade assumida sobre o corpo da esposa.",
            theologicalDebate:
              "Sobre a duração e a forma de abstinência conjugal por motivo de oração (1 Co 7:5), a Bíblia não prescreve um período fixo ou obrigatório — apenas orienta que seja breve, combinada mutuamente, e não usada como forma de controle ou punição. Sobre questões práticas específicas do casal (planejamento familiar, dificuldades de intimidade, feridas de relacionamentos ou experiências passadas), a Escritura estabelece princípios claros de pureza, generosidade e exclusividade, mas a aplicação prática de cada situação particular é melhor conduzida em conversa honesta com um pastor ou conselheiro cristão de confiança.",
            secondQuote: {
              author: "David Merkh",
              text: "A intimidade sexual no casamento cristão não existe apenas para o prazer do casal, mas como selo repetido de uma aliança que Deus testemunhou e que o casal renova, corpo e alma, um ao outro.",
              source: "Reflete a ênfase do ministério de casais e famílias de David Merkh sobre a intimidade sexual como selo renovado da aliança conjugal.",
            },
          },
          quizzes: [
            {
              question: "Segundo Hebreus 13:4, como a Bíblia descreve a união conjugal dentro do casamento?",
              options: [
                "Como algo vergonhoso, apenas tolerado",
                "Como honrosa e a ser mantida pura",
                "Como irrelevante para a vida espiritual",
                "Como opcional, sem importância real",
              ],
              correctIndex: 1,
              explanation: "O texto une honra e pureza: a intimidade conjugal é valiosa aos olhos de Deus quando vivida dentro do casamento.",
            },
            {
              question: "O que 1 Coríntios 7:3-5 ensina sobre a intimidade sexual entre marido e mulher?",
              options: [
                "Que deve ser negada como forma de controle sobre o cônjuge",
                "Que envolve reciprocidade e cuidado mútuo, sem recusa unilateral",
                "Que é opcional e sem relevância espiritual no casamento",
                "Que compete apenas ao marido decidir sozinho",
              ],
              correctIndex: 1,
              explanation: "O texto descreve um dever mútuo, dado e recebido por ambos os cônjuges com generosidade.",
            },
          ],
          application:
            "Se você é casado, converse com seu cônjuge, com honestidade e sem constrangimento, sobre como vocês têm cultivado (ou negligenciado) essa área da intimidade conjugal. Se você não é casado, guarde seu coração e corpo dentro do padrão bíblico, confiando que o desenho de Deus para essa área da vida é bom, mesmo quando exige espera.",
          prayer:
            "Senhor, obrigado por teres criado a intimidade conjugal como um dom bom, e não como algo vergonhoso. Ajuda-me a honrar esse dom — seja guardando-o com pureza até o casamento, seja cultivando-o com generosidade dentro dele. Guarda meu coração de qualquer visão distorcida sobre sexualidade, seja de vergonha excessiva, seja de libertinagem. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Se casado(a), tenha uma conversa aberta e gentil com seu cônjuge sobre essa área do casamento nesta semana. Se solteiro(a), escreva uma oração pedindo a Deus força e clareza para guardar a pureza até o momento certo.",
          reflectionQuestion:
            "Sua visão sobre sexualidade tem sido moldada mais pela cultura ao redor ou pelo desenho bíblico de honra, pureza e generosidade mútua dentro do casamento?",
          xp: 26,
        },
        {
          id: "fc-3-2",
          title: "Guardando a Fidelidade e a Pureza do Coração",
          intro: [
            "Jesus elevou o padrão de pureza sexual muito além do simples ato externo: 'todo aquele que olhar para uma mulher e a cobiçar, em seu coração já cometeu adultério com ela' (Mt 5:28). Isso não é uma regra extra e opressiva — é uma revelação de que o pecado sexual sempre começa no coração, muito antes de qualquer ato visível, e que a verdadeira pureza precisa alcançar os pensamentos, não apenas o comportamento.",
            "Vivemos numa cultura onde a tentação sexual — pela pornografia, por relacionamentos fora do casamento, por fantasias alimentadas em segredo — está a um clique de distância. Paulo é direto sobre a estratégia diante disso: 'fujam da imoralidade sexual' (1 Co 6:18). Não 'resistam bravamente enquanto ficam perto da tentação', mas fujam — reconheçam os próprios pontos fracos e tomem distância deles, com humildade e prontidão.",
            "1 Coríntios 6:19-20 dá a razão mais profunda para essa fuga: 'vocês não sabem que o corpo de vocês é santuário do Espírito Santo?... vocês foram comprados por preço. Portanto, glorifiquem a Deus com o corpo'. A pureza sexual não é uma regra arbitrária — é uma resposta de gratidão de quem entende que seu corpo já não lhe pertence, mas foi comprado pelo sangue de Cristo.",
          ],
          verses: [
            {
              ref: "Mateus 5:27-28",
              textByVersion: {
                NVI: "Vocês ouviram o que foi dito: 'Não adulterarás'. Mas eu digo: qualquer que olhar para uma mulher e a cobiçar, em seu coração já cometeu adultério com ela.",
              },
            },
            {
              ref: "1 Coríntios 6:18-20",
              textByVersion: {
                NVI: "Fujam da imoralidade sexual... vocês não sabem que o corpo de vocês é santuário do Espírito Santo?... Portanto, glorifiquem a Deus com o corpo de vocês.",
              },
              originals: [
                { word: "φεύγετε", translit: "pheugete", meaning: "fujam — imperativo presente, ação contínua e ativa de se afastar da tentação, não passividade", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "φεύγω", translit: "pheugō", meaning: "fugir — a estratégia bíblica diante da tentação sexual é distância ativa, não confronto direto", lang: "grego" },
            { word: "ναός", translit: "naos", meaning: "santuário, templo interior — o corpo do cristão é descrito como lugar sagrado onde o Espírito habita", lang: "grego" },
          ],
          deepDive:
            "Jesus, em Mateus 5:27-28, não está dizendo que sentir uma atração inicial seja, por si só, pecado equivalente ao adultério — ele está confrontando a cobiça deliberada e cultivada, o ato voluntário da mente e do coração de alimentar um desejo que sabe ser errado. A diferença é sutil, mas importante pastoralmente: sentir uma tentação não é falha moral automática; ceder a ela em pensamento, alimentá-la, é. Sobre a luta específica com pornografia, fantasias recorrentes ou tentações que parecem incontroláveis, a Bíblia oferece o caminho de 1 Coríntios 6 e 10:13 (Deus sempre provê uma saída), mas reconhece que padrões enraizados de pecado sexual muitas vezes exigem, além do arrependimento individual, prestação de contas em comunidade, confissão a alguém de confiança (Tg 5:16) e, quando necessário, acompanhamento pastoral e profissional — buscar ajuda não é fraqueza espiritual, é sabedoria bíblica.",
          theologianQuote: {
            author: "C.S. Lewis",
            text: "A verdadeira luta pela pureza não se vence apenas recusando o pecado, mas descobrindo em Cristo uma alegria maior do que qualquer coisa que o pecado promete e nunca cumpre.",
            source: "Reflete a argumentação de C.S. Lewis em Cristianismo Puro e Simples (Mere Christianity), capítulo 'Moralidade Sexual', sobre o apetite desordenado e a verdadeira satisfação encontrada em Deus.",
          },
          quizzes: [
            {
              question: "Segundo Mateus 5:27-28, o que Jesus revela sobre a origem do pecado sexual?",
              options: [
                "Que ele só existe quando há um ato físico externo",
                "Que já começa no coração, na cobiça deliberadamente cultivada",
                "Que é irrelevante para a vida espiritual",
                "Que apenas as mulheres precisam se preocupar com esse padrão",
              ],
              correctIndex: 1,
              explanation: "Jesus eleva o padrão para o coração: a cobiça cultivada já é, moralmente, o início do adultério.",
            },
            {
              question: "Qual estratégia Paulo recomenda em 1 Coríntios 6:18 diante da tentação sexual?",
              options: [
                "Permanecer perto da tentação para provar força de vontade",
                "Fugir ativamente, tomando distância da situação de risco",
                "Ignorar completamente o assunto, sem qualquer cuidado prático",
                "Enfrentar a tentação sozinho, sem buscar ajuda de ninguém",
              ],
              correctIndex: 1,
              explanation: "O verbo grego indica ação contínua de fuga ativa — afastamento deliberado, não confronto direto e arriscado.",
            },
          ],
          application:
            "Identifique, com honestidade diante de Deus, uma área específica de vulnerabilidade sexual em sua vida (pensamentos, conteúdo consumido, situações de risco) e dê um passo prático e concreto de 'fuga' esta semana — um bloqueio, uma prestação de contas a alguém de confiança, uma mudança de hábito.",
          prayer:
            "Senhor, meu corpo é teu, comprado pelo sangue de Cristo. Perdoa-me pelas vezes em que tratei minha pureza com descuido, seja em pensamentos, seja em atos. Dá-me força para fugir da tentação, não para flertar com ela. Faz de mim alguém que glorifica a ti com o corpo, dentro e fora do casamento. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Se necessário, converse com alguém maduro na fé (cônjuge, líder, discipulador) sobre uma luta de pureza que você tem enfrentado em segredo — a confissão em comunidade é um dos meios bíblicos mais poderosos de libertação (Tg 5:16).",
          reflectionQuestion:
            "Existe alguma área da sua vida sexual — pensamentos, hábitos, relacionamentos — que você tem escondido até de Deus? O que te impede de trazê-la à luz?",
          xp: 29,
        },
      ],
    },
    {
      id: "fc-mod-4",
      title: "Módulo IV: Filhos e o Altar Doméstico",
      lessons: [
        {
          id: "fc-4-1",
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
            { word: "νουθεσία", translit: "nouthesia", meaning: "instrução que corrige e direciona a mente e o coração para a sabedoria de Deus", lang: "grego" },
          ],
          deepDive:
            "Deuteronômio 6:6-7 estabelece o padrão veterotestamentário que Efésios 6:4 assume e aprofunda: a formação espiritual dos filhos não é tarefa isolada em horários específicos ('hora do culto em casa'), mas um estilo de vida contínuo — 'quando estiver sentado em casa, quando andar pelo caminho, quando se deitar e quando se levantar'. Isso não significa sermões constantes, mas uma vida em que a fé é natural, visível e conversada em meio às atividades comuns do dia. Sobre métodos específicos de disciplina (formas concretas de correção, limites, consequências), a Bíblia dá princípios de caráter — amor, consistência, ausência de ira descontrolada, propósito redentivo — mais do que uma técnica única aplicável a toda criança e toda cultura; pais sábios buscam conselho pastoral e, quando necessário, profissional, para aplicar esses princípios com sabedoria à realidade específica de cada filho.",
          theologianQuote: {
            author: "David Merkh",
            text: "Criar filhos segundo o Evangelho não é produzir comportamento perfeito, mas modelar, diariamente, a mesma graça que recebemos de Deus — disciplina com amor, verdade com paciência, correção com esperança.",
            source: "Reflete a ênfase do ministério de casais e famílias de David Merkh sobre educar os filhos refletindo a graça recebida de Deus.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Salmo 127:3-5",
                textByVersion: {
                  NVI: "Os filhos são herança do Senhor; eles são a recompensa que dele vem. Como flechas nas mãos do guerreiro são os filhos nascidos na juventude de alguém. Como é feliz o homem que enche a sua aljava com flechas como essas!",
                },
              },
            ],
            historicalContext:
              "No antigo Israel, não existiam escolas religiosas institucionalizadas como as sinagogas que surgiriam mais tarde — o lar era o principal (e muitas vezes único) centro de formação espiritual das crianças. O Shemá de Deuteronômio 6:4-9 estabelece esse padrão: a fé é ensinada não em um horário isolado de 'aula religiosa', mas entrelaçada no cotidiano inteiro da família, o que Paulo, séculos depois, resume e aplica em Efésios 6:4 dentro do contexto greco-romano de sua própria época.",
            exegeticalNotes:
              "Em Efésios 6:4, Paulo usa dois termos gregos complementares: 'paideia' (formação, treinamento, disciplina no sentido amplo e educativo, não apenas punitivo) e 'nouthesia' (admoestação, instrução verbal e correção). Juntos, descrevem uma criação equilibrada entre estrutura formativa e ensino direto — nem permissividade sem limites, nem rigidez sem explicação.",
            theologicalDebate:
              "Cristãos fiéis divergem sobre métodos específicos de disciplina infantil, incluindo a interpretação de textos como Provérbios 13:24 e 22:15 (se a 'vara' deve ser lida de forma literal ou como símbolo mais amplo de correção e autoridade paterna). O que é essencial e inegociável, sem exceção, é que toda disciplina cristã deve visar o bem e a formação do caráter da criança, nunca humilhação, raiva descontrolada ou abuso físico ou emocional — qualquer prática que cause dano é incompatível com o Evangelho, independentemente da posição adotada. Pais que enfrentam dificuldades reais de disciplina fazem bem em buscar orientação pastoral e, quando necessário, aconselhamento profissional qualificado.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "Uma criança educada apenas com regras, sem amor, aprenderá a odiar as regras; uma criança educada apenas com amor, sem verdade, não saberá reconhecer o pecado — o Evangelho ensina os pais a unir as duas coisas.",
              source: "Reflete ênfase recorrente nos sermões e escritos pastorais de Charles Spurgeon sobre a educação cristã dos filhos, unindo disciplina e graça.",
            },
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
                "Delegar toda a educação espiritual à igreja",
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
          id: "fc-4-2",
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
            source: "Reflete a ênfase de Charles Spurgeon sobre o culto e a oração em família, tema recorrente em seus sermões e em Devoção Matinal e Vespertina (Morning and Evening).",
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
    {
      id: "fc-mod-5",
      title: "Módulo V: Honra aos Pais e Legado entre Gerações",
      lessons: [
        {
          id: "fc-5-1",
          title: "Honrar Pai e Mãe: Um Mandamento com Promessa",
          intro: [
            "Entre os Dez Mandamentos, o quinto se destaca por vir acompanhado de uma promessa explícita: 'honra teu pai e tua mãe, para que se prolonguem os teus dias na terra que o Senhor, teu Deus, te dá' (Êx 20:12). Paulo, em Efésios 6:2-3, chama atenção justamente para esse detalhe: é 'o primeiro mandamento com promessa'.",
            "Honrar não é sinônimo de obedecer cegamente, nem de concordar com tudo. Honrar significa reconhecer o lugar, o valor e, geralmente, a autoridade que Deus concedeu aos pais na vida de um filho — tratá-los com respeito, gratidão e cuidado, mesmo quando adultos, mesmo quando as opiniões divergem, mesmo quando o relacionamento é imperfeito.",
            "Esse mandamento não termina na infância. Provérbios repetidamente instrui filhos adultos a não desprezarem seus pais quando envelhecem (Pv 23:22), e Jesus repreendeu duramente líderes religiosos que usavam tecnicalidades espirituais para escapar da responsabilidade de cuidar dos próprios pais idosos (Mc 7:9-13). Honrar os pais é um chamado para a vida inteira, adaptado a cada fase — obediência na infância, respeito e cuidado na vida adulta.",
          ],
          verses: [
            {
              ref: "Êxodo 20:12",
              textByVersion: {
                NVI: "Honra teu pai e tua mãe, para que tenhas vida longa na terra que o Senhor, teu Deus, te dá.",
                ACF: "Honra a teu pai e a tua mãe, para que se prolonguem os teus dias na terra que o Senhor teu Deus te dá.",
              },
              originals: [
                { word: "כַּבֵּד", translit: "kabbed", meaning: "honrar — literalmente 'dar peso, tratar como pesado/importante'; reconhecer o valor real de alguém", lang: "hebraico" },
              ],
            },
            {
              ref: "Efésios 6:1-3",
              textByVersion: {
                NVI: "Filhos, obedeçam a seus pais no Senhor, pois isso é justo... este é o primeiro mandamento com promessa.",
              },
            },
          ],
          keywords: [
            { word: "כָּבוֹד", translit: "kabod", meaning: "honra, peso, glória — dar a alguém o reconhecimento e o respeito que seu lugar merece", lang: "hebraico" },
            { word: "ὑπακούω", translit: "hypakouō", meaning: "obedecer — ouvir com submissão ativa; distinto de 'honrar', que continua mesmo depois que a obediência infantil termina", lang: "grego" },
          ],
          deepDive:
            "É importante distinguir, com cuidado pastoral, 'obedecer' (Ef 6:1, dirigido especialmente a filhos que ainda vivem sob a autoridade parental) de 'honrar' (Êx 20:12, um mandamento permanente, para toda a vida). Um filho adulto já não deve obediência incondicional aos pais — ele responde, em primeiro lugar, a Deus e, se casado, também ao seu próprio lar —, mas continua devendo honra: respeito, gratidão, cuidado prático quando necessário, e a recusa de desprezar ou menosprezar seus pais. Sobre situações de famílias marcadas por abuso, abandono ou pais que exigem coisas contrárias à Palavra de Deus, a honra bíblica nunca significa submissão a pecado ou exposição a dano: 'importa antes obedecer a Deus do que aos homens' (At 5:29) permanece o princípio final, mesmo dentro da própria família; nesses casos, buscar apoio pastoral e, quando necessário, proteção legal e profissional, é sabedoria bíblica, não desonra.",
          theologianQuote: {
            author: "Wayne Grudem",
            text: "Honrar os pais é reconhecer, com gratidão, que fomos formados por mãos que Deus usou antes que soubéssemos formar nada por nós mesmos — mesmo quando essas mãos, sendo humanas, também erraram.",
            source: "Reflete a exposição de Wayne Grudem sobre o quinto mandamento em Teologia Sistemática (Systematic Theology).",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Marcos 7:9-13",
                textByVersion: {
                  NVI: "E disse-lhes: 'Habilmente vocês rejeitam o mandamento de Deus, a fim de guardar a sua própria tradição!... vocês anulam a palavra de Deus pela tradição que vocês transmitem uns aos outros.'",
                },
              },
            ],
            historicalContext:
              "No mundo antigo, o cuidado dos pais idosos era, na prática, a única 'previdência social' disponível — não havia sistema de aposentadoria ou instituições de longa permanência. Jesus repreende, em Marcos 7, um costume religioso chamado 'corbã', pelo qual algumas pessoas declaravam seus bens 'dedicados a Deus' para se eximir legalmente da obrigação de sustentar os próprios pais — um exemplo claro de como tradição religiosa pode, na prática, contradizer o próprio mandamento de Deus que ela alega honrar.",
            exegeticalNotes:
              "O grego usa 'timaō' (honrar, atribuir valor e respeito) em contraste com 'hypakouō' (obedecer, submeter-se à autoridade), aplicado especificamente aos filhos que ainda vivem sob autoridade parental (Ef 6:1). Honra é o mandamento permanente, válido em toda fase da vida; obediência incondicional é limitada à infância e adolescência sob o teto e autoridade dos pais.",
            theologicalDebate:
              "Sobre como honrar pais que foram ou são abusivos, ausentes ou que exigem algo contrário à Palavra de Deus, tradições cristãs concordam que a honra bíblica nunca exige submissão a pecado, silêncio diante de abuso ou exposição contínua a dano ('antes é preciso obedecer a Deus do que aos homens', At 5:29). Como isso se traduz na prática (grau de contato, tipo de relacionamento mantido, perdão sem reconciliação de convivência) é uma questão pastoral delicada, que exige sabedoria caso a caso — recomenda-se buscar apoio de um pastor, conselheiro cristão qualificado e, quando necessário, proteção legal apropriada.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "Aquele que despreza o pai e a mãe que Deus lhe deu dificilmente aprenderá a honrar de coração o Pai celestial que ele ainda não vê.",
              source: "Reflete ênfase recorrente de Charles Spurgeon sobre honrar pais terrenos como caminho para honrar o Pai celestial.",
            },
          },
          quizzes: [
            {
              question: "O que torna o quinto mandamento (Êx 20:12) único entre os Dez Mandamentos, segundo Efésios 6:2-3?",
              options: [
                "É o único mandamento sobre a vida familiar",
                "É o primeiro mandamento acompanhado de uma promessa explícita",
                "É o único mandamento que se aplica somente a crianças",
                "É o mandamento menos importante da lista",
              ],
              correctIndex: 1,
              explanation: "Paulo destaca explicitamente que este é 'o primeiro mandamento com promessa' — bênção associada à obediência.",
            },
            {
              question: "Qual a diferença bíblica entre 'obedecer' e 'honrar' os pais, segundo o ensino apresentado?",
              options: [
                "São exatamente a mesma coisa, sem distinção",
                "Obedecer é para toda a vida; honrar termina na vida adulta",
                "Obedecer é próprio da infância sob autoridade parental; honrar é um chamado permanente",
                "Nenhuma das duas se aplica a filhos adultos",
              ],
              correctIndex: 2,
              explanation: "A obediência plena está ligada à autoridade parental na infância; a honra — respeito, gratidão, cuidado — permanece por toda a vida.",
            },
          ],
          application:
            "Faça, esta semana, um gesto concreto de honra aos seus pais (ou, se já falecidos, a alguém que exerceu esse papel em sua vida) — uma ligação, uma visita, uma palavra de gratidão específica, ou um ato prático de cuidado, especialmente se eles já são idosos.",
          prayer:
            "Senhor, obrigado pelos pais que me deste, com todas as suas limitações e imperfeições. Ensina-me a honrá-los de verdade — com respeito, gratidão e cuidado prático, sem fingir que tudo foi perfeito, mas também sem desprezo. Onde há mágoas antigas na minha relação com meus pais, traz cura e, quando possível, reconciliação. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva uma carta ou mensagem (mesmo que curta) para um de seus pais ou figura parental, agradecendo por algo específico que Deus usou na vida dele(a) para te formar, mesmo que essa pessoa não seja cristã.",
          reflectionQuestion:
            "Existe alguma mágoa não resolvida na sua relação com seus pais que está impedindo você de honrá-los como a Bíblia ensina? O que seria um primeiro passo saudável nessa direção?",
          xp: 26,
        },
        {
          id: "fc-5-2",
          title: "Legado Espiritual: Semeando para Gerações que Você Não Verá",
          intro: [
            "Uma das promessas mais bonitas — e mais desafiadoras — da Bíblia sobre a família é a ideia de fidelidade que atravessa gerações. Deus se revela a Moisés como aquele que usa 'misericórdia até a milésima geração com os que me amam e guardam os meus mandamentos' (Êx 20:6). Isso descreve algo que a cultura moderna, obcecada pelo imediato, muitas vezes esquece: as escolhas de fé de hoje moldam gerações que ainda nem nasceram.",
            "Timóteo é um exemplo bíblico concreto dessa realidade. Paulo lembra a ele 'a fé sincera que primeiro habitou em sua avó Lóide e em sua mãe Eunice' (2 Tm 1:5). Nenhuma dessas mulheres viveu para ver todo o alcance do ministério de Timóteo, mas sua fidelidade silenciosa, geração após geração, preparou o terreno para um dos maiores obreiros do Novo Testamento.",
            "Isso muda a forma de pensar sobre o legado familiar. Herança material é boa e a Bíblia a valoriza (Pv 13:22), mas o legado mais duradouro que uma família cristã pode deixar não é financeiro — é espiritual: uma fé genuína, vivida de forma consistente, que os filhos e netos possam olhar e imitar, mesmo décadas depois que os avós já tiverem partido para a presença do Senhor.",
          ],
          verses: [
            {
              ref: "2 Timóteo 1:5",
              textByVersion: {
                NVI: "Recordo-me da sinceridade da sua fé, a qual habitou primeiro em sua avó Lóide e em sua mãe Eunice, e estou convencido de que também habita em você.",
              },
            },
            {
              ref: "Salmo 103:17-18",
              textByVersion: {
                NVI: "Mas, para os que o temem, a bondade do Senhor dura para sempre, e a sua justiça salva os filhos dos filhos... daqueles que se lembram de obedecer aos seus preceitos.",
              },
              originals: [
                { word: "חֶסֶד", translit: "chesed", meaning: "bondade leal, amor fiel de aliança — a fidelidade constante de Deus que se estende através das gerações", lang: "hebraico" },
              ],
            },
          ],
          keywords: [
            { word: "חֶסֶד", translit: "chesed", meaning: "amor fiel de aliança, bondade leal — a base do compromisso de Deus com as famílias que o temem, geração após geração", lang: "hebraico" },
            { word: "ἀνυπόκριτος", translit: "anypokritos", meaning: "sincero, sem hipocrisia — a fé de Lóide e Eunice descrita como genuína, não apenas aparente", lang: "grego" },
          ],
          deepDive:
            "Paulo não menciona o pai de Timóteo (que, segundo Atos 16:1, era grego, provavelmente não cristão) — o texto foca deliberadamente na linha materna de fé, mostrando que Deus usa quem está disponível, mesmo em famílias espiritualmente divididas ou incompletas, para construir um legado de fé genuína. Isso é um encorajamento importante para mães solteiras, avós que criam netos sozinhas, ou qualquer pessoa que sinta que sua família 'não é o modelo ideal': Deus trabalha com fidelidade real, não com estruturas familiares perfeitas. Sobre o alcance exato dessa promessa de bênção geracional (Êx 20:6), o texto descreve um princípio geral de como Deus normalmente trata famílias fiéis através do tempo, não uma garantia automática de que todo descendente de um crente será salvo independentemente de sua própria resposta pessoal ao Evangelho — cada geração precisa, por si mesma, responder à fé que recebeu.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Um homem que teme a Deus e caminha corretamente deixa atrás de si mais do que riqueza; deixa um caminho pisado, por onde seus filhos e netos podem, se quiserem, encontrar o mesmo Deus que ele encontrou.",
            source: "Reflete a linguagem de Charles Spurgeon sobre o exemplo e o legado espiritual deixado às futuras gerações, tema recorrente em seus sermões.",
          },
          quizzes: [
            {
              question: "O que o exemplo de Lóide e Eunice, em 2 Timóteo 1:5, ensina sobre legado espiritual?",
              options: [
                "Que apenas pais (homens) podem transmitir fé genuína aos filhos",
                "Que a fidelidade de gerações anteriores pode preparar terreno para o chamado de um filho ou neto",
                "Que a fé de avós e mães não tem valor espiritual duradouro",
                "Que Timóteo se tornou cristão sem qualquer influência familiar",
              ],
              correctIndex: 1,
              explanation: "Paulo destaca explicitamente a fé sincera transmitida por Lóide e Eunice como raiz da fé de Timóteo.",
            },
            {
              question: "Segundo o texto de Salmo 103:17-18, o que caracteriza a bondade de Deus que 'salva os filhos dos filhos'?",
              options: [
                "Uma garantia automática, independente da fé de cada geração",
                "Um princípio geral de fidelidade de Deus para com quem o teme e guarda seus preceitos",
                "Uma promessa apenas para famílias ricas ou socialmente influentes",
                "Uma ideia sem qualquer base bíblica",
              ],
              correctIndex: 1,
              explanation: "O salmo descreve o padrão fiel de Deus para com quem o teme, sem eliminar a necessidade de resposta pessoal de cada geração.",
            },
          ],
          application:
            "Pense em uma pessoa da sua família (viva ou já falecida) cuja fidelidade espiritual, mesmo pequena ou silenciosa, moldou sua própria fé hoje. Agradeça a Deus por ela — e, se possível, agradeça também à pessoa diretamente.",
          prayer:
            "Senhor, obrigado pela fé que recebi de quem veio antes de mim, e pelo privilégio de poder deixar um legado espiritual para quem vem depois. Ajuda-me a viver hoje de um jeito que meus filhos, netos e aqueles que observam minha vida possam, um dia, olhar para trás e ver fidelidade genuína, não apenas aparência religiosa. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva uma breve carta (para guardar ou entregar) contando a um filho, sobrinho, afilhado ou jovem próximo como Deus tem agido na sua vida — um pequeno registro de fé para a próxima geração.",
          reflectionQuestion:
            "Se sua fé de hoje fosse a única semente espiritual que sua família recebesse por três gerações, que tipo de fruto ela provavelmente geraria?",
          xp: 27,
        },
      ],
    },
    {
      id: "fc-mod-6",
      title: "Módulo VI: Solteirice, Namoro e Relacionamentos com Propósito",
      lessons: [
        {
          id: "fc-6-1",
          title: "A Solteirice Como Dom, Não Como Espera Vazia",
          intro: [
            "Numa cultura (e, muitas vezes, numa igreja) que trata o casamento como o grande marco de maturidade cristã, é preciso recuperar algo que Paulo ensina com clareza em 1 Coríntios 7: a solteirice também é um dom de Deus, tão legítimo e tão útil ao Reino quanto o casamento — não uma etapa inferior ou uma espera incompleta.",
            "Paulo, ele mesmo solteiro, chega a dizer que gostaria que mais pessoas tivessem esse dom (1 Co 7:7), destacando uma vantagem real: o solteiro pode se dedicar 'às coisas do Senhor' com uma liberdade de tempo, energia e mobilidade que o casado, com responsabilidades legítimas para com cônjuge e filhos, simplesmente não tem da mesma forma (1 Co 7:32-34).",
            "Isso não significa que o desejo de casar seja pecaminoso, nem que toda pessoa solteira tenha o 'dom' da solteirice permanente — muitos solteiros estão numa temporada, não numa vocação para a vida toda. Mas significa que a identidade e o valor de uma pessoa diante de Deus nunca dependem do seu estado civil. Cristo, o homem mais pleno e mais completo que já existiu, viveu e morreu solteiro.",
          ],
          verses: [
            {
              ref: "1 Coríntios 7:7-8",
              textByVersion: {
                NVI: "Gostaria que todos fossem como eu. Mas cada um tem de Deus o seu próprio dom... digo aos solteiros e às viúvas: é bom que permaneçam como eu.",
              },
            },
            {
              ref: "1 Coríntios 7:32-34",
              textByVersion: {
                NVI: "Gostaria que vocês estivessem livres de preocupações. O homem solteiro preocupa-se com as coisas do Senhor, em como agradar ao Senhor.",
              },
              originals: [
                { word: "ἀπερισπάστως", translit: "aperispastōs", meaning: "sem distração — a liberdade que o solteiro pode ter para se dedicar às coisas do Senhor sem as divisões legítimas do casamento", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "χάρισμα", translit: "charisma", meaning: "dom de graça — tanto a capacidade de viver solteiro quanto a de viver casado são chamadas de dons dados por Deus", lang: "grego" },
            { word: "ἀπερισπάστως", translit: "aperispastōs", meaning: "sem distração, com atenção indivisa — descreve a possível dedicação exclusiva do solteiro às coisas do Senhor", lang: "grego" },
          ],
          deepDive:
            "É importante notar que Paulo não está desvalorizando o casamento em 1 Coríntios 7 — em outros textos (Ef 5) ele o eleva como retrato do Evangelho. O que ele está corrigindo é a ideia, presente já naquela cultura e ainda hoje, de que o casamento é 'o próximo passo natural e obrigatório' para toda pessoa madura, e de que a pessoa solteira está, de alguma forma, incompleta. Sobre discernir se a solteirice de alguém é temporária (uma temporada de espera) ou um chamado mais duradouro, a Bíblia não dá um teste específico — isso normalmente se torna mais claro com o tempo, através de oração, dos próprios desejos da pessoa (1 Co 7:9) e do aconselhamento de líderes espirituais maduros que a conhecem bem. Em ambos os casos, temporário ou permanente, a solteirice pode e deve ser vivida com plenitude, propósito e alegria no Senhor — nunca como uma sala de espera vazia.",
          theologianQuote: {
            author: "John Stott",
            text: "Jesus Cristo, o homem mais pleno que a história já conheceu, nunca se casou; isso deveria ser suficiente para libertar qualquer cristão solteiro da mentira de que sua vida está incompleta.",
            source: "Reflete o argumento de John Stott sobre o valor do celibato em Questões Polêmicas do Cristianismo Contemporâneo (Issues Facing Christians Today) e outros escritos sobre solteirice e vocação.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Mateus 19:11-12",
                textByVersion: {
                  NVI: "Jesus respondeu: 'Nem todos podem aceitar esta palavra, mas somente aqueles a quem é dado... Há também os que renunciaram a casar-se por causa do Reino dos céus. Quem puder aceitar isso, aceite.'",
                },
              },
            ],
            historicalContext:
              "1 Coríntios 7 foi escrito num momento de 'aflição presente' (v. 26) — provavelmente instabilidade social ou perseguição iminente enfrentada pela igreja de Corinto. Nesse contexto específico, Paulo destaca vantagens práticas e temporárias da solteirice (menos divisão de cuidados, maior disponibilidade para servir), sem nunca desvalorizar o casamento, que ele mesmo eleva como retrato do Evangelho em outros textos (Ef 5).",
            exegeticalNotes:
              "Em 1 Coríntios 7:7, Paulo usa a palavra grega 'charisma' (dom, graça concedida) tanto para o casamento quanto para a solteirice — ambos são dons de Deus, não um sendo o padrão normal e o outro uma falta ou atraso espiritual. Isso corrige diretamente qualquer ideia de que a pessoa solteira esteja 'esperando' uma vida que ainda não começou de verdade.",
            theologicalDebate:
              "Cristãos diferem sobre como discernir se a solteirice de alguém é um 'chamado' específico e permanente para servir a Deus de forma undivided (1 Co 7:32-34) ou simplesmente uma circunstância temporária da vida, sem significado vocacional especial. A Escritura não exige que toda pessoa solteira declare publicamente uma vocação de celibato perpétuo — ela apenas ensina que a solteirice, enquanto durar, pode ser vivida com plenitude e propósito no Reino, e não como uma sala de espera.",
            secondQuote: {
              author: "Dietrich Bonhoeffer",
              text: "A comunhão cristã não depende do estado civil de ninguém; o solteiro que vive em comunhão profunda com Cristo e com a igreja já experimenta, de verdade, a família que Deus lhe prometeu.",
              source: "Reflete o conceito de comunhão cristã de Dietrich Bonhoeffer em Vida em Comunhão (Life Together).",
            },
          },
          quizzes: [
            {
              question: "Segundo 1 Coríntios 7:7, como Paulo descreve tanto o casamento quanto a solteirice?",
              options: [
                "Como estados opostos, sendo um claramente superior ao outro",
                "Como dons diferentes, ambos dados por Deus",
                "Como irrelevantes para a vida espiritual",
                "Como escolhas puramente humanas, sem qualquer chamado divino",
              ],
              correctIndex: 1,
              explanation: "Paulo usa a palavra 'dom' (charisma) para descrever tanto a capacidade de viver solteiro quanto a de viver casado.",
            },
            {
              question: "Qual vantagem específica Paulo destaca sobre a vida solteira em 1 Coríntios 7:32-34?",
              options: [
                "Uma vida mais fácil, sem qualquer desafio",
                "Maior liberdade e atenção indivisa para se dedicar às coisas do Senhor",
                "Superioridade espiritual automática sobre os casados",
                "Ausência total de tentação ou luta pessoal",
              ],
              correctIndex: 1,
              explanation: "O texto descreve a possibilidade de dedicação 'sem distração' às coisas do Senhor, algo distinto (não superior) à vida do casado.",
            },
          ],
          application:
            "Se você é solteiro(a), identifique uma forma concreta em que sua atual liberdade de tempo e mobilidade pode ser usada para servir a Deus e à igreja nesta temporada — algo que seria mais difícil fazer estando casado(a). Se você é casado(a), valorize e incentive publicamente os solteiros da sua igreja, sem tratá-los como incompletos.",
          prayer:
            "Senhor, obrigado porque meu valor diante de ti nunca dependeu do meu estado civil. Se estou solteiro(a), ajuda-me a viver essa temporada (ou vocação) com plenitude e propósito, sem viver em espera ansiosa. Se estou casado(a), ajuda-me a nunca tratar irmãos e irmãs solteiros como se estivessem incompletos. Que toda a igreja valorize os dons que tu distribuis de formas diferentes. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Esta semana, converse com pelo menos um irmão ou irmã solteiro(a) da sua igreja sobre como ele(a) tem vivido essa temporada — ouvindo, sem clichês fáceis nem pressão sobre casamento.",
          reflectionQuestion:
            "Você tem tratado a solteirice (a sua ou a de outros) como um dom com propósito próprio, ou como um problema à espera de solução?",
          xp: 26,
        },
        {
          id: "fc-6-2",
          title: "Namoro com Propósito: Intencionalidade e Pureza",
          intro: [
            "A Bíblia não usa a palavra 'namoro' — esse é um formato cultural relativamente recente. Mas ela dá princípios claros que devem moldar qualquer relacionamento romântico que caminha em direção ao casamento: intencionalidade de propósito, pureza de conduta, e sujeição a Deus e, sempre que possível, ao conselho da comunidade cristã.",
            "1 Coríntios 6:19-20 já ensinou que o corpo do cristão é santuário do Espírito Santo — isso vale plenamente também para relacionamentos pré-matrimoniais. Namorar com pureza não é uma lista fria de 'proibições', mas o reconhecimento de que a intimidade física (em suas várias formas e graus) foi desenhada por Deus para dentro do compromisso público e definitivo do casamento, não para relacionamentos ainda não selados por aliança.",
            "1 Tessalonicenses 4:3-6 dá um princípio adicional importante: guardar-se da imoralidade sexual não é apenas sobre o próprio coração, mas também sobre não 'ultrapassar e enganar' o outro. Um namoro cristão saudável protege ativamente a pureza e o coração da outra pessoa, não apenas evita o próprio pecado — trata o outro com honra, não como um meio para satisfação própria.",
          ],
          verses: [
            {
              ref: "1 Tessalonicenses 4:3-6",
              textByVersion: {
                NVI: "A vontade de Deus é que sejam santificados: abstenham-se da imoralidade sexual... ninguém prejudique seu irmão nessa questão, nem dele se aproveite.",
              },
              originals: [
                { word: "ἁγιασμός", translit: "hagiasmos", meaning: "santificação — o propósito declarado de Deus para a área sexual: separação para pureza, não repressão sem sentido", lang: "grego" },
              ],
            },
            {
              ref: "Provérbios 4:23",
              textByVersion: {
                NVI: "Acima de tudo, guarde o seu coração, pois dele depende toda a sua vida.",
              },
            },
          ],
          keywords: [
            { word: "ἁγιασμός", translit: "hagiasmos", meaning: "santificação, separação para um propósito santo — a razão bíblica para a pureza no relacionamento pré-matrimonial", lang: "grego" },
            { word: "לֵב", translit: "lev", meaning: "coração — em Provérbios 4:23, o centro da vontade e das emoções, que precisa ser guardado com cuidado ativo", lang: "hebraico" },
          ],
          deepDive:
            "Sobre limites físicos específicos dentro de um namoro cristão (o que é ou não apropriado em cada etapa do relacionamento), a Bíblia não estabelece uma lista detalhada — ela dá o princípio de pureza, honra mútua e ausência de aproveitamento (1 Ts 4:3-6), deixando espaço para que casais, sob aconselhamento pastoral, apliquem esse princípio com sabedoria prática à sua própria realidade e temporada de relacionamento. O que permanece claro e não negociável é o alvo: guardar o corpo (1 Co 6) e o coração (Pv 4:23) do outro com o mesmo cuidado que se esperaria receber, e reservar a expressão física plena da sexualidade para dentro da aliança pública do casamento. Namoro cristão saudável também normalmente inclui transparência com pais ou líderes espirituais e um propósito claro e comunicado: caminhar, com discernimento e oração, em direção a um possível casamento — não apenas 'viver o momento' sem direção nem compromisso real.",
          theologianQuote: {
            author: "John Mark Comer",
            text: "Um namoro que glorifica a Deus não é definido pela ausência total de atração, mas pela presença de honra: tratar a pessoa amada como filho ou filha de Deus, nunca como objeto de satisfação própria.",
            source: "Reflete a ênfase de John Mark Comer sobre relacionamentos e desejo ordenado em Cidade-Jardim (Garden City).",
          },
          quizzes: [
            {
              question: "Segundo 1 Tessalonicenses 4:3-6, qual é um dos objetivos da pureza sexual em um relacionamento?",
              options: [
                "Apenas evitar o próprio pecado, sem se importar com o outro",
                "Proteger também o irmão ou irmã de ser prejudicado ou enganado",
                "Impedir totalmente qualquer forma de relacionamento romântico",
                "Garantir apenas benefícios sociais ou familiares",
              ],
              correctIndex: 1,
              explanation: "O texto é explícito: ninguém deve prejudicar ou se aproveitar do irmão/irmã nessa área — a pureza protege ambos.",
            },
            {
              question: "Qual princípio Provérbios 4:23 ensina, aplicável também aos relacionamentos românticos?",
              options: [
                "Que o coração não precisa de cuidado especial",
                "Que guardar o coração é essencial, pois dele depende toda a vida",
                "Que emoções não têm relevância espiritual",
                "Que apenas ações externas importam, não o coração",
              ],
              correctIndex: 1,
              explanation: "O coração — centro da vontade e das emoções — precisa ser guardado com cuidado ativo, inclusive em relacionamentos.",
            },
          ],
          application:
            "Se você está namorando, converse com seu(sua) parceiro(a) sobre limites claros de pureza para essa fase do relacionamento, e considere ser transparente com um líder espiritual ou pais sobre como o relacionamento tem caminhado. Se você não está namorando, reflita sobre que tipo de pessoa você quer se tornar antes de entrar em um relacionamento sério.",
          prayer:
            "Senhor, se estou em um relacionamento, ajuda-me a honrar essa pessoa como filho(a) teu, guardando seu coração e seu corpo com o mesmo cuidado que gostaria de receber. Dá-nos sabedoria e submissão ao teu propósito de pureza. Se não estou namorando, forma em mim, nesta temporada, o caráter que um bom casamento vai exigir. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Se estiver namorando, tenha uma conversa honesta sobre limites e propósito do relacionamento com seu(sua) parceiro(a) nesta semana, e, se possível, também com um líder espiritual de confiança.",
          reflectionQuestion:
            "No seu relacionamento atual (ou no seu padrão de relacionamentos passados), você tem tratado o outro com honra e cuidado ativo, ou priorizado seus próprios desejos e conveniência?",
          xp: 27,
        },
      ],
    },
    {
      id: "fc-mod-7",
      title: "Módulo VII: Mordomia, Trabalho e Provisão na Família",
      lessons: [
        {
          id: "fc-7-1",
          title: "Mordomia Financeira: Tudo Pertence a Deus",
          intro: [
            "A forma como uma família cristã lida com dinheiro revela, com clareza, aquilo em que ela realmente confia. Jesus falou sobre dinheiro e posses mais do que sobre quase qualquer outro tema prático, porque sabia o quanto essa área testa e revela o coração: 'onde estiver o seu tesouro, aí também estará o seu coração' (Mt 6:21).",
            "O princípio bíblico fundamental de mordomia é simples de enunciar e desafiador de viver: tudo pertence a Deus — 'do Senhor é a terra e tudo o que nela existe' (Sl 24:1) — e nós somos apenas administradores temporários daquilo que ele nos confiou. Isso muda a pergunta central: não é 'quanto do meu dinheiro devo dar a Deus?', mas 'como devo administrar o dinheiro de Deus que está, por enquanto, em minhas mãos?'.",
            "Provérbios ensina, repetidas vezes, sabedoria prática sobre trabalho diligente, planejamento e evitar dívidas desnecessárias (Pv 21:5; 22:7). Uma família que administra bem suas finanças — trabalhando com diligência, planejando com sabedoria, dando com generosidade e evitando o consumismo desenfreado — está, na prática, adorando a Deus com uma das áreas mais concretas e cotidianas da vida.",
          ],
          verses: [
            {
              ref: "Mateus 6:19-21",
              textByVersion: {
                NVI: "Não acumulem para vocês tesouros na terra... Acumulem para vocês tesouros no céu... Pois onde estiver o seu tesouro, aí também estará o seu coração.",
              },
            },
            {
              ref: "1 Timóteo 6:17-19",
              textByVersion: {
                NVI: "Aos ricos deste mundo, mande que não sejam arrogantes nem ponham a esperança na incerteza da riqueza, mas em Deus... que sejam generosos e prontos a repartir.",
              },
              originals: [
                { word: "εὐμετάδοτος", translit: "eumetadotos", meaning: "pronto para repartir, generoso — descreve o caráter esperado de quem administra bem recursos financeiros", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "εὐμετάδοτος", translit: "eumetadotos", meaning: "pronto e disposto a repartir generosamente — o oposto de acumular egoisticamente", lang: "grego" },
            { word: "מַמּוֹן", translit: "mamom", meaning: "riqueza, dinheiro — usado por Jesus como um possível 'senhor' rival de Deus no coração humano (Mt 6:24)", lang: "hebraico" },
          ],
          deepDive:
            "É digno de nota que Jesus não condena a riqueza em si — Abraão, Jó e outros homens fiéis eram ricos — mas condena colocar a confiança na riqueza em vez de em Deus, e o coração dividido entre dois senhores (Mt 6:24). Sobre proporções específicas de dízimos e ofertas, percentuais de poupança, ou modelos exatos de orçamento familiar, a Bíblia estabelece princípios de generosidade proporcional, planejamento sábio (Pv 21:5) e liberdade da escravidão da dívida (Pv 22:7), mais do que uma fórmula financeira única aplicável a toda família em toda época — famílias cristãs de boa consciência aplicam esses princípios de formas distintas, conforme sua realidade, e fazem bem em buscar tanto conselho pastoral quanto orientação financeira prática e responsável quando enfrentam dificuldades nessa área.",
          theologianQuote: {
            author: "Thom Rainer",
            text: "A família que entende que tudo pertence a Deus para de perguntar 'quanto é meu para eu guardar?' e passa a perguntar 'quanto do que Deus me confiou eu posso usar para o Reino, com sabedoria e generosidade?'.",
            source: "Reflete a ênfase de Thom Rainer sobre mordomia e generosidade como sinais de saúde espiritual, em obras como Eu Sou um Membro da Igreja (I Am a Church Member).",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "2 Coríntios 9:6-7",
                textByVersion: {
                  NVI: "Lembrem-se disto: aquele que semeia pouco também colherá pouco, e aquele que semeia com fartura também colherá fartamente. Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria.",
                },
              },
            ],
            historicalContext:
              "No Antigo Testamento, Israel vivia sob um sistema de múltiplos dízimos ligados à aliança mosaica (sustento dos levitas, festas nacionais, cuidado dos pobres), parte da lei civil e cerimonial daquele povo específico. O Novo Testamento não repete esse sistema detalhado para a igreja — em vez disso, ensina princípios de generosidade proporcional, voluntária e alegre (2 Co 8-9), refletindo a nova aliança em Cristo, e não uma taxa fixa exigida por lei.",
            exegeticalNotes:
              "A palavra grega 'hilaros' (2 Co 9:7), de onde vem o termo português 'hilário', descreve alguém genuinamente alegre, não alguém que dá por pressão social ou culpa. Paulo contrasta deliberadamente esse tipo de doação com dar 'com pesar' ou 'por obrigação' — a atitude do coração importa tanto quanto o valor entregue.",
            theologicalDebate:
              "Cristãos evangélicos fiéis divergem sobre se o dízimo (10%) permanece como padrão mínimo obrigatório para o crente do Novo Testamento ou se foi um princípio da aliança mosaica cumprido e superado pelo chamado neotestamentário à generosidade proporcional e voluntária, sem percentual fixo. Ambas as posições concordam que o crente deve dar de forma planejada, sacrificial e alegre, honrando a Deus com suas finanças — a diferença está apenas no percentual específico exigido, uma questão secundária de aplicação prática.",
            secondQuote: {
              author: "Charles Spurgeon",
              text: "Aquele que dá pouco porque tem pouco não será repreendido; mas aquele que tem muito e retém tudo para si mesmo já colheu, sem saber, a pobreza mais séria de todas: a do próprio coração.",
              source: "Reflete ensino recorrente de Charles Spurgeon sobre generosidade cristã em seus sermões sobre mordomia.",
            },
          },
          quizzes: [
            {
              question: "Segundo Mateus 6:21, o que revela onde está o verdadeiro tesouro de uma pessoa ou família?",
              options: [
                "O valor total de seus bens materiais",
                "Onde está o seu coração",
                "A quantidade de dízimo que ela dá",
                "Sua posição social ou profissional",
              ],
              correctIndex: 1,
              explanation: "Jesus conecta diretamente o lugar do tesouro com o lugar do coração — onde investimos revela o que amamos.",
            },
            {
              question: "Qual atitude 1 Timóteo 6:17-19 recomenda a quem possui recursos financeiros?",
              options: [
                "Arrogância e confiança na própria riqueza",
                "Esperança colocada em Deus e generosidade disposta a repartir",
                "Acúmulo silencioso, sem qualquer partilha",
                "Desprezo total por qualquer forma de planejamento financeiro",
              ],
              correctIndex: 1,
              explanation: "O texto pede humildade, esperança em Deus (não na riqueza) e prontidão generosa para repartir com outros.",
            },
          ],
          application:
            "Revise, esta semana, o orçamento da sua casa (ou pessoal) com a pergunta 'isso reflete que tudo pertence a Deus?' — identifique uma área de consumo desnecessário para reduzir e uma área de generosidade para aumentar.",
          prayer:
            "Senhor, tudo o que tenho vem de ti e pertence a ti. Perdoa-me pelas vezes em que tratei meu dinheiro como se fosse só meu, sem consultar a ti sobre como usá-lo. Ensina minha família a trabalhar com diligência, planejar com sabedoria e dar com generosidade, para que nosso coração esteja sempre voltado para ti, e não para as coisas que possuímos. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Converse em família (ou sozinho, diante de Deus) sobre uma decisão financeira concreta que reflita confiança em Deus em vez de ansiedade ou acúmulo egoísta — pode ser uma oferta específica, um corte de gastos ou um plano de poupança sábio.",
          reflectionQuestion:
            "Se alguém observasse apenas seu extrato bancário do último mês, que conclusão tiraria sobre onde está o seu tesouro — e o seu coração?",
          xp: 27,
        },
        {
          id: "fc-7-2",
          title: "Trabalho, Provisão e Contentamento",
          intro: [
            "O trabalho não é uma maldição resultante da queda — ele existia antes do pecado, quando Deus colocou Adão no jardim do Éden 'para cultivá-lo e cuidar dele' (Gn 2:15). O que a queda trouxe foi a frustração e o suor difícil no trabalho (Gn 3:17-19), não o trabalho em si. Isso significa que trabalhar, prover para a própria casa, é parte do bom desenho de Deus para a vida humana, não um mal necessário.",
            "Paulo é firme sobre a responsabilidade de prover: 'se alguém não cuida dos seus, e em especial dos de sua própria família, negou a fé e é pior que um descrente' (1 Tm 5:8). Essa é uma das declarações mais fortes do Novo Testamento sobre um tema prático — mostrando o quanto Deus leva a sério a responsabilidade de sustentar a própria casa, seja através de trabalho remunerado, seja através de outras formas legítimas de contribuição ao lar.",
            "Ao mesmo tempo, a Bíblia adverte contra a ansiedade e a obsessão pelo trabalho e pela provisão material, como se tudo dependesse apenas do esforço humano. 'A menos que o Senhor edifique a casa, em vão trabalham os construtores' (Sl 127:1). O contentamento cristão nasce de confiar que Deus é, em última instância, quem provê — mesmo quando ele usa o trabalho humano diligente como o meio ordinário para isso.",
          ],
          verses: [
            {
              ref: "1 Timóteo 5:8",
              textByVersion: {
                NVI: "Se alguém não cuida dos seus, e em especial dos de sua própria família, negou a fé e é pior que um descrente.",
              },
            },
            {
              ref: "Filipenses 4:11-13",
              textByVersion: {
                NVI: "Não estou dizendo isso porque esteja necessitado, pois aprendi a viver contente, seja qual for a minha situação... tudo posso naquele que me fortalece.",
              },
              originals: [
                { word: "αὐτάρκης", translit: "autarkēs", meaning: "contente, autossuficiente — não no sentido de independência humana, mas de suficiência encontrada em Cristo, independente das circunstâncias", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "αὐτάρκεια", translit: "autarkeia", meaning: "contentamento — suficiência interior aprendida (não natural), fundamentada em Cristo, não nas circunstâncias externas", lang: "grego" },
            { word: "עָבַד", translit: "avad", meaning: "trabalhar, servir, cultivar — a mesma palavra usada para o trabalho de Adão no Éden antes da queda", lang: "hebraico" },
          ],
          deepDive:
            "Paulo, em Filipenses 4:11, diz explicitamente que 'aprendeu' a viver contente — o contentamento bíblico não é um traço de personalidade natural, é uma disciplina espiritual desenvolvida ao longo do tempo, muitas vezes através de experiências de escassez e de abundância. Isso é especialmente relevante para famílias que enfrentam desemprego, dificuldades financeiras ou mudanças bruscas de renda: a ausência momentânea de provisão material não significa ausência da fidelidade de Deus, embora a família deva, com responsabilidade, buscar meios legítimos de trabalho e sustento (2 Ts 3:10-12 adverte contra a ociosidade voluntária, distinta da falta involuntária de oportunidade). Sobre como equilibrar dedicação ao trabalho com tempo de qualidade em família — um desafio real e concreto para muitos lares hoje —, a Bíblia não dá uma fórmula de horas específicas, mas dá o princípio de que o trabalho deve servir à família e a Deus, e não o contrário; quando o trabalho começa a devorar o tempo devido ao cônjuge, aos filhos e à igreja, é sinal de que a ordem de prioridades bíblicas precisa ser revista.",
          theologianQuote: {
            author: "Hernandes Dias Lopes",
            text: "Deus não chama o cristão a ser ansioso provedor de si mesmo, mas a ser trabalhador fiel e confiante — trabalhando com diligência como se tudo dependesse dele, e descansando como se tudo dependesse de Deus, porque, no fim, realmente depende.",
            source: "Reflete a linha de ensino de Hernandes Dias Lopes sobre trabalho, provisão e confiança em Deus em seus comentários expositivos sobre Provérbios e Eclesiastes.",
          },
          quizzes: [
            {
              question: "Segundo 1 Timóteo 5:8, qual é a gravidade de negligenciar o sustento da própria família?",
              options: [
                "É um erro pequeno, sem grande importância espiritual",
                "É descrito como uma negação prática da fé, mais grave que descrença",
                "Aplica-se apenas a homens casados",
                "Não tem relação com a fé cristã",
              ],
              correctIndex: 1,
              explanation: "Paulo usa linguagem extremamente forte para descrever a seriedade de não prover para a própria casa.",
            },
            {
              question: "O que Paulo ensina sobre o contentamento em Filipenses 4:11-13?",
              options: [
                "Que é um talento natural que algumas pessoas já nascem tendo",
                "Que é algo aprendido, fundamentado em Cristo, independente das circunstâncias",
                "Que só é possível na abundância material",
                "Que contentamento significa não trabalhar nem se esforçar",
              ],
              correctIndex: 1,
              explanation: "Paulo diz explicitamente 'aprendi' a viver contente — uma disciplina espiritual, não um traço automático de personalidade.",
            },
          ],
          application:
            "Avalie, com honestidade, se o ritmo atual do seu trabalho tem servido bem à sua família ou tem consumido tempo que deveria ser dedicado a ela. Se necessário, converse com seu cônjuge (ou consigo mesmo, diante de Deus) sobre um ajuste concreto de prioridades esta semana.",
          prayer:
            "Senhor, obrigado pelo trabalho como parte do teu bom desenho para minha vida. Ajuda-me a trabalhar com diligência, sustentando minha família com responsabilidade, sem cair na ansiedade que esquece que és tu quem realmente provê. Ensina-me o contentamento que Paulo aprendeu, em fartura ou em escassez. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha um dia específico nesta semana para desligar completamente do trabalho fora do horário combinado e dedicar esse tempo de forma intencional à sua família ou às pessoas que Deus colocou ao seu redor.",
          reflectionQuestion:
            "O ritmo atual do seu trabalho reflete confiança em Deus como provedor, ou uma ansiedade silenciosa de que tudo depende só do seu próprio esforço?",
          xp: 26,
        },
      ],
    },
    {
      id: "fc-mod-8",
      title: "Módulo VIII: O Lar como Igreja Doméstica",
      lessons: [
        {
          id: "fc-8-1",
          title: "A Família a Serviço da Igreja Local",
          intro: [
            "Uma família cristã saudável não vive voltada apenas para dentro de si mesma. Desde o Novo Testamento, casas de crentes eram o próprio lugar onde a igreja se reunia — 'a igreja que se reúne na casa deles' (Rm 16:5; cf. Cl 4:15). O lar cristão sempre foi pensado, desde o início, como extensão da vida da igreja, não como um espaço isolado e autossuficiente.",
            "Isso significa que decisões familiares — onde morar, como organizar o tempo, como educar os filhos — devem levar em conta, com peso real, o compromisso da família com sua igreja local: participação em cultos, pequenos grupos, uso de dons espirituais e apoio prático à comunhão da igreja. Uma família que nunca considera a igreja em suas decisões práticas está vivendo um discipulado incompleto.",
            "Hebreus 10:24-25 é claro: os cristãos não devem abandonar 'a nossa congregação, como é costume de alguns', mas se encorajar mutuamente. Uma família cristã forte investe tempo e energia real na vida da igreja local — não apenas comparece esporadicamente, mas se compromete, serve e se deixa conhecer por outros crentes.",
          ],
          verses: [
            {
              ref: "Romanos 16:3-5",
              textByVersion: {
                NVI: "Saúdem Priscila e Áquila... Saúdem também a igreja que se reúne na casa deles.",
              },
            },
            {
              ref: "Hebreus 10:24-25",
              textByVersion: {
                NVI: "Consideremo-nos uns aos outros para nos incentivarmos ao amor e às boas obras. Não deixemos de reunir-nos, como é costume de alguns, mas encorajemo-nos uns aos outros.",
              },
              originals: [
                { word: "ἐπισυναγωγή", translit: "episynagōgē", meaning: "reunião, congregação — o ajuntamento regular dos crentes, descrito como algo que não deve ser abandonado", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "οἶκος", translit: "oikos", meaning: "casa, lar — no Novo Testamento, frequentemente o próprio lugar onde a igreja local se reunia e crescia", lang: "grego" },
            { word: "παρακαλέω", translit: "parakaleō", meaning: "encorajar, exortar, consolar — o propósito ativo da reunião regular entre cristãos, segundo Hebreus 10:25", lang: "grego" },
          ],
          deepDive:
            "Priscila e Áquila (Rm 16:3-5) formam um dos casais mais ativos do Novo Testamento em ministério — hospedavam a igreja, corrigiram doutrina com Apolo (At 18:26) e acompanharam Paulo em viagens missionárias. Eles ilustram algo importante: um casamento forte não se fecha em si mesmo, ele se torna uma base a partir da qual o casal serve à igreja e ao Reino de Deus juntos. Sobre o quanto de tempo e recursos específicos uma família deve dedicar à vida da igreja local, versus tempo dedicado exclusivamente ao núcleo familiar, a Bíblia não estabelece uma proporção fixa — isso exige sabedoria e temporadas de vida distintas (famílias com bebês pequenos, por exemplo, naturalmente têm menos disponibilidade que outras); o princípio inegociável é que a igreja local nunca deve ser tratada como opcional ou dispensável na vida familiar, mesmo quando a temporada exige ajustes práticos na forma de participação.",
          theologianQuote: {
            author: "Josué K. Reichow",
            text: "Uma família cristã que nunca serve à igreja local está desperdiçando o próprio propósito para o qual Deus a formou: não apenas ser abençoada, mas ser canal de bênção para o corpo de Cristo.",
            source: "Reflete a ênfase pastoral de Josué K. Reichow sobre o papel missionário da família dentro da igreja local.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Atos 18:24-26",
                textByVersion: {
                  NVI: "Chegou a Éfeso um judeu chamado Apolo... Ele já tinha sido instruído no caminho do Senhor... Priscila e Áquila o ouviram e o levaram para casa, e lhe explicaram com mais precisão o caminho de Deus.",
                },
              },
            ],
            historicalContext:
              "Antes de existirem prédios dedicados a templos cristãos, a igreja do primeiro século se reunia majoritariamente em casas de famílias (Rm 16:5, Cl 4:15). Isso tornava o lar cristão, literalmente, um espaço eclesial — hospedar a igreja, ensinar a Palavra e servir na casa não era um extra opcional, mas parte estrutural de como a igreja primitiva existia e crescia.",
            exegeticalNotes:
              "Paulo chama Priscila e Áquila de 'synergos' (colaboradores, companheiros de trabalho) em Romanos 16:3 — o mesmo termo que usa para outros líderes reconhecidos de ministério. O casal aparece consistentemente unido no texto grego (com o nome de Priscila mencionado antes do de Áquila em vários textos, algo incomum para a época), servindo, ensinando e viajando juntos a serviço do Evangelho.",
            theologicalDebate:
              "O episódio de Priscila e Áquila instruindo Apolo (At 18:26) é frequentemente citado nos debates evangélicos sobre os papéis apropriados de homens e mulheres no ensino da igreja — alguns veem aqui um modelo de instrução privada e conjunta que não contraria 1 Timóteo 2:12, enquanto outros o veem como precedente mais amplo para o ensino feminino. Essa é uma questão secundária sobre a qual cristãos fiéis divergem; o que o texto claramente ensina, sem controvérsia, é que um casamento forte transborda em serviço conjunto à igreja, e não se fecha sobre si mesmo.",
            secondQuote: {
              author: "Michael Goheen",
              text: "Uma família que vive apenas para si mesma, mesmo sendo tecnicamente cristã, perdeu de vista que foi chamada, como toda a igreja, a participar da missão de Deus no mundo.",
              source: "Reflete a tese de Michael Goheen (com Craig Bartholomew) em O Drama das Escrituras / A Bíblia e a Missão sobre a família como participante da missão de Deus.",
            },
          },
          quizzes: [
            {
              question: "O que Romanos 16:3-5 revela sobre a relação entre o lar cristão e a igreja local no Novo Testamento?",
              options: [
                "Que as casas dos crentes eram totalmente separadas da vida da igreja",
                "Que casas de crentes, como a de Priscila e Áquila, eram lugar onde a igreja se reunia",
                "Que somente prédios religiosos oficiais podiam abrigar reuniões da igreja",
                "Que Priscila e Áquila não tinham envolvimento com a igreja",
              ],
              correctIndex: 1,
              explanation: "O texto menciona explicitamente 'a igreja que se reúne na casa deles' — o lar como extensão da vida da igreja.",
            },
            {
              question: "Segundo Hebreus 10:24-25, qual é o propósito de os cristãos não abandonarem a congregação?",
              options: [
                "Cumprir uma obrigação religiosa vazia",
                "Encorajar-se mutuamente ao amor e às boas obras",
                "Demonstrar status social dentro da comunidade",
                "Evitar julgamento social de outros cristãos",
              ],
              correctIndex: 1,
              explanation: "O texto conecta diretamente a reunião regular ao propósito de encorajamento mútuo e estímulo a boas obras.",
            },
          ],
          application:
            "Avalie, com sua família (ou consigo mesmo), o nível atual de envolvimento com a igreja local — não apenas presença em cultos, mas participação real em grupos pequenos, uso de dons e serviço prático. Dê um passo concreto de maior envolvimento esta semana.",
          prayer:
            "Senhor, obrigado pela igreja local que colocaste em nossa vida. Perdoa-me pelas vezes em que tratei minha família como um núcleo fechado, sem considerar como podemos servir e ser servidos pelo corpo de Cristo. Ajuda-nos a abrir nossa casa e nosso tempo para a comunhão da igreja, como Priscila e Áquila fizeram. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Convide alguém da sua igreja (um irmão solteiro, um casal novo, uma família recém-chegada) para sua casa nesta semana, ou participe ativamente de um grupo pequeno se ainda não o faz.",
          reflectionQuestion:
            "Sua família tem vivido de forma isolada da igreja local, ou tem se tornado, como a casa de Priscila e Áquila, um espaço aberto para a comunhão e o crescimento de outros crentes?",
          xp: 27,
        },
        {
          id: "fc-8-2",
          title: "Ordenanças e Vida em Comunidade: Batismo e Ceia na Vida da Família",
          intro: [
            "Duas práticas centrais marcam a vida da igreja local, e a família cristã participa delas junto com toda a comunidade: o Batismo, que declara publicamente a fé em Cristo e a identificação com sua morte e ressurreição (Rm 6:3-4), e a Ceia do Senhor, que relembra regularmente o sacrifício de Cristo e renova a comunhão do corpo de crentes (1 Co 11:23-26).",
            "Essas não são práticas privadas de família — são ordenanças da igreja, recebidas e vividas dentro da comunidade de fé, sob a orientação e o cuidado dos pastores e líderes locais. Uma família cristã madura ensina seus filhos, desde cedo, o significado dessas práticas, preparando-os para, no tempo certo e com profissão pessoal e consciente de fé, participar delas plenamente.",
            "Questões específicas — como a idade apropriada para o batismo de uma criança ou adolescente, os detalhes práticos de preparação, ou a frequência da Ceia do Senhor — variam conforme a orientação de cada igreja local, e é ali, com o pastor e os líderes que conhecem a família, que essas decisões devem ser conversadas e conduzidas com cuidado pastoral.",
          ],
          verses: [
            {
              ref: "Romanos 6:3-4",
              textByVersion: {
                NVI: "Vocês não sabem que todos nós, que fomos batizados em Cristo Jesus, fomos batizados em sua morte?... a fim de vivermos uma vida nova.",
              },
            },
            {
              ref: "1 Coríntios 11:26",
              textByVersion: {
                NVI: "Porquanto, sempre que comerem deste pão e beberem deste cálice, vocês proclamam a morte do Senhor, até que ele venha.",
              },
              originals: [
                { word: "καταγγέλλετε", translit: "katangellete", meaning: "proclamam, anunciam publicamente — a Ceia não é apenas lembrança privada, é declaração comunitária do Evangelho", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "βαπτίζω", translit: "baptizō", meaning: "batizar, imergir — identificação pública e simbólica com a morte, sepultamento e ressurreição de Cristo", lang: "grego" },
            { word: "κοινωνία", translit: "koinōnia", meaning: "comunhão, participação conjunta — a Ceia do Senhor renova e expressa a comunhão do corpo de crentes", lang: "grego" },
          ],
          deepDive:
            "É importante que a família cristã entenda que Batismo e Ceia do Senhor não são rituais mágicos que produzem salvação por si mesmos, nem meras tradições simbólicas vazias — são ordenanças instituídas por Cristo, cheias de significado espiritual real, que declaram e alimentam a fé de quem já creu genuinamente no Evangelho. Sobre o modo específico do batismo (por imersão, aspersão), quem pode administrá-lo, a frequência da Ceia e outros detalhes práticos, cristãos fiéis de diferentes tradições aplicam de formas distintas, e cada família deve seguir com submissão e confiança a orientação de sua própria igreja local nesses assuntos, buscando sempre entender o porquê bíblico por trás da prática, e não apenas cumprir uma formalidade.",
          theologianQuote: {
            author: "Davi Lago",
            text: "O Batismo e a Ceia não são apenas rituais da igreja para o indivíduo; são momentos em que toda a família de Deus, incluindo cada família natural dentro dela, relembra junta o Evangelho que a uniu.",
            source: "Reflete a ênfase pastoral de Davi Lago sobre o Batismo e a Ceia como memória do Evangelho compartilhada por toda a família da fé.",
          },
          quizzes: [
            {
              question: "O que Romanos 6:3-4 ensina sobre o significado do Batismo?",
              options: [
                "Que é apenas uma tradição cultural, sem significado espiritual",
                "Que representa identificação com a morte e ressurreição de Cristo, para uma vida nova",
                "Que garante automaticamente a salvação, independente de fé pessoal",
                "Que deve ser praticado apenas por adultos que já são casados",
              ],
              correctIndex: 1,
              explanation: "O texto conecta diretamente o batismo à identificação simbólica com a morte e ressurreição de Cristo.",
            },
            {
              question: "Segundo 1 Coríntios 11:26, qual é o propósito comunitário da Ceia do Senhor?",
              options: [
                "Uma refeição social sem relação com o Evangelho",
                "Proclamar publicamente a morte do Senhor até que ele volte",
                "Substituir a necessidade de pregação da Palavra",
                "Ser praticada exclusivamente de forma individual e privada",
              ],
              correctIndex: 1,
              explanation: "O texto descreve a Ceia como proclamação pública e comunitária da morte do Senhor, não apenas lembrança privada.",
            },
          ],
          application:
            "Se você tem filhos que ainda não compreendem plenamente o significado do Batismo e da Ceia, dedique um momento nesta semana para explicar, de forma simples e adequada à idade deles, o que essas práticas significam e por que a igreja as pratica.",
          prayer:
            "Senhor, obrigado pelo Batismo e pela Ceia, sinais visíveis do Evangelho que já creio. Ajuda minha família a compreender e valorizar essas práticas, não como rituais vazios, mas como declarações reais de fé e comunhão com o teu corpo, a igreja. Guia-nos, com submissão, à orientação da nossa igreja local sobre esses assuntos. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Converse com seu pastor ou líder de igreja sobre como sua família pode se preparar melhor, ou ensinar melhor seus filhos, a respeito do significado bíblico do Batismo e da Ceia do Senhor.",
          reflectionQuestion:
            "Seus filhos (ou pessoas mais jovens que você influencia) entendem o Batismo e a Ceia como rituais automáticos, ou como declarações profundas de um Evangelho que transformou vidas reais?",
          xp: 26,
        },
      ],
    },
    {
      id: "fc-mod-9",
      title: "Módulo IX: Sofrimento, Crises e Restauração na Família",
      lessons: [
        {
          id: "fc-9-1",
          title: "Quando a Família Sofre: Fé em Meio à Dor",
          intro: [
            "Nenhuma família cristã está imune ao sofrimento — doença, perda, dificuldades financeiras, filhos que se afastam da fé, conflitos profundos. A Bíblia não promete um lar isento de dor; promete algo mais profundo: a presença fiel de Deus dentro da dor. 'Perto está o Senhor dos que têm o coração quebrantado' (Sl 34:18).",
            "Jó é o exemplo bíblico mais completo de uma família atingida por perda catastrófica — filhos, bens, saúde — em um curto espaço de tempo. O livro não oferece uma explicação simples e completa do porquê do sofrimento, mas oferece algo igualmente valioso: o exemplo de alguém que continuou confiando em Deus mesmo sem entender plenamente seus caminhos (Jó 1:21; 42:1-6).",
            "Romanos 8:28 é frequentemente citado de forma simplista, mas seu significado é profundo quando entendido corretamente: Deus opera todas as coisas para o bem daqueles que o amam — não que toda dor seja, em si mesma, boa, mas que Deus é soberano o bastante para trazer bem, no seu tempo e à sua maneira, mesmo através das piores circunstâncias familiares.",
          ],
          verses: [
            {
              ref: "Salmo 34:18",
              textByVersion: {
                NVI: "Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito abatido.",
              },
            },
            {
              ref: "Romanos 8:28",
              textByVersion: {
                NVI: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.",
              },
              originals: [
                { word: "συνεργεῖ", translit: "synergei", meaning: "coopera, trabalha em conjunto — Deus ativamente entrelaça todas as circunstâncias, inclusive dolorosas, em direção a um propósito de bem", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "שָׁבַר", translit: "shabar", meaning: "quebrar, despedaçar — descreve o coração ferido pela dor, ao qual Deus promete estar perto", lang: "hebraico" },
            { word: "συνεργέω", translit: "synergeō", meaning: "cooperar, trabalhar junto — Deus tece as circunstâncias, mesmo dolorosas, em direção a um bem maior", lang: "grego" },
          ],
          deepDive:
            "Romanos 8:28 não ensina que todo sofrimento seja, em si mesmo, algo bom ou desejável — a dor de uma família enlutada, doente ou fraturada é real e não deve ser minimizada com respostas rápidas e superficiais. O texto ensina algo distinto e mais robusto: que Deus é soberano sobre as circunstâncias, mesmo as mais dolorosas, e capaz de tecer, com o tempo, propósitos de bem a partir delas — algo que muitas vezes só se torna visível em retrospecto, ou até mesmo apenas na eternidade. Sobre o porquê específico de um sofrimento particular (por que esta doença, esta perda, neste momento), a Bíblia geralmente não oferece uma resposta detalhada e individual — o livro de Jó, de fato, termina sem que Deus explique diretamente o motivo do sofrimento dele, mas com Jó adorando a Deus mesmo assim, confiando em seu caráter mesmo sem entender plenamente seus caminhos.",
          theologianQuote: {
            author: "Tim Keller",
            text: "Deus nunca desperdiça dor; ele pode não explicá-la totalmente agora, mas promete estar presente nela e, com o tempo, usá-la para um propósito que, um dia, faremos sentido — mesmo que só na eternidade.",
            source: "Reflete a abordagem de Tim Keller sobre sofrimento em Caminhando com Deus Através da Dor e do Sofrimento (Walking with God through Pain and Suffering).",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "2 Coríntios 1:3-4",
                textByVersion: {
                  NVI: "Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo, Pai de misericórdia e Deus de toda consolação, que nos consola em todas as nossas tribulações, para que também possamos consolar os que estão passando por qualquer tribulação.",
                },
              },
            ],
            historicalContext:
              "O livro de Jó desafia diretamente a teologia da retribuição comum no Antigo Oriente Próximo, segundo a qual sofrimento era sempre sinal direto de pecado ou castigo divino específico. Os amigos de Jó representam justamente essa suposição cultural equivocada — e Deus, ao final do livro, os repreende por falarem de forma imprecisa sobre Ele (Jó 42:7), mesmo defendendo, em aparência, a causa divina.",
            exegeticalNotes:
              "A palavra grega 'paraklēsis' (consolação, conforto) em 2 Coríntios 1 compartilha a mesma raiz de 'paráclito', título usado para o Espírito Santo (Jo 14:16). O conforto que o crente recebe de Deus não é apenas sentimental — é a mesma presença consoladora do Espírito, capacitando quem sofreu a se tornar, depois, fonte de consolo genuíno para outros que sofrem.",
            theologicalDebate:
              "Cristãos fiéis sustentam diferentes ênfases teológicas ao lidar com o problema do sofrimento (teodiceia): alguns enfatizam mais o livre-arbítrio humano e a queda como origem do sofrimento no mundo; outros enfatizam mais a soberania de Deus tecendo propósitos redentores mesmo através da dor; a maioria reconhece que parte do sofrimento simplesmente permanece um mistério que só será plenamente respondido na eternidade (1 Co 13:12). Diante de uma família enlutada, doente ou em crise real, respostas teológicas apressadas quase sempre machucam mais do que ajudam — presença, oração e acompanhamento pastoral genuíno importam mais do que explicações completas.",
            secondQuote: {
              author: "C.S. Lewis",
              text: "Ninguém me contou que a dor se pareceria tanto com o medo.",
              source: "C.S. Lewis, Uma Dor Observada (A Grief Observed) — citação confirmada, linha de abertura da obra.",
            },
          },
          quizzes: [
            {
              question: "O que Salmo 34:18 promete às famílias que atravessam sofrimento e coração quebrantado?",
              options: [
                "Que o sofrimento será imediatamente removido",
                "Que Deus está perto dos que têm o coração quebrantado",
                "Que a dor é sempre sinal de pecado não confessado",
                "Que a fé elimina toda possibilidade de tristeza",
              ],
              correctIndex: 1,
              explanation: "O salmo promete proximidade de Deus na dor, não ausência automática da dor.",
            },
            {
              question: "Como Romanos 8:28 deve ser corretamente entendido diante do sofrimento familiar?",
              options: [
                "Que toda dor é, em si mesma, boa e deve ser celebrada",
                "Que Deus é soberano para trazer bem a partir de circunstâncias difíceis, com o tempo",
                "Que o sofrimento sempre tem uma explicação clara e imediata",
                "Que apenas cristãos maduros podem confiar nesse versículo",
              ],
              correctIndex: 1,
              explanation: "O texto afirma a soberania de Deus sobre as circunstâncias, tecendo bem a partir delas, não que a dor em si seja boa.",
            },
          ],
          application:
            "Se sua família está atravessando (ou já atravessou) um período de sofrimento profundo, permita-se lamentar honestamente diante de Deus (os Salmos de lamento são um modelo bíblico legítimo para isso), em vez de apenas reprimir a dor com respostas espirituais superficiais.",
          prayer:
            "Senhor, quando a dor bate à porta da minha família, ajuda-me a correr para ti, não para longe de ti. Não peço que me expliques tudo agora, mas peço que te faças perto do meu coração quebrantado, como prometeste. Ensina-me a confiar no teu caráter, mesmo quando não entendo os teus caminhos. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia o livro de Jó (ou pelo menos os capítulos 1, 2 e 42) nesta semana, observando como ele lida com a perda sem perder a fé, e anote uma verdade que fale diretamente à sua própria situação familiar atual.",
          reflectionQuestion:
            "Nos momentos mais difíceis da sua família, você tem se aproximado de Deus com honestidade e lamento, ou se afastado dele por não entender o porquê da dor?",
          xp: 28,
        },
        {
          id: "fc-9-2",
          title: "Quando o Casamento se Rompe: Graça, Limites e Restauração",
          intro: [
            "Nenhum tema exige mais cuidado pastoral e humildade teológica do que separação e divórcio. A Bíblia claramente afirma que o desenho original de Deus para o casamento é permanência: 'o que Deus uniu, o homem não separe' (Mt 19:6). O divórcio nunca é o plano A de Deus para nenhum casal, e a Escritura sempre o trata como uma tragédia relacionada à dureza do coração humano (Mt 19:8), não como algo neutro ou desejável.",
            "Ao mesmo tempo, os textos bíblicos reconhecem situações concretas de quebra profunda da aliança conjugal — como infidelidade sexual continuada e não arrependida (Mt 19:9) — em que a separação ou o divórcio pode se tornar uma realidade permitida, ainda que dolorosa. Sobre os limites exatos, as circunstâncias específicas e a possibilidade de um novo casamento após o divórcio, cristãos fiéis de diferentes tradições interpretam os textos bíblicos de formas distintas, e esse é precisamente o tipo de decisão que nunca deve ser tomada sozinho, mas sempre em diálogo próximo, honesto e contínuo com pastores e líderes espirituais da igreja local.",
            "Além disso, é essencial afirmar com clareza: em situações de abuso físico, emocional ou de qualquer forma de violência dentro do lar, a Bíblia nunca pede que a vítima permaneça em silêncio ou em perigo em nome de uma suposta 'santidade do casamento'. Buscar segurança, proteção e, quando necessário, separação física imediata, é sabedoria e cuidado bíblico, não desobediência — e deve ser feito com apoio urgente de líderes da igreja e, quando necessário, das autoridades competentes.",
          ],
          verses: [
            {
              ref: "Mateus 19:6,8-9",
              textByVersion: {
                NVI: "Portanto, o que Deus uniu, ninguém separe... Foi por causa da dureza dos seus corações que Moisés lhes permitiu divorciar-se de suas mulheres. Mas não foi assim desde o princípio.",
              },
            },
            {
              ref: "Malaquias 2:16",
              textByVersion: {
                NVI: "'Eu odeio o divórcio', diz o Senhor, o Deus de Israel, 'e odeio a violência contra a esposa', diz o Senhor dos Exércitos.",
              },
              originals: [
                { word: "שָׂנֵא", translit: "sane", meaning: "odiar, detestar — descreve a profunda aversão de Deus tanto ao divórcio quanto à violência conjugal, colocados lado a lado no mesmo versículo", lang: "hebraico" },
              ],
            },
          ],
          keywords: [
            { word: "σκληροκαρδία", translit: "sklērokardia", meaning: "dureza de coração — a razão bíblica pela qual a permissão para o divórcio existiu, refletindo pecado, não o ideal de Deus", lang: "grego" },
            { word: "שָׂנֵא", translit: "sane", meaning: "odiar profundamente — usado por Deus tanto para o divórcio quanto para a violência doméstica em Malaquias 2:16", lang: "hebraico" },
          ],
          deepDive:
            "É digno de nota que Malaquias 2:16 coloca o divórcio e a violência contra a esposa lado a lado, ambos descritos como coisas que Deus 'odeia' — o que revela que a preocupação divina com o casamento nunca foi manter a aparência de união a qualquer custo, mas proteger a aliança e as pessoas dentro dela. Este material não pretende, e não deveria pretender, ser suficiente para orientar alguém em meio a uma crise conjugal real e específica — questões como infidelidade, abandono, abuso, ou o processo de restauração após uma separação, envolvem nuances pastorais, legais e emocionais profundas demais para serem resolvidas apenas com um estudo bíblico. Se você, ou alguém que você conhece, está enfrentando uma dessas realidades, o passo mais sábio e mais bíblico é buscar, o quanto antes, o cuidado próximo de um pastor, conselheiro cristão qualificado, e, em situações de risco, também apoio profissional e legal.",
          theologianQuote: {
            author: "Larry Crabb",
            text: "A graça de Deus não ignora a gravidade da quebra de uma aliança conjugal, mas também não abandona ninguém nela; há sempre um caminho de cuidado, verdade e, quando possível, restauração — buscado dentro da comunhão e do acompanhamento da igreja local.",
            source: "Reflete a abordagem pastoral de Larry Crabb sobre graça, verdade e restauração em O Casamento (The Marriage Builder) e Por Dentro e Por Fora (Inside Out).",
          },
          quizzes: [
            {
              question: "Segundo Mateus 19:6-8, qual é o plano original de Deus para o casamento, e por que o divórcio foi permitido no Antigo Testamento?",
              options: [
                "Deus planejou o divórcio desde o início como algo neutro",
                "O plano original é permanência; o divórcio foi permitido por causa da dureza do coração humano",
                "O casamento nunca teve, bíblicamente, qualquer valor de permanência",
                "A permissão ao divórcio anula totalmente o ideal original de união",
              ],
              correctIndex: 1,
              explanation: "Jesus afirma claramente que a permissão ao divórcio refletia dureza de coração, não o desenho original de Deus.",
            },
            {
              question: "O que Malaquias 2:16 ensina ao colocar divórcio e violência conjugal lado a lado?",
              options: [
                "Que ambos são igualmente irrelevantes espiritualmente",
                "Que Deus se preocupa tanto com a fidelidade da aliança quanto com a proteção das pessoas dentro dela",
                "Que a vítima de violência deve permanecer calada para preservar o casamento",
                "Que apenas o divórcio é condenável, não a violência",
              ],
              correctIndex: 1,
              explanation: "Deus declara odiar ambos, revelando que sua preocupação central é a fidelidade da aliança e a proteção das pessoas nela.",
            },
          ],
          application:
            "Se você conhece alguém enfrentando uma crise conjugal grave (infidelidade, abuso ou separação), não ofereça respostas rápidas e simplistas — ofereça presença, escute com humildade, e ajude essa pessoa a buscar, com urgência, o acompanhamento de um pastor ou conselheiro cristão qualificado.",
          prayer:
            "Senhor, tu odeias o divórcio porque amas a aliança e amas as pessoas dentro dela — inclusive as que sofrem violência ou traição. Onde há casamentos quebrados ou em crise ao meu redor, dá sabedoria aos pastores que os acompanham, e dá-me um coração de graça, sem julgamento fácil, para quem atravessa essa dor. Protege quem está em perigo dentro do próprio lar. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Se você está em crise conjugal ou conhece alguém que está, dê o passo de agendar uma conversa com um pastor ou líder espiritual de confiança nesta semana, em vez de enfrentar isso sozinho(a) ou apenas em silêncio.",
          reflectionQuestion:
            "Você tem tratado famílias que enfrentam divórcio ou crises graves com graça e cuidado pastoral, ou com julgamento rápido e distante?",
          xp: 30,
        },
      ],
    },
    {
      id: "fc-mod-10",
      title: "Módulo X: Família em Missão: Hospitalidade e Testemunho",
      lessons: [
        {
          id: "fc-10-1",
          title: "Hospitalidade: Abrindo a Casa para o Reino",
          intro: [
            "A hospitalidade bíblica é muito mais que receber amigos para uma refeição agradável — é um mandamento explícito para os cristãos: 'pratiquem a hospitalidade' (Rm 12:13), e uma das qualificações listadas para líderes na igreja (1 Tm 3:2; Tt 1:8). A palavra grega para hospitalidade, philoxenia, significa literalmente 'amor ao estrangeiro' — abrir a própria casa não apenas para quem já se conhece bem, mas para quem é diferente, novo, ou até desconhecido.",
            "Hebreus 13:2 lembra um detalhe surpreendente: 'não se esqueçam da hospitalidade, porque, praticando-a, alguns, sem o saber, hospedaram anjos'. A hospitalidade cristã carrega uma dimensão espiritual maior do que aparenta — é um dos meios comuns pelos quais Deus abençoa tanto quem recebe quanto quem é recebido, e um testemunho poderoso do Evangelho para quem está de fora da fé.",
            "Uma família que pratica hospitalidade genuína — abrindo a mesa, o tempo e, muitas vezes, a própria vida para vizinhos, novos convertidos, missionários de passagem, ou pessoas em dificuldade — participa ativamente da missão de Deus no mundo, muitas vezes de formas mais simples e mais poderosas do que imagina.",
          ],
          verses: [
            {
              ref: "Romanos 12:13",
              textByVersion: {
                NVI: "Compartilhem o que vocês têm com os santos que estão em necessidade. Pratiquem a hospitalidade.",
              },
              originals: [
                { word: "φιλοξενία", translit: "philoxenia", meaning: "amor ao estrangeiro/hóspede — combinação de 'philos' (amor) e 'xenos' (estranho/forasteiro); acolhimento intencional de quem não pertence naturalmente ao círculo próximo", lang: "grego" },
              ],
            },
            {
              ref: "Hebreus 13:2",
              textByVersion: {
                NVI: "Não se esqueçam da hospitalidade, porque, praticando-a, alguns, sem o saber, hospedaram anjos.",
              },
            },
          ],
          keywords: [
            { word: "φιλοξενία", translit: "philoxenia", meaning: "amor ao estrangeiro, hospitalidade — acolhimento ativo e intencional de quem é diferente ou desconhecido", lang: "grego" },
            { word: "ξένος", translit: "xenos", meaning: "estrangeiro, forasteiro, hóspede — aquele que a hospitalidade bíblica é chamada a acolher, indo além do círculo familiar já conhecido", lang: "grego" },
          ],
          deepDive:
            "É significativo que a hospitalidade seja uma das poucas qualificações práticas e concretas exigidas de líderes da igreja (1 Tm 3:2), ao lado de virtudes de caráter — isso mostra que a Bíblia não a considera um dom opcional de algumas famílias 'mais sociáveis', mas uma expressão esperada do amor cristão maduro. Sobre como praticar hospitalidade de forma sustentável (frequência, formato, tipo de convidados), cada família deve discernir com sabedoria conforme sua realidade, temporada de vida e recursos disponíveis — hospitalidade genuína não exige casas grandes, refeições elaboradas ou perfeição de anfitrião; exige, principalmente, um coração disposto a compartilhar tempo, mesa e vida com quem Deus coloca no caminho, mesmo em meio à simplicidade.",
          theologianQuote: {
            author: "Charles Swindoll",
            text: "A hospitalidade cristã não é sobre impressionar quem entra em nossa casa, é sobre amar quem entra em nossa casa — e, ao fazer isso, muitas vezes recebemos de volta mais do que oferecemos.",
            source: "Reflete a ênfase de Charles Swindoll sobre serviço e hospitalidade em Aperfeiçoando seu Caráter (Improving Your Serve).",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "3 João 1:5-8",
                textByVersion: {
                  NVI: "Amado, você é fiel no que faz para os irmãos, mesmo sendo eles estranhos para você... Devemos, pois, receber com hospitalidade irmãos como esses, para sermos cooperadores da verdade.",
                },
              },
            ],
            historicalContext:
              "No mundo greco-romano, viajar era arriscado e hospedarias públicas tinham reputação de perigo e imoralidade. Por isso, a hospitalidade doméstica cristã era essencial para o funcionamento prático da igreja primitiva — missionários itinerantes, apóstolos e mestres viajantes dependiam quase inteiramente de lares cristãos dispostos a recebê-los (3 Jo, Rm 16:23).",
            exegeticalNotes:
              "A palavra grega 'philoxenia' (Rm 12:13; Hb 13:2), traduzida 'hospitalidade', significa literalmente 'amor ao estranho' — o oposto de 'xenofobia' (medo ou aversão ao estranho). Isso distingue a hospitalidade bíblica de simplesmente receber amigos já conhecidos: seu alvo principal, no Novo Testamento, é o estranho, o visitante, aquele que ainda não faz parte do círculo familiar do anfitrião.",
            theologicalDebate:
              "A Escritura não define regras fixas sobre frequência, formato ou limites práticos da hospitalidade cristã (quantas pessoas receber, com que regularidade, que tipos de cuidado de segurança adotar em relação a crianças e à própria família). Ela estabelece o princípio — um coração generoso e disposto a abrir a casa — mas a aplicação prudente e sustentável desse princípio, especialmente equilibrando hospitalidade com descanso familiar e proteção dos mais vulneráveis do lar, é questão de sabedoria pastoral, não de mandamento detalhado.",
            secondQuote: {
              author: "Craig Blomberg",
              text: "Em Lucas, hospitalidade nunca é apenas cortesia social — é um teste concreto de como o Evangelho transformou a relação do discípulo com seus bens, sua mesa e sua casa.",
              source: "Reflete a análise de Craig Blomberg sobre posses e hospitalidade no Evangelho de Lucas em Nem Pobreza Nem Riqueza (Neither Poverty Nor Riches).",
            },
          },
          quizzes: [
            {
              question: "O que a palavra grega 'philoxenia', usada para hospitalidade em Romanos 12:13, significa literalmente?",
              options: [
                "Medo do desconhecido",
                "Amor ao estrangeiro ou forasteiro",
                "Preferência por relacionamentos já estabelecidos",
                "Uma obrigação puramente social, sem carga espiritual",
              ],
              correctIndex: 1,
              explanation: "A palavra combina 'philos' (amor) e 'xenos' (estrangeiro), indicando acolhimento intencional de quem não é do círculo próximo.",
            },
            {
              question: "Por que Hebreus 13:2 destaca a importância de não esquecer a hospitalidade?",
              options: [
                "Porque é uma tradição cultural sem relevância espiritual",
                "Porque, ao praticá-la, alguns hospedaram anjos sem saber",
                "Porque apenas líderes da igreja precisam praticá-la",
                "Porque hospitalidade é apenas sobre conforto material do anfitrião",
              ],
              correctIndex: 1,
              explanation: "O texto revela uma dimensão espiritual inesperada na prática simples de acolher outros em casa.",
            },
          ],
          application:
            "Convide alguém que você ainda não conhece bem — um vizinho, um novo membro da igreja, um estrangeiro na sua cidade — para uma refeição ou momento simples em sua casa nesta semana, com o objetivo de conhecê-lo e, se possível, compartilhar o Evangelho.",
          prayer:
            "Senhor, ensina minha família a abrir nossa casa e nosso tempo para quem é diferente ou desconhecido, como um reflexo do teu acolhimento a nós, que também éramos estranhos e distantes de ti. Tira de mim qualquer desculpa de comodismo ou insegurança que me impeça de praticar hospitalidade genuína. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Planeje e execute um momento de hospitalidade concreto nesta semana — mesmo simples — recebendo alguém de fora do seu círculo familiar mais próximo.",
          reflectionQuestion:
            "Sua casa tem sido um espaço fechado apenas para quem você já conhece bem, ou um lugar aberto, mesmo que de forma simples, para quem Deus coloca no seu caminho?",
          xp: 26,
        },
        {
          id: "fc-10-2",
          title: "Família Missionária: Discipulado e Testemunho no Cotidiano",
          intro: [
            "A Grande Comissão não é um chamado apenas para missionários que viajam para terras distantes — é um chamado para toda família cristã, vivido primeiramente dentro de casa e depois estendido a quem está ao redor: vizinhos, colegas de trabalho, escola dos filhos, familiares não convertidos. 'Portanto, vão e façam discípulos de todas as nações' (Mt 28:19) começa, para a maioria das famílias, no próprio quintal.",
            "Uma família com mentalidade missionária pensa deliberadamente sobre como suas rotinas comuns — a escola dos filhos, o bairro onde mora, o trabalho dos pais — podem se tornar campos de testemunho e serviço, e não apenas obrigações a serem cumpridas. Isso muda perguntas práticas do dia a dia: 'que vizinho podemos conhecer melhor?', 'como podemos orar juntos pelos familiares que ainda não creem?', 'que necessidade ao nosso redor podemos suprir em nome de Cristo?'.",
            "1 Pedro 3:15 dá um princípio central para esse testemunho cotidiano: estar sempre 'preparados para responder a qualquer pessoa que pedir a razão da esperança que há' em nós — 'e façam isso com mansidão e respeito'. A vida de uma família cristã, vivida com integridade visível diante de quem observa, é frequentemente o primeiro sermão que muitos incrédulos realmente 'ouvem' antes de estarem prontos para ouvir palavras.",
          ],
          verses: [
            {
              ref: "Mateus 28:19-20",
              textByVersion: {
                NVI: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo, ensinando-os a obedecer a tudo o que eu lhes ordenei.",
              },
            },
            {
              ref: "1 Pedro 3:15",
              textByVersion: {
                NVI: "Estejam sempre preparados para responder a qualquer pessoa que lhes pedir a razão da esperança que há em vocês. Contudo, façam isso com mansidão e respeito.",
              },
              originals: [
                { word: "ἀπολογία", translit: "apologia", meaning: "defesa, resposta racional e ordenada — a razão da fé cristã deve poder ser explicada, não apenas sentida", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "μαθητεύω", translit: "mathēteuō", meaning: "fazer discípulo, ensinar — o verbo central da Grande Comissão, aplicável primeiro dentro de casa e depois além dela", lang: "grego" },
            { word: "ἀπολογία", translit: "apologia", meaning: "defesa ordenada e respeitosa da fé — a prontidão para explicar, com mansidão, a razão da esperança cristã", lang: "grego" },
          ],
          deepDive:
            "É significativo que 1 Pedro 3:15 combine dois elementos que muitas famílias separam, para seu próprio prejuízo missionário: prontidão intelectual ('estejam sempre preparados') e caráter relacional ('mansidão e respeito'). Uma família que conhece bem a fé mas a comunica com arrogância afasta pessoas do Evangelho tanto quanto uma família que ama genuinamente mas não sabe explicar em que crê e por quê. Sobre como equilibrar, na prática, o tempo dedicado ao discipulado dos próprios filhos com o tempo dedicado ao testemunho e serviço a pessoas de fora da família (vizinhos, comunidade), a Bíblia não estabelece uma proporção fixa — mas deixa claro que ambos são chamados legítimos e complementares: a família que só olha para dentro de si mesma esquece a missão; a família que só olha para fora negligencia o próprio chamado primário de discipular os filhos que Deus já confiou a ela.",
          theologianQuote: {
            author: "David Bosch",
            text: "A missão de Deus não é um programa que a família cristã executa de vez em quando, é uma identidade que ela carrega o tempo todo — no lar, na vizinhança, no trabalho, em cada relação cotidiana tocada pelo Evangelho.",
            source: "Reflete a tese central de David Bosch em Missão Transformadora (Transforming Mission): a missão não é um programa da igreja, mas um atributo do próprio Deus, do qual a igreja e a família cristã participam.",
          },
          quizzes: [
            {
              question: "Segundo Mateus 28:19-20, para quem é dirigido o chamado de fazer discípulos?",
              options: [
                "Apenas para missionários profissionais em terras distantes",
                "Para todos os discípulos de Jesus, aplicável primeiro dentro de casa e depois além dela",
                "Apenas para pastores e líderes ordenados",
                "Somente para a geração dos apóstolos originais",
              ],
              correctIndex: 1,
              explanation: "A Grande Comissão é dirigida a todos os discípulos de Jesus, começando naturalmente pela própria família e se estendendo além dela.",
            },
            {
              question: "Quais dois elementos 1 Pedro 3:15 combina para o testemunho cristão eficaz?",
              options: [
                "Apenas conhecimento intelectual, sem preocupação com o caráter",
                "Prontidão para responder e mansidão/respeito no modo de comunicar",
                "Apenas boas obras, sem qualquer explicação da fé",
                "Isolamento total de quem não compartilha a mesma fé",
              ],
              correctIndex: 1,
              explanation: "O texto une prontidão para explicar a fé com mansidão e respeito na forma de comunicá-la — conteúdo e caráter juntos.",
            },
          ],
          application:
            "Escolha, com sua família, uma pessoa ou situação concreta ao redor — um vizinho, um colega de escola dos filhos, um familiar distante da fé — para orar especificamente por ela nesta semana, e busque um passo prático e respeitoso de aproximação e testemunho.",
          prayer:
            "Senhor, faz da minha família uma família em missão — não apenas voltada para dentro de si mesma, mas atenta às pessoas que colocaste ao nosso redor. Dá-nos prontidão para explicar a razão da nossa esperança, e mansidão e respeito na forma de fazer isso. Que nossa vida cotidiana seja um testemunho visível do teu Evangelho. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Prepare, em família ou sozinho, uma resposta simples e pessoal (dois ou três minutos) sobre por que você crê em Jesus, para estar pronto(a) caso alguém pergunte esta semana, como orienta 1 Pedro 3:15.",
          reflectionQuestion:
            "Se as pessoas mais próximas de você — vizinhos, colegas, familiares distantes da fé — só pudessem observar sua vida familiar, que tipo de esperança elas veriam refletida nela?",
          xp: 28,
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
            source: "Transforming Mission: Paradigm Shifts in Theology of Mission, p. 389-390",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se John Stott realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Hernandes Dias Lopes realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme se Vishal Mangalwadi realmente escreveu/disse algo equivalente antes de publicar como citação literal",
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
    {
      id: "ms-mod-3",
      title: "Módulo III: Missões e Culturas",
      lessons: [
        {
          id: "ms-3-1",
          title: "Missões e Culturas",
          intro: [
            "Um dos maiores riscos na história das missões cristãs não foi a falta de zelo, mas a confusão entre o Evangelho e a cultura de quem o levava. Missionários sinceros, por vezes, exportaram junto com as boas-novas de Cristo hábitos, roupas, músicas e costumes de sua própria terra, como se fossem parte inseparável da fé — e, sem perceber, pediram aos povos que recebiam o Evangelho para deixarem de ser quem eram, culturalmente, a fim de seguir a Jesus.",
            "A Bíblia corrige esse impulso já na sua primeira grande crise intercultural. Em Atos 15, alguns insistiam que os gentios convertidos precisavam se tornar culturalmente judeus — circuncidados e observantes da Lei mosaica — para serem plenamente aceitos por Deus. Reunida em concílio, a igreja primitiva decidiu o oposto: 'não devemos importunar os gentios que estão se convertendo a Deus' (At 15:19). A salvação é pela graça, mediante a fé em Cristo, e não depende de adotar os costumes de nenhum povo específico — nem do povo que primeiro recebeu a revelação, nem do povo que depois a leva adiante.",
            "Isso não significa que o Evangelho seja neutro em relação às culturas — ele julga e purifica o que em cada cultura se opõe a Deus, seja no Ocidente, seja no Oriente, seja em qualquer lugar. Mas o Evangelho também dignifica e redime aquilo que, em cada cultura, pode ser usado para glorificar a Cristo. Ele não pede que ninguém deixe de ser brasileiro, indígena, africano ou asiático para se tornar cristão; pede que cada povo, com sua língua e seus costumes próprios, se torne cristão sendo plenamente quem é.",
            "A visão final da redenção, em Apocalipse 7:9, não mostra a humanidade reduzida a uma única cultura uniforme diante do trono, mas uma multidão 'de toda tribo, língua, povo e nação', cada qual adorando ao Cordeiro com sua própria voz. A diversidade cultural não é um obstáculo à missão de Deus — ela é parte do quadro final que a missão de Deus está produzindo.",
          ],
          verses: [
            {
              ref: "Atos 15:19-20",
              textByVersion: {
                NVI: "Portanto, julgo que não devemos dificultar a vida dos gentios que estão se convertendo a Deus... mas escrevamos, dizendo-lhes que se abstenham da contaminação dos ídolos, da imoralidade sexual, e do sangue.",
                ACF: "Pelo que julgo que não se deve perturbar aqueles, dentre os gentios, que se convertem a Deus.",
              },
              originals: [
                { word: "παρενοχλεῖν", translit: "parenochlein", meaning: "importunar, sobrecarregar desnecessariamente — o concílio recusa impor aos gentios fardos culturais que não pertencem ao núcleo do Evangelho", lang: "grego" },
              ],
            },
            {
              ref: "Apocalipse 7:9",
              textByVersion: {
                NVI: "Diante do trono e do Cordeiro havia uma multidão que ninguém podia contar, de toda nação, tribo, povo e língua.",
              },
              originals: [
                { word: "φυλή", translit: "phylē", meaning: "tribo, clã — junto com 'ethnos', 'laos' e 'glossa', descreve a permanência da diversidade de povos na adoração eterna", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "παρενοχλέω", translit: "parenochleō", meaning: "importunar, colocar fardo desnecessário — usado no Concílio de Jerusalém para recusar exigir dos gentios costumes que não pertencem ao Evangelho", lang: "grego" },
            { word: "ἔθνος", translit: "ethnos", meaning: "nação, povo — a missão bíblica sempre respeitou a existência de povos distintos, sem exigir sua dissolução cultural", lang: "grego" },
          ],
          deepDive:
            "O Concílio de Jerusalém (Atos 15) é o texto-chave para pensar a relação entre Evangelho e cultura: ele distingue, de forma definitiva, entre o núcleo inegociável da fé (a salvação pela graça, mediante a fé em Cristo) e as formas culturais que podem variar legitimamente de povo para povo. Esse princípio protege contra dois erros simétricos. O primeiro é o etnocentrismo missionário: confundir a própria cultura com o Evangelho, como se seguir a Cristo exigisse adotar hábitos, estilo musical, vestimenta ou costumes de quem primeiro anunciou a mensagem — um erro cometido, em graus diferentes, por movimentos missionários ao longo da história, inclusive em terras brasileiras, quando se supôs que 'ser cristão' e 'abandonar a própria cultura' eram a mesma coisa. O segundo erro, oposto, é o relativismo sincretista: tratar toda prática cultural como igualmente compatível com o Evangelho, sem discernimento, misturando elementos incompatíveis com a fé cristã sob o pretexto de 'respeito cultural'. A resposta bíblica exige discernimento contínuo: o Evangelho sempre confronta o que em qualquer cultura se opõe a Deus, e sempre redime e usa o que em qualquer cultura pode servir à sua glória.",
          theologianQuote: {
            author: "Leslie Newbigin",
            text: "O Evangelho nunca chega a nenhum povo desencarnado de alguma cultura, mas também nunca pode ser absorvido, sem resíduo, por nenhuma cultura.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app a partir de temas centrais da obra de Newbigin sobre Evangelho e cultura; confirme a formulação exata antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Qual foi a principal questão discutida no Concílio de Jerusalém (Atos 15)?",
              options: [
                "Se os gentios convertidos precisavam adotar costumes judaicos para serem salvos",
                "Se os apóstolos deveriam parar de pregar aos gentios",
                "Se a Lei de Moisés deveria ser abolida para todos, incluindo judeus",
                "Se os gentios poderiam liderar a igreja de Jerusalém",
              ],
              correctIndex: 0,
              explanation: "O concílio decidiu que os gentios não precisavam se tornar culturalmente judeus para serem plenamente aceitos por Deus em Cristo.",
            },
            {
              question: "Segundo a lição, o que a Bíblia ensina sobre Evangelho e cultura?",
              options: [
                "Que todas as culturas são igualmente aceitáveis, sem qualquer distinção",
                "Que o Evangelho exige abandonar completamente a própria cultura",
                "Que o Evangelho confronta o que se opõe a Deus em cada cultura, mas dignifica o que pode servir à sua glória",
                "Que apenas uma cultura específica é compatível com a fé cristã",
              ],
              correctIndex: 2,
              explanation: "O Evangelho nem endossa nem rejeita culturas inteiras — ele as julga e as redime, discernindo o que se opõe a Deus e o que pode glorificá-lo.",
            },
            {
              question: "O que Apocalipse 7:9 revela sobre a diversidade cultural na eternidade?",
              options: [
                "Que ela será eliminada, restando apenas uma cultura única",
                "Que uma multidão de toda tribo, língua, povo e nação adorará ao Cordeiro",
                "Que apenas um idioma será usado na adoração celestial",
                "Que a diversidade de povos é irrelevante para a redenção",
              ],
              correctIndex: 1,
              explanation: "A cena final da redenção preserva, e não elimina, a diversidade de povos, línguas e culturas diante do trono de Deus.",
            },
          ],
          application:
            "Reflita sobre alguma tradição ou costume da sua própria cultura (regional, familiar ou nacional) que pode ser usado para honrar a Cristo, e sobre algum outro que precisa ser confrontado pelo Evangelho. Ore pedindo discernimento para não confundir preferência cultural com fidelidade bíblica.",
          prayer:
            "Senhor, tu amas todos os povos e todas as culturas que criaste, e teu Evangelho não pede que ninguém deixe de ser quem é para te seguir. Dá-me discernimento para reconhecer o que, na minha própria cultura, se opõe a ti, e coragem para abandonar isso; e dá-me sabedoria para reconhecer o que pode ser usado para tua glória. Livra-me tanto do orgulho cultural quanto do relativismo sem discernimento. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Converse com alguém de uma cultura, região ou origem diferente da sua sobre como o Evangelho tem se expressado de forma diferente (e igualmente legítima) na experiência de fé dessa pessoa.",
          reflectionQuestion:
            "Você já confundiu, alguma vez, uma preferência cultural pessoal com uma exigência bíblica ao avaliar a fé de outra pessoa ou de outro povo?",
          xp: 30,
        },
        {
          id: "ms-3-2",
          title: "Contextualização",
          intro: [
            "Se o Evangelho não pertence exclusivamente a nenhuma cultura, como ele deve ser anunciado a cada povo, de forma compreensível e ao mesmo tempo fiel? Essa é a pergunta que a teologia missionária chama de contextualização: comunicar a verdade imutável do Evangelho de maneira culturalmente inteligível, sem alterar seu conteúdo.",
            "O exemplo clássico está em Atos 17, quando Paulo se dirige aos filósofos gregos no Areópago de Atenas. Ele não começa citando o Antigo Testamento, texto estranho àquela audiência; começa observando um altar local 'Ao Deus Desconhecido' e citando poetas gregos que os próprios ouvintes conheciam ('nele vivemos, nos movemos e existimos', At 17:28). Paulo constrói uma ponte a partir daquilo que seus ouvintes já sabiam — e, a partir dessa ponte, anuncia o Deus criador, o juízo vindouro e a ressurreição de Cristo, sem suavizar nenhuma dessas verdades para agradar a audiência culta e cética.",
            "Esse é o padrão da contextualização bíblica: usar linguagem, ilustrações, formas de comunicação e pontos de contato próprios de cada cultura, mas jamais alterar o conteúdo do Evangelho para torná-lo mais palatável. Paulo se fez 'tudo para todos' (1 Co 9:22) na forma de comunicar — mas nunca mudou a mensagem que comunicava.",
            "Há dois desvios possíveis, e igualmente perigosos. O primeiro é a contextualização insuficiente: pregar o Evangelho em linguagem, categorias e referências estranhas ao ouvinte, tornando-o desnecessariamente incompreensível ou distante — como se a fidelidade bíblica exigisse ignorar a cultura de quem ouve. O segundo, mais grave, é a contextualização excessiva, também chamada de sincretismo: adaptar de tal forma a mensagem que seu conteúdo essencial é alterado ou diluído para se encaixar em categorias culturais ou religiosas incompatíveis com o Evangelho. A tarefa fiel do discípulo é encontrar, com sabedoria e oração, o caminho estreito entre esses dois erros.",
          ],
          verses: [
            {
              ref: "Atos 17:22-23",
              textByVersion: {
                NVI: "Paulo, então, levantando-se no meio do Areópago, disse: 'Atenienses, vejo que em todos os sentidos vocês são muito religiosos... encontrei também um altar com esta inscrição: A UM DEUS DESCONHECIDO. Pois bem, o que vocês adoram sem conhecer, isso mesmo eu anuncio a vocês.'",
              },
              originals: [
                { word: "ἄγνωστος", translit: "agnōstos", meaning: "desconhecido — Paulo usa uma referência religiosa local, já familiar aos ouvintes, como ponto de partida para anunciar o Deus verdadeiro", lang: "grego" },
              ],
            },
            {
              ref: "1 Coríntios 9:22-23",
              textByVersion: {
                NVI: "Fiz-me tudo para todos, para, por todos os meios possíveis, salvar alguns. Tudo isso faço por causa do evangelho, para ter parte nas suas bênçãos.",
                ACF: "Fiz-me tudo para todos, para de todos os modos chegar a salvar alguns.",
              },
            },
          ],
          keywords: [
            { word: "ἄγνωστος", translit: "agnōstos", meaning: "desconhecido — termo do altar ateniense que Paulo usa como ponte cultural, sem adotar a religiosidade politeísta local", lang: "grego" },
            { word: "γίνομαι", translit: "ginomai", meaning: "tornar-se, fazer-se — em 1 Coríntios 9, descreve a flexibilidade de forma de Paulo, nunca de conteúdo, ao se adaptar a diferentes ouvintes", lang: "grego" },
          ],
          deepDive:
            "A pregação de Paulo no Areópago (Atos 17:22-31) é um estudo de caso completo em contextualização fiel: ele começa por um ponto de contato genuíno na cultura local (o altar 'ao Deus desconhecido'), usa linguagem e citações que a audiência reconhece (poetas como Epimênides e Arato), mas conduz o discurso, sem desviar, até o cerne inegociável do Evangelho — um Deus criador que não habita em templos feitos por mãos humanas, um chamado universal ao arrependimento, e a garantia desse chamado na ressurreição de Cristo, o ponto em que parte da audiência escarnece e se retira (At 17:32). Isso demonstra que contextualização bem-feita não garante aceitação — ela garante compreensão e fidelidade simultâneas. É crucial notar a diferença entre forma e conteúdo: a forma (língua, ilustrações, pontos de partida culturais, formas musicais ou artísticas) pode e deve variar legitimamente entre culturas; o conteúdo (quem é Deus, a gravidade do pecado, a pessoa e obra de Cristo, a necessidade de arrependimento e fé, a ressurreição corporal) é fixo e não negociável em nenhuma cultura. Confundir essas duas categorias — exigir uniformidade de forma ou permitir variação de conteúdo — é o erro raiz por trás tanto do etnocentrismo missionário quanto do sincretismo.",
          theologianQuote: {
            author: "Michael Goheen",
            text: "A igreja fiel traduz o Evangelho para a língua e a vida de cada cultura, sem jamais traduzi-lo para fora de sua própria verdade.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app a partir de temas centrais da teologia missional de Goheen; confirme a formulação exata antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "O que Paulo fez, em Atos 17, ao pregar aos filósofos gregos no Areópago?",
              options: [
                "Ignorou completamente a cultura local e citou apenas o Antigo Testamento",
                "Partiu de um ponto de contato cultural conhecido (o altar 'ao Deus desconhecido') para anunciar o Evangelho",
                "Alterou o conteúdo da mensagem para evitar qualquer rejeição",
                "Evitou mencionar a ressurreição de Cristo para não ofender a audiência",
              ],
              correctIndex: 1,
              explanation: "Paulo usou uma referência religiosa e cultural conhecida dos atenienses como ponte para anunciar o Deus verdadeiro, sem alterar o conteúdo do Evangelho.",
            },
            {
              question: "Qual é a diferença essencial entre contextualização fiel e sincretismo?",
              options: [
                "Não há diferença real entre os dois conceitos",
                "A contextualização adapta apenas a forma de comunicação; o sincretismo altera o próprio conteúdo do Evangelho",
                "O sincretismo é sempre preferível, por respeitar mais a cultura local",
                "A contextualização é sempre pecaminosa e deve ser evitada",
              ],
              correctIndex: 1,
              explanation: "Contextualização legítima varia a forma (língua, ilustrações, pontos de contato); sincretismo compromete o conteúdo essencial da fé.",
            },
            {
              question: "Segundo 1 Coríntios 9:22-23, por que Paulo se fazia 'tudo para todos'?",
              options: [
                "Para agradar a todos e evitar qualquer tipo de conflito",
                "Para, por todos os meios possíveis, ver algumas pessoas salvas",
                "Porque não tinha convicções firmes sobre o Evangelho",
                "Para se adaptar culturalmente a ponto de mudar sua mensagem",
              ],
              correctIndex: 1,
              explanation: "A flexibilidade de Paulo era estratégica e missionária — na forma de se relacionar e comunicar —, nunca um compromisso do conteúdo do Evangelho.",
            },
          ],
          application:
            "Pense em uma pessoa próxima cuja cultura, geração ou formação seja diferente da sua. Reflita sobre qual 'altar ao Deus desconhecido' — uma pergunta, um anseio ou uma busca já presente na vida dessa pessoa — poderia servir de ponte honesta para uma conversa sobre o Evangelho.",
          prayer:
            "Senhor, dá-me sabedoria para anunciar o teu Evangelho de forma compreensível a cada pessoa que colocas em meu caminho, sem jamais alterar ou diluir a verdade que tu revelaste. Ajuda-me a construir pontes genuínas, como Paulo fez em Atenas, sem nunca abrir mão do conteúdo da cruz e da ressurreição de Cristo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Leia Atos 17:16-34 por completo esta semana e anote pelo menos três estratégias de comunicação que Paulo usou, avaliando como elas poderiam inspirar uma conversa sua com alguém de fora da fé cristã.",
          reflectionQuestion:
            "Você tende mais a errar pelo lado de comunicar o Evangelho de forma distante e incompreensível, ou pelo lado de suavizar demais a mensagem para evitar desconforto?",
          xp: 30,
        },
      ],
    },
    {
      id: "ms-mod-4",
      title: "Módulo IV: Quem Fica e a Missão Integral",
      lessons: [
        {
          id: "ms-4-1",
          title: "O Papel de Quem Fica",
          intro: [
            "Quando se fala em missões, é comum imaginar apenas quem viaja: o missionário que deixa sua terra, aprende outra língua e vive entre um povo diferente. Mas a Bíblia mostra uma missão com pelo menos dois papéis igualmente necessários — quem vai e quem envia. Nenhum dos dois é secundário; ambos são parte do mesmo corpo cumprindo a mesma missão.",
            "Paulo pergunta, em Romanos 10:14-15, uma sequência de perguntas que revelam essa lógica: 'como crerão naquele de quem não ouviram falar? E como ouvirão, se não há quem pregue? E como pregarão, se não forem enviados?' Note a ordem: antes de haver pregador, é preciso haver quem envie. O envio não é um detalhe logístico — é parte da própria obra missionária, tão espiritual quanto a pregação em si.",
            "O modelo bíblico mais claro disso está em Atos 13:1-3: a igreja de Antioquia, reunida em jejum e oração, é instruída pelo Espírito Santo a separar Barnabé e Saulo para a obra. A igreja impõe as mãos sobre eles e os envia — mas a igreja continua existindo em Antioquia, sustentando esse envio com oração, apoio e, mais tarde, recebendo o relatório de tudo o que Deus havia feito (At 14:26-27). Quem ficou também participou da missão: orando, sustentando e acompanhando.",
            "Isso muda a pergunta que todo cristão deveria se fazer. Não é apenas 'Deus está me chamando para ir?', mas também: 'Como posso, onde estou, ser um enviador fiel — pela oração, pelo sustento e pelo acompanhamento de quem Deus está enviando?' Ficar não é conformismo; pode ser, também, um chamado específico para sustentar a missão de outros.",
          ],
          verses: [
            {
              ref: "Romanos 10:14-15",
              textByVersion: {
                NVI: "Como, pois, invocarão aquele em quem não creram? E como crerão naquele de quem não ouviram falar? E como ouvirão, se não há quem pregue? E como pregarão, se não forem enviados?",
                ACF: "Como, pois, invocarão aquele em quem não creram? e como crerão naquele de quem não ouviram? e como ouvirão, não havendo quem pregue? E como pregarão, se não forem enviados?",
                NAA: "Como, pois, invocarão aquele em quem não creram? E como crerão naquele de quem não ouviram falar? E como ouvirão, se não há quem pregue? E como pregarão, se não forem enviados?",
              },
              originals: [
                { word: "ἀποστέλλω", translit: "apostellō", meaning: "enviar oficialmente com uma missão — raiz da palavra 'apóstolo'; a pregação pressupõe um envio anterior", lang: "grego" },
              ],
            },
            {
              ref: "Atos 13:2-3",
              textByVersion: {
                NVI: "Enquanto adoravam ao Senhor e jejuavam, disse o Espírito Santo: 'Separem para mim Barnabé e Saulo, para o trabalho ao qual os chamei'. Assim, depois de jejuarem, orarem e lhes imporem as mãos, eles os enviaram.",
              },
              originals: [
                { word: "συνεργός", translit: "synergos", meaning: "cooperador, colaborador — termo usado em outras cartas de Paulo para quem sustenta a obra sem estar no campo missionário diretamente", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἀποστέλλω", translit: "apostellō", meaning: "enviar com autoridade e propósito — o envio é parte espiritual da missão, não apenas um detalhe prático", lang: "grego" },
            { word: "συνεργός", translit: "synergos", meaning: "cooperador — quem trabalha junto na obra do evangelho, mesmo sustentando de longe", lang: "grego" },
          ],
          deepDive:
            "A terceira carta de João ilustra bem esse papel de quem fica: João elogia Gaio por ter recebido e sustentado irmãos itinerantes que saíram 'por amor do Nome, sem nada aceitar dos pagãos' (3 Jo 1:7), e conclui: 'portanto, devemos acolher com hospitalidade a irmãos como esses, para que sejamos cooperadores da verdade' (3 Jo 1:8). O verbo grego usado ali, synergos, é o mesmo que Paulo usa para descrever colegas de ministério lado a lado no evangelho — mostrando que sustentar hospitaleiramente quem vai é uma forma real, e não apenas simbólica, de cooperação na obra. A igreja de Antioquia em Atos 13 segue o mesmo padrão: ora, jejua, comissiona publicamente e depois recebe o relatório do que Deus fez (At 14:27) — um ciclo completo de envio e acompanhamento, não apenas uma despedida.",
          theologianQuote: {
            author: "John Stott",
            text: "Cada cristão é chamado a ser missionário em algum sentido — indo, enviando ou sustentando; a igreja que só ora por missões sem enviar ninguém, e a igreja que só envia sem sustentar quem foi, falham igualmente no seu chamado.",
            source: "NÃO VERIFICADO — paráfrase gerada para o app; confirme a citação original antes de publicar como texto literal atribuído",
          },
          quizzes: [
            {
              question: "Segundo Romanos 10:14-15, o que precisa acontecer antes de haver pregação eficaz?",
              options: [
                "Nada — a pregação pode ocorrer de forma totalmente independente e espontânea",
                "É preciso que haja quem envie o pregador",
                "É necessário primeiro que o ouvinte já tenha algum conhecimento prévio da Bíblia",
                "A pregação depende exclusivamente do talento pessoal do pregador",
              ],
              correctIndex: 1,
              explanation: "Paulo encadeia as perguntas mostrando que o envio é pré-requisito espiritual e lógico para a pregação acontecer.",
            },
            {
              question: "Em Atos 13:1-3, o que a igreja de Antioquia faz antes de enviar Barnabé e Saulo?",
              options: [
                "Apenas os deixa partir sem qualquer cerimônia ou acompanhamento",
                "Adora, jejua, ora e impõe as mãos sobre eles antes do envio",
                "Vota em assembleia para aprovar o destino da viagem missionária",
                "Espera que eles retornem para só então reconhecer o chamado",
              ],
              correctIndex: 1,
              explanation: "O envio em Antioquia é cercado de adoração, jejum, oração e um ato público de comissionamento.",
            },
            {
              question: "O que 3 João 1:8 ensina sobre quem hospeda e sustenta obreiros itinerantes?",
              options: [
                "Que esse apoio é opcional e sem relevância espiritual",
                "Que, ao fazer isso, a pessoa se torna 'cooperadora da verdade'",
                "Que apenas quem vai ao campo tem participação real na missão",
                "Que hospedar obreiros é uma prática exclusiva do primeiro século, sem aplicação hoje",
              ],
              correctIndex: 1,
              explanation: "João descreve o sustento e a hospitalidade a obreiros como uma forma genuína de cooperação na obra do evangelho.",
            },
          ],
          application:
            "Identifique um missionário, plantador de igrejas ou obreiro que sua igreja apoia (ou poderia apoiar) e dê um passo concreto de sustento esta semana: uma mensagem de encorajamento, uma oração específica registrada em sua agenda, ou uma contribuição financeira, ainda que pequena.",
          prayer:
            "Senhor, obrigado por me mostrar que a missão não pertence só a quem viaja, mas a todo o teu povo. Perdoa-me pelas vezes em que pensei que, por não ser enviado a um campo distante, minha participação na missão era irrelevante. Ensina-me a ser um enviador fiel — em oração, em sustento e em acompanhamento — de quem tu chamaste para ir. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva o nome de uma pessoa ou família que sua igreja apoia em missões e comprometa-se a orar especificamente por ela, por nome, todos os dias desta semana.",
          reflectionQuestion:
            "Se Deus está te chamando, neste momento da sua vida, a ser mais enviador do que enviado, o que mudaria concretamente na forma como você usa seu tempo, suas orações e seus recursos?",
          xp: 30,
        },
        {
          id: "ms-4-2",
          title: "Missão Integral",
          intro: [
            "Ao longo da história, a igreja já cometeu dois erros opostos ao pensar sobre missões. De um lado, reduzir a missão apenas a palavras — pregar o Evangelho sem nenhuma preocupação com a fome, a injustiça ou o sofrimento concreto das pessoas ouvintes. De outro lado, reduzir a missão apenas a boas obras — ajudar socialmente sem jamais anunciar quem é Jesus e o que ele fez na cruz. A Bíblia recusa as duas reduções: ela ensina uma missão integral, em que anúncio e ação de misericórdia caminham juntos.",
            "Quando Jesus define publicamente sua própria missão, em Lucas 4:18-19, ele une explicitamente essas duas dimensões: 'o Espírito do Senhor está sobre mim, porque ele me ungiu para pregar boas novas aos pobres... para proclamar libertação aos presos... para libertar os oprimidos'. Jesus não escolhe entre anunciar e libertar — ele faz as duas coisas, porque o Evangelho toca a pessoa inteira, não apenas sua alma em abstrato.",
            "Tiago é direto sobre isso: 'que proveito há, meus irmãos, em dizer alguém que tem fé, se não tem obras?... a fé, se não tiver obras, é morta em si mesma' (Tg 2:14-17). A fé genuína sempre produz fruto visível de compaixão. Mas é crucial notar a ordem: as obras não substituem a proclamação do Evangelho, elas a acompanham e a validam diante do mundo. Jesus alimentou multidões (Jo 6), mas nunca deixou de anunciar quem ele era; ele curou o corpo, mas insistiu em falar sobre o perdão dos pecados (Mc 2:1-12).",
            "Missão integral, portanto, não é escolher entre evangelismo e ação social como se fossem rivais — é reconhecer que o Evangelho, quando genuinamente recebido, transborda em amor prático ao próximo, sem que esse amor jamais substitua a necessidade urgente de anunciar a Cristo como único Salvador.",
          ],
          verses: [
            {
              ref: "Lucas 4:18-19",
              textByVersion: {
                NVI: "O Espírito do Senhor está sobre mim, porque ele me ungiu para pregar boas novas aos pobres. Ele me enviou para proclamar libertação aos presos e recuperação da vista aos cegos, para libertar os oprimidos e proclamar o ano da graça do Senhor.",
                ACF: "O Espírito do Senhor é sobre mim, pelo que me ungiu para evangelizar os pobres, enviou-me a curar os quebrantados de coração, a apregoar liberdade aos cativos, e restauração da vista aos cegos, a pôr em liberdade os oprimidos.",
              },
              originals: [
                { word: "πτωχός", translit: "ptōchos", meaning: "pobre, necessitado — as boas novas de Jesus alcançam explicitamente os mais vulneráveis social e economicamente", lang: "grego" },
              ],
            },
            {
              ref: "Tiago 2:15-17",
              textByVersion: {
                NVI: "Se um irmão ou irmã estiver necessitado de roupa e do alimento diário, e um de vocês lhe disser: 'Vá em paz, aqueça-se e alimente-se', sem, contudo, dar-lhe o necessário para o corpo, de que vale isso? Assim também a fé, por si só, se não for acompanhada de obras, está morta.",
              },
              originals: [
                { word: "ἔργον", translit: "ergon", meaning: "obra, ação concreta — a fé bíblica sempre se traduz em atos visíveis de amor, não apenas em afirmações verbais", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "πτωχός", translit: "ptōchos", meaning: "pobre — Jesus define sua própria missão como boas novas dirigidas explicitamente aos necessitados", lang: "grego" },
            { word: "ἔργον", translit: "ergon", meaning: "obra — a evidência prática e visível de uma fé genuína", lang: "grego" },
          ],
          deepDive:
            "É importante distinguir, com cuidado, entre prioridade e exclusividade. Dizer que a proclamação do Evangelho tem prioridade lógica — porque sem ela ninguém conhece o caminho da salvação em Cristo — não significa que a ação de misericórdia seja opcional ou secundária na prática diária do discípulo. Mateus 25:31-46 é solene nesse ponto: Jesus identifica-se com quem tem fome, sede, é estrangeiro, está nu, doente ou preso, e trata o cuidado prático com essas pessoas como evidência real (não decorativa) de uma vida que lhe pertence. Ao mesmo tempo, reduzir a missão cristã só a projetos sociais, sem jamais anunciar Cristo como Salvador e Senhor, esvazia o Evangelho de seu conteúdo mais essencial — o perdão dos pecados pela cruz e a ressurreição. Missão integral mantém as duas verdades presas: o anúncio explícito do Evangelho é insubstituível, e o amor prático ao próximo é sua confirmação inevitável, não um apêndice opcional.",
          theologianQuote: {
            author: "René Padilla",
            text: "Não há Evangelho sem preocupação social nem preocupação social sem Evangelho, pois o próprio Evangelho é a Boa Nova de que Deus, pela morte e ressurreição de Jesus Cristo, fez provisão para a redenção do homem todo e de todos os homens.",
            source: "NÃO VERIFICADO — paráfrase de tema recorrente na obra do autor; confirme a fonte exata antes de publicar como citação literal",
          },
          quizzes: [
            {
              question: "Segundo Lucas 4:18-19, como Jesus descreve o alcance da sua própria missão?",
              options: [
                "Como algo restrito apenas ao ensino religioso, sem qualquer dimensão prática",
                "Como boas novas aos pobres, libertação aos presos e restauração aos oprimidos",
                "Como uma missão dirigida exclusivamente às elites religiosas de sua época",
                "Como algo sem qualquer relação com as necessidades concretas das pessoas",
              ],
              correctIndex: 1,
              explanation: "Jesus une explicitamente o anúncio das boas novas a ações concretas de libertação e restauração.",
            },
            {
              question: "O que Tiago 2:14-17 ensina sobre a relação entre fé e obras?",
              options: [
                "Que as obras substituem a necessidade da fé em Cristo",
                "Que a fé genuína sempre se manifesta em obras concretas de amor",
                "Que fé e obras são temas completamente desconectados na Bíblia",
                "Que apenas líderes religiosos precisam demonstrar obras de fé",
              ],
              correctIndex: 1,
              explanation: "Tiago afirma que uma fé sem nenhuma obra correspondente está morta — a fé genuína produz fruto visível.",
            },
            {
              question: "Qual é o equilíbrio bíblico que a 'missão integral' busca preservar?",
              options: [
                "Que ação social pode substituir totalmente o anúncio do Evangelho",
                "Que o anúncio do Evangelho tem prioridade, e o amor prático ao próximo o confirma e acompanha",
                "Que evangelismo e cuidado com o próximo são temas rivais e incompatíveis",
                "Que apenas o anúncio verbal importa, sem nenhuma consequência prática esperada",
              ],
              correctIndex: 1,
              explanation: "Missão integral mantém unidas a prioridade da proclamação do Evangelho e a inevitável expressão prática do amor cristão.",
            },
          ],
          application:
            "Identifique uma necessidade concreta — física, material ou emocional — de alguém próximo a você (vizinho, colega, familiar) e ofereça ajuda prática esta semana, buscando uma oportunidade natural de também falar sobre o que Cristo fez por você.",
          prayer:
            "Senhor, tu és um Deus que se importa com o corpo e com a alma, com o presente e com a eternidade. Perdoa-me pelas vezes em que separei essas duas coisas — anunciando palavras sem amor prático, ou ajudando pessoas sem jamais falar do teu nome. Ensina-me a viver um Evangelho integral, que ama o próximo de corpo inteiro e aponta sempre para Cristo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha uma necessidade prática ao seu redor (um vizinho idoso, uma família em dificuldade, uma campanha de doação da sua igreja) e participe ativamente dela nesta semana, orando para que essa ação abra uma porta natural de conversa sobre o Evangelho.",
          reflectionQuestion:
            "Você tende mais a reduzir sua fé apenas a palavras sem ação prática, ou a reduzi-la apenas a boas ações sem jamais falar de Cristo? O que isso revela sobre onde você precisa crescer?",
          xp: 30,
        },
      ],
    },
    {
      id: "ms-mod-5",
      title: "Módulo V: Fronteiras e Fidelidade até o Fim",
      lessons: [
        {
          id: "ms-5-1",
          title: "Missões e Fronteiras",
          intro: [
            "Existe uma diferença importante entre lugares onde o Evangelho já circula livremente — ainda que muitos o rejeitem — e lugares onde praticamente ninguém jamais ouviu o nome de Jesus com clareza. Missiólogos chamam esses últimos de povos 'não alcançados': grupos étnicos ou linguísticos sem uma igreja local minimamente estabelecida capaz de evangelizar seu próprio povo sem ajuda externa. Pensar em 'fronteiras' missionárias é reconhecer que, apesar de dois mil anos de história cristã, ainda existem bolsões inteiros da humanidade sem acesso real às boas novas.",
            "Paulo tinha uma ambição declarada, expressa em Romanos 15:20-21: 'fiz questão de pregar o evangelho onde Cristo não era conhecido, para não edificar sobre fundamento colocado por outro... aqueles a quem não foi anunciado a respeito dele verão, e os que não ouviram entenderão'. Ele cita Isaías 52:15 para fundamentar essa prioridade: havia um chamado profético específico para levar a mensagem a quem simplesmente nunca teve acesso a ela.",
            "Isso não diminui a importância de evangelizar onde o Evangelho já é conhecido — muitas pessoas ao nosso redor já ouviram falar de Jesus e ainda assim precisam se converter. Mas revela uma prioridade estratégica adicional: há lugares onde ninguém jamais ouviu, e esses lugares merecem atenção deliberada, e não apenas o acaso de quem por ali passar.",
            "Jesus liga essa tarefa ao fim da história: 'e este evangelho do Reino será pregado em todo o mundo, como testemunho a todas as nações, e então virá o fim' (Mt 24:14). Isso significa que orar e trabalhar por povos ainda não alcançados não é um projeto especializado de poucos entusiastas — é parte do relógio profético da história, aguardando ser cumprido antes da volta de Cristo.",
          ],
          verses: [
            {
              ref: "Romanos 15:20-21",
              textByVersion: {
                NVI: "Meu objetivo tem sido pregar as boas-novas onde Cristo ainda não era conhecido... antes, como está escrito: 'Aqueles a quem não foi anunciado a respeito dele, verão; e os que não ouviram falar dele entenderão'.",
                ACF: "E desta maneira me esforcei por anunciar o evangelho, não onde Cristo tinha sido conhecido, para não edificar sobre fundamento alheio... mas, como está escrito: Aqueles a quem não foi anunciado a seu respeito o verão, e os que dele não ouviram falar o entenderão.",
              },
              originals: [
                { word: "ὀνομάζω", translit: "onomazō", meaning: "nomear, dar nome a — Paulo busca lugares onde o nome de Cristo ainda não havia sido sequer mencionado", lang: "grego" },
              ],
            },
            {
              ref: "Mateus 24:14",
              textByVersion: {
                NVI: "E este evangelho do Reino será pregado em todo o mundo como testemunho a todas as nações, e então virá o fim.",
              },
              originals: [
                { word: "μαρτύριον", translit: "martyrion", meaning: "testemunho — o evangelho alcançando todas as nações funciona como um testemunho formal diante da história, antes da consumação final", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ὀνομάζω", translit: "onomazō", meaning: "nomear — Paulo tinha como prioridade ir a lugares onde o nome de Cristo jamais havia sido pronunciado", lang: "grego" },
            { word: "μαρτύριον", translit: "martyrion", meaning: "testemunho — o alcance do evangelho a todas as nações está ligado profeticamente ao fim dos tempos", lang: "grego" },
          ],
          deepDive:
            "A citação que Paulo faz de Isaías 52:15 em Romanos 15:21 mostra que sua estratégia missionária não era fruto de preferência pessoal, mas de convicção bíblica: havia um padrão profético a cumprir, priorizando quem nunca tinha ouvido sobre quem já tinha alguma exposição ao Evangelho. Isso gerou, na história da igreja, o conceito de 'missões de fronteira' — o esforço deliberado de alcançar grupos étnicos e linguísticos sem presença cristã estabelecida, em contraste com o trabalho (igualmente necessário) de evangelismo e discipulado em lugares onde já existem igrejas locais. Pensar estrategicamente sobre fronteiras não é elitismo missionário, mas responsabilidade diante de uma tarefa profeticamente inacabada — Mateus 24:14 liga esse alcance total às próprias nações ao clímax da história redentora.",
          theologianQuote: {
            author: "Ralph Winter",
            text: "A tarefa restante não é simplesmente evangelizar mais pessoas, mas alcançar grupos de pessoas inteiros que ainda não têm nenhuma igreja capaz de evangelizá-los a partir de dentro de sua própria cultura.",
            source: "NÃO VERIFICADO — paráfrase de conceito amplamente associado ao autor; confirme a citação original antes de publicar como texto literal",
          },
          quizzes: [
            {
              question: "O que caracteriza, segundo a lição, um povo considerado 'não alcançado'?",
              options: [
                "Um povo que já possui uma igreja local minimamente estabelecida",
                "Um grupo étnico ou linguístico sem uma igreja capaz de evangelizar seu próprio povo",
                "Qualquer nação que ainda não tenha 100% de sua população convertida",
                "Um povo que rejeitou ativamente o Evangelho após ouvi-lo claramente",
              ],
              correctIndex: 1,
              explanation: "O critério central é a ausência de uma igreja local capaz de alcançar seu próprio grupo sem ajuda externa.",
            },
            {
              question: "Qual era a ambição declarada de Paulo em Romanos 15:20-21?",
              options: [
                "Evangelizar apenas onde já havia igrejas estabelecidas por outros",
                "Pregar onde Cristo ainda não era conhecido, para não edificar sobre fundamento alheio",
                "Concentrar seu ministério exclusivamente em Jerusalém",
                "Evitar qualquer contato com povos de cultura diferente da sua",
              ],
              correctIndex: 1,
              explanation: "Paulo priorizava estrategicamente lugares onde o nome de Cristo ainda não havia sido anunciado.",
            },
            {
              question: "Segundo Mateus 24:14, o que precede o fim, conforme as palavras de Jesus?",
              options: [
                "A conversão de toda a humanidade sem exceção",
                "A pregação do evangelho do Reino a todas as nações como testemunho",
                "A eliminação completa do sofrimento no mundo",
                "Um sinal visível independente da pregação do evangelho",
              ],
              correctIndex: 1,
              explanation: "Jesus liga o alcance do evangelho a todas as nações, como testemunho, ao momento em que virá o fim.",
            },
          ],
          application:
            "Pesquise sobre um povo ou região com pouco ou nenhum acesso ao Evangelho (organizações missionárias costumam disponibilizar esse tipo de informação) e comece, esta semana, a orar especificamente por esse povo, anotando o nome em um lugar visível como lembrete diário.",
          prayer:
            "Senhor, tu não te esqueceste de nenhum povo sobre a face da terra. Perdoa-me pela minha visão tantas vezes pequena, limitada ao meu próprio círculo. Dá-me um coração que se importa com os povos ainda sem acesso ao evangelho, e mostra-me como orar e agir por eles com fidelidade e constância. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Converse com um líder da sua igreja sobre quais povos ou campos missionários de fronteira sua igreja já apoia ou poderia apoiar, e considere se há algum passo prático que você pode dar para se envolver.",
          reflectionQuestion:
            "Que lugar as 'fronteiras missionárias' — povos que nunca ouviram o nome de Jesus — têm ocupado nas suas orações e prioridades até agora?",
          xp: 30,
        },
        {
          id: "ms-5-2",
          title: "Teologia do Martírio",
          intro: [
            "Ao longo de toda a história da igreja, a expansão do Evangelho tem custado, para muitos, a própria vida. Desde Estêvão, o primeiro mártir cristão (At 7), até incontáveis obreiros e crentes comuns em diferentes séculos e continentes, o testemunho fiel a Cristo às vezes encontrou resistência violenta. Falar sobre isso não é buscar tragédia ou espetáculo — é reconhecer, com honestidade bíblica, que seguir a Cristo sempre teve um custo real, e que esse custo faz parte da teologia bíblica do discipulado e da missão.",
            "Paulo escreve, na prisão, algo que resume essa visão: 'para mim, o viver é Cristo e o morrer é lucro' (Fp 1:21). Ele não idealiza o sofrimento nem o busca de forma imprudente, mas também não teme a morte, porque sua identidade e esperança estão inteiramente ancoradas em Cristo, não na preservação da própria vida a qualquer custo. Essa é a base de toda teologia cristã do martírio: a morte não tem a palavra final sobre quem está unido a Cristo pela fé.",
            "Apocalipse 12:11 descreve os que 'venceram' o acusador 'por causa do sangue do Cordeiro e da palavra do testemunho que deram; e não amaram a própria vida a ponto de recuar diante da morte'. A vitória descrita ali não é escapar do sofrimento, mas permanecer fiel a Cristo mesmo quando isso custa tudo — um padrão que atravessa toda a história da igreja perseguida, incluindo hoje, em diversas regiões do mundo.",
            "É importante manter equilíbrio bíblico aqui: a Bíblia não ensina a buscar o sofrimento como um fim em si mesmo, nem transforma o martírio em mérito espiritual superior. O que ela ensina é que, quando a fidelidade a Cristo exige esse preço, o crente pode enfrentá-lo com esperança — porque, como Estêvão em Atos 7:55-60, sua confiança está fixada não na preservação da vida terrena, mas na presença e na glória de Cristo além dela.",
          ],
          verses: [
            {
              ref: "Filipenses 1:20-21",
              textByVersion: {
                NVI: "Segundo a minha ardente expectativa e esperança... Cristo será engrandecido em meu corpo, quer pela vida quer pela morte. Porque para mim o viver é Cristo e o morrer é lucro.",
                ACF: "Segundo a minha intensa expectação e esperança... Cristo será engrandecido no meu corpo, seja pela vida, seja pela morte. Porque, para mim, o viver é Cristo, e o morrer é ganho.",
              },
              originals: [
                { word: "κέρδος", translit: "kerdos", meaning: "lucro, ganho — termo comercial usado para descrever a morte como algo que não representa perda alguma para quem está em Cristo", lang: "grego" },
              ],
            },
            {
              ref: "Apocalipse 12:11",
              textByVersion: {
                NVI: "Eles o venceram pelo sangue do Cordeiro e pela palavra do testemunho que deram; e não amaram a própria vida a ponto de recuarem diante da morte.",
              },
              originals: [
                { word: "νικάω", translit: "nikaō", meaning: "vencer, triunfar — a vitória bíblica aqui não é escapar da morte, mas permanecer fiel a Cristo até o fim", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "κέρδος", translit: "kerdos", meaning: "lucro — a morte, para quem está em Cristo, não representa derrota, mas ganho", lang: "grego" },
            { word: "νικάω", translit: "nikaō", meaning: "vencer — a fidelidade até o fim, e não a fuga do sofrimento, é a vitória descrita em Apocalipse", lang: "grego" },
          ],
          deepDive:
            "Vale notar a diferença entre o testemunho de Estêvão em Atos 7 e qualquer busca voluntária pelo sofrimento: Estêvão não provoca sua própria morte — ele simplesmente se recusa a negar a verdade sobre Cristo diante de uma multidão hostil, e enfrenta as consequências com uma serenidade que só se explica por sua visão da glória de Deus (At 7:55-56). Esse é o padrão bíblico consistente: a fidelidade ao testemunho de Cristo vem primeiro; o sofrimento, quando surge, é recebido, não fabricado. 2 Timóteo 3:12 generaliza esse princípio: 'todos os que querem viver piedosamente em Cristo Jesus serão perseguidos' — não como promessa de que todo cristão enfrentará martírio literal, mas como aviso realista de que a fidelidade genuína a Cristo, em algum grau, sempre encontra resistência do mundo.",
          theologianQuote: {
            author: "Tertuliano",
            text: "O sangue dos mártires é semente da igreja.",
            source: "Apologeticum, cap. 50 — frase amplamente atribuída a Tertuliano; verifique a tradução exata antes de citar como texto literal",
          },
          quizzes: [
            {
              question: "Segundo Filipenses 1:21, como Paulo descreve sua relação com a morte?",
              options: [
                "Como algo a ser temido e evitado a todo custo",
                "Como algo neutro, sem qualquer significado espiritual",
                "Como 'lucro', porque para ele viver é Cristo",
                "Como um castigo divino pelos seus pecados passados",
              ],
              correctIndex: 2,
              explanation: "Paulo via a morte como ganho, não como perda, precisamente porque sua vida estava centrada em Cristo.",
            },
            {
              question: "O que Apocalipse 12:11 identifica como a base da vitória dos que venceram?",
              options: [
                "A capacidade de escapar de toda perseguição",
                "O sangue do Cordeiro e a fidelidade ao testemunho, mesmo diante da morte",
                "Uma estratégia política bem-sucedida contra seus perseguidores",
                "A ausência total de qualquer sofrimento em suas vidas",
              ],
              correctIndex: 1,
              explanation: "A vitória bíblica descrita ali está ligada à fidelidade ao testemunho de Cristo, não à ausência de sofrimento.",
            },
            {
              question: "Qual é o equilíbrio bíblico correto sobre o sofrimento e o martírio, segundo a lição?",
              options: [
                "Que o cristão deve buscar ativamente o sofrimento como mérito espiritual",
                "Que a fidelidade a Cristo vem primeiro, e o sofrimento, quando surge por causa dela, é recebido com esperança",
                "Que o sofrimento é sempre castigo por pecados pessoais",
                "Que apenas os apóstolos do primeiro século enfrentaram esse tipo de custo",
              ],
              correctIndex: 1,
              explanation: "A Bíblia não incentiva buscar o sofrimento, mas ensina a enfrentá-lo com fé quando ele é consequência da fidelidade a Cristo.",
            },
          ],
          application:
            "Pesquise brevemente sobre a realidade de cristãos perseguidos hoje em alguma região do mundo (organizações que acompanham a liberdade religiosa costumam publicar relatórios confiáveis) e dedique um momento de oração específica por esses irmãos e irmãs nesta semana.",
          prayer:
            "Senhor, tu conheces cada um dos teus filhos que hoje sofrem por causa do teu nome. Ensina-me a não amar minha própria conveniência a ponto de recuar diante do custo de te seguir fielmente. Fortalece os perseguidos ao redor do mundo, e dá-me um coração agradecido pela liberdade que muitas vezes tenho para adorar sem medo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha um país ou região onde cristãos enfrentam perseguição significativa e ore por ele diariamente nesta semana, buscando também formas legítimas de apoiar irmãos perseguidos através da sua igreja ou de organizações confiáveis.",
          reflectionQuestion:
            "Vivendo em um contexto de relativa liberdade religiosa, o que você pode aprender com a fé de irmãos que, em outros lugares, pagam um preço muito mais alto para seguir a Cristo?",
          xp: 30,
        },
      ],
    },
    {
      id: "ms-mod-6",
      title: "Módulo VI: A Esperança da Volta de Cristo",
      lessons: [
        {
          id: "ms-6-1",
          title: "Maranata",
          intro: [
            "A carta de Paulo aos coríntios termina com uma palavra estranha aos ouvidos modernos, mas cheia de significado para a igreja primitiva: 'Maranata' (1 Co 16:22). É uma expressão aramaica que significa 'Nosso Senhor, vem!' — uma oração breve, quase um grito de esperança, que resume toda a expectativa cristã em relação ao retorno de Jesus Cristo.",
            "Essa palavra aparece logo depois de Paulo tratar, ao longo de toda a carta, de problemas concretos e dolorosos da igreja de Corinto: divisões, imoralidade, desordem na Ceia, confusão sobre dons espirituais. E, ainda assim, ele termina olhando para frente, para a volta de Cristo, como o horizonte que dá sentido a tudo o mais. A esperança escatológica não é fuga da realidade presente — é o que sustenta a igreja em meio às suas próprias imperfeições e lutas.",
            "Essa mesma esperança fecha toda a Bíblia. As últimas palavras de Jesus registradas em Apocalipse são: 'Certamente venho sem demora' — e a igreja responde: 'Amém! Vem, Senhor Jesus!' (Ap 22:20). Do início ao fim das Escrituras, a missão de Deus caminha para um alvo certo: a volta de Cristo, quando ele consumará tudo o que começou.",
            "E há uma conexão direta entre essa esperança e a tarefa missionária: Jesus disse que 'este evangelho do Reino será pregado em todo o mundo, como testemunho a todas as nações, e então virá o fim' (Mt 24:14). Isso significa que a missão da igreja não é um projeto sem fim definido — ela caminha, com propósito, para o dia em que o próprio Rei voltará. Viver com esperança escatológica é o que dá à missão sua urgência mais profunda e, ao mesmo tempo, sua paz mais firme: o resultado final já está garantido em Cristo.",
          ],
          verses: [
            {
              ref: "1 Coríntios 16:22",
              textByVersion: {
                NVI: "Se alguém não ama o Senhor, seja amaldiçoado. Vem, Senhor! [Maranata]",
                ACF: "Se alguém não ama ao Senhor Jesus Cristo, seja anátema! Maranata.",
              },
              originals: [
                { word: "μαράνα θά", translit: "marana tha", meaning: "expressão aramaica preservada em meio ao texto grego, 'Nosso Senhor, vem!' — uma das orações mais antigas registradas da igreja cristã", lang: "grego" },
              ],
            },
            {
              ref: "Apocalipse 22:20",
              textByVersion: {
                NVI: "Aquele que dá testemunho destas coisas diz: 'Sim, venho em breve!' Amém! Vem, Senhor Jesus!",
                ACF: "Aquele que testifica estas coisas diz: Certamente, cedo venho. Amém! Ora vem, Senhor Jesus!",
              },
              originals: [
                { word: "ἔρχου", translit: "erchou", meaning: "vem! — imperativo usado pela igreja como resposta de anseio à promessa de Cristo de que voltará", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "μαράνα θά", translit: "marana tha", meaning: "'Nosso Senhor, vem!' — oração aramaica preservada no Novo Testamento grego, expressando a esperança viva da igreja primitiva", lang: "grego" },
            { word: "ἔρχου", translit: "erchou", meaning: "vem — o clamor final da igreja diante da promessa do retorno de Cristo", lang: "grego" },
          ],
          deepDive:
            "O fato de Paulo preservar uma expressão aramaica — Maranata — em uma carta escrita em grego para uma igreja majoritariamente grega mostra como essa oração já era, desde muito cedo, uma marca distintiva e amplamente reconhecida da fé cristã, provavelmente usada em contextos de adoração desde os primeiros anos da igreja em Jerusalém. Ao encerrar 1 Coríntios com ela, Paulo lembra à igreja dividida e imperfeita de Corinto que sua identidade final não está em resolver todos os seus problemas agora, mas em pertencer a um Senhor que voltará. É significativo que Mateus 24:14 amarre o alcance do evangelho a todas as nações ao próprio tempo do fim: a tarefa missionária, então, não é apenas uma atividade ética recomendável, mas parte do plano profético que precede e prepara a volta de Cristo — o que dá à missão uma urgência que nenhuma outra motivação humana consegue produzir.",
          theologianQuote: {
            author: "N.T. Wright",
            text: "A esperança cristã não é escapar do mundo para o céu, mas a vinda do próprio Deus para renovar toda a criação; e é justamente essa esperança que torna toda obra feita hoje, em nome de Cristo, algo que permanece para sempre.",
            source: "NÃO VERIFICADO — paráfrase de tema recorrente na obra do autor; confirme a citação original antes de publicar como texto literal",
          },
          quizzes: [
            {
              question: "O que significa a expressão aramaica 'Maranata', preservada em 1 Coríntios 16:22?",
              options: [
                "'Que a paz esteja convosco'",
                "'Nosso Senhor, vem!'",
                "'Bendito seja o nome do Senhor'",
                "'Aleluia, o Senhor reina'",
              ],
              correctIndex: 1,
              explanation: "Maranata é uma expressão aramaica de anseio pela volta do Senhor, preservada tal como era usada pela igreja primitiva.",
            },
            {
              question: "Como a carta de 1 Coríntios, cheia de problemas e correções, termina em seu capítulo final?",
              options: [
                "Com uma lista adicional de acusações contra a igreja",
                "Com a esperança escatológica expressa em 'Maranata'",
                "Sem qualquer menção ao futuro ou à volta de Cristo",
                "Com instruções apenas sobre finanças da igreja",
              ],
              correctIndex: 1,
              explanation: "Mesmo após tratar de tantos problemas concretos, Paulo encerra a carta olhando para a esperança da volta do Senhor.",
            },
            {
              question: "Segundo Mateus 24:14, que relação existe entre a pregação do evangelho a todas as nações e o fim dos tempos?",
              options: [
                "Não há nenhuma relação entre essas duas coisas",
                "A pregação do evangelho a todas as nações precede e está ligada à vinda do fim",
                "O fim virá independentemente de qualquer atividade missionária",
                "A pregação do evangelho substitui a necessidade da volta de Cristo",
              ],
              correctIndex: 1,
              explanation: "Jesus liga diretamente o alcance do evangelho a todas as nações ao momento em que virá o fim.",
            },
          ],
          application:
            "Escreva, em poucas linhas, o que mudaria na sua forma de viver hoje — em relacionamentos, prioridades e uso do tempo — se você vivesse com a expectativa real e presente de que Cristo pode voltar a qualquer momento.",
          prayer:
            "Senhor Jesus, nós te esperamos. Ensina-nos a viver com os olhos fixos na tua volta, sem nos acomodarmos neste mundo passageiro, mas também sem fugir das responsabilidades que nos deste aqui e agora. Usa-nos, até o dia em que voltares, para levar as boas novas a todas as nações. Maranata — vem, Senhor Jesus! Amém.",
          weeklyChallenge:
            "Releia Apocalipse 21 e 22 esta semana e anote três características da nova criação que mais alimentam sua esperança e motivação para viver e servir fielmente hoje.",
          reflectionQuestion:
            "Depois de estudar toda esta trilha sobre missões, que passo concreto — pequeno ou grande — você sente que Deus está te chamando a dar, à luz da esperança de que ele voltará e completará sua missão entre as nações?",
          xp: 32,
        },
      ],
    },
  ],
};

export const additionalTrails4: Trail[] = [igrejaLocal, familiaCrista, missoes];
