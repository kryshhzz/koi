var pre = document.querySelector('.pre')  
var fileNameCont = document.querySelector('.file-name-cont');

var CURRFILE = {
    Name : "",
    Path : "",
    Size : 0,
} 

function addLines(content){
    pre.innerHTML = content 
}

pre.addEventListener('keydown', function(e) { 
    if ((e.ctrlKey || e.metaKey) && e.key === 's') { 
        e.preventDefault();
        save()
    }else if(e.key === 'Enter'){   
        e.preventDefault();  
        document.execCommand('insertHTML', false, '\n');  
    }else if(e.key === 'Tab'){ 
        e.preventDefault();
        document.execCommand('insertHTML', false, '\t'); 
    }else if(e.key === "{"){
        document.execCommand('insertHTML', false, '{\n}');  
        e.preventDefault();
    }else if(e.key === "("){
        document.execCommand('insertHTML', false, '()');  
        e.preventDefault();
    }else if(e.key === "["){
        document.execCommand('insertHTML', false, '[]');  
        e.preventDefault();
    }else if(e.key === '"'){
        document.execCommand('insertHTML', false, '""');  
        e.preventDefault();
    } 
    fileNameCont.style.color = "red";
}); 

function escapeHtml(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function openFile(f){

    console.log(f.getAttribute("path")) 
    
    const fdata = {
        Path : f.getAttribute("path"),
        Name : f.querySelector('.panel-name').innerHTML, 
        Content : "", 
        Size : parseInt(f.getAttribute("size"),10),
    } 

    if (fdata.Size > 5 ){
        alert("File is too large to open")
        return
    }else if ( fdata.Name.endsWith(".jpg") || fdata.Name.endsWith(".jpeg") || fdata.Name.endsWith(".png") || fdata.Name.endsWith(".pdf") || fdata.Name.endsWith(".webp") ){
        alert("Unable to open this file")
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
        console.log('Success:', data); 
        addLines(escapeHtml(data.content));
        fileNameCont.innerHTML = fdata.Name; 
        fileNameCont.style.color = 'black';
        CURRFILE.Name = fdata.Name
        CURRFILE.Path = fdata.Path 
        CURRFILE.Size = fdata.Size
        document.querySelector('.save-file-btn').disabled = false  
    })
    .catch(error => {
        alert(error) // Handle any errors
    });
}

function save(){  
    if ( CURRFILE.Name == "" ){
        alert("Open a file first")
        return
    }
    const tempDiv = document.createElement('div'); 
    tempDiv.innerHTML = pre.innerHTML
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    const fdata = {
        Path : CURRFILE.Path,
        Name : CURRFILE.Name, 
        Content : plainText, 
        Size : CURRFILE.Size,
    }
    console.log(pre.innerHTML)

    fetch('/save/', {
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
        console.log(data.message)  
        if (data.message == "SUCCESS"){
            fileNameCont.style.color = 'green';
        }
    })
    .catch(error => {
        alert(error) // Handle any errors
    });
}

function closeKOI(){   
    if (confirm("KOI will be closed ?") != true){
        return
    }
    fetch('/close/') 
    .catch(error => {
        alert('Error:', error); // Log any error that might occur
    });
}