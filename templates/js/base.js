var alertBowl = document.querySelector('.alert-bowl')
var alertBox = document.querySelector('.alert-box')
var promptBox = document.querySelector('.prompt-box')
var alertP = document.querySelector('.alert-p')
let fullscreen = false 

var notifs_bowl = document.querySelector(".notifs-bowl")

class NOTIFICATION { 
    // types : INFO; ERROR ; SUCCESS;
    constructor(msg="",type="INFO",burst="BURST"){
        this.Message = msg
        this.Type = type
        this.Burst = burst
    }
}

function Notify(n){
    notifs_bowl.innerHTML +=   `<div class='notif-cont notif-${n.Type} notif-${n.Burst}'> <button onclick='removeNotif(this)'><i class='bi-x-lg'></i></button> ${n.Message}</div>`  
    setTimeout(function() {
        document.querySelectorAll(".notif-BURST").forEach((n)=>{
            notifs_bowl.removeChild(n)
        })
    }, 2000);
}

function removeNotif(n){
    notifs_bowl.removeChild(n.parentNode)
}

function kalert(t){
    alertBowl.classList.remove('hide')
    alertBox.classList.remove('hide')
    alertP.innerText = t;
}
function closeAlert(){
    alertBowl.classList.add('hide')
    alertBox.classList.add('hide')
}

function kprompt(q){
    alertBowl.classList.remove('hide')
    promptBox.classList.remove('hide')
    alertP.innerText = q; 
} 

function closePrompt(){ 
    alertBowl.classList.add('hide')
    promptBox.classList.add('hide')
}

document.onkeydown = (e)=>{
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') { 
        e.preventDefault();
        toggleSideBar()
    }else if ((e.ctrlKey || e.metaKey) && e.key === 'k' ) {
            e.preventDefault();
            toggleFullScreen()
    }
    else if ((e.ctrlKey || e.metaKey) && e.key === 'i' ) {
        e.preventDefault();
        toggleIro()
    }
}
function toggleSideBar() {
    document.querySelector('.panel').classList.toggle("hide") 
}

function toggleIro() {
    document.querySelector('.iro-bowl').classList.toggle("hide") 
}

function toggleFullScreen(){
    if (fullscreen == true){
        closeFullScreen()
        document.querySelector('.toggler').ariaLabel = "Open Full Screen"
    }else{
        openFullScreen()
        document.querySelector('.toggler').ariaLabel = "Close Full Screen"
    }
    fullscreen = !fullscreen
}
function openFullScreen() {
    let elem = document.body
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
}

function closeFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

function closeKOI(){   
    if (confirm("KOI will be closed ?") != true){
        return
    }
    fetch('/close/') 
    .catch(error => {
        alert('Error:', error); // Log any error that might occur
    });
    Notify(new NOTIFICATION('Koi is closed',"ERROR",""))
}