/*==========================================================
 JK Enterprises
 blog.js
 Version : 1.0
 Blog Module
==========================================================*/

"use strict";

import API from "./api.js";
import Router from "./router.js";
import UI from "./ui.js";

const Blog={

/*==========================================================
 Initialize
==========================================================*/

async init(){

    if(Router.isBlogs())

        await this.list();

    if(Router.isBlog())

        await this.article();

},



/*==========================================================
 Blog Listing
==========================================================*/

async list(){

    const grid=document.getElementById(

        "blogGrid"

    );

    if(!grid)return;

    UI.loader(grid);

    const response=

    await API.blogs({

        page:Router.pageNumber(),

        search:Router.search()

    });

    if(

        !response.success||

        !response.data?.length

    ){

        UI.empty(

            grid,

            "No Articles",

            "Blogs will appear here."

        );

        return;

    }

    grid.innerHTML=

    response.data

    .map(

        article=>UI.blogCard(article)

    )

    .join("");

},



/*==========================================================
 Blog Article
==========================================================*/

async article(){

    const article=

    document.getElementById(

        "blogArticle"

    );

    if(!article)return;

    UI.loader(article);

    const id=

    Router.id();

    if(!id){

        UI.error(

            article,

            "Article not found."

        );

        return;

    }

    const response=

    await API.blog(id);

    if(

        !response.success||

        !response.data

    ){

        UI.error(

            article,

            "Unable to load article."

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

render(blog){

    document.title=

    `${blog.title} | JK Enterprises`;

    const article=

    document.getElementById(

        "blogArticle"

    );

    article.innerHTML=

    UI.blog(blog);

    this.share(blog);

    this.related(blog.id);

    this.toc();

},



/*==========================================================
 Share
==========================================================*/

share(blog){

    document

    .querySelectorAll(

        "[data-share]"

    )

    .forEach(btn=>{

        btn.onclick=()=>{

            navigator.share?.({

                title:blog.title,

                text:blog.summary,

                url:window.location.href

            });

        };

    });

},



/*==========================================================
 Table Of Contents
==========================================================*/

toc(){

    const toc=

    document.getElementById(

        "tableOfContents"

    );

    if(!toc)return;

    const headings=[

        ...document.querySelectorAll(

            "#blogArticle h2,#blogArticle h3"

        )

    ];

    if(!headings.length){

        toc.remove();

        return;

    }

    toc.innerHTML=

        "<ul>"+

        headings.map((h,i)=>{

            h.id=`section-${i}`;

            return`

<li>

<a href="#${h.id}">

${h.textContent}

</a>

</li>

`;

        }).join("")+

        "</ul>";

},



/*==========================================================
 Related Articles
==========================================================*/

async related(id){

    const box=

    document.getElementById(

        "relatedBlogs"

    );

    if(!box)return;

    const response=

    await API.blogs({

        related:id

    });

    if(

        !response.success||

        !response.data?.length

    )return;

    box.innerHTML=

    response.data

    .map(

        blog=>UI.blogCard(blog)

    )

    .join("");

},



/*==========================================================
 Search Helper
==========================================================*/

search(keyword){

    window.location=

    `blogs.html?q=${encodeURIComponent(keyword)}`;

}

};

export default Blog;