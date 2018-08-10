var GithubUser_Caches = 'my-site-cache-v2';
var urlsToCache = [
  'style.css',
  'index.html',
  'index.js',
  'locate-icon.png',
  'favicon.ico'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(GithubUser_Caches)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== GithubUser_Caches) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetch(event.request)
      .then(function(response) {
        return caches.open(urlsToCache)
        .then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(function() {

          return caches.match('/index.html');
        }); 
      });
    })
  );
});
