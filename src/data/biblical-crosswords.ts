import type { GameDifficulty } from "@/data/biblical-characters";

export type CrosswordTheme = "evangelhos" | "antigo" | "profetas" | "personagens" | "lugares" | "cartas";

export type CrosswordWord = {
  id: string;
  word: string;
  category: string;
  clue: string;
  reference: string;
  context: string;
  curiosity: string;
  difficulty: GameDifficulty;
  themes: CrosswordTheme[];
  alternatives?: string[];
};

export const CROSSWORD_DIFFICULTY: Record<GameDifficulty, { label: string; size: number; words: number; multiplier: number; description: string }> = {
  facil: { label: "Fácil", size: 9, words: 5, multiplier: 1, description: "Palavras conhecidas e cruzamentos generosos." },
  medio: { label: "Médio", size: 11, words: 7, multiplier: 1.25, description: "Mais cruzamentos e personagens variados." },
  dificil: { label: "Difícil", size: 13, words: 9, multiplier: 1.5, description: "Respostas maiores e referências menos óbvias." },
  bereano: { label: "Bereano Supremo", size: 15, words: 11, multiplier: 2, description: "Conhecimento profundo para quem examina tudo." },
};

export const CROSSWORD_THEMES: { id: CrosswordTheme; label: string }[] = [
  { id: "evangelhos", label: "Evangelhos" },
  { id: "antigo", label: "Antigo Testamento" },
  { id: "profetas", label: "Profetas" },
  { id: "personagens", label: "Personagens" },
  { id: "lugares", label: "Lugares bíblicos" },
  { id: "cartas", label: "Cartas" },
];

export const CROSSWORD_WORDS: CrosswordWord[] = [
  { id: "jesus", word: "JESUS", category: "Pessoa", clue: "O Cristo, Filho de Deus e Salvador.", reference: "Mateus 16:16", context: "Pedro reconheceu Jesus como o Cristo, o Filho do Deus vivo.", curiosity: "O nome Jesus significa ‘o Senhor salva’." , difficulty: "facil", themes: ["evangelhos", "personagens"] },
  { id: "moises", word: "MOISES", category: "Pessoa", clue: "Liderou Israel para fora do Egito.", reference: "Êxodo 3:10", context: "Deus chamou este servo para tirar seu povo da escravidão.", curiosity: "A história de seu chamado começa diante da sarça ardente.", difficulty: "facil", themes: ["antigo", "personagens"] },
  { id: "davi", word: "DAVI", category: "Rei", clue: "Pastor que se tornou rei e compositor de salmos.", reference: "1 Samuel 16:13", context: "Samuel ungiu o filho mais novo de Jessé diante de seus irmãos.", curiosity: "A Bíblia chama Davi de homem segundo o coração de Deus.", difficulty: "facil", themes: ["antigo", "personagens"] },
  { id: "noe", word: "NOE", category: "Pessoa", clue: "Construiu uma arca antes do grande dilúvio.", reference: "Gênesis 6:14", context: "Deus preservou sua família e os animais por meio da arca.", curiosity: "Depois do dilúvio, o arco-íris marcou a aliança de Deus.", difficulty: "facil", themes: ["antigo", "personagens"] },
  { id: "pedro", word: "PEDRO", category: "Apóstolo", clue: "Pescador chamado para ser pescador de pessoas.", reference: "Mateus 4:19", context: "Jesus chamou este discípulo enquanto ele trabalhava junto ao mar.", curiosity: "Seu nome original era Simão; Jesus também o chamou de Cefas.", difficulty: "medio", themes: ["evangelhos", "personagens"] },
  { id: "paulo", word: "PAULO", category: "Apóstolo", clue: "Perseguidor transformado em mensageiro aos gentios.", reference: "Atos 9:15", context: "Jesus escolheu este homem para levar seu nome a muitos povos.", curiosity: "Antes de ser conhecido como Paulo, ele era chamado Saulo.", difficulty: "medio", themes: ["personagens", "cartas"] },
  { id: "ester", word: "ESTER", category: "Rainha", clue: "Arriscou sua vida para proteger seu povo.", reference: "Ester 4:14", context: "Sua posição no palácio tornou possível interceder pelos judeus.", curiosity: "O livro de Ester não menciona explicitamente o nome de Deus.", difficulty: "medio", themes: ["antigo", "personagens"] },
  { id: "jerusalem", word: "JERUSALEM", category: "Lugar", clue: "Cidade escolhida como centro da adoração de Israel.", reference: "2 Crônicas 6:6", context: "Deus escolheu esta cidade para que seu nome estivesse ali.", curiosity: "Jerusalém é chamada de cidade do grande Rei nos Salmos.", difficulty: "medio", themes: ["lugares", "antigo"] },
  { id: "belem", word: "BELEM", category: "Lugar", clue: "Cidade onde nasceu o Messias prometido.", reference: "Miqueias 5:2", context: "O profeta anunciou que de uma pequena cidade viria o governante de Israel.", curiosity: "Belém também era conhecida como cidade de Davi.", difficulty: "medio", themes: ["lugares", "evangelhos"] },
  { id: "isaias", word: "ISAIAS", category: "Profeta", clue: "Anunciou o Servo sofredor e o nascimento do Emanuel.", reference: "Isaías 7:14", context: "Sua profecia apontou para o sinal do Emanuel, Deus conosco.", curiosity: "Seu livro contém a expressão ‘Santo, santo, santo’." , difficulty: "dificil", themes: ["profetas", "antigo"] },
  { id: "jeremias", word: "JEREMIAS", category: "Profeta", clue: "Profeta conhecido por anunciar uma nova aliança.", reference: "Jeremias 31:31", context: "Deus prometeu escrever sua lei no coração do seu povo.", curiosity: "Jeremias foi chamado ainda antes de nascer.", difficulty: "dificil", themes: ["profetas", "antigo"] },
  { id: "ezequiel", word: "EZEQUIEL", category: "Profeta", clue: "Viu ossos secos voltarem a viver em uma visão.", reference: "Ezequiel 37:3", context: "A visão falava da restauração de um povo que parecia sem esperança.", curiosity: "O profeta serviu entre os exilados junto ao rio Quebar.", difficulty: "dificil", themes: ["profetas", "antigo"] },
  { id: "melquisedeque", word: "MELQUISEDEQUE", category: "Sacerdote", clue: "Rei de Salém que abençoou Abraão.", reference: "Gênesis 14:18", context: "Ele trouxe pão e vinho e abençoou o patriarca depois da batalha.", curiosity: "Hebreus usa sua figura para explicar um sacerdócio singular.", difficulty: "bereano", themes: ["antigo", "personagens"] },
  { id: "habacuque", word: "HABACUQUE", category: "Profeta", clue: "Aprendeu a se alegrar mesmo quando a colheita falhasse.", reference: "Habacuque 3:17-18", context: "O profeta terminou sua oração confiando em Deus apesar da crise.", curiosity: "Seu livro começa com perguntas honestas sobre a justiça divina.", difficulty: "bereano", themes: ["profetas", "antigo"] },
  { id: "filemom", word: "FILEMOM", category: "Pessoa", clue: "Cristão a quem Paulo escreveu sobre Onésimo.", reference: "Filemom 1:1", context: "A pequena carta pede que um irmão seja recebido com amor.", curiosity: "É uma das cartas mais curtas do Novo Testamento.", difficulty: "bereano", themes: ["cartas", "personagens"] },
  { id: "colossenses", word: "COLOSSENSES", category: "Carta", clue: "Carta que apresenta Cristo como cabeça da igreja.", reference: "Colossenses 1:18", context: "Paulo ensina sobre a supremacia de Cristo e a nova vida.", curiosity: "A carta foi enviada a uma igreja que Paulo aparentemente não visitou.", difficulty: "bereano", themes: ["cartas"] },
];

export const crosswordWordsFor = (difficulty: GameDifficulty, theme?: CrosswordTheme | "todos") => CROSSWORD_WORDS.filter((entry) => entry.difficulty === difficulty && (theme === "todos" || !theme || entry.themes.includes(theme)));
