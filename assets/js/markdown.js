/*==========================================================
 JK Enterprises
 markdown.js
 Version : 1.0
 Markdown Parser
==========================================================*/

"use strict";

const Markdown={

/*==========================================================
 Render
==========================================================*/

render(markdown=""){

    let html = String(markdown);
/*------------------------------------------------------
  FAQ Blocks
------------------------------------------------------*/

let faqIndex = 0;

html = html.replace(

/:::faq\s+([\s\S]*?)\n([\s\S]*?):::/g,

(_,question,answer)=>{

faqIndex++;

return `

<div class="faq-card card mb-3">

<div
class="card-header faq-question"
data-bs-toggle="collapse"
data-bs-target="#faq${faqIndex}"
style="cursor:pointer;">

<div class="d-flex justify-content-between align-items-center">

<strong>

${question.trim()}

</strong>

<span class="faq-icon">

+

</span>

</div>

</div>

<div
id="faq${faqIndex}"
class="collapse">

<div class="card-body">

${this.render(answer.trim())}

</div>

</div>

</div>

`;

}

);
/*------------------------------------------------------
  Remove YAML Front Matter
------------------------------------------------------*/

html = html.replace(
    /^---\s*\n[\s\S]*?\n---\s*\n?/,
    ""
);



    /*------------------------------------------------------
      Escape
    ------------------------------------------------------*/

    html=html

    .replace(/\r\n/g,"\n")

    .replace(/\r/g,"\n");



    /*------------------------------------------------------
      Code Blocks
    ------------------------------------------------------*/

    html=html.replace(

        /```([\s\S]*?)```/g,

        (_,code)=>`

<pre>

<code>

${this.escape(code.trim())}

</code>

</pre>

`

    );



    /*------------------------------------------------------
      Inline Code
    ------------------------------------------------------*/

    html=html.replace(

        /`([^`]+)`/g,

        "<code>$1</code>"

    );



    /*------------------------------------------------------
      Images
    ------------------------------------------------------*/

    html=html.replace(

        /!\[(.*?)\]\((.*?)\)/g,

        `

<img

loading="lazy"

src="$2"

alt="$1">

`

    );



    /*------------------------------------------------------
      Links
    ------------------------------------------------------*/

    html=html.replace(

        /\[(.*?)\]\((.*?)\)/g,

        `<a href="$2">$1</a>`

    );



    /*------------------------------------------------------
      Bold
    ------------------------------------------------------*/

    html=html.replace(

        /\*\*(.*?)\*\*/g,

        "<strong>$1</strong>"

    );



    /*------------------------------------------------------
      Italic
    ------------------------------------------------------*/

    html=html.replace(

        /\*(.*?)\*/g,

        "<em>$1</em>"

    );



    /*------------------------------------------------------
      Headings
    ------------------------------------------------------*/

    html=html.replace(/^###### (.*)$/gm,"<h6>$1</h6>");

    html=html.replace(/^##### (.*)$/gm,"<h5>$1</h5>");

    html=html.replace(/^#### (.*)$/gm,"<h4>$1</h4>");

    html=html.replace(/^### (.*)$/gm,"<h3>$1</h3>");

    html=html.replace(/^## (.*)$/gm,"<h2>$1</h2>");

    html=html.replace(/^# (.*)$/gm,"<h1>$1</h1>");



    /*------------------------------------------------------
      Horizontal Rule
    ------------------------------------------------------*/

    html=html.replace(

        /^---$/gm,

        "<hr>"

    );



    /*------------------------------------------------------
      Blockquote
    ------------------------------------------------------*/

    html=html.replace(

        /^> (.*)$/gm,

        "<blockquote>$1</blockquote>"

    );



    /*------------------------------------------------------
      Unordered Lists
    ------------------------------------------------------*/

    html=html.replace(

        /(?:^- .*(?:\n|$))+?/gm,

        match=>{

            const items=match

            .trim()

            .split("\n")

            .map(

                line=>`

<li>

${line.replace(/^- /,"")}

</li>

`

            )

            .join("");



            return`

<ul>

${items}

</ul>

`;

        }

    );



    /*------------------------------------------------------
      Ordered Lists
    ------------------------------------------------------*/

    html=html.replace(

        /(?:^\d+\. .*(?:\n|$))+?/gm,

        match=>{

            const items=match

            .trim()

            .split("\n")

            .map(

                line=>`

<li>

${line.replace(/^\d+\. /,"")}

</li>

`

            )

            .join("");



            return`

<ol>

${items}

</ol>

`;

        }

    );



    /*------------------------------------------------------
      Paragraphs
    ------------------------------------------------------*/

    html=html

    .split(/\n{2,}/)

    .map(block=>{

        block=block.trim();



        if(

            /^<(h\d|ul|ol|pre|blockquote|img|hr)/.test(block)

        )

            return block;



        return`

<p>

${block.replace(/\n/g,"<br>")}

</p>

`;

    })

    .join("\n");



    return html;

},



/*==========================================================
 Escape HTML
==========================================================*/

escape(text){

    const div=document.createElement("div");

    div.textContent=text;

    return div.innerHTML;

}

};

export default Markdown;