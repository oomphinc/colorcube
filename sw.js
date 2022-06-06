const staticCacheName = 'site-static-v1';
const assets = [
  '/',
  '/index.html',
  '/assets/js/colorcube.js',
  '/assets/js/palette-from-image.js',
  '/assets/js/palettehistory.js',
  '/assets/js/tab-list.js',
  '/assets/js/tinycolor.js',
  '/assets/js/toggle-switch.js',
  // Stylesheets
  '/assets/css/styles.css',
  // External libraries
  'https://code.jquery.com/jquery-3.4.1.min.js', //todo: remove this dependency
  'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js',
  'https://p.typekit.net/p.css?s=1&k=brc4xco&ht=tk&f=28343.28344.28346.28347.28348.28349.37511.37512.37513.37514.37515.37516.37521.37522&a=4489166&app=typekit&e=css',
  // Image assets
  '/assets/img/oomph-square.png',
  '/assets/img/ColorCube-logo.svg'

];

self.addEventListener('install', evt => {
  // ensure caching finishes before service worker stops install event
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', evt => {
  // check for stale cache and delete if necessary
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      )
    })
  );
  console.log('service worker has been activated');
});

self.addEventListener('fetch', evt =>  {
  // Retrieve cached assets if available
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
