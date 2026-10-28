/* Service worker de "Mis Contraseñas": muestra al toque la copia guardada y
   en paralelo busca la versión nueva para la próxima vez (así abre rápido
   también sin internet). Solo toca archivos de la propia app: los pedidos a
   otros sitios (ej. la API de filtraciones) pasan directo, sin cachearse.
   Si se cambia esta lógica, subir CACHE_NAME (v2 -> v3) para descartar la caché vieja. */
const CACHE_NAME = 'mis-contrasenas-v3';
const APP_SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => cached || Response.error());
      event.waitUntil(fresh.catch(() => {})); // que el navegador no mate el worker antes de guardar la copia nueva
      return cached || fresh;
    })
  );
});
