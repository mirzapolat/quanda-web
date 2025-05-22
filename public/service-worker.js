
// This is the service worker for the PWA
// It will be populated with workbox during the build process

// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('quanda-static-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico'
      ]);
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
