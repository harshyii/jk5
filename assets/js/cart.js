/*==========================================================
 JK Enterprises | cart.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";
import Utils from "./utils.js";
import UI from "./ui.js";

const Cart={

/*==========================================================
 Initialize
==========================================================*/

init(){
this.items=Utils.load(CONFIG.STORAGE.CART,[]);
this.events();
this.updateCount();
},

/*==========================================================
 Storage
==========================================================*/

save(){
Utils.save(CONFIG.STORAGE.CART,this.items);
this.updateCount();
},

/*==========================================================
 Cart
==========================================================*/

add(product,quantity=1){

const item=this.items.find(i=>i.id===product.id);

item
?item.quantity+=quantity
:this.items.push({
id:product.id,
sku:product.sku,
name:product.name,
image:product.image||"",
price:Number(product.price)||0,
quantity
});

this.save();
this.render();
UI.toast?.("Added to cart");

},

remove(id){
this.items=this.items.filter(i=>i.id!==id);
this.save();
this.render();
},

quantity(id,qty){
const item=this.items.find(i=>i.id===id);
if(!item)return;
item.quantity=Math.max(1,+qty||1);
this.save();
this.render();
},

clear(){
this.items=[];
this.save();
this.render();
},

count(){
return this.items.reduce((t,i)=>t+i.quantity,0);
},

total(){
return this.items.reduce((t,i)=>t+i.price*i.quantity,0);
},

/*==========================================================
 Header Count
==========================================================*/

updateCount(){

const count=this.count();

document.querySelectorAll(
"[data-cart-count],#cartCount,#cartCountMobile"
).forEach(el=>el.textContent=count);

},

/*==========================================================
 Cart Page
==========================================================*/

render(){

const list=document.getElementById("cartItems");

if(!list)return;

if(!this.items.length){
UI.empty(list,"Your cart is empty","Add products to continue shopping.");
return;
}

list.innerHTML=this.items.map(item=>`

<div class="cart-item">

<div class="cart-item-image">
<img src="${item.image}" alt="${item.name}" loading="lazy" style="width:200px;height:200px;object-fit:contain;">
</div>

<div>

<h5>${item.name}</h5>

<p>${Utils.price(item.price)}</p>

<div class="quantity-control">

<button data-minus="${item.id}">−</button>

<input type="number" min="1" value="${item.quantity}" data-qty="${item.id}">

<button data-plus="${item.id}">+</button>

</div>

</div>

<div class="text-end">

<strong>${Utils.price(item.price*item.quantity)}</strong>

<br>

<button class="btn btn-sm btn-outline-danger" data-remove="${item.id}">
Remove
</button>

</div>

</div>

`).join("");

this.summary();
this.bind();

},

/*==========================================================
 Summary
==========================================================*/

summary(){

const total=Utils.price(this.total());

document.getElementById("subtotal")?.replaceChildren(document.createTextNode(total));
document.getElementById("grandTotal")?.replaceChildren(document.createTextNode(total));
document.getElementById("cartItemCount")?.replaceChildren(document.createTextNode(this.count()));

},

/*==========================================================
 Buttons
==========================================================*/

bind(){

document.querySelectorAll("[data-remove]").forEach(btn=>
btn.onclick=()=>this.remove(btn.dataset.remove)
);

document.querySelectorAll("[data-plus]").forEach(btn=>
btn.onclick=()=>{
const item=this.items.find(i=>i.id===btn.dataset.plus);
if(item)this.quantity(item.id,item.quantity+1);
}
);

document.querySelectorAll("[data-minus]").forEach(btn=>
btn.onclick=()=>{
const item=this.items.find(i=>i.id===btn.dataset.minus);
if(item)this.quantity(item.id,item.quantity-1);
}
);

},

/*==========================================================
 Events
==========================================================*/

events(){

document.addEventListener("cart:add",e=>
this.add(e.detail.product,e.detail.quantity||1)
);

document.body.addEventListener("click",async e=>{

const add=e.target.closest("[data-cart-add]");

if(add){

e.preventDefault();

const {default:API}=await import("./api.js");

const r=await API.product(add.dataset.cartAdd);

if(r.success&&r.data)this.add(r.data);

return;

}

const view=e.target.closest("[data-product-view]");

if(view){

location.href=`product.html?id=${view.dataset.productView}`;

return;

}

if(e.target.closest("#checkoutButton")){

e.preventDefault();

if(!this.items.length){
UI.toast("Your cart is empty");
return;
}

location.href="checkout.html";

}

});

}

};

export default Cart;