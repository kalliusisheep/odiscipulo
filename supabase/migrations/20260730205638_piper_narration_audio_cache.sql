-- Cria o bucket público usado como cache dos áudios gerados pelo Piper TTS.
-- Áudio já gerado para um texto fica salvo aqui, então a próxima pessoa que
-- ouvir a mesma lição não precisa esperar o servidor Piper gerar de novo.
insert into storage.buckets (id, name, public)
values ('narration-audio', 'narration-audio', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode ouvir o áudio já gerado (conteúdo público: só lições do app).
create policy "Narração pública para leitura"
on storage.objects for select
to public
using (bucket_id = 'narration-audio');
