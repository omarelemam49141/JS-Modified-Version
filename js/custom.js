import {Product} from "./classes.js"
// to get current year
// function getYear() {
//     var currentDate = new Date();
//     var currentYear = currentDate.getFullYear();
//     document.querySelector("#displayYear").innerHTML = currentYear;
// }

// getYear();
//Product class function
let products = [];
// if(!JSON.parse(localStorage.getItem("products"))||JSON.parse(localStorage.getItem("products")).length == 0) {
if(!JSON.parse(localStorage.getItem("products"))||JSON.parse(localStorage.getItem("products")).length == 0) {
   products = [
      new Product (1, "Men's Shirt", "Jewellery", "Omar1", 100, 50, ["../images/1.jpeg"], 200, "any descroiption", ["Black", "Red", "White"]),
      new Product (2, "Women's Shirt", "Jewellery", "Omar1", 100, 50, ["../images/2.jpeg"], 300, "any descroiption", ["Black", "Red", "White"]),
      new Product (3, "Men's Shoes", "Accessories", "Omar1", 25, 25, ["../images/3.jpeg"], 320, "any descroiption", ["Black", "Red", "White"]),
      new Product (4, "Women's Shoes", "Accessories", "Omar1", 30, 0, ["../images/1.jpeg"], 120, "any descroiption", ["Black", "Red", "White"]),
      new Product (5, "Men's Accessories", "Artwork", "Omar1", 60, 40, ["../images/2.jpeg"], 140, "any descroiption", ["Black", "Red", "White"]),
      new Product (6, "Women's Accessories", "Accessories", "Omar1", 30, 1, ["../images/3.jpeg"], 155, "any descroiption", ["Black", "Red", "White"]),
      new Product (7, "Men's Watch", "Artwork", "Omar1", 25, 14, ["../images/4.jpeg"], 500, "any descroiption", ["Black", "Red", "White"]),
   ];
   localStorage.setItem("products", JSON.stringify(products));
} else {
   products = JSON.parse(localStorage.getItem("products"));
}

//get the loggedInUser
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));



// client section owl carousel
$(function () {
   //display all products at the beggining of function loading
   let productCards = GetProducts(-1);
   if (document.getElementById("products-Landing")) {
      document.getElementById("products-Landing").innerHTML = productCards;   
   }
})

function GetProducts(maxNumber, productsList) {
   let products;
   //if no productsList sent then get them from the local storage
   if (productsList != undefined) {
      products = productsList;
   }
   else {
      products = JSON.parse(localStorage.getItem("products"));
   }

   //if -1 is sent then display all the products (the products length is the length of all products in the local storage)
   if (maxNumber == -1) {
      maxNumber = products.length;
   }


   let productCards = "";
   //Display the products from the newest to the oldest
   for (let i = maxNumber - 1; i >= 0; i--) {
      //display the products based on the user role
      if (loggedInUser && loggedInUser.userRole == "admin") {
         productCards +=
         `<div class="col-sm-6 col-md-6 col-lg-4 data-id=${products[i].productId}">

           <div class="box">
              <div class="option_container">
                   <div class="options">
                      <a href="productDetails.html?productId=${products[i].productId}" class="option2">
                      View Details
                      </a>
                   </div>
               </div>
                <div class="img-box">
                   <img src="${products[i].images[0]}" alt="">
                </div>
                <div class="detail-box" style="display: flex !important;
                justify-content: center;
                align-items: center;
                flex-direction: column !important;">
                   <h5>
                      ${products[i].productName}
                   </h5>
                   <h6>
                      $${products[i].price}
                   </h6>
                </div>
             </div>
         
          </div>`;
      } else if (loggedInUser && loggedInUser.userRole == "seller") {
         if(products[i].sellerName == loggedInUser.userName) {
            productCards +=
         `<div class="col-sm-6 col-md-6 col-lg-4 data-id=${products[i].productId}">

           <div class="box">
              <div class="option_container">
                   <div class="options">
                      <a href="productDetails.html?productId=${products[i].productId}" class="option2">
                      View Details
                      </a>
                   </div>
               </div>
                <div class="img-box">
                   <img src="${products[i].images[0]}" alt="">
                </div>
                <div class="detail-box" style="display: flex !important;
                justify-content: center;
                align-items: center;
                flex-direction: column !important;">
                   <h5>
                      ${products[i].productName}
                   </h5>
                   <h6>
                      $${products[i].price}
                   </h6>
                </div>
             </div>
         
          </div>`;
         }
      } else { //if the product is out of stock we will remove the add to cart button and add the out of stock butto
         // console.log(i)
         // console.log(product0s[i])
         if(products[i].quantity == 0)
         {
            productCards +=
         `<div class="col-sm-6 col-md-6 col-lg-4 data-id=${products[i].productId}">

           <div class="box">
               <a class="out-of-stock bg-danger text-light py-2 px-3">
               Out of stock
               </a>
              <div class="option_container">
                   <div class="options">
                      <a href="productDetails.html?productId=${products[i].productId}" class="option2">
                      View Details
                      </a>
                   </div>
               </div>
                <div class="img-box">
                   <img src="${products[i].images[0]}" alt="">
                </div>
                <div class="detail-box" style="display: flex !important;
                justify-content: center;
                align-items: center;
                flex-direction: column !important;">
                   <h5>
                      ${products[i].productName}
                   </h5>
                   <h6>
                      $${products[i].price}
                   </h6>
                </div>
             </div>
         
          </div>`;
         } else {
            productCards +=
      
         `<div class="col-sm-6 col-md-6 col-lg-4 data-id=${products[i].productId}">

           <div class="box">
              <div class="option_container">
                   <div class="options">
                      <a href="#" class="option1 addCart">
                      Add to cart
                      </a>
                      <a href="productDetails.html?productId=${products[i].productId}" class="option2">
                      View Details
                      </a>
                   </div>
               </div>
                <div class="img-box">
                   <img src="${products[i].images[0]}" alt="">
                </div>
                <div class="detail-box" style="display: flex !important;
                justify-content: center;
                align-items: center;
                flex-direction: column !important;">
                   <h5>
                      ${products[i].productName}
                   </h5>
                   <h6>
                      $${products[i].price}
                   </h6>
                </div>
             </div>
         
          </div>`;
         }
      }
   }

   return productCards;
}

export { GetProducts, products, Product };