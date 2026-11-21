const CACHE = "hannah-avocado-v3";

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
