// Sistema de níveis: 1 nível a cada 3 dias de ofensiva (streak), até 50.
// Cada nível tem um título e um avatar ilustrado.

const avatarModules = import.meta.glob("../assets/levels/level-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function avatarFor(level: number): string | undefined {
  const n = String(level).padStart(2, "0");
  return avatarModules[`../assets/levels/level-${n}.jpg`];
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
  "Crente Ruim",
  "Estátua de Sal",
  "Tomé Duvidoso",
  "Ouvinte do Canto do Galo",
  "Crente Assintomático",
  "Jovem Rico Apegado",
  "Ovelha Desgarrada",
  "Crente de Domingo",
  "Novo Convertido",
  "Batedor de Palma Sem Ritmo",
  "Cantor Gospel de Chuveiro",
  "Publicano do Fundo",
  "Comedor de Pão da Ceia",
  "Levita do Triângulo",
  "Organizador de Cadeiras",
  "Vaso de Barro Trincado",
  "Jejuador de Meio-Dia",
  "Varão em Observação",
  "Sapato de Fogo",
  "Dizimista Fiel",
  "Ovelha do Mês",
  "Pedrada no Inferno",
  "Cachoeira de Unção",
  "Missionário de Bairro",
  "Guerreiro de Vigília",
  "Profeta de Rede Social",
  "Matador de Demônios",
  "Crente do Manto",
  "Inimigo do Diabo",
  "Ungido no Azeite Quente",
  "Falador de Mistérios",
  "Derrubador de Muralhas",
  "Multiplicador de Peixes",
  "Quebrador de Maldição",
  "Expulsador de Legião",
  "Vaso de Ouro Maciço",
  "Profeta",
  "Suplente de Elias",
  "Terror dos Fariseus",
  "Nazireu Maromba",
  "Surfista da Galileia",
  "Invocador de Fogo",
  "Pesadelo do Inferno",
  "Piloto de Carruagem de Fogo",
  "Arrebatado Intacto",
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

/** Streak necessário para o próximo nível (ou null se já é nível máximo). */
export function streakToNextLevel(streak: number): number | null {
  const current = getLevel(streak);
  if (current.level >= MAX_LEVEL) return null;
  const next = LEVELS[current.level]; // level index === current.level
  return next.minStreak - streak;
}
