
const CACHE_NAME = 'prompt-pedia-cache-v2'; // Incremented version
const OFFLINE_URL = '/offline.html';
const APP_SHELL_URLS = [
  '/',
  '/offline.html',
  // Critical assets could be listed here if their paths are stable
  // For Next.js with hashed assets, this is more complex and often handled by build tools.
];

// Install - cache the offline page and other critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        // Cache the offline page first
        return cache.add(OFFLINE_URL).then(() => {
          console.log('[SW] Offline page cached.');
          // Then attempt to cache other app shell URLs
          // For a basic setup, we'll focus on the offline page and rely on browser caching for others.
          // return cache.addAll(APP_SHELL_URLS.filter(url => url !== OFFLINE_URL));
        });
      })
      .catch(error => {
        console.error('[SW] Cache open/add failed during install:', error);
      })
  );
  self.skipWaiting();
  console.log('[SW] Installed');
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
  console.log('[SW] Activated');
});

// Fetch - serve from cache, fallback to network, then to offline page for navigation
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first for navigation requests to get the latest content
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('[SW] Network fetch failed for navigation, serving offline page.', error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  } else if (APP_SHELL_URLS.includes(event.request.url) || event.request.destination === 'style' || event.request.destination === 'script' || event.request.destination === 'font') {
    // For app shell assets (CSS, JS, fonts), try cache first, then network
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Optionally cache new assets dynamically here if desired
          // const cache = await caches.open(CACHE_NAME);
          // cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(error => {
          console.log('[SW] Fetch failed for asset:', event.request.url, error);
          // For non-navigation, if it's not in cache and network fails,
          // there's no generic fallback like offline.html for an image or script.
          // So, we let the browser handle the error (e.g., broken image, script error).
        });
      })
    );
  }
  // For other requests (e.g., API calls, external images), just use network.
});
