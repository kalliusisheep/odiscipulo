import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(supabaseUrl, serviceRoleKey);

const MIN_CHARS = 300;
const MAX_CHARS = 400;

type RequestBody = {
  lessonId?: string;
  title?: string;
  context?: string;
};

function buildPrompt(title: string, context: string) {
  return `Título do conteúdo: "${title}"

Resumo do conteúdo (para você entender do que se trata, não repita isso literalmente):
"""${context}"""

Escreva um texto para eu compartilhar nas minhas redes sociais (WhatsApp, Instagram) contando a alguém — um amigo, um familiar — o que acabei de aprender nesse conteúdo de estudo bíblico, de um jeito que também apresente a ideia central para essa pessoa e a convide a refletir sobre ela. Escreva em primeira pessoa, como se eu mesmo estivesse escrevendo, em tom pessoal e caloroso, nunca robótico ou genérico. Não use hashtags, não use emojis, não use aspas, não mencione IA nem que o texto foi gerado automaticamente. O texto deve ter entre ${MIN_CHARS} e ${MAX_CHARS} caracteres, em português do Brasil, em um ou dois parágrafos curtos.`;
}

function clampToRange(text: string): string {
  let t = text.trim().replace(/\s+/g, " ");
  if (t.length <= MAX_CHARS) return t;
  // Corta no limite de frase mais próximo abaixo do máximo, senão em espaço.
  const slice = t.slice(0, MAX_CHARS);
  const lastStop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (lastStop > MIN_CHARS - 40) {
    return slice.slice(0, lastStop + 1).trim();
  }
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim() + "…";
}

async function callAiGateway(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada neste projeto.");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "Você ajuda um cristão a escrever, em português do Brasil, textos curtos, pessoais e calorosos para compartilhar nas redes sociais depois de estudar a Bíblia. Nunca soe como propaganda, nunca use linguagem de marketing, nunca use emojis ou hashtags.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Falha na IA Gateway (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Resposta da IA veio vazia.");
  }
  return text;
}

// Texto usado somente se a IA falhar (chave ausente, indisponibilidade, etc.)
// para o botão de compartilhar nunca quebrar para o usuário.
function fallbackText(title: string): string {
  return (
    `Hoje eu passei um tempo estudando sobre "${title}" e queria muito dividir isso com você. ` +
    `Tem coisas que a gente aprende que não dá pra guardar só pra si — precisam ser compartilhadas. ` +
    `Se você tiver um tempinho livre, separa alguns minutos pra pensar sobre isso também. ` +
    `Acho que pode fazer diferença no seu dia, assim como fez no meu.`
  ).slice(0, MAX_CHARS);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { lessonId, title, context }: RequestBody = await req.json();

    if (!lessonId || !title) {
      return Response.json(
        { error: "lessonId e title são obrigatórios." },
        { status: 400, headers: corsHeaders },
      );
    }

    const { data: cached } = await admin
      .from("lesson_share_texts")
      .select("share_text")
      .eq("lesson_id", lessonId)
      .maybeSingle();

    if (cached?.share_text) {
      return Response.json({ text: cached.share_text, cached: true }, { headers: corsHeaders });
    }

    let text: string;
    try {
      const raw = await callAiGateway(buildPrompt(title, context ?? ""));
      text = clampToRange(raw);
    } catch (aiError) {
      console.error("generate-share-text: IA falhou, usando fallback:", aiError);
      text = fallbackText(title);
    }

    const { error: insertError } = await admin
      .from("lesson_share_texts")
      .upsert(
        { lesson_id: lessonId, lesson_title: title, share_text: text },
        { onConflict: "lesson_id" },
      );
    if (insertError) console.error("generate-share-text: falha ao salvar cache:", insertError);

    return Response.json({ text, cached: false }, { headers: corsHeaders });
  } catch (error) {
    console.error("generate-share-text: erro inesperado:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido." },
      { status: 500, headers: corsHeaders },
    );
  }
});
