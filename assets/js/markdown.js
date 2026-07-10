/*==========================================================
 JK Enterprises | markdown.js
==========================================================*/

"use strict";

const Markdown={

/*==========================================================
 Render
==========================================================*/

render(md=""){

let html=String(md),faq=0;

/*----------------------------------------------------------
 FAQ Blocks
----------------------------------------------------------*/

html=html.replace(/:::faq\s+([\s\S]*?)\n([\s\S]*?):::/g,(_,q,a)=>`
<div class="faq-card card mb-3">
<div class="card-header faq-question" data-bs-toggle="collapse" data-bs-target="#faq${++faq}" style="cursor:pointer;">
<div class="d-flex justify-content-between align-items-center">
<strong>${q.trim()}</strong>
<span class="faq-icon">+</span>
</div>
</div>
<div id="faq${faq}" class="collapse">
<div class="card-body">${this.render(a.trim())}</div>
</div>
</div>`);

/*----------------------------------------------------------
 Cleanup
----------------------------------------------------------*/

html=html
.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/,"")
.replace(/\r\n/g,"\n")
.replace(/\r/g,"\n");

/*----------------------------------------------------------
 Code
----------------------------------------------------------*/

html=html
.replace(/```([\s\S]*?)```/g,(_,c)=>`<pre><code>${this.escape(c.trim())}</code></pre>`)
.replace(/`([^`]+)`/g,"<code>$1</code>");

/*----------------------------------------------------------
 Media
----------------------------------------------------------*/

html=html
.replace(/!\[(.*?)\]\((.*?)\)/g,'<img loading="lazy" src="$2" alt="$1">')
.replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2">$1</a>');

/*----------------------------------------------------------
 Text
----------------------------------------------------------*/

html=html
.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
.replace(/\*(.*?)\*/g,"<em>$1</em>");

/*----------------------------------------------------------
 Headings
----------------------------------------------------------*/

html=html
.replace(/^###### (.*)$/gm,"<h6>$1</h6>")
.replace(/^##### (.*)$/gm,"<h5>$1</h5>")
.replace(/^#### (.*)$/gm,"<h4>$1</h4>")
.replace(/^### (.*)$/gm,"<h3>$1</h3>")
.replace(/^## (.*)$/gm,"<h2>$1</h2>")
.replace(/^# (.*)$/gm,"<h1>$1</h1>");

/*----------------------------------------------------------
 Blocks
----------------------------------------------------------*/

html=html
.replace(/^---$/gm,"<hr>")
.replace(/^> (.*)$/gm,"<blockquote>$1</blockquote>");
/*----------------------------------------------------------
 Lists
----------------------------------------------------------*/

html=html.replace(/(?:^- .*(?:\n|$))+?/gm,m=>`<ul>${m.trim().split("\n").map(i=>`<li>${i.replace(/^- /,"")}</li>`).join("")}</ul>`);

html=html.replace(/(?:^\d+\. .*(?:\n|$))+?/gm,m=>`<ol>${m.trim().split("\n").map(i=>`<li>${i.replace(/^\d+\. /,"")}</li>`).join("")}</ol>`);

/*----------------------------------------------------------
 Paragraphs
----------------------------------------------------------*/

return html.split(/\n{2,}/).map(b=>{

b=b.trim();

return /^<(h\d|ul|ol|pre|blockquote|img|hr)/.test(b)
?b
:`<p>${b.replace(/\n/g,"<br>")}</p>`;

}).join("\n");

},

/*==========================================================
 Escape
==========================================================*/

escape(text){

const div=document.createElement("div");
div.textContent=text;
return div.innerHTML;

}

};

export default Markdown;