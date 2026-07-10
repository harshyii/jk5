/*==========================================================
 JK Enterprises | analytics.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";

const Analytics={

/*==========================================================
 Core
==========================================================*/

on(){return CONFIG.ANALYTICS.ENABLED&&typeof window.gtag==="function";},

event(name,params={}){
if(this.on())window.gtag("event",name,params);
},

init(){this.pageView();},

/*==========================================================
 Pages
==========================================================*/

pageView(){
this.event("page_view",{
page_title:document.title,
page_location:location.href,
page_path:location.pathname
});
},

search(search_term){
this.event("search",{search_term});
},

/*==========================================================
 Products
==========================================================*/

viewProduct(p){
this.event("view_item",{
currency:CONFIG.CURRENCY,
value:Number(p.price)||0,
items:[{
item_id:p.id,
item_name:p.name,
item_brand:p.brand,
item_category:p.category,
price:Number(p.price)||0
}]
});
},

viewList(item_list_name,products=[]){
this.event("view_item_list",{
item_list_name,
items:products.map(p=>({
item_id:p.id,
item_name:p.name,
price:Number(p.price)||0
}))
});
},

addToCart(p,quantity=1){
this.event("add_to_cart",{
currency:CONFIG.CURRENCY,
value:(Number(p.price)||0)*quantity,
items:[{
item_id:p.id,
item_name:p.name,
quantity,
price:Number(p.price)||0
}]
});
},

removeFromCart(p){
this.event("remove_from_cart",{
currency:CONFIG.CURRENCY,
value:Number(p.price)||0,
items:[{
item_id:p.id,
item_name:p.name,
price:Number(p.price)||0
}]
});
},

beginCheckout(cart){
this.event("begin_checkout",{
currency:CONFIG.CURRENCY,
value:cart.total,
items:cart.items
});
},

purchase(order){
this.event("purchase",{
transaction_id:order.id,
currency:CONFIG.CURRENCY,
value:order.total,
items:order.items
});
},

/*==========================================================
 Other Events
==========================================================*/

viewBlog(a){
this.event("view_blog",{
article_id:a.id,
article_title:a.title
});
},

viewBrand(b){
this.event("view_brand",{brand_name:b.name});
},

contact(){
this.event("contact");
},

share(content_type,item_id){
this.event("share",{content_type,item_id});
},

download(file_name){
this.event("file_download",{file_name});
},

error(description){
this.event("exception",{description,fatal:false});
}

};

export default Analytics;