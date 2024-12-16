var pre = document.querySelector('.pre')  
var cpre = document.querySelector('.cpre')  
var promptInp = document.querySelector('#prompt-inp')

function getCharacter(n) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const caretPosition = range.endOffset;
    const textContent = pre.textContent;
    if (caretPosition < textContent.length) {
      const nextChar = textContent.charAt(caretPosition+n);
      return nextChar
    } else {
      return 'ERROR'
    }
  }

function moveCaret(n) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const caretPosition = range.endOffset;
      if (caretPosition > 0) {
        range.setStart(range.startContainer, caretPosition + n);
        range.setEnd(range.startContainer, caretPosition + n);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
}

pre.oninput = function (){
    CURR_FILE.Saved = false
    Highlight() 
}

pre.addEventListener('keydown', function(e) {     
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { 
        e.preventDefault();
        save()
    }

    var braces = {
        "{" : "{}",
        "(" : "()",
        "[" : "[]",
        "'" : "''",
        '"' : '""',
    }

    switch(e.key){
        case "Enter" :
            e.preventDefault();
            pc = getCharacter(-1)
            nc = getCharacter(0) 
            //console.log("Previisuddddddd:",pc,"next:", nc,";")
            switch (pc ){
                case "{":
                    if (nc == "}"){
                        document.execCommand('insertHTML', false, '\n\t\n'); 
                        moveCaret(-1)
                    }else{
                        document.execCommand('insertHTML', false, '\n\t');  
                    }
                    break
                case "(":
                    if (nc == ")"){
                        document.execCommand('insertHTML', false, '\n\t\n'); 
                        moveCaret(-1)
                    }else{
                        document.execCommand('insertHTML', false, '\n\t');  
                    }
                    break
                case "[":
                    if (nc == "]"){
                        document.execCommand('insertHTML', false, '\n\t\n'); 
                        moveCaret(-1)
                    }else{
                        document.execCommand('insertHTML', false, '\n\t');  
                    }
                    break
                default :
                    document.execCommand('insertHTML', false, '\n');  
            }

            break;
        
        case "Tab" :
            e.preventDefault(); 
            document.execCommand('insertHTML', false, '\t'); 
            break;
        
        case  "{" :
        case "(" :
        case "[" :
        case "'" :
        case '"' :
            e.preventDefault();
            document.execCommand('insertHTML', false, braces[e.key] );  
            moveCaret(-1)
            break;
    }
}); 

pre.oncopy = function(e) {
    const selection = window.getSelection();
    const selectedContent = selection.toString();

    if (selectedContent) {
      // Modify clipboard data to exclude <pre> tag, but keep the content
      const clipboardData = e.clipboardData || window.clipboardData;
      clipboardData.setData('text/plain', selectedContent); // Only set plain text
      e.preventDefault(); // Prevent the default copying behavior
    }
  };

function escapeHtml(html) {
    return html
        .replace(/&/g, '&amp')
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/"/g, '&quot')
        .replace(/'/g, '&#39')
        .replace(/=/g, '&#61')
} 

function openFile(f){

    console.log(f.getAttribute("path")) 
    
    const fdata = new FILE(
        f.getAttribute("name"),
        f.getAttribute("path"),
        f.getAttribute("extension"), // extension
        f.getAttribute("size"), // size
        '', // content
    ) 

    if ( Number(f.size,10) > 10 ){
        alert("File is too large to open")
        return
    }else if ( fdata.Ext == "jpg" || fdata.Ext == 'jpeg' || fdata.Ext == 'png' || fdata.Ext == 'pdf' || fdata.Ext== 'webp' ){
        alert("Cannot open images")
        return
    }

    fetch('/file/', {
        method : "POST",
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(fdata),
    }) 
    .then(response => {
        if (!response.ok) {
            alert('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log("file fetched successfully")
        //console.log(data.content)
        pre.innerHTML = escapeHtml(data.content)  
        HSKeywords[fdata.Ext] = data.keywords
        
        fdata.Content = data.content

        // changing current file to this file
        CURR_FILE = fdata 

        // adding this file to the buffer 
        BUFF_ADD(CURR_FILE)

        Highlight()
        document.querySelector('.save-file-btn').disabled = false  
    })
    .catch(error => {
        console.log(error) // Handle any errors
    });
   
}

function save(){    
    if ( CURR_FILE.Name == "" ){
        alert("Open a file first !!")
        return
    }

    CURR_FILE.Content = pre.textContent  
    BUFF_ADD(CURR_FILE)  
    document.querySelector('.file-active').classList.remove('saved')

    fetch('/save/', {
        method : "POST",
        headers : {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(CURR_FILE),
    }) 
    .then(response => {
        if (!response.ok) {
            alert('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log(data.message)  
        if (data.message == "SUCCESS"){
            console.log("file saved successfully")
            CURR_FILE.Saved = true  
            document.querySelector('.file-active').classList.add('saved')
            Notify(new NOTIFICATION(`${CURR_FILE.Name} is saved.`,"SUCCESS"))
        }
    })
    .catch(error => {
        alert(error) // Handle any errors
    }); 
}

