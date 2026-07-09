/*==========================================================
 JK Enterprises
 brand.js
 Version : 1.0
 Brand Module
==========================================================*/

"use strict";

import API from "./api.js";
import Router from "./router.js";
import UI from "./ui.js";

const Brand={

/*==========================================================
 Initialize
==========================================================*/

async init(){

    if(Router.isBrands())

        await this.list();

    if(Router.isBrand())

        await this.details();

},



/*==========================================================
 Brand Listing
==========================================================*/

async list(){

    const grid = document.getElementById("brandGrid");

    if(!grid) return;

    UI.loader(grid);

    const response = await API.brands();

    console.log("Brands API Response:", response);

    if(
        !response.success ||
        !response.data?.length
    ){

        UI.empty(
            grid,
            "No Brands",
            "Brands will appear here."
        );

        const count = document.getElementById("brandCount");
        if(count) count.textContent = 0;

        return;

    }

    const brands = response.data;

    console.table(brands);
    console.log(brands[0]);

    // Update brand count
    const count = document.getElementById("brandCount");
    if(count){
        count.textContent = brands.length;
    }

    grid.innerHTML = brands
        .map(brand => UI.brandCard(brand))
        .join("");

},


/*==========================================================
 Brand Details
==========================================================*/

async details(){

    const page=

    document.getElementById(

        "brandDetails"

    );

    if(!page)return;

    UI.loader(page);

    const id=

    Router.id();

    if(!id){

        UI.error(

            page,

            "Brand not found."

        );

        return;

    }

    const response=

    await API.brand(id);

    if(

        !response.success||

        !response.data

    ){

        UI.error(

            page,

            "Unable to load brand."

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

render(brand){

    document.title=

    `${brand.name} | JK Enterprises`;

    const page=

    document.getElementById(

        "brandDetails"

    );

    page.innerHTML=

    UI.brand(brand);

    this.products(

        brand.id

    );

},



/*==========================================================
 Brand Products
==========================================================*/

async products(id){

    const grid=

    document.getElementById(

        "brandProducts"

    );

    if(!grid)return;

    UI.loader(grid);

    const response=

    await API.products({

        brand:id

    });

    if(

        !response.success||

        !response.data?.length

    ){

        UI.empty(

            grid,

            "No Products",

            "Products from this brand will appear here."

        );

        return;

    }

    grid.innerHTML=

    response.data

    .map(

        product=>UI.productCard(product)

    )

    .join("");

},



/*==========================================================
 Related Brands
==========================================================*/

async related(id){

    const target=

    document.getElementById(

        "relatedBrands"

    );

    if(!target)return;

    const response=

    await API.brands();

    if(

        !response.success||

        !response.data?.length

    )return;

    target.innerHTML=

    response.data

    .filter(

        brand=>brand.id!==id

    )

    .slice(0,4)

    .map(

        brand=>UI.brandCard(brand)

    )

    .join("");

},



/*==========================================================
 Search
==========================================================*/

search(name){

    window.location=

    `brands.html?q=${encodeURIComponent(name)}`;

},



/*==========================================================
 Filter
==========================================================*/

filter(letter){

    const cards=

    document.querySelectorAll(

        ".brand-card"

    );

    cards.forEach(card=>{

        const name=

        card.dataset.name||"";

        card.style.display=

        letter==="All"||

        name.startsWith(letter)

        ?"":"none";

    });

}

};

export default Brand;