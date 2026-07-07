/*==========================================================
 JK Enterprises
 sw.js
 Version : 1.0
 Service Worker
==========================================================*/

"use strict";

/*==========================================================
 Cache
==========================================================*/

const CACHE_VERSION="jk-v1";

const STATIC_CACHE=`${CACHE_VERSION}-static`;

const DYNAMIC_CACHE=`${CACHE_VERSION}-dynamic`;


/*==========================================================
 Static Files
==========================================================*/

const STATIC_FILES=[

"/",

"/index.html",

"/about.html",

"/contact.html",

"/products.html",

"/product.html",

"/brands.html",

"/brand.html",

"/blogs.html",

"/blog.html",

"/cart.html",

"/checkout.html",

"/search.html",

"/faq.html",

"/privacy.html",

"/returns.html",

"/shipping.html",

"/terms.html",

"/404.html",

"/assets/css/app.css",

"/assets/js/app.js",

"/assets/images/icons/logo.svg",

"/manifest.json"

];


/*==========================================================
 Install
==========================================================*/

self.addEventListener(

"install",

event=>{

event.waitUntil(

caches.open(STATIC_CACHE)

.then(cache=>cache.addAll(STATIC_FILES))

);

self.skipWaiting();

}

);


/*==========================================================
 Activate
==========================================================*/

self.addEventListener(

"activate",

event=>{

event.waitUntil(

caches.keys()

.then(keys=>Promise.all(

keys

.filter(

key=>!key.startsWith(CACHE_VERSION)

)

.map(

key=>caches.delete(key)

)

))

);

self.clients.claim();

}

);


/*==========================================================
 Fetch
==========================================================*/

self.addEventListener(

"fetch",

event=>{

if(event.request.method!=="GET") return;

event.respondWith(

caches.match(event.request)

.then(cache=>{

if(cache)

return cache;

return fetch(event.request)

.then(response=>{

if(

!response||

response.status!==200||

response.type!=="basic"

)

return response;

const copy=response.clone();

caches.open(DYNAMIC_CACHE)

.then(cache=>{

cache.put(

event.request,

copy

);

});

return response;

})

.catch(()=>{

return caches.match(

"/404.html"

);

});

})

);

}

);


/*==========================================================
 Messages
==========================================================*/

self.addEventListener(

"message",

event=>{

if(

event.data==="skipWaiting"

)

self.skipWaiting();

});