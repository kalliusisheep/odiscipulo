// Sistema de níveis: 1 nível a cada 3 dias de ofensiva (streak), até 50.

const avatarModules = import.meta.glob("../assets/levels/level-*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function avatarFor(level: number): string | undefined {
  const n = String(level).padStart(2, "0");
  return avatarModules[`../assets/levels/level-${n}.png`];
}

export type LevelEntry = {
  level: number;
  title: string;
  minStreak: number;
  avatar?: string;
};

const TITLES = [
  "Incrédulo",
  "Filho Pródigo",
  "Fugitivo de Nínive",
  "Fariseu",
  "Estátua de Sal",
  "Tomé Duvidoso",
  "Crente Assintomático",
  "Crente Ruim",
  "Jovem Rico Apegado",
  "Ovelha Desgarrada",
  "Crente de Domingo",
  "Desviado",
  "Crente Morno",
  "Cantor Gospel de Chuveiro",
  "Pé no Mundo",
  "Comedor de Pão da Ceia",
  "Levita do Triângulo",
  "Organizador de Cadeiras",
  "Vaso de Barro Trincado",
  "Jejuador de Meio-Dia",
  "Varão em Observação",
  "Sapatinho de Faísca",
  "Dizimista Fiel",
  "Sobrevivente de Retiro",
  "Terreno de Passar Anjos",
  "Vaso no Oleiro",
  "Missionário de Bairro",
  "Guerreiro de Vigília",
  "Profeta de Rede Social",
  "Terreno de Passar Anjo",
  "Crente do Manto",
  "Sapateado de Fogo",
  "Ungido no Azeite Quente",
  "Falador de Mistérios",
  "Piloto de Carruagem de Fogo",
  "Derrubador de Muralhas",
  "Inimigo de Satan",
  "Quebrador de Maldição",
  "Exorcista",
  "Pedrada no Inferno",
  "Passeador na Fornalha",
  "Aniquilador de Heresias",
  "Nazireu",
  "Inimigo dos Filisteus",
  "Matador de Demônios",
  "Pesadelo de Satanás",
  "Suplente de Elias",
  "Profeta das Nações",
  "Melquisedeque",
  "Discípulo",
];

export const LEVELS: LevelEntry[] = TITLES.map((title, i) => ({
  level: i + 1,
  title,
  minStreak: i * 3,
  avatar: avatarFor(i + 1),
}));

export const MAX_LEVEL = LEVELS.length;

/** Nível atual dado o streak (ofensiva) em dias. Sobe 1 nível a cada 3 dias. */
export function getLevel(streak: number): LevelEntry {
  const idx = Math.min(MAX_LEVEL - 1, Math.max(0, Math.floor(streak / 3)));
  return LEVELS[idx];
}

/** Retorna o próximo nível ou null se já é máximo. */
export function getNextLevel(streak: number): LevelEntry | null {
  const current = getLevel(streak);
  if (current.level >= MAX_LEVEL) return null;
  return LEVELS[current.level];
}

/** Streak necessário para o próximo nível (ou null se já é nível máximo). */
export function streakToNextLevel(streak: number): number | null {
  const next = getNextLevel(streak);
  if (!next) return null;
  return next.minStreak - streak;
}
