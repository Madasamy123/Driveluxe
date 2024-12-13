// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

  console.log("Access ID:", accessId); // Debugging log

  try {
    const docRef = doc(db, "accessories", accessId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document Data:", docSnap.data()); // Debugging log
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
    <img src="${accessory.img}" alt="${accessory.name}">
    </div>
    <div class="access_details">
     <h3><strong>${accessory.name }</strong> </h3>

       <div class="drop_flex">
      <p><strong>Price:</strong> ${accessory.price }</p>
      <div class="dropdown">
      <button class="dropdown_btn">Dropdown</button>
      <div class="dropdown_list">
       <a href="#">Tata</a>
       <a href="#">Mahindra</a>
       <a href="#">Suzuki</a>
       <a href="#">Renault</a>
       <a href="#">Honda</a>
       <a href="#">Audi</a>
       <a href="#">Toyota</a>
      </div>

      
      </div>
      </div>
      <p><strong>description: </strong>${accessory.description}</p>
      <p><strong>features:</strong>${accessory.features}</p>
      <p><strong>guidance:</strong>${accessory.guidance}</p>
      <p><strong>warranty_and_return:</strong>${accessory.warranty_and_return}</p>
      <label for="">Quantity: </label>
    <input type="number">
    <div class="access_btn">
      <button>Add Cart</button>
      <button>Order Now</button>
     
    </div>

    </div>
    </div>
  `;
}

// Initialize the details page
fetchAccessoryDetails();
