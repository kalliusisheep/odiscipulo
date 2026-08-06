const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[char] ?? char);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const key = Deno.env.get("AZURE_SPEECH_KEY");
    const region = Deno.env.get("AZURE_SPEECH_REGION");
    if (!key || !region) {
      return new Response("AZURE_SPEECH_KEY ou AZURE_SPEECH_REGION ausente", {
        status: 500,
        headers: corsHeaders,
      });
    }

    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const rate = typeof body?.rate === "number" ? Math.min(Math.max(body.rate, 0.8), 1.5) : 1;
    if (!text || text.length > 5000) {
      return new Response("Texto inválido ou muito longo", { status: 400, headers: corsHeaders });
    }

    const percent = Math.round((rate - 1) * 100);
    const speed = percent === 0 ? "0%" : `${percent > 0 ? "+" : ""}${percent}%`;
    const ssml = `<speak version="1.0" xml:lang="pt-BR"><voice name="pt-BR-AntonioNeural"><prosody rate="${speed}">${escapeXml(text)}</prosody></voice></speak>`;

    const response = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
          "User-Agent": "odiscipulo-bible-reader",
        },
        body: ssml,
      },
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return new Response(`Azure TTS ${response.status}: ${detail.slice(0, 300)}`, {
        status: 502,
        headers: corsHeaders,
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar narração";
    return new Response(message, { status: 500, headers: corsHeaders });
  }
});
