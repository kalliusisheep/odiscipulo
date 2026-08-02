const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Migrado de src/routes/api/mentor.memory.ts pelo mesmo motivo do
// mentor-chat: a rota de servidor customizada do TanStack não recebia a
// LOVABLE_API_KEY em runtime.
const MEMORY_CATEGORIES = new Set(["pedido_oracao", "luta", "crescimento", "outro"]);

const MEMORY_EXTRACTION_SYSTEM_PROMPT = `Você lê uma conversa entre um usuário e um mentor cristão de IA. Extraia de 0 a 3 fatos DURÁVEIS e específicos sobre o usuário — coisas que continuam relevantes daqui a uma ou duas semanas.

Vale extrair: um pedido de oração específico que ele compartilhou, uma luta pessoal ou espiritual que ele mencionou, uma área em que ele disse querer crescer.
NÃO vale extrair: perguntas genéricas sobre a Bíblia, dúvidas pontuais de estudo, teologia abstrata, ou qualquer coisa que não diga respeito à vida pessoal do usuário. Se a conversa não trouxer nada durável, devolva uma lista vazia.

Responda APENAS com um JSON válido, sem markdown e sem texto fora do JSON, exatamente neste formato:
{"facts":[{"category":"pedido_oracao","fact":"frase curta em terceira pessoa resumindo o fato"}]}

"category" deve ser um destes valores: pedido_oracao, luta, crescimento, outro.`;

type RequestBody = { messages?: { role: string; content: string }[] };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      // Falha na extração não deve quebrar a experiência do usuário — o chat
      // já terminou normalmente. Só não guardamos memória desta vez.
      console.error("mentor-memory: LOVABLE_API_KEY ausente");
      return Response.json({ facts: [] }, { headers: corsHeaders });
    }

    const body: RequestBody = await req.json();
    if (!Array.isArray(body?.messages)) {
      return new Response("Bad request", { status: 400, headers: corsHeaders });
    }

    const transcript = body.messages
      .slice(-20)
      .map((m) => `${m.role === "user" ? "Usuário" : "Mentor"}: ${m.content}`)
      .join("\n")
      .slice(0, 6000);

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: MEMORY_EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: transcript || "(conversa vazia)" },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`mentor-memory: Gateway ${res.status}: ${text.slice(0, 200)}`);
      return Response.json({ facts: [] }, { headers: corsHeaders });
    }

    const data = await res.json();
    const raw = (data.choices?.[0]?.message?.content ?? "{}").replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);
    const facts = Array.isArray(parsed.facts) ? parsed.facts : [];
    const cleaned = facts
      .filter((f: { fact?: unknown }) => f && typeof f.fact === "string" && f.fact.trim().length > 0)
      .map((f: { category?: string; fact: string }) => ({
        category: MEMORY_CATEGORIES.has(f.category ?? "") ? f.category : "outro",
        fact: f.fact.trim().slice(0, 300),
      }))
      .slice(0, 3);

    return Response.json({ facts: cleaned }, { headers: corsHeaders });
  } catch (e) {
    console.error("mentor-memory: falha ao extrair", e instanceof Error ? e.message : e);
    return Response.json({ facts: [] }, { headers: corsHeaders });
  }
});
