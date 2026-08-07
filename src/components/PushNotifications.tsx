import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listenForSubscriptionChange, syncSubscription } from "@/lib/push";

type AppNotification = { id?: string; title?: string; body?: string; url?: string };

export function PushNotifications() {
  useEffect(() => {
    void syncSubscription();
    const stopListening = listenForSubscriptionChange();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || cancelled) return;

      channel = supabase
        .channel(`app-notifications-${data.user.id}-${Math.random().toString(36).slice(2)}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "app_notifications", filter: `user_id=eq.${data.user.id}` },
          (event) => {
            const notification = event.new as AppNotification;
            const title = notification.title ?? "Nova notificação";
            const body = notification.body ?? "";

            if ("Notification" in window && Notification.permission === "granted") {
              const browserNotification = new Notification(title, {
                body,
                icon: "/isheep-img.png",
                tag: notification.id,
              });
              browserNotification.onclick = () => {
                window.focus();
                const target = notification.url?.startsWith("/") ? notification.url : "/";
                window.location.assign(target);
                browserNotification.close();
              };
            } else {
              toast(title, { description: body });
            }
          },
        )
        .subscribe();

      if (cancelled && channel) void supabase.removeChannel(channel);
    })();

    return () => {
      cancelled = true;
      stopListening();
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
