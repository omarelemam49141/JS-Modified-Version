import { users as usersClass ,categories} from "./classes.js";
const userDataString = localStorage.getItem('loggedInUser');

window.addEventListener('load', function () {

      //check if the url is profile.html
      if (location.href.includes("profile.html")) {
        this.document.querySelector("#backBtn").addEventListener("click", function () {
          history.back();
        })

      let userData = JSON.parse(userDataString);
      if(userData.userGender == "Male")
      {
          this.document.getElementById("profileImage").src = "images/male.jpeg";
      }
      else{
        this.document.getElementById("profileImage").src = "images/female.jpeg";
      }

      document.getElementById('userName').value = userData.userName || '';
      document.getElementById('role').value = userData.userRole || '';
      document.getElementById('email').value = userData.userEmail || '';
      document.getElementById('password').value = userData.userPassword || '';


      // Handle form submission
      document.getElementById('profileForm').addEventListener('submit', function (event) {
          event.preventDefault();

          const updatedUserData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
          };

          if (  updatedUserData.password == userData.userPassword
                && updatedUserData.email == userData.userEmail ) 
          {
            return;
          }
          // Validate user information
          const emailMessage = document.getElementById('emailMessage');
          const passwordMessage = document.getElementById('passwordMessage');
          const validationMessage = document.getElementById('validationMessage');
          const successMessage = document.getElementById('successMessage');

          // Clear previous validation messages
          emailMessage.innerText = '';
          passwordMessage.innerText = '';
          validationMessage.innerText = '';

          const isEmailValid = isValidEmail(updatedUserData.email, emailMessage);
          const isPasswordValid = isValidPassword(updatedUserData.password, passwordMessage);

          if (!isEmailValid || !isPasswordValid) {
            document.getElementById('email').value = updatedUserData.email || '';
            document.getElementById('password').value = updatedUserData.password || '';
            setTimeout(() => {
              emailMessage.innerText = '';
              passwordMessage.innerText = '';
              validationMessage.innerText = '';
            }, 3000);  
            return;
          }

          let updatedUserObj = new usersClass(userData.userID, userData.userName, updatedUserData.password, updatedUserData.email, userData.userRole,userData.userGender);
          userData = updatedUserObj;
          localStorage.setItem('loggedInUser', JSON.stringify(updatedUserObj));
          
          let users = JSON.parse(localStorage.getItem('users'));
          let userIndex = users.findIndex(user => user.userID === userData.userID);
          users.splice(userIndex, 1, updatedUserObj);
          localStorage.setItem('users', JSON.stringify(users));

          successMessage.innerText = 'Profile updated successfully!';

          setTimeout(() => {
            successMessage.innerText = '';
          }, 3000);

       });//end of submit

          if(userData.userRole == "seller")
          {
              let sellerProducts = JSON.parse(this.localStorage.getItem('products'))
                                      .filter((product) => product.sellerName == userData.userName);

              var SoldProductsInEachCategory=[];
              var colors=[];
              for(var i=0; i<categories.length; i++)
              {
                SoldProductsInEachCategory[i]=0;
                colors[i] = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
                sellerProducts.forEach(product =>
                {
                    if(product.category == categories[i])
                      SoldProductsInEachCategory[i]+=product.quantity_sold;
                });  
              }

              const createdChart1 = document.getElementById("myChart1");
              new Chart(createdChart1, {type: 'bar',
                data: {
                  labels: sellerProducts.map((p) => p.productName),
                  datasets: [{
                    label: 'remaining quantities of each product',
                    data: sellerProducts.map((p)=>p.quantity-p.quantity_sold),
                    borderWidth: 5
                  }]
                },
                options: {
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              });
              this.document.getElementById("mychartlabel1").innerText = "remaining quantities of each product";
              
              const createdChart2 = document.getElementById("myChart2");
              new Chart(createdChart2, {type: 'pie',
                data: {
                  labels: categories,
                  datasets: [{
                    label: 'Number of sold products in each category',
                    data: SoldProductsInEachCategory,
                    backgroundColor:colors,
                    hoverOffset: 4
                  }]
                },
                options: {
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              });
              this.document.getElementById("mychartlabel2").innerText = "Number of sold products in each category";
          }
        }
 });//end of load

// Function to validate first name and last name
function isValidName(name, messageElement) {
  // Name must be at least three characters long and at most 15 characters
  if (name.length < 3 || name.length > 15) {
    messageElement.innerText = 'Name must be between 3 and 15 characters.';
    return false;
  }

  // Name can't be all numbers
  if (/^\d+$/.test(name)) {
    messageElement.innerText = 'Name can\'t be all numbers.';
    return false;
  }

  // Validation passed
  return true;
}

// Function to validate email
function isValidEmail(email, messageElement) {
  // Email must contain @ and a dot after @
  const emailReg = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,6}$/;
  if (! emailReg.test(email)) {
    messageElement.innerText = `Invalid email format. Make sure it contains "@" and a dot (.) after "@" and it accepts only characters and digits(e.g., example@example.com).`;
    return false;
  }

  // Validation passed
  return true;
}

// Function to validate password
function isValidPassword(password, messageElement) {
  // Password must be at least eight characters long and at most 20 characters
  if (password.length < 8 || password.length > 20) {
    messageElement.innerText = 'Password must be between 8 and 20 characters.';
    return false;
  }

  // Password must contain at least one alphabet
  if (!/[a-zA-Z]/.test(password)) {
    messageElement.innerText = 'Password must contain at least one alphabet.';
    return false;
  }

  // Password must contain at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    messageElement.innerText = 'Password must contain at least one special character.';
    return false;
  }

  // Validation passed
  return true;
}

export {isValidEmail, isValidName, isValidPassword};