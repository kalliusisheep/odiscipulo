import type { Trail } from "./content";

const santificacao: Trail = {
  id: "santificacao",
  title: "Santificação",
  description: "O caminho diário de conformação a Cristo.",
  icon: "Sparkles",
  color: "from-fuchsia-500 to-pink-500",
  order: 5,
  modules: [
    {
      id: "st-mod-1",
      title: "Módulo I: O Processo da Graça",
      lessons: [
        {
          id: "st-1-1",
          title: "Justificados, mas ainda em transformação",
          intro: [
            "Existe uma confusão comum entre novos e antigos cristãos: se já fomos declarados justos por Cristo, por que ainda lutamos tanto contra o pecado? A resposta está numa distinção que a igreja sempre fez: justificação e santificação são obras diferentes de Deus, com tempos diferentes — mas que exigem de nós uma resposta ativa e contínua.",
            "A justificação é um veredito: instantâneo, completo, jurídico. No momento em que você crê, Deus te declara justo — não porque você se tornou perfeito, mas porque a justiça de Cristo foi contada a seu favor pela fé. A santificação é diferente: é um processo progressivo, que dura a vida inteira, no qual o Espírito Santo transforma seu caráter para se parecer com Cristo — e no qual você é chamado a cooperar ativamente, buscando a santidade, resistindo à tentação e cultivando disciplinas espirituais.",
            "Confundir as duas produz dois erros opostos: achar que, por já estar justificado, o pecado não importa mais (antinomianismo); ou achar que precisa se santificar para merecer a justificação (legalismo). A Escritura ensina um caminho do meio, mais rico: você já é justo em Cristo pela graça mediante a fé, e por isso mesmo, com liberdade e responsabilidade, persegue ativamente a santidade — não para ganhar o que já tem, mas porque um coração verdadeiramente regenerado deseja se parecer com Aquele que o salvou.",
            "Paulo resume essa tensão com uma ordem de verbos importante em Filipenses 2:12-13: 'operai a vossa salvação', porque 'é Deus quem opera em vós'. Você trabalha porque Deus trabalha primeiro em você — mas o seu trabalho, sua escolha diária de obedecer, é parte real e necessária do processo, não um mero detalhe automático. A graça de Deus se oferece a todo aquele que crê, e permanece condicionada, dia após dia, a uma resposta viva de fé e obediência.",
          ],
          verses: [
            {
              ref: "Filipenses 2:12-13",
              textByVersion: {
                NVI: "Portanto, meus amados, do modo como sempre obedeceram, não somente na minha presença, mas muito mais agora na minha ausência, continuem a trabalhar na sua salvação com temor e tremor, pois é Deus quem efetua em vocês tanto o querer quanto o realizar, de acordo com a boa vontade dele.",
                NAA: "Portanto, meus amados, do modo como sempre obedeceram, não somente na minha presença, mas ainda muito mais agora, na minha ausência, efetuai a vossa salvação com temor e tremor, porque é Deus quem efetua em vós tanto o querer quanto o efetuar, segundo a sua boa vontade.",
                ACF: "De sorte que, meus amados, do modo como sempre obedecestes, não como na minha presença somente, mas muito mais agora na minha ausência, efetuai a vossa salvação com temor e tremor. Porque Deus é o que opera em vós tanto o querer como o efetuar, segundo a sua boa vontade.",
                NVT: "Queridos amigos, quando eu estava com vocês, sempre obedeciam, e agora, quando estou ausente, é ainda mais importante que o façam. Continuem trabalhando com temor e tremor para revelar a salvação de vocês por meio da maneira como vivem, pois Deus opera em vocês para que queiram obedecê-lo e o façam.",
              },
              originals: [
                { word: "κατεργάζεσθε", translit: "katergazesthe", meaning: "trabalhai até completar, levai a cabo com esforço contínuo e responsável", lang: "grego" },
              ],
            },
            {
              ref: "1 Tessalonicenses 4:3",
              textByVersion: {
                NVI: "A vontade de Deus é que vocês sejam santificados: abstenham-se da imoralidade sexual.",
                NAA: "Porque esta é a vontade de Deus: a vossa santificação, que vos abstenhais da prostituição.",
                ACF: "Porque esta é a vontade de Deus, a saber, a vossa santificação: que vos abstenhais da fornicação.",
                NVT: "É vontade de Deus que vocês sejam santificados, que se abstenham de todo pecado sexual.",
              },
              originals: [
                { word: "ἁγιασμός", translit: "hagiasmos", meaning: "santificação, processo ativo de se tornar separado e semelhante a Deus", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "δικαιόω", translit: "dikaioō", meaning: "justificar, declarar justo por decreto legal — ato instantâneo e completo, recebido unicamente pela fé", lang: "grego" },
            { word: "ἁγιασμός", translit: "hagiasmos", meaning: "santificação — processo contínuo de crescimento na semelhança com Cristo, que exige cooperação ativa do crente com a graça", lang: "grego" },
            { word: "κατεργάζομαι", translit: "katergazomai", meaning: "trabalhar até realizar por completo, com esforço perseverante e responsabilidade pessoal", lang: "grego" },
          ],
          deepDive:
            "Note a ordem em Filipenses 2:12-13: primeiro 'operai' (katergazesthe — trabalho contínuo, esforçado, real), depois a razão: 'porque é Deus quem opera em vós'. A gramática já ensina teologia: o crente tem um papel ativo e responsável na sua santificação — não é espectador passivo de um processo automático. Ao mesmo tempo, esse esforço não é a causa da nossa transformação, mas a resposta cooperativa a uma graça que Deus oferece e sustém livremente a todo aquele que crê. Você não se santifica para permanecer salvo por mérito próprio, mas porque a graça de Deus, recebida pela fé e sustentada por uma comunhão viva com Ele, capacita e convida você a responder com obediência voluntária. A luta contra o pecado não é sinal de fé fraca — é sinal de vida espiritual real, e o convite bíblico é sempre para que você, com toda a força que o Espírito concede, persevere na busca ativa da santidade, sem a qual, diz o autor de Hebreus, ninguém verá o Senhor (Hb 12:14).",
          theologianQuote: {
            author: "John Wesley",
            text: "A graça de Deus não anula nossa responsabilidade; ela a possibilita. Somos salvos pela graça, e é a mesma graça que nos capacita a buscar, com todo o empenho, a santidade sem a qual ninguém verá o Senhor.",
          },
          quizzes: [
            {
              question: "Qual a diferença central entre justificação e santificação?",
              options: [
                "Não há diferença, são a mesma coisa",
                "Justificação é instantânea e jurídica; santificação é um processo contínuo que exige nossa cooperação ativa",
                "Justificação depende do esforço humano; santificação é só de Deus",
                "Santificação vem antes da justificação",
              ],
              correctIndex: 1,
              explanation: "Justificação é veredito instantâneo pela fé; santificação é obra progressiva do Espírito, à qual o crente responde ativamente com obediência.",
            },
            {
              question: "Em Filipenses 2:12-13, por que Paulo manda 'operar a salvação com temor e tremor'?",
              options: [
                "Porque a graça de Deus é insuficiente sem esforço humano",
                "Como resposta ativa e responsável ao fato de que Deus já está operando em nós",
                "Como forma de merecer o que Cristo já fez por obras",
                "Porque a obediência é opcional para quem já creu",
              ],
              correctIndex: 1,
              explanation: "Trabalhamos com seriedade porque Deus já opera primeiro — nosso esforço é resposta real e necessária, não mero detalhe automático.",
            },
            {
              question: "Segundo a lição, o que a busca ativa da santidade revela sobre o crente?",
              options: [
                "Que ele ainda não confia plenamente na graça",
                "Que ele tem um coração regenerado que deseja se parecer com Cristo",
                "Que ele está tentando anular a obra de Cristo",
                "Que a santificação é opcional para quem já foi justificado",
              ],
              correctIndex: 1,
              explanation: "Um coração verdadeiramente tocado pela graça deseja, por amor, se parecer com Aquele que o salvou.",
            },
          ],
          application:
            "Identifique uma área de luta pessoal contra o pecado. Em vez de se condenar pela luta, agradeça a Deus por ela — é sinal de que o Espírito está vivo em você, capacitando-o a resistir. Hoje, tome uma decisão concreta e ativa (não apenas um sentimento) para responder à graça de Deus nessa área específica.",
          prayer:
            "Pai, obrigado porque já me declaraste justo em Cristo, e obrigado porque não me deixaste como estava. Continua a boa obra que começaste em mim, e dá-me força para responder à tua graça com obediência ativa. Quando eu lutar contra o pecado, lembra-me de que essa luta é sinal de vida, não de fracasso. Ajuda-me a trabalhar na minha santificação com temor e tremor, sabendo que és tu quem opera em mim o querer e o fazer — mas que também me chamas a agir. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva num caderno uma área específica em que você quer crescer esta semana. Todos os dias, ore por ela e tome uma atitude concreta e ativa (não apenas um propósito mental) para responder à graça de Deus nessa área. Anote o progresso ou a queda, sem se condenar, apenas observando o processo.",
          reflectionQuestion:
            "Você já confundiu, em algum momento, a necessidade de se santificar com a tentativa de merecer a salvação — ou, no outro extremo, já achou que sua obediência ativa não importava porque 'já está salvo mesmo'? O que muda quando você entende que a graça convida à cooperação, não à passividade nem ao mérito?",
          xp: 20,
        },
        {
          id: "st-1-2",
          title: "A Carne e o Espírito: a guerra interior",
          intro: [
            "Todo cristão sincero já sentiu essa guerra interna: quero fazer o bem, e faço o mal que não quero (Rm 7:19). Paulo não descreve isso como derrota definitiva, mas como o campo de batalha normal da vida cristã. Existem, dentro de você, dois princípios em conflito: a carne (a inclinação pecaminosa que ainda resiste, mesmo depois da conversão) e o Espírito (a nova natureza que Deus implantou em você, que capacita a obediência).",
            "Entender essa guerra evita dois erros: o desespero de quem acha que, por ainda pecar, nunca foi realmente salvo; e a complacência de quem acha que, por já ser salvo, pode ceder à carne sem consequência real para sua comunhão com Deus e seu testemunho.",
            "Gálatas 5 nos dá o mapa mais claro: as obras da carne e o fruto do Espírito. O texto não descreve uma vitória automática — ele convence o crente a andar ativamente pelo Espírito, resistindo deliberadamente aos impulsos da carne. Essa cooperação diária, sustentada pela graça, é o coração da vida santificada.",
          ],
          verses: [
            {
              ref: "Gálatas 5:16-17",
              textByVersion: {
                NVI: "Por isso digo: vivam pelo Espírito, e de modo nenhum satisfarão os desejos da carne. Pois o desejo da carne é contra o Espírito, e o do Espírito é contra a carne. Eles estão em conflito um com o outro, de modo que vocês não fazem o que desejam.",
                NAA: "Digo, porém: andai no Espírito e jamais satisfareis a cobiça da carne. Porque a carne milita contra o Espírito, e o Espírito, contra a carne; pois estas coisas se opõem uma à outra, de sorte que não podeis fazer o que quereis.",
                ACF: "Digo, porém: Andai em Espírito, e não cumprireis a concupiscência da carne. Porque a carne cobiça contra o Espírito, e o Espírito contra a carne; e estas coisas são contrárias uma à outra, para que não façais o que quereis.",
                NVT: "É por isso que digo: deixem-se guiar pelo Espírito Santo. Então vocês não seguirão os desejos da carne pecaminosa. A natureza pecaminosa deseja o que é contrário ao Espírito, e o Espírito deseja o que é contrário à natureza pecaminosa. Esses dois lutam entre si e impedem que vocês façam o que desejam.",
              },
              originals: [
                { word: "ἀντίκειται", translit: "antikeitai", meaning: "opor-se, estar em conflito direto e contínuo", lang: "grego" },
              ],
            },
            {
              ref: "Romanos 8:13",
              textByVersion: {
                NVI: "Pois se vocês viverem de acordo com a carne, morrerão; mas, se pelo Espírito fizerem morrer os feitos do corpo, viverão.",
                NAA: "Porque, se viverdes segundo a carne, morrereis; mas, se, pelo Espírito, mortificardes os feitos do corpo, vivereis.",
                ACF: "Porque, se viverdes segundo a carne, morrereis; mas, se pelo Espírito mortificardes as obras do corpo, vivereis.",
                NVT: "Pois, se viverem de acordo com a natureza pecaminosa, vocês morrerão. Mas, se pelo poder do Espírito vocês fizerem morrer as ações pecaminosas do corpo, vocês viverão.",
              },
              originals: [
                { word: "θανατοῦτε", translit: "thanatoute", meaning: "façam morrer — ação ativa, deliberada e violenta contra o pecado, não passividade", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "σάρξ", translit: "sarx", meaning: "'carne' — não o corpo físico em si, mas a natureza inclinada ao pecado que ainda resiste em nós mesmo após a conversão", lang: "grego" },
            { word: "πνεῦμα", translit: "pneuma", meaning: "'Espírito' — a nova natureza e a presença pessoal do Espírito Santo, que capacita e convida à obediência", lang: "grego" },
            { word: "θανατοῦτε", translit: "thanatoute", meaning: "'façam morrer' — verbo no imperativo, exigindo ação ativa e contínua do crente contra o pecado, em cooperação com o Espírito", lang: "grego" },
          ],
          deepDive:
            "A palavra 'antikeitai' descreve uma oposição contínua, não um round único vencido de uma vez por todas. A vida cristã normal inclui essa tensão — e Paulo não manda o crente se sentir condenado por senti-la, mas o chama à ação: 'andai no Espírito' é um verbo no imperativo presente, indicando um caminhar contínuo e deliberado, dia após dia. Da mesma forma, 'fazer morrer os feitos do corpo' (Rm 8:13) não é experiência passiva — é responsabilidade ativa do crente, exercida pelo poder do Espírito que já habita nele. Aqui vale destacar, com humildade e respeito às diferentes tradições cristãs: o poder para essa vitória vem do Espírito Santo, e a vida cristã madura envolve o exercício de disciplinas espirituais — oração, Palavra, comunhão, jejum — como meios pelos quais o crente coopera ativamente com a graça que já recebeu, e não apenas espera passivamente por uma experiência espiritual. Toda manifestação espiritual, seja ela qual for, deve ser sempre julgada e submetida à autoridade final das Escrituras, e não substituir a disciplina bíblica de andar diariamente pelo Espírito.",
          theologianQuote: {
            author: "Charles Swindoll",
            text: "A vitória sobre a carne não é uma experiência única e mágica, mas uma caminhada diária de escolhas — escolher, a cada momento, andar pelo Espírito em vez de ceder ao impulso antigo.",
          },
          quizzes: [
            {
              question: "O que a lição ensina sobre a guerra entre a carne e o Espírito?",
              options: [
                "É sinal de que a pessoa nunca foi realmente convertida",
                "É o campo de batalha normal da vida cristã, e o crente deve andar ativamente pelo Espírito",
                "Só acontece com cristãos fracos na fé",
                "Termina completamente logo após a conversão",
              ],
              correctIndex: 1,
              explanation: "Paulo descreve essa guerra como normal para todo cristão — e chama à ação contínua, não ao desespero.",
            },
            {
              question: "Segundo Romanos 8:13, 'fazer morrer os feitos do corpo' é:",
              options: [
                "Uma experiência passiva que acontece automaticamente",
                "Uma ação ativa e deliberada do crente, pelo poder do Espírito",
                "Algo que só os líderes espirituais podem fazer por nós",
                "Uma promessa que só se cumprirá no céu",
              ],
              correctIndex: 1,
              explanation: "O verbo no imperativo exige responsabilidade e ação contínua do crente, em cooperação com o Espírito.",
            },
          ],
          application:
            "Escolha, hoje, uma disciplina espiritual concreta (oração, leitura da Palavra, jejum de algo específico) como meio ativo de 'andar pelo Espírito' nesta semana, em vez de esperar passivamente por uma mudança de sentimento.",
          prayer:
            "Espírito Santo, obrigado por habitares em mim e me capacitares a resistir à carne. Confesso que, muitas vezes, espero passivamente por vitória, esquecendo que sou chamado a caminhar ativamente contigo, todos os dias. Ajuda-me, hoje, a fazer morrer os desejos que se opõem a ti, e a escolher, com toda a força que me dás, o caminho da obediência. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha uma obra da carne específica (Gl 5:19-21) que você reconhece em si mesmo, e um fruto do Espírito correspondente (Gl 5:22-23) que você deseja cultivar. Anote diariamente uma ação concreta que você tomou para 'andar pelo Espírito' nessa área.",
          reflectionQuestion:
            "Em que área da sua vida você tem esperado passivamente por vitória espiritual, em vez de tomar ações concretas e diárias de cooperação com o Espírito?",
          xp: 20,
        },
      ],
    },
    {
      id: "st-mod-2",
      title: "Módulo II: O Fruto e a Disciplina",
      lessons: [
        {
          id: "st-2-1",
          title: "O Fruto do Espírito não é uma lista de tarefas",
          intro: [
            "Muitos cristãos leem Gálatas 5:22-23 como uma lista de nove virtudes a serem conquistadas separadamente, como se fossem itens de um checklist: hoje trabalho a paciência, amanhã a bondade. Mas Paulo escreve 'fruto', no singular — não 'frutos'. Isso não é acidente gramatical; é teologia condensada em uma palavra.",
            "Um fruto não é fabricado por esforço mecânico; ele cresce organicamente de uma raiz saudável, com tempo, cultivo e as condições certas. O fruto do Espírito nasce da comunhão contínua com Cristo — 'permanecei em mim', diz Jesus em João 15 — e não de um esforço isolado de força de vontade para parecer mais gentil ou mais paciente.",
            "Isso não anula a responsabilidade do crente — pelo contrário, o agricultor trabalha ativamente para que o fruto cresça: poda, rega, aduba. Da mesma forma, o cristão coopera ativamente com o Espírito através da oração, da Palavra e da comunhão, criando as condições onde o fruto pode florescer naturalmente, como consequência de uma vida enraizada em Cristo.",
          ],
          verses: [
            {
              ref: "Gálatas 5:22-23",
              textByVersion: {
                NVI: "Mas o fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio. Contra essas coisas não há lei.",
                NAA: "Mas o fruto do Espírito é: amor, alegria, paz, paciência, benignidade, bondade, fidelidade, mansidão, domínio próprio. Contra essas coisas não há lei.",
                ACF: "Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança. Contra estas coisas não há lei.",
                NVT: "Mas o Espírito produz em nossa vida este tipo de fruto: amor, alegria, paz, paciência, gentileza, bondade, fidelidade, humildade e autocontrole. Não existe lei contra essas coisas!",
              },
              originals: [
                { word: "καρπός", translit: "karpos", meaning: "fruto — singular, algo orgânico que cresce, não um conjunto de itens separados", lang: "grego" },
              ],
            },
            {
              ref: "João 15:4-5",
              textByVersion: {
                NVI: "Permaneçam em mim, e eu permanecerei em vocês. Nenhum ramo pode dar fruto por si mesmo, se não permanecer na videira. Vocês também não podem dar fruto, a não ser que permaneçam em mim. Eu sou a videira; vocês são os ramos. Se alguém permanecer em mim e eu nele, esse dará muito fruto; pois sem mim vocês não podem fazer coisa alguma.",
                NAA: "Permanecei em mim, e eu, em vós. Como o ramo, por si mesmo, não pode dar fruto, se não permanecer na videira, assim também vós, se não permanecerdes em mim. Eu sou a videira; vós, os ramos. Quem permanece em mim, e eu, nele, esse dá muito fruto; porque sem mim nada podeis fazer.",
              },
            },
          ],
          keywords: [
            { word: "καρπός", translit: "karpos", meaning: "'fruto', no singular — indica unidade orgânica, não uma coleção de conquistas separadas", lang: "grego" },
            { word: "μένω", translit: "menō", meaning: "'permanecer, habitar continuamente' — a condição indispensável para que o fruto cresça", lang: "grego" },
          ],
          deepDive:
            "A escolha do singular 'karpos' (fruto, não frutos) revela que amor, alegria, paz, paciência e as demais virtudes não são adquiridas isoladamente uma por uma — elas crescem juntas, como expressões de uma única vida transformada pelo Espírito. Jesus explica a condição para isso em João 15: 'permanecer' (menō) — um verbo que indica permanência contínua e ativa, não uma visita ocasional. O crente que negligencia a oração, a Palavra e a comunhão da igreja local não deve se surpreender ao ver o fruto minguar; e o crente que persevera nessas disciplinas, mesmo sem sentir resultados imediatos, está criando exatamente as condições onde o Espírito Santo produz, com o tempo, um caráter cada vez mais parecido com o de Cristo. É importante notar, na tradição batista aberta, que esse crescimento não é fatalista nem automático: o crente mantém a responsabilidade e a liberdade de permanecer ou de se afastar — e é chamado, a cada dia, a escolher permanecer.",
          theologianQuote: {
            author: "Richard Foster",
            text: "As disciplinas espirituais não produzem o fruto do Espírito por si mesmas — elas nos colocam no lugar onde Deus pode agir. Somos responsáveis por plantar e regar; a Deus pertence dar o crescimento.",
          },
          quizzes: [
            {
              question: "Por que Paulo usa a palavra 'fruto' no singular em Gálatas 5:22-23?",
              options: [
                "Por um simples detalhe gramatical sem importância teológica",
                "Para indicar que as virtudes crescem juntas como expressão de uma vida transformada, não como conquistas isoladas",
                "Porque só existe uma virtude verdadeira",
                "Porque as outras oito são menos importantes que o amor",
              ],
              correctIndex: 1,
              explanation: "O singular 'karpos' revela unidade orgânica: o fruto do Espírito cresce como um todo integrado.",
            },
            {
              question: "Segundo João 15, qual é a condição indispensável para dar fruto?",
              options: [
                "Ter força de vontade suficiente",
                "Permanecer continuamente em Cristo",
                "Frequentar cultos esporadicamente",
                "Alcançar um nível avançado de conhecimento teológico",
              ],
              correctIndex: 1,
              explanation: "'Menō' (permanecer) indica uma comunhão contínua e ativa com Cristo, sem a qual não há fruto genuíno.",
            },
          ],
          application:
            "Escolha uma disciplina espiritual (oração diária, leitura bíblica, comunhão fraterna) que você tem negligenciado, e retome-a esta semana como forma concreta de 'permanecer na videira'.",
          prayer:
            "Senhor Jesus, tu és a videira, e eu sou apenas ramo. Confesso que, muitas vezes, tento produzir fruto com esforço próprio, esquecendo que sem ti nada posso fazer. Ensina-me a permanecer em ti — na oração, na tua Palavra, na comunhão da igreja — para que o teu Espírito produza em mim, aos poucos, um caráter cada vez mais parecido contigo. Em teu nome, amém.",
          weeklyChallenge:
            "Escolha um fruto específico do Espírito (por exemplo, paciência ou domínio próprio) que você deseja ver crescer. Ao final de cada dia desta semana, anote um momento em que permaneceu em Cristo (oração, Palavra, comunhão) e como isso se refletiu em sua atitude.",
          reflectionQuestion:
            "Em que áreas da sua vida você tem tentado 'produzir fruto' com esforço próprio, em vez de permanecer continuamente em Cristo através das disciplinas espirituais?",
          xp: 20,
        },
        {
          id: "st-2-2",
          title: "Disciplinas Espirituais: meios de graça",
          intro: [
            "Se a santificação é um processo que exige cooperação ativa do crente com a graça de Deus, uma pergunta prática se impõe: como, concretamente, essa cooperação acontece? A resposta histórica da igreja, desde os primeiros séculos, aponta para as chamadas 'disciplinas espirituais' ou 'meios de graça': oração, leitura e meditação da Palavra, jejum, comunhão fraterna, adoração congregacional, generosidade e serviço.",
            "É essencial entender o que essas disciplinas são e o que não são. Elas não são um sistema de méritos para conquistar a aprovação de Deus — isso seria legalismo, contrário ao Evangelho da graça. Elas são, antes, canais pelos quais o crente se posiciona diariamente para receber e cooperar com a graça que Deus já oferece livremente em Cristo.",
            "Paulo, ao escrever a Timóteo, usa uma imagem esportiva reveladora: 'exercita-te na piedade' (1 Tm 4:7-8) — o mesmo verbo do qual vem nossa palavra 'ginástica'. Assim como um atleta treina o corpo com disciplina e repetição, o cristão treina sua alma com as mesmas qualidades: constância, esforço e propósito.",
          ],
          verses: [
            {
              ref: "1 Timóteo 4:7-8",
              textByVersion: {
                NVI: "Rejeite, porém, as fábulas profanas e tolices de velhas. Exercite-se na piedade. Pois embora o exercício físico seja proveitoso, a piedade é proveitosa em tudo, porque tem promessa tanto para a vida presente como para a futura.",
                NAA: "Rejeita, porém, as fábulas profanas, de velhas. Exercita-te, antes, na piedade. Porque o exercício corporal para pouco aproveita, mas a piedade para tudo é proveitosa, visto que tem a promessa da vida presente e da que há de vir.",
                ACF: "Mas rejeita as fábulas profanas e de velhas. Exercita-te, porém, para a piedade. Porque o exercício corporal para pouco aproveita, mas a piedade para tudo é proveitosa, tendo a promessa da vida presente e da que há de vir.",
                NVT: "Não perca tempo com histórias profanas e sem sentido. Em vez disso, treine-se para a piedade. O treinamento físico é bom, mas o treinamento na santidade é bem mais importante, pois promete benefícios tanto nesta vida como na próxima.",
              },
              originals: [
                { word: "γύμναζε", translit: "gymnaze", meaning: "exercita-te, treina — de onde vem a palavra 'ginástica'; disciplina ativa e repetida", lang: "grego" },
              ],
            },
            {
              ref: "Salmos 1:2-3",
              textByVersion: {
                NVI: "Nele tem prazer, e nele medita de dia e de noite. É como árvore plantada à beira de águas correntes, que dá fruto no tempo certo e cuja folhagem nunca murcha. Tudo o que ele faz prospera!",
                NAA: "Antes, tem prazer na lei do Senhor e nela medita de dia e de noite. Ele é como a árvore plantada junto a corredouros de águas, a qual dá o seu fruto na estação própria; as suas folhas não caem, e tudo quanto ele faz será bem-sucedido.",
              },
            },
          ],
          keywords: [
            { word: "γυμνάζω", translit: "gymnazō", meaning: "'exercitar, treinar' — disciplina ativa e repetida, de onde deriva a palavra 'ginástica'", lang: "grego" },
            { word: "εὐσέβεια", translit: "eusebeia", meaning: "'piedade' — reverência prática e vivida diante de Deus, não apenas sentimento religioso", lang: "grego" },
          ],
          deepDive:
            "O verbo 'gymnaze' (exercita-te) é o mesmo usado para o treinamento físico dos atletas gregos — disciplina, repetição, esforço direcionado a um objetivo. Paulo não hesita em aplicar essa mesma linguagem à vida espiritual: a piedade não acontece por acidente, mas é 'treinada'. Isso é coerente com toda a Escritura — o salmista descreve o homem bem-aventurado como aquele que medita 'de dia e de noite' na Palavra, não ocasionalmente. É importante, dentro da tradição batista aberta e evangélica histórica, distinguir claramente entre disciplinas espirituais bíblicas (oração, leitura da Palavra, jejum, comunhão, adoração, generosidade) — que são meios ordinários de graça, claramente ensinados nas Escrituras — e experiências ou práticas contemporâneas que alegam revelação direta ou fenômenos extraordinários. Toda prática ou experiência espiritual, por mais legítima que pareça, deve ser examinada e submetida à autoridade final e suficiente da Palavra de Deus (2 Tm 3:16-17), e questões mais específicas sobre dons espirituais e experiências místicas merecem ser conversadas com sua liderança espiritual local.",
          theologianQuote: {
            author: "Dallas Willard (citado por Richard Foster)",
            text: "As disciplinas espirituais não são um fim em si mesmas; são um meio pelo qual nos colocamos diante de Deus, treinando a alma para a piedade, do mesmo modo que um atleta treina o corpo para a competição.",
          },
          quizzes: [
            {
              question: "O que Paulo quer dizer ao mandar Timóteo 'exercitar-se na piedade'?",
              options: [
                "Que a piedade acontece automaticamente, sem esforço",
                "Que a vida espiritual exige disciplina ativa e repetida, como um treinamento atlético",
                "Que o exercício físico é mais importante que a piedade",
                "Que a piedade é apenas um sentimento passageiro",
              ],
              correctIndex: 1,
              explanation: "'Gymnaze' é o mesmo verbo usado para treinamento atlético — disciplina, repetição e esforço direcionado.",
            },
            {
              question: "Segundo a lição, como devem ser tratadas experiências espirituais extraordinárias que alegam revelação direta?",
              options: [
                "Devem ser aceitas sempre como verdadeiras, sem questionamento",
                "Devem ser examinadas e submetidas à autoridade final das Escrituras",
                "Devem ser rejeitadas automaticamente sem análise",
                "São irrelevantes para a vida cristã",
              ],
              correctIndex: 1,
              explanation: "Toda experiência espiritual deve ser julgada pela Bíblia, que é suficiente e final em autoridade.",
            },
          ],
          application:
            "Escolha uma disciplina espiritual (oração, jejum de algo específico, leitura bíblica) e pratique-a de forma intencional e repetida por 7 dias seguidos, tratando-a como um 'treino' consciente, não como tarefa religiosa vazia.",
          prayer:
            "Senhor, ensina-me a treinar minha alma para a piedade com a mesma seriedade com que um atleta treina o corpo. Perdoa-me pela preguiça espiritual e pela busca de atalhos fáceis. Que eu persevere nas disciplinas que tu mesmo ordenaste — oração, tua Palavra, comunhão — confiando que és tu quem, através delas, molda meu caráter à imagem de Cristo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Monte um pequeno 'plano de treino espiritual' para os próximos 7 dias: escolha um horário fixo de oração, um trecho bíblico para meditar diariamente, e um ato concreto de generosidade ou serviço. Siga o plano e anote os resultados.",
          reflectionQuestion:
            "Se você tratasse sua vida espiritual com a mesma disciplina e constância que um atleta trata seu treinamento físico, o que mudaria na sua rotina esta semana?",
          xp: 25,
        },
      ],
    },
    {
      id: "st-mod-3",
      title: "Módulo III: Mortificação do Pecado e Renovação da Mente",
      lessons: [
        {
          id: "st-3-1",
          title: "Mortificar o pecado: uma guerra declarada",
          intro: [
            "Há uma frase do puritano John Owen, repetida por gerações de cristãos, que resume o coração desta lição: 'Mate o pecado, ou ele matará você'. Isso pode soar duro demais para ouvidos modernos acostumados a pensar a fé apenas em termos de conforto e aceitação — mas é exatamente a linguagem que Paulo usa em Colossenses 3: 'façam morrer' o que em vocês é terreno.",
            "O verbo escolhido por Paulo não descreve uma poda suave, um ajuste de comportamento, ou uma simples troca de hábito. Descreve execução: o pecado, como um inimigo hospedado dentro de casa, precisa ser tratado com a seriedade de quem trata de vida ou morte — porque, espiritualmente falando, é exatamente disso que se trata.",
            "Essa mortificação não é obra apenas humana, nem apenas divina — é cooperação. O crente age (façam morrer), mas age 'pelo Espírito' (Rm 8:13), nunca por força própria isolada de Deus. Negligenciar essa guerra, tratando o pecado com leveza ou adiando o confronto, é o caminho mais curto para que ele, aos poucos, endureça o coração e enfraqueça a comunhão com Deus.",
          ],
          verses: [
            {
              ref: "Colossenses 3:5-8",
              textByVersion: {
                NVI: "Assim, façam morrer tudo o que pertence à natureza terrena de vocês: a imoralidade sexual, a impureza, a paixão, os maus desejos e a cobiça, que é idolatria. Por causa dessas coisas vem a ira de Deus. Vocês costumavam andar nesse caminho, quando viviam nessas coisas. Mas agora abandonem todas elas: ira, indignação, maldade, calúnia e linguagem indecente.",
                NAA: "Fazei, pois, morrer os membros que estão sobre a terra: a prostituição, a impureza, a paixão, o mau desejo e a cobiça, que é idolatria. Por causa destas coisas, vem a ira de Deus sobre os filhos da desobediência, nas quais também vós andastes outrora, quando vivíeis nelas. Mas, agora, despojai-vos também de tudo isto: ira, indignação, maldade, calúnia e linguagem torpe da vossa boca.",
                ACF: "Mortificai, pois, os vossos membros que estão sobre a terra: a prostituição, a impureza, o apetite desordenado, a vil concupiscência, e a avareza, que é idolatria. Mas agora despojai-vos também de tudo isto, da ira, da cólera, da malícia, da maledicência, das palavras torpes da vossa boca.",
                NVT: "Por essa razão, considerem seu corpo terreno como morto para o pecado sexual, a impureza, as paixões e os desejos malignos. Não sejam gananciosos, pois a ganância é idolatria. Mas agora é hora de abandonar essas coisas: raiva, fúria, malícia, calúnia e linguagem suja.",
              },
              originals: [
                { word: "νεκρώσατε", translit: "nekrōsate", meaning: "façam morrer, tratem como morto — verbo enérgico, no imperativo, sem meio-termo", lang: "grego" },
              ],
            },
            {
              ref: "Tiago 1:14-15",
              textByVersion: {
                NVI: "Mas cada um é tentado quando atraído e seduzido por sua própria cobiça. Depois, a cobiça, tendo concebido, dá à luz o pecado; e o pecado, quando consumado, gera a morte.",
                NAA: "Cada um, todavia, é tentado quando atraído e seduzido pela sua própria cobiça; depois, a cobiça, tendo concebido, dá à luz o pecado, e o pecado, uma vez consumado, gera a morte.",
                ACF: "Mas cada um é tentado, quando atraído e engodado pela sua própria concupiscência. Depois, havendo a concupiscência concebido, pare o pecado; e o pecado, sendo consumado, gera a morte.",
              },
              originals: [
                { word: "ἀποκύει", translit: "apokyei", meaning: "'dá à luz' — imagem de gestação: o pecado nasce de um desejo que foi alimentado, não de um acidente súbito", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "νεκρόω", translit: "nekroō", meaning: "'fazer morrer, matar' — a mesma raiz de 'necrose'; ação decisiva e sem meio-termo contra o pecado", lang: "grego" },
            { word: "ἐπιθυμία", translit: "epithymia", meaning: "'desejo, cobiça' — impulso interior que, alimentado, gera o pecado", lang: "grego" },
          ],
          deepDive:
            "Tiago descreve o nascimento do pecado como uma gestação: primeiro um desejo é atraído e seduzido, depois esse desejo é 'concebido' e, por fim, 'dá à luz' o pecado. A imagem ensina algo prático e libertador: o pecado quase nunca nasce de um acidente repentino — ele é gestado em desejos que escolhemos alimentar, silenciosamente, muito antes do ato visível. Por isso, Colossenses 3 não manda apenas 'parar de pecar', mas 'fazer morrer' (nekrōsate) — tratar a raiz, não apenas o fruto visível. Isso significa identificar os pensamentos, ambientes e hábitos que alimentam o desejo antes que ele se torne ato, e cortá-los com decisão, pela dependência do Espírito. É importante notar que essa mortificação não é ascetismo — não se trata de odiar o corpo ou o prazer em si, que Deus criou bons —, mas de recusar, com seriedade espiritual, tudo o que se opõe à santidade à qual fomos chamados. Quando a luta envolver padrões profundos de pecado que se repetem apesar do esforço sincero, é sábio e bíblico buscar também o acompanhamento e a oração de líderes espirituais maduros da igreja local, que Deus estabeleceu como parte do processo de cura e crescimento.",
          theologianQuote: {
            author: "John Wesley",
            text: "A santidade não é a ausência de tentação, mas a recusa deliberada, sustentada pela graça, de alimentar aquilo que nos afasta de Deus.",
          },
          quizzes: [
            {
              question: "O que o verbo 'façam morrer' (nekrōsate) em Colossenses 3:5 comunica sobre como tratar o pecado?",
              options: [
                "Que se deve apenas reduzir gradualmente, sem pressa",
                "Que exige uma ação decisiva e séria, tratando a raiz do pecado com firmeza",
                "Que o pecado desaparece sozinho com o tempo",
                "Que só líderes espirituais precisam lidar com isso",
              ],
              correctIndex: 1,
              explanation: "O verbo é enérgico e no imperativo — exige ação decisiva do crente, pelo poder do Espírito, contra a raiz do pecado.",
            },
            {
              question: "Segundo Tiago 1:14-15, como o pecado normalmente nasce?",
              options: [
                "De um acidente súbito e imprevisível",
                "De um desejo que foi atraído, alimentado e, por fim, 'dá à luz' o ato pecaminoso",
                "Apenas da influência de outras pessoas",
                "Só depois que a pessoa já pecou muitas vezes",
              ],
              correctIndex: 1,
              explanation: "Tiago usa a imagem de uma gestação: o pecado nasce de um desejo cultivado, não de puro acaso.",
            },
          ],
          application:
            "Identifique um desejo ou pensamento específico que você tem alimentado silenciosamente e que, se não tratado, pode 'dar à luz' um pecado maior. Hoje, tome uma decisão concreta para cortar o acesso a esse desejo (um hábito, um conteúdo, um ambiente) em vez de apenas resistir no momento da tentação.",
          prayer:
            "Senhor, mostra-me com honestidade os desejos que tenho alimentado em segredo e que se opõem à tua santidade. Dá-me coragem para tratá-los com seriedade, fazendo morrer o que precisa morrer, pelo poder do teu Espírito. Que eu não trate o pecado com leveza, mas também não confie em minhas próprias forças — só em ti encontro capacidade real de mudança. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva uma lista honesta dos 'gatilhos' que costumam alimentar um pecado recorrente em sua vida (lugares, horários, companhias, conteúdos). Para cada um, defina uma ação prática de corte ou substituição, e pratique-a diariamente nesta semana.",
          reflectionQuestion:
            "Existe algum pecado que você tem tratado com leveza, apenas 'controlando' no momento da tentação, sem nunca lidar com a raiz que o alimenta?",
          xp: 25,
        },
        {
          id: "st-3-2",
          title: "Renovação da mente: pensar como discípulo",
          intro: [
            "Romanos 12:1-2 é, talvez, a ponte mais clara entre doutrina e vida prática em toda a carta de Paulo. Depois de onze capítulos densos sobre graça, justificação e o plano de Deus, Paulo diz: 'portanto' — e vira o argumento para o corpo, a mente e a vida cotidiana do crente.",
            "Paulo identifica duas forças competindo pela sua mente: o 'padrão deste mundo' (uma pressão constante para pensar e desejar como a cultura ao redor pensa e deseja) e a 'renovação da mente' (uma transformação ativa, promovida pelo Espírito através da Palavra, que ensina o crente a pensar como Deus pensa).",
            "Note que a santidade, aqui, não começa pelo comportamento externo, mas pela mente. Você não muda de fora para dentro; muda de dentro para fora. Uma mente renovada pela Palavra, aos poucos, produz desejos renovados — e desejos renovados produzem escolhas e um caráter renovados.",
          ],
          verses: [
            {
              ref: "Romanos 12:1-2",
              textByVersion: {
                NVI: "Portanto, irmãos, rogo-lhes pelas misericórdias de Deus que se ofereçam em sacrifício vivo, santo e agradável a Deus; este é o culto racional de vocês. Não se conformem com este mundo, mas transformem-se pela renovação da sua mente, para que sejam capazes de experimentar e comprovar a boa, agradável e perfeita vontade de Deus.",
                NAA: "Rogo-vos, pois, irmãos, pelas misericórdias de Deus, que apresenteis o vosso corpo como sacrifício vivo, santo e agradável a Deus, que é o vosso culto racional. E não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente, para que experimenteis qual seja a boa, agradável e perfeita vontade de Deus.",
                ACF: "Rogo-vos, pois, irmãos, pela compaixão de Deus, que apresenteis o vosso corpo em sacrifício vivo, santo e agradável a Deus, que é o vosso culto racional. E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento, para que experimenteis qual seja a boa, agradável, e perfeita vontade de Deus.",
                NVT: "Assim, rogo a vocês, irmãos, por causa da misericórdia de Deus, que entreguem seu corpo a Deus como sacrifício vivo e santo. Vivam de tal maneira que ele possa aceitá-lo. Essa é, na verdade, a forma de adoração de vocês. Não copiem os costumes deste mundo, mas deixem que Deus os transforme por meio de uma mudança em seu modo de pensar.",
              },
              originals: [
                { word: "συσχηματίζεσθε", translit: "syschēmatizesthe", meaning: "moldar-se conforme um padrão externo, temporário e superficial", lang: "grego" },
                { word: "μεταμορφοῦσθε", translit: "metamorphousthe", meaning: "transformar-se por dentro, de forma essencial e progressiva — mesma raiz de 'metamorfose'", lang: "grego" },
              ],
            },
            {
              ref: "Efésios 4:22-24",
              textByVersion: {
                NVI: "Quanto à antiga maneira de viver, removam o velho homem, que se corrompe por desejos enganosos; sejam renovados no modo de pensar e revistam-se do novo homem, criado para ser semelhante a Deus em justiça e em santidade provenientes da verdade.",
                NAA: "Quanto ao procedimento anterior, vos despojeis do velho homem, que se corrompe pelas paixões enganosas, sejais renovados no espírito da vossa mente e vos revistais do novo homem, criado segundo Deus, em verdadeira justiça e santidade.",
              },
            },
          ],
          keywords: [
            { word: "συσχηματίζω", translit: "syschēmatizō", meaning: "'moldar-se a um padrão externo' — pressão da cultura para conformar pensamento e desejo", lang: "grego" },
            { word: "μεταμορφόω", translit: "metamorphoō", meaning: "'transformar por dentro' — mudança essencial e progressiva, mesma raiz de 'metamorfose'", lang: "grego" },
          ],
          deepDive:
            "O contraste grego entre 'syschēmatizesthe' e 'metamorphousthe' é rico: o primeiro verbo descreve algo que se amolda por fora, como uma máscara ou um figurino temporário, ajustado à pressão externa do ambiente; o segundo descreve uma mudança de essência, de dentro para fora, como uma lagarta que se torna borboleta — não uma reforma cosmética, mas uma nova natureza se manifestando. Paulo ensina que essa transformação acontece pela 'renovação da mente' — um processo contínuo (o verbo está no presente, indicando ação repetida), não um evento único. Isso acontece, na prática, pela exposição regular e deliberada à Palavra de Deus, que reeduca o que consideramos desejável, certo e valioso, desafiando os padrões que a cultura nos ensinou a aceitar sem questionar. Efésios 4 usa imagem semelhante de vestuário: despir o velho homem, revestir o novo — uma escolha ativa e diária, não apenas um sentimento passivo de mudança. É importante lembrar, com humildade, que discernir onde a cultura contradiz a Palavra exige sabedoria e comunhão com outros crentes — ninguém faz essa leitura sozinho, sem o corpo de Cristo ao redor.",
          theologianQuote: {
            author: "James W. Sire",
            text: "Toda cosmovisão molda silenciosamente o que consideramos óbvio. Por isso a renovação da mente não é um evento único, mas uma reeducação constante à luz da Palavra de Deus.",
          },
          quizzes: [
            {
              question: "Qual é o contraste central entre 'conformar-se' e 'transformar-se' em Romanos 12:2?",
              options: [
                "Não há diferença real entre os dois termos",
                "Conformar-se é um ajuste externo e temporário; transformar-se é uma mudança de essência, de dentro para fora",
                "Conformar-se é bíblico; transformar-se é um erro teológico",
                "Os dois descrevem apenas mudanças de comportamento visível",
              ],
              correctIndex: 1,
              explanation: "'Syschēmatizesthe' descreve um molde externo; 'metamorphousthe' descreve mudança essencial, como a metamorfose de uma lagarta.",
            },
            {
              question: "Segundo a lição, como a renovação da mente normalmente acontece?",
              options: [
                "Instantaneamente, sem esforço contínuo",
                "Pela exposição regular e deliberada à Palavra de Deus, num processo contínuo",
                "Apenas por força de vontade, sem relação com a Escritura",
                "É automática após a conversão, sem necessidade de disciplina",
              ],
              correctIndex: 1,
              explanation: "O verbo grego está no presente contínuo — a renovação é um processo contínuo, alimentado pela Palavra.",
            },
          ],
          application:
            "Identifique um padrão de pensamento ou valor que você absorveu da cultura ao seu redor sem nunca examiná-lo à luz da Bíblia. Esta semana, escolha um texto bíblico relacionado a esse tema e medite nele diariamente, pedindo a Deus que renove seu modo de pensar sobre isso.",
          prayer:
            "Pai, reconheço que absorvo, muitas vezes sem perceber, os padrões deste mundo — em minhas prioridades, meus desejos, meu modo de julgar o que é bom e valioso. Renova a minha mente pela tua Palavra, para que eu não apenas mude comportamentos, mas passe a pensar como um verdadeiro discípulo de Cristo. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha uma área da sua vida (dinheiro, sucesso, relacionamentos, imagem pessoal) e compare, por escrito, o que a cultura ensina sobre ela com o que a Bíblia ensina. Anote pelo menos um ajuste prático que você fará esta semana para alinhar seu pensamento à Palavra.",
          reflectionQuestion:
            "Que 'padrão deste mundo' você percebe mais presente na sua própria mente hoje — e o que a Palavra de Deus diz de diferente sobre esse mesmo assunto?",
          xp: 25,
        },
      ],
    },
    {
      id: "st-mod-4",
      title: "Módulo IV: Santidade em Comunidade e Perseverança",
      lessons: [
        {
          id: "st-4-1",
          title: "Estimulando uns aos outros: santidade em comunhão",
          intro: [
            "É comum imaginar a santificação como um projeto individual — 'eu e Deus', numa jornada solitária de disciplina pessoal. A Bíblia corrige essa visão: a santificação bíblica sempre acontece em comunidade. Hebreus 10 não manda apenas 'considerar' a si mesmo, mas 'considerar uns aos outros', com um propósito específico: estimular ao amor e às boas obras.",
            "A palavra grega por trás de 'estimular' (paroxysmos) é a mesma que, em outro contexto, descreve um conflito ou provocação áspera (At 15:39). Aqui, porém, o autor de Hebreus inverte o sentido negativo da palavra: existe uma provocação boa, positiva, intencional — a de despertar, nos outros, o amor e as boas obras, pelo exemplo, pelo encorajamento e pela presença fiel.",
            "Por isso o texto conecta diretamente esse estímulo mútuo com a advertência de 'não abandonar a nossa congregação'. A ausência prolongada da comunhão da igreja local não é apenas uma escolha neutra de agenda — é a retirada de um dos meios que Deus estabeleceu para a sua própria santificação, e a retirada, de outros, do cuidado que você deveria oferecer.",
          ],
          verses: [
            {
              ref: "Hebreus 10:24-25",
              textByVersion: {
                NVI: "E consideremos uns aos outros para nos incentivarmos ao amor e às boas obras. Não deixemos de reunir-nos, como é costume de alguns, mas encorajemo-nos uns aos outros, ainda mais quando vocês veem que se aproxima o Dia.",
                NAA: "Consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras, não abandonando a nossa congregação, como é costume de alguns; antes, façamo-lo, e tanto mais quanto vedes que o Dia se aproxima.",
                ACF: "E consideremo-nos uns aos outros, para nos estimularmos ao amor e às boas obras. Não deixando a nossa congregação, como é costume de alguns; antes, admoestando-nos uns aos outros; e tanto mais, quanto vedes que se vai aproximando aquele dia.",
                NVT: "Vamos pensar em maneiras de estimular uns aos outros a atos de amor e boas ações. E não deixemos de nos reunir, como alguns têm o costume de fazer, mas encorajemo-nos uns aos outros, principalmente agora que o dia da volta do Senhor está se aproximando.",
              },
              originals: [
                { word: "παροξυσμός", translit: "paroxysmos", meaning: "estímulo intenso, provocação positiva — despertar ativamente o outro para o amor e as boas obras", lang: "grego" },
              ],
            },
            {
              ref: "Provérbios 27:17",
              textByVersion: {
                NVI: "Assim como o ferro afia o ferro, assim uma pessoa afia a outra.",
                NAA: "O ferro com o ferro se afia; assim, o homem afia o rosto do seu amigo.",
                ACF: "Como o ferro com o ferro se aguça, assim o homem afia o rosto do seu amigo.",
              },
            },
          ],
          keywords: [
            { word: "παροξυσμός", translit: "paroxysmos", meaning: "'estímulo, provocação' — usado aqui em sentido positivo, para despertar amor e boas obras", lang: "grego" },
            { word: "κατανοέω", translit: "katanoeō", meaning: "'considerar atentamente, observar com propósito' — atenção intencional voltada para o bem do outro", lang: "grego" },
          ],
          deepDive:
            "O autor de Hebreus escreve para uma comunidade tentada a se afastar da fé sob pressão e perseguição — e o remédio que ele prescreve não é apenas doutrina individual mais sólida, mas comunhão mais fiel. 'Consideremo-nos uns aos outros' (katanoōmen) é um verbo de atenção intencional: não basta estar fisicamente perto de outros crentes; é preciso observá-los com propósito, notando onde precisam de encorajamento, correção ou apoio prático. O resultado desse olhar atento é o 'paroxysmos' — um estímulo ativo, quase uma provocação boa, para o amor e as boas obras. Isso mostra que a igreja local não é um acessório opcional da vida cristã, nem apenas um lugar de consumo espiritual passivo (ouvir uma pregação e ir embora), mas o ambiente que Deus escolheu para que crentes ativamente cuidem uns dos outros. Questões sobre como viver essa comunhão de forma saudável — lidar com conflitos, mágoas ou dificuldades dentro da igreja local — são, por natureza, delicadas e pessoais, e merecem ser conversadas diretamente com seu pastor ou líder espiritual, que conhece sua realidade concreta.",
          theologianQuote: {
            author: "Dietrich Bonhoeffer",
            text: "Aquele que está sozinho com sua fé está sozinho com o pecado, com a tentação e com a acusação. A comunidade cristã não é um luxo — é o lugar onde recebemos e oferecemos o socorro que só o corpo de Cristo pode dar.",
          },
          quizzes: [
            {
              question: "Segundo Hebreus 10:24-25, qual é o propósito de 'considerar uns aos outros'?",
              options: [
                "Apenas cumprir uma obrigação religiosa semanal",
                "Estimular ativamente ao amor e às boas obras, através de atenção e encorajamento mútuo",
                "Julgar e apontar os erros de outros crentes",
                "Comparar o próprio desempenho espiritual com o dos outros",
              ],
              correctIndex: 1,
              explanation: "O texto conecta atenção mútua ('consideremo-nos') com um estímulo positivo e ativo ao amor e às boas obras.",
            },
            {
              question: "O que a lição ensina sobre a santificação e a comunhão da igreja local?",
              options: [
                "São assuntos completamente separados",
                "A santificação bíblica normalmente acontece em comunidade, e negligenciar a igreja local prejudica esse processo",
                "A comunhão só é necessária para os líderes da igreja",
                "É possível crescer espiritualmente com a mesma eficácia estando sozinho",
              ],
              correctIndex: 1,
              explanation: "A Bíblia conecta diretamente o crescimento em santidade com a comunhão fiel da igreja local.",
            },
          ],
          application:
            "Pense em um irmão ou irmã na fé que você tem visto pouco ultimamente. Esta semana, procure-o(a) intencionalmente — por uma mensagem, visita ou conversa — com o propósito específico de encorajá-lo(a) ao amor e às boas obras, não apenas de manter contato social.",
          prayer:
            "Senhor, obrigado pela igreja local que estabeleceste como lugar de cuidado e crescimento mútuo. Perdoa-me pelas vezes em que tratei a comunhão como opcional, ou pelas vezes em que fui apenas espectador, sem me envolver ativamente na vida de outros. Ensina-me a considerar meus irmãos com atenção verdadeira, e a ser, para eles, um estímulo real ao amor e às boas obras. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escolha três pessoas da sua igreja local e, esta semana, dedique um tempo específico para cada uma delas — oração, mensagem de encorajamento ou conversa pessoal — com o objetivo de estimulá-las ao amor e às boas obras, segundo Hebreus 10:24-25.",
          reflectionQuestion:
            "Você tem vivido sua fé mais como espectador (ouvir, receber, ir embora) ou como participante ativo do cuidado mútuo que Deus estabeleceu na igreja local?",
          xp: 20,
        },
        {
          id: "st-4-2",
          title: "Perseverança: a obra que Deus não abandona",
          intro: [
            "Depois de tudo o que vimos sobre esforço, disciplina e cooperação ativa com a graça, uma pergunta legítima pode surgir: e se eu falhar? E se, apesar de todo o esforço sincero, eu tropeçar de novo, e de novo? A resposta bíblica não minimiza a seriedade do pecado, mas também não deixa o crente sozinho com o peso da própria performance: 'aquele que começou boa obra em vós a aperfeiçoará' (Fp 1:6).",
            "Paulo escreve essa promessa a uma igreja real, imperfeita, no meio de conflitos e fraquezas visíveis — não a cristãos que já haviam 'chegado lá'. A confiança de Paulo não está no desempenho da igreja de Filipos, mas no caráter fiel de Deus, que não abandona o que começou.",
            "Isso não anula o chamado à perseverança ativa; pelo contrário, o fundamenta. Hebreus 12 descreve a vida cristã como uma corrida de resistência: depor todo peso e pecado, correr com perseverança, mantendo os olhos fixos em Jesus. A confiança na fidelidade de Deus não é desculpa para desistir — é exatamente o que dá forças para continuar correndo, mesmo cansado, mesmo depois de cair.",
          ],
          verses: [
            {
              ref: "Filipenses 1:6",
              textByVersion: {
                NVI: "Estou convencido de que aquele que em vocês começou a boa obra irá completá-la até o dia de Cristo Jesus.",
                NAA: "Tendo por certo isto: que aquele que em vós começou a boa obra a aperfeiçoará até ao Dia de Cristo Jesus.",
                ACF: "Tendo por certo isto mesmo, que aquele que em vós começou a boa obra a aperfeiçoará até ao dia de Jesus Cristo.",
                NVT: "E tenho certeza de que Deus, que começou a boa obra em vocês, continuará essa obra até completá-la no dia da volta de Cristo Jesus.",
              },
              originals: [
                { word: "ἐπιτελέσει", translit: "epitelesei", meaning: "'aperfeiçoará, completará' — verbo no futuro, promessa certa e não condicionada ao mérito humano", lang: "grego" },
              ],
            },
            {
              ref: "Hebreus 12:1-2",
              textByVersion: {
                NVI: "Portanto, também nós, uma vez que estamos rodeados por tão grande nuvem de testemunhas, livremo-nos de tudo o que nos atrapalha e do pecado que nos envolve, e corramos com perseverança a corrida que nos é proposta, tendo os olhos fitos em Jesus, autor e consumador da nossa fé.",
                NAA: "Portanto, nós também, uma vez que estamos rodeados de tão grande nuvem de testemunhas, desprezemos toda sobrecarga e o pecado que tão de perto nos assedia e corramos, com perseverança, a carreira que nos está proposta, olhando para Jesus, autor e consumador da fé.",
                ACF: "Portanto, nós também, pois que estamos rodeados de uma tão grande nuvem de testemunhas, deixemos todo o peso, e o pecado que tão de perto nos rodeia, e corramos com paciência a carreira que nos está proposta, olhando para Jesus, autor e consumador da fé.",
              },
              originals: [
                { word: "ὑπομονή", translit: "hypomonē", meaning: "perseverança — resistência ativa e voluntária, não mera espera passiva", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ἐπιτελέω", translit: "epiteleō", meaning: "'completar, levar até o fim' — Deus é o sujeito que garante a conclusão da obra iniciada", lang: "grego" },
            { word: "ὑπομονή", translit: "hypomonē", meaning: "'perseverança' — resistência ativa e voluntária diante da dificuldade, não passividade", lang: "grego" },
          ],
          deepDive:
            "A confiança de Paulo em Filipenses 1:6 não é ingênua — ele conhecia bem as fraquezas reais daquela igreja. Mas sua certeza não repousa no desempenho deles, e sim no caráter de Deus, que 'começou' e promete 'completar' (epitelesei, verbo no futuro, sem condicionais escondidos). Isso é motivo de descanso genuíno para o crente que luta com recaídas: a perseverança final na fé depende, em última instância, da fidelidade de Deus, e não apenas da força de vontade humana. Ao mesmo tempo, Hebreus 12 chama o crente a correr com 'hypomonē' — uma palavra que descreve resistência ativa, o atleta que continua correndo mesmo cansado, não alguém deitado esperando passivamente o fim da corrida. As duas verdades não competem: precisamos correr, e a certeza de que Deus sustenta a corrida é exatamente o que nos dá coragem para continuar correndo depois de tropeçar. Sobre como essa segurança se relaciona, em detalhes, com situações específicas de dúvida, recaída ou desânimo espiritual profundo, é sempre sábio buscar a Palavra em oração e conversar com seu pastor ou discipulador, que pode acompanhar sua caminhada de perto.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Se Deus começou a boa obra, é porque decidiu terminá-la; ele não é homem, para começar edifícios que não tem meios ou vontade de concluir.",
          },
          quizzes: [
            {
              question: "Em que se baseia a confiança de Paulo em Filipenses 1:6 de que a igreja perseverará até o fim?",
              options: [
                "No desempenho espiritual impecável da igreja de Filipos",
                "No caráter fiel de Deus, que completa a obra que começou",
                "Na força de vontade individual de cada crente",
                "Em uma promessa condicionada ao mérito humano",
              ],
              correctIndex: 1,
              explanation: "Paulo funda sua certeza no caráter de Deus, não no desempenho da igreja — 'epitelesei' é promessa divina, não conquista humana.",
            },
            {
              question: "O que a palavra grega 'hypomonē' (perseverança) comunica em Hebreus 12:1?",
              options: [
                "Espera passiva, sem ação do crente",
                "Resistência ativa e voluntária, como um atleta que continua correndo mesmo cansado",
                "Uma virtude reservada apenas para líderes espirituais",
                "A ideia de que o esforço humano é irrelevante",
              ],
              correctIndex: 1,
              explanation: "'Hypomonē' descreve resistência ativa, não passividade — o crente é chamado a correr, apoiado na fidelidade de Deus.",
            },
            {
              question: "Como as duas verdades — a fidelidade de Deus e o chamado à perseverança ativa — se relacionam segundo a lição?",
              options: [
                "Elas se contradizem e o crente deve escolher uma delas",
                "A certeza da fidelidade de Deus sustenta e fortalece a perseverança ativa do crente, em vez de anulá-la",
                "A fidelidade de Deus torna o esforço humano desnecessário",
                "A perseverança ativa substitui a necessidade da graça de Deus",
              ],
              correctIndex: 1,
              explanation: "As duas verdades se complementam: a fidelidade de Deus é o fundamento que dá coragem para continuar correndo com perseverança.",
            },
          ],
          application:
            "Se você tem carregado desânimo por causa de recaídas recentes, escreva Filipenses 1:6 num lugar visível esta semana. Toda vez que sentir vontade de desistir, releia a promessa e dê um passo concreto — pequeno que seja — de perseverança naquele mesmo dia, em vez de esperar se sentir 'pronto' para recomeçar.",
          prayer:
            "Pai, obrigado porque a minha perseverança final não depende só da minha força, mas da tua fidelidade em completar o que começaste em mim. Quando eu tropeçar, lembra-me dessa promessa, e dá-me coragem para levantar e continuar correndo, com os olhos fixos em Jesus, autor e consumador da minha fé. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Identifique um 'peso' específico (Hb 12:1) — não necessariamente pecado, mas algo que tem atrapalhado sua corrida espiritual (uma distração, um hábito, uma prioridade fora de ordem). Esta semana, tome uma decisão concreta para deixá-lo de lado, e registre diariamente como isso afeta sua caminhada com Deus.",
          reflectionQuestion:
            "Em que momento recente você sentiu vontade de desistir da sua caminhada com Deus — e como a certeza de que 'aquele que começou a boa obra em você a completará' muda a forma como você encara esse momento?",
          xp: 25,
        },
      ],
    },
    {
      id: "st-mod-5",
      title: "Módulo V: O Espírito e o Sofrimento na Santificação",
      lessons: [
        {
          id: "st-5-1",
          title: "O Papel do Espírito Santo na Santificação",
          intro: [
            "Se a santificação exige esforço real do crente, é fácil concluir, por engano, que ela depende basicamente de força de vontade — como se fosse mais um projeto de autoaperfeiçoamento, só que com temas religiosos. A Bíblia corrige essa ideia logo na raiz: o agente principal da santificação não é você. É o Espírito Santo.",
            "Jesus prometeu que, ao subir aos céus, não deixaria os discípulos órfãos — enviaria 'outro Consolador' (João 14:16-17), que habitaria permanentemente em cada crente. Diferente do Antigo Testamento, em que o Espírito vinha sobre pessoas específicas para tarefas específicas, hoje todo aquele que crê em Cristo recebe o Espírito Santo de forma permanente, no momento da conversão (Ef 1:13-14).",
            "Mas habitar não é o mesmo que encher. Paulo ordena aos efésios: 'sejam cheios do Espírito' (Ef 5:18) — um mandamento no imperativo, repetido continuamente, que descreve um crente cada vez mais rendido, cada vez mais controlado pelo Espírito, em vez de controlado por si mesmo ou por qualquer outra coisa. A presença do Espírito é dada uma vez; o enchimento e a submissão a ele são renovados dia após dia.",
            "É o Espírito quem aplica, na prática diária, tudo o que Cristo conquistou na cruz: ele nos convence do pecado, nos capacita a matar a carne (Rm 8:13), produz o fruto em nós (Gl 5:22-23), intercede por nós quando nem sabemos orar direito (Rm 8:26) e nos dá a certeza íntima de que somos filhos de Deus (Rm 8:15-16). Sem o Espírito, a santificação seria moralismo cansativo; com ele, é obra de graça vivida em cooperação real.",
          ],
          verses: [
            {
              ref: "Romanos 8:13-14",
              textByVersion: {
                NVI: "Pois, se vocês viverem de acordo com a carne, morrerão; mas, se pelo Espírito vocês fizerem morrer os atos do corpo, viverão, porque todos os que são guiados pelo Espírito de Deus são filhos de Deus.",
                NAA: "Porque, se viverdes de acordo com a carne, morrereis; mas, se, pelo Espírito, fizerdes morrer os feitos do corpo, vivereis. Pois todos os que são guiados pelo Espírito de Deus são filhos de Deus.",
                ACF: "Porque, se viverdes segundo a carne, morrereis; mas, se pelo Espírito mortificardes as obras do corpo, vivereis. Porque todos os que são guiados pelo Espírito de Deus esses são filhos de Deus.",
                NVT: "Pois, se vocês viverem de acordo com a natureza pecaminosa, vão morrer. Mas, se pelo poder do Espírito vocês derem morte às ações pecaminosas do corpo, vão viver. Pois todos os que são guiados pelo Espírito de Deus são filhos de Deus.",
              },
              originals: [
                { word: "πνεύματι", translit: "pneumati", meaning: "'pelo Espírito' — instrumento e agente ativo da mortificação do pecado, não o crente isolado", lang: "grego" },
              ],
            },
            {
              ref: "Efésios 5:18",
              textByVersion: {
                NVI: "Não se embriaguem com vinho, que leva ao libertinagem, mas deixem-se encher pelo Espírito.",
                NAA: "E não vos embriagueis com vinho, no qual há dissolução, mas enchei-vos do Espírito.",
                ACF: "E não vos embriagueis com vinho, em que há contenda, mas enchei-vos do Espírito.",
              },
              originals: [
                { word: "πληροῦσθε", translit: "plērousthe", meaning: "'sejam cheios' — verbo no imperativo presente passivo: uma ordem contínua, renovada a cada dia, não um evento único", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "παράκλητος", translit: "paráklētos", meaning: "'Consolador, Advogado, Aquele que vem ao lado'. Título usado por Jesus para o Espírito Santo em João 14-16, indicando presença ativa e permanente de ajuda.", lang: "grego" },
            { word: "πληρόω", translit: "plēroō", meaning: "'encher, dominar completamente'. Usado em Efésios 5:18 no imperativo contínuo — o crente é chamado a viver constantemente rendido ao controle do Espírito.", lang: "grego" },
          ],
          deepDive:
            "Há uma diferença importante, muitas vezes esquecida, entre a habitação do Espírito e o enchimento do Espírito. A habitação (o Espírito vivendo permanentemente em cada crente genuíno) acontece uma única vez, no momento da conversão, e nunca é retirada — é selo e garantia da salvação (Ef 1:13-14). Já o enchimento é repetido, condicional à submissão do crente, e descreve o quanto, no dia a dia, uma pessoa está de fato rendida ao controle do Espírito, em vez de andar segundo seus próprios impulsos. Por isso Paulo pode, na mesma carta, afirmar que todo crente tem o Espírito (Ef 1:13) e, ainda assim, ordenar que os efésios 'sejam cheios' dele (Ef 5:18) — a presença é garantida pela graça; o enchimento prático depende de uma entrega diária e renovada. Romanos 8 amplia esse quadro: é 'pelo Espírito' que o crente mata as obras da carne (v.13), é o Espírito quem 'guia' os filhos de Deus (v.14), e é o mesmo Espírito quem intercede por nós 'com gemidos inexprimíveis' quando nem sabemos como orar diante de uma dor (v.26). A santificação, portanto, nunca é uma tarefa solitária de força de vontade — é cooperação real e diária entre o esforço do crente e a obra ativa, presente e pessoal do Espírito Santo dentro dele.",
          theologianQuote: {
            author: "J.I. Packer",
            text: "O Espírito Santo não nos deixa lutar sozinhos contra o pecado; ele mesmo entra na batalha, do lado de dentro, tornando possível o que, por nós mesmos, jamais conseguiríamos.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "João 14:16-17",
                textByVersion: {
                  NVI: "E eu pedirei ao Pai, e ele lhes dará outro Conselheiro para estar com vocês para sempre: o Espírito da verdade... vocês o conhecem, porque ele vive com vocês e estará em vocês.",
                },
              },
              {
                ref: "Gálatas 5:25",
                textByVersion: {
                  NVI: "Se vivemos pelo Espírito, andemos também pelo Espírito.",
                },
              },
            ],
            historicalContext:
              "A promessa de um Consolador que habitaria permanentemente em cada crente marca uma diferença importante entre a experiência do povo de Deus no Antigo Testamento e a experiência da igreja depois de Pentecostes (At 2). No Antigo Testamento, o Espírito vinha sobre juízes, reis e profetas especificamente para capacitá-los a tarefas específicas, e podia se retirar (como no caso de Saul, em 1 Samuel 16:14). Depois de Pentecostes, porém, o Espírito passou a habitar permanentemente em todo aquele que crê em Cristo, sem exceção — não apenas em líderes ou pessoas especiais. É uma das marcas centrais da Nova Aliança anunciada pelos profetas (Ez 36:26-27).",
            theologicalDebate:
              "Tradições cristãs divergem sobre como e quando certas manifestações visíveis do Espírito (como línguas e profecia) operam hoje — um tema onde cristãos fiéis e comprometidos com a Escritura mantêm posições diferentes. Esta lição não trata desse debate específico; o que a Bíblia afirma sem controvérsia entre evangélicos é que todo crente genuíno recebe o Espírito Santo permanentemente na conversão, e que ele é o agente ativo e indispensável da santificação diária, independentemente da posição que alguém adote sobre dons específicos.",
          },
          quizzes: [
            {
              question: "Qual é a diferença entre a habitação do Espírito e o enchimento do Espírito, segundo a lição?",
              options: [
                "São a mesma coisa, sem distinção bíblica",
                "A habitação acontece uma vez, na conversão, e permanece; o enchimento é repetido e depende da submissão diária do crente",
                "O enchimento acontece uma vez; a habitação precisa ser repetida",
                "Nenhum dos dois está disponível para todo crente",
              ],
              correctIndex: 1,
              explanation: "A presença do Espírito é dada uma vez e selada; o enchimento (Ef 5:18) é uma ordem contínua, renovada dia após dia.",
            },
            {
              question: "Segundo Romanos 8:13, como o crente mata as obras da carne?",
              options: [
                "Por pura força de vontade, sem ajuda externa",
                "Pelo Espírito — é ele quem capacita e atua na mortificação do pecado",
                "Apenas por meio de regras e disciplina religiosa",
                "Isso não é possível nesta vida",
              ],
              correctIndex: 1,
              explanation: "O texto grego é claro: 'pelo Espírito' (pneumati) — o Espírito é agente ativo, não apenas espectador do esforço humano.",
            },
          ],
          application:
            "Antes de começar seu dia amanhã, faça uma oração simples e específica: peça a Deus que te encha do Espírito Santo para aquele dia — não como fórmula mágica, mas como um ato consciente de rendição e dependência, reconhecendo que você não consegue viver a santidade sozinho.",
          prayer:
            "Espírito Santo, obrigado por habitares em mim desde o dia em que cri. Reconheço que muitas vezes tento viver a santidade com minhas próprias forças, e falho. Enche-me hoje, controla meus desejos, minhas palavras e minhas escolhas, para que eu reflita cada vez mais o caráter de Jesus. Em nome dele, amém.",
          weeklyChallenge:
            "Todos os dias desta semana, antes de sair de casa, dedique um minuto para orar pedindo o enchimento do Espírito Santo para aquele dia específico. Ao final da semana, escreva o que percebeu de diferente em suas reações e escolhas.",
          reflectionQuestion:
            "Em que áreas da sua vida você tem tentado viver a santidade apenas com esforço próprio, sem depender conscientemente do Espírito Santo?",
          xp: 25,
        },
        {
          id: "st-5-2",
          title: "Sofrimento e Santificação: o propósito por trás da dor",
          intro: [
            "Nenhuma explicação teológica sobre santificação está completa sem enfrentar uma pergunta dolorosamente prática: por que Deus permite sofrimento na vida de quem já é seu filho? A resposta bíblica não minimiza a dor nem finge que ela não existe — mas revela um propósito que a mera dor, sozinha, não consegue ver.",
            "Paulo escreve, em Romanos 5, uma sequência que soa quase chocante: 'gloriamo-nos nas tribulações, porque a tribulação produz perseverança; a perseverança, um caráter aprovado; e o caráter aprovado, esperança'. Ele não diz que o sofrimento em si é bom — diz que, nas mãos de Deus, ele se torna instrumento de formação de caráter, algo que o conforto sozinho raramente produz.",
            "Hebreus 12 usa uma imagem ainda mais direta: a de um pai que disciplina o filho que ama, 'para o nosso próprio bem, para que participemos da sua santidade'. A disciplina, ali, não é sinal de rejeição — é evidência de que você é, de fato, filho, e não um estranho a quem Deus é indiferente.",
            "Isso não significa que toda dor tenha uma explicação simples e imediata, nem que devemos procurar um 'motivo específico' para cada sofrimento particular, como se fosse sempre punição por um pecado identificável — a Bíblia rejeita explicitamente essa leitura simplista (ver o livro de Jó). Significa, sim, que Deus é soberano mesmo sobre a dor, e que ele promete usá-la, em suas mãos sábias e boas, para nos conformar à imagem de Cristo (Rm 8:28-29).",
          ],
          verses: [
            {
              ref: "Romanos 5:3-5",
              textByVersion: {
                NVI: "Não só isso, mas também nos gloriamos nas tribulações, porque sabemos que a tribulação produz perseverança; a perseverança, um caráter aprovado; e o caráter aprovado, esperança. E a esperança não nos decepciona, porque Deus derramou seu amor em nossos corações, por meio do Espírito Santo que nos foi concedido.",
                NAA: "E não somente isto, mas também nos gloriamos nas tribulações, sabendo que a tribulação produz perseverança; e a perseverança, um caráter aprovado; e o caráter aprovado, esperança; e a esperança não nos decepciona, porquanto o amor de Deus é derramado em nosso coração pelo Espírito Santo que nos foi dado.",
                ACF: "E não somente isto, mas também nos gloriamos nas tribulações; sabendo que a tribulação produz a paciência, E a paciência a experiência, e a experiência a esperança. E a esperança não confunde, porquanto o amor de Deus está derramado em nossos corações pelo Espírito Santo que nos foi dado.",
                NVT: "Também temos alegria em nossos sofrimentos, porque sabemos que o sofrimento produz perseverança. E a perseverança desenvolve firmeza de caráter, e o caráter fortalece nossa esperança na salvação. E a esperança não decepciona, porque temos a certeza de que Deus nos ama profundamente, pois derramou seu amor em nosso coração por meio do Espírito Santo, que nos foi dado.",
              },
              originals: [
                { word: "ὑπομονή", translit: "hypomonē", meaning: "'perseverança, resistência ativa' — a mesma qualidade formada pela tribulação, quando recebida com fé", lang: "grego" },
              ],
            },
            {
              ref: "Hebreus 12:10-11",
              textByVersion: {
                NVI: "Nossos pais nos disciplinavam por um breve período, segundo lhes parecia melhor; mas Deus nos disciplina para o nosso bem, para que participemos da sua santidade. Nenhuma disciplina parece ser motivo de alegria no momento, mas sim de tristeza. Mais tarde, porém, produz fruto de justiça e paz para aqueles que por ela foram exercitados.",
                NAA: "Pois eles, na verdade, por um pouco de tempo, nos disciplinavam, segundo lhes parecia bem, mas este, para nosso proveito, a fim de que participemos da sua santidade. Na verdade, nenhuma disciplina, ao presente, parece ser motivo de alegria, mas de tristeza; contudo, depois, produz fruto pacífico de justiça nos exercitados por ela.",
                ACF: "Porque aqueles por um pouco de tempo, como bem lhes parecia, nos castigavam; mas este, para nosso proveito, para sermos participantes da sua santidade. Ora, nenhum castigo, ao presente, parece ser causa de gozo, senão de tristeza; mas depois produz um fruto pacífico de justiça nos exercitados por ele.",
              },
              originals: [
                { word: "γυμνάζω", translit: "gymnazō", meaning: "'exercitar, treinar' — mesma raiz de 'ginástica'; a disciplina treina o crente como um atleta, não o destrói", lang: "grego" },
              ],
            },
          ],
          keywords: [
            { word: "ὑπομονή", translit: "hypomonē", meaning: "'perseverança' — resistência ativa formada pela tribulação recebida com fé, não amargura passiva.", lang: "grego" },
            { word: "παιδεία", translit: "paideia", meaning: "'disciplina, educação formativa'. Usada em Hebreus 12 para descrever o sofrimento permitido por Deus como treino de um pai que ama, não como punição de um juiz hostil.", lang: "grego" },
          ],
          deepDive:
            "É importante notar a ordem cuidadosa da cadeia lógica em Romanos 5:3-5: tribulação produz perseverança (hypomonē); perseverança produz caráter aprovado (a qualidade de quem foi testado e passou no teste); e caráter aprovado produz esperança mais firme, porque já viu, na prática, a fidelidade de Deus sustentando através da dor. Nenhum desses elos aparece automaticamente — a mesma tribulação pode produzir amargura em vez de perseverança, se recebida com descrença em vez de fé. Por isso Tiago 1:2-4 conecta a mesma ideia à sabedoria: 'se algum de vocês tem falta de sabedoria, peça-a a Deus'. Já Hebreus 12 usa a metáfora da disciplina paterna e do treino atlético (paideia, gymnazō) — o sofrimento permitido por Deus na vida do crente não é sinal de abandono, mas evidência de que ele nos trata como filhos legítimos, investindo em nosso caráter a longo prazo. Isso é radicalmente diferente da ideia, comum em algumas correntes religiosas, de que todo sofrimento é resultado direto de um pecado específico ou de falta de fé — o livro de Jó existe justamente para desmontar essa equação simplista. O propósito de Deus no sofrimento não é sempre visível ou explicável no momento, mas sua promessa em Romanos 8:28-29 permanece: ele opera todas as coisas para o bem daqueles que o amam, conformando-os à imagem de Cristo. Diante de dor profunda ou perda significativa, essa verdade nunca deve ser usada como resposta apressada ou insensível para outra pessoa que sofre — ela é, antes, um alicerce para a própria fé se firmar, e um cuidado pastoral atento, junto com a igreja local, é essencial para caminhar com quem sofre.",
          theologianQuote: {
            author: "Charles Spurgeon",
            text: "Deus poda a videira, não porque a odeia, mas porque quer que ela dê mais fruto; toda tesoura na mão do Pai serve à mesma videira que ele ama.",
          },
          deepen: {
            additionalVerses: [
              {
                ref: "Tiago 1:2-4",
                textByVersion: {
                  NVI: "Meus irmãos, considerem motivo de grande alegria o fato de passarem por diversas provações, pois vocês sabem que a prova da sua fé produz perseverança. E a perseverança deve levar a obra a termo, para que vocês sejam maduros e íntegros, sem que falte a vocês coisa alguma.",
                },
              },
              {
                ref: "1 Pedro 1:6-7",
                textByVersion: {
                  NVI: "Nisso vocês exultam, mesmo tendo sido, por um breve tempo, entristecidos por várias provações, a fim de que a prova de sua fé, mais preciosa que o ouro, que perece, mas é aprovado pelo fogo, seja motivo de louvor, glória e honra quando Jesus Cristo for revelado.",
                },
              },
            ],
            theologicalDebate:
              "Cristãos fiéis divergem sobre até que ponto se pode identificar um propósito específico e individual em cada episódio particular de sofrimento (por exemplo, 'Deus permitiu isso especificamente para me ensinar X'). Esta lição evita essa afirmação categórica caso a caso — o que a Escritura garante com clareza é o propósito geral (formar caráter e conformar à imagem de Cristo), não necessariamente uma explicação detalhada para cada dor específica. Ao acompanhar alguém que sofre, a prudência pastoral pede cuidado redobrado antes de declarar 'o motivo' de uma dor alheia.",
            secondQuote: {
              author: "Tim Keller",
              text: "O cristianismo não promete uma vida sem sofrimento; promete um Deus que sofre conosco e que, mesmo através da dor, nunca deixa de trabalhar para o nosso bem eterno.",
            },
          },
          quizzes: [
            {
              question: "Segundo Romanos 5:3-5, qual é a sequência que a tribulação pode produzir na vida do crente?",
              options: [
                "Tribulação leva direto à esperança, sem passos intermediários",
                "Tribulação produz perseverança; perseverança produz caráter aprovado; caráter aprovado produz esperança",
                "A tribulação sempre produz amargura, independentemente da resposta do crente",
                "A tribulação não tem nenhum propósito formativo",
              ],
              correctIndex: 1,
              explanation: "Paulo descreve uma cadeia: tribulação → perseverança → caráter aprovado → esperança, quando recebida com fé.",
            },
            {
              question: "Como Hebreus 12:10-11 descreve o propósito da disciplina de Deus na vida do crente?",
              options: [
                "Como punição de um juiz hostil e distante",
                "Como treino de um Pai que ama, visando nosso bem e nossa participação na santidade dele",
                "Como algo sem nenhum propósito real",
                "Como prova de que Deus abandonou o crente",
              ],
              correctIndex: 1,
              explanation: "'Paideia' descreve disciplina formativa de um pai amoroso, não punição hostil — o objetivo é participarmos da santidade de Deus.",
            },
          ],
          application:
            "Pense numa dificuldade real que você está enfrentando (ou enfrentou recentemente). Em vez de perguntar apenas 'por que isso está acontecendo comigo?', escreva uma oração pedindo a Deus para revelar o que ele quer formar em seu caráter através dessa experiência — sem forçar uma resposta simplista, mas com confiança na sua bondade.",
          prayer:
            "Pai, eu não entendo todo sofrimento que vivo ou vejo ao meu redor, e não quero fingir que entendo. Mas escolho confiar que tu és soberano mesmo sobre a dor, e que a usas, nas tuas mãos boas, para me formar à imagem de Jesus. Sustenta minha fé nos dias difíceis, e me dá um coração compassivo para caminhar com quem sofre. Em nome de Jesus, amém.",
          weeklyChallenge:
            "Escreva sobre uma dificuldade passada da sua vida e identifique, em retrospecto, algo de caráter, sabedoria ou dependência de Deus que cresceu em você por causa dela — sem minimizar a dor que sentiu na época.",
          reflectionQuestion:
            "Existe algum sofrimento atual em sua vida que você tem enfrentado sozinho, com amargura, em vez de trazê-lo diante de Deus com fé e em comunhão com sua igreja?",
          xp: 25,
        },
      ],
    },
  ],
};

export const additionalTrails2: Trail[] = [santificacao];
