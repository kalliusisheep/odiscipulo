import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

/** Bucket no Supabase Storage usado como cache dos áudios já gerados pelo Piper. */
const BUCKET = "narration-audio";

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
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

          // Import dinâmico: client.server.ts só é seguro fora do bundle do cliente.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const fileName = `${hashText(text)}.wav`;

          // 1. Tenta servir do cache (evita gerar áudio de novo pra texto repetido).
          const { data: cached } = await supabaseAdmin.storage.from(BUCKET).download(fileName);
          if (cached) {
            const buf = await cached.arrayBuffer();
            return new Response(buf, {
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
          void supabaseAdmin.storage
            .from(BUCKET)
            .upload(fileName, audioBuf, { contentType: "audio/wav", upsert: true })
            .then(({ error }) => {
              if (error) console.error("Cache de narração: falha ao salvar", error);
            });

          return new Response(audioBuf, {
            headers: {
              "Content-Type": "audio/wav",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "erro";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
