import { renderingNavBar } from "./general-methods.js";
import { LogOut } from "./general-methods.js";
//check if the user is logged in
let loggedInUser = null;
if(localStorage.getItem("loggedInUser") != null){
   loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
}

window.addEventListener("load", function(){
    //implement the logout functionality
   renderingNavBar();

   LogOut();
});
