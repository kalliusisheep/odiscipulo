import { supabase } from "@/integrations/supabase/client";

export type ChurchOption = {
  id: string;
  name: string;
};

// Precisa espelhar a função SQL public.normalize_church_name (minúsculas,
// sem acento, sem pontuação/espaços duplicados) para que a busca no cliente
// encontre os mesmos resultados que o índice único no banco.
export function normalizeChurchName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export async function searchChurches(query: string, limit = 8): Promise<ChurchOption[]> {
  const norm = normalizeChurchName(query);
  if (norm.length < 2) return [];
  const { data, error } = await supabase
    .from("churches")
    .select("id, name")
    .ilike("normalized_name", `%${norm}%`)
    .order("name")
    .limit(limit);
  if (error) return [];
  return (data ?? []) as ChurchOption[];
}

// Vincula (criando a igreja no diretório se ainda não existir) o usuário
// autenticado à igreja informada pelo nome.
export async function createAndLinkChurch(name: string): Promise<ChurchOption | null> {
  const trimmed = name.trim();
  if (normalizeChurchName(trimmed).length < 2) return null;

  const { data: churchId, error: rpcError } = await supabase.rpc("find_or_create_church", { _name: trimmed });
  if (rpcError || !churchId) return null;

  return { id: churchId as string, name: trimmed };
}

export async function linkProfileToChurch(userId: string, churchId: string | null): Promise<boolean> {
  const { error } = await supabase.from("profiles").update({ church_id: churchId }).eq("id", userId);
  return !error;
}
