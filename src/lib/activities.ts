import { supabase } from "@/integrations/supabase/client";

export type ActivityType =
  | "lesson_completed"
  | "reading_plan_started"
  | "bible_study_started"
  | "avatar_changed"
  | "bio_changed";

type LogActivityParams = {
  userId: string;
  type: ActivityType;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
};

/**
 * Registra uma atividade real do usuário na tabela `activities`, que alimenta
 * a aba Feed do Mural (visível para os amigos adicionados, via RLS).
 * Best-effort: nunca deve travar o fluxo principal da tela que a chama.
 */
export async function logActivity({ userId, type, title, subtitle, imageUrl }: LogActivityParams): Promise<boolean> {
  try {
    const { error } = await supabase.from("activities").insert({
      user_id: userId,
      type,
      title,
      subtitle: subtitle ?? null,
      image_url: imageUrl ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Mesma coisa que `logActivity`, mas só registra uma vez por usuário/chave —
 * usa localStorage para não duplicar eventos do tipo "iniciou X" toda vez que
 * a pessoa reabre a mesma trilha, plano ou estudo.
 */
export async function logActivityOnce(key: string, params: LogActivityParams) {
  if (typeof window === "undefined") return;
  const storageKey = `disciple.activity-once.${key}`;
  if (window.localStorage.getItem(storageKey)) return;
  const logged = await logActivity(params);
  if (logged) window.localStorage.setItem(storageKey, "1");
}
