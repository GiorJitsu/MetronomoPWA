const CACHE = 'metronomo-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
  // (no hace falta cachear íconos en data: URI)
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Cache-first con fallback a red; para navegaciones sirve el shell offline
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Para navegaciones, entrega index (SPA/offline)
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then((res) => res || fetch(req))
    );
    return;
  }

  // Para otros recursos
  e.respondWith(
    caches.match(req).then((res) => res || fetch(req))
  );
});