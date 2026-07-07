/*==========================================================
 JK Enterprises
 router.js
 Version : 1.0
 Client Side Router
==========================================================*/

"use strict";

import Utils from "./utils.js";

const Router={

    /*======================================================
     Initialize
    ======================================================*/

    init(){

        this.page=this.currentPage();

        this.params=this.parameters();

    },



    /*======================================================
     Current Page
    ======================================================*/

    currentPage(){

        let page=window.location.pathname

            .split("/")

            .pop()

            .toLowerCase();

        if(!page) page="index.html";

        return page;

    },



    /*======================================================
     URL Parameters
    ======================================================*/

    parameters(){

        return Object.fromEntries(

            new URLSearchParams(

                window.location.search

            )

        );

    },



    /*======================================================
     Helpers
    ======================================================*/

    id(){

        return Utils.query("id");

    },



    slug(){

        return Utils.query("slug");

    },



    brand(){

        return Utils.query("brand");

    },



    category(){

        return Utils.query("category");

    },



    search(){

        return Utils.query("q");

    },



    pageNumber(){

        return parseInt(

            Utils.query("page") || 1,

            10

        );

    },



    sort(){

        return Utils.query("sort") || "";

    },



    filter(){

        return Utils.query("filter") || "";

    },



    /*======================================================
     Checks
    ======================================================*/

    is(name){

        return this.page===name.toLowerCase();

    },



    isHome(){

        return this.page==="index.html";

    },



    isProducts(){

        return this.page==="products.html";

    },



    isProduct(){

        return this.page==="product.html";

    },



    isBrands(){

        return this.page==="brands.html";

    },



    isBrand(){

        return this.page==="brand.html";

    },



    isBlogs(){

        return this.page==="blogs.html";

    },



    isBlog(){

        return this.page==="blog.html";

    },



    isSearch(){

        return this.page==="search.html";

    },



    isCart(){

        return this.page==="cart.html";

    },



    isCheckout(){

        return this.page==="checkout.html";

    },



    isContact(){

        return this.page==="contact.html";

    },



    isAbout(){

        return this.page==="about.html";

    },



    isFAQ(){

        return this.page==="faq.html";

    },



    is404(){

        return this.page==="404.html";

    }

};



Router.init();

export default Router;