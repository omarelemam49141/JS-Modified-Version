
///////////// selectors///////////////
// Selectors
let tbody = document.querySelector("tbody");
let searchBar = document.getElementById('searchBar');
// Select all elements with the class 'delete' and store them in the 'deleteButtons' variable
 let deleteButtons = document.querySelectorAll('.delete');
 let table_headings, table_rows;

document.addEventListener('DOMContentLoaded', function() { 

// Data Arrays
let arrOfproduct = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentPage = 1;
const itemsPerPage = 4;

// Initialize table and event listeners on window load
window.addEventListener("load", function () {
    creatTableofData();
    attachEventListeners();

        // Select all elements with the class 'delete' and store them in the 'deleteButtons' variable
        deleteButtons = document.querySelectorAll('.delete');
        console.log(deleteButtons);
        let idProduct;
    
        deleteButtons.forEach((delBtn) => {
            // console.log(delBtn);
            delBtn.addEventListener("click", function (e) {
                e.preventDefault();
                idProduct = parseInt(e.target.parentElement.dataset.id);
                deleteProduct(idProduct);
                // console.log(e.target.parentElement.dataset.id);
    
            });
        })
    // deleteProduct();

    
    document.querySelector("#paginationContainer").addEventListener("click", function(e){
        if(isFinite(e.target.innerHTML)) {
            selectPage(Number(e.target.innerHTML));
        }
    })

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

function attachEventListeners() {
    // Edit and View button event listeners
    tbody.addEventListener("click", function (e) {
        
         if (e.target.classList.contains("view")) {
            handleViewClick(e.target.dataset.id);
        }
    });

    searchBar.addEventListener('input', handleSearch);

    
}



function handleViewClick(productId) {
    displayProduct(productId);
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


function handleSearch() {
    let searchValue = searchBar.value.toLowerCase();
    let allRows = tbody.getElementsByTagName("tr");
    for (let row of allRows) {
        let rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(searchValue) ? "" : "none";
    }
}




function creatTableofData() {
    tbody.innerHTML = ''; // Clear the table first
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = arrOfproduct.slice(startIndex, endIndex);
    const numPages = Math.ceil(arrOfproduct.length / itemsPerPage);
    paginatedItems.forEach(element => {
        if(JSON.parse(localStorage.getItem("loggedInUser")).userRole=="admin") {
            tbody.innerHTML += `
          <tr>
          <td>${element.productId}</td>
          <td>${element.productName}</td>
          <td><img src="${element["images"][0]}"/></td>
          <td>${element.sellerName}</td>
          <td>${element.category}</td>
          <td>${element.price}</td>
          <td>
                  <!-- View Link -->
                  <a href="#" title="View" data-bs-toggle="modal" data-bs-target="#exampleModalLong2" >
                      <i data-id="${element.productId}" class="view material-icons">&#xE417;</i>
                  </a>
              <a href="#"  title="Delete"  data-id="${element.productId}" class="delete trigger-btn"><i
                      class=" material-icons text-danger">&#xE872;</i></a>
          </td>
         </tr>`
        } 
        
        
    })
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
    creatTableofData()}

function selectPage(pageNum) {
    currentPage = pageNum;
    creatTableofData()}

// Initial call to populate the table
creatTableofData()// Declare variables for later use; these will be assigned values at runtime

/////

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let first_row = a.querySelectorAll('td')[column].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[column].textContent.toLowerCase();

        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));

}



/*end hissen*/ 


if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}
});

//    /------------------------ delete function --------------/
function deleteProduct(idDeleProduct) {

    var positionThisProductInProduct;
    var positionThisProductInCart;
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
                alert("Warning the item is in the Cart");
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
})