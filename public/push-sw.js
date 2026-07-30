self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let payload = {};
      try {
        payload = event.data ? event.data.json() : {};
      } catch {
        payload = {};
      }

      // O navegador exige um "tag" não-vazio sempre que "renotify" é usado.
      // Sem isso, showNotification() lança um erro e o Chrome exibe sozinho
      // a notificação genérica "isheep.app updated while in background".
      const tag = payload.tag || "isheep-notification";

      try {
        await self.registration.showNotification(payload.title || "Barnabé, seu Mentor IA", {
          body: payload.body || "Há uma novidade para você.",
          icon: payload.icon || "/isheep-img.png",
          badge: "/isheep-img.png",
          tag,
          renotify: true,
          data: { url: payload.url || "/home" },
        });
      } catch (err) {
        // Fallback de segurança: mesmo se algo inesperado falhar, ainda
        // mostramos uma notificação simples em vez de deixar o Chrome
        // substituir por sua mensagem genérica.
        await self.registration.showNotification("Barnabé, seu Mentor IA", {
          body: "Há uma novidade para você.",
          icon: "/isheep-img.png",
          badge: "/isheep-img.png",
          tag: "isheep-notification",
          data: { url: "/home" },
        });
      }
    })(),
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
