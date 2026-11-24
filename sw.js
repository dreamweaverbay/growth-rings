// Offline support: keep the app's own files on the tablet. The weather forecast always uses the network.
const VERSION = 'gr-v6';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/store.js', 'js/sound.js', 'js/ui.js', 'js/art.js', 'js/fishart.js', 'js/factart.js',
  'js/data/stories.js', 'js/data/fish.js', 'js/data/facts.js', 'js/data/plants.js', 'js/plantart.js', 'js/activities/leaf.js',
  'js/activities/story.js', 'js/activities/facts.js', 'js/activities/grove.js', 'js/activities/fishing.js', 'js/activities/weather.js',
  'fonts/andika-latin-400-normal.woff2', 'fonts/andika-latin-700-normal.woff2',
  'fonts/baloo-2-latin-500-normal.woff2', 'fonts/baloo-2-latin-700-normal.woff2', 'fonts/baloo-2-latin-800-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png',
  ...['ant', 'bat', 'beaver', 'bee', 'butterfly', 'cow', 'crab', 'deer', 'dog', 'dolphin', 'duck', 'fox', 'frog', 'goat', 'hen', 'horse', 'jellyfish', 'ladybug', 'mouse', 'octopus', 'owl', 'pie', 'pig', 'rabbit', 'raccoon', 'shark', 'snail', 'spider', 'squirrel', 'turtle', 'whale'].map(n => `art/noto/${n}.svg`),
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Network first so updates show up; fall back to the saved copy when offline.
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
