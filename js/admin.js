let messages = JSON.parse(localStorage.getItem("messages")) || [];

window.addEventListener("load", function(){
    if (messages.length != 0) {
        this.document.querySelector(".messageCount").innerHTML = messages.length;
    } else {
        this.document.querySelector(".messageCount").innerHTML = "";
    }
    
})