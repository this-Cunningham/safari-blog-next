self.addEventListener('install', () => {
  console.log('hello');
  // waitUntil(caches.open('safari-blog-cache').then(cache => {

  // }))
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('google')) return;
  // Prevent the default, and handle the request ourselves.
  event.respondWith(
    (async () => {
      // Try to get the response from a cache.
      const cache = await caches.open('safari-blog-cache');
      const cachedResponse = await cache.match(event.request.url);

      if (cachedResponse) {
        // If we found a match in the cache, return it
        return cachedResponse;
      }

      event.waitUntil(cache.add(event.request.url));
      // If we didn't find a match in the cache, use the network.
      return fetch(event.request);
    })()
  );
});