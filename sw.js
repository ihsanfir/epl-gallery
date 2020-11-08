importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  {url: '/', revision: '1'},
  {url: '/index.html', revision: '1'},
  {url: '/tim.html', revision: '1'},
  {url: '/pages/nav.html', revision: '1'},
  {url: '/pages/home.html', revision: '1'},
  {url: '/pages/jadwal.html', revision: '1'},
  {url: '/pages/klasemen.html', revision: '1'},
  {url: '/pages/saved.html', revision: '1'},
  {url: '/manifest.json', revision: '1'}
], {
  ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|css|js)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'assets',
  })
);

workbox.routing.registerRoute(
  new RegExp('/tim'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages',
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api-football',
  })
);

workbox.routing.registerRoute(
  /.*(?:cloudflare|googleapis|gstatic)\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'fonts-icon-jquery-modernizr',
  })
);

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
