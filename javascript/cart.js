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

  let totalAmount = 0;

  cartContainer.innerHTML = cart
    .map((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      return `
        <div class="cart-item" style="margin-bottom: 20px; display: flex; align-items: center;">
          <img src="${item.accessoryImage}" alt="${item.name}" style="width: 150px; height: 100px; margin-right: 10px; object-fit: cover;">
          <div>
            <h4>${item.name}</h4>
            <p>Brand: ${item.brand}</p>
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

  cartContainer.innerHTML += `
    <div class="cart-total" style="margin-top: 20px;">
      <h3>Total Amount: ₹${totalAmount}</h3>
    </div>
  `;

  // Add event listeners for quantity inputs and remove buttons
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const index = this.id.replace("quantity", "");
      updateQuantity(index, this.value);
    });
  });

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
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Function to remove an item from the cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  alert("Item removed from the cart!");
}

// Clear cart
document.getElementById("clearCart").addEventListener("click", function () {
  localStorage.removeItem("cart");
  displayCart();
  alert("Cart cleared!");
});

// Buy Now button click
document.getElementById("buyNowBtn").addEventListener("click", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const modal = document.getElementById("orderModal");
  modal.style.display = "block";

  const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails"));
  if (userDetails) {
    document.getElementById("name").value = userDetails.name || "";
    document.getElementById("email").value = userDetails.email || "";
  }
});

// Close modal
document.getElementById("closeModal").addEventListener("click", function () {
  const modal = document.getElementById("orderModal");
  modal.style.display = "none";
});

// Prevent modal display on page load
window.onload = () => {
  const modal = document.getElementById("orderModal");
  modal.style.display = "none";
};

// Handle order submission
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

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const orderDetails = {
    name,
    phone,
    address,
    email,
    items: cart,
    date: new Date().toLocaleString(),
  };

  addDoc(collection(db, "orders"), orderDetails)
    .then(() => {
      localStorage.removeItem("cart");
      displayCart();

      const modal = document.getElementById("orderModal");
      modal.style.display = "none";
      alert("Order placed successfully!");
    })
    .catch((error) => {
      console.error("Error saving order: ", error);
      alert("There was an issue placing your order. Please try again.");
    });
});

// Initialize cart display
displayCart();
