-- Personaliza as notificações de mensagem e desafio com o nome de quem enviou
-- e, no caso de mensagens, um preview do texto.

CREATE OR REPLACE FUNCTION public.queue_message_notification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sender_name text;
  preview text;
BEGIN
  SELECT COALESCE(display_name, username, 'Alguém')
    INTO sender_name
    FROM public.profiles
    WHERE id = NEW.sender_id;

  preview := NEW.body;
  IF length(preview) > 100 THEN
    preview := left(preview, 97) || '...';
  END IF;

  INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
  VALUES (
    NEW.recipient_id,
    'message',
    sender_name,
    preview,
    '/mensagens',
    jsonb_build_object('sender_id', NEW.sender_id, 'message_id', NEW.id)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.queue_challenge_notification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  challenger_name text;
BEGIN
  SELECT COALESCE(display_name, username, 'Alguém')
    INTO challenger_name
    FROM public.profiles
    WHERE id = NEW.challenger_id;

  INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
  VALUES (
    NEW.challenged_id,
    'challenge',
    challenger_name || ' te desafiou',
    'Toque para aceitar o desafio no O Discípulo.',
    '/home',
    jsonb_build_object('challenge_id', NEW.id)
  );
  RETURN NEW;
END;
$$;
