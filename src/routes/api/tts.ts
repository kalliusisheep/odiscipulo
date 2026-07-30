import { createFileRoute } from "@tanstack/react-router";

const TTS_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent";

// Voz masculina do Gemini TTS. Alternativas masculinas que também funcionam
// bem para narração: "Orus", "Iapetus", "Fenrir". Troque aqui se quiser
// testar outra.
const VOICE_NAME = "Charon";

/** Envolve áudio PCM bruto (o que o Gemini devolve) num arquivo .wav válido,
 * que qualquer navegador consegue tocar direto. */
function pcmToWav(
  pcmData: Buffer,
  sampleRate = 24000,
  numChannels = 1,
  bitDepth = 16,
): Buffer {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const dataSize = pcmData.length;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, pcmData]);
}

async function callGemini(apiKey: string, promptText: string) {
  return fetch(TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
        },
      },
    }),
  });
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) return new Response("GEMINI_API_KEY ausente", { status: 500 });
          const body = (await request.json()) as { text?: string };
          const text = (body?.text ?? "").trim();
          if (!text) return new Response("Missing text", { status: 400 });
          if (text.length > 4500) return new Response("Text too long", { status: 400 });

          const promptText = `Fale de forma calma, natural e calorosa, como uma leitura devocional cristã em português do Brasil: ${text}`;

          // O modelo do Gemini às vezes devolve texto em vez de áudio numa
          // pequena porcentagem de tentativas (bug conhecido, documentado
          // pelo próprio Google) — tenta de novo automaticamente uma vez.
          let res = await callGemini(apiKey, promptText);
          let data: {
            candidates?: {
              content?: { parts?: { inlineData?: { data?: string; mimeType?: string } }[] };
              finishReason?: string;
            }[];
          } | null = null;

          if (res.ok) {
            data = await res.json();
          }

          let audioB64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

          if (!res.ok || !audioB64) {
            // segunda tentativa
            res = await callGemini(apiKey, promptText);
            if (!res.ok) {
              const errText = await res.text().catch(() => "");
              return new Response(`Gateway ${res.status}: ${errText.slice(0, 300)}`, {
                status: res.status,
              });
            }
            data = await res.json();
            audioB64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          }

          if (!audioB64) {
            const finishReason = data?.candidates?.[0]?.finishReason ?? "desconhecido";
            return new Response(`TTS: resposta sem áudio (${finishReason})`, { status: 502 });
          }

          const pcmBuffer = Buffer.from(audioB64, "base64");
          const wavBuffer = pcmToWav(pcmBuffer);

          return new Response(wavBuffer, {
            headers: {
              "Content-Type": "audio/wav",
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
