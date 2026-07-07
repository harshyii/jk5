/*==========================================================
 JK Enterprises
 app.js
 Version : 1.0
 Application Bootstrap
==========================================================*/

"use strict";

import Router from "./router.js";
import SEO from "./seo.js";

const App={

    /*======================================================
     Initialize
    ======================================================*/

    async init(){

        try{

            document.documentElement.classList.remove("no-js");

            this.events();

            await this.page();

            SEO.init();

            console.log(

                "JK Enterprises Loaded"

            );

        }

        catch(error){

            console.error(error);

        }

    },



    /*======================================================
     Page Loader
    ======================================================*/

    async page(){

        switch(true){

            case Router.isHome():

                break;

            case Router.isProducts():

                break;

            case Router.isProduct():

                break;

            case Router.isBrands():

                break;

            case Router.isBrand():

                break;

            case Router.isBlogs():

                break;

            case Router.isBlog():

                break;

            case Router.isSearch():

                break;

            case Router.isCart():

                break;

            case Router.isCheckout():

                break;

            default:

                break;

        }

    },



    /*======================================================
     Global Events
    ======================================================*/

    events(){

        window.addEventListener(

            "online",

            ()=>console.log("Online")

        );



        window.addEventListener(

            "offline",

            ()=>console.log("Offline")

        );



        document.addEventListener(

            "visibilitychange",

            ()=>{

                if(document.hidden)return;

            }

        );



        window.addEventListener(

            "scroll",

            ()=>{}

        );



        window.addEventListener(

            "resize",

            ()=>{}

        );

    }

};



document.addEventListener(

    "DOMContentLoaded",

    ()=>App.init()

);

export default App;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/assets/js/sw.js");
}