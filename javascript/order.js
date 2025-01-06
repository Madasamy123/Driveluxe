import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Encoded Firebase Config
const encodedConfig = {
  apiKey: "QUl6YVN5QzB0dzRfQ0ZsODRrYjVpNGRldUJrS2YwZ0E3Z1MzZUY0",
  authDomain: "bG9naW4tcGFnZTEyMzQuZmlyZWJhcHAuY29t",
  projectId: "login-page1234",
  storageBucket: "bG9naW4tcGFnZTEyMzQuYXBwc3BvdC5jb20=",
  messagingSenderId: "471482088238",
  appId: "MToxNzE0ODIwODgyMzh3ZWIzZGI4YTE4NTE4NWU1NGUxMThiZg==",
};

// Decode Function
function decodeBase64(encodedString) {
  return atob(encodedString);
}

// Firebase Config
const firebaseConfig = {
  apiKey: decodeBase64(encodedConfig.apiKey),
  authDomain: decodeBase64(encodedConfig.authDomain),
  projectId: encodedConfig.projectId,
  storageBucket: decodeBase64(encodedConfig.storageBucket),
  messagingSenderId: encodedConfig.messagingSenderId,
  appId: decodeBase64(encodedConfig.appId),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch User Details from Local Storage
const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails"));

if (userDetails) {
  const userEmail = userDetails.email; // User's email
  const ordersListDiv = document.getElementById("ordersList");
  const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');

  async function fetchAndDisplayOrders(orderType = "cars") {
    ordersListDiv.innerHTML = "<p>Loading orders...</p>";

    try {
      let ordersHTML = "";

      if (orderType === "cars") {
        // Query the "customerbook" (cars) collection
        const carQuery = query(collection(db, "customerbook"), where("email", "==", userEmail));
        const carSnapshot = await getDocs(carQuery);

        console.log("Car orders fetched:", carSnapshot.docs);

        // Add Car Orders
        carSnapshot.forEach((doc) => {
          const carData = doc.data();
          console.log("Car Data:", carData);
          ordersHTML += `
            <div class="order-item">
              <h3>Car Booking</h3>
              <img src="${carData.carImage || 'default-car-image.jpg'}" alt="Car Image" style="width:200px;height:auto;"/>
              <p><strong>Car:</strong> ${carData.carName || "N/A"}</p>
               <p><strong>Car Price:</strong> ${carData.carPrice || "N/A"}</p>
              <p><strong>Booking Date:</strong> ${carData.timestamp 
                ? new Date(carData.timestamp.seconds * 1000).toLocaleDateString() 
                : "N/A"}</p>
            </div>
          `;
        });
      } else if (orderType === "accessories") {
        // Query the "orders" (accessories) collection
        const accessoriesQuery = query(collection(db, "orders"), where("email", "==", userEmail));
        const accessoriesSnapshot = await getDocs(accessoriesQuery);

        console.log("Accessory orders fetched:", accessoriesSnapshot.docs);

        // Add Accessories Orders
        accessoriesSnapshot.forEach((doc) => {
          const accessoryData = doc.data();
          console.log("Accessory Data:", accessoryData);
          ordersHTML += `
            <div class="order-item">
              <h3>Accessory Order</h3>
               <img src="${accessoryData.accessoryImage || 'default-car-image.jpg'}" alt="Car Image" style="width:200px;height:auto;"/>
              <p><strong>Accessory:</strong> ${accessoryData.accessoryName || "N/A"}</p>
              <p><strong>Brand:</strong> ${accessoryData.selectedBrand || "N/A"}</p>
              <p><strong>Quantity:</strong> ${accessoryData.quantity || 1}</p>
              
              <p><strong>Order Date:</strong> ${accessoryData.timestamp 
                ? new Date(accessoryData.timestamp.seconds * 1000).toLocaleDateString() 
                : "N/A"}</p>
            </div>
          `;
        });
      }

      // Display Orders or a No Orders Message
      ordersListDiv.innerHTML = ordersHTML || `<p>No ${orderType === "cars" ? "car bookings" : "accessories orders"} found.</p>`;
    } catch (error) {
      console.error("Error fetching orders:", error);
      ordersListDiv.innerHTML = "<p>Error loading orders. Please try again later.</p>";
    }
  }

  // Event Listener for Radio Buttons
  orderTypeRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      fetchAndDisplayOrders(event.target.value);
    });
  });

  // Initial Fetch for Default Order Type
  fetchAndDisplayOrders();
} else {
  alert("Please log in to view your orders.");
  window.location.href = "/pages/login.html"; // Redirect to login if not logged in
}
