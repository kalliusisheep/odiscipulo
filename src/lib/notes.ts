// CRUD de "Minhas Notas" — segue o mesmo padrão dos demais arquivos em
// src/lib/*.ts (funções puras que encapsulam chamadas ao supabase client).

import { supabase } from "@/integrations/supabase/client";

export type NoteSourceType = "selecao_texto" | "manual" | "scan_pdf" | "scan_word" | "scan_foto";
export type NoteSourceContentType = "trilha" | "estudo" | "plano_leitura";

export type Note = {
  id: string;
  user_id: string;
  title: string;
  // Documento JSON do Tiptap (ver src/routes/_authenticated/notas.nova.tsx).
  content: Record<string, unknown>;
  source_type: NoteSourceType;
  source_content_id: string | null;
  source_content_type: NoteSourceContentType | null;
  source_content_title: string | null;
  exported_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NoteListItem = Pick<
  Note,
  "id" | "title" | "content" | "source_type" | "source_content_title" | "created_at"
>;

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

/** Cria uma nota em branco (fluxo "Criar Anotação") e retorna o registro já criado. */
export async function createBlankNote(): Promise<Note> {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      title: "Nova anotação",
      content: EMPTY_DOC,
      source_type: "manual" as NoteSourceType,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Note;
}

/** Cria uma nota já a partir de um trecho selecionado em uma trilha/estudo/plano (Bloco 1). */
export async function createNoteFromSelection(params: {
  text: string;
  title: string;
  sourceContentId: string;
  sourceContentType: NoteSourceContentType;
  sourceContentTitle: string;
}): Promise<Note> {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes.user?.id;
  if (!userId) throw new Error("Usuário não autenticado.");

  const doc = {
    type: "doc",
    content: params.text
      .split(/\n+/)
      .filter(Boolean)
      .map((paragraph) => ({ type: "paragraph", content: [{ type: "text", text: paragraph }] })),
  };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      title: params.title,
      content: doc.content.length ? doc : EMPTY_DOC,
      source_type: "selecao_texto" as NoteSourceType,
      source_content_id: params.sourceContentId,
      source_content_type: params.sourceContentType,
      source_content_title: params.sourceContentTitle,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Note;
}

export async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabase.from("notes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Note | null;
}

export async function listNotes(): Promise<NoteListItem[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, source_type, source_content_title, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NoteListItem[];
}

/** Salvamento incremental (autosave) — título, conteúdo e/ou origem (ex: após um Scan Inteligente). */
export async function updateNote(
  id: string,
  patch: Partial<Pick<Note, "title" | "content" | "source_type">>,
): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .update(patch as Record<string, unknown>)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}

export async function markNoteExported(id: string): Promise<void> {
  await supabase.from("notes").update({ exported_at: new Date().toISOString() }).eq("id", id);
}

export async function logNoteAiAction(
  noteId: string,
  actionType: "reescrever" | "estruturar" | "titulo" | "scan_transcricao" | "scan_reescrita" | "scan_estrutura",
): Promise<void> {
  const { data: userRes } = await supabase.auth.getUser();
  const userId = userRes.user?.id;
  if (!userId) return;
  await supabase.from("note_ai_actions").insert({ note_id: noteId, user_id: userId, action_type: actionType });
}

/** Extrai texto puro de um documento Tiptap — usado para mandar contexto pra IA. */
export function plainTextFromDoc(doc: Record<string, unknown>): string {
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { type?: string; text?: string; content?: unknown[] };
    if (n.type === "text" && n.text) parts.push(n.text);
    if (Array.isArray(n.content)) n.content.forEach(walk);
    if (n.type === "paragraph" || n.type === "heading") parts.push("\n");
  };
  walk(doc);
  return parts.join(" ").replace(/\s+\n/g, "\n").trim();
}
