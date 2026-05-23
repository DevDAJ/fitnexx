/**
 * Service worker — push + notification handling per
 * https://nextjs.org/docs/app/guides/progressive-web-apps#5-creating-a-service-worker
 *
 * Adds a fetch handler so Chromium can treat the site as installable when criteria are met.
 */

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    return;
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon.png",
    badge: "/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Fitnexx", options),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const openTo = new URL("/app", self.location.origin).href;
  event.waitUntil(clients.openWindow(openTo));
});

self.addEventListener("fetch", (event) => {
  // Do not intercept cross-origin loads. Passing every request through
  // respondWith(fetch(...)) breaks some third-party <script crossorigin>
  // loads (e.g. Clerk CDN with redirects).
  try {
    const scopeOrigin = new URL(self.registration.scope).origin;
    const requestOrigin = new URL(event.request.url).origin;
    if (requestOrigin !== scopeOrigin) return;
  } catch {
    return;
  }
  event.respondWith(fetch(event.request));
});
