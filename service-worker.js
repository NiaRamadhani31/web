const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  'index.html',
  'about.html',
  'contact.html',
  'style.css',
  'nia.jpg',
  'icon-192x192.png',
  'icon-512x512.png',
  'offline.html'  // Halaman offline yang akan ditampilkan saat offline
];

// Install the service worker and cache all the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching files...');
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('Failed to cache during install:', error);
    })
  );
});

// Fetch files from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Jika ada di cache, ambil dari cache. Jika tidak ada, fetch dari jaringan.
      return response || fetch(event.request).catch(() => {
        // Jika jaringan tidak ada, tampilkan halaman offline
        return caches.match('offline.html');
      });
    })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
