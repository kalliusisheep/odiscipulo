import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

/** Bucket no Supabase Storage usado como cache dos áudios já gerados. */
const BUCKET = "narration-audio";

/**
 * Narração via OpenAI TTS (gpt-4o-mini-tts). Diferente do Gemini, esta API
 * é paga (cobrada por token de áudio gerado) e exige uma conta OpenAI com
 * créditos/cartão cadastrado — não existe camada gratuita permanente aqui.
 * Todo áudio gerado é salvo no Storage, então cada trecho é gerado uma única
 * vez na vida e depois é servido instantaneamente do cache, economizando custo.
 */
const TTS_MODEL = "gpt-4o-mini-tts";
/** Voz grave e calorosa, boa para leitura pastoral. */
const TTS_VOICE = "onyx";
/** Instrução de estilo enviada separada do texto (recurso do gpt-4o-mini-tts). */
const TTS_INSTRUCTIONS =
  "Leia em português do Brasil, com sotaque brasileiro natural, tom pastoral, " +
  "caloroso e acolhedor, ritmo calmo e pausado, respeitando a pontuação.";

/** Tempo máximo (ms) que esperamos a geração do áudio antes de desistir. */
const TTS_TIMEOUT_MS = 25_000;

function hashText(text: string): string {
  return createHash("sha256").update(`openai-tts:${TTS_VOICE}:${text}`).digest("hex");
}

async function tryGetCached(fileName: string): Promise<ArrayBuffer | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.storage.from(BUCKET).download(fileName);
    if (!data) return null;
    const buf = await data.arrayBuffer();
    return buf.byteLength > 0 ? buf : null;
  } catch (e) {
    console.error("Narração: cache indisponível ao ler", e);
    return null;
  }
}

async function trySaveCache(
  fileName: string,
  audioBuf: ArrayBuffer,
  contentType: string,
): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, audioBuf, { contentType, upsert: true });
    if (error) console.error("Narração: falha ao salvar no cache", error);
  } catch (e) {
    console.error("Narração: cache indisponível ao salvar", e);
  }
}

function audioResponse(buf: ArrayBuffer, contentType = "audio/wav"): Response {
  return new Response(buf, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

/** Gera o áudio na OpenAI. Devolve WAV pronto, ou null se falhar. */
async function generateWithOpenAI(
  apiKey: string,
  text: string,
  signal: AbortSignal,
): Promise<{ buf: ArrayBuffer; error?: undefined } | { buf?: undefined; error: string }> {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      instructions: TTS_INSTRUCTIONS,
      response_format: "wav",
    }),
    signal,
  });

  if (!res.ok) {
    const detail = (await res.text().catch(() => "")).slice(0, 300);
    console.error("Narração: OpenAI TTS falhou", res.status, detail);
    return { error: `${res.status}: ${detail}` };
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength === 0) return { error: "áudio vazio" };
  return { buf };
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { text?: string };
          const text = (body?.text ?? "").trim();
          if (!text) return new Response("Missing text", { status: 400 });
          if (text.length > 2000) return new Response("Text too long", { status: 400 });

          const fileName = `${hashText(text)}.wav`;

          // 1. Cache: se esse trecho já foi narrado alguma vez, serve na hora
          //    (também economiza créditos da OpenAI).
          const cached = await tryGetCached(fileName);
          if (cached) return audioResponse(cached);

          // 2. Sem cache: gera com a OpenAI (TTS pago).
          const apiKey = process.env["OPENAI_API_KEY"];
          if (!apiKey) return new Response("OPENAI_API_KEY ausente", { status: 500 });

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);
          let result: Awaited<ReturnType<typeof generateWithOpenAI>>;
          try {
            result = await generateWithOpenAI(apiKey, text, controller.signal);
          } catch (e) {
            clearTimeout(timeoutId);
            console.error("Narração: falha ao gerar áudio", e);
            return new Response("Narração: tempo esgotado ao gerar o áudio", { status: 504 });
          }
          clearTimeout(timeoutId);

          if (!result.buf) {
            return new Response(`TTS: ${result.error}`, { status: 502 });
          }

          // 3. Guarda no cache — próximas escutas são instantâneas e grátis.
          // Precisa ser `await`: no Worker o processo pode encerrar assim que a
          // resposta é enviada, abortando um upload em segundo plano.
          await trySaveCache(fileName, result.buf, "audio/wav");

          return audioResponse(result.buf);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "erro";
          console.error("Narração: erro em /api/tts", e);
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
