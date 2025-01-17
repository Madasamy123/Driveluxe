// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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


// Upload each item to Firestore
async function uploadToFirestore(data) {
  try {
    const collectionRef = collection(db, 'accessories');
    for (const item of data) {
      await addDoc(collectionRef, item);
      console.log('Document added:', item);
    }
  } catch (error) {
    console.error('Error adding document:', error);
  }
}

// Load JSON and upload data to Firestore
async function loadJsonData() {
  try {
    const response = await fetch('/json/accessories.json'); // Ensure JSON file is in the same folder
    const data = await response.json();

    // Flatten nested JSON structure
    const flattenedData = Object.values(data[0]); // Convert nested objects to array
    // console.log("Flattened JSON Data Loaded:", flattenedData);

    // Check if data already exists in Firestore
    const accessoriesQuery = query(collection(db, 'accessories'));
    const querySnapshot = await getDocs(accessoriesQuery);

    // Only upload data if Firestore is empty
    if (querySnapshot.empty) {
      await uploadToFirestore(flattenedData);
    }
  } catch (error) {
    console.error("Error loading JSON data:", error);
  }
}



// Fetch accessories from Firestore and display them
async function displayUsers() {
  try {
    const usersDiv = document.getElementById("access");
    const querySnapshot = await getDocs(collection(db, "accessories"));
    console.log("Fetched documents count:", querySnapshot.size);

    querySnapshot.forEach((doc) => {
      const access = doc.data();
      const accessId = doc.id;

      // Create HTML elements for each accessory
      const userElement = document.createElement("div");
      userElement.classList.add("accessCss");
      userElement.id = `accessory_${accessId}`; // Unique ID for the accessory
      userElement.innerHTML = `
        <div class="showaccessories">
          <img src="${access.img}" id="below_accessImg" alt="${access.name}" onclick="highlightAndRedirect('${accessId}')" />
          <p>${access.name}</p>
        </div>
      `;
      usersDiv.appendChild(userElement);
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

// Function to highlight the clicked accessory and redirect to details page
window.highlightAndRedirect = function(accessId) {
  // Remove highlight from all accessories
  document.querySelectorAll(".accessCss").forEach(item => item.classList.remove("highlight"));

  // Highlight the clicked accessory
  const clickedItem = document.getElementById(`accessory_${accessId}`);
  clickedItem.classList.add("highlight");

  // Redirect to details page after highlighting
  setTimeout(() => {
    window.location.href = `/pages/accessory-details.html?accessId=${accessId}`;
  }, 300); // Slight delay to show the highlight before redirecting
}

// Initialize page by displaying all accessories
displayUsers();  



