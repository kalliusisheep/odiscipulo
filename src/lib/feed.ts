import { supabase } from "@/integrations/supabase/client";

// ============================================================
// Tipos do Feed — usados em src/routes/_authenticated/mural.tsx
// ============================================================

export type FeedKind =
  | "post"
  | "lesson_completed"
  | "module_completed"
  | "reading_plan_started"
  | "bible_study_started"
  | "avatar_changed"
  | "bio_changed";

export type FeedItem = {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar_url: string | null;
  kind: FeedKind;
  body: string;
  created_at: string;
};

// ------------------------------------------------------------
// Helper interno: busca o nome/avatar atual do perfil e insere
// o item no feed. Cada evento guarda uma "foto" do momento (nome
// e avatar de quando o evento aconteceu), então o histórico não
// muda retroativamente se o usuário trocar de nome/foto depois.
// ------------------------------------------------------------
async function insertFeedItem(params: { userId: string; kind: FeedKind; body: string }) {
  const { data: prof } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", params.userId)
    .maybeSingle();

  await supabase.from("feed_items").insert({
    user_id: params.userId,
    author_name: prof?.display_name ?? "Discípulo",
    author_avatar_url: prof?.avatar_url ?? null,
    kind: params.kind,
    body: params.body,
  });
}

// ------------------------------------------------------------
// Lição concluída — busca a trilha e o módulo para montar a frase
// "Terminou a trilha X do módulo X".
// ------------------------------------------------------------
export async function logLessonCompletionToFeed(userId: string, lessonId: string, lessonTitle: string) {
  const { data: trail } = await supabase
    .from("disciple_trails")
    .select("module_id, title")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  let moduleTitle: string | null = null;
  if (trail?.module_id) {
    const { data: mod } = await supabase
      .from("disciple_modules")
      .select("title")
      .eq("id", trail.module_id)
      .maybeSingle();
    moduleTitle = mod?.title ?? null;
  }

  const trailTitle = trail?.title ?? lessonTitle;
  const body = moduleTitle
    ? `Terminou a trilha "${trailTitle}" do módulo "${moduleTitle}"`
    : `Terminou a trilha "${trailTitle}"`;

  await insertFeedItem({ userId, kind: "lesson_completed", body });
}

// ------------------------------------------------------------
// Módulo concluído
// ------------------------------------------------------------
export async function logModuleCompletionToFeed(userId: string, moduleTitle: string) {
  await insertFeedItem({ userId, kind: "module_completed", body: `Completou o módulo "${moduleTitle}"` });
}

// ------------------------------------------------------------
// Plano de leitura iniciado
// ------------------------------------------------------------
export async function logReadingPlanStartToFeed(userId: string, planTitle: string) {
  await insertFeedItem({
    userId,
    kind: "reading_plan_started",
    body: `Iniciou o plano de leitura "${planTitle}"`,
  });
}

// ------------------------------------------------------------
// Estudo bíblico iniciado
// ------------------------------------------------------------
export async function logBibleStudyStartToFeed(userId: string, studyTitle: string) {
  await insertFeedItem({
    userId,
    kind: "bible_study_started",
    body: `Iniciou o estudo bíblico "${studyTitle}"`,
  });
}

// ------------------------------------------------------------
// Foto de perfil trocada — chamar DEPOIS de já ter salvo a nova
// avatar_url no profile, para que o snapshot capture a foto nova.
// ------------------------------------------------------------
export async function logAvatarChangeToFeed(userId: string) {
  await insertFeedItem({ userId, kind: "avatar_changed", body: "" });
}

// ------------------------------------------------------------
// Bio trocada — body carrega o texto da nova bio para exibição
// ------------------------------------------------------------
export async function logBioChangeToFeed(userId: string, newBio: string) {
  await insertFeedItem({ userId, kind: "bio_changed", body: newBio });
}
