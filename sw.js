/* Service worker de "Mis Contraseñas".
   Estrategia: stale-while-revalidate (mostrar caché al toque, actualizar
   en segundo plano).
   - Siempre responde de una con la última copia guardada (si existe), para
     que la app abra instantáneo con o sin internet.
   - En paralelo, si hay internet, pide la versión más nueva y la guarda en
     caché para la próxima vez. Así los cambios subidos al repo se terminan
     viendo sin que haya que esperar a que la red responda para poder abrir
     la app.

   Si en el futuro se cambia esta lógica, subir el número de CACHE_NAME
   (v1 -> v2) para que el navegador descarte la caché vieja en vez de
   arrastrarla para siempre. */
const CACHE_NAME = 'mis-contrasenas-v2';
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
    caches.match(event.request).then((cached) => {
      const networkUpdate = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => null);
      // Si ya hay algo guardado, se devuelve al toque; la red actualiza
      // la caché en segundo plano para la próxima vez. Si no hay nada
      // guardado todavía (primera visita), se espera a la red.
      return cached || networkUpdate;
    })
  );
});
