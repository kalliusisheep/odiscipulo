// Redeploy trigger: publicando esta função no Lovable Cloud (estava commitada mas nunca deployada).
// Ações de IA sobre uma nota: gerar título curto, reescrever mantendo o
// sentido, ou organizar como estrutura de lição/estudo. Mesmo gateway já
// usado em mentor-chat (Gemini via endpoint compatível com OpenAI) — mas
// aqui SEM streaming, porque o cliente precisa do texto completo antes de
// oferecer "aceitar"/"descartar".

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MODELS = ["gemini-3.6-flash", "gemini-flash-latest"];

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

type ActionType = "titulo" | "reescrever" | "estruturar" | "scan_transcricao" | "scan_reescrita" | "scan_estrutura";

type RequestBody = {
  action?: ActionType;
  text?: string;
};

function promptFor(action: ActionType, text: string): { system: string; user: string } {
  switch (action) {
    case "titulo":
      return {
        system:
          "Você gera títulos curtos e diretos para anotações pessoais de estudo bíblico. " +
          "Responda APENAS com o título, sem aspas, sem pontuação final, no máximo 6 palavras.",
        user: text,
      };
    case "reescrever":
      return {
        system:
          "Você reformula textos de anotações pessoais de estudo bíblico, mantendo o sentido original, " +
          "a pessoa do discurso e o tom espiritual/devocional. Responda APENAS com o texto reescrito, " +
          "em português brasileiro, sem comentários adicionais.",
        user: text,
      };
    case "estruturar":
    case "scan_estrutura":
      return {
        system:
          "Você organiza um texto em uma estrutura de lição/estudo bíblico com estas seções, cada uma com um " +
          "título em ## markdown: Introdução, Pontos principais (em tópicos), Versículos relacionados (se " +
          "aplicável), Aplicação prática, Conclusão. Responda apenas com o markdown estruturado, em português.",
        user: text,
      };
    case "scan_transcricao":
      return {
        system: "Você limpa um texto extraído por OCR/parsing, corrigindo apenas erros óbvios de leitura, " +
          "sem reformular o conteúdo. Responda apenas com o texto corrigido.",
        user: text,
      };
    case "scan_reescrita":
      return {
        system:
          "Você reformula um texto extraído de um documento, mantendo o sentido, com clareza e boa formatação. " +
          "Responda apenas com o texto reescrito, em português brasileiro.",
        user: text,
      };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "GEMINI_API_KEY ausente" }, { status: 500, headers: corsHeaders });
    }

    // Exige usuário autenticado (o front sempre chama com o header
    // Authorization do supabase client) — evita uso anônimo do gateway.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ error: "não autenticado" }, { status: 401, headers: corsHeaders });
    }
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userRes } = await userClient.auth.getUser();
    if (!userRes.user) {
      return Response.json({ error: "não autenticado" }, { status: 401, headers: corsHeaders });
    }

    const body: RequestBody = await req.json();
    if (!body.action || !body.text || !body.text.trim()) {
      return Response.json({ error: "action e text são obrigatórios." }, { status: 400, headers: corsHeaders });
    }
    // Limite generoso o bastante pra uma anotação longa, sem deixar o
    // prompt crescer sem controle (ex: texto extraído de um PDF grande).
    const text = body.text.slice(0, 12000);

    const { system, user } = promptFor(body.action, text);

    let res: Response | null = null;
    let lastError = "sem resposta";
    for (const model of MODELS) {
      res = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (res.ok) break;
      lastError = `${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`;
      console.error(`note-ai: modelo ${model} falhou —`, lastError);
      res = null;
    }

    if (!res) {
      return Response.json({ error: `Gateway ${lastError}` }, { status: 502, headers: corsHeaders });
    }

    const json = await res.json();
    const resultText: string | undefined = json?.choices?.[0]?.message?.content;
    if (!resultText) {
      return Response.json({ error: "Resposta vazia da IA." }, { status: 502, headers: corsHeaders });
    }

    return Response.json({ text: resultText.trim() }, { headers: corsHeaders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro";
    console.error("note-ai:", msg);
    return Response.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
});
