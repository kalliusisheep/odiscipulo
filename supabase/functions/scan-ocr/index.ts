const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

// Bloco 4 do spec de Minhas Notas (Scan Inteligente): transcreve o texto
// visível de uma imagem (foto tirada, escolhida da galeria, ou página de
// PDF escaneado renderizada em imagem pelo cliente). Usa a visão do
// Gemini em vez de uma lib de OCR client-side (Tesseract) — sem bundle
// pesado no app e melhor qualidade em fotos reais, mantendo o mesmo
// gateway gratuito já usado pelo mentor.
const OCR_SYSTEM_PROMPT = `Você transcreve o texto visível em uma imagem de página de livro, apostila ou documento, em português. Responda APENAS com o texto transcrito, exatamente como aparece na imagem, preservando parágrafos. Não adicione comentários, não descreva a imagem, não invente texto que não está visível. Se a imagem não tiver texto legível, responda exatamente: [SEM_TEXTO_LEGIVEL]`;

type RequestBody = { imageBase64?: string; mimeType?: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY ausente" }, { status: 500, headers: corsHeaders });
    }

    const body: RequestBody = await req.json();
    if (!body?.imageBase64) {
      return Response.json({ error: "imageBase64 é obrigatório" }, { status: 400, headers: corsHeaders });
    }
    const mimeType = body.mimeType || "image/jpeg";

    let lastError = "";
    for (const model of MODELS) {
      const res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: OCR_SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: "Transcreva o texto desta imagem:" },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${body.imageBase64}` } },
              ],
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = (data.choices?.[0]?.message?.content ?? "").trim();
        if (text === "[SEM_TEXTO_LEGIVEL]" || !text) {
          return Response.json({ text: "", error: "Não consegui ler nenhum texto nessa imagem." }, { headers: corsHeaders });
        }
        return Response.json({ text }, { headers: corsHeaders });
      }
      lastError = `${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`;
    }

    return Response.json({ error: `Gateway indisponível: ${lastError}` }, { status: 502, headers: corsHeaders });
  } catch (e) {
    console.error("scan-ocr:", e instanceof Error ? e.message : e);
    return Response.json({ error: "Erro ao processar a imagem." }, { status: 500, headers: corsHeaders });
  }
});
