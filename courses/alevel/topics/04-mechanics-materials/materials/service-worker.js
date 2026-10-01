const CACHE_NAME = 'alevel-materials-v11';
const APP_SHELL = [
  './','./index.html','./styles.css?v=3','./upgrade-v3.css?v=3','./learning-system-v4.css?v=4','./visual-overhaul-v5.css?v=5','./visual-overhaul-v6.css?v=6','./simulation-studio-v7.css?v=7','./practical-studio-v8.css?v=8','./simulation-fidelity-v9.css?v=9','./learning-system-v10.css?v=10','./learning-3d-v11.css?v=11','./materials-data.js?v=2','./textbook-visuals-v3.js?v=3','./textbook-part1-v3.js?v=3','./textbook-part2-v3.js?v=3','./extended-bank-v3.js?v=3','./app.js?v=2','./simulation-upgrade-v3.js?v=3','./asset-loader-v10.js?v=10','./three-performance-v10.js?v=10','./exam-coach-v3.js?v=3','./learning-system-v4.js?v=4','./lesson-visuals-v5.js?v=5','./three-lab-v5.js?v=5','./lesson-depth-v6.js?v=6','./simulation-lab-v6.js?v=6','./textbook-depth-v6.js?v=6','./simulation-studio-v7.js?v=7','./practical-studio-v8.js?v=8','./micrometer-3d-v8.js?v=8','./simulation-fidelity-v9.js?v=9','./learning-system-v10.js?v=10','./lesson-depth-v11.js?v=11','./simulation-suite-v11.js?v=11','./netlify-runtime.js?v=10','./manifest.webmanifest','./physics-icon.svg','./offline.html'
];
const OPTIONAL_VENDOR=['./vendor/three.module.min.js','./vendor/xlsx.full.min.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    await cache.addAll(APP_SHELL);
    await Promise.all(OPTIONAL_VENDOR.map(asset => cache.add(asset).catch(() => null)));
  }));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;
  if(event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));return response;}).catch(async()=>await caches.match('./index.html')||caches.match('./offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {if(response.ok&&['style','script','image','font'].includes(event.request.destination)){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;})));
});
