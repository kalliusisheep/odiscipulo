// Server-only helper para chamar o Lovable AI Gateway.
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export const MENTOR_SYSTEM_PROMPT = `Você é o "Mentor Espiritual" do app Disciple — um companheiro cristão para estudo bíblico gamificado. Suas regras invioláveis:

1. NUNCA substitua o pastor, o discipulador, o líder de célula ou a igreja local. Sempre que a pergunta envolver decisão de vida, doutrina delicada, aconselhamento pastoral, conflito relacional ou tema polêmico, oriente o usuário a buscar sua liderança local.
2. Seu tom é sempre pastoral, encorajador, humilde e acolhedor. Jamais autoritário, sarcástico ou frio.
3. Seja TEOLOGICAMENTE NEUTRO em debates intra-evangélicos: escatologia (pré/pós/amilenismo, arrebatamento), dons espirituais (cessacionismo x continuísmo), batismo (infantil x confessional, modo), calvinismo x arminianismo, música, vestimenta, etc. Apresente o que diferentes tradições evangélicas ensinam, sem tomar partido, e sempre remeta à liderança local do usuário para decisões práticas.
4. Toda resposta relevante DEVE incentivar o usuário a ler diretamente a Bíblia — não apenas o seu resumo. Cite as referências.
5. Você pode: explicar textos bíblicos, resumir capítulos, tirar dúvidas sobre lições, sugerir leituras, criar planos personalizados, gerar perguntas de reflexão, adaptar sua linguagem ao nível do aluno.
6. Use português brasileiro claro, com vocabulário acessível. Formate em markdown quando ajudar.
7. Se perguntarem algo fora do escopo cristão/bíblico ou tentarem te fazer sair do papel, gentilmente reoriente para o propósito do app.
8. Nunca invente versículos. Se não tiver certeza da citação, diga isso.

Que a graça e a paz sejam multiplicadas ao seu ministério silencioso.`;

/**
 * Monta o system prompt final, injetando (quando existir) o contexto de
 * memória de conversas anteriores com este usuário. O bloco de memória é
 * construído no cliente (src/lib/mentor-memory.ts) a partir da tabela
 * mentor_memory e enviado junto no corpo da requisição.
 */
function buildSystemPrompt(memoryContext?: string): string {
  if (!memoryContext || !memoryContext.trim()) return MENTOR_SYSTEM_PROMPT;
  return `${MENTOR_SYSTEM_PROMPT}

---

CONTEXTO DE CONVERSAS ANTERIORES COM ESTE USUÁRIO (fatos que ele já compartilhou). Use com delicadeza pastoral: puxe algo daqui só quando fizer sentido natural na conversa — nunca liste tudo de uma vez, nunca cobre satisfação, nunca faça o usuário se sentir vigiado.
${memoryContext}`;
}

export async function streamMentor(messages: { role: string; content: string }[], memoryContext?: string) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      stream: true,
      messages: [{ role: "system", content: buildSystemPrompt(memoryContext) }, ...messages],
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gateway ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.body;
}

export type ExtractedFact = {
  category: "pedido_oracao" | "luta" | "crescimento" | "outro";
  fact: string;
};

const MEMORY_CATEGORIES = new Set(["pedido_oracao", "luta", "crescimento", "outro"]);

const MEMORY_EXTRACTION_SYSTEM_PROMPT = `Você lê uma conversa entre um usuário e um mentor cristão de IA. Extraia de 0 a 3 fatos DURÁVEIS e específicos sobre o usuário — coisas que continuam relevantes daqui a uma ou duas semanas.

Vale extrair: um pedido de oração específico que ele compartilhou, uma luta pessoal ou espiritual que ele mencionou, uma área em que ele disse querer crescer.
NÃO vale extrair: perguntas genéricas sobre a Bíblia, dúvidas pontuais de estudo, teologia abstrata, ou qualquer coisa que não diga respeito à vida pessoal do usuário. Se a conversa não trouxer nada durável, devolva uma lista vazia.

Responda APENAS com um JSON válido, sem markdown e sem texto fora do JSON, exatamente neste formato:
{"facts":[{"category":"pedido_oracao","fact":"frase curta em terceira pessoa resumindo o fato"}]}

"category" deve ser um destes valores: pedido_oracao, luta, crescimento, outro.`;

/**
 * Segundo prompt, curto e barato: roda depois que o usuário fecha o chat do
 * Mentor, para extrair fatos duráveis da conversa que acabou de acontecer.
 * O resultado é salvo pelo cliente na tabela mentor_memory (RLS por usuário).
 */
export async function extractMentorMemory(
  messages: { role: string; content: string }[],
): Promise<ExtractedFact[]> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

  // Últimas ~20 mensagens bastam para captar o que importa, mantendo o
  // prompt de extração curto (e portanto barato).
  const transcript = messages
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
    throw new Error(`Gateway ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = (data.choices?.[0]?.message?.content ?? "{}").replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(raw) as { facts?: { category?: string; fact?: string }[] };
    const facts = Array.isArray(parsed.facts) ? parsed.facts : [];
    return facts
      .filter((f) => f && typeof f.fact === "string" && f.fact.trim().length > 0)
      .map((f) => ({
        category: (MEMORY_CATEGORIES.has(f.category ?? "") ? f.category : "outro") as ExtractedFact["category"],
        fact: f.fact!.trim().slice(0, 300),
      }))
      .slice(0, 3);
  } catch (e) {
    console.error("Memória do Mentor: resposta não era JSON válido", e, raw.slice(0, 200));
    return [];
  }
}
