import { renderingNavBar, LogOut } from "./general-methods.js";
import { Address ,Item ,Order , StatusEnum} from "./classes.js";

let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
    history.back();
}

window.addEventListener("load", function () {
    renderingNavBar();
    LogOut();
});

$(function () {
    GetOrders();
});

function GetOrders() {
    var orders;
    var createdtr;
    var loggedInUser;
    var userCheck;

    orders = JSON.parse(localStorage.getItem("orders"));//get orders from local storage
    userCheck = localStorage.getItem("loggedInUser");

    //check if this user logged in or not --- if no go to log in page 
    if (userCheck != null || userCheck != undefined) {
        if (orders != null) {
            loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));// to get the user who loged in
            if (loggedInUser.userRole != 'seller') {
                if (loggedInUser.userRole == 'customer') {
                    orders = orders.filter(order => order.userId == loggedInUser.userID);// get the order of this customer 
                }
                else //admin
                {
                    $('#search-div').removeAttr('hidden');
                    // data depend on the Event
                    $('#input').on('keyup', function () {
                        // console.log(this.value);
                        $("tbody")[0].innerHTML = '';
                        //orders.some(order=>order.id==1); // return bool
                        orders.forEach(order => {
                            order.items.some(item => { // to check if at least one element in the array has the name of this seller
                                if (item.seller.toLowerCase().includes(this.value.toLowerCase()) || this.value == '') {
                                    createdtr = document.createElement("tr");//<tr>
                                    createdtr.innerHTML = `                         
                                <td>${order.id}</td>
                                <td>${order.date}</td>
                                <td>${order.totalPrice}</td>
                                <td>${order.orderStatus}</td>
                                <td> <a href="orderDetails.html?orderId=${order.id}">View Details</a></td>`
                                    $("tbody")[0].appendChild(createdtr);
                                    return true;
                                }
                            })
                        })
                    })
                }
                // All data displayed 
                orders.forEach(order => {
                    createdtr = document.createElement("tr");//<tr>
                    createdtr.innerHTML = `                         
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${order.totalPrice}</td>
            <td>${order.orderStatus}</td>
            <td> <a href="orderDetails.html?orderId=${order.id}">View Details</a></td>`
                    $("tbody")[0].appendChild(createdtr);
                });
            }
            // for seller
            else if (loggedInUser.userRole == 'seller') {
                orders = orders.filter(order => order.items.some(item => item.seller == loggedInUser.userName));//get orders dependon the items ofthe seller
                orders.forEach(order => {
                    createdtr = document.createElement("tr");//<tr></tr>
                    createdtr.innerHTML = `                         
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.totalPrice}</td>
                <td>
                <select class="form-control status" data-ordid="${order.id}" >
                 <option selected hidden >Choose Status</option>
                 <option>${StatusEnum.New}</option>
                 <option>${StatusEnum.InProgress}</option>
                 <option>${StatusEnum.Completed}</option>
                </select>
                </td>
                <td> <a href="orderDetails.html?orderId=${order.id}">View Details</a></td>`
                    $("tbody")[0].appendChild(createdtr);
                });

                // event on status changing 
                $(".status").on("change", function () {
                    const selectedStatus = this.value;
                    let Completed = true;
                    let New =true;
                    const orderId = $(this).data("ordid");
                    orders.forEach(order => {
                        if (order.id === orderId) {
                            order.items.forEach(item => {
                                if (item.seller == loggedInUser.userName) {
                                    item.itemStatus = selectedStatus;
                                }
                                
                                if (item.itemStatus != StatusEnum.Completed) {
                                    Completed = false;
                                }
                                if (item.itemStatus != StatusEnum.New){
                                    New = false;
                                }
                            })

                            if(Completed){
                                order.orderStatus = StatusEnum.Completed;
                            }else if(New){
                                order.orderStatus = StatusEnum.New;
                            }else{
                                order.orderStatus = StatusEnum.InProgress;
                            }
                        }
                    });
                    localStorage.setItem("orders", JSON.stringify(orders));

                })

            }
        } else {
            $("tbody")[0].innerHTML = '<div><h2>No Data Yet</h2></div>';
        }
    }
    else
        window.location.href = "Login/login.html";

}
