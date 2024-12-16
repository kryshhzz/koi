
let HSKeywords = {}

function Highlight(){ 
    let content = escapeHtml(pre.textContent) 

    if (CURR_FILE.Ext in HSKeywords){
        HSKeywords[CURR_FILE.Ext].forEach((k)=>{ 
            content = content.replace(new RegExp(k.Regex,"g"),(match)=>`<${k.Wrapper} class='${k.Color}'>${match}</${k.Wrapper}>`)
        })
    } 

    let ncontent = ""
    content.split('\n').forEach((line)=>{
        ncontent += "<span class='cline'>"+line+"</span><br>"
    }) 

    cpre.innerHTML = ncontent
}

pre.addEventListener('scroll', function() {
    // Sync the scroll position of the second div with the first div
    cpre.scrollTop = pre.scrollTop;
    cpre.scrollLeft = pre.scrollLeft;
    // document.querySelector('.lineNoHolder').scrollTop  = pre.scrollTop
});
