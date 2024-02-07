import { carts, userCart } from "./classes.js";
//general method
export function updateLocalStorage(key, value)
{
	localStorage.setItem(key, JSON.stringify(value));
}

//logout
export function LogOut() {
    document.getElementById("user-DropDown").addEventListener("click", function (e) {
        if (e.target.id == "logOut") {
            //make a new variable
            let newusersCarts;
            //get the loggedInUser
            let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            //Check if the customer made a cart
            if (localStorage.getItem("cart") && JSON.parse(localStorage.getItem("cart")).length > 0) {
                //check if there are carts saved in the local storage
                if(localStorage.getItem("usersCarts") && JSON.parse(localStorage.getItem("usersCarts")).cartsArr.length > 0) {
                    //If yes(there are carts in the local storage), then get them
                    newusersCarts = new carts();
                    JSON.parse(localStorage.getItem("usersCarts")).cartsArr.forEach(cart => {
                        newusersCarts.addCart(cart);
                    });
                } else {
                    //else(there are no carts in the local storage)), then make a new carts object
                    newusersCarts = new carts();
                }
                //Make a new userCart object with a value of the made cart
                let customerCart = new userCart(loggedInUser.userID, JSON.parse(localStorage.getItem("cart")));

                //check if there are old carts in the local storage then delete the customer old cart if it is there and add the new cart
                if(newusersCarts.cartsArr.length > 0) {
                    newusersCarts.cartsArr = newusersCarts.cartsArr.filter(cartObj=>cartObj.customerID!=loggedInUser.userID);
                } 
                //add the new cart
                newusersCarts.addCart(customerCart);
                //update the local storage
                localStorage.setItem("usersCarts", JSON.stringify(newusersCarts));
            }

            //delete the cart from the customer local storage
            localStorage.removeItem("cart");

            //log out
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        }
    })
}

export function loadCustomerCart() {
    let loggedInUserId = JSON.parse(localStorage.getItem("loggedInUser")).userID;
    //get all users' carts
    let usersCarts = JSON.parse(localStorage.getItem("usersCarts")) || [];
    //get the loggedInUser cart if it exists
    let loggedInUserCart = usersCarts.cartsArr.filter(cart=>cart.customerID == loggedInUserId)[0];
    //set the cart in the local storage with the loggedInUserCart
    if(loggedInUserCart) {
        localStorage.setItem("cart", JSON.stringify(loggedInUserCart.cart));
    }
}

//Rendering the navbar according to the user role (customer, seller or admin)
export function renderingNavBar()
{
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser != null) {
        if(loggedInUser.userRole=="admin")
        {
            document.querySelector(".header_section .container").innerHTML = `
				<nav class="navbar navbar-expand-lg custom_nav-container ">
				<a class="navbar-brand" href="index.html"><img width="250" src="images/logo.png" alt="#" /></a>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class=""> </span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav">
					<li class="nav-item active">
						<a class="nav-link" href="admin.html">Home <span class="sr-only">(current)</span></a>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true"> <span class="nav-label" id="welcome-user"> <span class="caret">${loggedInUser.userName}</span></a>
						<ul class="dropdown-menu" id="user-DropDown">
							<li><a href="profile.html">Profile</a></li>
							<li><a href="usersCRUD.html">Users</a></li>
							<li><a href="#" id="logOut">Log out</a></li>
						</ul>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="dashboardAdmin.html">Products</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="orderHistory.html">Orders</a>
					</li>     
				</ul>
				</div>
			</nav>
            `;
        }
        else if(loggedInUser.userRole == "customer")
        {
            //add the list items to the dropdown menu
            let userDropDown = document.getElementById("user-DropDown");
            userDropDown.innerHTML = `
            <li><a href="profile.html">Profile</a></li>
            <li><a href="orderHistory.html" id="orderHistory">Orders</a></li>
            <li><a href="#" id="logOut">Log out</a></li>
            `;
            //change the a href to the customer page
            document.getElementById("homeLink").setAttribute("href", "customer.html");
            document.getElementById("loggedInUser").innerHTML = "Welcome, " + JSON.parse(localStorage.getItem("loggedInUser")).userName;
            if(loggedInUser.userRole=="customer")
            {
                document.querySelector("#orderHistory").style.display = "block";
				document.querySelector("#cartListItem").style.display = "block";
            } 
			
        }
		else 
		{
			//add the list items to the dropdown menu
            let userDropDown = document.getElementById("user-DropDown");
            userDropDown.innerHTML = `
            <li><a href="profile.html">Profile</a></li>
            <li><a href="orderHistory.html" id="orderHistory">Orders</a></li>
            <li><a href="#" id="logOut">Log out</a></li>
            `;
			document.getElementById("homeLink").setAttribute("href", "seller.html");
			document.getElementById("loggedInUser").innerHTML = "Welcome, " + JSON.parse(localStorage.getItem("loggedInUser")).userName;
		}
    } else {
        document.getElementById("loggedInUser").innerHTML = "Account";
        //add the list items to the dropdown menu
        let userDropDown = document.getElementById("user-DropDown");
        userDropDown.innerHTML = `
        <li><a href="sign-up/sign-up.html">Sign up</a></li>
        <li><a href="Login/login.html">Log in</a></li>
        `;

		

        //change the a href to the index page
        document.getElementById("homeLink").setAttribute("href", "index.html");
    }
}

