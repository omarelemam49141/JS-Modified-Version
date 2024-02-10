import { carts, userCart } from "./classes.js";
let products = JSON.parse(localStorage.getItem("products"));
let listProductHtml;
var listCartHTML;
let iconCart;
export let iconCartSpan;
let closeCart;
let checkOut;
let arrowBack;
let cart;
let lyercartOverlay;
export let temmraryDiv;
let totalPrice;

let footerCart;
var containerDivCartIsEmpty;
var iconEmptyCart;
var msg;
// a
// checkout.html
var btnStratShopping;

window.addEventListener("load", function () {
    listProductHtml = document.getElementById("products-Landing");
    listCartHTML = document.querySelector('.cart-body');
    iconCart = document.querySelector('.cartLogo');
    iconCartSpan = document.querySelector('.cartLogo #cntOrders');
    closeCart = document.querySelector('.cart-clear');
    checkOut = document.querySelector(".checkout");
    arrowBack = document.querySelector(".arrowBack");
    cart = document.querySelector(".cart");
    lyercartOverlay = document.querySelector(".cart-overlay");
    temmraryDiv = document.querySelector(".addedSuccess");
    totalPrice = document.querySelector(".cart-total");

    footerCart = document.querySelector('.cart-footer');
    /**
    cart 

        <div class="wCartIsEmpty">
            <i class="fa-solid fa-cart-plus iconEmptyCart"></i>
            <span class="cartEmpty">Your cart is empty!<br> Browse our categories and discover our best deals!</span>
            <a href="#">Start Shopping</a>
        </div>
    */
    // cart is empty
    // let span = document.querySelector('.cartEmpty');
    containerDivCartIsEmpty = document.createElement("div");
    containerDivCartIsEmpty.classList.add("wCartIsEmpty");
    // i
    iconEmptyCart = document.createElement("i");
    iconEmptyCart.classList.add('fa-solid', 'fa-cart-plus');
    iconEmptyCart.classList.add("iconEmptyCart");
    // span
    msg = document.createElement("span");
    msg.innerHTML = "Your cart is empty!<br> Browse our categories and discover our best deals!";
    msg.classList.add("cartEmpty");
    // a
    btnStratShopping = document.createElement("a");
    btnStratShopping.href = "./product.html";
    btnStratShopping.innerHTML = "Strat Shopping";

    // 
    containerDivCartIsEmpty.append(iconEmptyCart);
    containerDivCartIsEmpty.append(msg);
    containerDivCartIsEmpty.append(btnStratShopping);


    if (localStorage.getItem("cart") != null) {
        //check if the loggedinuser is the admin or seller so don't perform the following
        if (!(loggedInUser && (loggedInUser.userRole == "admin" || loggedInUser.userRole == "seller"))) {
            arrCart = JSON.parse(localStorage.getItem("cart"));
            listCartAsHTML();
        }
    }

    //cart events
    //check if the loggedinuser is the admin or seller so don't perform the following
    if (!(loggedInUser && (loggedInUser.userRole == "admin" || loggedInUser.userRole == "seller"))) {
        iconCart.addEventListener("click", showCart);
        arrowBack.addEventListener("click", hideCart);
        closeCart.addEventListener("click", clearCart);
        // Add a click event listener to the button
        checkOut.addEventListener('click', function () {
            // Redirect to the checkout page
            window.location.href = 'checkout.html';
        });
    }

    //check if the loggedinuser is the admin or seller so don't perform the following
    if (!(loggedInUser && (loggedInUser.userRole == "admin" || loggedInUser.userRole == "seller"))) {
        listCartHTML.addEventListener('click', (event) => {
            let positionClick = event.target;
            // debugger;
            //console.log(event.target.dataset.btn);
            if (positionClick.dataset.btn == "decr" || positionClick.dataset.btn == "incr") {
                let product_id = parseInt(positionClick.parentElement.parentElement.parentElement.dataset.id);
                console.log(product_id);
                let type = 'decr';
                if (event.target.dataset.btn == "incr") {
                    type = 'incr';
                }
                changeQuantityCart(product_id, type);
            }

        })
    }

    //check if the loggedinuser is the admin or seller so don't perform the following
    if (!(loggedInUser && (loggedInUser.userRole == "admin" || loggedInUser.userRole == "seller"))) {
        listCartHTML.addEventListener('dblclick', (event) => {
            let positionClick = event.target;
            //console.log(event.target.dataset.btn);
            if (positionClick.dataset.btn == "decr" || positionClick.dataset.btn == "incr") {
                let product_id = parseInt(positionClick.parentElement.parentElement.parentElement.dataset.id);
                // console.log(product_Id);
                let type = 'decr';
                if (event.target.dataset.btn == "incr") {
                    type = 'incr';
                }
                changeQuantityCart(product_id, type);
            }

        })
    }
    var addCartLink = document.querySelectorAll(".addCart");
    // console.log(addCartLink);
})

export let arrCart = [];
let loggedInUser = null;

if (localStorage.getItem("loggedInUser")) {
    loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
}

function listCartAsHTML() {

    let totalQuantity = 0;
    let total = 0;
    totalPrice.innerHTML = "0"
    iconCartSpan.innerHTML = arrCart.length;
    arrCart.forEach(item => {
        let positionItemInProduct = products.findIndex((value) => value.productId == item.product_id);

        if (positionItemInProduct > -1) {
            totalQuantity = totalQuantity + item.quantity;
            // console.log("item in cart ", item.product_id);
            // console.log("item in product", products[positionItemInProduct]);
            // console.log("index in product", positionItemInProduct);

            total = item.quantity * products[positionItemInProduct].price;
            let newItem = document.createElement('div');
            newItem.classList.add('item');

            totalPrice.innerHTML = parseInt(totalPrice.innerHTML) + products[positionItemInProduct].price * item.quantity + "$";

            listCartHTML.appendChild(newItem);

            var container_div = document.createElement("div");
            // console.log(products[positionItemInProduct].options);
            for (var cntOp = 0; cntOp < products[positionItemInProduct].options.length; cntOp++) {

                var input = document.createElement("input");
                var label = document.createElement("label");
                if (cntOp == 0) {
                    input.setAttribute('checked', 'true'); // Assuming you want it checked
                    label.classList.add("check");
                }

                // Setting the attributes 
                input.setAttribute('type', 'radio');
                input.setAttribute('name', 'color');
                input.setAttribute('id', `${products[positionItemInProduct].options[cntOp]}-color`); 'w-color'
                input.setAttribute('hidden', 'true');
                input.setAttribute('value', products[positionItemInProduct].options[cntOp]);

                // Creating the label element
                label.setAttribute('for', `${products[positionItemInProduct].options[cntOp]}-color`);
                label.classList.add("color-radio-btn");
                label.textContent = products[positionItemInProduct].options[cntOp];
                // Appending the input element to the container

                container_div.appendChild(input);
                container_div.appendChild(label);

            }


            newItem.innerHTML =
                `
                <div class="cart-item" data-id="${item.product_id}">
                <img src="${products[positionItemInProduct].images[0]}"/>
                <div class="cart-item-detail">
                  <h3>${products[positionItemInProduct].productName}</h3>
                  <h5>${products[positionItemInProduct].price}$</h5>
                  <div class="cart-item-amount">
                  <i class="fa-solid fa-minus bi "data-btn="decr"></i>
                  <span class="qty">${item.quantity}</span>
                  <i class="fa-solid fa-plus bi"data-btn="incr"></i>
      
                    <span class="cart-item-price">
                      ${products[positionItemInProduct].price * item.quantity}$
                    </span>
                    <i class="fa-solid fa-trash-can deleteItem"></i>
                  </div>
              
                  <p class="cart-item-color">Select Color: </p>
                  <div class="options-color" data-id="${item.product_id}">
                  ${container_div.innerHTML} <!-- Append the container_div HTML -->
                  </div>
                </div>
              </div>
              `;

            // console.log(products[item.product_id - 1].price * item.quantity);
        } else {
            clearCart();
        }



    })
    //delete clicked item 
    let itemsFromCart = document.querySelectorAll(".cart-item-detail");
    for (var i = 0; i < itemsFromCart.length; i++) {
        itemsFromCart[i].addEventListener("click", function (e) {
            if (e.target.classList.contains("deleteItem")) {
                var itemDeleted = parseInt(e.target.parentElement.parentElement.parentElement.dataset.id);
                updateCart(itemDeleted);
            }
        })
    }
    //color options
    let allColors = document.querySelectorAll(".color-radio-btn");

    for (var i = 0; i < allColors.length; i++) {
        // console.log(allColors);
        // var idLabel;
        allColors[i].addEventListener("click", function (e) {
            var parentLabel = e.target.parentElement.children;
            for (let j = 0; j < parentLabel.length; j++) {  //all childern (label+input)

                if (parentLabel[j].classList.contains("color-radio-btn") == true) { //filter childern => label only



                    parentLabel[j].classList.remove("check");
                } else {
                    if (parentLabel[j].getAttribute("id") == e.target.getAttribute('for')) { //to get input of label ex => <label for="x"><input id="x" value ="" name=""> to get value of name & value
                        console.log(parentLabel[j]);
                        console.log("key", parentLabel[j].name, "value ", parentLabel[j].value);  // input 
                        let parentOption = e.target.parentElement.dataset.id; // To know who the parent of option. 
                        let positionItemInCart = arrCart.findIndex((value) => value.product_id == parentOption);
                        arrCart[positionItemInCart].colorOptions = parentLabel[j].value; // add color to arrCart
                        addCartToMemory();

                        // console.log(arrCart);
                        // console.log(parentOption);


                    }

                }
            }
            e.target.classList.add("check");
            // console.log( e.target.getAttribute('for'));
            // idLabel= e.target.getAttribute('for')

        })
    }
    // let allColors = document.querySelectorAll(".color-radio-btn");
    for (var i = 0; i < allColors.length; i++) {
        let positionItemInCart = arrCart.findIndex((value) => value.product_id == allColors[i].parentElement.dataset.id);

        if (arrCart[positionItemInCart].colorOptions == allColors[i].innerHTML) {

            // console.log(true);
            var allchildern = allColors[i].parentElement.children;
            for (let k = 0; k < allchildern.length; k++) {
                allchildern[k].classList.remove("check");
            }
            allColors[i].classList.add("check");
        }

    }

}


function showCart() {
    if (arrCart.length == 0) {

        listCartHTML.prepend(containerDivCartIsEmpty);
        footerCart.style.display = "none";
    }
    else {
        footerCart.style.display = "grid";
    }
    cart.classList.add("show");
    lyercartOverlay.classList.add("show");
}

function hideCart() {
    lyercartOverlay.classList.remove("show");
    cart.classList.remove("show");
}

export function clearCart() {
    arrCart = [];
    // newusersCarts = new carts();
    let allOrders = JSON.parse(localStorage.getItem("usersCarts")) || [];
    let indexOfcar = allOrders["cartsArr"].findIndex((ele) => {
        return ele["customerID"] == loggedInUser.userID;
    })
    allOrders["cartsArr"].splice(indexOfcar, 1);
    let x={cartsArr:allOrders["cartsArr"]}
    localStorage.setItem("usersCarts",JSON.stringify(x))


    totalPrice.innerHTML = "0"
    try {
        addCartToMemory();
        addCartToHTML();
    }
    finally {
        listCartHTML.prepend(containerDivCartIsEmpty);
        footerCart.style.display = "none";

    }


};

// to make sure Dom[html code] loaded
var product_Id;
var addCartLink;
window.addEventListener("load", function () {
    addCartLink = document.querySelectorAll(".addCart");
    // console.log(addCartLink);
    for (var i = 0; i < addCartLink.length; i++) {
        addCartLink[i].addEventListener("click", function (event) {
            event.preventDefault();
            product_Id = parseInt(event.target.parentElement.parentElement.parentElement.parentElement.classList[3].split('=')[1]);
            let productSeller = (products.filter(product => product.productId == product_Id)[0]).sellerName;
            addToCart(product_Id, productSeller);
        })
    }
})

//**   add to cart    / */

var cnt = 0;
export const addToCart = (product_id, seller, quantity = 1, color = "White") => {

    //findindex fun return index of ele if it extist in arr else if rturn -1;
    let positionThisProductInCart = arrCart.findIndex((value) => value.product_id == product_id);
    let productSeller;
    //get the productseller if seller is undefined
    if (!seller) {
        productSeller = products.filter(product => product.productId == product_id)[0].sellerName;
    } else {
        productSeller = seller;
    }

    if (arrCart.length <= 0) {
        arrCart = [{
            product_id: product_id,
            quantity: quantity,
            seller: productSeller,
            quantity_sold: 0,
            colorOptions: color,
        }];
        temmraryDiv.style.display = "block";
        setTimeout(function () {
            temmraryDiv.style.display = "none";
        }, 2000)
        cnt++;

    } else if (positionThisProductInCart < 0) {
        arrCart.push({
            product_id: product_id,
            quantity: quantity,
            seller: productSeller,
            quantity_sold: 0,
            colorOptions: color,
        });
        temmraryDiv.style.display = "block";
        setTimeout(function () {
            temmraryDiv.style.display = "none";
        }, 2000)
        cnt++;
    } else {
        Swal.fire({
            title: "Item is already in cart",
            icon: "warning"
        });


    }
    addCartToHTML();
    addCartToMemory();
}

export const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(arrCart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';

    if (arrCart.length > 0) {
        listCartAsHTML();

    } else {
        let items = document.querySelectorAll(".item");
        cnt = 0
        iconCartSpan.innerText = cnt;
        // Loop through each item and remove it from the list
        items.forEach(item => {
            listCartHTML.removeChild(item);
        });
    }
}



const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = arrCart.findIndex((value) => value.product_id == product_id);
    let positionItemInProduct = products.findIndex((value) => value.productId == arrCart[positionItemInCart].product_id);

    if (positionItemInCart >= 0) {
        switch (type) {
            case 'incr':
                if (arrCart[positionItemInCart].quantity < products[positionItemInProduct].quantity) {
                    arrCart[positionItemInCart].quantity = Number(arrCart[positionItemInCart].quantity) + 1;
                } else {
                    Swal.fire({
                        title: "out of sotck",
                        showClass: {
                            popup: `
                            animate__animated
                            animate__fadeInUp
                            animate__faster
                          `
                        },
                        hideClass: {
                            popup: `
                            animate__animated
                            animate__fadeOutDown
                            animate__faster
                          `
                        }
                    });
                }

                break;

            default:
                let changeQuantity = Number(arrCart[positionItemInCart].quantity) - 1;
                if (changeQuantity >= 1) {
                    arrCart[positionItemInCart].quantity = changeQuantity;
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
    return;
}

// fun delete&update 
const updateCart = (itemDeleted) => {
    let positionItemInProduct = products.findIndex((value) => value.productId == itemDeleted);

    var containerDeletedItem = document.querySelectorAll(".cart-item");
    Swal.fire({
        title: `Do you really want to remove  ${products[positionItemInProduct].productName} from cart? `,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let positionItemInCart = arrCart.findIndex((item) => item.product_id == itemDeleted);
            totalPrice.innerHTML = parseInt(totalPrice.innerHTML) - products[positionItemInProduct].price * arrCart[positionItemInCart].quantity + "$";
            //delete from arrCart
            console.log(arrCart);
            arrCart = arrCart.filter((x) => x.product_id !== itemDeleted);
            console.log(arrCart);

            //delete from html
            for (var i = 0; i < containerDeletedItem.length; i++) {
                if (containerDeletedItem[i].dataset.id == itemDeleted) {
                    containerDeletedItem[i].remove();
                }
            }
            if (arrCart.length == 0) {
                listCartHTML.prepend(containerDivCartIsEmpty);
                footerCart.style.display = "none";
            }
            addCartToMemory();
            iconCartSpan.innerText = arrCart.length;

            console.log(arrCart[positionItemInCart].quantity);
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }
    });

}

export * from './addtoCart.js';  // This exports everything from addtoCart.js
