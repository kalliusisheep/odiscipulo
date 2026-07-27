import { createFileRoute } from "@tanstack/react-router";

const TTS_URL = "https://ai.gateway.lovable.dev/v1/audio/speech";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) return new Response("LOVABLE_API_KEY ausente", { status: 500 });
          const body = (await request.json()) as { text?: string };
          const text = (body?.text ?? "").trim();
          if (!text) return new Response("Missing text", { status: 400 });
          if (text.length > 3500) return new Response("Text too long", { status: 400 });

          const res = await fetch(TTS_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: text,
              voice: "onyx",
              response_format: "mp3",
              instructions:
                "Fale em português brasileiro com voz masculina calorosa, natural, humana e pastoral. Ritmo tranquilo, entonação expressiva mas contida, adequada para leitura devocional cristã.",
            }),
          });

          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            return new Response(`Gateway ${res.status}: ${errText.slice(0, 200)}`, {
              status: res.status,
            });
          }

          return new Response(res.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
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
