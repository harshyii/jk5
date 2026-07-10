/*==========================================================
 JK Enterprises | api.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";

const API={

/*==========================================================
 GET Request
==========================================================*/

async request(action="",params={}){

try{

const url=new URL(CONFIG.API.BASE_URL);

url.searchParams.set("action",action);

new URLSearchParams(params).forEach((v,k)=>url.searchParams.set(k,v));

const r=await fetch(url,{cache:"force-cache"});

if(!r.ok)throw Error(`HTTP ${r.status}`);

return await r.json();

}catch(e){

console.error("[API]",e);

return{success:false,message:e.message,data:null};

}

},

/*==========================================================
 Products
==========================================================*/

products(params={}){return this.request(CONFIG.ACTIONS.PRODUCTS,params);},
product(id){return this.request(CONFIG.ACTIONS.PRODUCT,{id});},

/*==========================================================
 Brands
==========================================================*/

brands(){return this.request(CONFIG.ACTIONS.BRANDS);},
brand(id){return this.request(CONFIG.ACTIONS.BRAND,{id});},

/*==========================================================
 Blogs
==========================================================*/

blogs(params={}){return this.request(CONFIG.ACTIONS.BLOGS,params);},
blog(id){return this.request(CONFIG.ACTIONS.BLOG,{id});},
featuredBlogs(){return this.request("featuredBlogs");},
blogCategories(){return this.request("blogCategories");},
relatedBlogs(id){return this.request("relatedBlogs",{id});},

/*==========================================================
 Homepage
==========================================================*/

homepage(){return this.request(CONFIG.ACTIONS.HOMEPAGE);},

/*==========================================================
 Search
==========================================================*/

search(q="",page=1){return this.request(CONFIG.ACTIONS.SEARCH,{q,page});},

/*==========================================================
 Settings
==========================================================*/

settings(){return this.request(CONFIG.ACTIONS.SETTINGS);},
ping(){return this.request("ping");},

/*==========================================================
 Order
==========================================================*/

async order(order={}){

try{

const r=await fetch(CONFIG.API.BASE_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({action:CONFIG.ACTIONS.ORDER,order})
});

if(!r.ok)throw Error(`HTTP ${r.status}`);

return await r.json();

}catch(e){

console.error("[ORDER]",e);

return{success:false,message:e.message,data:null};

}

}

};

export default API;