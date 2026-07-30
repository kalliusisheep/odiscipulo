import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

type QueuedNotification = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  url: string;
  data: Record<string, unknown> | null;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const rawSubject = (Deno.env.get("WEB_PUSH_VAPID_SUBJECT") ?? "").trim();
const subject = /^(https?:|mailto:)/.test(rawSubject) ? rawSubject : `mailto:${rawSubject}`;
const publicKey = Deno.env.get("WEB_PUSH_VAPID_PUBLIC_KEY")!;
const privateKey = Deno.env.get("WEB_PUSH_VAPID_PRIVATE_KEY")!;
const admin = createClient(supabaseUrl, serviceRoleKey);

webpush.setVapidDetails(subject, publicKey, privateKey);

Deno.serve(async () => {
  const { data: notifications, error } = await admin
    .from("app_notifications")
    .select("id, user_id, title, body, url, data")
    .is("delivered_at", null)
    .order("created_at")
    .limit(100);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  for (const notification of (notifications ?? []) as QueuedNotification[]) {
    const { data: subscriptions } = await admin
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", notification.user_id);

    await Promise.all(
      (subscriptions ?? []).map(async (subscription) => {
        try {
          await webpush.sendNotification(
            { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
            JSON.stringify({
              title: notification.title,
              body: notification.body,
              url: notification.url,
              icon: (notification.data?.icon as string | undefined) ?? "/isheep-img.png",
            }),
          );
        } catch (error) {
          console.error("push-failed", subscription.endpoint.slice(0, 60), error instanceof Error ? error.message : error);
          const statusCode = typeof error === "object" && error && "statusCode" in error ? Number(error.statusCode) : 0;
          if (statusCode === 404 || statusCode === 410) {
            await admin.from("push_subscriptions").delete().eq("id", subscription.id);
          }
        }
      }),
    );

    await admin.from("app_notifications").update({ delivered_at: new Date().toISOString() }).eq("id", notification.id);
  }

  return Response.json({ dispatched: notifications?.length ?? 0 });
});
