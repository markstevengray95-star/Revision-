const CACHE='measurements-v8-cache-1';
const CORE=['./','./index.html','./styles.css','./v3.css','./v4.css','./v6.css','./v7.css','./v8.css','./me-content.js','./me-assessment-data.js','./me-sim-data.js','./me-ui.js','./me-formula-practical.js','./me-assessment.js','./me-v3.js','./me-v4.js','./three-lab.js','./me-v6.js','./me-v7.js','./v8-lesson-data.js','./me-v8-lessons.js','./me-v8-sims.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>caches.match('./index.html'))))});
