import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

/** Bucket no Supabase Storage usado como cache dos áudios já gerados pelo Piper. */
const BUCKET = "narration-audio";

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * Cache é "melhor-esforço": se o Supabase falhar por qualquer motivo (env vars
 * ausentes, bucket não criado ainda, etc.), a narração não pode parar de
 * funcionar por causa disso — só deixamos de aproveitar o cache.
 */
async function tryGetCached(fileName: string): Promise<ArrayBuffer | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.storage.from(BUCKET).download(fileName);
    if (!data) return null;
    return await data.arrayBuffer();
  } catch (e) {
    console.error("Narração: cache indisponível ao ler", e);
    return null;
  }
}

async function trySaveCache(fileName: string, audioBuf: ArrayBuffer): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, audioBuf, { contentType: "audio/wav", upsert: true });
    if (error) console.error("Narração: falha ao salvar no cache", error);
  } catch (e) {
    console.error("Narração: cache indisponível ao salvar", e);
  }
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

          // 1. Tenta servir do cache (evita gerar áudio de novo pra texto repetido).
          const cached = await tryGetCached(fileName);
          if (cached) {
            return new Response(cached, {
              headers: {
                "Content-Type": "audio/wav",
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }

          // 2. Sem cache: gera no servidor Piper (Render).
          const piperUrl = process.env.PIPER_TTS_URL;
          const piperKey = process.env.PIPER_TTS_API_KEY;
          if (!piperUrl || !piperKey) {
            return new Response("PIPER_TTS_URL/PIPER_TTS_API_KEY ausente", { status: 500 });
          }

          const res = await fetch(`${piperUrl.replace(/\/$/, "")}/synthesize`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": piperKey },
            body: JSON.stringify({ text }),
          });

          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            return new Response(`Piper ${res.status}: ${errText.slice(0, 200)}`, {
              status: 502,
            });
          }

          const audioBuf = await res.arrayBuffer();

          // 3. Salva no cache pras próximas vezes (não bloqueia a resposta ao usuário).
          void trySaveCache(fileName, audioBuf);

          return new Response(audioBuf, {
            headers: {
              "Content-Type": "audio/wav",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "erro";
          console.error("Narração: erro em /api/tts", e);
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
