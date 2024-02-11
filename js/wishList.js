import { GetProducts } from "./custom.js";
import { LogOut, renderingNavBar } from "./general-methods.js";

window.addEventListener('load',function(){
    
        renderingNavBar();
        LogOut();
    
    if(location.href.substr(location.href.lastIndexOf('/')+1) =="wishList.html")
    {
        let products = getWishlistProducts();
        this.document.getElementById("products-Landing").innerHTML =  GetProducts(products.length,products);
        var links = this.document.querySelectorAll("a[data-id]");
        for(let i=0 ; i<links.length; i++)
        {
                links[i].setAttribute("href",this.location.href);
                links[i].innerHTML = "Remove";
                links[i].addEventListener("click",function(event){
                    const productId =links[i].getAttribute("data-id");
                    console.log(productId);
                    removeFromWishlist(productId);
            });
        }

    }
    else{
        var links = this.document.querySelectorAll("a[data-id]");
        for(let i=0 ; i<links.length; i++)
        {
                links[i].addEventListener("click",function(event){
                    event.preventDefault();
                    const productId = links[i].getAttribute("data-id");
                    AddToWishlist(productId);
            });
        }

        // var hearts = this.document.getElementsByClassName("iconHeart");
        // for(let i=1 ; i<hearts.length; i++)
        // {
        //         hearts[i].parentElement.addEventListener("click",function(event){
        //         event.preventDefault();
        //         const productId = document.getElementsByClassName("iconHeart")[i].parentElement.getAttribute("data-id");
        //         AddToWishlist(productId);
        //     });
        // }
     }
});



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
            userWishlist.push(productId);    
            sessionStorage.setItem('userWishlist', JSON.stringify(userWishlist));
            // sweat laert
        }
        else{
            //sweat alert
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
            Wishlists.splice(Wishlists.indexOf((wl) => wl["userID"] == loggedInUser.userID) ,1,loggedInWishlist);
            localStorage.setItem("wishlists",JSON.stringify(Wishlists));   
            // sweat alert
        }
        else{
            //sweat alert
        }
    }
}

export function removeFromWishlist(productId)
{
    console.log("remove from wishlist");
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); 
    let Wishlists = JSON.parse(localStorage.getItem("wishlists"));
    let userWishlist = JSON.parse(sessionStorage.getItem('userWishlist'));

    if(! loggedInUser)
    {
        console.log("not logged in");
        let productExists = userWishlist.some((PID) => PID == productId);
        if(productExists)
        { 
            userWishlist = userWishlist.filter(PID => PID !=productId);
            sessionStorage.setItem("userWishlist",JSON.stringify(userWishlist));
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
