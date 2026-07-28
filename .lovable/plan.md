## 1. Correção — botão "Voltar" do chat

Em `mensagens.$username.tsx`, trocar o `<Link to="/perfil/$username">` do header por `<Link to="/mensagens">`, retornando para a lista de conversas.

## 2. Sistema de Desafios

### Banco de dados (nova migração)
Nova tabela `public.challenges`:
- `id uuid pk`, `challenger_id uuid`, `challenged_id uuid`
- `scope_type text check in ('module','trail')`, `scope_id text` (id do módulo ou da trilha)
- `status text check in ('pending','accepted','rejected','completed','canceled') default 'pending'`
- `first_finisher_id uuid null`, `first_finished_at timestamptz null`, `second_finished_at timestamptz null`
- `winner_bonus_awarded bool default false`, `completion_bonus_awarded bool default false`
- `created_at`, `accepted_at`

GRANTs padrão + RLS: SELECT/INSERT/UPDATE apenas para envolvidos (challenger/challenged). Índices por participante e status.

Função `public.challenge_lesson_ids(_scope_type text, _scope_id text) returns setof text` — retorna os `lesson_id`s associados ao escopo, via `disciple_trails` (por `id` da trilha ou pelo `module_id`).

Função `public.challenge_progress(_user uuid, _challenge_id uuid) returns numeric` — % concluída pelo usuário (lesson_progress ∩ lesson_ids do escopo).

Função `public.finish_challenge_step(_challenge_id uuid)` (SECURITY DEFINER) — chamada pelo cliente após completar qualquer lição. Verifica se o `auth.uid()` atingiu 100% do escopo; se sim e nenhum vencedor ainda, marca `first_finisher_id`+`first_finished_at` e credita bônus de vitória; se ambos já concluíram, credita bônus de conclusão dupla e marca `status='completed'`. Idempotente via flags de bônus.

**Balanceamento de XP** (evitar quebrar economia):
- Vitória: `+150 XP` para o primeiro (equivalente a 1,5 lição).
- Conclusão dupla: `+75 XP` extra para cada um.
- Perdedor ganha `+50 XP` de participação ao terminar.
Escala fixa, não multiplicativa por tamanho de escopo, pois trilhas já dão XP por lição.

### Backend/Frontend

**`src/lib/challenges.ts`** — helpers cliente:
- `listMyActiveChallenges(myId)` — retorna desafios `accepted` e `pending`.
- `getPeerActiveChallenges(myId, peerId)` — desafios entre nós dois.
- `getChallengeLessonIds(challengeId)` — via RPC.
- `getChallengeProgressPct(challengeId, userId)` — via RPC.
- `createChallenge({ target, scopeType, scopeId })`, `respondChallenge(id, accept)`, `checkFinishChallenges(myId)` — chama `finish_challenge_step` para cada desafio ativo do usuário após completar uma lição.

**`src/components/ChallengeButton.tsx`** — botão "DESAFIAR" no perfil público (`perfil_.$username.tsx`) que abre modal:
- Lista módulos (checkbox único) + accordion mostrando trilhas de cada módulo.
- Uma seleção só: módulo inteiro OU uma trilha.
- Botão "Enviar desafio" → cria linha pending.

**Notificação/aceite**: pending recebido aparece como card no topo da Home (`home.tsx`) e no perfil público do desafiante, com botões Aceitar / Recusar.

**Barra de progresso em chamas** (`ChallengeProgressBar`) — componente novo, renderizado na Home logo abaixo do card de XP quando há desafio ativo. Gradiente âmbar→vermelho, animação `flame-pulse` já ou nova em `styles.css`. Mostra `Meu %` e `% do rival`, título do escopo, ícone.

**Anel flamejante em avatares** — nova classe `.avatar-ring-flame` em `styles.css` (conic-gradient rotativo + glow). Aplicada em:
- Lista do Ranking (`ranking.tsx`) e pódio, quando o usuário estiver em desafio ativo.
- Lista de mensagens (`mensagens.index.tsx`).
Fetch em batch: `getActiveChallengeUserIds()` (Set de ids) para O(1) na renderização.

**Gatilho de finalização**: em `awardXpAndStreak` (ou onde a lição é marcada concluída) chamar `checkFinishChallenges(userId)` após persistir progresso. Locais: `licao.$id.tsx`, `estudos.biblico.$id.tsx`, `estudos.plano.$id.tsx`, `estudos.meditacao.$id.tsx`. Centralizar em `src/lib/progress.ts` para não repetir.

### Arquivos tocados
- Nova migração SQL.
- Novo: `src/lib/challenges.ts`, `src/components/ChallengeButton.tsx`, `src/components/ChallengeProgressBar.tsx`.
- Editados: `mensagens.$username.tsx` (fix voltar), `perfil_.$username.tsx` (botão DESAFIAR + pending), `home.tsx` (barra + card pending), `ranking.tsx` (anel), `mensagens.index.tsx` (anel), `progress.ts` (chamar checkFinishChallenges), `styles.css` (anel + chamas).

### Fora de escopo
Notificação push. Chat de desafio dedicado. Ranking global de desafios.
