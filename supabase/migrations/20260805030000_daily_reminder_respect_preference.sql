-- Lembretes diários só entram na fila para quem optou por recebê-los.
-- Os horários continuam em 06:00 e 20:00 no fuso de São Paulo (09:00 e 23:00 UTC).

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-devotional-push-morning') THEN
    PERFORM cron.unschedule('daily-devotional-push-morning');
  END IF;

  PERFORM cron.schedule(
    'daily-devotional-push-morning',
    '0 9 * * *',
    $job$
      INSERT INTO public.app_notifications (user_id, kind, title, body, url)
      SELECT id, 'daily_reminder', 'Barnabé, seu Mentor IA',
             'Bom dia, vamos começar o dia com a Palavra?', '/home'
      FROM public.profiles
      WHERE notify_devocional IS TRUE;
    $job$
  );
END;
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-devotional-push-evening') THEN
    PERFORM cron.unschedule('daily-devotional-push-evening');
  END IF;

  PERFORM cron.schedule(
    'daily-devotional-push-evening',
    '0 23 * * *',
    $job$
      INSERT INTO public.app_notifications (user_id, kind, title, body, url)
      SELECT id, 'daily_reminder', 'Barnabé, seu Mentor IA',
             'Boa noite, vamos fazer uma leitura da Palavra?', '/home'
      FROM public.profiles
      WHERE notify_devocional IS TRUE;
    $job$
  );
END;
$$;
