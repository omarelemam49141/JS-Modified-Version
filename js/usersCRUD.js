import {users} from "./classes.js" 
import {  handleFormSubmit } from "../sign-up/sign-up.js";
import { isValidEmail, isValidPassword, isValidName } from "./profile.js";
let allUsers = JSON.parse(localStorage.getItem("users")).filter(user=>user.userRole != "admin");

let selectedUser = {
    userID: -1,
    userName: "",
    userPassword: "",
    userEmail: "",
    userRole: ""
};

let tableBody, tableHead;

let usersFilter="all";
let filteredUsers = [];

//pagination variables
let numberOfUsersPerPage = 4;
let pageNumber = 1;
let start = 0;
let end = numberOfUsersPerPage;
let numberOfBtns = 0;

window.addEventListener("load", function(){
    //Get the users from local storage and make a table with all users except for those whose userRole is admin
    //Display all users
    tableBody = document.getElementsByTagName("tbody")[0];
    tableHead = document.getElementsByTagName("thead")[0];
    //display table headers
    let row = tableHead.insertRow(-1);
    for (const key in allUsers[0]) {
        row.innerHTML += `<th>${key}</th>`;
    }
    row.innerHTML += `<th>Actions</th>`;
    
    DisplayUsers(allUsers);
    //display the pagination
    displayPagination(allUsers);

    //if clicked on edit or delete
    tableBody.addEventListener("click", function(event){
        if(event.target.nodeName=="I")
        {
            let row = event.target.parentNode.parentNode.parentNode;
            //Set the userName and the userId to delete with the current row info
            selectedUser.userID = row.children[0].innerHTML;
            selectedUser.userName = row.children[1].innerHTML;
            selectedUser.userEmail = row.children[3].innerHTML;
            selectedUser.userPassword = row.children[2].innerHTML;
            selectedUser.userRole = row.children[4].innerHTML;
            
            //type the name of the user within the delete modal (are you sure you want to delete "userNameToDelete")
            document.getElementById("userToDelete").innerHTML = selectedUser.userName;
            prepareEditModal();
        }
    })

    //add the delet event to the delete button
    document.getElementById("deleteBtn").addEventListener("click", DeleteRecord);
    //add the edit event to the edit button
    document.getElementById("saveEditing").addEventListener("click", saveEditing);
    //Add search functionality
    this.document.querySelector("input[type=search]").addEventListener("keyup", search);
    //filtering event
    this.document.querySelector(".filter-category").addEventListener("click", filter);
})

function DisplayUsers(usersArray)
{
    tableBody.innerHTML = "";
    let rowTD;
    let td;
    let startIndex, endIndex;

    //if the usersArray is not send (==-1) then equal it to the allusers array
    if(usersArray.length>end-start)
    {
        // usersArray = allUsers;
        startIndex = start;
        endIndex = end;
    } else { //if there is an array sent then display all of it (startIndex = 0 , endIndex = arraylength)
        startIndex = 0;
        endIndex = usersArray.length;
    }

    endIndex = endIndex > usersArray.length ? usersArray.length : endIndex;

    for(let i = startIndex; i < endIndex; i++) {
        var user = usersArray[i];
        rowTD = tableBody.insertRow(-1);
        for (const key in user) {
            td = rowTD.insertCell(-1);
            td.innerHTML = user[key];
        }
        td = rowTD.insertCell(-1);
        td.innerHTML = `<a href="#editEmployeeModal" class="edit" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>`;
        td.innerHTML += `<a href="#deleteEmployeeModal" class="delete" data-bs-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>`;
    }

    //display the current number per page
    document.querySelector("#numberPerPage").innerHTML = endIndex-startIndex;
    //display the total number of users
    document.querySelector("#totalNumber").innerHTML = usersArray.length;
}

function displayPagination(usersArray)
{
    //get the number of buttons
    numberOfBtns = Math.ceil(usersArray.length / numberOfUsersPerPage);
    //get the pagination container
    let paginationContainer = document.querySelector(".pagination");
    //clear the container
    paginationContainer.innerHTML = "";
    //add the previous button
    paginationContainer.innerHTML += `<li class="page-item disabled"><a href="#">Previous</a></li>`;
    //add the buttons
    for (let i = 1; i <= numberOfBtns; i++) {
        //if the current page number is the same as the button number, add the active class
        if(i==pageNumber)
        {
            paginationContainer.innerHTML += `<li class="page-item active"><a href="#" class="page-link">${i}</a></li>`;
        }
        else
        {
            paginationContainer.innerHTML += `<li class="page-item"><a href="#" class="page-link">${i}</a></li>`;
        }
    }
    //add the next button
    paginationContainer.innerHTML += `<li class="page-item"><a href="#" class="page-link">Next</a></li>`;

    //add the event listener to change the page number
    paginationContainer.addEventListener("click", pagination)
}

function pagination(e) {
    //if the user clicked on an LI item
    if (e.target.nodeName == "A") {
        //if the user clicked on the previous button
        if (e.target.innerHTML == "Previous") {
            //if the current page number is greater than 1, decrease the page number by 1
            if (pageNumber > 1) {
                pageNumber--;
            } else return;
        }//if the user clicked on the next button
        else if(e.target.innerHTML == "Next")
        {
            //if the current page number is less than the number of buttons, increase the page number by 1
            if (pageNumber < numberOfBtns) {
                pageNumber++;
            } else return;
        }//if the user clicked on a button with a number 
        else {
            pageNumber = parseInt(e.target.innerHTML);
        }
        //give the active class to the button which innerhtml = pagenumber
        let btns = document.querySelectorAll(".pagination li a");
        btns.forEach(btn=>{
            btn.parentNode.classList.remove("active");
            if(btn.innerHTML == pageNumber){
                btn.parentNode.classList.add("active");
            }
        });

        //calculate the start and the end based on the page number and the number of users per page     
        end = pageNumber * numberOfUsersPerPage;
        start = end - numberOfUsersPerPage;
        //display the new set of users according to the role annd pagination
        if(usersFilter == "customer" || usersFilter == "seller")
        {
            DisplayUsers(allUsers.filter(user=>user.userRole == usersFilter));
        } else {
            DisplayUsers(allUsers);
        }
    }
}


function search(e)
{
    let searchedArr;
    if(usersFilter!="all") {
        searchedArr = allUsers.filter(user=>user.userName.toLowerCase().indexOf(e.target.value.toLowerCase())!=-1 && user.userRole == usersFilter);
    } else {
        searchedArr = allUsers.filter(user=>user.userName.toLowerCase().indexOf(e.target.value.toLowerCase())!=-1);
    }
    
    displayPagination(searchedArr);
    DisplayUsers(searchedArr);
}

//filter based on user Role (All - customers - sellers)
function filter(e)
{
    //check if the clicked item is of type button then start the filtering process
    if (e.target.nodeName=="BUTTON") {
        //get all the buttons 1- remove the active class from them, 2- add the active class to the clicked button 
        let btns = document.querySelectorAll(".filter-category button");
        btns.forEach(btn=>{btn.classList.remove("btn-primary"); btn.classList.add("btn-secondary");})
        e.target.classList.add("btn-primary");
        e.target.classList.remove("btn-secondary");
        //reset the pagination
        start=0;
        end = numberOfUsersPerPage;
        pageNumber = 1;
    }
    switch(e.target.innerHTML) //switch based on the button innerhtml
    {
        case "All"://display all users
            displayPagination(allUsers);
            DisplayUsers(allUsers);
            usersFilter = "all";
            break;
        default:
            
            let userRole = e.target.innerHTML.toLowerCase().substring(0, e.target.innerHTML.length-1);
            //display only the users with the same userRole according to the current pagination page
            let filteredUsers = [];
            for(let i = 0; i < allUsers.length; i++) {
                if(allUsers[i].userRole == userRole) {
                    filteredUsers.push(allUsers[i]);
                }
            }
            displayPagination(filteredUsers);
            DisplayUsers(filteredUsers);
            usersFilter = userRole;
            break;
        // case "Customers"://display only the customers
            
        //     DisplayUsers(allUsers.filter(user=>user.userRole=="customer"));
        //     usersFilter = "customer";
        //     break;
        // case "Sellers"://display only the sellers
        //     DisplayUsers(allUsers.filter(user=>user.userRole=="seller"));
        //     usersFilter = "seller";
        //     break;
    }
}

function DeleteRecord()
{
    allUsers = allUsers.filter(user => user.userID != selectedUser.userID);
    localStorage.setItem("users", JSON.stringify(allUsers));
    location.reload();
}

function prepareEditModal()
{
    document.getElementById("edit_name").value = selectedUser.userName;
    document.getElementById("edit_email").value = selectedUser.userEmail;
    document.getElementById("edit_pass").value = selectedUser.userPassword;
    if (selectedUser.userRole=="customer") {
        document.getElementById("customer").setAttribute("checked", true);
    } else {
        document.getElementById("seller").setAttribute("checked", true);
    }
}

function saveEditing()
{
    //get the updated data from the modal form
    let name = document.getElementById("edit_name");
    let email = document.getElementById("edit_email");
    let pass = document.getElementById("edit_pass");
    let role = document.querySelector('input[name="userType"]:checked').value;

    //validate the data

    //the containers in which the data will be displayed
    const firstNameMessage = document.getElementById('nameMessage');
    const emailMessage = document.getElementById('editEmailMessage');
    const passwordMessage = document.getElementById('editPasswordMessage');

    //check if the data is valid
    const isFirstNameValid = isValidName(name.value, firstNameMessage);
    const isEmailValid = isValidEmail(email.value, emailMessage);
    const isPasswordValid = isValidPassword(pass.value, passwordMessage);

    if(isEmailValid) {
        emailMessage.style.display = "none";
        email.style.border = "2px solid green";
    } else {
        emailMessage.style.display = "block";
        email.style.border = "2px solid red";
    }

    if(isFirstNameValid) {
        firstNameMessage.style.display = "none";
        name.style.border = "2px solid green";
    } else {
        firstNameMessage.style.display = "block";
        name.style.border = "2px solid red";
    }

    if(isPasswordValid) {
        passwordMessage.style.display = "none";
        pass.style.border = "2px solid green";
    } else {
        passwordMessage.style.display = "block";
        pass.style.border = "2px solid red";
    }

    if (!isFirstNameValid || !isEmailValid || !isPasswordValid) {
        return;
    }

    //make a new user with the updated data
    let user = new users(selectedUser.userID, name.value, pass.value, email.value, role);

    //get the index of the user to be updated
    let oldUser = allUsers.find(user => user.userID == selectedUser.userID);
    let oldUserIndex = allUsers.indexOf(oldUser);
    allUsers.splice(oldUserIndex, 1, user);

    //update the local storage
    localStorage.setItem("users", JSON.stringify(allUsers));

    //reload the page
    location.reload();
}

function AddUser()
{
    let signUpForm = document.getElementById('signupForm');
    signUpForm.addEventListener('submit', handleFormSubmit);
}