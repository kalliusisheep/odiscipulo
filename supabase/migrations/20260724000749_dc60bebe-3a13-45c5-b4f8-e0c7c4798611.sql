REVOKE EXECUTE ON FUNCTION public.add_friend(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.add_friend(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.add_friend(uuid) TO authenticated;