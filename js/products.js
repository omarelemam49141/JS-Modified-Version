import { GetProducts, products } from "./custom.js";
import { addToCart } from './addtoCart.js';
import { renderingNavBar, LogOut } from "./general-methods.js";
import { categories } from "./classes.js";

// Now you can use addToCart in this file
let filter = "All";
let checkedSellers = [];
let sellersList; //sellers' names container in products.html

//checking authorization (navigate the user *by force* according to his role)
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser) {
    if(loggedInUser.userRole == "admin")
    {
        location.replace("../dashboardAdmin.html");
    } else if (loggedInUser.userRole == "seller") {
        location.replace("../dashboardSeller.html");
    }
}

function displaySellersFilter() {
    //get the sellers' names container in products.html
    sellersList = document.querySelector(".sellers-list");
    //get all users whose role are sellers
    let sellers = JSON.parse(localStorage.getItem("users")).filter(user=>user.userRole== "seller");
    //display the sellers' names
    sellers.forEach(seller => {
        sellersList.innerHTML += `
        <div class="form-group">
        <li class="d-flex align-items-center justify-content-center"><span class="w-50">${seller.userName}</span> <input type="checkbox" value="${seller.userName}" class="mb-0 w-50"></li>
        </div>
        `;
    });

    //add the event listener to the checkboxes
    sellersList.addEventListener("click", filterAll)
}

function filterAll(e)
{
    if(e.target.nodeName == "INPUT")
        {
            let price = -1;
            if(e.target.type=="range") {
                price = e.target.value;
                document.querySelector("#priceContainer").innerHTML = `${price}$`;
                if(price<11 || price>499) {
                    price = -1;
                    document.querySelector("#priceContainer").innerHTML = `any$`;
                }
            }
            //get the checked checkboxes
            let checkedSellersInputs = Array.from(sellersList.querySelectorAll("input:checked"));
            let filteredProducts = [];
            //check if the no checkbox is checked then display all products
            if(checkedSellersInputs.length == 0)
            {
                if(price!=-1) { //if no seller filter but there is price filter
                    filteredProducts = products.filter(product=>product.price < price);
                } else {
                    document.getElementById("all-products-section").innerHTML = GetProducts(-1);
                    return;
                }
            } else { //seller selected
                //save the checked checkboxes values into an array
                checkedSellers = checkedSellersInputs.map(input=>input.value.toLowerCase());
                //filter the products to get the products which seller exists within the checkedSellers array
                if (filter != "All") { //category selected + seller selected
                    if(price != -1) { //category selected + price selected + seller selected
                        filteredProducts = products.filter(product => checkedSellers.includes(product.sellerName.toLowerCase()) && product.category == filter && products.price < price);
                    } else { //category selected + seller selected
                        filteredProducts = products.filter(product => checkedSellers.includes(product.sellerName.toLowerCase()) && product.category == filter);
                    }
                } else { //seller selected
                    if(price != -1) { //price selected + seller selected
                        filteredProducts = products.filter(product => checkedSellers.includes(product.sellerName.toLowerCase()) && product.price < price);
                    } else { //seller selected
                        filteredProducts = products.filter(product => checkedSellers.includes(product.sellerName.toLowerCase()));
                    }
                    
                }
            }
            //display the products according to the filtered products (category + price + seller)
            document.getElementById("all-products-section").innerHTML = GetProducts(filteredProducts.length, filteredProducts);
        }
}

function searchProductsByName(productName) {
    //filter the array according to the name

    let searchedArr = products.filter(function (product) {
        if (filter != "All") {
            //if the user checked the checkboxes then filter the products by seller name and category and the searched input
            if(checkedSellers.length > 0) {
                return product.productName.toLowerCase().includes(productName.toLowerCase()) && product.category == filter && checkedSellers.includes(product.sellerName);
            }
            else
            { //if the user didn't check the checkboxes then filter the products by category and the searched input
                return product.productName.toLowerCase().includes(productName.toLowerCase()) && product.category == filter;
            }
        }
        //the category is not selected then filter by seller name and search input or only by search input
        else {
            if(checkedSellers.length > 0) {
                return product.productName.toLowerCase().includes(productName.toLowerCase()) && checkedSellers.includes(product.sellerName);
            }
            else
            {
                return product.productName.toLowerCase().includes(productName.toLowerCase());
            }
        }
    });
    //update the products display with the searched array
    document.getElementById("all-products-section").innerHTML = GetProducts(searchedArr.length, searchedArr);
}

window.addEventListener("load", function () {
    if(this.location.href.indexOf("product.html")!=-1) {
        //display the sellers name if the loggedinuser is a customer or a guest
        displaySellersFilter();
        //making the navbar
        renderingNavBar();
        //categories
        MakingCategories();
        //logout
        LogOut();

        let allProducts = GetProducts(-1);
        document.getElementById("all-products-section").innerHTML = allProducts;

        //filtering
        let categoryItems = document.getElementById("categories").children;
        document.getElementById("categories").addEventListener("click", function (e) {
            if (e.target.nodeName == "LI") {
                filter = e.target.innerHTML;
                //Removing the active class from all list items
                for (let i = 0; i < categoryItems.length; i++) {
                    categoryItems[i].classList.remove("active");
                }
                //Add the active class to the clicked item
                e.target.classList.add("active");

                //change the category title to the clicked category name
                document.getElementById("category-title").innerHTML = `Our <span>${e.target.innerHTML}`;

                let allFilteredProducts;
                //If the user clicked all then display all products
                if (e.target.innerHTML == "All") {
                    allFilteredProducts = GetProducts(-1);
                } else {
                    //filtering by category name
                    let filteredProducts = products.filter(product => product.category.toLowerCase() == e.target.innerHTML.toLowerCase());
                    //Making the new products list
                    allFilteredProducts = GetProducts(filteredProducts.length, filteredProducts);
                    var product_Id;
                    // window.addEventListener("load", function () {
                        var addCartLink = document.querySelectorAll(".addCart");
                        console.log(addCartLink);
                        for (var i = 0; i < addCartLink.length; i++) {
                            addCartLink[i].addEventListener("click", function (event) {
                                event.preventDefault();
                                console.log(event.target);
                                product_Id = parseInt(event.target.parentElement.parentElement.parentElement.parentElement.classList[3].split('=')[1]);
                                addToCart(product_Id);
                
                            })
                        }
                
                    // })

                }

                //Updating the displayed products with the filtered products
                document.getElementById("all-products-section").innerHTML = allFilteredProducts;
                var product_Id;
                // window.addEventListener("load", function () {
                    var addCartLink = document.querySelectorAll(".addCart");
                    console.log(addCartLink);
                    for (var i = 0; i < addCartLink.length; i++) {
                        addCartLink[i].addEventListener("click", function (event) {
                            event.preventDefault();
                            console.log(event.target);
                            product_Id = parseInt(event.target.parentElement.parentElement.parentElement.parentElement.classList[3].split('=')[1]);
                            addToCart(product_Id);
                        })
                    }
            }
        })
        
        var product_Id;
        // window.addEventListener("load", function () {
            var addCartLink = document.querySelectorAll(".addCart");
            for (var i = 0; i < addCartLink.length; i++) {
                addCartLink[i].addEventListener("click", function (event) {
                    event.preventDefault();
                    console.log(event.target);
                    product_Id = parseInt(event.target.parentElement.parentElement.parentElement.parentElement.classList[3].split('=')[1]);
                    addToCart(product_Id);

                })
            }

        // })

        //adding search functionality
        document.getElementById("search-input").addEventListener("keyup", function () {
            searchProductsByName(this.value);
        })

        //adding priceRange functionality
        document.querySelector("#priceRange").addEventListener("change", filterAll);
    }    
})

function MakingCategories() {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i] == filter) {
            document.getElementById("categories").innerHTML += `<li class="list-inline-item py-4 px-4 active">${categories[i]}</li>`;
            continue;
        }
        document.getElementById("categories").innerHTML += `<li class="list-inline-item py-4 px-4">${categories[i]}</li>`;
    }
}