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
