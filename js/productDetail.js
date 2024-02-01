import { addToCart, iconCartSpan, arrCart, temmraryDiv } from "./addtoCart.js";
import { renderingNavBar } from "./general-methods.js";

// form-control btn btn-warning fa fa-shopping-cart iconAddToCart
//////////////////////////////////////////////////////////////////////////////////
let iconAddToCart = document.querySelectorAll(".iconAddToCart ");
console.log(iconAddToCart);
if (JSON.parse(localStorage.getItem('cart'))) {
    let cart = JSON.parse(localStorage.getItem('cart'));
} else {
    iconCartSpan.innerText = cart.length;
}


window.addEventListener("load", function () {
    renderingNavBar();

    const searchParams = new URLSearchParams(window.location.search);
    // Get the value of the 'productId' parameter
    const productId = searchParams.get('productId');
    const products = JSON.parse(localStorage.getItem('products'));

    const product = products.find(x => x.productId == productId);// get the product from search bar


    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if(loggedInUser.userRole !='customer'){
        document.querySelector(".in-stock").style.display = "none";     
    }

    FillDetail(product);
    FillImgList(product.images);
    FillMainImg(product.images[0]);

    ////////////////////////////////////////////////////////////////////////////

    iconAddToCart[0].addEventListener("click", function (e) {
        const seller = product.sellerName;
        const color = document.querySelector(".color").value;
        const quantity = document.querySelector(".quantity").value;
        addToCart(productId, seller, quantity, color);
    })
    ////////////////////////////////////////////////////////////////////////////
    //add event listener to the quantity to check the quantity is not negative and the max is the product quantity
    const quantity = document.querySelector("#quantity");
    quantity.addEventListener("input", function () {
        if (quantity.value < 1) {
            quantity.value = 1;
        } else if (quantity.value > product.quantity) {
            quantity.value = product.quantity;
        }
    })
    //display out of stock and hide in stock fields if the product quantity is 0
    if (product.quantity == 0) {
        document.querySelector("#out-stock").style.display = "block";
        document.querySelector(".in-stock").style.display = "none";
    }

    //display the maximum quantity
    document.querySelector("#max-quantity").innerHTML = `Available ${product.quantity}`;

    //display the sold quantity
    document.querySelector("#sold-quantity").innerHTML = `Sold ${product.quantity_sold}`;
})


function FillDetail(product) {
    $('.product-title').text(product.productName);
    $(".catigory").text("Catigory: " + product.category);
    $(".seller").text(product.sellerName);
    $('.product-description').text(product.description);
    $('.price span').text(product.price + '$');

    const select = $('select')[0];
    product.options.forEach(color => {
        const creatoption = document.createElement('option');//<option>
        creatoption.text = color;
        select.add(creatoption);
    });
}

function FillMainImg(img) {
    const createdimg2 = document.createElement('img');//<img>
    createdimg2.src = img;
    createdimg2.classList.add('view_img', 'card-img', 'top');
    $('#mainimg')[0].appendChild(createdimg2);
}

function FillImgList(imges) {
    const imglist = $('#imglist')[0];
    imges.forEach(item => {
        const creatimg = document.createElement('img');//<img></img>
        creatimg.src = item;

        creatimg.addEventListener('click', function (event) { // event of filling the main img from the clicked img
            $('#mainimg img')[0].src = event.target.src;
        });
        creatimg.classList.add('img_list', 'card-img', 'top');
        imglist.appendChild(creatimg);
    })
}