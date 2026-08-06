create table if not exists public.mentor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text,
  audio_url text,
  audio_duration_seconds integer,
  created_at timestamptz not null default now(),
  constraint mentor_messages_has_content check (nullif(trim(content), '') is not null or audio_url is not null)
);

create index if not exists mentor_messages_user_created_idx
  on public.mentor_messages (user_id, created_at);

alter table public.mentor_messages enable row level security;

drop policy if exists "Users can read their mentor messages" on public.mentor_messages;
create policy "Users can read their mentor messages"
  on public.mentor_messages for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their mentor messages" on public.mentor_messages;
create policy "Users can create their mentor messages"
  on public.mentor_messages for insert
  with check (auth.uid() = user_id);
