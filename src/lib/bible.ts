// Utilitário para buscar passagens bíblicas em português (tradução Almeida)
// via bible-api.com. Cache simples em memória + localStorage.

const MEM: Record<string, string> = {};

export async function fetchPassage(ref: string): Promise<string> {
  const key = `bible:almeida:${ref}`;
  if (MEM[key]) return MEM[key];
  if (typeof window !== "undefined") {
    const cached = window.localStorage.getItem(key);
    if (cached) {
      MEM[key] = cached;
      return cached;
    }
  }
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=almeida`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao buscar ${ref}`);
  const json = (await res.json()) as { text?: string; verses?: { verse: number; text: string }[] };
  const text =
    json.verses?.map((v) => `${v.verse} ${v.text.trim()}`).join(" ") ??
    (json.text ?? "").trim();
  MEM[key] = text;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, text);
    } catch {
      /* quota */
    }
  }
  return text;
}
