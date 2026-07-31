import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

/** Bucket no Supabase Storage usado como cache dos áudios já gerados pelo Kokoro. */
const BUCKET = "narration-audio";

/** Tempo máximo (ms) que esperamos o servidor Kokoro responder antes de desistir. */
const KOKORO_TIMEOUT_MS = 20_000;

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

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

          const fileName = `${hashText(text)}-kokoro.wav`;

          // 1. Tenta servir do cache.
          const cached = await tryGetCached(fileName);
          if (cached) {
            return new Response(cached, {
              headers: {
                "Content-Type": "audio/wav",
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }

          // 2. Sem cache: gera no servidor Kokoro (Render).
          const kokoroUrl = process.env.KOKORO_TTS_URL;
          const kokoroKey = process.env.KOKORO_TTS_API_KEY;
          if (!kokoroUrl) {
            return new Response("KOKORO_TTS_URL ausente", { status: 500 });
          }

          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (kokoroKey) headers["x-api-key"] = kokoroKey;

          // Timeout: se o Kokoro não responder em KOKORO_TIMEOUT_MS, desistimos
          // em vez de deixar o request pendurado por minutos.
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), KOKORO_TIMEOUT_MS);

          let res: Response;
          try {
            res = await fetch(`${kokoroUrl.replace(/\/$/, "")}/synthesize`, {
              method: "POST",
              headers,
              body: JSON.stringify({ text }),
              signal: controller.signal,
            });
          } catch (e) {
            clearTimeout(timeoutId);
            const timedOut = (e as Error)?.name === "AbortError";
            console.error("Narração: falha ao chamar Kokoro", e);
            return new Response(
              timedOut
                ? "Kokoro: timeout (servidor não respondeu a tempo)"
                : "Kokoro: erro de rede",
              { status: 504 },
            );
          }
          clearTimeout(timeoutId);

          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            return new Response(`Kokoro ${res.status}: ${errText.slice(0, 200)}`, {
              status: 502,
            });
          }

          const audioBuf = await res.arrayBuffer();

          // 3. Salva no cache pras próximas vezes.
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
