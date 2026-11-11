const CACHE_NAME = 'vokki-up-shell-v1';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(OFFLINE_PAGE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('vokki-up-shell-') && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    request.headers.has('range')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const cacheControl = response.headers.get('cache-control') ?? '';
          if (
            response.ok &&
            response.type === 'basic' &&
            !/private|no-store/i.test(cacheControl)
          ) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () =>
          (await caches.match(request, { ignoreSearch: true })) ??
          (await caches.match(OFFLINE_PAGE))
        )
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
