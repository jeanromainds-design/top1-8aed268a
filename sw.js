const C='top1-v9',A='top1-audio-v1',F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==A).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
async function audio(req){const c=await caches.open(A),r=await c.match(req.url);if(!r)return fetch(req);const rg=req.headers.get('range');if(!rg)return r;
 const b=await r.arrayBuffer(),m=/bytes=(\d*)-(\d*)/.exec(rg)||[],n=b.byteLength,st=m[1]?+m[1]:0,en=m[2]?Math.min(+m[2],n-1):n-1;
 return new Response(b.slice(st,en+1),{status:206,headers:{'Content-Type':'audio/mpeg','Content-Range':'bytes '+st+'-'+en+'/'+n,'Content-Length':String(en-st+1),'Accept-Ranges':'bytes'}})}
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);
 if(u.origin===location.origin&&u.pathname.endsWith('.mp3')){e.respondWith(audio(e.request));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(u.origin===location.origin&&res.status===200){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res})))});
