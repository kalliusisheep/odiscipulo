const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

// Traduz os dados do léxico e, quando recebe uma referência concreta,
// escolhe somente o sentido contextual daquela ocorrência bíblica.
const SYSTEM_PROMPT = `Você é um tradutor técnico de léxico bíblico.
Trabalhe com verbetes Brown-Driver-Briggs (hebraico) e Thayer (grego).
Responda sempre em português do Brasil.
Regras obrigatórias:
- Traduza meaning, definitions e strongsGloss com fidelidade literal, sem inventar, resumir ou acrescentar comentário.
- Quando contextual.reference, contextual.verseText e contextual.word estiverem presentes, produza contextualMeaning com UM ÚNICO sentido que se encaixe naquela ocorrência.
- contextualMeaning deve ter de 1 a 8 palavras, sem lista de possibilidades, sem ponto e vírgula e sem explicação teológica.
- Use a função gramatical contextual para partículas sem equivalente lexical. Para אֵת/H853, por exemplo, escreva: marcador do objeto direto (sem tradução isolada).
- Não escolha um significado apenas porque é o mais comum no dicionário; respeite o texto do versículo e a função da palavra.
- Quando houver referência, texto do versículo ou palavra original, escolha o melhor sentido contextual disponível e não retorne null; use null somente quando não existir nenhum dado lexical.
- Preserve códigos Strong, nomes próprios e transliterações.
- Responda APENAS com JSON válido, sem markdown, no formato exato recebido.`;

type ContextualPayload = {
  reference?: string;
  verseText?: string | null;
  word?: string | null;
  strong?: string | null;
  originalWords?: { word: string; strong: string | null }[];
};

type RequestBody = {
  meaning?: string | null;
  definitions?: string[];
  strongsGloss?: string | null;
  contextual?: ContextualPayload | null;
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
  H853: "marcador do objeto direto (sem tradução isolada)",
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

function fallbackContextualMeaning(payload: {
  meaning: string | null;
  definitions: string[];
  strongsGloss: string | null;
  contextual: ContextualPayload | null;
}): string | null {
  const strong = payload.contextual?.strong?.toUpperCase() ?? null;
  if (strong && CONTEXTUAL_FALLBACKS[strong]) return CONTEXTUAL_FALLBACKS[strong];

  const candidates = [
    payload.meaning,
    payload.strongsGloss,
    ...payload.definitions,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const first = candidate.split(/\s*;\s*/)[0]?.trim() ?? "";
    if (!first || /\b(?:the|and|from|used|denotes|proper noun|primitive root)\b/i.test(first)) continue;
    const short = (first.split(/\s+[—–-]\s+/)[0] ?? first)
      .split(/[,;:]/)[0]
      ?.trim();
    if (short) return short;
  }

  return payload.contextual ? "sentido determinado pelo contexto" : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return Response.json({ error: "GEMINI_API_KEY ausente" }, { status: 500, headers: corsHeaders });

    const body: RequestBody = await req.json();
    const payload = {
      meaning: body.meaning ?? null,
      definitions: body.definitions ?? [],
      strongsGloss: body.strongsGloss ?? null,
      contextual: body.contextual ?? null,
    };
    if (!payload.meaning && payload.definitions.length === 0 && !payload.strongsGloss && !payload.contextual) {
      return Response.json({ ...payload, contextualMeaning: fallbackContextualMeaning(payload) }, { headers: corsHeaders });
    }

    let lastError = "";
    for (const model of MODELS) {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(payload) },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = (data.choices?.[0]?.message?.content ?? "{}").replace(/```json|```/g, "").trim();
        try {
          const parsed = JSON.parse(raw);
          const contextualMeaning =
            typeof parsed.contextualMeaning === "string" && parsed.contextualMeaning.trim()
              ? parsed.contextualMeaning.trim()
              : fallbackContextualMeaning(payload);
          return Response.json(
            {
              meaning: typeof parsed.meaning === "string" ? parsed.meaning : payload.meaning,
              definitions: Array.isArray(parsed.definitions) ? parsed.definitions : payload.definitions,
              strongsGloss: typeof parsed.strongsGloss === "string" ? parsed.strongsGloss : payload.strongsGloss,
              contextualMeaning: contextualMeaning || null,
            },
            { headers: corsHeaders },
          );
        } catch {
          return Response.json({ ...payload, contextualMeaning: fallbackContextualMeaning(payload) }, { headers: corsHeaders });
        }
      }
      lastError = `${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`;
    }

    console.error("translate-lexicon:", lastError);
    return Response.json({ ...payload, contextualMeaning: null }, { headers: corsHeaders });
  } catch (e) {
    console.error("translate-lexicon:", e instanceof Error ? e.message : e);
    return Response.json({
      meaning: null,
      definitions: [],
      strongsGloss: null,
      contextualMeaning: fallbackContextualMeaning({
        meaning: null,
        definitions: [],
        strongsGloss: null,
        contextual: null,
      }),
    }, { headers: corsHeaders });
  }
});