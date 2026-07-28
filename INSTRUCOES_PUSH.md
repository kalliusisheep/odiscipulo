# Notificações do O Discípulo

Os arquivos desta entrega já incluem a migração SQL, o Service Worker e a Edge Function. Ao enviar o projeto ao GitHub conectado ao Lovable, mantenha a pasta `supabase/` inteira: ela contém a estrutura do banco e o código de entrega de push.

## Uma única configuração de publicação

Push verdadeiro (com o navegador fechado) exige chaves VAPID, que não podem ser colocadas no GitHub porque a chave privada é secreta. No ambiente de publicação, crie estes quatro segredos:

- `WEB_PUSH_VAPID_SUBJECT`: por exemplo, `mailto:suporte@seudominio.com`
- `WEB_PUSH_VAPID_PUBLIC_KEY`: chave pública VAPID
- `WEB_PUSH_VAPID_PRIVATE_KEY`: chave privada VAPID
- `VITE_WEB_PUSH_VAPID_PUBLIC_KEY`: a mesma chave pública VAPID

Depois publique a função `dispatch-push` presente em `supabase/functions/dispatch-push/`. A função recebe a fila criada pela migração e envia a notificação com a imagem `/isheep-img.png`.

## O que acontece depois

1. No primeiro acesso à tela inicial, o sino pede autorização de notificações.
2. Ao aceitar, o dispositivo é registrado.
3. Novas mensagens e novos desafios entram na fila e são enviados automaticamente.
4. Todos os dias às 06:00 de São Paulo, a migração cria e dispara o lembrete devocional. O horário é agendado como 09:00 UTC.

Sem as chaves e a publicação da Edge Function, o app continua mostrando notificações enquanto está aberto, mas o navegador não consegue receber push em segundo plano. Essa limitação é de segurança dos navegadores e não pode ser resolvida somente com SQL ou código no GitHub.
