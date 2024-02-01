import { LogOut } from "./general-methods.js";
import { renderingNavBar } from "./general-methods.js";

let loggedInUser = localStorage.getItem("loggedInUser");
//if the user is not logged in then go back to index.html
if(loggedInUser == null){
    window.location.href = "index.html";
} else {
    //If the user role is customer then display the cart and the customer service buttons
    if (JSON.parse(loggedInUser).userRole == "customer") {
        document.getElementById("cartListItem").style.display = "block";
        document.getElementById("btnCS").style.display = "block";
    }
}

window.addEventListener("load", function(){
    renderingNavBar();
    this.document.getElementById("welcome-user").innerHTML ="Welcome, " +  JSON.parse(localStorage.getItem("loggedInUser")).userName;
    LogOut();
})