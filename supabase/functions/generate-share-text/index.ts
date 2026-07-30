import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(supabaseUrl, serviceRoleKey);

// Texto pode ir de um parágrafo curto até quase 700 caracteres — nunca mais que isso.
const MIN_CHARS = 450;
const MAX_CHARS = 700;

type RequestBody = {
  lessonId?: string;
  title?: string;
  context?: string;
};

// Persona resumida do mentor de discipulado — aplicada como voz de fundo
// de todo texto gerado, mesmo sendo um texto curto de compartilhamento.
const PERSONA_SYSTEM_PROMPT = `Você é um mentor de discipulado cristão de excelência, reunindo profundidade acadêmica, fidelidade bíblica e experiência pastoral. Sua identidade teológica: cristão evangélico, batista aberto (soteriologia arminiana), cristocêntrico, cessacionista moderado, alinhado à ortodoxia histórica e ao Credo Niceno-Constantinopolitano. Seu fundamento inegociável é Sola Scriptura: a Bíblia é inspirada, infalível, inerrante, suficiente e autoridade final para fé e prática. Você escreve com tom pastoral, acolhedor, caloroso e pessoal — nunca arrogante, nunca genérico, nunca com linguagem de marketing. Seu objetivo nunca é apenas transmitir informação, mas conduzir quem lê a conhecer mais a Deus, amar mais a Cristo e dar um passo prático de fé. Você reconhece que nenhum texto substitui a igreja local, mas seu papel aqui é ser a primeira faísca que desperta o interesse de alguém por um conteúdo bíblico.

Agora, sua tarefa específica: escrever um texto CURTO para alguém compartilhar nas redes sociais (WhatsApp, Instagram) logo depois de concluir uma trilha de estudo bíblico dentro de um app de discipulado. Esse texto vai por cima de uma imagem, então precisa ser direto e envolvente, nunca um sermão completo.`;

function buildPrompt(title: string, context: string) {
  return `Título da trilha/lição concluída: "${title}"

Resumo do conteúdo estudado (para você entender do que se trata — não repita isso literalmente nem cite como fonte):
"""${context}"""

Escreva, em português do Brasil e em primeira pessoa (como se eu mesmo, o aluno, estivesse escrevendo), um texto para eu compartilhar com um amigo ou familiar contando o que acabei de aprender.

Regras obrigatórias:
- O texto deve reunir os pontos mais importantes do conteúdo estudado e, com eles, responder diretamente ao título da trilha ("${title}") ou complementá-lo — quem ler o texto precisa entender, mesmo sem ver o resto do app, do que se trata "${title}".
- Tom pessoal, caloroso, evangelístico (apresente a ideia central da fé para quem vai ler, convidando essa pessoa a refletir), mas nunca artificial, nunca robótico, nunca com cara de propaganda.
- Sem hashtags, sem emojis, sem aspas, sem mencionar IA ou que o texto foi gerado automaticamente.
- Entre ${MIN_CHARS} e ${MAX_CHARS} caracteres, em um ou dois parágrafos curtos.`;
}

function clampToRange(text: string): string {
  let t = text.trim().replace(/\s+/g, " ");
  if (t.length <= MAX_CHARS) return t;
  // Corta no limite de frase mais próximo abaixo do máximo, senão em espaço.
  const slice = t.slice(0, MAX_CHARS);
  const lastStop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (lastStop > MIN_CHARS - 60) {
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
        { role: "system", content: PERSONA_SYSTEM_PROMPT },
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
    `Hoje eu terminei de estudar sobre "${title}" e queria muito dividir isso com você. ` +
    `Esse tempo na Palavra me lembrou que Deus continua falando com quem separa um momento pra ouvir Ele — e que fé de verdade cresce quando a gente coloca o que aprende em prática, não só quando acumula conhecimento. ` +
    `Se você tiver alguns minutos livres hoje, separa um tempinho pra pensar sobre isso também. ` +
    `Acredito que pode fazer diferença no seu dia, do mesmo jeito que fez no meu.`
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
    let aiSucceeded = true;
    try {
      const raw = await callAiGateway(buildPrompt(title, context ?? ""));
      text = clampToRange(raw);
    } catch (aiError) {
      console.error("generate-share-text: IA falhou, usando fallback (NÃO será salvo em cache):", aiError);
      text = fallbackText(title);
      aiSucceeded = false;
    }

    // Importante: só gravamos no cache quando a IA realmente respondeu.
    // Se salvássemos o texto de fallback, ele ficaria preso para sempre
    // nessa lição mesmo depois da IA voltar a funcionar.
    if (aiSucceeded) {
      const { error: insertError } = await admin
        .from("lesson_share_texts")
        .upsert(
          { lesson_id: lessonId, lesson_title: title, share_text: text },
          { onConflict: "lesson_id" },
        );
      if (insertError) console.error("generate-share-text: falha ao salvar cache:", insertError);
    }

    return Response.json({ text, cached: false, ai_succeeded: aiSucceeded }, { headers: corsHeaders });
  } catch (error) {
    console.error("generate-share-text: erro inesperado:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Erro desconhecido." },
      { status: 500, headers: corsHeaders },
    );
  }
});
