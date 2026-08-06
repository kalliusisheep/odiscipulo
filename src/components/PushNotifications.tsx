import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getVapidKey, isPushSupported, listenForSubscriptionChange, subscribeAndPersist, syncSubscription } from "@/lib/push";

type AppNotification = { id: string; title: string; body: string; url: string };

export function PushNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(true);

  useEffect(() => {
    setSupported(isPushSupported());
    if ("Notification" in window) setPermission(Notification.permission);

    // Keeps the stored subscription valid (renews it when the browser expires it).
    void syncSubscription().finally(async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration("/push-sw.js");
        const subscription = (await registration?.pushManager.getSubscription()) ?? null;
        setSubscribed(Boolean(subscription));
      } catch {
        setSubscribed(false);
      }
    });
    const stopListening = listenForSubscriptionChange();

    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      channel = supabase
        .channel(`app-notifications-${data.user.id}-${Math.random().toString(36).slice(2)}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "app_notifications", filter: `user_id=eq.${data.user.id}` },
          (event) => {
            const notification = event.new as AppNotification;
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(notification.title, {
                body: notification.body,
                icon: "/isheep-img.png",
                tag: notification.id,
              });
            } else {
              toast(notification.title, { description: notification.body });
            }
          },
        )
        .subscribe();
    })();
    return () => {
      stopListening();
      if (channel) void supabase.removeChannel(channel);
    };
  }, []);

  const enable = async () => {
    if (!supported) {
      toast.error("Este navegador não oferece suporte a notificações push.");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") {
      toast.error("Permita as notificações nas configurações do navegador para ativá-las.");
      return;
    }
    if (!getVapidKey()) {
      toast.error("As chaves de notificação ainda não foram configuradas no ambiente publicado.");
      return;
    }
    const subscription = await subscribeAndPersist();
    if (!subscription) {
      toast.error("Não foi possível registrar este dispositivo. Tente novamente.");
      return;
    }
    setSubscribed(true);
    toast.success("Notificações ativadas. Barnabé avisará você às 06:00 e às 20:00.");
  };

  if (!supported || (permission === "granted" && subscribed)) return null;
  return (
    <button
      type="button"
      onClick={() => void enable().catch(() => toast.error("Não foi possível ativar as notificações."))}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2 text-foreground hover:border-primary/40 hover:text-primary"
      aria-label="Ativar notificações"
      title="Ativar notificações"
    >
      <Bell className="h-5 w-5" />
    </button>
  );
}
