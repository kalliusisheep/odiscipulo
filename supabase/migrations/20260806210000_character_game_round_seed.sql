alter table public.character_game_rooms
  add column if not exists round_seed bigint not null default floor(random() * 2147483647)::bigint;
