/*==========================================================
 JK Enterprises | sw.js
==========================================================*/

"use strict";

/*==========================================================
 Cache
==========================================================*/

const VERSION="jk-v1",
STATIC=`${VERSION}-static`,
DYNAMIC=`${VERSION}-dynamic`,
BASE="/jk5";

const FILES=[
`${BASE}/`,
`${BASE}/index.html`,
`${BASE}/about.html`,
`${BASE}/contact.html`,
`${BASE}/products.html`,
`${BASE}/product.html`,
`${BASE}/brands.html`,
`${BASE}/brand.html`,
`${BASE}/blogs.html`,
`${BASE}/blog.html`,
`${BASE}/cart.html`,
`${BASE}/checkout.html`,
`${BASE}/search.html`,
`${BASE}/faq.html`,
`${BASE}/privacy.html`,
`${BASE}/returns.html`,
`${BASE}/shipping.html`,
`${BASE}/terms.html`,
`${BASE}/404.html`,
`${BASE}/assets/css/app.css`,
`${BASE}/assets/js/app.js`,
`${BASE}/assets/images/icons/logo.svg`,
`${BASE}/manifest.json`
];

/*==========================================================
 Install
==========================================================*/

self.addEventListener("install",e=>{
e.waitUntil(caches.open(STATIC).then(c=>c.addAll(FILES)));
self.skipWaiting();
});
/*==========================================================
 Activate
==========================================================*/

self.addEventListener("activate",e=>{
e.waitUntil(
caches.keys().then(keys=>
Promise.all(
keys.filter(k=>!k.startsWith(VERSION)).map(k=>caches.delete(k))
)
)
);
self.clients.claim();
});

/*==========================================================
 Fetch
==========================================================*/

self.addEventListener("fetch",e=>{
if(e.request.method!=="GET")return;

e.respondWith(
caches.match(e.request).then(cache=>{

if(cache)return cache;

return fetch(e.request)
.then(r=>{

if(r&&r.status===200&&r.type==="basic"){
caches.open(DYNAMIC).then(c=>c.put(e.request,r.clone()));
}

return r;

})
.catch(()=>caches.match(`${BASE}/404.html`));

})
);
});

/*==========================================================
 Messages
==========================================================*/

self.addEventListener("message",e=>{
if(e.data==="skipWaiting")self.skipWaiting();
});