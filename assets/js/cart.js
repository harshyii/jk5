/*==========================================================
 JK Enterprises
 cart.js
 Version : 1.0
 Shopping Cart Module
==========================================================*/

"use strict";

import CONFIG from "./config.js";
import Utils from "./utils.js";
import UI from "./ui.js";

const Cart={

/*==========================================================
 Initialize
==========================================================*/

init(){

    this.items=this.load();

    this.events();

    this.updateCount();

},



/*==========================================================
 Load
==========================================================*/

load(){

    return Utils.load(

        CONFIG.STORAGE.CART,

        []

    );

},



/*==========================================================
 Save
==========================================================*/

save(){

    Utils.save(

        CONFIG.STORAGE.CART,

        this.items

    );

    this.updateCount();

},



/*==========================================================
 Add Item
==========================================================*/

add(product,qty=1){

    const item=this.items.find(

        i=>i.id===product.id

    );

    if(item){

        item.quantity+=qty;

    }

    else{

        this.items.push({

            id:product.id,

            sku:product.sku,

            name:product.name,

            image:product.image,

            price:Number(product.price),

            quantity:qty

        });

    }

    this.save();

    UI.toast(

        "Added to cart"

    );

},




/*==========================================================
 Remove Item
==========================================================*/

remove(id){

    this.items=this.items.filter(

        item=>item.id!==id

    );

    this.save();

    this.render();

},




/*==========================================================
 Update Quantity
==========================================================*/

quantity(id,qty){

    const item=this.items.find(

        i=>i.id===id

    );

    if(!item)return;

    item.quantity=Math.max(

        1,

        Number(qty)

    );

    this.save();

    this.render();

},




/*==========================================================
 Clear
==========================================================*/

clear(){

    this.items=[];

    this.save();

    this.render();

},




/*==========================================================
 Count
==========================================================*/

count(){

    return this.items.reduce(

        (t,i)=>t+i.quantity,

        0

    );

},




/*==========================================================
 Total
==========================================================*/

total(){

    return this.items.reduce(

        (t,i)=>

        t+(i.price*i.quantity),

        0

    );

},




/*==========================================================
 Update Header Count
==========================================================*/

updateCount(){

    document

    .querySelectorAll(

        "[data-cart-count]"

    )

    .forEach(el=>{

        el.textContent=

        this.count();

    });

},




/*==========================================================
 Render Cart Page
==========================================================*/

render(){

    const list=

    document.getElementById(

        "cartItems"

    );

    if(!list)return;

    if(!this.items.length){

        UI.empty(

            list,

            "Your cart is empty",

            "Add products to continue shopping."

        );

        return;

    }

    list.innerHTML=

    this.items.map(

        item=>`

<div class="cart-item">

<div class="cart-item-image">

<img

src="${item.image}"

alt="${item.name}"

loading="lazy">

</div>

<div>

<h5>

${item.name}

</h5>

<p>

${Utils.price(item.price)}

</p>

<div class="quantity-control">

<button

data-minus="${item.id}">

−

</button>

<input

type="number"

value="${item.quantity}"

min="1"

data-qty="${item.id}">

<button

data-plus="${item.id}">

+

</button>

</div>

</div>

<div>

<strong>

${Utils.price(

item.price*item.quantity

)}

</strong>

<br>

<button

class="btn btn-sm btn-outline-danger"

data-remove="${item.id}">

Remove

</button>

</div>

</div>

`

    ).join("");

    this.summary();

    this.bind();

},




/*==========================================================
 Summary
==========================================================*/

summary(){

    const total=

    document.getElementById(

        "cartTotal"

    );

    if(total)

        total.textContent=

        Utils.price(

            this.total()

        );

},




/*==========================================================
 Bind Buttons
==========================================================*/

bind(){

    document

    .querySelectorAll(

        "[data-remove]"

    )

    .forEach(btn=>{

        btn.onclick=()=>

        this.remove(

            btn.dataset.remove

        );

    });



    document

    .querySelectorAll(

        "[data-plus]"

    )

    .forEach(btn=>{

        btn.onclick=()=>{

            const id=

            btn.dataset.plus;

            const item=

            this.items.find(

                i=>i.id===id

            );

            this.quantity(

                id,

                item.quantity+1

            );

        };

    });



    document

    .querySelectorAll(

        "[data-minus]"

    )

    .forEach(btn=>{

        btn.onclick=()=>{

            const id=

            btn.dataset.minus;

            const item=

            this.items.find(

                i=>i.id===id

            );

            this.quantity(

                id,

                item.quantity-1

            );

        };

    });

},




/*==========================================================
 Events
==========================================================*/

events(){

    document.addEventListener(

        "cart:add",

        e=>{

            this.add(

                e.detail.product,

                e.detail.quantity

            );

        }

    );

}

};



export default Cart;