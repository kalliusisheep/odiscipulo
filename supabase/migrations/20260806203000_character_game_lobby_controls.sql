create or replace function public.remove_character_game_player(
  _room_id uuid,
  _user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.character_game_rooms
    where id = _room_id and host_id = auth.uid() and status = 'lobby'
  ) then
    raise exception 'not_allowed';
  end if;

  if _user_id = auth.uid() then
    raise exception 'cannot_remove_host';
  end if;

  update public.character_game_room_players
  set state = 'left', last_seen_at = now()
  where room_id = _room_id and user_id = _user_id and state <> 'left';

  return found;
end;
$$;

grant execute on function public.remove_character_game_player(uuid, uuid) to authenticated;
