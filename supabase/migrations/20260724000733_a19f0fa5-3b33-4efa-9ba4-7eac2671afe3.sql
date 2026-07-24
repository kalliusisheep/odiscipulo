
CREATE OR REPLACE FUNCTION public.add_friend(_target uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _me uuid := auth.uid();
BEGIN
  IF _me IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF _target IS NULL OR _target = _me THEN
    RAISE EXCEPTION 'invalid target';
  END IF;
  INSERT INTO public.friendships (user_id, friend_id) VALUES (_me, _target)
    ON CONFLICT DO NOTHING;
  INSERT INTO public.friendships (user_id, friend_id) VALUES (_target, _me)
    ON CONFLICT DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_friend(uuid) TO authenticated;
