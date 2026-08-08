const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type WordInput = {
  word: string;
  strong: string | null;
  partOfSpeech: string | null;
  meaning: string | null;
};

type AnalysisResult = {
  verbos: string[];
  substantivos: string[];
  resumo: string;
};

const SYSTEM_PROMPT = [
  "Você é um assistente de estudo bíblico.",
  "Receberá uma lista de palavras de um versículo no idioma original (hebraico ou grego), cada uma com seu número de Strong, classe gramatical quando disponível e significado.",
  "Responda SOMENTE com um JSON válido, sem markdown, neste formato:",
  "{",
  '  "verbos": ["lista de palavras no original identificadas como verbo"],',
  '  "substantivos": ["lista de palavras no original identificadas como substantivo"],',
  '  "resumo": "1-2 frases em português explicando a estrutura gramatical do versículo"',
  "}",
  "Baseie-se apenas nas informações fornecidas. Se a classe gramatical não vier explícita, use seu conhecimento do idioma para classificá-la a partir da palavra e do Strong.",
].join("\n");

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function sanitizeWords(body: unknown): WordInput[] {
  if (!body || typeof body !== "object") return [];

  const rawWords = (body as { words?: unknown }).words;
  if (!Array.isArray(rawWords)) return [];

  return rawWords.slice(0, 80).reduce<WordInput[]>((result, item) => {
    if (!item || typeof item !== "object") return result;

    const record = item as Record<string, unknown>;
    const word = optionalText(record.word);
    if (!word) return result;

    result.push({
      word,
      strong: optionalText(record.strong),
      partOfSpeech: optionalText(record.partOfSpeech),
      meaning: optionalText(record.meaning),
    });
    return result;
  }, []);
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function parseAnalysisResponse(rawText: string): AnalysisResult {
  let candidate = rawText.trim();
  const fence = String.fromCharCode(96).repeat(3);

  if (candidate.startsWith(fence)) {
    candidate = candidate.slice(fence.length).replace(/^json\s*/i, "").trim();
    if (candidate.endsWith(fence)) {
      candidate = candidate.slice(0, -fence.length).trim();
    }
  }

  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    candidate = candidate.slice(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(candidate) as Record<string, unknown>;
  const resumo =
    typeof parsed.resumo === "string" && parsed.resumo.trim().length > 0
      ? parsed.resumo.trim()
      : "A análise estrutural deste versículo não está disponível no momento.";

  return {
    verbos: stringList(parsed.verbos),
    substantivos: stringList(parsed.substantivos),
    resumo,
  };
}

function fallbackAnalysis(words: WordInput[]): AnalysisResult {
  const verbos = words
    .filter((word) => /\b(?:verbo|verb|ação|acção|fazer|criar|ser|estar|dizer|vir|ir)\b/i.test(word.partOfSpeech ?? ""))
    .map((word) => word.word)
    .slice(0, 12);

  const substantivos = words
    .filter((word) => /\b(?:substantivo|noun|nome)\b/i.test(word.partOfSpeech ?? ""))
    .map((word) => word.word)
    .slice(0, 12);

  return {
    verbos,
    substantivos,
    resumo:
      "A análise automática detalhada está temporariamente indisponível. As palavras e classificações disponíveis continuam preservadas para estudo.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido" }, 405);
  }

  let words: WordInput[] = [];

  try {
    const body = await req.json().catch(() => null);
    words = sanitizeWords(body);

    if (words.length === 0) {
      return jsonResponse(
        { error: "Envie ao menos uma palavra válida no campo words." },
        400,
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
    if (!apiKey) {
      return jsonResponse(fallbackAnalysis(words));
    }

    const configuredModel = Deno.env.get("GEMINI_MODEL")?.trim();
    const models = [
      configuredModel,
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ].filter((model, index, list): model is string => Boolean(model) && list.indexOf(model) === index);

    const userContent = words
      .map(
        (word, index) =>
          `${index + 1}. Palavra: ${word.word} | Strong: ${word.strong ?? "—"} | Classe: ${word.partOfSpeech ?? "desconhecida"} | Significado: ${word.meaning ?? "—"}`,
      )
      .join("\n");

    let lastError = "sem resposta";
    let responseText: string | null = null;

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${SYSTEM_PROMPT}\n\nPalavras do versículo:\n${userContent}` }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 512,
                responseMimeType: "application/json",
              },
            }),
          },
        );

        if (!response.ok) {
          const details = (await response.text().catch(() => "")).slice(0, 300);
          lastError = `${response.status}: ${details || "resposta sem detalhes"}`;
          console.error(`verse-analysis: modelo ${model} falhou —`, lastError);
          continue;
        }

        const data = await response.json();
        responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
        if (responseText) break;

        lastError = "A API retornou uma resposta sem texto.";
        console.error(`verse-analysis: modelo ${model} retornou texto vazio`);
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        console.error(`verse-analysis: falha de rede no modelo ${model} —`, lastError);
      }
    }

    if (!responseText) {
      console.error("verse-analysis: usando fallback local —", lastError);
      return jsonResponse(fallbackAnalysis(words));
    }

    try {
      return jsonResponse(parseAnalysisResponse(responseText));
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      console.error("verse-analysis: JSON inválido retornado pelo Gemini —", details);
      console.error("verse-analysis: usando fallback após resposta inválida —", details);
      return jsonResponse(fallbackAnalysis(words));
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error("verse-analysis: erro inesperado —", details);

    if (words.length > 0) {
      return jsonResponse(fallbackAnalysis(words));
    }

    return jsonResponse(
      { error: "Envie ao menos uma palavra válida no campo words." },
      400,
    );
  }
});