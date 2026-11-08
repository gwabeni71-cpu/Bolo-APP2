const V='bolo-v2',D=V+'-data';
const SHELL=['./','index.html','music.html','tv.html','movies.html','news.html','news.css','news.js','dream.html','manifest.webmanifest','icon-192.png','icon-512.png','kutullo-logo.jpg','bolo-logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==D).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 // News feeds + blog images: network first, cached copy when offline
 if(u.hostname.endsWith('blogspot.com')||u.hostname.endsWith('googleusercontent.com')){
  e.respondWith(fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const y=x.clone();caches.open(D).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r)));return}
 // App files: show cached copy instantly, refresh in the background
 if(u.origin===location.origin){
  e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{
   const n=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}).catch(()=>m||(r.mode==='navigate'?c.match('index.html'):Response.error()));
   return m||n})))}
});
