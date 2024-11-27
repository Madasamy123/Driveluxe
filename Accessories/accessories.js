
    // Import necessary functions from Firebase SDK
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
    import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
    
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

    // Load JSON and upload data
    async function loadJsonData() {
      const response = await fetch('./accessories.json'); // Ensure 'sample.json' is accessible in the same directory
      const data = await response.json();
      await uploadToFirestore(data);
    }

    // Upload each item to Firestore
    async function uploadToFirestore(data) {
      const collectionRef = collection(db, 'accessories');
      for (const item of data) {
        try {
          await addDoc(collectionRef, item);
          console.log('Document added:', item);
        } catch (error) {
          console.error('Error adding document:', error);
        }
      }
    }

    // Call the loadJsonData function to start the upload
    loadJsonData();
  