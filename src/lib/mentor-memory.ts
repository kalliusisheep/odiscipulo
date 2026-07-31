import { supabase } from "@/integrations/supabase/client";

export type MentorMemoryCategory = "pedido_oracao" | "luta" | "crescimento" | "outro";

export type MentorMemoryRow = {
  id: string;
  category: MentorMemoryCategory;
  fact: string;
  created_at: string;
};

const CATEGORY_LABEL: Record<MentorMemoryCategory, string> = {
  pedido_oracao: "Pedido de oração",
  luta: "Luta mencionada",
  crescimento: "Área de crescimento",
  outro: "Outro",
};

const VALID_CATEGORIES: MentorMemoryCategory[] = ["pedido_oracao", "luta", "crescimento", "outro"];

/** Máximo de fatos guardados por usuário — mantém a tabela enxuta e o contexto enviado ao modelo curto. */
const MAX_STORED_FACTS = 12;

export async function fetchMentorMemories(userId: string): Promise<MentorMemoryRow[]> {
  const { data } = await supabase
    .from("mentor_memory")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(MAX_STORED_FACTS);
  return (data ?? []) as MentorMemoryRow[];
}

/** Monta o bloco de texto injetado no system prompt do Mentor na próxima conversa. */
export function buildMemoryContext(memories: MentorMemoryRow[]): string | undefined {
  if (memories.length === 0) return undefined;
  return memories
    .slice()
    .reverse() // mais antigo primeiro — lê como uma linha do tempo
    .map((m) => `- [${CATEGORY_LABEL[m.category]}] ${m.fact}`)
    .join("\n");
}

/** Escolhe um fato recente (prioriza pedido de oração/luta) para abrir a conversa com uma saudação pessoal. */
export function buildMemoryGreeting(memories: MentorMemoryRow[]): string | null {
  if (memories.length === 0) return null;
  const priority = memories.find((m) => m.category === "pedido_oracao" || m.category === "luta") ?? memories[0];
  const lower = priority.fact.charAt(0).toLowerCase() + priority.fact.slice(1);
  return `Que bom te ver de novo, irmão(ã)! Da nossa última conversa, guardei que ${lower} Como isso está?`;
}

/**
 * Chamado quando o usuário fecha o chat do Mentor: pede ao servidor para
 * extrair fatos duráveis da conversa (segundo prompt, curto e barato) e
 * salva o resultado na tabela mentor_memory. Nunca lança erro — memória é
 * um "nice to have", uma falha aqui não deve incomodar o usuário.
 */
export async function extractAndSaveMemory(
  userId: string,
  messages: { role: string; content: string }[],
): Promise<void> {
  const hasUserTurn = messages.some((m) => m.role === "user" && m.content.trim().length > 0);
  if (!hasUserTurn) return;

  try {
    const res = await fetch("/api/mentor/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) return;
    const { facts } = (await res.json()) as { facts?: { category: string; fact: string }[] };
    if (!facts || facts.length === 0) return;

    const rows = facts.map((f) => ({
      user_id: userId,
      category: (VALID_CATEGORIES.includes(f.category as MentorMemoryCategory)
        ? f.category
        : "outro") as MentorMemoryCategory,
      fact: f.fact,
    }));
    await supabase.from("mentor_memory").insert(rows);

    // Mantém só os N mais recentes — apaga o excedente mais antigo.
    const { data: all } = await supabase
      .from("mentor_memory")
      .select("id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const excess = (all ?? []).slice(MAX_STORED_FACTS);
    if (excess.length > 0) {
      await supabase.from("mentor_memory").delete().in("id", excess.map((e) => e.id));
    }
  } catch (e) {
    console.error("Memória do Mentor: falha ao extrair/salvar", e);
  }
}
