window.addEventListener('load',function(){

    console.log(this.document.getElementsByClassName("iconHeart"));

    var hearts = this.document.getElementsByClassName("iconHeart");
    
    for(let i=1 ; i<hearts.length; i++)
    {
        console.log(hearts[i].parentElement);
        hearts[i].parentElement.addEventListener("click",function(event){
            event.preventDefault();
            const productId = document.getElementsByClassName("iconHeart")[i].parentElement.getAttribute("data-id");
            console.log(productId);
            AddToWishlist(productId);
         });
    }
})



export function AddToWishlist(productId)
{
    console.log("add to wishlist");
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
    let Wishlists = JSON.parse(localStorage.getItem("wishlists"));
    let userWishlist = JSON.parse(localStorage.getItem('userWishlist'));
    console.log(new Boolean(loggedInUser));
    console.log(loggedInUser)
    if(!loggedInUser)
    {
        let productExists = JSON.parse(localStorage.getItem("userWishlist")).some((PID) => PID == productId);
        
        if(!productExists)
        {        
            // Add the number to the array
            console.log(productId);
            userWishlist.push(productId);    
            // Update the array in local storage
            localStorage.setItem('userWishlist', JSON.stringify(userWishlist));
        }
    }
    else if(loggedInUser.userRole == "customer")
    {

        let loggedInWishlist = JSON.parse(localStorage.getItem("wishlists"))
                                .filter((wl) => wl["userID"] == loggedInUser.userID)[0];
        console.log(loggedInWishlist["products"]);
        let indexOfProduct = loggedInWishlist["products"].indexOf(productId);
        console.log(indexOfProduct);
        if(indexOfProduct == -1)
        {
            loggedInWishlist["products"][loggedInWishlist["products"].length] = productId;
            // loggedInWishlist.push(productId);
            console.log(loggedInWishlist["products"]);
            Wishlists.splice(Wishlists.indexOf((wl) => wl["userID"] == loggedInUser.userID) ,1,loggedInWishlist);
            console.log(Wishlists)
            localStorage.setItem("wishlists",JSON.stringify(Wishlists));   
        }
    }
    console.log("wish list products" + getWishlistProducts());
}

export function removeFromWishlist(productId)
{
    console.log("remove from wishlist");
    const loggedInUser = JSON.parse(localStorage.getItem("LoggedInUser")); 
    const sessionWishlist =JSON.parse(sessionStorage.getItem("sessionWishlist"));
    const Wishlists = JSON.parse(localStorage.setItem("wishlists"));

    if(! loggedInUser)
    {
        let productExists = sessionWishlist.some((PID) => PID == productId);
        if(productExists)
        {
            sessionWishlist = sessionWishlist.filter(PID => PID != productId);
            sessionStorage.setItem("sessionWishlist",sessionWishlist);
        }
    }
    else if(loggedInUser.userRole == "customer")
    {
        Wishlist = Wishlists.filter((wl) => wl.customerID == loggedInUser.userID)[0];
        productExists = Wishlist.filter((PID) => PID == productId);
        if(productExists)
        {
            Wishlist.filter(PID => PID != productId);
            Wishlists.splice(Wishlists.indexOf((wl) => wl.customerID == loggedInUser.userID) ,1,Wishlist);
            localStorage.setItem("Wishlists",Wishlists);   
        }
    }
}

export function getWishlistProducts()
{
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log(loggedInUser);
    let wishlists = JSON.parse(localStorage.getItem("wishlists"));
    console.log(wishlists);
    let userWishlist =JSON.parse(localStorage.getItem("userWishlist"));
    console.log(userWishlist);
    if(loggedInUser)
    {
        let loggedInWihslist = wishlists.filter((wl) => wl["userID"] == loggedInUser.userID);
        return loggedInWihslist["products"];
    }else{
        return userWishlist;
    }
}
