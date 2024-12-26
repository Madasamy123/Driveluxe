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
                .map(
                  (brand) =>
                    `<a href="#" class="brand-option" data-brand="${brand}">${brand}</a>`
                )
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

  // Add event listeners to update price on brand selection
  const brandOptions = document.querySelectorAll(".brand-option");
  brandOptions.forEach((option) => {
    option.addEventListener("click", function (e) {
      e.preventDefault();
      const selectedBrand = this.dataset.brand;
      // Mark the brand as selected
      document.querySelectorAll(".brand-option").forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected'); // Add selected class
      document.getElementById("price").textContent = accessory.price[selectedBrand];
    });
  });

  // Event listener for "Add to Cart" button
  document.getElementById("addCartButton").onclick = function () {
    addToCart(accessory); // Pass the accessory object when clicking "Add to Cart"
  };

  // Event listener for "Order Now" button
  document.getElementById("orderButton").onclick = function () {
    const selectedBrand = document.querySelector('.brand-option.selected')?.dataset.brand;
    if (!selectedBrand) {
      alert("Please select a brand first.");
      return;
    }
    showOrderPopup(accessory, selectedBrand); // Pass selected brand to the popup
  };
}


// Function to show the order popup
function showOrderPopup(accessory, selectedBrand) {
  const popup = document.getElementById("orderPopup");
  popup.style.display = "block"; // Show the popup

  // Preselect the brand in the popup if passed
  document.querySelectorAll(".brand-option").forEach(option => {
    if (option.dataset.brand === selectedBrand) {
      option.classList.add("selected"); // Mark the brand as selected in the popup
    }
  });

  // Add event listener for confirm order button
  document.getElementById("confirmOrderButton").onclick = async function () {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const quantity = document.getElementById("popupQuantity").value;

    // Check if all fields are filled and brand is selected
    if (!name || !phone || !address || !quantity || !email || !selectedBrand) {
      alert("Please fill in all fields and select a brand.");
      return;
    }

    // Create the order object and save it to Firestore
    const orderDetails = {
      name: name,
      phone: phone,
      email: email,
      address: address,
      accessoryName: accessory.name,
      selectedBrand: selectedBrand, // Include selected brand in the order
      quantity: quantity,
      timestamp: new Date(), // Add timestamp for the order
    };

    try {
      // Save the order details to Firestore
      const ordersCollection = collection(db, "orders");
      await addDoc(ordersCollection, orderDetails);

      // Clear the popup fields after saving the order details
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("email").value = "";
      document.getElementById("address").value = "";
      document.getElementById("popupQuantity").value = 1; // Reset quantity to 1

      // Close the popup after saving
      closePopup();
      alert("Order saved successfully to Firestore!");
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      alert("An error occurred while saving the order. Please try again.");
    }
  };

  // Add event listener for close button
  document.getElementById("closePopupButton").onclick = function () {
    closePopup();
  };
}

// Function to close the popup
function closePopup() {
  const popup = document.getElementById("orderPopup");
  popup.style.display = "none"; // Hide the popup
}

// Initialize the details page
fetchAccessoryDetails();


// Function to add item to the cart
// Function to add item to the cart
function addToCart(accessory) {
  // Get existing cart items from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the item already exists in the cart
  const existingItem = cart.find((item) => item.name === accessory.name);

  if (existingItem) {
    // If item exists, increase quantity
    existingItem.quantity += 1;
  } else {
    // If item doesn't exist, add it with quantity 1
    cart.push({
      name: accessory.name,
      price: accessory.price.Tata, // Default brand price
      img: accessory.img,
      quantity: 1,
    });
  }

  // Save updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the "Add to Cart" button to "Go to Cart"
  const addCartButton = document.getElementById("addCartButton");
  addCartButton.textContent = "Go to Cart";

  // Change button action to redirect to the cart page
  addCartButton.onclick = function () {
    window.location.href = "/pages/cart.html"; // Redirect to cart page
  };

  alert(`${accessory.name} has been added to your cart!`);
}
