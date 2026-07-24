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
          title: "Justificado, mas ainda em obras",
          intro: [
            "Existe uma confusão comum entre novos e antigos cristãos: se já fomos declarados justos por Cristo, por que ainda lutamos tanto contra o pecado? A resposta está numa distinção que a igreja sempre fez: justificação e santificação são obras diferentes de Deus, com tempos diferentes — mas que exigem de nós uma resposta ativa e contínua.",
            "A justificação é um veredito: instantâneo, completo, jurídico. No momento em que você crê, Deus te declara justo — não porque você se tornou perfeito, mas porque a justiça de Cristo foi contada a seu favor pela fé. A santificação é diferente: é um processo progressivo, que dura a vida inteira, no qual o Espírito Santo transforma seu caráter para se parecer com Cristo — e no qual você é chamado a cooperar ativamente, buscando a santidade, resistindo à tentação e cultivando disciplinas espirituais.",
            "Confundir as duas produz dois erros opostos: achar que, por já estar justificado, o pecado não importa mais (antinomianismo); ou achar que precisa se santificar para merecer a justificação (legalismo). A Escritura ensina um caminho do meio, mais rico: você já é justo em Cristo pela graça mediante a fé, e por isso mesmo, com liberdade e responsabilidade, persegue ativamente a santidade — não para ganhar o que já tem, mas porque um coração verdadeiramente regenerado deseja se parecer com Aquele que o salvou.",
            "Paulo resume essa tensão com uma ordem de verbos importante em Filipenses 2:12-13: 'operai a vossa salvação', porque 'é Deus quem opera em vós'. Você trabalha porque Deus trabalha primeiro em você — mas o seu trabalho, sua escolha diária de obedecer, é parte real e necessária do processo, não um mero detalhe automático.",
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
            "Note a ordem em Filipenses 2:12-13: primeiro 'operai' (katergazesthe — trabalho contínuo, esforçado, real), depois a razão: 'porque é Deus quem opera em vós'. A gramática já ensina teologia: o crente tem um papel ativo e responsável na sua santificação — não é espectador passivo de um processo automático. Ao mesmo tempo, esse esforço não é a causa da nossa transformação, mas a resposta cooperativa a uma graça que Deus oferece e sustém. Você não se santifica para permanecer salvo por mérito próprio, mas porque a graça de Deus, recebida livremente pela fé, capacita e convida você a responder com obediência voluntária. A luta contra o pecado não é sinal de fé fraca — é sinal de vida espiritual real, e o convite bíblico é sempre para que você, com toda a força que o Espírito concede, persevere na busca ativa da santidade (Hb 12:14).",
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
                "Porque a salvação ainda não foi garantida e pode ser perdida por qualquer deslize",
                "Como resposta ativa e responsável ao fato de que Deus já está operando em nós",
                "Como forma de merecer o que Cristo já fez por obras",
                "Porque a graça não é suficiente sem esforço humano",
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
          title: "A Carne e o Espírito",
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
  ],
};

export const additionalTrails2: Trail[] = [santificacao];
