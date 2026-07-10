/*==========================================================
 JK Enterprises | home.js
==========================================================*/

"use strict";

import API from "./api.js";
import UI from "./ui.js";

const Home={

/*==========================================================
 Initialize
==========================================================*/

init(){this.load();},

/*==========================================================
 Homepage
==========================================================*/

async load(){

this.loading();

try{

const r=await API.homepage();

if(!r.success)throw Error(r.message);

const d=r.data||{};

await Promise.all([
this.render("featuredProducts",d.products,"products",8,UI.productCard,"No Products Available","Browse Products","products.html"),
this.render("featuredBrands",d.brands,"brands",8,UI.brandCard,"No Brands Available","Browse Brands","brands.html"),
this.render("latestBlogs",d.blogs,"blogs",6,UI.blogCard,"No Articles Available","Read Blogs","blogs.html")
]);

}catch(e){

console.error(e);

await Promise.all([
this.render("featuredProducts",[],"products",8,UI.productCard,"No Products Available","Browse Products","products.html"),
this.render("featuredBrands",[],"brands",8,UI.brandCard,"No Brands Available","Browse Brands","brands.html"),
this.render("latestBlogs",[],"blogs",6,UI.blogCard,"No Articles Available","Read Blogs","blogs.html")
]);

}

},

/*==========================================================
 Loading
==========================================================*/

loading(){
["featuredProducts","featuredBrands"].forEach(id=>this.skeleton(id,4));
this.skeleton("latestBlogs",3);
},

/*==========================================================
 Skeleton
==========================================================*/

skeleton(id,count){

const c=document.getElementById(id);

if(!c)return;

c.innerHTML=Array(count).fill(`
<div class="col-6 col-md-4 col-lg-3">
<div class="card h-100">
<div class="placeholder w-100" style="height:180px"></div>
<div class="card-body">
<p class="placeholder-glow"><span class="placeholder col-8"></span></p>
<p class="placeholder-glow"><span class="placeholder col-6"></span></p>
</div>
</div>
</div>`).join("");

},

/*==========================================================
 Generic Renderer
==========================================================*/

async render(id,list=[],apiMethod,limit,card,title,button,link){

const c=document.getElementById(id);

if(!c)return;

if(!list.length){

try{

const r=await API[apiMethod]();

if(!r.success)throw Error();

list=(r.data||[]).slice(0,limit);

}catch{

c.innerHTML=this.emptyCard(title,button,link);

return;

}

}

c.innerHTML=list.map(card).join("");

},

/*==========================================================
 Empty Card
==========================================================*/

emptyCard(title,button,link){

return`
<div class="col-12">
<div class="card border-0 shadow-sm">
<div class="card-body text-center py-5">
<h4>${title}</h4>
<p class="text-muted mb-3">Content will appear here once available.</p>
<a href="${link}" class="btn btn-primary">${button}</a>
</div>
</div>
</div>`;
}

};

document.addEventListener("DOMContentLoaded",()=>Home.init());

export default Home;