// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

// Fetch accessory details based on ID
async function fetchAccessoryDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessId = urlParams.get("accessId");

  if (!accessId) {
    console.error("No accessory ID found in URL.");
    return;
  }

  try {
    const docRef = doc(db, "accessories", accessId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const accessory = docSnap.data();
      displayAccessoryDetails(accessory);
    } else {
      console.error("No document found with the provided ID.");
    }
  } catch (error) {
    console.error("Error fetching accessory details:", error);
  }
}

// Display accessory details in the HTML
function displayAccessoryDetails(accessory) {
  const detailsDiv = document.getElementById("accessory-details");

  detailsDiv.innerHTML = `
    <div class="access_main">
      <div>
        <img src="${accessory.img}" alt="${accessory.name}" id="main_accessImg">
      </div>
      <div class="access_details">
        <h3><strong>${accessory.name}</strong></h3>
        <div class="drop_flex">
          <p><strong>Price:</strong> <span id="price">${accessory.price.Tata}</span></p>
          <div class="dropdown">
            <button class="dropdown_btn">Select Brand</button>
            <div class="dropdown_list">
              ${Object.keys(accessory.price)
                .map((brand) => `<a href="#" class="brand-option" data-brand="${brand}">${brand}</a>`)
                .join("")}
            </div>
          </div>
        </div>
        <p><strong>Description:</strong> ${accessory.description}</p>
        <p><strong>Features:</strong> ${accessory.features}</p>
        <p><strong>Guidance:</strong> ${accessory.guidance}</p>
        <p><strong>Warranty and Return:</strong> ${accessory.warranty_and_return}</p>
        
        <div class="access_btn">
          <button id="addCartButton">Add to Cart</button>
          <button id="orderButton">Order Now</button>
        </div>
      </div>
    </div>
  `;

  selectedBrandListeners(accessory);
  AddToCartListener(accessory);
  OrderNowListener(accessory);
}

// Attach brand selection listeners
// Attach brand selection listeners
function selectedBrandListeners(accessory) {
  const brandOptions = document.querySelectorAll(".brand-option");

  brandOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Deselect all options
      document.querySelectorAll(".brand-option").forEach(opt => opt.classList.remove('selected'));
      
      // Highlight the selected brand
      this.classList.add('selected');

      // Update the price for the selected brand
      const selectedBrand = this.dataset.brand;
      document.getElementById("price").textContent = accessory.price[selectedBrand];

      // Close the dropdown popup after selection
      const dropdownList = this.closest(".dropdown_list");
      dropdownList.style.display = "none";
    });
  });

  // Add event listener to the dropdown button to toggle visibility
  const dropdownButton = document.querySelector(".dropdown_btn");
  const dropdownList = document.querySelector(".dropdown_list");

  dropdownButton.addEventListener("click", function () {
    // Toggle dropdown visibility
    dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
  });

  // Close the dropdown if clicked outside
  document.addEventListener("click", function (event) {
    if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
      dropdownList.style.display = "none";
    }
  });
}


// Attach "Add to Cart" button listener
function AddToCartListener(accessory) {
  document.getElementById("addCartButton").onclick = function () {
    addToCart(accessory);
  };
}

// Attach "Order Now" button listener
function  OrderNowListener(accessory) {
  const userDetails = JSON.parse(localStorage.getItem('DriveLuxeUserDetails'));

  document.getElementById("orderButton").onclick = function () {
    const selectedBrand = document.querySelector('.brand-option.selected')?.dataset.brand;

    if (!userDetails) {
      alert("Please login");
      window.location.href = "/pages/login.html";
      return;
    }

    if (!selectedBrand) {
      alert("Please select a brand first.");
      return;
    }

    showOrderPopup(accessory, selectedBrand);
  };
}

// Function to show the order popup
function showOrderPopup(accessory, selectedBrand) {
  const popup = document.getElementById("orderPopup");
  popup.style.display = "block";

  const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails"));
  if (userDetails) {
    document.getElementById("name").value = userDetails.name || "";
    document.getElementById("email").value = userDetails.email || "";
  }

  document.getElementById("confirmOrderButton").onclick = async function () {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const quantity = document.getElementById("popupQuantity").value;

    if (!name || !phone || !address || !quantity || !email || !selectedBrand) {
      alert("Please fill in all fields and select a brand.");
      return;
    }

    const orderDetails = {
      name, phone, email, address,
      accessoryName: accessory.name,
      selectedBrand,
      accessoryImage: accessory.img,
      quantity,
      price: accessory.price[selectedBrand],
      timestamp: new Date(),
    };

    try {
      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, orderDetails);

      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(orderDetails);
      localStorage.setItem("orders", JSON.stringify(orders));

      closePopup();
      alert("Order saved successfully. Check the orders page.");
    } catch (error) {
      console.error("Error saving order:", error);
      alert("An error occurred while saving the order.");
    }
  };

  document.getElementById("closePopupButton").onclick = closePopup;
}

// Function to close the popup
function closePopup() {
  const popup = document.getElementById("orderPopup");
  popup.style.display = "none";
}

function addToCart(accessory) {
  // Check if a brand is selected
  const selectedBrand = document.querySelector('.brand-option.selected')?.dataset.brand;

  if (!selectedBrand) {
    alert("Please select a brand before adding to the cart.");
    return;
  }

  // Get existing cart items from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the item already exists in the cart
  const existingItem = cart.find(item => item.name === accessory.name && item.brand === selectedBrand);

  if (existingItem) {
    // If item exists, increase quantity
    existingItem.quantity += 1;
  } else {
    // If item doesn't exist, add it with quantity 1
    cart.push({
      name: accessory.name,
      price: accessory.price[selectedBrand], // Use the selected brand's price
      accessoryImage: accessory.img,        // Fixed typo from 'accesseryImage'
      brand: selectedBrand,                 // Store the selected brand in the cart
      quantity: 1,
    });
  }

  // Save updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${accessory.name} (${selectedBrand}) has been added to your cart!`);

  // Update the "Add to Cart" button to "Go to Cart"
  const addCartButton = document.getElementById("addCartButton");
  addCartButton.textContent = "Go to Cart";
  addCartButton.onclick = () => {
    window.location.href = "/pages/cart.html"; // Redirect to the cart page
  };
}



// Initialize the details page
fetchAccessoryDetails();
