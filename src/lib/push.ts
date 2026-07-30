import { supabase } from "@/integrations/supabase/client";

const SW_URL = "/push-sw.js";
const LAST_ENDPOINT_KEY = "disciple.push.endpoint";

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getVapidKey(): string | null {
  const key = import.meta.env.VITE_WEB_PUSH_VAPID_PUBLIC_KEY as string | undefined;
  return key && key.length > 0 ? key : null;
}

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}

export async function getRegistration() {
  const existing = await navigator.serviceWorker.getRegistration(SW_URL);
  const registration = existing ?? (await navigator.serviceWorker.register(SW_URL));
  await navigator.serviceWorker.ready;
  return registration;
}

/** Removes a stale/expired subscription both from the browser and from the database. */
async function dropSubscription(subscription: PushSubscription | null, endpoint?: string) {
  const target = endpoint ?? subscription?.endpoint;
  try {
    await subscription?.unsubscribe();
  } catch {
    /* the browser may already have discarded it */
  }
  if (target) {
    await supabase.from("push_subscriptions").delete().eq("endpoint", target);
    if (typeof window !== "undefined") window.localStorage.removeItem(LAST_ENDPOINT_KEY);
  }
}

async function persistSubscription(subscription: PushSubscription) {
  const keys = subscription.toJSON().keys;
  const { data } = await supabase.auth.getUser();
  if (!data.user || !keys?.p256dh || !keys.auth) return false;

  const previous = typeof window !== "undefined" ? window.localStorage.getItem(LAST_ENDPOINT_KEY) : null;
  if (previous && previous !== subscription.endpoint) {
    // The browser rotated the endpoint: remove the outdated row so pushes stop failing.
    await supabase.from("push_subscriptions").delete().eq("endpoint", previous);
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: data.user.id,
      endpoint: subscription.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );
  if (error) throw error;
  if (typeof window !== "undefined") window.localStorage.setItem(LAST_ENDPOINT_KEY, subscription.endpoint);
  return true;
}

/**
 * Subscribes (or re-subscribes) the device and stores the subscription.
 * Requires an already granted notification permission.
 */
export async function subscribeAndPersist(): Promise<PushSubscription | null> {
  const vapidKey = getVapidKey();
  if (!vapidKey) throw new Error("missing-vapid-key");

  const registration = await getRegistration();
  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const currentKey = subscription.options?.applicationServerKey;
    const sameKey =
      !currentKey ||
      btoa(String.fromCharCode(...new Uint8Array(currentKey))) ===
        btoa(String.fromCharCode(...urlBase64ToUint8Array(vapidKey)));
    const expired = typeof subscription.expirationTime === "number" && subscription.expirationTime <= Date.now();
    if (!sameKey || expired) {
      await dropSubscription(subscription);
      subscription = null;
    }
  }

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  const saved = await persistSubscription(subscription);
  return saved ? subscription : null;
}

/**
 * Runs on every app start when permission is already granted:
 * re-registers the worker, renews an expired subscription and keeps the DB row fresh.
 */
export async function syncSubscription() {
  if (!isPushSupported() || Notification.permission !== "granted" || !getVapidKey()) return;
  try {
    await subscribeAndPersist();
  } catch {
    // Fallback: clear whatever is stale so the user can re-enable from the bell.
    const registration = await navigator.serviceWorker.getRegistration(SW_URL);
    const subscription = (await registration?.pushManager.getSubscription()) ?? null;
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(LAST_ENDPOINT_KEY) : null;
    await dropSubscription(subscription, stored ?? undefined);
  }
}

/** Listens for the worker telling us the browser rotated the subscription. */
export function listenForSubscriptionChange() {
  if (!isPushSupported()) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data?.type === "pushsubscriptionchange") void syncSubscription();
  };
  navigator.serviceWorker.addEventListener("message", handler);
  return () => navigator.serviceWorker.removeEventListener("message", handler);
}
