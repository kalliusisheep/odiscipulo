create table if not exists public.character_game_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references auth.users(id) on delete cascade,
  max_players smallint not null default 2 check (max_players between 2 and 4),
  difficulty text not null default 'medio' check (difficulty in ('facil', 'medio', 'dificil', 'bereano')),
  rounds smallint not null default 10 check (rounds between 5 and 30),
  status text not null default 'lobby' check (status in ('lobby', 'playing', 'finished', 'cancelled')),
  current_round smallint not null default 0,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create table if not exists public.character_game_room_players (
  room_id uuid not null references public.character_game_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'player' check (role in ('host', 'player')),
  state text not null default 'invited' check (state in ('invited', 'waiting', 'connected', 'ready', 'disconnected', 'left')),
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.character_game_rounds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.character_game_rooms(id) on delete cascade,
  round_number smallint not null,
  character_id text not null,
  hints jsonb not null default '[]'::jsonb,
  revealed_hint_indexes smallint[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'won', 'all_wrong', 'expired')),
  winner_id uuid references auth.users(id) on delete set null,
  points_available integer not null default 100,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  unique (room_id, round_number)
);

create table if not exists public.character_game_answers (
  round_id uuid not null references public.character_game_rounds(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  answer_hash text not null,
  is_correct boolean not null default false,
  is_locked boolean not null default false,
  received_at timestamptz not null default now(),
  primary key (round_id, user_id)
);

alter table public.character_game_rooms enable row level security;
alter table public.character_game_room_players enable row level security;
alter table public.character_game_rounds enable row level security;
alter table public.character_game_answers enable row level security;

create or replace function public.is_character_game_member(_room_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.character_game_room_players
    where room_id = _room_id and user_id = auth.uid() and state <> 'left'
  );
$$;

create policy "room members can read rooms" on public.character_game_rooms for select using (
  public.is_character_game_member(id)
);
create policy "authenticated users can create rooms" on public.character_game_rooms for insert with check (host_id = auth.uid());
create policy "host can update room" on public.character_game_rooms for update using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "members can read players" on public.character_game_room_players for select using (
  public.is_character_game_member(room_id)
);
create policy "users can join rooms" on public.character_game_room_players for insert with check (user_id = auth.uid());
create policy "users update own player state" on public.character_game_room_players for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "members can read rounds" on public.character_game_rounds for select using (
  public.is_character_game_member(room_id)
);
create policy "members can read answers" on public.character_game_answers for select using (
  exists (select 1 from public.character_game_rounds r where r.id = round_id and public.is_character_game_member(r.room_id))
);
create policy "users submit own answers" on public.character_game_answers for insert with check (user_id = auth.uid());

create or replace function public.reveal_character_game_hint(_round_id uuid, _hint_index smallint)
returns public.character_game_rounds
language plpgsql
security definer
set search_path = public
as $$
declare updated_round public.character_game_rounds;
begin
  if not exists (
    select 1 from public.character_game_rounds r
    join public.character_game_room_players p on p.room_id = r.room_id
    where r.id = _round_id and p.user_id = auth.uid() and p.state in ('connected', 'ready')
  ) then raise exception 'not_allowed'; end if;
  update public.character_game_rounds
    set revealed_hint_indexes = array_append(revealed_hint_indexes, _hint_index),
        points_available = greatest(0, points_available - 40)
    where id = _round_id and status = 'active' and not (_hint_index = any(revealed_hint_indexes))
    returning * into updated_round;
  if updated_round.id is null then select * into updated_round from public.character_game_rounds where id = _round_id; end if;
  return updated_round;
end;
$$;

create or replace function public.submit_character_game_answer(_round_id uuid, _answer_hash text, _is_correct boolean)
returns public.character_game_rounds
language plpgsql
security definer
set search_path = public
as $$
declare updated_round public.character_game_rounds;
begin
  if not exists (
    select 1 from public.character_game_rounds r
    join public.character_game_room_players p on p.room_id = r.room_id
    where r.id = _round_id and p.user_id = auth.uid() and p.state in ('connected', 'ready')
  ) then raise exception 'not_allowed'; end if;
  insert into public.character_game_answers(round_id, user_id, answer_hash, is_correct, is_locked)
    values (_round_id, auth.uid(), _answer_hash, _is_correct, not _is_correct)
    on conflict (round_id, user_id) do nothing;
  update public.character_game_rounds
    set status = case when _is_correct then 'won' when (select count(*) from public.character_game_answers a where a.round_id = _round_id and a.is_locked) >= (select count(*) from public.character_game_room_players p where p.room_id = character_game_rounds.room_id and p.state in ('connected', 'ready')) then 'all_wrong' else status end,
        winner_id = case when _is_correct and status = 'active' then auth.uid() else winner_id end,
        closed_at = case when _is_correct and status = 'active' then now() else closed_at end
    where id = _round_id and status = 'active';
  select * into updated_round from public.character_game_rounds where id = _round_id;
  return updated_round;
end;
$$;
