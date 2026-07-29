-- BUG: public.challenge_progress() era uma função comum (invoker), então ao
-- consultar o progresso do OPONENTE ela rodava sob a política de RLS
-- "lp_own" da tabela lesson_progress (USING auth.uid() = user_id). Isso
-- filtrava silenciosamente todas as lições do adversário, fazendo o
-- percentual dele aparecer sempre como 0% no card de desafio, mesmo que ele
-- estivesse avançando normalmente.
--
-- Correção: tornar a função SECURITY DEFINER (como finish_challenge_step já
-- é) para que ela enxergue as linhas de ambos os participantes, mas
-- restringindo explicitamente quem pode chamá-la: só um dos dois
-- participantes do desafio pode consultar, e só o progresso de alguém que
-- também participa daquele mesmo desafio — evitando expor o progresso de
-- lição de qualquer usuário arbitrário.
CREATE OR REPLACE FUNCTION public.challenge_progress(_user uuid, _challenge_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.challenges%ROWTYPE;
  total int;
  done int;
BEGIN
  SELECT * INTO c FROM public.challenges WHERE id = _challenge_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Só participantes do desafio podem consultar, e apenas o progresso de
  -- quem também participa dele.
  IF auth.uid() IS DISTINCT FROM c.challenger_id AND auth.uid() IS DISTINCT FROM c.challenged_id THEN
    RETURN 0;
  END IF;
  IF _user IS DISTINCT FROM c.challenger_id AND _user IS DISTINCT FROM c.challenged_id THEN
    RETURN 0;
  END IF;

  SELECT count(*) INTO total FROM public.challenge_lesson_ids(c.scope_type, c.scope_id);
  IF total = 0 THEN RETURN 0; END IF;

  SELECT count(*) INTO done
  FROM public.lesson_progress lp
  WHERE lp.user_id = _user
    AND lp.lesson_id IN (SELECT public.challenge_lesson_ids(c.scope_type, c.scope_id));

  RETURN round((done::numeric / total::numeric) * 100, 1);
END;
$$;

REVOKE ALL ON FUNCTION public.challenge_progress(uuid, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.challenge_progress(uuid, uuid) TO authenticated;
