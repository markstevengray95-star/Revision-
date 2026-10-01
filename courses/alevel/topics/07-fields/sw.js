const CACHE = "aqa-fields-lab-v11";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./further.css",
  "./fields.css",
  "./enhancements.css",
  "./enhancements-v3.css",
  "./enhancements-v4.css",
  "./enhancements-v5.css",
  "./enhancements-v7.css",
  "./enhancements-v8.css",
  "./enhancements-v9.css",
  "./enhancements-v10.css",
  "./enhancements-v11.css",
  "./data.js",
  "./app.js",
  "./enhancements.js",
  "./textbook-v3.js",
  "./sim-pro-v3.js",
  "./textbook-v4.js",
  "./real-apparatus-v4.js",
  "./extended-response-v4.js",
  "./topic-practice-v5.js",
  "./sim-challenges-v5.js",
  "./v6-upgrades.js",
  "./lesson-depth-v7.js",
  "./v7-reliability.js",
  "./learning-v8.js",
  "./legacy-motion-v9.js",
  "./sim-runtime-v9.js",
  "./equation-clinic-v9.js",
  "./three-lab-v9.js",
  "./lesson-depth-v10.js",
  "./core-3d-v10.js",
  "./lesson-visuals-v11.js",
  "./three-polish-v11.js",
  "./physics-icon.svg",
  "./manifest.webmanifest"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(()=>{});
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});