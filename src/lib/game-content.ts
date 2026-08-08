const VARIATION_SUFFIX = /-var-\d+$/i;
const QUESTION_TYPE_SUFFIX = /-(multiple|true-false|complete|reference)$/i;

export function normalizeGameContentKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function canonicalGameContentKey(value: string) {
  return normalizeGameContentKey(
    value
      .trim()
      .replace(VARIATION_SUFFIX, "")
      .replace(QUESTION_TYPE_SUFFIX, ""),
  );
}

export function uniqueGameContent<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = canonicalGameContentKey(getKey(item));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
/**
 * Removes only exact duplicate variants while preserving generated
 * variation and question-type suffixes.
 */
export function uniqueGameVariantContent<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = normalizeGameContentKey(getKey(item));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


/**
 * Selects game cards without repeating the same semantic family during the
 * browser session. Generated variants are only used after every family in
 * the current pool has already appeared, keeping long matches playable.
 */
export function selectFreshGameVariants<T>({
  gameKey,
  items,
  amount,
  getKey,
  getFamilyKey = getKey,
}: {
  gameKey: string;
  items: T[];
  amount: number;
  getKey: (item: T) => string;
  getFamilyKey?: (item: T) => string;
}) {
  if (amount <= 0 || items.length === 0) return [] as T[];

  const variants = uniqueGameVariantContent(items, getKey);
  const storageKey = `disciple.game-session.${normalizeGameContentKey(gameKey)}`;
  let history: { variants: string[]; families: string[] } = { variants: [], families: [] };

  if (typeof window !== "undefined") {
    try {
      const parsed = JSON.parse(window.sessionStorage.getItem(storageKey) ?? "{}") as Partial<typeof history>;
      history = {
        variants: Array.isArray(parsed.variants) ? parsed.variants.filter((value): value is string => typeof value === "string") : [],
        families: Array.isArray(parsed.families) ? parsed.families.filter((value): value is string => typeof value === "string") : [],
      };
    } catch {
      history = { variants: [], families: [] };
    }
  }

  const usedVariants = new Set(history.variants);
  const usedFamilies = new Set(history.families);
  const selected: T[] = [];
  const selectedVariants = new Set<string>();

  const addAvailable = (pool: T[], allowUsedFamilies: boolean) => {
    for (const item of pool) {
      if (selected.length >= amount) break;
      const variantKey = normalizeGameContentKey(getKey(item));
      const familyKey = canonicalGameContentKey(getFamilyKey(item));
      if (!variantKey || selectedVariants.has(variantKey) || usedVariants.has(variantKey)) continue;
      if (!allowUsedFamilies && usedFamilies.has(familyKey)) continue;
      selected.push(item);
      selectedVariants.add(variantKey);
    }
  };

  addAvailable(variants, false);
  addAvailable(variants, true);

  // If the pool is smaller than the requested match, start a new cycle,
  // without ever duplicating a card inside the current match.
  if (selected.length < amount) {
    for (const item of variants) {
      if (selected.length >= amount) break;
      const variantKey = normalizeGameContentKey(getKey(item));
      if (!variantKey || selectedVariants.has(variantKey)) continue;
      selected.push(item);
      selectedVariants.add(variantKey);
    }
  }

  if (typeof window !== "undefined" && selected.length > 0) {
    try {
      const nextHistory = {
        variants: [...new Set([...history.variants, ...selected.map((item) => normalizeGameContentKey(getKey(item)))])].slice(-4096),
        families: [...new Set([...history.families, ...selected.map((item) => canonicalGameContentKey(getFamilyKey(item)))])].slice(-2048),
      };
      window.sessionStorage.setItem(storageKey, JSON.stringify(nextHistory));
    } catch {
      // Private browsing can disable sessionStorage; gameplay continues.
    }
  }

  return selected;
}
