/*==========================================================
 JK Enterprises | checkout.js
==========================================================*/

"use strict";

import API from "./api.js";
import Cart from "./cart.js";
import Utils from "./utils.js";
import UI from "./ui.js";

const Checkout={

/*==========================================================
 Initialize
==========================================================*/

init(){
if(!document.getElementById("checkoutForm"))return;
this.summary();
this.payment();
this.generateQR();
this.bind();
this.updatePaymentOffer();
},

/*==========================================================
 Summary
==========================================================*/

summary(){
const items=document.getElementById("checkoutItems");
const total=document.getElementById("checkoutTotal");

if(items){
items.innerHTML=Cart.items.map(i=>`
<div class="summary-item">
<span>${i.name} × ${i.quantity}</span>
<strong>${Utils.price(i.price*i.quantity)}</strong>
</div>`).join("");
}

if(total){
total.textContent=Utils.price(Cart.total());
this.generateQR();
}
},

/*==========================================================
 Events
==========================================================*/

bind(){
document.getElementById("checkoutForm")
?.addEventListener("submit",e=>this.submit(e));

document.querySelectorAll("[name='paymentMethod']")
.forEach(r=>r.addEventListener("change",()=>this.payment()));
},

/*==========================================================
 Payment
==========================================================*/

payment(){
const method=document.querySelector("[name='paymentMethod']:checked")?.value;
document.querySelectorAll("[data-payment]")
.forEach(el=>el.hidden=el.dataset.payment!==method);
},

/*==========================================================
 Validation
==========================================================*/

validate(form){
if(!form.checkValidity()){
form.reportValidity();
return false;
}

if(!Cart.items.length){
UI.toast("Cart is empty","danger");
return false;
}

return true;
},

/*==========================================================
 Form Data
==========================================================*/
data(form){

const fd=new FormData(form);

return{

customer:{
name:fd.get("name"),
phone:fd.get("phone"),
email:fd.get("email"),
address:fd.get("address"),
city:fd.get("city"),
state:fd.get("state"),
pincode:fd.get("pincode")
},

payment:fd.get("paymentMethod"),

items:Cart.items,

subtotal:Cart.total(),

discount:0,

shipping:0,

total:Cart.total()

};

},


/*==========================================================
 Submit
==========================================================*/

async submit(e){
e.preventDefault();

const form=e.target;
if(!this.validate(form))return;

const btn=form.querySelector("[type='submit']");
if(this.processing)return;

this.processing=true;
btn.disabled=true;
btn.textContent="Placing Order...";

try{

const res=await API.order(this.data(form));

if(!res.success){
UI.toast(res.message||"Order failed.","danger");
return;
}

Cart.clear();
UI.toast("Order placed successfully.");
location.href=`success.html?order=${res.orderId}`;

}catch(err){

console.error(err);
UI.toast("Something went wrong.","danger");

}finally{

this.processing=false;
btn.disabled=false;
btn.textContent="Place Order";

}
},

/*==========================================================
 Success
==========================================================*/

success(){
const id=new URLSearchParams(location.search).get("success");
if(!id)return;

document.getElementById("checkoutSuccess")
?.removeAttribute("hidden");

const order=document.getElementById("orderNumber");
if(order)order.textContent=id;
},

/*==========================================================
 UPI QR
==========================================================*/

generateQR(){
const qr=document.getElementById("upiQR");
if(!qr||typeof QRCode==="undefined")return;

const amount=Cart.total().toFixed(2);
const upi=`upi://pay?pa=9050623210@sbi&pn=JK Enterprises&am=${amount}&cu=INR&tn=Order`;

qr.innerHTML="";

new QRCode(qr,{
text:upi,
width:250,
height:250
});
},

/*==========================================================
 Payment Offer
==========================================================*/

updatePaymentOffer(){
const total=Cart.total();
const cod=total*1.05;
const savings=cod-total;

const set=(id,value)=>{
const el=document.getElementById(id);
if(el)el.textContent=Utils.price(value);
};

set("offerTotal",total);
set("offerOnline",total);
set("offerCOD",cod);
set("offerSavings",savings);
}

};

export default Checkout;