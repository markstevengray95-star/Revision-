const CACHE="nuclear-physics-v9";
const CORE=[
 "/","/index.html","/styles.css","/lesson-sequencer.css","/simulation-upgrades.css","/mastery-upgrades.css",
 "/interactive-lessons.css","/rutherford-experiment.css","/learning-platform.css","/lesson-depth.css","/complete-lesson-notes.css",
 "/app.js","/simulation-upgrades.js","/lesson-sequencer.js","/mastery-upgrades.js","/interactive-lessons.js",
 "/rutherford-experiment.js","/lesson-depth.js","/complete-lesson-notes.js","/learning-platform.js","/vendor/three.module.min.js","/vendor/three.core.min.js","/app-icon.svg"
];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);if(url.origin!==location.origin)return;
 if(event.request.mode==="navigate"){
   event.respondWith(fetch(event.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put("/index.html",copy));return r}).catch(()=>caches.match("/index.html")));
   return;
 }
 event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(cached=>cached||fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return r}).catch(()=>cached)));
});
