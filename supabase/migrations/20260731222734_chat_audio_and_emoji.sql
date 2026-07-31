-- Suporte a notas de voz e mensagens só-de-emoji no chat 1:1.
-- body passa a ser opcional (mensagem pode ser só áudio), e ganhamos
-- audio_url / audio_duration_seconds no mesmo padrão já usado em mural_posts.

ALTER TABLE public.messages ALTER COLUMN body DROP NOT NULL;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS audio_duration_seconds integer;
ALTER TABLE public.messages ADD CONSTRAINT messages_body_or_audio
  CHECK (body IS NOT NULL OR audio_url IS NOT NULL);

-- Bucket privado (URLs assinadas, não públicas) para as notas de voz do chat 1:1.
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-voice-messages', 'chat-voice-messages', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "chat_voice_upload_own_folder" ON storage.objects;
CREATE POLICY "chat_voice_upload_own_folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-voice-messages' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Necessário para o próprio remetente conseguir gerar a signed URL logo após o upload.
DROP POLICY IF EXISTS "chat_voice_select_own_folder" ON storage.objects;
CREATE POLICY "chat_voice_select_own_folder" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'chat-voice-messages' AND auth.uid()::text = (storage.foldername(name))[1]);
