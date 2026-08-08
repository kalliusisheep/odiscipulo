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
- Se não houver dados contextuais suficientes, contextualMeaning deve ser null.
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
      return Response.json({ ...payload, contextualMeaning: null }, { headers: corsHeaders });
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
          const contextualMeaning = typeof parsed.contextualMeaning === "string"
            ? parsed.contextualMeaning.trim()
            : null;
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
          return Response.json({ ...payload, contextualMeaning: null }, { headers: corsHeaders });
        }
      }
      lastError = `${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`;
    }

    console.error("translate-lexicon:", lastError);
    return Response.json({ ...payload, contextualMeaning: null }, { headers: corsHeaders });
  } catch (e) {
    console.error("translate-lexicon:", e instanceof Error ? e.message : e);
    return Response.json({ meaning: null, definitions: [], strongsGloss: null, contextualMeaning: null }, { headers: corsHeaders });
  }
});