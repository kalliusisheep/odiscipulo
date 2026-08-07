import { supabase } from "@/integrations/supabase/client";

type FriendshipRow = {
  user_id: string;
  friend_id: string;
};

/**
 * Retorna os IDs dos contatos aceitos pelo usuário autenticado.
 *
 * A tabela friendships normalmente guarda duas linhas por amizade, mas a
 * consulta também considera registros antigos em apenas uma direção para que
 * nenhum contato válido desapareça do escopo social.
 */
export async function getContactIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("friendships")
    .select("user_id, friend_id")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

  if (error) return [];

  const ids = new Set<string>();
  for (const row of (data ?? []) as FriendshipRow[]) {
    if (row.user_id === userId) ids.add(row.friend_id);
    if (row.friend_id === userId) ids.add(row.user_id);
  }

  ids.delete(userId);
  return Array.from(ids);
}

export async function getVisibleUserIds(userId: string): Promise<string[]> {
  return Array.from(new Set([userId, ...(await getContactIds(userId))]));
}
