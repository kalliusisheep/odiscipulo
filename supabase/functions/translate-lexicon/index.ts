const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const SYSTEM_PROMPT = [
  "Você é um tradutor técnico de léxico bíblico.",
  "Trabalhe somente com os dados fornecidos dos verbetes Brown-Driver-Briggs (hebraico) e Thayer (grego).",
  "Responda sempre em português do Brasil.",
  "Traduza meaning, definitions e strongsGloss com fidelidade literal, sem inventar, resumir ou acrescentar comentário.",
  "Mantenha definitions como uma lista de sentidos ou glosas que estejam presentes na fonte.",
  "Quando contextual.reference, contextual.verseText e contextual.word estiverem presentes, produza contextualMeaning com UM ÚNICO sentido que se encaixe naquela ocorrência.",
  "contextualMeaning deve ter de 1 a 8 palavras, sem lista de possibilidades, ponto e vírgula ou explicação teológica.",
  "Para אֵת/H853, escreva exatamente: marca o objeto direto.",
  "Quando houver contexto suficiente, escolha o melhor sentido contextual disponível e não retorne null.",
  "contextualMeaning deve ser uma palavra ou expressão que apareça no versículo em português (ou uma forma flexionada claramente correspondente). Nunca retorne apenas “não”, “nao”, “sim”, uma classe gramatical ou um sentido que não esteja ancorado no texto.",

  "Preserve códigos Strong, nomes próprios e transliterações.",
  "Responda APENAS com JSON válido no mesmo formato do objeto recebido.",
].join("\n");

type ContextualPayload = {
  reference?: string;
  verseText?: string | null;
  word?: string | null;
  strong?: string | null;
  originalWords?: { word: string; strong: string | null }[];
  wordIndex?: number | null;
};

type RequestBody = {
  meaning?: unknown;
  definitions?: unknown;
  strongsGloss?: unknown;
  contextual?: unknown;
};

type LexiconPayload = {
  meaning: string | null;
  definitions: string[];
  strongsGloss: string | null;
  contextual: ContextualPayload | null;
};

const CONTEXTUAL_FALLBACKS: Record<string, string> = {
  H5921: "sobre",
  H8414: "sem forma",
  H8415: "sem forma",
  H7307: "Espírito",
  H7363: "pairava",
  H430: "Deus",
  H2822: "trevas",
  H6440: "face",
  H4325: "águas",
  H8064: "os céus",
  H776: "a terra",
  H1961: "era",
  H1254: "criou",
  H7225: "No princípio",
  H7121: "chamou",
  H853: "marca o objeto direto",
  G2532: "e",
  G3588: "o",
  G2316: "Deus",
  G2962: "Senhor",
  G2424: "Jesus",
  G5547: "Cristo",
  G4151: "Espírito",
  G3056: "Palavra",
  G26: "amor",
  G5485: "graça",
  G4102: "fé",
  G4991: "salvação",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function textValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function normalizePayload(body: unknown): LexiconPayload {
  const input = (body ?? {}) as RequestBody;
  const contextual =
    input.contextual && typeof input.contextual === "object"
      ? (input.contextual as ContextualPayload)
      : null;

  return {
    meaning: textValue(input.meaning),
    definitions: stringList(input.definitions),
    strongsGloss: textValue(input.strongsGloss),
    contextual,
  };
}

function normalizeContextMatchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^\\p{L}\\p{N}\\s]/gu, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function contextualMeaningMatchesVerse(
  value: string,
  verseText: string | null | undefined,
): boolean {
  if (!verseText) return true;
  const meaning = normalizeContextMatchText(value);
  const verse = normalizeContextMatchText(verseText);
  if (meaning.length < 2 || verse.length === 0) return false;
  if (verse.includes(meaning)) return true;
  const words = meaning.split(" ").filter((word) => word.length >= 3);
  return words.length > 0 && words.every((word) => verse.includes(word));
}

function contextualCandidate(
  payload: LexiconPayload,
  candidate: unknown,
): string | null {
  const value = textValue(candidate);
  if (
    value &&
    !/^(?:nao|não|sim)$/i.test(value) &&
    !/indisponível|indisponivel|tradução isolada|traducao isolada/i.test(value) &&
    contextualMeaningMatchesVerse(value, payload.contextual?.verseText)
  ) {
    return value;
  }
  return fallbackContextualMeaning(payload);
}

function fallbackContextualMeaning(payload: LexiconPayload): string | null {
  const verseText = payload.contextual?.verseText ?? null;
  const strong = payload.contextual?.strong?.toUpperCase() ?? null;
  const known = strong ? CONTEXTUAL_FALLBACKS[strong] : null;

  if (known && (strong === "H853" || contextualMeaningMatchesVerse(known, verseText))) {
    return known;
  }

  const candidates = [
    payload.meaning,
    payload.strongsGloss,
    ...payload.definitions,
  ];

  for (const candidate of candidates) {
    const first = candidate.split(/\s*;\s*/)[0]?.trim() ?? "";
    if (!first) continue;
    const short = (first.split(/\s+[—–-]\s+/)[0] ?? first)
      .split(/[,;:]/)[0]
      ?.trim();
    if (
      short &&
      !/\b(?:the|and|from|used|denotes|proper noun|primitive root)\b/i.test(short) &&
      !/indisponível|indisponivel|tradução isolada|traducao isolada/i.test(short) &&
      !/^(?:nao|não|sim)$/i.test(short) &&
      contextualMeaningMatchesVerse(short, verseText)
    ) {
      return short;
    }
  }

  return payload.contextual ? "sentido contextual não disponível" : null;
}

function parseJson(text: string): Record<string, unknown> {
  const fence = String.fromCharCode(96).repeat(3);
  let candidate = text.trim();

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

  return JSON.parse(candidate) as Record<string, unknown>;
}

function fallbackPayload(payload: LexiconPayload): Record<string, unknown> {
  return {
    ...payload,
    contextualMeaning: fallbackContextualMeaning(payload),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido" }, 405);
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
    if (!apiKey) {
      return jsonResponse({ error: "GEMINI_API_KEY ausente" }, 500);
    }

    const body = await req.json().catch(() => null);
    const payload = normalizePayload(body);

    if (
      !payload.meaning &&
      payload.definitions.length === 0 &&
      !payload.strongsGloss &&
      !payload.contextual
    ) {
      return jsonResponse(fallbackPayload(payload));
    }

    const configuredModel = Deno.env.get("GEMINI_MODEL")?.trim();
    const models = [
      configuredModel,
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
    ].filter((model, index, list): model is string => Boolean(model) && list.indexOf(model) === index);

    let lastError = "sem resposta";

    for (const model of models) {
      try {
        const response = await fetch(GATEWAY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiKey,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: JSON.stringify(payload) },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
          }),
        });

        if (!response.ok) {
          lastError = response.status + ": " + (await response.text().catch(() => "")).slice(0, 300);
          console.error("translate-lexicon: modelo " + model + " falhou —", lastError);
          continue;
        }

        const data = await response.json();
        const raw = data?.choices?.[0]?.message?.content;
        if (typeof raw !== "string" || !raw.trim()) {
          lastError = "A API retornou uma resposta vazia.";
          continue;
        }

        try {
          const parsed = parseJson(raw);
          const contextualMeaning = contextualCandidate(payload, parsed.contextualMeaning);

          return jsonResponse({
            meaning: typeof parsed.meaning === "string" ? parsed.meaning.trim() : payload.meaning,
            definitions: stringList(parsed.definitions),
            strongsGloss:
              typeof parsed.strongsGloss === "string"
                ? parsed.strongsGloss.trim()
                : payload.strongsGloss,
            contextualMeaning,
          });
        } catch (error) {
          lastError = error instanceof Error ? error.message : String(error);
          console.error("translate-lexicon: JSON inválido —", lastError);
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        console.error("translate-lexicon: falha de rede —", lastError);
      }
    }

    console.error("translate-lexicon: todos os modelos falharam —", lastError);
    return jsonResponse(fallbackPayload(payload));
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.error("translate-lexicon: erro inesperado —", details);
    return jsonResponse({
      meaning: null,
      definitions: [],
      strongsGloss: null,
      contextualMeaning: null,
    }, 500);
  }
});