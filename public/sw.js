const CACHE_NAME = 'kaelos-static-v1';
const DYNAMIC_CACHE = 'kaelos-dynamic-v1';

// Core static assets to cache immediately during installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Pre-cache core shell & assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache warning:', err);
      });
    })
  );
});

// Activate Event: Clean up old caches & take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Check if request is for static assets (JS, CSS, fonts, icons, images)
function isStaticAsset(url) {
  return (
    url.match(/\.(js|css|woff2?|ttf|eot|png|jpg|jpeg|svg|webp|ico)(\?.*)?$/i) ||
    url.includes('/assets/') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  );
}

// Fetch Event: Offline support & caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-http extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (Core Pages & SPA routing)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          // If network fails, serve cached page or offline fallback shell
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          
          const indexResponse = (await caches.match('/index.html')) || (await caches.match('/'));
          if (indexResponse) return indexResponse;

          return new Response(
            `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Sin Conexión | Kaelos</title><style>body{font-family:sans-serif;text-align:center;padding:3rem;background:#0f172a;color:#f8fafc;}h1{color:#f97316;}</style></head><body><h1>Sin Conexión a Internet</h1><p>Parece que no tienes conexión en este momento. Revisa tu red para seguir navegando en KAELOS.</p></body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Static Assets (Fonts, Icons, CSS, JS, Local Images) -> Cache First with Stale-While-Revalidate
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Background update
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        }).catch(() => {
          return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
        });
      })
    );
    return;
  }

  // 3. Dynamic requests -> Network First with Dynamic Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return new Response(JSON.stringify({ offline: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
        });
      })
  );
});
