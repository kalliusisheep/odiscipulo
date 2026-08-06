import { format, isSameDay, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export async function touchLastSeen() {
  await supabase.rpc("touch_last_seen");
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
