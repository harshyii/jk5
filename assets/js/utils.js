/*==========================================================
 JK Enterprises
 utils.js
 Version : 1.0
 Common Utility Functions
==========================================================*/

"use strict";

import CONFIG from "./config.js";

const Utils = {

    /*======================================================
     Query Parameters
    ======================================================*/

    query(name){

        return new URLSearchParams(window.location.search).get(name);

    },



    /*======================================================
     Slug
    ======================================================*/

    slug(text=""){

        return text
            .toString()
            .trim()
            .toLowerCase()
            .replace(/&/g,"and")
            .replace(/[^a-z0-9]+/g,"-")
            .replace(/^-|-$/g,"");

    },



    /*======================================================
     Price
    ======================================================*/

    price(value=0){

        return new Intl.NumberFormat(

            "en-IN",

            {

                style:"currency",

                currency:CONFIG.CURRENCY,

                maximumFractionDigits:2

            }

        ).format(Number(value)||0);

    },



    /*======================================================
     Number
    ======================================================*/

    number(value=0){

        return new Intl.NumberFormat("en-IN").format(value);

    },



    /*======================================================
     Date
    ======================================================*/

    date(value){

        return new Date(value).toLocaleDateString(

            "en-IN",

            {

                year:"numeric",

                month:"long",

                day:"numeric"

            }

        );

    },



    /*======================================================
     Escape HTML
    ======================================================*/

    escape(text=""){

        const div=document.createElement("div");

        div.textContent=text;

        return div.innerHTML;

    },



    /*======================================================
     Delay
    ======================================================*/

    sleep(ms){

        return new Promise(resolve=>setTimeout(resolve,ms));

    },



    /*======================================================
     Random ID
    ======================================================*/

    uid(prefix="JK"){

        return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    },



    /*======================================================
     Clipboard
    ======================================================*/

    async copy(text){

        try{

            await navigator.clipboard.writeText(text);

            return true;

        }

        catch{

            return false;

        }

    },



    /*======================================================
     Share API
    ======================================================*/

    async share(data){

        if(navigator.share){

            return navigator.share(data);

        }

        return false;

    },



    /*======================================================
     Local Storage
    ======================================================*/

    save(key,value){

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },



    load(key,defaultValue=null){

        try{

            return JSON.parse(

                localStorage.getItem(key)

            ) ?? defaultValue;

        }

        catch{

            return defaultValue;

        }

    },



    remove(key){

        localStorage.removeItem(key);

    },



    clear(){

        localStorage.clear();

    },



    /*======================================================
     Session Storage
    ======================================================*/

    sessionSave(key,value){

        sessionStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },



    sessionLoad(key,defaultValue=null){

        try{

            return JSON.parse(

                sessionStorage.getItem(key)

            ) ?? defaultValue;

        }

        catch{

            return defaultValue;

        }

    },



    /*======================================================
     Debounce
    ======================================================*/

    debounce(fn,delay=300){

        let timer;

        return (...args)=>{

            clearTimeout(timer);

            timer=setTimeout(

                ()=>fn(...args),

                delay

            );

        };

    },



    /*======================================================
     Throttle
    ======================================================*/

    throttle(fn,limit=200){

        let waiting=false;

        return(...args)=>{

            if(waiting)return;

            fn(...args);

            waiting=true;

            setTimeout(

                ()=>waiting=false,

                limit

            );

        };

    },



    /*======================================================
     Scroll
    ======================================================*/

    top(){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    },



    /*======================================================
     Element
    ======================================================*/

    $(selector,parent=document){

        return parent.querySelector(selector);

    },



    $$(selector,parent=document){

        return [...parent.querySelectorAll(selector)];

    },



    /*======================================================
     Image
    ======================================================*/

    fallback(img,src){

        img.onerror=()=>{

            img.src=src;

        };

    },



    /*======================================================
     Empty
    ======================================================*/

    empty(value){

        return(

            value===undefined||

            value===null||

            value===""||

            value.length===0

        );

    },



    /*======================================================
     Mobile
    ======================================================*/

    mobile(){

        return window.innerWidth<768;

    },



    /*======================================================
     Online
    ======================================================*/

    online(){

        return navigator.onLine;

    }

};

export default Utils;