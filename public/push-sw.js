self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(payload.title || "O Discípulo", {
      body: payload.body || "Há uma novidade para você.",
      icon: "/isheep-img.png",
      badge: "/isheep-img.png",
      data: { url: payload.url || "/home" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/home"));
});

// The browser can rotate or expire a subscription at any time.
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      const applicationServerKey =
        event.oldSubscription?.options?.applicationServerKey ?? event.newSubscription?.options?.applicationServerKey;
      let subscription = event.newSubscription ?? null;
      if (!subscription && applicationServerKey) {
        try {
          subscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });
        } catch {
          subscription = null;
        }
      }
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        client.postMessage({
          type: "pushsubscriptionchange",
          oldEndpoint: event.oldSubscription?.endpoint ?? null,
          newEndpoint: subscription?.endpoint ?? null,
        });
      }
    })(),
  );
});
