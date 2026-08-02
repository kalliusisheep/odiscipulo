const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// API gratuita do Gemini (Google AI Studio) — tier grátis permanente, sem
// cartão de crédito. A mesma API usada antes via gateway pago da Lovable, só
// que direto na fonte e sem cobrança. Endpoint compatível com o formato
// OpenAI, então o streaming e o parsing no cliente continuam idênticos.
const GATEWAY_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
// Gemini 3.6 Flash; se a chave ainda não tiver acesso, cai para o alias
// "flash-latest" para o mentor nunca ficar mudo.
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];
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

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: "system", content: buildSystemPrompt(body.memoryContext) }, ...body.messages],
      }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      return new Response(`Gateway ${res.status}: ${text.slice(0, 200)}`, { status: 502, headers: corsHeaders });
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
