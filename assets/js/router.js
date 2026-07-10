/*==========================================================
 JK Enterprises | router.js
==========================================================*/

"use strict";

const Router={

/*==========================================================
 Init
==========================================================*/

init(){
this.page=location.pathname.split("/").pop().toLowerCase()||"index.html";
this.params=Object.fromEntries(new URLSearchParams(location.search));
},

/*==========================================================
 Query
==========================================================*/

query:(k,d="")=>Router.params[k]??d,

id:()=>Router.query("id"),
slug:()=>Router.query("slug"),
brand:()=>Router.query("brand"),
category:()=>Router.query("category"),
search:()=>Router.query("q"),
sort:()=>Router.query("sort"),
filter:()=>Router.query("filter"),
pageNumber:()=>Number(Router.query("page",1)),

/*==========================================================
 Page
==========================================================*/

/*==========================================================
 Page
==========================================================*/

is:p=>Router.page===`${p}.html`,

isHome:()=>Router.is("index"),
isProducts:()=>Router.is("products"),
isProduct:()=>Router.is("product"),
isBrands:()=>Router.is("brands"),
isBrand:()=>Router.is("brand"),
isBlogs:()=>Router.is("blogs"),
isBlog:()=>Router.is("blog"),
isSearch:()=>Router.is("search"),
isCart:()=>Router.is("cart"),
isCheckout:()=>Router.is("checkout"),
isAbout:()=>Router.is("about"),
isContact:()=>Router.is("contact"),
isFAQ:()=>Router.is("faq"),
isPrivacy:()=>Router.is("privacy"),
isTerms:()=>Router.is("terms"),
isShipping:()=>Router.is("shipping"),
isReturns:()=>Router.is("returns"),
is404:()=>Router.is("404")

};
Router.init();

export default Router;