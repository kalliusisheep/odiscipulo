alter table public.character_game_rooms
  add column if not exists game_type text not null default 'personagem';

alter table public.character_game_rooms
  drop constraint if exists character_game_rooms_game_type_check;

alter table public.character_game_rooms
  add constraint character_game_rooms_game_type_check
  check (game_type in ('personagem', 'versiculo', 'cruzadas', 'milhao'));

drop function if exists public.create_character_game_room(smallint, text, smallint);

create or replace function public.create_character_game_room(
  _max_players smallint,
  _difficulty text,
  _rounds smallint,
  _game_type text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_room_id uuid;
begin
  if auth.uid() is null then
    raise exception 'session_required';
  end if;

  if _max_players not between 2 and 4 then
    raise exception 'invalid_max_players';
  end if;

  if _difficulty not in ('facil', 'medio', 'dificil', 'bereano') then
    raise exception 'invalid_difficulty';
  end if;

  if _rounds not between 5 and 30 then
    raise exception 'invalid_rounds';
  end if;

  if _game_type not in ('personagem', 'versiculo', 'cruzadas', 'milhao') then
    raise exception 'invalid_game_type';
  end if;

  insert into public.character_game_rooms (host_id, max_players, difficulty, rounds, game_type)
  values (auth.uid(), _max_players, _difficulty, _rounds, _game_type)
  returning id into new_room_id;

  insert into public.character_game_room_players (room_id, user_id, role, state)
  values (new_room_id, auth.uid(), 'host', 'connected');

  return new_room_id;
end;
$$;

grant execute on function public.create_character_game_room(smallint, text, smallint, text) to authenticated;
