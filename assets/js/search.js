/*==========================================================
 JK Enterprises
 search.js
 Version : 1.0
 Search Module
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

    if(Router.isSearch())

        await this.results();

},



/*==========================================================
 Bind Search Boxes
==========================================================*/

bind(){

    document

    .querySelectorAll(

        "[data-search-form]"

    )

    .forEach(form=>{

        form.addEventListener(

            "submit",

            e=>{

                e.preventDefault();

                const input=

                form.querySelector(

                    "[data-search-input]"

                );

                if(!input)return;

                this.go(

                    input.value

                );

            }

        );

    });

},



/*==========================================================
 Search Page
==========================================================*/

async results(){

    const grid=

    document.getElementById(

        "searchResults"

    );

    if(!grid)return;

    UI.loader(grid);

    const response=

    await API.search(

        Router.search(),

        Router.pageNumber()

    );

    if(

        !response.success||

        !response.data

    ){

        UI.empty(

            grid,

            "No Results",

            "Try another keyword."

        );

        return;

    }

    this.render(

        response.data

    );

},



/*==========================================================
 Render
==========================================================*/

render(data){

    const grid=

    document.getElementById(

        "searchResults"

    );

    if(!grid)return;

    let html="";



    if(data.products){

        html+=data.products

        .map(

            item=>UI.productCard(item)

        )

        .join("");

    }



    if(data.blogs){

        html+=data.blogs

        .map(

            item=>UI.blogCard(item)

        )

        .join("");

    }



    if(data.brands){

        html+=data.brands

        .map(

            item=>UI.brandCard(item)

        )

        .join("");

    }



    if(!html){

        UI.empty(

            grid,

            "Nothing Found",

            "No matching records."

        );

        return;

    }



    grid.innerHTML=html;



    this.summary(data);

},

/*==========================================================
 Summary
==========================================================*/

summary(data){

    const box=

    document.getElementById(

        "searchSummary"

    );

    if(!box)return;

    const products=

    data.products?.length||0;

    const blogs=

    data.blogs?.length||0;

    const brands=

    data.brands?.length||0;

    box.innerHTML=`

<strong>

${products+blogs+brands}

</strong>

results found

`;

},



/*==========================================================
 Go
==========================================================*/

go(query){

    query=query.trim();

    if(!query)return;

    window.location=

    `search.html?q=${encodeURIComponent(query)}`;

},



/*==========================================================
 Sort
==========================================================*/

sort(value){

    const url=

    new URL(

        window.location

    );

    url.searchParams.set(

        "sort",

        value

    );

    window.location=url;

},



/*==========================================================
 Filter
==========================================================*/

filter(key,value){

    const url=

    new URL(

        window.location

    );

    url.searchParams.set(

        key,

        value

    );

    window.location=url;

},



/*==========================================================
 Clear Filters
==========================================================*/

clear(){

    window.location=

    "search.html";

},



/*==========================================================
 Pagination
==========================================================*/

page(number){

    const url=

    new URL(

        window.location

    );

    url.searchParams.set(

        "page",

        number

    );

    window.location=url;

}

};



export default Search;