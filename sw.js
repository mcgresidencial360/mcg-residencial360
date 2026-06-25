const CACHE_NAME = 'mcg-360-v1';
const ASSETS = [
  'index.html',
  'Dashboard.html',
  'conjunto.html',
  'cuentas-por-pagar.html',
  'cuentas-por-cobrar.html',
  'caja-menor.html',
  'proveedores.html',
  'cargar-propietarios.html',
  'Residentes_y_Propietarios_-_MCG_Residencial_360.html',
  'GUIA_DE_USO.html',
  'logo.png',
  'icon-192x192.png',
  'icon-512x512.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo cachear recursos del mismo origen (no Firebase ni CDNs externos)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
