import { format, isSameDay, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export async function touchLastSeen() {
  const now = new Date().toISOString();
  const { error } = await supabase.rpc("touch_last_seen");
  if (!error) return;

  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  // Compatibilidade com ambientes onde a migração ainda não foi aplicada.
  const fallback = await supabase
    .from("profiles")
    .update({ last_seen_at: now })
    .eq("id", data.user.id);
  if (fallback.error) {
    await supabase.from("profiles").update({ updated_at: now }).eq("id", data.user.id);
  }
}

export function isPresenceOnline(lastSeenAt: string | null | undefined) {
  if (!lastSeenAt) return false;
  const date = new Date(lastSeenAt);
  if (Number.isNaN(date.getTime())) return false;
  const minutesAgo = (Date.now() - date.getTime()) / 60000;
  return minutesAgo >= 0 && minutesAgo < 5;
}

export function formatPresence(lastSeenAt: string | null | undefined) {
  if (!lastSeenAt) return "Último acesso indisponível";
  const date = new Date(lastSeenAt);
  if (Number.isNaN(date.getTime())) return "Último acesso indisponível";

  const minutesAgo = (Date.now() - date.getTime()) / 60000;
  if (minutesAgo < 5) return "Online agora";
  if (isSameDay(date, new Date())) return `Visto hoje às ${format(date, "HH:mm")}`;
  if (isYesterday(date)) return `Visto ontem às ${format(date, "HH:mm")}`;
  return `Visto em ${format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`;
}
