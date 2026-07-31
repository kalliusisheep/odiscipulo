import { supabase } from "@/integrations/supabase/client";

function extensionFor(mimeType: string): string {
  if (mimeType.includes("mp4")) return "m4a";
  if (mimeType.includes("ogg")) return "ogg";
  return "webm";
}

/** Sobe uma nota de voz pública (mural de orações) e devolve a URL pública, pronta para tocar. */
export async function uploadMuralVoiceNote(userId: string, blob: Blob, mimeType: string): Promise<string> {
  const ext = extensionFor(mimeType);
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("mural-voice-notes")
    .upload(path, blob, { contentType: mimeType || "audio/webm", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("mural-voice-notes").getPublicUrl(path);
  return data.publicUrl;
}

/** Sobe uma mensagem de voz privada (chat 1:1) e devolve uma URL assinada de longa duração. */
export async function uploadChatVoiceMessage(userId: string, blob: Blob, mimeType: string): Promise<string> {
  const ext = extensionFor(mimeType);
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("chat-voice-messages")
    .upload(path, blob, { contentType: mimeType || "audio/webm", upsert: false });
  if (error) throw error;
  // Mesmo padrão já usado para avatares (perfil.tsx): a policy de storage é
  // só uma segunda camada — o controle de acesso real é a assinatura da URL.
  const { data: signed, error: signErr } = await supabase.storage
    .from("chat-voice-messages")
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr || !signed) throw signErr ?? new Error("Falha ao gerar URL assinada");
  return signed.signedUrl;
}
