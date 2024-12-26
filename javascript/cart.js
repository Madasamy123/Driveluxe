 // Import necessary functions from Firebase SDK
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
 import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
 
 // Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyC0tw4_CFl84kb5i4DeuBkKf0gA7gS3mF4",
   authDomain: "login-page1234.firebaseapp.com",
   projectId: "login-page1234",
   storageBucket: "login-page1234.appspot.com",
   messagingSenderId: "471482088238",
   appId: "1:471482088238:web:eb3db8a185185e54e118bf"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 
 
 // Function to display the cart
    // Function to display the cart
    function displayCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartContainer = document.getElementById("cart-container");
      
        if (cart.length === 0) {
          cartContainer.innerHTML = "<p>Your cart is empty!</p>";
          return;
        }
      
        let totalAmount = 0; // Initialize total cart amount
      
        // Display cart items dynamically
        cartContainer.innerHTML = cart
          .map((item, index) => {
            const itemTotal = item.price * item.quantity; // Calculate total for the current item
            totalAmount += itemTotal; // Add to total cart amount
      
            return `
              <div class="cart-item" style="margin-bottom: 20px;">
                <img src="${item.img}" alt="${item.name}" style="width: 200px; margin-right: 10px;">
                <div>
                  <h4>${item.name}</h4>
                  <p>Price: ₹${item.price}</p>
                  <label for="quantity${index}">Quantity: </label>
                  <input type="number" id="quantity${index}" class="quantity-input" value="${item.quantity}" min="1" style="width: 50px; margin-right: 10px;"><br><br>
                   <button class="remove-item" data-index="${index}" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                    Remove
                  </button>
                
                </div>
                 
              </div>
            `;
          })
          .join("");
      
        // Display total amount below cart items
        cartContainer.innerHTML += `
          <div class="cart-total" style="margin-top: 20px;">
            <h3>Total Amount: ₹${totalAmount}</h3>
          </div>
        `;
      
        // Add event listeners to quantity inputs
        document.querySelectorAll(".quantity-input").forEach((input) => {
          input.addEventListener("change", function () {
            const index = this.id.replace("quantity", "");
            updateQuantity(index, this.value);
          });
        });
      
        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-item").forEach((button) => {
          button.addEventListener("click", function () {
            const index = this.dataset.index;
            removeFromCart(index);
          });
        });
      }
      
          // Function to update the quantity of an item
          function updateQuantity(index, quantity) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (quantity < 1) {
              alert("Quantity must be at least 1");
              return;
            }
            cart[index].quantity = parseInt(quantity);
            localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
            displayCart(); // Refresh the cart
          }
      
          // Function to remove an item from the cart
          function removeFromCart(index) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1); // Remove the item at the specified index
            localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
            displayCart(); // Refresh the cart
            alert("Item removed from the cart!");
          }
      
          // Function to clear the entire cart
          document.getElementById("clearCart").addEventListener("click", function () {
            localStorage.removeItem("cart");
            displayCart();
            alert("Cart cleared!");
          });
      
          // Function to handle Buy Now functionality (show modal)
          document.getElementById("buyNowBtn").addEventListener("click", function () {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
              alert("Your cart is empty!");
              return;
            }
      
            // Show the modal
            const modal = document.getElementById("orderModal");
            modal.style.display = "block";
          });
      
          // Close modal when the user clicks the close button (×)
          document.getElementById("closeModal").addEventListener("click", function () {
            const modal = document.getElementById("orderModal");
            modal.style.display = "none";
          });
      
         // Handle form submission to save order details
         document.getElementById("orderForm").addEventListener("submit", function (e) {
            e.preventDefault();
          
            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const address = document.getElementById("address").value;
            const email = document.getElementById("email").value;
          
            if (!name || !phone || !address || !email) {
              alert("Please fill in all the details.");
              return;
            }
          
            // Get cart items
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
          
            // Create an order object
            const orderDetails = {
              name: name,
              phone: phone,
              address: address,
              email: email,
              items: cart,
              date: new Date().toLocaleString(),
            };
          
            // Save the order to Firestore's "orders" collection
            addDoc(collection(db, "orders"), orderDetails)
              .then(() => {
                // Clear the cart after order is placed
                localStorage.removeItem("cart");
                displayCart();
          
                // Close the modal and show success alert
                const modal = document.getElementById("orderModal");
                modal.style.display = "none";
                alert("Order placed successfully!");
              })
              .catch((error) => {
                console.error("Error saving order: ", error);
                alert("There was an issue placing your order. Please try again.");
              });
          });
      
          // Initialize cart display on page load
          displayCart();