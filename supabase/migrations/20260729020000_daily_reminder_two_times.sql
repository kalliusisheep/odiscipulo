-- Substitui o lembrete diário único (06:00) por dois lembretes personalizados
-- como mensagem do Mentor IA: manhã (06:00) e noite (20:00), horário de São Paulo.
-- América/Sao_Paulo não observa horário de verão: 06:00 = 09:00 UTC e 20:00 = 23:00 UTC.
-- O ícone/avatar do Mentor IA (isheep-img.png) já é aplicado pelo Service Worker
-- (public/push-sw.js) a toda notificação recebida, então não precisa ser repetido aqui.

-- Remove o job antigo (um único horário, texto genérico), se existir.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-devotional-push') THEN
    PERFORM cron.unschedule('daily-devotional-push');
  END IF;
END;
$$;

-- Lembrete da manhã — 06:00 São Paulo / 09:00 UTC.
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
      FROM public.profiles;
    $job$
  );
END;
$$;

-- Lembrete da noite — 20:00 São Paulo / 23:00 UTC.
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
      FROM public.profiles;
    $job$
  );
END;
$$;
