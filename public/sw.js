// https://microsoft.github.io/win-student-devs/#/30DaysOfPWA/advanced-capabilities/05

const SW_VERSION = 'v1:';
// const sw_caches = {
//   assets: {
//     name: `${SW_VERSION}assets`
//   },
//   images: {
//     name: `${SW_VERSION}images`
//   },
//   pages: {
//     name: `${SW_VERSION}pages`
//   }
// };

self.addEventListener('install', () => {

  console.log( 'service worker: install event in progress.' );
});

self.addEventListener('activate', event => {
  // remove old cache versions
  event.waitUntil(
    caches.keys()
      .then( keys => {
        return Promise.all(
          keys
            .filter( key => {
              return ! key.startsWith( SW_VERSION );
            })
            .map( key => {
              return caches.delete( key );
            })
        );
      })
      .then( () => clients.claim() )
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      return fetch(event.request).then(
        function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();

          caches.open('v1:assets').then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      );
    })
  );
});