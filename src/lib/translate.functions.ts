import { createServerFn } from "@tanstack/react-start";

type TranslateInput = { language: "en" | "es"; texts: string[] };

function parseInput(data: unknown): TranslateInput {
  const value = data as Partial<TranslateInput> | undefined;
  const language = value?.language === "es" ? "es" : "en";
  const texts = Array.isArray(value?.texts)
    ? value!.texts.filter((t): t is string => typeof t === "string" && t.trim().length > 0).slice(0, 60)
    : [];
  return { language, texts };
}

/**
 * Tradutor gratuito (endpoint público do Google Tradutor). Não consome
 * créditos e cobre qualquer texto da interface. Usado como caminho principal.
 */
async function translateWithFreeService(text: string, language: "en" | "es"): Promise<string | null> {
  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt-BR&dt=t&tl=" +
      language +
      "&q=" +
      encodeURIComponent(text);
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) return null;
    const json = (await response.json()) as unknown;
    const segments = Array.isArray(json) && Array.isArray(json[0]) ? (json[0] as unknown[]) : null;
    if (!segments) return null;
    const out = segments
      .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
      .join("");
    const trimmed = out.trim();
    return trimmed.length > 0 ? trimmed : null;
  } catch {
    return null;
  }
}

async function translateAllFree(texts: string[], language: "en" | "es"): Promise<(string | null)[]> {
  const results: (string | null)[] = new Array(texts.length).fill(null);
  const CONCURRENCY = 8;
  let cursor = 0;
  const workers = Array.from({ length: Math.min(CONCURRENCY, texts.length) }, async () => {
    while (cursor < texts.length) {
      const index = cursor++;
      results[index] = await translateWithFreeService(texts[index]!, language);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Tradução automática de qualquer texto da interface que não esteja no
 * dicionário estático. Usada pelo runtime de tradução para cobrir 100% do
 * conteúdo (lições, módulos, estudos etc.). O resultado é cacheado no cliente.
 */
export const translateTexts = createServerFn({ method: "POST" })
  .inputValidator(parseInput)
  .handler(async ({ data }): Promise<{ translations: string[] }> => {
    if (data.texts.length === 0) return { translations: [] };

    const free = await translateAllFree(data.texts, data.language);
    const missing = data.texts.filter((_, index) => free[index] === null);
    if (missing.length === 0) {
      return { translations: data.texts.map((text, index) => free[index] ?? text) };
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { translations: data.texts.map((text, index) => free[index] ?? text) };


    const targetName = data.language === "es" ? "Spanish (Spain/Latin America neutral)" : "English (US)";
    const missingIndexes = data.texts.map((_, index) => index).filter((index) => free[index] === null);
    const payload = missingIndexes.map((index) => ({ id: index, text: data.texts[index]! }));
    const fallback = () => ({ translations: data.texts.map((text, index) => free[index] ?? text) });

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          temperature: 0,
          messages: [
            {
              role: "system",
              content:
                `You are a professional translator for a Christian discipleship app. Translate each item from Brazilian Portuguese to ${targetName}. ` +
                "Keep the same tone, keep Bible book names in the target language's conventional form, keep numbers, emojis, punctuation and placeholders unchanged. " +
                "Never add explanations. Respond ONLY with a JSON array like [{\"id\":0,\"text\":\"...\"}] with exactly one entry per input id.",
            },
            { role: "user", content: JSON.stringify(payload) },
          ],
        }),
      });

      if (!response.ok) return fallback();
      const json = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content ?? "";
      const match = content.match(/\[[\s\S]*\]/);
      if (!match) return fallback();
      const parsed = JSON.parse(match[0]) as { id?: number; text?: string }[];
      const byId = new Map<number, string>();
      parsed.forEach((item, position) => {
        const id = typeof item.id === "number" ? item.id : (missingIndexes[position] ?? position);
        if (typeof item.text === "string") byId.set(id, item.text);
      });
      return { translations: data.texts.map((text, index) => free[index] ?? byId.get(index) ?? text) };
    } catch {
      return fallback();

    }
  });
