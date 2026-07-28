import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AppNotification = { id: string; title: string; body: string; url: string };

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export function PushNotifications() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setSupported("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
    if ("Notification" in window) setPermission(Notification.permission);

    let channel: ReturnType<typeof supabase.channel> | null = null;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      channel = supabase
        .channel(`app-notifications-${data.user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "app_notifications", filter: `user_id=eq.${data.user.id}` },
          (event) => {
            const notification = event.new as AppNotification;
            if (Notification.permission === "granted") {
              new Notification(notification.title, { body: notification.body, icon: "/isheep-img.png" });
            }
          },
        )
        .subscribe();
    })();
    return () => {
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
    const vapidKey = import.meta.env.VITE_WEB_PUSH_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      toast.error("As chaves de notificação ainda não foram configuradas no ambiente publicado.");
      return;
    }
    const registration = await navigator.serviceWorker.register("/push-sw.js");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
    const keys = subscription.toJSON().keys;
    const { data } = await supabase.auth.getUser();
    if (!data.user || !keys?.p256dh || !keys.auth) return;
    const { error } = await supabase.from("push_subscriptions").upsert(
      { user_id: data.user.id, endpoint: subscription.endpoint, p256dh: keys.p256dh, auth: keys.auth, updated_at: new Date().toISOString() },
      { onConflict: "endpoint" },
    );
    if (error) throw error;
    toast.success("Notificações ativadas. A ovelha avisará você às 06:00.");
  };

  if (!supported || permission === "granted") return null;
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
