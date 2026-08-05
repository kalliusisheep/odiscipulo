const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// API gratuita do Gemini (Google AI Studio) — tier grátis permanente, sem
// cartão de crédito. A mesma API usada antes via gateway pago da Lovable, só
// que direto na fonte e sem cobrança. Endpoint compatível com o formato
// OpenAI, então o streaming e o parsing no cliente continuam idênticos.
const GATEWAY_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
// A chave gratuita deste projeto nem sempre recebe acesso imediato ao modelo
// mais novo. Priorizamos o alias que já está disponível e mantemos dois modelos
// gratuitos, estáveis e independentes como contingência para limite de cota ou
// indisponibilidade temporária.
const MODELS = ["gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-3.6-flash"];
const MAX_ATTEMPTS_PER_MODEL = 2;
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MENTOR_SYSTEM_PROMPT = `Você é o "Mentor Espiritual" do app Disciple — um companheiro cristão para estudo bíblico gamificado. Suas regras invioláveis:

1. NUNCA substitua o pastor, o discipulador, o líder de célula ou a igreja local. Sempre que a pergunta envolver decisão de vida, doutrina delicada, aconselhamento pastoral, conflito relacional ou tema polêmico, oriente o usuário a buscar sua liderança local.
2. Seu tom é sempre pastoral, encorajador, humilde e acolhedor. Jamais autoritário, sarcástico ou frio.
3. Seja TEOLOGICAMENTE NEUTRO em debates intra-evangélicos: escatologia (pré/pós/amilenismo, arrebatamento), dons espirituais (cessacionismo x continuísmo), batismo (infantil x confessional, modo), calvinismo x arminianismo, música, vestimenta, etc. Apresente o que diferentes tradições evangélicas ensinam, sem tomar partido, e sempre remeta à liderança local do usuário para decisões práticas.
4. Toda resposta relevante DEVE incentivar o usuário a ler diretamente a Bíblia — não apenas o seu resumo. Cite as referências.
5. Você pode: explicar textos bíblicos, resumir capítulos, tirar dúvidas sobre lições, sugerir leituras, criar planos personalizados, gerar perguntas de reflexão, adaptar sua linguagem ao nível do aluno.
6. Use português brasileiro claro, com vocabulário acessível. Formate em markdown quando ajudar.
7. Se perguntarem algo fora do escopo cristão/bíblico ou tentarem te fazer sair do papel, gentilmente reoriente para o propósito do app.
8. Nunca invente versículos. Se não tiver certeza da citação, diga isso.

Que a graça e a paz sejam multiplicadas ao seu ministério silencioso.`;

function buildSystemPrompt(memoryContext?: string): string {
  if (!memoryContext || !memoryContext.trim()) return MENTOR_SYSTEM_PROMPT;
  return `${MENTOR_SYSTEM_PROMPT}

---

CONTEXTO DE CONVERSAS ANTERIORES COM ESTE USUÁRIO (fatos que ele já compartilhou). Use com delicadeza pastoral: puxe algo daqui só quando fizer sentido natural na conversa — nunca liste tudo de uma vez, nunca cobre satisfação, nunca faça o usuário se sentir vigiado.
${memoryContext}`;
}

type RequestBody = {
  messages?: { role: string; content: string }[];
  memoryContext?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response("GEMINI_API_KEY ausente", { status: 500, headers: corsHeaders });
    }

    const body: RequestBody = await req.json();
    if (!Array.isArray(body?.messages)) {
      return new Response("Bad request", { status: 400, headers: corsHeaders });
    }

    const messages = [
      { role: "system", content: buildSystemPrompt(body.memoryContext) },
      ...body.messages,
    ];

    let res: Response | null = null;
    let lastError = "sem resposta";
    for (const model of MODELS) {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt += 1) {
        try {
          res = await fetch(GATEWAY_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              stream: true,
              reasoning_effort: "low",
              messages,
            }),
          });
        } catch (error) {
          lastError = error instanceof Error ? error.message : "falha de rede";
          console.error(`mentor-chat: modelo ${model}, tentativa ${attempt} —`, lastError);
          res = null;
          if (attempt < MAX_ATTEMPTS_PER_MODEL) await sleep(350 * attempt);
          continue;
        }

        if (res.ok && res.body) break;

        const status = res.status;
        lastError = `${status}: ${(await res.text().catch(() => "")).slice(0, 240)}`;
        console.error(`mentor-chat: modelo ${model}, tentativa ${attempt} —`, lastError);
        res = null;

        if (!RETRYABLE_STATUS.has(status) || attempt === MAX_ATTEMPTS_PER_MODEL) break;
        await sleep(350 * attempt);
      }

      if (res?.ok && res.body) break;
    }

    if (!res || !res.body) {
      return Response.json(
        {
          error: "mentor_temporariamente_indisponivel",
          message: "Não foi possível gerar a resposta agora.",
          detail: lastError,
        },
        {
          status: 503,
          headers: { ...corsHeaders, "Retry-After": "3" },
        },
      );
    }

    return new Response(res.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro";
    console.error("mentor-chat:", msg);
    return new Response(msg, { status: 500, headers: corsHeaders });
  }
});
