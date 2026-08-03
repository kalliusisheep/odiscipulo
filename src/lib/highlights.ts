// CRUD de marcações permanentes (marca-texto) sobre conteúdo de
// trilhas/estudos/planos de leitura — Bloco 1 do spec de Minhas Notas.

import { supabase } from "@/integrations/supabase/client";

export type HighlightContentType = "trilha" | "estudo" | "plano_leitura";
export type HighlightColor = "amarelo" | "verde" | "azul" | "rosa" | "laranja" | "branco";

export type Highlight = {
  id: string;
  content_id: string;
  content_type: HighlightContentType;
  field_key: string;
  start_offset: number;
  end_offset: number;
  highlighted_text: string;
  color: HighlightColor;
};

// Cada entrada já inclui a cor do texto (não depender de "text-inherit"
// aplicado externamente: como todas as classes Tailwind têm a mesma
// especificidade, a ordem de qual "color:" vence no CSS final não é
// garantida pela ordem no atributo className).
// "branco" é especial: para continuar legível nos dois temas, ela se
// inverte — no modo claro (fundo do app claro), um marca-texto branco de
// verdade ficaria invisível, então renderiza como fundo preto + texto
// branco; no modo escuro, fundo branco + texto preto, como um marca-texto
// branco normal.
export const HIGHLIGHT_COLOR_CLASS: Record<HighlightColor, string> = {
  amarelo: "bg-yellow-300/50 dark:bg-yellow-400/30 text-inherit",
  verde: "bg-green-300/50 dark:bg-green-400/30 text-inherit",
  azul: "bg-blue-300/50 dark:bg-blue-400/30 text-inherit",
  rosa: "bg-pink-300/50 dark:bg-pink-400/30 text-inherit",
  laranja: "bg-orange-300/50 dark:bg-orange-400/30 text-inherit",
  branco: "bg-black text-white dark:bg-white dark:text-black",
};

/** Busca todas as marcações do usuário atual para um conteúdo específico. */
export async function listHighlights(
  contentId: string,
  contentType: HighlightContentType,
): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from("highlights")
    .select(
      "id, content_id, content_type, field_key, start_offset, end_offset, highlighted_text, color",
    )
    .eq("content_id", contentId)
    .eq("content_type", contentType);
  if (error) throw error;
  return (data ?? []) as Highlight[];
}

export async function createHighlight(params: {
  contentId: string;
  contentType: HighlightContentType;
  fieldKey: string;
  startOffset: number;
  endOffset: number;
  highlightedText: string;
  color?: HighlightColor;
}): Promise<Highlight> {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("highlights")
    .insert({
      user_id: userId,
      content_id: params.contentId,
      content_type: params.contentType,
      field_key: params.fieldKey,
      start_offset: params.startOffset,
      end_offset: params.endOffset,
      highlighted_text: params.highlightedText,
      color: params.color ?? "amarelo",
    })
    .select(
      "id, content_id, content_type, field_key, start_offset, end_offset, highlighted_text, color",
    )
    .single();
  if (error) throw error;
  return data as Highlight;
}

export async function deleteHighlight(id: string): Promise<void> {
  const { error } = await supabase.from("highlights").delete().eq("id", id);
  if (error) throw error;
}
