const CACHE='further-mechanics-thermal-v15';
const ASSETS=["./","./index.html","./styles.css","./further.css","./assessment-equation-v11.css","./textbook-full-v12.css","./equation-breakdown-v14.css","./extended-response-hub-v14.css","./lesson-depth-v15.css","./simulation-3d-v15.css","./content-v2.js","./lesson-detail-v3.js","./calculation-detail-v4.js","./textbook-mechanics-v6.js","./textbook-thermal-v6.js","./textbook-visuals-v6.js","./app-v2.js","./sim-learning-v8.js","./mastery-core-v5.js","./mastery-practice-v5.js","./mastery-data-v5.js","./mastery-teacher-v5.js","./classroom-suite-v9.js","./assessment-equation-v11.js","./assessment-equation-fix-v11.js","./textbook-full-v12.js","./equation-breakdown-v14.js","./extended-response-hub-v14.js","./lesson-depth-v15.js","./simulation-3d-v15.js","./manifest.webmanifest","./physics-icon.svg"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 const networkFirst=e.request.mode==='navigate'||['script','style','worker'].includes(e.request.destination)||/\.(?:js|css|html|webmanifest)$/.test(u.pathname);
 if(networkFirst){
   e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(x=>x||caches.match('./index.html',{ignoreSearch:true}))));
   return;
 }
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(cached=>cached||fetch(e.request).then(r=>{if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r})));
});