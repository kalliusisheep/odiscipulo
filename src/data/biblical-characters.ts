export type GameDifficulty = "facil" | "medio" | "dificil" | "bereano";

export type BiblicalCharacter = {
  id: string;
  name: string;
  aliases: string[];
  difficulty: GameDifficulty;
  summary: string;
  references: string[];
  hints: [string, string, string, string];
};

export const CHARACTER_DIFFICULTY: Record<GameDifficulty, { label: string; multiplier: number; tone: string }> = {
  facil: { label: "Fácil", multiplier: 1, tone: "text-success" },
  medio: { label: "Médio", multiplier: 1.25, tone: "text-primary" },
  dificil: { label: "Difícil", multiplier: 1.5, tone: "text-ancient" },
  bereano: { label: "Bereano Supremo", multiplier: 2, tone: "text-purple-300" },
};

export const BIBLICAL_CHARACTERS: BiblicalCharacter[] = [
  {
    id: "moises", name: "Moisés", aliases: ["moises", "mose"], difficulty: "facil",
    summary: "Liderou a saída do povo hebreu do Egito e recebeu a Lei no Sinai.", references: ["Êxodo 3–14", "Êxodo 20"],
    hints: ["Sua infância foi preservada em um cesto colocado entre os juncos.", "Deus o chamou por meio de uma sarça que ardia sem ser consumida.", "Ele conduziu o povo pelo mar e recebeu as tábuas da aliança.", "Passou quarenta anos no deserto antes de conduzir Israel à liberdade."],
  },
  {
    id: "davi", name: "Davi", aliases: ["davi", "rei davi"], difficulty: "facil",
    summary: "Pastor, rei e compositor de salmos, lembrado por sua confiança em Deus.", references: ["1 Samuel 16–17", "2 Samuel 5"],
    hints: ["Era o filho mais novo de Jessé e cuidava das ovelhas.", "Enfrentou um guerreiro muito maior usando uma funda.", "Tornou-se rei e estabeleceu Jerusalém como centro do reino.", "A Bíblia o descreve como um homem segundo o coração de Deus."],
  },
  {
    id: "rute", name: "Rute", aliases: ["rute"], difficulty: "facil",
    summary: "Uma estrangeira que escolheu permanecer com Noemi e passou a fazer parte da linhagem de Davi.", references: ["Rute 1–4", "Mateus 1:5"],
    hints: ["Depois de ficar viúva, decidiu acompanhar sua sogra para uma terra estrangeira.", "Recolhia espigas nos campos para sustentar as duas.", "Casou-se com Boaz e tornou-se antepassada do rei Davi.", "Sua história é celebrada em um dos livros que leva seu nome."],
  },
  {
    id: "pedro", name: "Pedro", aliases: ["pedro", "simao pedro", "simão pedro", "simao"], difficulty: "medio",
    summary: "Pescador chamado por Jesus, tornou-se uma das principais testemunhas da igreja nascente.", references: ["Mateus 4:18–20", "Atos 2"],
    hints: ["Trabalhava como pescador quando recebeu o chamado para seguir Jesus.", "Caminhou sobre as águas, mas começou a afundar quando teve medo.", "Pregou no Pentecostes e anunciou a boa notícia a uma grande multidão.", "Negou conhecer Jesus três vezes antes de ser restaurado pelo Mestre."],
  },
  {
    id: "paulo", name: "Paulo", aliases: ["paulo", "saulo", "saulo de tarso"], difficulty: "medio",
    summary: "Perseguidor transformado em apóstolo, levou o evangelho a muitos povos e comunidades.", references: ["Atos 9", "Atos 13–28"],
    hints: ["Antes de seguir Jesus, combatia duramente os primeiros discípulos.", "Uma luz intensa o fez cair no caminho para uma cidade importante.", "Escreveu cartas para várias igrejas e realizou viagens missionárias.", "Foi chamado para levar o evangelho aos povos que não eram judeus."],
  },
  {
    id: "ester", name: "Ester", aliases: ["ester", "hadassa", "hadassah"], difficulty: "medio",
    summary: "Rainha que arriscou a própria vida para proteger seu povo de uma conspiração.", references: ["Ester 2–8"],
    hints: ["Foi criada por seu primo depois de perder os pais.", "Chegou ao palácio e se tornou rainha em um império estrangeiro.", "Entrou sem ser chamada na presença do rei para interceder por seu povo.", "Sua coragem ajudou a impedir a destruição dos judeus no império."],
  },
  {
    id: "debora", name: "Débora", aliases: ["debora"], difficulty: "dificil",
    summary: "Profetisa e juíza que liderou Israel com sabedoria em um período de opressão.", references: ["Juízes 4–5"],
    hints: ["Aconselhava o povo debaixo de uma palmeira.", "Chamou Baraque para reunir as tribos contra um exército opressor.", "Sua vitória foi celebrada em um cântico junto com Baraque.", "Foi profetisa e uma das juízas que lideraram Israel."],
  },
  {
    id: "gideao", name: "Gideão", aliases: ["gideao", "gideão", "jerubaal"], difficulty: "dificil",
    summary: "Juiz que venceu um exército numeroso com um grupo pequeno, confiando na direção de Deus.", references: ["Juízes 6–8"],
    hints: ["Recebeu seu chamado enquanto malhava trigo escondido por causa dos inimigos.", "Pediu sinais envolvendo um velo para discernir a direção de Deus.", "Seu exército foi reduzido a apenas trezentos homens antes da batalha.", "Liderou Israel contra os midianitas com uma estratégia inesperada."],
  },
  {
    id: "barnabe", name: "Barnabé", aliases: ["barnabe", "barnabé", "jose"], difficulty: "dificil",
    summary: "Encorajador generoso que ajudou a igreja a acolher novos convertidos e serviu com Paulo.", references: ["Atos 4:36–37", "Atos 11–15"],
    hints: ["Seu nome dado pelos apóstolos está relacionado a encorajamento.", "Vendeu um campo e colocou o valor aos pés dos apóstolos.", "Apoiou a entrada de Saulo no círculo dos discípulos e depois viajou com ele.", "Foi enviado pela igreja de Jerusalém para fortalecer os irmãos em Antioquia."],
  },
  {
    id: "lidia", name: "Lídia", aliases: ["lidia", "lídia"], difficulty: "dificil",
    summary: "Comerciante que acolheu a mensagem e abriu sua casa para os primeiros cristãos na Europa.", references: ["Atos 16:11–15"],
    hints: ["Trabalhava com tecidos de cor púrpura em uma cidade da Macedônia.", "Ouviu a mensagem junto a um lugar de oração perto de um rio.", "Depois de ser batizada, insistiu para que os missionários ficassem em sua casa.", "Sua conversão marcou o início da expansão do evangelho na Europa."],
  },
  {
    id: "melquisedeque", name: "Melquisedeque", aliases: ["melquisedeque"], difficulty: "bereano",
    summary: "Rei e sacerdote que abençoou Abraão e aparece como figura teológica singular nas Escrituras.", references: ["Gênesis 14:17–20", "Hebreus 7"],
    hints: ["Surgiu no relato após uma batalha vencida por Abraão.", "Trouxe pão e vinho e pronunciou uma bênção sobre o patriarca.", "Seu nome é usado em Hebreus para explicar um sacerdócio diferente do levítico.", "Era rei de Salém e sacerdote do Deus Altíssimo."],
  },
  {
    id: "bezaleel", name: "Bezalel", aliases: ["bezaleel", "bezalel"], difficulty: "bereano",
    summary: "Artesão escolhido para liderar a construção e a decoração do santuário no deserto.", references: ["Êxodo 31:1–11", "Êxodo 35–38"],
    hints: ["Era da tribo de Judá e descendia de uma família ligada à liderança.", "Recebeu habilidade especial para trabalhar com ouro, prata, bronze e madeira.", "Coordenou a produção dos objetos e tecidos do santuário móvel.", "Foi escolhido por Deus para liderar os artesãos do tabernáculo."],
  },
];

export const normalizeGameAnswer = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();

export const isCorrectCharacterAnswer = (character: BiblicalCharacter, answer: string) => {
  const normalized = normalizeGameAnswer(answer);
  return [character.name, ...character.aliases].some((item) => normalizeGameAnswer(item) === normalized);
};
