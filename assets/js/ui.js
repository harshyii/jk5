/*==========================================================
 JK Enterprises | ui.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";
import Utils from "./utils.js";

const UI={

/*==========================================================
 DOM
==========================================================*/

$(s,p=document){return p.querySelector(s);},
$$(s,p=document){return [...p.querySelectorAll(s)];},
html(t,h){(typeof t==="string"?this.$(t):t).innerHTML=h;},
append(t,h){(typeof t==="string"?this.$(t):t).insertAdjacentHTML("beforeend",h);},
clear:t=>this.html(t,""),
create(t,c="",h=""){const e=document.createElement(t);if(c)e.className=c;if(h)e.innerHTML=h;return e;},

/*==========================================================
 States
==========================================================*/

loader(){return`
<div class="text-center py-5">
<div class="spinner-border text-primary"></div>
<p class="mt-3 mb-0">Loading...</p>
</div>`;},

empty(title="Nothing Found",text="No data available."){return`
<div class="text-center py-5">
<h3>${title}</h3>
<p class="text-secondary mb-0">${text}</p>
</div>`;},

error(text="Something went wrong."){return`
<div class="alert alert-danger mb-0">${text}</div>`;},

badge:(text,type="primary")=>`<span class="badge bg-${type}">${text}</span>`,

/*==========================================================
 Product Card
==========================================================*/

productCard(p){return`
<div class="col">
<div class="card h-100">
<a href="product.html?id=${p.ProductID||p.id}" class="text-decoration-none text-dark">
<img src="${p.Image1||p.image||CONFIG.IMAGES.PRODUCT}" class="card-img-top" alt="${Utils.escape(p["Item Name"]||p.name||"Product")}" loading="lazy">
<div class="card-body">
<div class="small text-secondary">${p.Brand||p.brand||""}</div>
<h3 class="fs-6 small fw-semibold mb-2 text-truncate-2">${p["Item Name"]||p.name||""}</h3>
<div class="fw-bold text-primary">${Utils.price(p["Sale Price"]||p.price||0)}</div>
${p.MRP?`<small class="text-decoration-line-through text-muted">${Utils.price(p.MRP||p.mrp)}</small>`:""}
</div>
</a>
<div class="card-footer bg-transparent border-0">
<button class="btn btn-primary w-100" data-cart-add="${p.ProductID||p.id}">Add to Cart</button>
</div>
</div>
</div>`;},

/*==========================================================
 Blog Card
==========================================================*/

blogCard(b){return`
<div class="col">
<div class="card h-100">
<a href="blog.html?id=${b.Slug}" class="text-decoration-none text-dark">
<img src="${b.FeaturedImage||CONFIG.IMAGES.BLOG}" class="card-img-top" alt="${Utils.escape(b.ImageAlt||b.Title)}" loading="lazy">
<div class="card-body">
${b.Category?this.badge(b.Category):""}
<h3 class="fs-6 mt-2">${b.Title}</h3>
<p class="small text-secondary mb-0">${b.Excerpt||""}</p>
</div>
</a>
</div>
</div>`;},

/*==========================================================
 Brand Card
==========================================================*/

brandCard(b){return`
<div class="col">
<a href="products.html?brand=${encodeURIComponent(b.Brand||b.name)}" class="card h-100 text-center text-decoration-none text-dark">
<div class="card-body">
<img src="${b.Image||b.Logo||b.logo||CONFIG.IMAGES.PRODUCT}" class="img-fluid mb-3" alt="${Utils.escape(b.Brand||b.name)}" loading="lazy">
<h3 class="fs-6 mb-0">${b.Brand||b.name}</h3>
</div>
</a>
</div>`;},

/*==========================================================
 Breadcrumb
==========================================================*/

breadcrumb(items=[]){

if(!items.length)return"";

return`
<nav class="mb-3" aria-label="breadcrumb">
<ol class="breadcrumb">

${items.map((i,n)=>`
<li class="breadcrumb-item ${n===items.length-1?"active":""}">
${n===items.length-1?i.title:`<a href="${i.url}">${i.title}</a>`}
</li>
`).join("")}

</ol>
</nav>`;

},

/*==========================================================
 Pagination
==========================================================*/

pagination(page=1,pages=1,url="?page="){

if(pages<2)return"";

return`
<nav aria-label="Pagination">
<ul class="pagination justify-content-center">

${Array.from({length:pages},(_,i)=>`
<li class="page-item ${page===i+1?"active":""}">
<a class="page-link" href="${url}${i+1}">${i+1}</a>
</li>
`).join("")}

</ul>
</nav>`;

},

/*==========================================================
 Toast
==========================================================*/

toast(msg,type="success",delay=3000){

let c=document.getElementById("toastContainer");

if(!c){
c=document.createElement("div");
c.id="toastContainer";
c.className="toast-container position-fixed top-0 end-0 p-3";
document.body.appendChild(c);
}

const t=document.createElement("div");

t.className=`toast align-items-center text-bg-${type} border-0`;

t.innerHTML=`
<div class="d-flex">
<div class="toast-body">${msg}</div>
<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
</div>`;

c.appendChild(t);

const toast=new bootstrap.Toast(t,{delay});

toast.show();

t.addEventListener("hidden.bs.toast",()=>t.remove());

},
};

export default UI;