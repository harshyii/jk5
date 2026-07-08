/*==========================================================
 JK Enterprises
 blog.js
 Version : 2.0
 Blog Module
 Part 1
==========================================================*/

"use strict";

import API from "./api.js";
import Router from "./router.js";
import UI from "./ui.js";
import Utils from "./utils.js";

const Blog={

/*==========================================================
 State
==========================================================*/

page:1,

limit:9,

keyword:"",

category:"",

featuredOnly:false,

loading:false,

blogs:[],

/*==========================================================
 Initialize
==========================================================*/

async init(){

    if(Router.isBlogs()){

        this.page=

        Router.pageNumber()||1;

        this.keyword=

        Router.search()||"";

        this.category =

        Router.category() || "";

        await this.list();

        this.bind();

    }

    if(Router.isBlog()){

        await this.article();

    }

},

/*==========================================================
 Bind Events
==========================================================*/

bind(){

    const search=

    document.getElementById(

        "blogSearch"

    );

    if(search){

        search.value=this.keyword;

        search.addEventListener(

            "input",

            Utils.debounce(e=>{

                this.keyword=e.target.value;

                this.page=1;

                this.list();

            },400)

        );

    }

    const category=

    document.getElementById(

        "blogCategoryFilter"

    );

    if(category){

        category.addEventListener(

            "change",

            e=>{

                this.category=

                e.target.value;

                this.page=1;

                this.list();

            }

        );

    }

},

/*==========================================================
 Blog Listing
==========================================================*/

async list(){

    if(this.loading)

        return;

    this.loading=true;

    const grid=

    document.getElementById(

        "blogGrid"

    );

    if(!grid)

        return;

    this.loader(grid);

    try{

        const response=

        await API.blogs({

            page:this.page,

            limit:this.limit,

            search:this.keyword,

            category:this.category

        });

        if(

            !response.success ||

            !response.data

        ){

            this.empty(grid);

            this.loading=false;

            return;

        }

        this.blogs=

        response.data;

        this.render(grid);

        this.pagination(

            response.total ||

            this.blogs.length

        );

        await this.categories();

    }

    catch(error){

        console.error(error);

        this.empty(grid);

    }

    this.loading=false;

},

/*==========================================================
 Render Listing
==========================================================*/

render(grid){

    if(!this.blogs.length){

        this.empty(grid);

        return;

    }

    grid.innerHTML=

    this.blogs.map(blog=>

        UI.blogCard(blog)

    ).join("");

},

/*==========================================================
 Categories
==========================================================*/

async categories(){

    const response = await API.blogCategories();

    if(

        !response.success ||

        !response.data

    )

        return;

    const selects = [

        document.getElementById("blogCategoryFilter"),

        document.getElementById("blogCategorySidebar")

    ].filter(Boolean);

    selects.forEach(select=>{

        if(select.options.length>1)

            return;

        response.data.forEach(cat=>{

            const option = document.createElement("option");

            option.value = cat;

            option.textContent = cat;

            if(cat === this.category)

                option.selected = true;

            select.append(option);

        });

    });

},


/*==========================================================
 Featured Blogs
==========================================================*/

async featured(){

    const container=

    document.getElementById(

        "featuredBlogs"

    );

    if(!container)

        return;

    const response=

    await API.featuredBlogs();

    if(

        !response.success ||

        !response.data?.length

    ){

        container.remove();

        return;

    }

    container.innerHTML=

    response.data

    .slice(0,3)

    .map(blog=>

        UI.blogHero(blog)

    )

    .join("");

},

/*==========================================================
 Pagination
==========================================================*/

pagination(total){

    const box=

    document.getElementById(

        "blogPagination"

    );

    if(!box)

        return;

    const pages=

    Math.ceil(

        total/this.limit

    );

    if(pages<=1){

        box.innerHTML="";

        return;

    }

    let html="";

    for(

        let i=1;

        i<=pages;

        i++

    ){

        html+=`

<button

class="btn ${

i===this.page

?

"btn-primary"

:

"btn-outline-primary"

}"

data-page="${i}">

${i}

</button>

`;

    }

    box.innerHTML=html;

    box.querySelectorAll(

        "[data-page]"

    )

    .forEach(btn=>{

        btn.onclick=()=>{

            this.page=

            Number(

                btn.dataset.page

            );

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

            this.list();

        };

    });

},

/*==========================================================
 Skeleton Loader
==========================================================*/

loader(grid){

    grid.innerHTML=

    Array(6).fill(`

<div class="col-md-4">

<div class="card h-100">

<div
class="placeholder w-100"
style="height:220px">
</div>

<div class="card-body">

<p class="placeholder-glow">

<span class="placeholder col-8"></span>

</p>

<p class="placeholder-glow">

<span class="placeholder col-10"></span>

</p>

<p class="placeholder-glow">

<span class="placeholder col-6"></span>

</p>

</div>

</div>

</div>

`).join("");

},

/*==========================================================
 Empty
==========================================================*/

empty(grid){

    UI.empty(

        grid,

        "No Articles Found",

        "Try another search or category."

    );

},


/*==========================================================
 Blog Article
==========================================================*/

async article(){

    const slug = Router.id();

    if(!slug){

        UI.error(

            document.getElementById("blogContent"),

            "Blog not found."

        );

        return;

    }

    const response = await API.blog(slug);

    if(!response.success || !response.data){

        UI.error(

            document.getElementById("blogContent"),

            "Unable to load article."

        );

        return;

    }

    this.blog = response.data;

    await this.renderArticle();

},

/*==========================================================
 Render Complete Article
==========================================================*/

async renderArticle(){

    this.renderMeta();

    await this.renderMarkdown();

    await this.renderFAQ();

    await this.renderRelatedProducts();

    await this.renderRelatedBlogs();

    this.bindShare();

    this.updateSEO();

    this.progressBar();

    this.toc();

    this.lightbox();

    this.navigation();

    this.jsonLD();

    this.view();

    this.cache();

    },

/*==========================================================
 Metadata
==========================================================*/

renderMeta(){

    const blog=this.blog;

    document.title=

    blog.MetaTitle ||

    blog.Title;

    document.getElementById(

        "breadcrumbTitle"

    ).textContent=

    blog.Title;

    document.getElementById(

        "blogTitle"

    ).textContent=

    blog.Title;

    document.getElementById(

        "blogCategory"

    ).textContent=

    blog.Category;

    document.getElementById(

        "sideCategory"

    ).textContent=

    blog.Category;

    document.getElementById(

        "blogAuthor"

    ).textContent=

    blog.Author;

    document.getElementById(

        "publishDate"

    ).textContent=

    blog.PublishDate;

    document.getElementById(

        "updatedDate"

    ).textContent=

    blog.LastUpdated;

    document.getElementById(

        "readingTime"

    ).textContent=

    blog.ReadingTime +

    " min";

    document.getElementById(

        "blogTags"

    ).textContent=

    blog.Tags;

    const image=

    document.getElementById(

        "featuredImage"

    );

    image.src=

    "assets/images/blogs/"+

    blog.FeaturedImage;

    image.alt=

    blog.ImageAlt;

},

/*==========================================================
 Markdown
==========================================================*/

async renderMarkdown(){

    const container=

    document.getElementById(

        "blogContent"

    );

    try{

        const markdown=

        await fetch(

            "assets/blogs/"+

            this.blog.ContentFile

        ).then(r=>r.text());

        container.innerHTML=

        marked.parse(markdown);

    }

    catch{

        container.innerHTML=

        "<div class='alert alert-warning'>Article content unavailable.</div>";

    }

},

/*==========================================================
 FAQ
==========================================================*/

async renderFAQ(){

    const box=

    document.getElementById(

        "blogFAQ"

    );

    if(!box ||

       !this.blog.FAQFile)

        return;

    try{

        const faq=

        await fetch(

            "assets/blogs/"+

            this.blog.FAQFile

        ).then(r=>r.text());

        box.innerHTML=

        marked.parse(faq);

    }

    catch{

        box.remove();

    }

},

/*==========================================================
 Related Products
==========================================================*/

async renderRelatedProducts(){

    const grid=

    document.getElementById(

        "relatedProducts"

    );

    if(!grid)

        return;

    const ids=

    String(

        this.blog.RelatedProducts ||

        ""

    )

    .split(",")

    .filter(Boolean);

    if(!ids.length){

        grid.innerHTML="";

        return;

    }

    const cards=[];

    for(const id of ids){

        const response=

        await API.product(

            id.trim()

        );

        if(

            response.success &&

            response.data

        ){

            cards.push(

                UI.productCard(

                    response.data

                )

            );

        }

    }

    grid.innerHTML=

    cards.join("");

},

/*==========================================================
 Related Blogs
==========================================================*/

async renderRelatedBlogs(){

    const grid=

    document.getElementById(

        "relatedBlogs"

    );

    if(!grid)

        return;

    const ids=

    String(

        this.blog.RelatedBlogs ||

        ""

    )

    .split(",")

    .filter(Boolean);

    if(!ids.length){

        grid.innerHTML="";

        return;

    }

    const cards=[];

    for(const id of ids){

        const response=

        await API.blog(

            id.trim()

        );

        if(

            response.success &&

            response.data

        ){

            cards.push(

                UI.blogCard(

                    response.data

                )

            );

        }

    }

    grid.innerHTML=

    cards.join("");

},

/*==========================================================
 Share
==========================================================*/

bindShare(){

    document

    .querySelectorAll(

        "[data-share]"

    )

    .forEach(btn=>{

        btn.onclick=()=>{

            if(navigator.share){

                navigator.share({

                    title:this.blog.Title,

                    text:this.blog.Excerpt,

                    url:location.href

                });

            }

        };

    });

},

/*==========================================================
 SEO
==========================================================*/

updateSEO(){

    const blog=this.blog;

    document

    .querySelector(

        'meta[name="description"]'

    )

    ?.setAttribute(

        "content",

        blog.MetaDescription ||

        blog.Excerpt

    );

},

/*==========================================================
 Reading Progress
==========================================================*/

progressBar(){

    window.addEventListener(

        "scroll",

        ()=>{

            const max=

            document.body.scrollHeight-

            window.innerHeight;

            const progress=

            window.scrollY/max*100;

            document.documentElement.style.setProperty(

                "--reading-progress",

                progress+"%"

            );

        }

    );

},

/*==========================================================
 Copy Link
==========================================================*/

copyLink(){

    navigator.clipboard.writeText(location.href);

    UI.toast(

        "Article link copied."

    );

},

/*==========================================================
 WhatsApp
==========================================================*/

shareWhatsapp(){

    window.open(

        "https://wa.me/?text="+

        encodeURIComponent(

            this.blog.Title+

            "\n"+

            location.href

        ),

        "_blank"

    );

},

/*==========================================================
 Facebook
==========================================================*/

shareFacebook(){

    window.open(

        "https://www.facebook.com/sharer/sharer.php?u="+

        encodeURIComponent(location.href),

        "_blank"

    );

},

/*==========================================================
 Twitter / X
==========================================================*/

shareTwitter(){

    window.open(

        "https://twitter.com/intent/tweet?text="+

        encodeURIComponent(

            this.blog.Title

        )+

        "&url="+

        encodeURIComponent(

            location.href

        ),

        "_blank"

    );

},

/*==========================================================
 LinkedIn
==========================================================*/

shareLinkedIn(){

    window.open(

        "https://www.linkedin.com/sharing/share-offsite/?url="+

        encodeURIComponent(

            location.href

        ),

        "_blank"

    );

},

/*==========================================================
 JSON LD
==========================================================*/

jsonLD(){

    const data={

        "@context":"https://schema.org",

        "@type":

        this.blog.SchemaType ||

        "TechArticle",

        headline:

        this.blog.Title,

        image:

        location.origin+

        "/assets/images/blogs/"+

        this.blog.FeaturedImage,

        author:{

            "@type":"Organization",

            name:

            this.blog.Author

        },

        publisher:{

            "@type":"Organization",

            name:"JK Enterprises"

        },

        datePublished:

        this.blog.PublishDate,

        dateModified:

        this.blog.LastUpdated,

        description:

        this.blog.Excerpt,

        mainEntityOfPage:

        location.href

    };

    const script=

    document.createElement(

        "script"

    );

    script.type=

    "application/ld+json";

    script.textContent=

    JSON.stringify(data);

    document.head.append(script);

},

/*==========================================================
 Previous / Next
==========================================================*/

async navigation(){

    const response=

    await API.blogs();

    if(

        !response.success ||

        !response.data

    )

        return;

    const blogs=

    response.data;

    const index=

    blogs.findIndex(item=>

        item.Slug==

        this.blog.Slug

    );

    if(index>0){

        const prev=

        document.getElementById(

            "prevBlog"

        );

        if(prev){

            prev.href=

            "blog.html?id="+

            blogs[index-1].Slug;

            prev.textContent=

            blogs[index-1].Title;

        }

    }

    if(index<blogs.length-1){

        const next=

        document.getElementById(

            "nextBlog"

        );

        if(next){

            next.href=

            "blog.html?id="+

            blogs[index+1].Slug;

            next.textContent=

            blogs[index+1].Title;

        }

    }

},

/*==========================================================
 Reading Time
==========================================================*/

calculateReading(){

    const words=

    document

    .getElementById(

        "blogContent"

    )

    .innerText

    .split(/\s+/)

    .length;

    return Math.max(

        1,

        Math.ceil(

            words/200

        )

    );

},

/*==========================================================
 Table Of Contents
==========================================================*/

toc(){

    const headings=

    document

    .querySelectorAll(

        "#blogContent h2,#blogContent h3"

    );

    const toc=

    document.getElementById(

        "tableOfContents"

    );

    if(

        !toc ||

        !headings.length

    )

        return;

    toc.innerHTML="";

    headings.forEach((h,i)=>{

        const id=

        "toc-"+i;

        h.id=id;

        toc.innerHTML+=`

<li>

<a href="#${id}">

${h.textContent}

</a>

</li>

`;

    });

},

/*==========================================================
 Image Lightbox
==========================================================*/

lightbox(){

    document

    .querySelectorAll(

        "#blogContent img"

    )

    .forEach(img=>{

        img.loading="lazy";

        img.style.cursor=

        "zoom-in";

        img.onclick=()=>{

            window.open(

                img.src,

                "_blank"

            );

        };

    });

},

/*==========================================================
 View Counter
==========================================================*/

view(){

    localStorage.setItem(

        "blog-"+

        this.blog.Slug,

        Date.now()

    );

},

/*==========================================================
 Cache
==========================================================*/

cache(){

    sessionStorage.setItem(

        "blog-"+

        this.blog.Slug,

        JSON.stringify(

            this.blog

        )

    );

}

};

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Blog.init();

    }

);

export default Blog;