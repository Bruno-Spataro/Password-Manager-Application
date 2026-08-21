/* Service worker de "Mis Contraseñas".
   Estrategia: red primero, caché como respaldo.
   - Si hay internet, siempre trae la versión más nueva del archivo (y la
     guarda en caché de paso). Así, cuando se suba un cambio al repo, se ve
     apenas se recargue la página — no queda pegada a una copia vieja.
   - Si NO hay internet, sirve la última copia que sí pudo guardar. Eso es
     lo que permite abrir la app instalada estando sin conexión.

   Si en el futuro se cambia esta lógica, subir el número de CACHE_NAME
   (v1 -> v2) para que el navegador descarte la caché vieja en vez de
   arrastrarla para siempre. */
const CACHE_NAME = 'mis-contrasenas-v1';
const APP_SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // no cachear POST/etc.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
