/*==========================================================
 JK Enterprises | seo.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";

const SEO={

/*==========================================================
 Initialize
==========================================================*/

init(d={}){
this.title(d.title||CONFIG.SITE_NAME);
this.description(d.description||CONFIG.SITE_DESCRIPTION);
this.canonical(d.url||location.href);
this.image(d.image||CONFIG.SEO.DEFAULT_IMAGE);
this.robots(d.robots||CONFIG.SEO.ROBOTS);
},

/*==========================================================
 Basic Meta
==========================================================*/

title(text){
document.title=text;
},

description(text){
this.meta("description",text);
},

keywords(text){
this.meta("keywords",text);
},

robots(text){
this.meta("robots",text);
},

canonical(url){
const link=document.querySelector('link[rel="canonical"]')||Object.assign(document.head.appendChild(document.createElement("link")),{rel:"canonical"});
link.href=url;
},

/*==========================================================
 Open Graph
==========================================================*/

image(src){
this.property("og:image",src);
this.property("twitter:image",src);
},

siteName(){
this.property("og:site_name",CONFIG.SITE_NAME);
},

type(type="website"){
this.property("og:type",type);
},

url(url){
this.property("og:url",url);
},

/*==========================================================
 Helpers
==========================================================*/

tag(selector,attr,value){
let tag=document.querySelector(selector);
if(!tag){
tag=document.createElement("meta");
tag.setAttribute(attr,selector.match(/"(.*)"/)[1]);
document.head.appendChild(tag);
}
return tag;
},

meta(name,content){
this.tag(`meta[name="${name}"]`,"name",name).content=content;
},

property(name,content){
this.tag(`meta[property="${name}"]`,"property",name).content=content;
},

/*==========================================================
 JSON-LD
==========================================================*/

json(data){
document.getElementById("structured-data")?.remove();
const tag=document.createElement("script");
tag.id="structured-data";
tag.type="application/ld+json";
tag.text=JSON.stringify(data);
document.head.appendChild(tag);
},

/*==========================================================
 Organization Schema
==========================================================*/

organization(){
this.json({
"@context":"https://schema.org",
"@type":"Organization",
name:CONFIG.COMPANY.NAME,
url:CONFIG.SITE_URL,
logo:CONFIG.SEO.DEFAULT_IMAGE
});
},

/*==========================================================
 Product Schema
==========================================================*/

product(p){
this.json({
"@context":"https://schema.org",
"@type":"Product",
name:p.name,
image:p.image,
description:p.description,
sku:p.sku,
brand:{
"@type":"Brand",
name:p.brand
},
offers:{
"@type":"Offer",
price:p.price,
priceCurrency:CONFIG.CURRENCY,
availability:"https://schema.org/InStock"
}
});
},

/*==========================================================
 Article Schema
==========================================================*/

article(a){
this.json({
"@context":"https://schema.org",
"@type":"Article",
headline:a.title,
image:a.image,
datePublished:a.date,
author:{
"@type":"Person",
name:a.author
}
});
}

};

export default SEO;