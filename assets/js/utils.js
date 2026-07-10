/*==========================================================
 JK Enterprises | utils.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";

const Utils={

/*==========================================================
 URL
==========================================================*/

query:name=>new URLSearchParams(location.search).get(name),

slug:(text="")=>String(text).trim().toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),

/*==========================================================
 Format
==========================================================*/

price:value=>new Intl.NumberFormat("en-IN",{
style:"currency",
currency:CONFIG.CURRENCY,
maximumFractionDigits:2
}).format(Number(value)||0),

number:value=>new Intl.NumberFormat("en-IN").format(Number(value)||0),

date:value=>new Date(value).toLocaleDateString("en-IN",{
year:"numeric",
month:"long",
day:"numeric"
}),

/*==========================================================
 Helpers
==========================================================*/

escape(text=""){
const d=document.createElement("div");
d.textContent=text;
return d.innerHTML;
},

sleep:ms=>new Promise(r=>setTimeout(r,ms)),

uid:(prefix="JK")=>`${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

async copy(text){
try{
await navigator.clipboard.writeText(text);
return true;
}catch{
return false;
}
},

share:data=>navigator.share?navigator.share(data):false,

/*==========================================================
 Storage
==========================================================*/

store(type,key,value){
if(arguments.length===3)
return type.setItem(key,JSON.stringify(value));
try{
return JSON.parse(type.getItem(key));
}catch{
return null;
}
},

save(key,value){
this.store(localStorage,key,value);
},

load(key,fallback=null){
return this.store(localStorage,key)??fallback;
},

remove:key=>localStorage.removeItem(key),

clear:()=>localStorage.clear(),

sessionSave(key,value){
this.store(sessionStorage,key,value);
},

sessionLoad(key,fallback=null){
return this.store(sessionStorage,key)??fallback;
},

/*==========================================================
 Events
==========================================================*/

debounce(fn,delay=300){
let timer;
return(...args)=>{
clearTimeout(timer);
timer=setTimeout(()=>fn(...args),delay);
};
},

throttle(fn,limit=200){
let wait=false;
return(...args)=>{
if(wait)return;
wait=true;
fn(...args);
setTimeout(()=>wait=false,limit);
};
},

/*==========================================================
 DOM
==========================================================*/

top(){
scrollTo({top:0,behavior:"smooth"});
},

$: (selector,parent=document)=>parent.querySelector(selector),

$$:(selector,parent=document)=>[...parent.querySelectorAll(selector)],

/*==========================================================
 Image
==========================================================*/

fallback(img,src){
img.onerror=()=>img.src=src;
},

/*==========================================================
 Validation
==========================================================*/

empty(value){
return value==null||value===""||(Array.isArray(value)&&!value.length);
},
truncate:(t,n=55)=>t&&t.length>n?`${t.slice(0,n).trim()}…`:t,
/*==========================================================
 Device
==========================================================*/

mobile:()=>innerWidth<768,

online:()=>navigator.onLine

};

export default Utils;