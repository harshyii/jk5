/*==========================================================
 JK Enterprises | product.js
==========================================================*/

"use strict";

import API from "./api.js";
import Router from "./router.js";
import UI from "./ui.js";
import Utils from "./utils.js";
import Cart from "./cart.js";

const Product={

/*==========================================================
 Initialize
==========================================================*/

async init(){
if(Router.isProducts())return this.catalog();
if(Router.isProduct())return this.details();
},

/*==========================================================
 Product Listing
==========================================================*/

async catalog(){

const grid=document.getElementById("productGrid");
if(!grid)return;

UI.loader(grid);

const r=await API.products({
page:Router.pageNumber(),
category:Router.category(),
brand:Router.brand(),
search:Router.search(),
sort:Router.sort()
});

if(!r.success||!r.data?.length)
return UI.empty(grid,"No Products Found","Try changing your filters.");

grid.innerHTML=r.data.map(UI.productCard).join("");

document.getElementById("productCount")?.replaceChildren(
document.createTextNode(r.total??r.data.length)
);

},

/*==========================================================
 Product Details
==========================================================*/

async details(){

const container=document.getElementById("productDetails");
if(!container)return;

UI.loader(container);

const id=Router.id();

if(!id)
return UI.error(container,"Product not found.");

const r=await API.product(id);

if(!r.success||!r.data)
return UI.error(container,"Unable to load product.");

this.render(r.data);

},

/*==========================================================
 Render
==========================================================*/

render(product){

document.title=`${product.name} | JK Enterprises`;

const container=document.getElementById("productDetails");

container.innerHTML=UI.product(product);

this.gallery();
this.quantity();
this.buttons(product);
this.related(product.id);

},
/*==========================================================
 Gallery
==========================================================*/

gallery(){

const main=document.getElementById("productImage");
if(!main)return;

document.querySelectorAll(".product-thumbnail").forEach(img=>
img.onclick=()=>main.src=img.dataset.image
);

},

/*==========================================================
 Quantity
==========================================================*/

quantity(){

const qty=document.getElementById("quantity");
if(!qty)return;

document.getElementById("qtyPlus")
?.addEventListener("click",()=>qty.value++);

document.getElementById("qtyMinus")
?.addEventListener("click",()=>{
if(qty.value>1)qty.value--;
});

},

/*==========================================================
 Buttons
==========================================================*/

buttons(product){

document.getElementById("addToCart")
?.addEventListener("click",()=>{

const quantity=Number(
document.getElementById("quantity")?.value||1
);

Cart.add(product,quantity);

document.dispatchEvent(new CustomEvent(
"cart:add",
{detail:{product,quantity}}
));

});

},

/*==========================================================
 Related Products
==========================================================*/

async related(id){

const target=document.getElementById("relatedProducts");
if(!target)return;

const r=await API.products({related:id});

if(!r.success||!r.data?.length)return;

target.innerHTML=r.data
.map(UI.productCard)
.join("");

},

/*==========================================================
 Search
==========================================================*/

search(text){
location.href=`search.html?q=${encodeURIComponent(text)}`;
}

};

export default Product;