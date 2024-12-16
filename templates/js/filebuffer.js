class FILE {
    constructor(name='',path='',ext='',size='',cont=''){
        this.Name = name;
        this.Path = path;
        this.Ext = ext;
        this.Size = Number(size);
        this.Content = cont; 
        this.Saved = true;
    }
}

var CURR_FILE = new FILE()

var BUFF_FILES = {}

function BUFF_ADD(f){
    BUFF_FILES[f.Path] = f
    updateHeader()
}

function BUFF_OPEN(path){
    // pushing the currfile content 
    if (CURR_FILE.Path != ''){
        CURR_FILE.Content = pre.textContent
        BUFF_FILES[CURR_FILE.Path] = CURR_FILE
    }

    // opening another files content
    CURR_FILE = BUFF_FILES[path] 
    pre.textContent = CURR_FILE.Content  

    updateHeader()
    Highlight()
}

function BUFF_REMOVE(path){ 
    let c = true
    if (BUFF_FILES[path].Saved == false) {
        c = confirm("The file is not saved, you want to close it anyway ?")
    }
    if (c){ 
        delete BUFF_FILES[path]  
        if (CURR_FILE.Path == path ){
            pre.innerHTML = ''
            cpre.innerHTML = '' 
            if (Object.keys(BUFF_FILES).length > 0){
                CURR_FILE = Object.values(BUFF_FILES)[0] 
                pre.textContent = CURR_FILE.Content
                Highlight()
            }else{
                CURR_FILE = new FILE()
            }
        }
        updateHeader()
    }
}

function updateHeader(){ 
    document.querySelector(".file-name-bar").innerHTML = ""
    for (let path in BUFF_FILES){
            if (path == CURR_FILE.Path){
                document.querySelector(".file-name-bar").innerHTML += `<div class="file-name-cont file-active" ><div onclick='BUFF_OPEN("${path}")'><span class="ball lang lang-${BUFF_FILES[path].Ext}">•</span><span class="file-name-cont-value">${BUFF_FILES[path].Name}</span></div><i class='bi-x-circle-fill' onclick='BUFF_REMOVE("${path}")'></i></div>`
            }else{
                document.querySelector(".file-name-bar").innerHTML += `<div class="file-name-cont " ><div onclick='BUFF_OPEN("${path}")'><span class="ball lang lang-${BUFF_FILES[path].Ext}">•</span><span class="file-name-cont-value">${BUFF_FILES[path].Name}</span></div><i class='bi-x-circle-fill' onclick='BUFF_REMOVE("${path}")'></i></div>`
            }
    }
}