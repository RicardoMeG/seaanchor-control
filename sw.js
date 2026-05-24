const CACHE_NAME = 'sea-anchor-v1';
const ASSETS = [
  '/seaanchor-control/SeaAnchorControl.html',
  '/seaanchor-control/manifest.json',
  '/seaanchor-control/logo.jpeg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always fetch from network for API calls
  if (e.request.url.includes('notion') || e.request.url.includes('workers.dev')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
