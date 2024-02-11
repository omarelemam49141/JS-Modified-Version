import { categories } from "./classes.js";
import { LogOut } from "./general-methods.js"
///////////// selectors///////////////

var tbody = document.querySelector("tbody")
// var tableTr = document.querySelectorAll("table  tr")
var btnAdd = document.querySelector(".add-new");
var submit = document.querySelector(".submitLink");
//selector modal //  
var close = document.querySelector(".close");
var closex = document.querySelector(".clsBtn");
//selectors form//
var _ProductName = document.getElementById("ProductName");
var _price = document.getElementById("price");
var _Quntity = document.getElementById("Quntity");
var _sellerName = document.getElementById("sellerName");
var description = document.getElementById("description");
var category = document.getElementById("category");
var img1 = document.getElementById("productImage");
var checkboxes = document.querySelectorAll('.color-checkbox');
//////////
var submitButton = document.getElementById('submitButton');
var searchBar = document.getElementById('searchBar');
// Declare variables for later use; these will be assigned values at runtime
var deleteButtons;
var table_headings, table_rows;
/////

let arrOfproduct;

if (localStorage.getItem("products")) {
    arrOfproduct = JSON.parse(localStorage.getItem("products"));
}
let sellerName = JSON.parse(localStorage.getItem("loggedInUser")).userName;
console.log(sellerName);
let sellerArr = arrOfproduct.filter((product) => product.sellerName == sellerName
)

var tbody = document.querySelector("tbody")
var btnAdd = document.querySelector(".add-new");
// var submit = document.querySelector(".submitLink");
//selector modal //  
var closex = document.querySelector(".clsBtn");
//selectors form//
var _ProductName = document.getElementById("ProductName");
var _price = document.getElementById("price");
var _Quntity = document.getElementById("Quntity");
var description = document.getElementById("description");
var select = document.getElementById("category");
var img1 = document.getElementById("productImage");
var checkboxes = document.querySelectorAll('.color-checkbox');

// Declare variables for later use; these will be assigned values at runtime
var deleteButtons;
var table_headings, table_rows;
/////

document.addEventListener('DOMContentLoaded', function() {


let cart;
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
} else {
    cart = [];
}
// Function to update local storage with an array of products
function updateLocalStorage(arrOfproduct) {
    console.log("Updating local storage with products:", arrOfproduct);
    localStorage.setItem("products", JSON.stringify(arrOfproduct));
}

// Execute the following code when the window has fully loaded
window.addEventListener("load", function () {
    // Select all elements with the class 'delete' and store them in the 'deleteButtons' variable
    deleteButtons = document.querySelectorAll('.delete');
    attachEventListeners();


    searchBar.addEventListener('input', handleSearch);
    submitButton.addEventListener("click", handleSubmitButtonClick);
    function attachEventListeners() {
        // Edit and View button event listeners
        tbody.addEventListener("click", function (e) {
            if (e.target.classList.contains("edit")) {
                handleEditClick(e.target.dataset.id);
            } else if (e.target.classList.contains("view")) {
                handleViewClick(e.target.dataset.id);
            }
        })
    };
    function handleEditClick(productId) {
        let productData = arrOfproduct.find(product => product.productId == productId);
        populateFormWithProductData(productData);
    }

    function handleViewClick(productId) {
        displayProduct(productId);
    }

    function handleSubmitButtonClick(event) {
        event.preventDefault();
        let editedProduct = getEditedValues();
        updateProductData(editedProduct);

        location.reload();

    }

    //register the pagination event
    document.querySelector("#paginationContainer").addEventListener("click", function(e){
        if(isFinite(e.target.innerHTML)) {
            selectPage(Number(e.target.innerHTML));
        }
    })
})

window.addEventListener("load", function () {
    if (localStorage.getItem("products")) {
        arrOfproduct = JSON.parse(localStorage.getItem("products"));
    } else {

        arrOfproduct = [];
    }
    // Iterate through each category in the 'categories' array and  Set the 'value' attribute of the <option> to the current category
    categories.forEach((category) => {
        var option = document.createElement("option");
        option.value = category;
        option.text = category;
        select.add(option);
    })

    createTableOfData();   
     //   ----delete -----

    // Select all elements with the class 'delete' and store them in the 'deleteButtons' variable
    deleteButtons = document.querySelectorAll('.delete');
    var idProduct;

    deleteButtons.forEach((delBtn) => {
        // console.log(delBtn);
        delBtn.addEventListener("click", function (e) {
            e.preventDefault();
            idProduct = parseInt(e.target.parentElement.dataset.id);
            deleteProduct(idProduct);
            // console.log(e.target.parentElement.dataset.id);

        });
    })


    //     /*////////////////////////////////////////////////////
    //         Functionality for sorting table columns
    //     ////////////////////////////////////////////////////*/
    table_rows = document.querySelectorAll('tbody tr'),
        table_headings = document.querySelectorAll('thead th');
    //

    table_headings.forEach((head, i) => {

        let sort_asc = true;
        if (i == 1 || i == 4) {
            head.onclick = (e) => {
                // console.log(e.target);
                table_headings.forEach(head => head.classList.remove('active'));
                head.classList.add('active');

                document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
                table_rows.forEach(row => {
                    row.querySelectorAll('td')[i].classList.add('active');
                })

                head.classList.toggle('asc', sort_asc);
                sort_asc = head.classList.contains('asc') ? false : true;

                sortTable(i, sort_asc);
            }
            // console.log(head);

        }
    })


    //info about seller

    this.document.querySelector("#dropdownUser2").innerHTML =
        `<img src="images/favicon.png" alt="" width="32" height="32" class="rounded-circle me-2">
         <strong> ${sellerName}</strong> 
        `


        document.querySelector('body').addEventListener('click', function(e) {
            if (e.target.matches('.page-link')) {
                e.preventDefault(); // Prevent the default anchor action
    
                const action = e.target.getAttribute('aria-label');
    
                if (action === 'Previous') {
                    changePage(-1);
                } else if (action === 'Next') {
                    changePage(1);
                } else if (e.target.textContent) {
                    const pageNum = parseInt(e.target.textContent);
                    if (!isNaN(pageNum)) {
                        selectPage(pageNum);
                    }
                }
            }
        });


})
//    /------------------------ delete function --------------/
function deleteProduct(idDeleProduct) {

    var positionThisProductInProduct;
    var positionThisProductInCart;
    console.log("id elem  clicked", idDeleProduct);
    var actualDeleted = idDeleProduct;

    // ------sweet alert ------
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {

            positionThisProductInCart = cart.findIndex((value) => {

                return value.product_id == idDeleProduct;
            }
            );
            console.log(positionThisProductInCart);

            // Find the position of the product in the product array
            positionThisProductInProduct = arrOfproduct.findIndex((value) => {

                return idDeleProduct == value.productId;   // return value["productId"] == arrOfproduct[idProduct - 1]["productId"];
            })
            console.log("index", positionThisProductInProduct, "ele", actualDeleted);

            if (positionThisProductInCart > -1) {  // check if product extist in cart 
                // console.log(arrOfproduct);
                cart.splice(positionThisProductInCart, 1);

                // console.log(arrOfproduct);
                localStorage.setItem("cart", JSON.stringify(cart));
                // sweet alert
            }

            arrOfproduct.splice(positionThisProductInProduct, 1);
            localStorage.setItem("products", JSON.stringify(arrOfproduct));
            location.reload();


            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });


}

function validateImage() {
    console.log(img1);
    var fileName = img1.value.toLowerCase();

    if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png')) {
        Swal.fire("Please upload an image file with a valid extension (.jpg, .jpeg, .png).");
        img1.value = '';
        return false;
    } else {
        return true;
    }
}

function Add() {
    var selectedValues = [];
    // Add a change event listener to each checkbox
    var checkedFlag = false;
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            checkedFlag = true;
            selectedValues.push(checkbox.value);
        }
    });

    if (!checkedFlag) {
        selectedValues.push(checkboxes[0].value);
    }
    var imgesInput = [];// arr of imges

    var lastIndex = img1.value.lastIndexOf("\\");
    img1 = img1.value.slice(lastIndex + 1);
    img1 = `images/${img1}` // concat src
    imgesInput.push(img1)


    var lastID = Math.max(...arrOfproduct.map(product => product.productId), 0); // to get max id 

    var newProduct = {
        productId: lastID + 1,
        productName: _ProductName.value,
        category: select.value,
        sellerName: sellerName,
        quantity: Number(_Quntity.value),
        quantity_sold: 0,
        images: imgesInput,
        price: Number(_price.value),
        description: description.value,
        options: selectedValues,
    };
    arrOfproduct.push(newProduct);
    updateLocalStorage(arrOfproduct);
    location.reload();
}

// open modal
btnAdd.addEventListener("click", function () {

    $('#myModal2').modal('show');

})

/////hussien
function populateFormWithProductData(data) {
    const modalFields = document.querySelector('.modal-fields');
    //save the old data in the updatedProductData object

    modalFields.innerHTML = `
    <div class="form-group">
        <label>Product ID</label>
        <small id="productIdMessage" class="form-text  text-danger"></small>
        <input class="form-control" type="text" name="productId" id="productId" value="${data.productId}" readonly>
             </div>
    <div class="form-group">
        <label>Category</label>
        <small id="categoryMessage" class="form-text  text-danger"></small>
        <select class="form-select form-select-sm"
        aria-label=".form-select-sm example" id="category" value="${data.category}">    
        ${categories.map(element => {
        if (element.toLowerCase() == data.category.toLowerCase()) {
            return `<option value="${element}" selected>${element}</option>`
        }
        return `<option value="${element}">${element}</option>`
    }).join('')
        }
    <!-- span invalid input -->
        <span class="is-invalid"> *must choose catigery </span>
        </select> 
    </div>
    <div class="form-group">
        <label>Product Name</label>
        <small id="nameMessage" class="form-text  text-danger"></small>
        <input class="form-control" type="text" name="productName"
            id="productName" value="${data.productName}">
    </div>
    <div class="form-group">
        <label>Images</label>
        <small id="imagesMessage" class="form-text  text-danger"></small>
        <input class="form-control" required type="file" name="images" id="images" onchange="console.log(this.value)">
        <img class="img-fluid w-25 " src="${data.images[0]}" alt="..." loading="lazy">
    </div>

    <div class="form-group">
        <label>Seller Name</label>
        <small id="sellerMessage" class="form-text  text-danger"></small>
        <input class="form-control" type="text" name="sellerName" value="${data.sellerName}"
            id="sellerName" disabled>
    </div>


    <div class="form-group">
        <label>Price</label>
        <small id="priceMessage" class="form-text  text-danger"></small>
        <input class="form-control" type="number" name="price" id="price" min="1" oninput="this.value = this.value <= 0 ? 1:this.value" value="${data.price}">
    </div>

    <div class="form-group">
        <label>Description</label>
        <small id="descMessage" class="form-text  text-danger"></small>
        <input class="form-control" type="text" name="productDesc" style="width:100%" required
            id="productDesc" value="${data.description}">
    </div>
    </div>`
}

// Event handler for the click event on the "submit" form 
$('#addressForm').submit(function (event) {
    // Prevent the default form submission
    event.preventDefault();
    // Check the validity of the data using the vaildData() function
    if(validateImage()){
        closeModal();
        Add();
    }
});

function validateImage() {
    var fileName = img1.value.toLowerCase();

    if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png')) {
        Swal.fire("Please upload an image file with a valid extension (.jpg, .jpeg, .png).");
        img1.value = '';
        return false;
    } else {
        return true;
    }
}



function getEditedValues() {
    let editForm = document.querySelector("#editForm").children[0].children[0];
    let imgInput = editForm.children[3].children[2];
    let oldImg = editForm.children[3].children[3].src;
    let imgSrc;

    // Image validation only jpg and jpeg
    if (imgInput.value && !/\.(jpg|jpeg)$/i.test(imgInput.value)) {
        document.querySelector("#imagesMessage").textContent = "Image must be a .jpg or .jpeg file.";
        return null;
    }

    if (imgInput.value) {
        imgSrc = `images/${imgInput.value.substring(imgInput.value.lastIndexOf("\\") + 1)}`;
    } else {
        imgSrc = `images/${oldImg.substring(oldImg.lastIndexOf("/") + 1)}`;
    }

    // Product Name validation Only char
    let productName = editForm.children[2].children[2].value;
    if (!/^[a-zA-Z0-9\s]+$/.test(productName)) {
        document.querySelector("#nameMessage").textContent = "Product Name should only contain characters.";

        return null;
    }

    // Price validation number and decimal point
    let price = parseFloat(editForm.children[5].children[2].value);
    if (isNaN(price) || price <= 0) {
        document.querySelector("#priceMessage").textContent = "Price must be more than zero.";

        return null;
    }

    // Return the edited values
    console.log(editForm.children[0].children[2].value);
    return {
        productId: editForm.children[0].children[2].value,
        productName: productName,
        images: [imgSrc],
        sellerName: editForm.children[4].children[2].value,
        category: editForm.children[1].children[2].value,
        price: price,
        description: editForm.children[6].children[2].value
    };
}


function updateProductData(EditedValues) {
    const index = arrOfproduct.findIndex(products => products.productId == EditedValues.productId);
    if (index !== -1) {
        arrOfproduct[index] = { ...arrOfproduct[index], ...EditedValues };
        console.log("Updated Product Data", arrOfproduct[index]);
        updateLocalStorage(arrOfproduct);
        creatTableofData();
    } else {
        console.error("Product not found in array. ID: ", EditedValues.productId);
    }
}

function displayProduct(productId) {
    let productDetails = arrOfproduct.find(item => item.productId == productId);
    if (productDetails) {
        document.querySelector('#exampleModalLong2 .modal-body2').innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Product Name:</strong> ${productDetails.productName}</p>
                        <p><strong>Price:</strong> ${productDetails.price}</p>
                        <p><strong>Sold by:</strong> ${productDetails.sellerName}</p>
                        <p><strong>Category:</strong> ${productDetails.category}</p>
                    </div>
                    <div class="col-md-6 d-flex justify-content-end">
                        <img src="${productDetails.images[0]}" alt="Product Image" class="img-fluid">
                    </div>
                </div>
            </div>
        `;
    } else {
        console.log("No such product exists");
    }
}


function handleSearch(e) {
    let searchValue = searchBar.value.toLowerCase();
    let allRows = tbody.getElementsByTagName("tr");
    for (let row of allRows) {
        let rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchValue) ? "" : "none";
    }
}





let currentPage = 1;
const itemsPerPage = 5; // Change this to how many items you want per page

function createTableOfData() {
    const sellerArr = arrOfproduct.filter((product) => product.sellerName == sellerName);

    // Calculate the number of pages needed
    const numPages = Math.ceil(sellerArr.length / itemsPerPage);

    // Determine the slice of the array to display based on the current page
    const paginatedItems = sellerArr.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset and fill the table body with the current page's items
    tbody.innerHTML = '';
    paginatedItems.forEach(product => {
        tbody.innerHTML += `
            <tr>
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>
            <img src="${product["images"][0]}" ></img>
            </td>
            <td>${product.sellerName}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>
            <a href="#" class="edit" title="Edit" data-bs-toggle="modal" data-bs-target="#userFormModal">
                <i class="material-icons edit" data-id="${product.productId}">&#xE254;</i>
            </a>
            <a href="#" title="View" data-bs-toggle="modal" data-bs-target="#exampleModalLong2" >
                <i data-id="${product.productId}" class="view material-icons">&#xE417;</i>
                </a>
            <a href="#" title="Delete" data-id="${product.productId}" class="delete trigger-btn"><i
                        class="material-icons text-danger">&#xE872;</i></a>
            </td>
            </tr>`;
    });

    // Update the pagination controls
    updatePaginationControls(numPages);
}

function updatePaginationControls(numPages) {
    const paginationUl = document.querySelector('.pagination');
    paginationUl.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous" onclick="changePage(-1)">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>`;

    for (let i = 1; i <= numPages; i++) {
        paginationUl.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
    }

    paginationUl.innerHTML += `
        <li class="page-item ${currentPage === numPages ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next" onclick="changePage(1)">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`;
}

function changePage(amount) {
    currentPage += amount;
    createTableOfData();
}

function selectPage(pageNum) {
    currentPage = pageNum;
    createTableOfData();
}

// Initial call to populate the table
createTableOfData();


// Declare variables for later use; these will be assigned values at runtime

var table_headings, table_rows;
/////

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();
        if (first_row == second_row)
            return 0;


        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));

}

LogOut()

close.addEventListener("click", closeModal)
closex.addEventListener("click", closeModal)
//close the add modal
function closeModal() {
    // Hide the modal after deletion
    $('#myModal2').removeClass('fade');
    // Hide the modal after deletion
    $('#myModal2').modal('hide');
}

table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');


table_headings.forEach((head, i) => {

    let sort_asc = true;
    if (i == 1 || i == 3 || i == 4) {
        head.onclick = (e) => {
            // console.log(e.target);
            table_headings.forEach(head => head.classList.remove('active'));
            head.classList.add('active');

            document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
            table_rows.forEach(row => {
                row.querySelectorAll('td')[i].classList.add('active');
            })

            head.classList.toggle('asc', sort_asc);
            sort_asc = head.classList.contains('asc') ? false : true;

            sortTable(i, sort_asc);
        }
        // console.log(head);
    }
});
});