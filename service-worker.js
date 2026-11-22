const CACHE = "hannah-avocado-v5-no-setup";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES.map(url => new Request(url, {cache: "reload"})))).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith("hannah-avocado-") && key !== CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(CACHE).then(cache => cache.match(event.request)).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

self.addEventListener("push", event => {
  let d = {};
  try { d = event.data.json(); } catch (e) {}
  const title = d.title || "ABC Adventure 💑";
  const body = d.body || "Something new!";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => {
      cs.forEach(c => c.postMessage({ t: "sync", body: body }));
      return self.registration.showNotification(title, {
        body: body,
        icon: "./icon-192.png",
        badge: "./icon-192.png",
        tag: "abc-update",
        renotify: true,
        data: { url: "./" }
      });
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => {
      for (const c of cs) { if ("focus" in c) return c.focus(); }
      return clients.openWindow("./");
    })
  );
});
