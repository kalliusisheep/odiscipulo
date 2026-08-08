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
 * Tradução automática de qualquer texto da interface que não esteja no
 * dicionário estático. Usada pelo runtime de tradução para cobrir 100% do
 * conteúdo (lições, módulos, estudos etc.). O resultado é cacheado no cliente.
 */
export const translateTexts = createServerFn({ method: "POST" })
  .inputValidator(parseInput)
  .handler(async ({ data }): Promise<{ translations: string[] }> => {
    if (data.texts.length === 0) return { translations: [] };
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { translations: data.texts };

    const targetName = data.language === "es" ? "Spanish (Spain/Latin America neutral)" : "English (US)";
    const payload = data.texts.map((text, index) => ({ id: index, text }));

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

      if (!response.ok) return { translations: data.texts };
      const json = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content ?? "";
      const match = content.match(/\[[\s\S]*\]/);
      if (!match) return { translations: data.texts };
      const parsed = JSON.parse(match[0]) as { id?: number; text?: string }[];
      const byId = new Map<number, string>();
      parsed.forEach((item, position) => {
        const id = typeof item.id === "number" ? item.id : position;
        if (typeof item.text === "string") byId.set(id, item.text);
      });
      return { translations: data.texts.map((text, index) => byId.get(index) ?? text) };
    } catch {
      return { translations: data.texts };
    }
  });
