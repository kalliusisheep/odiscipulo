-- Leitura de mensagens, central de notificações e envio Web Push.
-- 06:00 no fuso America/Sao_Paulo corresponde a 09:00 UTC (o Brasil não usa horário de verão).

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS read_at timestamptz;
CREATE INDEX IF NOT EXISTS messages_unread_recipient_idx
  ON public.messages (recipient_id, created_at DESC) WHERE read_at IS NULL;

GRANT UPDATE (read_at) ON public.messages TO authenticated;
DROP POLICY IF EXISTS "messages_mark_own_received_as_read" ON public.messages;
CREATE POLICY "messages_mark_own_received_as_read" ON public.messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

CREATE TABLE IF NOT EXISTS public.app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('message', 'challenge', 'daily_reminder')),
  title text NOT NULL,
  body text NOT NULL,
  url text NOT NULL DEFAULT '/home',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);
CREATE INDEX IF NOT EXISTS app_notifications_pending_idx
  ON public.app_notifications (created_at) WHERE delivered_at IS NULL;
GRANT SELECT, UPDATE (delivered_at) ON public.app_notifications TO authenticated;
GRANT ALL ON public.app_notifications TO service_role;
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_select_own" ON public.app_notifications;
CREATE POLICY "notifications_select_own" ON public.app_notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_mark_own_delivered" ON public.app_notifications;
CREATE POLICY "notifications_mark_own_delivered" ON public.app_notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_notifications;

-- Enfileira um chamado assíncrono para a Edge Function a cada notificação nova.
-- A função não recebe dados sensíveis: ela busca apenas a fila pendente usando a service role.
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE OR REPLACE FUNCTION public.request_push_dispatch()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, net AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://qvplaksxqhdhsgipmbvu.supabase.co/functions/v1/dispatch-push',
    headers := '{"content-type":"application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS app_notifications_dispatch_push ON public.app_notifications;
CREATE TRIGGER app_notifications_dispatch_push
  AFTER INSERT ON public.app_notifications FOR EACH ROW EXECUTE FUNCTION public.request_push_dispatch();

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx ON public.push_subscriptions (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "push_subscriptions_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.queue_message_notification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
  VALUES (
    NEW.recipient_id,
    'message',
    'Nova mensagem',
    'Você recebeu uma nova mensagem.',
    '/mensagens',
    jsonb_build_object('sender_id', NEW.sender_id, 'message_id', NEW.id)
  );
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS messages_queue_notification ON public.messages;
CREATE TRIGGER messages_queue_notification
  AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION public.queue_message_notification();

CREATE OR REPLACE FUNCTION public.queue_challenge_notification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
  VALUES (
    NEW.challenged_id,
    'challenge',
    'Novo desafio',
    'Você recebeu um novo desafio no O Discípulo.',
    '/home',
    jsonb_build_object('challenge_id', NEW.id)
  );
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS challenges_queue_notification ON public.challenges;
CREATE TRIGGER challenges_queue_notification
  AFTER INSERT ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.queue_challenge_notification();

-- Gera o lembrete diário para todos os perfis. O despacho é feito pela Edge Function dispatch-push.
CREATE EXTENSION IF NOT EXISTS pg_cron;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-devotional-push') THEN
    PERFORM cron.schedule(
      'daily-devotional-push',
      '0 9 * * *',
      $job$
        INSERT INTO public.app_notifications (user_id, kind, title, body, url)
        SELECT id, 'daily_reminder', 'Bom dia! Hora de caminhar com Deus',
               'Separe alguns minutos para sua leitura e oração de hoje.', '/home'
        FROM public.profiles;
      $job$
    );
  END IF;
END;
$$;
