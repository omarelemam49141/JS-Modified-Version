let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if(!loggedInUser || loggedInUser.userRole != "admin")
{
    location.replace("../index.html");
}

let messages = JSON.parse(localStorage.getItem("messages")) || [];

window.addEventListener("load", function(){
    document.querySelector("#messageCount").innerHTML = messages.length;
    //Display all the messages
    let tbody = document.querySelector("tbody");
    for(let i = messages.length - 1; i >= 0; i--)
    {
        let tr = document.createElement("tr");
        let tdId = document.createElement("th");
        let tdName = document.createElement("td");
        let tdDate = document.createElement("td");
        let tdAction = document.createElement("td");

        tdId.innerHTML = messages[i].messageId;
        tdName.innerHTML = messages[i].customerName;
        let dateSent = new Date(messages[i].messageSentDate);
        tdDate.innerHTML = dateSent.toLocaleString();
        tdAction.innerHTML = `<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#message-modal" data-id="${messages[i].messageId}">Details</button>`;
        tr.append(tdId, tdName, tdDate, tdAction);
        tbody.append(tr);

        //addevent listener to the details button
        tbody.addEventListener("click", prepareDetailsData);
    }
})

//prepare the modal
function prepareDetailsData(e)
{
    if(e.target.classList.contains("btn-info"))
    {
        let message = messages.find(m => m.messageId == e.target.dataset.id);
        document.querySelector(".modal-title").innerHTML = message.customerName;
        document.querySelector(".modal-body").innerHTML = message.messageContent;
    }
}



