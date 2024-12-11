




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
  const errormsgSign = document.getElementById("errormsgSign");
  const errorusername = document.getElementById("errorusername");
  const erroremail = document.getElementById("erroremail");
  const errorpassword = document.getElementById("errorpassword");

  // Clear previous error messages
  errormsgSign.textContent = '';
  errorusername.textContent = '';
  erroremail.textContent = '';
  errorpassword.textContent = '';


  // Basic validation to ensure fields are filled
  if (!userName || !email || !password) {
    errormsgSign.textContent = "Please fill out all fields.";
    return;
  }

  const nameRegex = /^[A-Z][a-z]{0,29}$/; // Ensures the first letter is capitalized, others lowercase
  if (!nameRegex.test(userName)) {
    errorusername.textContent = "Name should start capital letter, followed by lowercase";
    return;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    erroremail.textContent = "Email must end with '@gmail.com'.";
    return;
  }


  // Password validation: At least 8 characters, with letters, numbers, and special characters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    errorpassword.textContent = "Password must be at least 8 characters";
    return;
  }

  // if (password.length < 8) {
  //   errormsgSign.textContent = "Password must be at least 8 characters long.";
  //   return;
  // }


  try {
    // Register user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created:", user);

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      userName:userName,
      email: user.email,
      createdAt: new Date()
    });
    console.log("User data saved to Firestore");
    const signInUser = { userName: userName, email: email }
    localStorage.setItem('DriveLuxeUserDetails', JSON.stringify(signInUser));

    // Redirect to home page after successful registration
    window.location.href = "index.html";
    errormsgSign.textContent = "Account created Successfully"
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



// show password sign up

document.addEventListener("DOMContentLoaded", () => {
  const eyeIcon = document.getElementById("showpswd");
  const passwordInput = document.getElementById("reg-pswd");
  eyeIcon.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash")
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  });
});


//show password login 



document.addEventListener("DOMContentLoaded", () => {
  const eyeIcon = document.getElementById("showpswdlogin");
  const passwordInput = document.getElementById("login-pswd");
  eyeIcon.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash")
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  });
});

















// Login functionality
document.getElementById("login").addEventListener("click", async (e) => {
  e.preventDefault(); // Prevent form from refreshing
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("login-pswd").value;
  const errormsgLogin = document.getElementById("errormsgLogin")

  // Check if fields are filled out
  if (!email || !password) {
    errormsgLogin.textContent = "Please fill out all fields.";
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
    console.log("Logged in as userCredential :", userCredential);
    const user = userCredential.user;
    console.log("Logged in as user :", user);
    const signInUser = {email: user.email }
    localStorage.setItem('DriveLuxeUserDetails', JSON.stringify(signInUser));
    // Redirect to home page after successful login
    window.location.href = "index.html";
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      errormsgLogin.textContent = "Email not found. Please check your email or sign up.";
    } else {
      errormsgLogin.textContent = `Login error: ${error.message}`;
    }

    console.error("Error during login:", error.message);
  }
});
