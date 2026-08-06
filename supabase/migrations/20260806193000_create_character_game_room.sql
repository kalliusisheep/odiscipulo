create or replace function public.create_character_game_room(
  _max_players smallint,
  _difficulty text,
  _rounds smallint
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

  insert into public.character_game_rooms (host_id, max_players, difficulty, rounds)
  values (auth.uid(), _max_players, _difficulty, _rounds)
  returning id into new_room_id;

  insert into public.character_game_room_players (room_id, user_id, role, state)
  values (new_room_id, auth.uid(), 'host', 'connected');

  return new_room_id;
end;
$$;

grant execute on function public.create_character_game_room(smallint, text, smallint) to authenticated;
