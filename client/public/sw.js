const CACHE_NAME = "elazar-os-v1";

const PRECACHE_URLS = [
  "/",
  "/favicon.png",
  "/opengraph.jpg",
  "/photos/pro-1.png",
  "/photos/pro-2.png",
  "/photos/pro-3.png",
  "/photos/dating-1.png",
  "/photos/dating-2.png",
  "/photos/dating-3.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.mode === "navigate") {
            return caches.match("/") || caches.match("/index.html");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});
