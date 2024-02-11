window.addEventListener('load',function(){

    // console.log(location.href.substr(location.href.lastIndexOf('/')+1) =="wishList.html")
    if(location.href.substr(location.href.lastIndexOf('/')+1) =="wishList.html")
    {
        // wishlist page

        // render products
        let wishlistProducts = GetProducts(); 
        
        // remove instead heart

    }
    else{
        var hearts = this.document.getElementsByClassName("iconHeart");
        for(let i=1 ; i<hearts.length; i++)
        {
                hearts[i].parentElement.addEventListener("click",function(event){
                event.preventDefault();
                const productId = document.getElementsByClassName("iconHeart")[i].parentElement.getAttribute("data-id");
                AddToWishlist(productId);
            });
        }
    // }
}});



export function AddToWishlist(productId)
{
    console.log("add to wishlist");
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
    let Wishlists = JSON.parse(localStorage.getItem("wishlists"));
    let userWishlist = JSON.parse(sessionStorage.getItem('userWishlist'));
    if(!loggedInUser)
    {
        let productExists = userWishlist.some((PID) => PID == productId);
        
        if(!productExists)
        {        
            // Add the number to the array
            userWishlist.push(productId);    
            // Update the array in local storage
            sessionStorage.setItem('userWishlist', JSON.stringify(userWishlist));
        }
    }
    else if(loggedInUser.userRole == "customer")
    {

        let loggedInWishlist = JSON.parse(localStorage.getItem("wishlists"))
                                .filter((wl) => wl["userID"] == loggedInUser.userID)[0];
        
        let indexOfProduct = loggedInWishlist["products"].indexOf(productId);
        if(indexOfProduct == -1)
        {
            loggedInWishlist["products"][loggedInWishlist["products"].length] = productId;
            // loggedInWishlist.push(productId);
            Wishlists.splice(Wishlists.indexOf((wl) => wl["userID"] == loggedInUser.userID) ,1,loggedInWishlist);
            localStorage.setItem("wishlists",JSON.stringify(Wishlists));   
        }
    }
    console.log(getWishlistProducts())
}

export function removeFromWishlist(productId)
{
    console.log("remove from wishlist");
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
    let Wishlists = JSON.parse(localStorage.getItem("wishlists"));
    let userWishlist = JSON.parse(sessionStorage.getItem('userWishlist'));

    if(! loggedInUser)
    {
        let productExists = userWishlist.some((PID) => PID == productId);
        if(productExists)
        { 
            userWishlist = userWishlist.filter(PID => PID !=productId);
            sessionStorage.setItem("userWishlist",userWishlist);
        }
    }
    else if(loggedInUser.userRole == "customer")
    {

        let loggedInWishlist = JSON.parse(localStorage.getItem("wishlists"))
                                .filter((wl) => wl["userID"] == loggedInUser.userID)[0];
        let indexOfProduct = loggedInWishlist["products"].indexOf(productId);
        if(indexOfProduct != -1)
        {
            loggedInWishlist["products"] = loggedInWishlist["products"].filter(PID => PID != productId);
            Wishlists.splice(Wishlists.indexOf((wl) => wl["userID"] == loggedInUser.userID) ,1,loggedInWishlist);
            localStorage.setItem("wishlists",JSON.stringify(Wishlists));   
        }
    }
}

export function getWishlistProducts()
{
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    let wishlists = JSON.parse(localStorage.getItem("wishlists"));
    let userWishlist =JSON.parse(sessionStorage.getItem("userWishlist"));
    let products = JSON.parse(localStorage.getItem("products"));
    let wishlistProducts;
    

    if(loggedInUser)
    {
        let productsID = wishlists.filter((wl) => wl["userID"] == loggedInUser.userID)[0]["products"];
        wishlistProducts = products.filter(product => productsID.indexOf(product.productId.toString()) != -1);
        return wishlistProducts
    }
    else
    {
        wishlistProducts = products.filter(product => userWishlist.indexOf(product.productId.toString()) != -1);
        return wishlistProducts;
    }
}
