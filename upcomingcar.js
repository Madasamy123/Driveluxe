




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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

// Function to upload JSON data to Firestore only if it doesn't already exist
async function loadJsonData() {
  try {
    const response = await fetch('./upcomingcar.json'); // Ensure the file path is correct
    if (!response.ok) throw new Error('Failed to load JSON file');
    const data = await response.json();

    // Upload only if the car doesn't already exist
    await uploadToFirestore(data);
  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

//Function to upload each item to Firestore only if it doesn't already exist
async function uploadToFirestore(data) {
  const collectionRef = collection(db, 'upcoming_cars');
  for (const item of data) {
    try {
      // Check if the car already exists in the database
      const q = query(collectionRef, where("car_name", "==", item.car_name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collectionRef, item);
        console.log('Document added:', item);
      } else {
        console.log('Duplicate found, skipping:', item.car_name);
      }
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }
}



let carIndexValue = 0;

window.updateCarIndex = function (count) {
  const totalCars = 5;
  carIndexValue = (carIndexValue + count + totalCars) % totalCars;
  displayCarDetails();
};


// Function to fetch all documents from Firestore and display car details
async function displayCarDetails() {

  try {
    const querySnapshot = await getDocs(collection(db, "upcoming_cars"));
    const container = document.getElementById("upcoming_car");

    container.innerHTML = ""; // Clear existing content to prevent duplicates
    querySnapshot.forEach((doc) => {
      const car = doc.data();


      if (car.index === carIndexValue) {
        const carDiv = document.createElement("div");
        carDiv.classList.add("upcome_car");
        carDiv.innerHTML = `

       <h3>${car.car_name}</h3>
        <img src="${car.img}" alt="${car.car_name}" >
        <div id="upcoming_text">
        <div id="upcoming_text1">
        <p>Type: ${car.type}</p>
        <p>Price: ${car.price}</p>
         </div>
         <div id="upcoming_text2">
         <p>Launch Date: ${car["launch date"]}</p>
         </div>
        </div>
      `;
        container.appendChild(carDiv);
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

// Load data and display cars after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadJsonData().then(() => {
    console.log("Data uploaded successfully");
    displayCarDetails();
  });
});


