/*==========================================================
 JK Enterprises | app.js
==========================================================*/

"use strict";

import Router from "./router.js";
import Layout from "./layout.js";
import SEO from "./seo.js";
import Home from "./home.js";
import Product from "./product.js";
import Blog from "./blog.js";
import Brand from "./brand.js";
import Search from "./search.js";
import Cart from "./cart.js";
import Checkout from "./checkout.js";

const App={

/*==========================================================
 Initialize
==========================================================*/

async init(){
try{
document.documentElement.classList.remove("no-js");
Router.init();
Layout.init();
Cart.init();
SEO.init();
this.events();
await this.page();
console.log("JK Enterprises Loaded");
}catch(e){
console.error(e);
}
},

/*==========================================================
 Current Page
==========================================================*/

async page(){

if(Router.isHome())return Home.init();

if(Router.isProducts())return Product.catalog();

if(Router.isProduct())return Product.details();

if(Router.isBlogs())return Blog.catalog();

if(Router.isBlog())return Blog.details();

if(Router.isBrands())return Brand.list();

if(Router.isBrand())return Brand.details();

if(Router.isSearch())return Search.init();

if(Router.isCart()){
Cart.render();
return;
}

if(Router.isCheckout())return Checkout.init();

},

/*==========================================================
 Global Events
==========================================================*/

events(){

window.addEventListener("online",()=>console.log("Online"));

window.addEventListener("offline",()=>console.log("Offline"));

}

};

document.addEventListener("DOMContentLoaded",()=>App.init());
/*==========================================================
 Service Worker
==========================================================*/

if("serviceWorker" in navigator){

window.addEventListener("load",()=>{

const base=location.pathname.startsWith("/jk5/")?"/jk5/":"/";

navigator.serviceWorker
.register("./assets/js/sw.js")
.then(reg=>console.log("Service Worker Registered",reg))
.catch(console.error);

});

}

/*==========================================================
 Auto Close Mobile Navbar
==========================================================*/

document.addEventListener("click",e=>{

const nav=document.getElementById("mainNav");
const btn=document.querySelector(".navbar-toggler");

if(!nav||!btn||!nav.classList.contains("show"))return;

if(nav.contains(e.target)||btn.contains(e.target))return;

bootstrap.Collapse.getOrCreateInstance(nav).hide();

});

document.querySelectorAll("#mainNav .nav-link").forEach(link=>
link.addEventListener("click",()=>{

const nav=document.getElementById("mainNav");

if(nav?.classList.contains("show"))
bootstrap.Collapse.getOrCreateInstance(nav).hide();

})
);

export default App;