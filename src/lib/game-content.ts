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
