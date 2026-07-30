DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-devotional-push-morning') THEN
    PERFORM cron.unschedule('daily-devotional-push-morning');
  END IF;
  PERFORM cron.schedule(
    'daily-devotional-push-morning',
    '0 9 * * *',
    $job$
      INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
      SELECT p.id,
             'daily_reminder',
             'Barnabé, seu Mentor IA',
             'Bom dia, ' || split_part(COALESCE(NULLIF(p.first_name, ''), p.display_name, 'irmão'), ' ', 1) || ', vamos começar o dia com a Palavra?',
             '/home',
             jsonb_build_object('icon', '/isheep-img.png', 'period', 'morning')
      FROM public.profiles p;
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
      INSERT INTO public.app_notifications (user_id, kind, title, body, url, data)
      SELECT p.id,
             'daily_reminder',
             'Barnabé, seu Mentor IA',
             'Boa noite, ' || split_part(COALESCE(NULLIF(p.first_name, ''), p.display_name, 'irmão'), ' ', 1) || '. Vamos fazer uma leitura da Palavra?',
             '/home',
             jsonb_build_object('icon', '/isheep-img.png', 'period', 'evening')
      FROM public.profiles p;
    $job$
  );
END;
$$;