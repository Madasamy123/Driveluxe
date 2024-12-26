// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0tw4_CFl84kb5i4DeuBkKf0gA7gS3mF4",
  authDomain: "login-page1234.firebaseapp.com",
  projectId: "login-page1234",
  storageBucket: "login-page1234.appspot.com",
  messagingSenderId: "471482088238",
  appId: "1:471482088238:web:eb3db8a185185e54e118bf",
  measurementId: "G-VH45MSSNTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileAddress = document.getElementById("profileAddress");
const profilePhone = document.getElementById("profilePhone");
const saveChangesButton = document.getElementById("saveChanges");
const logoutButton = document.getElementById("logout");

// Fetch and display user data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userId = user.uid;

    try {
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        profileName.textContent = userData.userName || "Unknown";
        profileEmail.textContent = userData.email || "Unknown";
        profileAddress.value = userData.address || "";
        profilePhone.value = userData.phone || "";
      } else {
        console.error("No user data found in Firestore!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    // Redirect to login page if not logged in
    window.location.href = "./login.html";
  }
});

// Save updated address and phone number
saveChangesButton.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const updatedAddress = profileAddress.value;
    const updatedPhone = profilePhone.value;

    try {
      // Update Firestore document
      await updateDoc(doc(db, "users", userId), {
        address: updatedAddress,
        phone: updatedPhone
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }
});

// Logout functionality
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "./login.html"; // Redirect to login page
  } catch (error) {
    console.error("Error during logout:", error);
  }
});
