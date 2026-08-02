import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

/** Bucket no Supabase Storage usado como cache dos áudios já gerados. */
const BUCKET = "narration-audio";

/**
 * Narração 100% gratuita: usamos o Gemini TTS direto na API do Google AI
 * Studio (tier gratuito permanente, sem cartão e sem créditos da Lovable),
 * com a mesma chave GEMINI_API_KEY já usada pelo Mentor IA.
 * Todo áudio gerado é salvo no Storage, então cada trecho é gerado uma única
 * vez na vida e depois é servido instantaneamente do cache.
 */
const TTS_MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
/** Voz calorosa e grave, boa para leitura pastoral. */
const TTS_VOICE = "Charon";
/** Direção de estilo (vai no próprio texto, como o Gemini espera). */
const TTS_STYLE =
  "Leia em português do Brasil, com sotaque brasileiro natural, tom pastoral, " +
  "caloroso e acolhedor, ritmo calmo e pausado, respeitando a pontuação:\n\n";

/** Tempo máximo (ms) que esperamos a geração do áudio antes de desistir. */
const TTS_TIMEOUT_MS = 25_000;

function hashText(text: string): string {
  return createHash("sha256").update(`gemini-tts:${TTS_VOICE}:${text}`).digest("hex");
}

/**
 * Nomes usados por versões anteriores do sistema. Esses arquivos já existem no
 * bucket (e já foram pagos) — reaproveitamos antes de gerar de novo.
 */
function legacyFileNames(text: string): string[] {
  const plain = createHash("sha256").update(text).digest("hex");
  const openai = createHash("sha256")
    .update(`openai/gpt-4o-mini-tts:onyx:${text}`)
    .digest("hex");
  return [`${openai}.mp3`, `${plain}-kokoro.wav`, `${plain}.wav`, `${plain}.mp3`];
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

/** Busca nos caches antigos (esquemas pré-migração). Se achar, reaproveita o áudio já pago. */
async function tryGetLegacyCached(
  text: string,
): Promise<{ buf: ArrayBuffer; contentType: string } | null> {
  for (const name of legacyFileNames(text)) {
    const buf = await tryGetCached(name);
    if (buf) return { buf, contentType: name.endsWith(".wav") ? "audio/wav" : "audio/mpeg" };
  }
  return null;
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

/** O Gemini devolve PCM cru (16-bit, mono). Envelopamos em WAV pro <audio> tocar. */
function pcmToWav(pcm: Uint8Array, sampleRate = 24000): ArrayBuffer {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + pcm.byteLength, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, pcm.byteLength, true);
  const out = new Uint8Array(44 + pcm.byteLength);
  out.set(new Uint8Array(header), 0);
  out.set(pcm, 44);
  return out.buffer;
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

type GeminiTtsResponse = {
  candidates?: {
    content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] };
  }[];
};

/** Gera o áudio no Gemini (grátis). Devolve WAV pronto, ou null se falhar. */
async function generateWithGemini(
  apiKey: string,
  text: string,
  signal: AbortSignal,
): Promise<{ buf: ArrayBuffer; error?: undefined } | { buf?: undefined; error: string }> {
  let lastError = "sem resposta";
  for (const model of TTS_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: TTS_STYLE + text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } },
            },
          },
        }),
        signal,
      },
    );

    if (!res.ok) {
      lastError = `${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`;
      console.error(`Narração: Gemini ${model} falhou`, lastError);
      continue;
    }

    const json = (await res.json()) as GeminiTtsResponse;
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
    const b64 = part?.inlineData?.data;
    if (!b64) {
      lastError = "áudio vazio";
      continue;
    }
    const rateMatch = /rate=(\d+)/.exec(part?.inlineData?.mimeType ?? "");
    const sampleRate = rateMatch ? Number(rateMatch[1]) : 24000;
    return { buf: pcmToWav(base64ToBytes(b64), sampleRate) };
  }
  return { error: lastError };
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

          // 1. Cache: se esse trecho já foi narrado alguma vez, serve na hora.
          const cached = await tryGetCached(fileName);
          if (cached) return audioResponse(cached);

          // 1.5. Cache antigo: reaproveita áudio já gerado por versões anteriores.
          const legacy = await tryGetLegacyCached(text);
          if (legacy) {
            await trySaveCache(fileName, legacy.buf, legacy.contentType);
            return audioResponse(legacy.buf, legacy.contentType);
          }

          // 2. Sem cache: gera com o Gemini TTS (tier gratuito do Google).
          const apiKey = process.env["GEMINI_API_KEY"];
          if (!apiKey) return new Response("GEMINI_API_KEY ausente", { status: 500 });

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);
          let result: Awaited<ReturnType<typeof generateWithGemini>>;
          try {
            result = await generateWithGemini(apiKey, text, controller.signal);
          } catch (e) {
            clearTimeout(timeoutId);
            console.error("Narração: falha ao gerar áudio", e);
            return new Response("Narração: tempo esgotado ao gerar o áudio", { status: 504 });
          }
          clearTimeout(timeoutId);

          if (!result.buf) {
            return new Response(`TTS: ${result.error}`, { status: 502 });
          }

          // 3. Guarda no cache — próximas escutas são instantâneas.
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
