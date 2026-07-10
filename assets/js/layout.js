/*==========================================================
 JK Enterprises | layout.js
==========================================================*/

"use strict";

import CONFIG from "./config.js";
import Router from "./router.js";

const Layout={

/*==========================================================
 Header
==========================================================*/

header(){

const nav=[
["Home","index"],
["Products","products"],
["Brands","brands"],
["Blogs","blogs"]
];

return`
<nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
<div class="container">

<a class="navbar-brand fw-bold" href="index.html">${CONFIG.SITE_NAME}</a>

<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar">
<span class="navbar-toggler-icon"></span>
</button>

<div class="collapse navbar-collapse" id="navbar">

<form class="d-flex order-lg-2 ms-lg-auto me-lg-3 my-2 my-lg-0" action="search.html">
<input class="form-control" type="search" name="q" placeholder="Search products...">
</form>

<ul class="navbar-nav order-lg-1 mx-lg-auto">

${nav.map(([t,p])=>`
<li class="nav-item">
<a class="nav-link ${Router.is(p)?"active":""}" href="${p}.html">${t}</a>
</li>
`).join("")}

</ul>

<div class="d-flex align-items-center gap-2 order-lg-3">

<a href="cart.html" class="btn btn-primary position-relative" aria-label="Cart">

🛒

<span id="cartCount" data-cart-count class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
0
</span>

</a>

</div>

</div>

</div>
</nav>`;

},

/*==========================================================
 Footer
==========================================================*/

footer(){

return`
<footer class="border-top py-5 mt-5 bg-body-tertiary">

<div class="container">

<div class="row g-4">

<div class="col-md-4">
<h5>${CONFIG.COMPANY.NAME}</h5>
<p class="small text-secondary mb-0">${CONFIG.SITE_DESCRIPTION}</p>
</div>

<div class="col-md-4">
<h6>Quick Links</h6>
<ul class="list-unstyled mb-0">
<li><a href="about.html">About</a></li>
<li><a href="contact.html">Contact</a></li>
<li><a href="faq.html">FAQ</a></li>
<li><a href="privacy.html">Privacy</a></li>
<li><a href="terms.html">Terms</a></li>
</ul>
</div>

<div class="col-md-4">
<h6>Contact</h6>
<p class="small mb-1">${CONFIG.COMPANY.PHONE}</p>
<p class="small mb-1">${CONFIG.COMPANY.EMAIL}</p>
<p class="small mb-0">${CONFIG.COMPANY.ADDRESS}</p>
</div>

</div>

<hr>

<p class="small text-center text-secondary mb-0">
© ${new Date().getFullYear()} ${CONFIG.COMPANY.NAME}. All Rights Reserved.
</p>

</div>

</footer>`;

},

/*==========================================================
 Render
==========================================================*/

init(){

const h=document.getElementById("siteHeader");
const f=document.getElementById("siteFooter");

if(h)h.innerHTML=this.header();
if(f)f.innerHTML=this.footer();

}

};

export default Layout;
