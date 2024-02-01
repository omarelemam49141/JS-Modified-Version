import {CustomerMessages} from "./classes.js";
import { updateLocalStorage } from "./general-methods.js";

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let listOfMessages = JSON.parse(localStorage.getItem("messages")) || [];

let cs, lyerCSOverlay;
window.addEventListener("load", function(){
	let arrowBack = document.querySelector(".arrowBackCS");
	cs = document.querySelector(".customerService");
	lyerCSOverlay = document.querySelector(".customerService-overlay");
	let btnCS = document.querySelector("#btnCS");

	//add the event listeners
	//arrowback for the customerservice
	arrowBack.addEventListener("click", hideCustomerService);
	//button to display the custmer service
	btnCS.addEventListener("click", showCustomerService);

	//sending the customer service message
	document.getElementById("btnSubmit").addEventListener("click", sendMessage);
})

//display the area where the customer can send his messages
function showCustomerService() {
    cs.classList.add("show");
    lyerCSOverlay.classList.add("show");
}

//Hide the area where the customer can send his messages
function hideCustomerService() {
    lyerCSOverlay.classList.remove("show");
    cs.classList.remove("show");
}

//Sending the message functionality
function sendMessage() {
	let msg = document.getElementById("message").value;	
	if(msg.trim().length == 0) //no message provided
	{
		document.getElementById("alert-msg").style.display = "block";
		return;
	}
	
	document.getElementById("alert-msg").style.display = "none";

	let messageObj = new CustomerMessages(listOfMessages.length, loggedInUser.userName, msg, new Date());
	listOfMessages.push(messageObj);
	updateLocalStorage("messages" ,listOfMessages);
	document.getElementById("message").value = "";
	document.getElementById("success-msg").style.display = "block";
	setTimeout(()=>{
		document.getElementById("success-msg").style.display = "none";
	}, 3000)
}
