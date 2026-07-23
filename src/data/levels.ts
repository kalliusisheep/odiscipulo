// Sistema de níveis baseado em XP.
// Curva: para atingir o nível N (N ≥ 2) o usuário precisa acumular
// pelo menos 50 × (N-1)² de XP. Nível 1 é o inicial (0 XP).
// Nível 50 ("Discípulo") exige, além da curva de XP, 100% do conteúdo concluído.

import { trails } from "./content";
import { readingPlans, bibleStudies, aiMeditations } from "./estudos";

const avatarModules = import.meta.glob("../assets/levels/level-*.{png,jpg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function avatarFor(level: number): string | undefined {
  const n = String(level).padStart(2, "0");
  return (
    avatarModules[`../assets/levels/level-${n}.png`] ??
    avatarModules[`../assets/levels/level-${n}.jpg`]
  );
}

export type LevelEntry = {
  level: number;
  title: string;
  minXp: number;
  avatar?: string;
};

const TITLES = [
  "Incrédulo","Filho Pródigo","Fugitivo de Nínive","Fariseu","Estátua de Sal",
  "Tomé Duvidoso","Crente Assintomático","Crente Ruim","Jovem Rico Apegado","Ovelha Desgarrada",
  "Crente de Domingo","Desviado","Crente Morno","Cantor Gospel de Chuveiro","Pé no Mundo",
  "Comedor de Pão da Ceia","Levita do Triângulo","Organizador de Cadeiras","Vaso de Barro Trincado","Jejuador de Meio-Dia",
  "Varão em Observação","Sapatinho de Faísca","Dizimista Fiel","Sobrevivente de Retiro","Terreno de Passar Anjos",
  "Vaso no Oleiro","Missionário de Bairro","Guerreiro de Vigília","Profeta de Rede Social","Evangelista Flamejante",
  "Crente do Manto","Sapateado de Fogo","Ungido no Azeite Quente","Falador de Mistérios","Piloto de Carruagem de Fogo",
  "Derrubador de Muralhas","Inimigo de Satan","Quebrador de Maldição","Exorcista","Pedrada no Inferno",
  "Passeador na Fornalha","Aniquilador de Heresias","Nazireu","Inimigo dos Filisteus","Matador de Demônios",
  "Pesadelo de Satanás","Suplente de Elias","Profeta das Nações","Melquisedeque","Discípulo",
];

/** XP acumulado necessário para atingir o nível N (N ≥ 1). */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * (level - 1) ** 2;
}

export const LEVELS: LevelEntry[] = TITLES.map((title, i) => ({
  level: i + 1,
  title,
  minXp: xpForLevel(i + 1),
  avatar: avatarFor(i + 1),
}));

export const MAX_LEVEL = LEVELS.length;
export const GATED_LEVEL = 50;

// ── Totais de conteúdo (para a trava do nível 50) ────────────────────────
export const TRAIL_LESSON_IDS: string[] = trails.flatMap((t) =>
  t.modules.flatMap((m) => m.lessons.map((l) => l.id)),
);
export const BIBLE_STUDY_IDS: string[] = bibleStudies.map((s) => `bible:${s.id}`);
export const MEDITATION_PROGRESS_IDS: string[] = aiMeditations.map((m) => `med:${m.id}`);
export const PLAN_DAY_PROGRESS_IDS: string[] = readingPlans.flatMap((p) =>
  Array.from({ length: p.totalDays }, (_, i) => `plan:${p.id}:${i + 1}`),
);

export type Level50Status = {
  unlocked: boolean;
  xpOk: boolean;
  xpNeeded: number;
  missing: {
    trails: number;
    bibleStudies: number;
    meditations: number;
    planDays: number;
  };
  totals: {
    trails: number;
    bibleStudies: number;
    meditations: number;
    planDays: number;
  };
};

export function checkLevel50Status(xp: number, progressIds: Set<string>): Level50Status {
  const missingCount = (ids: string[]) => ids.reduce((n, id) => n + (progressIds.has(id) ? 0 : 1), 0);
  const missing = {
    trails: missingCount(TRAIL_LESSON_IDS),
    bibleStudies: missingCount(BIBLE_STUDY_IDS),
    meditations: missingCount(MEDITATION_PROGRESS_IDS),
    planDays: missingCount(PLAN_DAY_PROGRESS_IDS),
  };
  const totals = {
    trails: TRAIL_LESSON_IDS.length,
    bibleStudies: BIBLE_STUDY_IDS.length,
    meditations: MEDITATION_PROGRESS_IDS.length,
    planDays: PLAN_DAY_PROGRESS_IDS.length,
  };
  const xpNeeded = xpForLevel(GATED_LEVEL);
  const xpOk = xp >= xpNeeded;
  const contentOk =
    missing.trails === 0 &&
    missing.bibleStudies === 0 &&
    missing.meditations === 0 &&
    missing.planDays === 0;
  return { unlocked: xpOk && contentOk, xpOk, xpNeeded, missing, totals };
}

/**
 * Nível atual dado o XP acumulado.
 * O nível 50 só é atingido quando `level50Unlocked` é verdadeiro; caso contrário,
 * o teto natural é o nível 49 mesmo com XP suficiente.
 */
export function getLevel(xp: number, opts?: { level50Unlocked?: boolean }): LevelEntry {
  const cap = opts?.level50Unlocked ? MAX_LEVEL : GATED_LEVEL - 1;
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (LEVELS[i].level > cap) break;
    if (xp >= LEVELS[i].minXp) idx = i;
    else break;
  }
  return LEVELS[idx];
}

/** Próximo nível ou null se já é máximo permitido. */
export function getNextLevel(xp: number, opts?: { level50Unlocked?: boolean }): LevelEntry | null {
  const current = getLevel(xp, opts);
  const cap = opts?.level50Unlocked ? MAX_LEVEL : GATED_LEVEL - 1;
  if (current.level >= cap) return null;
  return LEVELS[current.level]; // próximo por índice
}

/** XP restante para o próximo nível (ou null se máximo). */
export function xpToNextLevel(xp: number, opts?: { level50Unlocked?: boolean }): number | null {
  const next = getNextLevel(xp, opts);
  if (!next) return null;
  return Math.max(0, next.minXp - xp);
}

/** Progresso percentual dentro do nível atual (0-100). */
export function levelProgressPct(xp: number, opts?: { level50Unlocked?: boolean }): number {
  const current = getLevel(xp, opts);
  const next = getNextLevel(xp, opts);
  if (!next) return 100;
  const span = next.minXp - current.minXp;
  if (span <= 0) return 100;
  return Math.min(100, Math.max(0, ((xp - current.minXp) / span) * 100));
}
