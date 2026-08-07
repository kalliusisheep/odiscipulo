import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type WordInput = {
  word: string;
  strong: string | null;
  partOfSpeech: string | null;
  meaning: string | null;
};

const SYSTEM_PROMPT = `Você é um assistente de estudo bíblico. Receberá a lista de palavras
de um versículo no idioma original (hebraico ou grego), cada uma com seu número de Strong,
classe gramatical (quando disponível) e significado. Responda SOMENTE com um JSON válido,
sem markdown, no formato:
{
  "verbos": ["lista de palavras (no original) identificadas como verbo"],
  "substantivos": ["lista de palavras (no original) identificadas como substantivo"],
  "resumo": "1-2 frases em português explicando a estrutura gramatical do versículo"
}
Baseie-se apenas nas informações fornecidas; se a classe gramatical de uma palavra não vier
explícita, use seu conhecimento do idioma para classificá-la a partir da palavra e do Strong.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { words } = (await req.json()) as { words: WordInput[] };

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY não configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContent = words
      .map(
        (w, i) =>
          `${i + 1}. Palavra: ${w.word} | Strong: ${w.strong ?? "—"} | Classe: ${
            w.partOfSpeech ?? "desconhecida"
          } | Significado: ${w.meaning ?? "—"}`,
      )
      .join("\n");

    // Modelos em ordem de preferência — o free tier do gemini-2.0-flash foi
    // zerado (429 RESOURCE_EXHAUSTED), então tentamos os modelos atuais.
    const MODELS = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash"];

    let res: Response | null = null;
    let lastError = "sem resposta";
    for (const model of MODELS) {
      const attempt = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
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
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );
      if (attempt.ok) {
        res = attempt;
        break;
      }
      lastError = `${attempt.status}: ${(await attempt.text().catch(() => "")).slice(0, 300)}`;
      console.error(`verse-analysis: modelo ${model} falhou —`, lastError);
    }

    if (!res) {
      return new Response(JSON.stringify({ error: "Falha na API do Gemini", details: lastError }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return new Response(JSON.stringify({ error: "Resposta vazia do Gemini" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(text);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
