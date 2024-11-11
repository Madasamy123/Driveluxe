




// Import necessary functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Registration functionality
document.getElementById("signup").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form from refreshing
  const userName = document.getElementById("reg-username").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-pswd").value;
  const errormsgSign=document.getElementById("errormsgSign");

  // Basic validation to ensure fields are filled
  if (!userName || !email || !password) {
    errormsgSign.textContent="Please fill out all fields.";
    return;
  }

  const nameRegex = /^[A-Z][a-z]*$/; // Ensures the first letter is capitalized, others lowercase
  if (!nameRegex.test(userName)) {
    errormsgSign.textContent = "Name should start with a capital letter, followed by lowercase letters.";
    return;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    errormsgSign.textContent = "Email must contain numbers and end with '@gmail.com'.";
    return;
  }
  if (password.length < 8) {
    errormsgSign.textContent = "Password must be at least 8 characters long.";
    return;
  }


  try {
    // Register user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      userName: userName,
      email: user.email,
      createdAt: new Date()
    });
    console.log("User data saved to Firestore");

    // Redirect to home page after successful registration
    window.location.href = "index.html";
    errormsgSign.textContent="Account created Successfully"
  } catch (error) {
    // Display Firebase error message
    if (error.code === "auth/email-already-in-use") {
      errormsgSign.textContent = "This email is already in use. Please try another one.";
    } else {
      errormsgSign.textContent = `Error during registration: ${error.message}`;
    }
    console.error("Error during registration:", error.message);
  }
});

// Login functionality
document.getElementById("login").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form from refreshing
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("login-pswd").value;
  const errormsgLogin=document.getElementById("errormsgLogin")

  // Check if fields are filled out
  if (!email || !password) {
    errormsgLogin.textContent="Please fill out all fields.";
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    errormsgLogin.textContent = "Email must contain numbers and end with '@gmail.com'.";
    return;
  }

  if (password.length < 8) {
    errormsgLogin.textContent = "Password must be at least 8 characters long.";
    return;
  }

  try {
    // Sign in user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Logged in as:", user.email);

    // Redirect to home page after successful login
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      errormsgLogin.textContent = "Email not found. Please check your email or sign up.";
    }  else {
      errormsgLogin.textContent = `Login error: ${error.message}`;
    }

    console.error("Error during login:", error.message);
  }
});




















// // //Logout functionality
// // document.getElementById("logout").addEventListener("click", (e) => {
// //   e.preventDefault(); // Prevent any default actions
// //   signOut(auth).then(() => {
// //     console.log("Sign-out successful.");
// //     alert("Sign-out successful.");
// //     document.getElementById("logout") // Hide logout button
// //   }).catch((error) => {
// //     console.error("An error occurred during sign-out: ", error);
// //   });
// // });







