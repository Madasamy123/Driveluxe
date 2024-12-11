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
    <div>
      <img src="${accessory.img}" alt="${accessory.name}">
      <h3>${accessory.name}</h3>
      <p>${accessory.description}</p>
      <p>Price: $${accessory.price}</p>
    </div>
  `;
}

// Initialize the details page
fetchAccessoryDetails();
