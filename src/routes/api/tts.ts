import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

/** Bucket no Supabase Storage usado como cache dos áudios já gerados. */
const BUCKET = "narration-audio";

/** Modelo de voz (Lovable AI) usado para a narração. */
const TTS_MODEL = "openai/gpt-4o-mini-tts";
/** Voz base — calorosa e grave, boa para leitura pastoral. */
const TTS_VOICE = "onyx";
/** Direção de estilo: português do Brasil, ritmo calmo e natural. */
const TTS_INSTRUCTIONS =
  "Fale em português do Brasil, com sotaque brasileiro natural e nativo. " +
  "Tom pastoral, caloroso e acolhedor, como quem lê a Bíblia em voz alta para alguém querido. " +
  "Ritmo calmo e pausado, respeitando a pontuação, sem pressa e sem entonação robótica.";

/** Tempo máximo (ms) que esperamos a geração do áudio antes de desistir. */
const TTS_TIMEOUT_MS = 25_000;

function hashText(text: string): string {
  return createHash("sha256").update(`${TTS_MODEL}:${TTS_VOICE}:${text}`).digest("hex");
}

/**
 * Nomes usados por versões anteriores do sistema (antes de existir o prefixo
 * modelo:voz no hash), que salvavam o áudio já gerado como `.wav`. Esses
 * arquivos já foram pagos (créditos já consumidos) e continuam no bucket —
 * só não eram mais encontrados porque o hash novo é diferente. Verificamos
 * esses nomes antigos antes de gerar (e cobrar) áudio de novo.
 */
function legacyFileNames(text: string): string[] {
  const plain = createHash("sha256").update(text).digest("hex");
  return [`${plain}-kokoro.wav`, `${plain}.wav`, `${plain}.mp3`];
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
  contentType = "audio/mpeg",
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

function audioResponse(buf: ArrayBuffer, contentType = "audio/mpeg"): Response {
  return new Response(buf, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
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

          const fileName = `${hashText(text)}.mp3`;

          // 1. Cache: se esse trecho já foi narrado alguma vez, serve de graça.
          const cached = await tryGetCached(fileName);
          if (cached) return audioResponse(cached);

          // 1.5. Cache antigo: reconecta com áudio já gerado (e já pago) por uma
          // versão anterior do sistema, salvo sob o nome de arquivo antigo.
          const legacy = await tryGetLegacyCached(text);
          if (legacy) {
            // Copia pro nome novo, então da próxima vez a busca acima (passo 1) já acha direto.
            // IMPORTANTE: isso roda no Cloudflare Workers — se não esperarmos (await) o
            // salvamento terminar antes de responder, o Worker pode encerrar o processo
            // assim que a resposta é enviada, matando o upload no meio e deixando o
            // cache vazio pra sempre. Por isso o await aqui, mesmo custando um pouco de
            // latência.
            await trySaveCache(fileName, legacy);
            return audioResponse(legacy);
          }

          // 2. Sem cache (novo nem antigo): gera com a voz de IA da Lovable.
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response("LOVABLE_API_KEY ausente", { status: 500 });

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS);

          let res: Response;
          try {
            res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: TTS_MODEL,
                input: text,
                voice: TTS_VOICE,
                instructions: TTS_INSTRUCTIONS,
                response_format: "mp3",
                stream_format: "audio",
                speed: 0.95,
              }),
              signal: controller.signal,
            });
          } catch (e) {
            clearTimeout(timeoutId);
            console.error("Narração: falha ao gerar áudio", e);
            return new Response("Narração: tempo esgotado ao gerar o áudio", { status: 504 });
          }
          clearTimeout(timeoutId);

          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            console.error(`Narração: gateway ${res.status}`, errText.slice(0, 500));
            const status = res.status === 402 || res.status === 429 ? res.status : 502;
            return new Response(`TTS ${res.status}: ${errText.slice(0, 200)}`, { status });
          }

          const audioBuf = await res.arrayBuffer();
          if (audioBuf.byteLength === 0) {
            return new Response("Narração: áudio vazio", { status: 502 });
          }

          // 3. Guarda no cache — próximas escutas do mesmo trecho são gratuitas.
          // IMPORTANTE: precisa ser `await`, não "dispare e esqueça" (`void`).
          // No Cloudflare Workers, o processo pode ser encerrado assim que a
          // resposta HTTP termina de ser enviada — qualquer promise em segundo
          // plano que não tenha sido esperada (ou presa com ctx.waitUntil) corre
          // o risco de ser abortada no meio. Era exatamente isso que estava
          // fazendo o upload para o bucket falhar silenciosamente: o áudio tocava
          // (e consumia crédito), mas nunca ficava de fato salvo — então na
          // próxima vez o servidor não achava nada no cache e gerava (e cobrava)
          // tudo de novo, até os créditos acabarem e a narração cair para a voz
          // do aparelho/Google.
          await trySaveCache(fileName, audioBuf);

          return audioResponse(audioBuf);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "erro";
          console.error("Narração: erro em /api/tts", e);
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
