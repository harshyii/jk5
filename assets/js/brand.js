/*==========================================================
 JK Enterprises | brand.js
==========================================================*/

"use strict";

import API from "./api.js";
import Router from "./router.js";
import UI from "./ui.js";

const Brand={

/*==========================================================
 Init
==========================================================*/

async init(){
if(Router.isBrands())return this.list();
if(Router.isBrand())return this.details();
},

/*==========================================================
 Brand List
==========================================================*/

async list(){

const grid=document.getElementById("brandGrid");
if(!grid)return;

UI.loader(grid);

const r=await API.brands();

if(!r.success||!r.data?.length){
UI.empty(grid,"No Brands","Brands will appear here.");
document.getElementById("brandCount")?.replaceChildren(document.createTextNode("0"));
return;
}

const brands=r.data;

document.getElementById("brandCount")?.replaceChildren(
document.createTextNode(brands.length)
);

grid.innerHTML=brands.map(UI.brandCard).join("");

},

/*==========================================================
 Brand Details
==========================================================*/

async details(){

const page=document.getElementById("brandDetails");
if(!page)return;

UI.loader(page);

const id=Router.id();

if(!id)
return UI.error(page,"Brand not found.");

const r=await API.brand(id);

if(!r.success||!r.data)
return UI.error(page,"Unable to load brand.");

this.render(r.data);

},

/*==========================================================
 Render
==========================================================*/

render(brand){

document.title=`${brand.name} | JK Enterprises`;

document.getElementById("brandDetails").innerHTML=
UI.brand(brand);

this.products(brand.id);
this.related(brand.id);

},

/*==========================================================
 Brand Products
==========================================================*/

async products(id){

const grid=document.getElementById("brandProducts");
if(!grid)return;

UI.loader(grid);

const r=await API.products({brand:id});

if(!r.success||!r.data?.length)
return UI.empty(
grid,
"No Products",
"Products from this brand will appear here."
);

grid.innerHTML=r.data.map(UI.productCard).join("");

},

/*==========================================================
 Related Brands
==========================================================*/

async related(id){

const target=document.getElementById("relatedBrands");
if(!target)return;

const r=await API.brands();

if(!r.success||!r.data?.length)return;

target.innerHTML=r.data
.filter(b=>b.id!==id)
.slice(0,4)
.map(UI.brandCard)
.join("");

},

/*==========================================================
 Search
==========================================================*/

search(name){
location.href=`brands.html?q=${encodeURIComponent(name)}`;
},

/*==========================================================
 Filter
==========================================================*/

filter(letter){

document.querySelectorAll(".brand-card").forEach(card=>{

const name=card.dataset.name||"";

card.hidden=!(
letter==="All"||
name.startsWith(letter)
);

});

}

};

export default Brand;