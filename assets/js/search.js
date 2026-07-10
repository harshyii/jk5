/*==========================================================
 JK Enterprises | search.js
==========================================================*/

"use strict";

import API from "./api.js";
import Router from "./router.js";
import UI from "./ui.js";

const Search={

/*==========================================================
 Initialize
==========================================================*/

async init(){
this.bind();
if(Router.isSearch())await this.results();
},

/*==========================================================
 Search Forms
==========================================================*/

bind(){
document.querySelectorAll("[data-search-form]").forEach(form=>{
form.addEventListener("submit",e=>{
e.preventDefault();
const input=form.querySelector("[data-search-input]");
if(input?.value.trim())this.go(input.value);
});
});
},

/*==========================================================
 Results
==========================================================*/

async results(){
const grid=document.getElementById("searchResults");
if(!grid)return;

UI.loader(grid);

const r=await API.search(Router.search(),Router.pageNumber());

if(!r.success||!r.data){
UI.empty(grid,"No Results","Try another keyword.");
return;
}

this.render(r.data);
},

/*==========================================================
 Render
==========================================================*/

render(data){
const grid=document.getElementById("searchResults");
if(!grid)return;

const cards={
products:UI.productCard,
blogs:UI.blogCard,
brands:UI.brandCard
};

const html=Object.entries(cards).reduce((out,[key,card])=>
out+(data[key]||[]).map(card).join("")
,"");

if(!html){
UI.empty(grid,"Nothing Found","No matching records.");
return;
}

grid.innerHTML=html;
this.summary(data);
},

/*==========================================================
 Summary
==========================================================*/

summary(data){
const box=document.getElementById("searchSummary");
if(!box)return;

const total=(data.products?.length||0)+(data.blogs?.length||0)+(data.brands?.length||0);

box.innerHTML=`<strong>${total}</strong> results found`;
},

/*==========================================================
 Navigation
==========================================================*/

go(query){
query=query.trim();
if(query)location=`search.html?q=${encodeURIComponent(query)}`;
},

url(key,value){
const url=new URL(location);
url.searchParams.set(key,value);
location=url;
},

sort(value){
this.url("sort",value);
},

filter(key,value){
this.url(key,value);
},

page(number){
this.url("page",number);
},

clear(){
location="search.html";
}

};

export default Search;