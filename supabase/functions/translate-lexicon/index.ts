const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

// Traduz o "significado" e os sentidos do léxico (Brown-Driver-Briggs para
// hebraico, Thayer para grego, via bolls.life) de inglês para português.
// A fonte é acadêmica em inglês — aqui só traduzimos o texto exibido na
// interface, sem alterar nem resumir o conteúdo. Chamado por
// translateStrongEntry em src/lib/bible-source.ts, que cacheia o
// resultado para sempre por número de Strong (cada palavra só passa por
// aqui uma vez).
const SYSTEM_PROMPT = `Você traduz verbetes de léxico bíblico acadêmico (Brown-Driver-Briggs para hebraico, Thayer para grego) do inglês para português do Brasil. Regras:
- Tradução literal e precisa do sentido, sem paráfrase, sem resumir, sem adicionar informação.
- Preserve números de Strong (ex. G1510, H3068), nomes próprios bíblicos e transliterações exatamente como estão.
- Se um campo vier vazio ou nulo, devolva-o vazio ou nulo do mesmo jeito.
- Responda APENAS com um JSON válido no formato exato recebido (mesmas chaves), sem markdown, sem texto fora do JSON.`;

type RequestBody = {
  meaning?: string | null;
  definitions?: string[];
  strongsGloss?: string | null;
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
    };
    if (!payload.meaning && payload.definitions.length === 0 && !payload.strongsGloss) {
      return Response.json(payload, { headers: corsHeaders });
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
          return Response.json(
            {
              meaning: typeof parsed.meaning === "string" ? parsed.meaning : payload.meaning,
              definitions: Array.isArray(parsed.definitions) ? parsed.definitions : payload.definitions,
              strongsGloss: typeof parsed.strongsGloss === "string" ? parsed.strongsGloss : payload.strongsGloss,
            },
            { headers: corsHeaders },
          );
        } catch {
          return Response.json(payload, { headers: corsHeaders });
        }
      }
      lastError = `${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`;
    }

    console.error("translate-lexicon:", lastError);
    return Response.json(payload, { headers: corsHeaders });
  } catch (e) {
    console.error("translate-lexicon:", e instanceof Error ? e.message : e);
    return Response.json({ meaning: null, definitions: [], strongsGloss: null }, { headers: corsHeaders });
  }
});
