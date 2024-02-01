 let products=JSON.parse(localStorage.getItem("products"));
    let listProductHtml;
    var  listCartHTML;
    let iconCart;
    export  let iconCartSpan;
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

    console.log(containerDivCartIsEmpty);

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
        // console.log(arrCart);

        totalQuantity = totalQuantity + item.quantity;
        total = item.quantity * products[item.product_id - 1].price;
        let newItem = document.createElement('div');
        newItem.classList.add('item');
        //  console.log(products);
        //  console.log(totalPrice=Number(totalPrice)+products[item.product_id - 1].price * item.quantity);
        totalPrice.innerHTML = parseInt(totalPrice.innerHTML) + products[item.product_id - 1].price * item.quantity + "$";
        let info = products[product_Id];
        //    console.log(info['images'][0]);
        listCartHTML.appendChild(newItem);
        newItem.innerHTML =
            `
                <div class="cart-item" data-id="${item.product_id}">
                <img src="${products[item.product_id - 1].images[0]}"/>
                <div class="cart-item-detail">
                  <h3>${products[item.product_id - 1].productName}</h3>
                  <h5>${products[item.product_id - 1].price}$</h5>
                  <div class="cart-item-amount">
                  <i class="fa-solid fa-minus bi "data-btn="decr"></i>
                  <span class="qty">${item.quantity}</span>
                  <i class="fa-solid fa-plus bi"data-btn="incr"></i>
      
                    <span class="cart-item-price">
                      ${products[item.product_id - 1].price * item.quantity}$
                    </span>
                    <i class="fa-solid fa-trash-can deleteItem"></i>
                  </div>
              
                  <p class="cart-item-color">Select Color: </p>
                  <div class="options-color" data-id="${item.product_id}">
                  <input type="radio" name="color" id="w-color" hidden checked value="${products[item.product_id - 1].options[0]}">
                  <label for="w-color" class="color-radio-btn check" >${products[item.product_id - 1].options[0]}</label>
                  <input type="radio" name="color" id="r-color" hidden value="${products[item.product_id - 1].options[1]}">
                  <label for="r-color" class="color-radio-btn">${products[item.product_id - 1].options[1]}</label>
                  <input type="radio" name="color" id="b-color" hidden value="${products[item.product_id - 1].options[2]}">
                  <label for="b-color" class="color-radio-btn">${products[item.product_id - 1].options[2]}</label>
                </div>
                </div>
              </div>
              `;

        // console.log(products[item.product_id - 1].price * item.quantity);

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
            console.log(parentLabel);
            for (let j = 0; j < parentLabel.length; j++) {  //all childern (label+input)

                if (parentLabel[j].classList.contains("color-radio-btn") == true) { //filter childern => label only
                    parentLabel[j].classList.remove("check");
                } else {
                    if (parentLabel[j].getAttribute("id") == e.target.getAttribute('for')) { //to get input of label ex => <label for="x"><input id="x" value ="" name=""> to get value of name & value
                        console.log("key", parentLabel[j].name, "value ", parentLabel[j].value);
                        let parentOption = e.target.parentElement.dataset.id; // To know who the parent of option. 
                        let positionItemInCart = arrCart.findIndex((value) => value.product_id == parentOption);
                        arrCart[positionItemInCart].colorOptions = parentLabel[j].value; // add color to arrCart
                        console.log(arrCart);
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
        // console.log("all color",allColors[i].innerHTML,arrCart[0].colorOptions);

        //  console.log("index in arr",positionItemInCart); 
        //    console.log("productId",allColors[i].parentElement.dataset.id,"product in CartArr ",arrCart[positionItemInCart]);

        if (arrCart[positionItemInCart].colorOptions == allColors[i].innerHTML) {

            // console.log(true);
            var allchildern = allColors[i].parentElement.children;
            for (let k = 0; k < allchildern.length; k++) {
                allchildern[k].classList.remove("check");
            }
            allColors[i].classList.add("check");
            console.log(allColors[i].innerHTML, arrCart);
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
export function clearCart(e) {
    arrCart = [];
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
window.addEventListener("load", function () {
    var addCartLink = document.querySelectorAll(".addCart");
    for (var i = 0; i < addCartLink.length; i++) {
        addCartLink[i].addEventListener("click", function (event) {
            event.preventDefault();
            product_Id = parseInt(event.target.parentElement.parentElement.parentElement.parentElement.classList[3].split('=')[1]);
            let productSeller = (products.filter(product => product.productId == product_Id)[0]).sellerName;
            addToCart(product_Id, productSeller);
        })
    }
    
//     if(JSON.parse(localStorage.getItem('products'))!=null){
//         products = JSON.parse(localStorage.getItem('products'));
//        console.log("trueeeeeeeeeeeeee");
//    }
})

//**   add to cart    / */

var cnt = 0;
export const addToCart = (product_id,seller,quantity=1, color="White") => {
    debugger
    //findindex fun return index of ele if it extist in arr else if rturn -1;
    let positionThisProductInCart = arrCart.findIndex((value) => value.product_id == product_id);
    let productSeller;
    //get the productseller if seller is undefined
    if(!seller)
    {
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
            colorOptions: color
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
            quantity_sold:0,
            colorOptions: color,
        });
        temmraryDiv.style.display = "block";
        setTimeout(function () {
            temmraryDiv.style.display = "none";
        }, 2000)
        cnt++;
    } else {
        alert("Item is already in cart");
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
        //console.log(itemsFromCart);

    } else {
        let items = document.querySelectorAll(".item");
        cnt = 0
        iconCartSpan.innerText = cnt;
        listCartHTML.removeChild(items);
        // console.log(arrCart.length);
    }
}

// //check if the loggedinuser is the admin or seller so don't perform the following
// if (!(loggedInUser && (loggedInUser.userRole == "admin" || loggedInUser.userRole == "seller"))) {
//     listCartHTML.addEventListener('click', (event) => {
//         let positionClick = event.target;
//         //console.log(event.target.dataset.btn);
//         if (positionClick.dataset.btn == "decr" || positionClick.dataset.btn == "incr") {
//             let product_id = parseInt(positionClick.parentElement.parentElement.parentElement.dataset.id);
//             // console.log(product_Id);
//             let type = 'decr';
//             if (event.target.dataset.btn == "incr") {
//                 type = 'incr';
//             }
//             changeQuantityCart(product_id, type);
//         }

//     })
// }

const changeQuantityCart = (product_id, type) => {
    debugger
    let positionItemInCart = arrCart.findIndex((value) => value.product_id == product_id);
    // let positionItemInCart2 = arrCart.findIndex((value) =>{} );

    // console.log(positionItemInCart);
    if (positionItemInCart >= 0) {
        //  let info = arrCart[positionItemInCart];
        switch (type) {
            case 'incr':
                if(arrCart[positionItemInCart].quantity <products[arrCart[positionItemInCart].product_id-1].quantity){
                    arrCart[positionItemInCart].quantity = Number(arrCart[positionItemInCart].quantity) + 1;
                }else{
                    alert("out of sotck");
                }

                // console.log("arr =>",arrCart[positionItemInCart],"product info ",products[arrCart[positionItemInCart].product_id-1]);
                // arrCart[positionItemInCart].quantity=products[arrCart[positionItemInCart].product_id-1].quantity;
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
    var containerDeletedItem = document.querySelectorAll(".cart-item");
    // console.log(containerDeletedItem);
    // let positionItemInCart = arrCart.findIndex((value) => value.product_id == itemDeleted);
    // console.log("index arrtCart", positionItemInCart);
    // console.log("id item deleted", itemDeleted);//index 

    var conf = confirm(`Do you really want to remove  ${products[itemDeleted - 1].productName} from cart? `);

    if (conf) {

        let positionItemInCart = arrCart.findIndex((item) => item.product_id == itemDeleted);
        totalPrice.innerHTML = parseInt(totalPrice.innerHTML) - products[itemDeleted - 1].price * arrCart[positionItemInCart].quantity + "$";
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

    }
}

export * from './addtoCart.js';  // This exports everything from addtoCart.js
