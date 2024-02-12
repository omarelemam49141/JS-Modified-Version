//import { Item } from "../orders.js";
import { clearCart } from "./addtoCart.js"
import { Item, Order, Address } from "./classes.js";

//Check if the user is a guuest then navigate to the log in page
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let cart = JSON.parse(localStorage.getItem("cart"));

if (!loggedInUser) {
    location.href = "../Login/login.html";
} else if (loggedInUser.userRole != "customer") { //if the user is not a customer then go back
    history.back();
}

if (cart.length == 0) {
    history.back();
}


let address = JSON.parse(localStorage.getItem("address"));
address = address == null ? [] : address;


var containerOreders = document.querySelector(".ordersBody");
let totalPrice = document.querySelector(".cart-total");
let btnCheckout = document.querySelector(".checkout");

let products = JSON.parse(localStorage.getItem('products'))

window.addEventListener("load", function () {

    var total = 0;
    cart.forEach(order => {
        let positionItemInProduct = products.findIndex((value) => value.productId == order.product_id);
        total = products[positionItemInProduct].price * order["quantity"];
        containerOreders.innerHTML += '';
        var orderItem = this.document.createElement("div");
        orderItem.classList.add("order");
        containerOreders.appendChild(orderItem);
        orderItem.innerHTML = `

            <div class="orderItem" data-id="${order["product_id"]}">
            <img src="${products[positionItemInProduct].images[0]}"/>
            <div class="orderItem-detail">
                <h3 class="name" >Name: <span>${products[positionItemInProduct].productName}</span></h3>
                <h4 class="seller"> seller: <span> ${order["seller"]}</span></h4>
                <h5 class="quantity">quantity:  ${order["quantity"]}</h5>
                <h5 class="color">color:  ${order["colorOptions"]}</h5>
                    <span class="orderItem-price">
                    price:  ${products[positionItemInProduct].price * order["quantity"]} $
                    </span>
            </div>
            </div>  `

        totalPrice.innerHTML = total + parseInt(totalPrice.innerHTML) + "$";
    });


    $('.confirm').on('click', () => {
        if (phoneError.textContent == '' && AdditionalPhoneError.textContent == '') {

            const userAddress = address.find(add => add.username == loggedInUser.userName);
            if (userAddress != null && userAddress != undefined) {
                createOrder(userAddress);
                clearCart();
            } else {
                swal({
                    title: "Warning!",
                    text: "Please Fill the Address and Save it",
                    icon: "warning",
                    button: "Ok"
                });
            }
        } else {
            swal({
                title: "Warning!",
                text: "Please Write a valid Number",
                icon: "warning",
                button: "Ok"
            });
        }
    })
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    //validation phone Number 
    var phoneInput = document.getElementById('phone');
    var phoneError = document.getElementById('phoneError');
    var phoneRegex = /^(010|015|012|011)\d{8}$/;

    phoneInput.addEventListener('blur', function () {
        if (!phoneRegex.test(phoneInput.value))
            phoneError.textContent = 'please Enter 11 number start with 010 or 012 or 015 or 011';
        else
            phoneError.textContent = '';
    });

    // validation for additional number
    var additionalPhoneInput = document.getElementById('additionalphone');
    var AdditionalPhoneError = document.getElementById('AdditionalPhoneError');

    additionalPhoneInput.addEventListener('blur', function () {

        // Check if additional phone number matches the required format
        if (!phoneRegex.test(additionalPhoneInput.value))
            AdditionalPhoneError.textContent = 'please Enter 11 number start with 010 or 012 or 015 or 011';
        else
            AdditionalPhoneError.textContent = '';
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    // get stored address if exsist and dispaly it
    const userAdd = address.find(add => add.username === loggedInUser.userName);
    if (userAdd != null) {
        $('#phone').val(userAdd.phoneNumber);
        $('#additionalphone').val(userAdd.additionalNumber);
        $('#address').val(userAdd.address);
        $('#info').val(userAdd.additionalInformation);
        $('#region').val(userAdd.region);
        $('#city').val(userAdd.city);
    }

    //when save button clicked
    $('#addressForm').submit(function (event) {
        event.preventDefault();
        if (phoneError.textContent == '' && AdditionalPhoneError.textContent == '') {
            //to prevent reload

            // get values from form fields
            const phone = $('#phone').val();
            const additionalphone = $('#additionalphone').val();
            const adreess = $('#address').val();
            const info = $('#info').val();
            const region = $('#region').find(":selected").text();;
            const city = $('#city').val();

            const addressObject = new Address(loggedInUser.userName, phone, additionalphone, adreess, info, region, city);

            //add address if new / update if exsist
            const userAddressIndex = address.findIndex(add => add.username === loggedInUser.userName);

            if (userAddressIndex !== -1) {
                address[userAddressIndex] = addressObject;
            } else {
                address.push(addressObject);
            }

            localStorage.setItem("address", JSON.stringify(address));
        } else {
            swal({
                title: "Warning!",
                text: "Please Write a valid Number",
                icon: "warning",
                button: "Ok"
            });
        }
    });

})

function createOrder(userAddress) {
    let orders = JSON.parse(localStorage.getItem("orders"));
    orders = orders == null ? [] : orders;

    //get last order id, to put the next id to the new order
    let nextOrderId = 1;
    if (orders.length > 0) {
        nextOrderId = orders[orders.length - 1].id + 1;
    }

    var cartTotal = parseInt($('.cart-total').text().replace('$', ''));

    var items = []

    const orderItems = $('.orderItem').toArray();
    orderItems.forEach(x => {
        const item = $(x); // convert to jQuery object

        const productId = item.data('id');
        const productName = item.find('.name').text().replace('Name: ', '');
        const image = item.find('img').attr('src');
        const option = item.find('.color').text().replace('color: ', '');
        const quantity = parseInt(item.find('.quantity').text().replace('quantity: ', ''), 10);
        const totalPrice = parseFloat(item.find('.orderItem-price').text().replace('price: ', '').replace('$', ''));
        const price = totalPrice / quantity;
        const seller = item.find('.seller').text().replace('seller: ', '').trim();

        items.push(new Item(productId, productName, image, option, quantity, price, totalPrice, seller, "New"));
    })

    const newOrder =
        new Order(
            nextOrderId,
            loggedInUser.userID,
            loggedInUser.userName,
            userAddress,
            new Date().toLocaleDateString(),
            10,
            cartTotal + 10,
            "New",
            items
        );
    orders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(orders));
    window.location.href = `orderDetails.html?orderId=${nextOrderId}`

}



// -----  first validate ---

btnCheckout.addEventListener("click", function (e) {
    event.preventDefault();

    cart.forEach((v) => {
        let positionItemInProduct = products.findIndex((value) => value.productId == v.product_id);

        products[positionItemInProduct].quantity_sold = parseInt(products[positionItemInProduct].quantity_sold) + parseInt(v.quantity) + "";
        products[positionItemInProduct].quantity = parseInt(products[positionItemInProduct].quantity) - parseInt(v.quantity) + "";
        //add modifiy countity to cart 
        localStorage.setItem('products', JSON.stringify(products));

    })
    localStorage.setItem('cart', JSON.stringify([]));
})


